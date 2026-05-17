
// Array of local pictures extracted from project
const projectImages = [
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
        // Re-render UI with dynamic cloud values
        renderAllContent();
        loadHeroForm();
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

// Save binary data locally in IndexedDB
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

// Get binary data from IndexedDB
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
  
  // If Supabase is active, check if it's a file path to resolve from storage bucket
  if (supabase) {
    try {
      const { data } = supabase.storage.from('images').getPublicUrl(src);
      if (data && data.publicUrl) {
        const publicUrl = data.publicUrl;
        if (element) element[property] = publicUrl;
        return Promise.resolve(publicUrl);
      }
    } catch (e) {
      console.warn("Failed to get public URL from Supabase storage:", e);
    }
  }

  return getMedia(src).then(file => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      if (element) {
        element[property] = objectUrl;
      }
      return objectUrl;
    }
    if (element) element[property] = src;
    return src;
  }).catch(err => {
    if (element) element[property] = src;
    return src;
  });
}

function handleFileUpload(event, inputId) {
  const file = event.target.files[0];
  if (!file) return;
  
  const filename = file.name;
  
  // If Supabase is active, upload to Supabase Storage Bucket!
  if (supabase) {
    showToast(`Uploading "${filename}" to Supabase Cloud Storage...`);
    supabase.storage.from('images').upload(filename, file, {
      cacheControl: '3600',
      upsert: true
    }).then(({ data, error }) => {
      if (error) {
        console.error("Supabase upload error:", error);
        showToast("Cloud upload failed. Saving locally...");
        saveLocalOnly(filename, file, inputId);
      } else {
        document.getElementById(inputId).value = filename;
        updateFileLabel(inputId, filename);
        showToast(`"${filename}" uploaded successfully to Supabase!`);
        if (inputId === 'hero_photo_url') {
          highlightPicker('heroPickerGrid', filename);
        }
      }
    });
  } else {
    saveLocalOnly(filename, file, inputId);
  }
}

function saveLocalOnly(filename, file, inputId) {
  saveMedia(filename, file).then(() => {
    document.getElementById(inputId).value = filename;
    updateFileLabel(inputId, filename);
    showToast(`"${filename}" uploaded locally! Remember to commit it for GitHub.`);
    if (inputId === 'hero_photo_url') {
      highlightPicker('heroPickerGrid', filename);
    }
  }).catch(err => {
    console.error("Local save error:", err);
    showToast("Upload failed.");
  });
}

function updateFileLabel(inputId, filename) {
  let labelId = '';
  if (inputId === 'hero_photo_url') labelId = 'hero_file_label';
  if (inputId === 'post_image_url') labelId = 'post_file_label';
  if (inputId === 'event_image_url') labelId = 'event_file_label';
  if (inputId === 'gallery_image_url') labelId = 'gallery_file_label';
  if (inputId === 'video_url') labelId = 'video_file_label';
  
  if (labelId) {
    const label = document.getElementById(labelId);
    if (label) label.innerText = filename;
  }
}

// --- AUTHENTICATION MODULE ---
window.onload = function() {
  if (sessionStorage.getItem('ippad_admin_logged_in') === 'true') {
    document.getElementById('loginOverlay').style.display = 'none';
  }
  
  // Render dropdown pickers and content lists
  initPickers();
  renderAllContent();
  loadHeroForm();
  
  // Initialize Lucide icons
  if (window.lucide) lucide.createIcons();
};

