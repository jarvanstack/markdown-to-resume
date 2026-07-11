import { expect, test, type Locator, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const artifactDir = path.resolve('artifacts');
const pdfOutputDir = path.resolve('output/pdf');
const imageOutputDir = path.resolve('output/image');
const githubMarkdownCss = fs.readFileSync(path.resolve('node_modules/github-markdown-css/github-markdown-light.css'), 'utf8');

const githubMarkdownFixture = `# 陈一凡

## 二级标题

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题

正文包含 [GitHub 链接](https://github.com) 和 \`inline code\`。

> 引用内容用于验证边框、颜色和间距。

1. 一级有序列表
   1. 二级有序列表
      1. 三级有序列表

- 无序列表第一项
- 无序列表第二项

| 项目 | 结果 |
| --- | ---: |
| 第一行 | 100 |
| 第二行 | 200 |

\`\`\`ts
const value = 42;
\`\`\`

任务列表：

- [x] 已完成
- [ ] 待处理

---`;

const githubStyleContract = {
  root: { selector: null, properties: ['font-size', 'line-height', 'font-weight', 'color', 'background-color', 'overflow-wrap'] },
  h1: { selector: 'h1', properties: ['font-size', 'line-height', 'font-weight', 'color', 'margin-top', 'margin-bottom', 'padding-bottom', 'border-bottom-width', 'border-bottom-style', 'border-bottom-color'] },
  h2: { selector: 'h2', properties: ['font-size', 'line-height', 'font-weight', 'color', 'margin-top', 'margin-bottom', 'padding-bottom', 'border-bottom-width', 'border-bottom-style', 'border-bottom-color'] },
  h3: { selector: 'h3', properties: ['font-size', 'line-height', 'font-weight', 'color', 'margin-top', 'margin-bottom'] },
  h4: { selector: 'h4', properties: ['font-size', 'line-height', 'font-weight', 'color', 'margin-top', 'margin-bottom'] },
  h5: { selector: 'h5', properties: ['font-size', 'line-height', 'font-weight', 'color', 'margin-top', 'margin-bottom'] },
  h6: { selector: 'h6', properties: ['font-size', 'line-height', 'font-weight', 'color', 'margin-top', 'margin-bottom'] },
  paragraph: { selector: ':scope > p', properties: ['font-size', 'line-height', 'color', 'margin-top', 'margin-bottom'] },
  link: { selector: ':scope > p a', properties: ['color', 'text-decoration-line', 'text-underline-offset', 'overflow-wrap'] },
  inlineCode: { selector: ':scope > p code', properties: ['font-family', 'font-size', 'background-color', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'border-radius', 'white-space'] },
  blockquote: { selector: 'blockquote', properties: ['color', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-right', 'padding-left', 'border-left-width', 'border-left-style', 'border-left-color'] },
  blockquoteParagraph: { selector: 'blockquote > p', properties: ['margin-top', 'margin-bottom'] },
  orderedList: { selector: ':scope > ol', properties: ['margin-top', 'margin-bottom', 'padding-left', 'list-style-type'] },
  nestedOrderedList: { selector: ':scope > ol > li > ol', properties: ['margin-top', 'margin-bottom', 'padding-left', 'list-style-type'] },
  deeplyNestedOrderedList: { selector: ':scope > ol > li > ol > li > ol', properties: ['margin-top', 'margin-bottom', 'padding-left', 'list-style-type'] },
  unorderedList: { selector: ':scope > ul:not(.contains-task-list)', properties: ['margin-top', 'margin-bottom', 'padding-left', 'list-style-type'] },
  adjacentUnorderedItem: { selector: ':scope > ul:not(.contains-task-list) > li + li', properties: ['margin-top'] },
  table: { selector: 'table', properties: ['display', 'max-width', 'overflow-x', 'border-collapse', 'font-variant-numeric', 'margin-top', 'margin-bottom'] },
  tableHeader: { selector: 'th', properties: ['font-weight', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'border-top-width', 'border-top-style', 'border-top-color'] },
  tableCell: { selector: 'td', properties: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'border-top-width', 'border-top-style', 'border-top-color'] },
  firstTableRow: { selector: 'tbody tr:first-child', properties: ['background-color', 'border-top-width', 'border-top-style', 'border-top-color'] },
  secondTableRow: { selector: 'tbody tr:nth-child(2)', properties: ['background-color', 'border-top-width', 'border-top-style', 'border-top-color'] },
  fencedCode: { selector: ':scope > pre', properties: ['font-family', 'font-size', 'line-height', 'color', 'background-color', 'margin-top', 'margin-bottom', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'overflow-x', 'border-radius'] },
  fencedCodeContent: { selector: ':scope > pre > code', properties: ['font-family', 'font-size', 'line-height', 'background-color', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'white-space'] },
  taskList: { selector: 'ul.contains-task-list', properties: ['margin-top', 'margin-bottom', 'padding-left'] },
  taskItem: { selector: '.task-list-item', properties: ['display', 'list-style-type'] },
  adjacentTaskItem: { selector: '.task-list-item + .task-list-item', properties: ['margin-top'] },
  taskCheckbox: { selector: '.task-list-item-checkbox', properties: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'vertical-align'] },
  horizontalRule: { selector: 'hr', properties: ['box-sizing', 'height', 'overflow', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'background-color', 'border-top-width', 'border-top-style'] },
} as const;

type GithubStyleSnapshot = Record<string, Record<string, string>>;

async function replaceMarkdown(page: Page, markdown: string) {
  const editor = page.locator('.cm-content');
  await editor.click();
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
  await page.keyboard.insertText(markdown);
}

async function collectGithubStyles(root: Locator): Promise<GithubStyleSnapshot> {
  return root.evaluate((element, contract) => Object.fromEntries(Object.entries(contract).map(([name, entry]) => {
    const target = entry.selector ? element.querySelector(entry.selector) : element;
    if (!(target instanceof HTMLElement)) throw new Error(`Missing GitHub style fixture element: ${name}`);
    const style = getComputedStyle(target);
    return [name, Object.fromEntries(entry.properties.map((property) => [property, style.getPropertyValue(property)]))];
  })), githubStyleContract) as Promise<GithubStyleSnapshot>;
}

function expectGithubStylesToMatch(actual: GithubStyleSnapshot, expected: GithubStyleSnapshot, label: string) {
  for (const name of Object.keys(githubStyleContract)) {
    expect(actual[name], `${label}: ${name}`).toEqual(expected[name]);
  }
}

test.beforeAll(() => {
  fs.mkdirSync(artifactDir, { recursive: true });
  fs.mkdirSync(pdfOutputDir, { recursive: true });
  fs.mkdirSync(imageOutputDir, { recursive: true });
});

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('按系统语言初始化并持久化用户的语言选择', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:4173', locale: 'en-US' });
  const page = await context.newPage();
  try {
    await page.goto('/');
    await expect(page).toHaveTitle('Markdown Resume Editor - Free PDF Resume Builder | Moli');
    await expect(page.getByTestId('language-select')).toHaveValue('en');
    await expect(page.getByRole('button', { name: 'Frontend Engineer', exact: true })).toBeVisible();
    await expect(page.getByTestId('resume-page')).toContainText('Professional Summary');
    await expect(page.getByTestId('theme-crisp')).toHaveText('Crisp');

    await page.getByTestId('language-select').selectOption('zh');
    await expect(page).toHaveTitle('Markdown 简历编辑器 - 免费在线制作并导出 PDF | 墨历');
    await expect(page.getByRole('button', { name: '前端开发工程师', exact: true })).toBeVisible();
    await expect(page.getByTestId('resume-page')).toContainText('个人简介');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('markdown-resume-locale'))).toBe('zh');

    await page.reload();
    await expect(page.getByTestId('language-select')).toHaveValue('zh');
    await expect(page.getByTestId('resume-page')).toContainText('前端开发工程师');

    await replaceMarkdown(page, '# My edited resume');
    await page.getByTestId('language-select').selectOption('en');
    await expect(page.getByTestId('resume-page')).toContainText('My edited resume');
    await expect(page.getByTestId('resume-page')).not.toContainText('Frontend Engineer');
  } finally {
    await context.close();
  }
});

