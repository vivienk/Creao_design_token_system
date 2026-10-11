# High-priority accessibility review requirements

Updated: 2026-10-11. These two user-reported concerns are prioritized for implementation and retesting. Status: **Not assessed in the runtime application**; no failing element, measured color pair or deployed flow was supplied. The third numbered item was empty and has not been inferred.

## A11Y09 — Non-text contrast for active controls

Priority: P1. Basis: [WCAG 2.2 SC 1.4.11, Non-text Contrast (AA)](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

Visual information required to identify an active control or its state must have at least **3:1 contrast against adjacent colors**. This includes a field border when that border identifies the input area, required icons and state indicators. A boundary is not universally required: when sufficiently contrasting text or an icon identifies a button, an optional decorative boundary is not automatically subject to this criterion. Inactive controls and unmodified user-agent appearances have criterion-specific exceptions. Text contrast is assessed separately.

Low contrast can prevent people with low vision from finding controls or recognizing state. Do not rely solely on the low-emphasis `--color-border` token to identify a control without measuring it.

Remediation and acceptance:

1. Identify the visual cue that communicates the control or state, and record the adjacent background in each theme and applicable state.
2. Measure relative-luminance contrast using a WCAG contrast checker. Composite transparent paints onto their actual backgrounds before measurement.
3. Choose an existing source semantic color for the required border, outline, icon or state cue that achieves at least 3:1. Preserve source token definitions. If no existing role works, document and propose a source extension separately.
4. Record the element, theme/state, foreground/background values, alpha/composited values, measured ratio and screenshot. Retest focus, selection, hover and validation cues as applicable; disabled exceptions must be documented.

Passing a static color pair does not establish keyboard, focus or screen-reader conformance.

## A11Y10 — Warn before opening another browsing context

Priority: P1 project requirement. Basis: [W3C technique G201](https://www.w3.org/WAI/WCAG22/Techniques/general/G201) and [SC 3.2.5, Change on Request (AAA)](https://www.w3.org/WAI/WCAG22/Understanding/change-on-request.html). Advance warning is adopted here as project policy; absence of a warning alone is not labeled an automatic WCAG AA failure.

Keep ordinary navigation in the current context unless a new context is intended. For links intentionally opening another context, provide a visible warning included in the accessible link name, such as “opens in new tab or window.” Do not rely on a tooltip or an unlabeled external-link icon alone. Unexpected context changes can disorient screen-reader users and people with cognitive or visual impairments.

Use the standard `target="_blank"` spelling, not `*blank`. The browser and user settings decide whether a new tab or window opens; `_blank` does not guarantee either. `_new` is not a special standard target for opening a new tab and must not be used for that purpose. HTML target and relationship behavior is documented in the [MDN anchor reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a).

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Visit Example.com (opens in new tab or window)
</a>
```

`noopener` prevents opener access; `noreferrer` suppresses the Referer header and also implies opener isolation. They are included in the project example as requested. These attributes do not supply the accessibility warning.

Acceptance: enumerate links that deliberately open another context, verify the visible and accessible warning before activation, inspect target/rel attributes, and test keyboard and screen-reader activation. Record the destination, link name, actual behavior and test environment. External URLs do not inherently require a new context.

## Evidence and change control

Record these requirements against buttons, fields, navigation and any proposed external-link capability in the screen/component review. Preserve existing component and token definitions during documentation updates. New variants, link components or contrast-role changes remain separate proposals until explicitly authorized. Update audit status to Pass or Fail only when evidence identifies the tested scope.
