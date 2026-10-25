/* ============================================
   VISIT KYRGYZSTAN — MAIN JS
   Язык (RU/EN/KY) + Живой поиск + Отзывы
   ============================================ */

/* ══════════════════════════════════════════
   1. ЯЗЫК — инициализация и переключение
   ══════════════════════════════════════════ */

function getLang() {
  return localStorage.getItem('kg_lang') || 'ru';
}

function setLang(lang) {
  localStorage.setItem('kg_lang', lang);
  applyLang(lang);
  // Обновить кнопки переключателя
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  // Установить lang у <html>
  document.documentElement.lang = lang === 'ky' ? 'ky' : lang === 'en' ? 'en' : 'ru';
  // Обновить зависимые части страницы
  renderReviews();
  initHomePage();
}

function applyLang(lang) {
  const T = (typeof TRANSLATIONS !== 'undefined') ? TRANSLATIONS[lang] : null;
  if (!T) return;

  // Перевод текстовых узлов по data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (T[key] !== undefined) el.textContent = T[key];
  });

  // Перевод placeholder по data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (T[key] !== undefined) el.placeholder = T[key];
  });

  // Перевод title кнопок
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (T[key] !== undefined) el.title = T[key];
  });
}

/* ══════════════════════════════════════════
   2. ЖИВОЙ ПОИСК
   ══════════════════════════════════════════ */

