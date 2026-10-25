/* ============================================
   VISIT KYRGYZSTAN — ADMIN PANEL JS
   Авторизация · CRUD · localStorage
   ============================================ */

/* ══════════════════════════════════════════
   AUTH GUARD — вызывать на каждой странице
   ══════════════════════════════════════════ */
function requireAuth() {
  if (localStorage.getItem('kg_admin_auth') !== 'true') {
    window.location.href = 'index.html';
    return false;
  }
  // Сессия 8 часов
  const loginTime = parseInt(localStorage.getItem('kg_admin_login_time') || '0');
  if (Date.now() - loginTime > 8 * 3600 * 1000) {
    adminLogout();
    return false;
  }
  return true;
}

function adminLogout() {
  localStorage.removeItem('kg_admin_auth');
  localStorage.removeItem('kg_admin_login_time');
  window.location.href = 'index.html';
}

/* ══════════════════════════════════════════
   SIDEBAR — активная ссылка
   ══════════════════════════════════════════ */
function initSidebar() {
  const page = window.location.pathname.split('/').pop();
  document.querySelectorAll('.menu-item').forEach(item => {
    const href = item.getAttribute('data-href') || item.getAttribute('onclick');
    if (href && href.includes(page)) item.classList.add('active');
  });

  // Мобильный бургер
  const burger = document.getElementById('adminBurger');
  const sidebar = document.querySelector('.sidebar');
  if (burger && sidebar) {
    burger.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (sidebar && !sidebar.contains(e.target) && !burger.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
}

/* ══════════════════════════════════════════
   ДАННЫЕ — МЕСТА (localStorage)
   ══════════════════════════════════════════ */
const DEFAULT_PLACES = [
  { id:'p1', name:'Иссык-Куль',       cat:'lake',    region:'Иссык-Кульская обл.', rating:5, status:'active', transport:'Автобус 4-5ч (300-500 сом), Машина 3-4ч', desc:'Второе по величине горное озеро в мире.', img:'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400', bestTime:'Июнь–Сент.' },
  { id:'p2', name:'Ала-Арча',         cat:'gorge',   region:'Чуйская обл.',         rating:5, status:'active', transport:'Маршрутка №265 (1ч, 60 сом), Такси 600-800 сом', desc:'Национальный природный парк, 40 км от Бишкека.', img:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400', bestTime:'Май–Окт.' },
  { id:'p3', name:'Сон-Куль',         cat:'lake',    region:'Нарынская обл.',       rating:5, status:'active', transport:'Кочкор+авто (3+2.5ч), Верхом 1 день',        desc:'Высокогорное озеро, 3016м.', img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', bestTime:'Июнь–Авг.' },
  { id:'p4', name:'Каньон Сказка',    cat:'canyon',  region:'Иссык-Куль',           rating:4, status:'active', transport:'Авто из Каракола 1.5ч, Такси ~1500 сом',      desc:'Красные скалы у берега Иссык-Куля.', img:'https://images.unsplash.com/photo-1548032885-b5e38734688a?w=400', bestTime:'Апр.–Окт.' },
  { id:'p5', name:'Арстанбап',        cat:'forest',  region:'Жалал-Абадская обл.',  rating:4, status:'active', transport:'Маршрутка из Жалал-Абада 2ч (150 сом)',       desc:'Один из крупнейших ореховых лесов мира.', img:'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=400', bestTime:'Авг.–Окт.' },
  { id:'p6', name:'Ош',               cat:'city',    region:'Ошская обл.',           rating:4, status:'active', transport:'Самолёт 1ч (1500+ сом), Автобус 10-12ч',      desc:'Древний город, 3000+ лет.', img:'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400', bestTime:'Весь год' },
  { id:'p7', name:'Каньон Конорчек',  cat:'canyon',  region:'Чуйская обл.',         rating:4, status:'active', transport:'Авто из Бишкека 1.5-2ч, Такси 2000-3000 сом', desc:'Красные скалы в 2 часах от Бишкека.', img:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400', bestTime:'Апр.–Нояб.' },
  { id:'p8', name:'Сары-Чeлек',       cat:'lake',    region:'Жалал-Абадская обл.',  rating:5, status:'active', transport:'До Таш-Кумыра 6ч + авто 1.5ч',               desc:'Озеро-заповедник ЮНЕСКО.', img:'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400', bestTime:'Июнь–Сент.' },
  { id:'p9', name:'Таласская долина', cat:'culture', region:'Таласская обл.',        rating:4, status:'active', transport:'Автобус из Бишкека 4-5ч (250 сом)',            desc:'Родина эпоса «Манас».', img:'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=400', bestTime:'Май–Сент.' },
];

const DEFAULT_ROUTES = [
  { id:'r1', name:'Ала-Арча — Водопад Ак-Сай', type:'trek',    difficulty:'easy',   duration:'6-7 ч',    distance:'14 км', height:'2200-3500 м', season:'Май–Окт.',  transport:'Маршрутка №265 (60 сом)', status:'active' },
  { id:'r2', name:'Кочкор — Сон-Куль',          type:'horse',   difficulty:'medium', duration:'2-3 дня',  distance:'80 км', height:'2800-3200 м', season:'Июнь–Авг.', transport:'Маршрутка до Кочкора 3ч (180 сом)', status:'active' },
  { id:'r3', name:'Каракол — Алтын-Арашан',     type:'trek',    difficulty:'medium', duration:'2 дня',    distance:'24 км', height:'1760-3600 м', season:'Май–Окт.',  transport:'Маршрутка до Каракола 7ч (500 сом)', status:'active' },
  { id:'r4', name:'Восхождение на Пик Ленина',  type:'climb',   difficulty:'hard',   duration:'3-4 нед.', distance:'—',     height:'3600-7134 м', season:'Июль–Авг.', transport:'Самолёт до Оша + авто до БЛ', status:'active' },
  { id:'r5', name:'Великий Шёлковый путь',       type:'culture', difficulty:'easy',   duration:'7-10 дн.', distance:'800 км',height:'различная',  season:'Апр.–Окт.', transport:'Аренда авто / с водителем', status:'active' },
  { id:'r6', name:'Арстанбап — Большой водопад', type:'trek',    difficulty:'easy',   duration:'4-5 ч',    distance:'8 км',  height:'1600-2000 м', season:'Май–Сент.', transport:'Автобус до Жалал-Абада (700 сом)', status:'active' },
];

function getPlaces()  { try { return JSON.parse(localStorage.getItem('kg_admin_places') || 'null') || DEFAULT_PLACES; } catch { return DEFAULT_PLACES; } }
function savePlaces(d){ localStorage.setItem('kg_admin_places', JSON.stringify(d)); }
function getRoutes()  { try { return JSON.parse(localStorage.getItem('kg_admin_routes') || 'null') || DEFAULT_ROUTES; } catch { return DEFAULT_ROUTES; } }
function saveRoutes(d){ localStorage.setItem('kg_admin_routes', JSON.stringify(d)); }
function getReviews() { try { return JSON.parse(localStorage.getItem('kg_reviews') || '[]'); } catch { return []; } }
function saveReviews(d){ localStorage.setItem('kg_reviews', JSON.stringify(d)); }
function getSettings(){ try { return JSON.parse(localStorage.getItem('kg_admin_settings') || 'null') || { siteName:'VisitKyrgyzstan', siteEmail:'info@visit-kyrgyzstan.kg', sitePhone:'+996 312 000 000', maintenanceMode:false, reviewsAutoApprove:true, itemsPerPage:10 }; } catch { return {}; } }
function saveSettings(d){ localStorage.setItem('kg_admin_settings', JSON.stringify(d)); }

/* ══════════════════════════════════════════
   STATISTICS
   ══════════════════════════════════════════ */
function getStats() {
  const places  = getPlaces();
  const routes  = getRoutes();
  const reviews = getReviews();
  const saved   = JSON.parse(localStorage.getItem('kg_saved_places') || '[]');
  const avgRating = reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : 0;
  return {
    totalPlaces:   places.length,
    activePlaces:  places.filter(p=>p.status==='active').length,
    totalRoutes:   routes.length,
    totalReviews:  reviews.length,
    avgRating,
    savedCount:    saved.length,
    fiveStar:      reviews.filter(r=>r.rating===5).length,
  };
}

/* ══════════════════════════════════════════
   УТИЛИТЫ
   ══════════════════════════════════════════ */
function escHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function genId(prefix) { return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2,7); }
function formatDateShort(ts) {
  if (!ts) return '—';
  const d = new Date(typeof ts === 'number' ? ts : Date.parse(ts));
  if (isNaN(d)) return ts;
  return d.toLocaleDateString('ru-RU', {day:'2-digit',month:'short',year:'numeric'});
}

/* ══════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════ */
let _toastTimer = null;
function adminToast(msg, type='ok') {
  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.className = 'admin-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fas fa-${type==='ok'?'check-circle':type==='err'?'times-circle':'exclamation-triangle'}"></i> ${msg}`;
  toast.className = `admin-toast show ${type}`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ══════════════════════════════════════════
   CONFIRM DIALOG
   ══════════════════════════════════════════ */
function adminConfirm(msg, onYes, title='Вы уверены?') {
  let overlay = document.getElementById('confirmOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'confirmOverlay';
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-box">
        <div class="confirm-icon">⚠️</div>
        <h3 id="confirmTitle"></h3>
        <p  id="confirmMsg"></p>
        <div class="confirm-btns">
          <button class="btn btn-ghost" onclick="closeConfirm()">Отмена</button>
          <button class="btn btn-danger" id="confirmYesBtn">Да, удалить</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMsg').textContent   = msg;
  const yesBtn = document.getElementById('confirmYesBtn');
  yesBtn.onclick = () => { closeConfirm(); onYes(); };
  overlay.classList.add('open');
}
function closeConfirm() {
  const o = document.getElementById('confirmOverlay');
  if (o) o.classList.remove('open');
}

/* ══════════════════════════════════════════
   MODAL
   ══════════════════════════════════════════ */
function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id){ document.getElementById(id)?.classList.remove('open'); }
// Закрытие по клику вне
document.addEventListener('click', e => {
  document.querySelectorAll('.modal-overlay.open').forEach(overlay => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open, .confirm-overlay.open').forEach(o => o.classList.remove('open'));
});

/* ══════════════════════════════════════════
   CAT / TYPE LABELS
   ══════════════════════════════════════════ */
const CAT_LABELS = { lake:'Озеро', mountain:'Гора', canyon:'Каньон', forest:'Лес', culture:'Культура', city:'Город', gorge:'Ущелье' };
const TYPE_LABELS = { trek:'Треккинг', horse:'Конный', climb:'Альпинизм', culture:'Культурный' };
const DIFF_LABELS = { easy:'Лёгкий', medium:'Средний', hard:'Сложный' };
const STATUS_LABELS = { active:'Активен', hidden:'Скрыт' };
