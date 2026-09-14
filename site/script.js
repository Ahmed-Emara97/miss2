/* Noura Hamdy Fayad — academic profile. Vanilla JS, no dependencies, no animation loops. */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- theme ---------- */
  var themeBtn = document.getElementById('themeToggle');
  var themeIcon = document.getElementById('themeIcon');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☾' : '☀';
  }

  var stored = null;
  try { stored = localStorage.getItem('nf-theme'); } catch (e) {}
  applyTheme(stored === 'light' ? 'light' : 'dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('nf-theme', next); } catch (e) {}
    });
  }

  /* ---------- mobile navigation ---------- */
  var navBtn = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');

  if (navBtn && nav) {
    navBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        navBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- profile image slot ---------- */
  var portrait = document.getElementById('portrait');
  var hint = document.getElementById('portraitHint');
  var input = document.getElementById('portraitInput');
  var clearBtn = document.getElementById('portraitClear');
  var photo = null;

  function showPhoto(dataUrl) {
    if (!photo) {
      photo = new Image();
      photo.alt = 'Portrait of Noura Hamdy Fayad';
      portrait.insertBefore(photo, portrait.firstChild);
    }
    photo.src = dataUrl;
    if (hint) hint.hidden = true;
    if (clearBtn) clearBtn.hidden = false;
  }

  function loadFile(file) {
    if (!file || file.type.indexOf('image/') !== 0) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      showPhoto(e.target.result);
      try { localStorage.setItem('nf-portrait', e.target.result); } catch (err) {}
    };
    reader.readAsDataURL(file);
  }

  if (portrait && input) {
    var saved = null;
    try { saved = localStorage.getItem('nf-portrait'); } catch (e) {}
    if (saved) showPhoto(saved);

    portrait.addEventListener('click', function () { input.click(); });
    portrait.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
    });
    input.addEventListener('change', function () { loadFile(input.files[0]); });
    portrait.addEventListener('dragover', function (e) { e.preventDefault(); });
    portrait.addEventListener('drop', function (e) {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files) loadFile(e.dataTransfer.files[0]);
    });
  }

  /* ---------- research filters ---------- */
  var filterRow = document.getElementById('filterRow');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.pub-card'));

  if (filterRow) {
    filterRow.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.filter-btn') : null;
      if (!btn) return;
      var type = btn.getAttribute('data-filter');
      var all = filterRow.querySelectorAll('.filter-btn');
      for (var i = 0; i < all.length; i++) all[i].classList.toggle('active', all[i] === btn);
      cards.forEach(function (card) {
        card.classList.toggle('hidden', type !== 'all' && card.getAttribute('data-type') !== type);
      });
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
