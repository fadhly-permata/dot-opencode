# Caveman Ultra for Generated Config Files

## Context

All generated files under `.opencode/` (commands, rules, skills, agents, plugins, tools, themes) MUST use caveman mode ultra style — ultra-compressed, fragment-based, minimal tokens.

## Rules

1. **Every generated file in `.opencode/` subdirectories MUST use caveman ultra style.**
   - Applies to: `commands/`, `skills/`, `rules/`, `agents/`, `plugins/`, `tools/`, `themes/`, etc.
   - Does NOT apply to this rule file itself or other meta-rules — those follow `language-usage.md` rule 1 (formal English).

2. **Caveman ultra style rules:**
   - Drop: articles (a/an/the), filler words (just/really/basically), pleasantries, hedging.
   - Use fragments. Short synonyms. Technical terms exact.
   - Pattern: `[thing] [action] [reason]. [next step].`
   - No: "Sure! I'd be happy to help you with that."
   - Yes: "Bug in auth middleware. Fix: ..."

3. **Conflict resolution with `language-usage.md`:**
   - `language-usage.md` rule 1 (formal English) applies to meta-rules and infrastructure.
   - This rule overrides rule 1 for generated command/skill/rule/agent/plugin/tool/theme files.
   - `language-usage.md` rules 2—7 still apply to all files (chat, thinking, language bans, priority).