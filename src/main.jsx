import { createRoot } from 'react-dom/client';

// Komponen sertifikat me-mount sendiri ke #certificatesMount
import './Certificates/Certificates.jsx';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Lanyard from './Lanyard/Lanyard.jsx';
import profile1 from '../assets/profile/1.jpg';
import profile2 from '../assets/profile/2.jpeg';
import profile3 from '../assets/profile/3.jpeg';
import profile4 from '../assets/profile/4.jpeg';
import profile5 from '../assets/profile/5.jpeg';
import ProjectGallery from './ProjectGallery/ProjectGallery.jsx';
import puzzleImg from '../assets/website/puzzle.jpg';
import kalkulatorImg from '../assets/website/kalkulator ngawur.jpg';
import eventImg from '../assets/website/Event Kampus.jpg';
import webgisImg from '../assets/website/WebGis.jpg';
import jadwalImg from '../assets/website/Jadwal Kampus.jpg';
import PhotoGallery from './PhotoGallery/PhotoGallery.jsx';
import foto1 from '../assets/foto perjalanan/WhatsApp Image 2026-08-06 at 12.29.51.jpeg';
import foto2 from '../assets/foto perjalanan/WhatsApp Image 2026-08-06 at 12.29.52 (1).jpeg';
import foto3 from '../assets/foto perjalanan/WhatsApp Image 2026-08-06 at 12.29.52.jpeg';
import foto4 from '../assets/foto perjalanan/WhatsApp Image 2026-08-06 at 12.29.53 (1).jpeg';
import foto5 from '../assets/foto perjalanan/WhatsApp Image 2026-08-06 at 12.29.53.jpeg';
import foto6 from '../assets/foto perjalanan/WhatsApp Image 2026-08-06 at 12.29.54 (1).jpeg';
import foto7 from '../assets/foto perjalanan/WhatsApp Image 2026-08-06 at 12.29.54 (2).jpeg';
import foto8 from '../assets/foto perjalanan/WhatsApp Image 2026-08-06 at 12.29.54.jpeg';
import foto9 from '../assets/foto perjalanan/WhatsApp Image 2026-08-06 at 12.29.55 (1).jpeg';
import foto10 from '../assets/foto perjalanan/WhatsApp Image 2026-08-06 at 12.29.55.jpeg';
import foto11 from '../assets/foto perjalanan/WhatsApp Image 2026-08-06 at 12.29.56 (1).jpeg';
import foto12 from '../assets/foto perjalanan/WhatsApp Image 2026-08-06 at 12.29.56 (2).jpeg';
import foto13 from '../assets/foto perjalanan/WhatsApp Image 2026-08-06 at 12.29.56.jpeg';
import foto14 from '../assets/foto perjalanan/WhatsApp Image 2026-08-06 at 12.29.57.jpeg';
import foto15 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.41.45 (1).jpeg';
import foto16 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.41.45.jpeg';
import foto17 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.41.46 (1).jpeg';
import foto18 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.41.46 (2).jpeg';
import foto19 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.41.46.jpeg';
import foto20 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.41.47.jpeg';
import foto21 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.41.57.jpeg';
import foto22 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.42.57.jpeg';
import foto23 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.42.59.jpeg';
import foto24 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.43.00.jpeg';
import foto25 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.43.01 (1).jpeg';
import foto26 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.43.01.jpeg';
import foto27 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.43.02 (1).jpeg';
import foto28 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.43.02 (2).jpeg';
import foto29 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.43.02.jpeg';
import foto30 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.43.03 (1).jpeg';
import foto31 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.43.03.jpeg';
import foto32 from '../assets/foto perjalanan/WhatsApp Image 2026-08-29 at 19.43.04.jpeg';
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

