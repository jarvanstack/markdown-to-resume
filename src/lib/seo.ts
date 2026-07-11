import type { Locale } from '../types';

const SITE_URL = 'https://jarvanstack.github.io/markdown-to-resume';

export type SeoRoute = 'home' | 'templates' | 'themes';

interface SeoPage {
  title: string;
  description: string;
  keywords: string;
  socialDescription: string;
}

export const seoPages: Record<Locale, Record<SeoRoute, SeoPage>> = {
  zh: {
    home: {
      title: 'Markdown 简历编辑器 - 免费在线制作并导出 PDF | 墨历',
      description: '免费在线 Markdown 简历编辑器，提供中文简历模板、实时预览与专业排版，一键导出 PDF、PNG 和 HTML。无需登录，简历数据仅保存在本地。',
      keywords: 'Markdown简历,Markdown简历编辑器,在线简历制作,简历生成器,Markdown转PDF,免费简历编辑器,中文简历模板',
      socialDescription: '用 Markdown 在线制作专业简历，实时预览并导出 PDF、PNG 或 HTML。无需登录，数据保存在本地。',
    },
    templates: {
      title: '中文简历模板 - 18 套免费 Markdown 简历模板 | 墨历',
      description: '18 套免费中文 Markdown 简历模板，覆盖程序员、产品经理、数据分析、设计师、应届生等岗位。在线编辑、实时预览并导出 PDF。',
      keywords: '中文简历模板,Markdown简历模板,免费简历模板,程序员简历模板,应届生简历模板,产品经理简历模板,PDF简历模板',
      socialDescription: '覆盖技术、产品、设计、数据、管理和应届生岗位的免费中文简历模板，可直接在线编辑并导出 PDF。',
    },
    themes: {
      title: '简历主题 - 11 套 Markdown 简历排版样式 | 墨历',
      description: '11 套免费 Markdown 简历主题与专业排版样式，支持中文字体、字号、间距和颜色自定义。在线预览并导出清晰的 PDF 简历。',
      keywords: '简历主题,简历排版,Markdown主题,简历样式,PDF简历排版,中文简历字体,GitHub简历主题',
      socialDescription: '选择专业简历排版主题，自定义中文字体、字号、间距与颜色，并导出清晰的 PDF 简历。',
    },
  },
  en: {
    home: {
      title: 'Markdown Resume Editor - Free PDF Resume Builder | Moli',
      description: 'Free online Markdown resume editor with role-specific templates, live preview, professional themes, and PDF, PNG, or HTML export. No sign-up required.',
      keywords: 'Markdown resume,Markdown resume editor,free resume builder,resume to PDF,online CV maker,resume templates',
      socialDescription: 'Write a professional resume in Markdown, preview it live, and export it as PDF, PNG, or HTML for free.',
    },
    templates: {
      title: 'Free Resume Templates - 18 Markdown CV Templates | Moli',
      description: 'Choose from 18 free Markdown resume templates for software, product, data, design, management, students, and career changers. Edit online and export to PDF.',
      keywords: 'free resume templates,Markdown resume template,developer resume template,student resume template,CV template,PDF resume',
      socialDescription: '18 role-specific Markdown resume templates with realistic structure and measurable achievements, ready to edit and export.',
    },
    themes: {
      title: 'Resume Themes - 11 Markdown CV Styles | Moli',
      description: 'Choose from 11 free Markdown resume themes. Customize typography, spacing, margins, and color, preview every PDF page, and export a polished resume.',
      keywords: 'resume themes,resume design,Markdown CSS theme,CV layout,professional resume style,GitHub resume theme',
      socialDescription: 'Professional Markdown resume themes with customizable typography, spacing, margins, and colors.',
    },
  },
};

export function getSeoRoute(pathname: string, baseUrl: string): SeoRoute {
  const basePath = baseUrl.replace(/\/+$/, '');
  const relativePath = basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length)
    : pathname;
  const path = relativePath.replace(/\/+$/, '') || '/';
  if (path === '/templates') return 'templates';
  if (path === '/themes') return 'themes';
  return 'home';
}

