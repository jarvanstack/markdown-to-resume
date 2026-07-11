import type { PaperSize, ResumeSettings } from '../types';
import { densityStyleVariables, normalizeLayoutDensity } from './density';

export const paperPoints: Record<PaperSize, [number, number]> = {
  A4: [595.28, 841.89],
  Letter: [612, 792],
};

export const continuationMargin = 24;

export type FitToPageStatus = 'fitted' | 'overflow' | 'underflow';

export interface FitToPageResult {
  settings: ResumeSettings;
  status: FitToPageStatus;
  contentHeight: number;
  pageHeight: number;
}

const sizingProperties = [
  '--fontScale',
  '--headingScale',
  '--lineHeightScale',
  '--xPaddingScale',
  '--yPaddingScale',
  '--sectionSpacing',
  '--densityBodyTop',
  '--densityBodyBottom',
  '--densityH1Bottom',
  '--densityH2Bottom',
  '--densitySubheadingTop',
  '--densitySubheadingBottom',
  '--densityRuleGap',
  '--densityHeadingPadding',
] as const;

type SizingSettings = Pick<ResumeSettings, 'fontSize' | 'headingScale' | 'lineHeight' | 'horizontalPadding' | 'verticalPadding' | 'sectionSpacing'>;

export const readableFitMinimums: SizingSettings = {
  fontSize: 12,
  headingScale: 0.85,
  lineHeight: 1.2,
  horizontalPadding: 16,
  verticalPadding: 8,
  sectionSpacing: 8,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundSetting(value: number) {
  return Math.round(value * 100) / 100;
}

function snapSetting(value: number, step: number) {
  return Math.floor((value + Number.EPSILON) / step) * step;
}

function interpolateSettings(settings: ResumeSettings, target: ResumeSettings, amount: number): ResumeSettings {
  const interpolate = (key: keyof SizingSettings) => roundSetting(settings[key] + (target[key] - settings[key]) * amount);
  return {
    ...settings,
    fontSize: interpolate('fontSize'),
    headingScale: interpolate('headingScale'),
    lineHeight: interpolate('lineHeight'),
    horizontalPadding: interpolate('horizontalPadding'),
    verticalPadding: interpolate('verticalPadding'),
    sectionSpacing: interpolate('sectionSpacing'),
    layoutDensity: roundSetting(settings.layoutDensity + (target.layoutDensity - settings.layoutDensity) * amount),
  };
}

function ensureReadableSettings(settings: ResumeSettings): ResumeSettings {
  return {
    ...settings,
    layoutDensity: normalizeLayoutDensity(settings.layoutDensity),
    fontSize: Math.max(settings.fontSize, readableFitMinimums.fontSize),
    headingScale: Math.max(settings.headingScale, readableFitMinimums.headingScale),
    lineHeight: Math.max(settings.lineHeight, readableFitMinimums.lineHeight),
    horizontalPadding: Math.max(settings.horizontalPadding, readableFitMinimums.horizontalPadding),
    verticalPadding: Math.max(settings.verticalPadding, readableFitMinimums.verticalPadding),
    sectionSpacing: Math.max(settings.sectionSpacing, readableFitMinimums.sectionSpacing),
  };
}

function compressionStages(settings: ResumeSettings): ResumeSettings[] {
  const densest = { ...settings, layoutDensity: 100 };
  const whitespace = {
    ...densest,
    horizontalPadding: Math.min(densest.horizontalPadding, 24),
    verticalPadding: readableFitMinimums.verticalPadding,
    sectionSpacing: readableFitMinimums.sectionSpacing,
  };
  const widerText = { ...whitespace, horizontalPadding: readableFitMinimums.horizontalPadding };
  const comfortableLines = { ...widerText, lineHeight: Math.min(widerText.lineHeight, 1.35) };
  const compactHeadings = { ...comfortableLines, headingScale: Math.min(comfortableLines.headingScale, 0.9) };
  const smallerText = { ...compactHeadings, fontSize: Math.min(compactHeadings.fontSize, readableFitMinimums.fontSize) };
  const readableMinimum = {
    ...smallerText,
    headingScale: readableFitMinimums.headingScale,
    lineHeight: readableFitMinimums.lineHeight,
  };
  return [settings, densest, whitespace, widerText, comfortableLines, compactHeadings, smallerText, readableMinimum];
}

function expansionStages(settings: ResumeSettings): ResumeSettings[] {
  const roomiest = { ...settings, layoutDensity: 0 };
  const pageAir = { ...roomiest, verticalPadding: 48 };
  const sectionAir = { ...pageAir, sectionSpacing: Math.max(sectionSpacingTarget(settings.sectionSpacing), pageAir.sectionSpacing) };
  const relaxedLines = { ...sectionAir, lineHeight: Math.max(sectionAir.lineHeight, 1.7) };
  const largerType = {
    ...relaxedLines,
    fontSize: Math.max(relaxedLines.fontSize, 18),
    headingScale: Math.max(relaxedLines.headingScale, 1.2),
  };
  const narrowerMeasure = { ...largerType, horizontalPadding: Math.max(largerType.horizontalPadding, 40) };
  return [settings, roomiest, pageAir, sectionAir, relaxedLines, largerType, narrowerMeasure];
}

function sectionSpacingTarget(current: number) {
  return Math.min(32, Math.max(20, current));
}

function snapFittedSettings(settings: ResumeSettings): ResumeSettings {
  return {
    ...settings,
    fontSize: snapSetting(settings.fontSize, 0.1),
    headingScale: snapSetting(settings.headingScale, 0.01),
    lineHeight: snapSetting(settings.lineHeight, 0.01),
    horizontalPadding: snapSetting(settings.horizontalPadding, 1),
    sectionSpacing: snapSetting(settings.sectionSpacing, 1),
    layoutDensity: snapSetting(settings.layoutDensity, 1),
  };
}

function applySizingSettings(element: HTMLElement, settings: ResumeSettings) {
  element.setAttribute('data-density', String(normalizeLayoutDensity(settings.layoutDensity)));
  element.style.setProperty('--fontScale', String(settings.fontSize / 16));
  element.style.setProperty('--headingScale', String(settings.headingScale));
  element.style.setProperty('--lineHeightScale', String(settings.lineHeight));
  element.style.setProperty('--xPaddingScale', `${settings.horizontalPadding}px`);
  element.style.setProperty('--yPaddingScale', `${settings.verticalPadding}px`);
  element.style.setProperty('--sectionSpacing', `${settings.sectionSpacing}px`);
  Object.entries(densityStyleVariables(settings.layoutDensity)).forEach(([property, value]) => element.style.setProperty(property, value));
}

export function measureResumeContentHeight(element: HTMLElement) {
  const elementRect = element.getBoundingClientRect();
  const paddingBottom = Number.parseFloat(window.getComputedStyle(element).paddingBottom) || 0;
  const contentBottom = Array.from(element.children).reduce((bottom, child) => (
    Math.max(bottom, (child as HTMLElement).getBoundingClientRect().bottom - elementRect.top)
  ), 0);
  return Math.max(1, contentBottom + paddingBottom);
}

/** Fits the current resume against the actual rendered paper instead of using a text-length estimate. */
export function fitResumeToOnePage(element: HTMLElement, settings: ResumeSettings): FitToPageResult {
  const renderWidth = element.offsetWidth || element.getBoundingClientRect().width;
  const [paperWidth, paperHeight] = paperPoints[settings.paperSize];
  const pageHeight = Math.max(1, Math.ceil(renderWidth * (paperHeight / paperWidth)) - 1);
  const previousValues = new Map(sizingProperties.map((property) => [property, element.style.getPropertyValue(property)]));
  const previousDensity = element.getAttribute('data-density');
  const measure = (candidate: ResumeSettings) => {
    applySizingSettings(element, candidate);
    return measureResumeContentHeight(element);
  };

  try {
    const readableSettings = ensureReadableSettings(settings);
    const readableHeight = measure(readableSettings);
    if (Math.abs(readableHeight - pageHeight) <= 1) {
      return { settings: readableSettings, status: 'fitted', contentHeight: readableHeight, pageHeight };
    }

    const compressing = readableHeight > pageHeight;
    const stages = compressing ? compressionStages(readableSettings) : expansionStages(readableSettings);
    const endpoint = stages.at(-1)!;
    const endpointHeight = measure(endpoint);
    if (compressing && endpointHeight > pageHeight) {
      return { settings: endpoint, status: 'overflow', contentHeight: endpointHeight, pageHeight };
    }
    if (!compressing && endpointHeight < pageHeight) {
      return { settings: endpoint, status: 'underflow', contentHeight: endpointHeight, pageHeight };
    }

    let stageStart = stages[0];
    let stageEnd = endpoint;
    for (let index = 1; index < stages.length; index += 1) {
      const height = measure(stages[index]);
      const crossedTarget = compressing ? height <= pageHeight : height >= pageHeight;
      if (crossedTarget) {
        stageStart = stages[index - 1];
        stageEnd = stages[index];
        break;
      }
    }

    let low = 0;
    let high = 1;
    let best = compressing ? stageEnd : stageStart;
    for (let iteration = 0; iteration < 22; iteration += 1) {
      const amount = (low + high) / 2;
      const candidate = interpolateSettings(stageStart, stageEnd, amount);
      const height = measure(candidate);
      if (compressing) {
        if (height <= pageHeight) {
          best = candidate;
          high = amount;
        } else low = amount;
      } else if (height <= pageHeight) {
        best = candidate;
        low = amount;
      } else high = amount;
    }

    best = snapFittedSettings(best);

    // Vertical padding does not reflow text, so use it to absorb the final
    // rounding gap left by the other typography controls.
    let paddingLow = readableFitMinimums.verticalPadding;
    let paddingHigh = 48;
    let tuned = { ...best, verticalPadding: readableFitMinimums.verticalPadding };
    if (measure({ ...best, verticalPadding: 48 }) <= pageHeight) {
      tuned = { ...best, verticalPadding: 48 };
    } else if (measure(tuned) <= pageHeight) {
      for (let iteration = 0; iteration < 18; iteration += 1) {
        const verticalPadding = (paddingLow + paddingHigh) / 2;
        const candidate = { ...best, verticalPadding };
        if (measure(candidate) <= pageHeight) {
          tuned = candidate;
          paddingLow = verticalPadding;
        } else {
          paddingHigh = verticalPadding;
        }
      }
    }
    tuned = { ...tuned, verticalPadding: Math.floor(clamp(tuned.verticalPadding, 0, 48) * 2) / 2 };
    let contentHeight = measure(tuned);
    if (contentHeight > pageHeight) {
      tuned = { ...tuned, verticalPadding: roundSetting(clamp(tuned.verticalPadding - (contentHeight - pageHeight) / 2 - 0.01, readableFitMinimums.verticalPadding, 48)) };
      contentHeight = measure(tuned);
    }
    return { settings: tuned, status: 'fitted', contentHeight, pageHeight };
  } finally {
    if (previousDensity) element.setAttribute('data-density', previousDensity);
    else element.removeAttribute('data-density');
    sizingProperties.forEach((property) => {
      const value = previousValues.get(property);
      if (value) element.style.setProperty(property, value);
      else element.style.removeProperty(property);
    });
  }
}

export function calculatePageBreaks(element: HTMLElement, paperSize: PaperSize, renderWidth: number, renderHeight: number) {
  const [pageWidth, pageHeight] = paperPoints[paperSize];
  const firstPageHeight = Math.ceil(renderWidth * (pageHeight / pageWidth));
  const continuationPageHeight = Math.floor(renderWidth * ((pageHeight - continuationMargin * 1.5) / pageWidth));
  const elementRect = element.getBoundingClientRect();
  const scale = renderWidth / Math.max(1, elementRect.width);
  // The sheet has an A4/Letter min-height for previewing short resumes. Only
  // actual content should participate in pagination, otherwise its blank tail
  // can become an extra PDF page because of sub-pixel rounding.
  const contentHeight = Math.max(1, Math.min(renderHeight, Math.ceil(measureResumeContentHeight(element) * scale)));
  const positions = (selector: string) => Array.from(element.querySelectorAll(selector))
    .map((child) => Math.round(((child as HTMLElement).getBoundingClientRect().top - elementRect.top) * scale))
    .filter((position) => position > 0 && position < contentHeight)
    .sort((a, b) => a - b);
  const boundaries = positions(':scope > *, :scope > ul > li, :scope > ol > li');
  const sectionBoundaries = positions(':scope > h2');
  const breaks: number[] = [];
  let pageStart = 0;

  while (pageStart < contentHeight) {
    const idealPageHeight = pageStart === 0 ? firstPageHeight : continuationPageHeight;
    if (pageStart + idealPageHeight >= contentHeight) break;
    const idealEnd = pageStart + idealPageHeight;
    const earliestAcceptable = pageStart + idealPageHeight * 0.72;
    const earliestSection = pageStart + idealPageHeight * 0.62;
    const sectionEnd = sectionBoundaries.filter((position) => position >= earliestSection && position <= idealEnd - 8).at(-1);
    const safeEnd = sectionEnd ?? boundaries.filter((position) => position >= earliestAcceptable && position <= idealEnd - 8).at(-1);
    const pageEnd = safeEnd ?? idealEnd;
    breaks.push(pageEnd);
    pageStart = pageEnd;
  }
  breaks.push(contentHeight);
  return breaks;
}

export function estimatePdfPages(element: HTMLElement, paperSize: PaperSize) {
  const width = element.offsetWidth || element.getBoundingClientRect().width;
  const height = Math.max(element.offsetHeight, element.scrollHeight);
  if (!width || !height) return 1;
  return calculatePageBreaks(element, paperSize, width, height).length;
}
