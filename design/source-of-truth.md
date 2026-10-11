# Existing source of truth and ownership

Inspected and re-fetched 2026-10-11. The re-fetch matched the pinned snapshot byte for byte.

## Authority order

1. **Verified reference:** CREAO's compiled production stylesheet, [index-C3VRtTd6.css](https://agent.creao.ai/assets/index-C3VRtTd6.css). It identifies Tailwind CSS 4.2.1 and contains the app's actual CSS custom-property declarations.
2. **Project baseline:** `source/creao.css`, pinned at SHA-256 `3a95aa2c982ad466ccf8e8901db3292e5570cfbc7f9032f056e8b42a48a7be2b`. This is the reproducible reference for this repository until deliberately refreshed.
3. **Generated adapters:** `generated/token-map.json` and `generated/tokens.css`. They translate the baseline, never replace it as an independently authored token source.
4. **Figma:** a downstream representation of the same tokens. Figma edits are proposals until reconciled against an approved source change.

The original authored CSS, Tailwind configuration, component source and upstream token repository are **unknown**. The compiled stylesheet is the strongest source available, not proof of where CREAO internally authors its tokens. No public official token repository has been verified.

## What exists in the CSS

- 274 mapped app-theme tokens: palettes, semantic roles, font stacks and weights, text sizes and line heights, spacing unit, container sizes, radii, tracking, leading, easing and transition expressions.
- Light defaults in `:root,:host`; Dark overrides under `.dark`. Unchanged values inherit Light defaults.
- Four Dark-only app declarations: `--control-surface`, `--color-accent-light`, `--shadow-popover`, `--shadow-panel`. Their missing Light declarations remain missing.
- Existing aliases include `--color-control-border` and `--color-edge` to `--color-grey-200` in Light. Dark overrides these directly.
- Existing role families include `color-ox-*`, `color-memory-*`, `color-credit-*`, sidebar, chat header, control and surface roles. Retain their names even where product meaning is unverified.
- Auth-specific `.auth-legacy-theme`, vendor PDF/lightbox/editor variables, responsive/environment offsets and scrollbar expressions also exist. The inventory retains 1,346 declaration records. They are not flattened into the app theme.

## Cascade and conversion boundaries

The extractor is tailored to this inspected compiled snapshot: it inventories flat declaration blocks and selects exact root / host / Dark selectors, retaining offsets and raw values. Modern `color-mix(in srgb, ...)` declarations supersede their earlier static fallbacks in the selected mode. This assumes a modern browser with the feature supported; it is not a general CSS parser or a browser computed-style substitute. Conditional cascade, typography usage and actual component usage must be verified against a running app before release. A new source shape requires extractor review.

Raw CSS remains unchanged in generated CSS. Hex alpha is retained. Figma colors use normalized RGBA. OKLCH palette colors are converted to sRGB and clipped where outside sRGB gamut; raw OKLCH is retained, so the conversion does not become a new palette authority. Existing sRGB color-mix expressions are evaluated for Figma only.

Rem dimensions use an explicit **16px root assumption** for Figma. CSS still uses rem. Unitless line-height ratios remain ratios; they must not be treated as pixel dimensions.

## Refresh procedure

1. Read the current app HTML to discover its actual linked CSS asset; do not guess a hash.
2. Fetch that asset and compare selectors, overrides, aliases and raw declarations with the pinned baseline.
3. Review changes to conditional expressions and scoped themes before replacing the snapshot.
4. Update source URL/hash references, regenerate adapters, run checks, then sync both Figma modes together.
5. Reinspect the three screen patterns and affected states; publish the change with evidence.

No automatic network refresh or bidirectional token overwrite is enabled. The snapshot is third-party reference material; this repository does not claim ownership or an independently verified license for CREAO's stylesheet.
