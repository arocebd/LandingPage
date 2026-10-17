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

// Domain availability + request flow:
// 1. Live RDAP check (real registry data, via rdap.org's CORS-enabled
//    bootstrap redirector -- no backend needed, no fake results)
// 2. If available (or unverifiable), reveal the contact-details request form
const domainSearchForm = document.getElementById('domainSearchForm');
if (domainSearchForm) {
  const searchInput = document.getElementById('domainSearchInput');
  const searchBtn = document.getElementById('domainSearchBtn');
  const resultBox = document.getElementById('domainResult');
  const requestForm = document.getElementById('domainRequestForm');
  const requestTarget = document.getElementById('domainRequestTarget');
  const requestSuccess = document.getElementById('domainRequestSuccess');
  const cancelBtn = document.getElementById('domainRequestCancel');

  function showResult(state, html) {
    resultBox.hidden = false;
    resultBox.className = `domain-result domain-result-${state}`;
    resultBox.innerHTML = html;
  }

  function openRequestForm(domain) {
    requestTarget.textContent = domain;
    requestForm.hidden = false;
    requestSuccess.hidden = true;
  }

  async function checkDomain(domain) {
    showResult('checking', `<span>Checking <strong>${domain}</strong> against the registry…</span>`);
    requestForm.hidden = true;

    try {
      const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, { redirect: 'follow' });
      const finalHost = new URL(res.url).hostname;
      const wasRedirected = finalHost !== 'rdap.org';

      if (!wasRedirected) {
        // rdap.org itself answered -- no registry RDAP server known for this TLD
        showResult('unknown', `<span>Can't auto-verify this TLD yet for <strong>${domain}</strong> — request it below and we'll check manually.</span>`);
        openRequestForm(domain);
        return;
      }

      if (res.status === 404) {
        showResult('available', `<span>✓ <strong>${domain}</strong> looks available!</span>`);
        openRequestForm(domain);
      } else if (res.status === 200) {
        showResult('taken', `<span>✗ <strong>${domain}</strong> is already registered.</span>`);
      } else {
        showResult('unknown', `<span>Couldn't confirm <strong>${domain}</strong> automatically — request it below and we'll check manually.</span>`);
        openRequestForm(domain);
      }
    } catch (err) {
      showResult('unknown', `<span>Couldn't reach the registry to check <strong>${domain}</strong> — request it below and we'll check manually.</span>`);
      openRequestForm(domain);
    }
  }

  domainSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const domain = searchInput.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
    if (!domain || !domain.includes('.')) {
      showResult('unknown', '<span>Enter a domain like <strong>yourbusiness.com</strong>.</span>');
      return;
    }
    checkDomain(domain);
  });

  cancelBtn.addEventListener('click', () => {
    requestForm.hidden = true;
    resultBox.hidden = true;
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

// Hosting plan request flow (click "Get Started" on a plan -> contact details -> mailto)
const hostingGrid = document.getElementById('hostingPricingGrid');
if (hostingGrid) {
  const requestForm = document.getElementById('hostingRequestForm');
  const requestTarget = document.getElementById('hostingRequestTarget');
  const requestSuccess = document.getElementById('hostingRequestSuccess');
  const cancelBtn = document.getElementById('hostingRequestCancel');

  hostingGrid.querySelectorAll('.hosting-get-started').forEach((btn) => {
    btn.addEventListener('click', () => {
      requestTarget.textContent = btn.dataset.plan;
      hostingGrid.hidden = true;
      requestForm.hidden = false;
      requestSuccess.hidden = true;
    });
  });

  cancelBtn.addEventListener('click', () => {
    requestForm.hidden = true;
    hostingGrid.hidden = false;
  });

  requestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const plan = requestTarget.textContent;
    const name = document.getElementById('hostingRequestName').value.trim();
    const contact = document.getElementById('hostingRequestContact').value.trim();
    const note = document.getElementById('hostingRequestNote').value.trim();

    const subject = `Hosting request: ${plan}`;
    const body = [
      `Plan: ${plan}`,
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
