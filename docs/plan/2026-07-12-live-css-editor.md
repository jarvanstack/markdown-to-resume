# Add Live CSS Editor Tab

## Metadata

- Status: Completed
- Date: 2026-07-12
- Owner: Codex
- Request: Add a CSS page beside the Markdown heading so users can directly edit resume CSS.
- Related files: `package.json`, `package-lock.json`, `src/App.tsx`, `src/components/MarkdownEditor.tsx`, `src/components/PanelHeader.tsx`, `src/components/ResumePreview.tsx`, `src/i18n.tsx`, `src/lib/cssDraft.ts`, `src/lib/cssDraft.test.ts`, `src/lib/export.ts`, `src/styles.css`, `src/themes/density.css`, `e2e/app.spec.ts`, `docs/knowledge-graph.md`

## Background And Evidence

The left workspace column currently has one static `MARKDOWN` panel heading and mounts a controlled CodeMirror Markdown editor. Theme CSS is loaded from built-in theme data or locally stored custom themes, then applied to the canonical hidden `.resume-measure` resume and the visible paginated copies. Users can import and export complete custom theme files, but there is no direct CSS editing surface in the main workspace.

The application already treats the hidden measured resume as the canonical DOM for pagination, smart fitting, image/PDF rendering, and HTML cloning. The user clarified that the CSS editor must not start blank: every theme owns an editable CSS document, and the editor must initially show the complete CSS of the currently selected built-in or custom theme. Edited CSS therefore needs to replace that theme's preview stylesheet, remain isolated from the application shell, survive theme switches and reloads locally, and be included in standalone HTML export. `PersistedState` v3 should remain unchanged because per-theme CSS documents have an independent lifecycle from resume content, template choice, and `ResumeSettings`.

## Goals

- Add `MARKDOWN` and `CSS` tabs to the existing editor panel header, with CSS immediately to the right of Markdown as shown in the reference.
- Provide a controlled CodeMirror CSS editor with CSS syntax support.
- Populate the CSS editor with the complete CSS source of the selected theme and switch documents when the user selects another theme.
- Apply valid edits as the selected theme's replacement stylesheet to the measured resume and every visible page copy in real time.
- Rewrite the selected theme's source scope to a dedicated runtime theme class and automatically scope new ordinary selectors, without allowing rules to style the application shell.
- Store raw CSS documents by theme id in browser `localStorage`, restore them after reload, and provide a reset action for the current theme's original CSS.
- Include the active edited theme CSS in standalone HTML export; PDF and PNG continue to capture the live styled canonical DOM.
- Preserve desktop and mobile editor layouts and bilingual accessible labels.

## Non-Goals

- Modify checked-in built-in theme source files or overwrite stored custom-theme records; edits remain local per-theme documents.
- Add a CSS route, server-side storage, cloud synchronization, collaboration, or CSS autocomplete.
- Parse CSS declarations into `ResumeSettings` sliders or share one CSS overlay across different themes.
- Add a separate CSS download/import workflow; existing theme import/export remains unchanged.
- Permit `@import` rules or unscoped styling of the application shell.

## Scope And Knowledge-Graph Impact

Affected and new nodes:

- `EditorApp`: owns active source tab, per-theme raw CSS document state, base-source resolution, debounced persistence, runtime theme CSS, reset behavior, and HTML export composition.
- Source editors (`src/components/MarkdownEditor.tsx`): share CodeMirror presentation while selecting Markdown or CSS language support and accessible labels.
- Panel chrome (`src/components/PanelHeader.tsx`): accepts a React tab-list label instead of only static text.
- Theme CSS drafts (`src/lib/cssDraft.ts`): owns the `markdown-resume-theme-css-v1` key, per-theme document map, size/count boundaries, load/save behavior, PostCSS parsing, source-to-runtime scope rewriting, `@import` removal, and safe failure behavior.
- Resume rendering (`src/components/ResumePreview.tsx`): renders the original theme id as data while using a dedicated runtime class, preventing globally bundled base theme rules from competing with the edited replacement.
- Export (`src/lib/export.ts` consumer contract): receives the active runtime theme CSS for standalone HTML.
- Application styles and i18n: own tab appearance, responsive constraints, and Chinese/English CSS-editor labels.
- Unit/E2E tests: protect scoping, persistence fallback, editor switching, live preview, shell isolation, reload restoration, and export inclusion.

