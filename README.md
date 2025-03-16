# First Project: Using Backend + Frontend!

This project is a full-stack application utilizing **FastAPI** for the backend, **Nebius** for using the models from their platform, and **React with CSS** for the frontend. Full Code: [Code](https://github.com/AfreenInnovates/hack/tree/main/art)

## What Does the Application Do?

- **Story Generation**: Users can input a prompt, and the app generates a story using **Meta-Llama-3.1-70B-Instruct** (a text-to-text model).
- **Image Generation**: The app generates images based on the story using **black-forest-labs/flux-schnell's** text-to-image model. Users can also customize the image prompts for better control. (Supports up to 5 images.)

## Inspiration
Wanted to build a fun and creative app where users can tweak their prompts, explore storytelling, and enjoy the process. This is especially great for children, who can generate stories and images in an interactive way.

## How We Built It
- **Backend**: FastAPI serves as the backend, handling prompt processing and communication with Nebius-hosted models.
- **Frontend**: React and CSS make the interface simple and user-friendly.
- **AI Models**: 
  - Story generation: **Meta-Llama-3.1-70B-Instruct** (text-to-text model).
  - Image generation: **black-forest-labs/flux-schnell's** (text-to-image model).

## Future Enhancements
- Speech to text, where users rather than typing, would be able to tell speak prompts.
- Allow users to generate **longer stories**, (take token input, temperature input, etc. and utilize those values in the backend).
- Let users select how many images they want (beyond the current limit of 5).
- Store these generated art/stories, and show the specific prompt for the best ones created.
- Share their stories/artwork?
- Prolly user authentication?

## Challenges Faced
- Was difficult to get the **exact file paths** of images from the backend to the frontend.
- Unable to generate all **5 images in one request**, so we had to fetch responses **5 times**, which we aim to optimize.

This was a fun project, and we hope to keep improving it! (mainly gonna keep it as a fun project :))
