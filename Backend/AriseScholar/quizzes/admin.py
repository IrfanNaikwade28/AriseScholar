from django.contrib import admin
from .models import Quiz, QuizItem

class QuizItemInline(admin.TabularInline):
    model = QuizItem
    extra = 0
    readonly_fields = ('user_answer', 'is_correct')
    fields = ('kind', 'prompt', 'options', 'correct_answer', 'user_answer', 'is_correct', 'difficulty', 'tags')

class QuizAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'owner', 'document', 'attempted', 'score', 'duration', 'created_at')
    search_fields = ('title', 'owner__username', 'document__title')
    list_filter = ('attempted', 'created_at')
    readonly_fields = ('attempted_date', 'created_at', 'updated_at')
    inlines = [QuizItemInline]

admin.site.register(Quiz, QuizAdmin)
