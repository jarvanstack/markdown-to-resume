# Restore Visible Bold Font Weights

- Status: Complete with GitHub system-font option
- Owner: Codex
- Date: 2026-07-12
- Related files: `src/data/themes.ts`, `src/lib/storage.ts`, `src/lib/storage.test.ts`, `src/themes/fonts.css`, `src/assets/fonts/*-Bold.*`, `src/assets/fonts/LICENSES.md`, `e2e/app.spec.ts`, `docs/knowledge-graph.md`

## Background And Evidence

Markdown emphasis is parsed correctly: `react-markdown` emits `<strong>` elements and the GitHub theme assigns them a heavier computed weight. The visual result still looks identical to surrounding text because every bundled or selected font is backed by a single static Regular/Medium face while `src/themes/fonts.css` declares that face as if it natively supported the full `400 900` variable-font range. Browsers therefore reuse the same glyph outlines for normal and bold requests instead of synthesizing a heavier face.

Follow-up inspection of the actual `http://localhost:5175/` DOM exposed a second condition missed by the initial implementation: `body` sets `font-synthesis: none` in `src/styles.css`, and the resume inherits it. The live GitHub preview reported `font-weight: 400` for normal content, `font-weight: 600` for `<strong>`, but `font-synthesis: none`; a single static face therefore still cannot produce a heavier DOM glyph. The initial E2E test switched to the Crisp theme and compared Canvas text, which did not assert the DOM's inherited `font-synthesis` contract.

After weight synthesis was restored, the user confirmed that GitHub's `600` strong weight is still less prominent than the editor's bold text and requested a conventional, slightly heavier bold appearance. Built-in theme documents currently vary (`500` in Airy, `600` in GitHub and Crisp, `700` in Vivid), and locally persisted CSS drafts can retain those old values. Runtime theme CSS is intentionally inserted before shared application styles, so a shared semantic `b`/`strong` rule in `fonts.css` can consistently establish the requested `700` default across built-in themes, old drafts, live preview, and export.

The user then chose the durable solution: add real Bold font faces instead of relying on synthetic emboldening. The repository currently bundles only Alibaba Sans Regular, Source Han Sans SC Regular, and Source Han Serif SC Regular. Alibaba Sans Bold is available from the same existing upstream CDN; Adobe's official Source Han Sans/Serif release branches provide OFL-licensed CN Bold OTFs. PingFang SC and Times New Roman are proprietary and must not be copied from the host system into the repository, so their `700` faces will prefer the platform's real Semibold/Bold face and fall back to the matching bundled open CJK Bold family when unavailable.

The user also requested a selectable GitHub font and made its behavior explicit: the GitHub theme should use GitHub's official system font stack by default, while users retain the ability to choose another font. GitHub's stack is `-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`; it resolves to San Francisco on macOS and Segoe UI on Windows rather than bundling a GitHub-owned font file. The existing theme-selection invariant preserves user adjustments when switching built-in themes, so only a fresh default state and “reset to theme defaults” should select this new option automatically.

The font stylesheet is loaded by the live application and embedded by `src/lib/export.ts`, so the same faulty face matching affects the canonical hidden measurement DOM, visible preview pages, PNG/PDF rasterization, and standalone HTML export.

## Goals

- Make Markdown `**bold**` content visibly heavier than adjacent normal text for every selectable resume font.
- Use the conventional `700` semantic bold weight so preview emphasis is as obvious as editor bold text.
- Resolve `700` from real Bold font data for every selectable stack, using bundled redistributable assets or a platform Bold face before an open bundled fallback.
- Add the exact GitHub system stack as a user-selectable font and make it the GitHub theme's fresh/reset default without overriding an explicit user choice.
- Restore visible weight hierarchy for other theme rules that request weights above normal.
- Keep preview, pagination, and all export formats on the same font-face contract.
- Protect the behavior with a browser-level test that detects identical rendered glyphs, not only different computed CSS values.

## Non-Goals

- Add unrelated font weights, italics, or new selectable font families.
- Change selectable font names, theme typography values, Markdown parsing, or persisted settings.
- Redesign heading, link, or other non-semantic theme weight choices.

## Scope And Knowledge-Graph Impact

Affected nodes are Theme and shared resume styles, Font and public assets, Resume rendering, Export, and end-to-end tests. Existing edges remain intact: application styles load the shared font CSS, and export embeds the same CSS. The font-face invariant is clarified so a static source is not advertised as a variable-weight source. No new module or runtime dependency is introduced.

## Implementation Steps