test('中文界面复刻三栏编辑器结构', async ({ page }) => {
  await expect(page).toHaveTitle('Markdown 简历编辑器 - 免费在线制作并导出 PDF | 墨历');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/moli-icon.svg');
  await expect(page.getByText('MARKDOWN', { exact: true })).toBeVisible();
  await expect(page.getByTestId('preview-column').getByText('预览', { exact: true })).toBeVisible();
  await expect(page.getByTestId('settings-sidebar')).toBeVisible();
  await expect(page.getByText('前端开发工程师').first()).toBeVisible();
  await expect(page.getByTestId('language-select')).toHaveValue('zh');
  await expect(page.getByText(/广告|subscribe|AD$/i)).toHaveCount(0);
  await expect(page.getByTestId('resume-page')).toHaveClass(/github/);
  await expect(page.getByTestId('font-size')).toHaveValue('16');
  await expect(page.getByTestId('line-height')).toHaveAttribute('min', '0.5');
  await expect(page.getByTestId('export-format')).toHaveValue('pdf');
  await expect(page.getByTestId('export-format').locator('option')).toHaveCount(3);
  await expect(page.getByTestId('reset-theme-settings')).toBeVisible();
  const brandIcon = page.locator('.panel-brand-icon');
  await expect(brandIcon).toBeVisible();
  await expect.poll(() => brandIcon.evaluate((element) => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true);
  await expect(page.locator('.panel-icon')).toHaveCount(1);
  await expect(page.getByLabel('简历统计')).toContainText(/\d+字/);
  await expect(page.getByLabel('简历统计')).toContainText(/\d+分钟/);
  await expect(page.getByLabel('简历统计')).toContainText(/\d+页/);

  const widths = await page.evaluate(() => {
    const layout = document.querySelector('.editor-layout')!.getBoundingClientRect();
    const editor = document.querySelector('.editor-column')!.getBoundingClientRect();
    const preview = document.querySelector('.preview-column')!.getBoundingClientRect();
    const sidebar = document.querySelector('.sidebar')!.getBoundingClientRect();
    return { layout: layout.width, editor: editor.width, preview: preview.width, sidebar: sidebar.width };
  });
  expect(widths.sidebar).toBeCloseTo(320, 0);
  expect(Math.abs(widths.editor - widths.preview)).toBeLessThan(2);
});

test('首页仅展示 4 个快捷主题和 4 个快捷模板', async ({ page }) => {
  await expect(page.locator('.theme-buttons button')).toHaveCount(4);
  await expect(page.locator('.sidebar-section').filter({ hasText: '快速模板' }).locator('.quick-grid button')).toHaveCount(4);
  await expect(page.getByRole('link', { name: /更多主题（11）/ })).toHaveAttribute('href', '/themes');
  await expect(page.getByRole('link', { name: /更多模板（18）/ })).toHaveAttribute('href', '/templates');
});

test('岩青应用配色与简历主题颜色保持隔离', async ({ page }) => {
  await page.goto('/?theme=crisp');

  const appColors = await page.evaluate(() => ({
    previewBackground: getComputedStyle(document.querySelector('.preview-stage')!).backgroundColor,
    statsText: getComputedStyle(document.querySelector('.preview-stats')!).color,
    statsIcon: getComputedStyle(document.querySelector('.preview-stats svg')!).color,
    exportBackground: getComputedStyle(document.querySelector('[data-testid="export-action"]')!).backgroundColor,
    selectedBorder: getComputedStyle(document.querySelector('[data-testid="theme-crisp"]')!).borderTopColor,
    rangeAccent: getComputedStyle(document.querySelector('[data-testid="font-size"]')!).accentColor,
    paperBackground: getComputedStyle(document.querySelector('[data-testid="resume-page"]')!).backgroundColor,
  }));

  expect(appColors).toEqual({
    previewBackground: 'rgb(226, 233, 230)',
    statsText: 'rgb(98, 113, 108)',
    statsIcon: 'rgb(15, 118, 110)',
    exportBackground: 'rgb(15, 118, 110)',
    selectedBorder: 'rgb(15, 118, 110)',
    rangeAccent: 'rgb(15, 118, 110)',
    paperBackground: 'rgb(255, 255, 255)',
  });

  await page.getByLabel('链接', { exact: true }).fill('#ff00ff');
  await expect.poll(() => page.getByTestId('resume-page').locator('a').first().evaluate((element) => getComputedStyle(element).color)).toBe('rgb(255, 0, 255)');
  await expect.poll(() => page.locator('.preview-stats svg').first().evaluate((element) => getComputedStyle(element).color)).toBe('rgb(15, 118, 110)');
});

test('保存的自定义主题优先显示并持久化设置', async ({ page }) => {
  await page.getByTestId('font-size').fill('12');
  await page.getByTestId('line-height').fill('0.8');
  page.once('dialog', (dialog) => dialog.accept('我的蓝色主题'));
  await page.getByTestId('save-theme').click();

  const themeButtons = page.locator('.theme-buttons button');
  await expect(themeButtons).toHaveCount(4);
  await expect(themeButtons.first()).toHaveText('我的蓝色主题');
  await expect(page.getByTestId('font-size')).toHaveValue('12');
  await expect(page.getByTestId('line-height')).toHaveValue('0.8');
  await page.reload();
  await expect(themeButtons.first()).toHaveText('我的蓝色主题');
  await expect(page.getByTestId('font-size')).toHaveValue('12');
  await expect(page.getByTestId('line-height')).toHaveValue('0.8');
  await page.getByTestId('font-size').fill('10');
  await page.getByTestId('line-height').fill('0.6');
  await page.getByTestId('reset-theme-settings').click();
  await expect(page.getByTestId('font-size')).toHaveValue('12');
  await expect(page.getByTestId('line-height')).toHaveValue('0.8');
});

test('主题 CSS 可以下载、重新导入并重命名', async ({ page }) => {
  await page.goto('/themes');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载 GitHub' }).click();
  const download = await downloadPromise;
  const cssPath = await download.path();
  const css = fs.readFileSync(cssPath!, 'utf8');
  expect(css).toContain('.resume-theme');
  expect(css).toContain('--resume-font-size: 16');
  expect(css).toContain('--resume-heading-color: #1f2328');

  await page.locator('input[type="file"]').setInputFiles({ name: 'github-copy.css', mimeType: 'text/css', buffer: Buffer.from(css) });
  await expect(page.locator('.theme-card')).toHaveCount(12);
  await expect(page.locator('.theme-card').first().locator('.theme-card-info h2')).toHaveText('GitHub');
  await expect(page.getByRole('status')).toContainText('已导入 GitHub');

  page.once('dialog', (dialog) => dialog.accept('导入后重命名'));
  await page.getByRole('button', { name: '重命名 GitHub' }).click();
  await expect(page.locator('.theme-card').first().locator('.theme-card-info h2')).toHaveText('导入后重命名');
  await page.reload();
  await expect(page.locator('.theme-card').first().locator('.theme-card-info h2')).toHaveText('导入后重命名');
  await expect(page.getByRole('button', { name: /^下载 / })).toHaveCount(12);
  await expect(page.locator('.theme-card').first().getByRole('button', { name: /下载/ })).toBeVisible();
  await page.screenshot({ path: path.join(artifactDir, 'custom-themes-page.png'), fullPage: true });

  await page.goto('/');
  await expect(page.locator('.theme-buttons button').first()).toHaveText('导入后重命名');

  await page.goto('/themes');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: '删除 导入后重命名' }).click();
  await expect(page.getByRole('status')).toContainText('已删除 导入后重命名');
  await expect(page.locator('.theme-card')).toHaveCount(11);
  await page.reload();
  await expect(page.locator('.theme-card')).toHaveCount(11);
});