function handleLogin(event) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }
  const pass = document.getElementById('password').value;
  
  if (pass === 'ippad2026') {
    try {
      sessionStorage.setItem('ippad_admin_logged_in', 'true');
    } catch(e) {
      console.warn("sessionStorage not available", e);
    }
    const overlay = document.getElementById('loginOverlay');
    if (overlay) overlay.style.display = 'none';
    if (typeof showToast === 'function') showToast("Authentication successful! Welcome to IPPAD Portal.");
  } else {
    const errorMsg = document.getElementById('errorMessage');
    if (errorMsg) errorMsg.style.display = 'block';
    
    // Shake animation
    const card = document.querySelector('.login-card');
    if (card) {
      card.style.animation = 'none';
      card.offsetHeight; // trigger reflow
      card.style.animation = 'shake 0.4s';
    }
    
    // Add custom shake keyframes if not present
    if (!document.getElementById('shake-style')) {
      const style = document.createElement('style');
      style.id = 'shake-style';
      style.innerHTML = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

function handleLogout() {
  sessionStorage.removeItem('ippad_admin_logged_in');
  document.getElementById('loginOverlay').style.display = 'flex';
  document.getElementById('password').value = '';
  document.getElementById('errorMessage').style.display = 'none';
}

// --- TAB ROUTER ---
function switchTab(tabId, btn) {
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
  document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
  
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active');
  
  if (window.lucide) lucide.createIcons();
}

// --- MOCK IMAGE PICKER GENERATOR ---
function initPickers() {
  const grids = ['heroPickerGrid', 'postPickerGrid', 'eventPickerGrid', 'galleryPickerGrid'];
  
  grids.forEach(gridId => {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    grid.innerHTML = '';
    projectImages.forEach(imgName => {
      const item = document.createElement('div');
      item.className = 'picker-item';
      item.dataset.src = imgName;
      
      const img = document.createElement('img');
      img.src = imgName;
      img.alt = imgName;
      img.loading = "lazy";
      
      item.appendChild(img);
      
      item.addEventListener('click', () => {
        // Unselect siblings
        grid.querySelectorAll('.picker-item').forEach(sib => sib.classList.remove('selected'));
        item.classList.add('selected');
        
        // Update input field
        if (gridId === 'heroPickerGrid') document.getElementById('hero_photo_url').value = imgName;
        if (gridId === 'postPickerGrid') document.getElementById('post_image_url').value = imgName;
        if (gridId === 'eventPickerGrid') document.getElementById('event_image_url').value = imgName;
        if (gridId === 'galleryPickerGrid') document.getElementById('gallery_image_url').value = imgName;
      });
      
      grid.appendChild(item);
    });
  });
}

// Highlight picker item based on value
function highlightPicker(gridId, filename) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  
  grid.querySelectorAll('.picker-item').forEach(item => {
    if (item.dataset.src === filename) {
      item.classList.add('selected');
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else {
      item.classList.remove('selected');
    }
  });
}

// --- DATA ENGINE MAPPERS ---
// --- DATA ENGINE MAPPERS ---
function loadHeroForm() {
  if (supabase) {
    supabase.from('hero_content').select('*').eq('id', 'main_hero').single().then(({ data, error }) => {
      if (data && !error) {
        document.getElementById('hero_badge').value = data.badge;
        document.getElementById('hero_title').value = data.title;
        document.getElementById('hero_motto').value = data.motto;
        document.getElementById('hero_desc').value = data.description;
        document.getElementById('hero_photo_url').value = data.photo_url;
        highlightPicker('heroPickerGrid', data.photo_url);
      }
    });
    return;
  }
  document.getElementById('hero_badge').value = localStorage.getItem('ippad_hero_badge') || '';
  document.getElementById('hero_title').value = localStorage.getItem('ippad_hero_title') || '';
  document.getElementById('hero_motto').value = localStorage.getItem('ippad_hero_motto') || '';
  document.getElementById('hero_desc').value = localStorage.getItem('ippad_hero_desc') || '';
  
  const heroPhoto = localStorage.getItem('ippad_hero_photo') || '';
  document.getElementById('hero_photo_url').value = heroPhoto;
  highlightPicker('heroPickerGrid', heroPhoto);
}

function saveHeroContent(event) {
  event.preventDefault();
  
  const badge = document.getElementById('hero_badge').value;
  const title = document.getElementById('hero_title').value;
  const motto = document.getElementById('hero_motto').value;
  const desc = document.getElementById('hero_desc').value;
  const photo = document.getElementById('hero_photo_url').value;

  if (supabase) {
    showToast("Saving to cloud database...");
    supabase.from('hero_content').upsert([{
      id: 'main_hero',
      badge,
      title,
      motto,
      description: desc,
      photo_url: photo
    }]).then(({ error }) => {
      if (error) {
        console.error(error);
        showToast("Cloud update failed.");
      } else {
        showToast("Homepage Hero Content updated on Supabase!");
      }
    });
    return;
  }

  localStorage.setItem('ippad_hero_badge', badge);
  localStorage.setItem('ippad_hero_title', title);
  localStorage.setItem('ippad_hero_motto', motto);
  localStorage.setItem('ippad_hero_desc', desc);
  localStorage.setItem('ippad_hero_photo', photo);
  showToast("Homepage Hero Content updated successfully!");
}

// Announcements (Posts)
function renderPosts() {
  const list = document.getElementById('postsList');
  list.innerHTML = '';

  const fetchAction = supabase 
    ? supabase.from('posts').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    : Promise.resolve(JSON.parse(localStorage.getItem('ippad_posts') || '[]'));

  fetchAction.then(posts => {
    if (posts.length === 0) {
      list.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 24px;">No news or announcements currently posted.</p>';
      return;
    }
    
    posts.forEach(post => {
      const row = document.createElement('div');
      row.className = 'item-row';
      
      row.innerHTML = `
        <img src="logo.jpeg" alt="Preview" class="item-preview" id="post_img_${post.id}"/>
        <div class="item-details">
          <h4>${post.title}</h4>
          <p>${post.content}</p>
          <span class="badge">${post.date}</span>
        </div>
        <button onclick="window.deletePost('${post.id}')" class="btn-danger"><i data-lucide="trash-2"></i> Delete</button>
      `;
      list.appendChild(row);
      
      const imgEl = document.getElementById(`post_img_${post.id}`);
      if (imgEl) resolveMediaSrc(imgEl, post.image);
    });
    if (window.lucide) lucide.createIcons();
  }).catch(err => {
    console.error(err);
    list.innerHTML = '<p style="color: red; text-align: center; padding: 24px;">Error fetching news.</p>';
  });
}

function handleAddPost(event) {
  event.preventDefault();
  
  const newPost = {
    id: 'post_' + Date.now(),
    title: document.getElementById('post_title').value,
    date: document.getElementById('post_date').value,
    content: document.getElementById('post_content').value,
    image: document.getElementById('post_image_url').value || 'logo.jpeg'
  };

  const addAction = supabase
    ? supabase.from('posts').insert([newPost])
    : Promise.resolve().then(() => {
        const posts = JSON.parse(localStorage.getItem('ippad_posts') || '[]');
        posts.unshift(newPost);
        localStorage.setItem('ippad_posts', JSON.stringify(posts));
      });

  addAction.then(({ error } = {}) => {
    if (error) throw error;
    closeModal('modalPost');
    renderPosts();
    showToast("Announcement added successfully!");
    event.target.reset();
    const fileLbl = document.getElementById('post_file_label');
    if (fileLbl) fileLbl.innerText = '(waiting for file...)';
    document.getElementById('modalPost').querySelectorAll('.picker-item').forEach(p => p.classList.remove('selected'));
  }).catch(err => {
    console.error(err);
    showToast("Failed to add announcement.");
  });
}

function deletePost(id) {
  const deleteAction = supabase
    ? supabase.from('posts').delete().eq('id', id)
    : Promise.resolve().then(() => {
        let posts = JSON.parse(localStorage.getItem('ippad_posts') || '[]');
        posts = posts.filter(p => p.id !== id);
        localStorage.setItem('ippad_posts', JSON.stringify(posts));
      });

  deleteAction.then(({ error } = {}) => {
    if (error) throw error;
    renderPosts();
    showToast("Announcement deleted.");
  }).catch(err => {
    console.error(err);
    showToast("Failed to delete.");
  });
}

// Event Heroes
function renderEvents() {
  const list = document.getElementById('eventsList');
  list.innerHTML = '';

  const fetchAction = supabase 
    ? supabase.from('event_heroes').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    : Promise.resolve(JSON.parse(localStorage.getItem('ippad_event_heroes') || '[]'));

  fetchAction.then(events => {
    if (events.length === 0) {
      list.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 24px;">No event heroes currently configured.</p>';
      return;
    }
    
    events.forEach(eh => {
      const row = document.createElement('div');
      row.className = 'item-row';
      
      row.innerHTML = `
        <img src="logo.jpeg" alt="Preview" class="item-preview" id="event_img_${eh.id}"/>
        <div class="item-details">
          <h4>${eh.title}</h4>
          <p>${eh.description}</p>
          <span class="badge">${eh.date}</span>
        </div>
        <button onclick="window.deleteEvent('${eh.id}')" class="btn-danger"><i data-lucide="trash-2"></i> Delete</button>
      `;
      list.appendChild(row);
      
      const imgEl = document.getElementById(`event_img_${eh.id}`);
      if (imgEl) resolveMediaSrc(imgEl, eh.image);
    });
    if (window.lucide) lucide.createIcons();
  }).catch(err => {
    console.error(err);
    list.innerHTML = '<p style="color: red; text-align: center; padding: 24px;">Error fetching events.</p>';
  });
}

function handleAddEvent(event) {
  event.preventDefault();
  
  const newEH = {
    id: 'eh_' + Date.now(),
    title: document.getElementById('event_title').value,
    date: document.getElementById('event_date').value,
    description: document.getElementById('event_desc').value,
    image: document.getElementById('event_image_url').value || 'logo.jpeg'
  };

  const addAction = supabase
    ? supabase.from('event_heroes').insert([newEH])
    : Promise.resolve().then(() => {
        const events = JSON.parse(localStorage.getItem('ippad_event_heroes') || '[]');
        events.push(newEH);
        localStorage.setItem('ippad_event_heroes', JSON.stringify(events));
      });

  addAction.then(({ error } = {}) => {
    if (error) throw error;
    closeModal('modalEvent');
    renderEvents();
    showToast("Featured Event Hero photo added!");
    event.target.reset();
    const fileLbl = document.getElementById('event_file_label');
    if (fileLbl) fileLbl.innerText = '(waiting for file...)';
    document.getElementById('modalEvent').querySelectorAll('.picker-item').forEach(p => p.classList.remove('selected'));
  }).catch(err => {
    console.error(err);
    showToast("Failed to add event hero.");
  });
}

function deleteEvent(id) {
  const deleteAction = supabase
    ? supabase.from('event_heroes').delete().eq('id', id)
    : Promise.resolve().then(() => {
        let events = JSON.parse(localStorage.getItem('ippad_event_heroes') || '[]');
        events = events.filter(e => e.id !== id);
        localStorage.setItem('ippad_event_heroes', JSON.stringify(events));
      });

  deleteAction.then(({ error } = {}) => {
    if (error) throw error;
    renderEvents();
    showToast("Event hero deleted.");
  }).catch(err => {
    console.error(err);
    showToast("Failed to delete event hero.");
  });
}

// Gallery Photos
function renderGallery() {
  const list = document.getElementById('galleryList');
  list.innerHTML = '';

  const fetchAction = supabase 
    ? supabase.from('gallery').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(item => ({ id: item.id, image_url: item.image_url }));
      })
    : Promise.resolve(JSON.parse(localStorage.getItem('ippad_gallery') || '[]').map((src, idx) => ({ id: idx, image_url: src })));

  fetchAction.then(photos => {
    if (photos.length === 0) {
      list.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 24px; grid-column: 1/-1;">No photos in the gallery.</p>';
      return;
    }
    
    photos.forEach((photo) => {
      const card = document.createElement('div');
      card.style.background = 'var(--grey)';
      card.style.border = '1px solid var(--border)';
      card.style.borderRadius = '10px';
      card.style.padding = '12px';
      card.style.textAlign = 'center';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.gap = '10px';
      card.style.alignItems = 'center';
      
      card.innerHTML = `
        <img src="logo.jpeg" alt="Gallery photo" id="gallery_img_${photo.id}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border);"/>
        <div style="font-size: 11px; color: var(--text-light); word-break: break-all; max-width: 100%; max-height: 36px; overflow: hidden;">${photo.image_url}</div>
        <button onclick="window.deleteGalleryPhoto('${photo.id}')" class="btn-danger" style="width: 100%; justify-content: center; padding: 6px 12px;"><i data-lucide="trash-2"></i> Remove</button>
      `;
      list.appendChild(card);
      
      const imgEl = document.getElementById(`gallery_img_${photo.id}`);
      if (imgEl) resolveMediaSrc(imgEl, photo.image_url);
    });
    if (window.lucide) lucide.createIcons();
  }).catch(err => {
    console.error(err);
    list.innerHTML = '<p style="color: red; text-align: center; padding: 24px; grid-column: 1/-1;">Error loading gallery.</p>';
  });
}

