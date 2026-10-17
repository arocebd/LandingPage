// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger menu
const hamburger = document.getElementById('navHamburger');
const navMobile = document.getElementById('navMobile');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMobile.classList.toggle('open');
});
// Close on link click
navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMobile.classList.remove('open');
  });
});

// Desktop "Our Projects" dropdown
const navDropdown = document.querySelector('.nav-dropdown');
if (navDropdown) {
  const toggle = navDropdown.querySelector('.nav-dropdown-toggle');
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = navDropdown.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', (e) => {
    if (!navDropdown.contains(e.target)) {
      navDropdown.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Mobile "Our Projects" accordion
const navMobileGroup = document.querySelector('.nav-mobile-group');
if (navMobileGroup) {
  const groupToggle = navMobileGroup.querySelector('.nav-mobile-group-toggle');
  groupToggle.addEventListener('click', () => {
    const open = navMobileGroup.classList.toggle('open');
    groupToggle.setAttribute('aria-expanded', open);
  });
}

// Domain request flow (two-step: enter domain -> contact details -> mailto)
const domainSearchForm = document.getElementById('domainSearchForm');
if (domainSearchForm) {
  const searchInput = document.getElementById('domainSearchInput');
  const requestForm = document.getElementById('domainRequestForm');
  const requestTarget = document.getElementById('domainRequestTarget');
  const requestSuccess = document.getElementById('domainRequestSuccess');
  const cancelBtn = document.getElementById('domainRequestCancel');

  domainSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const domain = searchInput.value.trim();
    if (!domain) return;
    requestTarget.textContent = domain;
    domainSearchForm.hidden = true;
    requestForm.hidden = false;
    requestSuccess.hidden = true;
  });

  cancelBtn.addEventListener('click', () => {
    requestForm.hidden = true;
    domainSearchForm.hidden = false;
  });

  requestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const domain = requestTarget.textContent;
    const name = document.getElementById('domainRequestName').value.trim();
    const contact = document.getElementById('domainRequestContact').value.trim();
    const note = document.getElementById('domainRequestNote').value.trim();

    const subject = `Domain request: ${domain}`;
    const body = [
      `Domain: ${domain}`,
      `Name: ${name}`,
      `Contact: ${contact}`,
      note ? `Note: ${note}` : null,
    ].filter(Boolean).join('\n');

    window.location.href = `mailto:poskhotiyan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    requestForm.hidden = true;
    requestSuccess.hidden = false;
    requestForm.reset();
  });
}

// Counter animation
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.1}s`;
  observer.observe(el);
});

// Counter observer
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '✓ Message Sent!';
  btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});

// Smooth scroll offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});
