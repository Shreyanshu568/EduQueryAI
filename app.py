# Fast API :- 

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ccna_rag import generate_answer, load_vectorstore, create_vectorstore, chunk_text
import os
from ccna_rag import generate_quiz_questions

# Initialize FastAPI :- 
app = FastAPI()

# Allow frontend to connect :- 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load vectorstore on startup :- 

if not os.path.exists("ccna_vectorstore"):
    raw_text, total_files = load_all_modules(".")
    chunks = chunk_text(raw_text)
    vectorstore= create_vectorstore(chunks)

else:
    vectorstore = load_vectorstore()

# Request Model :- 
class Question(BaseModel):
    question: str

# Main endpoint :-
@app.post("/ask") 
async def ask_question(data: Question):
    answer = generate_answer(vectorstore, data.question)
    return {"answer": answer}

# Health check :- 
@app.get("/")
async def home():
    return {"status": "EduQueryAI is running" } 

@app.post("/quiz")
async def generate_quiz(data: Question):
    answer = generate_quiz_questions(vectorstore,data.question)
    return {"quiz": answer}

