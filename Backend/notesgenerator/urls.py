from django.urls import path
from .views import UploadFileView, GenerateNotesView

urlpatterns = [
    path('upload/', UploadFileView.as_view(), name='upload-file'),
    path('generate-notes/', GenerateNotesView.as_view(), name='generate-notes'),
]
 