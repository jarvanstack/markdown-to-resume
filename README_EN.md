<div align="center">
  <p><a href="README.md">简体中文</a> | <strong>English</strong></p>
  <img src="public/moli-icon.svg" width="72" height="72" alt="Moli logo" />
  <h1>Moli</h1>
  <p><strong>Focus on your story and turn Markdown into a polished resume.</strong></p>
  <p>Smart one-page fitting, live pagination, role-specific templates, precise styling, and export to PDF, PNG, or HTML.</p>
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
| 🪄   | Smart one-page   | Optimizes structural spacing and layout within readable limits to fit a resume to one page      |
| 🧩   | Role templates   | 18 templates for engineering, product, design, data, management, and more                      |
| 🎨   | Precise layout   | 11 themes with continuous density, typography, spacing, margins, and color controls             |
| 🔤   | CJK fonts        | Bundled Alibaba, Source Han Sans, and Source Han Serif fonts for reliable mixed-script output   |
| 💾   | Custom themes    | Save, rename, import, export, and reuse your own CSS themes                                    |
| 📄   | Multiple exports | Export to PDF, PNG, or HTML in A4 or Letter format                                             |
| 🌐   | Multilingual     | English and Chinese interfaces with matching resume templates                                  |
| 🔒   | Local-first      | Resume content and preferences stay in your current browser                                    |

## 🖼️ Preview

![Moli Markdown resume editor with live preview and smart one-page layout](https://cdn.jarvans.com/blog/202320260711212609578.png)

## 🪄 Smart One-Page

Smart one-page measures the resume against the selected paper size and optimizes the actual rendered layout instead of scaling the entire document down:

1. It first tightens structural spacing around paragraphs, lists, headings, and page margins.
2. It then adjusts line height, heading scale, and body size only when needed.
3. It respects readability limits and recommends multiple pages when the content is genuinely too long.
4. For shorter resumes, it can add balanced whitespace so the content fills the page more naturally.

The `0%–100%` layout-density slider remains available for precise manual control after fitting.

## 🚀 How to Use

1. Write or edit your resume in Markdown in the left-hand editor.
2. Choose a role template, theme, and paper size from the settings panel.
3. Use Smart one-page, or fine-tune density, font, type size, line height, margins, section spacing, and colors.
4. Review the A4 or Letter pagination and final layout in the live preview.
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
