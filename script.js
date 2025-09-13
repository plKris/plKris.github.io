// Assurer que le wrapper est visible dès le départ
const wrapper = document.querySelector(".wrapper");
wrapper.style.display = "flex";
wrapper.style.flexDirection = "column";

// Redirection au clic sur le wrapper
wrapper.addEventListener("click", () => {
  window.location.href = "pages/apropos.html";
});
