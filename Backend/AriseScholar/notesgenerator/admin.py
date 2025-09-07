from django.contrib import admin
from .models import UploadedFile, Question

@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'file', 'uploaded_at']
    list_filter = ['uploaded_at', 'user']
    search_fields = ['user__username', 'user__email', 'file']
    readonly_fields = ['uploaded_at']
    ordering = ['-uploaded_at']
    
    fieldsets = (
        ('File Information', {
            'fields': ('user', 'file', 'uploaded_at')
        }),
    )

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['id', 'text_preview', 'frequency', 'marks']
    list_filter = ['frequency', 'marks']
    search_fields = ['text']
    ordering = ['-frequency', '-marks']
    
    fieldsets = (
        ('Question Details', {
            'fields': ('text', 'frequency', 'marks')
        }),
    )
    
    def text_preview(self, obj):
        """Show first 50 characters of question text"""
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_preview.short_description = 'Question Preview'
    
    def get_queryset(self, request):
        """Optimize queryset for admin list view"""
        return super().get_queryset(request).select_related()

# Customize admin site headers
admin.site.site_header = "AriseScholar Admin"
admin.site.site_title = "AriseScholar Admin Portal"
admin.site.index_title = "Welcome to AriseScholar Administration"