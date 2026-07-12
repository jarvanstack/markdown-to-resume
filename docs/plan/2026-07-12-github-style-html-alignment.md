# Add GitHub-Style HTML Alignment

## Metadata

- Status: Completed
- Date: 2026-07-12
- Owner: Codex
- Request: Support GitHub-compatible HTML in Markdown so resume authors can control left, center, and right text alignment.
- Related files: `package.json`, `package-lock.json`, `src/components/ResumePreview.tsx`, `src/lib/markdownHtml.ts`, `src/lib/markdownHtml.test.tsx`, `src/lib/export.ts`, `src/styles.css`, `src/themes/markdown-html.css`, `e2e/app.spec.ts`, `docs/knowledge-graph.md`

## Background And Evidence

The editor accepts Markdown through CodeMirror, while `ResumePreview` currently renders it with `react-markdown` and `remark-gfm` only. Raw HTML nodes are therefore not converted into resume DOM. The same `ResumePreview` component renders the hidden canonical `.resume-measure` element and every visible clipped page copy, and export clones or captures that canonical element. Any HTML extension must enter at this shared rendering boundary so measurement, pagination, live preview, PDF, PNG, and standalone HTML remain geometrically identical.

GitHub Flavored Markdown recognizes raw HTML but GitHub sanitizes the rendered result rather than trusting arbitrary tags and attributes. GitHub README content commonly uses legacy `align` attributes such as `<p align="right">...</p>` and `<div align="center">...</div>`, while arbitrary scripts, event handlers, iframes, and inline styling are not allowed to control the host page. The requested behavior is therefore a GitHub-style safe subset, not unrestricted browser HTML execution.

`react-markdown` supports this architecture through `rehype-raw`, which reparses Markdown HTML nodes into the HAST tree, followed by `rehype-sanitize`, whose default schema is based on GitHub's sanitization model. That default schema permits `align` broadly, so the project derives its policy from the default while narrowing that property to the requested `left`, `center`, and `right` values. A shared style contract must be present both in the application and standalone HTML export.

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
2. Create a Markdown HTML policy module from `rehype-sanitize`'s GitHub-style default schema, replacing its broad global `align` property definition with values restricted to `left`, `center`, and `right`.
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
npm run test -- src/lib/markdownHtml.test.tsx
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
- Decision: Preserve `remark-gfm` table alignment, which is generated as safe React style properties after sanitization, while continuing to remove user-authored raw `style` attributes.
- Deviation: Inspection of the installed GitHub-style default schema showed that `align` was already globally allowed without value restrictions. The implementation replaces that broad definition instead of adding a new per-element property, preserving GitHub syntax while enforcing the agreed three-value boundary.

## Completion Checklist

- [x] Current renderer, canonical measurement DOM, exports, tests, GitHub reference behavior, and knowledge graph inspected.
- [x] Detailed plan created before implementation.
- [x] Runtime dependencies and sanitizer policy added.
- [x] Raw HTML rendering and shared alignment styling implemented.
- [x] Focused unit and E2E coverage added.
- [x] Full automated and rendered verification passed.
- [x] Knowledge graph synchronized and ledger appended.
- [x] Final diff reviewed and final result recorded.

## Final Result

Added GitHub-style raw HTML support to the existing React Markdown pipeline through `rehype-raw`, followed immediately by `rehype-sanitize`. The sanitizer policy derives from its GitHub-style default schema but narrows `align` to `left`, `center`, or `right`. Safe tags such as `<p>` and `<div>` now render as resume DOM, while user-authored inline styles, event handlers, scripts, iframes, and unsupported alignment values are removed.

Added resume-scoped alignment CSS shared by the live application and standalone HTML export. Because the hidden measured resume and all visible page copies use the same `ResumePreview`, alignment participates in canonical measurement, pagination, smart fitting, and PDF/PNG capture without changing `ResumeSettings` or persisted-state v3.

Verification completed on 2026-07-12:

- `npm run test -- src/lib/markdownHtml.test.tsx` passed 5 focused tests covering allowed values, unsafe HTML removal, and GFM coexistence.
- The focused Playwright HTML-alignment test passed across all 11 built-in themes and verified sanitized standalone HTML export.
- `npm run check` passed: 4 unit-test files with 28 tests, the TypeScript/Vite production build, and 25 Chromium E2E tests including GFM style parity, pagination, smart fitting, live CSS editing, and PDF/PNG/HTML export.
- A local browser check at desktop width confirmed visibly distinct left, center, and right placement with no overlap; an unsafe style/event example rendered as ordinary sanitized text.
- `git diff --check` passed, and the final source/documentation diff was reconciled with the knowledge graph and this plan.
