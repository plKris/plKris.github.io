const bandeau = document.getElementById('bandeau');
const scrollContainer = document.getElementById('scroll-container');
let rectangles = document.querySelectorAll('.rectangle');

let isDragging = false;
let startX;
let scrollLeft;
let autoScroll;
let autoScrollSpeed = 1; // Vitesse du défilement automatique

// Cloner les rectangles pour permettre un défilement infini
function cloneRectangles() {
  const totalWidth = scrollContainer.scrollWidth;
  const containerWidth = bandeau.clientWidth;
  
  while (scrollContainer.scrollWidth < containerWidth * 2) {
    rectangles.forEach(rectangle => {
      const clone = rectangle.cloneNode(true);
      scrollContainer.appendChild(clone);
    });
  }
}

scrollContainer.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.pageX - bandeau.offsetLeft;
  scrollLeft = bandeau.scrollLeft;
  scrollContainer.style.cursor = 'grabbing';
  clearInterval(autoScroll); // Arrêter le défilement automatique lorsqu'on fait glisser
});

scrollContainer.addEventListener('mouseup', () => {
  isDragging = false;
  scrollContainer.style.cursor = 'grab';
  startAutoScroll(); // Redémarrer le défilement automatique
});

scrollContainer.addEventListener('mouseleave', () => {
  if (isDragging) {
    isDragging = false;
    scrollContainer.style.cursor = 'grab';
    startAutoScroll(); // Redémarrer le défilement automatique
  }
});

scrollContainer.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - bandeau.offsetLeft;
  const walk = (x - startX) * 2; // Ajustez la vitesse du défilement ici
  bandeau.scrollLeft = scrollLeft - walk;
});

function startAutoScroll() {
  autoScroll = setInterval(() => {
    bandeau.scrollLeft += autoScrollSpeed;
    // Réinitialiser la position pour le défilement infini
    if (bandeau.scrollLeft >= scrollContainer.scrollWidth / 2) {
      bandeau.scrollLeft = 0;
    }
  }, 20); // Ajustez l'intervalle de défilement ici
}

document.addEventListener("DOMContentLoaded", function() {
  const rectangles = document.querySelectorAll(".rectangleu");
  rectangles.forEach((rectangle, index) => {
      rectangle.style.setProperty('--animation-delay', `${index * 0.5}s`);
  });
});

// Initialiser
cloneRectangles();
startAutoScroll();

document.addEventListener('DOMContentLoaded', function() {
  const bandeau = document.getElementById('bandeauB');
  
  bandeau.addEventListener('click', function() {
      window.location.href = 'actualite.html';
  });
});