New edges connect `EditorApp` to `CssEditor` and the theme-CSS-draft library. Built-in/custom theme CSS supplies the default document for each theme id; the independent local-storage map overrides those defaults. The active document is rewritten to a dedicated runtime class, which styles the canonical measured DOM and page copies and feeds HTML export. `PersistedState` and `ResumeSettings` do not change.

## Implementation Plan

1. Add direct dependencies for CodeMirror CSS language support and PostCSS parsing.
2. Create `src/lib/cssDraft.ts` with a dedicated per-theme storage map, per-document 500 KB boundary, resilient load/save helpers, and a runtime CSS transform parameterized by the source theme scope.
3. Parse the active complete theme CSS with PostCSS, remove `@import`, preserve keyframe step selectors, replace `.theme.<built-in-id>` or `.resume-theme` roots with `.theme.css-editor-theme`, and prefix newly added ordinary selectors with that same runtime root.
4. Refactor `MarkdownEditor.tsx` around a private shared CodeMirror adapter and export both `MarkdownEditor` and `CssEditor` with the appropriate language extension and localized accessible name.
5. Allow `PanelHeader.label` to accept React content, then render an accessible `MARKDOWN / CSS` tab list in `EditorApp` and conditionally mount the selected editor.
6. Resolve the selected theme's document from the draft map or its built-in/custom source, debounce-save edits by theme id, support resetting the active entry, derive safe runtime CSS, and inject that replacement stylesheet.
7. Render editor preview resumes with `.theme.css-editor-theme` plus `data-theme-id=<original-id>` so bundled source theme selectors no longer match, while theme-dependent layout behavior can still read the original id.
8. Pass the active runtime theme CSS into standalone HTML export, and convert edited rules to portable `.resume-theme` scope when saving a new custom theme. Preserve the existing live-DOM PDF/PNG flow.
9. Add focused unit tests for per-theme storage, size fallback, source-root replacement, selector lists, nested at-rules, keyframes, `:root`, unsafe shell selectors, `@import`, and malformed documents.
10. Add Playwright coverage for tab semantics, default complete theme CSS, per-theme switching, reset, live preview changes, application-shell isolation, reload restoration, and HTML export content.
11. Run focused tests while iterating, then `npm run check`; inspect desktop and mobile screenshots and compare the final diff with this plan.
12. Update the knowledge graph diagrams, data ownership, edit/persist/export flows, node catalog, invariants, impact map, test map, and change ledger.

## Verification Plan

Automated verification:

```bash
npm run test -- src/lib/cssDraft.test.ts
npm run check
git diff --check
```

Behavioral and visual checks:

- The left header shows `MARKDOWN` followed by `CSS`, with one selected tab at a time.
- Selecting CSS displays a CSS-syntax CodeMirror editor; returning to Markdown preserves Markdown content.
- The CSS editor initially contains `.theme.github` CSS; choosing another theme replaces the editor content with that theme's CSS, and returning restores the GitHub document.
- Editing an existing heading color updates the resume immediately while the application header remains unchanged; resetting restores the source CSS.
- Selector lists and rules nested in `@media` remain scoped; keyframe step selectors remain syntactically valid; `@import` has no runtime effect.
- Per-theme raw documents survive reload under `markdown-resume-theme-css-v1`; malformed/oversized stored entries fall back to their source theme CSS.
- PDF/PNG retain live styled output and downloaded HTML contains the active runtime theme CSS.
- The tab labels and editor remain usable without overlap at desktop and 390-pixel mobile widths.

## Risks, Mitigations, And Rollback