1. Change each single-source `@font-face` rule from the variable range `400 900` to the normal baseline weight `400`, allowing the browser's standard weight synthesis to serve heavier requests.
2. Set `font-synthesis: weight` at the shared `.resume-sheet.theme` font boundary so the application shell can continue disabling synthesis without affecting resume typography.
3. Extend the font E2E coverage with Markdown containing adjacent normal and strong text on the default GitHub theme.
4. For every selectable font, assert that the rendered resume permits weight synthesis, wait for the normal face, and compare browser-rasterized normal and bold glyph pixels while also asserting the rendered `<strong>` element requests a heavier computed weight.
5. Establish `font-weight: 700` for semantic `b` and `strong` elements at the shared resume font boundary, after runtime theme CSS in the cascade, so existing `500/600` theme rules and persisted drafts receive the stronger default.
6. Tighten the browser regression from merely “heavier than normal” to the exact `700` contract and visually inspect the user's Chinese sentence.
7. Update the knowledge graph's font ownership/invariant, impact and test descriptions, and append the change ledger entry.
8. Run `npm run check`, inspect the live preview and final diff, and synchronize this plan's status and result.
9. Download Alibaba Sans Bold from the existing upstream and Adobe Source Han Sans/Serif CN Bold from their official release branches; subset the two large Adobe OTFs to the exact Unicode coverage of the corresponding checked-in Regular WOFFs and encode them as WOFF.
10. Add explicit `700` `@font-face` rules: bundled Alibaba/Source Han Bold assets for redistributable families; platform PingFang SC Semibold/Bold and Times New Roman Bold first for proprietary families, followed by bundled Source Han Sans/Serif Bold fallbacks.
11. Record font sources, redistribution policy, and licenses beside the assets; verify every new file reports weight class `700` and that no proprietary font binary was added.
12. Extend browser coverage to assert that all five selected stacks load a `700` face and retain visibly distinct normal/bold glyphs without changing the selected family contract.
13. Add a `GitHub-System` font option with GitHub's official system stack, while retaining the existing PingFang constant as the base/fallback default for non-GitHub themes and imported custom themes.
14. Set the GitHub theme definition and v3 fresh-state defaults to `GitHub-System`; preserve stored `fontFamily` values and the built-in-theme selection behavior that keeps user typography adjustments.
15. Add unit/E2E assertions for option availability, fresh GitHub default, exact computed system stack, user override persistence across theme switches, and GitHub reset behavior.

## Verification Plan

- `npm run test:e2e -- --grep "五套新字体"` during focused iteration.
- `npm run check` for unit tests, TypeScript/Vite production build, and the full Chromium E2E suite.
- Confirm the E2E test observes distinct normal/bold raster output for all five font options.
- Inspect new font metadata for weight class `700`, family/subfamily, Unicode coverage, and file size.
- Confirm the production build emits all three bundled Bold assets and live requests resolve without font-load errors.
- Confirm a fresh GitHub resume computes the official system font stack, selecting PingFang remains stable through theme switches, and resetting GitHub restores `GitHub-System`.
- Run `git diff --check` and review the final diff without altering unrelated existing worktree changes.

## Risks And Mitigations

- Risk: Synthetic bold can slightly change line wrapping and page breaks.
  - Mitigation: This is the intended typography correction; the full E2E suite covers preview pagination, one-page fitting, and exports.
- Risk: A locally installed font may render differently from a bundled fallback.
  - Mitigation: Assert a semantic heavier computed weight and compare actual browser glyph pixels rather than fixed dimensions or screenshots.
- Risk: External font fallbacks may load asynchronously.
  - Mitigation: Explicitly await `document.fonts.load` before raster comparison.
- Risk: Full Source Han CN OTFs would add roughly 20 MB to the repository and application.
  - Mitigation: Subset each official Bold source to the exact code-point coverage of its existing Regular counterpart and encode as WOFF, preserving real Bold outlines without expanding supported text.
- Risk: Redistributing PingFang SC or Times New Roman would violate their platform/commercial licensing.
  - Mitigation: Bundle neither binary; prefer their installed real Bold faces and fall back to OFL-licensed Source Han Bold assets.

## Rollback Approach

Revert the font-face descriptor and shared resume synthesis/semantic-bold rules, then remove the matching regression assertions. No persisted data migration or generated asset cleanup is required.

## Decisions And Deviations

