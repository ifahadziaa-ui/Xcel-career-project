/* Three.js is loaded on demand, once, and only by a showreel that actually needs a scene (never under reduced
   motion, never for a hidden route): a dynamic import keeps it out of the initial bundle. */
import type * as THREE from "three";

export type Three = typeof THREE;

let pending: Promise<Three> | null = null;

export function loadThree(): Promise<Three> {
  // a failed import is not cached, so a later activation can try again
  pending ??= import("three").catch((e) => {
    pending = null;
    throw e;
  });
  return pending;
}
