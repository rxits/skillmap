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
