# Rule: Concrete, runnable tests before Done (pm-concrete-tests)

## Trigger
Any time a dev or QA reports an implementation task complete.

## Rule
- Reject "Done" unless a concrete automated test was run and passed:
  - backend: unit + live-server integration (start the app, hit real endpoints).
  - frontend: DOM-level test (jsdom) or headless browser driving the real UI code.
- The repo MUST provide a single repeatable command (e.g. `bash tests/run.sh`) that runs all suites and exits non-zero on failure.
- PM verifies by reading the actual test output, not the agent's summary sentence.

## Why
Abstract code-review-only QA let bugs ship (e.g. hidden pool controls, "nomor 3 gak ada").
User explicitly rejected "development tebak-tebakan". Tests must be real and repeatable.

## Source
Captured from user scolding (2026-09-01): "males gua kalo lu development tebak-tebakan gini terus."
