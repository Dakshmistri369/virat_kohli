import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, RefreshCw } from 'lucide-react';

const ThreeDCarousel = () => {
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const timerRef = useRef(null);

  const cards = [
    {
      id: 1,
      title: "The Cover Drive",
      event: "Signature Shot",
      desc: "Widely regarded as the most aesthetically perfect shot in modern cricket history.",
      gradient: "linear-gradient(135deg, rgba(236, 178, 46, 0.15) 0%, rgba(255, 30, 39, 0.25) 100%)",
      borderColor: "#ecb22e",
      svg: (
        <svg viewBox="0 0 100 100" className="carousel-svg">
          <defs>
            <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ecb22e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ecb22e" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="40" fill="url(#glow1)" />
          {/* Batsman silhouette playing cover drive */}
          <path d="M25,80 L35,80 L45,65 L55,40 L62,35 L68,22 L72,25 L65,42 L52,65 L32,80 Z" fill="#ffffff" />
          <path d="M53,40 L65,15 L70,18 L58,42 Z" fill="#ecb22e" /> {/* Bat */}
          <circle cx="78" cy="12" r="3" fill="#ffffff" className="pulse-dot" /> {/* Ball */}
          <circle cx="68" cy="20" r="4" fill="#ff1e27" /> {/* Helmet */}
        </svg>
      )
    },
    {
      id: 2,
      title: "The King's Roar",
      event: "Hobart 133*",
      desc: "Celebrating with raw passion after chasing down 320 runs in just 36.4 overs.",
      gradient: "linear-gradient(135deg, rgba(255, 30, 39, 0.25) 0%, rgba(0, 0, 0, 0.8) 100%)",
      borderColor: "#ff1e27",
      svg: (
        <svg viewBox="0 0 100 100" className="carousel-svg">
          <defs>
            <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff1e27" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff1e27" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="40" fill="url(#glow2)" />
          {/* Roar Tiger/Crown Silhouette */}
          <path d="M30,75 L38,45 L50,30 L62,45 L70,75 L50,65 Z" fill="#ffffff" opacity="0.9" />
          <polygon points="50,15 56,28 70,28 58,36 63,50 50,40 37,50 42,36 30,28 44,28" fill="#ff1e27" />
          <path d="M35,55 C40,48 60,48 65,55" stroke="#ff1e27" strokeWidth="2" fill="none" />
        </svg>
      )
    },
    {
      id: 3,
      title: "The Chase Master",
      event: "Melbourne 82*",
      desc: "Steering India to victory vs Pakistan with two legendary sixes off Haris Rauf in 2022.",
      gradient: "linear-gradient(135deg, rgba(30, 144, 255, 0.15) 0%, rgba(10, 25, 47, 0.8) 100%)",
      borderColor: "#1e90ff",
      svg: (
        <svg viewBox="0 0 100 100" className="carousel-svg">
          <defs>
            <radialGradient id="glow3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e90ff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1e90ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="40" fill="url(#glow3)" />
          {/* Shield / Crown */}
          <path d="M30,30 L50,15 L70,30 L70,60 C70,75 50,85 50,85 C50,85 30,75 30,60 Z" fill="#ffffff" opacity="0.9" />
          <path d="M40,40 L50,32 L60,40 L55,55 L45,55 Z" fill="#1e90ff" />
          <circle cx="50%" cy="65" r="5" fill="#ff1e27" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Test Supremacy",
      event: "Mace Lift",
      desc: "Led India to the #1 Test ranking for 42 consecutive months with 40 match wins.",
      gradient: "linear-gradient(135deg, rgba(236, 178, 46, 0.15) 0%, rgba(20, 20, 20, 0.8) 100%)",
      borderColor: "#ecb22e",
      svg: (
        <svg viewBox="0 0 100 100" className="carousel-svg">
          <defs>
            <radialGradient id="glow4" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ecb22e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ecb22e" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="40" fill="url(#glow4)" />
          {/* Test Mace */}
          <rect x="47" y="35" width="6" height="45" rx="3" fill="#ffffff" />
          <circle cx="50%" cy="30" r="12" fill="#ecb22e" />
          <circle cx="50%" cy="30" r="8" fill="#ffffff" />
          <polygon points="50,12 53,20 62,20 55,25 58,33 50,28 42,33 45,25 38,20 47,20" fill="#ecb22e" />
        </svg>
      )
    },
    {
      id: 5,
      title: "50th ODI Century",
      event: "Wankhede Historic",
      desc: "Bow Down Celebration after breaking Sachin Tendulkar's long-standing world record.",
      gradient: "linear-gradient(135deg, rgba(255, 30, 39, 0.2) 0%, rgba(236, 178, 46, 0.2) 100%)",
      borderColor: "#ff1e27",
      svg: (
        <svg viewBox="0 0 100 100" className="carousel-svg">
          <defs>
            <radialGradient id="glow5" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff1e27" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff1e27" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="40" fill="url(#glow5)" />
          {/* Crown and 50 */}
          <polygon points="25,45 35,65 50,40 65,65 75,45 70,80 30,80" fill="#ffffff" />
          <text x="50" y="70" fill="#ff1e27" fontSize="22" fontWeight="900" textAnchor="middle">50</text>
          <circle cx="50" cy="25" r="4" fill="#ecb22e" />
        </svg>
      )
    },
    {
      id: 6,
      title: "V18 Run-Machine",
      event: "IPL 973 Runs",
      desc: "The historic 2016 season containing 4 centuries while playing with stitches in his hand.",
      gradient: "linear-gradient(135deg, rgba(255, 30, 39, 0.25) 0%, rgba(0, 0, 0, 0.9) 100%)",
      borderColor: "#ecb22e",
      svg: (
        <svg viewBox="0 0 100 100" className="carousel-svg">
          <defs>
            <radialGradient id="glow6" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ecb22e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ecb22e" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="40" fill="url(#glow6)" />
          {/* Flame & 18 */}
          <path d="M45,20 C45,20 60,35 50,55 C65,45 65,25 70,45 C75,65 55,85 50,85 C30,85 30,65 35,45 C40,25 45,20 45,20 Z" fill="#ff1e27" opacity="0.8" />
          <text x="50" y="72" fill="#ffffff" fontSize="24" fontWeight="900" textAnchor="middle">18</text>
        </svg>
      )
    }
  ];

  const totalCards = cards.length;
  const angleStep = 360 / totalCards;

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setRotation(prev => prev - angleStep);
      }, 3500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, angleStep]);

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

  return (
    <div className="carousel-container-outer">
      <div className="section-header center">
        <span className="accent-bar" />
        <h2>THE 3D CHRONICLES LIBRARY</h2>
        <p>Interactive 3D Carousel showcasing career defining eras</p>
      </div>

      <div className="carousel-view-port">
        <div 
          className="carousel-3d-scene"
          style={{
            transform: `rotateY(${rotation}deg)`
          }}
        >
          {cards.map((card, idx) => {
            const cardAngle = idx * angleStep;
            return (
              <div
                key={card.id}
                className={`carousel-card-3d ${hoveredIndex === idx ? 'hovered' : ''}`}
                style={{
                  transform: `rotateY(${cardAngle}deg) translateZ(280px)`,
                  background: card.gradient,
                  borderColor: card.borderColor
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
                  {card.svg}
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
