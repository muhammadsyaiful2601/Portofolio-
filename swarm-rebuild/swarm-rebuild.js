/**
 * Swarm Rebuild — Modul efek visual "rekonstruksi halaman" (DOM snapshot & animated reconstructed draw)
 * Vanilla JS murni (ES6 module), TANPA dependensi eksternal (tanpa Three.js / GSAP / html2canvas).
 *
 * - Overlay canvas layar penuh (HiDPI / devicePixelRatio aware), pointer-events: none
 * - Rendering via requestAnimationFrame, delta-time based (target 60 FPS)
 * - DOM asli disembunyikan dengan `visibility: hidden` (tidak memicu reflow/layout ulang)
 * - Ringan, bebas memory leak, cleanup otomatis (cancelAnimationFrame + remove listener + remove canvas)
 *
 * API publik:
 *   import { triggerSwarmRebuild, cancelSwarmRebuild } from './swarm-rebuild.js';
 *   const engine = triggerSwarmRebuild(targetElement, { speed: 1, hideSelector, onComplete, onCancel });
 *   cancelSwarmRebuild();
 *
 * Keyboard: Esc atau Ctrl/Cmd + Shift + R untuk membatalkan (cancel) saat animasi berjalan.
 */

/* ================= Utilitas ================= */

const TAU = Math.PI * 2;

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const hexToRgb = (hex) => {
  let h = String(hex).replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const big = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(big)) return [148, 163, 184]; // fallback slate-400
  return [(big >> 16) & 255, (big >> 8) & 255, big & 255];
};

// Resolve warna background elemen (naik ke parent jika transparan)
const resolveBgColor = (el) => {
  let node = el;
  while (node && node !== document.documentElement) {
    const c = getComputedStyle(node).backgroundColor;
    if (c && c !== 'transparent' && c !== 'rgba(0, 0, 0, 0)') return c;
    node = node.parentElement;
  }
  return '#0f172a';
};

// Rounded-rect path dengan fallback manual (untuk browser tanpa CanvasRenderingContext2D.roundRect)
const roundRectPath = (ctx, x, y, w, h, r) => {
  const rr = clamp(r, 0, Math.min(w, h) / 2);
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, rr);
    return;
  }
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
};

