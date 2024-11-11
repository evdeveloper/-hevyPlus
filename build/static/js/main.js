document.addEventListener("DOMContentLoaded", () => {
  
  const body = document.querySelector('body');
  const slider = document.querySelector('.splide');
  const openMenu = document.querySelector('.open-menu');
  const mobileMenu = document.querySelector('.mobileMenu');
  const mobileMenuButton = mobileMenu.querySelector('.mobileMenu__close');
  const phoneMask = document.querySelectorAll('input[name="tel"]');
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver(callback);

  phoneMask.forEach(phone => {
    let mask = new IMask(phone, { mask: '+{7} (000) 000-00-00' });
    phone.addEventListener('mouseenter', () => {
      mask.updateOptions({ mask: '+{7} (000) 000-00-00', lazy: false });
    });
    phone.addEventListener('mouseleave', () => {
      mask.updateOptions({ mask: '+{7} (000) 000-00-00', lazy: true });
    });
  });
  
  function mobileMenuClose() {
    mobileMenu.classList.remove('active');
    overlayRemove();
  }
  openMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    overlayAdd();
  });
  mobileMenuButton.addEventListener('click', mobileMenuClose);

  function overlayAdd() {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    body.classList.add('hidden');
    body.appendChild(overlay);
  }
  function overlayRemove() {
    const overlay = document.querySelector('.overlay');
    if (overlay) { overlay.remove(); }
    body.classList.remove('hidden');
  }

  const splideGallery = new Splide(slider, {
    perPage: 3,
    gap: 24,
    pagination: true,
    arrows: false,
    breakpoints: {
      1200: {
        perPage: 2
      }
    }
  }).mount();

  enquire.register("screen and (max-width: 769px)", {
    match: function() { splideGallery.destroy(); },
    unmatch: function() { splideGallery.mount(); }
  });

  function openModal(id) {
    document.querySelector(`[data-popup-target="${id}"]`).classList.add('show');
    body.classList.add('hidden');
  }
  function closeModal(id) {
    document.querySelector(`[data-popup-target="${id}"]`).classList.remove('show');
    body.classList.remove('hidden');
  }

  const siblings = (elem) => {
    let siblings = [];
    if (!elem.parentNode) return siblings;
    let sibling = elem.parentNode.firstElementChild;
    do {
      if (sibling != elem) { siblings.push(sibling); }
    } while (sibling = sibling.nextElementSibling);
    return siblings;
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('.accordion__top')) {
      const parent = e.target.closest('.accordion__item');
      const content = parent.querySelector('.accordion__body');
      const siblingsElement = siblings(parent);
      parent.classList.toggle('active');
      content.slideToggle(300);
      siblingsElement.forEach((item) => {
        item.classList.remove('active');
        item.querySelector('.accordion__body').style.display = 'none';
      });
    }
    if(e.target.closest('[data-popup-open]')) {
      e.preventDefault();
      openModal(e.target.closest('[data-popup-open]').getAttribute('data-popup-open'));
      overlayAdd();
    }
    if (e.target.closest('.overlay')) {
      mobileMenuClose();
      document.querySelectorAll('.popup').forEach(popup => popup.classList.remove('show'));
    }
    if (e.target.closest('[data-popup-close]')) {
      const id = e.target.closest('.popup').getAttribute('data-popup-target');
      closeModal(id);
      overlayRemove();
    }
  });

  counters.forEach(counter => {
    observer.observe(counter, { threshold: [0.5] });
  });

  function callback(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const end = +entry.target.getAttribute('data-count');
        animateNumber(entry.target, 0, end, 2000);
        observer.unobserve(entry.target);
      }
    });
  };

  function animateNumber(element, start, end, duration) {
    let startTime = null;
    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;
      const value = Math.min(start + (end - start) * (progress / duration), end);
      element.querySelector('span').textContent = Math.floor(value);
      if (progress < duration) {
        requestAnimationFrame(step);
      } else {
        element.querySelector('span').textContent = end;
      }
    }
    requestAnimationFrame(step);
  }

});