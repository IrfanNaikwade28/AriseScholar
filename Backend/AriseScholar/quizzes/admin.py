from django.contrib import admin
from .models import Quiz, QuizItem

class QuizItemInline(admin.TabularInline):
    model = QuizItem
    extra = 1

class QuizAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'owner', 'score', 'attempted')
    inlines = [QuizItemInline]

class QuizItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'quiz', 'kind', 'prompt', 'difficulty', 'is_correct', 'formatted_options', 'correct_answer')
    readonly_fields = ('formatted_options', 'correct_answer')
    search_fields = ('prompt',)
    list_filter = ('kind', 'difficulty')

    def formatted_options(self, obj):
        return ", ".join(obj.options) if obj.options else "-"
    formatted_options.short_description = 'Options'

admin.site.register(Quiz, QuizAdmin)
admin.site.register(QuizItem, QuizItemAdmin)
