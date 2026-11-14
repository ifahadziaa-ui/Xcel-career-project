import { MOTION_STORAGE_KEY } from "./motion";

/**
 * Pre-hydration script (Next docs: "Preventing flash before hydration").
 * Runs synchronously while the browser parses <head>, before the first paint, and sets
 * <html data-motion> from the same rules as motion.ts (system preference, then the
 * visitor's saved choice). The server renders data-motion="playing" and the layout
 * sets suppressHydrationWarning on <html>, so React keeps the value the script wrote.
 *
 * Plain string, no imports at run time: it must work with nothing else loaded.
 */
export const MOTION_INIT_SCRIPT = `(function(){var p=false;try{p=window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}try{var s=window.localStorage.getItem(${JSON.stringify(
  MOTION_STORAGE_KEY,
)});if(s==="paused")p=true;else if(s==="playing")p=false}catch(e){}document.documentElement.setAttribute("data-motion",p?"paused":"playing")})()`;
