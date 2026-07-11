<div align="center">
  <p><strong>简体中文</strong> | <a href="README_EN.md">English</a></p>
  <img src="public/moli-icon.svg" width="72" height="72" alt="墨历图标" />
  <h1>墨历</h1>
  <p><strong>专注内容，轻松制作一份排版专业的 Markdown 简历。</strong></p>
  <p>智能一页、实时分页预览、多套模板与精细排版，并可直接导出 PDF、PNG 或 HTML。</p>
  <p><a href="https://jarvanstack.github.io/markdown-to-resume/"><strong>在线体验</strong></a></p>

  <p>
    <img src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5.8" />
    <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite 7" />
    <img src="https://img.shields.io/badge/无需登录-本地存储-16803C" alt="无需登录，本地存储" />
  </p>
</div>

---

## ✨ 为什么选择墨历

墨历是一款在浏览器中运行的 Markdown 简历编辑器。无需注册账号，也无需反复调整复杂的文档格式：写下内容、选择模板与主题，即可获得所见即所得的专业简历。

|     | 能力          | 说明                                                           |
| --- | ------------- | -------------------------------------------------------------- |
| ✍️   | Markdown 编辑 | 基于 CodeMirror 的编辑体验，支持语法高亮、行号、折叠与自动换行 |
| 👀   | 实时预览      | 编辑内容和调整样式时即时刷新，并自动计算字数、阅读时间与页数   |
| 🪄   | 智能一页      | 自动优化结构间距与版面参数，在可读范围内让简历贴合一页         |
| 🧩   | 岗位模板      | 内置 18 套岗位模板，覆盖研发、产品、设计、数据、管理等方向     |
| 🎨   | 精细排版      | 内置 11 套主题，可连续调整密度、字体、字号、行高、间距与配色   |
| 🔤   | 中文字体      | 内置阿里普惠体、思源黑体、思源宋体等字体，并支持中英文混排     |
| 💾   | 自定义主题    | 可保存、重命名、导入、导出和复用自己的 CSS 主题                |
| 📄   | 多格式导出    | 支持 PDF、PNG、HTML，提供 A4 与 Letter 两种纸张尺寸            |
| 🌐   | 多语言        | 提供中英文界面及对应的简历模板                                 |
| 🔒   | 本地优先      | 简历内容和个性化设置保存在当前浏览器，不需要上传到服务器       |

## 🖼️ 界面预览

![墨历 Markdown 简历编辑器、实时预览与智能一页排版界面](https://cdn.jarvans.com/blog/202320260711212609578.png)

## 🪄 智能一页

点击“智能一页”后，墨历会根据当前纸张和实际渲染高度逐步优化版面，而不是把整份简历等比缩小：

1. 优先收紧段落、列表、标题等结构间距和页面留白。
2. 再按需调整行高、标题比例和正文字号。
3. 始终遵守可读性下限；内容确实过长时建议保留多页。
4. 内容较少时也会适度增加留白，让版面更接近撑满一页。

排版密度还提供 `0%–100%` 连续滑杆，可在智能调整后继续精细控制。

## 🚀 使用方式

1. 在左侧编辑区使用 Markdown 编写或修改简历内容。
2. 从右侧选择岗位模板、主题和纸张尺寸。
3. 点击“智能一页”自动优化排版，或手动调整密度、字体、字号、行高、页边距、章节间距和颜色。
4. 在中间预览区确认 A4 或 Letter 分页与最终效果。
5. 选择 PDF、PNG 或 HTML 格式并导出。

> [!IMPORTANT]
> 选择新的岗位模板会替换编辑器中的当前内容。首次尝试其他模板前，建议先导出或备份正在编辑的 Markdown。

> [!NOTE]
> 内容、设置和自定义主题保存在浏览器的 `localStorage` 中。清理站点数据、更换浏览器或设备时，这些数据不会自动迁移。

## ⚡ 快速开始

### 环境要求

- Node.js `20.19+` 或 `22.12+`
- npm

### 本地运行

```bash
npm install
npm run dev
```

打开终端显示的地址即可开始使用，默认通常为 `http://localhost:5173`。

### 生产构建

```bash
npm run build
npm run preview
```

## 🧱 技术栈

- **应用框架：** React 19、TypeScript、Vite
- **编辑器：** CodeMirror 6
- **Markdown：** React Markdown、Remark GFM、GitHub Markdown CSS
- **导出：** html-to-image、jsPDF
- **图标：** Lucide React
- **测试：** Vitest、Testing Library、Playwright

## ✅ 项目检查

```bash
npm run check
```

该命令会依次运行单元测试、生产构建和端到端测试。

## 🔐 隐私说明

墨历不要求登录，简历正文、编辑状态与自定义主题默认仅保存在当前浏览器。PDF、PNG 和 HTML 均在浏览器端生成并下载，项目本身不提供简历内容上传服务。
