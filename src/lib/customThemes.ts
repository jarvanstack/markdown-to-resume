import type { CustomTheme, PaperSize, ResumeSettings } from '../types';
import { DEFAULT_FONT_FAMILY } from '../data/themes';

export const CUSTOM_THEMES_KEY = 'markdown-resume-custom-themes-v1';
export const CUSTOM_THEME_LIMIT = 10;

const METADATA_START = '/* markdown-resume-theme:start */';
const METADATA_END = '/* markdown-resume-theme:end */';

const settingProperties: Record<Exclude<keyof ResumeSettings, 'theme'>, string> = {
  fontFamily: '--resume-font-family',
  fontSize: '--resume-font-size',
  headingScale: '--resume-heading-scale',
  lineHeight: '--resume-line-height',
  horizontalPadding: '--resume-horizontal-padding',
  verticalPadding: '--resume-vertical-padding',
  headingColor: '--resume-heading-color',
  textColor: '--resume-text-color',
  linkColor: '--resume-link-color',
  accentColor: '--resume-accent-color',
  mutedColor: '--resume-muted-color',
  sectionSpacing: '--resume-section-spacing',
  layoutDensity: '--resume-layout-density',
  paperSize: '--resume-paper-size',
};

function cleanName(name: string) {
  return name.replace(/[\u0000-\u001f{};]/g, '').trim().slice(0, 40) || '自定义主题';
}

function cssString(value: string) {
  return JSON.stringify(value);
}

function stripMetadata(css: string) {
  const start = css.indexOf(METADATA_START);
  const end = css.indexOf(METADATA_END);
  if (start < 0 || end < start) return css.trim();
  return `${css.slice(0, start)}${css.slice(end + METADATA_END.length)}`.trim();
}

export function serializeThemeCss(name: string, settings: ResumeSettings, sourceCss: string, sourceThemeId = settings.theme) {
  const portableCss = stripMetadata(sourceCss)
    .replace(new RegExp(`\\.theme\\.${sourceThemeId.replace(/[^a-z0-9-]/gi, '')}\\b`, 'g'), '.resume-theme');
  const metadata = [
    METADATA_START,
    '.resume-theme {',
    `  --resume-theme-name: ${cssString(cleanName(name))};`,
    `  --resume-font-family: ${cssString(settings.fontFamily)};`,
    `  --resume-font-size: ${settings.fontSize};`,
    `  --resume-heading-scale: ${settings.headingScale};`,
    `  --resume-line-height: ${settings.lineHeight};`,
    `  --resume-horizontal-padding: ${settings.horizontalPadding};`,
    `  --resume-vertical-padding: ${settings.verticalPadding};`,
    `  --resume-heading-color: ${settings.headingColor};`,
    `  --resume-text-color: ${settings.textColor};`,
    `  --resume-link-color: ${settings.linkColor};`,
    `  --resume-accent-color: ${settings.accentColor};`,
    `  --resume-muted-color: ${settings.mutedColor};`,
    `  --headerColor: ${settings.headingColor};`,
    `  --textColor: ${settings.textColor};`,
    `  --linkColor: ${settings.linkColor};`,
    `  --accentColor: ${settings.accentColor};`,
    `  --accentColorMuted: ${settings.accentColor}b3;`,
    `  --mutedColor: ${settings.mutedColor};`,
    `  --resume-section-spacing: ${settings.sectionSpacing};`,
    `  --resume-layout-density: ${settings.layoutDensity};`,
    `  --resume-paper-size: ${settings.paperSize};`,
    '}',
    METADATA_END,
  ].join('\n');
  return `${metadata}\n\n${portableCss}\n`;
}

function customId(now = Date.now()) {
  const random = Math.random().toString(36).slice(2, 8);
  return `custom-${now.toString(36)}-${random}`;
}

export function createCustomTheme(name: string, settings: ResumeSettings, sourceCss: string, sourceThemeId = settings.theme, now = Date.now(), id = customId(now)): CustomTheme {
  const safeName = cleanName(name);
  const nextSettings = { ...settings, theme: id };
  return {
    id,
    name: safeName,
    tagline: '保存在本地的自定义主题',
    settings: nextSettings,
    css: serializeThemeCss(safeName, nextSettings, sourceCss, sourceThemeId),
    createdAt: now,
    updatedAt: now,
    custom: true,
  };
}

function isCustomTheme(value: unknown): value is CustomTheme {
  if (!value || typeof value !== 'object') return false;
  const theme = value as Partial<CustomTheme>;
  return theme.custom === true && typeof theme.id === 'string' && /^custom-[a-z0-9-]+$/.test(theme.id)
    && typeof theme.name === 'string' && typeof theme.css === 'string' && typeof theme.createdAt === 'number'
    && typeof theme.updatedAt === 'number' && !!theme.settings && typeof theme.settings === 'object';
}

export function loadCustomThemes(storage: Pick<Storage, 'getItem'> = localStorage): CustomTheme[] {
  try {
    const raw = storage.getItem(CUSTOM_THEMES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCustomTheme).slice(-CUSTOM_THEME_LIMIT).map((theme) => ({
      ...theme,
      settings: { ...theme.settings },
    }));
  } catch {
    return [];
  }
}

export function persistCustomThemes(themes: CustomTheme[], storage: Pick<Storage, 'setItem'> = localStorage) {
  const limited = themes.slice(-CUSTOM_THEME_LIMIT);
  storage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(limited));
  return limited;
}

export function upsertCustomTheme(theme: CustomTheme, current = loadCustomThemes(), storage: Pick<Storage, 'setItem'> = localStorage) {
  return persistCustomThemes([...current.filter((item) => item.id !== theme.id), theme], storage);
}

