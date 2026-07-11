import airyCss from '../themes/airy.css?raw';
import calmCss from '../themes/calm.css?raw';
import crispCss from '../themes/crisp.css?raw';
import duskCss from '../themes/dusk.css?raw';
import freshCss from '../themes/fresh.css?raw';
import githubMarkdownCss from 'github-markdown-css/github-markdown-light.css?raw';
import githubOverridesCss from '../themes/github.css?raw';
import sharpCss from '../themes/sharp.css?raw';
import starkCss from '../themes/stark.css?raw';
import sternCss from '../themes/stern.css?raw';
import vividCss from '../themes/vivid.css?raw';
import warmCss from '../themes/warm.css?raw';
import type { BuiltInThemeId, Locale, ResumeSettings } from '../types';

export const DEFAULT_FONT_FAMILY = '苹果方正_Medium';

export const fontOptions = [
  { value: '阿里普惠体2-55-Regular', label: '阿里普惠体2-55-Regular', stack: '"Resume Alibaba PuHuiTi", "Resume Source Han Sans", sans-serif' },
  { value: '苹果方正_Medium', label: '苹果方正_Medium', stack: '"Resume PingFang", "PingFang SC", sans-serif' },
  { value: '思源黑体2.0_Normal', label: '思源黑体2.0_Normal', stack: '"Resume Source Han Sans", "Noto Sans CJK SC", sans-serif' },
  { value: '思源宋体', label: '思源宋体', stack: '"Resume Source Han Serif", "Noto Serif CJK SC", serif' },
  { value: 'Times-New-Roman', label: 'Times-New-Roman', stack: '"Resume Times New Roman", "Times New Roman", "Resume Source Han Serif", serif' },
] as const;

export function getFontStack(fontFamily: string) {
  return fontOptions.find((font) => font.value === fontFamily)?.stack
    ?? fontOptions.find((font) => font.value === DEFAULT_FONT_FAMILY)!.stack;
}

const githubCss = `${githubMarkdownCss.replace(/\.markdown-body\b/g, '.theme.github')}\n${githubOverridesCss}`;

export interface ThemeDefinition {
  id: BuiltInThemeId;
  name: string;
  tagline: string;
  defaults: ResumeSettings;
  css: string;
  custom: false;
}

const base: ResumeSettings = {
  theme: 'github', fontFamily: DEFAULT_FONT_FAMILY, fontSize: 14, headingScale: 1, lineHeight: 1.5,
  horizontalPadding: 24, verticalPadding: 0, headingColor: '#222222', textColor: '#444444',
  linkColor: '#1a73e8', accentColor: '#1a73e8', mutedColor: '#dddddd', sectionSpacing: 10, paperSize: 'A4',
  layoutDensity: 35,
};

const define = (id: BuiltInThemeId, name: string, tagline: string, css: string, values: Partial<ResumeSettings>): ThemeDefinition => ({
  id, name, tagline, css, custom: false, defaults: { ...base, ...values, theme: id },
});

export const themes: ThemeDefinition[] = [
  define('github', 'GitHub', '与 GitHub Markdown 一致的经典排版', githubCss, { fontSize: 16, horizontalPadding: 32, verticalPadding: 24, headingColor: '#1f2328', textColor: '#1f2328', linkColor: '#0969da', accentColor: '#d1d9e0', mutedColor: '#59636e', sectionSpacing: 24 }),
  define('crisp', '简约', '清晰克制的现代排版', crispCss, {}),
  define('vivid', '鲜明', '醒目的蓝色标题层级', vividCss, { headingColor: '#016ef1', textColor: '#222222' }),
  define('airy', '轻盈', '双字体与虚线标题', airyCss, {}),
  define('stark', '稳重', '衬线标题与经典结构', starkCss, { textColor: '#222222' }),
  define('calm', '沉静', '适合管理者的左侧强调线', calmCss, { headingColor: '#111827', textColor: '#374151', linkColor: '#059669', accentColor: '#059669', mutedColor: '#d1d5db' }),
  define('dusk', '暮色', '紫色顶线与大写小标题', duskCss, { headingColor: '#1e293b', textColor: '#334155', linkColor: '#7c3aed', accentColor: '#7c3aed', mutedColor: '#cbd5e1' }),
  define('sharp', '锐利', '面向开发者的代码风格', sharpCss, { headingColor: '#111827', textColor: '#374151', linkColor: '#4f46e5', accentColor: '#4f46e5', mutedColor: '#e0e7ff' }),
  define('warm', '暖调', '温暖而经典的衬线设计', warmCss, { lineHeight: 1.6, headingColor: '#1c1917', textColor: '#44403c', linkColor: '#c2410c', accentColor: '#c2410c', mutedColor: '#d6d3d1' }),
  define('stern', '严谨', '仅依靠字重建立层级', sternCss, { lineHeight: 1.55, headingColor: '#111827', textColor: '#374151', linkColor: '#111827', accentColor: '#111827', mutedColor: '#9ca3af' }),
  define('fresh', '清新', '描边徽章式章节标题', freshCss, { headingColor: '#111827', textColor: '#374151', linkColor: '#0f766e', accentColor: '#0f766e', mutedColor: '#ccfbf1' }),
];

const englishThemeCopy: Record<BuiltInThemeId, Pick<ThemeDefinition, 'name' | 'tagline'>> = {
  github: { name: 'GitHub', tagline: 'Classic styling aligned with GitHub Markdown' },
  crisp: { name: 'Crisp', tagline: 'Clean, restrained modern typography' },
  vivid: { name: 'Vivid', tagline: 'A bold blue heading hierarchy' },
  airy: { name: 'Airy', tagline: 'Dual typefaces with dashed headings' },
  stark: { name: 'Stark', tagline: 'Serif headings with a classic structure' },
  calm: { name: 'Calm', tagline: 'A subtle left accent for leadership resumes' },
  dusk: { name: 'Dusk', tagline: 'Purple top rules and uppercase section labels' },
  sharp: { name: 'Sharp', tagline: 'Code-inspired typography for developers' },
  warm: { name: 'Warm', tagline: 'A warm, classic serif presentation' },
  stern: { name: 'Stern', tagline: 'Hierarchy created entirely through weight' },
  fresh: { name: 'Fresh', tagline: 'Outlined badge-style section headings' },
};

export const getThemes = (locale: Locale = 'zh'): ThemeDefinition[] => locale === 'zh'
  ? themes
  : themes.map((theme) => ({ ...theme, ...englishThemeCopy[theme.id] }));

export const quickThemeIds: BuiltInThemeId[] = ['github', 'crisp', 'vivid', 'airy'];
export const getTheme = (id: string, locale: Locale = 'zh') => getThemes(locale).find((theme) => theme.id === id) ?? getThemes(locale)[0];
