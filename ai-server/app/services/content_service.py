import os
import logging
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

SYSTEM_PROMPT = (
    "You are a helpful AI assistant. Generate a detailed, attractive event description. "
    "Include: purpose, audience, location, date/time, activities, registration, call-to-action."
)


async def generate_content(event_query: str) -> str:
    logging.info(f"Generating content for: {event_query}")
    prompt = f"{SYSTEM_PROMPT}\n\nUser Request: {event_query}"
    response = await model.generate_content_async(prompt)
    return response.text.strip()
