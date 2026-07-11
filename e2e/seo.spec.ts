import { expect, test } from '@playwright/test';

const productionBase = 'https://jarvanstack.github.io/markdown-to-resume';

test('每个搜索入口都返回独立、可抓取的 HTML', async ({ request }) => {
  const pages = [
    { path: '/', title: 'Markdown 简历编辑器 - 免费在线制作并导出 PDF | 墨历', canonical: `${productionBase}/`, heading: '免费在线 Markdown 简历编辑器' },
    { path: '/templates/', title: '中文简历模板 - 18 套免费 Markdown 简历模板 | 墨历', canonical: `${productionBase}/templates/`, heading: '18 套免费中文 Markdown 简历模板' },
    { path: '/themes/', title: '简历主题 - 11 套 Markdown 简历排版样式 | 墨历', canonical: `${productionBase}/themes/`, heading: '11 套免费 Markdown 简历主题' },
  ];

  for (const entry of pages) {
    const response = await request.get(entry.path);
    const html = await response.text();
    expect(response.ok()).toBe(true);
    expect(html).toContain(`<title>${entry.title}</title>`);
    expect(html).toContain(`<link rel="canonical" href="${entry.canonical}"`);
    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain(`<h1>${entry.heading}</h1>`);
  }
});

test('模板页和主题页运行后保留独立元数据与可见说明', async ({ page }) => {
  await page.goto('/templates/');
  await expect(page).toHaveTitle('中文简历模板 - 18 套免费 Markdown 简历模板 | 墨历');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${productionBase}/templates/`);
  await expect(page.getByRole('heading', { name: '如何选择合适的简历模板' })).toBeVisible();
  await expect(page.getByText('Markdown 简历可以导出 PDF 吗？')).toBeVisible();

  await page.goto('/themes/');
  await expect(page).toHaveTitle('简历主题 - 11 套 Markdown 简历排版样式 | 墨历');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${productionBase}/themes/`);
  await expect(page.getByRole('heading', { name: '让 PDF 简历保持清晰、专业的排版' })).toBeVisible();
});
