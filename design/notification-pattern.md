# Notification dismissal placement

Updated: 2026-10-11. User-approved placement rule: the dismiss control stays at the **top-right of its own notification container**, including dismissible inline banners, popups and toasts. This changes placement guidance; existing token values and component definitions remain unchanged.

## Observed defect N01

![Original Agents page: notification close control incorrectly placed below the message at the left](notification-reference.png)

Original site screenshot supplied by the user. The red rectangle is the user's annotation. This image shows the defect before remediation; the proposed top-right placement has not been applied to the live site.

Evidence: user-supplied screenshot “Screenshot 2026-10-11 at 2.02.57 PM.png”, Agents page at `https://agent.creao.ai/apps`. The “Team agents & skills are here” inline announcement displays its X beneath the message, near the left edge. Expected: X at the top-right inside the announcement. Priority: P2 layout consistency. This screenshot demonstrates the placement defect; runtime cause and dismissal behavior have not been tested.

The highlighted element is an inline announcement banner, not evidence of a floating toast implementation. The placement rule applies consistently to both.

## Layout contract

- Anchor to the notification container, never to the page or viewport. Preserve the same top/right inset as content reflows.
- Use existing spacing-unit multiples for the inset and gap. Reserve the close control's full hit area plus a gap at the right of the text region.
- Keep the icon/title/body content together. Long titles, multiline body text, action rows and narrow layouts must not move the close control below the content or overlap it.
- Keep the control inside the container and unclipped. Its hit area must not cover content links or actions.
- In Figma, use a top-aligned horizontal auto-layout: content group fills remaining width, dismiss control keeps its size. For an overlaid implementation, use a positioned notification parent, top/right anchored dismiss control and equivalent reserved content padding.
- Use the original registered `x` icon; preserve source geometry and existing semantic colors. Check required icon/state contrast under A11Y09.

## Interaction contract

Use a real button with `type="button"` and an accessible name such as “Dismiss announcement” or “Dismiss notification.” Provide visible keyboard focus. Dismissal is separate from the notification's main action. Do not automatically focus an informational toast. If dismissing removes the focused control, move focus to a logical remaining element without losing the user's place.

## Acceptance checks

1. Inspect short and long content, action/no-action layouts, narrow/wide containers and both themes.
2. Confirm the close control remains at the container's top-right with consistent inset; no overlap, clipping or horizontal overflow at zoom and text enlargement.
3. Verify keyboard reachability, accessible name, focus visibility and predictable focus after dismissal.
4. Record screenshots and actual dismissal behavior. Do not mark the live site fixed from documentation alone.

## Capability gap

The current seven-component Figma UI inventory has no dedicated dismissible notification component. A reusable notification/banner/toast component is proposed separately in [the extension proposal](component-extension-proposal.md). This rule authorizes its dismissal placement, but does not approve a new palette, token family or unrelated component changes.
