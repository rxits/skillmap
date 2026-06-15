"use client";

import { useEffect, useRef } from "react";
import { ChallengeProps } from "@/lib/types";

/**
 * Wires a visual's live state into the challenge layer:
 * pushes `status` text up on change, and fires `onSolved` exactly once
 * the first time `solved` flips true. No-op when no challenge is attached.
 */
export function useChallenge(
  { challenge, onSolved, onStatus }: ChallengeProps,
  solved: boolean,
  status: string
) {
  const fired = useRef(false);

  useEffect(() => {
    if (!challenge) return;
    onStatus?.(status);
  }, [challenge, status, onStatus]);

  useEffect(() => {
    if (!challenge) return;
    if (solved && !fired.current) {
      fired.current = true;
      onSolved?.();
    }
  }, [challenge, solved, onSolved]);
}
