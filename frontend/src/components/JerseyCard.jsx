import { useState, useRef } from 'react';

const JerseyCard = () => {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Mouse position relative to the element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized position (-0.5 to 0.5)
    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;
    
    // Rotation calculations (max 20 degrees)
    const rotateX = -normalizedY * 25;
    const rotateY = normalizedX * 25;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div className="jersey-card-wrapper">
      <div 
        className={`jersey-3d-card ${isHovered ? 'hovered' : ''}`}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: isHovered ? 'none' : 'transform 0.5s ease-out'
        }}
      >
        <div className="jersey-glass">
          <div className="card-shine" style={{
            background: isHovered 
              ? `radial-gradient(circle at ${((rotate.y / 25) + 0.5) * 100}% ${(-(rotate.x / 25) + 0.5) * 100}%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)`
              : 'none'
          }} />
          
          <div className="jersey-brand">
            <div className="jersey-logo-container">
              <img 
                src="/images/rcb-logo.svg" 
                alt="RCB Logo" 
                className="rcb-logo-img" 
              />
              <span className="gold-text">RCB OFFICIAL</span>
            </div>
            <div className="gold-badge">18</div>
          </div>
          
          <div className="jersey-image-container">
            <img 
              src="/images/image.jpg" 
              alt="King's Armour" 
              className="jersey-card-photo"
              loading="eager"
            />
          </div>

          <div className="jersey-details">
            <span className="jersey-title">KING'S ARMOUR</span>
            <p className="jersey-desc">2026 Official Playoff Edition</p>
            <div className="glow-bar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JerseyCard;
