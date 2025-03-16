import os
from fastapi import APIRouter, HTTPException
from app.models.request import StoryRequest
from app.services.story_ai import generate_story

router = APIRouter()
STORIES_DIR = "stories"
LATEST_STORY_PATH = "latest_story.txt"  # This will store only the path

@router.post("/generate-story")
def story_endpoint(request: StoryRequest):
    result = generate_story(request.prompt, request.max_tokens, request.temperature, request.top_p)
    
    if result:
        story_content = result["choices"][0]["message"]["content"]

        # Extract first few characters for folder naming
        import re

        folder_name = re.sub(r'[<>:"/\\|?*]', '_', story_content[:10].strip())

        folder_path = os.path.join(STORIES_DIR, folder_name)
        os.makedirs(folder_path, exist_ok=True)

        folder_path = os.path.join(STORIES_DIR, folder_name)
        os.makedirs(folder_path, exist_ok=True)

        # Save story to file inside the unique folder
        file_path = os.path.join(folder_path, "story.txt")
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(story_content)

        # Save only the path in latest_story.txt
        with open(LATEST_STORY_PATH, "w") as latest_file:
            latest_file.write(story_content) 

        return {"story": story_content}

    raise HTTPException(status_code=500, detail="Story generation failed")
