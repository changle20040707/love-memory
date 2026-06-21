# 💕 恋爱纪念网站

一个浪漫的恋爱纪念网站，记录你和TA的美好时光。

👉 **[在线访问](https://changle20040707.github.io/love-memory/)**

## 功能特点

- **首页**：恋爱天数动态计数、爱情故事卡片、快捷导航
- **相册**：照片网格展示、分类筛选、灯箱大图浏览
- **她的美图**：专属照片墙，展示女朋友的美照，灯箱切换浏览
- **纪念日**：倒计时、纪念日列表、恋爱时间线
- **留言板**：留言交流、46 个表情选择、Supabase 云存储
- **背景音乐**：多曲播放列表、音量控制、切歌、页面跳转记忆续播
- **视觉特效**：爱心飘落、3D 卡片倾斜、滚动动画、返回顶部、浮动装饰

## 快速开始

### 1. 修改配置文件

编辑 `data/config.json` 文件，填入你们的信息：

```json
{
  "couple": {
    "name1": "你的名字",
    "name2": "女朋友名字",
    "anniversary": "2024-01-01",
    "story": "我们的爱情故事从这里开始..."
  },
  "her": {
    "name": "女朋友名字",
    "nickname": "宝贝",
    "message": "对她的爱情寄语",
    "photos": [
      { "id": 1, "src": "images/her/photo.jpg", "title": "美照", "date": "", "description": "" }
    ]
  }
}
```

### 2. 添加照片

- **合照** → 放入 `images/photos/`，在 `config.json` 的 `photos` 中添加
- **她的美照** → 放入 `images/her/`，在 `config.json` 的 `her.photos` 中添加

### 3. 配置留言板（可选）

留言板使用 **Supabase** 云数据库存储留言，实现多人共享：

1. 打开 [supabase.com](https://supabase.com) 注册并创建项目
2. 在 SQL Editor 中运行 `data/supabase-schema.sql`
3. 将项目 URL 和 anon 密钥填入 `js/message.js` 顶部

### 4. 添加音乐

将音乐文件放入 `music/` 目录，然后在 `js/main.js` 的 `playlist` 数组中添加：

```javascript
const playlist = [
  { file: 'music/暖暖_漫漫.m4a', name: '暖暖' },
  { file: 'music/光_漫漫.m4a', name: '光' },
  // 在这里添加更多歌曲...
];
```

### 5. 本地预览

直接用浏览器打开 `index.html` 即可查看效果。或者使用 VS Code 的 Live Server。

## 部署到 GitHub Pages

```bash
cd love-memory
git init
git add .
git commit -m "💕 初始化恋爱纪念网站"
git remote add origin https://github.com/你的用户名/love-memory.git
git push -u origin main
```

然后在 GitHub 仓库 → Settings → Pages → 选择 `main` 分支 → Save。

## 目录结构

```
love-memory/
├── index.html          # 首页
├── album.html          # 相册
├── her.html            # 她的美图
├── countdown.html      # 纪念日
├── message.html        # 留言板
├── css/
│   ├── style.css       # 全局样式
│   └── animations.css  # 动画效果
├── js/
│   ├── main.js         # 公共逻辑、音乐播放器、视觉特效
│   ├── index.js        # 首页功能
│   ├── album.js        # 相册功能
│   ├── her.js          # 她的美图功能
│   ├── countdown.js    # 倒计时功能
│   └── message.js      # 留言板功能 (Supabase)
├── images/
│   ├── photos/         # 合照
│   ├── her/            # 她的美照
│   └── bg/             # 背景图
├── music/              # 背景音乐
└── data/
    ├── config.json     # 配置数据
    └── supabase-schema.sql  # 数据库建表脚本
```

## 技术栈

- HTML5 + CSS3 + JavaScript
- 无框架依赖，纯静态网站
- 响应式设计，支持手机和电脑
- **Supabase** 云数据库（留言存储）
- **GitHub Pages** 免费托管

## 自定义主题

编辑 `css/style.css` 中的 CSS 变量：

```css
:root {
  --primary-color: #ff6b9d;      /* 主色调 */
  --secondary-color: #ff8fab;    /* 次色调 */
  --accent-color: #ffb3c6;       /* 强调色 */
  --light-pink: #ffe5ec;         /* 浅粉色 */
  --dark-pink: #e91e63;          /* 深粉色 */
}
```

## 注意事项

1. **留言存储**：留言使用 Supabase 云数据库，首次使用需配置
2. **音乐版权**：请使用无版权音乐或自己拥有的音乐
3. **图片格式**：建议使用 JPG 格式，压缩后上传，避免加载过慢
4. **隐私安全**：部署到公开仓库后，网站可以被任何人访问，请勿上传私密照片

---

💕 祝你们的爱情甜甜蜜蜜！