// Полный каталог точек для поиска (локализованные названия)
const PLACES_DATA = [
  { ru:'Иссык-Куль',       en:'Issyk-Kul',          ky:'Ысык-Көл',
    ru_d:'Горное озеро, Иссык-Кульская обл.',
    en_d:'Mountain lake, Issyk-Kul region',
    ky_d:'Тоо көлү, Ысык-Көл облусу',
    url:'places.html#issykkul', icon:'fas fa-water', cat_ru:'Озеро', cat_en:'Lake', cat_ky:'Көл' },
  { ru:'Ала-Арча',         en:'Ala-Archa',           ky:'Ала-Арча',
    ru_d:'Нацпарк, 40 км от Бишкека',
    en_d:'National park, 40 km from Bishkek',
    ky_d:'Улуттук парк, Бишкектен 40 км',
    url:'places.html#alaarcha', icon:'fas fa-tree', cat_ru:'Заповедник', cat_en:'Nature Park', cat_ky:'Жаратылыш' },
  { ru:'Сон-Куль',         en:'Son-Kul',             ky:'Соң-Көл',
    ru_d:'Высокогорное озеро, 3016 м',
    en_d:'Alpine lake, 3016 m altitude',
    ky_d:'Бийик тоо көлү, 3016 м',
    url:'places.html#sonkul', icon:'fas fa-water', cat_ru:'Озеро', cat_en:'Lake', cat_ky:'Көл' },
  { ru:'Каньон Сказка',    en:'Fairy Tale Canyon',   ky:'Жомок Каньону',
    ru_d:'Красные скалы у Иссык-Куля',
    en_d:'Red rocks near Issyk-Kul',
    ky_d:'Ысык-Көлдүн жанындагы кызыл аскалар',
    url:'places.html#skazka', icon:'fas fa-mountain', cat_ru:'Каньон', cat_en:'Canyon', cat_ky:'Каньон' },
  { ru:'Пик Ленина',       en:'Lenin Peak',          ky:'Ленин Чокусу',
    ru_d:'7134 м — семитысячник Тянь-Шаня',
    en_d:'7134 m — one of the accessible 7000ers',
    ky_d:'7134 м — Тянь-Шандын жети миңдиги',
    url:'mountains.html#lenin', icon:'fas fa-mountain', cat_ru:'Гора', cat_en:'Mountain', cat_ky:'Тоо' },
  { ru:'Хан-Тенгри',       en:'Khan Tengri',         ky:'Хан-Теңири',
    ru_d:'6995 м — Повелитель неба',
    en_d:'6995 m — Lord of the Sky',
    ky_d:'6995 м — Теңирдин бийи',
    url:'mountains.html#khantengri', icon:'fas fa-mountain', cat_ru:'Гора', cat_en:'Mountain', cat_ky:'Тоо' },
  { ru:'Пик Победы',       en:'Peak Pobeda',         ky:'Жеңиш Чокусу',
    ru_d:'7439 м — высшая точка Кыргызстана',
    en_d:'7439 m — highest point of Kyrgyzstan',
    ky_d:'7439 м — Кыргызстандын эң бийик чокусу',
    url:'mountains.html#pobeda', icon:'fas fa-mountain', cat_ru:'Гора', cat_en:'Mountain', cat_ky:'Тоо' },
  { ru:'Ош',               en:'Osh',                 ky:'Ош',
    ru_d:'Древний город, 3000+ лет, Шёлковый путь',
    en_d:'Ancient city, 3000+ years, Silk Road',
    ky_d:'Байыркы шаар, 3000+ жыл, Жибек жолу',
    url:'places.html#osh', icon:'fas fa-landmark', cat_ru:'Город', cat_en:'City', cat_ky:'Шаар' },
  { ru:'Арстанбап',        en:'Arstanbap',           ky:'Арстанбап',
    ru_d:'Ореховый лес ЮНЕСКО, Жалал-Абад',
    en_d:'UNESCO walnut forest, Jalal-Abad',
    ky_d:'ЮНЕСКО жаңгак токою, Жалал-Абад',
    url:'places.html#arstanbap', icon:'fas fa-tree', cat_ru:'Лес', cat_en:'Forest', cat_ky:'Токой' },
  { ru:'Сары-Чeлек',       en:'Sary-Chelek',         ky:'Сары-Челек',
    ru_d:'Озеро-заповедник ЮНЕСКО',
    en_d:'UNESCO biosphere reserve lake',
    ky_d:'ЮНЕСКО биосфералык корук көлү',
    url:'places.html#sarychelek', icon:'fas fa-water', cat_ru:'Озеро', cat_en:'Lake', cat_ky:'Көл' },
  { ru:'Таласская долина',  en:'Talas Valley',        ky:'Талас өрөөнү',
    ru_d:'Родина эпоса «Манас»',
    en_d:'Birthplace of the Manas epic',
    ky_d:'«Манас» эпосунун мекени',
    url:'places.html#talas', icon:'fas fa-landmark', cat_ru:'Культура', cat_en:'Culture', cat_ky:'Маданият' },
  { ru:'Треккинг маршруты', en:'Trekking Routes',    ky:'Треккинг маршруттары',
    ru_d:'Пешие маршруты для любого уровня',
    en_d:'Hiking routes for any level',
    ky_d:'Ар кандай деңгээл үчүн жөө маршруттар',
    url:'routes.html', icon:'fas fa-hiking', cat_ru:'Маршруты', cat_en:'Routes', cat_ky:'Маршруттар' },
  { ru:'Конные туры',       en:'Horse Tours',         ky:'Атчан туруктар',
    ru_d:'Верхом по горам и долинам',
    en_d:'Horse riding through mountains and valleys',
    ky_d:'Тоолор жана өрөөндөр аркылуу атчан жүрүш',
    url:'routes.html#horse', icon:'fas fa-horse', cat_ru:'Маршруты', cat_en:'Routes', cat_ky:'Маршруттар' },
  { ru:'Карта',             en:'Map',                 ky:'Карта',
    ru_d:'Все места Кыргызстана на карте',
    en_d:'All Kyrgyzstan places on the map',
    ky_d:'Картадагы бардык жерлер',
    url:'map.html', icon:'fas fa-map', cat_ru:'Карта', cat_en:'Map', cat_ky:'Карта' },
  { ru:'Отзывы',            en:'Reviews',             ky:'Пикирлер',
    ru_d:'Читайте и оставляйте отзывы',
    en_d:'Read and leave reviews',
    ky_d:'Пикирлерди окуңуз жана калтырыңыз',
    url:'reviews.html', icon:'fas fa-star', cat_ru:'Отзывы', cat_en:'Reviews', cat_ky:'Пикирлер' },
  { ru:'Бишкек',            en:'Bishkek',             ky:'Бишкек',
    ru_d:'Столица Кыргызстана',
    en_d:'Capital of Kyrgyzstan',
    ky_d:'Кыргызстандын борбор шаары',
    url:'map.html', icon:'fas fa-city', cat_ru:'Город', cat_en:'City', cat_ky:'Шаар' },
  { ru:'Каракол',           en:'Karakol',             ky:'Каракол',
    ru_d:'Горный курорт у Иссык-Куля',
    en_d:'Mountain resort near Issyk-Kul',
    ky_d:'Ысык-Көлдүн жанындагы тоо курорту',
    url:'routes.html', icon:'fas fa-mountain', cat_ru:'Курорт', cat_en:'Resort', cat_ky:'Курорт' },
];

