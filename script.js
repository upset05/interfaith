// --- SAFE STORAGE FALLBACK ---
const sysStorage = {
  _data: {},
  getItem: function(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      console.warn("sysStorage.getItem blocked, using memory fallback:", e);
      return this._data[key] || null;
    }
  },
  setItem: function(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.warn("sysStorage.setItem blocked, using memory fallback:", e);
      this._data[key] = String(value);
    }
  },
  removeItem: function(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      delete this._data[key];
    }
  }
};

// --- CONFIGURATION CONSTANTS ---
// Paste your Supabase project credentials here to go live globally!
const SUPABASE_URL = "https://jdgzxvwgvmssayobbdrz.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZ3p4dndndm1zc2F5b2JiZHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTMxMDgsImV4cCI6MjA5NDU4OTEwOH0.2OydMDLfRXz5dT0lrHwk4SVOPJom4wC86FCXDJ5FLzQ";

let supabaseClient = null;

// Initialize Supabase dynamically and wait for the library to be ready
function initSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  
  const tryInit = () => {
    const lib = window.supabase;
    if (lib && typeof lib.createClient === 'function') {
      try {
        supabaseClient = lib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Supabase Client initialized successfully!");
        // Only re-render if DOM is already ready (avoids double render race condition)
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          if (typeof initLiveUpdates === 'function') {
            initLiveUpdates();
          }
        }
      } catch (e) {
        console.error("Failed to initialize Supabase client:", e);
      }
    } else {
      // Retry in 50ms
      setTimeout(tryInit, 50);
    }
  };
  
  tryInit();
}

initSupabase();

// --- INDEXEDDB MEDIA CACHE ENGINE ---
const DB_NAME = 'ippad_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media';

function getDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

function saveMedia(key, file) {
  return getDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(file, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
}

function getMedia(key) {
  return getDB().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(request.error);
    });
  });
}

function resolveMediaSrc(element, src, property = 'src') {
  if (!src) return Promise.resolve(src);
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    if (element) element[property] = src;
    return Promise.resolve(src);
  }

  // Directly assign local relative files for WhatsApp images and logo
  if (src.startsWith('WhatsApp Image') || src === 'logo.jpeg' || src === 'founder.jpeg') {
    const encodedSrc = encodeURI(src);
    if (element) {
      element[property] = encodedSrc;
      // Force image reload
      if (element.tagName === 'IMG') {
        element.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          element.src = 'logo.jpeg'; // Fallback to logo if image fails
        };
      }
    }
    return Promise.resolve(encodedSrc);
  }

  // 1. Try the local relative path first — works when files exist in the project folder
  return new Promise((resolve) => {
    const probe = new Image();
    const encodedSrc = encodeURI(src);
    probe.onload = () => {
      if (element) element[property] = encodedSrc;
      resolve(encodedSrc);
    };
    probe.onerror = () => {
      // 2. Try IndexedDB (locally uploaded files cached in browser)
      getMedia(src).then(file => {
        if (file) {
          const objectUrl = URL.createObjectURL(file);
          if (element) element[property] = objectUrl;
          resolve(objectUrl);
          return;
        }
        // 3. Try Supabase storage as last resort
        if (supabaseClient) {
          try {
            const { data } = supabaseClient.storage.from('images').getPublicUrl(src);
            if (data && data.publicUrl) {
              if (element) element[property] = data.publicUrl;
              resolve(data.publicUrl);
              return;
            }
          } catch (e) {
            console.warn("Supabase URL resolution failed:", e);
          }
        }
        // Final fallback: use the encoded src
        if (element) element[property] = encodedSrc;
        resolve(encodedSrc);
      }).catch(() => {
        if (element) element[property] = encodedSrc;
        resolve(encodedSrc);
      });
    };
    probe.src = encodedSrc;
  });
}

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
  
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) hamburger.classList.toggle('open');
  
  let overlay = document.getElementById('mobileMenuOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'mobileMenuOverlay';
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => {
      if (menu) menu.classList.remove('open');
      if (hamburger) hamburger.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
  overlay.classList.toggle('open');
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
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.remove('open');
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) hamburger.classList.remove('open');
    const overlay = document.getElementById('mobileMenuOverlay');
    if (overlay) overlay.classList.remove('open');
  });
});

