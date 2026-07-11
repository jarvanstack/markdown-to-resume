export type BuiltInThemeId = 'github' | 'crisp' | 'vivid' | 'airy' | 'stark' | 'calm' | 'dusk' | 'sharp' | 'warm' | 'stern' | 'fresh';
export type ThemeId = string;
export type PaperSize = 'A4' | 'Letter';
export type ExportFormat = 'pdf' | 'png' | 'html';
export type Locale = 'zh' | 'en';

export interface ResumeSettings {
  theme: ThemeId;
  fontFamily: string;
  fontSize: number;
  headingScale: number;
  lineHeight: number;
  horizontalPadding: number;
  verticalPadding: number;
  headingColor: string;
  textColor: string;
  linkColor: string;
  accentColor: string;
  mutedColor: string;
  sectionSpacing: number;
  paperSize: PaperSize;
}

export interface PersistedState {
  version: 3;
  markdown: string;
  templateId: string;
  settings: ResumeSettings;
}

export interface CustomTheme {
  id: string;
  name: string;
  tagline: string;
  settings: ResumeSettings;
  css: string;
  createdAt: number;
  updatedAt: number;
  custom: true;
}
