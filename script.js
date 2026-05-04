function toggleMenu(){
  document.getElementById('mobileMenu').classList.toggle('open');
}

window.addEventListener('scroll',()=>{
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
const revealElements = document.querySelectorAll('.section, .card, .prog-card, .obj-item, .impact-item, .about-photo, .founder-card, .footer-col');
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
