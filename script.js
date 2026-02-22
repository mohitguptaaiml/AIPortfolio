/* =====================================================
   90s RETRO PORTFOLIO — script.js
   ===================================================== */

'use strict';

// ============================================================
// 1. CLOCK
// ============================================================
function updateClock() {
  const clock = document.getElementById('nav-clock');
  if (!clock) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  clock.textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================================
// 2. CUSTOM CURSOR
// ============================================================
const dot     = document.getElementById('cursor-dot');
const outline = document.getElementById('cursor-outline');

if (dot && outline) {
  let mouseX = 0, mouseY = 0;
  let outX = 0, outY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateCursor() {
    outX += (mouseX - outX) * 0.12;
    outY += (mouseY - outY) * 0.12;
    outline.style.left = outX + 'px';
    outline.style.top  = outY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Grow on hover over interactive elements
  const hoverTargets = 'a, button, .photo-circle, .card, .tech-tag, .badge, input, textarea';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('hovered'));
    el.addEventListener('mouseleave', () => outline.classList.remove('hovered'));
  });
}

// ============================================================
// 3. MATRIX RAIN EFFECT
// ============================================================
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let cols, drops, fontSize = 14;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()-=_+[]{}|;:,.<>?/\\~`ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩあいうえおかきくけこ';

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / fontSize);
    drops = Array(cols).fill(1);
  }
  resize();
  window.addEventListener('resize', resize);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px Share Tech Mono, monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = drops[i] * fontSize < 50
        ? '#ffffff'
        : '#00ff41';
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  setInterval(drawMatrix, 45);
})();

// ============================================================
// 4. TYPING EFFECT
// ============================================================
(function initTyping() {
  const el = document.getElementById('typed-title');
  if (!el) return;
  const titles = [
    'Full Stack Developer',
    'UI/UX Enthusiast',
    'Problem Solver',
    'Open Source Contributor',
    'Tech Explorer',
    'Creative Coder'
  ];
  let ti = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 90, SPEED_DELETE = 50, PAUSE = 1800;

  function type() {
    const current = titles[ti];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) {
        deleting = true;
        setTimeout(type, PAUSE);
        return;
      }
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        ti = (ti + 1) % titles.length;
      }
    }
    setTimeout(type, deleting ? SPEED_DELETE : SPEED_TYPE);
  }
  setTimeout(type, 400);
})();

// ============================================================
// 5. GLITCH on HERO NAME
// ============================================================
const heroName = document.querySelector('.hero-name');
if (heroName) {
  heroName.setAttribute('data-text', heroName.textContent);
}

// ============================================================
// 6. SKILL BAR ANIMATION (IntersectionObserver)
// ============================================================
const skillBars = document.querySelectorAll('.skill-bar');
if (skillBars.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const w = bar.getAttribute('data-width') || '0';
        bar.style.width = w + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(bar => observer.observe(bar));
}

// ============================================================
// 7. FADE-IN ON SCROLL (cards)
// ============================================================
const fadeEls = document.querySelectorAll('.card, .timeline-item, .project-card');
if (fadeEls.length) {
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(25px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
    fadeObserver.observe(el);
  });
}

// ============================================================
// 8. NAVBAR ACTIVE STATE ON SCROLL
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  let current = '';
  sections.forEach(section => {
    if (scrollY >= section.offsetTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = '';
    link.style.borderColor = 'transparent';
    link.style.boxShadow = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--green)';
      link.style.borderColor = 'var(--green)';
      link.style.boxShadow = '0 0 8px var(--green-glow)';
    }
  });
}, { passive: true });

// ============================================================
// 9. BACK TO TOP BUTTON
// ============================================================
const btn = document.getElementById('back-to-top');
if (btn) {
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============================================================
// 10. CONTACT FORM
// ============================================================
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn  = document.getElementById('submit-btn');

if (form && formStatus && submitBtn) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = '>> ERROR: ALL FIELDS REQUIRED <<';
      formStatus.className = 'form-status error';
      return;
    }

    submitBtn.textContent = '[ TRANSMITTING... ]';
    submitBtn.disabled = true;
    formStatus.textContent = '';

    // Simulate sending (replace with actual API call or FormSubmit)
    await new Promise(r => setTimeout(r, 1800));

    // Success simulation
    formStatus.textContent = '>> MESSAGE TRANSMITTED SUCCESSFULLY! <<';
    formStatus.className = 'form-status success';
    form.reset();
    submitBtn.textContent = '[[ TRANSMIT MESSAGE >>]]';
    submitBtn.disabled = false;

    setTimeout(() => { formStatus.textContent = ''; formStatus.className = 'form-status'; }, 5000);
  });
}

// ============================================================
// 11. GLITCH FLICKER — random glitch on page every few seconds
// ============================================================
function randomGlitch() {
  const body = document.body;
  body.style.filter = 'hue-rotate(90deg) brightness(1.1)';
  setTimeout(() => {
    body.style.filter = '';
    body.style.transform = 'skewX(0.3deg)';
    setTimeout(() => {
      body.style.transform = '';
    }, 80);
  }, 60);
}
setInterval(randomGlitch, 8000 + Math.random() * 8000);

// ============================================================
// 12. TERMINAL TYPEWRITER — boot message on load
// ============================================================
(function bootSequence() {
  const lines = [
    'BIOS v2.48.69 — System OK',
    'Initializing portfolio.exe...',
    'Loading assets... [████████████] 100%',
    'Decrypting user data...',
    'Authentication successful.',
    'Welcome to Portfolio OS v1.0',
  ];
  const container = document.createElement('div');
  container.id = 'boot-screen';
  container.style.cssText = `
    position: fixed; inset: 0; background: #000; z-index: 99999;
    display: flex; flex-direction: column; justify-content: center;
    align-items: flex-start; padding: 3rem;
    font-family: 'Share Tech Mono', monospace;
    font-size: 14px; color: #00ff41;
  `;
  document.body.appendChild(container);

  let li = 0;

  function nextLine() {
    if (li >= lines.length) {
      container.style.opacity = '1';
      container.style.transition = 'opacity 0.6s ease';
      container.style.opacity = '0';
      setTimeout(() => container.remove(), 700);
      return;
    }
    const p = document.createElement('p');
    p.style.margin = '4px 0';
    container.appendChild(p);

    let ci = 0;
    const text = lines[li];
    const t = setInterval(() => {
      p.textContent = '> ' + text.slice(0, ++ci);
      if (ci >= text.length) {
        clearInterval(t);
        li++;
        setTimeout(nextLine, 180);
      }
    }, 30);
  }
  nextLine();
})();

// ============================================================
// 13. SMOOTH NAV SCROLL
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================================
// 14. PHOTO CIRCLE — hover ripple
// ============================================================
const photoCircle = document.getElementById('photo-circle');
if (photoCircle) {
  photoCircle.addEventListener('click', () => {
    const msg = document.createElement('div');
    msg.textContent = '📂 REPLACE WITH YOUR PHOTO';
    msg.style.cssText = `
      position:fixed; bottom:2rem; left:50%; transform:translateX(-50%);
      background:var(--green); color:#000;
      font-family:'Press Start 2P', cursive; font-size:9px;
      padding:12px 20px; border-radius:4px; z-index:9999;
      box-shadow:0 0 20px var(--green-glow);
      animation:fadeInUp 0.3s ease;
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  });
}
