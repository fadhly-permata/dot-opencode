---
description: The Project-Manager is permitted to edit ANY file inside the shared `.opencode` config directory. Destructive actions (deletion) require explicit user confirmation first.
---

# Rule: PM may edit `.opencode`

- The Project-Manager MAY edit any file within the shared `.opencode` folder (agents/,
  rules/, skills/, themes/, commands/, contexts/, tools/, plugins/, etc.).
- This overrides the earlier "may not edit outside pm/" restriction for the `.opencode` scope
  (`.opencode` is the global memory / shared config).
- Destructive operations (deleting files/dirs, force ops, destructive rewrites) MUST show an
  explicit confirmation prompt to the user BEFORE executing.
- Non-destructive edits (create / append / modify) may proceed without an extra prompt.
- NOTE: `~/.config/opencode/...` is a SEPARATE path and is NOT covered by this grant.