function pageUrl(route: SeoRoute) {
  return route === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${route}/`;
}

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = content;
}

function structuredData(route: SeoRoute, locale: Locale, page: SeoPage) {
  const url = pageUrl(route);
  if (route === 'home') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: locale === 'zh' ? '墨历 Markdown 简历' : 'Moli Markdown Resume', inLanguage: locale === 'zh' ? 'zh-CN' : 'en' },
        {
          '@type': 'SoftwareApplication', '@id': `${SITE_URL}/#app`, name: locale === 'zh' ? '墨历 Markdown 简历编辑器' : 'Moli Markdown Resume Editor', url,
          description: page.description, applicationCategory: 'BusinessApplication', applicationSubCategory: 'Resume Builder', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript',
          isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: locale === 'zh' ? 'CNY' : 'USD' },
          featureList: locale === 'zh'
            ? ['Markdown 简历实时预览', '中文和英文简历模板', 'PDF、PNG 和 HTML 导出', '自定义简历主题与排版', '本地数据存储']
            : ['Live Markdown resume preview', 'English and Chinese resume templates', 'PDF, PNG, and HTML export', 'Custom resume themes and typography', 'Local data storage'],
        },
      ],
    };
  }
  const itemNames = route === 'templates'
    ? locale === 'zh'
      ? ['前端开发工程师简历模板', '全栈开发工程师简历模板', 'DevOps 工程师简历模板', '产品经理简历模板', '数据科学家简历模板', 'UX / UI 设计师简历模板', '应届毕业生简历模板', '在校学生简历模板']
      : ['Frontend Engineer Resume Template', 'Full-Stack Engineer Resume Template', 'DevOps Engineer Resume Template', 'Product Manager Resume Template', 'Data Scientist Resume Template', 'UX / UI Designer Resume Template', 'Recent Graduate Resume Template', 'Student Resume Template']
    : locale === 'zh'
      ? ['GitHub 简历主题', '简约简历主题', '鲜明简历主题', '轻盈简历主题', '稳重简历主题', '沉静简历主题', '暮色简历主题', '锐利简历主题', '暖调简历主题', '严谨简历主题', '清新简历主题']
      : ['GitHub Resume Theme', 'Crisp Resume Theme', 'Vivid Resume Theme', 'Airy Resume Theme', 'Calm Resume Theme', 'Dusk Resume Theme', 'Sharp Resume Theme', 'Warm Resume Theme', 'Stark Resume Theme', 'Stern Resume Theme', 'Fresh Resume Theme'];
  return {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: page.title, url, description: page.description,
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList', numberOfItems: route === 'templates' ? 18 : 11,
      itemListElement: itemNames.map((name, index) => ({ '@type': 'ListItem', position: index + 1, name })),
    },
  };
}

export function applyPageSeo(locale: Locale, pathname: string, baseUrl: string) {
  const route = getSeoRoute(pathname, baseUrl);
  const page = seoPages[locale][route];
  const url = pageUrl(route);

  document.title = page.title;
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  setMeta('meta[name="description"]', 'name', 'description', page.description);
  setMeta('meta[name="keywords"]', 'name', 'keywords', page.keywords);
  setMeta('meta[property="og:title"]', 'property', 'og:title', page.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', page.socialDescription);
  setMeta('meta[property="og:url"]', 'property', 'og:url', url);
  setMeta('meta[property="og:locale"]', 'property', 'og:locale', locale === 'zh' ? 'zh_CN' : 'en_US');
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', page.title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', page.socialDescription);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.append(canonical);
  }
  canonical.href = url;

  let script = document.head.querySelector<HTMLScriptElement>('#structured-data');
  if (!script) {
    script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    document.head.append(script);
  }
  script.textContent = JSON.stringify(structuredData(route, locale, page));
}
