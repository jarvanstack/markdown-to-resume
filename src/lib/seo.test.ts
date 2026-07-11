import { beforeEach, describe, expect, it } from 'vitest';
import { applyPageSeo, getSeoRoute, seoPages } from './seo';

describe('SEO metadata', () => {
  beforeEach(() => {
    document.head.innerHTML = '<meta name="description"><link rel="canonical"><script id="structured-data" type="application/ld+json"></script>';
    document.documentElement.lang = 'zh-CN';
  });

  it('resolves routes both at the domain root and under the Pages base path', () => {
    expect(getSeoRoute('/templates/', '/')).toBe('templates');
    expect(getSeoRoute('/markdown-to-resume/themes/', '/markdown-to-resume/')).toBe('themes');
    expect(getSeoRoute('/markdown-to-resume/', '/markdown-to-resume/')).toBe('home');
  });

  it('applies route-specific Chinese metadata and structured data', () => {
    applyPageSeo('zh', '/markdown-to-resume/templates/', '/markdown-to-resume/');

    expect(document.title).toBe(seoPages.zh.templates.title);
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', seoPages.zh.templates.description);
    expect(document.querySelector('meta[name="keywords"]')).toHaveAttribute('content', expect.stringContaining('中文简历模板'));
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://jarvanstack.github.io/markdown-to-resume/templates/');
    expect(JSON.parse(document.querySelector('#structured-data')!.textContent!)).toMatchObject({
      '@type': 'CollectionPage',
      mainEntity: { '@type': 'ItemList', numberOfItems: 18 },
    });
  });

  it('updates language-sensitive search and social metadata', () => {
    applyPageSeo('en', '/themes', '/');

    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe(seoPages.en.themes.title);
    expect(document.querySelector('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US');
    expect(document.querySelector('meta[name="twitter:title"]')).toHaveAttribute('content', seoPages.en.themes.title);
  });
});
