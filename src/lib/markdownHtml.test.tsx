import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { describe, expect, it } from 'vitest';
import { githubMarkdownHtmlSchema } from './markdownHtml';

function renderMarkdown(markdown: string) {
  return renderToStaticMarkup(
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, [rehypeSanitize, githubMarkdownHtmlSchema]]}
    >
      {markdown}
    </ReactMarkdown>,
  );
}

describe('GitHub-style Markdown HTML', () => {
  it.each(['left', 'center', 'right'])('preserves the supported %s alignment', (alignment) => {
    expect(renderMarkdown(`<p align="${alignment}">Aligned</p>`)).toContain(`<p align="${alignment}">Aligned</p>`);
  });

  it('removes unsupported alignment values and unsafe HTML capabilities', () => {
    const html = renderMarkdown(`
<p align="justify" style="position:fixed" onclick="alert(1)">Unsafe attributes</p>
<img src="image.png" onerror="alert(1)">
<script>alert(1)</script>
<iframe src="https://example.com">frame</iframe>
`);

    expect(html).toContain('<p>Unsafe attributes</p>');
    expect(html).toContain('<img src="image.png"/>');
    expect(html).not.toContain('align=');
    expect(html).not.toContain('style=');
    expect(html).not.toContain('onclick');
    expect(html).not.toContain('onerror');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('<iframe');
  });

  it('keeps existing GFM rendering around sanitized raw HTML', () => {
    const html = renderMarkdown('| Item | Result |\n| --- | ---: |\n| Safe | 100 |\n\n<div align="right"><strong>Right</strong></div>');

    expect(html).toContain('<table>');
    expect(html).toContain('<th style="text-align:right">Result</th>');
    expect(html).toContain('<div align="right"><strong>Right</strong></div>');
  });
});
