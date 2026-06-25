/* ===========================
   SAEID AZIZI EDUCATIONAL PLATFORM
   script.js — Complete Vanilla JS
=========================== */

'use strict';

// ===========================
// PAGE LOADER
// ===========================
(function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1600);
  });
  document.body.style.overflow = 'hidden';
})();

// ===========================
// DARK MODE
// ===========================
(function initDarkMode() {
  const btn = document.getElementById('dark-toggle');
  if (!btn) return;
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.body.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

// ===========================
// SCROLL PROGRESS
// ===========================
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = Math.min(progress, 100) + '%';
  }, { passive: true });
})();

// ===========================
// NAVBAR
// ===========================
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  if (!navbar) return;

  // Sticky shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Hamburger
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on nav link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active link on scroll
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => observer.observe(s));
})();

// ===========================
// TYPING EFFECT
// ===========================
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const phrases = [
    'برای معلمان',
    'با هوش مصنوعی',
    'از طریق بازی',
    'برای آینده',
    'با خلاقیت',
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let wait = 80;

  function type() {
    const current = phrases[phraseIdx];
    el.textContent = deleting
      ? current.substring(0, charIdx--)
      : current.substring(0, charIdx++);

    if (!deleting && charIdx > current.length) {
      deleting = true;
      wait = 1800;
    } else if (deleting && charIdx < 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      charIdx = 0;
      wait = 300;
    } else {
      wait = deleting ? 50 : 90;
    }
    setTimeout(type, wait);
  }
  setTimeout(type, 1000);
})();

// ===========================
// REVEAL ON SCROLL
// ===========================
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger by index within parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
})();

// ===========================
// ANIMATED COUNTERS
// ===========================
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const steps = 60;
    const stepValue = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(stepValue * step), target);
      el.textContent = current.toLocaleString('fa-IR') + suffix;
      if (step >= steps) {
        el.textContent = target.toLocaleString('fa-IR') + suffix;
        clearInterval(timer);
      }
    }, duration / steps);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// ===========================
// GAMES FILTER & SEARCH
// ===========================
(function initGames() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  const gameCards = document.querySelectorAll('.game-card');
  const searchInput = document.getElementById('games-search');
  const noResults = document.getElementById('no-games');

  let activeFilter = 'all';
  let searchQuery = '';

  function updateGames() {
    let visible = 0;
    gameCards.forEach(card => {
      const cat = card.dataset.category || '';
      const name = (card.dataset.name || '').toLowerCase();
      const matchFilter = activeFilter === 'all' || cat === activeFilter;
      const matchSearch = !searchQuery || name.includes(searchQuery);
      const show = matchFilter && matchSearch;
      card.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  filterBtns.forEach(btn => {
    if (!btn.hasAttribute('data-filter')) return;
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      activeFilter = btn.dataset.filter;
      updateGames();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.trim().toLowerCase();
      updateGames();
    });
  }

  // Play button handler
  document.querySelectorAll('.game-btn-play').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.game-card');
      const name = card?.dataset.name || 'بازی';
      showToast(`🎮 در حال بارگذاری "${name}"...`);
    });
  });

  document.querySelectorAll('.game-btn-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.game-card');
      const name = card?.dataset.name || 'بازی';
      showToast(`ℹ️ جزئیات "${name}" به زودی اضافه می‌شود`);
    });
  });
})();

// ===========================
// GALLERY FILTER & LIGHTBOX
// ===========================
(function initGallery() {
  const filterBtns = document.querySelectorAll('[data-gallery-filter]');
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightbox-content');
  const lightboxClose = document.getElementById('lightbox-close');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      const filter = btn.dataset.galleryFilter;
      items.forEach(item => {
        const cat = item.dataset.galleryCat || '';
        item.classList.toggle('hidden', filter !== 'all' && cat !== filter);
      });
    });
  });

  // Lightbox open
  document.querySelectorAll('.gallery-expand').forEach((btn, i) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = btn.closest('.gallery-item');
      const img = item?.querySelector('.gallery-img');
      if (img && lightbox && lightboxContent) {
        lightboxContent.innerHTML = '';
        const clone = img.cloneNode(true);
        clone.style.width = '500px';
        clone.style.height = '400px';
        clone.style.borderRadius = '12px';
        lightboxContent.appendChild(clone);
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        lightbox.focus();
      }
    });
  });

  // Lightbox close
  function closeLightbox() {
    if (lightbox) { lightbox.style.display = 'none'; }
    document.body.style.overflow = '';
  }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.style.display !== 'none') closeLightbox();
  });
})();

