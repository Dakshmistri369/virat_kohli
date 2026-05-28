import ThreeCanvas from './ThreeCanvas';
import JerseyCard from './JerseyCard';
import { ChevronDown, ArrowRight, ShieldCheck } from 'lucide-react';

const HeroSection = ({ scrollToRecords, scrollToGallery }) => {
  return (
    <div className="hero-section">
      {/* 3D background canvas */}
      <ThreeCanvas />

      {/* Glassmorphic main content overlay */}
      <div className="hero-grid-container">
        
        <div className="hero-text-content">
          <div className="badge-tag">
            <span className="gold-dot" />
            <span>EXCLUSIVE FAN PORTAL</span>
          </div>
          
          <h1 className="hero-main-title">
            KING <span className="highlight-text-red">KOHLI</span> 
            <br />
            <span className="highlight-text-gold font-accent">LEGACY</span>
          </h1>
          
          <p className="hero-subtitle">
            "Self-belief and hard work will always earn you success. 🏏🔥 Whatever you want to do, do it with full passion, work extremely hard, and don't look anywhere else! 🚀👑 The comeback is always greater than the setback." 🦁💪
          </p>

          <div className="hero-action-buttons">
            <button className="btn-primary" onClick={scrollToRecords}>
              <span>View Record Book</span>
              <ArrowRight size={18} />
            </button>
            <button className="btn-secondary" onClick={scrollToGallery}>
              <span>Explore Jerseys</span>
            </button>
          </div>

          <div className="tech-badge-row">
            <div className="tech-badge">
              <ShieldCheck size={14} className="text-gold" />
              <span>Full MERN Stack</span>
            </div>
            <div className="tech-badge">
              <span className="red-dot" />
              <span>Three.js WebGL</span>
            </div>
          </div>
        </div>

        {/* 3D Tilting Jersey Card on Right */}
        <div className="hero-jersey-container">
          <JerseyCard />
        </div>

      </div>

      <div className="hero-scroll-indicator" onClick={scrollToRecords}>
        <span>SCROLL TO DISCOVER</span>
        <ChevronDown className="bounce-arrow" />
      </div>
    </div>
  );
};

export default HeroSection;
