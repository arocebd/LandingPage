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
// 1. Real Cloudflare Registrar check -- availability AND at-cost USD/BDT
//    pricing in one call, via account.khotiyan.com's server-side proxy
//    (accounts.views.domain_check_api) so the Cloudflare token never
//    touches the browser. Covers the searched domain + the standard
//    TLD suggestion set in a single request.
// 2. If available, reveal the contact-details request form
const DOMAIN_CHECK_API_URL = 'https://account.khotiyan.com/api/domain-check/';

const domainSearchForm = document.getElementById('domainSearchForm');
if (domainSearchForm) {
  const searchInput = document.getElementById('domainSearchInput');
  const resultBox = document.getElementById('domainResult');
  const suggestionsBox = document.getElementById('domainSuggestions');
  const suggestionsGrid = document.getElementById('domainSuggestionsGrid');
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
    requestForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  async function checkDomain(domain) {
    showResult('checking', `<span>Checking <strong>${domain}</strong> with the registry…</span>`);
    requestForm.hidden = true;
    suggestionsBox.hidden = true;

    let data;
    try {
      const res = await fetch(`${DOMAIN_CHECK_API_URL}?domain=${encodeURIComponent(domain)}`);
      data = await res.json();
    } catch (err) {
      data = null;
    }

    if (!data || data.error || !data.domains || data.domains.length === 0) {
      showResult('unknown', `<span>Couldn't confirm <strong>${domain}</strong> automatically — request it below and we'll check manually.</span>`);
      openRequestForm(domain);
      return;
    }

    const main = data.domains.find(d => d.domain === domain) || data.domains[0];
    if (main.available) {
      const price = main.price_bdt ? ` · ৳${main.price_bdt}/yr` : '';
      showResult('available', `<span>✓ <strong>${main.domain}</strong> is available${price}</span>`);
      openRequestForm(main.domain);
    } else {
      showResult('taken', `<span>✗ <strong>${main.domain}</strong> is already registered.</span>`);
    }

    const others = data.domains.filter(d => d.domain !== main.domain);
    if (others.length) {
      suggestionsBox.hidden = false;
      suggestionsGrid.innerHTML = others.map(entry => {
        const price = entry.price_bdt ? ` · ৳${entry.price_bdt}/yr` : '';
        const statusClass = entry.available ? 'is-available' : 'is-taken';
        const statusText = entry.available ? `Available${price}` : 'Already registered';
        return `
          <div class="domain-suggestion-card" data-domain="${entry.domain}">
            <div class="domain-suggestion-info">
              <div class="domain-suggestion-name">${entry.domain}</div>
              <div class="domain-suggestion-status ${statusClass}">${statusText}</div>
            </div>
          </div>`;
      }).join('');

      others.forEach(entry => {
        if (!entry.available) return;
        const card = suggestionsGrid.querySelector(`[data-domain="${entry.domain}"]`);
        if (!card) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-sm btn-outline';
        btn.textContent = 'Request';
        btn.addEventListener('click', () => {
          resultBox.hidden = true;
          openRequestForm(entry.domain);
        });
        card.appendChild(btn);
      });
    }
  }

  domainSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const domain = searchInput.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
    if (!domain || !domain.includes('.')) {
      showResult('unknown', '<span>Enter a domain like <strong>yourbusiness.com</strong>.</span>');
      suggestionsBox.hidden = true;
      return;
    }
    checkDomain(domain);
  });

  cancelBtn.addEventListener('click', () => {
    requestForm.hidden = true;
    resultBox.hidden = true;
    suggestionsBox.hidden = true;
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
