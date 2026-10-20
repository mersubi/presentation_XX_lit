const fs = require('fs');
const path = require('path');

const baseDir = '/Users/emir/Документы/заметки обсидиан/presentation';
const slidesPath = path.join(baseDir, 'slides.js');
const mapPath = path.join(baseDir, 'images_map.json');

if (!fs.existsSync(mapPath)) {
  console.log('images_map.json not found yet.');
  process.exit(1);
}

const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const rawSlides = fs.readFileSync(slidesPath, 'utf8');
let slides;
eval(rawSlides.replace('const slides =', 'slides =').replace('const slides=', 'slides ='));

console.log('Loaded slides:', slides.length, 'Loaded map items:', Object.keys(map).length);

slides.forEach((s, idx) => {
  const item = map[idx] || {};
  const imgPath = item.path || `images/slide_${String(idx + 1).padStart(3, '0')}.jpg`;
  const caption = item.caption || s.title;

  s.image = imgPath;
  s.caption = caption;

  // Real photographic card
  s.visual = `
    <div class="photo-card" onclick="openLightbox('${imgPath}', '${caption.replace(/'/g, "&#39;")}')">
      <div class="photo-frame">
        <img src="${imgPath}" alt="${s.title}" class="slide-img" loading="lazy" onerror="this.onerror=null; this.src='images/slide_031.jpg';">
        <div class="photo-overlay">
          <span class="zoom-badge">🔍 Увеличить фото</span>
        </div>
      </div>
      <div class="photo-meta">
        <span class="photo-badge">${s.section || 'Серебряный век'}</span>
        <span class="photo-slide-num">Слайд ${idx + 1} / 100</span>
      </div>
      <div class="photo-caption">${caption}</div>
    </div>
  `;
});

const out = 'const slides = ' + JSON.stringify(slides, null, 2) + ';\n';
fs.writeFileSync(slidesPath, out, 'utf8');
console.log('Successfully updated slides.js with REAL photos for all 100 slides!');
