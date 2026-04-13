import barba from '@barba/core';
import gsap from 'gsap';

// Initialize page animations
export const initPageAnimations = () => {
  // Re-initialize GSAP animations
  const animateElements = document.querySelectorAll('[data-animate]');
  animateElements.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: parseFloat(el.dataset.delay || 0),
        ease: 'power2.out'
      }
    );
  });

  // Re-initialize lazy loading
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

// Barba.js configuration
export const initBarba = () => {
  // Check if wrapper exists before initializing
  const wrapper = document.querySelector('[data-barba="wrapper"]');
  if (!wrapper) {
    console.warn('Barba.js: No wrapper found. Skipping initialization.');
    return;
  }

  barba.init({
    preventRunning: true,
    transitions: [
      {
        name: 'default-transition',
        leave({ current }) {
          return gsap.to(current.container, {
            opacity: 0,
            y: 10,
            duration: 0.3,
            ease: 'power1.out'
          });
        },
        enter({ next }) {
          window.scrollTo(0, 0);
          return gsap.from(next.container, {
            opacity: 0,
            y: 10,
            duration: 0.35,
            ease: 'power1.out'
          });
        }
      },
      {
        name: 'product-to-product',
        from: {
          namespace: ['mallas-electrosoldadas', 'mallas-plegadas', 'hierro-cortado-doblado', 'barras-lisas', 'barras-conformadas']
        },
        to: {
          namespace: ['mallas-electrosoldadas', 'mallas-plegadas', 'hierro-cortado-doblado', 'barras-lisas', 'barras-conformadas']
        },
        leave({ current }) {
          return gsap.to(current.container, {
            opacity: 0,
            x: -20,
            duration: 0.3,
            ease: 'power1.inOut'
          });
        },
        enter({ next }) {
          window.scrollTo(0, 0);
          return gsap.from(next.container, {
            opacity: 0,
            x: 20,
            duration: 0.35,
            ease: 'power1.inOut'
          });
        }
      },
      {
        name: 'catalogue-to-product',
        from: {
          namespace: 'catalogue'
        },
        to: {
          namespace: ['mallas-electrosoldadas', 'mallas-plegadas', 'hierro-cortado-doblado', 'barras-lisas', 'barras-conformadas']
        },
        leave({ current }) {
          const product = current.container.querySelector('.product-item.active');
          if (product) {
            const rect = product.getBoundingClientRect();
            return gsap.timeline()
              .to(product, {
                position: 'fixed',
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                zIndex: 1000,
                duration: 0
              })
              .to(product, {
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                duration: 0.5,
                ease: 'power2.inOut'
              })
              .to(current.container, {
                opacity: 0,
                duration: 0.3
              }, '-=0.3');
          }
          return gsap.to(current.container, {
            opacity: 0,
            duration: 0.3,
            ease: 'power1.out'
          });
        },
        enter({ next }) {
          window.scrollTo(0, 0);
          return gsap.from(next.container, {
            opacity: 0,
            scale: 1.05,
            duration: 0.4,
            ease: 'power1.out'
          });
        }
      }
    ]
  });

  // Hooks for re-initialization
  barba.hooks.afterEnter(() => {
    initPageAnimations();
  });

  barba.hooks.after(() => {
    // Update active navigation
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Re-initialize any third-party scripts
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-CPCFV23NH9', {
        page_path: currentPath
      });
    }
  });
};

// Handle browser back/forward buttons
export const handlePopState = () => {
  window.addEventListener('popstate', () => {
    barba.go(window.location.href);
  });
};

// Exclude certain links from Barba
export const setupBarbaExclusions = () => {
  // Exclude anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.setAttribute('data-barba-prevent', 'self');
  });

  // Exclude external links
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
      link.setAttribute('data-barba-prevent', 'self');
    }
  });

  // Exclude download links
  document.querySelectorAll('a[download]').forEach(link => {
    link.setAttribute('data-barba-prevent', 'self');
  });

  // Exclude mailto and tel links
  document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]').forEach(link => {
    link.setAttribute('data-barba-prevent', 'self');
  });
};