- Risk: Raw CSS could leak into the editor shell. Mitigation: never inject raw input; parse and rewrite source and ordinary selectors to the dedicated runtime theme class, remove `@import`, and emit a safely transformed source-theme fallback when edited parsing fails.
- Risk: Prefixing keyframe step selectors would corrupt animations. Mitigation: detect ancestors whose at-rule name ends in `keyframes` and leave their child selectors unchanged.
- Risk: Bundled base CSS could compete with edited CSS, making deleted rules appear unchanged. Mitigation: render editor resumes under a dedicated runtime theme class and rewrite only the active full document to that class; preserve the original id separately for layout behavior.
- Risk: Invalid CSS typed mid-edit could leave the resume unstyled. Mitigation: keep the raw document visible and persisted while rendering a safely transformed original-theme fallback until parsing succeeds.
- Risk: Large documents or stale theme ids may exhaust local storage. Mitigation: cap each document at 500 KB, retain at most 32 syntactically valid theme-id entries, and debounce writes.
- Risk: Adding editor tabs could reduce header space on narrow viewports. Mitigation: use stable tab dimensions, prevent tab text wrapping, and verify desktop/mobile screenshots.
- Rollback: Remove the CSS editor/tab, CSS-draft library/key, dependency additions, style injection, export composition, tests, and graph entries. Existing v3 state and custom themes require no migration or cleanup.

## Decisions And Deviations

- Decision: Treat every built-in/custom theme as a separate editable CSS document whose default is the theme's complete current CSS, following the user's clarification that the editor must not start blank.
- Decision: Keep the draft in a separate versioned key so `PersistedState.version === 3` and its normalization contract remain untouched.
- Decision: Use one stable runtime theme class to ensure the edited full document replaces rather than merely overlays globally bundled base CSS.
- Decision: Insert runtime theme CSS before the application's structural and density stylesheet so existing font, spacing, density, pagination, and smart-fit controls preserve their original cascade authority.
- Decision: Convert the active edited document to `.resume-theme` scope before saving a custom theme, so newly added concise selectors remain downloadable and importable.
- Deviation: The initial plan proposed an empty cross-theme override draft. The user clarified that each selected theme must expose its complete CSS by default, so storage, scoping, reset, rendering, and export were redesigned around per-theme full documents before UI integration.

## Completion Checklist

- [x] Reference image, current editor, theme scoping, persistence, export, tests, and knowledge graph inspected.
- [x] Detailed plan created before implementation.
- [x] Dependencies and CSS-draft library added.
- [x] Source tabs and CSS editor implemented.
- [x] Live styling, persistence, and export integration implemented.
- [x] Focused unit and E2E coverage added.
- [x] Full automated and visual verification passed.
- [x] Knowledge graph synchronized and ledger appended.
- [x] Final diff reviewed and result recorded.

## Final Result

Added accessible `MARKDOWN` and `CSS` tabs to the left source panel. The CSS tab opens the complete CSS document for the selected built-in or custom theme, switches documents with theme selection, applies edits live to the canonical measured resume and visible page copies, persists edits independently by theme id, and offers an icon action to restore the current theme's source CSS.

PostCSS rewrites built-in `.theme.<id>`, custom `.resume-theme`, and newly added selectors to the isolated `.theme.css-editor-theme` runtime scope, removes `@import`, preserves keyframes and nested conditional rules, and falls back to original theme CSS while an edited document is malformed. The runtime stylesheet is inserted before application structure/density rules to preserve font, layout-density, pagination, and smart-fit behavior. HTML export receives the active edited runtime CSS; PNG/PDF capture the same live measured DOM; saving a custom theme converts edits back to portable `.resume-theme` scope.

Verification completed on 2026-07-12:

- `npm run check` passed: 3 unit-test files with 23 tests, the TypeScript/Vite production build, and 24 Chromium E2E tests.
- The CSS-specific E2E scenario verified the default full GitHub CSS, CSS language editor, tab semantics, live preview, shell isolation, per-theme switching, debounced local persistence, reload restoration, HTML export content, and source reset.
- Existing theme save/import, five-font rendering, layout density, pagination, smart one-page, GitHub style parity, and PDF/PNG/HTML export tests remained green.
- Desktop and 390-pixel mobile CSS-editor screenshots were generated and inspected after waiting for the lazy editor; tabs, line numbers, syntax-highlighted complete CSS, reset control, and content fit without overlap or truncation.
- `git diff --check` passed before final handoff.
