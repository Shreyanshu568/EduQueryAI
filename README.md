# EduQueryAI - CCNA RAG Chatbot 

## Overview
EduQuery is an AI-powered RAG chatbot that helps students learn CCNA networking concepts. It answers questions and generates quizzes from 17 official CCNA ITN modules.

## Features
- Ask any CCNA question and get detailed answers
- Generates custom quizzes with answer and explanation too (5 questions)
- Session history tracking
- Responsive UI (works on laptop & mobile)
- Dark/Light theme toggle

## Tech Stack
- **Backend:** Python, FastAPI, LangChain
- **LLM:** Llama 3 (Groq API)
- **Vector Database:** ChromaDB
- **Frontend:** HTML, CSS, JavaScript
- **Deployment:** Railway

## How It Works
1. User asks a question through the chat interface
2. FastAPI backend receives the question
3. Vector store retrieves relevant context from CCNA modules
4. Llama 3 LLM generates an accurate answer
5. Answer is displayed in chat

## Screenshots
<img width="1918" height="908" alt="Screenshot1" src="https://github.com/user-attachments/assets/89ef5dc2-6b4c-4e0d-be06-29b0b0d042a4" />
<img width="1918" height="911" alt="Screenshot2" src="https://github.com/user-attachments/assets/60e346c5-4d2c-4b3b-bdd2-6ecf256ebe9f" />
<img width="1918" height="911" alt="Screenshot3" src="https://github.com/user-attachments/assets/077f9f44-13d0-42da-9e98-4e5fe4497a32" />

## Live Demo
[https://eduquery-ai.up.railway.app](https://eduquery-ai.up.railway.app)

## Author 
Shreyanshu Mishra

