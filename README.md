# Creao

Source-backed design foundations and reusable workspace patterns.

- [Design guideline](design-system-guildeline.md)
- [Compliance audit](compliance-audit.md)
- [High-priority accessibility requirements](design/accessibility-priority-issues.md)
- [Screen and component review](design/screen-review.md)
- [Separate component extension proposal](design/component-extension-proposal.md)
- [Existing source of truth](design/source-of-truth.md)
- [CSS-to-Figma mapping](design/figma-mapping.md)
- [Original icons and logo](design/icon-system.md)
- [Chat, settings and agent patterns](design/screen-patterns.md)
- [Enforcement in code and review](design/enforcement.md)
- [Editable Figma file](https://www.figma.com/design/BPE75UDUT8mAXX3NkDmMzE?node-id=2-329)

274 theme variables plus four Dark-only declarations preserve the existing CREAO CSS names and values. Generated adapters are downstream from the pinned stylesheet; upstream authored source is unknown.

```sh
python scripts/extract_tokens.py
python scripts/check_design.py
python scripts/test_tokens.py
```

The repository has design artifacts and checks, not a running app. Static Figma patterns do not certify runtime accessibility or behavior. `design/figma-build.js` records the initial composition recipe; do not rerun it into the completed file because it creates components. Future updates should preserve IDs in `design/generated/figma-record.json`.
