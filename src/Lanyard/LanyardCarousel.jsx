import { useState, useEffect, useCallback, useRef } from 'react';
import Lanyard from './Lanyard.jsx';
import profile1 from '../../assets/profile/1.jpg';
import profile2 from '../../assets/profile/2.jpeg';
import profile3 from '../../assets/profile/3.jpeg';
import profile4 from '../../assets/profile/4.jpeg';
import profile5 from '../../assets/profile/5.jpeg';

const profiles = [
  { front: profile1, back: profile2 },
  { front: profile2, back: profile3 },
  { front: profile3, back: profile4 },
  { front: profile4, back: profile5 },
  { front: profile5, back: profile1 },
];

export default function LanyardCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const next = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % profiles.length);
  }, []);

  const prev = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + profiles.length) % profiles.length);
  }, []);

  // Auto-advance every 5 seconds, pause on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isPaused, next, activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) prev();
      else next();
    }
    touchStartX.current = null;
  };

  const current = profiles[activeIndex];

  return (
    <div
      className="lanyard-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Lanyard
        key={activeIndex}
        position={[0, 0, 20]}
        gravity={[0, -40, 0]}
        frontImage={current.front}
        backImage={current.back}
        imageFit="cover"
      />

      <button
        className="lanyard-nav lanyard-nav-prev"
        onClick={prev}
        aria-label="Lanyard sebelumnya"
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      <button
        className="lanyard-nav lanyard-nav-next"
        onClick={next}
        aria-label="Lanyard berikutnya"
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      <div className="lanyard-dots">
        {profiles.map((_, i) => (
          <button
            key={i}
            className={`lanyard-dot ${i === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`Lanyard ${i + 1}`}
          />
        ))}
      </div>

      <div className="lanyard-counter">
        {activeIndex + 1} / {profiles.length}
      </div>
    </div>
  );
}
