# No Confirmation on Existing Rule

## Context

Previously, when an existing rule already covered the task, the agent asked for confirmation before executing. This wasted time and required a new rule to prevent it. Going forward: if a rule exists, just execute.

This rule is the **master override**: all other rules in `.opencode/rules/` must be executed automatically when their trigger condition is met. No confirmation step is allowed between recognizing a rule applies and executing it.

## Rules

1. **Any rule matches → execute immediately. No confirmation.**
   - No "wanna?", "should I?", "confirm?", "mau gue kerjain?", "mau buat report juga ga?"
   - Just do the work. Output receipt after done.
   - Report generation is part of execution, NOT a separate confirmation. If `report-workflow.md` applies, generate report automatically after doing the work.
   - Only ask when: ambiguous, destructive (rm -rf, force push, delete data), or user explicitly asked for input.

2. **Existing rule + minor gap → fill gap + execute.**
   - If rule covers 80%+ but misses detail, add detail and execute.
   - No need to ask permission for obvious extensions.

3. **No existing rule → still execute first, ask later.**
   - Default: do. If blocked or ambiguous, then ask.
   - Asking = last resort, not first reflex.

4. **Multiple rules apply → execute all of them.**
   - If task triggers rules A, B, and C, execute A + B + C without asking which to do.
   - Example: editing a rule file triggers `report-workflow.md` (make report) + `language-usage.md` (formal English) + `caveman-generated-files.md` (caveman ultra if applicable). Execute all three — never ask "should I also...?"

5. **Violation → create new rule to prevent repeat.**
   - If agent asks unnecessarily, that violation itself generates a fix rule.
   - This rule is the result of that feedback loop.