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
            <span className="gold-text">RCB OFFICAL</span>
            <div className="gold-badge">18</div>
          </div>
          
          <div className="jersey-svg-container">
            {/* Custom SVG of the red & gold/black RCB Jersey */}
            <svg className="rcb-jersey-svg" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="rcbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1e1e24" /> {/* Dark top */}
                  <stop offset="45%" stopColor="#2c1b20" /> 
                  <stop offset="60%" stopColor="#d31e25" /> {/* Red bottom */}
                  <stop offset="100%" stopColor="#890e11" />
                </linearGradient>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffe683" />
                  <stop offset="50%" stopColor="#e5b842" />
                  <stop offset="100%" stopColor="#9a7114" />
                </linearGradient>
                <filter id="jerseyShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#000000" floodOpacity="0.4"/>
                </filter>
              </defs>
              
              {/* Jersey Body */}
              <path 
                d="M 40,30 L 160,30 L 175,95 L 145,105 L 140,210 L 60,210 L 55,105 L 25,95 Z" 
                fill="url(#rcbGrad)" 
                stroke="url(#goldGrad)" 
                strokeWidth="1.5"
                filter="url(#jerseyShadow)"
              />
              
              {/* Gold Collar Trim */}
              <path d="M 85,30 Q 100,50 115,30" fill="none" stroke="url(#goldGrad)" strokeWidth="4" strokeLinecap="round" />
              <path d="M 85,30 L 100,60 L 115,30" fill="url(#goldGrad)" opacity="0.3" />

              {/* Sleeve Gold Borders */}
              <path d="M 25,95 L 43,89" stroke="url(#goldGrad)" strokeWidth="3" />
              <path d="M 175,95 L 157,89" stroke="url(#goldGrad)" strokeWidth="3" />
              
              {/* Golden Stripes / Accents (RCB Style) */}
              <path d="M 60,110 L 140,110" stroke="url(#goldGrad)" strokeWidth="2" strokeDasharray="5,3" opacity="0.4" />
              
              {/* King Kohli Signature Print Back Design */}
              <text x="100" y="145" textAnchor="middle" fill="url(#goldGrad)" fontFamily="'Montserrat', 'Outfit', sans-serif" fontWeight="900" fontSize="24" letterSpacing="2">KOHLI</text>
              <text x="100" y="195" textAnchor="middle" fill="#ffffff" fontFamily="'Outfit', sans-serif" fontWeight="900" fontSize="48" letterSpacing="1">18</text>
              
              {/* Golden Lion/RCB Outline on chest */}
              <circle cx="100" cy="90" r="14" stroke="url(#goldGrad)" strokeWidth="1.2" opacity="0.4" fill="none"/>
              <path d="M 97,85 L 103,85 L 100,80 Z" fill="url(#goldGrad)" opacity="0.4"/>
            </svg>
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
