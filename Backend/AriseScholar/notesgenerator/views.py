from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import UploadedFile, Question
from .serializers import UploadedFileSerializer, QuestionSerializer
from .utils import extract_text_from_pdf, generate_questions_from_text, generate_answers_for_questions

class UploadFileView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = UploadedFile.objects.create(user=request.user, file=file_obj)
        file_path = uploaded_file.file.path
        content = extract_text_from_pdf(file_path)
        questions_with_marks = generate_questions_from_text(content)

        for text, marks in questions_with_marks:
            q, created = Question.objects.get_or_create(text=text)
            q.frequency += 1
            q.marks = max(q.marks, marks)
            q.save()

        return Response({"message": "File processed and questions generated", "questions_count": len(questions_with_marks)}, status=status.HTTP_201_CREATED)

class GenerateNotesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        # Get the latest uploaded file
        latest_file = UploadedFile.objects.filter(user=request.user).order_by('-uploaded_at').first()
        
        if not latest_file:
            return Response({"error": "No files uploaded yet"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract text from the latest file
        file_path = latest_file.file.path
        content = extract_text_from_pdf(file_path)
        
        # Generate 7 questions directly from the text
        questions_with_marks = generate_questions_from_text(content)
        
        if not questions_with_marks:
            return Response({"error": "Failed to generate questions from file content"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Generate answers for the questions
        answers = generate_answers_for_questions(questions_with_marks)
        
        return Response(answers, status=status.HTTP_200_OK)
