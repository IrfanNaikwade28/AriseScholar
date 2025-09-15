from django.db import models
from django.conf import settings

class Document(models.Model):
    PDF = 'pdf'
    DOCX = 'docx'
    TXT = 'txt'
    DOC_TYPES = [
        (PDF, 'PDF'),
        (DOCX, 'DOCX'),
        (TXT, 'TXT'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=255, blank=True)
    type = models.CharField(max_length=10, choices=DOC_TYPES, blank=True)
    original_name = models.CharField(max_length=255, blank=True)
    file = models.FileField(upload_to='documents/')
    text = models.TextField(blank=True)
    flashcard_status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Flashcard(models.Model):
    EASY = 'easy'
    MEDIUM = 'medium'
    HARD = 'hard'
    DIFFICULTY_LEVELS = [
        (EASY, 'Easy'),
        (MEDIUM, 'Medium'),
        (HARD, 'Hard'),
    ]

    NONE = 'none'
    YES = 'yes'
    NO = 'no'
    STATUS_CHOICES = [
        (NONE, 'None'),
        (YES, 'Yes'),
        (NO, 'No'),
    ]

    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='flashcards')
    question = models.TextField()
    answer = models.TextField()
    tags = models.JSONField(default=list)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_LEVELS)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=NONE)

    def __str__(self):
        return self.question
