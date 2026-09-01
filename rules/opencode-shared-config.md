# Opencode Configuration Rules: Shared via Symlink

## Context

The `.opencode/` directory in every project is **not** a local folder — it is a symlink pointing to a global configuration shared across all projects:
`/storage/emulated/0/Documents/vibecode/opencode-setup/config`

## Rules

1. **All opencode configuration files under `.opencode/` MUST be general/shared.**
   This applies to: `commands/`, `skills/`, `rules/`, `agents/`, `plugins/`, `tools/`, `themes/`, etc.

2. **It is forbidden** to store project-specific content inside `.opencode/`:
   - Project name
   - Project absolute path
   - Project-specific stack/technology
   - Project environment variables, secrets, or API keys
   - Workflows or prompts relevant to only one project

   Because this folder is shared, project-specific content would leak into other projects.

3. **Project-specific details MUST be stored in the `.opencode-data/` folder.**
   - Location: adjacent to `.opencode/` at the project root (not inside it)
   - Note: `.opencode-data/` is not a symlink — purely local per project
   - May be committed to the project git repo (typically via `.gitignore` as per project needs)

4. **Before creating new configuration, ask first:**
   - "Does this apply to all projects?" → store in `.opencode/` (shared)
   - "Is this only for this project?" → store in `.opencode-data/` (local)

5. **Never** delete or modify the contents of `.opencode/` to serve a single project — changes will affect all projects using this symlink.
