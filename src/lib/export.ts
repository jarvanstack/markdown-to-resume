import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';
import type { Locale, PaperSize } from '../types';
import { calculatePageBreaks, continuationMargin, paperPoints } from './pagination';
import densityCss from '../themes/density.css?raw';
import fontCss from '../themes/fonts.css?raw';
import markdownHtmlCss from '../themes/markdown-html.css?raw';

async function renderResume(element: HTMLElement) {
  await document.fonts.ready;
  return toCanvas(element, {
    backgroundColor: '#ffffff',
    pixelRatio: 2,
    cacheBust: true,
    skipAutoScale: true,
    style: { opacity: '1', position: 'static', visibility: 'visible' },
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportPng(element: HTMLElement) {
  const canvas = await renderResume(element);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error('PNG_FAILED')), 'image/png');
  });
  downloadBlob(blob, 'resume.png');
}

export function exportHtml(element: HTMLElement, themeCss: string, locale: Locale = 'zh', title = locale === 'zh' ? '简历' : 'Resume') {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.classList.remove('resume-measure');
  clone.removeAttribute('data-testid');
  clone.removeAttribute('aria-hidden');
  const html = `<!doctype html>
<html lang="${locale === 'zh' ? 'zh-CN' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; letter-spacing: 0; }
    html, body { margin: 0; background: #fff; }
    body { color: #1f2328; }
    ${themeCss}
    .resume-sheet { width: 100%; max-width: 816px; min-height: 100vh; margin: 0 auto; padding: var(--yPaddingScale) var(--xPaddingScale); background: #fff; color: var(--textColor); font-family: var(--fontName); }
    .resume-sheet > :first-child { margin-top: 0 !important; }
    .resume-sheet:not([data-theme-id="github"]) > h2 { margin-top: var(--sectionSpacing); }
    .resume-sheet:not([data-theme-id="github"]) p, .resume-sheet:not([data-theme-id="github"]) ul, .resume-sheet:not([data-theme-id="github"]) ol { margin-bottom: 0; }
    .resume-sheet blockquote { margin-inline: 0; }
    .resume-sheet:not([data-theme-id="github"]) hr { height: 0; border: 0; }
    .resume-sheet:not([data-theme-id="github"]), .resume-sheet:not([data-theme-id="github"]) a { overflow-wrap: anywhere; }
    ${densityCss}
    ${fontCss}
    ${markdownHtmlCss}
    @media print { .resume-sheet { max-width: none; } }
  </style>
</head>
<body>${clone.outerHTML}</body>
</html>`;
  downloadBlob(new Blob([html], { type: 'text/html;charset=utf-8' }), 'resume.html');
}

export async function exportPdf(element: HTMLElement, paperSize: PaperSize) {
  const canvas = await renderResume(element);
  const [pageWidth, pageHeight] = paperPoints[paperSize];
  const pageBreaks = calculatePageBreaks(element, paperSize, canvas.width, canvas.height);
  const pdfFormat = paperSize === 'A4' ? 'a4' : 'letter';
  const pdf = new jsPDF({ unit: 'pt', format: pdfFormat, orientation: 'portrait', compress: true });
  let sourceY = 0;

  pageBreaks.forEach((pageEnd, page) => {
    const currentHeight = pageEnd - sourceY;
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = currentHeight;
    const context = pageCanvas.getContext('2d');
    if (!context) throw new Error('PDF_FAILED');
    context.drawImage(canvas, 0, sourceY, canvas.width, currentHeight, 0, 0, canvas.width, currentHeight);
    if (page > 0) pdf.addPage(pdfFormat, 'portrait');
    const renderedHeight = (currentHeight / canvas.width) * pageWidth;
    const pageTop = page > 0 ? continuationMargin : 0;
    pdf.addImage(pageCanvas.toDataURL('image/jpeg', 0.94), 'JPEG', 0, pageTop, pageWidth, renderedHeight, undefined, 'FAST');
    sourceY = pageEnd;
  });

  pdf.save('resume.pdf');
}
