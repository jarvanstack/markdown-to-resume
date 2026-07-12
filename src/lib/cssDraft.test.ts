import { describe, expect, it } from 'vitest';
import { RUNTIME_THEME_CLASS, THEME_CSS_DRAFT_LIMIT, THEME_CSS_DRAFTS_KEY, THEME_CSS_MAX_LENGTH, loadThemeCssDrafts, normalizeThemeCss, portableThemeCss, runtimeThemeCss, safeRuntimeThemeCss, saveThemeCssDrafts } from './cssDraft';

function memoryStorage(initial?: unknown) {
  const values = new Map<string, string>(initial === undefined ? [] : [[THEME_CSS_DRAFTS_KEY, typeof initial === 'string' ? initial : JSON.stringify(initial)]]);
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe('per-theme CSS persistence', () => {
  it('loads and saves independent documents by theme id', () => {
    const storage = memoryStorage();
    const drafts = { github: '.theme.github { color: red; }', vivid: '.theme.vivid { color: blue; }' };
    expect(loadThemeCssDrafts(storage)).toEqual({});
    expect(saveThemeCssDrafts(drafts, storage)).toEqual(drafts);
    expect(loadThemeCssDrafts(storage)).toEqual(drafts);
  });

  it('drops invalid ids, oversized documents, malformed values, and excess entries', () => {
    const entries = Object.fromEntries(Array.from({ length: THEME_CSS_DRAFT_LIMIT + 2 }, (_, index) => [`theme-${index}`, `/* ${index} */`]));
    const storage = memoryStorage({ 'bad id': 'x', oversized: 'x'.repeat(THEME_CSS_MAX_LENGTH + 1), ...entries });
    const drafts = loadThemeCssDrafts(storage);
    expect(Object.keys(drafts)).toHaveLength(THEME_CSS_DRAFT_LIMIT);
    expect(drafts['bad id']).toBeUndefined();
    expect(drafts.oversized).toBeUndefined();
    expect(loadThemeCssDrafts(memoryStorage('{bad json'))).toEqual({});
    expect(normalizeThemeCss('x'.repeat(THEME_CSS_MAX_LENGTH + 1))).toHaveLength(THEME_CSS_MAX_LENGTH);
  });
});

describe('theme CSS runtime scoping', () => {
  const runtimeRoot = `.theme.${RUNTIME_THEME_CLASS}`;

  it('replaces a built-in theme root and scopes newly added selectors', () => {
    const css = runtimeThemeCss('.theme.github, .theme.github h1, p > a { color: red; }', 'github');
    expect(css).toContain(`${runtimeRoot}, ${runtimeRoot} h1, ${runtimeRoot} p > a`);
    expect(css).not.toContain('.theme.github');
  });

  it('replaces the portable root used by custom themes', () => {
    const css = runtimeThemeCss('.resume-theme { color: red; } .resume-theme h2 { margin: 0; }', 'custom-one', true);
    expect(css).toContain(`${runtimeRoot} { color: red; }`);
    expect(css).toContain(`${runtimeRoot} h2`);
  });

  it('normalizes resume-root and root selectors to the runtime theme', () => {
    const css = runtimeThemeCss('.resume-sheet h2, :root[data-paper="a4"] { margin: 0; }', 'github');
    expect(css).toContain(`${runtimeRoot} h2`);
    expect(css).toContain(`${runtimeRoot}[data-paper="a4"]`);
  });

  it('scopes conditional rules while preserving keyframe steps', () => {
    const css = runtimeThemeCss('@media print { body, h1 { color: black; } } @keyframes fade { from { opacity: 0; } to { opacity: 1; } }', 'github');
    expect(css).toContain(`${runtimeRoot} body, ${runtimeRoot} h1`);
    expect(css).toContain('@keyframes fade { from { opacity: 0; } to { opacity: 1; } }');
    expect(css).not.toContain(`${runtimeRoot} from`);
  });

  it('removes imports and prevents application-shell selectors from matching the shell', () => {
    const css = runtimeThemeCss('@import url("https://example.com/theme.css"); .panel-header { color: red; }', 'github');
    expect(css).not.toContain('@import');
    expect(css).toContain(`${runtimeRoot} .panel-header`);
  });

  it('uses the original theme when an edited document is malformed', () => {
    expect(() => runtimeThemeCss('h1 {', 'github')).toThrow();
    expect(safeRuntimeThemeCss('h1 {', '.theme.github h1 { color: blue; }', 'github')).toContain(`${runtimeRoot} h1 { color: blue; }`);
  });

  it('serializes edited and newly added rules to the portable custom-theme root', () => {
    const css = portableThemeCss('.theme.github h1 { color: red; } p { margin: 0; }', '.theme.github {}', 'github');
    expect(css).toContain('.resume-theme h1');
    expect(css).toContain('.resume-theme p');
    expect(css).not.toContain(RUNTIME_THEME_CLASS);
  });
});
