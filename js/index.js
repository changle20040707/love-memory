/**
 * 首页功能 - 恋爱纪念网站
 */

// 初始化首页（兼容直接加载和 SPA 路由切换）
document.addEventListener('DOMContentLoaded', function() {
  initIndex();
});

function initIndex() {
  // 确认当前是首页
  if (!document.getElementById('loveDays')) return;
  // 等待配置加载
  if (!window.app || !window.app.config) {
    setTimeout(initIndex, 100);
    return;
  }
  updateHomePage();
}

function updateHomePage() {
  const config = window.app.config;

  // 更新情侣名字
  document.getElementById('name1').textContent = config.couple.name1;
  document.getElementById('name2').textContent = config.couple.name2;

  // 计算并更新恋爱天数
  const loveDays = window.app.calculateLoveDays(config.couple.anniversary);
  animateNumber('loveDays', loveDays);

  // 更新纪念日日期
  const formattedDate = window.app.formatDate(config.couple.anniversary);
  document.getElementById('anniversaryDate').textContent = `从 ${formattedDate} 开始`;

  // 更新爱情宣言
  if (config.couple.story) {
    document.getElementById('storyText').textContent = config.couple.story;
  }
}

// 数字动画效果
function animateNumber(elementId, targetNumber) {
  const element = document.getElementById(elementId);
  const duration = 2000;
  const steps = 60;
  const stepTime = duration / steps;
  const stepValue = targetNumber / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += stepValue;
    if (current >= targetNumber) {
      element.textContent = targetNumber;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, stepTime);
}
