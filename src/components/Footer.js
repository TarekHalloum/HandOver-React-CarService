import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  const [showSitemap, setShowSitemap] = useState(false);

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-left">
          <img
            src="/assets/handover_logo.png"
            alt="HandOver Logo"
            className="footer-logo"
          />
        </div>

        <div className="footer-copy">
          © 2025 <span className="blue-link">HandOver</span>. All rights reserved.
        </div>

        <div className="footer-links">
          <Link to="#">FAQ</Link>
          <Link to="/contact">Contact us</Link>
          <Link to="#">A-Z</Link>

          <div
            className="sitemap-wrapper"
            onMouseEnter={() => setShowSitemap(true)}
            onMouseLeave={() => setShowSitemap(false)}
          >
            <span className="sitemap-link">Sitemap</span>
            {showSitemap && (
              <div className="sitemap-dropdown">
                <Link to="/ai-scan">Scan</Link>
                <Link to="/">Home</Link>
                <Link to="/contact">Contact</Link>
                <a href="/#about">About us</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
