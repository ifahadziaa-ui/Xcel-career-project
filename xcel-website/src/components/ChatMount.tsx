"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* The chat on the inner pages (the home page starts its own, with its scroll controller). */
export default function ChatMount() {
  const path = usePathname();
  useEffect(() => {
    if (path === "/" || document.querySelector(".xc")) return;
    import("@/legacy/chat").then((m) => { if (!document.querySelector(".xc")) m.initChat({}); });
  }, [path]);
  return null;
}
