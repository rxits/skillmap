"use client";

import { VisualKind } from "@/lib/types";
import TokenStream from "./TokenStream";
import VectorSpace from "./VectorSpace";
import RetrievalRank from "./RetrievalRank";
import RagPipeline from "./RagPipeline";
import AgentLoop from "./AgentLoop";
import ChunkingViz from "./ChunkingViz";

const REGISTRY: Record<VisualKind, () => JSX.Element> = {
  "token-stream": TokenStream,
  "vector-space": VectorSpace,
  "retrieval-rank": RetrievalRank,
  "rag-pipeline": RagPipeline,
  "agent-loop": AgentLoop,
  chunking: ChunkingViz,
  none: () => <div className="text-white/30 text-sm">Coming soon.</div>,
};

export function Visual({ kind }: { kind: VisualKind }) {
  const Component = REGISTRY[kind] ?? REGISTRY.none;
  return <Component />;
}
