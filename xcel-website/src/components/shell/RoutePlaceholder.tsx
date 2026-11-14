/* TEMPORARY route placeholder (Stage 2). Keeps the future route structure and the header, footer
   and chat working on every path without designing the pages. Each page file renders this and
   nothing else; replace the file's contents when the real page is built. */
import s from "./RoutePlaceholder.module.css";

export default function RoutePlaceholder({ title, path }: { title: string; path: string }) {
  return (
    <main className={s.page} data-placeholder>
      <p className={`type-caps ${s.tag}`}>Temporary placeholder</p>
      <h1 className={`type-display ${s.title}`}>{title}</h1>
      <p className={s.note}>
        This page has not been built yet. This route ({path}) is reserved for it.
      </p>
    </main>
  );
}
