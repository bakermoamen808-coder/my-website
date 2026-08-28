const searchToggle = document.getElementById("searchToggle");
const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const heroSearch = document.getElementById("heroSearch");
const heroInput = document.getElementById("heroInput");
const cards = [...document.querySelectorAll(".game-card")];

searchToggle.addEventListener("click", () => {
  searchPanel.classList.toggle("show");
  if (searchPanel.classList.contains("show")) searchInput.focus();
});

function filterGames(value){
  const q = value.trim().toLowerCase();
  cards.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    card.style.display = !q || name.includes(q) ? "" : "none";
  });
  document.getElementById("games").scrollIntoView({behavior:"smooth", block:"start"});
}

searchBtn.addEventListener("click", () => filterGames(searchInput.value));
searchInput.addEventListener("keydown", e => {
  if(e.key === "Enter") filterGames(searchInput.value);
});
heroSearch.addEventListener("submit", e => {
  e.preventDefault();
  filterGames(heroInput.value);
});

document.querySelectorAll(".tabs button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".tabs button").forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");
  });
});

document.querySelectorAll(".game-card").forEach(card=>{
  card.addEventListener("click",()=>{
    const title = card.dataset.name;
    alert(`تم اختيار: ${title}\nيمكنك لاحقًا ربط هذه البطاقة بصفحة تفاصيل اللعبة.`);
  });
});

const revealItems = document.querySelectorAll(".game-card,.news-card,.banner");
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.style.opacity="1";
      entry.target.style.transform="translateY(0)";
      observer.unobserve(entry.target);
    }
  });
},{threshold:.08});

revealItems.forEach(el=>{
  el.style.opacity="0";
  el.style.transform="translateY(18px)";
  el.style.transition="opacity .6s ease, transform .6s ease";
  observer.observe(el);
});
