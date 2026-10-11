# Creao screen-generation instructions

Applies to coding agents working in this repository. These instructions guide generation; they do not replace independent compliance enforcement.

1. **Read the baseline first.** Read `design-system-guideline.md` and the open findings in `compliance-audit.md` before changing UI. Preserve existing definitions and source assets. Treat historical working notes as supporting evidence.
2. **Choose an approved pattern.** State the applicable guideline rule: shell G03, chat G06, settings G07, agent configuration G08, Agents list G09 or notification G10. Identify the changed screen and actions. If no pattern fits, document the proposed pattern for review instead of inventing an approved one.
3. **Reuse the library and source roles.** Follow G01–G05. Reuse existing component APIs/IDs and registered icons/logo. Use semantic CSS variables from `design/generated/token-map.json` and `tokens.css`; preserve names, aliases and values. Use the existing spacing unit. Do not introduce Atlaskit runtime tokens or use token-migration autofixes. Check current capability before treating a Figma specimen as a working control.
4. **Implement required behavior.** Follow the selected pattern and G11–G13. Cover applicable loading, empty, disabled, focus, validation, failure/retry, streaming/stop and save states. Preserve drafts after recoverable errors; test keyboard and focus behavior. If required capability is absent, stop the affected implementation, record the gap and propose an extension separately for review. Continue only independent work that uses approved capabilities. Do not implement the extension or silently change shared definitions in that run; await a separate explicit instruction after review.
5. **Run and report compliance.** With Node 24 and Python 3 available, run from repository root:

   ```sh
   npm ci
   npm run lint:design
   npm run test:lint
   python3 scripts/check_design.py
   python3 scripts/test_tokens.py
   ```

   Execute applicable screen checks B01–B06 in the guideline. Capture both themes, long content/reflow, component states and actual interaction evidence. Report every failing command/rule, affected file/screen, reproduction and remaining gap. Fix within authorized scope and rerun affected checks; never hide errors with suppression, changed assertions or invented evidence. No app files means foundation checks only, not application approval.
6. **Document exceptions.** Add a record to `compliance-audit.md` and the PR: rule ID, affected screen/component, exact deviation, reason, proposed alternative, impact, evidence, owner/reviewer and approval status. Use “unassigned” and “pending” when unknown. Preserve the existing definition until approval; an agent recommendation or elapsed time is not approval.

## Handoff and release gate

In the PR and final report include: selected pattern/rule IDs; reused components/tokens; state coverage; commands and exit results; B01–B06 evidence; unresolved failures/gaps; exception records. Use `.github/pull_request_template.md`. Do not label work compliant when applicable evidence is missing.

Lint, tests and independent review enforce compliance. Require the `source-and-token-check` CI job and human review with passing applicable B checks before merge/release. An agent's self-check is never the release gate. Branch protection is currently not configured; do not claim these checks are technically required by GitHub until repository rules are enabled. Do not merge or release on the strength of local success alone; unresolved Fail/Gap blocks adoption as specified by the guideline.
