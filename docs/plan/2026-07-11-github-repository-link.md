# Add GitHub Repository Link To Header Actions

## Metadata

- Status: Completed
- Date: 2026-07-11
- Owner: Codex
- Request: Add a link to this GitHub repository at the upper right, immediately to the right of the language switcher.
- Related files: `src/App.tsx`, `src/components/CatalogPages.tsx`, `src/components/GitHubLink.tsx`, `src/components/SettingsSidebar.tsx`, `src/styles.css`, `e2e/app.spec.ts`, `docs/knowledge-graph.md`

## Background And Evidence

The editor exposes its desktop language switcher in `.sidebar-topbar`, while the responsive editor places another switcher at the end of `.mobile-panel-tabs`. Catalog pages use the same `LanguageSelect` inside `.catalog-header-actions`. There is currently no application-shell link to the project's GitHub repository.

The Git remote is `git@github.com:jarvanstack/markdown-to-resume.git`, so the requested repository destination is `https://github.com/jarvanstack/markdown-to-resume`. The repository already depends on `lucide-react`, so its GitHub icon can provide a compact, familiar control consistent with the existing icon-button design.

## Goals

- Provide an accessible external link to `https://github.com/jarvanstack/markdown-to-resume`.
- Place the GitHub control immediately after the language switcher in every application header variant.
- Preserve the compact desktop, mobile, and catalog layouts.
- Open the external repository in a new tab without exposing the opener context.

## Non-Goals

- Link to the owner's profile instead of this repository.
- Add new dependencies, tracking, authentication, or GitHub API integration.
- Change language-selection behavior, routes, resume state, or export behavior.
- Redesign the surrounding headers.

## Scope And Knowledge-Graph Impact

Affected nodes:

- Route and use-case coordinator (`src/App.tsx`): composes the mobile header action.
- Settings UI (`src/components/SettingsSidebar.tsx`): composes desktop sidebar header actions.
- Catalog pages (`src/components/CatalogPages.tsx`): composes catalog header actions.
- New GitHub repository link (`src/components/GitHubLink.tsx`): owns the shared external-repository control and URL.
- Application styles (`src/styles.css`): owns fixed control dimensions, focus/hover presentation, and responsive header tracks.
- End-to-end tests (`e2e/app.spec.ts`): protects destination, security attributes, and placement after language selectors.

This adds component dependency edges from the three header consumers to the shared GitHub link and a browser-navigation edge from the application shell to the external GitHub repository. It does not affect persisted data or resume rendering flows.

## Implementation Plan

1. Add a small reusable `GitHubLink` component using the existing Lucide GitHub icon, an accessible name/title, the repository URL, and safe new-tab attributes.
2. Render it directly after `LanguageSelect` in the desktop sidebar, mobile panel tabs, and catalog header actions.
3. Style it as a stable 30-by-30-pixel icon control and extend the mobile grid with a dedicated action track so existing tabs do not shift unpredictably.
4. Add Playwright coverage for the href, new-tab security attributes, and DOM order relative to both desktop and mobile language selectors.
5. Run `npm run check`, inspect the rendered app at desktop and mobile sizes, and review the final diff.
6. Synchronize the knowledge graph node catalog, dependency graph, routing/header runtime description, impact/test maps as applicable, and append the change ledger.

## Verification Plan

Automated verification:

```bash
npm run check
git diff --check
```

Behavioral checks:

- At desktop width, the GitHub icon is visible immediately to the right of the sidebar language switcher.
- Below the responsive breakpoint, it is visible immediately to the right of the mobile language switcher without obscuring the workspace tabs.
- On template and theme catalog pages, it appears immediately after the language switcher.
- Each instance links to `https://github.com/jarvanstack/markdown-to-resume`, opens a new tab, has `rel="noreferrer"`, and exposes the accessible name `GitHub`.

## Risks, Mitigations, And Rollback

- Risk: Adding a fifth mobile-grid child could compress the three workspace tabs. Mitigation: assign fixed-width action tracks and retain flexible `minmax` tracks for the tabs.
- Risk: An icon-only link may be unclear to assistive technology. Mitigation: include both `aria-label` and a native `title` tooltip.
- Risk: The repository URL could drift from deployment metadata. Mitigation: use the exact configured origin remote URL as the shared component constant and protect it with E2E coverage.
- Rollback: Remove `GitHubLink`, its three render sites, its CSS rules, and its E2E assertions. No state migration or data cleanup is required.

## Decisions And Deviations

- Decision: Link to the exact origin repository rather than the remote owner's profile, following the user's clarification.
- Decision: Show the link consistently in every header that contains a language switcher, rather than limiting it to one route or viewport.
- Decision: Keep the desktop and catalog action spacing within their existing flex containers and add a dedicated 43-pixel mobile grid track for the icon link.
- Deviation: The E2E adjacency assertions target the language selector's wrapping label because the test id belongs to the nested `select` element.

## Completion Checklist

- [x] Relevant source, styles, tests, remote URL, and knowledge graph inspected.
- [x] Detailed plan created before implementation.
- [x] Shared GitHub link implemented.
- [x] All header placements and responsive styling implemented.
- [x] Automated and visual verification passed.
- [x] Knowledge graph synchronized and change ledger appended.
- [x] Final diff reviewed and final result recorded.

## Final Result

Added a shared Lucide GitHub icon link to `https://github.com/jarvanstack/markdown-to-resume` immediately after the language selector in the desktop editor sidebar, responsive editor toolbar, and catalog headers. The link carries an accessible name and title, opens in a new tab, and uses `rel="noreferrer"`. Stable dimensions and a dedicated mobile grid track preserve the surrounding layouts.

Verification completed on 2026-07-11 after the repository destination was clarified:

- `npm run check` passed: 14 unit tests, the TypeScript/Vite production build, and 23 Chromium E2E tests.
- The E2E test verified the exact repository destination, target, rel, accessible name, and adjacency in desktop, mobile, and catalog headers.
- Generated desktop editor, 390-pixel mobile settings, and template catalog screenshots were inspected; the GitHub control remains visible after the language selector without overlap or truncation.
- `git diff --check` passed before final handoff.

Verification completed on 2026-07-11:
