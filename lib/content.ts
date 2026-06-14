import { SkillNode, Track } from "./types";

/** Learning tracks for the landing "choose your tech" picker. */
export const TRACKS: Track[] = [
  {
    id: "ai-engineering",
    name: "AI / LLM Engineering",
    emoji: "🧠",
    tagline: "Build apps that actually think.",
    nodeCount: 5,
    live: true,
    accent: "#f5b94d",
  },
  {
    id: "full-stack",
    name: "Full-Stack Web",
    emoji: "🌐",
    tagline: "Ship real products end to end.",
    live: false,
    accent: "#5ee0c8",
  },
  {
    id: "systems",
    name: "Systems & Low-Level",
    emoji: "⚙️",
    tagline: "Understand the machine underneath.",
    live: false,
    accent: "#7aa2ff",
  },
  {
    id: "data-ml",
    name: "Data & ML",
    emoji: "📊",
    tagline: "Make messy data tell the truth.",
    live: false,
    accent: "#f472b6",
  },
  {
    id: "mobile",
    name: "Mobile",
    emoji: "📱",
    tagline: "Apps people carry everywhere.",
    live: false,
    accent: "#a78bfa",
  },
  {
    id: "devops",
    name: "DevOps & Cloud",
    emoji: "☁️",
    tagline: "Ship it, scale it, keep it alive.",
    live: false,
    accent: "#34d399",
  },
];

export const TRACK_BY_ID: Record<string, Track> = Object.fromEntries(
  TRACKS.map((t) => [t.id, t])
);

/**
 * The v1 "golden branch" of the AI/LLM engineering map.
 * Five fully-authored nodes + a ring of coming-soon stars so the
 * larger territory is visible. Adding content = editing this array.
 */
