# SkillMap v2 — Real Build Challenges + Responsive Pass

**Date:** 2026-06-16
**Status:** approved, ready for implementation
**Builds on:** `2026-06-14-skillmap-design.md` (v1 golden branch)

## 1. The problem

v1's "build" is _watch the visual_. Mastering a node only checks a `touched`
flag — you tapped the visual area, the "light it up" button enables, done. That
is passive; it doesn't prove you understood anything. The whole differentiator
vs roadmap.sh is **you DID the thing**.

Separately, the UI has never had a deliberate mobile pass.

## 2. Goals

1. **Real challenges.** Each retrofitted node states a concrete goal; the learner
   manipulates the visual until it hits a target state; the star auto-lights the
   moment the target is met.
2. **Solve-to-unlock, skip allowed.** Solving is the main path (full XP +
   confetti). A quiet "skip — just exploring" still masters the node, without the
   celebration. It is a learning toy, not a certification — never hard-block the map.
3. **Responsive.** The map, node panel, visuals, landing, and track picker work
   cleanly from ~360px phones up to desktop.

Non-goal (explicitly deferred to v3): in-browser **code execution**
(Monaco/sandbox). "Manipulate the visual to a target" delivers the payoff without it.

## 3. Design

### 3.1 Data layer — challenges are data

`lib/types.ts` gains a `Challenge` and an optional `challenge` field on `SkillNode`:

```ts
export interface Challenge {
  /** the instruction shown above the visual, e.g. "Split the doc into exactly 4 chunks" */
  goal: string;
  /** optional nudge, revealed on demand via a "stuck?" toggle */
  hint?: string;
  /** celebratory line shown once solved, e.g. "4 clean chunks — that's chunking." */
  solved: string;
  /** visual-specific target params; each visual knows how to read its own keys */
  target: Record<string, number | string | boolean>;
}
```

`SkillNode.challenge?: Challenge`. A node **without** a `challenge` keeps the
exact v1 behavior (touch-gate). Fully backward compatible. Existing `build:
BuildStep` stays for those nodes; for retrofitted nodes, `challenge.goal`
supersedes `build.prompt` in the UI.

### 3.2 Visual contract

Every interactive visual optionally accepts:

```ts
interface ChallengeProps {
  challenge?: Challenge;
  onSolved?: () => void;            // fired ONCE, the first time target is met
  onStatus?: (status: string) => void; // live progress text, e.g. "3 / 4 chunks"
}
```

Rules:
- **No `challenge` prop → behave exactly as today** (free play, no callbacks). This
  keeps non-retrofitted visuals untouched.
- With a `challenge`, the visual computes from its own state whether
  `challenge.target` is satisfied, calls `onSolved()` the first time it flips true
  (guarded so it fires once), and emits human-readable progress via `onStatus`.
- The visual interprets its own `target` keys (the wrapper stays generic):
  - `chunking` → `{ chunks: number }` — solved when `chunks.length === target.chunks`.
  - `retrieval-rank` → `{ top1: string }` — solved when `ranked[0].label === target.top1`.
  - `hybrid-search` → `{ retrieves: string }` — solved when the doc whose text
    includes `target.retrieves` is in the top-3.
  - `vector-space` → `{ neighborsAllSameCategory: true }` — solved when the
    selected word's 3 nearest neighbors share its `group`.

`components/visuals/index.tsx` (`Visual` dispatcher) forwards `challenge`,
`onSolved`, `onStatus` to the underlying component.

### 3.3 Panel + gate (`NodePanel.tsx`, new `ChallengeBar`)

When the active node has a `challenge`:
- A **`ChallengeBar`** renders above the visual: `🎯 {goal}`, a live status chip
  fed by `onStatus`, and a small "stuck? show hint" toggle (only if `hint` set).
- Local `solved` state, reset on node change. `onSolved` from the visual flips it.
- On solve: show a ✓ "solved!" badge + the `challenge.solved` line, and
  **auto-master** the node (calls `onMaster(id, { celebrate: true })`). No extra
  click required — solving _is_ the action.