- Treat each selectable single static face as the `400` baseline even when its source filename says Medium. The descriptor controls CSS face matching; a single face must not claim the complete range if heavier glyph data is absent.
- The regression test was run once against the old `400 900` declarations as a negative control. It failed on `Resume PingFang` with a normal-versus-bold pixel difference of zero, then passed after restoring the corrected descriptors, confirming that the test detects the reported visual defect.
- Live-browser verification invalidated the initial completion claim: the real resume DOM inherited `font-synthesis: none`, while the Canvas-based raster probe synthesized weight independently. The final regression must remain on the default GitHub theme and assert the DOM synthesis setting directly.
- Use the standard CSS bold weight `700` as a shared semantic-content contract rather than preserving built-in themes' weaker `500/600` strong rules. Runtime theme CSS remains editable; authors who intentionally need a different strong weight can opt out with a more specific selector or `!important`.
- Do not extract the host's PingFang SC or Times New Roman files. Real platform faces are valid CSS sources but not repository assets; Source Han Bold provides a redistributable cross-platform fallback.
- Keep Source Han additions compact: the official 8.57 MB Sans and 12.09 MB Serif Bold OTFs are build inputs only; checked-in WOFF subsets are 1.60 MB and 2.51 MB and omit none of the corresponding Regular font's code points.
- Keep `DEFAULT_FONT_FAMILY` as PingFang for non-GitHub theme bases and invalid/custom-theme fallback; introduce a separate GitHub default instead of coupling every theme to the new option.

## Completion Checklist

- [x] Current parsing, theme CSS, shared font CSS, and export usage inspected.
- [x] Static face descriptors corrected.
- [x] Resume DOM explicitly permits weight synthesis.
- [x] GitHub-theme browser regression coverage added and passing.
- [x] Semantic `b` and `strong` elements use exact weight `700` across themes and persisted drafts.
- [x] Browser regression asserts the exact stronger weight.
- [x] Redistributable real Bold assets added with source/license record.
- [x] Proprietary font stacks use installed real Bold faces with bundled real-Bold fallbacks.
- [x] Browser regression confirms every stack resolves and renders real Bold.
- [x] Knowledge graph synchronized with bundled and platform Bold ownership.
- [x] `npm run check` and `git diff --check` pass after the real-font follow-up.
- [x] Final live preview, font metadata, build assets, and diff reviewed.
- [x] GitHub system font option and exact stack added.
- [x] Fresh/reset GitHub defaults use the new option without overriding user choices during theme switches.
- [x] Unit/E2E coverage protects option/default/override/reset behavior.
- [x] Knowledge graph synchronized with GitHub font ownership and state flow.
- [x] Final `npm run check`, live preview, and diff review pass.

## Final Result

Added real `700` faces for every selectable font stack. Alibaba Sans Bold (98 KB), Source Han Sans SC Bold (1.60 MB), and Source Han Serif SC Bold (2.51 MB) are checked-in redistributable assets with source/license notices; the two Source Han files preserve every code point in their corresponding Regular WOFF. PingFang SC prefers installed Semibold/Bold, Times New Roman prefers installed Bold, and each uses the matching bundled Source Han Bold when the proprietary platform face is unavailable. Official Adobe CDN sources remain a final fallback for downloaded standalone HTML where relative bundled URLs cannot resolve.

Font metadata inspection confirmed weight class `700` for all three new assets. The five-font E2E scenario explicitly loaded `700` for each internal family, found a loaded `700` FontFace, asserted semantic strong weight `700`, and confirmed different normal/bold glyph pixels. The production build emitted all three new Bold assets, and `npm run check` passed 28 unit tests, the production build, and all 25 Chromium E2E tests including pagination, fitting, and exports.

A separate Chromium resource inspection loaded `700 32px "Resume PingFang"` for the user's Chinese sample, reported the `700` face as loaded, and recorded no font network request. On the current macOS host the default stack therefore resolves directly to the installed real PingFang Semibold/Bold face; the bundled Source Han Sans Bold remains the non-PingFang fallback.

Added `GitHub-System` as the first selectable font with GitHub's exact published system stack. Fresh v3 state and GitHub theme defaults now use it, while the non-GitHub base/default fallback remains PingFang. Existing stored font selections are preserved, choosing another font remains stable while switching built-in themes, and resetting GitHub restores `GitHub-System`.

Unit coverage verifies the exact stack, fresh default, non-GitHub defaults, and stored PingFang preservation. E2E coverage verifies the computed `-apple-system` stack, option availability, user override persistence, and reset behavior. The final `npm run check` passed 28 unit tests, the production build, and all 26 Chromium E2E tests. The fresh desktop screenshot shows `GitHub-System` selected with stable Chinese/English typography and no layout overlap.
