# Project Knowledge Graph And Change Protocol

## Metadata

- Status: Completed
- Date: 2026-07-11
- Owner: Codex
- Request: Document the complete project knowledge graph, require graph maintenance for every change, and require a detailed plan under `docs/plan/` for every change.
- Related files: `AGENT.md`, `AGENTS.md`, `docs/knowledge-graph.md`

## Background And Evidence

The repository is a browser-only Markdown resume editor implemented with React 19, TypeScript, and Vite. Before this change it had user documentation and tests, but no checked-in architecture map, no project-level agent instructions, and no checked-in `docs/plan/` history. The existing ignored `doc/todo.md` records product history but is not a maintained architecture or change-design source.

Repository inspection established these central relationships:

- `src/App.tsx` selects the editor, template catalog, or theme catalog by pathname and coordinates editor state and use cases.
- `src/components/ResumePreview.tsx` turns Markdown into themed DOM and maintains a hidden measurable copy used for pagination and export.
- `src/lib/pagination.ts` owns paper geometry, page-break selection, and smart one-page fitting.
- `src/lib/storage.ts` and `src/lib/customThemes.ts` own the two main local-storage records; `src/i18n.tsx` owns the locale record.
- `vite.config.ts` builds three HTML entry points, and `.github/workflows/deploy-pages.yml` deploys them to GitHub Pages with a repository base path.
- Vitest protects storage, locale resources, and SEO metadata; Playwright protects integrated editor, theme, template, pagination, export, responsive, and crawlable-route behavior.

## Goals

- Create a canonical, navigable knowledge graph that covers system context, modules, data ownership, runtime flows, build/deployment, invariants, change impact, and test coverage.
- Make graph maintenance objectively checkable for every future repository change.
- Require a detailed, persistent implementation plan for every future change.
- Provide an automatically discoverable `AGENTS.md` without losing the requested singular `AGENT.md` policy file.

## Non-Goals

- Change application behavior, styling, dependencies, storage schemas, or deployment behavior.
- Refactor source code or expand automated test coverage.
- Add generated graph tooling or a CI policy checker in this change.
- Document ignored build artifacts and dependencies as maintained architecture nodes.

## Scope And Knowledge-Graph Impact

New governance nodes:

- `AGENTS.md`: agent discovery entry point.
- `AGENT.md`: repository-wide change protocol.
- `docs/plan/*.md`: durable design and execution history.
- `docs/knowledge-graph.md`: canonical architecture and change-impact source.

The application graph is derived from current tracked source files. This change adds documentation relationships only; it does not alter application runtime edges.

## Implementation Plan

1. Inventory tracked files, package scripts, routes, source imports, state types, storage keys, theme/template data, tests, and deployment configuration.
2. Identify architectural nodes by responsibility rather than listing every function: bootstrap/i18n, route composition, workspace components, catalog components, domain data, storage, custom themes, density, pagination, export, SEO, styles/assets, tests, build, and deployment.
3. Draw a system-context graph that makes the client-only and local-first boundaries explicit.
4. Draw a module graph with directional dependencies and a data-entity graph for persisted state, settings, templates, and themes.
5. Document the edit/preview/persist, pagination/fit, export, routing/i18n, and build/deploy flows.
6. Add a node catalog with ownership and consumers, plus invariants that explain fragile cross-module contracts.
7. Add a change-impact matrix and test map so future work can locate the minimum affected documentation and verification.
8. Add a change ledger and record this initial graph creation with a link back to this plan.
9. Write `AGENT.md` with a mandatory plan-first and graph-update workflow, plan schema, graph update semantics, project guardrails, and verification commands.
10. Add `AGENTS.md` as the conventional discovery entry point that delegates to `AGENT.md`.
11. Validate Mermaid syntax structurally, verify all referenced paths exist, run whitespace checks, and compare the final diff with the documented graph.

## Verification Plan

Documentation checks:

```bash
git diff --check
test -f AGENT.md
test -f AGENTS.md
test -f docs/knowledge-graph.md
test -f docs/plan/2026-07-11-project-knowledge-graph.md
rg -n "docs/plan|knowledge-graph|change ledger|变更账本" AGENT.md AGENTS.md docs/knowledge-graph.md docs/plan/2026-07-11-project-knowledge-graph.md
```

Consistency checks:

- Compare every tracked `src/` module to the node catalog or its documented group.
- Compare package scripts and Vite inputs to the build/deployment flow.
- Compare unit and end-to-end test files to the test map.
- Confirm every Mermaid edge names an existing module, data entity, browser API, package, or external system.

No application tests are required because this change adds Markdown policy and architecture documentation only. `npm run check` remains required for future behavior-affecting changes under `AGENT.md`.

## Risks And Mitigations

- Risk: A graph that is too file-oriented becomes unreadable. Mitigation: group leaf CSS, assets, and tests while retaining a detailed node catalog.
- Risk: A graph becomes stale despite the policy. Mitigation: require both affected-section updates and a per-change ledger row, even for changes without architecture impact.
- Risk: Tools discover only `AGENTS.md`, while the request explicitly names `AGENT.md`. Mitigation: keep the full policy in `AGENT.md` and add a small conventional `AGENTS.md` entry point.
- Risk: Plans become shallow checklists. Mitigation: require evidence, non-goals, impact, exact verification, risks, deviations, and final results.

## Rollback

Remove `AGENT.md`, `AGENTS.md`, `docs/knowledge-graph.md`, and this plan file. No application or persisted user data migration is involved.

## Decisions And Deviations

- Decision: Use Markdown plus Mermaid so the graph is reviewable in diffs and rendered by common repository viewers.
- Decision: Treat `docs/knowledge-graph.md` as the single source of truth instead of splitting related diagrams across multiple files.
- Decision: Keep the requested singular policy file and add the conventional plural discovery file.
- Deviation: While documentation was being verified, separate user-owned changes moved canonical SEO URLs from GitHub Pages to `https://resume.jarvans.com`. Those source changes were preserved and not attributed to this plan; the graph baseline was synchronized with their current final values because SEO origin is part of the documented architecture.

## Completion Checklist

- [x] Repository structure and behavior inspected.
- [x] Detailed plan created under `docs/plan/`.
- [x] Knowledge graph created and cross-checked.
- [x] `AGENT.md` policy created.
- [x] `AGENTS.md` discovery entry created.
- [x] Documentation verification passed.
- [x] Final result and status recorded.

## Final Result

Created a canonical architecture knowledge graph with seven Mermaid diagrams, a node catalog, twelve invariants, a change-impact matrix, test mapping, repository boundaries, and a mandatory change ledger. Added repository-level agent rules that require every change to carry a detailed plan and a synchronized graph update.

Verification completed on 2026-07-11:

- Documentation path, fence, trailing-whitespace, and `git diff --check` checks passed.
- `npm run test` passed: 2 test files and 14 tests.
- Application build and E2E tests were not run because this task changed only Markdown documentation and policy files.
