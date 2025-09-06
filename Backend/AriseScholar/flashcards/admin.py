from django.contrib import admin
from .models import Document, Flashcard

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'type', 'flashcard_status', 'created_at')
    list_filter = ('type', 'flashcard_status', 'created_at')
    search_fields = ('title', 'owner__username')

@admin.register(Flashcard)
class FlashcardAdmin(admin.ModelAdmin):
    list_display = ('question', 'document', 'difficulty')
    list_filter = ('difficulty',)
    search_fields = ('question', 'answer', 'tags')
