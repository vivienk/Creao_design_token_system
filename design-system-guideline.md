# Creao product-layer design guideline

Version 1.0 · 2026-10-11. This document and [compliance-audit.md](compliance-audit.md) are the two authoritative design deliverables. Supporting files are evidence and assets, not separate normative guides.

## Foundations and change control

**G01 — Preserve source.** Use `design/source/creao.css`, `design/generated/tokens.css` and `design/generated/token-map.json`. Preserve all 274 theme variables, four Dark-only declarations, names, values and aliases. Use registered source icons and the original CREAO SVG logo. Do not invent replacement tokens or redraw assets.

**G02 — Reuse components.** Compose instances from the existing Figma file `BPE75UDUT8mAXX3NkDmMzE`: Primary action `2:280`, Field `2:282`, Navigation `2:285`, Agent message `2:293`, Composer `2:297`, Settings `2:302`, Agent configuration `2:313`. Preserve definitions and IDs; use content overrides. The authored public-site component library is unavailable, so this inventory describes the project library. A missing capability must be proposed separately in the audit before changing shared components. Documentation approval does not authorize all proposals.

## Product composition rules

| ID | Rule engineers and agents must follow |
| --- | --- |
| G03 | Shell: navigation, one screen header, main content. Sidebar uses surface-alt, main surface, divider border. Group destinations, utilities, recents and account; place account at bottom when space allows. Active route consistently uses raised surface, foreground Medium label and leading indicator in both themes. Narrow navigation uses a labeled disclosure with focus restoration. |
| G04 | Spacing/type: integer multiples of existing 4px spacing unit, implemented using `calc(var(--spacing) * n)`. Use 24px vertical and 16px horizontal main inset; align every screen heading to the same main edge. Preserve Body 16/24 Instrument Sans Regular, Label 14/20 Medium and Heading 24/32 DM Sans Medium. Document Regular navigation and 12/20 Recents style mappings separately. No clipping at 200% text size or 320 CSS-pixel width. |
| G05 | Actions: one primary per action group. Label outcomes Send message, Save changes or Save agent. Continue requires visible multistep context and a final persistence action. Form actions follow fields; page create/import actions belong in the header. Missing secondary/destructive/Test capability requires an extension, not a local imitation. |
| G06 | Chat: shell → conversation header → scrolling conversation with distinct user/agent messages and status → persistent Composer. Keep last message visible. Preserve draft after failure; provide Stop while streaming and Retry after failure. Labeled editor, attachment controls, Enter submit/Shift+Enter newline, no submission during IME composition. |
| G07 | Settings: heading/description → related groups → typed labeled controls → Save changes plus outcome status. Represent clean, dirty, saving, saved and failed; retain edits after failure. Static value cards do not provide selection capability. |
| G08 | Agent configuration: heading/draft status → identity/instructions → runtime model/tools/permissions → Save agent, optional separate Test. Multiline instructions, model selection, scoped permissions and inline validation require real controls. Populate options from runtime capabilities, preserve failed drafts. |
| G09 | Agents list: header with Import/Create → optional announcement → filter tabs → search/status/visibility/view controls → results → count/pagination. Row actions stay with their agent. Provide empty/loading/error states. |
| G10 | Dismissible banner/popup/toast: dismiss control stays at its own container top-right, with full hit-area space plus gap reserved. Wrapped content/actions cannot displace or overlap it. Use original x icon, named button and visible focus; preserve logical focus after dismissal. Top-right placement is explicitly user-approved. |
| G11 | States: before adoption demonstrate applicable default, focus, disabled, hover/pressed/loading/error; chat empty/streaming/complete/stopped/failed/attachments; forms clean/dirty/saving/saved/invalid/failed; navigation active/inactive/collapsed. Missing states are blocking capability gaps. |
| G12 | Required non-text control/state cues: measure at least 3:1 against adjacent colors in both themes, compositing alpha first. Decorative borders are not automatically required where contrasting text/icon identifies a control. Text contrast is separate. See [WCAG 1.4.11 AA](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html). |
| G13 | Links: current-context default. Intentional new contexts have visible warning included in accessible name: opens in new tab or window. Use `target="_blank" rel="noopener noreferrer"`; `_new` does not guarantee a new tab. This is project policy informed by [W3C G201](https://www.w3.org/WAI/WCAG22/Techniques/general/G201), not a blanket AA failure classification. |

## Concrete enforcement

### Gate A: automated foundation checks, available now

Run from repo root:

```sh
python3 scripts/check_design.py
python3 scripts/test_tokens.py
```

Both must exit 0. Existing Actions job `source-and-token-check` runs these on push/PR. It checks pinned source/export parity, aliases/names, asset hashes and registry coverage. In existing `src`, `app`, `components`, a bounded scanner rejects raw colors, unknown token references, token redefinitions, selected arbitrary utilities and CSS spacing literals. It does not inspect Figma, runtime layouts, contrast or link behavior; with no app files it verifies foundations only.

### Gate B: mandatory screen evidence review

Author executes these checks for every affected screen and records results in the PR template; reviewer verifies them independently. Record Pass, Fail, Gap or Not applicable with rationale. No follow-up decision is needed: missing evidence or any unresolved Fail/Gap blocks adoption/release of that screen.

| Check | Exact procedure | Evidence required |
| --- | --- | --- |
| B01 G01–G02 | Run A; compare component IDs/assets to registries; enumerate content/style overrides and missing APIs | Command results, IDs and override/gap inventory |
| B02 G03–G05, G07–G09 | Inspect both theme renders for region grouping, selected route, heading edges, labels and action groups; measure padding/gaps and font/style IDs | Screenshots plus measured geometry/type and label list |
| B03 G04, G06, G10 | Render long content at desktop, 320px and 200% text size. Scroll chat and verify last-message/composer visibility. Wrap notification text and measure close top/right inset before/after | Screenshots/video, viewport and measured bounds; no overlap/clipping |
| B04 G11 | Exercise every applicable state, keyboard navigation, dismissal/collapse focus and draft recovery | State matrix with component IDs and actual interaction results |
| B05 G12 | Identify required cue/background; composite alpha; calculate relative-luminance contrast with WCAG checker | Exact color pair, theme/state, ratio ≥3:1 or justified criterion exception |
| B06 G13 | Enumerate new-context links; inspect target/rel, visible warning and screen-reader name; activate with keyboard | Link inventory, attributes, names and observed behavior |

Gate B is manual, not claimed as CI automation. Branch protection is not configured; enforce this review policy before release until repository rules exist. Gate A alone cannot approve a screen. Record exceptions with rule ID, scope, reason and explicit approval; do not assume silence approves an extension. Re-test affected checks after changes.

## Current specimens

![Current specimens: Light above, Dark below](design/screen-review-preview.png)

These are current designs, not corrected implementations. See the worked audit for open issues.