// Reveal on scroll
const revealElements = document.querySelectorAll('.reveal, .card, .prog-card, .obj-item, .impact-item, .about-photo, .founder-card, .event-card');
revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// Initialize Lucide icons
if (window.lucide) {
  lucide.createIcons();
}
window.addEventListener('load', function() {
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
});

// All Gallery Images (Use Supabase URLs first, then local filenames as fallback)
const defaultGalleryImages = [
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/founder.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/logo.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-01_at_5.53.05_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-01_at_5.53.05_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.34_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.35_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.36_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.37_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.38_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.39_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.40_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.41_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.43_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.44_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.45_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.47_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.48_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.50_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.50_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.51_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.53_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.54_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.56_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.56.57_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.00_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.01_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.03_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.03_PM_3.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.04_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.04_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.04_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.05_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.05_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.05_PM_3.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.05_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.06_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.07_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.07_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.08_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.09_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.10_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.12_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.14_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.14_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.14_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.16_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.16_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.17_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.17_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.17_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.18_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.18_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.19_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.20_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.21_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.21_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.22_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.23_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.23_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.23_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.25_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.26_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.26_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.26_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.27_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.27_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.27_PM_3.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.27_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.28_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.28_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.29_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.29_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-04_at_1.57.29_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.03_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.03_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.03_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.04_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.04_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.04_PM_3.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.04_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.05_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.05_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.05_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.06_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.09_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.09_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.10_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.10_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.10_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.11_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.11_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.11_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.12_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.12_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.12_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.13_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.13_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.13_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.15_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.16_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.16_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.16_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.17_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.17_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.17_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.18_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.18_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.21_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.22_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.23_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.24_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.24_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.25_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.25_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.25_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.26_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.26_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.26_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.27_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.29_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.29_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.30_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.30_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.31_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.31_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.32_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.33_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.34_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.35_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.35_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.36_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.55_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.27.56_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.01_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.02_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.02_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.02_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.03_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.03_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.03_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.04_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.04_PM_2.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.04_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.05_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.05_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.06_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.06_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.07_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.07_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.08_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.10_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.10_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.15_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.16_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.16_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.17_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.17_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.18_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.18_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.19_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.19_PM.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.20_PM_1.jpeg",
  "https://jdgzxvwgvmssayobbdrz.supabase.co/storage/v1/object/public/images/WhatsApp_Image_2026-05-07_at_1.28.20_PM.jpeg"
];

// --- GLOBAL DEFAULT ARRAYS ---
const defaultPosts = [
  {
    id: "post_1",
    title: "Peace Accord Signed in Zaria",
    date: "May 12, 2026",
    content: "Christian and Muslim youth groups officially signed a communal peace accord, pledging to reject violence and instead pool resources to support local farming cooperatives.",
    image: "WhatsApp Image 2026-05-07 at 1.27.03 PM (1).jpeg"
  },
  {
    id: "post_2",
    title: "Grassroots Trauma Healing Workshop",
    date: "April 28, 2026",
    content: "Over 80 community members from conflict-affected districts in Jos participated in a three-day psychological support session organized by IPPAD's clinical unit.",
    image: "WhatsApp Image 2026-05-07 at 1.27.13 PM (2).jpeg"
  }
];

const defaultEventHeroes = [
  {
    id: "eh_1",
    title: "Advocacy Summit on National Unity",
    date: "April 2026",
    description: "Clergy leaders and civil society delegates formulating action strategies for joint interfaith committees.",
    image: "WhatsApp Image 2026-05-07 at 1.27.03 PM.jpeg"
  },
  {
    id: "eh_2",
    title: "Youth Skills & Uplift Program",
    date: "May 2026",
    description: "Providing start-up kits and practical agricultural coaching to local youth peace club members.",
    image: "WhatsApp Image 2026-05-07 at 1.28.10 PM.jpeg"
  }
];

const defaultVideos = [];

