(function () {
  'use strict';

  var PHONE = '38344274038';

  // ---------- Header on scroll ----------
  var header = document.getElementById('header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile menu ----------
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    burger.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () {
    setMenu(!nav.classList.contains('is-open'));
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  // ---------- Reveal on scroll ----------
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el, i) {
      // small stagger for siblings
      var siblings = el.parentElement ? el.parentElement.querySelectorAll(':scope > .reveal') : [];
      var idx = Array.prototype.indexOf.call(siblings, el);
      if (idx > 0) el.style.transitionDelay = Math.min(idx * 0.08, 0.4) + 's';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- Gallery filter ----------
  var filters = document.querySelectorAll('.filter');
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));

  function applyFilter(cat) {
    filters.forEach(function (f) {
      var active = f.dataset.filter === cat;
      f.classList.toggle('is-active', active);
      f.setAttribute('aria-selected', String(active));
    });
    items.forEach(function (item) {
      item.classList.toggle('is-hidden', cat !== 'all' && item.dataset.cat !== cat);
    });
  }
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () { applyFilter(btn.dataset.filter); });
  });

  // Collection cards jump to a filtered gallery
  document.querySelectorAll('[data-goto]').forEach(function (card) {
    card.addEventListener('click', function () { applyFilter(card.dataset.goto); });
  });

  // ---------- Lightbox ----------
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  var lbCap = lb.querySelector('figcaption');
  var current = 0;

  function visibleItems() {
    return items.filter(function (i) { return !i.classList.contains('is-hidden'); });
  }
  function show(index) {
    var list = visibleItems();
    current = (index + list.length) % list.length;
    var item = list[current];
    var img = item.querySelector('img');
    var cap = item.querySelector('figcaption');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = cap ? cap.lastChild.textContent.trim() : '';
  }
  function openLb(item) {
    show(visibleItems().indexOf(item));
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  items.forEach(function (item) {
    item.addEventListener('click', function () { openLb(item); });
  });
  lb.querySelector('.lightbox__close').addEventListener('click', closeLb);
  lb.querySelector('.lightbox__nav--prev').addEventListener('click', function (e) { e.stopPropagation(); show(current - 1); });
  lb.querySelector('.lightbox__nav--next').addEventListener('click', function (e) { e.stopPropagation(); show(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // ---------- Contact form -> WhatsApp ----------
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    ['name', 'phone'].forEach(function (n) {
      var field = form.elements[n];
      var bad = !field.value.trim();
      field.closest('.field').classList.toggle('has-error', bad);
      if (bad) ok = false;
    });
    if (!ok) {
      note.textContent = 'Ju lutem plotësoni emrin dhe numrin e telefonit.';
      return;
    }
    var text =
      'Përshëndetje Mobileria Era!\n' +
      'Emri: ' + form.elements.name.value.trim() + '\n' +
      'Telefoni: ' + form.elements.phone.value.trim() + '\n' +
      'Interesimi: ' + form.elements.interest.value +
      (form.elements.message.value.trim() ? '\nMesazhi: ' + form.elements.message.value.trim() : '');

    var via = (e.submitter && e.submitter.value) || 'whatsapp';
    if (via === 'viber') {
      // Viber fills the draft on most devices; the clipboard copy is a fallback for the rest
      if (navigator.clipboard) navigator.clipboard.writeText(text).catch(function () {});
      window.location.href = 'viber://chat?number=%2B' + PHONE + '&draft=' + encodeURIComponent(text);
      note.textContent = 'Po hapet Viber. Nëse mesazhi nuk shfaqet, ai është kopjuar — thjesht ngjiteni (paste) dhe dërgojeni.';
    } else {
      window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      note.textContent = 'Faleminderit! Po hapet WhatsApp për të dërguar mesazhin.';
    }
    form.reset();
  });

  // ---------- Year ----------
  document.getElementById('year').textContent = new Date().getFullYear();
})();
