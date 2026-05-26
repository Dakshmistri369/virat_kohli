import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio('/audio/rcb_2020_anthem.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4; // 40% volume

    // Auto-hide tooltip after 8 seconds
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setShowTooltip(false);
        })
        .catch((err) => {
          console.error("Autoplay blocked or playback error:", err);
        });
    }
  };

  return (
    <div className="audio-player-wrapper">
      {showTooltip && (
        <div className="audio-tooltip fade-in">
          <span>🎵 Tap to play RCB Theme Song!</span>
        </div>
      )}
      
      <button 
        className={`audio-toggle-btn ${isPlaying ? 'playing' : ''}`}
        onClick={togglePlayback}
        aria-label="Toggle background music"
        title={isPlaying ? "Mute Music" : "Play Music"}
      >
        <div className="audio-icon-container">
          {isPlaying ? (
            <div className="audio-wave">
              <span className="wave-bar bar-1"></span>
              <span className="wave-bar bar-2"></span>
              <span className="wave-bar bar-3"></span>
            </div>
          ) : (
            <Music size={18} />
          )}
        </div>
      </button>
    </div>
  );
};

export default AudioPlayer;
