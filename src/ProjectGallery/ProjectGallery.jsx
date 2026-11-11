import React, { useEffect, useRef, useState } from 'react';
import Folder from '../Folder/Folder.jsx';
import './ProjectGallery.css';

/**
 * ProjectGallery — folder interaktif (React Bits Folder).
 * Buka folder → halaman proyek sebar keluar. Halaman bisa diseret ke
 * mana saja & diseret kembali ke folder. Klik halaman → modal detail.
 */
export default function ProjectGallery({ projects }) {
  const [active, setActive] = useState(null);

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

  const openDetail = (p) => setActive(p);
  const openVideo = (p) => setActive({ ...p, focusVideo: true });

  return (
    <div className="pg-root" id="projectGalleryRoot">
      <div className="pg-folder-row">
        <div className="pg-folder-copy">
          <span className="pg-folder-kicker">Portofolio</span>
          <p className="pg-folder-caption">
            Sentuh folder untuk membuka — proyek sebar keluar. Drag halaman untuk memindahkannya, seret kembali ke
            folder untuk mengembalikan. Ketuk halaman untuk melihat detail &amp; demo video.
          </p>
        </div>

        <Folder
          items={projects.map((p, i) => (
            <div className="project-page" key={p.id} style={{ '--tag-color': p.accent || '#FF6B6B' }}>
              <img src={p.image} alt={p.title} className="project-page-img" draggable={false} decoding="async" />
              <div className="project-page-footer">
                <span className="project-page-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="project-page-title">{p.title}</span>
              </div>
            </div>
          ))}
          label="PROYEK SAYA"
          mode="flap"
          variant="solid"
          layout="spread"
          color="#0d0d12"
          paperColor="#FFFEF0"
          tabPosition="center"
          size={1.3}
          tilt={0.5}
          bounce={0.4}
          speed={1}
          theme="light"
          openOn="click"
          zoomOnClick={false}
          draggable
          peek
          intro
          onItemClick={(_, index) => openDetail(projects[index])}
        />
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
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(active.link, '_blank');
                    setActive(null);
                  }}
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
  const isGDrive = src && /(drive\.google\.com)/.test(src);

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
    if (isGDrive) {
      const match = src.match(/[-\w]{25,}/);
      const fileId = match ? match[0] : src;
      return (
        <iframe
          className="pg-video"
          src={`https://drive.google.com/file/d/${fileId}/preview`}
          title={project.title}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          webkitallowfullscreen
          mozallowfullscreen
        />
      );
    }
    return <video className="pg-video" src={src} controls preload="none" poster={project.image} />;
  }

  return (
    <div className="pg-video pg-video-placeholder">
      <img src={project.image} alt={project.title} decoding="async" />
      <div className="pg-video-overlay">
        <div className="pg-video-icon">
          <i className="fas fa-external-link-alt" />
        </div>
        {project.link ? (
          <>
            <strong>Video Demo Segera Hadir</strong>
            <span>
              Video demo {project.title} ada di dalam tombol <strong>Kunjungi Proyek</strong> di bawah.
            </span>
          </>
        ) : (
          <>
            <strong>Video Demo Segera Hadir</strong>
            <span>Video demo {project.title} akan segera ditambahkan.</span>
          </>
        )}
      </div>
    </div>
  );
}