let searchTimeout = null;

function initSearch() {
  const input = document.getElementById('globalSearch');
  const dropdown = document.getElementById('searchDropdown');
  if (!input || !dropdown) return;

  input.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => liveSearch(input.value), 180);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); doSearch(); }
    if (e.key === 'Escape') closeDropdown();
    if (e.key === 'ArrowDown') { e.preventDefault(); focusDropdownItem(0); }
  });

  // Закрыть при клике вне
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) closeDropdown();
  });
}

function liveSearch(query) {
  const dropdown = document.getElementById('searchDropdown');
  if (!dropdown) return;
  const q = query.trim().toLowerCase();

  if (!q) { closeDropdown(); return; }

  const lang = getLang();
  const T = (typeof TRANSLATIONS !== 'undefined') ? TRANSLATIONS[lang] : null;

  const results = PLACES_DATA.filter(p => {
    const name = (p[lang] || p.ru || '').toLowerCase();
    const desc = (p[`${lang}_d`] || p['ru_d'] || '').toLowerCase();
    return name.includes(q) || desc.includes(q);
  }).slice(0, 8);

  if (results.length === 0) {
    const noMsg = T ? T.search_noresult : 'Ничего не найдено';
    dropdown.innerHTML = `<div class="search-no-result"><i class="fas fa-search-minus" style="font-size:1.5rem;opacity:.3;display:block;margin-bottom:.5rem"></i>${noMsg}</div>`;
    dropdown.classList.add('open');
    return;
  }

  const hintText = T ? T.search_hint : 'Результаты:';
  let html = `<div class="search-dropdown-header"><i class="fas fa-search"></i> ${hintText}</div>`;

  results.forEach((p, i) => {
    const name = p[lang] || p.ru;
    const desc = p[`${lang}_d`] || p['ru_d'];
    const cat  = p[`cat_${lang}`] || p['cat_ru'];
    // Подсветка совпадения
    const re = new RegExp(`(${escapeRegex(q)})`, 'gi');
    const highlightedName = name.replace(re, '<mark>$1</mark>');
    html += `
      <a class="search-item" href="${p.url}" tabindex="0" data-index="${i}">
        <div class="search-item-icon"><i class="${p.icon}"></i></div>
        <div class="search-item-text">
          <strong>${highlightedName}</strong>
          <span>${desc}</span>
        </div>
        <div class="search-item-cat">${cat}</div>
      </a>`;
  });

  dropdown.innerHTML = html;
  dropdown.classList.add('open');

  // Навигация стрелками
  dropdown.querySelectorAll('.search-item').forEach((item, idx) => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); focusDropdownItem(idx + 1); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); idx === 0 ? document.getElementById('globalSearch').focus() : focusDropdownItem(idx - 1); }
      if (e.key === 'Escape')    closeDropdown();
    });
  });
}

function focusDropdownItem(idx) {
  const items = document.querySelectorAll('#searchDropdown .search-item');
  if (items[idx]) items[idx].focus();
}

function closeDropdown() {
  const dropdown = document.getElementById('searchDropdown');
  if (dropdown) { dropdown.classList.remove('open'); dropdown.innerHTML = ''; }
}

