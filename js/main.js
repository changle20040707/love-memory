/**
 * 公共 JavaScript - 恋爱纪念网站
 */

// 全局配置
let CONFIG = null;

// 初始化应用
async function initApp() {
  try {
    // 加载配置
    CONFIG = await loadConfig();

    // 初始化音乐播放器
    initMusicPlayer();

    // 初始化爱心飘落
    initFallingHearts();

    // 初始化导航高亮
    highlightCurrentNav();

    // 更新页面标题
    updateSiteTitle();

    console.log('💕 网站初始化完成');
  } catch (error) {
    console.error('初始化失败:', error);
  }
}

// 加载配置文件
async function loadConfig() {
  try {
    const response = await fetch('data/config.json');
    if (!response.ok) throw new Error('配置文件加载失败');
    return await response.json();
  } catch (error) {
    console.error('加载配置文件失败:', error);
    return getDefaultConfig();
  }
}

// 默认配置
function getDefaultConfig() {
  return {
    couple: {
      name1: "你的名字",
      name2: "女朋友名字",
      anniversary: "2024-01-01"
    },
    backgroundMusic: "music/love-song.mp3",
    site: {
      title: "我们的爱情故事",
      subtitle: "记录每一个美好瞬间"
    }
  };
}

// 初始化音乐播放器
function initMusicPlayer() {
  const audio = new Audio();
  audio.src = CONFIG.backgroundMusic || 'music/love-song.mp3';
  audio.loop = true;
  audio.volume = 0.5;

  let isPlaying = false;

  // 创建音乐播放器按钮
  const player = document.createElement('div');
  player.className = 'music-player';
  player.innerHTML = '<span class="music-icon">🎵</span>';
  player.title = '点击播放/暂停音乐';
  document.body.appendChild(player);

  // 点击事件
  player.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      player.classList.remove('playing');
      player.querySelector('.music-icon').textContent = '🎵';
    } else {
      audio.play().then(() => {
        player.classList.add('playing');
        player.querySelector('.music-icon').textContent = '🎶';
      }).catch(err => {
        console.log('音乐播放需要用户交互:', err);
      });
    }
    isPlaying = !isPlaying;
  });

  // 存储到全局
  window.audioPlayer = { audio, player, isPlaying };
}

// 初始化爱心飘落效果
function initFallingHearts() {
  const container = document.createElement('div');
  container.className = 'falling-hearts';
  document.body.appendChild(container);

  const hearts = ['💕', '💖', '💗', '💓', '💝', '❤️', '🌹'];

  setInterval(() => {
    createHeart(container, hearts);
  }, 3000);
}

// 创建单个爱心
function createHeart(container, hearts) {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

  // 随机位置
  heart.style.left = Math.random() * 100 + 'vw';

  // 随机大小
  const size = Math.random() * 20 + 15;
  heart.style.fontSize = size + 'px';

  // 随机持续时间
  const duration = Math.random() * 3 + 4;
  heart.style.animationDuration = duration + 's';

  container.appendChild(heart);

  // 动画结束后移除
  setTimeout(() => {
    heart.remove();
  }, duration * 1000);
}

// 高亮当前导航
function highlightCurrentNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
}

// 更新网站标题
function updateSiteTitle() {
  if (CONFIG.site) {
    document.title = CONFIG.site.title + ' - ' + CONFIG.site.subtitle;
  }
}

// 计算恋爱天数
function calculateLoveDays(anniversary) {
  const anniversaryDate = new Date(anniversary);
  const today = new Date();
  const diffTime = Math.abs(today - anniversaryDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

// 计算距离下一个纪念日的天数
function daysUntilNextMemorialDay(memorialDay) {
  const today = new Date();
  const thisYear = today.getFullYear();

  let targetDate = new Date(thisYear, memorialDay.month - 1, memorialDay.day);

  // 如果今年的日期已过，计算明年的
  if (targetDate < today) {
    targetDate = new Date(thisYear + 1, memorialDay.month - 1, memorialDay.day);
  }

  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    days: diffDays,
    date: targetDate
  };
}

// 创建导航栏
function createNavbar() {
  const nav = `
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <span class="logo-icon">💕</span>
          <span>${CONFIG.site.title}</span>
        </div>
        <ul class="nav-links">
          <li><a href="index.html">首页</a></li>
          <li><a href="album.html">相册</a></li>
          <li><a href="countdown.html">纪念日</a></li>
          <li><a href="message.html">留言板</a></li>
        </ul>
      </div>
    </nav>
  `;
  return nav;
}

// 创建页脚
function createFooter() {
  const footer = `
    <footer class="footer">
      <p>用爱记录每一个美好瞬间</p>
      <div class="hearts">💕 💖 💗</div>
      <p style="margin-top: 10px; font-size: 0.9rem;">© ${new Date().getFullYear()} ${CONFIG.couple.name1} & ${CONFIG.couple.name2}</p>
    </footer>
  `;
  return footer;
}

// 显示加载动画
function showLoading() {
  const loading = document.createElement('div');
  loading.id = 'loading';
  loading.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #ffe5ec 0%, #fff5f7 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    flex-direction: column;
  `;
  loading.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 20px;">💕</div>
    <div class="loading"></div>
    <p style="margin-top: 20px; color: #ff6b9d;">加载中...</p>
  `;
  document.body.appendChild(loading);
}

// 隐藏加载动画
function hideLoading() {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.opacity = '0';
    loading.style.transition = 'opacity 0.5s';
    setTimeout(() => loading.remove(), 500);
  }
}

// 工具函数：防抖
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 工具函数：节流
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);

// 导出到全局
window.app = {
  initApp,
  loadConfig,
  calculateLoveDays,
  formatDate,
  daysUntilNextMemorialDay,
  createNavbar,
  createFooter,
  showLoading,
  hideLoading,
  debounce,
  throttle,
  get config() { return CONFIG; }
};
