---
description: Before creating any artifact (file/rule/skill/doc entry), check existing ones to prevent redundancy/duplication. Extend existing instead of creating new.
---

# Rule: No redundancy — check before create

Before creating ANY artifact (file, rule, skill, doc entry, tracking row, sub-agent
definition, config):
1. SEARCH existing artifacts FIRST:
   - global `.opencode` (rules/, skills/, agents/, commands/, contexts/) for cross-project items,
   - project `documents/` and `pm/` for local items.
   Use grep/glob, don't assume.
2. If something similar already exists, EXTEND or UPDATE it — do NOT create a parallel copy.
3. Do not keep a project-local copy of something that already lives globally in `.opencode`
   (e.g. PM operating rules belong ONLY in `.opencode`, not duplicated in `pm/`).
4. If unsure whether a duplicate exists, ask or grep before writing.
Goal: zero redundant artifacts.
