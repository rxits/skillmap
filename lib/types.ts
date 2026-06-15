export type NodeState = "locked" | "available" | "mastered";

export type VisualKind =
  | "token-stream"
  | "vector-space"
  | "retrieval-rank"
  | "rag-pipeline"
  | "agent-loop"
  | "chunking"
  | "reranking"
  | "hybrid-search"
  | "none";

export type RefKind = "video" | "docs" | "article" | "repo" | "paper";

export interface Reference {
  label: string;
  url: string;
  kind: RefKind;
}

export interface RepoLink {
  label: string;
  url: string;
  /** short note on why this repo, e.g. "build a GPT from scratch" */
  note?: string;
}

export interface Mission {
  /** the fun, real-world build challenge for this node */
  task: string;
  /** rough difficulty for the badge */
  level: "warm-up" | "real" | "spicy";
  /** starter repos to fork / steal from */
  repos: RepoLink[];
}

export interface BuildStep {
  /** A short instruction shown above the visual: "the build" */
  prompt: string;
  /** What counts as "done" — shown as the success line when they finish */
  done: string;
}

/**
 * A real "do the thing" challenge. The learner manipulates the node's visual
 * until it reaches `target`; the visual reports state and auto-solves. Challenges
 * are pure data — each visual knows how to read its own `target` keys.
 */
export interface Challenge {
  /** the goal shown above the visual, e.g. "Split the doc into exactly 4 chunks" */
  goal: string;
  /** optional nudge, revealed on demand */
  hint?: string;
  /** celebratory line shown once solved */
  solved: string;
  /** visual-specific target params, interpreted by the matching visual */
  target: Record<string, number | string | boolean>;
}

/** Props every interactive visual optionally accepts to run a challenge. */
export interface ChallengeProps {
  challenge?: Challenge;
  /** fired ONCE, the first time the target is met */
  onSolved?: () => void;
  /** live progress text, e.g. "3 / 4 chunks" */
  onStatus?: (status: string) => void;
}

export interface MapLink {
  /** id of a related node, rendered as a clickable chip in "map-in" */
  to: string;
  /** how it relates: "builds on", "alternative to", "leads to" */
  relation: string;
}

export interface SkillNode {
  id: string;
  title: string;
  /** a fun emoji that gives the node a face */
  emoji?: string;
  /** per-node accent color (hex) used for its star, banner, and glow */
  accent?: string;
  /** optional YouTube video id embedded in the node panel */
  video?: string;
  /** one-line, jargon-free "why this exists" */
  hook: string;
  /** longer context paragraph shown in the panel */
  blurb: string;
  /** which interactive visual to render */
  visual: VisualKind;
  /** prerequisite node ids — all must be mastered for this to unlock */
  prereqs: string[];
  /** related nodes for the "map-in" section */
  related: MapLink[];
  /** the in-visual build challenge */
  build: BuildStep;
  /** optional "do the thing" challenge that gates mastery; absent = v1 touch-gate */
  challenge?: Challenge;
  /** a real-world build assignment with starter repos */
  mission?: Mission;
  /** curated "go learn more" links */
  references?: Reference[];
  /** future/deeper children, shown as a teaser (not built in v1) */
  deeper?: string[];
  /** position on the constellation canvas, in 0..100 viewBox units */
  x: number;
  y: number;
  /** true for nodes that are visible but not yet authored (greyed stars) */
  comingSoon?: boolean;
  /** if set, this is a "go deeper" child node nested under a parent node */
  parent?: string;
}

/** A learning track shown on the landing "choose your tech" picker. */
export interface Track {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  /** number of authored nodes, for the card */
  nodeCount?: number;
  live: boolean;
  /** tailwind-ish accent hex for the card glow */
  accent: string;
}
