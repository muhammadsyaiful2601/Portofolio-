import React, { useEffect, useRef, useState } from 'react';
import FolderFloat from '../FolderFloat/FolderFloat.jsx';
import './ProjectGallery.css';

/**
 * ProjectGallery — folder interaktif (FolderFloat) + drop-zone koleksi.
 * Alur: pengguna menyeret (atau mengetuk) pil nama proyek dari folder,
 * lalu menjatuhkannya ke area di bawah. Pil langsung hilang dari folder;
 * area menampung banyak proyek sekaligus. Menutup folder mengembalikan
 * semua proyek ke folder.
 */
export default function ProjectGallery({ projects }) {
  const [active, setActive] = useState(null);
  const [placedIds, setPlacedIds] = useState([]); // proyek yang sudah "keluar" dari folder ke drop-zone
  const [dragOver, setDragOver] = useState(false);
  const [dragOverFolder, setDragOverFolder] = useState(false); // highlight saat kartu zona diseret ke folder
  const dropRef = useRef(null);

  const placedSet = new Set(placedIds);
  const folderItems = projects.filter((p) => !placedSet.has(p.id)).map((p) => ({ label: p.title, value: p.id }));
  const selectedProjects = placedIds
    .map((id) => projects.find((p) => p.id === id))
    .filter(Boolean);

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

  const addToZone = (value) => {
    if (!value) return;
    setPlacedIds((ids) => (ids.includes(value) ? ids : [...ids, value]));
  };

  // Menutup folder → semua proyek kembali ke folder
  const onFolderChange = (open) => {
    if (!open) setPlacedIds([]);
  };

  // Mengembalikan satu proyek dari zona ke folder
  const removeFromZone = (id) => {
    setPlacedIds((ids) => ids.filter((x) => x !== id));
  };

  // Drop di folder → proyek keluar dari zona, kembali ke folder
  const onDropOnFolder = (e) => {
    e.preventDefault();
    setDragOverFolder(false);
    const value = e.dataTransfer.getData('text/plain');
    if (value) removeFromZone(value);
  };

  const onDragStartZoneCard = (e, id) => {
    e.dataTransfer.setData('text/plain', String(id));
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const value = e.dataTransfer.getData('text/plain');
    addToZone(value);
  };

  return (
    <div className="pg-root" id="projectGalleryRoot">
      <div className="pg-folder-row">
        <div
          className={`pg-folder-drop${dragOverFolder ? ' pg-folder-drop-over' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            setDragOverFolder(true);
          }}
          onDragLeave={() => setDragOverFolder(false)}
          onDrop={onDropOnFolder}
          aria-label="Folder — lepas kartu di sini untuk mengembalikan proyek"
        >
        <FolderFloat
          items={folderItems}
          label="PROYEK SAYA"
          sublabel={`${folderItems.length} proyek tersisa`}
          trigger="click"
          physics={false}
          nativeDrag
          closeOnSelect={false}
          drift={0.4}
          folderColor="#000000"
          frontColor="#161616"
          paperColor="#FFE66D"
          itemColor="#FFE66D"
          itemTextColor="#000000"
          labelColor="#FFE66D"
          width={220}
          height={150}
          radius={14}
          spread={150}
          lift={24}
          tilt={7}
          onSelect={addToZone}
          onOpenChange={onFolderChange}
        />
        </div>
      </div>

      {/* Drop-zone: selalu terlihat, menampung banyak proyek sekaligus */}
      <div
        ref={dropRef}
        className={`pg-dropzone${dragOver ? ' pg-dropzone-over' : ''}${selectedProjects.length ? ' pg-dropzone-filled' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        aria-live="polite"
      >
        {selectedProjects.length > 0 ? (
          <div className="pg-zone-grid">
            {selectedProjects.map((p) => {
              const index = projects.findIndex((x) => x.id === p.id);
              return (
                <article
                  key={p.id}
                  className="pg-zone-card"
                  style={{ '--tag-color': p.accent || '#FF6B6B' }}
                  draggable="true"
                  onDragStart={(e) => onDragStartZoneCard(e, p.id)}
                >
                  <div className="pg-zone-thumb">
                    <img src={p.image} alt={p.title} loading="lazy" decoding="async" draggable="false" />
                    <span className="pg-badge">{String(index + 1).padStart(2, '0')}</span>
                    <button
                      type="button"
                      className="pg-zone-return"
                      onClick={() => removeFromZone(p.id)}
                      aria-label={`Kembalikan ${p.title} ke folder`}
                      title="Kembalikan ke folder"
                    >
                      <i className="fas fa-undo-alt" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="pg-zone-body">
                    <h3 className="pg-zone-title">{p.title}</h3>
                    <p className="pg-zone-desc">{p.short}</p>
                    <ul className="pg-tags">
                      {p.tech.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <div className="pg-actions">
                      <button type="button" className="pg-btn pg-btn-detail" onClick={() => openDetail(p)}>
                        <i className="fas fa-info-circle" /> Detail
                      </button>
                      {p.link ? (
                        <a href={p.link} target="_blank" rel="noreferrer" className="pg-btn pg-btn-video">
                          <i className="fas fa-external-link-alt" /> Kunjungi
                        </a>
                      ) : (
                        <button type="button" className="pg-btn pg-btn-video" onClick={() => openVideo(p)}>
                          <i className="fas fa-play" /> Video
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="pg-dropzone-empty">
            <span className="pg-dropzone-circle">
              <i className="fas fa-arrow-down" aria-hidden="true" />
            </span>
            <p className="pg-dropzone-title">Seret nama proyek ke sini</p>
            <p className="pg-dropzone-sub">…boleh lebih dari satu — ketuk pil juga bisa</p>
          </div>
        )}
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
