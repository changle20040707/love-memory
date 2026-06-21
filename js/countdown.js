/**
 * 纪念日功能 - 恋爱纪念网站
 */

let memorialDays = [];
let nextMemorial = null;
let countdownInterval = null;
window.countdownInterval = null;

// 初始化纪念日页面（兼容直接加载和 SPA 路由切换）
document.addEventListener('DOMContentLoaded', function() {
  initCountdown();
});

function initCountdown() {
  // 确认当前是纪念日页面
  if (!document.getElementById('countdownDisplay')) return;
  // 等待配置加载
  if (!window.app || !window.app.config) {
    setTimeout(initCountdown, 100);
    return;
  }
  const config = window.app.config;
  memorialDays = config.memorialDays || [];

  if (memorialDays.length === 0) {
    document.getElementById('memorialGrid').innerHTML = `
      <div class="no-photos">
        <div class="no-photos-icon">📅</div>
        <p>暂无纪念日</p>
        <p style="margin-top: 10px; font-size: 0.9rem;">请在 data/config.json 中添加纪念日信息</p>
      </div>
    `;
    return;
  }

  findNextMemorial();
  renderMemorialCards();
  renderTimeline();
  startCountdown();
}

// 找到下一个纪念日
function findNextMemorial() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingDays = memorialDays.map(memorial => {
    const thisYear = today.getFullYear();
    let targetDate = new Date(thisYear, memorial.month - 1, memorial.day);

    // 如果今年的日期已过，使用明年的日期
    if (targetDate <= today) {
      targetDate = new Date(thisYear + 1, memorial.month - 1, memorial.day);
    }

    const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

    return {
      ...memorial,
      targetDate,
      diffDays
    };
  });

  // 按距离天数排序，找到最近的一个
  upcomingDays.sort((a, b) => a.diffDays - b.diffDays);
  nextMemorial = upcomingDays[0];

  // 更新显示
  document.getElementById('nextMemorialName').textContent = nextMemorial.name;
  const formattedDate = formatFullDate(nextMemorial.targetDate);
  document.getElementById('nextMemorialDate').textContent = `${formattedDate}`;
}

// 开始倒计时
function startCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
  // 暴露到全局供 SPA 路由清理
  window.countdownInterval = countdownInterval;
}

// 更新倒计时
function updateCountdown() {
  if (!nextMemorial) return;

  const now = new Date();
  const target = nextMemorial.targetDate;

  const diff = target - now;

  if (diff <= 0) {
    // 到达纪念日，重新查找下一个
    findNextMemorial();
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('daysCount').textContent = String(days).padStart(2, '0');
  document.getElementById('hoursCount').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutesCount').textContent = String(minutes).padStart(2, '0');
  document.getElementById('secondsCount').textContent = String(seconds).padStart(2, '0');
}

// 渲染纪念日卡片
function renderMemorialCards() {
  const grid = document.getElementById('memorialGrid');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cardsHTML = memorialDays.map(memorial => {
    const thisYear = today.getFullYear();
    let targetDate = new Date(thisYear, memorial.month - 1, memorial.day);

    if (targetDate <= today) {
      targetDate = new Date(thisYear + 1, memorial.month - 1, memorial.day);
    }

    const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    const formattedDate = formatDateCN(memorial.month, memorial.day);

    const isSoon = diffDays <= 30;

    return `
      <div class="memorial-card fade-in reveal tilt-card">
        <div class="memorial-card-header">
          <span class="memorial-card-name">${memorial.name}</span>
          <span class="memorial-card-badge ${isSoon ? 'soon' : ''}">
            ${diffDays === 0 ? '今天' : `${diffDays}天后`}
          </span>
        </div>
        <div class="memorial-card-date">
          <span>📅</span>
          <span>${formattedDate}</span>
        </div>
        <div class="memorial-card-countdown">
          ${diffDays === 0 ? '🎉 今天就是特别的日子！' : `还有 ${diffDays} 天`}
        </div>
      </div>
    `;
  }).join('');

  grid.innerHTML = cardsHTML;
}

// 渲染时间线
function renderTimeline() {
  const config = window.app.config;
  const timeline = document.getElementById('timeline');

  // 从配置中获取恋爱开始日期
  const anniversary = new Date(config.couple.anniversary);
  const today = new Date();

  // 生成每年的纪念日时间线
  const timelineItems = [];
  let year = anniversary.getFullYear();

  while (year <= today.getFullYear()) {
    const date = new Date(year, anniversary.getMonth(), anniversary.getDate());
    if (date <= today) {
      const yearCount = year - anniversary.getFullYear();
      let eventText = '';

      if (yearCount === 0) {
        eventText = '我们在一起了 💕';
      } else if (yearCount === 1) {
        eventText = '一周年纪念 🎂';
      } else {
        eventText = `${yearCount}周年纪念 💝`;
      }

      timelineItems.push({
        date: formatDateCN(date.getMonth() + 1, date.getDate()) + ` ${year}年`,
        event: eventText
      });
    }
    year++;
  }

  // 反转时间线，最新的在上面
  timelineItems.reverse();

  const timelineHTML = timelineItems.map((item, index) => `
    <div class="timeline-item fade-in" style="animation-delay: ${index * 0.1}s">
      <div class="timeline-content">
        <div class="timeline-date">${item.date}</div>
        <div class="timeline-event">${item.event}</div>
      </div>
      <div class="timeline-dot"></div>
    </div>
  `).join('');

  timeline.innerHTML = timelineHTML;
}

// 格式化日期（中文）
function formatDateCN(month, day) {
  return `${month}月${day}日`;
}

// 格式化完整日期
function formatFullDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

// 页面卸载时清除定时器
window.addEventListener('beforeunload', () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
