# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    
    STUDY_GOAL_CHOICES = [
        ('Exam Prep', 'Exam Prep'),
        ('Daily Revision', 'Daily Revision'),
        ('Quick Revision', 'Quick Revision'),
    ]
    study_goal = models.CharField(max_length=20, choices=STUDY_GOAL_CHOICES)
    
    # Additional fields
    xp = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    streak = models.IntegerField(default=0)

    # Remove first_name and last_name by clearing REQUIRED_FIELDS
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # only username is required apart from email

    def __str__(self):
        return self.email
