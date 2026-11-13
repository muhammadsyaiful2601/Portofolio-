import { createRoot } from 'react-dom/client';
import React, { lazy, Suspense } from 'react';
import TechText from './TechText/TechText.jsx';
import { PROJECT_IMAGES, GALLERY, preloadDriveAssets } from './drive-assets.js';
import PhotoGallery from './PhotoGallery/PhotoGallery.jsx';
import './Lanyard/Lanyard.css';
import './DitherVeil/DitherVeil.css';

// Lazy-load komponen berat (three.js + WebGL + motion) agar tidak memblokir initial load
const LanyardCarousel = lazy(() => import('./Lanyard/LanyardCarousel.jsx'));
const AboutDitherVeil = lazy(() => import('./AboutDitherVeil.jsx'));
const Certificates = lazy(() => import('./Certificates/Certificates.jsx'));
const ProjectGallery = lazy(() => import('./ProjectGallery/ProjectGallery.jsx'));

const projectsData = [
  {
    id: 'event',
    title: 'Event Kampus',
    short: 'Website informasi dan dokumentasi acara-acara kampus.',
    full: 'Website informasi dan dokumentasi untuk berbagai acara yang diselenggarakan di lingkungan kampus. Menampilkan jadwal kegiatan, galeri dokumentasi, serta formulir pendaftaran peserta. Dibangun dengan Laravel dan MySQL untuk pengelolaan data yang terstruktur.',
    image: PROJECT_IMAGES.event,
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
    image: PROJECT_IMAGES.webgis,
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
    image: PROJECT_IMAGES.jadwal,
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
    image: PROJECT_IMAGES.peminjaman,
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
    image: PROJECT_IMAGES.spp,
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
  createRoot(projectsMount).render(
    <Suspense fallback={<div className="pg-fallback" aria-hidden="true" />}>
      <Projects />
    </Suspense>
  );
}

const galleryImages = GALLERY;

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

const certificatesMount = document.getElementById('certificatesMount');

if (certificatesMount) {
  createRoot(certificatesMount).render(
    <Suspense fallback={<div className="cert-fallback" aria-hidden="true" />}>
      <Certificates />
    </Suspense>
  );
}

// Unduh semua aset Drive (sertifikat, proyek, galeri) di background
// selama loading awal — agar saat section-nya tampil sudah instan dari cache.
preloadDriveAssets();
