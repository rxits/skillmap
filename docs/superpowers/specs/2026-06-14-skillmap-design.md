# SkillMap — Design Spec

**Date:** 2026-06-14
**Status:** Approved (design) → ready for implementation plan
**Working name:** SkillMap (brand TBD — see Open Questions)

---

## 1. The thesis

In the AI era, the bottleneck for building software is no longer writing for-loops — it's
having the **mental map** of a domain: knowing what the pieces are, how they connect, and
what each one is *for*, so you can orchestrate AI to build the real thing.

Existing resources fail this in opposite ways:
- **roadmap.sh** — has the visual map, but it's static and dead (click a node → list of links).
- **boot.dev** — gamified build-as-you-learn, but linear, not an explorable map.
- **Brilliant.org** — beautiful interactive visuals, but not for builders.

**SkillMap's wedge = roadmap.sh's map + boot.dev's "build it" + Brilliant's interactivity**,
with an AI tutor that is native, not bolted on. We teach the **map and the "why,"** then push
the learner into manipulating things, not memorizing syntax.

## 2. First vertical (the proving ground)

**AI / LLM engineering.** Chosen because the "understand the pieces, start building" thesis is
*most* true here, demand is highest, existing resources are worst, and it is visually rich
(a RAG pipeline *wants* to be animated). The same engine clones to other domains later
(full-stack, systems, etc.) once the format is proven.

## 3. The core loop

```
Explore the map  →  click a node  →  Node View  →  complete  →  unlock neighbors
```

### Node anatomy (every node has these five parts)
1. **The Hook (10 sec)** — one jargon-free sentence on *why this exists*.
   e.g. RAG: "Your LLM doesn't know your company's docs. RAG gives it a memory."
2. **The Interactive Visual (the star)** — an animated, manipulable diagram. For RAG: watch a
   doc get chunked → embedded → stored → a query retrieve top-k → stuffed into a prompt → answer.
   Hover stages, change the query, see retrieval change.
3. **The Map-in (20 sec)** — where it sits: "RAG builds on [Embeddings] + [Vector DBs], and is
   an alternative to [Fine-tuning]." These are clickable graph links.
4. **The Build (the payoff)** — *manipulating the visual itself* is the v1 build: change the
   query, drag the chunk size, watch the result. You *did* RAG; you didn't read about it.
   (Full in-browser code challenges = v2.)
5. **The Unlock** — completing lights the node and unlocks adjacent nodes (the game layer).

**Depth via zoom:** a node like RAG expands into child nodes (chunking strategies, re-ranking,
hybrid search) when the learner wants more — never forced.

## 4. Components (each isolated, one clear job)

| Component | Job | Tech |
|---|---|---|
| **The Map** | Pannable/zoomable graph; node state (locked/available/completed); prereq edges. Home screen + spine. | React Flow |
| **The Node View** | Renders the 5-part node anatomy. Each part is its own component. | React |
| **Visual Primitives Library** | *Crown jewel.* Reusable animated blocks (`pipeline-flow`, `token-stream`, `vector-space`, `attention-grid`, `retrieval-rank`). Each node's visual is *composed*, not hand-built. This is what lets content scale without the project collapsing. | React + Framer Motion + D3 |
| **The AI Tutor** | Context-aware chat (knows current node). "Explain simpler," "go deeper," build hints. | Gemini API via `/api/tutor` |
| **Progress / Game layer** | XP, node unlocking, completion state. | `localStorage` (v1) |
| **Content Model** | Every node is *data* (structured file: id, hook, prereqs, visual-component ref, build spec, deeper children). Adding content ≠ writing code. | JSON/MDX schema |

## 5. Data flow

- Content files → render the Map + Node View.
- Progress read/written to `localStorage`.
- Tutor: browser → `/api/tutor` (serverless route) → Gemini → streamed back.
- **No database in v1.** No accounts, no login — instant, frictionless.

## 6. Stack (free-first, deployable)

Next.js (App Router) + TypeScript + Tailwind + React Flow (map) + Framer Motion (animation) +
D3 (custom viz) + Gemini API. Deploy on Vercel (free tier). No DB v1.

## 7. v1 scope — one golden branch, fully polished

Ship **one beautiful complete path** rather than 50 shallow nodes:

```
LLM Basics → Tokens & Embeddings → Vector DBs → RAG → Agents   (~5 nodes)
```

Each node has the *full* anatomy and a killer visual. The rest of the tree is **visible but
greyed/locked** so the vision and quality bar are obvious. Quality proves the format; quantity
comes after.

## 8. Testing

- Component tests for the Visual Primitives (they're the reusable core).
- Content schema validation (a malformed node should fail loudly, not silently).
- A couple of e2e flows: load the map, complete a node, see the neighbor unlock.

## 9. Decisions locked (vetoable)

- **No accounts/DB in v1** — progress in-browser. Shippable in days, not weeks.
- **Gemini for the tutor** (not OpenAI) — free, matches the existing stack.
- **Build = manipulate the visual** in v1; full code-execution challenges deferred to v2.

## 10. Out of scope for v1 (YAGNI)

- User accounts, auth, cloud-synced progress.
- In-browser code execution + AI grading.
- Multiple domains (full-stack, systems, etc.) — clone *after* the format is proven.
- Social / leaderboard / multiplayer.
- Mobile-native app (responsive web is enough).

## 11. Open questions

- **Brand name.** "SkillMap" is a working title. Real brand to be decided before public launch.
- **Identity/vehicle.** Standalone product vs. Aumiqx in-house vs. solo — decide before launch,
  not needed for build.
