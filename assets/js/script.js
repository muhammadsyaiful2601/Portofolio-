// === Mobile Menu Toggle ===
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
}

// === Scroll to Top Button ===
const scrollBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollBtn.style.display = 'flex';
  } else {
    scrollBtn.style.display = 'none';
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === Image Modal ===
function openModal(src) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  modalImg.src = src;
  modal.classList.add('open');
}

function closeModal() {
  document.getElementById('imageModal').classList.remove('open');
}

document.getElementById('imageModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

// === Smooth scroll for nav links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// === Rotating Profile Photo ===
const profilePhotos = [
  'assets/profile/IMG_20250417_160308.jpg',
  'assets/profile/WhatsApp Image 2026-07-06 at 14.22.19.jpeg',
  'assets/profile/WhatsApp Image 2026-07-06 at 14.22.20 (1).jpeg',
  'assets/profile/WhatsApp Image 2026-07-06 at 14.22.20.jpeg',
  'assets/profile/WhatsApp Image 2026-07-06 at 14.22.21 (1).jpeg',
  'assets/profile/WhatsApp Image 2026-07-06 at 14.22.21.jpeg',
  'assets/profile/WhatsApp Image 2026-07-06 at 14.22.22.jpeg'
];

let currentPhotoIndex = 0;
const profileImg = document.getElementById('profilePhoto');

if (profileImg) {
  setInterval(() => {
    currentPhotoIndex = (currentPhotoIndex + 1) % profilePhotos.length;
    profileImg.style.opacity = '0';
    profileImg.style.transform = 'scale(0.9)';
    setTimeout(() => {
      profileImg.src = profilePhotos[currentPhotoIndex];
      profileImg.style.opacity = '1';
      profileImg.style.transform = 'scale(1)';
    }, 300);
  }, 5000);
}

// === MATRIX RAIN BACKGROUND ===
const matrixCanvas = document.createElement('canvas');
matrixCanvas.id = 'matrixCanvas';
document.body.prepend(matrixCanvas);
const ctx = matrixCanvas.getContext('2d');

let matrixDrops = [];
const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>/{}[]|&^%$#@!';

function resizeMatrixCanvas() {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  
  const columns = Math.floor(matrixCanvas.width / 14);
  matrixDrops = [];
  for (let i = 0; i < columns; i++) {
    matrixDrops[i] = Math.floor(Math.random() * -matrixCanvas.height / 20);
  }
}

function drawMatrix() {
  ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
  ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  
  for (let i = 0; i < matrixDrops.length; i++) {
    const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    const x = i * 14;
    const y = matrixDrops[i] * 20;
    
    // Gradient color: brighter at top, dimmer at bottom
    const brightness = Math.max(0, 1 - (y / matrixCanvas.height));
    ctx.fillStyle = `rgba(255, 107, 107, ${brightness * 0.5})`;
    ctx.font = '14px monospace';
    ctx.fillText(char, x, y);
    
    if (y > matrixCanvas.height && Math.random() > 0.975) {
      matrixDrops[i] = 0;
    }
    matrixDrops[i]++;
  }
}

window.addEventListener('resize', resizeMatrixCanvas);
resizeMatrixCanvas();
setInterval(drawMatrix, 50);

// === FLOATING PARTICLES ===
function createParticles() {
  const container = document.createElement('div');
  container.className = 'particle-container';
  document.body.prepend(container);
  
  const particleCount = 25;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 5 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 12 + 8) + 's';
    particle.style.animationDelay = (Math.random() * 12) + 's';
    container.appendChild(particle);
  }
}

createParticles();

// === MOUSE GLOW EFFECT - BINARY STREAM (only while moving) ===
const binaryCanvas = document.createElement('canvas');
binaryCanvas.style.position = 'fixed';
binaryCanvas.style.top = '0';
binaryCanvas.style.left = '0';
binaryCanvas.style.width = '100%';
binaryCanvas.style.height = '100%';
binaryCanvas.style.pointerEvents = 'none';
binaryCanvas.style.zIndex = '9999';
binaryCanvas.style.mixBlendMode = 'screen';
document.body.appendChild(binaryCanvas);

