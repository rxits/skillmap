"use client";

import { CHILD_NODES, NODE_BY_ID, NODES } from "./content";
import { NodeState } from "./types";

const KEY = "skillmap.progress.v1";

export interface Progress {
  mastered: string[];
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return { mastered: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { mastered: [] };
    const parsed = JSON.parse(raw) as Progress;
    return { mastered: Array.isArray(parsed.mastered) ? parsed.mastered : [] };
  } catch {
    return { mastered: [] };
  }
}

export function saveProgress(p: Progress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

/** A node is available when every prereq is mastered (root nodes are always available). */
export function stateFor(nodeId: string, mastered: Set<string>): NodeState {
  if (mastered.has(nodeId)) return "mastered";
  const node = NODE_BY_ID[nodeId];
  if (!node) return "locked";
  if (node.comingSoon) return "locked";
  const unlocked = node.prereqs.every((p) => mastered.has(p));
  return unlocked ? "available" : "locked";
}

/** XP model: 100 XP per mastered main node, 50 XP per mastered deep-dive child. */
export function xpFor(mastered: Set<string>): number {
  const main = NODES.filter((n) => !n.comingSoon && mastered.has(n.id)).length * 100;
  const deep = CHILD_NODES.filter((n) => !n.comingSoon && mastered.has(n.id)).length * 50;
  return main + deep;
}

export const TOTAL_AUTHORED = NODES.filter((n) => !n.comingSoon).length;
