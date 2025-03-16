import { useState } from 'react';
import "../styles/Input.css";
import { useNavigate } from 'react-router-dom';

const InputPage = () => {
  const [formData, setFormData] = useState({
    prompt: "",
    max_tokens: 200,
    temperature: 0.7,
    top_p: 0.9
  });

  const [story, setStory] = useState("");
  const [imageDescription, setImageDescription] = useState("");  // New state for image description
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [images, setImages] = useState([]);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "imageDescription") {
      setImageDescription(value);
    } else {
      setFormData({
        ...formData,
        [name]: name === "max_tokens" ? parseInt(value) : 
                (name === "temperature" || name === "top_p") ? parseFloat(value) : value
      });
    }
  };

  const generateStory = async (e) => {
    e.preventDefault();
    setIsGeneratingStory(true);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate story");
      }
      
      const data = await response.json();
      setStory(data.story);
    } catch (error) {
      console.error("Error generating story:", error);
      alert("Failed to generate story. Please try again.");
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const generateImages = async () => {
    if (!story) {
      alert("Please generate a story first");
      return;
    }

    setIsGeneratingImages(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/generate-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          width: 512,  // Set default width
          height: 512, // Set default height
          description: imageDescription, // Include the user input description
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from backend:", errorData);
        throw new Error("Failed to generate images");
      }

      const data = await response.json();
      setImages(data.paths);  // Set images using paths returned from backend
    } catch (error) {
      console.error("Error generating images:", error);
      alert("Failed to generate images. Please try again.");
    } finally {
      setIsGeneratingImages(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="input-container">
      <button onClick={() => navigate("/")} className='cta-button'>Back Home</button>
      <header>
        <h1>Create Your Story & Images</h1>
        <p>Enter your prompt and customize parameters to generate a unique story and images</p>
      </header>

      <section className="parameter-section">
        <h2>Set Your Parameters</h2>
        
        <form onSubmit={generateStory}>
          <div className="form-group">
            <label htmlFor="prompt">Your Prompt</label>
            <textarea
              id="prompt"
              name="prompt"
              placeholder="Write an alternate ending for stand by me doraemon movie part 2..."
              value={formData.prompt}
              onChange={handleInputChange}
              required
            />
            <p className="parameter-description">Enter a detailed description of the story you want to generate</p>
          </div>

          <div className="parameter-controls">
            <div className="form-group">
              <label htmlFor="max_tokens">Maximum Length (tokens)</label>
              <div className="slider-container">
                <input
                  type="range"
                  id="max_tokens"
                  name="max_tokens"
                  min="50"
                  max="500"
                  step="10"
                  value={formData.max_tokens}
                  onChange={handleInputChange}
                />
                <span>{formData.max_tokens}</span>
              </div>
              <p className="parameter-description">Controls the maximum length of the generated story. Higher values produce longer stories.</p>
            </div>

            <div className="form-group">
              <label htmlFor="temperature">Creativity (temperature)</label>
              <div className="slider-container">
                <input
                  type="range"
                  id="temperature"
                  name="temperature"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={formData.temperature}
                  onChange={handleInputChange}
                />
                <span>{formData.temperature}</span>
              </div>
              <p className="parameter-description">Controls randomness. Lower values are more focused and deterministic, higher values are more creative and varied.</p>
            </div>

            <div className="form-group">
              <label htmlFor="top_p">Top P</label>
              <div className="slider-container">
                <input
                  type="range"
                  id="top_p"
                  name="top_p"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={formData.top_p}
                  onChange={handleInputChange}
                />
                <span>{formData.top_p}</span>
              </div>
              <p className="parameter-description">Controls diversity of word choices. Lower values make output more focused, higher values more diverse.</p>
            </div>
          </div>

          <button 
            type="submit" 
            className="generate-button"
            disabled={isGeneratingStory}
          >
            {isGeneratingStory ? "Generating..." : "Generate Story"}
          </button>
        </form>
      </section>

      {story && (
        <section className="result-section">
          <div className="story-container">
            <h2>Generated Story</h2>
            <div className="story-content">
              {story}
            </div>
            <button 
              onClick={generateImages} 
              className="generate-images-button"
              disabled={isGeneratingImages}
            >
              {isGeneratingImages ? "Generating Images..." : "Generate Images for this Story"}
            </button>
          </div>

          {/* Image description section will now appear after the story is generated */}
          <section className="parameter-section">
            <h2>Set Image Description</h2>
            <div className="form-group">
              <label htmlFor="imageDescription">Image Description</label>
              <textarea
                id="imageDescription"
                name="imageDescription"
                placeholder="Describe the kind of images you want (e.g., dreamy, surreal, nature-inspired)..."
                value={imageDescription}
                onChange={handleInputChange}
              />
              <p className="parameter-description">Describe the style, mood, or theme for the generated images.</p>
            </div>
          </section>

          {images.length > 0 && (
            <div className="images-container">
              <h2>Generated Images</h2>
              <div className="images-grid">
                {images.map((imagePath, index) => (
                  <div key={index} className="image-item">
                    <img src={`http://127.0.0.1:8000/${imagePath}`} alt={`Generated image ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <footer>
        <p>© 2025 Art Generator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default InputPage;
