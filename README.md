## 🧠 AriseScholar — AI-Powered Study Companion

AriseScholar is an AI-driven platform that turns your study materials (PDF/DOCX) into structured notes, flashcards, and quizzes. A clean dashboard helps you track progress and practice smarter.

---

## 🎥 Demo
https://github.com/user-attachments/assets/bc78e00b-b1c4-4b65-9446-ab0be1a1f881

---

## ✨ Features

- 📄 Document upload (PDF, DOCX, PYQs)
- 📝 AI-generated notes/summaries (Level 3)
- 🃏 Flashcards from content (Level 1)
- 🧠 Quiz generation and play (Level 2)
- 📊 Progress dashboard and quick-start actions
- 🔐 JWT auth with auto-refresh

---

## 🛠️ Tech Stack

- ⚛️ Frontend: React (Vite), Tailwind CSS
- 🐍 Backend: Django + Django REST Framework (DRF)
- 🔐 Auth: JWT (SimpleJWT)
- 🤖 AI: Grok (chat completions), Gemini (notes) — optional with fallbacks
- 📦 Storage/Parsing: PyPDF2, python-docx
- 🧰 DX/Other: CORS, Whitenoise (static), Axios

---

## 📦 Monorepo Layout

```
AriseScholar/
├── Backend/
│   ├── requirements.txt
│   └── AriseScholar/
│       ├── manage.py
│       └── AriseScholar/
│           ├── settings.py
│           ├── urls.py
│           └── .env                # backend env (see below)
└── frontend/
	 ├── package.json
	 ├── vite.config.js
	 └── .env                        # frontend env (see below)
```

---

## ⚙️ Setup & Run

### 1) Backend (Django) 🐍

From the repo root:

1. Create a virtual environment and activate it
	- Windows PowerShell:
	  - python -m venv venv
	  - venv\Scripts\Activate.ps1
2. Install dependencies
	- pip install -r Backend/requirements.txt
3. Environment variables (create file):
	- File: Backend/AriseScholar/AriseScholar/.env
	- Example:
	  - DJANGO_SECRET_KEY=replace_me
	  - DEBUG=True
	  - ALLOWED_HOSTS=*
	  - CORS_ALLOWED_ORIGINS=http://localhost:5173
	  - GROQ_API_KEY=your_groq_key_optional
	  - GROQ_MODEL=llama-3.1-8b-instant
	  - GEMINI_API_KEY=your_gemini_key_optional
4. Migrate DB
	- cd Backend/AriseScholar
	- python manage.py migrate
5. Run server
	- python manage.py runserver 0.0.0.0:8000

API base (dev): http://localhost:8000

### 2) Frontend (React + Vite) ⚛️

1. Create env file: frontend/.env
	- VITE_API_BASE_URL=http://localhost:8000
2. Install and run
	- cd frontend
	- npm install
	- npm run dev

App (dev): http://localhost:5173

---

## 🚀 Usage (Quick Flow)

1) Register or sign in
2) Upload a document in Notes
3) Generate flashcards (Level 1) and practice
4) Generate a quiz (Level 2), start and submit
5) Generate notes/summaries (Level 3)
6) Track progress on the dashboard

Notes
- AI keys are optional; the app provides graceful fallbacks and clear errors if keys are missing.
- Place backend .env at Backend/AriseScholar/AriseScholar/.env.

---

## 👥 Developers

1. Irfan Naikwade
2. Sandesh Pol

---

## 📝 License

Copyright © AriseScholar. All rights reserved.
