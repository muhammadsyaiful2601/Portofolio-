import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import certAwsFoundations from '../../assets/sertifikat/AWS_Academy_Graduate___Cloud_Foundations___Training_Badge_Badge20260829-20-271znt-1.png';
import certAwsArchitecting from '../../assets/sertifikat/AWS_Academy_Graduate___Cloud_Architecting___Training_Badge_Badge20260829-20-w9qs07-1.png';
import certHuawei from '../../assets/sertifikat/huawei-sertificat.jpeg';
import badgeAwsFoundations from '../../assets/badge/aws-academy-graduate-cloud-foundations-training-bad.png';
import badgeAwsArchitecting from '../../assets/badge/aws-academy-graduate-cloud-architecting-training-ba.png';
import './Certificates.css';

const certificatesData = [
  {
    id: 'aws-foundations',
    title: 'AWS Academy Graduate — Cloud Foundations',
    issuer: 'AWS Academy',
    type: 'Sertifikat',
    image: certAwsFoundations,
    accent: 'var(--accent-2)',
  },
  {
    id: 'aws-architecting',
    title: 'AWS Academy Graduate — Cloud Architecting',
    issuer: 'AWS Academy',
    type: 'Sertifikat',
    image: certAwsArchitecting,
    accent: 'var(--accent)',
  },
  {
    id: 'huawei-certificat',
    title: 'Sertifikat Huawei',
    issuer: 'Huawei',
    type: 'Sertifikat',
    image: certHuawei,
    accent: 'var(--accent-4)',
  },
];

const badgesData = [
  {
    id: 'aws-foundations-badge',
    title: 'AWS Cloud Foundations — Training Badge',
    issuer: 'Credly / AWS Academy',
    type: 'Badge',
    image: badgeAwsFoundations,
    accent: 'var(--accent-3)',
  },
  {
    id: 'aws-architecting-badge',
    title: 'AWS Cloud Architecting — Training Badge',
    issuer: 'Credly / AWS Academy',
    type: 'Badge',
    image: badgeAwsArchitecting,
    accent: 'var(--accent-4)',
  },
];

/**
 * CertCarousel — carousel horizontal untuk satu grup (Sertifikat / Badge).
 * Mendukung tombol panah kiri/kanan, drag-to-scroll, dan scroll snap.
 */
function CertCarousel({ title, icon, data, modifier }) {
  const scrollerRef = useRef(null);
  const dragRef = useRef({ startX: 0, scrollLeft: 0, isDown: false, moved: false });
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  const attachScroller = useCallback(
    (el) => {
      scrollerRef.current = el;
      if (el) {
        updateArrows();
        el.addEventListener('scroll', updateArrows, { passive: true });
      }
    },
    [updateArrows]
  );

  useEffect(() => {
    window.addEventListener('resize', updateArrows);
    return () => {
      window.removeEventListener('resize', updateArrows);
      const el = scrollerRef.current;
      if (el) el.removeEventListener('scroll', updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = (dir) => {
    const el = scrollerRef.current;
    const card = el?.querySelector('.cert-card');
    const amount = (card ? card.offsetWidth + 24 : 420) * dir;
    el?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // Drag-to-scroll (desktop) — tanpa pointer capture agar klik pada kartu tetap bekerja
  const onPointerDown = (e) => {
    const el = scrollerRef.current;
    dragRef.current = { startX: e.clientX, scrollLeft: el.scrollLeft, isDown: true, moved: false };
  };
  const onPointerMove = (e) => {
    const { isDown, startX, scrollLeft } = dragRef.current;
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) {
      dragRef.current.moved = true;
    }
    if (dragRef.current.moved) {
      e.preventDefault();
      scrollerRef.current.scrollLeft = scrollLeft - dx;
    }
  };
  const onPointerUp = () => {
    dragRef.current.isDown = false;
  };

  const handleCardClick = (e, src) => {
    if (dragRef.current.moved) {
      dragRef.current.moved = false; // reset setelah drag
      return; // jangan buka modal setelah drag
    }
    if (typeof window.openModal === 'function') {
      window.openModal(src);
    }
  };

  return (
    <div className="cert-group">
      <h3 className="cert-group-title">
        <i className={icon} aria-hidden="true"></i> {title}
      </h3>
      <div className="pg-viewport">
        <button
          type="button"
          className={`pg-arrow pg-arrow-left ${canLeft ? '' : 'pg-arrow-hidden'}`}
          onClick={() => scrollByCard(-1)}
          aria-label={`Geser ${title.toLowerCase()} ke kiri`}
        >
          <i className="fas fa-chevron-left" />
        </button>

        <div
          className={`pg-scroller ${modifier}`}
          ref={attachScroller}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {data.map((c) => (
            <button
              key={c.id}
              type="button"
              className="cert-card"
              onClick={(e) => handleCardClick(e, c.image)}
              aria-label={`Lihat ${c.title}`}
            >
              <div className="cert-thumb">
                <img src={c.image} alt={c.title} loading="lazy" draggable="false" />
                <span className="cert-type" style={{ background: c.accent }}>
                  {c.type}
                </span>
              </div>
              <div className="cert-body">
                <h3>{c.title}</h3>
                <p>
                  <i className={icon} aria-hidden="true"></i> {c.issuer}
                </p>
                <span className="cert-view">
                  Lihat Detail <i className="fas fa-arrow-right" aria-hidden="true"></i>
                </span>
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`pg-arrow pg-arrow-right ${canRight ? '' : 'pg-arrow-hidden'}`}
          onClick={() => scrollByCard(1)}
          aria-label={`Geser ${title.toLowerCase()} ke kanan`}
        >
          <i className="fas fa-chevron-right" />
        </button>
      </div>
    </div>
  );
}

/**
 * Certificates — dua carousel horizontal terpisah: Sertifikat & Badge.
 */
export default function Certificates() {
  return (
    <div className="cert-root">
      <CertCarousel title="Sertifikat" icon="fas fa-award" data={certificatesData} modifier="cert-scroller-wide" />
      <CertCarousel title="Badge" icon="fas fa-medal" data={badgesData} modifier="cert-scroller-badges" />
      <div className="pg-scroll-hint">
        <i className="fas fa-arrows-left-right" /> Geser (atau gunakan panah) untuk melihat semua
      </div>
    </div>
  );
}

const certificatesMount = document.getElementById('certificatesMount');

if (certificatesMount) {
  createRoot(certificatesMount).render(<Certificates />);
}