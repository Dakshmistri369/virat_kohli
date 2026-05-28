import { useEffect, useState } from 'react';

const ThreeCanvas = () => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Gentle parallax effect (moves slightly in opposition to mouse)
      const x = -(e.clientX / window.innerWidth - 0.5) * 15;
      const y = -(e.clientY / window.innerHeight - 0.5) * 15;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="hero-static-background"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        overflow: 'hidden',
        background: '#060608'
      }}
    >
      <div 
        style={{
          width: '108%',
          height: '108%',
          backgroundImage: 'url(/images/image.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 15%',
          opacity: 0.38,
          filter: 'grayscale(10%) contrast(110%) brightness(70%)',
          position: 'absolute',
          top: '-4%',
          left: '-4%',
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
          transition: 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      />
      {/* Intense dark radial vignette mask for maximum readability and drama */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 50%, rgba(227, 38, 54, 0.12) 0%, rgba(6, 6, 8, 0.7) 65%, rgba(6, 6, 8, 0.98) 100%)',
          zIndex: 1
        }}
      />
    </div>
  );
};

export default ThreeCanvas;