// ===========================
// DOWNLOADS FILTER & SEARCH
// ===========================
(function initDownloads() {
  const filterBtns = document.querySelectorAll('[data-dl-filter]');
  const cards = document.querySelectorAll('[data-dl-cat]');
  const searchInput = document.getElementById('downloads-search');

  let activeFilter = 'all';
  let searchQuery = '';

  function updateDownloads() {
    cards.forEach(card => {
      const cat = card.dataset.dlCat || '';
      const name = (card.dataset.dlName || '').toLowerCase();
      const matchFilter = activeFilter === 'all' || cat === activeFilter;
      const matchSearch = !searchQuery || name.includes(searchQuery);
      card.classList.toggle('hidden', !(matchFilter && matchSearch));
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      activeFilter = btn.dataset.dlFilter;
      updateDownloads();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.trim().toLowerCase();
      updateDownloads();
    });
  }

  // Download links
  document.querySelectorAll('.dl-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('[data-dl-cat]');
      const name = card?.dataset.dlName || 'فایل';
      showToast(`⬇️ "${name}" در حال دانلود...`);
    });
  });
})();

// ===========================
// TESTIMONIALS SLIDER
// ===========================
(function initSlider() {
  const track = document.getElementById('testimonials-track');
  const dotsContainer = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testimonial-card'));
  let total = cards.length;
  let current = 0;
  let autoplay;
  let visibleCount = window.innerWidth <= 640 ? 1 : window.innerWidth <= 900 ? 2 : 3;

  function getSlideWidth() {
    visibleCount = window.innerWidth <= 640 ? 1 : window.innerWidth <= 900 ? 2 : 3;
    return track.parentElement.offsetWidth;
  }

  function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const pages = Math.ceil(total / visibleCount);
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `اسلاید ${i + 1}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(pageIdx) {
    const pages = Math.ceil(total / visibleCount);
    current = Math.max(0, Math.min(pageIdx, pages - 1));
    const cardWidth = (track.parentElement.offsetWidth + 24) / visibleCount;
    const offset = current * visibleCount * cardWidth;
    track.style.transform = `translateX(${offset}px)`;
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function goNext() { goTo(current + 1 >= Math.ceil(total / visibleCount) ? 0 : current + 1); }
  function goPrev() { goTo(current - 1 < 0 ? Math.ceil(total / visibleCount) - 1 : current - 1); }

  if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(autoplay); goNext(); restartAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(autoplay); goPrev(); restartAutoplay(); });

  function restartAutoplay() { autoplay = setInterval(goNext, 4500); }
  restartAutoplay();

  createDots();

  // Touch support
  let startX = 0;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { clearInterval(autoplay); diff > 0 ? goNext() : goPrev(); restartAutoplay(); }
  }, { passive: true });

  // Keyboard
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { clearInterval(autoplay); goPrev(); restartAutoplay(); }
    if (e.key === 'ArrowRight') { clearInterval(autoplay); goNext(); restartAutoplay(); }
  });

  window.addEventListener('resize', () => {
    createDots();
    goTo(0);
  });

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', restartAutoplay);
})();

// ===========================
// FAQ ACCORDION
// ===========================
(function initFAQ() {
  const questions = document.querySelectorAll('.faq-question');
  questions.forEach(q => {
    q.addEventListener('click', () => {
      const expanded = q.getAttribute('aria-expanded') === 'true';
      const answerId = q.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);

      // Close all others
      questions.forEach(other => {
        if (other !== q) {
          other.setAttribute('aria-expanded', 'false');
          const otherId = other.getAttribute('aria-controls');
          const otherAnswer = document.getElementById(otherId);
          if (otherAnswer) otherAnswer.classList.remove('open');
        }
      });

      // Toggle current
      q.setAttribute('aria-expanded', (!expanded).toString());
      if (answer) answer.classList.toggle('open', !expanded);
    });
  });
})();

// ===========================
// CONTACT FORM
// ===========================
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const submitBtn = document.getElementById('contact-submit');
  const successMsg = document.getElementById('form-success');

  function validateField(input) {
    const group = input.closest('.form-group');
    const errEl = group?.querySelector('.field-error');
    let msg = '';

    if (input.required && !input.value.trim()) {
      msg = 'این فیلد اجباری است';
    } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      msg = 'آدرس ایمیل معتبر نیست';
    }

    if (errEl) errEl.textContent = msg;
    group?.classList.toggle('error', !!msg);
    return !msg;
  }

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      const errEl = group?.querySelector('.field-error');
      if (errEl && !errEl.textContent) return;
      validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('input, select, textarea').forEach(field => {
      if (!validateField(field)) valid = false;
    });
    if (!valid) return;

    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline';
    if (submitBtn) submitBtn.disabled = true;

    // Simulate async submit
    setTimeout(() => {
      if (btnText) btnText.style.display = '';
      if (btnLoading) btnLoading.style.display = 'none';
      if (submitBtn) submitBtn.disabled = false;
      if (successMsg) successMsg.style.display = 'block';
      form.reset();
      setTimeout(() => { if (successMsg) successMsg.style.display = 'none'; }, 5000);
    }, 1800);
  });
})();

// ===========================
// NEWSLETTER FORM
// ===========================
(function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input?.value.trim()) return;
    showToast('✅ با موفقیت عضو خبرنامه شدید!');
    form.reset();
  });
})();

// ===========================
// BACK TO TOP
// ===========================
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ===========================
// TOAST NOTIFICATION
// ===========================
function showToast(message, duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '80px',
    left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: '#1a1a2e',
    color: '#fff',
    padding: '14px 24px',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontFamily: 'Vazirmatn, sans-serif',
    fontWeight: '600',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    zIndex: '9999',
    opacity: '0',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    whiteSpace: 'nowrap',
    direction: 'rtl',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ===========================
// SMOOTH ANCHOR SCROLLING
// ===========================
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ===========================
// PARALLAX HERO
// ===========================
(function initParallax() {
  const orbs = document.querySelectorAll('.hero-orb');
  if (!orbs.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        orbs.forEach((orb, i) => {
          const speed = 0.1 + i * 0.05;
          orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ===========================
// KEYBOARD NAV ENHANCEMENT
// ===========================
(function initKeyboardNav() {
  // Service cards keyboard
  document.querySelectorAll('.service-card[tabindex]').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const link = card.querySelector('.service-link');
        if (link) link.click();
      }
    });
  });

  // Game cards keyboard
  document.querySelectorAll('.game-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const playBtn = card.querySelector('.game-btn-play');
        if (playBtn) playBtn.click();
      }
    });
  });

  // Gallery items keyboard
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const expandBtn = item.querySelector('.gallery-expand');
        if (expandBtn) expandBtn.click();
      }
    });
  });
})();

// ===========================
// LAZY LOAD IMAGES
// ===========================
(function initLazyLoad() {
  const lazyImgs = document.querySelectorAll('img[data-src]');
  if (!lazyImgs.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  lazyImgs.forEach(img => observer.observe(img));
})();

// ===========================
// ACTIVE SECTION HIGHLIGHT (method & course cards)
// ===========================
(function initCardHover() {
  document.querySelectorAll('.method-card, .course-card, .service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.zIndex = '2';
    });
    card.addEventListener('mouseleave', () => {
      card.style.zIndex = '';
    });
  });
})();

// ===========================
// STAT CARDS HOVER MICRO
// ===========================
(function initStatMicro() {
  document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.stat-icon');
      if (icon) {
        icon.style.transform = 'scale(1.2) rotate(-10deg)';
        icon.style.transition = 'transform 0.3s ease';
      }
    });
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.stat-icon');
      if (icon) {
        icon.style.transform = '';
      }
    });
  });
})();

// ===========================
// FOOTER CURRENT YEAR (optional)
// ===========================
(function setYear() {
  const el = document.querySelector('.footer-bottom');
  // Year already set statically in HTML — no action needed
})();

// ===========================
// INIT LOG
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  console.log('%cسعید عزیزی | آموزش نوین', 'font-size:18px;font-weight:bold;color:#87CEEB;');
  console.log('%cآموزش با روش‌های نوین برای آینده‌ای هوشمند', 'color:#888;');
});