const binCtx = binaryCanvas.getContext('2d');
let mouseX = -100, mouseY = -100;
let binaryParticles = [];
let binaryActive = false;
let binaryRAF = null;
let mouseStopTimer = null;

function resizeBinaryCanvas() {
  binaryCanvas.width = window.innerWidth;
  binaryCanvas.height = window.innerHeight;
}

function updateBinaryParticles() {
  if (!binaryActive) return;
  const count = 2;
  for (let i = 0; i < count; i++) {
    binaryParticles.push({
      x: mouseX + (Math.random() - 0.5) * 30,
      y: mouseY + (Math.random() - 0.5) * 30,
      char: Math.random() > 0.5 ? '1' : '0',
      size: Math.random() * 10 + 12,
      alpha: 0.8 + Math.random() * 0.2,
      life: 1,
      decay: 0.008 + Math.random() * 0.012,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -Math.random() * 1.5 - 0.5
    });
  }
  
  if (binaryParticles.length > 200) {
    binaryParticles.splice(0, binaryParticles.length - 200);
  }
}

function drawBinary() {
  binCtx.clearRect(0, 0, binaryCanvas.width, binaryCanvas.height);
  
  // Always draw remaining particles even when inactive (for smooth fade-out)
  for (let i = binaryParticles.length - 1; i >= 0; i--) {
    const p = binaryParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;
    p.alpha = p.life * 0.8;
    
    if (p.life <= 0) {
      binaryParticles.splice(i, 1);
      continue;
    }
    
    binCtx.font = `bold ${p.size}px monospace`;
    binCtx.fillStyle = `rgba(255, 230, 109, ${p.alpha})`;
    binCtx.shadowColor = 'rgba(255, 107, 107, 0.6)';
    binCtx.shadowBlur = 15;
    binCtx.fillText(p.char, p.x, p.y);
    binCtx.shadowBlur = 0;
  }
  
  // If inactive and all particles are gone, stop the loop
  if (!binaryActive && binaryParticles.length === 0 && binaryRAF) {
    cancelAnimationFrame(binaryRAF);
    binaryRAF = null;
    binCtx.clearRect(0, 0, binaryCanvas.width, binaryCanvas.height);
  }
}

function binaryLoop() {
  updateBinaryParticles();
  drawBinary();
  binaryRAF = requestAnimationFrame(binaryLoop);
}

function startBinaryEffect() {
  if (binaryActive) return;
  binaryActive = true;
  binaryParticles = [];
  if (!binaryRAF) {
    binaryLoop();
  }
}

function stopBinaryEffect() {
  binaryActive = false;
  // Don't clear particles — let them fade out naturally via the animation loop
  // The loop will keep running until all particles decay to zero
}

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Start effect on first move
  if (!binaryActive) {
    startBinaryEffect();
  }
  
  // Reset the stop timer
  clearTimeout(mouseStopTimer);
  mouseStopTimer = setTimeout(() => {
    stopBinaryEffect();
  }, 300); // Stop 300ms after mouse stops moving
});

window.addEventListener('resize', resizeBinaryCanvas);
resizeBinaryCanvas();

// === METEOR TRAIL EFFECT ===
let lastTrailTime = 0;
const trailContainer = document.createElement('div');
trailContainer.className = 'meteor-trail-container';
document.body.appendChild(trailContainer);

