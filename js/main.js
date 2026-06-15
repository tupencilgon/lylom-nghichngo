// ═══════════════════════════════════════════════
// MAIN.JS — Cursor, Themes, Particles, UI
// Lỳ Lợm & Nghịch Ngợm
// ═══════════════════════════════════════════════

// ── THEME SYSTEM ────────────────────────────────
const THEMES = [
  { id: 'anniversary', label: 'Anniversary',    emoji: '💕', dot: '#e8305a' },
  { id: 'tet',         label: 'Tết Nguyên Đán', emoji: '🧧', dot: '#ff3000' },
  { id: 'trungthu',    label: 'Tết Trung Thu',  emoji: '🏮', dot: '#ff8c00' },
  { id: 'valentine',   label: 'Lễ Tình Nhân',   emoji: '💝', dot: '#ff3399' },
  { id: 'christmas',   label: 'Giáng Sinh',     emoji: '🎄', dot: '#44dd66' },
  { id: 'birthday',    label: 'Birthday',       emoji: '🎂', dot: '#ffd23f' },
];

let currentTheme = localStorage.getItem('theme') || 'anniversary';

function applyTheme(id, animate = true) {
  currentTheme = id;
  localStorage.setItem('theme', id);
  if (animate) document.body.classList.add('theme-transitioning');
  if (id === 'anniversary') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', id);
  }
  setTimeout(() => document.body.classList.remove('theme-transitioning'), 600);
  updateThemePanel();
  updateParticleColor();
  spawnThemeSparkles();
}

function buildThemePanel() {
  const panel = document.getElementById('theme-panel');
  const btn   = document.getElementById('theme-btn');
  if (!panel || !btn) return;

  panel.innerHTML = '';
  THEMES.forEach(t => {
    const opt = document.createElement('button');
    opt.className = 'theme-option' + (t.id === currentTheme ? ' active' : '');
    opt.innerHTML = `<span class="theme-dot" style="background:${t.dot}"></span>${t.emoji} ${t.label}`;
    opt.addEventListener('click', () => {
      applyTheme(t.id);
      panel.classList.remove('open');
    });
    panel.appendChild(opt);
  });
  updateThemeBtn();
}

function updateThemePanel() {
  document.querySelectorAll('.theme-option').forEach(opt => {
    const id = opt.textContent.trim().includes('Anniversary') ? 'anniversary'
      : THEMES.find(t => opt.textContent.includes(t.label))?.id;
    opt.classList.toggle('active', id === currentTheme);
  });
  updateThemeBtn();
}

function updateThemeBtn() {
  const btn = document.getElementById('theme-btn');
  if (!btn) return;
  const t = THEMES.find(th => th.id === currentTheme);
  if (t) btn.innerHTML = `${t.emoji} <span>${t.label}</span> ▾`;
}

// ── CURSOR ──────────────────────────────────────
let curX = 0, curY = 0, ringX = 0, ringY = 0;

function initCursor() {
  const wrap = document.getElementById('cursor');
  if (!wrap || window.matchMedia('(pointer: coarse)').matches) {
    if (wrap) wrap.style.display = 'none';
    return;
  }

  document.addEventListener('mousemove', e => { curX = e.clientX; curY = e.clientY; });
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  const interactables = 'a, button, [data-hover], .photo-card, .theme-option, .year-tab, .view-btn, .nav-links a';
  document.querySelectorAll(interactables).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  (function loop() {
    ringX += (curX - ringX) * 0.13;
    ringY += (curY - ringY) * 0.13;
    dot.style.left  = curX + 'px';
    dot.style.top   = curY + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(loop);
  })();
}

// ── PARTICLES ───────────────────────────────────
let particleCtx, particles = [], particleColor = '#e8305a';

function getParticleColor() {
  const colors = {
    anniversary: '#e8305a',
    tet:         '#ff3000',
    trungthu:    '#ff8c00',
    valentine:   '#ff3399',
    christmas:   '#44dd66',
    birthday:    '#ff6b35',
  };
  return colors[currentTheme] || '#e8305a';
}

