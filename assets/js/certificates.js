(() => {
  const modal = document.getElementById('certificateModal');
  const modalTitle = document.getElementById('certificateModalTitle');
  const modalContent = document.getElementById('certificateModalContent');
  if (!modal || !modalTitle || !modalContent) return;

  let previousFocus = null;

  function closeModal() {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('certificate-modal-open');
    modalContent.replaceChildren();
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }

  function openModal(card) {
    const source = card.dataset.certSrc;
    if (!source) return;
    const type = (card.dataset.certType || source.split('.').pop()).toLowerCase();
    const title = card.dataset.certTitle || card.querySelector('h3')?.textContent.trim() || 'Sertifikat';
    previousFocus = document.activeElement;
    modalTitle.textContent = title;
    modalContent.replaceChildren();

    if (type === 'pdf' || source.toLowerCase().split('?')[0].endsWith('.pdf')) {
      const frame = document.createElement('iframe');
      frame.src = source;
      frame.title = `Preview PDF: ${title}`;
      frame.loading = 'lazy';
      modalContent.appendChild(frame);
    } else {
      const image = document.createElement('img');
      image.src = source;
      image.alt = title;
      image.addEventListener('error', () => {
        modalContent.replaceChildren();
        const error = document.createElement('p');
        error.className = 'certificate-preview-error';
        error.textContent = 'File sertifikat belum dapat dimuat. Periksa kembali lokasi file.';
        modalContent.appendChild(error);
      }, { once: true });
      modalContent.appendChild(image);
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('certificate-modal-open');
    modal.querySelector('.certificate-modal-close')?.focus();
  }

  document.addEventListener('click', event => {
    const card = event.target.closest('[data-cert-src]');
    if (card) {
      event.preventDefault();
      openModal(card);
      return;
    }
    if (event.target.closest('[data-certificate-close]')) closeModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
    if (event.key === 'Tab' && modal.classList.contains('is-open')) {
      const closeButton = modal.querySelector('.certificate-modal-close');
      if (closeButton && document.activeElement === closeButton && event.shiftKey) {
        event.preventDefault();
        closeButton.focus();
      }
    }
  });
})();
