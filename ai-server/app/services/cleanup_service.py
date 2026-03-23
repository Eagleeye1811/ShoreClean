import os
import json
import re
import google.generativeai as genai
from PIL import Image
import io

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

async def analyze_cleanup(before_bytes: bytes, after_bytes: bytes):
    before_img = Image.open(io.BytesIO(before_bytes))
    after_img = Image.open(io.BytesIO(after_bytes))

    prompt = """You are an expert at analyzing beach/shore cleanup effectiveness.
You are given two images: The first is BEFORE cleaning, the second is AFTER cleaning.

Analyze both images and respond ONLY with a valid JSON object (no markdown, no extra text) in this exact format:
{
  "cleaned": true or false,
  "cleanliness_score": <integer 0-100>,
  "explanation": "<one or two sentence summary of what changed>"
}

Guidelines:
- "cleaned" is true if the after image shows meaningful reduction in trash/debris
- "cleanliness_score" is 0 if no improvement, 100 if completely clean, scaled in between
- "explanation" should mention what trash was visible before and what changed after"""

    response = await model.generate_content_async([prompt, before_img, after_img])
    content = response.text.strip()

    try:
        result = json.loads(content)
    except json.JSONDecodeError:
        match = re.search(r'\{.*\}', content, re.DOTALL)
        if match:
            result = json.loads(match.group())
        else:
            result = {
                "cleaned": False,
                "cleanliness_score": 0,
                "explanation": content
            }

    return {
        "cleaned": bool(result.get("cleaned", False)),
        "cleanliness_score": int(result.get("cleanliness_score", 0)),
        "explanation": str(result.get("explanation", "No explanation provided."))
    }
