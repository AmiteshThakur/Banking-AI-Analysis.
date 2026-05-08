import os
from pydantic import BaseModel

os.environ.pop("SSL_CERT_FILE", None)
os.environ.pop("SSL_CERT_DIR", None)

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pdfminer.high_level import extract_text
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import tempfile
import httpx
import re

def sanitize_sensitive_data(text):

    # Mask account numbers
    text = re.sub(r'\b\d{10,18}\b', 'XXXX_ACCOUNT', text)

    # Mask PAN
    text = re.sub(r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b', 'XXXX_PAN', text)

    # Mask Aadhaar
    text = re.sub(r'\b\d{4}\s\d{4}\s\d{4}\b', 'XXXX_AADHAAR', text)

    # Mask emails
    text = re.sub(r'\S+@\S+', 'XXXX_EMAIL', text)

    # Mask phone numbers
    text = re.sub(r'\b\d{10}\b', 'XXXX_PHONE', text)

    return text
# Load env variables
load_dotenv()

# FastAPI app
app = FastAPI()

class AskRequest(BaseModel):
    question: str

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HTTP client
client = httpx.Client(verify=False)

# TCS LLM
llm = ChatOpenAI(
    base_url=os.getenv("TCS_BASE_URL"),
    model="azure_ai/genailab-maas-DeepSeek-V3-0324",
    api_key=os.getenv("TCS_API_KEY"),
    http_client=client
)

@app.get("/")
def home():
    return {"message": "AI Compliance Backend Running"}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    # Validate PDF
    if file.content_type != "application/pdf":
        return {"error": "Only PDF files allowed"}

    # Save uploaded file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(await file.read())
        temp_path = temp_file.name

    # Extract text
    raw_text = extract_text(temp_path)
    extracted_text = sanitize_sensitive_data(raw_text)

    # AI Prompt
    prompt = f"""
    You are an AI banking compliance officer.

    Analyze the following regulation document.

    Return response STRICTLY in this JSON format:

    {{
        "summary": "...",
        "risks": "...",
        "recommended_actions": "..."
    }}

    Regulation Document:
    {extracted_text}
    """

    # AI response
    response = llm.invoke(prompt)

    cleaned_response = response.content.strip()
    cleaned_response = cleaned_response.replace("```json", "")
    cleaned_response = cleaned_response.replace("```", "")
    return {
    "result": cleaned_response
    }
@app.post("/ask-ai")
async def ask_ai(data: AskRequest):

    try:

        prompt = f"""
        You are an AI Banking Compliance Assistant.

        RULES:
        - Respond naturally to greetings like "Hi", "Hello", or "How are you?"
        - Only provide compliance analysis for banking/compliance-related questions
        - Keep responses concise and professional
        - Never generate fake banking data
        - No personal customer data is provided
        - If the question is unrelated to compliance, respond politely and guide the user back to banking/compliance topics

        User Question:
        {data.question}

        If the question is banking/compliance related, provide:
        1. Risk Explanation
        2. Compliance Insight
        3. Recommended Action

        Otherwise respond conversationally.
        """

        response = llm.invoke(prompt)

        return {
            "answer": response.content
        }

    except Exception as e:
        return {
            "error": str(e)
        }