test('主题二级页提供全部 11 个主题、可以滚动并可载入编辑器', async ({ page }) => {
  await page.goto('/themes');
  await expect(page.locator('.catalog-logo img')).toHaveCount(2);
  await expect(page.locator('.catalog-logo strong').first()).toHaveText('Markdown简历');
  await expect(page.getByRole('heading', { name: '简历主题' })).toBeVisible();
  await expect(page.locator('.theme-card')).toHaveCount(11);
  const scrollState = await page.evaluate(() => ({ scrollHeight: document.documentElement.scrollHeight, viewport: window.innerHeight, overflow: getComputedStyle(document.body).overflowY }));
  expect(scrollState.scrollHeight).toBeGreaterThan(scrollState.viewport);
  expect(scrollState.overflow).not.toBe('hidden');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await page.locator('a[href="/?theme=fresh"]').click();
  await expect(page).toHaveURL(/\?theme=fresh/);
  await expect(page.getByTestId('resume-page')).toHaveClass(/fresh/);
});

test('模板二级页提供全部 18 个中文模板并可载入编辑器', async ({ page }) => {
  await page.goto('/templates');
  await expect(page.getByRole('heading', { name: '中文简历模板' })).toBeVisible();
  await expect(page.locator('.template-card')).toHaveCount(18);
  await page.locator('a[href="/?template=data-scientist"]').click();
  await expect(page).toHaveURL(/template=data-scientist/);
  await expect(page.getByTestId('resume-page')).toContainText('数据科学家');
  await expect(page.getByTestId('resume-page')).toContainText('智能增长决策平台');
});