function doSearch() {
  const input = document.getElementById('globalSearch');
  if (!input) return;
  const q = input.value.trim().toLowerCase();
  if (!q) return;

  const lang = getLang();
  const found = PLACES_DATA.find(p => {
    const name = (p[lang] || p.ru || '').toLowerCase();
    const desc = (p[`${lang}_d`] || p['ru_d'] || '').toLowerCase();
    return name.includes(q) || desc.includes(q);
  });

  if (found) {
    closeDropdown();
    window.location.href = found.url;
  } else {
    const T = (typeof TRANSLATIONS !== 'undefined') ? TRANSLATIONS[lang] : null;
    const msg = T ? T.search_noresult : 'Ничего не найдено';
    showToast(msg, '');
  }
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ══════════════════════════════════════════
   3. МОБИЛЬНОЕ МЕНЮ
   ══════════════════════════════════════════ */
function initBurger() {
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('mainNav');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => nav.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !nav.contains(e.target)) nav.classList.remove('open');
  });
}

/* ══════════════════════════════════════════
   4. СОХРАНЕНИЕ МЕСТ
   ══════════════════════════════════════════ */
function getSaved() {
  try { return JSON.parse(localStorage.getItem('kg_saved_places') || '[]'); }
  catch { return []; }
}
function setSaved(arr) { localStorage.setItem('kg_saved_places', JSON.stringify(arr)); }

function savePlace(btn, name) {
  const lang = getLang();
  const T = (typeof TRANSLATIONS !== 'undefined') ? TRANSLATIONS[lang] : TRANSLATIONS.ru;
  let saved = getSaved();
  if (saved.includes(name)) {
    saved = saved.filter(s => s !== name);
    btn.classList.remove('saved');
    showToast(`«${name}» ${T.toast_removed}`, 'error');
  } else {
    saved.push(name);
    btn.classList.add('saved');
    showToast(`«${name}» ${T.toast_saved}`, 'success');
  }
  setSaved(saved);
  initSavedSection();
}

function restoreSaveButtons() {
  const saved = getSaved();
  document.querySelectorAll('.save-btn').forEach(btn => {
    const m = (btn.getAttribute('onclick') || '').match(/savePlace\(this,\s*'([^']+)'\)/);
    if (m && saved.includes(m[1])) btn.classList.add('saved');
  });
}

function initSavedSection() {
  const section = document.getElementById('savedSection');
  const list    = document.getElementById('savedList');
  if (!section || !list) return;
  const saved = getSaved();
  section.style.display = saved.length ? 'block' : 'none';
  list.innerHTML = saved.map(name => `
    <div class="saved-tag">
      <i class="fas fa-map-marker-alt"></i> ${name}
      <button onclick="removeSaved('${name}')" title="Удалить"><i class="fas fa-times"></i></button>
    </div>`).join('');
}

function removeSaved(name) {
  setSaved(getSaved().filter(s => s !== name));
  initSavedSection();
  document.querySelectorAll('.save-btn').forEach(btn => {
    if ((btn.getAttribute('onclick') || '').includes(`'${name}'`)) btn.classList.remove('saved');
  });
  showToast(`«${name}» удалено`, 'error');
}

function clearSaved() {
  setSaved([]);
  initSavedSection();
  document.querySelectorAll('.save-btn').forEach(b => b.classList.remove('saved'));
  const lang = getLang();
  const T = (typeof TRANSLATIONS !== 'undefined') ? TRANSLATIONS[lang] : TRANSLATIONS.ru;
  showToast(T.toast_cleared, '');
}

/* ══════════════════════════════════════════
   5. ПЛАНИРОВЩИК МАРШРУТА
   ══════════════════════════════════════════ */
