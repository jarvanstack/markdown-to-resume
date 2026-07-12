import postcss, { type AtRule, type Node, type Rule } from 'postcss';

export const THEME_CSS_DRAFTS_KEY = 'markdown-resume-theme-css-v1';
export const THEME_CSS_MAX_LENGTH = 500_000;
export const THEME_CSS_DRAFT_LIMIT = 32;
export const RUNTIME_THEME_CLASS = 'css-editor-theme';

const RUNTIME_THEME_ROOT = `.theme.${RUNTIME_THEME_CLASS}`;

export type ThemeCssDrafts = Record<string, string>;

function isThemeId(value: string) {
  return /^[a-z0-9-]+$/i.test(value);
}

export function normalizeThemeCss(css: string) {
  return css.slice(0, THEME_CSS_MAX_LENGTH);
}

function normalizeDrafts(drafts: ThemeCssDrafts) {
  return Object.fromEntries(Object.entries(drafts)
    .filter(([id, css]) => isThemeId(id) && typeof css === 'string' && css.length <= THEME_CSS_MAX_LENGTH)
    .slice(-THEME_CSS_DRAFT_LIMIT));
}

export function loadThemeCssDrafts(storage: Pick<Storage, 'getItem'> = localStorage): ThemeCssDrafts {
  try {
    const raw = storage.getItem(THEME_CSS_DRAFTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? normalizeDrafts(parsed as ThemeCssDrafts) : {};
  } catch {
    return {};
  }
}

export function saveThemeCssDrafts(drafts: ThemeCssDrafts, storage: Pick<Storage, 'setItem'> = localStorage) {
  const normalized = normalizeDrafts(drafts);
  storage.setItem(THEME_CSS_DRAFTS_KEY, JSON.stringify(normalized));
  return normalized;
}

function hasSelectorRoot(selector: string, root: string) {
  if (!selector.startsWith(root)) return false;
  const nextCharacter = selector[root.length];
  return !nextCharacter || !/[a-z0-9_-]/i.test(nextCharacter);
}

function replaceSelectorRoot(selector: string, sourceRoot: string) {
  const trimmed = selector.trim();
  for (const root of [RUNTIME_THEME_ROOT, sourceRoot, '.resume-theme', '.resume-sheet', ':root']) {
    if (hasSelectorRoot(trimmed, root)) return `${RUNTIME_THEME_ROOT}${trimmed.slice(root.length)}`;
  }
  return `${RUNTIME_THEME_ROOT} ${trimmed}`;
}

function isKeyframeStep(rule: Rule) {
  let parent: Node | undefined = rule.parent;
  while (parent) {
    if (parent.type === 'atrule' && /keyframes$/i.test((parent as AtRule).name)) return true;
    parent = parent.parent;
  }
  return false;
}

export function runtimeThemeCss(css: string, themeId: string, custom = false) {
  if (!css.trim()) return '';
  const safeThemeId = isThemeId(themeId) ? themeId : '';
  const sourceRoot = custom ? '.resume-theme' : `.theme.${safeThemeId}`;
  const root = postcss.parse(css);
  root.walkAtRules(/^import$/i, (rule) => {
    rule.remove();
  });
  root.walkRules((rule) => {
    if (!isKeyframeStep(rule)) rule.selectors = rule.selectors.map((selector) => replaceSelectorRoot(selector, sourceRoot));
  });
  return root.toString();
}

export function safeRuntimeThemeCss(css: string, fallbackCss: string, themeId: string, custom = false) {
  try {
    return runtimeThemeCss(css, themeId, custom);
  } catch {
    try {
      return runtimeThemeCss(fallbackCss, themeId, custom);
    } catch {
      return '';
    }
  }
}

export function portableThemeCss(css: string, fallbackCss: string, themeId: string, custom = false) {
  return safeRuntimeThemeCss(css, fallbackCss, themeId, custom)
    .replaceAll(`.theme.${RUNTIME_THEME_CLASS}`, '.resume-theme');
}