document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastTrailTime < 30) return;
  lastTrailTime = now;
  
  const trail = document.createElement('div');
  trail.className = 'meteor-trail';
  
  const size = Math.random() * 6 + 3;
  const hues = [0, 20, 45, 170];
  const hue = hues[Math.floor(Math.random() * hues.length)] + Math.random() * 10;
  
  trail.style.width = size + 'px';
  trail.style.height = size + 'px';
  trail.style.left = (e.clientX - size / 2) + 'px';
  trail.style.top = (e.clientY - size / 2) + 'px';
  trail.style.background = `radial-gradient(circle, hsl(${hue}, 80%, 70%), hsl(${hue}, 80%, 40%))`;
  trail.style.boxShadow = `0 0 ${size * 3}px hsl(${hue}, 80%, 50%), 0 0 ${size * 6}px hsl(${hue}, 80%, 30%)`;
  
  trailContainer.appendChild(trail);
  
  // Animate the trail: move in a random direction and fade
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 40 + 20;
  const dx = Math.cos(angle) * distance;
  const dy = Math.sin(angle) * distance;
  
  trail.animate([
    { transform: 'translate(0, 0) scale(1)', opacity: 0.9 },
    { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0 }
  ], {
    duration: Math.random() * 300 + 200,
    easing: 'ease-out'
  });
  
  setTimeout(() => trail.remove(), 500);
});

// === CLICK BURST EFFECT ===
document.addEventListener('click', (e) => {
  const burstCount = 8;
  for (let i = 0; i < burstCount; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark';
    const size = Math.random() * 6 + 3;
    const angle = (i / burstCount) * Math.PI * 2;
    const distance = Math.random() * 60 + 30;
    
    spark.style.width = size + 'px';
    spark.style.height = size + 'px';
    spark.style.left = e.clientX + 'px';
    spark.style.top = e.clientY + 'px';
    spark.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
    spark.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
    const sparkHues = [0, 20, 45, 170];
    const sparkHue = sparkHues[Math.floor(Math.random() * sparkHues.length)] + Math.random() * 10;
    spark.style.background = `hsl(${sparkHue}, 85%, ${55 + Math.random() * 25}%)`;
    
    document.body.appendChild(spark);
    
    setTimeout(() => spark.remove(), 600);
  }
});

// === 3D TILT ON CARDS ===
document.querySelectorAll('.about-card, .project-card, .skill-item, .contact-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// === SCROLL PROGRESS BAR ===
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  progressBar.style.width = progress + '%';
});

// === SCROLL REVEAL ===
function handleScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  reveals.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 100;
    
    if (elementTop < windowHeight - revealPoint) {
      el.classList.add('visible');
    }
  });
}

// Add reveal classes to elements
document.addEventListener('DOMContentLoaded', () => {
  // Hero elements
  document.querySelectorAll('.hero-badge, .hero h1, .hero p, .hero-actions, .hero-image').forEach((el, i) => {
    el.classList.add('reveal', `reveal-delay-${i}`);
  });
  
  // Section titles
  document.querySelectorAll('.section').forEach(section => {
    const label = section.querySelector('.section-label');
    const title = section.querySelector('.section-title');
    const subtitle = section.querySelector('.section-subtitle');
    
    if (label) label.classList.add('reveal');
    if (title) title.classList.add('reveal', 'reveal-delay-1');
    if (subtitle) subtitle.classList.add('reveal', 'reveal-delay-2');
    
    // Cards inside section
    const cards = section.querySelectorAll('.about-card, .skill-item, .project-card, .gallery-item, .contact-card');
    cards.forEach((card, i) => {
      const delay = Math.min(i, 4);
      card.classList.add('reveal', `reveal-delay-${delay}`);
    });
  });
  
  // First check on load
  handleScrollReveal();
});

window.addEventListener('scroll', handleScrollReveal);
window.addEventListener('resize', handleScrollReveal);

// === COUNTER ANIMATION ON SKILLS ===
function animateCounters() {
  document.querySelectorAll('.skill-level').forEach(bar => {
    const rect = bar.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 50;
    
    if (isVisible && !bar.dataset.animated) {
      bar.dataset.animated = 'true';
      const targetWidth = bar.style.width;
      bar.style.width = '0%';
      
      setTimeout(() => {
        bar.style.width = targetWidth;
      }, 200);
    }
  });
}

window.addEventListener('scroll', animateCounters);
window.addEventListener('load', animateCounters);