const routeData = {
  'Бишкек_Иссык-Куль_Автобус':       { time:'4-5 ч', price:'300-500 сом', desc:'Маршрутка с Западного автовокзала. Отправление с 06:00. Прибытие в Чолпон-Ата.' },
  'Бишкек_Иссык-Куль_Такси/Авто':    { time:'3-4 ч', price:'2000-3000 сом', desc:'Такси или аренда авто по трассе А-363. Комфортно, быстро.' },
  'Бишкек_Ала-Арча_Автобус':         { time:'1 ч',   price:'60 сом', desc:'Маршрутка №265 из Бишкека. Последнее отправление в 18:00.' },
  'Бишкек_Ала-Арча_Такси/Авто':      { time:'40 мин',price:'600-800 сом', desc:'Такси до КПП парка. Удобно для групп.' },
  'Бишкек_Сон-Куль_Автобус':         { time:'5-6 ч', price:'350-500 сом', desc:'До Кочкора маршруткой (3 ч, 180 сом) + местный транспорт.' },
  'Бишкек_Сон-Куль_Конный тур':      { time:'2-3 дня', price:'от 3000 сом/день', desc:'Конный маршрут из Кочкора. Ночлег в юртах. Организует CBT Кочкор.' },
  'Бишкек_Пик Ленина (БЛ)_Самолёт + авто':{ time:'1ч+6ч', price:'2000+3000 сом', desc:'Рейс Бишкек–Ош (1 ч), затем авто через Алайскую долину до базового лагеря.' },
  'Бишкек_Каньон Сказка_Автобус':    { time:'8 ч',   price:'600 сом', desc:'До Каракола (6-7 ч), затем такси до Тосора (1.5 ч).' },
  'Бишкек_Каньон Сказка_Такси/Авто': { time:'5 ч',   price:'4000-5000 сом', desc:'Аренда авто через Иссык-Куль по трассе А-363.' },
  'Бишкек_Арстанбап_Автобус':        { time:'11-13 ч', price:'700-900 сом', desc:'Автобус до Жалал-Абада (9-11 ч), маршрутка до Арстанбапа (2 ч).' },
  'Ош_Пик Ленина (БЛ)_Такси/Авто':  { time:'5-6 ч', price:'3000-4000 сом', desc:'Такси из Оша через Сары-Таш до базового лагеря.' },
  'Каракол_Иссык-Куль_Автобус':      { time:'30 мин',price:'50 сом', desc:'Маршрутки ходят постоянно вдоль побережья.' },
  'Каракол_Каньон Сказка_Такси/Авто':{ time:'1.5 ч', price:'1500 сом', desc:'Такси из Каракола до Тосора.' },
};

function quickPlan() {
  const from = document.getElementById('from')?.value;
  const to   = document.getElementById('to')?.value;
  const tr   = document.getElementById('transport')?.value;
  const res  = document.getElementById('planResult');
  if (!res) return;

  const key  = `${from}_${to}_${tr}`;
  const data = routeData[key];
  const lang = getLang();
  const T = (typeof TRANSLATIONS !== 'undefined') ? TRANSLATIONS[lang] : TRANSLATIONS.ru;

  if (data) {
    res.innerHTML = `
      <div style="border-left:4px solid var(--primary);padding-left:1rem">
        <strong style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;color:var(--primary)">
          <i class="fas fa-route"></i> ${from} → ${to}
        </strong>
        <div style="display:flex;gap:1.5rem;margin-bottom:.5rem;flex-wrap:wrap">
          <span><i class="fas fa-clock" style="color:var(--primary)"></i> <strong>${T.time||'Время'}:</strong> ${data.time}</span>
          <span><i class="fas fa-wallet" style="color:var(--green)"></i> <strong>${T.price||'Цена'}:</strong> ${data.price}</span>
        </div>
        <p style="font-size:.88rem;color:var(--gray)">${data.desc}</p>
        <a href="routes.html" style="display:inline-flex;align-items:center;gap:.4rem;color:var(--primary);font-weight:600;font-size:.88rem;margin-top:.5rem">
          ${T.nav_routes||'Маршруты'} <i class="fas fa-arrow-right"></i>
        </a>
      </div>`;
  } else {
    res.innerHTML = `
      <div style="border-left:4px solid var(--accent);padding-left:1rem">
        <strong><i class="fas fa-info-circle" style="color:var(--accent)"></i> ${from} → ${to}</strong>
        <p style="font-size:.88rem;color:var(--gray);margin-top:.4rem">
          ${lang==='en' ? 'We recommend renting a car or joining an organized tour. Ask local operators for details.' :
            lang==='ky' ? 'Машина ижарасын же уюштурулган экскурсияны сунуштайбыз.' :
            'Рекомендуем аренду авто или организованный тур. Уточняйте у местных туроператоров.'}
        </p>
        <a href="routes.html" style="display:inline-flex;align-items:center;gap:.4rem;color:var(--primary);font-weight:600;font-size:.88rem;margin-top:.5rem">
          ${T.nav_routes||'Маршруты'} <i class="fas fa-arrow-right"></i>
        </a>
      </div>`;
  }
  res.classList.add('show');
}

