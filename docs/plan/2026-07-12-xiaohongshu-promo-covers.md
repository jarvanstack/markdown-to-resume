# Create Xiaohongshu Codex Resume Workflow Covers

## Metadata

- Status: Completed
- Owner: Codex
- Date: 2026-07-12
- Related files: `marketing/xiaohongshu/codex-resume-workflow-01.png`, `marketing/xiaohongshu/codex-resume-workflow-02.png`, `marketing/xiaohongshu/codex-resume-workflow-03.png`, `docs/knowledge-graph.md`

## Background And Evidence

The campaign translates the five-step Codex resume-writing workflow in `README.md` into three Xiaohongshu cover images. The first implementation used an HTML/CSS poster source and a real application screenshot. User review rejected that approach as too complex and requested direct `gpt-image-2` generation without screenshots. A first minimal generation then removed too much information; the user clarified that every cover must still contain the core copy, all five steps, and the project link.

The retained product claims are narrow and supported by the repository: Codex can be used as a separate writing and critique workflow, while markdown-to-resume turns the finished Markdown into a smart one-page, GitHub-style PDF. The cover copy must not imply a native Codex integration.

After approving the information-complete direction, the user requested one targeted revision: only the first cover's footer link must change from the deployed project URL to the GitHub repository URL. Covers two and three retain the deployed project URL.

## Goals

- Replace the current three covers with simpler but information-complete `gpt-image-2` generations.
- Give each version one dominant headline, one clearly ordered five-step block, one short benefit line, and the project link.
- Use no product screenshots, browser UI, workflow diagrams, dense feature lists, or HTML/CSS rendering.
- Generate standard portrait images at 1024 x 1536 pixels; an earlier custom-size request was not honored consistently by the Image API.
- Keep the three directions visually distinct while retaining a professional, high-contrast editorial character.
- Preserve the first cover pixel composition while changing only its footer link to `github.com/jarvanstack/markdown-to-resume`.

## Non-Goals

- Change application runtime behavior, styling, routes, templates, themes, exports, or README copy.
- Reproduce the web application interface or show a generic fake interface.
- Add QR codes, device mockups, detailed resume body text, or social-platform publishing automation.

## Scope And Knowledge-Graph Impact

This revision keeps the non-runtime `Marketing assets` node under `marketing/xiaohongshu/`, but changes its production flow from local HTML/CSS and a product screenshot to direct OpenAI Image API generation with `gpt-image-2`. The obsolete `covers.html` and `product-workspace.png` sources will be removed. The generated PNGs remain isolated campaign assets and do not participate in the Vite build or deployment bundle.

## Implementation Steps

1. Define three restrained `ads-marketing` prompts with different layouts and an identical exact copy block: headline, five steps, benefit line, and link.
2. Run the bundled image-generation CLI in explicit `gpt-image-2` batch mode at 1024 x 1536 and high quality.
3. Save the three results over the explicitly rejected cover filenames and remove the obsolete HTML/CSS and screenshot sources.
4. Inspect every generated cover for simplicity, composition, text accuracy, artifacts, and watermarking.
5. Regenerate only the failed direction when text or composition violates the prompt.
6. Update the knowledge graph to describe the final model-generation flow and remove screenshot/rendering relationships.
7. Record the final prompt set, validation results, decisions, and files in this plan.
8. Edit cover one with `gpt-image-2`, replacing only the footer URL while preserving every other text string and visual property.

## Verification Plan

Exact checks:

```bash
file marketing/xiaohongshu/codex-resume-workflow-*.png
test ! -e marketing/xiaohongshu/covers.html
test ! -e marketing/xiaohongshu/product-workspace.png
git diff --check
git status --short
```

Visual checks:

- Each cover is 1024 x 1536 and nonblank.
- Each composition has one dominant headline and one clearly ordered five-step block without decorative overload.
- No application screenshot, fake browser UI, device mockup, complex flowchart, or feature grid appears.
- The headline, all five steps, benefit line, and project link are present and spelled correctly; no unrequested visible text or watermark appears.
- Cover one contains `github.com/jarvanstack/markdown-to-resume`; covers two and three retain `jarvanstack.github.io/markdown-to-resume/`.
- The three covers are clearly different at feed-thumbnail size.

Application tests are not required because no runtime, build, route, application style, or deployment file changes.

## Risks And Mitigations

- Risk: Model-rendered Chinese text contains errors. Mitigation: use one shared exact copy block, request no other text, inspect at full resolution, and regenerate a failed direction.
- Risk: The model adds UI panels or too many objects. Mitigation: explicitly ban screenshots, browser UI, cards, diagrams, laptops, phones, and decorative clutter.
- Risk: The three outputs converge on the same composition. Mitigation: use separate off-white editorial list, teal paper-sheet list, and coral oversized-number directions.
- Risk: The cover implies Codex is built into markdown-to-resume. Mitigation: phrase the relationship as a workflow and avoid an integrated software interface.