// === KEYBOARD NAVIGATION INDICATOR ===
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// === DYNAMIC GREETING BASED ON TIME ===
const greetingElement = document.querySelector('.hero h1');
if (greetingElement) {
  const hour = new Date().getHours();
  let greeting = 'Halo';
  if (hour < 12) greeting = 'Selamat Pagi';
  else if (hour < 15) greeting = 'Selamat Siang';
  else if (hour < 18) greeting = 'Selamat Sore';
  else greeting = 'Selamat Malam';
  
  greetingElement.innerHTML = greeting + ', saya<br><span class="highlight">Muhammad Syaiful</span>';
}

// === TEXT TRUNCATION WITH READ MORE ===
function setupTruncation() {
  // ---- About cards ----
  document.querySelectorAll('.about-card').forEach(card => {
    if (card.dataset.truncSetup) return; // prevent duplicate listeners
    card.dataset.truncSetup = 'true';

    const textElement = card.querySelector('.card-text') || card.querySelector('p');
    if (!textElement) return;

    if (!textElement.classList.contains('card-text')) {
      textElement.classList.add('card-text');
    }

    let readMoreBtn = card.querySelector('.read-more');
    if (!readMoreBtn) {
      readMoreBtn = document.createElement('button');
      readMoreBtn.className = 'read-more';
      readMoreBtn.type = 'button';
      textElement.insertAdjacentElement('afterend', readMoreBtn);
    }

    function updateTrunc() {
      if (textElement.scrollHeight > textElement.clientHeight + 10) {
        textElement.classList.add('truncated');
        readMoreBtn.style.display = 'inline-block';
        readMoreBtn.textContent = 'Lihat selengkapnya ▾';
      } else {
        textElement.classList.remove('truncated');
        readMoreBtn.style.display = 'none';
      }
    }
    updateTrunc();

    readMoreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = card.classList.contains('expanded');
      if (isExpanded) {
        card.classList.remove('expanded');
        textElement.classList.add('truncated');
        readMoreBtn.textContent = 'Lihat selengkapnya ▾';
      } else {
        card.classList.add('expanded');
        textElement.classList.remove('truncated');
        readMoreBtn.textContent = 'Sembunyikan ▴';
      }
    });
  });

  // ---- Project cards ----
  document.querySelectorAll('.project-card').forEach(card => {
    if (card.dataset.truncSetup) return;
    card.dataset.truncSetup = 'true';

    const body = card.querySelector('.project-body');
    const textElement = body ? body.querySelector('p') : null;
    if (!textElement || !body) return;

    let readMoreBtn = body.querySelector('.read-more');
    if (!readMoreBtn) {
      readMoreBtn = document.createElement('button');
      readMoreBtn.className = 'read-more';
      readMoreBtn.type = 'button';
      textElement.insertAdjacentElement('afterend', readMoreBtn);
    }

    function updateProjTrunc() {
      if (textElement.scrollHeight > 60) {
        textElement.classList.add('truncated');
        readMoreBtn.style.display = 'inline-block';
        readMoreBtn.textContent = 'Lihat selengkapnya ▾';
      } else {
        textElement.classList.remove('truncated');
        readMoreBtn.style.display = 'none';
      }
    }
    updateProjTrunc();

    readMoreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = body.classList.contains('expanded');
      if (isExpanded) {
        body.classList.remove('expanded');
        textElement.classList.add('truncated');
        readMoreBtn.textContent = 'Lihat selengkapnya ▾';
      } else {
        body.classList.add('expanded');
        textElement.classList.remove('truncated');
        readMoreBtn.textContent = 'Sembunyikan ▴';
      }
    });
  });
}

// Run on load
document.addEventListener('DOMContentLoaded', () => {
  setupTruncation();
});

// Re-run after scroll reveal (with duplicate-prevention guard it is safe)
const originalHandleScrollReveal = handleScrollReveal;
handleScrollReveal = function() {
  originalHandleScrollReveal();
  setTimeout(setupTruncation, 100);
};
