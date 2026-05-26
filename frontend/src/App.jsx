import { useRef } from 'react';
import HeroSection from './components/HeroSection';
import RecordsPanel from './components/RecordsPanel';
import JerseyShowcase from './components/JerseyShowcase';
import ThreeDCarousel from './components/ThreeDCarousel';
import MilestonesTimeline from './components/MilestonesTimeline';
import TriviaQuiz from './components/TriviaQuiz';

function App() {
  const recordsRef = useRef(null);
  const galleryRef = useRef(null);
  const carouselRef = useRef(null);
  const timelineRef = useRef(null);
  const quizRef = useRef(null);

  const scrollToSection = (elementRef) => {
    if (elementRef.current) {
      window.scrollTo({
        top: elementRef.current.offsetTop - 80, // Offset for navbar
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Navigation Header */}
      <header className="app-header">
        <nav className="nav-container">
          <div className="logo-wrapper" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="logo-icon">👑</span>
            <span className="logo-text">KING<span className="text-red">KOHLI</span></span>
          </div>
          <ul className="nav-links">
            <li>
              <a href="#records" onClick={(e) => { e.preventDefault(); scrollToSection(recordsRef); }}>
                Records
              </a>
            </li>
            <li>
              <a href="#gallery" onClick={(e) => { e.preventDefault(); scrollToSection(galleryRef); }}>
                Jerseys
              </a>
            </li>
            <li>
              <a href="#library" onClick={(e) => { e.preventDefault(); scrollToSection(carouselRef); }}>
                3D Library
              </a>
            </li>
            <li>
              <a href="#chronicles" onClick={(e) => { e.preventDefault(); scrollToSection(timelineRef); }}>
                Chronicles
              </a>
            </li>
            <li>
              <a href="#quiz" onClick={(e) => { e.preventDefault(); scrollToSection(quizRef); }}>
                Quiz Challenge
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Sections */}
      <main>
        {/* Hero Banner with 3D backdrop */}
        <HeroSection 
          scrollToRecords={() => scrollToSection(recordsRef)} 
          scrollToGallery={() => scrollToSection(galleryRef)} 
        />

        {/* Dynamic Records & Stats Grid */}
        <div id="records" ref={recordsRef}>
          <RecordsPanel />
        </div>

        {/* 3D and Vector Jerseys Showcase */}
        <div id="gallery" ref={galleryRef}>
          <JerseyShowcase />
        </div>

        {/* 3D Rounding Carousel Library */}
        <div id="library" ref={carouselRef}>
          <ThreeDCarousel />
        </div>

        {/* Interactive Chronological Timeline */}
        <div id="chronicles" ref={timelineRef}>
          <MilestonesTimeline />
        </div>

        {/* Trivia Quiz Challenge */}
        <div id="quiz" ref={quizRef}>
          <TriviaQuiz />
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="app-footer">
        <div className="footer-logo">
          <span>KING</span><span className="text-red">KOHLI</span>
        </div>
        <p className="footer-quote">
          "Self-belief and hard work will always earn you success." — Virat Kohli
        </p>
        
        <ul className="footer-links">
          <li>
            <a href="#records" onClick={(e) => { e.preventDefault(); scrollToSection(recordsRef); }}>
              Career Statistics
            </a>
          </li>
          <li>
            <a href="#gallery" onClick={(e) => { e.preventDefault(); scrollToSection(galleryRef); }}>
              RCB Jerseys
            </a>
          </li>
          <li>
            <a href="#library" onClick={(e) => { e.preventDefault(); scrollToSection(carouselRef); }}>
              3D Library
            </a>
          </li>
          <li>
            <a href="#chronicles" onClick={(e) => { e.preventDefault(); scrollToSection(timelineRef); }}>
              Milestones
            </a>
          </li>
          <li>
            <a href="#quiz" onClick={(e) => { e.preventDefault(); scrollToSection(quizRef); }}>
              Quiz
            </a>
          </li>
        </ul>

        <p className="footer-copyright">
          © {new Date().getFullYear()} Kohli Legacy Portal. Designed for ultimate fans in premium RCB Crimson.
        </p>
      </footer>
    </>
  );
}

export default App;
