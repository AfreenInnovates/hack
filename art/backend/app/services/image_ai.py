import os
import requests
from fastapi import APIRouter, HTTPException
from app.config import NEBIUS_API_KEY
from app.models.request import ImageRequest

router = APIRouter()
LATEST_STORY_PATH = "latest_story.txt"

def generate_image(prompt: str, width: int, height: int):
    """ Calls the Nebius API to generate an image. """
    
    if not NEBIUS_API_KEY:
        raise HTTPException(status_code=500, detail="Missing NEBIUS_API_KEY")

    url = "https://api.studio.nebius.com/v1/"
    headers = {"Authorization": f"Bearer {NEBIUS_API_KEY}"}
    payload = {
        "model": "black-forest-labs/flux-schnell",
        "response_format": "b64_json",
        "prompt": prompt,
        "width": width,
        "height": height,
        "extra_body": {
            "response_extension": "webp",
            "num_inference_steps": 20,
            "negative_prompt": "",
            "seed": -1
        }
    }

    print("Sending request to Nebius API...")
    response = requests.post(url, headers=headers, json=payload)

    print(f"API Response Code: {response.status_code}")
    print(f"API Response Text: {response.text}")

    if response.status_code == 200:
        return response.json()
    else:
        raise HTTPException(status_code=500, detail=f"Image generation failed: {response.text}")
