// Animation du logo
gsap.fromTo(
  ".logo-name",
  { y: 50, opacity: 0 },
  { y: 0, opacity: 1, duration: 2, delay: 0.5 }
);

// Animation de la disparition de la loading-page
gsap.fromTo(
  ".loading-page",
  { opacity: 1 },
  {
    opacity: 0,
    display: "none",
    duration: 1.5,
    delay: 3.5,
    onComplete: () => {
      // Affiche le wrapper après disparition de la loading page
      const wrapper = document.querySelector(".wrapper");
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "column"; // centre vertical et horizontal
    }
  }
);

// Redirection au clic sur le wrapper
const wrapper = document.querySelector(".wrapper");
wrapper.addEventListener("click", () => {
  window.location.href = "pages/apropos.html";
});

