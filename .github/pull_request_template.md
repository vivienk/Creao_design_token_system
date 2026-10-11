## Design-system evidence

- Source commit / snapshot hash:
- Existing CSS tokens used:
- Figma frame or component links:
- Light and Dark screenshots:
- Responsive, keyboard, focus and screen-reader evidence:
- Component states exercised:
- Required non-text control/state contrast measurements (3:1, both themes):
- New-context links: visible/accessible warning and target/rel evidence:
- Any unbound values, new tokens or deviations (rationale and reviewer):

Run `python scripts/check_design.py` and `python scripts/test_tokens.py`.
Also run `npm ci`, `npm run lint:design` and `npm run test:lint`. Do not suppress lint rules or apply Atlaskit token migration fixes; use existing Creao CSS variables.
Do not describe automated checks as product accessibility certification.
