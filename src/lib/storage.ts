import { templates } from '../data/templates';
import { GITHUB_FONT_FAMILY } from '../data/themes';
import type { PersistedState, ResumeSettings } from '../types';

export const STORAGE_KEY = 'markdown-resume-state-v3';

export const defaultSettings: ResumeSettings = {
  theme: 'github',
  fontFamily: GITHUB_FONT_FAMILY,
  fontSize: 16,
  headingScale: 1,
  lineHeight: 1.5,
  horizontalPadding: 32,
  verticalPadding: 24,
  headingColor: '#1f2328',
  textColor: '#1f2328',
  linkColor: '#0969da',
  accentColor: '#d1d9e0',
  mutedColor: '#59636e',
  sectionSpacing: 24,
  layoutDensity: 35,
  paperSize: 'A4',
};

export const defaultState: PersistedState = {
  version: 3,
  markdown: templates[0].markdown,
  templateId: templates[0].id,
  settings: defaultSettings,
};

export function loadState(storage: Pick<Storage, 'getItem'> = localStorage): PersistedState {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const stored = JSON.parse(raw) as Partial<PersistedState>;
    return {
      ...defaultState,
      ...stored,
      version: 3,
      settings: { ...defaultSettings, ...(stored.settings ?? {}) },
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: PersistedState, storage: Pick<Storage, 'setItem'> = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}
