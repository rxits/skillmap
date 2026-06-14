export type NodeState = "locked" | "available" | "mastered";

export type VisualKind =
  | "token-stream"
  | "vector-space"
  | "retrieval-rank"
  | "rag-pipeline"
  | "agent-loop"
  | "none";

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
  /** future/deeper children, shown as a teaser (not built in v1) */
  deeper?: string[];
  /** position on the constellation canvas, in 0..100 viewBox units */
  x: number;
  y: number;
  /** true for nodes that are visible but not yet authored (greyed stars) */
  comingSoon?: boolean;
}
