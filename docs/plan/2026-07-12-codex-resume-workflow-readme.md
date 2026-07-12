# Add Codex Resume Workflow To Readmes

## Metadata

- Status: Completed
- Date: 2026-07-12
- Owner: Codex
- Request: Add a marketing-oriented Codex resume-writing and Markdown-to-PDF workflow to the beginning of the README in both Chinese and English.
- Related files: `README.md`, `README_EN.md`, `docs/knowledge-graph.md`

## Background And Evidence

The repository has separate language-specific landing documents: `README.md` presents the Chinese product introduction and links to `README_EN.md`, while `README_EN.md` mirrors the same structure in English. Both currently move directly from the centered product hero into the general product-benefits section. Neither gives prospective users a concrete AI-assisted workflow that connects resume outlining, Codex drafting and review, iterative Markdown editing, and Moli's PDF export.

The product documentation already supports the claims needed by the requested workflow: Moli edits Markdown, provides smart one-page fitting, uses GitHub Markdown styling, and exports PDF in the browser.

## Goals

- Put a concise, high-impact Codex resume workflow near the top of both README variants.
- Preserve the same five-step journey in Chinese and idiomatic English.
- Preserve the user-supplied Chinese wording verbatim.
- Translate the workflow faithfully into English, including Smart One-Page fitting, GitHub styling, and PDF export.

## Non-Goals

- Change application UI, runtime behavior, themes, export logic, or dependencies.
- Add new screenshots, generated visual assets, or product capabilities.
- Rewrite the existing feature, setup, privacy, or technical-stack documentation.
- Claim that Codex is built into Moli or that resume content is sent from Moli to an external AI service.

## Scope And Knowledge-Graph Impact

Affected documentation nodes:

- `README.md`: Chinese product-facing onboarding and marketing copy.
- `README_EN.md`: English counterpart with matching workflow and claims.
- `docs/knowledge-graph.md`: change ledger entry and documentation-only impact confirmation.

No application module, runtime-flow, data-ownership, persistence, build, deployment, invariant, or test edge changes. The knowledge graph's existing application structure remains valid.

## Implementation Plan

1. Add the supplied Chinese workflow immediately after the hero separator in `README.md` so it appears before the general feature list.
2. Add only the Markdown heading marker and ordered-list markers required to render the supplied text; do not rewrite, expand, or polish its wording.
3. Add an equivalent English section at the same location in `README_EN.md`, translating the heading and each of the five steps without introducing extra content.
4. Preserve the requested journey: outline, Codex drafting, table-based critique, iteration, and markdown-to-resume PDF generation.
5. Preserve the requested emphasis on Smart One-Page and GitHub styling in both languages.
6. Append the documentation-only change to the knowledge-graph ledger and confirm that no architecture sections require modification.
7. Review the Chinese text character-for-character against the request, compare English meaning line by line, inspect Markdown structure, and check the final diff.

## Verification Plan

Run documentation-focused checks:

```bash
git diff --check
rg -n "Codex|智能一页|Smart One-Page|GitHub|markdown-to-resume" README.md README_EN.md
test -f README.md
test -f README_EN.md
test -f docs/plan/2026-07-12-codex-resume-workflow-readme.md
```

Behavioral inspection:

- Confirm the workflow appears before the existing benefits section in both README files.
- Confirm the Chinese heading and five steps match the supplied copy exactly.
- Confirm the English heading and five steps are a direct translation with no added claims or explanation.
- Confirm wording describes a workflow rather than an in-product Codex integration.

Application tests are not required because the change only edits Markdown documentation. Per `AGENT.md`, link/path inspection and `git diff --check` are the minimum required checks.

## Risks And Mitigations

- Risk: The supplied wording is accidentally polished or expanded. Mitigation: compare the final Chinese text character-for-character with the request and permit only Markdown structure around it.
- Risk: Chinese and English claims drift. Mitigation: use matching section placement, ordered steps, and emphasized capabilities, then review the translation line by line.
- Risk: Marketing language implies a native Codex integration. Mitigation: explicitly separate Codex's content workflow from Moli's formatting and export role.
- Risk: The phrase “one page” overpromises for excessively long content. Mitigation: name the existing Smart One-Page feature without claiming that every possible resume can fit legibly.

## Rollback

Remove the added workflow sections from `README.md` and `README_EN.md`, then remove the corresponding knowledge-graph ledger row. No runtime, dependency, generated artifact, or user-data rollback is involved.

## Decisions And Deviations

- Decision: Place the workflow after the centered hero and separator, retaining the existing language switcher and product identity as the first viewport content.
- Decision: Add localized copy to the repository's existing separate README files instead of mixing two full languages into one document.
- Decision: Preserve the user's supplied Chinese wording verbatim, adding only the Markdown heading prefix and ordered-list structure required to render it in the README.
- Decision: Keep the English section to a faithful line-by-line translation, without adding examples, explanations, or marketing copy absent from the Chinese source.
- Decision: Add the user-approved `🚀` emoji before both localized headings while leaving all supplied Chinese wording unchanged.
- Deviation: The first implementation expanded and polished the supplied copy. User feedback clarified that the Chinese text must remain unchanged, so both sections are being reduced to the original five lines and their direct translation.

## Completion Checklist

- [x] Existing README structures and product claims inspected.
- [x] Detailed plan created before implementation.
- [x] User-supplied Chinese workflow preserved verbatim in `README.md`.
- [x] Faithful English translation added to `README_EN.md`.
- [x] Knowledge-graph ledger updated.
- [x] User-approved heading emoji added in both languages.
- [x] Documentation verification passed after heading update.
- [x] Final result and status updated.

## Final Result

Added the user's Chinese Codex resume workflow near the top of `README.md`, preserving the supplied wording and adding only the Markdown structure plus the user-approved `🚀` heading emoji. Added a direct English translation with the same emoji, heading meaning, and five steps to `README_EN.md`. No explanatory copy, expanded prompts, calls to action, or claims were added.

Verification completed on 2026-07-12:

- `git diff --check` passed.
- A trailing-whitespace scan passed for all changed documentation files, including this untracked plan file.
- Manual source inspection confirmed the Chinese wording, punctuation, capitalization, spacing, and bold emphasis match the user's supplied text, with only the approved heading emoji added.
- Manual line-by-line review confirmed the English section is limited to a faithful translation of the same five steps.
- Application tests were not run because this change only affects Markdown documentation and does not change runtime behavior, build output, routing, styling, or deployment.