// Word-wrap sederhana berbasis measureText
const wrapLines = (ctx, text, maxWidth) => {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (!current || ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
};

/* ================= Kursor Digital ================= */

class SwarmCursor {
  constructor(def) {
    this.id = def.id;
    this.name = def.name;
    this.color = def.color;
    this.role = def.role; // 'wireframe' | 'text' | 'fill' | 'idle'
    this.x = 0;
    this.y = 0;
    this.tx = 0;
    this.ty = 0;
    this.angle = -Math.PI / 2;
    this.active = false;
    this.floatOffset = Math.random() * TAU;
    this.floatSpeed = 0.6 + Math.random() * 0.8;
    this.floatAmp = 6 + Math.random() * 10;
    this.trail = [];
  }

  setTarget(tx, ty) {
    this.tx = tx;
    this.ty = ty;
  }

  update(nowSec) {
    // Gerakan smooth menuju koordinat elemen target (lerp)
    const ease = this.role === 'idle' ? 0.085 : 0.13;
    this.x = lerp(this.x, this.tx, ease);
    this.y = lerp(this.y, this.ty, ease);

    // Idle float halus di sekitar target
    const fx = Math.cos(nowSec * this.floatSpeed * 0.7 + this.floatOffset) * (this.floatAmp * 0.6);
    const fy = Math.sin(nowSec * this.floatSpeed + this.floatOffset) * this.floatAmp;

    const dx = this.tx - this.x;
    const dy = this.ty - this.y;
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) this.angle = Math.atan2(dy, dx);

    const drawX = this.x + fx;
    const drawY = this.y + fy;

    // Trail / jejak kursor (maks ~0.6 detik terakhir)
    this.trail.push({ x: drawX, y: drawY, t: nowSec });
    while (this.trail.length && this.trail[0].t < nowSec - 0.6) this.trail.shift();

    return { x: drawX, y: drawY };
  }

  draw(ctx, nowSec, showLabel = true) {
    const p = this.update(nowSec);
    const [r, g, b] = hexToRgb(this.color);
    const alpha = this.active ? 1 : 0.4;

    // Jejak (trail) di belakang kursor
    if (this.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i += 1) ctx.lineTo(this.trail[i].x, this.trail[i].y);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.22)`;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    // Panah arah gerakan
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.moveTo(11, 0);
    ctx.lineTo(-8, 8);
    ctx.lineTo(-3.5, 0);
    ctx.lineTo(-8, -8);
    ctx.closePath();
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.fill();
    ctx.restore();

    // Titik inti kursor
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5.5, 0, TAU);
    ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,0.95)';
    ctx.stroke();

    // Label nama kursor (pill)
    if (showLabel) {
      const label = this.name.toUpperCase();
      ctx.save();
      ctx.font = '700 11px Inter, system-ui, sans-serif';
      const w = ctx.measureText(label).width;
      const padX = 8;
      const pillW = w + padX * 2;
      const pillH = 18;
      const pillX = p.x - pillW / 2;
      const pillY = p.y - 34;
      roundRectPath(ctx, pillX, pillY, pillW, pillH, 9);
      ctx.fillStyle = `rgba(2,6,23,${0.72 * alpha + 0.1})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${r},${g},${b},${0.6 * alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, p.x, pillY + pillH / 2 + 0.5);
      ctx.restore();
    }

    return p;
  }
}

/* ================= Definisi Kursor & Fase ================= */

const CURSORS = [
  { id: 'a', name: 'Rangka', color: '#22d3ee', role: 'wireframe' }, // Kursor A — pen-tool / vector guide
  { id: 'b', name: 'Tulis', color: '#4ade80', role: 'text' },        // Kursor B — typing caret
  { id: 'c', name: 'Warna', color: '#f472b6', role: 'fill' },        // Kursor C — fill & gambar
  { id: 'd', name: 'Detail', color: '#fde047', role: 'idle' },
  { id: 'e', name: 'Halus', color: '#c084fc', role: 'idle' },
  { id: 'f', name: 'Cahaya', color: '#fb7185', role: 'idle' },
  { id: 'g', name: 'Segar', color: '#84cc16', role: 'idle' },
  { id: 'h', name: 'Bayu', color: '#38bdf8', role: 'idle' },
];

const PHASES = ['BLANKOUT', 'SWARM', 'WIREFRAME', 'TEXT', 'FILL', 'HANDOUT'];

const BASE_DURATION = {
  BLANKOUT: 450,
  SWARM: 750,
  WIREFRAME: 750,
  TEXT: 1600,
  FILL: 850,
  HANDOUT: 600,
};

const OVERLAY_DARK = 0.72; // opasitas overlay gelap di luar fase BLANKOUT/HANDOUT
const CARD_BG = '#0f172a'; // bg kontainer yang direkonstruksi
const CARD_BORDER = 'rgba(34,211,238,0.45)';

/* ================= Engine ================= */

class SwarmRebuildEngine {
  constructor(target, options = {}) {
    this.target = target || null;
    this.options = {
      speed: options.speed || 1,
      hideSelector: options.hideSelector || null,
      onComplete: typeof options.onComplete === 'function' ? options.onComplete : null,
      onCancel: typeof options.onCancel === 'function' ? options.onCancel : null,
    };
    this.speed = clamp(Number(this.options.speed) || 1, 0.25, 8);

    this.canvas = null;
    this.ctx = null;
    this.controls = null;
    this.rafId = null;
    this.lastTime = 0;
    this.lastDt = 16;

    this.phaseIndex = 0;
    this.phaseElapsed = 0;

    this.cursors = [];
    this.content = null;
    this.hiddenEls = [];
    this.savedBodyOverflow = null;

    this.img = null;
    this.imgLoaded = false;

    this.typedText = '';
    this.typeIndex = 0;
    this.typeAccum = 0;
    this.caretVisible = true;
    this.caretAccum = 0;
    this.fillAlpha = 0;
    this.penTip = null;
    this.caretPos = null;

    this.destroyed = false;

    this.boundAnimate = this.animate.bind(this);
    this.boundResize = this.resize.bind(this);
    this.boundKeydown = this.onKeydown.bind(this);
  }

