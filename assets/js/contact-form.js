/* Contact form fallback: opens the visitor's email app with a prefilled message.
   For automatic delivery without the visitor's email app, configure EmailJS credentials. */
(() => {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactFormStatus');
  if (!form || !status) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const subject = encodeURIComponent(`Pesan portofolio dari ${name}`);
    const body = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`);
    status.textContent = 'Aplikasi email akan dibuka untuk mengirim pesan. Silakan tekan Kirim di aplikasi email kamu.';
    window.location.href = `mailto:sandriaryafikriawan@gmail.com?subject=${subject}&body=${body}`;
  });
})();
