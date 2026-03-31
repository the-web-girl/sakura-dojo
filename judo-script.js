'use strict';
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// ---- BURGER MENU -------------------------------------------
(function() {
  const btn = $('#burgerBtn'), menu = $('#navMenu');
  if (!btn || !menu) return;
  function open() { btn.setAttribute('aria-expanded','true'); btn.setAttribute('aria-label','Fermer le menu'); btn.classList.add('open'); menu.classList.add('open'); document.body.style.overflow='hidden'; const f=menu.querySelector('a'); if(f)f.focus(); }
  function close() { btn.setAttribute('aria-expanded','false'); btn.setAttribute('aria-label','Ouvrir le menu'); btn.classList.remove('open'); menu.classList.remove('open'); document.body.style.overflow=''; }
  btn.addEventListener('click', () => btn.getAttribute('aria-expanded')==='true' ? close() : open());
  $$('.nav__link, .nav__cta', menu).forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => { if(e.key==='Escape' && menu.classList.contains('open')) { close(); btn.focus(); } });
  document.addEventListener('click', e => { if(!menu.contains(e.target) && !btn.contains(e.target) && menu.classList.contains('open')) close(); });
})();

// ---- HEADER SCROLL -----------------------------------------
(function() {
  const h = $('.header'); if(!h) return;
  const upd = () => h.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', upd, {passive:true}); upd();
})();

// ---- SCROLL REVEAL -----------------------------------------
(function() {
  const els = $$('.reveal'); if(!els.length) return;
  if(!window.IntersectionObserver) { els.forEach(e=>e.classList.add('visible')); return; }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), Math.min(idx * 80, 400));
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();

// ---- FAQ ---------------------------------------------------
(function() {
  const items = $$('.faq-item'); if(!items.length) return;
  items.forEach(item => {
    const btn = item.querySelector('.faq-item__q'), ans = item.querySelector('.faq-item__a');
    if(!btn || !ans) return;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded')==='true';
      items.forEach(o => { const ob=o.querySelector('.faq-item__q'), oa=o.querySelector('.faq-item__a'); if(ob&&oa&&o!==item){ob.setAttribute('aria-expanded','false'); oa.hidden=true;} });
      btn.setAttribute('aria-expanded', String(!open)); ans.hidden = open;
    });
  });
})();

// ---- SCHEDULE FILTERS --------------------------------------
(function() {
  const btns = $$('.filter-btn'), slots = $$('.jslot'); if(!btns.length||!slots.length) return;
  function apply(f) { slots.forEach(s => { const tags=(s.dataset.tags||'').split(' '); s.classList.toggle('hidden', f!=='all' && !tags.includes(f)); }); }
  btns.forEach(b => b.addEventListener('click', () => { btns.forEach(x=>{x.classList.remove('active');x.setAttribute('aria-pressed','false');}); b.classList.add('active'); b.setAttribute('aria-pressed','true'); apply(b.dataset.filter||'all'); }));
})();

// ---- FORM VALIDATION ---------------------------------------
(function() {
  const validators = {
    required: v => v.trim() ? null : 'Ce champ est obligatoire.',
    email: v => !v.trim() ? 'Ce champ est obligatoire.' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Email invalide.',
    tel: v => !v.trim() ? 'Ce champ est obligatoire.' : /^[\d\s\+\-\.()]{8,15}$/.test(v.replace(/\s/g,'')) ? null : 'Téléphone invalide.',
    checkbox: el => el.checked ? null : 'Veuillez accepter pour continuer.'
  };
  function validateField(f) {
    const err$ = f.parentElement.querySelector('.form-error'); let e=null;
    if(f.type==='checkbox') { if(f.required) e=validators.checkbox(f); }
    else if(f.type==='email') { if(f.required) e=validators.email(f.value); }
    else if(f.type==='tel') { if(f.required) e=validators.tel(f.value); }
    else { if(f.required) e=validators.required(f.value); }
    if(err$) err$.textContent = e||'';
    f.classList.toggle('error', !!e); f.setAttribute('aria-invalid', e?'true':'false');
    return !e;
  }
  function setup(form, successId) {
    if(!form) return;
    const suc = document.getElementById(successId);
    $$('input,select,textarea', form).forEach(f => {
      f.addEventListener('blur', ()=>validateField(f));
      f.addEventListener('input', ()=>{ if(f.classList.contains('error')) validateField(f); });
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fields = $$('input[required],select[required],textarea[required]', form);
      let ok = true; fields.forEach(f => { if(!validateField(f)) ok=false; });
      if(ok) { form.style.display='none'; if(suc){suc.hidden=false; suc.scrollIntoView({behavior:'smooth',block:'nearest'}); suc.focus();} }
      else { const first=form.querySelector('.error'); if(first) first.focus(); }
    });
  }
  setup(document.getElementById('essaiForm'), 'essaiSuccess');
  setup(document.getElementById('contactForm'), 'contactSuccess');
})();

// ---- SMOOTH SCROLL -----------------------------------------
(function() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href')); if(!t) return;
      e.preventDefault();
      const nh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'))||72;
      window.scrollTo({top: t.getBoundingClientRect().top + window.scrollY - nh - 20, behavior:'smooth'});
    });
  });
})();

// ---- REDUCED MOTION ----------------------------------------
(function() {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(mq.matches) $$('.reveal').forEach(e=>e.classList.add('visible'));
  mq.addEventListener('change', q => { if(q.matches) $$('.reveal').forEach(e=>e.classList.add('visible')); });
})();
