import requests
from app.config import NEBIUS_API_KEY
from fastapi import APIRouter, HTTPException

def generate_story(prompt: str, max_tokens: int, temperature: float, top_p: float):
    url = "https://api.studio.nebius.com/v1/chat/completions"
    headers = {"Authorization": f"Bearer {NEBIUS_API_KEY}"}
    payload = {
        "model": "meta-llama/Meta-Llama-3.1-70B-Instruct",
        "max_tokens": max_tokens,
        "temperature": temperature,
        "top_p": top_p,
        "extra_body": {"top_k": 50},
        "messages": [{"role": "user", "content": prompt}]
    }
    
    response = requests.post(url, headers=headers, json=payload)

    # DEBUG: Print response
    print("Response Status:", response.status_code)
    print("Response JSON:", response.text)  # Logs full response
    
    if response.status_code == 200:
        return response.json()
    return None  # Handle failure gracefully
