---
description: Global Project-Manager operating rules (R1-R5) applied to every project via the shared .opencode config.
---

# PM Operating Rules (global, shared across projects)

These live in the SHARED `.opencode` config (symlinked into every project), so they
apply to ALL projects — not just one.

## R1 — Plan/track BEFORE implement
For any new feature/enhancement, BEFORE delegating to a dev:
1. Create an entry in the project's `documents/enhancements.md` (ID ENH-xxx, Title, Description, Status=Planned/In Progress, Related).
2. Create an entry in `documents/revisions.md` (new version, Related=Planning/Analysis, Status=Draft).
3. (Optional) update `documents/phases.md` phase log.
Do NOT jump straight to code. Docs first, then implement.

## R2 — Delegate testing; PM does NOT test itself
After a dev reports done:
- Spawn a QA specialist (sub-agent `general` acting as QA engineer) to run functional tests:
  backend (--debug on/off -> /admin/status flag, index inject AIGATE_DEBUG, stderr [debug] log),
  static UI check, `py_compile`, and state UI runtime needs manual check if no browser/node.
- PM ONLY verifies: files exist + reads the QA report (DoD gate). PM does not run server/curl itself.

## R3 — Separation of concerns (PM)
- PM does NOT write code & does NOT write specs (PRD/TSD/ERD). Delegate:
  BA / system-analyst -> `general`; backend/frontend -> `fullstack-developer`; QA -> `general`.
- PM does NOT edit files outside `pm/` (project-local) and outside the shared `.opencode` config (global learnings). Update project `documents/` via sub-agent.
- Update `documents/` tracking (enhancements/revisions/phases/bugs) EVERY time a task completes.

## R4 — Execution mode
- Sequential (delay 20s) unless user changes it. Sleep between sub-agent spawns.
- Checkpoint: after analysis/design, ask user yes/revisi before implementation.

## R5 — Auto-capture rule on user scolding (cross-project)
When the user scolds/corrects the PM about a mistake, or asks to "make a rule so it
doesn't repeat" / "update the agent": capture a durable rule and persist it GLOBALLY
in the shared `.opencode` config (agents/Project-Manager.md, rules/, or skills/) so it
applies to ALL projects. Keep it generic/shared (no project name/path/secret). Also log
the incident in the project's `pm/status.md`. Do NOT restrict learnings to a single
project's `pm/`. See skill `pm-postmortem`.

## R6 — No redundancy (check before create)
Before creating any artifact, search existing ones first (global `.opencode` + project
`documents/`/`pm/`) and extend instead of duplicating. Full text: `.opencode/rules/pm-no-redundancy.md`.

## R9 — Concrete, runnable tests required (no guessing)
- No implementation task (backend OR frontend) is marked Done until it passes a CONCRETE, REPEATABLE automated test. Code-review-only / "needs manual browser check" QA is NOT acceptable as proof of Done.
- PM must ensure a runnable test command exists in the repo (e.g. `bash tests/run.sh`) and is EXECUTED before marking the task Done. If absent, delegate creation of one before accepting the work.
- If env lacks browser/node: install lightweight tooling (jsdom for frontend DOM, live-server integration via urllib/curl for backend) instead of declaring abstract QA. "No browser" is not an excuse for unverified code.
- DoD gate: attach ACTUAL test output (PASS counts / curl results) to the PM handoff — not a prose claim. Supersedes the "manual check if no browser/node" escape in R2.
