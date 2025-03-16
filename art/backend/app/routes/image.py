import os
import base64
from fastapi import APIRouter, HTTPException
from openai import OpenAI
from PIL import Image
from io import BytesIO
from app.models.request import ImageRequest
import re

router = APIRouter()
LATEST_STORY_PATH = "latest_story.txt"

# Initialize Nebius OpenAI-style client
client = OpenAI(
    base_url="https://api.studio.nebius.com/v1/",
    api_key=os.environ.get("NEBIUS_API_KEY")
)

def sanitize_filename(text: str, length: int = 10) -> str:
    """Sanitizes a string for use as a valid filename."""
    # Replace any invalid characters for Windows filenames with underscores
    sanitized_text = re.sub(r'[<>:"/\\|?*]', '_', text)  # Replace invalid characters
    return sanitized_text[:length]  # Limit to specified length

def generate_images(prompt: str, width: int, height: int, num_images: int = 5):
    """ Calls the Nebius API multiple times to generate multiple images. """
    images = []

    width = 512
    height = 512

    for i in range(num_images):  # Call API 5 times
        try:
            response = client.images.generate(
                model="black-forest-labs/flux-schnell",
                response_format="b64_json",
                extra_body={
                    "response_extension": "webp",
                    "width": width,
                    "height": height,
                    "num_inference_steps": 16,  # Max allowed
                    "negative_prompt": "",
                    "seed": -1
                },
                prompt=prompt
            )

            response_json = response.model_dump()  # Ensure JSON response
            
            if isinstance(response_json, dict) and "data" in response_json:
                images.append(response_json["data"][0])  # Append only if valid

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")

    return {"data": images}  # Return multiple images


@router.post("/generate-images")
def image_endpoint(request: ImageRequest, format: str = "jpeg"):
    """ FastAPI endpoint to generate multiple images and save them. """

    valid_formats = ["jpg", "jpeg", "png", "webp"]
    format = format.lower()

    if format not in valid_formats:
        raise HTTPException(status_code=400, detail=f"Invalid format. Choose from {valid_formats}")

    print("Checking for latest story file...")

    if not os.path.exists(LATEST_STORY_PATH):
        raise HTTPException(status_code=404, detail="No story found to generate images for")

    try:
        with open(LATEST_STORY_PATH, "r") as latest_file:
            story_text = latest_file.read().strip()
            print(f"Story Content: {story_text[:200]}...")  # Debugging

            if not story_text:
                raise HTTPException(status_code=400, detail="Story file is empty, cannot generate images.")

            # Generate folder and filenames
            folder_name = sanitize_filename(story_text, 15)
            save_path = os.path.join("images", folder_name)
            os.makedirs(save_path, exist_ok=True)  # Create folder if it doesn't exist

            # Construct prompt based on the story and additional description (if provided)
            full_prompt = f"Create some images for this story: {story_text}"
            if request.description:
                full_prompt += f" The images should reflect the following details: {request.description}"

            # 🔥 Call the fixed `generate_images()` function
            result = generate_images(full_prompt, request.width, request.height, num_images=5)

            if not isinstance(result, dict) or "data" not in result or not isinstance(result["data"], list):
                raise HTTPException(status_code=500, detail="Invalid response from Nebius API")

            image_paths = []
            for i, image_info in enumerate(result["data"]):
                try:
                    image_data = base64.b64decode(image_info["b64_json"])
                except (KeyError, IndexError) as e:
                    raise HTTPException(status_code=500, detail=f"Invalid image data structure: {str(e)}")

                # Unique filename for each image
                image_filename = f"{sanitize_filename(story_text, 10)}_{i + 1}.{format}"
                image_full_path = os.path.join(save_path, image_filename)

                # Convert from WEBP to chosen format
                with Image.open(BytesIO(image_data)) as img:
                    if format in ["jpg", "jpeg"]:
                        img = img.convert("RGB")  # Convert to RGB for JPEG
                    img.save(image_full_path, format.upper())

                image_paths.append(image_full_path)

            print(f"✅ {len(image_paths)} images saved at: {save_path}")
            return {"message": "Images generated successfully", "paths": image_paths}

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="No story found to generate images for")
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
