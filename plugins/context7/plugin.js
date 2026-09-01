// context7 — opencode plugin
//
// Custom tool `context7`: grounded library/framework knowledge via Context7 API.
// - Checks local cache `.opencode/contexts/` first
// - Cache hit -> returns cached text, no server round-trip
// - Cache miss -> fetches from Context7, saves to cache, returns text
//
// API key resolution order:
//   1. `.env` in project root (CONTEXT7_API_KEY=...)
//   2. process.env.CONTEXT7_API_KEY
//
// Uses Node built-ins only. No external deps beyond @opencode-ai/plugin.

import { tool } from "@opencode-ai/plugin"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const API_BASE = "https://context7.com/api/v2"

function sanitize(s) {
  return s.replace(/[/\s]+/g, "_")
}

function loadApiKey(directory) {
  const envPath = join(directory, ".env")
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, "utf8")
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*CONTEXT7_API_KEY\s*=\s*(.+?)\s*$/)
      if (m) return m[1].trim().replace(/^["']|["']$/g, "")
    }
  }
  return process.env.CONTEXT7_API_KEY || ""
}

async function searchLibrary(apiKey, libraryName, query) {
  const url = `${API_BASE}/libs/search?libraryName=${encodeURIComponent(libraryName)}&query=${encodeURIComponent(query)}`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } })
  if (!res.ok) throw new Error(`Context7 search failed: HTTP ${res.status}`)
  const data = await res.json()
  const first = data.results?.[0]
  if (!first) throw new Error(`No library found for "${libraryName}"`)
  return first
}

async function fetchContext(apiKey, libraryId, query) {
  const url = `${API_BASE}/context?libraryId=${encodeURIComponent(libraryId)}&query=${encodeURIComponent(query)}&type=txt`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } })
  if (!res.ok) throw new Error(`Context7 context failed: HTTP ${res.status}`)
  return await res.text()
}

export const Context7Plugin = async ({ directory }) => {
  return {
    tool: {
      context7: tool({
        description:
          "Fetch authoritative library/framework docs from Context7. Grounded, factual source — use before answering library-specific questions. Cached in .opencode/contexts/: cache hit returns instantly with no server call. Args: library (name e.g. 'next.js' or libraryId e.g. '/vercel/next.js'), query (topic, e.g. 'setup ssr').",
        args: {
          library: tool.schema
            .string()
            .describe("Library name (e.g. 'next.js') or libraryId (e.g. '/vercel/next.js')"),
          query: tool.schema.string().describe("Topic to look up, e.g. 'setup ssr'"),
        },
        async execute(args, context) {
          const apiKey = loadApiKey(context.directory)
          if (!apiKey) {
            return "ERROR: CONTEXT7_API_KEY not set. Add CONTEXT7_API_KEY=... to .env in project root."
          }

          const cacheDir = join(context.directory, ".opencode", "contexts")
          mkdirSync(cacheDir, { recursive: true })

          const libraryId = args.library.startsWith("/")
            ? args.library
            : (await searchLibrary(apiKey, args.library, args.query)).id

          const cacheFile = join(cacheDir, `${sanitize(libraryId)}__${sanitize(args.query)}.md`)
          if (existsSync(cacheFile)) {
            return {
              title: `context7 cache hit: ${libraryId} / ${args.query}`,
              output: readFileSync(cacheFile, "utf8"),
              metadata: { source: "cache", cacheFile },
            }
          }

          const content = await fetchContext(apiKey, libraryId, args.query)
          writeFileSync(cacheFile, content, "utf8")
          return {
            title: `context7 fetch: ${libraryId} / ${args.query}`,
            output: content,
            metadata: { source: "context7", cacheFile },
          }
        },
      }),
    },
  }
}
