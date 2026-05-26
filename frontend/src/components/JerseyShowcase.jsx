import { useState } from 'react';
import { Shirt, ZoomIn, Heart, RefreshCw } from 'lucide-react';

const JerseyShowcase = () => {
  const [favorites, setFavorites] = useState({});
  const [selectedJersey, setSelectedJersey] = useState(null);

  const jerseyCollection = [
    {
      id: 'rcb-2016',
      title: '2016 Vintage Run-Machine',
      year: 2016,
      desc: 'The record-breaking season where Kohli scored 973 runs and 4 centuries. Features clean gold shoulders with deep red body panels.',
      colors: { top: '#1c1c1f', bottom: '#e11d23', trim: '#ecb22e' },
      isSignature: true,
      stats: '973 Runs | 4 Hundreds'
    },
    {
      id: 'rcb-2021',
      title: '2021 Captaincy Legacy',
      year: 2021,
      desc: 'The iconic dark-blue gradient blend with primary red and a bold gold lion symbol. Kohli led RCB to the playoffs in this armor.',
      colors: { top: '#0b162c', bottom: '#d31c22', trim: '#e0a927' },
      isSignature: false,
      stats: 'Captain Era | 400+ Runs'
    },
    {
      id: 'rcb-2024',
      title: '2024 Modern Royalty',
      year: 2024,
      desc: 'Featuring RCB\'s transition to Royal Blue and Crimson Red with gold foil text. Represented the 50th century celebration phase.',
      colors: { top: '#052c65', bottom: '#da1e28', trim: '#f1c40f' },
      isSignature: true,
      stats: 'Orange Cap Winner | 741 Runs'
    },
    {
      id: 'rcb-2026',
      title: '2026 Concept Playoff',
      year: 2026,
      desc: 'A futuristic design representing the current playoff season. Features dark carbon fiber textures, vibrant crimson, and neon gold highlights.',
      colors: { top: '#111115', bottom: '#ff0f1a', trim: '#ffd700' },
      isSignature: true,
      stats: 'Next Gen | Carbon Red'
    }
  ];

  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="jersey-showcase-section">
      <div className="section-header">
        <span className="accent-bar" />
        <h2>THE JERSEY GALLERY</h2>
        <p>Explore the evolution of Virat Kohli's Royal Challengers Bengaluru battle armor</p>
      </div>

      <div className="jersey-grid">
        {jerseyCollection.map((jersey) => (
          <div key={jersey.id} className="jersey-item-card">
            
            <div className="jersey-canvas-wrapper" style={{
              background: `radial-gradient(circle at 50% 30%, ${jersey.colors.top}88 0%, #111113 100%)`
            }}>
              
              {/* Overlay Badges */}
              <div className="jersey-badges">
                <span className="jersey-year-badge">{jersey.year}</span>
                {jersey.isSignature && <span className="jersey-sig-badge">SIGNATURE EDITION</span>}
              </div>

              {/* Heart/Like Button */}
              <button 
                className={`fav-button ${favorites[jersey.id] ? 'liked' : ''}`}
                onClick={() => toggleFavorite(jersey.id)}
              >
                <Heart size={18} fill={favorites[jersey.id] ? '#ff1e27' : 'none'} stroke={favorites[jersey.id] ? '#ff1e27' : '#ffffff'} />
              </button>

              {/* Jersey Vector Design */}
              <div className="showcase-svg-container">
                <svg width="150" height="180" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id={`grad-${jersey.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={jersey.colors.top} />
                      <stop offset="50%" stopColor={jersey.colors.top} />
                      <stop offset="65%" stopColor={jersey.colors.bottom} />
                      <stop offset="100%" stopColor={jersey.colors.bottom} />
                    </linearGradient>
                    <filter id="shadow">
                      <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.5" />
                    </filter>
                  </defs>
                  
                  {/* Jersey Outline */}
                  <path 
                    d="M 40,30 L 160,30 L 175,95 L 145,105 L 140,210 L 60,210 L 55,105 L 25,95 Z" 
                    fill={`url(#grad-${jersey.id})`}
                    stroke={jersey.colors.trim}
                    strokeWidth="1.5"
                    filter="url(#shadow)"
                  />

                  {/* Collar */}
                  <path d="M 85,30 Q 100,52 115,30" fill="none" stroke={jersey.colors.trim} strokeWidth="3.5" />
                  
                  {/* Stripes / Decals based on year */}
                  {jersey.year === 2016 && (
                    <>
                      <path d="M 40,30 L 70,80" stroke={jersey.colors.trim} strokeWidth="2.5" />
                      <path d="M 160,30 L 130,80" stroke={jersey.colors.trim} strokeWidth="2.5" />
                    </>
                  )}
                  {jersey.year === 2021 && (
                    <path d="M 60,130 Q 100,100 140,130" stroke={jersey.colors.trim} strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6" />
                  )}
                  {jersey.year === 2024 && (
                    <circle cx="100" cy="115" r="28" stroke={jersey.colors.trim} strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
                  )}
                  {jersey.year === 2026 && (
                    <>
                      <path d="M 50,110 L 150,110" stroke={jersey.colors.trim} strokeWidth="2" opacity="0.3" />
                      <path d="M 45,170 L 155,170" stroke={jersey.colors.trim} strokeWidth="2" opacity="0.3" />
                    </>
                  )}

                  {/* Back Details */}
                  <text x="100" y="145" textAnchor="middle" fill={jersey.colors.trim} fontFamily="'Montserrat', 'Outfit', sans-serif" fontWeight="900" fontSize="22" letterSpacing="1">KOHLI</text>
                  <text x="100" y="195" textAnchor="middle" fill="#ffffff" fontFamily="'Outfit', sans-serif" fontWeight="950" fontSize="44">18</text>
                </svg>
              </div>

              {/* Zoom overlay */}
              <div className="jersey-zoom-overlay" onClick={() => setSelectedJersey(jersey)}>
                <ZoomIn size={24} />
                <span>Specs & Details</span>
              </div>
            </div>

            <div className="jersey-info">
              <h3>{jersey.title}</h3>
              <span className="jersey-stat-highlight">{jersey.stats}</span>
              <p>{jersey.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedJersey && (
        <div className="modal-overlay" onClick={() => setSelectedJersey(null)}>
          <div className="jersey-modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedJersey(null)}>×</button>
            <div className="modal-grid">
              <div className="modal-visual" style={{
                background: `radial-gradient(circle, ${selectedJersey.colors.top}aa 0%, #0d0d0f 100%)`
              }}>
                <svg width="220" height="260" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M 40,30 L 160,30 L 175,95 L 145,105 L 140,210 L 60,210 L 55,105 L 25,95 Z" 
                    fill={`url(#grad-${selectedJersey.id})`}
                    stroke={selectedJersey.colors.trim}
                    strokeWidth="2"
                  />
                  <path d="M 85,30 Q 100,52 115,30" fill="none" stroke={selectedJersey.colors.trim} strokeWidth="4" />
                  <text x="100" y="145" textAnchor="middle" fill={selectedJersey.colors.trim} fontFamily="'Outfit', sans-serif" fontWeight="900" fontSize="24" letterSpacing="1.5">KOHLI</text>
                  <text x="100" y="195" textAnchor="middle" fill="#ffffff" fontFamily="'Outfit', sans-serif" fontWeight="950" fontSize="48">18</text>
                </svg>
              </div>
              <div className="modal-details">
                <span className="modal-year">{selectedJersey.year} EDITION</span>
                <h2>{selectedJersey.title}</h2>
                <div className="modal-divider" />
                <p className="modal-desc">{selectedJersey.desc}</p>
                <div className="modal-specs">
                  <div className="spec-row">
                    <span>Performance Rating</span>
                    <span className="spec-val text-gold">★ ★ ★ ★ ★</span>
                  </div>
                  <div className="spec-row">
                    <span>Milestones Highlight</span>
                    <span className="spec-val text-red">{selectedJersey.stats}</span>
                  </div>
                  <div className="spec-row">
                    <span>Colorway</span>
                    <span className="spec-val">RCB Premium Gold/Crimson</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JerseyShowcase;
