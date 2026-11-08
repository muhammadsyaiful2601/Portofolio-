import React, { useCallback, useEffect, useRef, useState } from 'react';
import './PhotoGallery.css';
import HoloCard from '../HoloCard/HoloCard.jsx';

/**
 * PhotoGallery — galeri foto ala aplikasi galeri HP.
 * Grid foto responsif, tap untuk membuka lightbox layar penuh
 * dengan navigasi next/prev, swipe, dan keyboard (panah / Escape).
 * Foto di lightbox tampil sebagai kartu holografik (HoloCard, WebGL).
 */
const HOLO_PRESETS = ['cosmos', 'swirl', 'rainbow', 'gold'];

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

// Tingkat kelangkaan gaya kartu Pokémon — ditentukan deterministik dari hash nama file (stabil di semua build)
const RARITIES = [
  { id: 'common', label: 'Common', symbol: '●', color: '#d1d5db', weight: 40 },
  { id: 'uncommon', label: 'Uncommon', symbol: '◆', color: '#4ade80', weight: 25 },
  { id: 'rare', label: 'Rare', symbol: '★', color: '#60a5fa', weight: 18 },
  { id: 'holo', label: 'Holo Rare', symbol: '★★', color: '#fde047', weight: 10 },
  { id: 'ultra', label: 'Ultra Rare', symbol: '★★★', color: '#f472b6', weight: 5 },
  { id: 'secret', label: 'Secret Rare', symbol: '★★★★', color: '#c084fc', weight: 2 },
];

const rarityFor = (src) => {
  const text = decodeURIComponent(String(src));
  // Hash bagian tanggal/jam saja supaya rarity sama di dev (nama asli) & build (nama + hash)
  const stamp = /(\d{4})-(\d{2})-(\d{2}) at (\d{2})\.(\d{2})\.(\d{2})/.exec(text)?.[0] ?? text;
  let hash = 2166136261 >>> 0; // FNV-1a 32-bit
  for (let i = 0; i < stamp.length; i += 1) {
    hash ^= stamp.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const roll = (hash >>> 0) % 100;
  let acc = 0;
  for (const rarity of RARITIES) {
    acc += rarity.weight;
    if (roll < acc) return rarity;
  }
  return RARITIES[0];
};

// Nama file WhatsApp menyimpan timestamp, mis. "2026-08-06 at 12.29.51" — dipakai sebagai caption otomatis
const parseCaption = (src) => {
  try {
    const decoded = decodeURIComponent(String(src));
    const match = /(\d{4})-(\d{2})-(\d{2}) at (\d{2})\.(\d{2})\.(\d{2})/.exec(decoded);
    if (!match) return null;
    const [, year, month, day, hour, minute] = match;
    return {
      dateLabel: `${parseInt(day, 10)} ${MONTHS_ID[Number(month) - 1]} ${year}`,
      timeLabel: `${hour}.${minute}`,
    };
  } catch {
    return null;
  }
};
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

  const activeCaption = activeIndex === null ? null : parseCaption(images[activeIndex]);
  const activeRarity = activeIndex === null ? null : rarityFor(images[activeIndex]);

  const handleView = (e, i) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(i);
  };

  return (
    <div className="photo-gallery">
      <div className="ph-grid">
        {images.map((src, i) => (
          <div
            key={i}
            className="ph-item"
            onClick={() => setActiveIndex(i)}
            aria-label={`Lihat foto ${i + 1}`}
          >
            <img src={src} alt={`Foto ${i + 1}`} loading="lazy" draggable="false" />
            <a
              href={src}
              className="ph-download-btn"
              onClick={(e) => handleView(e, i)}
              aria-label={`Lihat foto ${i + 1} dalam popup`}
            >
              <i className="fas fa-image" /> Lihat Dokumentasi
            </a>
          </div>
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
            <HoloCard
              key={activeIndex}
              image={images[activeIndex]}
              alt={`Foto ${activeIndex + 1}`}
              preset={HOLO_PRESETS[activeIndex % HOLO_PRESETS.length]}
              intensity={0.6}
              edgeSparkle={0.35}
              glare={0.45}
              frame={3}
              tiltMax={16}
              hoverScale={1.03}
              radius={0}
              width={560}
              idle
              shadow
              backContent={
                <div className="ph-back">
                  <div className="ph-back-top">
                    <span
                      className="ph-rarity"
                      style={{ '--rarity-color': activeRarity ? activeRarity.color : '#d1d5db' }}
                    >
                      <span className="ph-rarity-symbol" aria-hidden="true">
                        {activeRarity ? activeRarity.symbol : '●'}
                      </span>
                      {activeRarity ? activeRarity.label : 'Common'}
                    </span>
                    <span className="ph-back-index">
                      FOTO {activeIndex + 1}/{total}
                    </span>
                  </div>

                  {/* Foto apa adanya — TANPA efek holo */}
                  <div className="ph-artbox">
                    <img src={images[activeIndex]} alt="" draggable="false" />
                  </div>

                  <h3 className="ph-back-title">
                    Dokumentasi <span>Perjalanan</span>
                  </h3>
                  {activeCaption ? (
                    <p className="ph-back-date">
                      {activeCaption.dateLabel} · {activeCaption.timeLabel} WIB
                    </p>
                  ) : (
                    <p className="ph-back-date">Momen Perjalanan</p>
                  )}
                  <p className="ph-back-name">— Muhammad Syaiful</p>
                </div>
              }
            />
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