function updateParticleColor() {
  particleColor = getParticleColor();
}

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  particleCtx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 60; i++) spawnParticle();
  animParticles();
}

function resize() {
  const canvas = document.getElementById('particle-canvas');
  if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
}

function spawnParticle() {
  const shapes = { anniversary:'heart', tet:'circle', trungthu:'star', valentine:'heart', christmas:'snowflake', birthday:'circle' };
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight + window.innerHeight,
    size: 3 + Math.random() * 5,
    speed: 0.3 + Math.random() * 0.6,
    opacity: 0.1 + Math.random() * 0.35,
    sway: (Math.random() - 0.5) * 0.8,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.03,
    shape: shapes[currentTheme] || 'circle',
  });
}

function drawHeart(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.5);
  ctx.bezierCurveTo(size * 0.8, -size * 1.2, size * 1.6, size * 0.2, 0, size);
  ctx.bezierCurveTo(-size * 1.6, size * 0.2, -size * 0.8, -size * 1.2, 0, -size * 0.5);
  ctx.fill();
  ctx.restore();
}

function drawStar(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
    const a2 = ((i * 4 + 2) * Math.PI) / 5 - Math.PI / 2;
    ctx.lineTo(Math.cos(a2) * size * 0.4, Math.sin(a2) * size * 0.4);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function animParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas || !particleCtx) return;
  particleCtx.clearRect(0, 0, canvas.width, canvas.height);
  const color = getParticleColor();

  particles.forEach((p, i) => {
    p.y -= p.speed;
    p.x += p.sway;
    p.rot += p.rotSpeed;
    if (p.y < -20) { particles.splice(i, 1); spawnParticle(); return; }

    particleCtx.save();
    particleCtx.globalAlpha = p.opacity;
    particleCtx.fillStyle = color;
    particleCtx.strokeStyle = color;
    particleCtx.rotate(p.rot);

    if (p.shape === 'heart') drawHeart(particleCtx, p.x, p.y, p.size);
    else if (p.shape === 'star') drawStar(particleCtx, p.x, p.y, p.size);
    else {
      particleCtx.beginPath();
      particleCtx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
      particleCtx.fill();
    }
    particleCtx.restore();
  });

  requestAnimationFrame(animParticles);
}

// ── SPARKLES ON THEME CHANGE ─────────────────────
function spawnThemeSparkles() {
  for (let i = 0; i < 12; i++) {
    const el = document.createElement('div');
    el.className = 'sparkle';
    el.style.cssText = `
      left:${10 + Math.random() * 80}vw;
      top:${10 + Math.random() * 80}vh;
      font-size:${1 + Math.random() * 1.5}rem;
      position:fixed; z-index:9999; pointer-events:none;
      animation: sparkle ${0.8 + Math.random() * 0.6}s ease forwards;
      animation-delay: ${Math.random() * 0.4}s;
    `;
    const t = THEMES.find(th => th.id === currentTheme);
    el.textContent = t?.emoji || '✨';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }
}

// ── SCROLL REVEAL ────────────────────────────────
function initScrollReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// ── NAVBAR ───────────────────────────────────────
function initNavbar() {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.querySelector('.nav-links');
  const btn    = document.getElementById('theme-btn');
  const panel  = document.getElementById('theme-panel');

  toggle?.addEventListener('click', () => links?.classList.toggle('open'));

  btn?.addEventListener('click', e => { e.stopPropagation(); panel?.classList.toggle('open'); });
  document.addEventListener('click', () => panel?.classList.remove('open'));
  panel?.addEventListener('click', e => e.stopPropagation());

  // Active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
  });
}

// ── LOADING SCREEN ───────────────────────────────
function initLoading() {
  const loading = document.getElementById('loading');
  if (!loading) return;
  setTimeout(() => {
    loading.classList.add('hide');
    setTimeout(() => loading.remove(), 700);
  }, 1300);
}

