from collections import Counter
import re
from .models import Question
import requests
from PyPDF2 import PdfReader

def extract_text_from_pdf(file_path):
    reader = PdfReader(file_path)
    full_text = ""
    for page in reader.pages:
        full_text += page.extract_text() + "\n"
    return full_text

def generate_questions_from_text(file_content):
    """
    Generate questions directly from PDF text content using AI.
    """
    from django.conf import settings
    
    api_key = getattr(settings, 'GEMINI_API_KEY', None)
    if not api_key:
        return []
    
    # Using Google Gemini API to generate questions
    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}'
    
    headers = {
        'Content-Type': 'application/json',
    }
    
    # Limit text length to avoid token limits
    text_content = file_content[:8000]  # Limit to 8000 characters
    
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"""You are an expert academic tutor. Generate exactly 7 important questions based on the following text content.

TEXT CONTENT:
{text_content}

Instructions:
1. Generate exactly 7 questions that test understanding of key concepts
2. Questions should be comprehensive and cover different aspects of the content
3. Assign appropriate marks (5-15 marks) based on question complexity
4. Questions should be clear, specific, and answerable
5. Focus on important concepts, definitions, and applications
6. Return ONLY valid JSON without any markdown formatting

Return a JSON array with this exact structure:
[
  {{
    "question": "Clear, specific question text",
    "marks": 10
  }},
  {{
    "question": "Another question text",
    "marks": 8
  }}
]

Generate exactly 7 questions in JSON format."""
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.8,
            "maxOutputTokens": 2000,
            "topP": 1,
            "topK": 40
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        if response.status_code == 200:
            data = response.json()
            candidates = data.get('candidates', [])
            if candidates:
                content = candidates[0].get('content', {})
                parts = content.get('parts', [])
                if parts:
                    response_text = parts[0].get('text', '')
                    # Clean up the response
                    cleaned_response = response_text.replace("```json", "").replace("```", "").strip()
                    
                    import json
                    try:
                        questions_data = json.loads(cleaned_response)
                        questions = []
                        for item in questions_data:
                            if 'question' in item and 'marks' in item:
                                questions.append((item['question'], item['marks']))
                        return questions[:7]  # Ensure exactly 7 questions
                    except json.JSONDecodeError:
                        return []
            return []
        else:
            return []
    except Exception as e:
        return []

def get_top_repeated_questions(questions, top_n=7):
    """
    Count frequency of questions and return top N.
    """
    if not questions:
        return []
    
    # Count frequency of each question text
    question_texts = [q[0] for q in questions]
    counter = Counter(question_texts)
    
    # Get top N most frequent questions
    top_questions = counter.most_common(top_n)
    
    result = []
    for question_tuple in top_questions:
        # Counter.most_common() returns (text, frequency)
        text, freq = question_tuple
        # Find the highest marks for this question text
        max_marks = 0
        for q_text, marks in questions:
            if q_text == text:
                max_marks = max(max_marks, marks)
        
        result.append((text, freq, max_marks))
    
    return result

def call_gemini_api(question_text, marks):
    """
    Call Google Gemini API to generate an answer.
    Adjust the answer length according to marks.
    """
    from django.conf import settings
    
    api_key = getattr(settings, 'GEMINI_API_KEY', None)
    if not api_key:
        return f"Sample answer for '{question_text[:50]}...' - This is a placeholder answer. Please configure GEMINI_API_KEY in your environment variables for AI-generated answers."
    
    # Using Google Gemini API
    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}'
    
    headers = {
        'Content-Type': 'application/json',
    }

    # Calculate appropriate word count based on marks
    word_count = max(50, marks * 15)  # Minimum 50 words, 15 words per mark
    
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"""You are an expert academic tutor creating comprehensive study notes. Create a well-structured answer for this question.

QUESTION: {question_text}
MARKS: {marks}

Instructions:
1. Provide a clear, comprehensive answer
2. Structure your response with proper formatting
3. Include key points, definitions, and examples where relevant
4. Use bullet points or numbered lists for better readability
5. Aim for approximately {word_count} words
6. Focus on accuracy and educational value

Format your answer as follows:

**Answer:**

[Provide your comprehensive answer here with proper structure, bullet points, and clear explanations]

**Key Points:**
• [List 3-5 key points]
• [Each point should be concise but informative]

**Examples/Applications:**
[Include relevant examples or real-world applications if applicable]

Please provide a detailed, well-formatted answer that helps students understand and remember the concept."""
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": word_count * 2,  # Roughly 2 tokens per word
            "topP": 1,
            "topK": 40
        }
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        if response.status_code == 200:
            data = response.json()
            candidates = data.get('candidates', [])
            if candidates:
                content = candidates[0].get('content', {})
                parts = content.get('parts', [])
                if parts:
                    answer = parts[0].get('text', 'No answer available.')
                    return answer.strip()
            return "No answer available."
        else:
            return f"Error generating answer: {response.status_code} - {response.text}"
    except requests.exceptions.Timeout:
        return f"Request timeout while generating answer for: {question_text[:50]}..."
    except Exception as e:
        return f"Error generating answer: {str(e)}"

def generate_answers_for_questions(questions):
    """
    Generate answers using Gemini API.
    Returns list of dicts with Question and Answer.
    """
    answers = []
    for question_data in questions:
        # Handle both (text, marks) and (text, freq, marks) formats
        if len(question_data) == 2:
            text, marks = question_data
        elif len(question_data) == 3:
            text, freq, marks = question_data
        else:
            continue
            
        answer_text = call_gemini_api(text, marks)
        answers.append({
            "Question": text,
            "Answer": answer_text
        })
    return answers
