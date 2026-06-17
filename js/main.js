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

export function getThemeEmoji() {
  return THEMES.find(t => t.id === currentTheme)?.emoji || '💕';
}

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
  updateCursorImage();
  renderThemeDecor();
  const loginIcon = document.getElementById('login-btn-icon');
  if (loginIcon) loginIcon.textContent = getThemeEmoji();
  if (animate) spawnThemeSparkles();
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

// ── THEME DECOR (stars, snow, lanterns, santa) ──
let decorBuilt = { trungthu: false, christmas: false, tet: false };

function renderThemeDecor() {
  buildTrungThuSky();
  buildChristmasSnow();
  buildTetDecor();
}

function buildTetDecor() {
  const decorRoot = document.getElementById('theme-decor');
  if (!decorRoot || decorBuilt.tet) return;
  decorBuilt.tet = true;

  const blossoms = [
    'assets/images/decor/tet-5.svg', // cream mai
    'assets/images/decor/tet-6.svg', // red mai
    'assets/images/decor/tet-8.svg', // dark red mai
    'assets/images/decor/tet-7.svg', // gold medallion
  ];

  // Scatter blossoms loosely around the edges, avoiding center content
  const positions = [
    { top: '8%',  left: '4%'  }, { top: '14%', left: '90%' },
    { top: '38%', left: '2%'  }, { top: '46%', left: '93%' },
    { top: '70%', left: '5%'  }, { top: '78%', left: '91%' },
    { top: '92%', left: '12%' }, { top: '95%', left: '80%' },
  ];

  positions.forEach((pos, i) => {
    const img = document.createElement('img');
    img.src = blossoms[i % blossoms.length];
    img.className = 'tet-decor tet-blossom';
    img.style.top = pos.top;
    img.style.left = pos.left;
    img.style.width = (28 + Math.random() * 26) + 'px';
    img.style.animationDuration = (5 + Math.random() * 4) + 's';
    img.style.animationDelay = (Math.random() * -5) + 's';
    decorRoot.appendChild(img);
  });

  // Cloud/wave motifs along top and bottom edges
  const cloudTop = document.createElement('img');
  cloudTop.src = 'assets/images/decor/tet-4.svg';
  cloudTop.className = 'tet-decor tet-cloud-corner';
  cloudTop.style.cssText = 'top:-2%;left:-2%;width:280px;';
  decorRoot.appendChild(cloudTop);

  const cloudBottom = document.createElement('img');
  cloudBottom.src = 'assets/images/decor/tet-3.svg';
  cloudBottom.className = 'tet-decor tet-cloud-corner';
  cloudBottom.style.cssText = 'bottom:-2%;right:-2%;width:280px;transform:rotate(180deg);';
  decorRoot.appendChild(cloudBottom);
}

function buildTrungThuSky() {
  const sky = document.querySelector('#theme-bg .bg-sky');
  if (!sky || decorBuilt.trungthu) return;
  decorBuilt.trungthu = true;

  // Moon
  const moon = document.createElement('div');
  moon.className = 'tt-moon';
  sky.appendChild(moon);

  // Tiny twinkling stars, scattered
  const starCount = 90;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'tt-star';
    const size = 1 + Math.random() * 1.8;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 70 + '%';
    star.style.animationDuration = (1.5 + Math.random() * 3) + 's';
    star.style.animationDelay = (Math.random() * 3) + 's';
    sky.appendChild(star);
  }

  // Hanging star lanterns (đèn ông sao) along the top
  const lanternWrap = document.getElementById('lantern-wrap');
  if (lanternWrap) {
    const positions = [8, 24, 50, 76, 92];
    positions.forEach((leftPct, i) => {
      const lantern = document.createElement('div');
      lantern.className = 'lantern lantern-star';
      lantern.style.left = leftPct + '%';
      lantern.style.animationDelay = (i * 0.4) + 's';
      lantern.innerHTML = `
        <div class="lantern-string"></div>
        <svg viewBox="0 0 100 100" class="lantern-star-svg">
          <polygon points="50,5 61,38 96,38 67,59 78,92 50,71 22,92 33,59 4,38 39,38"
                   fill="#ffcc44" stroke="#ff8c00" stroke-width="3"/>
        </svg>
      `;
      lanternWrap.appendChild(lantern);
    });
  }
}

function buildChristmasSnow() {
  const snowLayer = document.querySelector('#theme-bg .bg-snow');
  if (!snowLayer || decorBuilt.christmas) return;
  decorBuilt.christmas = true;

  const snowflakeSvgs = [
    'assets/images/decor/snowflake-1.svg',
    'assets/images/decor/snowflake-2.svg',
    'assets/images/decor/snowflake-3.svg',
  ];

  // Small plain dots (majority, lightweight)
  const dotCount = 60;
  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement('div');
    dot.className = 'snow-dot';
    const size = 2 + Math.random() * 3;
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';
    dot.style.left = Math.random() * 100 + '%';
    dot.style.animationDuration = (8 + Math.random() * 10) + 's';
    dot.style.animationDelay = (Math.random() * -15) + 's';
    snowLayer.appendChild(dot);
  }

  // A handful of actual snowflake SVGs, larger, slower
  const flakeCount = 14;
  for (let i = 0; i < flakeCount; i++) {
    const flake = document.createElement('img');
    flake.src = snowflakeSvgs[i % snowflakeSvgs.length];
    flake.className = 'snow-flake-svg';
    const size = 18 + Math.random() * 28;
    flake.style.width = size + 'px';
    flake.style.left = Math.random() * 100 + '%';
    flake.style.animationDuration = (14 + Math.random() * 12) + 's, ' + (6 + Math.random() * 8) + 's';
    flake.style.animationDelay = (Math.random() * -20) + 's';
    snowLayer.appendChild(flake);
  }
}


// Each theme has its own custom SVG cursor image (Lỳ Lợm's designs).
// We render it as an <img> following the mouse instead of CSS `cursor:`
// because CSS cursor caps out at 128x128 and can't be styled/animated well.
let curX = 0, curY = 0, curTrailX = 0, curTrailY = 0;

const CURSOR_IMAGES = {
  anniversary: 'assets/images/cursors/vlt-anni.svg',
  tet:         'assets/images/cursors/tet.svg',
  trungthu:    'assets/images/cursors/trungthu.svg',
  valentine:   'assets/images/cursors/vlt-anni.svg',
  christmas:   'assets/images/cursors/christmas.svg',
  birthday:    'assets/images/cursors/birthday.svg',
};

function getCursorImg() {
  return CURSOR_IMAGES[currentTheme] || CURSOR_IMAGES.anniversary;
}

function updateCursorImage() {
  const img = document.getElementById('cursor-img');
  if (img) img.src = getCursorImg();
}

function initCursor() {
  const wrap = document.getElementById('cursor');
  if (!wrap || window.matchMedia('(pointer: coarse)').matches) {
    if (wrap) wrap.style.display = 'none';
    return;
  }

  document.addEventListener('mousemove', e => { curX = e.clientX; curY = e.clientY; });
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

  updateCursorImage();

  const interactables = 'a, button, [data-hover], .photo-card, .theme-option, .year-tab, .view-btn, .nav-links a';
  document.querySelectorAll(interactables).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  (function loop() {
    curTrailX += (curX - curTrailX) * 0.35;
    curTrailY += (curY - curTrailY) * 0.35;
    wrap.style.left = curTrailX + 'px';
    wrap.style.top  = curTrailY + 'px';
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
