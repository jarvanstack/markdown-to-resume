# Repository Agent Rules

This file applies to the entire repository. `AGENTS.md` is the discovery entry point and delegates to this file.

## Mandatory Change Protocol

Every addition, modification, or deletion in this repository MUST include both of the following documentation updates in the same change:

1. Create or update one detailed plan in `docs/plan/*.md` before implementation starts.
2. Update `docs/knowledge-graph.md` before the change is considered complete.

There are no code-only, configuration-only, test-only, or documentation-only exceptions. If a change does not alter architecture, still update the knowledge graph's change ledger with the affected nodes, the relationships reviewed, and why the graph structure remains valid.

## Required Workflow

1. Read `docs/knowledge-graph.md` and the relevant source files.
2. Create `docs/plan/YYYY-MM-DD-<short-slug>.md`. If a plan for the same change already exists, update that file instead of creating a duplicate.
3. Record the current behavior, desired outcome, scope, implementation steps, verification, risks, rollback approach, and knowledge-graph impact.
4. Implement the smallest coherent change that satisfies the plan.
5. Keep the plan's status and decisions current when implementation differs from the original approach.
6. Update every affected part of `docs/knowledge-graph.md`: diagrams, node catalog, runtime flows, invariants, impact map, test map, and change ledger as applicable.
7. Run verification proportional to the change. Use `npm run check` for changes that can affect application behavior, build output, routing, styling, or deployment.
8. Review `git diff` and confirm that the plan and knowledge graph describe the final implementation rather than the initial guess.

## Detailed Plan Format

Each `docs/plan/*.md` file must contain:

- Status, owner, date, and related files.
- Background and evidence from the current repository.
- Goals and explicit non-goals.
- Scope and affected knowledge-graph nodes or edges.
- Ordered implementation steps detailed enough for another engineer to execute.
- Verification plan with exact commands and behavioral checks.
- Risks, mitigations, and rollback approach.
- Decisions or deviations discovered during implementation.
- Completion checklist and final result.

Do not delete historical plan files after completion. They are the repository's change-design record.

## Knowledge Graph Rules

`docs/knowledge-graph.md` is the canonical architecture map. Keep names and paths aligned with the source tree.

- Add a node when a new module, persistent entity, external system, route, or major responsibility appears.
- Add or change an edge when imports, data ownership, calls, rendering, persistence, build, or deployment relationships change.
- Update runtime flows when user-visible behavior or state transitions change.
- Update invariants and the impact map when a contract or ownership boundary changes.
- Update the test map when coverage files or protected behavior change.
- Append one row to the change ledger for every repository change and link its plan file.
- Never claim the graph is current without checking the final diff against it.

## Project Guardrails

- This is a client-only React 19 and TypeScript application built by Vite. Do not introduce a server dependency without an explicit architectural decision in the plan and graph.
- Resume content and preferences are local-first. Preserve v3 state normalization and fallback behavior in `src/lib/storage.ts`.
- `ResumeSettings` in `src/types.ts` is a shared contract across themes, storage, preview, pagination, export, and settings UI. Treat changes to it as cross-cutting.
- The hidden `.resume-measure` DOM in `PaginatedResumePreview` is the canonical rendered element used by pagination, smart fitting, and export. Preserve this relationship or document and test its replacement.
- Built-in theme CSS is scoped under `.theme.<id>`; custom theme CSS is normalized to `.theme.<custom-id>`. Do not allow imported theme rules to leak into the application shell.
- Preserve Chinese and English resources together when changing user-facing text, templates, or SEO metadata.
- `templates/index.html` and `themes/index.html` are independent Vite HTML inputs for crawlable catalog routes. Keep route handling, metadata, sitemap entries, and deployment base paths aligned.
- Do not edit generated or ignored outputs such as `dist/`, `artifacts/`, `test-results/`, `*.tsbuildinfo`, or generated config JavaScript unless the task explicitly concerns generated artifacts.

## Verification Commands

```bash
npm run test
npm run build
npm run test:e2e
npm run check
```

Choose focused checks while iterating, then use the broadest relevant command before completion. Documentation-only changes require at least link/path inspection and `git diff --check`.