// Initialize dynamic system data if not already set
function initSystemData() {
  if (!sysStorage.getItem('ippad_initialized_v3')) {
    sysStorage.setItem('ippad_hero_photo', 'WhatsApp Image 2026-05-07 at 1.27.03 PM.jpeg');
    sysStorage.setItem('ippad_hero_badge', 'Different Faiths, One Humanity');
    sysStorage.setItem('ippad_hero_title', 'Imams & Pastors<br/><em>Interfaith Forum</em><br/>for Peace & Development');
    sysStorage.setItem('ippad_hero_motto', 'IPPAD — Different Faiths, One Humanity');
    sysStorage.setItem('ippad_hero_desc', 'A faith-based, non-partisan platform uniting Muslim and Christian leaders to build peaceful, healthy, and resilient communities across Nigeria — through structured dialogue, trauma healing, and measurable community action.');
    
    // Defaults are now globally defined above
    sysStorage.setItem('ippad_posts', JSON.stringify(defaultPosts));
    sysStorage.setItem('ippad_event_heroes', JSON.stringify(defaultEventHeroes));
    sysStorage.setItem('ippad_videos', JSON.stringify(defaultVideos));

    // Gallery images
    sysStorage.setItem('ippad_gallery', JSON.stringify(defaultGalleryImages));
    
    // Set initialization flag
    sysStorage.setItem('ippad_initialized_v3', 'true');
  }
}

// Invoke initialization
initSystemData();

// --- DUAL-MODE DATA ENGINES (SUPABASE + LOCAL STORAGE) ---

function getHeroContent() {
  if (supabaseClient) {
    return supabaseClient.from('hero_content').select('*').eq('id', 'main_hero').single().then(({ data, error }) => {
      if (error || !data) return getDefaultHeroLocal();
      return {
        badge: data.badge,
        title: data.title,
        motto: data.motto,
        desc: data.description,
        photo: data.photo_url
      };
    }).catch(() => getDefaultHeroLocal());
  }
  return Promise.resolve(getDefaultHeroLocal());
}

function getDefaultHeroLocal() {
  return {
    badge: sysStorage.getItem('ippad_hero_badge') || 'Different Faiths, One Humanity',
    title: sysStorage.getItem('ippad_hero_title') || 'Imams & Pastors<br/><em>Interfaith Forum</em>',
    motto: sysStorage.getItem('ippad_hero_motto') || 'IPPAD — Different Faiths, One Humanity',
    desc: sysStorage.getItem('ippad_hero_desc') || 'A faith-based, non-partisan platform uniting Muslim and Christian leaders to build peaceful, healthy, and resilient communities across Nigeria — through structured dialogue, trauma healing, and measurable community action.',
    photo: sysStorage.getItem('ippad_hero_photo') || 'WhatsApp Image 2026-05-01 at 5.53.05 PM.jpeg'
  };
}

function safeGetLocalPosts() {
  try {
    const val = sysStorage.getItem('ippad_posts');
    if (!val || val === 'undefined') return defaultPosts;
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : defaultPosts;
  } catch(e) {
    return defaultPosts;
  }
}

function getPostsList() {
  if (supabaseClient) {
    return supabaseClient.from('posts').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (error) throw error;
      if (!data || data.length === 0) return safeGetLocalPosts();
      return data;
    }).catch(err => {
      console.warn("Supabase fetch posts failed, fallback to local storage:", err);
      return safeGetLocalPosts();
    });
  }
  return Promise.resolve(safeGetLocalPosts());
}

function safeGetLocalEventHeroes() {
  try {
    const val = sysStorage.getItem('ippad_event_heroes');
    if (!val || val === 'undefined') return defaultEventHeroes;
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : defaultEventHeroes;
  } catch(e) {
    return defaultEventHeroes;
  }
}

function getEventHeroesList() {
  if (supabaseClient) {
    return supabaseClient.from('event_heroes').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (error) throw error;
      if (!data || data.length === 0) return safeGetLocalEventHeroes();
      return data;
    }).catch(err => {
      console.warn("Supabase fetch event heroes failed, fallback to local storage:", err);
      return safeGetLocalEventHeroes();
    });
  }
  return Promise.resolve(safeGetLocalEventHeroes());
}

function safeGetLocalGallery() {
  try {
    const val = sysStorage.getItem('ippad_gallery');
    if (!val || val === 'undefined') {
      const images = defaultGalleryImages || [];
      return Array.isArray(images) ? images : [];
    }
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : (defaultGalleryImages || []);
  } catch(e) {
    console.warn("Error parsing gallery from storage:", e);
    return defaultGalleryImages || [];
  }
}

