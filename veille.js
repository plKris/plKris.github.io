(function () {
  "use strict";

  const DATA_URL = "/data/veille.json";
  const GLOBAL_PAGE_SIZE = 6;

  function cleanText(value) {
    const element = document.createElement("span");
    element.textContent = value || "";
    return element.textContent;
  }

  function articleCard(article) {
    const card = document.createElement("article");
    card.className = "card-actualite";

    const date = document.createElement("div");
    date.className = "card-date";
    const parsedDate = new Date(article.pubDate);
    date.textContent = Number.isNaN(parsedDate.getTime())
      ? ""
      : parsedDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

    const title = document.createElement("h5");
    title.className = "card-titre";
    title.textContent = cleanText(article.title);

    const link = document.createElement("a");
    link.className = "card-lien";
    link.href = article.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Lire l'article";

    card.append(date, title, link);
    return card;
  }

  function render(container, articles) {
    container.replaceChildren();
    if (!articles.length) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "Aucun article disponible pour le moment.";
      container.append(empty);
      return;
    }
    articles.forEach((article) => container.append(articleCard(article)));
  }

  async function load() {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  function showError() {
    document.querySelectorAll(".theme-articles-list, #liste-globale-veille").forEach((container) => {
      container.replaceChildren();
      const message = document.createElement("p");
      message.className = "muted";
      message.textContent = "La veille sera actualisée lors de la prochaine mise à jour.";
      container.append(message);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("btn-afficher-plus-veille");
    const globalContainer = document.getElementById("liste-globale-veille");
    let globalArticles = [];
    let visibleCount = GLOBAL_PAGE_SIZE;

    if (button && globalContainer) {
      button.addEventListener("click", () => {
        visibleCount += GLOBAL_PAGE_SIZE;
        render(globalContainer, globalArticles.slice(0, visibleCount));
        if (visibleCount >= globalArticles.length) button.style.display = "none";
      });
    }

    load()
      .then((data) => {
        const themes = data?.themes ?? {};
        const globalData = Array.isArray(data?.global) ? data.global : [];
        const updatedAt = data?.updatedAt ?? "";
        Object.entries(themes).forEach(([id, articles]) => {
          const container = document.getElementById(id);
          if (container) render(container, articles);
        });
        globalArticles = globalData
          .filter((article) => article?.title && article?.link)
          .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        if (globalContainer) render(globalContainer, globalArticles.slice(0, visibleCount));
        if (button) button.style.display = globalArticles.length > visibleCount ? "inline-flex" : "none";
        const updated = document.getElementById("veille-updated");
        if (updated && updatedAt) {
          updated.textContent = `Dernière mise à jour : ${new Date(updatedAt).toLocaleDateString("fr-FR")}`;
        }
      })
      .catch((error) => {
        console.error("Erreur de chargement de la veille :", error);
        showError();
      });
  });
})();
