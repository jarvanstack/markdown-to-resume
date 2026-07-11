import type { PaperSize } from '../types';

export const paperPoints: Record<PaperSize, [number, number]> = {
  A4: [595.28, 841.89],
  Letter: [612, 792],
};

export const continuationMargin = 24;

export function calculatePageBreaks(element: HTMLElement, paperSize: PaperSize, renderWidth: number, renderHeight: number) {
  const [pageWidth, pageHeight] = paperPoints[paperSize];
  const firstPageHeight = Math.ceil(renderWidth * (pageHeight / pageWidth));
  const continuationPageHeight = Math.floor(renderWidth * ((pageHeight - continuationMargin * 1.5) / pageWidth));
  const elementRect = element.getBoundingClientRect();
  const scale = renderWidth / Math.max(1, elementRect.width);
  const paddingBottom = Number.parseFloat(window.getComputedStyle(element).paddingBottom) || 0;
  const contentBottom = Array.from(element.children).reduce((bottom, child) => (
    Math.max(bottom, (child as HTMLElement).getBoundingClientRect().bottom - elementRect.top)
  ), 0);
  // The sheet has an A4/Letter min-height for previewing short resumes. Only
  // actual content should participate in pagination, otherwise its blank tail
  // can become an extra PDF page because of sub-pixel rounding.
  const contentHeight = Math.max(1, Math.min(renderHeight, Math.ceil((contentBottom + paddingBottom) * scale)));
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
