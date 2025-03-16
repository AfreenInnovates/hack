from pydantic import BaseModel, Field
from typing import Optional

class StoryRequest(BaseModel):
    prompt: str
    max_tokens: int
    temperature: float
    top_p: float


class ImageRequest(BaseModel):
    width: int = Field(..., gt=0)
    height: int = Field(..., gt=0)
    description: str = ""

