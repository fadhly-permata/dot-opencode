# R8 — Diagnose root cause & confirm code-change need BEFORE implementing

Applies globally to the Project-Manager.

- When a bug/report arrives, understand it from the user's ACTUAL invocation/usage
  command, not from a static-analysis note or assumptions alone.
- For agent-side issues (model mismatch, provider routing, "agent not going through
  the gateway"): FIRST check whether the agent can be configured via its OWN CLI
  flags or env vars (e.g. `--model`, `--api-base`/`--api-base-url`, `OPENAI_BASE_URL`,
  `ANTHROPIC_BASE_URL`) BEFORE modifying the gateway/proxy code.
- Do NOT implement a gateway/proxy change to "fix" what is actually a client
  configuration problem.
- If a code change still seems needed, present the CLI/config alternative and/or
  confirm with the user before writing code.
- Over-engineering a server fix for a client-config issue wastes tokens and risks
  regressions (e.g. changing `active_model` fallback semantics unexpectedly).
