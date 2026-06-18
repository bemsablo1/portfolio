// Mark that JS is active — CSS uses html.js to enable the fade-in animation.
// If this script never runs (or fails to load), content stays visible by default.
document.documentElement.classList.add('js');

// ===== NAVBAR: shadow/border on scroll =====
const navBar = document.querySelector('nav');
window.addEventListener('scroll', () => {
  navBar.classList.toggle('scrolled', window.scrollY > 12);
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 90;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// ===== FADE-IN ON SCROLL =====
const faders = document.querySelectorAll('.fade-in');
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

faders.forEach((fader, i) => {
  fader.style.transitionDelay = (i % 3) * 0.08 + 's';
  appearOnScroll.observe(fader);
});

// ===== PROJECT DETAIL MODAL =====
const PROJECTS = [
  {
    match: "EROS", mark: "EU", plat: "iOS · KMP", c1: "#0a84ff", c2: "#5e5ce6",
    title: "EROS Universe",
    overview: `An OTT streaming app built on Kotlin Multiplatform. I own the iOS subscription layer and the native iOS work that shared KMP code can't reach.`,
    points: [
      `Implemented <strong>StoreKit 2</strong> subscriptions — purchase flow, transaction verification, and renewal status.`,
      `Built per-storefront pricing for the <strong>INR and US</strong> storefronts.`,
      `Built the Swift-only <strong>restore-purchases</strong> architecture and bridged it back to shared KMP code via completion handlers.`,
      `Owned the native iOS modules and platform features that shared Kotlin code couldn't cover.`
    ],
    tags: ["StoreKit 2", "Kotlin Multiplatform", "Native bridging", "App Store Connect"]
  },
  {
    match: "Rewatch", mark: "RW", plat: "tvOS · iOS", c1: "#ff6b35", c2: "#e0245e",
    title: "Rewatch — Live Scorecard",
    overview: `A reusable live match scorecard overlay shown on the TV screen during live sports, for tvOS and iOS.`,
    points: [
      `Built a multi-tab scorecard panel — <strong>Stats, Play by Play, Line Ups, Commentary</strong> — driven by the tvOS focus engine.`,
      `Engineered the focus navigation: circular tab wrap, a two-level focus hierarchy, and <strong>UIFocusGuide</strong> focus traps.`,
      `Implemented scroll-position restoration and a custom <strong>KVO-based</strong> scroll indicator (the system one is hidden on tvOS).`,
      `Debugged hard focus bugs — RTL layout inversion and back-navigation race conditions.`,
      `Streamed live commentary over <strong>WebSocket / SSE</strong> with fast-scroll handling, and packaged it as a reusable SDK.`
    ],
    tags: ["SwiftUI", "tvOS Focus Engine", "UIFocusGuide", "WebSocket / SSE", "SDK"]
  },
  {
    match: "Sun NXT", mark: "SN", plat: "iOS · tvOS", c1: "#7c3aed", c2: "#0a84ff",
    title: "Sun NXT — Shorts",
    overview: `A short-form vertical video (Reels / Shorts) feature for the Sun NXT OTT platform — built end to end as the sole developer.`,
    points: [
      `Built the entire <strong>Reels / Shorts</strong> feature solo, across <strong>iOS and tvOS</strong>.`,
      `Designed an <strong>AVPlayer</strong>-based vertical-feed playback architecture: autoplay, smooth scrolling, and prefetching.`,
      `Kept the feed smooth by avoiding the @Published-AVPlayer anti-pattern.`,
      `Built Codable models for the Shorts and Synopsis APIs, including a <strong>FlexibleDate</strong> enum for polymorphic JSON fields.`,
      `Handled tvOS focus and navigation for the shorts experience.`
    ],
    tags: ["AVPlayer", "SwiftUI", "iOS + tvOS", "Codable"]
  },
  {
    match: "Mirrorsize", mark: "MS", plat: "iOS", c1: "#00bcd4", c2: "#0a84ff",
    title: "Mirrorsize — AI Body Sizing",
    overview: `An AI body-measurement e-commerce platform. I contributed to 10+ shipped App Store apps.`,
    points: [
      `Started as an <strong>Android</strong> developer and moved to <strong>iOS</strong> within three months.`,
      `Built SwiftUI apps (MVVM, async/await) covering the full flow: garment selection, guided photo-capture for measurement, payments, and order history.`,
      `Implemented the <strong>guided measurement capture</strong> — pose validation, demo, and camera.`,
      `Integrated <strong>Stripe and Razorpay</strong> payments; shipped one app bilingual (English / Spanish).`,
      `Contributed UI/UX improvements and bug fixes across 10+ App Store apps.`
    ],
    tags: ["SwiftUI", "MVVM", "async/await", "Stripe / Razorpay"]
  },
  {
    match: "SanketLife", mark: "SL", plat: "iOS", c1: "#ef4444", c2: "#f59e0b",
    title: "SanketLife — Pocket ECG",
    overview: `A companion iOS app for a pocket-sized ECG device.`,
    points: [
      `Implemented <strong>BLE</strong> device pairing and connection with Core Bluetooth.`,
      `Built guided ECG capture, <strong>PDF report export</strong>, and cardiologist-connect flows.`,
      `Resolved <strong>SDK</strong> integration issues and bugs for external clients embedding the ECG SDK.`
    ],
    tags: ["Core Bluetooth", "PDF export", "SDK"]
  },
  {
    match: "Smart Home", mark: "RH", plat: "iOS", c1: "#10b981", c2: "#0a84ff",
    title: "RUSÉ Homes — Smart Home",
    overview: `A universal smart-home control app, built solo from the ground up.`,
    points: [
      `Built the <strong>entire iOS app from scratch</strong>, as the only developer.`,
      `Phase 1 — a shop/marketplace for smart-home device packages (room, home, office; customizable) and a DIY hub of blogs and install videos.`,
      `Phase 2 — multi-brand device control: Wipro bulbs (on/off + dimming), smart plugs (on/off + power consumption), and Philips Hue (on/off + dimming).`
    ],
    tags: ["Swift", "IoT", "Sole developer"]
  }
];

const modal = document.getElementById('project-modal');

function openProject(p){
  document.getElementById('modal-banner').style.background = `linear-gradient(135deg, ${p.c1}, ${p.c2})`;
  document.getElementById('modal-mark').textContent = p.mark;
  document.getElementById('modal-plat').textContent = p.plat;
  document.getElementById('modal-title').textContent = p.title;
  document.getElementById('modal-overview').textContent = p.overview;
  document.getElementById('modal-points').innerHTML = p.points.map(pt => `<li>${pt}</li>`).join('');
  document.getElementById('modal-tags').innerHTML = p.tags.map(t => `<span>${t}</span>`).join('');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}
function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.project-card').forEach(card => {
  const title = (card.querySelector('h3')?.textContent || '').trim();
  const proj = PROJECTS.find(p => title.includes(p.match));
  if (!proj) return;
  card.classList.add('clickable');
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('click', () => openProject(proj));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(proj); }
  });
  const content = card.querySelector('.project-content');
  if (content) {
    const hint = document.createElement('span');
    hint.className = 'project-more';
    hint.textContent = 'View details →';
    content.appendChild(hint);
  }
});

document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
