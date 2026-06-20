/**
 * 相册功能 - 恋爱纪念网站
 */

let allPhotos = [];
let currentPhotoIndex = 0;
let currentImageIndex = 0;
let filteredPhotos = [];

// 初始化相册
document.addEventListener('DOMContentLoaded', function() {
  // 等待配置加载
  const checkConfig = setInterval(() => {
    if (window.app && window.app.config) {
      clearInterval(checkConfig);
      initAlbum();
    }
  }, 100);
});

function initAlbum() {
  const config = window.app.config;
  allPhotos = config.photos || [];
  filteredPhotos = [...allPhotos];

  renderPhotos();
  initFilters();
  initLightbox();
}

// 获取照片的图片列表（兼容旧版单张 src 和新增的 images 数组）
function getPhotoImages(photo) {
  if (photo.images && Array.isArray(photo.images) && photo.images.length > 0) {
    return photo.images;
  }
  if (photo.src) {
    return [photo.src];
  }
  return [];
}

// 渲染照片
function renderPhotos() {
  const grid = document.getElementById('photoGrid');

  if (filteredPhotos.length === 0) {
    grid.innerHTML = `
      <div class="no-photos">
        <div class="no-photos-icon">📸</div>
        <p>暂无照片</p>
        <p style="margin-top: 10px; font-size: 0.9rem;">请在 data/config.json 中添加照片信息</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredPhotos.map((photo, index) => {
    const images = getPhotoImages(photo);
    const thumbSrc = images[0];
    const imageCount = images.length;

    return `
    <div class="photo-item fade-in" data-index="${index}" style="animation-delay: ${index * 0.1}s">
      <img src="${thumbSrc}" alt="${photo.title}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 250%22><rect fill=%22%23ffe5ec%22 width=%22300%22 height=%22250%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23ff6b9d%22 font-size=%2240%22>📷</text></svg>'">
      ${imageCount > 1 ? `<div class="photo-badge">${imageCount}张</div>` : ''}
      <div class="photo-overlay">
        <span class="photo-overlay-icon">🔍</span>
      </div>
      <div class="photo-info">
        <h3 class="photo-title">${photo.title}</h3>
        <div class="photo-meta">
          <span>📍 ${photo.location}</span>
          <span>📅 ${formatDate(photo.date)}</span>
        </div>
        <p class="photo-desc">${photo.description}</p>
      </div>
    </div>
  `}).join('');

  // 添加点击事件
  document.querySelectorAll('.photo-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index);
      openLightbox(index);
    });
  });
}

// 初始化筛选器
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 更新按钮状态
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // 筛选照片
      const category = btn.dataset.category;
      if (category === 'all') {
        filteredPhotos = [...allPhotos];
      } else {
        filteredPhotos = allPhotos.filter(photo => photo.category === category);
      }

      renderPhotos();
    });
  });
}

// 初始化灯箱
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  // 关闭灯箱
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // 上一张
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPreviousPhoto();
  });

  // 下一张
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextPhoto();
  });

  // 键盘控制
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPreviousPhoto();
    } else if (e.key === 'ArrowRight') {
      showNextPhoto();
    }
  });
}

// 打开灯箱
function openLightbox(index) {
  currentPhotoIndex = index;
  currentImageIndex = 0;
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateLightboxContent();
  updateLightboxNav();
}

// 关闭灯箱
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// 更新灯箱导航按钮状态
function updateLightboxNav() {
  const photo = filteredPhotos[currentPhotoIndex];
  const images = getPhotoImages(photo);

  document.getElementById('lightboxPrev').style.display = images.length > 1 || filteredPhotos.length > 1 ? '' : 'none';
  document.getElementById('lightboxNext').style.display = images.length > 1 || filteredPhotos.length > 1 ? '' : 'none';
}

// 更新灯箱内容
function updateLightboxContent() {
  const photo = filteredPhotos[currentPhotoIndex];
  const images = getPhotoImages(photo);
  const totalImages = images.length;

  document.getElementById('lightboxImg').src = images[currentImageIndex];
  document.getElementById('lightboxTitle').textContent = photo.title;
  document.getElementById('lightboxMeta').innerHTML = `
    📍 ${photo.location} &nbsp;|&nbsp; 📅 ${formatDate(photo.date)}
    ${totalImages > 1 ? `&nbsp;|&nbsp; 🖼 ${currentImageIndex + 1}/${totalImages}` : ''}
  `;
  document.getElementById('lightboxDesc').textContent = photo.description;
}

// 上一张（先切换同板块内的图片，再切换到上一个板块）
function showPreviousPhoto() {
  const photo = filteredPhotos[currentPhotoIndex];
  const images = getPhotoImages(photo);

  if (currentImageIndex > 0) {
    currentImageIndex--;
  } else {
    currentPhotoIndex = (currentPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    const prevPhoto = filteredPhotos[currentPhotoIndex];
    const prevImages = getPhotoImages(prevPhoto);
    currentImageIndex = prevImages.length - 1;
  }
  updateLightboxContent();
  updateLightboxNav();
}

// 下一张（先切换同板块内的图片，再切换到下一个板块）
function showNextPhoto() {
  const photo = filteredPhotos[currentPhotoIndex];
  const images = getPhotoImages(photo);

  if (currentImageIndex < images.length - 1) {
    currentImageIndex++;
  } else {
    currentPhotoIndex = (currentPhotoIndex + 1) % filteredPhotos.length;
    currentImageIndex = 0;
  }
  updateLightboxContent();
  updateLightboxNav();
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
