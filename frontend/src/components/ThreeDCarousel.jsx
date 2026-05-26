import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, RefreshCw, Smartphone } from 'lucide-react';

const ThreeDCarousel = () => {
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startRotation = useRef(0);
  const timerRef = useRef(null);

  const cards = [
    {
      id: 1,
      title: "The Cover Drive",
      event: "Classic Technique",
      desc: "Perfect wrist position and high elbow, demonstrating absolute batting mastery.",
      image: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_2015_CWC.jpg",
      borderColor: "#ecb22e",
      gradient: "rgba(236, 178, 46, 0.08)",
      svg: (
        <svg viewBox="0 0 100 100" className="carousel-svg-fallback">
          <defs>
            <radialGradient id="f1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ecb22e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ecb22e" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="40" fill="url(#f1)" />
          <path d="M25,80 L35,80 L45,65 L55,40 L62,35 L68,22 L72,25 L65,42 L52,65 L32,80 Z" fill="#ffffff" />
          <path d="M53,40 L65,15 L70,18 L58,42 Z" fill="#ecb22e" />
          <circle cx="78" cy="12" r="3" fill="#ffffff" className="pulse-dot" />
          <circle cx="68" cy="20" r="4" fill="#ff1e27" />
        </svg>
      )
    },
    {
      id: 2,
      title: "The King's Roar",
      event: "Passion & Fire",
      desc: "His trademark passionate century celebration that defines his aggressive spirit.",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Virat_Kohli_celebrating_his_century_against_England%2C_15_January_2017.jpg",
      borderColor: "#ff1e27",
      gradient: "rgba(255, 30, 39, 0.08)",
      svg: (
        <svg viewBox="0 0 100 100" className="carousel-svg-fallback">
          <defs>
            <radialGradient id="f2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff1e27" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff1e27" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="40" fill="url(#f2)" />
          <path d="M30,75 L38,45 L50,30 L62,45 L70,75 L50,65 Z" fill="#ffffff" />
          <polygon points="50,15 56,28 70,28 58,36 63,50 50,40 37,50 42,36 30,28 44,28" fill="#ff1e27" />
        </svg>
      )
    },
    {
      id: 3,
      title: "2016 Peak Era",
      event: "973 IPL Runs",
      desc: "Unprecedented dominance in T20 cricket, scoring 4 centuries in a single season.",
      image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Virat_Kohli_in_2016.jpg",
      borderColor: "#ecb22e",
      gradient: "rgba(236, 178, 46, 0.08)",
      svg: (
        <svg viewBox="0 0 100 100" className="carousel-svg-fallback">
          <defs>
            <radialGradient id="f3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ecb22e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ecb22e" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="40" fill="url(#f3)" />
          <path d="M45,20 C45,20 60,35 50,55 C65,45 65,25 70,45 C75,65 55,85 50,85 C30,85 30,65 35,45 C40,25 45,20 45,20 Z" fill="#ff1e27" />
          <text x="50" y="72" fill="#ffffff" fontSize="24" fontWeight="900" textAnchor="middle">18</text>
        </svg>
      )
    },
    {
      id: 4,
      title: "Test Leader",
      event: "Mace Champion",
      desc: "Led the Indian Test side with absolute discipline to the world number one spot.",
      image: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Virat_Kohli_at_New_Delhi.jpg",
      borderColor: "#ffffff",
      gradient: "rgba(255, 255, 255, 0.06)",
      svg: (
        <svg viewBox="0 0 100 100" className="carousel-svg-fallback">
          <defs>
            <radialGradient id="f4" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="40" fill="url(#f4)" />
          <rect x="47" y="35" width="6" height="45" rx="3" fill="#ffffff" />
          <circle cx="50%" cy="30" r="12" fill="#ecb22e" />
          <circle cx="50%" cy="30" r="8" fill="#ffffff" />
        </svg>
      )
    },
    {
      id: 5,
      title: "Master Class",
      event: "The Run Machine",
      desc: "Consistently scoring across all conditions, cementing his status as a modern great.",
      image: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Virat_Kohli_in_2018.jpg",
      borderColor: "#ff1e27",
      gradient: "rgba(255, 30, 39, 0.08)",
      svg: (
        <svg viewBox="0 0 100 100" className="carousel-svg-fallback">
          <defs>
            <radialGradient id="f5" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff1e27" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff1e27" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="40" fill="url(#f5)" />
          <polygon points="25,45 35,65 50,40 65,65 75,45 70,80 30,80" fill="#ffffff" />
          <text x="50" y="70" fill="#ff1e27" fontSize="22" fontWeight="900" textAnchor="middle">50</text>
        </svg>
      )
    },
    {
      id: 6,
      title: "Signature Style",
      event: "Chase Master",
      desc: "The anchor of Team India, pulling off impossible second-innings targets with ease.",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/56/Virat_Kohli_2012.jpg",
      borderColor: "#ecb22e",
      gradient: "rgba(236, 178, 46, 0.08)",
      svg: (
        <svg viewBox="0 0 100 100" className="carousel-svg-fallback">
          <defs>
            <radialGradient id="f6" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ecb22e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ecb22e" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="40" fill="url(#f6)" />
          <path d="M30,30 L50,15 L70,30 L70,60 C70,75 50,85 50,85 C50,85 30,75 30,60 Z" fill="#ffffff" />
          <circle cx="50%" cy="55" r="8" fill="#ecb22e" />
        </svg>
      )
    }
  ];

  const totalCards = cards.length;
  const angleStep = 360 / totalCards;

  // Auto-play interval
  useEffect(() => {
    if (isPlaying && !isDragging.current) {
      timerRef.current = setInterval(() => {
        setRotation(prev => prev - angleStep);
      }, 3500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, angleStep]);

  // Touch and Drag Controllers
  const handleDragStart = (clientX) => {
    isDragging.current = true;
    startX.current = clientX;
    startRotation.current = rotation;
    setIsPlaying(false);
  };

  const handleDragMove = (clientX) => {
    if (!isDragging.current) return;
    const deltaX = clientX - startX.current;
    // Map touch movement pixels to degrees rotation
    const rotationFactor = 0.45;
    setRotation(startRotation.current + (deltaX * rotationFactor));
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  // Button manual controls
  const handlePrev = () => {
    setRotation(prev => prev + angleStep);
    setIsPlaying(false);
  };

  const handleNext = () => {
    setRotation(prev => prev - angleStep);
    setIsPlaying(false);
  };

  const resetRotation = () => {
    setRotation(0);
    setIsPlaying(true);
  };

  const handleImageError = (cardId) => {
    setImageErrors(prev => ({ ...prev, [cardId]: true }));
  };

  return (
    <div className="carousel-container-outer">
      <div className="section-header center">
        <span className="accent-bar" />
        <h2>THE 3D CHRONICLES LIBRARY</h2>
        <p>Interactive 3D Carousel showcasing career defining eras</p>
        <div className="drag-hint">
          <Smartphone size={14} />
          <span>Swipe or Drag to Rotate the Gallery</span>
        </div>
      </div>

      <div 
        className="carousel-view-port"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div 
          className="carousel-3d-scene"
          style={{
            transform: `rotateY(${rotation}deg)`
          }}
        >
          {cards.map((card, idx) => {
            const cardAngle = idx * angleStep;
            const hasError = imageErrors[card.id];

            return (
              <div
                key={card.id}
                className={`carousel-card-3d ${hoveredIndex === idx ? 'hovered' : ''}`}
                style={{
                  transform: `rotateY(${cardAngle}deg) translateZ(var(--tz-distance))`,
                  borderColor: card.borderColor,
                  background: `linear-gradient(to bottom, ${card.gradient} 0%, rgba(10, 10, 12, 0.98) 100%)`
                }}
                onMouseEnter={() => {
                  setHoveredIndex(idx);
                  setIsPlaying(false);
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setIsPlaying(true);
                }}
              >
                <div className="card-3d-header">
                  <span className="card-badge" style={{ backgroundColor: card.borderColor }}>
                    {card.event}
                  </span>
                </div>
                
                <div className="card-3d-visual">
                  {!hasError ? (
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      className="card-kohli-image"
                      loading="lazy" 
                      onError={() => handleImageError(card.id)}
                    />
                  ) : (
                    <div className="fallback-svg-container">
                      {card.svg}
                    </div>
                  )}
                  <div className="image-overlay-glow" style={{ boxShadow: `inset 0 0 20px ${card.borderColor}80` }} />
                </div>

                <div className="card-3d-body">
                  <h4>{card.title}</h4>
                  <p>{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="carousel-controls">
        <button className="control-btn" onClick={handlePrev} title="Previous Era">
          <ChevronLeft size={20} />
        </button>

        <button 
          className="control-btn play-pause" 
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? "Pause Autoplay" : "Resume Autoplay"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <button className="control-btn" onClick={handleNext} title="Next Era">
          <ChevronRight size={20} />
        </button>

        <button className="control-btn" onClick={resetRotation} title="Reset Rotation">
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
};

export default ThreeDCarousel;