export const NODES: SkillNode[] = [
  {
    id: "llm-basics",
    title: "LLM Basics",
    emoji: "🧠",
    hook: "An LLM is a next-word predictor that got so good at guessing it started to reason.",
    blurb:
      "A large language model reads everything before the cursor and assigns a probability to every possible next token. That's the whole trick. Scale that up across the internet and the 'best guess' becomes summarizing, translating, coding, arguing. You don't need to know how the math trains — you need to know it's a probability machine you steer with context.",
    visual: "token-stream",
    prereqs: [],
    related: [{ to: "tokens-embeddings", relation: "leads to" }],
    build: {
      prompt:
        "Feed it a prompt and watch the model rank what comes next. Change the prompt — see the probabilities shift.",
      done: "You just saw a model 'think' — it's ranked guesses, all the way down.",
    },
    mission: {
      task: "Write ~20 lines that call any LLM API and print its top-5 next-word guesses for a prompt you type in.",
      level: "warm-up",
      repos: [
        { label: "karpathy/nanoGPT", url: "https://github.com/karpathy/nanoGPT", note: "build a tiny GPT and see the guts" },
        { label: "rasbt/LLMs-from-scratch", url: "https://github.com/rasbt/LLMs-from-scratch", note: "an LLM, one chapter at a time" },
      ],
    },
    references: [
      { label: "Karpathy — Intro to LLMs (1hr)", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g", kind: "video" },
      { label: "The Illustrated GPT-2 — Jay Alammar", url: "https://jalammar.github.io/illustrated-gpt2/", kind: "article" },
    ],
    deeper: ["Sampling & temperature", "Context windows", "Why models hallucinate"],
    x: 18,
    y: 70,
  },
  {
    id: "tokens-embeddings",
    title: "Tokens & Embeddings",
    emoji: "🧭",
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
    mission: {
      task: "Embed 10 sentences, then find the two most similar to each other using cosine similarity.",
      level: "warm-up",
      repos: [
        { label: "UKPLab/sentence-transformers", url: "https://github.com/UKPLab/sentence-transformers", note: "embeddings in 3 lines" },
      ],
    },
    references: [
      { label: "The Illustrated Word2Vec — Jay Alammar", url: "https://jalammar.github.io/illustrated-word2vec/", kind: "article" },
      { label: "OpenAI — Embeddings guide", url: "https://platform.openai.com/docs/guides/embeddings", kind: "docs" },
    ],
    deeper: ["Tokenization (BPE)", "Cosine similarity", "Embedding models"],
    x: 38,
    y: 44,
  },
  {
    id: "vector-dbs",
    title: "Vector DBs",
    emoji: "🗄️",
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
    mission: {
      task: "Stash 100 embeddings in a vector DB and pull back the 5 nearest to a query you write.",
      level: "real",
      repos: [
        { label: "chroma-core/chroma", url: "https://github.com/chroma-core/chroma", note: "the easiest local vector DB" },
        { label: "qdrant/qdrant", url: "https://github.com/qdrant/qdrant", note: "fast, production-grade" },
      ],
    },
    references: [
      { label: "Pinecone — what is a vector DB", url: "https://www.pinecone.io/learn/vector-database/", kind: "article" },
      { label: "Chroma — getting started", url: "https://docs.trychroma.com/getting-started", kind: "docs" },
    ],
    deeper: ["ANN indexes (HNSW)", "Metadata filtering", "Hybrid search"],
    x: 60,
    y: 30,
  },
  {
    id: "rag",
    title: "RAG",
    emoji: "📚",
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
    mission: {
      task: "Build 'chat with your PDF' — drop in a document and answer questions using only what's inside it.",
      level: "real",
      repos: [
        { label: "langchain-ai/langchain", url: "https://github.com/langchain-ai/langchain", note: "batteries-included RAG" },
        { label: "run-llama/llama_index", url: "https://github.com/run-llama/llama_index", note: "data framework for RAG" },
      ],
    },
    references: [
      { label: "Anthropic — Contextual Retrieval", url: "https://www.anthropic.com/news/contextual-retrieval", kind: "article" },
      { label: "LangChain — RAG tutorial", url: "https://python.langchain.com/docs/tutorials/rag/", kind: "docs" },
    ],
    deeper: ["Re-ranking", "Chunking strategies", "Citations & grounding"],
    x: 80,
    y: 52,
  },
  {
    id: "agents",
    title: "Agents",
    emoji: "🤖",
    hook: "An agent is an LLM in a loop with tools — it can act, see the result, and try again.",
    blurb:
      "Instead of answering once, an agent thinks, picks a tool (search, code, an API), runs it, observes the result, and decides the next step — looping until the job is done. RAG gives a model knowledge; tools give it hands. The loop is the whole idea: reason, act, observe, repeat.",
    visual: "agent-loop",
    prereqs: ["rag"],
    related: [{ to: "rag", relation: "builds on" }],
    build: {
      prompt:
        "Give the agent a goal and step the loop: it reasons, calls a tool, observes, and decides again.",
      done: "Think → act → observe → repeat. That loop is what turns a chatbot into a worker.",
    },
    mission: {
      task: "Build an agent that can search the web AND do math to answer one tricky multi-step question.",
      level: "spicy",
      repos: [
        { label: "langchain-ai/langgraph", url: "https://github.com/langchain-ai/langgraph", note: "build stateful agent loops" },
        { label: "microsoft/autogen", url: "https://github.com/microsoft/autogen", note: "multi-agent framework" },
      ],
    },
    references: [
      { label: "Anthropic — Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents", kind: "article" },
      { label: "ReAct: reason + act (paper)", url: "https://arxiv.org/abs/2210.03629", kind: "paper" },
    ],
    deeper: ["Tool / function calling", "Planning & ReAct", "Multi-agent systems"],
    x: 90,
    y: 26,
  },

  // --- Coming-soon stars: visible territory, not authored in v1 ---
  { id: "prompt-eng", title: "Prompt Engineering", emoji: "✍️", hook: "", blurb: "", visual: "none", prereqs: ["llm-basics"], related: [], build: { prompt: "", done: "" }, x: 26, y: 90, comingSoon: true },
  { id: "fine-tuning", title: "Fine-tuning", emoji: "🎛️", hook: "", blurb: "", visual: "none", prereqs: ["rag"], related: [], build: { prompt: "", done: "" }, x: 70, y: 78, comingSoon: true },
  { id: "evals", title: "Evals", emoji: "📏", hook: "", blurb: "", visual: "none", prereqs: ["rag"], related: [], build: { prompt: "", done: "" }, x: 58, y: 68, comingSoon: true },
  { id: "guardrails", title: "Guardrails", emoji: "🛡️", hook: "", blurb: "", visual: "none", prereqs: ["agents"], related: [], build: { prompt: "", done: "" }, x: 96, y: 56, comingSoon: true },
];

/**
 * "Go deeper" child nodes. These never appear as stars on the main constellation —
 * they're reached by zooming into a parent node's panel. Proves the depth-via-zoom
 * model: the map is fractal, not five flat cards.
 */
export const CHILD_NODES: SkillNode[] = [
  {
    id: "chunking",
    title: "Chunking Strategies",
    emoji: "🔪",
    hook: "How you slice your docs decides what the AI can ever find. It's the quietest make-or-break in RAG.",
    blurb:
      "Before anything gets embedded, your documents are split into chunks — and each chunk becomes one searchable unit. Split too coarsely and a single chunk mixes unrelated ideas, so retrieval drags in noise. Split too finely and chunks lose the context that made them meaningful. Splitting on natural boundaries (sentences, paragraphs) usually beats blind fixed-size windows.",
    visual: "chunking",
    prereqs: [],
    parent: "rag",
    related: [{ to: "rag", relation: "part of" }],
    build: {
      prompt:
        "Switch between fixed-size and by-sentence splitting, and drag the chunk size. Watch the same doc become a different set of searchable units.",
      done: "You felt the trade-off: chunk boundaries shape everything downstream.",
    },
    mission: {
      task: "Chunk one long doc three ways (fixed, sentence, paragraph) and eyeball which one retrieves best.",
      level: "warm-up",
      repos: [
        { label: "langchain-ai/langchain", url: "https://github.com/langchain-ai/langchain", note: "text splitters built in" },
      ],
    },
    references: [
      { label: "Pinecone — chunking strategies", url: "https://www.pinecone.io/learn/chunking-strategies/", kind: "article" },
    ],
    x: 0,
    y: 0,
  },
  {
    id: "reranking",
    title: "Re-ranking",
    emoji: "🏅",
    hook: "First retrieval is fast but sloppy. A re-ranker reads each result properly and shoves the best one to the top.",
    blurb:
      "Vector search is quick but approximate — it can rank a so-so chunk above the perfect one. A re-ranker (a smarter, slower cross-encoder) re-scores the top candidates by actually comparing each one to the query, then reorders. The move: retrieve 20 cheaply, re-rank down to the best 3. Quality jumps, cost stays sane.",
    visual: "reranking",
    prereqs: [],
    parent: "rag",
    related: [{ to: "rag", relation: "part of" }],
    build: {
      prompt:
        "Run the first (vector) retrieval, then hit re-rank and watch the truly-relevant chunk climb to #1.",
      done: "You saw why retrieve-then-rerank beats raw vector search.",
    },
    mission: {
      task: "Add a re-ranker on top of a RAG app and measure the answer-quality bump.",
      level: "real",
      repos: [
        { label: "FlagOpen/FlagEmbedding", url: "https://github.com/FlagOpen/FlagEmbedding", note: "BGE embeddings + rerankers" },
      ],
    },
    references: [
      { label: "Pinecone — rerankers", url: "https://www.pinecone.io/learn/series/rag/rerankers/", kind: "article" },
    ],
    x: 0,
    y: 0,
  },
  {
    id: "hybrid-search",
    title: "Hybrid Search",
    emoji: "🔀",
    hook: "Keyword search nails exact terms; semantic search gets meaning. Hybrid runs both so nothing slips through.",
    blurb:
      "Pure vector search can miss an exact code, name, or acronym; pure keyword search misses paraphrases. Hybrid search runs keyword (BM25) and semantic (vector) together and fuses the rankings — so a query like 'M1 battery' finds both the literal match and the doc that only says 'Apple Silicon power draw'.",
    visual: "hybrid-search",
    prereqs: [],
    parent: "rag",
    related: [{ to: "rag", relation: "part of" }],
    build: {
      prompt:
        "Toggle keyword-only, semantic-only, and hybrid for the same query — watch what each mode misses.",
      done: "You saw why production search is almost always hybrid.",
    },
    mission: {
      task: "Build a search that fuses BM25 + vectors and beats either one alone on your own docs.",
      level: "spicy",
      repos: [
        { label: "qdrant/qdrant", url: "https://github.com/qdrant/qdrant", note: "native hybrid search" },
      ],
    },
    references: [
      { label: "Qdrant — hybrid search", url: "https://qdrant.tech/articles/hybrid-search/", kind: "article" },
    ],
    x: 0,
    y: 0,
  },
];

export const NODE_BY_ID: Record<string, SkillNode> = Object.fromEntries(
  [...NODES, ...CHILD_NODES].map((n) => [n.id, n])
);

/** Children nested under a given parent node, in declaration order. */
export function childrenOf(parentId: string): SkillNode[] {
  return CHILD_NODES.filter((c) => c.parent === parentId);
}

/** Edges to draw on the constellation, derived from prereqs. */
export const EDGES: Array<{ from: string; to: string }> = NODES.flatMap((n) =>
  n.prereqs.map((p) => ({ from: p, to: n.id }))
);
