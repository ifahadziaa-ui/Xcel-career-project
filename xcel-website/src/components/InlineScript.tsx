"use client";

/* An inline script that runs once, as soon as the server HTML has been parsed and before the page's own scripts
   start the app. It is a module script, so it does not hold up parsing or the first paint (a plain inline script
   here pushed the home page's first paint back by about 2 s on a throttled phone). On the client it renders as
   inert text/plain, so React neither runs it again nor warns about a script tag (the pattern in Next's
   "Preventing flash before hydration" guide). */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "module" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