/* ══════════════════════════════════════════
   6. ОТЗЫВЫ
   ══════════════════════════════════════════ */
const DEFAULT_REVIEWS = [
  { id:'d1', name:'Александр К.', country:'Россия',   place:'Иссык-Куль', rating:5, text:'Иссык-Куль — это что-то невероятное! Чистейшая вода, горы вокруг, добрые местные люди. Ехали из Бишкека на маршрутке — 4 часа пролетели незаметно. Обязательно вернёмся!', tips:'Берите солнцезащитный крем — солнце очень активное.', date:'2026-07', isDefault:true },
  { id:'d2', name:'Maria S.',      country:'Germany',  place:'Пик Ленина', rating:5, text:'Incredible experience! The base camp at 3600m already has breathtaking views. We flew to Osh, then drove through the Alai Valley. The guide was professional and very friendly.', tips:'Acclimatization is very important. Take your time.', date:'2026-08', isDefault:true },
  { id:'d3', name:'Айгүл М.',      country:'Казакстан',place:'Сон-Куль',   rating:5, text:'Соң-Көл мени биринчи карашта эле жеңди. Боз үйлөрдүн лагери, кымыз, көлдүн үстүндөгү күн батыш. Кочкордон атта келдик — бул өзү унутулгус саякат!', tips:'Жайда да түндөр абдан суук болот — жылуу кийим алыңыз.', date:'2026-07', isDefault:true },
  { id:'d4', name:'Томас Л.',      country:'Франция',  place:'Ала-Арча',   rating:4, text:'Отличный однодневный треккинг! Маршрутка из Бишкека очень удобная. Водопад Ак-Сай впечатлил. Минус — много туристов в выходные. Лучше идти в будни.', tips:'Стартуйте пораньше, чтобы обогнать толпу.', date:'2026-06', isDefault:true },
  { id:'d5', name:'Наташа В.',     country:'Беларусь', place:'Каньон Сказка',rating:5,text:'Фотограф мечты — Каньон Сказка! Красные скалы на фоне синего Иссык-Куля — просто волшебство. Взяли такси из Каракола, очень удобно.', tips:'Лучшее освещение утром и на закате для фото.', date:'2026-08', isDefault:true },
  { id:'d6', name:'James O.',      country:'USA',      place:'Ош',         rating:4, text:'Osh is a real cultural kaleidoscope! The bazaar is amazing, Suleiman-Too is a sacred place with stunning views. Flew from Bishkek in just 1 hour — very convenient.', tips:'Visit early morning when the bazaar is just opening.', date:'2026-05', isDefault:true },
];

function getReviews() {
  try {
    const s = JSON.parse(localStorage.getItem('kg_reviews') || 'null');
    if (!s) { localStorage.setItem('kg_reviews', JSON.stringify(DEFAULT_REVIEWS)); return DEFAULT_REVIEWS; }
    return s;
  } catch { return DEFAULT_REVIEWS; }
}
function saveReviews(arr) { localStorage.setItem('kg_reviews', JSON.stringify(arr)); }