test('切换主题不重置设置且刷新后保持', async ({ page }) => {
  const padding = page.getByTestId('horizontal-padding');
  await padding.fill('36');
  await page.getByTestId('theme-vivid').click();
  await expect(padding).toHaveValue('36');
  await expect(page.getByTestId('resume-page')).toHaveClass(/vivid/);
  await page.waitForTimeout(250);
  await page.reload();
  await expect(page.getByTestId('horizontal-padding')).toHaveValue('36');
  await expect(page.getByTestId('resume-page')).toHaveClass(/vivid/);
});

test('五套新字体会真实改变所有主题的正文和标题字形', async ({ page }) => {
  test.setTimeout(60_000);
  const fontSelect = page.getByTestId('font-family');
  const expectedFonts = [
    ['阿里普惠体2-55-Regular', 'Resume Alibaba PuHuiTi'],
    ['苹果方正_Medium', 'Resume PingFang'],
    ['思源黑体2.0_Normal', 'Resume Source Han Sans'],
    ['思源宋体', 'Resume Source Han Serif'],
    ['Times-New-Roman', 'Resume Times New Roman'],
  ] as const;
  await expect(fontSelect.locator('option')).toHaveCount(expectedFonts.length);
  expect(await fontSelect.locator('option').allTextContents()).toEqual(expectedFonts.map(([label]) => label));
  await page.getByTestId('theme-crisp').click();

  const renderedWidths: number[] = [];
  for (const [value, internalFamily] of expectedFonts) {
    await fontSelect.selectOption(value);
    await page.evaluate(async (family) => {
      await document.fonts.load(`16px "${family}"`, '中文简历排版 Resume 2026');
    }, internalFamily);
    const metrics = await page.getByTestId('resume-page').evaluate((sheet) => {
      const rootStyle = getComputedStyle(sheet);
      const headingStyle = getComputedStyle(sheet.querySelector('h1')!);
      const sample = document.createElement('span');
      sample.textContent = '中文简历排版 Resume 2026 WMWM';
      sample.style.cssText = `position:fixed;visibility:hidden;white-space:nowrap;font:400 32px ${rootStyle.fontFamily}`;
      document.body.appendChild(sample);
      const width = sample.getBoundingClientRect().width;
      sample.remove();
      return { rootFamily: rootStyle.fontFamily, headingFamily: headingStyle.fontFamily, width };
    });
    expect(metrics.rootFamily).toContain(internalFamily);
    expect(metrics.headingFamily).toContain(internalFamily);
    renderedWidths.push(Math.round(metrics.width * 10) / 10);
  }

  expect(new Set(renderedWidths).size).toBeGreaterThanOrEqual(4);
  await page.screenshot({ path: path.join(artifactDir, 'font-times-new-roman.png'), fullPage: true });
  await page.waitForTimeout(250);
  await page.reload();
  await expect(fontSelect).toHaveValue('Times-New-Roman');
  await expect(page.getByTestId('resume-page')).toHaveCSS('font-family', /Resume Times New Roman/);
});

