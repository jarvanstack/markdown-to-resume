import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Languages } from 'lucide-react';
import { applyPageSeo } from './lib/seo';
import type { Locale } from './types';

export const LOCALE_STORAGE_KEY = 'markdown-resume-locale';

export const messages = {
  zh: {
    language: '语言', chinese: '中文', english: 'English', workspace: '工作区', editor: '编辑', preview: '预览', settings: '设置', loadingEditor: '正在加载编辑器...', resumeStats: '简历统计', characters: '字', minutes: '分钟', pages: '页', markdownEditor: 'Markdown 编辑器',
    saveCustomTheme: '保存自定义主题', customSuffix: '自定义', exportFormat: '导出格式', image: '图片', exporting: '正在导出...', export: '导出', paperSize: '纸张尺寸', quickTemplates: '快速模板', moreTemplates: '更多模板', quickThemes: '快速主题', saveCurrentTheme: '保存当前主题', moreThemes: '更多主题', typography: '字体排版', resetTheme: '重置为主题配置', font: '字体', fontSize: '正文字号', lineHeight: '行高', headingScale: '标题比例', spacing: '间距', horizontalPadding: '左右页边距', verticalPadding: '上下页边距', sectionSpacing: '章节间距', colors: '颜色', heading: '标题', body: '正文', link: '链接', accent: '强调', muted: '次要信息',
    homeLabel: 'Markdown 简历编辑器首页', brand: 'Markdown简历', mainNavigation: '主导航', templates: '模板', themes: '主题', editorNav: '编辑器', openEditor: '打开编辑器', footer: '免费使用 · 数据仅保存在本地', download: '下载', downloaded: '已下载', renameCustomTheme: '重命名自定义主题', renamedTo: '已重命名为', deleteThemeConfirm: (name: string) => `删除自定义主题“${name}”？`, deleted: '已删除', imported: '已导入', importFailed: '主题导入失败', customThemeTagline: '保存在本地的自定义主题', resumeThemes: '简历主题', themeIntro: (count: number) => `${count} 套主题，支持中文和英文，并可自由调整字体、间距和颜色。`, importTheme: '导入主题', renameTheme: '重命名', deleteTheme: '删除', downloadCss: '下载 CSS', useTheme: '使用主题', resumeTemplates: '中文简历模板', templateIntro: (count: number) => `${count} 套岗位模板，提供中文和英文版本，可直接载入编辑器修改。`, useTemplate: '使用模板', resumeDocumentTitle: '简历',
    templateGuideTitle: '如何选择合适的简历模板', templateGuideIntro: '先根据目标岗位选择信息结构，再用量化成果替换示例内容。所有模板都使用标准 Markdown，载入后可以自由增删章节。',
    templateGuidePoints: [
      { title: '岗位结构已经整理', text: '技术、产品、数据、设计、管理和学生模板分别突出招聘者最关注的经历与能力。' },
      { title: '用成果替代职责', text: '模板中的经历示例采用行动、方法和结果结构，方便改写成带数据的真实工作成果。' },
      { title: '直接导出投递', text: '实时检查 A4 或 Letter 分页，完成后导出 PDF，也可保存 PNG 或独立 HTML。' },
    ],
    templateFaqTitle: '简历模板常见问题', templateFaq: [
      { question: '这些中文简历模板可以免费使用吗？', answer: '可以。所有内置模板都能免费载入、编辑和导出，无需注册账号。' },
      { question: 'Markdown 简历可以导出 PDF 吗？', answer: '可以。编辑器会实时显示分页效果，并支持导出 A4 或 Letter 尺寸的 PDF。' },
      { question: '简历内容会上传到服务器吗？', answer: '不会。编辑内容和自定义配置默认只保存在当前浏览器的本地存储中。' },
    ],
    themeGuideTitle: '让 PDF 简历保持清晰、专业的排版', themeGuideIntro: '简历主题负责字体、层级、留白和颜色。选择接近目标行业气质的主题后，只需少量调整即可保持整份简历一致。',
    themeGuidePoints: [
      { title: '适配中文与英文', text: '主题针对中英文混排、长链接、列表和表格做了处理，避免导出时出现乱码或溢出。' },
      { title: '精确控制版面', text: '可以调整字体、字号、行高、标题比例、章节间距和页边距，并即时查看分页变化。' },
      { title: '主题可以复用', text: '满意的配置可保存为自定义主题，也可下载 CSS 文件用于备份或分享。' },
    ],
    themeFaqTitle: '简历排版常见问题', themeFaq: [
      { question: '哪种简历主题更适合技术岗位？', answer: 'GitHub、清晰和简约主题信息密度适中、层级明确，适合工程师和数据岗位。' },
      { question: '怎样把两页简历调整为一页？', answer: '可先使用智能一页功能，再微调正文字号、行高、章节间距和上下页边距。' },
      { question: '自定义主题会丢失吗？', answer: '主题保存在当前浏览器中。需要跨设备使用时，可以下载 CSS 后在另一台设备导入。' },
    ],
  },
  en: {
    language: 'Language', chinese: '中文', english: 'English', workspace: 'Workspace', editor: 'Editor', preview: 'Preview', settings: 'Settings', loadingEditor: 'Loading editor...', resumeStats: 'Resume statistics', characters: 'chars', minutes: 'min', pages: 'pages', markdownEditor: 'Markdown editor',
    saveCustomTheme: 'Save custom theme', customSuffix: 'Custom', exportFormat: 'Export format', image: 'Image', exporting: 'Exporting...', export: 'Export', paperSize: 'Paper size', quickTemplates: 'Quick templates', moreTemplates: 'More templates', quickThemes: 'Quick themes', saveCurrentTheme: 'Save current theme', moreThemes: 'More themes', typography: 'Typography', resetTheme: 'Reset to theme defaults', font: 'Font', fontSize: 'Body size', lineHeight: 'Line height', headingScale: 'Heading scale', spacing: 'Spacing', horizontalPadding: 'Horizontal margins', verticalPadding: 'Vertical margins', sectionSpacing: 'Section spacing', colors: 'Colors', heading: 'Heading', body: 'Body', link: 'Link', accent: 'Accent', muted: 'Muted text',
    homeLabel: 'Markdown Resume Editor home', brand: 'Markdown Resume', mainNavigation: 'Main navigation', templates: 'Templates', themes: 'Themes', editorNav: 'Editor', openEditor: 'Open editor', footer: 'Free to use · Data stays on this device', download: 'Download', downloaded: 'Downloaded', renameCustomTheme: 'Rename custom theme', renamedTo: 'Renamed to', deleteThemeConfirm: (name: string) => `Delete custom theme “${name}”?`, deleted: 'Deleted', imported: 'Imported', importFailed: 'Theme import failed', customThemeTagline: 'Custom theme saved on this device', resumeThemes: 'Resume themes', themeIntro: (count: number) => `${count} themes for English and Chinese resumes, with fully adjustable typography, spacing, and colors.`, importTheme: 'Import theme', renameTheme: 'Rename', deleteTheme: 'Delete', downloadCss: 'Download CSS', useTheme: 'Use theme', resumeTemplates: 'Resume templates', templateIntro: (count: number) => `${count} role-specific templates with realistic structure and quantified achievements, ready to edit.`, useTemplate: 'Use template', resumeDocumentTitle: 'Resume',
    templateGuideTitle: 'How to choose a resume template', templateGuideIntro: 'Start with a structure designed for your target role, then replace every example with concise, measurable evidence. Each template uses standard Markdown, so every section remains editable.',
    templateGuidePoints: [
      { title: 'Role-specific structure', text: 'Engineering, product, data, design, management, and student templates emphasize the evidence recruiters expect.' },
      { title: 'Achievement-led examples', text: 'Experience samples follow an action, method, and result structure that is easy to rewrite with your own metrics.' },
      { title: 'Ready to submit', text: 'Check A4 or Letter pagination live, then export a PDF, PNG image, or standalone HTML file.' },
    ],
    templateFaqTitle: 'Resume template FAQ', templateFaq: [
      { question: 'Are these resume templates free?', answer: 'Yes. Every built-in template is free to load, edit, and export without creating an account.' },
      { question: 'Can a Markdown resume be exported to PDF?', answer: 'Yes. The editor previews each page live and exports PDF in either A4 or Letter format.' },
      { question: 'Is my resume uploaded to a server?', answer: 'No. Your resume content and custom settings stay in local browser storage by default.' },
    ],
    themeGuideTitle: 'Create a clear, professional PDF resume layout', themeGuideIntro: 'A resume theme controls typography, hierarchy, spacing, and color. Pick a style that fits your field, then make small adjustments while preserving consistency.',
    themeGuidePoints: [
      { title: 'English and Chinese ready', text: 'Themes handle mixed scripts, long links, lists, and tables without broken characters or export overflow.' },
      { title: 'Precise layout control', text: 'Adjust font, size, line height, heading scale, section spacing, and page margins while watching pagination update.' },
      { title: 'Reusable themes', text: 'Save a finished design as a custom theme, or download its CSS for backup and sharing.' },
    ],
    themeFaqTitle: 'Resume layout FAQ', themeFaq: [
      { question: 'Which theme works best for technical roles?', answer: 'GitHub, Crisp, and minimal themes provide clear hierarchy and balanced density for engineering and data roles.' },
      { question: 'How can I fit a two-page resume onto one page?', answer: 'Use Smart one-page first, then fine-tune body size, line height, section spacing, and vertical margins.' },
      { question: 'Will my custom theme be lost?', answer: 'It stays in this browser. To use it on another device, download the CSS and import it there.' },
    ],
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
    applyPageSeo(locale, window.location.pathname, import.meta.env.BASE_URL);
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
