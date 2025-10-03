from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db import transaction
from .models import Quiz, QuizItem
from .serializers import QuizSerializer
from flashcards.models import Document
from .utils import generate_quiz_questions_from_text
import logging

logger = logging.getLogger(__name__)

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Quiz.objects.filter(owner=self.request.user)

    @action(detail=False, methods=['POST'])
    def generate(self, request):
        """Generate a new quiz from a document"""
        document_id = request.data.get('document_id')
        count = int(request.data.get('count', 10))

        if not document_id:
            return Response({"detail": "Document ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            document = Document.objects.get(id=document_id, owner=request.user)
        except Document.DoesNotExist:
            return Response({"detail": "Document not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            # Generate quiz questions using AI utility function
            quiz_items_data = generate_quiz_questions_from_text(document.text, count)

            with transaction.atomic():
                quiz = Quiz.objects.create(
                    owner=request.user,
                    document=document,
                    title=f"Quiz: {document.title}"
                )

                for item in quiz_items_data:
                    # For MCQ questions, store the actual answer text, not the index
                    correct_answer = item['correctAnswer']
                    if item['kind'] == 'mcq' and item.get('options'):
                        try:
                            correct_answer = item['options'][int(correct_answer)]
                        except (ValueError, IndexError, TypeError):
                            correct_answer = item['options'][0] if item['options'] else ''
                    
                    QuizItem.objects.create(
                        quiz=quiz,
                        kind=item['kind'],
                        prompt=item['prompt'],
                        options=item.get('options', []),
                        correct_answer=correct_answer,
                        explanation=item.get('explanation', ''),
                        tags=item.get('tags', []),
                        difficulty=item['difficulty']
                    )

            serializer = QuizSerializer(quiz)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except ValueError as e:
            logger.error(f"Quiz generation failed: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error in quiz generation: {str(e)}")
            return Response({"detail": "Failed to generate quiz"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['POST'])
    def start(self, request, pk=None):
        """Start a quiz attempt"""
        try:
            quiz = self.get_object()
            if quiz.attempted:
                return Response({"detail": "Quiz already attempted"}, status=status.HTTP_400_BAD_REQUEST)
            
            quiz.attempted = True
            quiz.attempted_date = timezone.now()
            quiz.save()
            
            serializer = QuizSerializer(quiz)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Quiz.DoesNotExist:
            return Response({"detail": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['POST'])
    def submit_answer(self, request, pk=None):
        """Submit an answer for a specific quiz item"""
        try:
            quiz = self.get_object()
            item_id = request.data.get('item_id')
            user_answer = request.data.get('answer')
            
            if not item_id or user_answer is None:
                return Response({"detail": "Item ID and answer are required"}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                quiz_item = quiz.items.get(id=item_id)
            except QuizItem.DoesNotExist:
                return Response({"detail": "Quiz item not found"}, status=status.HTTP_404_NOT_FOUND)
            
            # Check if answer is correct
            is_correct = False
            if quiz_item.kind == 'mcq':
                # For MCQ, check if the selected index corresponds to the correct answer text
                try:
                    selected_index = int(user_answer)
                    if quiz_item.options and 0 <= selected_index < len(quiz_item.options):
                        selected_answer = quiz_item.options[selected_index]
                        is_correct = selected_answer == quiz_item.correct_answer
                except (ValueError, TypeError, IndexError):
                    is_correct = False
            else:
                # For other question types, compare directly
                is_correct = str(user_answer).strip().lower() == str(quiz_item.correct_answer).strip().lower()
            
            # Update the quiz item
            quiz_item.user_answer = str(user_answer)
            quiz_item.is_correct = is_correct
            quiz_item.save()
            
            return Response({
                "is_correct": is_correct,
                "correct_answer": quiz_item.correct_answer,
                "explanation": quiz_item.explanation
            }, status=status.HTTP_200_OK)
            
        except Quiz.DoesNotExist:
            return Response({"detail": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['POST'])
    def submit_quiz(self, request, pk=None):
        """Submit the entire quiz and calculate final score"""
        try:
            quiz = self.get_object()
            duration = request.data.get('duration', 0)  # Duration in seconds
            
            # Calculate score
            total_items = quiz.items.count()
            correct_items = quiz.items.filter(is_correct=True).count()
            score = int((correct_items / total_items * 100)) if total_items > 0 else 0
            
            # Update quiz
            quiz.score = score
            quiz.duration = duration
            quiz.save()
            
            # Get detailed results
            results = []
            for item in quiz.items.all():
                results.append({
                    'id': item.id,
                    'question': item.prompt,
                    'user_answer': item.user_answer,
                    'correct_answer': item.correct_answer,
                    'is_correct': item.is_correct,
                    'explanation': item.explanation
                })
            
            return Response({
                'quiz_id': quiz.id,
                'score': score,
                'total_questions': total_items,
                'correct_answers': correct_items,
                'duration': duration,
                'results': results
            }, status=status.HTTP_200_OK)
            
        except Quiz.DoesNotExist:
            return Response({"detail": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['GET'])
    def results(self, request, pk=None):
        """Get detailed quiz results"""
        try:
            quiz = self.get_object()
            
            if not quiz.attempted:
                return Response({"detail": "Quiz not attempted yet"}, status=status.HTTP_400_BAD_REQUEST)
            
            results = []
            for item in quiz.items.all():
                results.append({
                    'id': item.id,
                    'question': item.prompt,
                    'options': item.options,
                    'user_answer': item.user_answer,
                    'correct_answer': item.correct_answer,
                    'is_correct': item.is_correct,
                    'explanation': item.explanation,
                    'difficulty': item.difficulty
                })
            
            return Response({
                'quiz_id': quiz.id,
                'title': quiz.title,
                'score': quiz.score,
                'total_questions': quiz.items.count(),
                'correct_answers': quiz.items.filter(is_correct=True).count(),
                'duration': quiz.duration,
                'attempted_date': quiz.attempted_date,
                'results': results
            }, status=status.HTTP_200_OK)
            
        except Quiz.DoesNotExist:
            return Response({"detail": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['POST'])
    def reset(self, request, pk=None):
        """Reset a quiz to allow re-attempt"""
        try:
            quiz = self.get_object()
            
            # Reset quiz state
            quiz.attempted = False
            quiz.attempted_date = None
            quiz.score = 0
            quiz.duration = 0
            quiz.save()
            
            # Reset all quiz items
            quiz.items.update(user_answer='', is_correct=False)
            
            serializer = QuizSerializer(quiz)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Quiz.DoesNotExist:
            return Response({"detail": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)