function getGalleryPhotosList() {
  if (supabaseClient) {
    return supabaseClient.from('gallery').select('*').then(({ data, error }) => {
      if (error) {
        console.error('Supabase gallery fetch error:', error);
        throw error;
      }
      console.log('Supabase gallery data:', data); // Debug log
      const cloudUrls = (data || []).map(item => item.image_url).filter(url => url);
      console.log('Cloud URLs extracted:', cloudUrls.length, cloudUrls.slice(0, 3)); // Debug log
      
      // Combine new cloud photos with local photo names
      const allPhotos = [...cloudUrls, ...(defaultGalleryImages || [])];
      console.log('Total photos (cloud + local):', allPhotos.length); // Debug log
      return allPhotos.filter(photo => photo); // Filter out any falsy values
    }).catch(err => {
      console.warn("Supabase fetch gallery failed, fallback to local storage:", err);
      return safeGetLocalGallery();
    });
  }
  console.log('Supabase not initialized, using local gallery'); // Debug log
  return Promise.resolve(safeGetLocalGallery());
}

function safeGetLocalVideos() {
  try {
    const val = sysStorage.getItem('ippad_videos');
    if (!val || val === 'undefined') return defaultVideos;
    const parsed = JSON.parse(val);
    const videos = Array.isArray(parsed) ? parsed : defaultVideos;
    const filteredVideos = videos.filter(video => {
      if (!video || typeof video !== 'object') return false;
      const embedUrl = video.embedUrl || video.embed_url || '';
      const title = video.title || '';
      // Remove legacy placeholder fallback videos that used the default embed URL.
      if (embedUrl === 'https://www.youtube.com/embed/dQw4w9WgXcQ' &&
          (title.includes('IPPAD Interfaith Peace Summit Highlights') || title.includes('Community Cohesion & Dialogue') || video.id === 'v_1' || video.id === 'v_2')) {
        return false;
      }
      return true;
    });
    return filteredVideos.length > 0 ? filteredVideos : defaultVideos;
  } catch(e) {
    return defaultVideos;
  }
}

function getVideosList() {
  if (supabaseClient) {
    return supabaseClient.from('videos').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (error) throw error;
      if (!data || data.length === 0) return safeGetLocalVideos();
      return data.map(v => ({
        id: v.id,
        title: v.title,
        description: v.description,
        embedUrl: v.embed_url
      }));
    }).catch(err => {
      console.warn("Supabase fetch videos failed, fallback to local storage:", err);
      return safeGetLocalVideos();
    });
  }
  return Promise.resolve(safeGetLocalVideos());
}

// --- DYNAMIC RENDERING CONTROLLER ---

function renderHeroUI() {
  const heroLeftSection = document.getElementById('hero-left-section');
  const heroBadgeElem = document.getElementById('hero-badge-elem');
  const heroTitleElem = document.getElementById('hero-title-elem');
  const heroMottoElem = document.getElementById('hero-motto-elem');
  const heroDescElem = document.getElementById('hero-desc-elem');

  getHeroContent().then(hero => {
    if (heroLeftSection) {
      resolveMediaSrc(null, hero.photo).then(resolvedSrc => {
        heroLeftSection.style.background = `linear-gradient(155deg, rgba(26,92,56,0.92) 0%, rgba(13,51,32,0.95) 100%), url('${resolvedSrc}') center/cover`;
      });
    }
    if (heroBadgeElem) heroBadgeElem.innerText = hero.badge;
    if (heroTitleElem) heroTitleElem.innerHTML = hero.title;
    if (heroMottoElem) heroMottoElem.innerText = hero.motto;
    if (heroDescElem) heroDescElem.innerText = hero.desc;
  });
}

