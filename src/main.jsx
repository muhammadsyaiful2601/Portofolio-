import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Lanyard from './Lanyard/Lanyard.jsx';
import profile1 from '../assets/profile/1.jpg';
import profile2 from '../assets/profile/2.jpeg';
import profile3 from '../assets/profile/3.jpeg';
import profile4 from '../assets/profile/4.jpeg';
import profile5 from '../assets/profile/5.jpeg';
import CardSwap, { Card } from './CardSwap/CardSwap.jsx';
import puzzleImg from '../assets/website/puzzle.jpg';
import kalkulatorImg from '../assets/website/kalkulator ngawur.jpg';
import eventImg from '../assets/website/Event Kampus.jpg';
import webgisImg from '../assets/website/WebGis.jpg';
import jadwalImg from '../assets/website/Jadwal Kampus.jpg';
import InfiniteMenu from './InfiniteMenu/InfiniteMenu.jsx';
import foto1 from '../assets/foto perjalanan/IMG_20250502_211314.jpg';
import foto2 from '../assets/foto perjalanan/IMG_20250502_211317.jpg';
import foto3 from '../assets/foto perjalanan/IMG_20250502_211326.jpg';
import foto4 from '../assets/foto perjalanan/IMG_20250502_211320.jpg';
import foto5 from '../assets/foto perjalanan/IMG_20250502_211323.jpg';
import foto6 from '../assets/foto perjalanan/IMG_20250502_211326 1.jpg';
import './Lanyard/Lanyard.css';

const profiles = [
  { front: profile1, back: profile2 },
  { front: profile2, back: profile3 },
  { front: profile3, back: profile4 },
  { front: profile4, back: profile5 },
  { front: profile5, back: profile1 },
];

function LanyardCarousel() {
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

function Projects() {
  return (
    <div className="projects-swap-wrapper">
      <CardSwap
        width={460}
        height={340}
        cardDistance={50}
        verticalDistance={60}
        delay={4000}
        pauseOnHover={true}
        skewAmount={6}
        easing="elastic"
      >
        <Card>
          <img className="card-image" src={puzzleImg} alt="Game Puzzle" />
          <div className="card-body">
            <h3>Game Puzzle Sederhana</h3>
            <p>Puzzle interaktif yang dapat menyelesaikan dirinya sendiri dengan fitur auto-solve. Dibangun dengan JavaScript murni.</p>
          </div>
        </Card>
        <Card>
          <img className="card-image" src={kalkulatorImg} alt="Kalkulator Ngawur" />
          <div className="card-body">
            <h3>Kalkulator Ngawur</h3>
            <p>Kalkulator unik dengan jawaban yang selalu tidak terduga dan sentuhan humor di setiap perhitungan.</p>
          </div>
        </Card>
        <Card>
          <img className="card-image" src={eventImg} alt="Event Kampus" />
          <div className="card-body">
            <h3>Event Kampus</h3>
            <p>Website informasi dan dokumentasi acara-acara yang diselenggarakan di lingkungan kampus.</p>
          </div>
        </Card>
        <Card>
          <img className="card-image" src={webgisImg} alt="WebGIS" />
          <div className="card-body">
            <h3>WebGIS</h3>
            <p>Aplikasi Geographic Information System berbasis web untuk visualisasi data spasial dan pemetaan.</p>
          </div>
        </Card>
        <Card>
          <img className="card-image" src={jadwalImg} alt="Jadwal Kampus" />
          <div className="card-body">
            <h3>Jadwal Kampus</h3>
            <p>Website untuk melihat dan mengelola jadwal perkuliahan dengan tampilan yang informatif dan mudah digunakan.</p>
          </div>
        </Card>
      </CardSwap>
    </div>
  );
}

const mount = document.getElementById('lanyardMount');

if (mount) {
  createRoot(mount).render(<LanyardCarousel />);
}

const galleryItems = [
  { image: foto1, link: foto1, title: 'Foto 1', description: 'Momen perjalanan yang tak terlupakan' },
  { image: foto2, link: foto2, title: 'Foto 2', description: 'Dokumentasi petualangan seru' },
  { image: foto3, link: foto3, title: 'Foto 3', description: 'Kenangan indah di setiap perjalanan' },
  { image: foto4, link: foto4, title: 'Foto 4', description: 'Setiap foto punya ceritanya sendiri' },
  { image: foto5, link: foto5, title: 'Foto 5', description: 'Jejak langkah yang penuh makna' },
  { image: foto6, link: foto6, title: 'Foto 6', description: 'Petualangan yang tak akan terlupakan' },
];

function Gallery() {
  return (
    <div className="gallery-infinite-wrapper">
      <InfiniteMenu items={galleryItems} scale={1.5} />
    </div>
  );
}

const projectsMount = document.getElementById('projectsMount');

if (projectsMount) {
  createRoot(projectsMount).render(<Projects />);
}

const galleryMount = document.getElementById('galleryMount');

if (galleryMount) {
  createRoot(galleryMount).render(<Gallery />);
}
