# Report Workflow Rules

## Context

Every executed request (feature, bugfix, refactor, configuration, etc.) **MUST** produce a report file — except for git commit/push commands and question-type commands.

## Rules

1. **Every request must produce a report** — unless it falls under the exceptions below.
   - **Exceptions (no report required):**
     - `git commit`, `git push`, and their variants (e.g. `git commit -m "..."`, `git push origin main`)
     - Question-type commands (e.g. "how to...", "what is...", "why does this error...", "explain...")

2. **Report storage location:**
   ```
   .opencode-data/reports/{yyyymmdd}/{action_type}/{hhmm}_{short_desc}.md
   ```
   - `{yyyymmdd}` → working date, format `YYYYMMDD` (e.g. `20260901`)
   - `{action_type}` → action type, lowercase, `snake_case`:
     - `feature`, `fix`, `refactor`, `config`, `docs`, `test`, `other`
   - `{hhmm}` → work start time, format `HHMM` (e.g. `1430`)
   - `{short_desc}` → short description, `snake_case`, max ~5 words (e.g. `add_auth_middleware`)

   Full path example:
   ```
   .opencode-data/reports/20260901/feature/1430_add_auth_middleware.md
   ```

3. **`.opencode-data/reports/`** lives in the local project folder (adjacent to `.opencode/`), not inside `.opencode/` — per `opencode-shared-config.md`.

4. **Mandatory report structure:**
   ```markdown
   # Report: {short_desc}

   - **Date:** {yyyymmdd} {hhmm}
   - **Action Type:** {action_type}
   - **Duration:** {working duration, optional}

   ## User Request
   {summarize the original user request concisely}

   ## Implementation Plan
   {planned steps before execution}

   ## Implementation Status
   {progress: what is done, what is not, blockers if any}

   ## Final Notes
   {final result, decisions, anything the user should know / follow up later}
   ```

5. **Writing timeline:**
   - **User Request + Implementation Plan** → write at the start, before execution
   - **Implementation Status** → update throughout / upon completion
   - **Final Notes** → close after the request is complete / stopped

6. The user may explicitly decline a report for a given request — that decline takes priority.
