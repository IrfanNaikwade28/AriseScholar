import requests
import os
import json
import re
import logging

logger = logging.getLogger(__name__)

def generate_quiz_questions_from_text(text, count=10):
    """
    Generate quiz questions from text using Groq API with proper error handling.
    Returns a list of quiz question dictionaries.
    """
    url = "https://api.groq.com/openai/v1/chat/completions"
    api_key = os.getenv('GROQ_API_KEY')

    if not api_key:
        logger.error("GROQ_API_KEY not found in environment variables")
        raise ValueError("API key not configured")

    if not text or len(text.strip()) < 50:
        logger.warning("Text too short for quiz generation")
        raise ValueError("Text content too short for quiz generation")

    prompt = f"""
You are an AI assistant that creates educational quiz questions from text content. Generate {count} questions based on the following text:

{text[:4000]}  # Limit text length to avoid token limits

Return JSON with the following structure:
[
  {{
    "kind": "mcq",
    "prompt": "Question text",
    "options": ["option1", "option2", "option3", "option4"],
    "correctAnswer": 0,
    "explanation": "Brief explanation",
    "tags": ["tag1", "tag2"],
    "difficulty": "easy"
  }}
]

Important:
- For MCQ questions, correctAnswer should be the index (0-3) of the correct option
- Generate diverse question types when possible
- Ensure questions are directly related to the provided text
- Make explanations educational and helpful
"""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openai/gpt-oss-120b",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 4096
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        
        if 'choices' not in data or not data['choices']:
            logger.error("Invalid response format from Groq API")
            raise ValueError("Invalid API response format")

        content = data['choices'][0]['message']['content']

        # Clean and parse JSON (matching flashcard implementation)
        cleaned_content = content.replace("```json", "").replace("```", "").strip()
        
        questions = json.loads(cleaned_content)
        
        # Validate and clean the questions
        validated_questions = []
        for i, q in enumerate(questions):
            if not isinstance(q, dict):
                logger.warning(f"Skipping invalid question at index {i}")
                continue
                
            # Ensure required fields exist
            validated_q = {
                'kind': q.get('kind', 'mcq'),
                'prompt': q.get('prompt', ''),
                'options': q.get('options', []),
                'correctAnswer': q.get('correctAnswer', 0),
                'explanation': q.get('explanation', ''),
                'tags': q.get('tags', []),
                'difficulty': q.get('difficulty', 'medium')
            }
            
            # Validate MCQ questions
            if validated_q['kind'] == 'mcq':
                if len(validated_q['options']) < 2:
                    logger.warning(f"Question {i} has insufficient options, skipping")
                    continue
                if not isinstance(validated_q['correctAnswer'], int) or validated_q['correctAnswer'] >= len(validated_q['options']):
                    validated_q['correctAnswer'] = 0  # Default to first option
            
            validated_questions.append(validated_q)
        
        if not validated_questions:
            logger.error("No valid questions generated")
            raise ValueError("Failed to generate valid quiz questions")
            
        logger.info(f"Successfully generated {len(validated_questions)} quiz questions")
        return validated_questions
        
    except requests.exceptions.RequestException as e:
        logger.error(f"API request failed: {str(e)}")
        raise ValueError(f"Failed to generate quiz questions: {str(e)}")
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON response: {str(e)}")
        raise ValueError("Invalid JSON response from quiz generation API")
    except Exception as e:
        logger.error(f"Unexpected error in quiz generation: {str(e)}")
        raise ValueError(f"Quiz generation failed: {str(e)}")
