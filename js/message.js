/**
 * 留言板功能 - 恋爱纪念网站
 * 使用 Supabase 云数据库存储留言，实现多人共享
 */

// ==============================
// ！！！重要：请先配置 Supabase ！！！
// 按照下方步骤注册 Supabase 并获取你的项目 URL 和 anon 密钥
// 教程：https://supabase.com/dashboard 注册 -> 创建项目 -> 复制 URL 和 anon key
// ==============================

// TODO: 替换为你的 Supabase 项目信息
const SUPABASE_URL = 'https://ptcuhrkxkkmmlcqszksm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Y3Vocmt4a2ttbWxjcXN6a3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwMTQ3NTYsImV4cCI6MjA5NzU5MDc1Nn0.MkOnPz_ZEGPf7lj5l9fiJ1MK6MnPKokLF6Y4mtbUQJs';

// ==============================

const SUPABASE_API = `${SUPABASE_URL}/rest/v1`;
const SUPABASE_HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

let messages = [];

// 初始化留言板（兼容直接加载和 SPA 路由切换）
document.addEventListener('DOMContentLoaded', function() {
  initMessage();
});

// 导出初始化函数，供 SPA 路由切换后调用
function initMessage() {
  loadMessages();
  initFormHandlers();
  initEmojiBar();
}

// 从 Supabase 加载留言
async function loadMessages() {
  // 显示加载中状态
  const list = document.getElementById('messagesList');
  list.innerHTML = `
    <div class="no-messages fade-in" style="padding: 40px;">
      <div style="font-size: 2rem; margin-bottom: 15px;">⏳</div>
      <p style="color: #999;">正在加载留言...</p>
    </div>
  `;

  try {
    const response = await fetch(
      `${SUPABASE_API}/messages?select=*&order=created_at.desc`,
      { headers: SUPABASE_HEADERS }
    );

    if (!response.ok) {
      throw new Error(`加载失败 (${response.status})`);
    }

    messages = await response.json();
    renderMessages();
  } catch (error) {
    console.error('加载留言失败:', error);
    messages = [];
    renderMessages();
  }
}

// 保存留言到 Supabase
async function saveMessage(message) {
  try {
    const response = await fetch(
      `${SUPABASE_API}/messages`,
      {
        method: 'POST',
        headers: SUPABASE_HEADERS,
        body: JSON.stringify({
          author: message.author,
          content: message.content
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`保存失败 (${response.status}): ${errText}`);
    }

    // 返回新创建的留言对象（数组）
    return await response.json();
  } catch (error) {
    console.error('保存留言失败:', error);
    alert('保存失败，请检查网络连接后重试');
    return null;
  }
}

// 从 Supabase 删除留言
async function deleteMessageFromServer(id) {
  try {
    const response = await fetch(
      `${SUPABASE_API}/messages?id=eq.${id}`,
      {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`删除失败 (${response.status})`);
    }

    return true;
  } catch (error) {
    console.error('删除留言失败:', error);
    alert('删除失败，请检查网络连接');
    return false;
  }
}

// 初始化表单处理
function initFormHandlers() {
  const form = document.getElementById('messageForm');
  const textarea = document.getElementById('messageTextarea');
  const submitBtn = form.querySelector('.submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const author = document.getElementById('authorInput').value.trim();
    const content = textarea.value.trim();

    if (!author || !content) {
      alert('请填写名字和留言内容');
      return;
    }

    // 禁用提交按钮，防止重复提交
    submitBtn.disabled = true;
    submitBtn.textContent = '发送中... 💕';

    try {
      // 先保存到服务器
      const savedMessages = await saveMessage({ author, content });

      if (savedMessages && savedMessages.length > 0) {
        // 保存成功后重新从服务器加载最新留言列表
        await loadMessages();

        // 清空表单
        form.reset();

        // 滚动到顶部查看新留言
        const firstCard = document.querySelector('.message-card');
        if (firstCard) {
          firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        // 如果保存失败但没抛异常，尝试从本地重新加载
        await loadMessages();
      }
    } catch (error) {
      console.error('提交留言失败:', error);
      alert('提交失败，请稍后重试');
    } finally {
      // 恢复提交按钮
      submitBtn.disabled = false;
      submitBtn.textContent = '发送留言 💕';
    }
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
    <div class="message-card fade-in reveal tilt-card" style="animation-delay: ${index * 0.05}s" data-id="${msg.id}">
      <button class="delete-btn" onclick="deleteMessage(${msg.id})" title="删除">×</button>
      <div class="message-header">
        <div class="message-author">
          <span>💝</span>
          <span>${escapeHtml(msg.author)}</span>
        </div>
        <div class="message-time">${formatTime(msg.created_at)}</div>
      </div>
      <div class="message-content">${escapeHtml(msg.content)}</div>
    </div>
  `).join('');
}

// 删除留言（全局函数，供 onclick 调用）
async function deleteMessage(id) {
  if (!confirm('确定要删除这条留言吗？')) {
    return;
  }

  const success = await deleteMessageFromServer(id);
  if (success) {
    messages = messages.filter(msg => msg.id !== id);
    renderMessages();
  }
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
