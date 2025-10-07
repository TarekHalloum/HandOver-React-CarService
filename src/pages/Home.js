import '../styles/Home.css';
import { Link as ScrollLink } from 'react-scroll';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const howItWorksSteps = [  
      {
      text: " Scan",
      image: "/assets/scanH.png",
      alt: "AI scanning"
    },
    {
      text: " Upload",
      image: "/assets/upload.png",
      alt: "Upload your car"
    },

    {
      text: " Connect!",
      image: "/assets/connect.png",
      alt: "Connect with repairers"
    }
  ];

  const [howItWorksIndex, setHowItWorksIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [showSitemap, setShowSitemap] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setHowItWorksIndex((prevIndex) =>
          prevIndex === howItWorksSteps.length - 1 ? 0 : prevIndex + 1
        );
        setFadeIn(true);
      }, 200);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section with Video Background */}
      <section className="hero-section">
        <video autoPlay muted loop className="background-video">
          <source src="/assets/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

      </section>
        <div className="hero-content">
          <h1>Welcome to HandOver</h1>
          <p>Your AI-powered platform for car damage detection.</p>
          <div className="hero-buttons">
            <a href="#about" className="btn btn-primary">Learn More</a>
            <a href="/ai-scan" className="btn btn-primary">Scan Now</a>
          </div>
        </div>
      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-boxes">
          <div className="about-box">
            <h3>Upload Your Car</h3>
            <p>Users can easily upload images of their car showing the damaged area.</p>
          </div>
          <div className="about-box">
            <h3>AI Detection</h3>
            <p>Our AI model analyzes the image and identifies the damaged parts automatically.</p>
          </div>
          <div className="about-box">
            <h3>Repair Support</h3>
            <p>Mechanics can view detected issues and provide suitable repair options.</p>
          </div>
        </div>
      </section>

      {/* Cover Brands Section */}
      <section className="cover-brands">
        <div className="slider-text">
          <p>Brand we cover</p>
        </div>
        <div className="brand-slider">
          <div className="brand-track">
            {["skoda", "jeep", "honda", "subaru", "mazda", "porshe"].map((brand, idx) => (
              <img key={idx} src={`/logos/${brand}.png`} alt={brand} />
            ))}
            {["skoda", "jeep", "honda", "subaru", "mazda", "porshe"].map((brand, idx) => (
              <img key={`dup-${idx}`} src={`/logos/${brand}.png`} alt={brand} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="how-it-works-content">
          <h2>How It Works</h2>
          <div className={`how-it-works-slider ${fadeIn ? 'fade-in' : ''}`}>
            <img
              src={howItWorksSteps[howItWorksIndex].image}
              alt={howItWorksSteps[howItWorksIndex].alt}
            />
            <p>{howItWorksSteps[howItWorksIndex].text}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer></footer>
    </div>
  );
}

export default Home;
