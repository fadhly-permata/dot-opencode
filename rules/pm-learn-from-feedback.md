---
description: When the user scolds or corrects the Project-Manager, capture the lesson as a global rule in the shared `.opencode` config (not just project `pm/`).
---

# Rule: Learn from feedback (cross-project)

- If the user scolds/corrects the PM about a mistake, or asks to prevent recurrence ("buat rule biar gak keulang" / "update agent"), immediately capture a rule.
- Persist it in the SHARED `.opencode` config (agents/Project-Manager.md, rules/, or skills/) so it applies to ALL projects.
- Keep it generic/shared (no project-specific names/paths/secrets).
- Also log the incident in the project's `pm/status.md`.
- See skill `pm-postmortem` for the full workflow.