// ── TOAST ────────────────────────────────────────
export function showToast(message, duration = 3000) {
  let wrap = document.getElementById('toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  wrap.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(40px)'; setTimeout(() => toast.remove(), 400); }, duration);
}

// ── LIGHTBOX ────────────────────────────────────
let lightboxPhotos = [], lightboxIdx = 0;

export function openLightbox(photos, index) {
  lightboxPhotos = photos;
  lightboxIdx = index;
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.add('open');
  renderLightbox();
  document.body.style.overflow = 'hidden';
}

function renderLightbox() {
  const photo = lightboxPhotos[lightboxIdx];
  if (!photo) return;
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  const dt  = document.getElementById('lightbox-date');
  if (img) img.src = photo.url;
  if (cap) cap.textContent = photo.caption || '';
  if (dt)  dt.textContent  = photo.date ? formatDate(photo.date) : '';
}

function initLightbox() {
  const lb    = document.getElementById('lightbox');
  const close = document.getElementById('lightbox-close');
  const prev  = document.getElementById('lightbox-prev');
  const next  = document.getElementById('lightbox-next');
  if (!lb) return;

  close?.addEventListener('click', () => { lb.classList.remove('open'); document.body.style.overflow = ''; });
  lb.addEventListener('click', e => { if (e.target === lb) { lb.classList.remove('open'); document.body.style.overflow = ''; } });
  prev?.addEventListener('click', () => { lightboxIdx = (lightboxIdx - 1 + lightboxPhotos.length) % lightboxPhotos.length; renderLightbox(); });
  next?.addEventListener('click', () => { lightboxIdx = (lightboxIdx + 1) % lightboxPhotos.length; renderLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') { lb.classList.remove('open'); document.body.style.overflow = ''; }
    if (e.key === 'ArrowLeft')  { lightboxIdx = (lightboxIdx - 1 + lightboxPhotos.length) % lightboxPhotos.length; renderLightbox(); }
    if (e.key === 'ArrowRight') { lightboxIdx = (lightboxIdx + 1) % lightboxPhotos.length; renderLightbox(); }
  });
}

// ── ANNIVERSARY COUNTER ──────────────────────────
export function renderCounter(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const start = new Date('2024-08-01');
  function update() {
    const now  = new Date();
    const diff = now - start;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs  = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    el.innerHTML = `
      <span class="cnt-block"><span class="cnt-num">${days}</span><span class="cnt-unit">ngày</span></span>
      <span class="cnt-sep">:</span>
      <span class="cnt-block"><span class="cnt-num">${String(hrs).padStart(2,'0')}</span><span class="cnt-unit">giờ</span></span>
      <span class="cnt-sep">:</span>
      <span class="cnt-block"><span class="cnt-num">${String(mins).padStart(2,'0')}</span><span class="cnt-unit">phút</span></span>
      <span class="cnt-sep">:</span>
      <span class="cnt-block"><span class="cnt-num">${String(secs).padStart(2,'0')}</span><span class="cnt-unit">giây</span></span>
    `;
  }
  update();
  setInterval(update, 1000);
}

// ── UTILS ────────────────────────────────────────
export function formatDate(date) {
  if (!(date instanceof Date)) date = new Date(date);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function groupByMonthYear(photos) {
  const groups = {};
  photos.forEach(p => {
    const d = p.date instanceof Date ? p.date : new Date(p.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!groups[key]) groups[key] = { year: d.getFullYear(), month: d.getMonth(), photos: [] };
    groups[key].photos.push(p);
  });
  return Object.values(groups).sort((a, b) => b.year - a.year || b.month - a.month);
}

export function getUniqueYears(photos) {
  return [...new Set(photos.map(p => {
    const d = p.date instanceof Date ? p.date : new Date(p.date);
    return d.getFullYear();
  }))].sort((a, b) => b - a);
}

const MONTHS_VI = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                   'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
export function monthName(idx) { return MONTHS_VI[idx] || ''; }

// ── INIT ALL ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme, false);
  buildThemePanel();
  initCursor();
  initParticles();
  initScrollReveal();
  initNavbar();
  initLoading();
  initLightbox();
});
