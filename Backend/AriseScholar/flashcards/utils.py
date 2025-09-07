import os
import json
import requests
from PyPDF2 import PdfReader
import docx

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"  # Update with actual endpoint

FLASHCARD_PROMPT = """
You are an AI assistant that creates educational flashcards from text content. Generate flashcards that help students learn and remember key concepts.

Instructions:
1. Create concise, clear questions and answers
2. Focus on important concepts, definitions, facts, and relationships
3. Make questions specific and answerable
4. Assign appropriate difficulty levels (easy, medium, hard)
5. Add relevant tags for categorization
6. Return ONLY valid JSON without any markdown formatting or explanations

Generate exactly {count} flashcards from the following text:

{text}

Return a JSON array of flashcards with this exact structure:
[
  {{
    "question": "Clear, specific question",
    "answer": "Concise, accurate answer",
    "tags": ["relevant", "tags"],
    "difficulty": "easy|medium|hard"
  }}
]
"""

# -----------------------------
# File text extraction
# -----------------------------
def extract_text_from_file(file_path, file_type):
    try:
        if file_type == 'pdf':
            text = ''
            with open(file_path, 'rb') as f:
                reader = PdfReader(f)
                for page in reader.pages:
                    text += page.extract_text() + '\n'
            return text
        elif file_type == 'docx':
            doc = docx.Document(file_path)
            return '\n'.join([p.text for p in doc.paragraphs])
        elif file_type == 'txt':
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
    except Exception as e:
        raise Exception(f"Error extracting text from file: {str(e)}")

# -----------------------------
# Groq flashcard generation
# -----------------------------
def generate_flashcards_from_text(text, count=10):
    if not GROQ_API_KEY:
        raise Exception("GROQ_API_KEY is not set in environment variables")

    if not text or not text.strip():
        raise Exception("No text provided for flashcard generation")

    prompt = FLASHCARD_PROMPT.replace("{count}", str(count)).replace("{text}", text[:4000])  # Limit text length

    payload = {
        "model": "openai/gpt-oss-120b",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 4096
    }
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()

        content = data['choices'][0]['message']['content']
        cleaned_content = content.replace("```json", "").replace("```", "").strip()

        flashcards = json.loads(cleaned_content)
        
        # Validate and filter flashcards
        valid_flashcards = []
        for fc in flashcards:
            if (fc.get('question') and fc.get('answer') and 
                isinstance(fc.get('tags'), list) and
                fc.get('difficulty') in ['easy', 'medium', 'hard']):
                valid_flashcards.append(fc)
        
        return valid_flashcards[:count]  # Ensure we don't exceed requested count
        
    except requests.exceptions.RequestException as e:
        raise Exception(f"API request failed: {str(e)}")
    except json.JSONDecodeError as e:
        raise Exception(f"Failed to parse API response: {str(e)}")
    except KeyError as e:
        raise Exception(f"Unexpected API response format: {str(e)}")
    except Exception as e:
        raise Exception(f"Error generating flashcards: {str(e)}")
