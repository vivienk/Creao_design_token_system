# Code and review enforcement

## Automated gate

Run:

```sh
python scripts/extract_tokens.py
python scripts/check_design.py
python scripts/test_tokens.py
```

The GitHub Actions workflow runs the last two checks on pushes and pull requests. It checks the pinned snapshot hash, reproducible token mapping and generated CSS, alias targets, naming collisions and extraction tests for source scope, Dark overrides, alpha and units.

For existing first-party files under `src/`, `app/` and `components/`, the check rejects raw hex/RGB/HSL/OKLCH colors, unknown `var(...)` references, source-token redefinitions, selected arbitrary Tailwind utilities, and CSS padding/margin/gap literals. Use `calc(var(--spacing) * n)` for spacing. Import `design/generated/tokens.css` once at the app boundary and reuse the original semantic names.

This lightweight scanner is intentionally bounded. It is not an AST linter and does not catch every named color, inline style, utility class or runtime value. Add framework-specific AST rules once a framework exists. A passing check with no application files establishes adapter integrity only.

## Review gate

Use the pull-request template. Reviewers must inspect:

1. Token source and scope: use the existing role; do not flatten auth/vendor scopes or add replacement names.
2. Figma alignment: compare both modes and aliases; document native conversion and unbound geometry.
3. Shared component reuse: chat, settings and agent configuration follow the agreed anatomy and state contracts.
4. Runtime evidence: desktop/mobile, long content, keyboard/focus, screen reader, loading, validation and failure recovery.
5. Exceptions: record exact value, reason, owner and review date. A legitimate new token requires an explicit source change and rationale.

The author prepares evidence; a designated maintainer reviews token or pattern changes. No owner username is fabricated in CODEOWNERS.

## Branch protection

Recommended required status check: `source-and-token-check` from the Design system compliance workflow; require a review for source/adapters/pattern changes. **Branch protection has not been configured.** Adding the workflow does not by itself prevent merges or direct pushes. Repository plan/support and the user's desired review policy must be confirmed before enabling repository rules.

## Figma synchronization

The Figma file is a downstream consumer. Sync mapped variables by stable ID or exact WEB CSS syntax and update both modes together. Verify all values and aliases, then render affected patterns. Do not treat manual Figma edits or an import JSON as a new authority. CI does not currently contact Figma; parity was checked directly during this delivery and future refreshes require a new Figma audit.

## Compliance claims

Source/mapping checks can pass independently of an application. Runtime design-system and accessibility compliance remain unassessed until screens and flows are implemented and tested. Do not merge “all compliant” wording based solely on token parity.
