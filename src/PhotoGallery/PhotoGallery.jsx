import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './PhotoGallery.css';

/**
 * PhotoGallery — galeri foto ala aplikasi galeri HP.
 * Grid foto responsif, tap untuk membuka lightbox layar penuh
 * dengan navigasi next/prev, swipe, dan keyboard (panah / Escape).
 */
export default function PhotoGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const touchStartX = useRef(null);
  const total = images.length;

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % total)),
    [total]
  );
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + total) % total)),
    [total]
  );

  // Kunci scroll halaman + navigasi keyboard saat lightbox terbuka
  useEffect(() => {
    if (activeIndex === null) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [activeIndex, close, next, prev]);

  // Swipe di lightbox
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) prev();
      else next();
    }
    touchStartX.current = null;
  };

  return (
    <div className="photo-gallery">
      <div className="ph-grid">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            className="ph-item"
            onClick={() => setActiveIndex(i)}
            aria-label={`Lihat foto ${i + 1}`}
          >
            <img src={src} alt={`Foto ${i + 1}`} loading="lazy" draggable="false" />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="ph-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button type="button" className="ph-close" onClick={close} aria-label="Tutup">
            &times;
          </button>

          <button
            type="button"
            className="ph-nav ph-nav-left"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Foto sebelumnya"
          >
            <i className="fas fa-chevron-left" />
          </button>

          <div className="ph-stage" onClick={(e) => e.stopPropagation()}>
            <img src={images[activeIndex]} alt={`Foto ${activeIndex + 1}`} draggable="false" />
            <span className="ph-counter">
              {activeIndex + 1} / {total}
            </span>
          </div>

          <button
            type="button"
            className="ph-nav ph-nav-right"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Foto berikutnya"
          >
            <i className="fas fa-chevron-right" />
          </button>
        </div>
      )}
    </div>
  );
}