  /* ---------- Setup ---------- */

  init() {
    // Canvas overlay full-screen (diisolasi dari DOM asli)
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'swarm-rebuild-canvas';
    this.canvas.setAttribute('aria-hidden', 'true');
    this.ctx = this.canvas.getContext('2d', { alpha: true });
    // Inline fallback minimal — CSS (swarm-rebuild.css) tetap menjadi sumber styling utama
    Object.assign(this.canvas.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      inset: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '2147483646',
      pointerEvents: 'none',
      display: 'block',
    });
    document.body.appendChild(this.canvas);
    this.resize();
    window.addEventListener('resize', this.boundResize, { passive: true });

    this.createControls();
    this.captureContent();
    this.hidePageContent();

    // Spawn kursor dari titik tengah viewport
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    this.cursors = CURSORS.map((def) => new SwarmCursor(def));
    this.cursors.forEach((cur) => {
      cur.x = cx;
      cur.y = cy;
      cur.tx = cx;
      cur.ty = cy;
    });

    this.phaseIndex = 0;
    this.phaseElapsed = 0;
    this.lastTime = performance.now();

    document.addEventListener('keydown', this.boundKeydown);
    this.rafId = requestAnimationFrame(this.boundAnimate);
  }

  resize() {
    if (!this.canvas || !this.ctx) return;
    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Ikuti perubahan layout target bila ada (hindari rect usang setelah resize)
    if (this.target && this.content) {
      const r = this.target.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        this.content.rect = { x: r.left, y: r.top, width: r.width, height: r.height };
      }
    }
  }

  createControls() {
    // Floating control bar — pojok kanan bawah
    const controls = document.createElement('div');
    controls.id = 'swarm-rebuild-controls';
    controls.setAttribute('role', 'toolbar');
    controls.setAttribute('aria-label', 'Kontrol animasi Swarm Rebuild');
    // Inline fallback minimal — CSS (swarm-rebuild.css) tetap menjadi sumber styling utama
    Object.assign(controls.style, {
      position: 'fixed',
      right: '24px',
      bottom: '24px',
      zIndex: '2147483647',
      pointerEvents: 'auto',
    });

    const title = document.createElement('div');
    title.className = 'swarm-title';
    title.textContent = 'Kontrol Swarm';
    controls.appendChild(title);

    const speedRow = document.createElement('div');
    speedRow.className = 'swarm-speed-row';
    speedRow.setAttribute('aria-label', 'Kecepatan animasi');

    const speedButtons = [];
    [1, 2, 4].forEach((s) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'swarm-speed-btn';
      btn.dataset.speed = String(s);
      btn.textContent = `${s}x`;
      btn.setAttribute('aria-pressed', s === this.speed ? 'true' : 'false');
      if (s === this.speed) btn.classList.add('active');
      btn.addEventListener('click', () => {
        this.speed = s;
        speedButtons.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
      });
      speedButtons.push(btn);
      speedRow.appendChild(btn);
    });
    controls.appendChild(speedRow);

    const skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'swarm-skip-btn';
    skip.textContent = 'Skip / Cancel';
    skip.addEventListener('click', () => this.cancel());
    controls.appendChild(skip);

    document.body.appendChild(controls);
    this.controls = controls;
  }

  captureContent() {
    const fallback = {
      rect: {
        x: Math.max(24, window.innerWidth * 0.5 - 280),
        y: Math.max(24, window.innerHeight * 0.5 - 180),
        width: 560,
        height: 340,
      },
      bg: CARD_BG,
      title: 'Portofolio Saya',
      paragraph:
        'Konten ini direkonstruksi secara visual oleh efek Swarm Rebuild — setiap elemen digambar ulang di atas canvas overlay.',
      imgSrc: null,
    };

    const el = this.target;
    if (!el) {
      this.content = fallback;
      return;
    }

    const rect = el.getBoundingClientRect();
    const heading = el.querySelector('h1, h2, h3');
    const paragraph = el.querySelector('p');
    const img = el.querySelector('img');
    const rawText = (el.textContent || '').replace(/\s+/g, ' ').trim();

    this.content = {
      rect: {
        x: rect.left,
        y: rect.top,
        width: Math.max(rect.width, 220),
        height: Math.max(rect.height, 140),
      },
      bg: resolveBgColor(el),
      title: (heading ? heading.textContent : rawText.split(/[.!?\n]/)[0] || 'Judul').trim().slice(0, 120),
      paragraph: (paragraph
        ? paragraph.textContent
        : rawText.slice((heading ? heading.textContent.length : 0) + 1) || 'Konten portofolio.'
      ).trim().slice(0, 400),
      imgSrc: img && img.currentSrc ? img.currentSrc : img ? img.src : null,
    };

    // Preload gambar (digambar di Fase FILL bila berhasil dimuat)
    this.img = null;
    this.imgLoaded = false;
    if (this.content.imgSrc) {
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        this.imgLoaded = true;
      };
      image.onerror = () => {
        this.imgLoaded = false;
      };
      image.src = this.content.imgSrc;
      this.img = image;
    }
  }

  hidePageContent() {
    const selector = this.options.hideSelector;
    const candidates = selector
      ? Array.from(document.querySelectorAll(selector))
      : Array.from(document.body.children).filter((node) => {
          if (node.nodeType !== 1) return false;
          if (node === this.canvas || node === this.controls) return false;
          const tag = node.tagName;
          return tag !== 'SCRIPT' && tag !== 'STYLE' && tag !== 'NOSCRIPT' && tag !== 'LINK';
        });
    // Jangan pernah sembunyikan <html>/<body>: itu akan menyembunyikan canvas & control bar juga
    const blocked = new Set([document.documentElement, document.body]);
    const safeCandidates = candidates.filter((el) => !blocked.has(el));

    safeCandidates.forEach((el) => {
      if (el._swarmHidden) return;
      el._swarmHidden = true;
      el.style.visibility = 'hidden';
      this.hiddenEls.push(el);
    });

    // Kunci scroll agar koordinat tidak bergeser saat animasi
    this.savedBodyOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
  }

  restorePageContent() {
    this.hiddenEls.forEach((el) => {
      el.style.visibility = '';
      delete el._swarmHidden;
    });
    this.hiddenEls = [];
    if (this.savedBodyOverflow !== null) {
      document.body.style.overflow = this.savedBodyOverflow;
      this.savedBodyOverflow = null;
    }
  }

  /* ---------- Loop animasi ---------- */

  animate(now) {
    if (this.destroyed) return;

    const dt = clamp(now - this.lastTime, 0, 40);
    this.lastDt = dt;
    this.lastTime = now;
    const scaledDt = dt * this.speed;
    this.phaseElapsed += scaledDt;

    const phase = PHASES[this.phaseIndex];
    const duration = BASE_DURATION[phase];
    const t = clamp(this.phaseElapsed / duration, 0, 1);

    this.draw(phase, t);

    if (t >= 1) {
      this.phaseIndex += 1;
      this.phaseElapsed = 0;
      if (this.phaseIndex >= PHASES.length) {
        this.finish();
        return;
      }
      this.resetPhaseVars();
    }

    this.rafId = requestAnimationFrame(this.boundAnimate);
  }

  resetPhaseVars() {
    const phase = PHASES[this.phaseIndex];
    if (phase === 'TEXT') {
      this.typedText = '';
      this.typeIndex = 0;
      this.typeAccum = 0;
      this.caretVisible = true;
      this.caretAccum = 0;
    } else if (phase === 'FILL') {
      this.fillAlpha = 0;
    } else if (phase === 'HANDOUT') {
      // Tampilkan kembali UI asli di bawah overlay yang sedang memudar (crossfade)
      this.restorePageContent();
    }
  }

  /* ---------- Rendering ---------- */

  draw(phase, t) {
    const ctx = this.ctx;
    if (!ctx) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const nowSec = performance.now() / 1000;
    ctx.clearRect(0, 0, W, H);

    const c = this.content;
    const { x: rx, y: ry, width: rw, height: rh } = c.rect;
    const centerX = rx + rw / 2;
    const centerY = ry + rh / 2;

    // --- Layer overlay gelap ---
    if (phase === 'BLANKOUT') {
      ctx.fillStyle = `rgba(5,7,14,${easeOutCubic(t) * OVERLAY_DARK})`;
      ctx.fillRect(0, 0, W, H);
    } else if (phase === 'HANDOUT') {
      ctx.fillStyle = `rgba(5,7,14,${OVERLAY_DARK * (1 - easeOutCubic(t))})`;
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = `rgba(5,7,14,${OVERLAY_DARK})`;
      ctx.fillRect(0, 0, W, H);
    }

    // --- Fase-spesifik: gambar konten dulu, kursor di atasnya ---
    if (phase === 'WIREFRAME') {
      this.drawCardShell(ctx, 0.22, rx, ry, rw, rh);
      this.drawWireframe(ctx, t, rx, ry, rw, rh);
    } else if (phase === 'TEXT') {
      this.drawCardShell(ctx, 0.32, rx, ry, rw, rh);
      this.drawWireframe(ctx, 1, rx, ry, rw, rh);
      this.drawText(ctx, this.lastDt * this.speed, rx, ry, rw, rh);
    } else if (phase === 'FILL') {
      this.fillAlpha = easeOutCubic(t);
      this.drawCardShell(ctx, 0.55 + 0.45 * this.fillAlpha, rx, ry, rw, rh);
      this.drawWireframe(ctx, 1, rx, ry, rw, rh, this.fillAlpha);
      this.drawText(ctx, 0, rx, ry, rw, rh, true); // teks lengkap, langsung tampil
      this.drawFill(ctx, this.fillAlpha, rx, ry, rw, rh);
    } else if (phase === 'HANDOUT') {
      const fade = 1 - easeOutCubic(t);
      ctx.save();
      ctx.globalAlpha = fade;
      this.drawCardShell(ctx, 1, rx, ry, rw, rh);
      this.drawWireframe(ctx, 1, rx, ry, rw, rh, fade);
      this.drawText(ctx, 0, rx, ry, rw, rh, true);
      this.drawFill(ctx, 1, rx, ry, rw, rh);
      ctx.restore();
    }

    // --- Kursor swarm (di atas konten) ---
    this.cursors.forEach((cur, idx) => {
      cur.active = false;
      if (phase === 'BLANKOUT') {
        cur.setTarget(W / 2, H / 2);
      } else if (phase === 'SWARM') {
        // Menyebar dari tengah menuju sekeliling elemen target
        const col = idx % 4;
        const row = Math.floor(idx / 4);
        cur.setTarget(centerX + (col - 1.5) * (rw / 3.2), centerY + (row === 0 ? -1 : 1) * (rh / 2 + 34));
      } else if (phase === 'WIREFRAME') {
        cur.active = cur.role === 'wireframe';
        // Kursor A mengejar ujung pena yang sedang menggambar wireframe
        if (cur.active && this.penTip) {
          cur.setTarget(this.penTip.x, this.penTip.y);
        } else {
          cur.setTarget(centerX, centerY);
        }
      } else if (phase === 'TEXT') {
        cur.active = cur.role === 'text';
        // Kursor B mengejar caret yang sedang mengetik
        if (cur.active && this.caretPos) {
          cur.setTarget(this.caretPos.x, this.caretPos.y);
        } else {
          cur.setTarget(centerX, ry + Math.min(64, rh * 0.22));
        }
      } else if (phase === 'FILL') {
        cur.active = cur.role === 'fill';
        cur.setTarget(rx + rw * (0.2 + 0.6 * easeInOutQuad(t)), ry + rh * 0.5);
      } else if (phase === 'HANDOUT') {
        cur.setTarget(W / 2, H / 2);
      }
      cur.draw(ctx, nowSec, true);
    });
  }

  // Shell kartu: bg solid/resolved + border + radius
  drawCardShell(ctx, opacity, rx, ry, rw, rh) {
    if (opacity <= 0) return;
    ctx.save();
    ctx.globalAlpha = clamp(opacity, 0, 1);
    roundRectPath(ctx, rx, ry, rw, rh, 16);
    ctx.fillStyle = (this.content && this.content.bg) || CARD_BG;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  // Fase WIREFRAME — menggambar 4 sisi kontainer berurutan (pen-tool / vector guide)
  drawWireframe(ctx, t, rx, ry, rw, rh, alpha = 1) {
    const segments = [
      [{ x: rx, y: ry }, { x: rx + rw, y: ry }],
      [{ x: rx + rw, y: ry }, { x: rx + rw, y: ry + rh }],
      [{ x: rx + rw, y: ry + rh }, { x: rx, y: ry + rh }],
      [{ x: rx, y: ry + rh }, { x: rx, y: ry }],
    ];
    const segProgress = clamp(t, 0, 1) * segments.length;
    const completed = Math.min(Math.floor(segProgress), segments.length);
    const segT = t >= 1 ? 1 : segProgress - Math.floor(segProgress);

    // Simpan posisi ujung pena untuk kursor A
    if (t < 1 && completed < segments.length) {
      const [p1, p2] = segments[completed];
      this.penTip = { x: lerp(p1.x, p2.x, segT), y: lerp(p1.y, p2.y, segT) };
    } else {
      this.penTip = { x: rx, y: ry };
    }

    ctx.save();
    ctx.globalAlpha = clamp(alpha, 0, 1);
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(34,211,238,0.65)';
    ctx.shadowBlur = 8;

    for (let i = 0; i < segments.length; i += 1) {
      const [p1, p2] = segments[i];
      if (i < completed) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      } else if (i === completed && t < 1) {
        const ex = lerp(p1.x, p2.x, segT);
        const ey = lerp(p1.y, p2.y, segT);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        // Titik pena di ujung garis
        ctx.beginPath();
        ctx.arc(ex, ey, 4, 0, TAU);
        ctx.fillStyle = '#22d3ee';
        ctx.fill();
      }
    }

    // Corner handles (vector guide) saat wireframe selesai / hampir selesai
    if (t >= 0.98) {
      ctx.shadowBlur = 0;
      const corners = [
        [rx, ry], [rx + rw, ry], [rx + rw, ry + rh], [rx, ry + rh],
      ];
      corners.forEach(([cx, cy]) => {
        ctx.fillStyle = '#020617';
        ctx.fillRect(cx - 4, cy - 4, 8, 8);
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cx - 4, cy - 4, 8, 8);
      });
    }
    ctx.restore();
  }

  // Fase TEXT — mengetik judul & paragraf karakter demi karakter + caret berkedip
  // fullText=true → langsung render seluruh teks (dipakai di FILL/HANDOUT)
  drawText(ctx, dtMs, rx, ry, rw, rh, fullText = false) {
    const content = this.content;
    const maxWidth = Math.max(rw - 48, 80);
    const full = `${content.title}\n${content.paragraph}`;

    ctx.save();
    // Jangan biarkan teks keluar dari kontainer
    roundRectPath(ctx, rx, ry, rw, rh, 16);
    ctx.clip();

    if (fullText) {
      this.typedText = full;
    } else {
      const typeSpeed = 18; // ms per karakter
      this.typeAccum += dtMs;
      while (this.typeIndex < full.length && this.typeAccum >= typeSpeed) {
        this.typeAccum -= typeSpeed;
        this.typedText += full[this.typeIndex];
        this.typeIndex += 1;
      }
    }

    const padX = 24;
    let yy = ry + 22;

    // Judul (shrink-to-fit, maks 2 baris)
    let titleSize = clamp(Math.round(rw / 22), 16, 26);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = `800 ${titleSize}px Inter, system-ui, sans-serif`;
    while (ctx.measureText(content.title).width > maxWidth && titleSize > 13) {
      titleSize -= 1;
      ctx.font = `800 ${titleSize}px Inter, system-ui, sans-serif`;
    }
    const typedTitle = this.typedText.split('\n')[0] || '';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(typedTitle, rx + padX, yy, maxWidth);
    yy += titleSize + 12;

    // Paragraf (word-wrap)
    const bodyFont = `400 ${clamp(Math.round(rw / 40), 11, 14)}px Inter, system-ui, sans-serif`;
    ctx.font = bodyFont;
    ctx.fillStyle = '#94a3b8';
    const paraTyped = this.typedText.includes('\n') ? this.typedText.slice(this.typedText.indexOf('\n') + 1) : '';
    const lines = wrapLines(ctx, paraTyped, maxWidth);
    const lineHeight = Math.round(parseFloat(bodyFont.match(/(\d+)px/)[1]) * 1.45);
    lines.forEach((line) => {
      ctx.fillText(line, rx + padX, yy);
      yy += lineHeight;
    });

    // Caret berkedip di ujung teks yang sedang diketik
    if (!fullText) {
      this.caretAccum += dtMs;
      if (this.caretAccum >= 450) {
        this.caretAccum = 0;
        this.caretVisible = !this.caretVisible;
      }
      if (this.caretVisible) {
        const lastLine = lines.length ? lines[lines.length - 1] : typedTitle;
        const caretX = rx + padX + ctx.measureText(lastLine).width + 2;
        const caretY = lines.length ? yy - lineHeight : ry + 22;
        const caretH = lines.length ? lineHeight - 2 : titleSize + 2;
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(caretX, caretY + 1, 2.5, caretH);
        this.caretPos = { x: caretX, y: caretY + caretH / 2 };
      } else {
        // Tetap update posisi caret agar kursor B tidak melompat saat caret berkedip
        const lastLine = lines.length ? lines[lines.length - 1] : typedTitle;
        this.caretPos = {
          x: rx + padX + ctx.measureText(lastLine).width + 2,
          y: (lines.length ? yy - lineHeight : ry + 22) + (lines.length ? lineHeight - 2 : titleSize + 2) / 2 + 1,
        };
      }
    }
    ctx.restore();
  }

  // Fase FILL — mewarnai kontainer & memasukkan elemen visual/gambar
  drawFill(ctx, alpha, rx, ry, rw, rh) {
    const a = clamp(alpha, 0, 1);
    if (a <= 0) return;

    // Sapuan cahaya diagonal (efek "paint reveal")
    ctx.save();
    roundRectPath(ctx, rx, ry, rw, rh, 16);
    ctx.clip();
    const sweepX = rx - rw * 0.4 + easeOutCubic(a) * (rw * 1.9);
    const grad = ctx.createLinearGradient(sweepX - 120, ry, sweepX + 120, ry + rh);
    grad.addColorStop(0, 'rgba(34,211,238,0)');
    grad.addColorStop(0.5, `rgba(34,211,238,${0.22 * (1 - a * 0.4)})`);
    grad.addColorStop(1, 'rgba(34,211,238,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(rx, ry, rw, rh);
    ctx.restore();

    // Placeholder / gambar visual di sisi kanan bawah kontainer
    const iw = rw * 0.34;
    const ih = rh * 0.4;
    const ix = rx + rw - iw - rw * 0.06;
    const iy = ry + rh - ih - rh * 0.08;

    ctx.save();
    ctx.globalAlpha = a;
    roundRectPath(ctx, ix, iy, iw, ih, 12);
    ctx.fillStyle = 'rgba(30,41,59,0.9)';
    ctx.fill();
    ctx.strokeStyle = CARD_BORDER;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (this.imgLoaded && this.img && this.img.naturalWidth > 0) {
      // object-fit: cover
      const scale = Math.max(iw / this.img.naturalWidth, ih / this.img.naturalHeight);
      const dw = this.img.naturalWidth * scale;
      const dh = this.img.naturalHeight * scale;
      ctx.save();
      roundRectPath(ctx, ix, iy, iw, ih, 12);
      ctx.clip();
      ctx.drawImage(this.img, ix + (iw - dw) / 2, iy + (ih - dh) / 2, dw, dh);
      ctx.restore();
    } else {
      // Skeleton + ikon bila gambar belum dimuat / tidak ada
      ctx.fillStyle = '#22d3ee';
      ctx.font = `${Math.round(ih * 0.28)}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦', ix + iw / 2, iy + ih / 2 - 8);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '11px Inter, system-ui, sans-serif';
      ctx.fillText('VISUAL', ix + iw / 2, iy + ih / 2 + ih * 0.22);
    }
    ctx.restore();
  }

  /* ---------- Selesai / Cancel ---------- */

  finish() {
    if (this.destroyed) return;
    this.cleanup();
    if (this.options.onComplete) this.options.onComplete();
  }

  cancel() {
    // Skip: langsung selesaikan & restore UI asli
    if (this.destroyed) return;
    this.cleanup();
    if (this.options.onCancel) this.options.onCancel();
  }

  cleanup() {
    if (this.destroyed) return;
    this.destroyed = true;

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    window.removeEventListener('resize', this.boundResize);
    document.removeEventListener('keydown', this.boundKeydown);

    if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    if (this.controls && this.controls.parentNode) this.controls.parentNode.removeChild(this.controls);
    this.canvas = null;
    this.ctx = null;
    this.controls = null;
    this.cursors = [];
    this.img = null;

    this.restorePageContent();
  }

  onKeydown(e) {
    const key = (e.key || '').toLowerCase();
    if (key === 'escape' || ((e.ctrlKey || e.metaKey) && e.shiftKey && key === 'r')) {
      e.preventDefault();
      this.cancel();
    }
  }
}

/* ================= API Publik ================= */

let currentEngine = null;

export function triggerSwarmRebuild(target, options = {}) {
  if (currentEngine) {
    currentEngine.cancel();
    currentEngine = null;
  }
  let engine = null;
  const wrappedOptions = {
    ...options,
    onComplete: () => {
      if (currentEngine === engine) currentEngine = null;
      if (typeof options.onComplete === 'function') options.onComplete();
    },
    onCancel: () => {
      if (currentEngine === engine) currentEngine = null;
      if (typeof options.onCancel === 'function') options.onCancel();
    },
  };
  engine = new SwarmRebuildEngine(target, wrappedOptions);
  currentEngine = engine;
  engine.init();
  return engine;
}

export function cancelSwarmRebuild() {
  if (currentEngine) {
    const engine = currentEngine;
    currentEngine = null;
    engine.cancel();
  }
}

export default { triggerSwarmRebuild, cancelSwarmRebuild };
