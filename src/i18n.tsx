import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Languages } from 'lucide-react';
import type { Locale } from './types';

export const LOCALE_STORAGE_KEY = 'markdown-resume-locale';

export const messages = {
  zh: {
    title: 'Markdown 简历编辑器', description: '支持中文和英文的 Markdown 简历编辑器，可导出 PDF、PNG 和 HTML。',
    language: '语言', chinese: '中文', english: 'English', workspace: '工作区', editor: '编辑', preview: '预览', settings: '设置', loadingEditor: '正在加载编辑器...', resumeStats: '简历统计', characters: '字', minutes: '分钟', pages: '页', markdownEditor: 'Markdown 编辑器',
    saveCustomTheme: '保存自定义主题', customSuffix: '自定义', exportFormat: '导出格式', image: '图片', exporting: '正在导出...', export: '导出', paperSize: '纸张尺寸', quickTemplates: '快速模板', moreTemplates: '更多模板', quickThemes: '快速主题', saveCurrentTheme: '保存当前主题', moreThemes: '更多主题', typography: '字体排版', resetTheme: '重置为主题配置', font: '字体', fontSize: '正文字号', lineHeight: '行高', headingScale: '标题比例', spacing: '间距', horizontalPadding: '左右页边距', verticalPadding: '上下页边距', sectionSpacing: '章节间距', colors: '颜色', heading: '标题', body: '正文', link: '链接', accent: '强调', muted: '次要信息',
    homeLabel: 'Markdown 简历编辑器首页', brand: 'Markdown简历', mainNavigation: '主导航', templates: '模板', themes: '主题', editorNav: '编辑器', openEditor: '打开编辑器', footer: '免费使用 · 数据仅保存在本地', download: '下载', downloaded: '已下载', renameCustomTheme: '重命名自定义主题', renamedTo: '已重命名为', deleteThemeConfirm: (name: string) => `删除自定义主题“${name}”？`, deleted: '已删除', imported: '已导入', importFailed: '主题导入失败', customThemeTagline: '保存在本地的自定义主题', resumeThemes: '简历主题', themeIntro: (count: number) => `${count} 套主题，支持中文和英文，并可自由调整字体、间距和颜色。`, importTheme: '导入主题', renameTheme: '重命名', deleteTheme: '删除', downloadCss: '下载 CSS', useTheme: '使用主题', resumeTemplates: '中文简历模板', templateIntro: (count: number) => `${count} 套岗位模板，提供中文和英文版本，可直接载入编辑器修改。`, useTemplate: '使用模板', resumeDocumentTitle: '简历',
  },
  en: {
    title: 'Markdown Resume Editor', description: 'A bilingual Markdown resume editor with PDF, PNG, and HTML export.',
    language: 'Language', chinese: '中文', english: 'English', workspace: 'Workspace', editor: 'Editor', preview: 'Preview', settings: 'Settings', loadingEditor: 'Loading editor...', resumeStats: 'Resume statistics', characters: 'chars', minutes: 'min', pages: 'pages', markdownEditor: 'Markdown editor',
    saveCustomTheme: 'Save custom theme', customSuffix: 'Custom', exportFormat: 'Export format', image: 'Image', exporting: 'Exporting...', export: 'Export', paperSize: 'Paper size', quickTemplates: 'Quick templates', moreTemplates: 'More templates', quickThemes: 'Quick themes', saveCurrentTheme: 'Save current theme', moreThemes: 'More themes', typography: 'Typography', resetTheme: 'Reset to theme defaults', font: 'Font', fontSize: 'Body size', lineHeight: 'Line height', headingScale: 'Heading scale', spacing: 'Spacing', horizontalPadding: 'Horizontal margins', verticalPadding: 'Vertical margins', sectionSpacing: 'Section spacing', colors: 'Colors', heading: 'Heading', body: 'Body', link: 'Link', accent: 'Accent', muted: 'Muted text',
    homeLabel: 'Markdown Resume Editor home', brand: 'Markdown Resume', mainNavigation: 'Main navigation', templates: 'Templates', themes: 'Themes', editorNav: 'Editor', openEditor: 'Open editor', footer: 'Free to use · Data stays on this device', download: 'Download', downloaded: 'Downloaded', renameCustomTheme: 'Rename custom theme', renamedTo: 'Renamed to', deleteThemeConfirm: (name: string) => `Delete custom theme “${name}”?`, deleted: 'Deleted', imported: 'Imported', importFailed: 'Theme import failed', customThemeTagline: 'Custom theme saved on this device', resumeThemes: 'Resume themes', themeIntro: (count: number) => `${count} themes for English and Chinese resumes, with fully adjustable typography, spacing, and colors.`, importTheme: 'Import theme', renameTheme: 'Rename', deleteTheme: 'Delete', downloadCss: 'Download CSS', useTheme: 'Use theme', resumeTemplates: 'Resume templates', templateIntro: (count: number) => `${count} role-specific templates with realistic structure and quantified achievements, ready to edit.`, useTemplate: 'Use template', resumeDocumentTitle: 'Resume',
  },
} as const;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  m: (typeof messages)[Locale];
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function detectLocale(language = navigator.language): Locale {
  return /^zh(?:-|$)/i.test(language) ? 'zh' : 'en';
}

function initialLocale(): Locale {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === 'zh' || stored === 'en' ? stored : detectLocale();
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const setLocale = (next: Locale) => {
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
    setLocaleState(next);
  };

  useEffect(() => {
    const m = messages[locale];
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
    document.title = m.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', m.description);
  }, [locale]);

  return <LocaleContext.Provider value={{ locale, setLocale, m: messages[locale] }}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useI18n must be used within LocaleProvider');
  return context;
}

export function LanguageSelect({ className = '', testId = 'language-select' }: { className?: string; testId?: string }) {
  const { locale, setLocale, m } = useI18n();
  return (
    <label className={`language-select${className ? ` ${className}` : ''}`}>
      <Languages size={15} aria-hidden="true" />
      <span className="sr-only">{m.language}</span>
      <select aria-label={m.language} data-testid={testId} value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
        <option value="zh">{m.chinese}</option>
        <option value="en">{m.english}</option>
      </select>
    </label>
  );
}
