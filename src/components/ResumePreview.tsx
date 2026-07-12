import { useEffect, useState, type CSSProperties, type RefObject } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { calculatePageBreaks, continuationMargin, paperPoints } from '../lib/pagination';
import { getFontStack } from '../data/themes';
import { densityStyleVariables, normalizeLayoutDensity } from '../lib/density';
import type { ResumeSettings } from '../types';

export function resumeStyle(settings: ResumeSettings): CSSProperties {
  const fontName = getFontStack(settings.fontFamily);
  return {
    '--fontName': fontName,
    '--fontScale': settings.fontSize / 16,
    '--headingScale': settings.headingScale,
    '--lineHeightScale': settings.lineHeight,
    '--xPaddingScale': `${settings.horizontalPadding}px`,
    '--yPaddingScale': `${settings.verticalPadding}px`,
    '--headerColor': settings.headingColor,
    '--textColor': settings.textColor,
    '--linkColor': settings.linkColor,
    '--accentColor': settings.accentColor,
    '--accentColorMuted': `${settings.accentColor}b3`,
    '--mutedColor': settings.mutedColor,
    '--sectionSpacing': `${settings.sectionSpacing}px`,
    ...densityStyleVariables(settings.layoutDensity),
  } as CSSProperties;
}

interface ResumePreviewProps {
  markdown: string;
  settings: ResumeSettings;
  previewRef?: RefObject<HTMLDivElement | null>;
  compact?: boolean;
  className?: string;
  ariaHidden?: boolean;
  themeClassName?: string;
}

export function ResumePreview({ markdown, settings, previewRef, compact = false, className = '', ariaHidden = false, themeClassName }: ResumePreviewProps) {
  const renderedTheme = themeClassName ?? settings.theme;
  const markdownBodyClass = !themeClassName && settings.theme === 'github' ? ' markdown-body' : '';
  const layoutDensity = normalizeLayoutDensity(settings.layoutDensity);
  return (
    <div
      ref={previewRef}
      className={`resume-sheet theme ${renderedTheme}${markdownBodyClass} paper-${settings.paperSize.toLowerCase()}${compact ? ' compact' : ''}${className ? ` ${className}` : ''}`}
      style={resumeStyle(settings)}
      data-theme-id={settings.theme}
      data-density={layoutDensity}
      data-testid={compact ? undefined : 'resume-page'}
      aria-hidden={ariaHidden || undefined}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children, ...props }) => <a {...props} target="_blank" rel="noreferrer">{children}</a>,
          input: ({ className, type, ...props }) => <input {...props} type={type} className={[className, type === 'checkbox' ? 'task-list-item-checkbox' : ''].filter(Boolean).join(' ') || undefined} />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

interface PaginatedResumePreviewProps {
  markdown: string;
  settings: ResumeSettings;
  previewRef: RefObject<HTMLDivElement | null>;
  onPageCount: (count: number) => void;
  themeClassName?: string;
}

export function PaginatedResumePreview({ markdown, settings, previewRef, onPageCount, themeClassName }: PaginatedResumePreviewProps) {
  const [breaks, setBreaks] = useState<number[]>([1]);
  const [renderWidth, setRenderWidth] = useState(0);

  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const width = element.offsetWidth || element.getBoundingClientRect().width;
        const height = Math.max(element.offsetHeight, element.scrollHeight);
        if (!width || !height) return;
        const nextBreaks = calculatePageBreaks(element, settings.paperSize, width, height);
        setRenderWidth(width);
        setBreaks((current) => current.length === nextBreaks.length && current.every((value, index) => value === nextBreaks[index]) ? current : nextBreaks);
        onPageCount(nextBreaks.length);
      });
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    void document.fonts.ready.then(update);
    update();
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [markdown, onPageCount, previewRef, settings]);

  const [paperWidth] = paperPoints[settings.paperSize];
  return (
    <div className="resume-pages" data-testid="resume-pages">
      {breaks.map((pageEnd, index) => {
        const pageStart = index === 0 ? 0 : breaks[index - 1];
        const pageTop = index === 0 ? 0 : renderWidth * (continuationMargin / paperWidth);
        return (
          <div className={`preview-paper paper-${settings.paperSize.toLowerCase()}`} data-testid="preview-paper" key={`${pageStart}-${pageEnd}`}>
            <div className="preview-page-clip" style={{ top: pageTop, height: Math.max(1, pageEnd - pageStart) }}>
              <div className="preview-page-offset" style={{ transform: `translateY(${-pageStart}px)` }}>
                <ResumePreview markdown={markdown} settings={settings} className="preview-page-copy" compact ariaHidden themeClassName={themeClassName} />
              </div>
            </div>
          </div>
        );
      })}
      <ResumePreview markdown={markdown} settings={settings} previewRef={previewRef} className="resume-measure" themeClassName={themeClassName} />
    </div>
  );
}