export function deleteCustomTheme(id: string, current = loadCustomThemes(), storage: Pick<Storage, 'setItem'> = localStorage) {
  return persistCustomThemes(current.filter((theme) => theme.id !== id), storage);
}

export function renameCustomTheme(theme: CustomTheme, name: string): CustomTheme {
  const safeName = cleanName(name);
  return {
    ...theme,
    name: safeName,
    css: serializeThemeCss(safeName, theme.settings, theme.css),
    updatedAt: Date.now(),
  };
}

function unquote(value: string) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"')) {
    try { return JSON.parse(trimmed) as string; } catch { return trimmed.slice(1, -1); }
  }
  return trimmed;
}

function numberValue(style: CSSStyleDeclaration, key: keyof typeof settingProperties, min: number, max: number) {
  const value = Number(style.getPropertyValue(settingProperties[key]));
  if (!Number.isFinite(value) || value < min || value > max) throw new Error(`主题配置 ${key} 无效`);
  return value;
}

function colorValue(style: CSSStyleDeclaration, key: keyof typeof settingProperties) {
  const value = style.getPropertyValue(settingProperties[key]).trim();
  if (!/^#[0-9a-f]{6}$/i.test(value)) throw new Error(`主题配置 ${key} 无效`);
  return value.toLowerCase();
}

function splitSelectorList(selectorText: string) {
  const selectors: string[] = [];
  let start = 0;
  let parentheses = 0;
  let brackets = 0;
  let quote = '';
  for (let index = 0; index < selectorText.length; index += 1) {
    const character = selectorText[index];
    if (character === '\\') {
      index += 1;
    } else if (quote) {
      if (character === quote) quote = '';
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '(') {
      parentheses += 1;
    } else if (character === ')') {
      parentheses = Math.max(0, parentheses - 1);
    } else if (character === '[') {
      brackets += 1;
    } else if (character === ']') {
      brackets = Math.max(0, brackets - 1);
    } else if (character === ',' && parentheses === 0 && brackets === 0) {
      selectors.push(selectorText.slice(start, index).trim());
      start = index + 1;
    }
  }
  selectors.push(selectorText.slice(start).trim());
  return selectors;
}

function collectStyleRules(rules: CSSRuleList): CSSStyleRule[] {
  return Array.from(rules).flatMap((rule) => {
    if (rule.type === CSSRule.STYLE_RULE) return [rule as CSSStyleRule];
    if ('cssRules' in rule) return collectStyleRules((rule as CSSRule & { cssRules: CSSRuleList }).cssRules);
    return [];
  });
}

function isScopedSelector(selector: string) {
  const root = '.resume-theme';
  if (!selector.startsWith(root)) return false;
  const nextCharacter = selector[root.length];
  return !nextCharacter || !/[a-z0-9_-]/i.test(nextCharacter);
}

export function parseImportedTheme(css: string, now = Date.now()) {
  if (css.length > 500_000) throw new Error('主题文件不能超过 500KB');
  if (/\@import\b/i.test(css)) throw new Error('主题文件不能包含 @import');
  const styleElement = document.createElement('style');
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
  try {
    const styleRules = styleElement.sheet ? collectStyleRules(styleElement.sheet.cssRules) : [];
    if (!styleRules.length || styleRules.some((rule) => splitSelectorList(rule.selectorText).some((selector) => !isScopedSelector(selector)))) {
      throw new Error('主题样式必须使用 .resume-theme 作用域');
    }
    const metadata = styleRules.find((rule) => rule.style.getPropertyValue('--resume-theme-name'));
    if (!metadata) throw new Error('主题文件缺少配置');
    const style = metadata.style;
    const name = cleanName(unquote(style.getPropertyValue('--resume-theme-name')));
    const paper = style.getPropertyValue(settingProperties.paperSize).trim() as PaperSize;
    if (paper !== 'A4' && paper !== 'Letter') throw new Error('主题纸张尺寸无效');
    const id = customId(now);
    const settings: ResumeSettings = {
      theme: id,
      fontFamily: unquote(style.getPropertyValue(settingProperties.fontFamily)) || DEFAULT_FONT_FAMILY,
      fontSize: numberValue(style, 'fontSize', 8, 24),
      headingScale: numberValue(style, 'headingScale', 0.7, 1.5),
      lineHeight: numberValue(style, 'lineHeight', 0.5, 2),
      horizontalPadding: numberValue(style, 'horizontalPadding', 0, 48),
      verticalPadding: numberValue(style, 'verticalPadding', 0, 48),
      headingColor: colorValue(style, 'headingColor'),
      textColor: colorValue(style, 'textColor'),
      linkColor: colorValue(style, 'linkColor'),
      accentColor: colorValue(style, 'accentColor'),
      mutedColor: colorValue(style, 'mutedColor'),
      sectionSpacing: numberValue(style, 'sectionSpacing', 8, 48),
      layoutDensity: numberValue(style, 'layoutDensity', 0, 100),
      paperSize: paper,
    };
    return createCustomTheme(name, settings, css, '.resume-theme', now, id);
  } finally {
    styleElement.remove();
  }
}

export function scopedCustomThemeCss(themes: CustomTheme[]) {
  return themes.map((theme) => theme.css.replace(/\.resume-theme\b/g, `.theme.${theme.id}`)).join('\n');
}

export function downloadThemeCss(name: string, css: string) {
  const blob = new Blob([css], { type: 'text/css;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${cleanName(name).replace(/\s+/g, '-').toLowerCase() || 'resume-theme'}.css`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
