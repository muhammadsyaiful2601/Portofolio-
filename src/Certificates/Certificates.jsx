import React, { useCallback, useEffect, useRef, useState } from 'react';
import certAwsFoundations from '../../assets/sertifikat/AWS_Academy_Graduate___Cloud_Foundations___Training_Badge_Badge20260829-20-271znt-1.png';
import certAwsArchitecting from '../../assets/sertifikat/AWS_Academy_Graduate___Cloud_Architecting___Training_Badge_Badge20260829-20-w9qs07-1.png';
import certHuawei from '../../assets/sertifikat/huawei-sertificat.jpeg';
import certHuaweiOverviewAi from '../../assets/sertifikat/huawei-overview-of-ai.jpg';
import certPanitia from '../../assets/sertifikat/sertifikat-panitia.png';
import badgeAwsFoundations from '../../assets/badge/aws-academy-graduate-cloud-foundations-training-bad.png';
import badgeAwsArchitecting from '../../assets/badge/aws-academy-graduate-cloud-architecting-training-ba.png';
import TearTicket from '../TearTicket/TearTicket.jsx';
import FlipCard from '../FlipCard/FlipCard.jsx';
import './Certificates.css';

const certificatesData = [
  {
    id: 'aws-foundations',
    title: 'AWS Academy Graduate — Cloud Foundations',
    issuer: 'AWS Academy',
    type: 'Sertifikat',
    image: certAwsFoundations,
    accent: 'var(--accent-2)',
    no: '273845',
  },
  {
    id: 'aws-architecting',
    title: 'AWS Academy Graduate — Cloud Architecting',
    issuer: 'AWS Academy',
    type: 'Sertifikat',
    image: certAwsArchitecting,
    accent: 'var(--accent)',
    no: '190283',
  },
  {
    id: 'huawei-certificat',
    title: 'Sertifikat Huawei',
    issuer: 'Huawei',
    type: 'Sertifikat',
    image: certHuawei,
    accent: 'var(--accent-4)',
    no: '882145',
  },
  {
    id: 'huawei-overview-of-ai',
    title: 'Overview of AI',
    issuer: 'Huawei ICT Academy',
    type: 'Sertifikat',
    image: certHuaweiOverviewAi,
    accent: 'var(--accent-4)',
    no: 'ICT20261113113488',
  },
  {
    id: 'sertifikat-panitia',
    title: 'Sertifikat Panitia',
    issuer: 'Acara Kampus',
    type: 'Sertifikat',
    image: certPanitia,
    accent: 'var(--accent-3)',
    no: '556791',
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
    no: '101293',
  },
  {
    id: 'aws-architecting-badge',
    title: 'AWS Cloud Architecting — Training Badge',
    issuer: 'Credly / AWS Academy',
    type: 'Badge',
    image: badgeAwsArchitecting,
    accent: 'var(--accent-4)',
    no: '448211',
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
    const card = el?.querySelector('.tear-ticket, .flip-card');
    const amount = (card ? card.offsetWidth + 24 : 420) * dir;
    el?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // Drag-to-scroll (desktop) — interaksi di dalam kartu interaktif tidak memicu drag carousel
  const onPointerDown = (e) => {
    if (e.target.closest('.tear-ticket__piece--stub') || e.target.closest('.flip-card')) return;
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

  const isBadgeGroup = modifier === 'cert-scroller-badges';

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
          {data.map((c) =>
            isBadgeGroup ? (
              <FlipCard
                key={c.id}
                className="badge-flip-card"
                ariaLabel={`Balik kartu untuk melihat detail ${c.title}`}
                axis="y"
                flipOnClick
                draggable
                dragDistance={0}
                tilt
                tiltMax={12}
                glare
                glareOpacity={0.22}
                hoverScale={1.03}
                perspective={1100}
                stiffness={170}
                damping={20}
                width={280}
                height={340}
                radius={20}
                background="#FFFEF0"
                color="#000000"
                shadow
                shadowColor="#000000"
                shadowOpacity={0.45}
                front={
                  <div className="badge-front">
                    <span className="cert-type" style={{ background: c.accent }}>
                      {c.type}
                    </span>
                    <img
                      className="badge-image"
                      src={c.image}
                      alt={c.title}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                    <span className="badge-front-hint">
                      <i className="fas fa-hand-pointer" aria-hidden="true"></i> KETUK / BALIK
                    </span>
                  </div>
                }
                back={
                  <div className="badge-back">
                    <span className="cert-type" style={{ background: c.accent }}>
                      {c.type}
                    </span>
                    <h3 className="badge-title">{c.title}</h3>
                    <p className="badge-issuer">
                      <i className="fas fa-medal" aria-hidden="true"></i> {c.issuer}
                    </p>
                    <p className="badge-no">№ {c.no}</p>
                    <button
                      type="button"
                      className="badge-view"
                      onPointerDownCapture={(e) => e.stopPropagation()}
                      onPointerUpCapture={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (typeof window.openModal === 'function') {
                          window.openModal(c.image);
                        }
                      }}
                    >
                      <i className="fas fa-expand-alt" aria-hidden="true"></i> Lihat Scan Penuh
                    </button>
                  </div>
                }
              />
            ) : (
              <TearTicket
                key={c.id}
                image={c.image}
                imageAlt={c.title}
                className="cert-ticket"
                width={460}
                height={250}
                stubSize={150}
                radius={16}
                holes={11}
                holeSize={5}
                imageRadius={10}
                background="#FFFEF0"
                color="#000000"
                borderColor="#000000"
                borderWidth={2}
                rotate={2}
                tiltMax={9}
                tiltReach={260}
                parallax={6}
                perspective={1000}
                ariaLabel={`Sobek tiket untuk melihat ${c.title}`}
                onTear={() => {
                  if (typeof window.openModal === 'function') {
                    window.openModal(c.image);
                  }
                }}
                stub={
                  <div className="cert-stamp">
                    <span className="cert-stamp-admit">ADMIT ONE</span>
                    <span className="cert-stamp-hint">SOBEK UNTUK MELIHAT</span>
                    <span className="cert-stamp-no">№ {c.no}</span>
                  </div>
                }
              >
                <div className="cert-ticket-body">
                  <span className="cert-type" style={{ background: c.accent }}>
                    {c.type}
                  </span>
                  <div className="cert-ticket-text">
                    <h3 className="cert-ticket-title">{c.title}</h3>
                    <p className="cert-ticket-issuer">
                      <i className="fas fa-award" aria-hidden="true"></i> {c.issuer}
                    </p>
                  </div>
                </div>
              </TearTicket>
            )
          )}
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
 * Certificates — Sertifikat sebagai tiket sobek (TearTicket), Badge sebagai kartu balik (FlipCard).
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
