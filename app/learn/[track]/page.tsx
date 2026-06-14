import Link from "next/link";
import MapExperience from "@/components/MapExperience";
import { TRACK_BY_ID } from "@/lib/content";

export default function TrackPage({ params }: { params: { track: string } }) {
  const track = TRACK_BY_ID[params.track];

  // Only AI/LLM engineering is authored in v1. Everything else is a teaser.
  if (!track || !track.live) {
    return (
      <main className="relative z-10 min-h-dvh flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-6">{track?.emoji ?? "🛰️"}</div>
        <h1 className="font-display text-3xl md:text-4xl">
          {track ? track.name : "Uncharted"} is still charting
        </h1>
        <p className="mt-4 text-white/50 max-w-md leading-relaxed">
          {track
            ? `"${track.tagline}" — this galaxy isn't mapped yet. The AI Engineering track is fully live, same format.`
            : "That track doesn't exist yet."}
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/learn/ai-engineering"
            className="rounded-full bg-signal text-ink-900 font-semibold px-6 py-3 shadow-glow hover:scale-105 transition"
          >
            🧠 Explore AI Engineering
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/15 text-white/70 px-6 py-3 hover:border-white/40 transition"
          >
            ← all tracks
          </Link>
        </div>
      </main>
    );
  }

  return <MapExperience trackId={track.id} />;
}
