/**
 * Veille Google Actualites via RSS2JSON
 * 3 articles par theme, 6 articles pour la section globale.
 */

(function() {
  'use strict';

  const GLOBAL_PAGE_SIZE = 6;
  let globalArticles = [];
  let globalVisibleCount = GLOBAL_PAGE_SIZE;

  function decodeEntities(value) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = value || '';
    return textarea.value;
  }

  function cleanText(value) {
    let cleaned = value || '';
    for (let i = 0; i < 2; i++) {
      cleaned = decodeEntities(cleaned);
    }
    cleaned = cleaned.replace(/<[^>]*>/g, ' ');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    return cleaned;
  }

  function construireCarteActualite(article) {
    const dateObj = new Date(article.pubDate || Date.now());
    const dateFormatee = dateObj.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const titre = cleanText(article.title || 'Article sans titre');
    const lien = article.link || '#';

    return `
      <article class="card-actualite">
        <div class="card-date">${dateFormatee}</div>
        <h5 class="card-titre">${titre}</h5>
        <a href="${lien}" target="_blank" rel="noopener noreferrer" class="card-lien">Lire l'article</a>
      </article>
    `;
  }

  function chargerVeille(urlRSS, idConteneur, nombreArticles) {
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(urlRSS)}`;
    const container = document.getElementById(idConteneur);

    if (!container) {
      return;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (!data || !Array.isArray(data.items)) {
          throw new Error('Format de reponse invalide');
        }

        container.innerHTML = '';

        const articles = data.items.slice(0, nombreArticles);

        if (articles.length === 0) {
          container.innerHTML = '<p class="muted">Aucun article disponible pour le moment.</p>';
          return;
        }

        articles.forEach((article) => {
          container.innerHTML += construireCarteActualite(article);
        });
      })
      .catch((error) => {
        console.error('Erreur API :', error);
        container.innerHTML = '<p class="muted">Impossible de charger les actualites pour le moment.</p>';
      });
  }

  function mettreAJourBoutonAfficherPlus() {
    const btn = document.getElementById('btn-afficher-plus-veille');
    if (!btn) {
      return;
    }

    if (globalArticles.length > globalVisibleCount) {
      btn.style.display = 'inline-flex';
    } else {
      btn.style.display = 'none';
    }
  }

  function renderGlobalArticles() {
    const container = document.getElementById('liste-globale-veille');
    if (!container) {
      return;
    }

    const visibleArticles = globalArticles.slice(0, globalVisibleCount);
    container.innerHTML = '';

    if (visibleArticles.length === 0) {
      container.innerHTML = '<p class="muted">Aucun article disponible pour le moment.</p>';
      mettreAJourBoutonAfficherPlus();
      return;
    }

    visibleArticles.forEach((article) => {
      container.innerHTML += construireCarteActualite(article);
    });

    mettreAJourBoutonAfficherPlus();
  }

  function chargerVeilleGlobale(urlRSS) {
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(urlRSS)}`;
    const container = document.getElementById('liste-globale-veille');
    if (!container) {
      return;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (!data || !Array.isArray(data.items)) {
          throw new Error('Format de reponse invalide');
        }

        globalArticles = data.items;
        globalVisibleCount = GLOBAL_PAGE_SIZE;
        renderGlobalArticles();
      })
      .catch((error) => {
        console.error('Erreur API :', error);
        container.innerHTML = '<p class="muted">Impossible de charger les actualites pour le moment.</p>';
        const btn = document.getElementById('btn-afficher-plus-veille');
        if (btn) {
          btn.style.display = 'none';
        }
      });
  }

  function initialiserVeille() {
    // Theme 1 : Securite
    chargerVeille(
      'https://news.google.com/rss/search?q=IA+developpement+securite+OR+faille&hl=fr&gl=FR&ceid=FR:fr',
      'articles-theme1',
      3
    );

    // Theme 2 : Confidentialite
    chargerVeille(
      'https://news.google.com/rss/search?q=IA+code+donnees+OR+confidentialite+OR+propriete&hl=fr&gl=FR&ceid=FR:fr',
      'articles-theme2',
      3
    );

    // Theme 3 : Competences
    chargerVeille(
      'https://news.google.com/rss/search?q=IA+developpeur+competences+OR+metier&hl=fr&gl=FR&ceid=FR:fr',
      'articles-theme3',
      3
    );

    // Dernieres actualites globales
    chargerVeilleGlobale(
      'https://news.google.com/rss/search?q=IA+developpeur+vulnerabilite+OR+risque&hl=fr&gl=FR&ceid=FR:fr',
    );

    const btnAfficherPlus = document.getElementById('btn-afficher-plus-veille');
    if (btnAfficherPlus) {
      btnAfficherPlus.addEventListener('click', () => {
        globalVisibleCount += GLOBAL_PAGE_SIZE;
        renderGlobalArticles();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiserVeille);
  } else {
    initialiserVeille();
  }
})();
