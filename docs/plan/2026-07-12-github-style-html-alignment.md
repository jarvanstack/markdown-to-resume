# Add GitHub-Style HTML Alignment

## Metadata

- Status: In Progress
- Date: 2026-07-12
- Owner: Codex
- Request: Support GitHub-compatible HTML in Markdown so resume authors can control left, center, and right text alignment.
- Related files: `package.json`, `package-lock.json`, `src/components/ResumePreview.tsx`, `src/lib/markdownHtml.ts`, `src/lib/markdownHtml.test.ts`, `src/lib/export.ts`, `src/styles.css`, `src/themes/markdown-html.css`, `e2e/app.spec.ts`, `docs/knowledge-graph.md`

## Background And Evidence

The editor accepts Markdown through CodeMirror, while `ResumePreview` currently renders it with `react-markdown` and `remark-gfm` only. Raw HTML nodes are therefore not converted into resume DOM. The same `ResumePreview` component renders the hidden canonical `.resume-measure` element and every visible clipped page copy, and export clones or captures that canonical element. Any HTML extension must enter at this shared rendering boundary so measurement, pagination, live preview, PDF, PNG, and standalone HTML remain geometrically identical.

GitHub Flavored Markdown recognizes raw HTML but GitHub sanitizes the rendered result rather than trusting arbitrary tags and attributes. GitHub README content commonly uses legacy `align` attributes such as `<p align="right">...</p>` and `<div align="center">...</div>`, while arbitrary scripts, event handlers, iframes, and inline styling are not allowed to control the host page. The requested behavior is therefore a GitHub-style safe subset, not unrestricted browser HTML execution.

`react-markdown` supports this architecture through `rehype-raw`, which reparses Markdown HTML nodes into the HAST tree, followed by `rehype-sanitize`, whose default schema is based on GitHub's sanitization model. The project needs a small schema extension for the GitHub-compatible `align` attribute and a shared style contract that is present both in the application and standalone HTML export.

## Goals

- Render safe raw HTML embedded in Markdown instead of displaying or dropping it as unsupported source.
- Support `<p>` and `<div>` alignment using `align="left"`, `align="center"`, or `align="right"`, matching common GitHub Markdown usage.
- Preserve ordinary Markdown parsing and GFM tables, task lists, links, code, and existing theme behavior.
- Sanitize the parsed HTML so scripts, event handlers, iframes, inline `style`, and unsupported attributes cannot affect the application shell or execute active content.
- Apply alignment consistently to the hidden measured DOM, visible page copies, PDF, PNG, and downloaded standalone HTML.
- Keep persistence and `ResumeSettings` v3 unchanged; alignment remains part of the Markdown document.

## Non-Goals

- Provide unrestricted HTML, inline CSS, JavaScript, iframes, forms, or arbitrary host-page classes.
- Reproduce every internal detail of GitHub's proprietary rendering service or every element in its evolving allowlist.
- Add a rich-text toolbar, WYSIWYG selection model, custom Markdown directive syntax, or a global alignment setting.
- Add server-side rendering, uploads, collaboration, or a new persistence key.
- Add two-column or left/right content on the same line beyond what authors can express with existing GFM tables and theme CSS.

## Scope And Knowledge-Graph Impact

Affected and new nodes:

- Resume rendering (`src/components/ResumePreview.tsx`): adds raw-HTML and sanitization rehype plugins after the existing GFM remark plugin.
- Markdown HTML policy (`src/lib/markdownHtml.ts`): owns the sanitizer schema and the narrow `align` value allowlist.
- Shared Markdown HTML CSS (`src/themes/markdown-html.css`): owns deterministic alignment rules scoped under `.resume-sheet`.
- Export (`src/lib/export.ts`): embeds the same shared Markdown HTML CSS in standalone HTML; PDF and PNG continue capturing the canonical live DOM.
- Dependencies: add `rehype-raw` and `rehype-sanitize` as direct runtime dependencies.
- Unit/E2E tests: protect schema policy, rendered alignment, sanitization, theme consistency, and standalone HTML behavior.

New edges connect `ResumePreview` to the raw-HTML parser, sanitizer policy, and shared alignment CSS. Export also consumes the shared CSS. `PersistedState`, `ResumeSettings`, storage keys, templates, pagination algorithms, and theme ownership do not change.

## Implementation Plan

