# SkillMap

> Don't grind theory. See how it connects — then build.

An **explorable constellation** of AI/LLM engineering. Every concept is a star on a
map; click one, watch an interactive visual move, poke it until it clicks, then light
it up and unlock what's next. No accounts, no lectures — the map and the *why*, then
straight into building intuition.

This is the **v1 golden branch**:

```
LLM Basics → Tokens & Embeddings → Vector DBs → RAG → Agents
```

Each node is fully authored with a hand-built interactive visual. The rest of the
territory is visible as greyed "coming soon" stars.

## Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind**
- **Framer Motion** for animation
- Custom SVG constellation map (no graph-engine dependency)
- **Gemini** (`gemini-2.0-flash`) for the in-app tutor, via `/api/tutor`
- Progress in `localStorage` — no database, no login

## Run it

```bash
npm install
cp .env.example .env.local   # optional — add a Gemini key for the live tutor
npm run dev                  # http://localhost:3000
```

Without a `GEMINI_API_KEY` the tutor runs in a graceful offline mode; everything
else works fully.

## How it's built (the parts that matter)

| Piece | File |
|---|---|
| Content model (every node is data) | `lib/content.ts`, `lib/types.ts` |
| Progress + unlock logic | `lib/progress.ts` |
| The constellation map | `components/MapCanvas.tsx` |
| The node detail panel (5-part anatomy) | `components/NodePanel.tsx` |
| Interactive visuals (the crown jewel) | `components/visuals/*` |
| AI tutor (UI + Gemini route) | `components/Tutor.tsx`, `app/api/tutor/route.ts` |

Adding a concept = adding an object to `NODES` and (optionally) a visual component.
No engine to fight.

## Design spec

See `docs/superpowers/specs/2026-06-14-skillmap-design.md`.
