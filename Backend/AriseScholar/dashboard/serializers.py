# dashboard/serializers.py
from rest_framework import serializers

class DashboardStatsSerializer(serializers.Serializer):
    totalDoc = serializers.IntegerField()
    totalFlashcard = serializers.IntegerField()
    totalQuiz = serializers.IntegerField()
    quizList = serializers.ListField()
    documentGenerated = serializers.IntegerField()
    documentWaiting = serializers.IntegerField()
    easyQuiz = serializers.IntegerField()
    mediumQuiz = serializers.IntegerField()
    hardQuiz = serializers.IntegerField()
    totalQues = serializers.IntegerField()
    avgDuration = serializers.FloatField()
    percentAvgDuration = serializers.FloatField()
    avgScore = serializers.FloatField()
    percentAvgScore = serializers.FloatField()
    totalFlashcardTags = serializers.IntegerField()
    flashCardsTags = serializers.ListField()