1. Add compatible `rehype-raw` and `rehype-sanitize` runtime dependencies.
2. Create a Markdown HTML policy module by extending `rehype-sanitize`'s GitHub-style default schema only where necessary for `align` on paragraph and division elements, with allowed values restricted to `left`, `center`, and `right`.
3. Add raw parsing followed by sanitization to the existing `ReactMarkdown` pipeline. Keep custom link and task-list renderers intact.
4. Add shared, resume-scoped CSS selectors for the three allowed alignment values. Use explicit CSS rather than relying only on obsolete browser presentation behavior so preview and exported HTML remain deterministic.
5. Import the shared CSS into the application and embed its raw source into standalone HTML export alongside density and font CSS.
6. Add unit tests for the sanitizer schema/value contract and focused render tests if the DOM boundary can be exercised economically.
7. Add Playwright coverage that enters GitHub-style HTML, verifies computed left/center/right alignment in the canonical preview, confirms inline style/event/script/iframe content is filtered, and checks standalone HTML preserves safe alignment without unsafe markup.
8. Run focused tests, the production build, and the full `npm run check`; inspect the rendered preview at desktop and mobile widths if layout changes are visible.
9. Update every affected knowledge-graph section and append the change-ledger row, then inspect `git diff`, `git diff --check`, and package changes against this plan.

## Verification Plan

Automated verification:

```bash
npm run test -- src/lib/markdownHtml.test.ts
npm run check
git diff --check
```

Behavioral checks:

- `<p align="left">`, `<p align="center">`, and `<p align="right">` render with the corresponding computed `text-align` value.
- `<div align="right">` can contain safe inline Markdown/HTML content without escaping the resume root.
- Existing Markdown and GFM fixtures render unchanged.
- `style`, `onclick`/`onerror`, `script`, and `iframe` do not survive in the rendered resume DOM.
- All built-in themes honor the alignment rule without changing application-shell alignment.
- The hidden measured resume and visible page copies contain equivalent sanitized structures.
- Downloaded HTML includes the shared alignment CSS and safe aligned content, but excludes unsafe tags and attributes.
- PDF and PNG export continue to succeed from the same canonical DOM.

## Risks, Mitigations, And Rollback

- Risk: Raw HTML expands the Markdown attack surface even in a local-first static application. Mitigation: always run `rehype-sanitize` after `rehype-raw`, start from its GitHub-style default schema, add only the narrow alignment attribute, and test representative active-content vectors.
- Risk: Allowing a generic `style` attribute would permit positioning, resource URLs, hiding content, and pagination disruption. Mitigation: do not allow `style`; express alignment through a value-restricted `align` attribute and scoped CSS.
- Risk: Theme selectors could override HTML alignment. Mitigation: use scoped attribute selectors with sufficient stable specificity and verify every built-in theme.
- Risk: Parser changes could alter existing GFM output or raw-tag edge cases. Mitigation: retain plugin order, keep existing component overrides, run the complete GFM style-parity and export suites, and add focused raw-HTML regression coverage.
- Risk: Standalone HTML could omit app-bundled alignment rules. Mitigation: own the rules in one raw-importable CSS file consumed by both application styles and export.
- Risk: Sanitizer schema drift could accidentally widen or remove allowed behavior. Mitigation: centralize the schema in a tested module and assert allowed values and rejected properties.
- Rollback: Remove both rehype plugins, the policy module, shared CSS import/export embedding, tests, dependency entries, and graph records. Stored Markdown remains plain text and requires no migration.

## Decisions And Deviations

- Decision: Follow GitHub's parse-then-sanitize model instead of enabling unrestricted HTML.
- Decision: Use GitHub's familiar `align` syntax rather than inventing a custom Markdown directive.
- Decision: Restrict alignment to `left`, `center`, and `right`; `justify`, arbitrary classes, and inline CSS are outside the requested layout control.
- Decision: Keep alignment in Markdown rather than `ResumeSettings`, because it is local to individual content blocks and should survive template/export round trips without a cross-cutting settings migration.
- Deviation: None at implementation start.

## Completion Checklist

- [x] Current renderer, canonical measurement DOM, exports, tests, GitHub reference behavior, and knowledge graph inspected.
- [x] Detailed plan created before implementation.
- [ ] Runtime dependencies and sanitizer policy added.
- [ ] Raw HTML rendering and shared alignment styling implemented.
- [ ] Focused unit and E2E coverage added.
- [ ] Full automated and rendered verification passed.
- [ ] Knowledge graph synchronized and ledger appended.
- [ ] Final diff reviewed and final result recorded.

## Final Result

In progress.
