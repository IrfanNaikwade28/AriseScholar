# dashboard/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg
from flashcards.models import Document, Flashcard
from quizzes.models import Quiz, QuizItem
from .serializers import DashboardStatsSerializer

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        documents = Document.objects.filter(owner=user)
        flashcards = Flashcard.objects.filter(document__owner=user)  # Corrected here
        quizzes = Quiz.objects.filter(owner=user)

        totalDoc = documents.count()
        totalFlashcard = flashcards.count()
        totalQuiz = quizzes.count()

        documentGenerated = documents.filter(flashcard_status=True).count()
        documentWaiting = totalDoc - documentGenerated

        all_quiz_items = QuizItem.objects.filter(quiz__in=quizzes)

        easyQuiz = all_quiz_items.filter(difficulty='easy').count()
        mediumQuiz = all_quiz_items.filter(difficulty='medium').count()
        hardQuiz = all_quiz_items.filter(difficulty='hard').count()
        totalQues = all_quiz_items.count()

        totalAttemptedQuiz = quizzes.filter(attempted=True).count()
        avgDuration = quizzes.filter(attempted=True).aggregate(Avg('duration'))['duration__avg'] or 0
        percentAvgDuration = (avgDuration / 600) * 100

        avgScore = quizzes.filter(attempted=True).aggregate(Avg('score'))['score__avg'] or 0
        percentAvgScore = avgScore

        # Aggregate tags
        tags_list = []
        for fc in flashcards:
            tags_list.extend(fc.tags)
        totalFlashcardTags = len(set(tags_list))
        tag_counts = {}
        for tag in tags_list:
            tag_counts[tag] = tag_counts.get(tag, 0) + 1
        flashCardsTags = sorted([{'label': k, 'value': v} for k, v in tag_counts.items()], key=lambda x: -x['value'])[:6]

        recent_quizzes = quizzes.order_by('-created_at')[:4]
        quizList = []
        for quiz in recent_quizzes:
            correct_answers = quiz.items.filter(is_correct=True).count()
            quizList.append({
                '_id': quiz.id,
                'title': quiz.title,
                'totalQues': quiz.items.count(),
                'correctAnswer': correct_answers,
            })

        data = {
            'totalDoc': totalDoc,
            'totalFlashcard': totalFlashcard,
            'totalQuiz': totalQuiz,
            'quizList': quizList,
            'documentGenerated': documentGenerated,
            'documentWaiting': documentWaiting,
            'easyQuiz': easyQuiz,
            'mediumQuiz': mediumQuiz,
            'hardQuiz': hardQuiz,
            'totalQues': totalQues,
            'avgDuration': round(avgDuration, 2),
            'percentAvgDuration': round(percentAvgDuration, 2),
            'avgScore': round(avgScore, 2),
            'percentAvgScore': round(percentAvgScore, 2),
            'totalFlashcardTags': totalFlashcardTags,
            'flashCardsTags': flashCardsTags,
        }

        serializer = DashboardStatsSerializer(data)
        return Response(serializer.data)
