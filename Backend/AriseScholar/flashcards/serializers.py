from rest_framework import serializers
from .models import Document, Flashcard

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ['owner', 'text', 'flashcard_status', 'created_at', 'updated_at']
    
    def validate(self, data):
        # If no title is provided, we'll generate it from the file in create method
        # This validation allows empty title to pass through
        return data
    
    def create(self, validated_data):
        # Extract file and determine type
        file = validated_data.get('file')
        if not file:
            raise serializers.ValidationError("File is required")
            
        # Determine file type from extension
        file_extension = file.name.split('.')[-1].lower()
        if file_extension == 'pdf':
            validated_data['type'] = Document.PDF
        elif file_extension == 'docx':
            validated_data['type'] = Document.DOCX
        elif file_extension == 'txt':
            validated_data['type'] = Document.TXT
        else:
            raise serializers.ValidationError("Unsupported file type. Please upload PDF, DOCX, or TXT files.")
        
        # Set original name
        validated_data['original_name'] = file.name
        
        # Generate title from filename if not provided or empty
        if not validated_data.get('title') or not validated_data.get('title').strip():
            validated_data['title'] = file.name.split('.')[0]
        
        return super().create(validated_data)


class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = '__all__'
        read_only_fields = ['document']
