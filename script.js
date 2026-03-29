// Affiche l'ecran d'entree puis redirige vers la page principale.
const shell = document.querySelector('.entry-shell');
const enterButton = document.getElementById('enterSiteBtn');
const entryCard = document.querySelector('.entry-card');
const entryGlow = document.querySelector('.entry-glow');
let isLeaving = false;

if (shell) {
  shell.style.display = 'block';
}

const enterSite = () => {
  if (isLeaving) return;
  isLeaving = true;
  document.body.classList.add('is-leaving');

  globalThis.setTimeout(() => {
    globalThis.location.href = 'pages/apropos.html';
  }, 620);
};

if (enterButton) {
  enterButton.addEventListener('click', (event) => {
    event.stopPropagation();
    enterSite();
  });
}

document.body.addEventListener('click', () => {
  enterSite();
});

if (entryCard && entryGlow) {
  document.body.addEventListener('pointermove', (event) => {
    if (isLeaving) return;

    const rect = entryCard.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    const dx = event.clientX - cardCenterX;
    const dy = event.clientY - cardCenterY;

    const tiltY = Math.max(-6, Math.min(6, (dx / rect.width) * 12));
    const tiltX = Math.max(-6, Math.min(6, (-dy / rect.height) * 12));

    entryCard.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    entryCard.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);

    entryGlow.style.setProperty('--glow-x', `${(dx * 0.06).toFixed(2)}px`);
    entryGlow.style.setProperty('--glow-y', `${(dy * 0.06).toFixed(2)}px`);
  });

  document.body.addEventListener('pointerleave', () => {
    if (isLeaving) return;
    entryCard.style.setProperty('--tilt-x', '0deg');
    entryCard.style.setProperty('--tilt-y', '0deg');
    entryGlow.style.setProperty('--glow-x', '0px');
    entryGlow.style.setProperty('--glow-y', '0px');
  });
}
