import uvicorn
from fastapi import FastAPI
from app.routes import story, image
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

app.mount("/images", StaticFiles(directory=os.path.join(os.getcwd(), "images")), name="images")

# Include API routes
app.include_router(story.router)
app.include_router(image.router)

@app.get("/")
def home():
    return {"message": "Hello, world!"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
