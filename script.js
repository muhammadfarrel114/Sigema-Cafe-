/* ============================================
   SIGEMA CAFÉ — script.js
   Interactive Features & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. NAVBAR SCROLL EFFECT ---------- */
  const navbar = document.getElementById('navbar');
  const navScrollThreshold = 80;

  function handleNavScroll() {
    if (window.scrollY > navScrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load


  /* ---------- 2. MOBILE MENU TOGGLE ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  const navOverlay = document.getElementById('nav-overlay');

  function openMobileMenu() {
    navToggle.classList.add('active');
    navLinks.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  navOverlay.addEventListener('click', closeMobileMenu);

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });


  /* ---------- 3. SMOOTH SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      const navHeight = navbar.offsetHeight;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });


  /* ---------- 4. ACTIVE NAV LINK HIGHLIGHT ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();


  /* ---------- 5. SCROLL REVEAL (Intersection Observer) ---------- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Staggered delay for siblings
        const el = entry.target;
        const parent = el.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll('.reveal, .reveal-left, .reveal-right')) : [el];
        const siblingIndex = siblings.indexOf(el);
        const delay = siblingIndex >= 0 ? siblingIndex * 100 : 0;

        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);

        revealObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ---------- 6. DYNAMIC MENU FILTER ---------- */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const menuCards    = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      menuCards.forEach((card, i) => {
        const category = card.getAttribute('data-category');

        if (filter === 'semua' || category === filter) {
          card.classList.remove('hidden');
          card.classList.remove('fade-in');
          // Force reflow to retrigger animation
          void card.offsetWidth;
          card.style.animationDelay = `${i * 80}ms`;
          card.classList.add('fade-in');
        } else {
          card.classList.add('hidden');
          card.classList.remove('fade-in');
        }
      });
    });
  });


  /* ---------- 7. COUNTER ANIMATION (About section badge) ---------- */
  const counterEl = document.querySelector('.counter-value');
  if (counterEl) {
    const target = parseInt(counterEl.getAttribute('data-target'), 10);
    let hasAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateCounter(counterEl, target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterObserver.observe(counterEl);
  }

  function animateCounter(el, target) {
    let current = 0;
    const duration = 2000;
    const stepTime = 16;
    const steps = Math.ceil(duration / stepTime);
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.round(current);
    }, stepTime);
  }


  /* ---------- 8. PARALLAX EFFECT ON HERO ---------- */
  const heroBg = document.querySelector('.hero-bg img');

  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const heroHeight = document.querySelector('.hero').offsetHeight;
      if (scrolled < heroHeight) {
        heroBg.style.transform = `scale(1.1) translateY(${scrolled * 0.15}px)`;
      }
    }, { passive: true });
  }


  /* ---------- 9. NAVBAR LINK HOVER SOUND-LIKE MICRO-INTERACTION ---------- */
  const allInteractiveElements = document.querySelectorAll('.btn, .filter-btn, .menu-card, .info-card');

  allInteractiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.willChange = 'transform, box-shadow';
    });
    el.addEventListener('mouseleave', () => {
      el.style.willChange = 'auto';
    });
  });


  /* ---------- 10. CURRENT YEAR IN FOOTER ---------- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