const projectsData = [
  {
    id: 'puzzle',
    title: 'Game Puzzle Sederhana',
    short: 'Puzzle interaktif dengan fitur auto-solve yang menyelesaikan sendiri.',
    full: 'Game puzzle interaktif berbasis JavaScript murni. Pemain dapat menggeser keping untuk menyusun gambar, dan tersedia fitur auto-solve yang menyelesaikan puzzle secara otomatis dengan animasi langkah demi langkah. Dilengkapi penghitung langkah, timer, dan beberapa level kesulitan.',
    image: puzzleImg,
    tech: ['JavaScript', 'HTML', 'CSS'],
    accent: '#FF6B6B',
    demoVideo: null,
    link: '',
  },
  {
    id: 'kalkulator',
    title: 'Kalkulator Ngawur',
    short: 'Kalkulator unik dengan jawaban yang selalu tidak terduga.',
    full: 'Kalkulator humor dengan jawaban yang selalu tidak terduga dan penuh kejutan. Setiap perhitungan menghasilkan respons lucu dan tidak masuk akal, cocok untuk hiburan sekaligus mempelajari manipulasi DOM dan logika JavaScript dengan cara yang menyenangkan.',
    image: kalkulatorImg,
    tech: ['JavaScript', 'HTML', 'CSS'],
    accent: '#4ECDC4',
    demoVideo: null,
    link: '',
  },
  {
    id: 'event',
    title: 'Event Kampus',
    short: 'Website informasi dan dokumentasi acara-acara kampus.',
    full: 'Website informasi dan dokumentasi untuk berbagai acara yang diselenggarakan di lingkungan kampus. Menampilkan jadwal kegiatan, galeri dokumentasi, serta formulir pendaftaran peserta. Dibangun dengan Laravel dan MySQL untuk pengelolaan data yang terstruktur.',
    image: eventImg,
    tech: ['Laravel', 'MySQL', 'Bootstrap'],
    accent: '#FFE66D',
    demoVideo: null,
    link: '',
  },
  {
    id: 'webgis',
    title: 'WebGIS',
    short: 'Aplikasi Geographic Information System untuk visualisasi data spasial.',
    full: 'Aplikasi Geographic Information System (GIS) berbasis web untuk visualisasi data spasial dan pemetaan interaktif. Mendukung layer peta, marker lokasi, dan interaksi pengguna untuk eksplorasi data geografis secara real-time melalui browser.',
    image: webgisImg,
    tech: ['GIS', 'Leaflet', 'JavaScript'],
    accent: '#95E1D3',
    demoVideo: null,
    link: '',
  },
  {
    id: 'jadwal',
    title: 'Jadwal Kampus',
    short: 'Website mengelola jadwal perkuliahan yang informatif.',
    full: 'Website untuk melihat dan mengelola jadwal perkuliahan dengan tampilan yang informatif dan mudah digunakan. Mendukung pembuatan, pengeditan, dan penandaan jadwal sesuai dengan hari serta jam kuliah, lengkap dengan notifikasi dan sistem autentikasi pengguna.',
    image: jadwalImg,
    tech: ['Laravel', 'MySQL', 'Bootstrap'],
    accent: '#FF6B6B',
    demoVideo: null,
    link: '',
  },
];

function Projects() {
  return <ProjectGallery projects={projectsData} />;
}

const mount = document.getElementById('lanyardMount');

if (mount) {
  createRoot(mount).render(<LanyardCarousel />);
}

const galleryImages = [
  foto1, foto2, foto3, foto4, foto5, foto6, foto7,
  foto8, foto9, foto10, foto11, foto12, foto13, foto14,
  foto15, foto16, foto17, foto18, foto19, foto20, foto21,
  foto22, foto23, foto24, foto25, foto26, foto27, foto28,
  foto29, foto30, foto31, foto32
];

function Gallery() {
  return <PhotoGallery images={galleryImages} />;
}

const projectsMount = document.getElementById('projectsMount');

if (projectsMount) {
  createRoot(projectsMount).render(<Projects />);
}

const galleryMount = document.getElementById('galleryMount');

if (galleryMount) {
  createRoot(galleryMount).render(<Gallery />);
}

