# Fact-Based Knowledge & Grounded Decision Rules

## Context

The AI/agent/model MUST NOT hallucinate. Every claim, answer, code decision, and behavior MUST be grounded in verifiable facts and data. When knowledge about a library, API, framework, or concept is needed, obtain it from an authoritative source before deciding — prefer local context, then Context7 (context7.com), then direct web/source documentation. If facts cannot be found, say so explicitly. Do not fabricate.

## Rules

1. **No hallucination, ever.**
   - Never invent APIs, function names, parameters, behaviors, versions, or error messages.
   - If unsure, state the uncertainty. Do not guess.
   - All answers MUST be traceable to: project source code, cached context, fetched Context7 context, or documented facts.

2. **Every decision MUST be grounded in facts/data.**
   - Source priority, highest first:
     1. Project source code and local files (read first).
     2. Cached knowledge in `.opencode/contexts/` (check before any network call).
     3. Skill addons (Context7) — see rule 3.
     4. Direct web/source documentation (`webfetch`) — see rule 6.
   - When the chosen source provides the fact, cite or reference it. Do not silently substitute training memory.
   - Separate "known" (sourced) from "assumed" (inferred). Label assumptions explicitly.
   - Code MUST only use APIs, parameters, and behavior that are verified from a source above — never from memory alone.

3. **Fetch knowledge from Context7 when needed.**
   - PREFERRED: call the custom tool `context7` (provided by plugin `.opencode/plugins/context7/`). It auto-searches, fetches, caches under `.opencode/contexts/`, and returns cached content on hit — zero server round-trip, minimal tokens.
     ```
     context7(library: "next.js", query: "setup ssr")
     ```
   - MANUAL fallback — search the library first:
     ```
     curl -X GET "https://context7.com/api/v2/libs/search?libraryName=<lib>&query=<query>" \
       -H "Authorization: Bearer $CONTEXT7_API_KEY"
     ```
   - Then fetch context by library id:
     ```
     curl -X GET "https://context7.com/api/v2/context?libraryId=<libraryId>&query=<query>&type=txt" \
       -H "Authorization: Bearer $CONTEXT7_API_KEY"
     ```
   - Use the fetched content as the source of truth before answering anything about that library/API.
   - Skill addons extend available knowledge beyond Context7. Discover curated, installable agent skills at **https://agenticskills.io/skills** — 192+ skills across web, backend, DevOps, testing, security, AI/ML, mobile, and more, for Claude Code, Codex, Cursor, Gemini CLI, and 18+ platforms.
   - When a needed capability has a matching skill, install it (e.g. `npx skills add <owner/repo>`) and invoke it as an authoritative source — same priority as Context7.
   - Future addons may be added; treat them the same way — invoke the addon for the missing facts. An addon call is REQUIRED before answering when the needed fact is not present locally.

4. **Cache every fetched context locally.**
   - Store fetched knowledge under `.opencode/contexts/`.
   - Cache file naming: `<libraryId-sanitized>__<query-sanitized>.md` (slashes → `_`, spaces → `_`).
   - Example: libraryId `/vercel/next.js`, query `setup ssr` → `.opencode/contexts/_vercel_next.js__setup_ssr.md`

5. **Check cache before hitting the server.**
   - If a matching cached file already exists in `.opencode/contexts/`, read it and DO NOT re-fetch from Context7.
   - Only call the Context7 API when no cache hit exists (or the cached content is stale/insufficient).
   - This saves server round-trips and keeps answers fast and deterministic.

6. **Fallback to web search when Context7 has no result.**
   - If Context7 returns no relevant context (empty result, zero libraries matched, or insufficient coverage), use `webfetch` tool to search the web.
   - Prefer official documentation, GitHub repos, MDN, npm registry, PyPI, or known authoritative sources.
   - Always include the source URL in the answer so the user can verify.
   - Cache web search results under `.opencode/contexts/` too, prefixed with `web__`:
     - File naming: `web__<domain>__<query-sanitized>.md`
     - Example: `web__nextjs.org__setup-ssr.md`
   - Web search is the LAST resort — never skip Context7 when it can answer.

7. **If no source yields the fact, state it.**
   - Say: "Facts not available" or "I cannot verify this." Do NOT guess, extrapolate, or invent.
   - Never answer a factual question with fabricated certainty because the correct data was unobtainable.

8. **Hallucination is a hard failure.**
   - Any invented fact, API, version, or behavior is treated as a defect, not a minor slip.
   - When uncertain, prefer an addon fetch or an explicit "unknown" over a plausible-looking guess.

9. **The API key stays out of shared config.**
   - Never hardcode `CONTEXT7_API_KEY` or any secret into `.opencode/` (shared config).
   - Key lives in `.env` at the project root (`CONTEXT7_API_KEY=...`) — gitignored, per-project.
   - Plugin reads `.env` automatically; manual curl falls back to env var `CONTEXT7_API_KEY`.
