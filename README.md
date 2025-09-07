# 🌟 VIRTUAL AriseScholar - AI-Powered Study Companion

![Project Banner](path-to-your-banner.png)  

**AriseScholar** is an **AI-driven educational platform** that automates note-taking, quiz creation, and flashcard generation from PDFs, DOCX, and PYQs. It also provides a **personalized dashboard** for adaptive learning and progress tracking.  

---

## 🚀 Features

- **📄 Document Upload:** Upload PDFs, DOCX, and PYQs.  
- **📝 AI-Generated Notes:** Summaries and repeated question answers.  
- **❓ Quiz Generation:** MCQs and True/False questions generated dynamically.  
- **🃏 Flashcards:** Quick Q&A style revision cards.  
- **📊 Dashboard:** Shows total documents, quizzes, flashcards, scores, and progress.  
- **🎯 Adaptive Learning:** Personalized suggestions to improve weak areas.  

---

##  🖥 Tech Stack
- **Layer	Technology
- **Frontend	React / Next.js
- **Backend	Django REST Framework
- **AI Engine	Groq API
- **Database	SQLite / MongoDB
- **Deployment	Render / Cloud Platform
- **Tools & Libs	PyPDF2, python-docx, Django CORS, DRF SimpleJWT, Whitenoise

⚡ Demo
Upload documents → AI generates notes, quizzes, flashcards

Track progress and get adaptive recommendations in the dashboard

💻 Installation
Clone the repository

bash
Copy code
git clone https://github.com/IrfanNaikwade28/AriseScholar.git
cd AriseScholar
Create Python virtual environment

bash
Copy code
python -m venv venv
source venv/bin/activate  # Linux / Mac
venv\Scripts\activate     # Windows
Install backend dependencies

bash
Copy code
pip install -r requirements.txt
Set environment variables

env
Copy code
# .env file
DJANGO_SECRET_KEY=your_secret_key
GROQ_API_KEY=your_groq_api_key
DEBUG=True
Run backend migrations

bash
Copy code
python manage.py migrate
Start backend server

bash
Copy code
python manage.py runserver
Start React frontend

bash
Copy code
cd frontend
npm install
npm start

## 🌟 Usage
Upload documents via the Upload page

View AI-generated notes, quizzes, flashcards

Track progress via Dashboard with stats and recommendations

## 🔮 Future Enhancements
Multi-language support (Marathi, Hindi, English)

Mobile app integration

Live quiz sessions & collaboration

Enhanced AI summarization using advanced LLMs

## 📬 Contact
Sandesh Pol

Email: sandeshpol268@gmail.com

GitHub: https://github.com/Sandesh-Pol