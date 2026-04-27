
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

# Load vectorstore once at startup (NOT create)
vectorstore = load_vectorstore()

# Request Model
class Question(BaseModel):
    question: str

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