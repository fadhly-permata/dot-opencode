# dot-opencode

A portable, version-controlled configuration bundle for [opencode](https://opencode.ai).
This repository contains a complete, ready-to-use `.opencode/` configuration: plugins,
rules, agents, commands, skills, themes, and tools — designed to be shared across
multiple projects from a single source of truth.

---

## Table of Contents

- [Overview](#overview)
- [What's Inside](#whats-inside)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Example Workflow](#example-workflow)
- [Plugins](#plugins)
- [Rules](#rules)
- [Keeping It Updated](#keeping-it-updated)
- [Notes & Conventions](#notes--conventions)

---

## Overview

opencode loads its configuration from a directory named `.opencode/`. This repository
is that directory. Instead of duplicating configuration into every project, the
recommended setup is to keep this repository in one place and **symlink** it into each
project (or point opencode's global config at it). Any change made here is instantly
reflected in every linked project, and the whole setup stays under Git version control.

### Layout

```
dot-opencode/
├── .gitignore
├── README.md
├── agents/                 # agent definitions (add .gitkeep so dir is tracked)
├── commands/               # slash commands
├── contexts/               # local cache for the Context7 plugin
├── plugins/                # opencode plugins
│   ├── caveman/
│   └── context7/
├── rules/                  # behavioral rules (always-on guardrails)
├── skills/                 # skill definitions
├── themes/                 # UI themes
└── tools/                  # custom tools
```

> **Note:** `node_modules/` is intentionally **not** committed. opencode supplies the
> `@opencode-ai/plugin` runtime at execution time, so no dependency install is required.

---

## Requirements

| Component      | Minimum version | Notes                                            |
|----------------|-----------------|--------------------------------------------------|
| opencode       | `>= 1.15.x`     | Required for the `event` hook used by caveman.   |
| Node.js / Bun  | current         | Used by opencode to run plugin code.             |
| Git            | any modern      | To clone and track this repository.              |
| OS             | Linux / macOS / Windows | Config dir resolves cross-platform.     |

Optional:

- A `CONTEXT7_API_KEY` for the Context7 plugin (see [Configuration](#configuration)).

---

## Installation

### Option A — Global config (recommended for a single machine)

Place the repository at opencode's global config location so **every** project picks it
up automatically:

```bash
git clone https://github.com/fadhly-permata/dot-opencode.git ~/.config/opencode
```

opencode resolves its global config from `$XDG_CONFIG_HOME/opencode`, or
`~/.config/opencode` when `XDG_CONFIG_HOME` is unset (this also holds on Windows, where
it maps to `%USERPROFILE%\.config\opencode`).

### Option B — Per-project symlink (shared source of truth)

Keep one canonical copy and symlink each project's `.opencode/` to it:

```bash
# 1. Clone the canonical copy once
git clone https://github.com/fadhly-permata/dot-opencode.git ~/dot-opencode

# 2. From any project that should use it
cd /path/to/your/project
ln -s ~/dot-opencode .opencode
```

This is the approach used by the author: every project's `.opencode` is a symlink
pointing back to the same shared folder, so edits propagate everywhere.

### Option C — Copy into a project

If you prefer a self-contained project, copy the contents instead of symlinking:

```bash
git clone https://github.com/fadhly-permata/dot-opencode.git /tmp/dot-opencode
cp -r /tmp/dot-opencode/. your-project/.opencode/
```

> Empty directories (`agents/`, `commands/`, `skills/`, `themes/`, `tools/`,
> `contexts/`) contain a `.gitkeep` placeholder so Git tracks them. You may delete
> these placeholders once you add real content.

---

## Usage

Once installed, start opencode as usual:

```bash
opencode
```

All rules, plugins, and tools load automatically — no further setup is required.

### Caveman mode

The **caveman** plugin provides an ultra-compressed, token-efficient communication style.
Toggle it inline:

| Command                        | Effect                                        |
|--------------------------------|-----------------------------------------------|
| `/caveman lite`                | Enable caveman mode (lite).                   |
| `/caveman full`                | Enable caveman mode (full, default intensity).|
| `/caveman ultra`              | Enable caveman mode (ultra).                  |
| `/caveman wenyan-lite` … etc.  | Wenyan variants of each intensity.            |
| `stop caveman` / `normal mode`| Return to normal, verbose communication.      |

Natural-language toggles (e.g. "talk like a caveman", "be terse") are also recognized.
The active mode is stored in a flag file (`.caveman-active` inside the opencode config
directory) and is re-asserted on every new session.

### Context7 tool

The **context7** plugin registers a `context7` tool that fetches authoritative
library/framework documentation and caches it locally:

```
Use the context7 tool with:
  library: "next.js"            (or a libraryId like "/vercel/next.js")
  query:    "setup ssr"
```

- **Cache hit** — results in `.opencode/contexts/` are returned instantly, with no
  network call.
- **Cache miss** — the plugin queries Context7, saves the result to
  `.opencode/contexts/`, then returns it.

---

## Example Workflow

A concrete example of how the **PM** agent orchestrates the team. Suppose the user
asks, in the PM session:

> "Build a login feature with email + password."

### Step 1 — PM decides execution mode

On first activation the PM reads `pm/state.md`. Finding none, it asks:

```
Execution mode?
  (1) Parallel
  (2) Sequential   ← recommended on free-tier tokens
```

The user picks **Sequential**. The PM writes:

```markdown
# pm/state.md
mode: sequential
delay_seconds: 20
updated: 2026-09-01T10:00:00Z
```

### Step 2 — PM plans and delegates

The PM breaks the work into tasks and hands each to the right specialist (one at a
time in sequential mode, with a `sleep 20` between steps):

| # | Owner                | Task                                                        |
|---|----------------------|-------------------------------------------------------------|
| 1 | `business-analyst`   | PRD + acceptance criteria for the login feature              |
| 2 | `system-analyst`     | TSD/FSD + ERD for users table, session, and auth flow       |
| 3 | `ui-ux`              | Login screen wireframe + component spec                     |
| 4 | `backend-dev`        | API endpoints, password hashing, session, DB migration      |
| 5 | `frontend-dev`       | Login form, validation, API integration                     |
| 6 | `devops`             | CI pipeline + secrets + deploy config                       |

The PM **never** writes the PRD, the ERD, or any code itself — it only coordinates and
tracks. After each sub-agent returns, the PM updates the todo list and runs
`sleep 20` before the next handoff.

### Step 3 — Tracking & delivery

The PM keeps `pm/` artifacts up to date:

- `pm/roadmap.md` — milestones and owners
- `pm/status.md` — what is done / blocked / next

When all specialists report done, the PM verifies handoffs and gives the user a short
delivery summary:

```
LOGIN FEATURE — ready for review
  PRD/BRD ...... business-analyst ✓
  TSD/FSD/ERD .. system-analyst ✓
  UI spec ...... ui-ux ✓
  API + DB ..... backend-dev ✓ (3 files)
  UI impl ...... frontend-dev ✓ (5 files)
  CI/deploy .... devops ✓
Next: user acceptance test.
```

### Re-activation

On a later session the PM reads `pm/state.md`, sees `mode: sequential`, and skips the
question — resuming in the same mode until the user says otherwise.

---

## Plugins

### `plugins/caveman`

Dynamic caveman-mode tracking for opencode.

- Writes the mode flag at plugin load **and** on every `session.created` event,
  covering both the TUI and one-shot `opencode run` entry points.
- Parses `/caveman` slash commands and natural-language mode toggles from user
  messages.
- Injects a per-turn reinforcement line into the system prompt while active.
- Symlink-safe flag writes live in `caveman-config.cjs`; mode-change parsing lives in
  `caveman-parse.cjs`. Both are loaded defensively (evaluated inline) so they work
  inside opencode's compiled Bun runtime.

Files:

| File                | Purpose                                          |
|---------------------|--------------------------------------------------|
| `plugin.js`         | Plugin entry point and hook wiring.              |
| `caveman-config.cjs`| Flag read/write helpers (symlink-safe).          |
| `caveman-parse.cjs` | Slash-command / NL mode-change parser.           |
| `package.json`      | Plugin metadata (`"type": "module"`).           |

### `plugins/context7`

Grounded library knowledge via the Context7 API.

- Custom `context7` tool: search a library, fetch its docs, return as text.
- Local cache in `.opencode/contexts/` keyed by library + query.
- API key resolved from `.env` (`CONTEXT7_API_KEY`) in the project root, then
  `process.env.CONTEXT7_API_KEY`.

Files:

| File          | Purpose                                          |
|---------------|--------------------------------------------------|
| `plugin.js`   | Tool definition and fetch/cache logic.           |
| `package.json`| Plugin metadata (`"type": "module"`).           |

---

## Rules

The `rules/` directory holds always-on behavioral guardrails. They are applied
automatically when their trigger condition is met — no confirmation step is required.

| Rule file                          | Purpose                                                                 |
|------------------------------------|-------------------------------------------------------------------------|
| `caveman-generated-files.md`       | Generated `.opencode/` files must use caveman ultra style.              |
| `check-existing-before-create.md`  | Prefer updating an existing file over creating a fragmented new one.    |
| `fact-based-knowledge.md`          | No hallucination — ground claims in verifiable facts (Context7/web).    |
| `language-usage.md`                | Enforce consistent language; prohibit non-Latin text in artifacts.      |
| `no-confirmation-on-existing-rule.md` | Master override: execute matching rules immediately, no prompt.     |
| `opencode-shared-config.md`        | Documents that `.opencode/` is a shared symlink, not a local folder.    |
| `report-workflow.md`               | Every executed request must produce a report file (except commits/QA).  |

---

## Configuration

### Context7 API key

Create a `.env` file in your **project root**:

```env
CONTEXT7_API_KEY=your_context7_key_here
```

The key is read at tool-call time; no restart is needed.

### Caveman default mode

The default caveman intensity is defined in `caveman-config.cjs`
(`getDefaultMode()`). Edit that value to change the mode applied on session start.

---

## Keeping It Updated

Because the config is a Git repository, updating is a single command from inside it
(or from any symlinked project that maps back to it):

```bash
cd ~/dot-opencode     # or: cd /path/to/your/project/.opencode
git pull
```

Changes propagate to every linked project immediately.

---

## Notes & Conventions

- **Single source of truth.** Edit configuration here, never in a copied subtree.
- **Empty folders are tracked** with `.gitkeep` so the structure survives a fresh
  clone. Remove the placeholder once a folder holds real content.
- **`node_modules/` and lockfiles are ignored.** Plugins rely only on opencode's
  bundled runtime (`@opencode-ai/plugin`).
- **`contexts/` is committed** (with a `.gitkeep`) as the cache directory for
  Context7; cached responses live here and are safe to delete.
- This repository is licensed for personal/shared use; see the repository
  `LICENSE` for details.

---

Generated and maintained as part of the `dot-opencode` project.