## Rollback

Restore the previous three cover PNGs plus `covers.html` and `product-workspace.png`, then restore the matching marketing flow in `docs/knowledge-graph.md`. No application rollback is required.

## Decisions And Deviations

- Decision: The user explicitly selected the `gpt-image-2` model path, so the bundled Image API CLI is authorized for this revision.
- Decision: Use the model's standard 1024 x 1536 portrait size because the first custom 1152 x 1536 request returned inconsistent dimensions, including one landscape image.
- Decision: Replace the rejected filenames rather than keep them as parallel variants; the request is a direct revision of the same three deliverables.
- Decision: Remove the reusable poster HTML and screenshot because retaining them would conflict with the requested generation-only workflow.
- Decision: Preserve all five workflow steps on every cover; simplicity will come from disciplined hierarchy and limited visual elements, not from deleting information.
- Decision: Treat cover one as a precision text edit; all non-link pixels and all other copy are invariants.
- Deviation: The first minimal generation was rejected because it removed the five-step workflow and link. Those drafts were discarded; the final generation uses one shared information-complete copy block on every cover.

## Final Prompt Set

All three `ads-marketing` prompts used `gpt-image-2`, `quality=high`, `size=1024x1536`, PNG output, strict portrait framing, exact-text constraints, and this shared copy:

```text
Codex 写简历
Markdown 转 PDF 神级工作流
01 写一个简历大纲 Markdown
02 Codex：根据大纲完善简历
03 Codex：找问题，用表格输出建议和原因
04 继续完善 Markdown，直到满意
05 使用 markdown-to-resume：智能一页，导出 PDF
智能一页 · 完美 GitHub 样式
Footer link: cover one uses github.com/jarvanstack/markdown-to-resume; covers two and three use jarvanstack.github.io/markdown-to-resume/
```

The visual variants were:

1. Off-white Swiss editorial poster with teal numbers, thin dividers, and one yellow accent.
2. One centered white paper sheet on deep teal, coral numbers, and a subtle physical shadow.
3. Flat coral Bauhaus poster with oversized black 01–05 numbers and white step text.

Every prompt prohibited screenshots, browsers, application UI, devices, fake resume previews, QR codes, complex diagrams, extra text, logos, and watermarks.

## Verification Results

- The bundled CLI called the OpenAI Image API with `gpt-image-2`; no webpage, screenshot, or local poster renderer produced the final images.
- `file` reported 1024 x 1536 RGB PNG output for all three final covers.
- Full-resolution visual inspection confirmed the exact headline, all five ordered steps, and benefit line on every cover. Cover one contains the exact GitHub repository link; covers two and three contain the deployed project link.
- A targeted `gpt-image-2` edit changed only cover one's footer URL from `jarvanstack.github.io/markdown-to-resume/` to `github.com/jarvanstack/markdown-to-resume`; visual comparison confirmed the remaining composition and copy were preserved.
- No screenshot, browser UI, device, QR code, fabricated resume preview, unrequested text, or watermark appears.
- The three layouts are distinct while retaining the same information hierarchy.
- `covers.html`, `product-workspace.png`, and temporary prompt files were removed.
- `git diff --check` completed successfully.
- Application unit/build/E2E tests were not run because no runtime, build, route, application style, or deployment file changed.

## Completion Checklist

- [x] Read repository protocol, current plan, image-generation skill, and CLI/API guidance.
- [x] Confirm `OPENAI_API_KEY` is available without exposing it.
- [x] Revise the plan before implementation.
- [x] Generate three information-complete covers with `gpt-image-2`.
- [x] Inspect and discard incomplete minimal directions.
- [x] Remove obsolete page-rendering and screenshot sources.
- [x] Update the knowledge graph and change ledger.
- [x] Run final verification and review the diff.
- [x] Replace only cover one's footer link with the GitHub repository URL.
- [x] Reinspect cover one and rerun final verification.

## Final Result

Replaced the rejected screenshot-led and overly minimal drafts with three final `gpt-image-2` covers under `marketing/xiaohongshu/`. Every 1024 x 1536 PNG contains the core campaign headline, all five workflow steps, and the Smart One-Page/GitHub-style benefit line. Cover one links to the GitHub repository; covers two and three link to the deployed project. The variants use restrained editorial, paper-sheet, and oversized-number layouts without product screenshots or fabricated interfaces. No application behavior or production bundle changed.