function handleAddGallery(event) {
  event.preventDefault();
  const url = document.getElementById('gallery_image_url').value;
  if (!url) return;

  const newPhoto = {
    id: 'gal_' + Date.now(),
    image_url: url
  };

  const addAction = supabase
    ? supabase.from('gallery').insert([newPhoto])
    : Promise.resolve().then(() => {
        const photos = JSON.parse(localStorage.getItem('ippad_gallery') || '[]');
        photos.unshift(url);
        localStorage.setItem('ippad_gallery', JSON.stringify(photos));
      });

  addAction.then(({ error } = {}) => {
    if (error) throw error;
    closeModal('modalGallery');
    renderGallery();
    showToast("Photo added to masonry gallery!");
    event.target.reset();
    const fileLbl = document.getElementById('gallery_file_label');
    if (fileLbl) fileLbl.innerText = '(waiting for file...)';
    document.getElementById('modalGallery').querySelectorAll('.picker-item').forEach(p => p.classList.remove('selected'));
  }).catch(err => {
    console.error(err);
    showToast("Failed to add photo.");
  });
}

function deleteGalleryPhoto(id) {
  const deleteAction = supabase
    ? supabase.from('gallery').delete().eq('id', id)
    : Promise.resolve().then(() => {
        const photos = JSON.parse(localStorage.getItem('ippad_gallery') || '[]');
        const index = parseInt(id);
        photos.splice(index, 1);
        localStorage.setItem('ippad_gallery', JSON.stringify(photos));
      });

  deleteAction.then(({ error } = {}) => {
    if (error) throw error;
    renderGallery();
    showToast("Photo removed from gallery.");
  }).catch(err => {
    console.error(err);
    showToast("Failed to remove photo.");
  });
}

