
/* =========================================
   PROJECT DETAIL — THEME + IMAGE GALLERY
========================================= */

(() => {
  "use strict";

  const THEME_KEY = "sandri-theme";
  const root = document.documentElement;

  function normalizeTheme(value) {
    return value === "dark" ? "dark" : value === "light" ? "light" : null;
  }

  function applyTheme(theme) {
    const normalized = normalizeTheme(theme);
    if (!normalized) return;

    // Gunakan API tema utama dari script.js bila tersedia.
    if (window.SandriTheme && typeof window.SandriTheme.apply === "function") {
      window.SandriTheme.apply(normalized, false);
      return;
    }

    // Fallback memakai atribut dan class tema yang sama dengan script.js.
    root.dataset.theme = normalized;
    root.style.colorScheme = normalized;
    document.body.dataset.theme = normalized;

    root.classList.toggle("dark", normalized === "dark");
    root.classList.toggle("light", normalized === "light");
    root.classList.toggle("dark-mode", normalized === "dark");
    root.classList.toggle("light-mode", normalized === "light");
    document.body.classList.toggle("dark", normalized === "dark");
    document.body.classList.toggle("light", normalized === "light");
    document.body.classList.toggle("dark-mode", normalized === "dark");
    document.body.classList.toggle("light-mode", normalized === "light");
  }

  function syncTheme() {
    let savedTheme = null;
    try {
      savedTheme = normalizeTheme(localStorage.getItem(THEME_KEY));
    } catch (error) {
      console.warn("Tema tersimpan tidak dapat dibaca.");
    }

    const currentTheme = normalizeTheme(root.dataset.theme)
      || normalizeTheme(document.body?.dataset.theme)
      || "light";

    applyTheme(savedTheme || currentTheme);
  }

  // script.js memakai key "sandri-theme" dan menyediakan window.SandriTheme.
  syncTheme();

  // Perubahan tema dari tab lain ikut diterapkan.
  window.addEventListener("storage", event => {
    if (event.key === THEME_KEY) {
      applyTheme(normalizeTheme(event.newValue) || "light");
    }
  });

  /*
   * Galeri gambar
   */
  document.addEventListener("DOMContentLoaded", () => {
    const mainImage = document.getElementById("mainPreview");

    const thumbnails = Array.from(
      document.querySelectorAll(".preview-thumb")
    );

    const previousButton = document.getElementById("prevPreview");
    const nextButton = document.getElementById("nextPreview");

    if (!mainImage || thumbnails.length === 0) {
      console.warn("Elemen galeri proyek tidak ditemukan.");
      return;
    }

    let activeIndex = 0;

    function showPreview(index) {
      activeIndex =
        (index + thumbnails.length) % thumbnails.length;

      const selected = thumbnails[activeIndex];
      const imagePath = selected.dataset.image;

      if (!imagePath) {
        console.error("Path gambar belum ditentukan.");
        return;
      }

      mainImage.classList.add("is-changing");

      const finishTransition = () => {
        mainImage.classList.remove("is-changing");
      };

      mainImage.onload = finishTransition;

      mainImage.onerror = () => {
        finishTransition();
        console.error(
          "Gambar gagal dimuat:",
          imagePath
        );
      };

      mainImage.src = imagePath;

      thumbnails.forEach((thumbnail, i) => {
        const isActive = i === activeIndex;

        thumbnail.classList.toggle("active", isActive);
        thumbnail.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });
    }

    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", () => {
        showPreview(index);
      });
    });

    previousButton?.addEventListener("click", () => {
      showPreview(activeIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
      showPreview(activeIndex + 1);
    });

    showPreview(0);
  });
})();
