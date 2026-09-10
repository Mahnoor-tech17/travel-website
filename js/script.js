// ---------- Shared: highlight active nav link ----------
document.addEventListener('DOMContentLoaded', () => {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    if (link.getAttribute('href') === current) link.classList.add('active');
  });
});

// ---------- Search (index.html) ----------
const resultsSection = document.getElementById('results');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resetBtn = document.getElementById('reset-btn');

let travelData = null;

function loadTravelData() {
  if (travelData) return Promise.resolve(travelData);
  return fetch('travel_recommendation_api.json')
    .then((res) => res.json())
    .then((data) => {
      travelData = data;
      return data;
    })
    .catch((err) => {
      console.error('Could not load travel_recommendation_api.json', err);
      return { beaches: [], temples: [], countries: [] };
    });
}

function cardHTML(item, timezoneOffset) {
  return `
    <div class="card">
      <img src="${item.imageUrl}" alt="${item.name}" loading="lazy">
      <div class="card-body">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
      <div class="card-actions">
        <button class="btn-visit" data-offset="${timezoneOffset ?? ''}">Visit</button>
      </div>
    </div>`;
}

function renderResults(title, items) {
  if (!items.length) {
    resultsSection.innerHTML = `
      <h2 class="section-title">${title}</h2>
      <p class="results-empty">No matching destinations found. Try "beach", "temple", or a country name.</p>`;
    return;
  }
  resultsSection.innerHTML = `
    <h2 class="section-title">${title}</h2>
    <div class="card-grid">${items.map((i) => cardHTML(i)).join('')}</div>`;
}

function normalize(str) {
  return str.trim().toLowerCase();
}

function runSearch(rawQuery) {
  const query = normalize(rawQuery);
  if (!query) {
    resultsSection.innerHTML = '';
    return;
  }

  loadTravelData().then((data) => {
    let matches = [];

    if (query.includes('beach')) {
      matches = data.beaches;
      renderResults('Beaches', matches);
      return;
    }

    if (query.includes('temple')) {
      matches = data.temples;
      renderResults('Temples', matches);
      return;
    }

    // Country / city match
    const countryMatch = data.countries.find((c) => normalize(c.name).includes(query) || query.includes(normalize(c.name)));
    if (countryMatch) {
      matches = countryMatch.cities.map((city) => ({
        name: `${city.name}, ${countryMatch.name}`,
        description: city.description,
        imageUrl: city.imageUrl,
      }));
      renderResults(countryMatch.name, matches);
      return;
    }

    // Fallback: search everything by name
    const all = [
      ...data.beaches,
      ...data.temples,
      ...data.countries.flatMap((c) => c.cities.map((city) => ({
        name: `${city.name}, ${c.name}`,
        description: city.description,
        imageUrl: city.imageUrl,
      }))),
    ];
    matches = all.filter((item) => normalize(item.name).includes(query));
    renderResults('Search Results', matches);
  });
}

if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    runSearch(searchInput.value);
  });
}

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    resultsSection.innerHTML = '';
  });
}

// ---------- Contact form validation (contact.html) ----------
const contactForm = document.getElementById('contact-form');

function setInvalid(group, isInvalid) {
  group.classList.toggle('invalid', isInvalid);
}

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const status = document.getElementById('form-status');

    const nameGroup = name.closest('.form-group');
    const emailGroup = email.closest('.form-group');
    const messageGroup = message.closest('.form-group');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setInvalid(nameGroup, name.value.trim() === '');
    if (name.value.trim() === '') valid = false;

    const emailInvalid = !emailPattern.test(email.value.trim());
    setInvalid(emailGroup, emailInvalid);
    if (emailInvalid) valid = false;

    setInvalid(messageGroup, message.value.trim() === '');
    if (message.value.trim() === '') valid = false;

    if (valid) {
      status.style.display = 'block';
      status.textContent = `Thanks, ${name.value.trim()}! Your message has been sent — we'll reply to ${email.value.trim()} soon.`;
      contactForm.reset();
    } else {
      status.style.display = 'none';
    }
  });
}
