---
name: pm-postmortem
description: 'Captures a durable, cross-project rule/skill/command whenever the user scolds the Project-Manager about a mistake, so the same error is never repeated across any project. Trigger: user is angry/annoyed at PM ("tolol", "salah", "kenapa lu...", scolding), or says "buat rule biar gak keulang" / "update agent".'
---

# PM Postmortem — learn from scolding (global)

When the user expresses anger/disappointment at the PM, or asks to "update the agent":

1. **Identify** the exact mistake from the user's words.
2. **Derive** a precise, actionable rule. Keep it GENERIC/SHARED (no project name, path, file, endpoint, stack, or secret).
3. **Persist globally** in the shared `.opencode` config (symlinked across projects):
   - Append to `agents/Project-Manager.md` (PM SOP), and/or
   - add a `rules/<name>.md`, and/or
   - create a `skills/<name>/SKILL.md`.
   Do NOT restrict the learning to a single project's `pm/`.
4. **Record locally**: add a line to the current project's `pm/status.md` noting the incident + rule.
5. **Confirm** to the user, concisely, what was added.

Do NOT argue. Do NOT repeat the mistake. Goal: a self-improving PM whose lessons are global.
