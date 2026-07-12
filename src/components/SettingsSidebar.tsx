import { AlignJustify, Download, FileCheck2, FileText, LayoutTemplate, LoaderCircle, Palette, RotateCcw, Save, SwatchBook, Type } from 'lucide-react';
import { useState } from 'react';
import { fontOptions, getTheme, quickThemeIds } from '../data/themes';
import { getTemplate, quickTemplateIds } from '../data/templates';
import { LanguageSelect, useI18n } from '../i18n';
import { GitHubLink } from './GitHubLink';
import type { CustomTheme, ExportFormat, ResumeSettings } from '../types';
import type { FitToPageStatus } from '../lib/pagination';

interface SidebarProps {
  settings: ResumeSettings;
  templateId: string;
  customThemes: CustomTheme[];
  exporting: ExportFormat | null;
  fitState: 'idle' | 'fitting' | FitToPageStatus;
  onChange: <K extends keyof ResumeSettings>(key: K, value: ResumeSettings[K]) => void;
  onTemplate: (id: string) => void;
  onTheme: (id: string) => void;
  onSaveTheme: () => void;
  onResetTheme: () => void;
  onFitOnePage: () => void;
  onExport: (format: ExportFormat) => void;
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return <h2 className="sidebar-section-title">{icon}{children}</h2>;
}

