from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Document, Flashcard
from .serializers import DocumentSerializer, FlashcardSerializer
from .utils import extract_text_from_file, generate_flashcards_from_text

# ------------------------------
# Document ViewSet
# ------------------------------
class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Document.objects.filter(owner=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['POST'])
    def generate_flashcards(self, request, pk=None):
        try:
            document = self.get_object()
            if document.flashcard_status:
                return Response({'detail': 'Flashcards already generated for this document'}, status=status.HTTP_400_BAD_REQUEST)
            
            if not document.file:
                return Response({'detail': 'No file attached to this document'}, status=status.HTTP_400_BAD_REQUEST)
            
            text = extract_text_from_file(document.file.path, document.type)
            if not text.strip():
                return Response({'detail': 'Could not extract text from the file'}, status=status.HTTP_400_BAD_REQUEST)
            
            document.text = text
            document.save()

            flashcards_data = generate_flashcards_from_text(text, count=10)
            
            if not flashcards_data:
                return Response({'detail': 'Could not generate flashcards from the text'}, status=status.HTTP_400_BAD_REQUEST)

            flashcards_instances = []
            for fc in flashcards_data:
                flashcards_instances.append(
                    Flashcard(
                        document=document,
                        question=fc['question'],
                        answer=fc['answer'],
                        tags=fc['tags'],
                        difficulty=fc['difficulty']
                    )
                )
            Flashcard.objects.bulk_create(flashcards_instances)
            document.flashcard_status = True
            document.save()

            serializer = FlashcardSerializer(flashcards_instances, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({'detail': f'Error generating flashcards: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['GET'])
    def flashcards(self, request, pk=None):
        """Get all flashcards for a document"""
        document = self.get_object()
        flashcards = document.flashcards.all()
        serializer = FlashcardSerializer(flashcards, many=True)
        return Response(serializer.data)


# ------------------------------
# Flashcard ViewSet
# ------------------------------
class FlashcardViewSet(viewsets.ModelViewSet):
    serializer_class = FlashcardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only flashcards belonging to documents of the current user
        return Flashcard.objects.filter(document__owner=self.request.user).order_by('id')

    @action(detail=True, methods=['PATCH'])
    def update_status(self, request, pk=None):
        """Update the status of a flashcard"""
        flashcard = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in [Flashcard.NONE, Flashcard.YES, Flashcard.NO]:
            return Response(
                {'detail': 'Invalid status. Must be none, yes, or no.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        flashcard.status = new_status
        flashcard.save()
        
        serializer = self.get_serializer(flashcard)
        return Response(serializer.data)