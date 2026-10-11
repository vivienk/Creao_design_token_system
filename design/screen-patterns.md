# Reusable screen patterns

These are proposed editable compositions using CREAO's existing tokens. They are not screenshots or verified replicas of authenticated CREAO screens. Sample agent names, model selectors and setting values are illustrative.

[Figma review frame](https://www.figma.com/design/BPE75UDUT8mAXX3NkDmMzE?node-id=2-329) contains six compositions: chat, settings and agent configuration in Light and Dark.

## Shared inventory

Seven source-bound components: primary action, labeled field, workspace navigation, agent message, composer, settings section and agent configuration. Screen patterns reuse component instances and auto-layout; they remain editable. Three shared text styles prevent typography drifting between patterns.

| Pattern | Anatomy | Source roles | Required implementation states |
| --- | --- | --- | --- |
| Workspace shell | Navigation + header/title + main content | background, chrome, sidebar-fg, foreground | Active route, focus, collapsed mobile navigation |
| Chat workspace | Conversation title, user prompt, agent response, composer | surface, surface-alt, muted, primary/primary-foreground | Empty, streaming, complete, stopped, failed/retry, attachment processing |
| Settings | Section heading, description, labeled preference fields, save action | surface, background, foreground, muted | Clean, dirty, saving, saved, validation error, save failure |
| Agent configuration | Name, instructions, model, tool permissions, save action | surface, background, control-border, primary | New draft, editing, validating, saving, unavailable model/tool, permission conflict |

## Chat contract

- Keep the composer visible without covering the last message. On mobile, account for keyboard and safe-area insets.
- Distinguish user text, agent output and execution status semantically, not by color alone.
- Preserve the draft after recoverable submission errors. Provide Stop during streaming and Retry after failure.
- If Enter submits, Shift+Enter inserts a newline; suppress submission during IME composition.
- Announce meaningful status changes without announcing every streamed token. Keep focus stable as messages arrive.
- Action previews show the proposed destination and effect before consequential execution.

## Settings contract

- Group related preferences; each field has a visible label and helper text where needed.
- Distinguish saved values from local edits; save only changed values and communicate success or failure.
- Do not reset unrelated fields after an error. Warn about unsaved edits on navigation where data would be lost.
- Appearance selector should reflect actual supported themes. “System” in the specimen is sample content, not a verified product capability.

## Agent configuration contract

- Separate identity and instructions from runtime capabilities and permissions.
- Populate models and tools from available runtime capabilities; do not hard-code sample options as supported features.
- Explain the scope of each tool permission. Changing a visual checkbox does not grant backend access.
- Validate required fields inline; retain draft instructions after save failure.
- Show draft/saved status and allow a safe test before activation. Destructive or consequential actions use an explicit review flow.

## Responsive review

The current Figma specimens show desktop anatomy. Mobile composition remains a required implementation review, not a claimed delivered screen. Replace the sidebar with a labeled disclosure, stack settings/configuration fields, and keep controls reachable. Do not invent fixed breakpoint tokens: use content-driven breakpoints and document them as layout decisions.

## State coverage boundary

The Figma specimens illustrate default editable layouts. The state matrix above specifies required implementation behavior; loading/error/disabled/focus variants and live interactions are not claimed as fully implemented by the static specimen. Add state evidence during application development.
