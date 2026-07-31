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