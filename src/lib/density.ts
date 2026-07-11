export const DEFAULT_LAYOUT_DENSITY = 35;

export function normalizeLayoutDensity(value: number) {
  return Math.min(100, Math.max(0, Number.isFinite(value) ? value : DEFAULT_LAYOUT_DENSITY));
}

function interpolate(start: number, end: number, amount: number) {
  return Math.round((start + (end - start) * amount) * 1000) / 1000;
}

export function densityStyleVariables(value: number) {
  const amount = normalizeLayoutDensity(value) / 100;
  return {
    '--densityBodyTop': `${interpolate(0.6, 0, amount)}em`,
    '--densityBodyBottom': `${interpolate(0.8, 0, amount)}em`,
    '--densityH1Bottom': `${interpolate(0.65, 0.25, amount)}em`,
    '--densityH2Bottom': `${interpolate(0.55, 0.1, amount)}em`,
    '--densitySubheadingTop': `${interpolate(0.8, 0.15, amount)}em`,
    '--densitySubheadingBottom': `${interpolate(0.35, 0, amount)}em`,
    '--densityRuleGap': `${interpolate(0.7, 0.15, amount)}em`,
    '--densityHeadingPadding': `${interpolate(0.3, 0.1, amount)}em`,
  };
}