test('CodeMirror 可以编辑并实时更新中文预览', async ({ page }) => {
  const editor = page.locator('.cm-content');
  await editor.click();
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
  await page.keyboard.type('# 自定义中文简历\n\n## 核心优势\n\n- 实时预览正常');
  await expect(page.getByTestId('resume-page')).toContainText('自定义中文简历');
  await expect(page.getByTestId('resume-page')).toContainText('实时预览正常');
});

test('GitHub 主题计算样式与 github-markdown-css 5.9.0 一致', async ({ page, context }) => {
  await replaceMarkdown(page, githubMarkdownFixture);
  const resume = page.getByTestId('resume-page');

  await expect(resume).toHaveClass(/markdown-body/);
  for (let level = 1; level <= 6; level += 1) await expect(resume.locator(`h${level}`)).toHaveCount(1);
  await expect(resume.locator(':scope > p a')).toHaveAttribute('href', 'https://github.com');
  await expect(resume.locator(':scope > p code')).toHaveText('inline code');
  await expect(resume.locator('blockquote > p')).toContainText('引用内容');
  await expect(resume.locator(':scope > ol')).toHaveCount(1);
  await expect(resume.locator(':scope > ol > li > ol')).toHaveCount(1);
  await expect(resume.locator(':scope > ol > li > ol > li > ol')).toHaveCount(1);
  await expect(resume.locator(':scope > ul:not(.contains-task-list)')).toHaveCount(1);
  await expect(resume.locator('table tbody tr')).toHaveCount(2);
  await expect(resume.locator(':scope > pre > code')).toContainText('const value = 42;');
  await expect(resume.locator('ul.contains-task-list .task-list-item')).toHaveCount(2);
  const taskCheckboxes = resume.locator('.task-list-item-checkbox');
  await expect(taskCheckboxes).toHaveCount(2);
  await expect(taskCheckboxes.nth(0)).toBeChecked();
  await expect(taskCheckboxes.nth(1)).not.toBeChecked();
  await expect(taskCheckboxes.nth(0)).toBeDisabled();
  await expect(taskCheckboxes.nth(1)).toBeDisabled();
  await expect(resume.locator('hr')).toHaveCount(1);

  const previewStyles = await collectGithubStyles(resume);
  const previewHtml = await resume.innerHTML();
  const referencePage = await context.newPage();
  try {
    await referencePage.setContent(`<!doctype html><html><head><style>:root { --borderColor-accent-emphasis: #0969da; --borderColor-muted: #d1d9e0; }${githubMarkdownCss}</style></head><body><article class="markdown-body">${previewHtml}</article></body></html>`);
    const referenceStyles = await collectGithubStyles(referencePage.locator('.markdown-body'));
    expectGithubStylesToMatch(previewStyles, referenceStyles, '应用预览与 GitHub 官方样式');
  } finally {
    await referencePage.close();
  }
});

