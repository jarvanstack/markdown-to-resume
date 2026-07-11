import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Clock3, Files, FileText, Settings2 } from 'lucide-react';
import { PanelHeader } from './components/PanelHeader';
import { PaginatedResumePreview, resumeStyle } from './components/ResumePreview';
import { SettingsSidebar } from './components/SettingsSidebar';
import { TemplateCatalog, ThemeCatalog } from './components/CatalogPages';
import { getTemplate } from './data/templates';
import { getTheme, themes } from './data/themes';
import { createCustomTheme, loadCustomThemes, scopedCustomThemeCss, upsertCustomTheme } from './lib/customThemes';
import { LanguageSelect, useI18n } from './i18n';
import { loadState, saveState, STORAGE_KEY } from './lib/storage';
import type { CustomTheme, ExportFormat, Locale, PersistedState, ResumeSettings } from './types';

const MarkdownEditor = lazy(() => import('./components/MarkdownEditor').then((module) => ({ default: module.MarkdownEditor })));

function countResumeCharacters(markdown: string) {
  const plainText = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[`#>*_~|\-[\]()]/g, ' ')
    .replace(/\s+/g, '');
  return Array.from(plainText).length;
}

function initialState(customThemes: CustomTheme[], locale: Locale): PersistedState {
  const stored = loadState();
  const params = new URLSearchParams(window.location.search);
  const templateId = params.get('template');
  const themeId = params.get('theme');
  const template = templateId ? getTemplate(templateId, locale) : null;
  const customTheme = customThemes.find((theme) => theme.id === themeId);
  const validTheme = themeId && themes.some((theme) => theme.id === themeId) ? themeId : null;
  const storedThemeExists = themes.some((theme) => theme.id === stored.settings.theme) || customThemes.some((theme) => theme.id === stored.settings.theme);
  const storedSettings = storedThemeExists ? stored.settings : { ...stored.settings, theme: 'github' };
  const hasStoredState = localStorage.getItem(STORAGE_KEY) !== null;
  return {
    ...stored,
    markdown: template ? template.markdown : hasStoredState ? stored.markdown : getTemplate(stored.templateId, locale).markdown,
    templateId: template ? template.id : stored.templateId,
    settings: customTheme?.settings ?? { ...storedSettings, ...(validTheme ? { theme: validTheme } : {}) },
  };
}

function EditorApp() {
  const { locale, m } = useI18n();
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>(loadCustomThemes);
  const [state, setState] = useState<PersistedState>(() => initialState(customThemes, locale));
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [mobilePanel, setMobilePanel] = useState<'editor' | 'preview' | 'settings'>('editor');
  const [pageCount, setPageCount] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const previousLocale = useRef(locale);
  const characterCount = useMemo(() => countResumeCharacters(state.markdown), [state.markdown]);
  const readingMinutes = Math.max(1, Math.ceil(characterCount / 300));

  useEffect(() => {
    const timer = window.setTimeout(() => saveState(state), 120);
    return () => window.clearTimeout(timer);
  }, [state]);

  useEffect(() => {
    const previous = previousLocale.current;
    previousLocale.current = locale;
    if (previous === locale) return;
    setState((current) => {
      if (current.markdown !== getTemplate(current.templateId, previous).markdown) return current;
      const next = { ...current, markdown: getTemplate(current.templateId, locale).markdown };
      saveState(next);
      return next;
    });
  }, [locale]);

  const updateSetting = <K extends keyof ResumeSettings>(key: K, value: ResumeSettings[K]) => {
    setState((current) => ({ ...current, settings: { ...current.settings, [key]: value } }));
  };

  const loadTemplate = (id: string) => {
    const template = getTemplate(id, locale);
    setState((current) => ({ ...current, templateId: template.id, markdown: template.markdown }));
  };

  const selectTheme = (id: string) => {
    const customTheme = customThemes.find((theme) => theme.id === id);
    setState((current) => ({ ...current, settings: customTheme?.settings ?? { ...current.settings, theme: id } }));
  };

  const saveCurrentTheme = () => {
    const currentCustom = customThemes.find((theme) => theme.id === state.settings.theme);
    const currentBuiltIn = getTheme(state.settings.theme, locale);
    const name = window.prompt(m.saveCustomTheme, `${currentCustom?.name ?? currentBuiltIn.name} ${m.customSuffix}`);
    if (!name?.trim()) return;
    const theme = createCustomTheme(
      name,
      state.settings,
      currentCustom?.css ?? currentBuiltIn.css,
      currentCustom ? '.resume-theme' : currentBuiltIn.id,
    );
    const nextThemes = upsertCustomTheme(theme, customThemes);
    setCustomThemes(nextThemes);
    setState((current) => {
      const nextState = { ...current, settings: theme.settings };
      saveState(nextState);
      return nextState;
    });
  };

  const resetCurrentTheme = () => {
    const customTheme = customThemes.find((theme) => theme.id === state.settings.theme);
    const settings = customTheme?.settings ?? getTheme(state.settings.theme, locale).defaults;
    setState((current) => ({ ...current, settings: { ...settings } }));
  };

  const exportResume = async (format: ExportFormat) => {
    if (!previewRef.current || exporting) return;
    setExporting(format);
    try {
      const exporter = await import('./lib/export');
      if (format === 'pdf') await exporter.exportPdf(previewRef.current, state.settings.paperSize);
      else if (format === 'png') await exporter.exportPng(previewRef.current);
      else {
        const customTheme = customThemes.find((theme) => theme.id === state.settings.theme);
        const themeCss = customTheme ? scopedCustomThemeCss([customTheme]) : getTheme(state.settings.theme, locale).css;
        exporter.exportHtml(previewRef.current, themeCss, locale, m.resumeDocumentTitle);
      }
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className={`editor-app mobile-${mobilePanel}`}>
      <style>{scopedCustomThemeCss(customThemes)}</style>
      <nav className="mobile-panel-tabs" aria-label={m.workspace}>
        <button className={mobilePanel === 'editor' ? 'active' : ''} onClick={() => setMobilePanel('editor')}><FileText size={15} />{m.editor}</button>
        <button className={mobilePanel === 'preview' ? 'active' : ''} onClick={() => setMobilePanel('preview')}><FileText size={15} />{m.preview}</button>
        <button className={mobilePanel === 'settings' ? 'active' : ''} onClick={() => setMobilePanel('settings')}><Settings2 size={15} />{m.settings}</button>
        <LanguageSelect className="mobile-language-select" testId="mobile-language-select" />
      </nav>
      <main className="editor-layout">
        <section className="editor-column" data-testid="editor-column">
          <PanelHeader label="MARKDOWN" tone="editor" />
          <Suspense fallback={<div className="editor-loading">{m.loadingEditor}</div>}>
            <MarkdownEditor value={state.markdown} onChange={(markdown) => setState((current) => ({ ...current, markdown }))} />
          </Suspense>
        </section>
        <section className="preview-column" data-testid="preview-column">
          <PanelHeader label={m.preview} tone="preview">
            <div className="preview-stats" style={resumeStyle(state.settings)} aria-label={m.resumeStats}>
              <span><FileText size={13} />{characterCount}{m.characters}</span><i />
              <span><Clock3 size={13} />{readingMinutes}{m.minutes}</span><i />
              <span><Files size={13} />{pageCount}{m.pages}</span>
            </div>
          </PanelHeader>
          <div className="preview-stage"><PaginatedResumePreview markdown={state.markdown} settings={state.settings} previewRef={previewRef} onPageCount={setPageCount} /></div>
        </section>
        <SettingsSidebar
          settings={state.settings}
          templateId={state.templateId}
          customThemes={customThemes}
          exporting={exporting}
          onChange={updateSetting}
          onTemplate={loadTemplate}
          onTheme={selectTheme}
          onSaveTheme={saveCurrentTheme}
          onResetTheme={resetCurrentTheme}
          onExport={(format) => void exportResume(format)}
        />
      </main>
    </div>
  );
}

export default function App() {
  const path = useMemo(() => {
    const basePath = import.meta.env.BASE_URL.replace(/\/+$/, '');
    const pathname = basePath && window.location.pathname.startsWith(basePath)
      ? window.location.pathname.slice(basePath.length)
      : window.location.pathname;
    return pathname.replace(/\/+$/, '') || '/';
  }, []);
  if (path === '/themes') return <ThemeCatalog />;
  if (path === '/templates') return <TemplateCatalog />;
  return <EditorApp />;
}
