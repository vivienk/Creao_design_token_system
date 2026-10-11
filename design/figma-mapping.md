# CSS → Figma mapping

[Editable Figma file](https://www.figma.com/design/BPE75UDUT8mAXX3NkDmMzE?node-id=2-329)

## Collections

- `CREAO CSS · source theme`: 274 variables; Light and Dark modes. Collection ID `VariableCollectionId:2:2`.
- `CREAO CSS · dark-only`: 4 variables; Dark mode only. No invented Light values.

The mapping direction is **code → Figma** using the pinned source. Preserve exact CSS names via each variable's WEB code syntax, e.g. `var(--color-control-border)`. Figma's slash path is a reversible lookup through the JSON mapping, not a new token taxonomy: `--color-control-border` becomes `color/control/border`; repeated hyphens collapse in Figma paths while the original name stays in `cssName`.

| Source example | Figma representation | Handling |
| --- | --- | --- |
| `--color-background` | COLOR `color/background` | Exact mode colors normalized to RGBA |
| `--color-control-border` | COLOR `color/control/border` | Light aliases the existing `color/grey/200`; Dark keeps its alpha value |
| `--spacing: .25rem` | FLOAT `spacing: 4` | 16px root assumption |
| `--radius: .375rem` | FLOAT `radius: 6` | Bind corner radii |
| `--text-base: 1rem` | FLOAT `text/base: 16` | Source size; paired with its actual line-height expression |
| Font stacks | STRING | Full stack preserved; CSS fallback lists cannot bind directly to a Figma font-family property |
| `calc(...)`, `cubic-bezier(...)`, em tracking, shadows | STRING | Raw expression retained; not misrepresented as a directly applicable native value |
| Dark-only `--control-surface` | Alias to source `color/surface/alt` | Use with the app collection explicitly in Dark mode |

Existing aliases are preserved. Equal raw colors are **not** turned into newly invented primitive aliases. CSS names and relationships win over generic library conventions.

## Typography and layout

The screen patterns use available Figma font names corresponding to the source stacks: Instrument Sans and DM Sans. The `Variable` suffix is a web font-face naming distinction; fallback stacks remain documented in the variables. Three shared text styles compose observed families and sizes: Body 16/24, Label 14/20, Heading 24/32. These combinations are project patterns, not evidence of how authenticated CREAO screens apply typography.

All component fills and corner radii use source variables; text uses source colors and shared text styles. Layout gaps and padding use documented multiples of the existing 4px spacing unit, stored as geometry in Figma because a multiple of a variable is not a native variable alias. No `spacing-md`, replacement palette or fabricated source tokens were added. Screen widths are composition geometry, not source tokens. Review these geometric values on source-spacing changes.

## Sync and verification

Use `generated/token-map.json` for names, raw mode values, normalized values, aliases and declaration offsets. The Figma record in `generated/figma-record.json` contains stable IDs and validation results. Match existing variables by their WEB CSS syntax or saved IDs when syncing; never construct fake Figma IDs from token names.

Update existing values and aliases in place, sync both modes, then compare every mapped value, type, code syntax and scope. Cross-check Dark-only declarations separately. Do not duplicate collections on refresh. Full font stacks and compound expressions are mapping records; applying native typography or effects requires the documented adapter, not blindly binding those strings.