test('所有内置主题的引用块都与正文左边缘对齐', async ({ page }) => {
  const editor = page.locator('.cm-content');
  await editor.click();
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
  await page.keyboard.type('# 引用布局测试\n\n普通正文\n\n> 引用内容');
  await expect(page.getByTestId('resume-page').locator('blockquote')).toContainText('引用内容');
  await expect.poll(() => page.evaluate(() => {
    const raw = localStorage.getItem('markdown-resume-state-v3');
    return raw ? (JSON.parse(raw) as { markdown?: string }).markdown ?? '' : '';
  })).toContain('> 引用内容');

  const themeIds = ['github', 'crisp', 'vivid', 'airy', 'stark', 'calm', 'dusk', 'sharp', 'warm', 'stern', 'fresh'];
  for (const themeId of themeIds) {
    await page.goto(`/?theme=${themeId}`);
    const alignment = await page.getByTestId('resume-page').evaluate((sheet) => {
      const paragraph = Array.from(sheet.children).find((element) => element.tagName === 'P' && element.textContent === '普通正文')!;
      const quote = sheet.querySelector('blockquote')!;
      const style = getComputedStyle(quote);
      return {
        paragraphLeft: paragraph.getBoundingClientRect().left,
        paragraphRight: paragraph.getBoundingClientRect().right,
        quoteLeft: quote.getBoundingClientRect().left,
        quoteRight: quote.getBoundingClientRect().right,
        marginLeft: style.marginLeft,
        marginRight: style.marginRight,
      };
    });

    expect(alignment.marginLeft, themeId).toBe('0px');
    expect(alignment.marginRight, themeId).toBe('0px');
    expect(Math.abs(alignment.quoteLeft - alignment.paragraphLeft), themeId).toBeLessThan(1);
    expect(Math.abs(alignment.quoteRight - alignment.paragraphRight), themeId).toBeLessThan(1);
  }
});

test('导出有效的中文 PNG 和 PDF', async ({ page }) => {
  await replaceMarkdown(page, githubMarkdownFixture);
  const resume = page.getByTestId('resume-page');
  await expect(resume.locator('blockquote')).toContainText('引用内容');
  const previewStyles = await collectGithubStyles(resume);

  await page.getByTestId('export-format').selectOption('png');
  const pngPromise = page.waitForEvent('download');
  await page.getByTestId('export-action').click();
  const png = await pngPromise;
  const pngPath = await png.path();
  expect(fs.readFileSync(pngPath!).subarray(1, 4).toString()).toBe('PNG');
  fs.copyFileSync(pngPath!, path.join(imageOutputDir, 'chinese-resume.png'));

  await page.getByTestId('export-format').selectOption('pdf');
  const pdfPromise = page.waitForEvent('download');
  await page.getByTestId('export-action').click();
  const pdf = await pdfPromise;
  const pdfPath = await pdf.path();
  expect(fs.readFileSync(pdfPath!).subarray(0, 4).toString()).toBe('%PDF');
  const actualPages = Number(execFileSync('pdfinfo', [pdfPath!], { encoding: 'utf8' }).match(/Pages:\s+(\d+)/)?.[1]);
  const shownPages = Number((await page.getByLabel('简历统计').innerText()).match(/(\d+)页/)?.[1]);
  expect(shownPages).toBe(actualPages);
  await expect(page.getByTestId('preview-paper')).toHaveCount(actualPages);
  if (actualPages > 1) {
    const first = await page.getByTestId('preview-paper').nth(0).boundingBox();
    const second = await page.getByTestId('preview-paper').nth(1).boundingBox();
    expect(second!.y).toBeGreaterThan(first!.y + first!.height + 10);
  }
  fs.copyFileSync(pdfPath!, path.join(pdfOutputDir, 'chinese-resume.pdf'));

  await page.getByTestId('export-format').selectOption('html');
  const htmlPromise = page.waitForEvent('download');
  await page.getByTestId('export-action').click();
  const html = await htmlPromise;
  const htmlPath = await html.path();
  const htmlContent = fs.readFileSync(htmlPath!, 'utf8');
  expect(htmlContent).toContain('<!doctype html>');
  expect(htmlContent).toContain('陈一凡');
  expect(htmlContent).toContain('.theme.github');
  expect(htmlContent).toContain('--fontScale');
  expect(htmlContent).toContain('data-density="35"');
  expect(htmlContent).toContain('--densityBodyTop');
  await page.setContent(htmlContent);
  const exportedResume = page.locator('.resume-sheet');
  await expect(exportedResume.locator('blockquote > p')).toContainText('引用内容');
  await expect(exportedResume.locator('.task-list-item-checkbox')).toHaveCount(2);
  const exportedStyles = await collectGithubStyles(exportedResume);
  expectGithubStylesToMatch(exportedStyles, previewStyles, 'HTML 导出与应用预览');
  fs.copyFileSync(htmlPath!, path.join('output', 'resume.html'));
});

