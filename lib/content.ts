import { SkillNode } from "./types";

/**
 * The v1 "golden branch" of the AI/LLM engineering map.
 * Five fully-authored nodes + a ring of coming-soon stars so the
 * larger territory is visible. Adding content = editing this array.
 */
export const NODES: SkillNode[] = [
  {
    id: "llm-basics",
    title: "LLM Basics",
    hook: "An LLM is a next-word predictor that got so good at guessing it started to reason.",
    blurb:
      "A large language model reads everything before the cursor and assigns a probability to every possible next token. That's the whole trick. Scale that up across the internet and the 'best guess' becomes summarizing, translating, coding, arguing. You don't need to know how the math trains — you need to know it's a probability machine you steer with context.",
    visual: "token-stream",
    prereqs: [],
    related: [
      { to: "tokens-embeddings", relation: "leads to" },
    ],
    build: {
      prompt:
        "Feed it a prompt and watch the model rank what comes next. Change the prompt — see the probabilities shift.",
      done: "You just saw a model 'think' — it's ranked guesses, all the way down.",
    },
    deeper: ["Sampling & temperature", "Context windows", "Why models hallucinate"],
    x: 18,
    y: 70,
  },
  {
    id: "tokens-embeddings",
    title: "Tokens & Embeddings",
    hook: "Computers can't read words. Embeddings turn meaning into coordinates in space.",
    blurb:
      "Text is first chopped into tokens (chunks of characters), then each token is mapped to a long list of numbers — a vector — positioned so that things with similar meaning sit close together. 'King' lands near 'queen'; 'dog' lands near 'puppy'. Once meaning is geometry, you can measure it, search it, and cluster it.",
    visual: "vector-space",
    prereqs: ["llm-basics"],
    related: [
      { to: "llm-basics", relation: "builds on" },
      { to: "vector-dbs", relation: "leads to" },
    ],
    build: {
      prompt:
        "Pick a word. Watch where it lands and which words are its nearest neighbors in meaning-space.",
      done: "Similar meaning = nearby points. That's the foundation of search and RAG.",
    },
    deeper: ["Tokenization (BPE)", "Cosine similarity", "Embedding models"],
    x: 38,
    y: 44,
  },
  {
    id: "vector-dbs",
    title: "Vector DBs",
    hook: "If meaning is coordinates, a vector DB is the map that finds the nearest neighbors fast.",
    blurb:
      "A vector database stores millions of embeddings and, given a query vector, returns the closest ones in milliseconds. It's the retrieval muscle: not 'find the row where id = 5' but 'find the 5 things most similar in meaning to this'. This is the piece that makes giving an AI a searchable memory practical at scale.",
    visual: "retrieval-rank",
    prereqs: ["tokens-embeddings"],
    related: [
      { to: "tokens-embeddings", relation: "builds on" },
      { to: "rag", relation: "leads to" },
    ],
    build: {
      prompt:
        "Drop a query into the space and pull back the top-k nearest chunks. Change k — watch the net widen.",
      done: "Nearest-neighbor search in action — the engine under every RAG system.",
    },
    deeper: ["ANN indexes (HNSW)", "Metadata filtering", "Hybrid search"],
    x: 60,
    y: 30,
  },
  {
    id: "rag",
    title: "RAG",
    hook: "Your LLM doesn't know your docs. RAG gives it a memory it can look things up in.",
    blurb:
      "Retrieval-Augmented Generation is the assembly line: chunk your documents, embed them, store them. When a question arrives, embed it, retrieve the most relevant chunks, paste them into the prompt, and let the LLM answer using them. The model stays the same — you just hand it the right page open to the right paragraph at the right moment.",
    visual: "rag-pipeline",
    prereqs: ["vector-dbs"],
    related: [
      { to: "vector-dbs", relation: "builds on" },
      { to: "tokens-embeddings", relation: "builds on" },
      { to: "agents", relation: "leads to" },
    ],
    build: {
      prompt:
        "Ask a question. Watch it flow: embed → retrieve the right chunks → stuff the prompt → grounded answer.",
      done: "You ran a full RAG loop. The answer came from YOUR docs, not the model's memory.",
    },
    deeper: ["Re-ranking", "Chunking strategies", "Citations & grounding"],
    x: 80,
    y: 52,
  },
  {
    id: "agents",
    title: "Agents",
    hook: "An agent is an LLM in a loop with tools — it can act, see the result, and try again.",
    blurb:
      "Instead of answering once, an agent thinks, picks a tool (search, code, an API), runs it, observes the result, and decides the next step — looping until the job is done. RAG gives a model knowledge; tools give it hands. The loop is the whole idea: reason, act, observe, repeat.",
    visual: "agent-loop",
    prereqs: ["rag"],
    related: [
      { to: "rag", relation: "builds on" },
    ],
    build: {
      prompt:
        "Give the agent a goal and step the loop: it reasons, calls a tool, observes, and decides again.",
      done: "Think → act → observe → repeat. That loop is what turns a chatbot into a worker.",
    },
    deeper: ["Tool / function calling", "Planning & ReAct", "Multi-agent systems"],
    x: 90,
    y: 26,
  },

  // --- Coming-soon stars: visible territory, not authored in v1 ---
  { id: "prompt-eng", title: "Prompt Engineering", hook: "", blurb: "", visual: "none", prereqs: ["llm-basics"], related: [], build: { prompt: "", done: "" }, x: 26, y: 90, comingSoon: true },
  { id: "fine-tuning", title: "Fine-tuning", hook: "", blurb: "", visual: "none", prereqs: ["rag"], related: [], build: { prompt: "", done: "" }, x: 70, y: 78, comingSoon: true },
  { id: "evals", title: "Evals", hook: "", blurb: "", visual: "none", prereqs: ["rag"], related: [], build: { prompt: "", done: "" }, x: 58, y: 68, comingSoon: true },
  { id: "guardrails", title: "Guardrails", hook: "", blurb: "", visual: "none", prereqs: ["agents"], related: [], build: { prompt: "", done: "" }, x: 96, y: 56, comingSoon: true },
];

export const NODE_BY_ID: Record<string, SkillNode> = Object.fromEntries(
  NODES.map((n) => [n.id, n])
);

/** Edges to draw on the constellation, derived from prereqs. */
export const EDGES: Array<{ from: string; to: string }> = NODES.flatMap((n) =>
  n.prereqs.map((p) => ({ from: p, to: n.id }))
);