function renderPostsUI() {
  const announcementsSection = document.getElementById('announcements-section');
  const announcementsGrid = document.getElementById('announcementsGrid');
  if (!announcementsSection || !announcementsGrid) return;

  getPostsList().then(posts => {
    if (posts.length > 0) {
      announcementsSection.style.display = 'block';
      announcementsGrid.innerHTML = '';
      
      posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'card reveal';
        
        const img = document.createElement('img');
        img.src = 'logo.jpeg';
        img.alt = post.title;
        img.style.width = '100%';
        img.style.height = '200px';
        img.style.objectFit = 'cover';
        img.style.display = 'block';
        img.style.borderBottom = '4px solid var(--green)';
        
        resolveMediaSrc(img, post.image);
        
        const body = document.createElement('div');
        body.className = 'card-body';
        
        const dateTag = document.createElement('span');
        dateTag.style.fontSize = '12px';
        dateTag.style.color = 'var(--gold)';
        dateTag.style.fontWeight = '600';
        dateTag.innerText = post.date;
        
        const title = document.createElement('h3');
        title.style.marginTop = '6px';
        title.innerText = post.title;
        
        const desc = document.createElement('p');
        desc.style.marginTop = '10px';
        desc.innerText = post.content;
        
        body.appendChild(dateTag);
        body.appendChild(title);
        body.appendChild(desc);
        card.appendChild(img);
        card.appendChild(body);
        announcementsGrid.appendChild(card);
      });
      triggerAnimationsReveal();
    } else {
      announcementsSection.style.display = 'none';
    }
  });
}

function renderEventsUI() {
  const eventHeroesSection = document.getElementById('event-heroes');
  const eventHeroGrid = document.getElementById('eventHeroGrid');
  if (!eventHeroesSection || !eventHeroGrid) return;

  getEventHeroesList().then(heroes => {
    if (heroes.length > 0) {
      eventHeroesSection.style.display = 'block';
      eventHeroGrid.innerHTML = '';
      
      heroes.forEach(eh => {
        const card = document.createElement('div');
        card.className = 'card reveal';
        
        const img = document.createElement('img');
        img.src = 'logo.jpeg';
        img.alt = eh.title;
        img.style.width = '100%';
        img.style.height = '220px';
        img.style.objectFit = 'cover';
        img.style.display = 'block';
        img.style.borderBottom = '4px solid var(--gold)';
        
        resolveMediaSrc(img, eh.image);
        
        const body = document.createElement('div');
        body.className = 'card-body';
        
        const badge = document.createElement('span');
        badge.className = 'event-hero-badge';
        badge.innerText = eh.date || 'Featured';
        
        const title = document.createElement('h3');
        title.innerText = eh.title;
        
        const desc = document.createElement('p');
        desc.style.marginTop = '8px';
        desc.innerText = eh.description;
        
        body.appendChild(badge);
        body.appendChild(title);
        body.appendChild(desc);
        card.appendChild(img);
        card.appendChild(body);
        eventHeroGrid.appendChild(card);
      });
      triggerAnimationsReveal();
    } else {
      eventHeroesSection.style.display = 'none';
    }
  });
}

function renderGalleryUI() {
  const dynamicGallery = document.getElementById('dynamicGallery');
  const btnLoadMore = document.getElementById('btnLoadMore');
  const paginationContainer = document.getElementById('galleryPagination');
  if (!dynamicGallery) return;

  getGalleryPhotosList().then(galleryImages => {
    console.log('Gallery photos fetched:', galleryImages.length, galleryImages.slice(0, 5)); // Debug log
    
    // Filter out any null/undefined and ensure we have valid image names
    const validImages = (galleryImages || []).filter(img => img && img.trim());
    
    console.log('Valid gallery images:', validImages.length); // Debug log
    
    const BATCH_SIZE = 15;
    let currentIndex = 0;

    function renderBatch() {
      const nextBatch = validImages.slice(currentIndex, currentIndex + BATCH_SIZE);
      
      console.log(`Rendering batch: ${currentIndex} to ${currentIndex + BATCH_SIZE}, batch size: ${nextBatch.length}`); // Debug log
      
      nextBatch.forEach((src, idx) => {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'dynamic-gallery-item';

        const img = document.createElement('img');
        // Derive a helpful alt text from the filename when possible
        try {
          const decoded = decodeURIComponent(src);
          const fileName = decoded.split('/').pop() || decoded;
          const readable = fileName.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '');
          img.alt = readable ? `IPPAD photo — ${readable}` : 'IPPAD Event Photo';
        } catch (e) {
          img.alt = 'IPPAD Event Photo';
        }
        img.loading = 'lazy';
        img.decoding = 'async';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.display = 'block';
        
        // Set src directly with proper encoding
        const encodedSrc = encodeURI(src);
        img.src = encodedSrc;
        
        // Also call resolveMediaSrc for additional fallback handling
        resolveMediaSrc(img, src).then(resolvedSrc => {
          console.log(`Image ${idx} resolved to:`, resolvedSrc.substring(0, 50)); // Debug log
        });

        imgWrap.appendChild(img);
        dynamicGallery.appendChild(imgWrap);
      });

      currentIndex += BATCH_SIZE;

      if (btnLoadMore && paginationContainer) {
        if (currentIndex >= validImages.length) {
          paginationContainer.style.display = 'none';
        } else {
          paginationContainer.style.display = 'flex';
        }
      }
      triggerAnimationsReveal();
    }

    dynamicGallery.innerHTML = '';
    if (validImages.length > 0) {
      renderBatch();
    } else {
      dynamicGallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 40px 0;">No photos in the gallery currently.</p>';
      if (paginationContainer) paginationContainer.style.display = 'none';
    }

    if (btnLoadMore) {
      // Recreate event listener to prevent duplicate attachment
      const newBtn = btnLoadMore.cloneNode(true);
      btnLoadMore.parentNode.replaceChild(newBtn, btnLoadMore);
      newBtn.addEventListener('click', () => {
        newBtn.innerText = "Loading...";
        newBtn.disabled = true;
        
        setTimeout(() => {
          renderBatch();
          newBtn.innerText = "Load More Photos";
          newBtn.disabled = false;
        }, 400);
      });
    }
  }).catch(err => {
    console.error('Failed to fetch gallery photos:', err);
    if (dynamicGallery) {
      dynamicGallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 40px 0;">Error loading gallery.</p>';
    }
  });
}