test('紧凑排版不会把纸张空白误算成第二页', async ({ page }) => {
  await page.setViewportSize({ width: 2048, height: 1280 });
  await page.getByRole('button', { name: '全栈开发工程师', exact: true }).click();
  for (const [testId, value] of [
    ['font-size', '10'],
    ['line-height', '1.2'],
    ['heading-scale', '0.85'],
    ['horizontal-padding', '28'],
    ['vertical-padding', '8'],
    ['section-spacing', '14'],
  ] as const) {
    await page.getByTestId(testId).fill(value);
  }

  await expect(page.getByLabel('简历统计')).toContainText('1页');
  await expect(page.getByTestId('preview-paper')).toHaveCount(1);
  await page.screenshot({ path: path.join(artifactDir, 'single-page-pagination.png'), fullPage: true });
  const pdfPromise = page.waitForEvent('download');
  await page.getByTestId('export-action').click();
  const pdf = await pdfPromise;
  const pdfPath = await pdf.path();
  const actualPages = Number(execFileSync('pdfinfo', [pdfPath!], { encoding: 'utf8' }).match(/Pages:\s+(\d+)/)?.[1]);
  expect(actualPages).toBe(1);
});

test('智能一页自动调整排版并让内容贴合单页', async ({ page }) => {
  await page.setViewportSize({ width: 2048, height: 1280 });
  const fitButton = page.getByTestId('fit-one-page');
  await expect(fitButton).toHaveText('智能一页');

  await fitButton.click();

  await expect(fitButton).toHaveText('已适配一页');
  await expect(page.getByLabel('简历统计')).toContainText('1页');
  await expect(page.getByTestId('preview-paper')).toHaveCount(1);
  await expect(page.getByTestId('font-size')).toHaveValue('16');
  expect(Number(await page.getByTestId('resume-page').getAttribute('data-density'))).toBeGreaterThan(35);
  expect(Number(await page.getByTestId('font-size').inputValue())).toBeGreaterThanOrEqual(12);
  expect(Number(await page.getByTestId('line-height').inputValue())).toBeGreaterThanOrEqual(1.2);
  expect(Number(await page.getByTestId('heading-scale').inputValue())).toBeGreaterThanOrEqual(0.85);
  expect(Number(await page.getByTestId('horizontal-padding').inputValue())).toBeGreaterThanOrEqual(16);
  await expect.poll(() => page.getByTestId('resume-page').evaluate((sheet) => {
    const rect = sheet.getBoundingClientRect();
    const paddingBottom = Number.parseFloat(getComputedStyle(sheet).paddingBottom) || 0;
    const contentBottom = Array.from(sheet.children).reduce((bottom, child) => (
      Math.max(bottom, (child as HTMLElement).getBoundingClientRect().bottom - rect.top)
    ), 0);
    const pageHeight = Math.ceil(rect.width * (841.89 / 595.28)) - 1;
    return pageHeight - contentBottom - paddingBottom;
  })).toBeLessThan(2);
  await page.screenshot({ path: path.join(artifactDir, 'smart-one-page.png'), fullPage: true });
});

