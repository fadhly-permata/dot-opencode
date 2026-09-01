# No Project-Specific References in `.opencode/`

## Context

The `.opencode/` directory (and every subfolder beneath it — `agents/`, `commands/`,
`rules/`, `skills/`, `themes/`, `tools/`, `plugins/`, `contexts/`, etc.) is a **shared,
portable configuration**. It is symlinked or copied across many projects, so it must
never be tied to any single codebase.

## Rule

When writing, creating, or editing **any** file inside `.opencode/` (including all
subfolders), it is **strictly forbidden** to mention:

- the name of any specific project or repository;
- the names of any project files or directories;
- any project-specific paths, endpoints, schemas, identifiers, or implementation details;
- anything else that ties the content to one particular project.

Write only **generic, reusable** content that applies regardless of which project
opencode is running against. Use neutral placeholders (e.g. `<project>`,
`<your-project>`) if an example is unavoidable, never a concrete project name or file.

## Examples

- ❌ "In the **aigate** project, edit `aigate.py` to add a route."
- ❌ "Configure `web/app.js` to call `/v1/chat/completions`."
- ✅ "Add the new route in the project's HTTP handler."
- ✅ "The frontend should call the chat endpoint exposed by the gateway."

## Applicability

This rule binds every agent, sub-agent, skill, command, and tool that writes into
`.opencode/`. It does **not** apply to files written inside a user's actual project
workspace — only to the configuration tree under `.opencode/`.
