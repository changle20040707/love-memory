/**
 * 留言板功能 - 恋爱纪念网站
 */

let messages = [];
const STORAGE_KEY = 'love_memory_messages';

// 初始化留言板
document.addEventListener('DOMContentLoaded', function() {
  loadMessages();
  renderMessages();
  initFormHandlers();
  initEmojiBar();
});

// 从 localStorage 加载留言
function loadMessages() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    messages = stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('加载留言失败:', error);
    messages = [];
  }
}

// 保存留言到 localStorage
function saveMessages() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('保存留言失败:', error);
    alert('保存失败，请检查浏览器存储空间');
  }
}

// 初始化表单处理
function initFormHandlers() {
  const form = document.getElementById('messageForm');
  const textarea = document.getElementById('messageTextarea');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const author = document.getElementById('authorInput').value.trim();
    const content = textarea.value.trim();

    if (!author || !content) {
      alert('请填写名字和留言内容');
      return;
    }

    // 创建新留言
    const newMessage = {
      id: Date.now(),
      author: author,
      content: content,
      timestamp: new Date().toISOString()
    };

    // 添加到留言列表
    messages.unshift(newMessage);
    saveMessages();
    renderMessages();

    // 清空表单
    form.reset();

    // 滚动到新留言
    setTimeout(() => {
      const firstMessage = document.querySelector('.message-card');
      if (firstMessage) {
        firstMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  });
}

// 初始化表情选择器
function initEmojiBar() {
  const textarea = document.getElementById('messageTextarea');
  const emojiButtons = document.querySelectorAll('.emoji-btn');

  emojiButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.dataset.emoji;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;

      // 在光标位置插入表情
      textarea.value = text.substring(0, start) + emoji + text.substring(end);
      textarea.focus();

      // 更新光标位置
      const newPosition = start + emoji.length;
      textarea.setSelectionRange(newPosition, newPosition);
    });
  });
}

// 渲染留言列表
function renderMessages() {
  const list = document.getElementById('messagesList');
  const countEl = document.getElementById('messageCount');

  // 更新留言数量
  countEl.innerHTML = `已有 <span>${messages.length}</span> 条留言`;

  // 如果没有留言
  if (messages.length === 0) {
    list.innerHTML = `
      <div class="no-messages fade-in">
        <div class="no-messages-icon">💌</div>
        <p>还没有留言</p>
        <p style="margin-top: 10px; font-size: 0.9rem;">快来写下第一条留言吧！</p>
      </div>
    `;
    return;
  }

  // 渲染留言
  list.innerHTML = messages.map((msg, index) => `
    <div class="message-card fade-in" style="animation-delay: ${index * 0.05}s" data-id="${msg.id}">
      <button class="delete-btn" onclick="deleteMessage(${msg.id})" title="删除">×</button>
      <div class="message-header">
        <div class="message-author">
          <span>💝</span>
          <span>${escapeHtml(msg.author)}</span>
        </div>
        <div class="message-time">${formatTime(msg.timestamp)}</div>
      </div>
      <div class="message-content">${escapeHtml(msg.content)}</div>
    </div>
  `).join('');
}

// 删除留言
function deleteMessage(id) {
  if (!confirm('确定要删除这条留言吗？')) {
    return;
  }

  messages = messages.filter(msg => msg.id !== id);
  saveMessages();
  renderMessages();
}

// 格式化时间
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚';
  }

  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}分钟前`;
  }

  // 小于24小时
  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
  }

  // 小于7天
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`;
  }

  // 其他显示具体日期
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

// HTML 转义，防止 XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 将删除函数暴露到全局
window.deleteMessage = deleteMessage;
