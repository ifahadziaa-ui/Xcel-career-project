"use client";

import { useLayoutEffect } from "react";
import { startMotion } from "@/lib/motion/motion";

/**
 * Mounted once in the root layout. Renders nothing.
 * - Re-applies <html data-motion> before paint. In development React's Strict Mode remount
 *   resets <html> to the attributes it manages from JSX, which clears the value the inline
 *   script set; in production this is a no-op rewrite of the same value.
 * - Follows the system reduced-motion setting while the page is open (unless the visitor chose).
 * - Cleans up when React hides the layout (Cache Components / Activity) and starts again on show.
 */
export default function MotionSync() {
  useLayoutEffect(() => startMotion(), []);
  return null;
}
