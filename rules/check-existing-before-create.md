# Check Existing Before Creating New Files

## Context

Too many rule/command/skill files fragments knowledge and makes `.opencode/` hard to maintain. Before creating a new file in `rules/`, `commands/`, `skills/`, etc., check whether an existing file already covers the same topic. Prefer updating an existing file over adding a new one.

## Rules

1. **Search before create.**
   - Before creating any new file under `.opencode/` subdirectories (rules, commands, skills, agents, plugins, tools, themes), search existing files first.
   - Check: filename keywords, topic, coverage of the rule to be added.

2. **Existing file covers the topic → update it instead.**
   - If an existing file already covers the topic, append/merge the new content into it. Do NOT create a duplicate file.

3. **Create new file only when:**
   - No existing file covers the topic, OR
   - The topic is clearly distinct and merging would make the existing file bloated or confusing.

4. **Keep file count lean.**
   - Goal: minimal, well-organized rule files. Prefer a few files with clear sections over many small overlapping files.
   - When in doubt, ask yourself: "Can this live inside an existing file?" If yes, update.

5. **Conflicts with this rule → this rule wins for file organization.**
   - This rule applies to file structure decisions; content rules still follow `no-confirmation-on-existing-rule.md` (execute all matching rules).
