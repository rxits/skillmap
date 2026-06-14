import { NextRequest } from "next/server";

export const runtime = "edge";

const MODEL = "gemini-2.0-flash";

interface TutorBody {
  message: string;
  nodeTitle?: string;
  nodeHook?: string;
  history?: { role: "user" | "model"; text: string }[];
}

export async function POST(req: NextRequest) {
  let body: TutorBody;
  try {
    body = (await req.json()) as TutorBody;
  } catch {
    return Response.json({ error: "bad request" }, { status: 400 });
  }

  const key = process.env.GEMINI_API_KEY;

  // Graceful offline fallback so the UI is fully usable without a key.
  if (!key) {
    return Response.json({
      reply: offlineReply(body),
      offline: true,
    });
  }

  const system = `You are the SkillMap tutor — a sharp, warm guide for someone learning AI/LLM engineering by exploring a visual map. The learner is currently on the node "${body.nodeTitle ?? "the map"}"${body.nodeHook ? ` ("${body.nodeHook}")` : ""}. Explain in plain language, no needless jargon, use a vivid analogy when it helps, and keep answers short (2-4 sentences) unless asked to go deep. The philosophy: understand how the pieces connect and start building — don't drown in theory.`;

  const contents = [
    ...(body.history ?? []).map((h) => ({
      role: h.role,
      parts: [{ text: h.text }],
    })),
    { role: "user", parts: [{ text: body.message }] },
  ];

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
        }),
      }
    );

    if (!res.ok) {
      return Response.json({ reply: offlineReply(body), offline: true });
    }
    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? offlineReply(body);
    return Response.json({ reply });
  } catch {
    return Response.json({ reply: offlineReply(body), offline: true });
  }
}

function offlineReply(body: TutorBody): string {
  const where = body.nodeTitle ? ` about **${body.nodeTitle}**` : "";
  return `I'm running without an AI key right now, so I can't answer freely${where} yet. (Set \`GEMINI_API_KEY\` to switch me on.) Meanwhile, try the interactive visual on this node — poke it, change the inputs, and watch what moves. That's where the real intuition comes from.`;
}
