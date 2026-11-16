const photoTopics = {
  "Earthquakes": ["earthquake,damaged,building","earthquake,rubble,city","earthquake,rescue,building"],
  "Floods": ["flood,street,water","flood,house,water","flood,rescue,boat"],
  "Tornadoes": ["tornado,storm","tornado,clouds,field","storm,damage,weather"],
  "Volcanoes": ["volcano,eruption,lava","volcano,ash,smoke","lava,volcano,mountain"],
  "Wildfires": ["wildfire,forest,fire","forest,fire,smoke","wildfire,rescue"],
  "Industrial Accidents": ["factory,industrial,accident","industrial,fire,smoke","factory,industrial,safety"],
  "Oil Spills": ["oil,spill,ocean,pollution","oil,spill,beach,cleanup","oil,pollution,water,bird"],
  "Transport Accidents": ["road,traffic,accident","car,collision,road","train,accident,railway"]
};

const modal = document.getElementById("galleryModal");
const galleryImages = document.getElementById("galleryImages");
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.style.display = "none", 2400);
}

function openGallery(topic) {
  document.getElementById("galleryTitle").textContent = topic;
  galleryImages.innerHTML = "";
  const searches = photoTopics[topic] || [];
  searches.forEach((query, index) => {
    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = topic + " photo " + (index + 1);
    img.src = `https://loremflickr.com/800/550/${query}`;
    img.title = "Open photo";
    img.addEventListener("click", () => window.open(img.src, "_blank", "noopener"));
    galleryImages.appendChild(img);
  });
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeGallery() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
document.querySelectorAll(".open-gallery").forEach(button => {
  button.addEventListener("click", () => openGallery(button.dataset.topic));
});
document.getElementById("closeModal").addEventListener("click", closeGallery);
modal.addEventListener("click", event => {
  if (event.target === modal) closeGallery();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeGallery();
});

// Search and topic filters
const searchInput = document.getElementById("searchInput");
let activeFilter = "all";
function filterCards() {
  const term = searchInput.value.toLowerCase().trim();
  let visible = 0;
  document.querySelectorAll(".disaster-card").forEach(card => {
    const matchesText = card.dataset.name.includes(term) ||
      card.textContent.toLowerCase().includes(term);
    const matchesType = activeFilter === "all" || card.dataset.type === activeFilter;
    const show = matchesText && matchesType;
    card.style.display = show ? "" : "none";
    if (show) visible++;
  });
  document.getElementById("noResults").style.display = visible ? "none" : "block";
}
searchInput.addEventListener("input", filterCards);
document.getElementById("clearSearch").addEventListener("click", () => {
  searchInput.value = "";
  activeFilter = "all";
  document.querySelectorAll(".filters .filter").forEach(b => b.classList.toggle("active", b.dataset.filter === "all"));
  filterCards();
});
document.querySelectorAll(".filters .filter").forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filters .filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    filterCards();
  });
});

// Dark / light theme
const themeBtn = document.getElementById("themeBtn");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  themeBtn.textContent = dark ? "☀️ Light mode" : "🌙 Dark mode";
});

// Emergency kit checklist progress
const kitChecks = [...document.querySelectorAll("#kitChecklist input")];
function updateKitProgress() {
  const count = kitChecks.filter(check => check.checked).length;
  document.getElementById("checkCount").textContent = `${count} / ${kitChecks.length} items`;
  document.getElementById("kitProgress").style.width = `${count / kitChecks.length * 100}%`;
}
kitChecks.forEach(check => check.addEventListener("change", updateKitProgress));

// Quiz scoring
document.getElementById("quizForm").addEventListener("submit", event => {
  event.preventDefault();
  const answers = {q1:"b",q2:"a",q3:"c",q4:"a",q5:"b"};
  let score = 0;
  let answered = 0;
  Object.entries(answers).forEach(([question, correct]) => {
    const selected = document.querySelector(`input[name="${question}"]:checked`);
    if (selected) {
      answered++;
      if (selected.value === correct) score++;
    }
  });
  const result = document.getElementById("quizResult");
  if (answered < 5) {
    result.textContent = `You answered ${answered} of 5 questions. Please answer all questions first.`;
    result.style.color = "var(--accent)";
    return;
  }
  const message = score === 5 ? "Excellent! You know your safety basics." :
    score >= 3 ? "Good job! Review the safety tips to improve." :
    "Keep learning! Review the safety section and try again.";
  result.textContent = `Your score: ${score}/5. ${message}`;
  result.style.color = score >= 4 ? "#16a34a" : "var(--primary)";
});
document.getElementById("resetQuiz").addEventListener("click", () => {
  document.getElementById("quizResult").textContent = "";
});

// Back to top
const topBtn = document.getElementById("topBtn");
window.addEventListener("scroll", () => {
  topBtn.style.display = window.scrollY > 450 ? "block" : "none";
});
topBtn.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));

// Simple reveal effect
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("reveal");
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:0.08});
document.querySelectorAll(".card,.feature,.tip,.stat,.history,.num-card,.phase,.faq").forEach(el => revealObserver.observe(el));

// NEW: copy emergency numbers
document.querySelectorAll(".copy-num").forEach(btn => {
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.num);
      showToast("Number " + btn.dataset.num + " copied");
    } catch (e) {
      showToast("Number: " + btn.dataset.num);
    }
  });
});

// NEW: safety guide tabs
document.querySelectorAll("#guideTabs .filter").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll("#guideTabs .filter").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("show"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.panel).classList.add("show");
  });
});

// NEW: contact form (demo, no server yet)
document.getElementById("contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("cName").value.trim();
  showToast("Thank you, " + name + "! Your message was received.");
  event.target.reset();
});