// Video Library
function renderVideos() {
  const list = document.getElementById('videosList');
  list.innerHTML = '';

  const fetchAction = supabase 
    ? supabase.from('videos').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    : Promise.resolve(JSON.parse(localStorage.getItem('ippad_videos') || '[]'));

  fetchAction.then(videos => {
    if (videos.length === 0) {
      list.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 24px;">No videos currently in the library.</p>';
      return;
    }
    
    videos.forEach(v => {
      const row = document.createElement('div');
      row.className = 'item-row';
      
      const isYouTube = v.embed_url ? (v.embed_url.startsWith('http') || v.embed_url.includes('embed')) : (v.embedUrl.startsWith('http') || v.embedUrl.includes('embed'));
      const embedUrl = v.embed_url || v.embedUrl;

      row.innerHTML = `
        <div class="item-video-preview">
          <i data-lucide="${isYouTube ? 'play-circle' : 'video'}" style="width: 32px; height: 32px; color: var(--gold-light);"></i>
        </div>
        <div class="item-details">
          <h4>${v.title}</h4>
          <p>${v.description}</p>
          <span class="badge" style="background: var(--blue-soft); color: var(--blue); border: 1px solid var(--blue-light);">${isYouTube ? 'YouTube' : 'Device File'}</span>
        </div>
        <button onclick="window.deleteVideo('${v.id}')" class="btn-danger"><i data-lucide="trash-2"></i> Delete</button>
      `;
      list.appendChild(row);
    });
    if (window.lucide) lucide.createIcons();
  }).catch(err => {
    console.error(err);
    list.innerHTML = '<p style="color: red; text-align: center; padding: 24px;">Error fetching videos.</p>';
  });
}

