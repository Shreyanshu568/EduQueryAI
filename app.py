
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

from ccna_rag import generate_answer, generate_quiz_questions, load_vectorstore

# Initialize FastAPI
app = FastAPI()

# CORS middleware - Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)
#Serve static files (CSS,JS) 
app.mount("/static", StaticFiles(directory="."), name="static")

# Load vectorstore once at startup (NOT create)
vectorstore = load_vectorstore()

# Request Model
class Question(BaseModel):
    question: str
#Serve frontend HTML 
@app.get("/")
async def serve_frontend():
    with open("RAG.html", "r", encoding="utf-8") as f:
        content = f.read()
    return HTMLResponse(content=content)

# Main endpoint
@app.post("/ask") 
async def ask_question(data: Question):
    answer = generate_answer(vectorstore, data.question)
    return {"answer": answer}

# Health check
@app.get("/")
async def home():
    return {"status": "EduQueryAI is running"}

# Quiz endpoint
@app.post("/quiz")
async def generate_quiz(data: Question):
    answer = generate_quiz_questions(vectorstore, data.question)
    return {"quiz": answer}