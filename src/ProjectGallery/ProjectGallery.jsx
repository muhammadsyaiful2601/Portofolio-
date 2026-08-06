import React, { useCallback, useEffect, useRef, useState } from 'react';
import './ProjectGallery.css';

/**
 * ProjectGallery — galeri proyek yang dapat di-scroll ke kiri / kanan.
 * Setiap kartu memiliki tombol "Detail" dan "Demo Video".
 * Modal menampilkan informasi lengkap + pemutar video demo.
 * Jika project.demoVideo kosong, ditampilkan placeholder
 * "Video Demo Segera Hadir".
 */
export default function ProjectGallery({ projects }) {
  const scrollerRef = useRef(null);
  const dragRef = useRef({ startX: 0, scrollLeft: 0, isDown: false, moved: false });
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [active, setActive] = useState(null);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = (dir) => {
    const el = scrollerRef.current;
    const card = el?.querySelector('.pg-card');
    const amount = (card ? card.offsetWidth + 24 : 360) * dir;
    el?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // Navigasi keyboard panah
  useEffect(() => {
    const onKey = (e) => {
      if (active) return;
      if (e.key === 'ArrowRight') scrollByCard(1);
      if (e.key === 'ArrowLeft') scrollByCard(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  // Kunci scroll & tombol Escape saat modal terbuka
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [active]);

  // Drag-to-scroll (desktop)
  const onPointerDown = (e) => {
    const el = scrollerRef.current;
    dragRef.current = { startX: e.clientX, scrollLeft: el.scrollLeft, isDown: true, moved: false };
  };
  const onPointerMove = (e) => {
    const { isDown, startX, scrollLeft } = dragRef.current;
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) dragRef.current.moved = true;
    scrollerRef.current.scrollLeft = scrollLeft - dx;
  };
  const onPointerUp = () => {
    dragRef.current.isDown = false;
  };

  const openDetail = (p) => setActive(p);
  const openVideo = (p) => setActive({ ...p, focusVideo: true });

  return (
    <div className="pg-root" id="projectGalleryRoot">
      <div className="pg-viewport">
        <button
          type="button"
          className={`pg-arrow pg-arrow-left ${canLeft ? '' : 'pg-arrow-hidden'}`}
          onClick={() => scrollByCard(-1)}
          aria-label="Geser proyek ke kiri"
        >
          <i className="fas fa-chevron-left" />
        </button>

        <div
          className="pg-scroller"
          ref={scrollerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onDragStart={(e) => e.preventDefault()}
        >
          {projects.map((p, i) => (
            <article
              className="pg-card"
              key={p.id}
              style={{ '--tag-color': p.accent || '#FF6B6B' }}
            >
              <div className="pg-thumb">
                <img src={p.image} alt={p.title} loading="lazy" draggable="false" />
                <span className="pg-badge">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="pg-info">
                <h3 className="pg-title">{p.title}</h3>
                <p className="pg-desc">{p.short}</p>
                <ul className="pg-tags">
                  {p.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className="pg-actions">
                  <button type="button" className="pg-btn pg-btn-detail" onClick={() => openDetail(p)}>
                    <i className="fas fa-info-circle" /> Detail
                  </button>
                  <button type="button" className="pg-btn pg-btn-video" onClick={() => openVideo(p)}>
                    <i className="fas fa-play" /> Demo Video
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className={`pg-arrow pg-arrow-right ${canRight ? '' : 'pg-arrow-hidden'}`}
          onClick={() => scrollByCard(1)}
          aria-label="Geser proyek ke kanan"
        >
          <i className="fas fa-chevron-right" />
        </button>
      </div>

      <div className="pg-scroll-hint">
        <i className="fas fa-arrows-left-right" /> Geser (atau gunakan panah) untuk melihat semua proyek
      </div>

      {active && (
        <div className="pg-modal" onClick={() => setActive(null)} role="dialog" aria-modal="true">
          <div className="pg-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="pg-modal-close"
              onClick={() => setActive(null)}
              aria-label="Tutup"
            >
              &times;
            </button>
            <div className="pg-modal-media">{renderMedia(active)}</div>
            <div className="pg-modal-body">
              <h3 className="pg-modal-title">{active.title}</h3>
              <p className="pg-modal-desc">{active.full}</p>
              <ul className="pg-tags pg-tags-large">
                {active.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {active.link && (
                <a
                  className="pg-btn pg-btn-link"
                  href={active.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fas fa-external-link-alt" /> Kunjungi Proyek
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Render media (video demo atau placeholder) di dalam modal. */
function renderMedia(project) {
  const src = project.demoVideo;
  const isYoutube = src && /(youtube\.com|youtu\.be)/.test(src);

  if (src) {
    if (isYoutube) {
      const id = src.split('/').pop().split('?')[0];
      return (
        <iframe
          className="pg-video"
          src={`https://www.youtube.com/embed/${id}`}
          title={project.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    return <video className="pg-video" src={src} controls poster={project.image} />;
  }

  return (
    <div className="pg-video pg-video-placeholder">
      <img src={project.image} alt={project.title} />
      <div className="pg-video-overlay">
        <div className="pg-video-icon">
          <i className="fas fa-film" />
        </div>
        <strong>Video Demo Segera Hadir</strong>
        <span>Video demo {project.title} akan segera ditambahkan.</span>
      </div>
    </div>
  );
}