function handleAddVideo(event) {
  event.preventDefault();
  let url = document.getElementById('video_url').value;
  
  if (url.includes('youtube.com/watch?v=')) {
    const id = url.split('v=')[1].split('&')[0];
    url = 'https://www.youtube.com/embed/' + id;
  } else if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1].split('?')[0];
    url = 'https://www.youtube.com/embed/' + id;
  }
  
  const newV = {
    id: 'v_' + Date.now(),
    title: document.getElementById('video_title').value,
    description: document.getElementById('video_desc').value,
    embed_url: url
  };

  const addAction = supabase
    ? supabase.from('videos').insert([newV])
    : Promise.resolve().then(() => {
        newV.embedUrl = url;
        const videos = JSON.parse(localStorage.getItem('ippad_videos') || '[]');
        videos.push(newV);
        localStorage.setItem('ippad_videos', JSON.stringify(videos));
      });

  addAction.then(({ error } = {}) => {
    if (error) throw error;
    closeModal('modalVideo');
    renderVideos();
    showToast("Video added successfully!");
    event.target.reset();
    const fileLbl = document.getElementById('video_file_label');
    if (fileLbl) fileLbl.innerText = '(waiting for file...)';
  }).catch(err => {
    console.error(err);
    showToast("Failed to add video.");
  });
}