function renderVideosUI() {
  const videosSection = document.getElementById('videos');
  const videoGrid = document.getElementById('videoGrid');
  if (!videosSection || !videoGrid) return;

  getVideosList().then(videos => {
    if (videos.length > 0) {
      videosSection.style.display = 'block';
      videoGrid.innerHTML = '';
      
      videos.forEach(v => {
        const card = document.createElement('div');
        card.className = 'video-card reveal';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'video-wrapper';
        
        if (v.embedUrl.startsWith('http') || v.embedUrl.includes('embed')) {
          const iframe = document.createElement('iframe');
          iframe.src = v.embedUrl;
          iframe.title = v.title;
          iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          iframe.allowFullscreen = true;
          wrapper.appendChild(iframe);
        } else {
          const video = document.createElement('video');
          video.controls = true;
          video.style.width = '100%';
          video.style.height = '100%';
          video.style.position = 'absolute';
          video.style.top = '0';
          video.style.left = '0';
          video.style.background = '#000';
          wrapper.appendChild(video);
          
          resolveMediaSrc(video, v.embedUrl);
        }
        
        const info = document.createElement('div');
        info.className = 'video-info';
        
        const title = document.createElement('h4');
        title.innerText = v.title;
        
        const desc = document.createElement('p');
        desc.innerText = v.description;
        
        info.appendChild(title);
        info.appendChild(desc);
        
        card.appendChild(wrapper);
        card.appendChild(info);
        videoGrid.appendChild(card);
      });
      triggerAnimationsReveal();
    } else {
      videosSection.style.display = 'none';
    }
  });
}

function triggerAnimationsReveal() {
  // Only observe NEW elements that haven't been activated yet
  const dynReveals = document.querySelectorAll('.reveal:not(.active)');
  dynReveals.forEach(el => {
    if (typeof revealObserver !== 'undefined') {
      revealObserver.observe(el);
    } else {
      el.classList.add('active');
    }
  });
  if (window.lucide) lucide.createIcons();
}

function initLiveUpdates() {
  renderHeroUI();
  renderPostsUI();
  renderEventsUI();
  renderGalleryUI();
  renderVideosUI();
}

