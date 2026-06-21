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
  // ===== 播放列表 =====
  const playlist = [
    { file: 'music/暖暖_漫漫.m4a', name: '暖暖' },
    { file: 'music/光_漫漫.m4a', name: '光' },
    { file: 'music/冬眠_漫漫.m4a', name: '冬眠' },
    { file: 'music/最后一页_漫漫.m4a', name: '最后一页' },
  ];
  let currentIndex = 0;
  let isPlaying = false;

  const audio = new Audio();
  audio.volume = 0.4;
  audio.preload = 'auto';

  // 加载当前歌曲
  function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.file;
    audio.load();
    // 更新显示的歌名
    const titleEl = document.querySelector('.music-title');
    if (titleEl) titleEl.textContent = `🎵 ${track.name}`;
  }

  // 播放下一首
  function nextTrack() {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadTrack(currentIndex);
    if (isPlaying) {
      audio.play().catch(() => {});
    }
  }

  // 播放上一首
  function prevTrack() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentIndex);
    if (isPlaying) {
      audio.play().catch(() => {});
    }
  }

  // 歌曲结束时自动下一首
  audio.addEventListener('ended', () => {
    nextTrack();
  });

  // 加载第一首
  loadTrack(0);

  // 创建播放器 UI
  const player = document.createElement('div');
  player.className = 'music-player';
  player.innerHTML = `
    <div class="music-info">
      <span class="music-title">🎵 ${playlist[0].name}</span>
      <div class="volume-control">
        <span class="volume-icon" id="volumeIcon">🔊</span>
        <input type="range" class="volume-slider" id="volumeSlider" min="0" max="1" step="0.05" value="0.4">
      </div>
      <button class="skip-btn" id="skipBtn" title="下一首">⏭️</button>
    </div>
    <div class="music-btn" title="点击播放/暂停背景音乐">
      <span class="music-icon">🎵</span>
    </div>
  `;
  document.body.appendChild(player);

  // 获取元素
  const musicBtn = player.querySelector('.music-btn');
  const musicIcon = player.querySelector('.music-icon');
  const musicTitle = player.querySelector('.music-title');
  const volumeSlider = player.querySelector('#volumeSlider');
  const volumeIcon = player.querySelector('#volumeIcon');
  const skipBtn = player.querySelector('#skipBtn');

  // 播放/暂停切换
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlay();
  });

  // 点击信息区域不触发播放切换
  player.querySelector('.music-info').addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // 切歌按钮
  skipBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nextTrack();
  });

  // 双击歌名切上一首
  musicTitle.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    prevTrack();
  });

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      player.classList.remove('playing');
      musicIcon.textContent = '🎵';
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          player.classList.add('playing');
          musicIcon.textContent = '🎶';
        }).catch(err => {
          console.log('需要用户交互才能播放音乐:', err);
        });
      }
    }
    isPlaying = !isPlaying;
  }

  // 音量控制
  volumeSlider.addEventListener('input', () => {
    audio.volume = parseFloat(volumeSlider.value);
    updateVolumeIcon();
  });

  function updateVolumeIcon() {
    const vol = audio.volume;
    if (vol === 0) volumeIcon.textContent = '🔇';
    else if (vol < 0.3) volumeIcon.textContent = '🔈';
    else if (vol < 0.7) volumeIcon.textContent = '🔉';
    else volumeIcon.textContent = '🔊';
  }

  let prevVolume = 0.4;
  volumeIcon.addEventListener('click', () => {
    if (audio.volume > 0) {
      prevVolume = audio.volume;
      audio.volume = 0;
      volumeSlider.value = 0;
    } else {
      audio.volume = prevVolume;
      volumeSlider.value = prevVolume;
    }
    updateVolumeIcon();
  });

  // 加载失败提示
  audio.addEventListener('error', () => {
    musicTitle.textContent = '⚠️ 加载失败';
  });

  // 自动尝试播放
  setTimeout(() => {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        player.classList.add('playing');
        musicIcon.textContent = '🎶';
        isPlaying = true;
      }).catch(() => {});
    }
  }, 1000);

  // 用户点击页面时自动播放
  document.addEventListener('click', function autoPlayHandler() {
    if (!isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          player.classList.add('playing');
          musicIcon.textContent = '🎶';
          isPlaying = true;
        }).catch(() => {});
      }
    }
    document.removeEventListener('click', autoPlayHandler);
  }, { once: true });

  // 存储到全局
  window.audioPlayer = { audio, player, isPlaying, togglePlay, nextTrack, prevTrack };
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
document.addEventListener('DOMContentLoaded', function() {
  initApp();
  initRouter();
});

// ============================================
// SPA 路由 - 页面切换时保持音乐持续播放
// ============================================

// 页面初始化映射
const PAGE_INIT = {
  'index.html':    { fn: 'initIndex' },
  'album.html':    { fn: 'initAlbum' },
  'countdown.html': { fn: 'initCountdown' },
  'message.html':  { fn: 'initMessage' },
};

// 当前页面
let currentPage = 'index.html';

// 初始化 SPA 路由
function initRouter() {
  // 监听所有导航点击
  document.addEventListener('click', async (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    // 只拦截 .html 的内部链接
    if (!href || !href.endsWith('.html') || href.startsWith('http') || href.startsWith('https')) return;

    e.preventDefault();
    await navigateTo(href);
  });

  // 监听浏览器前进/后退
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) {
      navigateTo(e.state.page, true);
    }
  });

  // 记录初始页面
  const path = window.location.pathname.split('/').pop() || 'index.html';
  currentPage = path;
  history.replaceState({ page: currentPage }, '', currentPage);
}

// 切换到目标页面
async function navigateTo(page, isPopState = false) {
  if (page === currentPage) return;

  try {
    // 1. 获取目标页面 HTML
    const response = await fetch(page);
    if (!response.ok) throw new Error(`加载失败: ${response.status}`);
    const html = await response.text();

    // 2. 用 DOMParser 解析 HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 3. 提取 <main> 内容（包含页面专属样式）
    const newMain = doc.querySelector('main.main-content');
    if (!newMain) throw new Error('未找到主内容区域');

    // 4. 替换当前页面内容
    const currentMain = document.querySelector('main.main-content');
    currentMain.innerHTML = newMain.innerHTML;

    // 5. 更新页面标题
    document.title = doc.title;

    // 6. 更新浏览器历史记录
    if (!isPopState) {
      history.pushState({ page }, '', page);
    }
    currentPage = page;

    // 7. 更新导航高亮
    updateActiveNav(page);

    // 8. 重新初始化页面功能
    const pageConfig = PAGE_INIT[page];
    if (pageConfig) {
      // 等待 DOM 更新完成
      await new Promise(resolve => setTimeout(resolve, 50));
      const fn = window[pageConfig.fn];
      if (typeof fn === 'function') {
        fn();
      }
    }

    // 9. 重新触发淡入动画
    document.querySelectorAll('.fade-in').forEach((el, i) => {
      el.style.animation = 'none';
      el.offsetHeight; // 触发回流
      el.style.animation = `fadeIn 0.6s ease-out ${i * 0.1}s forwards`;
      el.style.opacity = '0';
    });

  } catch (error) {
    console.error('页面切换失败:', error);
    // 如果 SPA 切换失败，回退到直接跳转
    window.location.href = page;
  }
}

// 更新导航高亮
function updateActiveNav(page) {
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

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
