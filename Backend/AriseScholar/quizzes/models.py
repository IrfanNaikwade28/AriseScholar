# quizzes/models.py
from django.db import models
from django.conf import settings
from flashcards.models import Document

class Quiz(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='quizzes')
    title = models.CharField(max_length=255)
    attempted = models.BooleanField(default=False)
    attempted_date = models.DateTimeField(null=True, blank=True)
    score = models.IntegerField(default=0)
    duration = models.IntegerField(default=0)  # in seconds
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class QuizItem(models.Model):
    QUIZ_KIND_CHOICES = [
        ('mcq', 'Multiple Choice'),
        ('true_false', 'True or False'),
        ('fill_blank', 'Fill in the Blank'),
    ]
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='items')
    kind = models.CharField(max_length=20, choices=QUIZ_KIND_CHOICES)
    prompt = models.TextField()
    options = models.JSONField(null=True, blank=True)
    correct_answer = models.TextField()
    explanation = models.TextField(blank=True)
    tags = models.JSONField()
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    user_answer = models.TextField(blank=True)
    is_correct = models.BooleanField(default=False)
