const navToggle=document.getElementById('navToggle');
const navMobile=document.getElementById('navMobile');
if(navToggle){navToggle.addEventListener('click',()=>{const open=navMobile.classList.toggle('open');navToggle.setAttribute('aria-expanded',open);});}
navMobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navMobile.classList.remove('open');navToggle?.setAttribute('aria-expanded','false');}));

const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');revealObserver.unobserve(entry.target);}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.querySelector(a.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}}));

const navItems=document.querySelectorAll('[data-nav]');
const sections=[...document.querySelectorAll('main section[id], header#hero')];
const setActive=()=>{let current='hero';const y=window.scrollY+180;sections.forEach(s=>{if(y>=s.offsetTop)current=s.id;});navItems.forEach(a=>a.classList.toggle('active',a.dataset.nav===current));};
window.addEventListener('scroll',setActive,{passive:true});setActive();

const form=document.getElementById('contactForm');
form?.addEventListener('submit',e=>{e.preventDefault();const name=form.elements.name.value.trim();const email=form.elements.email.value.trim();const message=form.elements.message.value.trim();const status=document.getElementById('formStatus');if(!name||!email||!message)return;status.textContent='Pesan siap dikirim. Hubungkan form ini ke backend/email service untuk mengaktifkannya.';form.reset();});


/* =========================================
   SHARED THEME — INDEX & PROJECT DETAIL
========================================= */

(() => {
  const THEME_KEY = "sandri-theme";

  function normalizeTheme(value) {
    return value === "dark" ? "dark" : "light";
  }

  function applyTheme(theme) {
    const normalized = normalizeTheme(theme);
    const root = document.documentElement;
    const body = document.body;

    // Gunakan atribut tema yang konsisten di semua halaman.
    root.dataset.theme = normalized;
    body.dataset.theme = normalized;

    // Mendukung CSS yang menggunakan class tema.
    root.classList.toggle("dark", normalized === "dark");
    root.classList.toggle("light", normalized === "light");

    body.classList.toggle("dark", normalized === "dark");
    body.classList.toggle("light", normalized === "light");

    body.classList.toggle("dark-mode", normalized === "dark");
    body.classList.toggle("light-mode", normalized === "light");

    return normalized;
  }

  function getSavedTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);

      if (saved === "dark" || saved === "light") {
        return saved;
      }
    } catch (error) {
      console.warn("Tema tidak dapat dibaca dari penyimpanan.", error);
    }

    // Kompatibilitas jika index masih menggunakan atribut/class lama.
    const root = document.documentElement;
    const body = document.body;

    if (
      root.dataset.theme === "dark" ||
      body.dataset.theme === "dark" ||
      root.classList.contains("dark") ||
      body.classList.contains("dark") ||
      body.classList.contains("dark-mode")
    ) {
      return "dark";
    }

    return "light";
  }

  function saveAndApplyTheme(theme) {
    const normalized = applyTheme(theme);

    try {
      localStorage.setItem(THEME_KEY, normalized);
    } catch (error) {
      console.warn("Tema tidak dapat disimpan.", error);
    }

    return normalized;
  }

  // Terapkan tema ketika halaman dibuka.
  applyTheme(getSavedTheme());

  // Dengarkan perubahan tema dari tab/halaman lain.
  window.addEventListener("storage", (event) => {
    if (event.key === THEME_KEY && event.newValue) {
      applyTheme(event.newValue);
    }
  });

  // Integrasi untuk tombol tema di halaman index.
  // Gunakan data-theme-toggle pada tombol yang sudah ada.
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const current = getSavedTheme();
      saveAndApplyTheme(current === "dark" ? "light" : "dark");
    });
  });

  // Fungsi dapat dipakai oleh kode tema lama tanpa mengganti tombol.
  window.SandriTheme = {
    get: getSavedTheme,
    apply: saveAndApplyTheme,
  };
})();
