# Creao product-layer design guideline

Version 1.0 · 2026-10-11. This document and [compliance-audit.md](compliance-audit.md) are the two authoritative design deliverables. Supporting files are evidence and assets, not separate normative guides.

## Foundations and change control

**G01 — Preserve source.** Use `design/source/creao.css`, `design/generated/tokens.css` and `design/generated/token-map.json`. Preserve all 274 theme variables, four Dark-only declarations, names, values and aliases. Use registered source icons and the original CREAO SVG logo. Do not invent replacement tokens or redraw assets.

**G02 — Reuse components.** Compose instances from the existing Figma file `BPE75UDUT8mAXX3NkDmMzE`: Primary action `2:280`, Field `2:282`, Navigation `2:285`, Agent message `2:293`, Composer `2:297`, Settings `2:302`, Agent configuration `2:313`. Preserve definitions and IDs; use content overrides. The authored public-site component library is unavailable, so this inventory describes the project library. A missing capability must be proposed separately in the audit before changing shared components. Documentation approval does not authorize all proposals.

## Product composition rules

### Provenance and approval boundary

Source-backed facts: CSS declarations, source icon geometry and original logo. Screenshot-backed facts: original navigation/conversation/list anatomy and misplaced announcement close button. Project proposals: heading alignment, 24/16px main insets, three-part active indicator and grouping choices. These proposals are the assignment review baseline, not original Creao library requirements or approved edits to shared definitions. Existing definitions take precedence where a conflict exists; record a gap rather than changing them. Only notification top-right placement is explicitly approved; shared capability changes need separate authorization.

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

### Pattern slot and state contracts

Slot names below describe composition boundaries, not delivered code props. This repo has no production component exports. Existing specimens support text overrides, not an exposed interaction API. Missing required slots/controls must follow AGENTS.md: stop affected implementation and document the gap.

| Pattern | Reuse and permitted content overrides | Required slots | Required state evidence |
| --- | --- | --- | --- |
| Shell G03 | Navigation2:285: destination/recent text; original icon/logo instances | navigation, header, main, account; selected route | active/inactive, focus, collapsed/open, long recents |
| Chat G06 | Message2:293: author/body/status; Composer2:297: prompt/context/send label | header, scroll region, user/agent messages, persistent composer | empty, streaming, complete, stopped, failed/retry, attachments, draft recovery |
| Settings G07 | Settings2:302, Field2:282: label/value text; Primary2:280: label | heading, preference groups, typed controls, save actions/status | clean, dirty, invalid, saving, saved, failed, disabled/focus |
| Agent G08 | Configuration2:313, Field2:282: label/value; Primary2:280: label | identity, instructions editor, runtime model/tools, scoped permissions, save actions/status | new/editing, invalid, unavailable capability, permission conflict, saving/saved/failed |
| Agents list G09 | Navigation2:285, Primary2:280 where appropriate, original assets | header actions, announcement, filter tabs, filters, results/row actions, pagination | loading, empty, filtered-empty, ready, failed/retry |
| Notification G10 | Original x asset; dedicated component absent | icon, title/body, optional action, top-right dismiss | short/wrapped, action/no action, keyboard dismissal/focus |

Do not treat Field text as a working selector/editor. Use foreground/muted for text, surface/surface-alt for regions, primary/primary-foreground for primary actions, error for validation and ring for focus. Lint checks property domains; B02/B05 verify the exact contextual role and contrast.

### Gate A: automated foundation checks, available now

Run from repo root:

```sh
python3 scripts/check_design.py
python3 scripts/test_tokens.py
npm ci
npm run lint:design
npm run test:lint
```

Both Python checks must exit 0. Existing Actions job `source-and-token-check` runs these on push/PR. It checks pinned source/export parity, aliases/names, asset hashes and registry coverage. In existing `src`, `app`, `components`, a bounded scanner rejects raw colors, unknown token references, token redefinitions, selected arbitrary utilities and CSS spacing literals. It does not inspect Figma, runtime layouts, contrast or link behavior; with no app files it verifies foundations only.

All commands above must succeed. `eslint.config.mjs` enables Atlassian's `ensure-design-token-usage` color rule for JS/JSX/TS/TSX under `src`, `app`, `components`, plus `creao/existing-tokens`. The latter checks literal style-property values against the existing registry, rejects raw spacing/type/shape values and unknown `var(...)` references, and prevents importing `@atlaskit/tokens` as a runtime replacement. Atlassian's spacing rule is not enabled because Creao's approved spacing expression is `calc(var(--spacing) * integer)`. Creao's rule enforces that expression. Inline ESLint suppression is disabled; exceptions require a reviewed configuration change.

Atlassian auto-fixes/suggestions are suppressed to prevent migration to Atlaskit token names; lint is detection-only. Dependencies are development tooling, not a replacement palette. Nine executable positive/negative tests verify valid Creao references, Atlassian color detection, raw spacing/type rejection, unknown references, unsafe fallbacks, fractional spacing and suppression/autofix behavior. Do not run source migrations suggested by upstream docs.

Property-domain validation now rejects spacing/type/radius tokens used as colors, primitive numbered palette tokens used directly as semantic color roles, and raw corner-specific radii. Color properties use registered semantic color roles; font/radius/shadow properties use matching registry prefixes. Dynamic expressions remain a manual review boundary.

Coverage boundary: ESLint checks supported CSS-in-JS and literal AST style-property values; dynamic expressions, class utilities, external styles and runtime computed styles still require B review. Standalone CSS remains covered by the existing Python scanner, not ESLint. No application files exist yet, so repository lint success alone does not demonstrate application compliance.

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

Gate B is manual, not claimed as CI automation. Branch protection was attempted on 2026-10-11 and GitHub returned HTTP 403: this private repository needs GitHub Pro or public visibility. Visibility was preserved. Required CI plus one independent PR approval therefore remains policy, not technically enforced. A plan upgrade is needed to activate the requested protection; do not claim enforcement is complete. Gate A alone cannot approve a screen. Record exceptions with rule ID, scope, reason and explicit approval; do not assume silence approves an extension. Re-test affected checks after changes.

## Current specimens

[Editable Figma source file](https://www.figma.com/design/BPE75UDUT8mAXX3NkDmMzE?node-id=2-329). A native [Creao.fig backup](design/Creao.fig) is included in the repository, exported 2026-10-11. Import it into Figma to recover editable artwork; the live file remains the working design.

![Current specimens: Light above, Dark below](design/screen-review-preview.png)

These are current designs, not corrected implementations. See the worked audit for open issues.