// Skeleton loading overlay
function showSkeleton() {
  if (document.getElementById('skeletonOverlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'skeletonOverlay';
  overlay.setAttribute('aria-hidden','true');
  overlay.innerHTML = `
    <div class="sk-nav">
      <div class="sk-nav-brand">
        <div class="sk-nav-logo sk-shimmer-bg"></div>
        <div class="sk-nav-text">
          <div class="sk-nav-line-1 sk-shimmer-bg"></div>
          <div class="sk-nav-line-2 sk-shimmer-bg"></div>
        </div>
      </div>
      <div class="sk-nav-links">
        <div class="sk-nav-link sk-shimmer-bg"></div>
        <div class="sk-nav-link sk-shimmer-bg"></div>
        <div class="sk-nav-link sk-shimmer-bg"></div>
        <div class="sk-nav-link sk-shimmer-bg"></div>
        <div class="sk-nav-cta sk-shimmer-bg"></div>
      </div>
      <div class="sk-nav-hamburger sk-shimmer-bg"></div>
    </div>
    <div class="sk-hero">
      <div class="sk-hero-left">
        <div class="sk-hero-badge sk-shimmer-bg"></div>
        <div class="sk-hero-title sk-shimmer-bg"></div>
        <div class="sk-hero-desc sk-shimmer-bg"></div>
        <div class="sk-hero-buttons">
          <div class="sk-hero-btn sk-shimmer-bg"></div>
          <div class="sk-hero-btn sk-shimmer-bg"></div>
        </div>
      </div>
      <div class="sk-hero-right">
        <div class="sk-hero-circle sk-shimmer-bg"></div>
        <div class="sk-hero-card sk-shimmer-bg"></div>
      </div>
    </div>
    <div class="sk-section">
      <div class="sk-section-header">
        <div class="sk-section-title sk-shimmer-bg"></div>
        <div class="sk-section-subtitle sk-shimmer-bg"></div>
      </div>
      <div class="sk-grid-3">
        <div class="sk-card-item">
          <div class="sk-card-img sk-shimmer-bg"></div>
          <div class="sk-card-title sk-shimmer-bg"></div>
          <div class="sk-card-desc sk-shimmer-bg"></div>
        </div>
        <div class="sk-card-item">
          <div class="sk-card-img sk-shimmer-bg"></div>
          <div class="sk-card-title sk-shimmer-bg"></div>
          <div class="sk-card-desc sk-shimmer-bg"></div>
        </div>
        <div class="sk-card-item">
          <div class="sk-card-img sk-shimmer-bg"></div>
          <div class="sk-card-title sk-shimmer-bg"></div>
          <div class="sk-card-desc sk-shimmer-bg"></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.classList.add('is-loading');
}

function hideSkeleton() {
  const overlay = document.getElementById('skeletonOverlay');
  if (overlay) {
    overlay.classList.add('fade-out');
    overlay.addEventListener('transitionend', () => {
      overlay.remove();
    }, { once: true });
    // Failsafe in case transitionend doesn't fire
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove();
      }
    }, 600);
  }
  document.body.classList.remove('is-loading');
  document.body.classList.remove('loading');
}

// Populate Gallery, Videos, Posts, bind hamburger
document.addEventListener('DOMContentLoaded', () => {
  // Show skeleton overlay while content initializes
  showSkeleton();

  // Bind hamburger buttons via JS (reliable on all hosts — no inline onclick needed)
  document.querySelectorAll('.hamburger').forEach(btn => {
    btn.addEventListener('click', toggleMenu);
  });

  // Wait for Supabase to initialize, then render content
  const waitForSupabase = setInterval(() => {
    if (supabaseClient) {
      clearInterval(waitForSupabase);
      initLiveUpdates();
      // remove skeleton after initial render
      setTimeout(hideSkeleton, 600);
    }
  }, 50);

  // Failsafe: render after 2 seconds even if Supabase isn't ready
  setTimeout(() => {
    clearInterval(waitForSupabase);
    initLiveUpdates();
    setTimeout(hideSkeleton, 600);
  }, 2000);

  // --- SUBMISSIONS HANDLERS ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const statusDiv = document.getElementById('contactStatus');
      const name = document.getElementById('contactName').value.trim();
      const org = document.getElementById('contactOrg').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const phone = document.getElementById('contactPhone').value.trim();
      const subject = document.getElementById('contactSubject').value;
      const message = document.getElementById('contactMessage').value.trim();
      
      if (!name || !email || !subject || !message) {
        statusDiv.style.color = '#d93838'; // red
        statusDiv.textContent = 'Please fill in all required fields.';
        return;
      }
      
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Sending...';
      statusDiv.textContent = '';
      
      const newRequest = {
        id: 'req_' + Date.now(),
        created_at: new Date().toISOString(),
        name: name,
        organisation: org || null,
        email: email,
        phone: phone || null,
        subject: subject,
        message: message,
        status: 'pending'
      };
      
      const submitAction = supabaseClient
        ? supabaseClient.from('requests').insert([newRequest])
        : Promise.resolve().then(() => {
            const requests = JSON.parse(sysStorage.getItem('ippad_requests') || '[]');
            requests.unshift(newRequest);
            sysStorage.setItem('ippad_requests', JSON.stringify(requests));
          });
          
      submitAction
        .then(({ error } = {}) => {
          if (error) throw error;
          
          // Send background email notification via FormSubmit.co (non-blocking)
          fetch("https://formsubmit.co/ajax/imamsandpastorsforum@gmail.com", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              "Name": name,
              "Organisation": org || "N/A",
              "Email": email,
              "Phone": phone || "N/A",
              "Subject": subject,
              "Message": message,
              "_subject": `IPPAD Forum: New ${subject} from ${name}`
            })
          }).catch(err => console.warn("Email notification forward failed:", err));

          statusDiv.style.color = '#10b981'; // green
          statusDiv.textContent = 'Thank you! Your message has been sent successfully.';
          contactForm.reset();
        })
        .catch(err => {
          console.error(err);
          statusDiv.style.color = '#d93838'; // red
          statusDiv.textContent = 'Failed to send message. Please try again.';
        })
        .finally(() => {
          btn.disabled = false;
          btn.innerHTML = originalText;
        });
    });
  }

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const statusDiv = document.getElementById('newsletterStatus');
      const email = document.getElementById('newsletterEmail').value.trim();
      
      if (!email) return;
      
      const btn = newsletterForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Subscribing...';
      statusDiv.textContent = '';
      
      const newSub = {
        id: 'sub_' + Date.now(),
        created_at: new Date().toISOString(),
        email: email
      };
      
      const submitAction = supabaseClient
        ? supabaseClient.from('subscriptions').insert([newSub])
        : Promise.resolve().then(() => {
            const subs = JSON.parse(sysStorage.getItem('ippad_subscriptions') || '[]');
            // Check for duplicates in local storage fallback
            if (!subs.some(s => s.email.toLowerCase() === email.toLowerCase())) {
              subs.unshift(newSub);
              sysStorage.setItem('ippad_subscriptions', JSON.stringify(subs));
            }
          });
          
      submitAction
        .then(({ error } = {}) => {
          if (error) {
            // Check for unique key constraint error in Supabase
            if (error.code === '23505') {
              statusDiv.style.color = '#ffdd57'; // gold
              statusDiv.textContent = 'This email is already subscribed!';
              return;
            }
            throw error;
          }
          statusDiv.style.color = '#ffffff'; // white
          // Send background email notification via FormSubmit.co
          fetch("https://formsubmit.co/ajax/imamsandpastorsforum@gmail.com", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              "Email": email,
              "_subject": "IPPAD Forum: New Newsletter Subscription"
            })
          }).catch(err => console.warn("Email notification forward failed:", err));

          statusDiv.textContent = 'Successfully subscribed!';
          newsletterForm.reset();
        })
        .catch(err => {
          console.error(err);
          statusDiv.style.color = '#ffdd57'; // gold
          statusDiv.textContent = 'Subscription failed. Please try again.';
        })
        .finally(() => {
          btn.disabled = false;
          btn.innerHTML = originalText;
        });
    });
  }

  // --- GET INVOLVED CARDS INTERACTION ---
  document.querySelectorAll('.get-involved-card').forEach(card => {
    card.addEventListener('click', () => {
      const subject = card.getAttribute('data-subject');
      const select = document.getElementById('contactSubject');
      const form = document.getElementById('contactForm');
      
      if (select && form) {
        select.value = subject;
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Add a temporary subtle highlight animation to the form
        form.style.transition = 'outline 0.3s ease';
        form.style.outline = '3px solid var(--green)';
        setTimeout(() => {
          form.style.outline = 'none';
        }, 1200);
      }
    });
  });
});

// Keep as global fallback in case any page still has onclick="toggleMenu()"
window.toggleMenu = toggleMenu;

// --- GLOBAL DISPLAY SETTINGS ---
(function applyGlobalSettings() {
  const fitMode = sysStorage.getItem('globalImageFit') || 'cover';
  const scale = sysStorage.getItem('globalImageScale') || '1.0';
  document.documentElement.style.setProperty('--global-img-fit', fitMode);
  document.documentElement.style.setProperty('--global-img-scale', scale);
})();

// Night-mode removed: automatic time-based theme has been disabled per request.