function deleteVideo(id) {
  const deleteAction = supabase
    ? supabase.from('videos').delete().eq('id', id)
    : Promise.resolve().then(() => {
        let videos = JSON.parse(localStorage.getItem('ippad_videos') || '[]');
        videos = videos.filter(v => v.id !== id);
        localStorage.setItem('ippad_videos', JSON.stringify(videos));
      });

  deleteAction.then(({ error } = {}) => {
    if (error) throw error;
    renderVideos();
    showToast("Video deleted.");
  }).catch(err => {
    console.error(err);
    showToast("Failed to delete video.");
  });
}

// Reset Database Defaults
function resetDefaults() {
  if (confirm("WARNING: This will restore the database to its clean, initial installation states. All your added announcements, photos, and video items will be overwritten. Proceed?")) {
    localStorage.removeItem('ippad_initialized');
    localStorage.removeItem('ippad_gallery');
    localStorage.removeItem('ippad_posts');
    localStorage.removeItem('ippad_event_heroes');
    localStorage.removeItem('ippad_videos');
    localStorage.removeItem('ippad_hero_photo');
    localStorage.removeItem('ippad_hero_badge');
    localStorage.removeItem('ippad_hero_title');
    localStorage.removeItem('ippad_hero_motto');
    localStorage.removeItem('ippad_hero_desc');
    
    initSystemData();
    loadHeroForm();
    renderAllContent();
    showToast("Database restored to default values successfully!");
  }
}

function renderAllContent() {
  renderPosts();
  renderEvents();
  renderGallery();
  renderVideos();
}

// --- MODAL ENGINE CONTROLLER ---
function openModal(id) {
  document.getElementById(id).classList.add('show');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

// --- TOAST NOTIFICATIONS ---
let toastTimeout;
function showToast(text) {
  const toast = document.getElementById('toastBox');
  const toastText = document.getElementById('toastText');
  
  toastText.innerText = text;
  toast.classList.add('show');
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// Explicit global window registrations
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.switchTab = switchTab;
window.openModal = openModal;
window.closeModal = closeModal;
window.resetDefaults = resetDefaults;
window.saveHeroContent = saveHeroContent;
window.handleAddPost = handleAddPost;
window.handleAddEvent = handleAddEvent;
window.handleAddGallery = handleAddGallery;
window.handleAddVideo = handleAddVideo;
window.deletePost = deletePost;
window.deleteEvent = deleteEvent;
window.deleteGalleryPhoto = deleteGalleryPhoto;
window.deleteVideo = deleteVideo;
window.handleFileUpload = handleFileUpload;
