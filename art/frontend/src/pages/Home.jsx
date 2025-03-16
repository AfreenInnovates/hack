import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();
  
    const handleGetStarted = () => {
        navigate("/input");
    };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero">
        <h1>Welcome to Art Generator</h1>
        <p>Generate stunning AI-powered images effortlessly.</p>
        <button className="cta-button" onClick={handleGetStarted}>Get Started</button>
      </header>

      {/* Features Section */}
      <section className="features">
        {["Fast & Efficient", "High Quality", "Customizable"].map((title, index) => (
          <div key={index} className="feature-card">
            <h2>{title}</h2>
            <p>
              {title === "Fast & Efficient"
                ? "Generate images in seconds with advanced AI."
                : title === "High Quality"
                ? "Receive crisp, detailed, and professional-grade images."
                : "Modify parameters to get the perfect results."}
            </p>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          {["Upload Your Prompt", "Select Preferences", "Generate & Download"].map((step, index) => (
            <div key={index} className="step">
              <span className="step-number">{index + 1}</span>
              <h3>{step}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
        <section className="gallery">
        <h2>Explore AI Art</h2>
        <div className="gallery-grid">
            {[
            { id: 2, src: "/images/Alex_had_always/Alex_had_a_1.jpeg", alt: "AI Art 2" },
            { id: 3, src: "/images/Alex_had_always/Alex_had_a_5.jpeg", alt: "AI Art 3" },
            { id: 4, src: "/images/Once_upon_a_tim/Once_upon_1.jpeg", alt: "AI Art 4" },
            { id: 5, src: "/images/Once_upon_a_tim/Once_upon_5.jpeg", alt: "AI Art 5" },
            ].map((image) => (
            <div key={image.id} className="gallery-item">
                <img src={image.src} alt={image.alt} className="gallery-image" />
            </div>
            ))}
        </div>
        </section>


      {/* Pricing Plans */}
      <section className="pricing">
        <h2>Choose Your Plan</h2>
        <div className="pricing-grid">
          {[
            { title: "Free", price: "$0/mo", features: ["Basic Generations", "Limited Access"] },
            { title: "Pro", price: "$9.99/mo", features: ["HD Images", "Faster Processing", "More Customization"] },
            { title: "Premium", price: "$19.99/mo", features: ["Unlimited Generations", "Priority Access", "Exclusive Styles"] },
          ].map((plan, index) => (
            <div key={index} className="pricing-card">
              <h3>{plan.title}</h3>
              <p className="price">{plan.price}</p>
              <ul>
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <button className="subscribe-button">Choose {plan.title}</button>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="newsletter">
        <h2>Stay Updated</h2>
        <p>Subscribe to our newsletter for the latest AI-generated art trends.</p>
        <div className="newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Art Generator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
