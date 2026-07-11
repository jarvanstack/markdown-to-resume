import { describe, expect, it } from 'vitest';
import { getTemplates, templates } from '../data/templates';
import { themes } from '../data/themes';
import { detectLocale } from '../i18n';
import { createCustomTheme, CUSTOM_THEME_LIMIT, CUSTOM_THEMES_KEY, deleteCustomTheme, loadCustomThemes, persistCustomThemes } from './customThemes';
import { defaultSettings, defaultState, loadState, saveState, STORAGE_KEY } from './storage';

describe('中文简历数据', () => {
  it('包含 GitHub 在内的 11 个主题和 18 个岗位模板', () => {
    expect(themes).toHaveLength(11);
    expect(new Set(themes.map((theme) => theme.id)).size).toBe(11);
    expect(templates).toHaveLength(18);
    expect(new Set(templates.map((template) => template.id)).size).toBe(18);
    expect(templates.every((template) => template.markdown.includes('## 工作经历'))).toBe(true);
  });

  it('默认使用中文前端模板和 GitHub 官方排版参数', () => {
    const state = loadState({ getItem: () => null });
    expect(state.version).toBe(3);
    expect(state.templateId).toBe('frontend-developer');
    expect(state.markdown).toContain('前端开发工程师');
    expect(state.settings.theme).toBe('github');
    expect(state.settings).toMatchObject({
      theme: 'github',
      fontFamily: '苹果方正_Medium',
      fontSize: 16,
      lineHeight: 1.5,
      headingColor: '#1f2328',
      textColor: '#1f2328',
      linkColor: '#0969da',
      accentColor: '#d1d9e0',
      mutedColor: '#59636e',
      sectionSpacing: 24,
    });
    expect(state.settings).toEqual(defaultSettings);
  });

  it('GitHub 主题包含固定版本的完整 Markdown 样式并保持可移植作用域', () => {
    const github = themes.find((theme) => theme.id === 'github')!;
    expect(github.css).toContain('.theme.github .task-list-item');
    expect(github.css).toContain('white-space: break-spaces');
    expect(github.css).toContain('.theme.github .markdown-alert');
    expect(github.css).not.toContain('.markdown-body');
    expect(github.css).not.toContain('@import');
  });

  it('合并已保存设置并补齐新增字段', () => {
    const state = loadState({ getItem: () => JSON.stringify({ settings: { fontSize: 12, horizontalPadding: 36 }, markdown: '# 我的简历' }) });
    expect(state.settings.fontSize).toBe(12);
    expect(state.settings.horizontalPadding).toBe(36);
    expect(state.settings.sectionSpacing).toBe(defaultSettings.sectionSpacing);
    expect(state.markdown).toBe('# 我的简历');
  });

  it('保存单一版本化状态并从损坏数据恢复', () => {
    const values = new Map<string, string>();
    saveState(defaultState, { setItem: (key, value) => values.set(key, value) });
    expect(JSON.parse(values.get(STORAGE_KEY)!)).toEqual(defaultState);
    expect(loadState({ getItem: () => '{broken' })).toEqual(defaultState);
  });

  it('自定义主题 CSS 包含全部可调配置', () => {
    const theme = createCustomTheme('我的主题', { ...defaultSettings, fontSize: 12, lineHeight: 0.8 }, themes[0].css, 'github', 1, 'custom-test');
    expect(theme.css).toContain('.resume-theme');
    expect(theme.css).toContain('--resume-theme-name: "我的主题"');
    expect(theme.css).toContain('--resume-font-size: 12');
    expect(theme.css).toContain('--resume-line-height: 0.8');
    expect(theme.css).toContain('--resume-layout-density: 35');
    expect(theme.css).toContain('--resume-heading-color: #1f2328');
    expect(theme.css).not.toContain('.theme.github');
  });

  it('自定义主题超过 10 个时删除最旧主题', () => {
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
    const customThemes = Array.from({ length: CUSTOM_THEME_LIMIT + 1 }, (_, index) => createCustomTheme(`主题 ${index}`, defaultSettings, themes[0].css, 'github', index + 1, `custom-${index}`));
    persistCustomThemes(customThemes, storage);
    const loaded = loadCustomThemes(storage);
    expect(loaded).toHaveLength(CUSTOM_THEME_LIMIT);
    expect(loaded[0].id).toBe('custom-1');
    expect(loaded.at(-1)?.id).toBe('custom-10');
    expect(JSON.parse(values.get(CUSTOM_THEMES_KEY)!)).toHaveLength(CUSTOM_THEME_LIMIT);
  });

  it('可以删除指定自定义主题', () => {
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
    const first = createCustomTheme('主题一', defaultSettings, themes[0].css, 'github', 1, 'custom-first');
    const second = createCustomTheme('主题二', defaultSettings, themes[0].css, 'github', 2, 'custom-second');
    const next = deleteCustomTheme(first.id, [first, second], storage);
    expect(next.map((theme) => theme.id)).toEqual(['custom-second']);
    expect(loadCustomThemes(storage).map((theme) => theme.id)).toEqual(['custom-second']);
  });
});

describe('国际化资源', () => {
  it('仅将中文系统语言识别为中文', () => {
    expect(detectLocale('zh-CN')).toBe('zh');
    expect(detectLocale('zh-TW')).toBe('zh');
    expect(detectLocale('en-US')).toBe('en');
    expect(detectLocale('ja-JP')).toBe('en');
  });

  it('为全部 18 个模板提供对应的英文版本', () => {
    const englishTemplates = getTemplates('en');
    expect(englishTemplates).toHaveLength(18);
    expect(englishTemplates.map((template) => template.id)).toEqual(templates.map((template) => template.id));
    expect(englishTemplates.every((template) => template.markdown.includes('## Experience'))).toBe(true);
    expect(englishTemplates[0].markdown).toContain('Frontend Engineer');
  });
});
