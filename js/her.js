/**
 * 她的美图 - 恋爱纪念网站
 */

let herPhotos = [];
let currentPhotoIndex = 0;
let herLightboxInitialized = false;

// 初始化页面（兼容直接加载和 SPA 路由切换）
document.addEventListener('DOMContentLoaded', function() {
  initHer();
});

function initHer() {
  // 确认当前是 her 页面（有 her 页面的专属元素）
  if (!document.getElementById('herGrid')) return;

  // 等待配置加载
  if (!window.app || !window.app.config) {
    setTimeout(initHer, 100);
    return;
  }

  const config = window.app.config;

  // 如果配置中缺少 her 数据，尝试重新加载配置
  if (!config.her) {
    // 尝试直接从文件重新加载配置
    fetch('data/config.json?' + Date.now())
      .then(r => r.json())
      .then(data => {
        // 更新全局配置
        if (window.app && window.app._setConfig) {
          window.app._setConfig(data);
        } else {
          // 直接替换内存中的 config
          const keys = Object.keys(data);
          keys.forEach(k => { config[k] = data[k]; });
        }
        // 重新初始化
        setTimeout(initHer, 50);
      })
      .catch(() => {
        // 重试一次
        setTimeout(initHer, 500);
      });
    return;
  }

  const herConfig = config.her || {};

  // 更新她的信息
  const nameEl = document.getElementById('herName');
  if (nameEl && herConfig.name) nameEl.textContent = herConfig.name;

  const nickEl = document.getElementById('herNickname');
  if (nickEl && herConfig.nickname) nickEl.textContent = herConfig.nickname;

  const quoteEl = document.getElementById('herQuoteText');
  if (quoteEl && herConfig.message) quoteEl.textContent = herConfig.message;

  // 加载照片
  herPhotos = herConfig.photos || [];
  renderHerPhotos();

  // 初始化灯箱（只绑定一次事件）
  if (!herLightboxInitialized) {
    initHerLightbox();
    herLightboxInitialized = true;
  }
}

// 渲染照片
function renderHerPhotos() {
  const grid = document.getElementById('herGrid');
  const countEl = document.getElementById('herPhotoCount');
  if (!grid || !countEl) return;

  countEl.textContent = herPhotos.length;

  if (herPhotos.length === 0) {
    grid.innerHTML = `
      <div class="her-empty" style="grid-column: 1 / -1;">
        <div class="her-empty-icon">📸</div>
        <p>还没有添加照片哦</p>
        <p style="margin-top: 10px; font-size: 0.9rem;">
          请在 <code style="background: #ffe5ec; padding: 2px 8px; border-radius: 4px;">data/config.json</code>
          中的 <code style="background: #ffe5ec; padding: 2px 8px; border-radius: 4px;">her.photos</code> 添加照片
        </p>
      </div>
    `;
    return;
  }

  grid.innerHTML = herPhotos.map((photo, index) => `
    <div class="her-item fade-in reveal tilt-card" data-index="${index}" style="animation-delay: ${index * 0.06}s">
      <div class="photo-wrapper">
        <img src="${photo.src}" alt="${photo.title || ''}"
          onerror="this.parentElement.innerHTML='<div style=height:100%;display:flex;align-items:center;justify-content:center;background:#ffe5ec;font-size:3rem;>📸</div>'">
        <div class="photo-overlay">
          <span class="photo-overlay-icon">🔍</span>
        </div>
      </div>
      <div class="photo-info">
        <div class="photo-title">${photo.title || '美照'}</div>
        ${photo.date ? `<div class="photo-meta">📅 ${formatHerDate(photo.date)}</div>` : ''}
        ${photo.description ? `<div class="photo-desc">${photo.description}</div>` : ''}
      </div>
    </div>
  `).join('');

  // 强制加载图片（解决 SPA 切换后图片不加载的问题）
  grid.querySelectorAll('img').forEach(img => {
    // 如果图片还没开始加载，强制触发
    if (!img.complete) {
      img.loading = 'eager';
      // 重新设置 src 触发加载
      const src = img.src;
      img.src = '';
      img.src = src;
    }
  });

  // 添加点击事件
  document.querySelectorAll('.her-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index);
      openHerLightbox(index);
    });
  });
}

// 初始化灯箱
function initHerLightbox() {
  const lightbox = document.getElementById('herLightbox');
  if (!lightbox) return;

  const closeBtn = document.getElementById('herLightboxClose');
  const prevBtn = document.getElementById('herLightboxPrev');
  const nextBtn = document.getElementById('herLightboxNext');

  if (closeBtn) closeBtn.addEventListener('click', closeHerLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrevHerPhoto);
  if (nextBtn) nextBtn.addEventListener('click', showNextHerPhoto);

  // 点击背景关闭
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeHerLightbox();
  });

  // 键盘导航（只绑定一次）
  document.addEventListener('keydown', function herKeyHandler(e) {
    if (!document.getElementById('herLightbox')?.classList.contains('active')) return;
    if (e.key === 'Escape') closeHerLightbox();
    if (e.key === 'ArrowLeft') showPrevHerPhoto();
    if (e.key === 'ArrowRight') showNextHerPhoto();
  });
}

// 打开灯箱
function openHerLightbox(index) {
  const photo = herPhotos[index];
  if (!photo) return;

  currentPhotoIndex = index;
  const lightbox = document.getElementById('herLightbox');
  const img = document.getElementById('herLightboxImg');
  const title = document.getElementById('herLightboxTitle');
  const desc = document.getElementById('herLightboxDesc');
  if (!lightbox || !img) return;

  img.src = photo.src;
  img.alt = photo.title || '';
  if (title) title.textContent = photo.title || '';
  if (desc) desc.textContent = photo.description || '';

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// 关闭灯箱
function closeHerLightbox() {
  const lightbox = document.getElementById('herLightbox');
  if (lightbox) lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// 上一张
function showPrevHerPhoto() {
  if (herPhotos.length === 0) return;
  currentPhotoIndex = (currentPhotoIndex - 1 + herPhotos.length) % herPhotos.length;
  openHerLightbox(currentPhotoIndex);
}

// 下一张
function showNextHerPhoto() {
  if (herPhotos.length === 0) return;
  currentPhotoIndex = (currentPhotoIndex + 1) % herPhotos.length;
  openHerLightbox(currentPhotoIndex);
}

// 格式化日期
function formatHerDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

// 暴露到全局供 SPA 路由调用
window.initHer = initHer;
