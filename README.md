# 💕 恋爱纪念网站

一个浪漫的恋爱纪念网站，记录你和TA的美好时光。

## 功能特点

- **首页**：恋爱天数动态计数、爱心飘落动画、爱情宣言
- **相册**：瀑布流照片展示、分类筛选、灯箱查看
- **纪念日**：倒计时、重要日期提醒、恋爱时间线
- **留言板**：互动留言、表情选择、本地存储
- **背景音乐**：全局音乐播放器

## 快速开始

### 1. 修改配置文件

编辑 `data/config.json` 文件，填入你的信息：

```json
{
  "couple": {
    "name1": "你的名字",
    "name2": "女朋友名字",
    "anniversary": "2024-01-01",  // 恋爱纪念日
    "story": "我们的爱情故事从这里开始..."
  },
  ...
}
```

### 2. 添加照片

将你们的旅游照片放入 `images/photos/` 目录，然后在 `config.json` 中添加照片信息：

```json
{
  "photos": [
    {
      "id": 1,
      "src": "images/photos/photo1.jpg",
      "title": "第一次旅行",
      "location": "杭州",
      "date": "2024-05-01",
      "description": "西湖边的美好时光",
      "category": "旅行"
    }
  ]
}
```

### 3. 添加背景音乐（可选）

将音乐文件放入 `music/` 目录，命名为 `love-song.mp3`

### 4. 本地预览

直接用浏览器打开 `index.html` 即可查看效果

## 部署到 GitHub Pages

### 方法一：使用 GitHub 网页

1. 在 GitHub 创建新仓库，如 `love-memory`
2. 点击 "uploading an existing file" 上传所有文件
3. 进入仓库 Settings → Pages
4. Source 选择 "Deploy from a branch"
5. Branch 选择 "main" + "/ (root)"
6. 点击 Save，等待部署完成
7. 访问 `https://你的用户名.github.io/love-memory/`

### 方法二：使用 Git 命令

```bash
# 进入项目目录
cd love-memory

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "💕 我们的恋爱纪念网站"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/love-memory.git

# 推送
git push -u origin main
```

然后按方法一的步骤 3-7 操作。

## 自定义主题

### 修改颜色

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

### 修改字体

在 `css/style.css` 的 `body` 样式中修改 `font-family`

## 注意事项

1. **图片格式**：建议使用 JPG 格式，压缩后上传，避免加载过慢
2. **音乐版权**：请使用无版权音乐或自己拥有的音乐
3. **留言存储**：留言使用 localStorage 存储，清除浏览器数据会丢失
4. **隐私安全**：部署到公开仓库后，网站可以被任何人访问，请勿上传私密照片

## 目录结构

```
love-memory/
├── index.html          # 首页
├── album.html          # 相册页
├── countdown.html      # 纪念日页
├── message.html        # 留言板
├── css/
│   ├── style.css       # 全局样式
│   └── animations.css  # 动画效果
├── js/
│   ├── main.js         # 公共逻辑
│   ├── album.js        # 相册功能
│   ├── countdown.js    # 倒计时功能
│   └── message.js      # 留言板功能
├── images/
│   ├── photos/         # 旅游照片
│   └── bg/             # 背景图
├── music/              # 背景音乐
└── data/
    └── config.json     # 配置数据
```

## 技术栈

- HTML5 + CSS3 + JavaScript
- 无框架依赖，纯静态网站
- 响应式设计，支持手机和电脑
- GitHub Pages 免费托管

## 许可证

MIT License

---

💕 祝你们的爱情甜甜蜜蜜！
