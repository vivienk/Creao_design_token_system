# Component capability extensions — proposal only

Status: unapplied; separate from the current definitions. References: [screen review](screen-review.md). Keep existing IDs, source variable names/values, icon geometry and logo unchanged.

All proposed controls must satisfy [A11Y09 and A11Y10](accessibility-priority-issues.md): measure required control/state cues at 3:1 in both themes, and warn visibly and accessibly before opening another browsing context. A reusable external-link capability is a separate proposed addition: label/destination, optional original source icon, current-context default and explicit new-context warning. It is not an approved change to existing definitions.

| Extension | Gap addressed | Proposed API / anatomy | Acceptance evidence |
| --- | --- | --- | --- |
| Button capability | R01, R04 | Preserve Primary action. Add reviewed role/state properties: primary, secondary, destructive only where used; default, hover, pressed, focus, disabled, loading; label and optional source-icon slots | Both themes; stable loading label and dimensions; keyboard focus and accessible name; one primary per action group |
| Typed controls | R02 | Preserve Field as the current specimen. Add text input, textarea, select and switch/checkbox controls with shared label/helper/error wrapper; required/disabled/invalid states | Appearance/language/model selections show affordance; instructions wrap and grow; permission explanation remains associated; runtime keyboard and error behavior |
| Navigation structure | R05, R07, R09 | Explicit destination, utility, recents and account slots; reusable item with label, source icon and selected state; collapsed composition | Selected rule consistent in six screens; long labels/recents, both modes, compact layout and footer behavior |
| Chat workspace capability | R03, R04 | Scrollable conversation region, persistent composer slot; attachment controls; pending/streaming/complete/stopped/failed response states and Stop/Retry actions | Last response remains visible; long conversation, keyboard-open mobile, IME and draft recovery |
| Form action/status group | R01, R10 | Save action plus clean/dirty/saving/saved/failed status; optional Cancel and Test actions when product behavior requires them | Save effect unambiguous; drafts preserved on failure; Test distinct from activation; grouped runtime permissions explained |
| Typography roles | R07 | Add approved reusable Regular navigation style and small section style from existing source type values, rather than altering Medium Label | Exact family/weight/line-height verified and applied consistently; long-label and zoom evidence |

Use existing semantic colors, spacing unit, typography values, ring, borders and radius roles. Any extension requiring a new source token must identify the missing role and request an explicit source change separately. Do not invent state colors from appearance. Validate foreground/background pairs and control boundaries after selecting existing roles.

Implement extensions incrementally: typed controls and save/status first, chat behavior next, then navigation and typography consistency. Before adoption, attach component state renders in both themes and runtime interaction evidence. No new component or token is approved by this document alone.
