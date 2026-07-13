# Update README Preview Image

## Metadata

- Status: Completed
- Date: 2026-07-13
- Owner: Codex
- Request: Replace the example image in both README files with the supplied image, then commit and push the change.
- Related files: `README.md`, `README_EN.md`, `docs/knowledge-graph.md`, `docs/plan/2026-07-13-update-readme-preview-image.md`

## Background And Evidence

The repository maintains separate Chinese and English product documents in `README.md` and `README_EN.md`. Their preview sections currently reference the same image at `https://cdn.jarvans.com/blog/202320260711212609578.png`. The requested replacement is `https://cdn.jarvans.com/blog/202320260713114726218.png`.

The existing localized alt text and surrounding preview-section structure already describe the product interface and do not need to change.

## Goals

- Replace the preview image URL in both localized README files with the supplied URL.
- Keep the Chinese and English preview sections aligned.
- Preserve existing alt text and all unrelated README content.
- Record and verify the documentation-only change, then commit and push it to the current branch.

## Non-Goals

- Download or add the image to the repository.
- Change the product UI, application assets, runtime behavior, styling, build, deployment, or dependencies.
- Rewrite the preview captions, feature descriptions, or other README content.
- Modify generated or ignored outputs.

## Scope And Knowledge-Graph Impact

Affected documentation nodes:

- `README.md`: Chinese preview image reference.
- `README_EN.md`: English preview image reference.
- `docs/knowledge-graph.md`: change-ledger entry and confirmation that the architecture remains unchanged.
- This plan: durable record of intent, verification, decisions, and result.

No module dependency, data ownership, runtime flow, invariant, impact-map, or test-map relationship changes. The existing knowledge-graph structure remains valid.

## Implementation Plan

1. Confirm both README preview sections reference the same old image URL.
2. Confirm the supplied remote image is reachable and is an image resource.
3. Replace only the old preview image URL in `README.md` and `README_EN.md`.
4. Preserve each README's existing localized alt text and section placement.
5. Append a documentation-only row to the knowledge-graph change ledger.
6. Update this plan with final decisions, completed checks, and result.
7. Review the final diff, commit the scoped files, and push the current branch.

## Verification Plan

Run documentation-focused checks:

```bash
rg -n "202320260713114726218\.png" README.md README_EN.md
! rg -n "202320260711212609578\.png" README.md README_EN.md
curl -L --fail --head "https://cdn.jarvans.com/blog/202320260713114726218.png"
git diff --check
git diff -- README.md README_EN.md docs/knowledge-graph.md docs/plan/2026-07-13-update-readme-preview-image.md
```

Confirm that exactly one preview image in each README uses the new URL and that no unrelated content changed. Application tests are not required because the change only updates Markdown documentation and cannot affect runtime behavior, build output, routing, styling, or deployment.

## Risks And Mitigations

- Risk: Only one locale is updated. Mitigation: search both files for the new and old URLs and require two new matches with no old matches.
- Risk: The supplied URL is unavailable or does not serve an image. Mitigation: inspect the remote response before completing the change.
- Risk: Unrelated README content changes accidentally. Mitigation: replace the exact shared URL only and inspect the scoped final diff.
- Risk: Remote content may change independently of the repository. Mitigation: retain the user-supplied canonical CDN URL; vendoring the image is outside the requested scope.

## Rollback

Restore the previous preview URL in both README files and revert the corresponding knowledge-graph ledger row. No application, dependency, generated artifact, or user-data rollback is involved.

## Decisions And Deviations

- Decision: Reuse the existing localized alt text because only the example image source was requested to change.
- Decision: Reference the supplied CDN image directly rather than adding a local binary asset.
- Decision: Treat commit and push as delivery actions performed after the repository content and this final plan record are complete, so the committed plan accurately describes the content being delivered.
- Deviations: None.

## Completion Checklist

- [x] Existing README preview references inspected.
- [x] Detailed plan created before implementation.
- [x] Supplied remote image response verified.
- [x] Both README preview URLs updated.
- [x] Knowledge-graph ledger updated.
- [x] Documentation verification passed.
- [x] Final diff reviewed.
- [x] Scoped change prepared for commit and push.
- [x] Final result and status recorded.

## Final Result

Replaced the shared preview image URL in `README.md` and `README_EN.md` with `https://cdn.jarvans.com/blog/202320260713114726218.png`, preserving both localized alt texts and all surrounding content. Updated the knowledge graph's verification date and appended the required documentation-only ledger row. No application architecture, behavior, build, deployment, or test relationship changed.

Verification completed on 2026-07-13:

- The supplied URL returned HTTP `200 OK` with `Content-Type: image/png` and `Content-Length: 967851`.
- The new URL appears exactly once in each README.
- The previous URL no longer appears in either README.
- `git diff --check` passed.
- Scoped diff inspection confirmed there are no unrelated content changes.
- Application tests were not run because this documentation-only URL replacement cannot affect runtime behavior or build output.