function Range({ label, value, min, max, step, suffix = '', testId, onChange }: { label: string; value: number; min: number; max: number; step: number; suffix?: string; testId: string; onChange: (value: number) => void }) {
  const display = Number.isInteger(value) ? value : suffix === 'px' ? value.toFixed(1) : value.toFixed(2).replace(/0$/, '');
  return (
    <label className="sidebar-range">
      <span><span>{label}</span><output>{display}{suffix}</output></span>
      <input data-testid={testId} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

export function SettingsSidebar({ settings, templateId, customThemes, exporting, fitState, onChange, onTemplate, onTheme, onSaveTheme, onResetTheme, onFitOnePage, onExport }: SidebarProps) {
  const { locale, m } = useI18n();
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const quickThemes: Array<{ id: string; name: string }> = [...customThemes].reverse().slice(0, 4);
  quickThemeIds.slice(0, 4 - quickThemes.length).forEach((id) => quickThemes.push(getTheme(id, locale)));
  const exportLabels: Record<ExportFormat, string> = { pdf: 'PDF', png: m.image, html: 'HTML' };
  const fitLabel = fitState === 'fitting' ? m.fittingOnePage
    : fitState === 'fitted' ? m.fittedOnePage
      : fitState === 'overflow' ? m.fitTooLong
        : fitState === 'underflow' ? m.fitTooShort
          : m.fitOnePage;

  return (
    <aside className="sidebar" data-testid="settings-sidebar">
      <div className="sidebar-topbar"><LanguageSelect /><GitHubLink /></div>
      <div className="sidebar-export">
        <label className="export-format"><span>{m.exportFormat}</span><select aria-label={m.exportFormat} data-testid="export-format" value={exportFormat} onChange={(event) => setExportFormat(event.target.value as ExportFormat)}><option value="pdf">PDF</option><option value="png">{m.image}</option><option value="html">HTML</option></select></label>
        <button className="export-primary" data-testid="export-action" disabled={exporting !== null} onClick={() => onExport(exportFormat)}><Download size={17} />{exporting ? m.exporting : `${m.export} ${exportLabels[exportFormat]}`}</button>
        <div className="page-size-row"><span>{m.paperSize}</span><div className="page-size-switch"><button className={settings.paperSize === 'Letter' ? 'active' : ''} onClick={() => onChange('paperSize', 'Letter')}>Letter</button><button className={settings.paperSize === 'A4' ? 'active' : ''} onClick={() => onChange('paperSize', 'A4')}>A4</button></div></div>
      </div>

      <section className="sidebar-section">
        <SectionTitle icon={<LayoutTemplate size={17} />}>{m.quickTemplates}</SectionTitle>
        <div className="quick-grid">
          {quickTemplateIds.map((id) => { const item = getTemplate(id, locale); return <button key={id} className={templateId === id ? 'active' : ''} onClick={() => onTemplate(id)}>{item.title}</button>; })}
        </div>
        <a className="more-link" href={`${import.meta.env.BASE_URL}templates`}><FileText size={14} />{m.moreTemplates}{locale === 'zh' ? '（18）' : ' (18)'}<span>→</span></a>
      </section>

      <section className="sidebar-section">
        <div className="section-heading-row"><SectionTitle icon={<Palette size={17} />}>{m.quickThemes}</SectionTitle><button className="reset-button" title={m.saveCurrentTheme} aria-label={m.saveCurrentTheme} data-testid="save-theme" onClick={onSaveTheme}><Save size={14} /></button></div>
        <div className="quick-grid theme-buttons">
          {quickThemes.map((theme) => <button data-testid={`theme-${theme.id}`} key={theme.id} className={settings.theme === theme.id ? 'active' : ''} onClick={() => onTheme(theme.id)}>{theme.name}</button>)}
        </div>
        <a className="more-link" href={`${import.meta.env.BASE_URL}themes`}><SwatchBook size={14} />{m.moreThemes}{locale === 'zh' ? `（${11 + customThemes.length}）` : ` (${11 + customThemes.length})`}<span>→</span></a>
      </section>

      <section className="sidebar-section">
        <div className="section-heading-row">
          <SectionTitle icon={<Type size={17} />}>{m.typography}</SectionTitle>
          <div className="section-heading-actions">
            <button className="fit-page-button" data-state={fitState} data-testid="fit-one-page" disabled={fitState === 'fitting'} onClick={onFitOnePage}>
              {fitState === 'fitting' ? <LoaderCircle className="spin" size={14} /> : <FileCheck2 size={14} />}{fitLabel}
            </button>
            <button className="reset-button" title={m.resetTheme} aria-label={m.resetTheme} data-testid="reset-theme-settings" onClick={onResetTheme}><RotateCcw size={14} /></button>
          </div>
        </div>
        <label className="sidebar-select"><span>{m.font}</span><select aria-label={m.font} data-testid="font-family" value={settings.fontFamily} onChange={(event) => onChange('fontFamily', event.target.value)}>{fontOptions.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}</select></label>
        <Range testId="font-size" label={m.fontSize} value={settings.fontSize} min={8} max={24} step={0.1} suffix="px" onChange={(value) => onChange('fontSize', value)} />
        <Range testId="line-height" label={m.lineHeight} value={settings.lineHeight} min={0.5} max={2} step={0.01} onChange={(value) => onChange('lineHeight', value)} />
        <Range testId="heading-scale" label={m.headingScale} value={settings.headingScale} min={0.7} max={1.5} step={0.01} onChange={(value) => onChange('headingScale', value)} />
      </section>

      <section className="sidebar-section">
        <SectionTitle icon={<AlignJustify size={17} />}>{m.spacing}</SectionTitle>
        <Range testId="layout-density" label={m.layoutDensity} value={settings.layoutDensity} min={0} max={100} step={1} suffix="%" onChange={(value) => onChange('layoutDensity', value)} />
        <Range testId="horizontal-padding" label={m.horizontalPadding} value={settings.horizontalPadding} min={0} max={48} step={1} suffix="px" onChange={(value) => onChange('horizontalPadding', value)} />
        <Range testId="vertical-padding" label={m.verticalPadding} value={settings.verticalPadding} min={0} max={48} step={0.5} suffix="px" onChange={(value) => onChange('verticalPadding', value)} />
        <Range testId="section-spacing" label={m.sectionSpacing} value={settings.sectionSpacing} min={8} max={48} step={1} suffix="px" onChange={(value) => onChange('sectionSpacing', value)} />
      </section>

      <section className="sidebar-section color-section">
        <SectionTitle icon={<SwatchBook size={17} />}>{m.colors}</SectionTitle>
        {([
          ['headingColor', m.heading], ['textColor', m.body], ['linkColor', m.link], ['accentColor', m.accent], ['mutedColor', m.muted],
        ] as const).map(([key, label]) => <label className="color-row" key={key}><span>{label}</span><span><input aria-label={label} type="color" value={settings[key]} onChange={(event) => onChange(key, event.target.value)} /><code>{settings[key].toUpperCase()}</code></span></label>)}
      </section>
    </aside>
  );
}
