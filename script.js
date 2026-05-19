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

let supabase = null;

// Initialize Supabase dynamically and wait for the library to be ready
function initSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  
  const tryInit = () => {
    const lib = window.supabase;
    if (lib && typeof lib.createClient === 'function') {
      try {
        supabase = lib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
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

  // Directly assign local relative files to bypass probe/Supabase fallbacks
  if (src.startsWith('WhatsApp Image') || src === 'logo.jpeg') {
    if (element) element[property] = src;
    return Promise.resolve(src);
  }

  // 1. Try the local relative path first — works when files exist in the project folder
  return new Promise((resolve) => {
    const probe = new Image();
    probe.onload = () => {
      if (element) element[property] = src;
      resolve(src);
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
        if (supabase) {
          try {
            const { data } = supabase.storage.from('images').getPublicUrl(src);
            if (data && data.publicUrl) {
              if (element) element[property] = data.publicUrl;
              resolve(data.publicUrl);
              return;
            }
          } catch (e) {
            console.warn("Supabase URL resolution failed:", e);
          }
        }
        // Final fallback: use the raw src
        if (element) element[property] = src;
        resolve(src);
      }).catch(() => {
        if (element) element[property] = src;
        resolve(src);
      });
    };
    probe.src = src;
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

// All Gallery Images (Default Fallback)
const defaultGalleryImages = [
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

// Initialize dynamic system data if not already set
function initSystemData() {
  if (!sysStorage.getItem('ippad_initialized_v3')) {
    sysStorage.setItem('ippad_hero_photo', 'WhatsApp Image 2026-05-07 at 1.27.03 PM.jpeg');
    sysStorage.setItem('ippad_hero_badge', 'Different Faiths, One Humanity');
    sysStorage.setItem('ippad_hero_title', 'Imams & Pastors<br/><em>Interfaith Forum</em><br/>for Peace & Development');
    sysStorage.setItem('ippad_hero_motto', 'IPPAD — Different Faiths, One Humanity');
    sysStorage.setItem('ippad_hero_desc', 'A faith-based, non-partisan platform uniting Muslim and Christian leaders to build peaceful, healthy, and resilient communities across Nigeria — through structured dialogue, trauma healing, and measurable community action.');
    
    // Default posts
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
    sysStorage.setItem('ippad_posts', JSON.stringify(defaultPosts));

    // Default Event Hero Photos
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
    sysStorage.setItem('ippad_event_heroes', JSON.stringify(defaultEventHeroes));

    // Default Videos
    const defaultVideos = [
      {
        id: "v_1",
        title: "IPPAD Interfaith Peace Summit Highlights",
        description: "Key moments and statements from executive leadership and community champions at the Abuja summit.",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      },
      {
        id: "v_2",
        title: "Community Cohesion & Dialogue in Middle Belt",
        description: "An look inside the village mediation committees resolving conflicts in agricultural communities.",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      }
    ];
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
  if (supabase) {
    return supabase.from('hero_content').select('*').eq('id', 'main_hero').single().then(({ data, error }) => {
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

function getPostsList() {
  if (supabase) {
    return supabase.from('posts').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (error) throw error;
      if (!data || data.length === 0) {
        return JSON.parse(sysStorage.getItem('ippad_posts') || '[]');
      }
      return data;
    }).catch(err => {
      console.warn("Supabase fetch posts failed, fallback to local storage:", err);
      return JSON.parse(sysStorage.getItem('ippad_posts') || '[]');
    });
  }
  return Promise.resolve(JSON.parse(sysStorage.getItem('ippad_posts') || '[]'));
}

function getEventHeroesList() {
  if (supabase) {
    return supabase.from('event_heroes').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (error) throw error;
      if (!data || data.length === 0) {
        return JSON.parse(sysStorage.getItem('ippad_event_heroes') || '[]');
      }
      return data;
    }).catch(err => {
      console.warn("Supabase fetch event heroes failed, fallback to local storage:", err);
      return JSON.parse(sysStorage.getItem('ippad_event_heroes') || '[]');
    });
  }
  return Promise.resolve(JSON.parse(sysStorage.getItem('ippad_event_heroes') || '[]'));
}

function safeGetLocalGallery() {
  try {
    const val = sysStorage.getItem('ippad_gallery');
    if (!val || val === 'undefined') return defaultGalleryImages || [];
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : (defaultGalleryImages || []);
  } catch(e) {
    return defaultGalleryImages || [];
  }
}

function getGalleryPhotosList() {
  if (supabase) {
    return supabase.from('gallery').select('*').then(({ data, error }) => {
      if (error) throw error;
      const cloudUrls = (data || []).map(item => item.image_url);
      
      // Combine new cloud photos with old local GitHub photos
      return [...cloudUrls, ...(defaultGalleryImages || [])];
    }).catch(err => {
      console.warn("Supabase fetch gallery failed, fallback to local storage:", err);
      return safeGetLocalGallery();
    });
  }
  return Promise.resolve(safeGetLocalGallery());
}

function getVideosList() {
  if (supabase) {
    return supabase.from('videos').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (error) throw error;
      if (!data || data.length === 0) {
        return JSON.parse(sysStorage.getItem('ippad_videos') || '[]');
      }
      return data.map(v => ({
        id: v.id,
        title: v.title,
        description: v.description,
        embedUrl: v.embed_url
      }));
    }).catch(err => {
      console.warn("Supabase fetch videos failed, fallback to local storage:", err);
      return JSON.parse(sysStorage.getItem('ippad_videos') || '[]');
    });
  }
  return Promise.resolve(JSON.parse(sysStorage.getItem('ippad_videos') || '[]'));
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
    const BATCH_SIZE = 15;
    let currentIndex = 0;

    function renderBatch() {
      const nextBatch = galleryImages.slice(currentIndex, currentIndex + BATCH_SIZE);
      
      nextBatch.forEach(src => {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'dynamic-gallery-item';

        const img = document.createElement('img');
        img.src = 'logo.jpeg';
        img.alt = "IPPAD Event Photo";
        img.loading = "lazy";
        
        resolveMediaSrc(img, src);

        imgWrap.appendChild(img);
        dynamicGallery.appendChild(imgWrap);
      });

      currentIndex += BATCH_SIZE;

      if (btnLoadMore && paginationContainer) {
        if (currentIndex >= galleryImages.length) {
          paginationContainer.style.display = 'none';
        } else {
          paginationContainer.style.display = 'flex';
        }
      }
      triggerAnimationsReveal();
    }

    dynamicGallery.innerHTML = '';
    if (galleryImages.length > 0) {
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

// Populate Gallery, Videos, Posts, bind hamburger
document.addEventListener('DOMContentLoaded', () => {
  initLiveUpdates();

  // Apply dark mode immediately on DOM ready
  applyTimeBasedTheme();

  // Bind hamburger buttons via JS (reliable on all hosts — no inline onclick needed)
  document.querySelectorAll('.hamburger').forEach(btn => {
    btn.addEventListener('click', toggleMenu);
  });
});

// Keep as global fallback in case any page still has onclick="toggleMenu()"
window.toggleMenu = toggleMenu;

// --- DYNAMIC DARK MODE ---
function applyTimeBasedTheme() {
  const hour = new Date().getHours();
  // Dark mode between 18:00 (6 PM) and 6:00 (6 AM)
  if (hour >= 18 || hour < 6) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}
// Run on interval to keep theme in sync (initial call moved to DOMContentLoaded)
setInterval(applyTimeBasedTheme, 60000);
