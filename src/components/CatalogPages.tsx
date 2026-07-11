import { useEffect, useRef, useState } from 'react';
import { Download, FileText, Palette, Pencil, Trash2, Upload } from 'lucide-react';
import { getThemes } from '../data/themes';
import { getTemplates } from '../data/templates';
import { LanguageSelect, useI18n } from '../i18n';
import { deleteCustomTheme, downloadThemeCss, loadCustomThemes, parseImportedTheme, renameCustomTheme, scopedCustomThemeCss, serializeThemeCss, upsertCustomTheme } from '../lib/customThemes';
import type { CustomTheme } from '../types';
import { ResumePreview } from './ResumePreview';

function Logo() {
  const { m } = useI18n();
  return <a className="catalog-logo" href={import.meta.env.BASE_URL} aria-label={m.homeLabel}><img src={`${import.meta.env.BASE_URL}moli-icon.svg`} alt="" /><strong>{m.brand}</strong></a>;
}

function CatalogHeader() {
  const { m } = useI18n();
  return (
    <header className="catalog-header">
      <div className="catalog-header-inner">
        <Logo />
        <nav aria-label={m.mainNavigation}><a href={`${import.meta.env.BASE_URL}templates`}>{m.templates}</a><a href={`${import.meta.env.BASE_URL}themes`}>{m.themes}</a><a href={import.meta.env.BASE_URL}>{m.editorNav}</a></nav>
        <div className="catalog-header-actions"><LanguageSelect /><a className="open-editor" href={import.meta.env.BASE_URL}>{m.openEditor}</a></div>
      </div>
    </header>
  );
}

function CatalogShell({ children }: { children: React.ReactNode }) {
  const { m } = useI18n();
  useEffect(() => {
    document.body.classList.add('catalog-scroll');
    return () => document.body.classList.remove('catalog-scroll');
  }, []);
  return <div className="catalog-page"><CatalogHeader /><main className="catalog-main">{children}</main><footer className="catalog-footer"><Logo /><span>{m.footer}</span></footer></div>;
}

function CatalogSeoContent({ type }: { type: 'templates' | 'themes' }) {
  const { m } = useI18n();
  const content = type === 'templates'
    ? { title: m.templateGuideTitle, intro: m.templateGuideIntro, points: m.templateGuidePoints, faqTitle: m.templateFaqTitle, faq: m.templateFaq }
    : { title: m.themeGuideTitle, intro: m.themeGuideIntro, points: m.themeGuidePoints, faqTitle: m.themeFaqTitle, faq: m.themeFaq };
  return (
    <section className="catalog-seo" aria-labelledby={`${type}-guide-title`}>
      <h2 id={`${type}-guide-title`}>{content.title}</h2>
      <p className="catalog-seo-intro">{content.intro}</p>
      <div className="catalog-seo-points">
        {content.points.map((point) => <div key={point.title}><h3>{point.title}</h3><p>{point.text}</p></div>)}
      </div>
      <h2>{content.faqTitle}</h2>
      <dl className="catalog-faq">
        {content.faq.map((item) => <div key={item.question}><dt>{item.question}</dt><dd>{item.answer}</dd></div>)}
      </dl>
    </section>
  );
}

export function ThemeCatalog() {
  const { locale, m } = useI18n();
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>(loadCustomThemes);
  const [status, setStatus] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const allThemes = [
    ...[...customThemes].reverse().map((theme) => ({ ...theme, defaults: theme.settings })),
    ...getThemes(locale),
  ];

  const download = (theme: (typeof allThemes)[number]) => {
    const css = theme.custom ? theme.css : serializeThemeCss(theme.name, theme.defaults, theme.css, theme.id);
    downloadThemeCss(theme.name, css);
    setStatus(`${m.downloaded} ${theme.name}`);
  };

  const rename = (theme: CustomTheme) => {
    const name = window.prompt(m.renameCustomTheme, theme.name);
    if (!name?.trim()) return;
    const renamed = renameCustomTheme(theme, name);
    const next = upsertCustomTheme(renamed, customThemes);
    setCustomThemes(next);
    setStatus(`${m.renamedTo} ${renamed.name}`);
  };

  const remove = (theme: CustomTheme) => {
    if (!window.confirm(m.deleteThemeConfirm(theme.name))) return;
    setCustomThemes(deleteCustomTheme(theme.id, customThemes));
    setStatus(`${m.deleted} ${theme.name}`);
  };

  const importTheme = async (file: File) => {
    try {
      const imported = parseImportedTheme(await file.text());
      const next = upsertCustomTheme(imported, customThemes);
      setCustomThemes(next);
      setStatus(`${m.imported} ${imported.name}`);
    } catch (error) {
      setStatus(locale === 'zh' && error instanceof Error ? error.message : m.importFailed);
    }
  };

  return (
    <CatalogShell>
      <style>{scopedCustomThemeCss(customThemes)}</style>
      <div className="catalog-intro"><span className="catalog-icon"><Palette size={18} /></span><div><h1>{m.resumeThemes}</h1><p>{m.themeIntro(allThemes.length)}</p></div><div className="catalog-intro-actions"><button title={m.importTheme} aria-label={m.importTheme} onClick={() => fileInput.current?.click()}><Upload size={16} /></button><input ref={fileInput} type="file" accept=".css,text/css" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importTheme(file); event.target.value = ''; }} /></div></div>
      <div className="catalog-status" role="status">{status}</div>
      <div className="theme-catalog-grid">
        {allThemes.map((theme) => (
          <article className="theme-card" key={theme.id}>
            <div className="theme-card-preview"><div className="theme-preview-scale"><ResumePreview compact markdown={getTemplates(locale)[0].markdown} settings={theme.defaults} /></div></div>
            <div className="theme-card-info"><div><h2>{theme.name}</h2><p>{theme.custom ? m.customThemeTagline : theme.tagline}</p></div><div className="theme-card-actions">{theme.custom && <button title={m.renameTheme} aria-label={`${m.renameTheme} ${theme.name}`} onClick={() => rename(theme)}><Pencil size={14} /></button>}{theme.custom && <button className="danger" title={m.deleteTheme} aria-label={`${m.deleteTheme} ${theme.name}`} onClick={() => remove(theme)}><Trash2 size={14} /></button>}<button title={m.downloadCss} aria-label={`${m.download} ${theme.name}`} onClick={() => download(theme)}><Download size={14} /></button><a href={`${import.meta.env.BASE_URL}?theme=${theme.id}`}>{m.useTheme}</a></div></div>
          </article>
        ))}
      </div>
      <CatalogSeoContent type="themes" />
    </CatalogShell>
  );
}

export function TemplateCatalog() {
  const { locale, m } = useI18n();
  const templates = getTemplates(locale);
  const categories = Array.from(new Set(templates.map((template) => template.category)));
  return (
    <CatalogShell>
      <div className="catalog-intro"><span className="catalog-icon"><FileText size={18} /></span><div><h1>{m.resumeTemplates}</h1><p>{m.templateIntro(templates.length)}</p></div></div>
      {categories.map((category) => (
        <section className="template-category" key={category}>
          <h2>{category}</h2>
          <div className="template-catalog-grid">
            {templates.filter((template) => template.category === category).map((template) => (
              <a className="template-card" href={`${import.meta.env.BASE_URL}?template=${template.id}`} key={template.id}>
                <div><h3>{template.title}</h3><span>{template.category}</span></div>
                <p>{template.description}</p>
                <strong>{m.useTemplate} →</strong>
              </a>
            ))}
          </div>
        </section>
      ))}
      <CatalogSeoContent type="templates" />
    </CatalogShell>
  );
}
