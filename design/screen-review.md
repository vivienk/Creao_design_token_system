# Screen and component review

Date: 2026-10-11. Scope: six current Figma specimens, seven shared UI components, existing guideline and supplied original chat screenshot. This is a static design review. No component, variable, text style or screen definition was changed during the review.

Evidence: [current six-screen render](screen-review-preview.png), [inspected layer measurements](generated/screen-review-evidence.json), [Figma review frame](https://www.figma.com/design/BPE75UDUT8mAXX3NkDmMzE?node-id=2-329). The supplied reference establishes visible anatomy, not unseen interaction behavior.

## Findings

![Screens inspected during this review; open findings remain unapplied](screen-review-preview.png)

P1 means resolve before these patterns serve as implementation specifications; P2 means consistency or clarity improvement. Recommendations below are unapplied.

| ID | Priority | Area and evidence | Finding | Recommended disposition |
| --- | --- | --- | --- | --- |
| R01 | P1 | Settings `2:302`, agent configuration `2:313`; nested primary actions display Continue | Action label does not communicate persistence; there is no visible save result or dirty-state contract in the specimen | If this is a save flow, override labels to Save changes / Save agent. If it is a wizard, show step/progress and a distinct final save action. Preserve the primary component definition. |
| R02 | P1 | Generic field `2:282`, 680 × 108, reused for all values | Appearance, language, multiline instructions, model selection and tool permissions look like equivalent static cards. Selector/editor/toggle affordances are missing | Use the separately proposed typed controls once approved; do not silently redefine Field. |
| R03 | P1 | Composer `2:297`; current chat screenshot versus supplied reference | Composer sits directly after the response in content flow. The original screen has a bottom composer and scrolling conversation region. Persistent placement is not represented | Define shell viewport, scroll region and persistent composer separately; preserve drafts and last-message visibility. Static flow is insufficient evidence of sticky behavior. |
| R04 | P1 | Seven components expose empty componentPropertyDefinitions; single primary action `2:280` | No state/variant API for loading, disabled, focus, errors or streaming. Documented contracts are not delivered component capabilities | Add reviewed capabilities separately; see extension proposal. |
| R05 | P2 | Current render, all themes; navigation `2:285` | Raised surface and medium weight identify active routes. Leading indicator is inconsistent: absent in several selections but visible for Dark Agents, despite the documented shared rule | Review instance visibility overrides and restore the existing indicator rule consistently after authorization. No new active-state definition needed. |
| R06 | P2 | Main frames `2:344`, `2:367`, `2:390`: padding 24/14/24/14 | Horizontal 14px padding is outside the documented 4px spacing rhythm | Select a reviewed existing spacing multiplier, such as 16px; apply consistently to six screen compositions without changing tokens. |
| R07 | P2 | Navigation label nodes, e.g. `13:196`, `13:205`, `2:288`: textStyleId empty | 14/20 type is visually consistent but not linked to a reusable text style. Recents is 12/20; recent items are 16/24 and visually louder than route labels | Review style-role mapping separately. Preserve 12/20 and 14/20 definitions until approved; avoid binding Regular labels to the existing Medium Label style blindly. |
| R08 | P2 | Main frames and patterns all have 24px vertical padding; settings/config also have 24px internal padding | Chat heading begins at the main inset while settings/config headings start one extra 24px inset inward | Establish one screen-heading alignment rule; treat this as composition alignment rather than changing the shared panel definition. |
| R09 | P2 | Navigation is one vertical stack with 12px gaps and 24px padding | Global destinations, settings and recents are distinguishable by labels but lack an explicit utility group. Team footer follows content instead of demonstrating bottom anchoring | Propose primary destinations / utility / recents / account slots. Retain source icons and route names; validate compact and long-list layouts. |
| R10 | P1 | Agent configuration specimen | Identity, instructions, model and permissions are a flat list. Permission scope, saved/draft state and a safe test action are absent | Group identity/instructions separately from runtime access. Add helper text and action/status capability through the proposal. |

## What is working

- Sidebar and main surfaces are visibly separated in both themes; the source palette is preserved.
- Primary action appearance is consistent and appropriate for the sole submit action in each current action group. No existing secondary/destructive variant was found, so this review does not claim a wrong variant was selected from an available set.
- Body 16/24, label 14/20 and heading 24/32 roles are consistent across inspected content, with shared Instrument Sans / DM Sans styles.
- Shared patterns reuse components and auto-layout. Core pattern gaps are 16px, padding 24px, navigation gaps 12px, button padding 12/16px: all match the existing spacing unit.
- No visible clipping or overlap occurs in the current default desktop render. Long content, narrow widths and text enlargement remain untested.

## State coverage

| Capability | Current evidence | Missing review evidence |
| --- | --- | --- |
| Buttons | Default primary, 200 × 44 | Hover, pressed, keyboard focus, disabled, loading; secondary/destructive when required |
| Fields | Label and sample value | Focus, invalid/helper text, disabled, selector open/selection, multiline editing |
| Navigation | Selected/unselected desktop appearance | Consistent indicator, focus, collapsed drawer, long recents and footer behavior |
| Chat | Complete response and empty composer | Empty conversation, streaming/stop, retry/error, attachments, draft recovery |
| Settings | Sample values | Clean/dirty, saving, saved and failure |
| Agent configuration | Sample values | Draft/saved, validation, unavailable capabilities, permission conflict and test result |

## Change boundary

This review records defects and proposals only. Existing definitions remain authoritative. Screen-level fixes should preserve component IDs, token values and source assets. Missing capabilities must be reviewed as extensions before changing shared definitions; no unsupported replacement token family is proposed. The current patterns are not ready to be treated as complete interactive specifications.