- Unlock section, unsolved: a disabled primary ("↑ solve it to light up") plus a
  small grey secondary **"skip — I'm just exploring"** → `onMaster(id, { celebrate:
  false })`.
- A node **without** a challenge: unchanged v1 touch-gate ("play with it first" →
  "I get it — light it up").
- Already-mastered nodes: show the existing ✓ done line (challenges don't re-gate
  a completed node; revisiting is free play).

### 3.4 Master + skip (`MapExperience.tsx`)

`master(id)` becomes `master(id, opts?: { celebrate?: boolean })`, default
`celebrate: true`.
- `celebrate: true` → existing confetti + XP/level-up toast.
- `celebrate: false` (skip) → master + save, **no confetti**; show a muted toast
  (e.g. `"mastered — no XP, you skipped the challenge"`) OR award XP silently.
  Decision: **skip still awards XP** (keep progression honest to the node being
  done) but **suppresses confetti** and uses a quieter toast. Keeps the map
  progressing for pure explorers while making solving feel better.

### 3.5 Scope of retrofitted challenges this session

Framework + these four (all have crisp, checkable targets):
1. **Chunking** — "Split the doc into exactly N chunks."
2. **Retrieval rank** — "Move your query so 'refund policy' ranks #1."
3. **Hybrid search** — "Find the search mode that surfaces the 'Apple Silicon
   sips power' doc."
4. **Vector space** — "Select a word whose 3 nearest neighbors are all the same
   category."

`token-stream`, `rag-pipeline`, `agent-loop`, `reranking` keep free-play; the
`ChallengeProps` pattern is documented inline so adding a challenge later is a
data + small-checker change, not engine work.

## 4. Responsive pass

Audit + fix at three breakpoints (~360 / ~768 / desktop):
- **MapCanvas** — the constellation centerpiece. SVG viewBox scales, but verify
  node labels, hit targets (min ~44px tap), and hero text don't overflow or
  collide on narrow screens; ensure the canvas has a sensible min-height on mobile.
- **NodePanel** — already `w-[min(640px,100vw)]` (full-bleed on mobile). Verify
  padding, banner emoji, the 4xl/5xl title, and the `ChallengeBar` status chip
  wrap/scale; ensure the visual area never causes horizontal scroll.
- **Visuals** — most already use `flex-col md:flex-row` + `max-w-[360px]`. Verify
  the SVG visuals (Retrieval, VectorSpace) stay tappable and labels legible at
  360px; sliders reachable.
- **Landing (`app/page.tsx`) + track picker (`app/learn/[track]/page.tsx` hero)** —
  verify type scale, grid columns collapse, and CTAs are thumb-reachable.

Approach: read each surface, fix with Tailwind responsive utilities only (no new
deps). Verify by resizing / mobile-emulating against the running dev server.

## 5. Testing / verification

- `npx next build` stays green (types + lint).
- Manual: for each retrofitted node — open it, fail the target (status updates),
  then hit the target → star auto-lights + confetti; reload → progress persisted.
- Manual: "skip" masters without confetti.
- Manual: a non-retrofitted node still works via the old touch-gate.
- Manual: walk the four key surfaces at 360px — no horizontal scroll, nothing
  clipped, all controls reachable.

## 6. Files touched

- `lib/types.ts` — `Challenge` interface + `SkillNode.challenge`.
- `lib/content.ts` — add `challenge` to the four nodes.
- `components/visuals/{ChunkingViz,RetrievalRank,HybridSearch,VectorSpace}.tsx` —
  accept `ChallengeProps`, compute solved, emit callbacks.
- `components/visuals/index.tsx` — forward the new props.
- `components/NodePanel.tsx` — `ChallengeBar`, solved state, auto-master, skip.
- `components/MapExperience.tsx` — `master(id, {celebrate})`.
- Responsive tweaks across `MapCanvas.tsx`, `app/page.tsx`,
  `app/learn/[track]/page.tsx`, and visuals as the audit finds them.
