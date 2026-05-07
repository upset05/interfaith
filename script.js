function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.remove('open');
  });
});

// Reveal on scroll
const revealElements = document.querySelectorAll('.reveal, .section, .card, .prog-card, .obj-item, .impact-item, .about-photo, .founder-card, .footer-col');
revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

// Initialize Lucide icons
if (window.lucide) {
  lucide.createIcons();
}

// All Gallery Images
const galleryImages = [
  "WhatsApp Image 2026-05-01 at 5.53.05 PM (1).jpeg",
  "WhatsApp Image 2026-05-01 at 5.53.05 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.34 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.35 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.36 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.37 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.38 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.39 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.40 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.41 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.43 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.44 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.45 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.47 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.48 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.50 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.50 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.51 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.53 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.54 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.56 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.56.57 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.00 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.01 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.03 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.03 PM (3).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.04 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.04 PM (2).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.04 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.05 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.05 PM (2).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.05 PM (3).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.05 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.06 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.07 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.07 PM (2).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.08 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.09 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.10 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.12 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.14 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.14 PM (2).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.14 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.16 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.16 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.17 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.17 PM (2).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.17 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.18 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.18 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.19 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.20 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.21 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.21 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.22 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.23 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.23 PM (2).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.23 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.25 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.26 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.26 PM (2).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.26 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.27 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.27 PM (2).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.27 PM (3).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.27 PM.jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.28 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.28 PM (2).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.29 PM (1).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.29 PM (2).jpeg",
  "WhatsApp Image 2026-05-04 at 1.57.29 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.03 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.03 PM (2).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.03 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.04 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.04 PM (2).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.04 PM (3).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.04 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.05 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.05 PM (2).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.05 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.06 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.09 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.09 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.10 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.10 PM (2).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.10 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.11 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.11 PM (2).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.11 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.12 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.12 PM (2).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.12 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.13 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.13 PM (2).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.13 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.15 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.16 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.16 PM (2).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.16 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.17 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.17 PM (2).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.17 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.18 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.18 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.21 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.22 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.23 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.24 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.24 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.25 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.25 PM (2).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.25 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.26 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.26 PM (2).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.26 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.27 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.29 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.29 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.30 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.30 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.31 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.31 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.32 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.33 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.34 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.35 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.35 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.36 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.55 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.27.56 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.01 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.02 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.02 PM (2).jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.02 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.03 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.03 PM (2).jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.03 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.04 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.04 PM (2).jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.04 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.05 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.05 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.06 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.06 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.07 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.07 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.08 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.10 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.10 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.15 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.16 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.16 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.17 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.17 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.18 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.18 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.19 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.19 PM.jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.20 PM (1).jpeg",
  "WhatsApp Image 2026-05-07 at 1.28.20 PM.jpeg"
];

// Populate Gallery if container exists
document.addEventListener('DOMContentLoaded', () => {
  const dynamicGallery = document.getElementById('dynamicGallery');
  if (dynamicGallery) {
    // Clear existing placeholders
    dynamicGallery.innerHTML = '';

    // Add all images to the grid
    galleryImages.forEach(src => {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'dynamic-gallery-item';

      const img = document.createElement('img');
      img.src = src;
      img.alt = "IPPAD Event Photo";
      img.loading = "lazy";

      imgWrap.appendChild(img);
      dynamicGallery.appendChild(imgWrap);
    });
  }
});
