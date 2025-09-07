from rest_framework import serializers
from .models import Quiz, QuizItem

class QuizItemSerializer(serializers.ModelSerializer):
    # Transform data to match frontend expectations
    question = serializers.CharField(source='prompt')
    answer = serializers.SerializerMethodField()
    
    class Meta:
        model = QuizItem
        fields = ['id', 'question', 'options', 'answer', 'explanation', 'difficulty', 'kind', 'user_answer', 'is_correct']
    
    def get_answer(self, obj):
        """Return the correct answer index for MCQ questions"""
        if obj.kind == 'mcq' and obj.options:
            # Find the index of the correct answer in options
            try:
                return obj.options.index(obj.correct_answer)
            except (ValueError, TypeError):
                return 0
        return obj.correct_answer

class QuizSerializer(serializers.ModelSerializer):
    items = QuizItemSerializer(many=True, read_only=True)
    quiz = serializers.SerializerMethodField()
    total_questions = serializers.SerializerMethodField()
    completed_questions = serializers.SerializerMethodField()
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'document', 'attempted', 'attempted_date', 'score', 'duration', 
                 'created_at', 'updated_at', 'items', 'quiz', 'total_questions', 'completed_questions']
    
    def get_quiz(self, obj):
        """Transform items to match frontend quiz format"""
        return [
            {
                'id': item.id,
                'question': item.prompt,
                'options': item.options or [],
                'answer': self._get_correct_answer_index(item),
                'explanation': item.explanation,
                'difficulty': item.difficulty,
                'kind': item.kind
            }
            for item in obj.items.all()
        ]
    
    def get_total_questions(self, obj):
        return obj.items.count()
    
    def get_completed_questions(self, obj):
        return obj.items.filter(user_answer__isnull=False).exclude(user_answer='').count()
    
    def _get_correct_answer_index(self, item):
        """Get the correct answer index for MCQ questions"""
        if item.kind == 'mcq' and item.options:
            try:
                return item.options.index(item.correct_answer)
            except (ValueError, TypeError):
                return 0
        return item.correct_answer
