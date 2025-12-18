"""
Configuration module for ShoreClean AI Server
Loads environment variables and API keys
"""
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Third-party API keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")
STABILITY_API_KEY = os.getenv("STABILITY_API_KEY")
EMAILJS_SERVICE_ID = os.getenv("EMAILJS_SERVICE_ID")
EMAILJS_TEMPLATE_ID = os.getenv("EMAILJS_TEMPLATE_ID")
EMAILJS_USER_ID = os.getenv("EMAILJS_USER_ID")

# OpenAI API key for vision analysis and content generation
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# MongoDB connection string
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Server configuration
PORT = int(os.getenv("PORT", 8000))
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
