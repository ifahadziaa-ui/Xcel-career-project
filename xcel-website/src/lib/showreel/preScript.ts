/**
 * Pre-hydration guard for a restored scroll position (Stage 5B-2 corrective pass).
 *
 * Problem: the server HTML can only be the opening frame (scroll progress 0). When the browser
 * restores a position inside the reel (reload, Back/Forward to a fresh document) or lands on a
 * #hash, that wrong frame is painted at the restored position until React hydrates and the
 * engine's layout effect draws the real one, which then shifts the layout.
 *
 * Fix: this script runs while the section is parsed, before the first paint of the stage. Only when
 * the navigation type is reload or back_forward, or the URL has a hash (the cases where the browser
 * may scroll before hydration), and the OS has NOT asked for reduced motion, it marks the section
 * with data-sr-pre. CSS then hides the stage's contents (visibility, the section keeps its size and
 * its graphite background); ShowreelStage removes the marker in its first layout effect, in the same
 * task as the engine's first frame, so the wrong frame is never painted. Ordinary top-of-page visits
 * ("navigate" without a hash) are untouched and still show the server-rendered opening frame.
 *
 * Failsafe: the marker also removes itself after 10 s, so a page whose JavaScript never arrives shows
 * the opening frame instead of an empty stage. Without JavaScript the script does not run at all.
 *
 * It reads no scroll position (the browser has usually not restored it yet at this point) and starts
 * no loop or listener. Plain string, no imports at run time.
 */
export const SHOWREEL_PRE_SCRIPT = `(function(){try{var s=document.currentScript&&document.currentScript.parentElement;if(!s)return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;var n=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];var t=n&&n.type;if(t==="reload"||t==="back_forward"||location.hash){s.setAttribute("data-sr-pre","");setTimeout(function(){s.removeAttribute("data-sr-pre")},10000)}}catch(e){}})()`;
