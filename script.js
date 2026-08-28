const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const searchToggle = $('#searchToggle');
const searchPanel = $('#searchPanel');
const searchInput = $('#searchInput');
const searchBtn = $('#searchBtn');
const heroSearch = $('#heroSearch');
const heroInput = $('#heroInput');
const cards = $$('.game-card');
const resultMessage = $('#resultMessage');

// Mobile menu
const menuToggle = $('#menuToggle');
const mainNav = $('.main-nav');
if (menuToggle) menuToggle.addEventListener('click', () => mainNav.classList.toggle('open'));

// Search
function filterGames(value, scroll = true){
  const q = value.trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const text = `${card.dataset.name} ${card.dataset.category || ''}`.toLowerCase();
    const show = !q || text.includes(q);
    card.classList.toggle('hidden-card', !show);
    if (show) visible++;
  });
  if (resultMessage) resultMessage.textContent = q ? `${visible} نتيجة لـ "${value}"` : '';
  if (scroll) $('#games').scrollIntoView({behavior:'smooth', block:'start'});
}

searchToggle.addEventListener('click', () => {
  searchPanel.classList.toggle('show');
  if (searchPanel.classList.contains('show')) searchInput.focus();
});
searchBtn.addEventListener('click', () => filterGames(searchInput.value));
searchInput.addEventListener('keydown', e => { if(e.key === 'Enter') filterGames(searchInput.value); });
heroSearch.addEventListener('submit', e => { e.preventDefault(); filterGames(heroInput.value); });

// Category chips
$$('.chips button[data-filter]').forEach(btn => btn.addEventListener('click', () => {
  const filter = btn.dataset.filter;
  cards.forEach(card => card.classList.toggle('hidden-card', filter !== 'all' && !(card.dataset.category || '').includes(filter)));
  $('#games').scrollIntoView({behavior:'smooth'});
}));

// Ranking tabs (demo data sorting)
$$('.tabs button[data-sort]').forEach(btn => btn.addEventListener('click', () => {
  $$('.tabs button').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const grid = $('#gameGrid');
  const sorted = [...cards].sort((a,b) => Number(b.dataset[btn.dataset.sort] || 0) - Number(a.dataset[btn.dataset.sort] || 0));
  sorted.forEach(card => grid.appendChild(card));
}));

// Favorites
const favorites = new Set(JSON.parse(localStorage.getItem('mowebFavorites') || '[]'));
function updateFavorite(card, button){
  const name = card.dataset.name;
  if (favorites.has(name)) { favorites.delete(name); button.classList.remove('saved'); button.textContent = '♡'; }
  else { favorites.add(name); button.classList.add('saved'); button.textContent = '♥'; }
  localStorage.setItem('mowebFavorites', JSON.stringify([...favorites]));
}

$$('.favorite-btn').forEach(btn => {
  const card = btn.closest('.game-card');
  if (favorites.has(card.dataset.name)) { btn.classList.add('saved'); btn.textContent = '♥'; }
  btn.addEventListener('click', e => { e.stopPropagation(); updateFavorite(card, btn); });
});

// Game details modal
const modal = $('#gameModal');
const modalTitle = $('#modalTitle');
const modalCategory = $('#modalCategory');
const modalText = $('#modalText');
const modalImage = $('#modalImage');
function openGame(card){
  modalTitle.textContent = card.dataset.name;
  modalCategory.textContent = card.dataset.category || 'لعبة';
  modalText.textContent = card.dataset.description || 'اكتشف تفاصيل اللعبة والمعلومات الأساسية عنها.';
  modalImage.style.backgroundImage = card.querySelector('.game-image').style.backgroundImage;
  modal.classList.add('show');
  document.body.classList.add('modal-open');
}
function closeModal(){ modal.classList.remove('show'); document.body.classList.remove('modal-open'); }
$$('.game-card').forEach(card => card.addEventListener('click', () => openGame(card)));
$$('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

// Device checker
$('#deviceCheck')?.addEventListener('click', () => {
  const cores = navigator.hardwareConcurrency || 'غير معروف';
  const ram = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'غير متاح من المتصفح';
  $('#deviceResult').textContent = `جهازك: ${cores} أنوية معالجة • RAM: ${ram} • متصفح: ${navigator.userAgent.includes('Chrome') ? 'Chrome' : 'متصفح حديث'}`;
});

// Account modal
$('#accountBtn')?.addEventListener('click', () => $('#accountModal').classList.add('show'));
$('#accountModal')?.addEventListener('click', e => { if(e.target.id === 'accountModal' || e.target.matches('[data-close-account]')) e.currentTarget.classList.remove('show'); });

// Newsletter/contact form
$('#contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  $('#contactMessage').textContent = 'تم استلام رسالتك بنجاح! سنعود إليك قريبًا.';
  e.target.reset();
});

// Reveal animation
const revealItems = $$('.game-card,.news-card,.banner');
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  });
},{threshold:.08});
revealItems.forEach(el=>observer.observe(el));
