# Original icons and brand assets

The asset layer preserves the original site artwork alongside the existing token system. SVG artwork is an editable Figma component, rather than a Figma variable. Its paint uses existing color variables; no replacement token collection was introduced.

## Source inventory

- Original [CREAO black wordmark](https://agent.creao.ai/creao_black_logo.svg), retained byte-for-byte in `assets/creao_black_logo.svg`; native dimensions 87 × 20.
- 308 Lucide icon definitions extracted from the site's public `index-CQ8jNy7k.js` bundle, which identifies Lucide React 0.563.0 and ISC attribution.
- Original path geometry, 24 × 24 view box, stroke width 2, round caps and joins are retained. React reconciliation keys are omitted from exported SVG markup.
- [Manifest](assets/manifest.json) records source URL, bundle hash, original literal definitions, names, offsets and individual SVG hashes.
- [Figma registry](assets/figma-assets.json) records all 308 editable icon components and the wordmark component in the existing file.

This inventory covers literal Lucide definitions in the inspected bundle and the supplied logo. Dynamically loaded or other custom artwork elsewhere in authenticated flows remains outside this inventory.

## Reusable navigation mapping

| Site role | Original icon |
| --- | --- |
| Search | search |
| Collapse sidebar | panel-left-close |
| New chat | plus |
| Team Pulse | radio |
| Discover | compass |
| Agents | bot |
| Video studio | film |
| Files | hard-drive |
| Connectors | plug |
| More | ellipsis |
| Settings | settings |

The pattern-specific chat route uses message-square; the illustrative team footer uses user-round. These are source-library shapes, not assertions that those roles match every authenticated site state.

## Figma and code enforcement

Use `Icon / <source-name>` component instances and `Brand / CREAO wordmark`. Both light and dark screen patterns inherit these through the shared navigation component. Figma paint is bound to existing `color/foreground`, allowing the same vector artwork to adapt to the source themes. The original black logo file remains unchanged.

In code, use the registered SVG assets with existing semantic colors and accessible labels for icon-only controls. Keep the logo's aspect ratio; do not redraw or substitute the wordmark. CI validates SVG parsing, file hashes and coverage of the Figma component registry. Geometry or logo changes require an explicit source update and review. Hash checks validate the pinned inventory, not live Figma geometry or runtime accessibility.
