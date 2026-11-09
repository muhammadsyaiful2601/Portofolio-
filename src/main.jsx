import { createRoot } from 'react-dom/client';

// Komponen sertifikat me-mount sendiri ke #certificatesMount
import './Certificates/Certificates.jsx';

import React, { lazy, Suspense } from 'react';
import TechText from './TechText/TechText.jsx';
import ProjectGallery from './ProjectGallery/ProjectGallery.jsx';
import eventImg from '../assets/website/Event Kampus.jpg';
import webgisImg from '../assets/website/WebGis.jpg';
import jadwalImg from '../assets/website/Jadwal Kampus.jpg';
import peminjamanImg from '../assets/website/peminjaman.png';
import sppImg from '../assets/website/spp.png';
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
import './DitherVeil/DitherVeil.css';

// Lazy-load komponen berat (three.js + WebGL) agar tidak memblokir initial load
const LanyardCarousel = lazy(() => import('./Lanyard/LanyardCarousel.jsx'));
const AboutDitherVeil = lazy(() => import('./AboutDitherVeil.jsx'));

const projectsData = [
  {
    id: 'event',
    title: 'Event Kampus',
    short: 'Website informasi dan dokumentasi acara-acara kampus.',
    full: 'Website informasi dan dokumentasi untuk berbagai acara yang diselenggarakan di lingkungan kampus. Menampilkan jadwal kegiatan, galeri dokumentasi, serta formulir pendaftaran peserta. Dibangun dengan Laravel dan MySQL untuk pengelolaan data yang terstruktur.',
    image: eventImg,
    tech: ['Laravel', 'MySQL', 'Bootstrap'],
    accent: '#FFE66D',
    demoVideo: 'https://drive.google.com/file/d/1tIxrnhTmz3hnrlm1Zp1PApH4RcQVGKyL/view?usp=sharing',
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
    demoVideo: 'https://drive.google.com/file/d/1Jr26q01WYCpyrEKkw--jckPSi2x4tHw0/view?usp=drive_link',
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
    demoVideo: 'https://drive.google.com/file/d/1BPjJ3PHxQZXj627cGh2m9kN3htvrkDrx/view?usp=sharing',
    link: '',
  },
  {
    id: 'peminjaman',
    title: 'Sistem Peminjaman PNP',
    short: 'Aplikasi peminjaman ruangan dan barang kampus.',
    full: 'Sistem informasi peminjaman ruangan dan barang di lingkungan kampus Politeknik Negeri Padang. Dibangun dengan React di frontend, Laravel di backend, dan Electron untuk versi desktop aplikasi. Pengguna dapat mengajukan peminjaman, melihat status, serta mengelola data inventaris barang dan jadwal ruangan.',
    image: peminjamanImg,
    tech: ['React', 'Laravel', 'Electron'],
    accent: '#95E1D3',
    demoVideo: null,
    link: 'https://peminjamanpnp.netlify.app/',
  },
  {
    id: 'spp',
    title: 'Pencatatan SPP',
    short: 'Sistem pencatatan SPP (Sumbangan Pendidikan) siswa.',
    full: 'Sistem pencatatan dan manajemen SPP (Sumbangan Pendidikan) untuk siswa kampus. Dibangun dengan React di frontend dan Laravel di backend. Memungkinkan pencatatan pembayaran, pelaporan keuangan, dan manajemen data siswa secara terstruktur.',
    image: sppImg,
    tech: ['React', 'Laravel'],
    accent: '#95E1D3',
    demoVideo: 'https://drive.google.com/file/d/1Jr26q01WYCpyrEKkw--jckPSi2x4tHw0/view?usp=drive_link',
    link: '',
  },
];

const techTextMount = document.getElementById('techTextMount');

if (techTextMount) {
  createRoot(techTextMount).render(
    <TechText
      text="MUHAMMAD SYAIFUL"
      fontWeight={800}
      fontSize={110}
      letterSpacing={-0.05}
      align="center"
      reveal="letter"
      dashLength={4}
      dashGap={2}
      specks={15}
      intro="none"
      clickKick
      guides={false}
      color="#B91C1C"
      accentColor="#000000"
    />
  );
}

const lanyardMount = document.getElementById('lanyardMount');

if (lanyardMount) {
  createRoot(lanyardMount).render(
    <Suspense fallback={<div className="lanyard-fallback" aria-hidden="true" />}>
      <LanyardCarousel />
    </Suspense>
  );
}

function Projects() {
  return <ProjectGallery projects={projectsData} />;
}

const projectsMount = document.getElementById('projectsMount');

if (projectsMount) {
  createRoot(projectsMount).render(<Projects />);
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

const galleryMount = document.getElementById('galleryMount');

if (galleryMount) {
  createRoot(galleryMount).render(<Gallery />);
}

const aboutHalftoneMount = document.getElementById('aboutHalftoneMount');

if (aboutHalftoneMount) {
  createRoot(aboutHalftoneMount).render(
    <Suspense fallback={<div className="ditherveil-fallback" aria-hidden="true" />}>
      <AboutDitherVeil />
    </Suspense>
  );
}
