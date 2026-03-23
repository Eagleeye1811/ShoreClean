import os
import logging
import asyncio
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in .env")

_client = Groq(api_key=GROQ_API_KEY)

SYSTEM_PROMPT = (
    "You are a helpful AI assistant. Generate a detailed, attractive event description. "
    "Include: purpose, audience, location, date/time, activities, registration, call-to-action."
)


def _generate_sync(event_query: str) -> str:
    response = _client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": event_query},
        ],
        max_tokens=512,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()


async def generate_content(event_query: str) -> str:
    logging.info(f"Generating content for: {event_query}")
    return await asyncio.to_thread(_generate_sync, event_query)