function submitReview() {
  const lang = getLang();
  const T = (typeof TRANSLATIONS !== 'undefined') ? TRANSLATIONS[lang] : TRANSLATIONS.ru;

  const name  = document.getElementById('reviewName')?.value?.trim();
  const country= document.getElementById('reviewCountry')?.value?.trim() || '';
  const place = document.getElementById('reviewPlace')?.value;
  const text  = document.getElementById('reviewText')?.value?.trim();
  const tips  = document.getElementById('reviewTips')?.value?.trim() || '';
  const dateEl= document.getElementById('reviewDate')?.value;
  const rEl   = document.querySelector('input[name="rating"]:checked');

  if (!name)           { showToast(T.toast_err_name,  'error'); return; }
  if (!place)          { showToast(T.toast_err_place, 'error'); return; }
  if (!rEl)            { showToast(T.toast_err_star,  'error'); return; }
  if (!text||text.length<20){ showToast(T.toast_err_text, 'error'); return; }

  const review = { id:'r_'+Date.now(), name, country, place, rating:parseInt(rEl.value), text, tips, date:dateEl||new Date().toISOString().slice(0,7), isDefault:false };
  const reviews = getReviews();
  reviews.unshift(review);
  saveReviews(reviews);

  // Сбросить форму
  ['reviewName','reviewCountry','reviewText','reviewTips'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('reviewPlace').value = '';
  document.querySelectorAll('input[name="rating"]').forEach(r => r.checked=false);

  showToast(T.toast_review, 'success');
  renderReviews();
  updateStats();
}

function renderReviews() {
  const wall      = document.getElementById('reviewsWall');
  const noReviews = document.getElementById('noReviews');
  if (!wall) return;

  let reviews = getReviews();
  const placeF  = document.getElementById('filterPlace')?.value;
  const ratingF = document.getElementById('filterRating')?.value;
  const sort    = document.getElementById('sortReviews')?.value || 'new';

  if (placeF)  reviews = reviews.filter(r => r.place === placeF);
  if (ratingF) reviews = reviews.filter(r => r.rating >= parseInt(ratingF));
  if (sort==='rating') reviews.sort((a,b) => b.rating - a.rating);
  else reviews.sort((a,b) => b.id > a.id ? 1 : -1);

  if (reviews.length === 0) {
    wall.innerHTML = '';
    if (noReviews) noReviews.style.display = 'block';
    return;
  }
  if (noReviews) noReviews.style.display = 'none';

  wall.innerHTML = reviews.map(r => `
    <div class="review-wall-card">
      <div class="r-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
      <div class="r-text">"${escapeHtml(r.text)}"</div>
      ${r.tips?`<div style="font-size:.82rem;color:var(--green);margin-bottom:.75rem"><i class="fas fa-lightbulb"></i> <em>${escapeHtml(r.tips)}</em></div>`:''}
      <div class="r-footer">
        <div>
          <div class="r-author">${escapeHtml(r.name)} ${r.country?`<span style="font-size:.78rem;color:var(--gray)">· ${escapeHtml(r.country)}</span>`:''}
          </div>
          <div class="r-place"><i class="fas fa-map-marker-alt" style="color:var(--primary)"></i> ${escapeHtml(r.place)}</div>
        </div>
        <div style="text-align:right">
          <div class="r-date">${formatDate(r.date)}</div>
          ${!r.isDefault?`<button onclick="deleteReview('${r.id}')" style="background:none;border:none;cursor:pointer;color:var(--gray);font-size:.78rem;margin-top:.3rem"><i class="fas fa-trash"></i></button>`:''}
        </div>
      </div>
    </div>`).join('');

  updateStats();
}

function deleteReview(id) {
  saveReviews(getReviews().filter(r => r.id !== id));
  renderReviews();
  const lang = getLang();
  const T = (typeof TRANSLATIONS !== 'undefined') ? TRANSLATIONS[lang] : TRANSLATIONS.ru;
  showToast(T.toast_removed || 'Удалено', 'error');
}

function updateStats() {
  const reviews = getReviews();
  const total   = reviews.length;
  const avg     = total ? (reviews.reduce((s,r) => s+r.rating, 0)/total).toFixed(1) : '—';
  const fiveStar= reviews.filter(r => r.rating===5).length;
  const placeCount = {};
  reviews.forEach(r => { placeCount[r.place] = (placeCount[r.place]||0)+1; });
  const topPlace = Object.keys(placeCount).reduce((a,b) => placeCount[a]>placeCount[b]?a:b, '—');

  const el = (id, v) => { const e=document.getElementById(id); if(e) e.textContent=v; };
  el('totalCount',  total);
  el('avgRating',   avg==='—' ? '—' : `${avg} ★`);
  el('topPlace',    topPlace);
  el('fiveStarCount', fiveStar);
}

function initHomePage() {
  const preview = document.getElementById('reviewsPreview');
  if (!preview) return;
  const reviews = getReviews().slice(0, 3);
  preview.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
      <div class="review-text">"${escapeHtml(r.text.slice(0,140))}${r.text.length>140?'...':''}"</div>
      <div class="review-author">
        <div class="avatar">${r.name.charAt(0).toUpperCase()}</div>
        <div class="meta">
          <strong>${escapeHtml(r.name)}</strong>
          <span><i class="fas fa-map-marker-alt" style="color:var(--primary)"></i> ${escapeHtml(r.place)}</span>
        </div>
      </div>
    </div>`).join('');
}

/* ══════════════════════════════════════════
   7. ФИЛЬТРЫ МЕСТ И МАРШРУТОВ
   ══════════════════════════════════════════ */
function initPlacesFilter() {
  const btns = document.querySelectorAll('#filterGroup .filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('#placesGrid .place-card').forEach(card => {
        const cats = card.dataset.cat || '';
        card.style.display = (f==='all' || cats.includes(f)) ? '' : 'none';
      });
    });
  });
}

function initRoutesFilter() {
  const btns = document.querySelectorAll('#routeFilter .filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('#routesGrid .route-card').forEach(card => {
        const cats = card.dataset.cat || '';
        card.style.display = (f==='all' || cats.includes(f)) ? '' : 'none';
      });
    });
  });
}

/* ══════════════════════════════════════════
   8. УВЕДОМЛЕНИЯ (TOAST)
   ══════════════════════════════════════════ */
let toastTimer = null;
function showToast(msg, type='') {
  const toast    = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.className = 'toast show' + (type ? ' '+type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show','success','error'), 3200);
}

/* ══════════════════════════════════════════
   9. УТИЛИТЫ
   ══════════════════════════════════════════ */
function escapeHtml(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function formatDate(d) {
  if (!d) return '';
  try {
    const [y,m] = d.split('-');
    const months = {
      ru:['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
      en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      ky:['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
    };
    const lang = getLang();
    return `${(months[lang]||months.ru)[parseInt(m)-1]} ${y}`;
  } catch { return d; }
}

/* ══════════════════════════════════════════
   10. HEADER SCROLL
   ══════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const h = document.querySelector('.header');
  if (h) h.style.background = window.scrollY>50 ? 'rgba(255,255,255,.98)' : 'rgba(255,255,255,.95)';
});

/* ══════════════════════════════════════════
   11. ИНИЦИАЛИЗАЦИЯ (DOMContentLoaded)
   ══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Применить сохранённый язык
  const lang = getLang();
  applyLang(lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  document.documentElement.lang = lang === 'ky' ? 'ky' : lang === 'en' ? 'en' : 'ru';

  // Бургер меню
  initBurger();

  // Живой поиск
  initSearch();

  // Восстановить кнопки сохранения
  restoreSaveButtons();
  initSavedSection();

  // Страничная инициализация
  const path = window.location.pathname;
  if (path.includes('index.html') || path.endsWith('/') || path.endsWith('/kiro') || path.endsWith('/kiro/')) {
    initHomePage();
  }
  if (path.includes('places.html'))  initPlacesFilter();
  if (path.includes('routes.html'))  initRoutesFilter();
  if (path.includes('reviews.html')) { renderReviews(); updateStats(); }
});
