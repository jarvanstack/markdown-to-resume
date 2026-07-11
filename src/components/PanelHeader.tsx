import type { ReactNode } from 'react';
import { Eye } from 'lucide-react';

interface PanelHeaderProps {
  label: string;
  tone: 'editor' | 'preview';
  children?: ReactNode;
}

export function PanelHeader({ label, tone, children }: PanelHeaderProps) {
  return (
    <header className="panel-header">
      <span className="panel-title"><span className={`panel-dot ${tone}`} />{tone === 'editor' ? <img className="panel-brand-icon" src={`${import.meta.env.BASE_URL}moli-icon.svg`} alt="" /> : <Eye className="panel-icon" size={14} />}<span>{label}</span></span>
      {children}
    </header>
  );
}
