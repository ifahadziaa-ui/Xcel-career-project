"use client";

import { useSyncExternalStore } from "react";
import { isPaused, onPauseChange } from "./motion";

/**
 * true while animations are paused. During server render and hydration it is false
 * (the value the server rendered); it then follows the real state.
 * For anything that must look right on the very first paint, style it from
 * html[data-motion="paused"] in CSS instead: the inline script sets that before paint.
 */
export function useMotionPaused(): boolean {
  return useSyncExternalStore(onPauseChange, isPaused, () => false);
}
