from django.db import models
from django.conf import settings

class UploadedFile(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    file = models.FileField(upload_to='pyq_files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class Question(models.Model):
    text = models.TextField()
    frequency = models.IntegerField(default=0)
    marks = models.IntegerField(default=0)

    def __str__(self):
        return self.text[:50]
