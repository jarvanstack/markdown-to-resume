<div align="center">
  <p><a href="README.md">简体中文</a> | <strong>English</strong></p>
  <img src="public/moli-icon.svg" width="72" height="72" alt="Moli logo" />
  <h1>Moli</h1>
  <p><strong>Focus on your story and turn Markdown into a polished resume.</strong></p>
  <p>Live preview, role-specific templates, flexible styling, and one-click export to PDF, PNG, or HTML.</p>
  <p><a href="https://jarvanstack.github.io/markdown-to-resume/"><strong>Live Demo</strong></a></p>

  <p>
    <img src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5.8" />
    <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite 7" />
    <img src="https://img.shields.io/badge/No_sign--in-Local_storage-16803C" alt="No sign-in, local storage" />
  </p>
</div>

---

## ✨ Why Moli

Moli is a browser-based Markdown resume editor. There is no account to create and no document formatting to wrestle with: write your content, choose a template and theme, and see a professional resume take shape in real time.

|     | Feature          | What it offers                                                                                 |
| --- | ---------------- | ---------------------------------------------------------------------------------------------- |
| ✍️   | Markdown editor  | A CodeMirror-powered editor with syntax highlighting, line numbers, folding, and line wrapping |
| 👀   | Live preview     | Instant updates while you write or restyle, with character, reading-time, and page counts      |
| 🧩   | Role templates   | 18 templates for engineering, product, design, data, management, and more                      |
| 🎨   | Resume themes    | 11 built-in themes with adjustable typography, spacing, and colors                             |
| 💾   | Custom themes    | Save, rename, import, export, and reuse your own CSS themes                                    |
| 📄   | Multiple exports | Export to PDF, PNG, or HTML in A4 or Letter format                                             |
| 🌐   | Multilingual     | English and Chinese interfaces with matching resume templates                                  |
| 🔒   | Local-first      | Resume content and preferences stay in your current browser                                    |

## 🖼️ Preview

![](https://cdn.jarvans.com/blog/202320260711212609578.png)

## 🚀 How to Use

1. Write or edit your resume in Markdown in the left-hand editor.
2. Choose a role template, theme, and paper size from the settings panel.
3. Fine-tune the font, type size, line height, margins, section spacing, and colors.
4. Review the pagination and final layout in the live preview.
5. Select PDF, PNG, or HTML and export your resume.

> [!IMPORTANT]
> Selecting a new role template replaces the current editor content. Export or back up your Markdown before trying another template.

> [!NOTE]
> Your content, settings, and custom themes are stored in browser `localStorage`. They do not automatically transfer when you clear site data, switch browsers, or move to another device.

## ⚡ Quick Start

### Requirements

- Node.js `20.19+` or `22.12+`
- npm

### Run Locally

```bash
npm install
npm run dev
```

Open the URL shown in your terminal, usually `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

## 🧱 Tech Stack

- **Application:** React 19, TypeScript, Vite
- **Editor:** CodeMirror 6
- **Markdown:** React Markdown, Remark GFM, GitHub Markdown CSS
- **Export:** html-to-image, jsPDF
- **Icons:** Lucide React
- **Testing:** Vitest, Testing Library, Playwright

## ✅ Project Checks

```bash
npm run check
```

This command runs the unit tests, production build, and end-to-end test suite in sequence.

## 🔐 Privacy

Moli requires no account. Your resume content, editing state, and custom themes are stored in your current browser by default. PDF, PNG, and HTML files are generated and downloaded entirely on the client; the project does not provide a service for uploading resume content.
