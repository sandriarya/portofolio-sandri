(() => {
  "use strict";
  document.documentElement.setAttribute("data-theme", "dark");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#071522");
  document.body.classList.add("js-reveal");
})();