test('排版密度可以独立切换并持久化', async ({ page }) => {
  const density = page.getByTestId('layout-density');
  await expect(density).toHaveValue('35');
  const standardListMargin = await page.getByTestId('resume-page').evaluate((sheet) => {
    const list = sheet.querySelector(':scope > ul');
    return list ? Number.parseFloat(getComputedStyle(list).marginBottom) : -1;
  });

  await density.fill('100');

  await expect(density).toHaveValue('100');
  await expect(page.getByTestId('resume-page')).toHaveAttribute('data-density', '100');
  const denseListMargin = await page.getByTestId('resume-page').evaluate((sheet) => {
    const list = sheet.querySelector(':scope > ul');
    return list ? Number.parseFloat(getComputedStyle(list).marginBottom) : -1;
  });
  expect(denseListMargin).toBeLessThan(standardListMargin);
  await page.waitForTimeout(250);
  await page.reload();
  await expect(density).toHaveValue('100');
});

test('智能一页会修复旧版过度压缩的排版参数', async ({ page }) => {
  await page.setViewportSize({ width: 2048, height: 1280 });
  for (const [testId, value] of [
    ['font-size', '12'],
    ['line-height', '0.9'],
    ['heading-scale', '0.8'],
    ['horizontal-padding', '13'],
    ['vertical-padding', '13'],
    ['section-spacing', '18'],
  ] as const) await page.getByTestId(testId).fill(value);

  await page.getByTestId('fit-one-page').click();

  await expect(page.getByTestId('fit-one-page')).toHaveText('已适配一页');
  await expect(page.getByTestId('preview-paper')).toHaveCount(1);
  expect(Number(await page.getByTestId('font-size').inputValue())).toBeGreaterThanOrEqual(12);
  expect(Number(await page.getByTestId('line-height').inputValue())).toBeGreaterThanOrEqual(1.2);
  expect(Number(await page.getByTestId('heading-scale').inputValue())).toBeGreaterThanOrEqual(0.85);
  expect(Number(await page.getByTestId('horizontal-padding').inputValue())).toBeGreaterThanOrEqual(16);
});

test('超长内容保留多页而不突破可读性下限', async ({ page }) => {
  await page.setViewportSize({ width: 2048, height: 1280 });
  const sections = Array.from({ length: 24 }, (_, index) => `## 项目经历 ${index + 1}\n\n### 后端开发工程师 | 示例科技\n\n- 负责核心系统架构设计与稳定性治理，持续优化服务性能和交付质量\n- 建设监控告警与自动化发布体系，缩短故障发现和恢复时间\n- 推动团队工程规范落地，负责方案评审、人才培养和跨团队协作`);
  await replaceMarkdown(page, ['# 张明', '资深软件工程师 | example@example.com', ...sections].join('\n\n'));

  await page.getByTestId('fit-one-page').click();

  await expect(page.getByTestId('fit-one-page')).toHaveText('建议保留多页');
  await expect.poll(() => page.getByTestId('preview-paper').count()).toBeGreaterThan(1);
  await expect(page.getByTestId('font-size')).toHaveValue('12');
  await expect(page.getByTestId('line-height')).toHaveValue('1.2');
  await expect(page.getByTestId('heading-scale')).toHaveValue('0.85');
  await expect(page.getByTestId('horizontal-padding')).toHaveValue('16');
  await expect(page.getByTestId('vertical-padding')).toHaveValue('8');
  await expect(page.getByTestId('section-spacing')).toHaveValue('8');
  await expect(page.getByTestId('layout-density')).toHaveValue('100');
});

test('生成桌面编辑器、主题页、模板页和移动端截图', async ({ page }) => {
  await page.setViewportSize({ width: 1680, height: 1060 });
  await page.screenshot({ path: path.join(artifactDir, 'desktop-editor.png'), fullPage: true });
  await page.goto('/themes');
  await page.screenshot({ path: path.join(artifactDir, 'themes-page.png'), fullPage: true });
  await page.goto('/templates');
  await page.screenshot({ path: path.join(artifactDir, 'templates-page.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: '预览', exact: true }).click();
  await page.screenshot({ path: path.join(artifactDir, 'mobile-preview.png'), fullPage: true });
  await page.getByRole('button', { name: '设置', exact: true }).click();
  await expect(page.getByTestId('layout-density')).toBeVisible();
  await page.screenshot({ path: path.join(artifactDir, 'mobile-settings.png'), fullPage: true });
});
