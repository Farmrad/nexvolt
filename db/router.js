/* ============================================================
   NEXVOLT — router.js
   Simple hash-based client router
   ============================================================ */

const Router = (() => {
  const routes = {};
  let currentPage = null;

  function register(name, renderFn) {
    routes[name] = renderFn;
  }

  function go(name) {
    if (!routes[name]) {
      console.warn('[Router] Unknown page:', name);
      return;
    }

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === name);
    });

    // Render page into #app
    const app = document.getElementById('app');
    app.innerHTML = '';
    const pageEl = document.createElement('div');
    pageEl.className = 'page';
    pageEl.id = 'page-' + name;
    app.appendChild(pageEl);

    currentPage = name;
    routes[name](pageEl);

    // Update hash
    history.replaceState(null, '', '#' + name);
    window.scrollTo(0, 0);
  }

  function init(defaultPage = 'dashboard') {
    const hash = location.hash.replace('#', '');
    go(routes[hash] ? hash : defaultPage);
  }

  function current() { return currentPage; }

  return { register, go, init, current };
})();

/* ============================================================
   NEXVOLT — Toast / Modal utilities (global)
   ============================================================ */

function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function openModal(html) {
  const root = document.getElementById('modal-root');
  root.innerHTML = html;
  const overlay = root.querySelector('.modal-overlay');
  if (overlay) {
    requestAnimationFrame(() => overlay.classList.add('open'));
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });
  }
}

function closeModal() {
  const root = document.getElementById('modal-root');
  const overlay = root.querySelector('.modal-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    setTimeout(() => { root.innerHTML = ''; }, 200);
  }
}

/* ---------- helpers ---------- */
function fmtDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR');
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function fmtTND(n) {
  return (parseFloat(n) || 0).toFixed(3) + ' TND';
}

function statusLabel(s) {
  return { paid: 'Payé', pending: 'En attente', partial: 'Partiel', cancelled: 'Annulé' }[s] || s;
}

function statusClass(s) {
  return { paid: 'green', pending: 'yellow', partial: 'blue', cancelled: 'red' }[s] || 'yellow';
}

function monthName(m) {
  return ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'][m];
}

/* Number → French words (for invoice footer) */
function numToWords(n) {
  if (!n || n <= 0) return 'zéro';
  const int  = Math.floor(n);
  const mill = Math.round((n - int) * 1000);
  const ones = ['','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix',
                 'onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf'];
  const tens = ['','','vingt','trente','quarante','cinquante','soixante','soixante','quatre-vingt','quatre-vingt'];
  function say(x) {
    if (x < 20) return ones[x];
    const t = Math.floor(x / 10), u = x % 10;
    if (t === 7) return 'soixante-' + ones[10 + u];
    if (t === 9) return 'quatre-vingt' + (u ? '-' + ones[u] : 's');
    return tens[t] + (u ? '-' + ones[u] : '');
  }
  let r = '';
  if (int >= 1000) r += (Math.floor(int / 1000) > 1 ? say(Math.floor(int / 1000)) + ' ' : '') + 'mille ';
  const rem = int % 1000;
  if (rem >= 100) r += ones[Math.floor(rem / 100)] + ' cent ';
  if (rem % 100) r += say(rem % 100);
  r = r.trim();
  if (mill) r += ' et ' + say(mill) + ' millimes';
  return r || 'zéro';
}
