"use client";

/* =====================================================================
   Chat: the guided "XC Concierge" chatbot, on every route (one instance, in the root layout).

   Frontend-only port of landing-prototype-clean/js/chat.js:
   - same launcher, panel, welcome, cards, chips, request flow and wording
     (answers come from brain.ts, which reads the Stage 1 content module);
   - nothing is sent anywhere: the request flow ends in a "Request summary · Not sent yet"
     card that links to the contact route with the details in the query string;
   - NOT ported: the optional live AI mode (/api/chat), generated ticket ids, any claim that a
     person is online or that a reply time is promised.

   React owns the markup and state. Imperative code is limited to what must run per frame or
   per scroll, and sits in effects that clean up after themselves:
   - the launcher and panel springs write opacity and transform to refs;
   - one scroll/resize listener decides when the launcher is visible and whether it is compact;
   - the phone sheet takes the scroll lock only while it is open.
   Under Cache Components / Activity an effect cleanup can mean "hidden", not "gone": every
   effect here is re-runnable and idempotent, and the component lives in the layout.

   Page contract (elements a page can mark; none are required):
   - [data-chat-hero]: the launcher stays hidden while it is on screen (the hero owns that corner);
   - [data-chat-reel]: the launcher shrinks to its orb while it is on screen (the showreel).
   ===================================================================== */
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CERTS, CONTACT, CREDENTIALS, CUSTOMERS, STEPS, STICKERS } from "@/content/content";
import { routeFor } from "@/content/routes";
import { reduced, spring, type Spring } from "@/lib/motion/spring";
import { lockScroll, unlockScroll } from "@/lib/scroll/lenis";
import { CHIP, FLOW, FLOW_FN, START, TEL, guided, replyAct, type Chip, type Part, type Reply, type SummaryData } from "./brain";
import { closeBold, md } from "./md";
import s from "./Chat.module.css";

/* the stylesheet keeps the prototype's class names; map them through the module */
const cx = (...n: Array<string | false | null | undefined>) =>
  n.filter(Boolean).map((x) => (s as Record<string, string>)[x as string] ?? x).join(" ");

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const clock = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
const PHONE_MQ = "(max-width: 639px)";
const isPhoneNow = () => window.matchMedia(PHONE_MQ).matches;
function usePhone(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(PHONE_MQ);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    isPhoneNow,
    () => false,
  );
}

/* ---------- icons ---------- */
const Mark = ({ extra }: { extra?: string }) => (
  <svg className={cx("xc-mark", extra)} aria-hidden="true">
    <use href="#i-mark" />
  </svg>
);
const stroke = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;
const IClose = () => (<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>);
const IReset = () => (<svg viewBox="0 0 16 16" aria-hidden="true" {...stroke} strokeWidth="1.5"><path d="M2.6 8.4A5.4 5.4 0 1 0 4.3 4" /><path d="M2.4 1.9v3.3h3.3" /></svg>);
const ISend = () => (<svg viewBox="0 0 16 16" aria-hidden="true" {...stroke} strokeWidth="1.8"><path d="M8 13V3.2M3.6 7.4L8 3l4.4 4.4" /></svg>);
const IArrow = () => (<svg viewBox="0 0 16 16" aria-hidden="true" {...stroke} strokeWidth="1.5"><path d="M4 12L12 4M5.6 4H12v6.4" /></svg>);
const IPhone = () => (<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><path d="M5.6 2.2l1.3 3-1.4 1.1a8 8 0 0 0 4.2 4.2l1.1-1.4 3 1.3-.4 2.4c-.1.5-.5.8-1 .8C7 13.3 2.7 9 2.4 3.6c0-.5.3-.9.8-1z" /></svg>);

/* ---------- cards ---------- */
type Row = [string, ReactNode, string?];
const Placard = ({ rows }: { rows: Row[] }) => (
  <dl className={cx("xc-placard")}>
    {rows.map(([k, v, c]) => (
      <Fragment key={k}>
        <dt>{k}</dt>
        <dd className={cx(c)}>{v}</dd>
      </Fragment>
    ))}
  </dl>
);
const tel = (t: string) => <a href={`tel:${TEL}`}>{t}</a>;

function PartView({ p }: { p: Part }) {
  const CRED = CREDENTIALS;
  switch (p.type) {
    case "jobs":
      return (
        <>
          <p className={cx("xc-card-label", "xc-mono", "xc-in")}>Example roles · {p.list.length}</p>
          <div className={cx("xc-rail", "xc-in")} data-lenis-prevent>
            {p.list.map((j) => (
              <article className={cx("xc-job")} key={j.id}>
                <div className={cx("xc-job-top")}>
                  <span className={cx("fn", "xc-mono")}>{j.fn}</span>
                  <Mark extra="mk" />
                </div>
                <h4>{j.title}</h4>
                <Placard rows={[["Location", j.where], [j.need[0], j.need[1], j.need[0] === "Clearance" ? "xc-red" : ""], ["Type", j.type]]} />
                <Link className={cx("go", "xc-mono")} href={`${routeFor("jobs.html")}#job-${j.id}`}>
                  View role <IArrow />
                </Link>
              </article>
            ))}
          </div>
        </>
      );
    case "certs":
      return (
        <>
          <div className={cx("xc-seals", "xc-in")}>
            {CERTS.map((c) => (
              <div className={cx("xc-seal")} key={c.code}>
                <span className={cx("ring")}>{c.code}</span>
                <small className={cx("xc-mono")}>{c.name}</small>
              </div>
            ))}
          </div>
          <div className={cx("xc-in")}>
            <Placard rows={[["Cert. No.", CRED.certNo], ["Since", CRED.since], ["Status", "Certified", "xc-red"]]} />
          </div>
        </>
      );
    case "capability":
      return (
        <div className={cx("xc-in")}>
          <Placard
            rows={[
              ["CAGE", CRED.cage, "xc-red"],
              ["UEI", CRED.uei],
              ["NAICS", CRED.naics.map((n) => n.code).join(" · "), "wrap"],
              ["Certified", `MD MBE · DBE · SBE · No. ${CRED.certNo}`, "wrap"],
              ["Ready to", "Contract, local to federal"],
            ]}
          />
          <div className={cx("xc-actions")}>
            <Link className={cx("xc-btn", "xc-btn--red")} href={routeFor(CRED.pdf) ?? "/capability"}>
              <IArrow />
              Capability page
            </Link>
            <a className={cx("xc-btn")} href={`tel:${TEL}`}>
              <IPhone />
              Call
            </a>
          </div>
        </div>
      );
    case "contact":
      return (
        <div className={cx("xc-in")}>
          <Placard
            rows={[
              ["Phone", tel(CONTACT.phone)],
              ["Email", <a href={`mailto:${CONTACT.email}`} key="m">{CONTACT.email}</a>],
            ]}
          />
        </div>
      );
    case "steps":
      return (
        <ol className={cx("xc-steps", "xc-in")}>
          {STEPS.map((st, i) => (
            <li key={st.title}>
              <span className={cx("n", "xc-mono")}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <b>{st.title}</b>
                <p>{st.text}</p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "customers": {
      const rank: Record<string, number> = { current: 0, past: 1, "": 2 };
      const list = CUSTOMERS.slice().sort((a, b) => rank[a.status] - rank[b.status]).slice(0, 12);
      return (
        <div className={cx("xc-names", "xc-in")}>
          {list.map((c) => (
            <span className={cx("xc-name", "xc-mono")} key={c.name}>
              {c.name}
              {c.status ? <i>{c.status}</i> : null}
            </span>
          ))}
        </div>
      );
    }
    case "stats":
      return (
        <div className={cx("xc-in")}>
          <Placard
            rows={[
              ["Experience", `${STICKERS.paper.value} years combined`],
              ["Database", `${STICKERS.accent.value} candidates`],
              ["Task order", `${STICKERS.dark.value} staffed in 45 days`, "xc-red"],
              ["DoD & IC", `${STICKERS.ring.value} placements`],
            ]}
          />
        </div>
      );
    case "summary": {
      // nothing is sent from the chat: the summary hands over to the request form, prefilled
      const d: SummaryData = p.d;
      const q = new URLSearchParams({ role: `${d.fn}; ${d.clr}; ${d.n} people; start ${d.when}`, email: d.email });
      return (
        <div className={cx("xc-ticket", "xc-in")}>
          <div className={cx("xc-ticket-top", "xc-mono")}>
            <span>Request summary</span>
            <span>Not sent yet</span>
          </div>
          <Placard rows={[["Staff", d.fn, "wrap"], ["Requires", d.clr], ["Headcount", d.n], ["Start", d.when], ["Contact", d.email]]} />
          <div className={cx("xc-actions")}>
            <Link className={cx("xc-btn", "xc-btn--red")} href={`${routeFor("contact.html")}?${q.toString()}`}>
              <IArrow />
              Continue to the request form
            </Link>
          </div>
        </div>
      );
    }
  }
}

/* ---------- conversation state ---------- */
type Item =
  | { id: number; kind: "me"; text: string }
  | { id: number; kind: "bot"; time: string; text: string; typing: boolean; streaming: boolean; parts: Part[]; chips: Chip[]; spent: boolean };

const DEFAULT_PLACEHOLDER = "Ask about staffing, jobs, licensing…";

/* initial inline styles (hidden until the springs run); constants so React never rewrites them */
const LAUNCH_INIT = { opacity: 0, visibility: "hidden", transform: "translateY(140%) scale(0.86)", pointerEvents: "none" } as const;
const PANEL_INIT = { opacity: 0, visibility: "hidden", pointerEvents: "none" } as const;

export default function Chat() {
  const pathname = usePathname();
  const phone = usePhone();
  const [open, setOpenState] = useState(false);
  const [compact, setCompact] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusyState] = useState(false);
  const [draft, setDraft] = useState("");
  const [placeholder, setPlaceholder] = useState(DEFAULT_PLACEHOLDER);
  const [inputMode, setInputMode] = useState<"text" | "email">("text");

  const rootRef = useRef<HTMLDivElement>(null);
  const launchRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const openRef = useRef(false);
  const busyRef = useRef(false);
  const aliveRef = useRef(false);
  const idRef = useRef(0);
  const flowRef = useRef<{ i: number; data: Record<string, string> } | null>(null);
  const scrollIntent = useRef<{ force?: boolean; reveal?: number }>({});
  const springs = useRef<{ show: Spring; open: Spring } | null>(null);
  const checkRef = useRef<() => void>(() => {});
  const wasOpen = useRef(false);
  const startFlowRef = useRef<(fn: string) => Promise<void>>(async () => {});

  const setOpen = useCallback((o: boolean) => {
    if (openRef.current === o) return;
    openRef.current = o;
    setOpenState(o);
  }, []);
  const setBusy = (b: boolean) => {
    busyRef.current = b;
    setBusyState(b);
  };

  /* ---------- lifetime flag (also survives Strict Mode's double mount) ---------- */
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  /* ---------- launcher visibility, open/close springs ---------- */
  useEffect(() => {
    const launch = launchRef.current!, panel = panelRef.current!;
    let shownV = 0, openV = 0, shown = false;
    const apply = () => {
      const lv = Math.max(0, shownV * (1 - Math.min(1, openV)));
      launch.style.opacity = String(lv);
      launch.style.transform = `translateY(${(1 - shownV) * 140}%) scale(${0.86 + 0.14 * (1 - Math.min(1, openV))})`;
      launch.style.visibility = lv > 0.01 ? "visible" : "hidden";
      launch.style.pointerEvents = lv > 0.6 ? "auto" : "none";
      panel.style.opacity = String(Math.min(1, openV));
      panel.style.transform = isPhoneNow()
        ? `translateY(${(1 - openV) * 100}%)`
        : `translateY(${(1 - openV) * 18}px) scale(${0.94 + 0.06 * openV})`;
      panel.style.visibility = openV > 0.005 ? "visible" : "hidden";
      panel.style.pointerEvents = openRef.current ? "auto" : "none";
    };
    const showS = spring({ from: 0, to: 0, tension: 240, friction: 26, onUpdate: (v) => { shownV = v; apply(); } });
    const openS = spring({ from: 0, to: 0, tension: 300, friction: 28, onUpdate: (v) => { openV = Math.max(0, v); apply(); } });
    springs.current = { show: showS, open: openS };
    openS.set(openRef.current ? 1 : 0);

    // hides while the page is scrolling and returns once it has been still for a moment;
    // never hidden while the chat is open or the launcher itself has keyboard focus
    let scrolling = false, idleT: ReturnType<typeof setTimeout> | undefined;
    const IDLE_MS = 1000;
    const check = () => {
      const hero = document.querySelector("[data-chat-hero]");
      const reel = document.querySelector("[data-chat-reel]");
      const heroGone = hero ? hero.getBoundingClientRect().bottom < innerHeight * 0.4 : true;
      const tr = reel?.getBoundingClientRect();
      const inReel = tr ? tr.top <= 1 && tr.bottom >= innerHeight - 1 : false;
      // the orb alone whenever the showreel is on screen: the full capsule would sit on its bottom-right pills
      const reelOn = tr ? tr.top < innerHeight && tr.bottom > 0 : false;
      setCompact((inReel || reelOn) && !openRef.current);
      const sh = openRef.current || launch.matches(":focus-visible") || (heroGone && !scrolling);
      if (sh !== shown) {
        shown = sh;
        showS.set(sh ? 1 : 0);
      }
    };
    checkRef.current = check;
    const onScroll = () => {
      scrolling = true;
      clearTimeout(idleT);
      idleT = setTimeout(() => { scrolling = false; check(); }, IDLE_MS);
      check();
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", check);
    launch.addEventListener("focus", check);
    launch.addEventListener("blur", check);
    check();

    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", check);
      launch.removeEventListener("focus", check);
      launch.removeEventListener("blur", check);
      clearTimeout(idleT);
      showS.stop();
      openS.stop();
      springs.current = null;
      checkRef.current = () => {};
    };
  }, []);

  /* ---------- open / close side effects ---------- */
  useEffect(() => {
    springs.current?.open.set(open ? 1 : 0);
    checkRef.current();
  }, [open]);

  // only the phone sheet takes over the page; the lock is counted and released by the cleanup
  useEffect(() => {
    if (!(open && phone)) return;
    lockScroll();
    return () => unlockScroll();
  }, [open, phone]);

  // focus: into the field on open (not on phones, where it would raise the keyboard);
  // back to the launcher on close, once it is visible again
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      if (isPhoneNow()) return;
      const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 160);
      return () => clearTimeout(t);
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    let tries = 0;
    let t: ReturnType<typeof setTimeout> | undefined;
    const back = () => {
      const launch = launchRef.current, panel = panelRef.current;
      if (!launch || !panel || openRef.current) return;
      const a = document.activeElement;
      // only if focus was left on the page body or inside the panel (not if the visitor moved on)
      if (a !== document.body && !panel.contains(a)) return;
      if (getComputedStyle(launch).visibility !== "hidden") {
        launch.focus({ preventScroll: true });
        return;
      }
      if (++tries < 12) t = setTimeout(back, 80);
    };
    back();
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openRef.current) setOpen(false);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [setOpen]);

  // a new route closes the panel (the prototype was a new page each time); the conversation stays
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  /* ---------- scrolling the log ---------- */
  useLayoutEffect(() => {
    const log = logRef.current;
    if (!log) return;
    const { force, reveal } = scrollIntent.current;
    scrollIntent.current = {};
    if (reveal !== undefined) {
      // once a reply is complete: scroll to its end, but never past its first line
      const m = log.querySelector<HTMLElement>(`[data-mid="${reveal}"]`);
      if (m) {
        const bottom = log.scrollHeight - log.clientHeight;
        log.scrollTo({ top: Math.min(bottom, m.offsetTop - 14), behavior: reduced() ? "auto" : "smooth" });
      }
    } else if (force || log.scrollHeight - log.scrollTop - log.clientHeight < 160) {
      log.scrollTop = log.scrollHeight;
    }
  }, [items]);

  /* ---------- conversation ---------- */
  const patch = useCallback((id: number, p: Partial<Extract<Item, { kind: "bot" }>>) => {
    setItems((prev) => prev.map((i) => (i.id === id && i.kind === "bot" ? { ...i, ...p } : i)));
  }, []);

  const typeOut = useCallback(async (id: number, text: string) => {
    if (reduced()) { patch(id, { typing: false, text }); return; }
    patch(id, { typing: false, streaming: true });
    const bits = text.split(/(\s+)/);
    let acc = "";
    for (let i = 0; i < bits.length; i++) {
      if (!aliveRef.current) return;
      acc += bits[i];
      if (i % 2 === 0) { patch(id, { text: closeBold(acc) }); await sleep(5 + Math.random() * 9); }
    }
    patch(id, { text, streaming: false });
  }, [patch]);

  const say = useCallback(async (r: Reply) => {
    const id = ++idRef.current;
    scrollIntent.current = { force: true };
    setItems((prev) => [...prev, { id, kind: "bot", time: clock(), text: "", typing: true, streaming: false, parts: [], chips: [], spent: false }]);
    await sleep(reduced() ? 0 : 220 + Math.random() * 220);
    if (!aliveRef.current) return;
    await typeOut(id, r.say);
    scrollIntent.current = { reveal: id };
    patch(id, { text: r.say, streaming: false, parts: r.parts ?? [], chips: r.flowOpts ? (r.chips ?? []) : (r.chips ?? []).slice(0, 2) });
    if (r.flow !== undefined) await startFlowRef.current(r.flow);
  }, [patch, typeOut]);

  // the staffing request: four taps and an email (mirrors the client's intake call)
  const askStep = useCallback(async (prefix = ""): Promise<void> => {
    const f = flowRef.current;
    if (!f) return;
    const st = FLOW[f.i];
    if (st.email) { setPlaceholder("you@company.com"); setInputMode("email"); }
    await say({ say: prefix + st.ask, chips: (st.opts || []).map((o) => ({ label: o })), flowOpts: true });
    if (st.email && !isPhoneNow()) inputRef.current?.focus({ preventScroll: true });
  }, [say]);
  const startFlow = useCallback(async (fn: string): Promise<void> => {
    flowRef.current = { i: 0, data: {} };
    const pre = FLOW_FN[fn];
    if (pre) { flowRef.current.data.fn = pre; flowRef.current.i = 1; }
    await askStep(pre ? `Noted: **${pre}**. ` : "");
  }, [askStep]);
  useEffect(() => {
    startFlowRef.current = startFlow;
  }, [startFlow]);

  const resetInput = () => { setPlaceholder(DEFAULT_PLACEHOLDER); setInputMode("text"); };
  const flowInput = useCallback(async (text: string) => {
    const f = flowRef.current!;
    if (/^(cancel|stop|never ?mind|quit|exit)\b/i.test(text.trim())) {
      flowRef.current = null; resetInput();
      return say({ say: "No problem, request cancelled. Anything else I can help with?", chips: [CHIP.jobs, CHIP.contact] });
    }
    const st = FLOW[f.i];
    if (st.email) {
      const v = text.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return say({ say: "That doesn't look like an email address. Try again, or type **cancel** to stop." });
      f.data.email = v;
    } else f.data[st.key] = text.trim().slice(0, 60);
    f.i += 1;
    if (f.i < FLOW.length) return askStep();
    const d = f.data as unknown as SummaryData;
    flowRef.current = null; resetInput();
    await say({
      say: `Thanks. Here's your request summary. It has not been sent from this chat: continue to the request form to send it to ${CONTACT.name}, or call **${CONTACT.phone}**.`,
      parts: [{ type: "summary", d }],
      chips: [CHIP.process, CHIP.customers],
    });
  }, [say, askStep]);

  const handleUser = useCallback(async (text: string, act?: string) => {
    if (busyRef.current || !text) return;
    setBusy(true);
    scrollIntent.current = { force: true };
    setItems((prev) => [...prev.map((i) => (i.kind === "bot" ? { ...i, spent: true } : i)), { id: ++idRef.current, kind: "me", text } as Item]);
    try {
      if (flowRef.current) await flowInput(text);
      else if (act) await say(replyAct(act) || guided(text));
      else await say(guided(text));
    } catch (e) {
      console.error(e);
    } finally {
      if (aliveRef.current) setBusy(false);
    }
  }, [flowInput, say]);

  const reset = () => {
    flowRef.current = null;
    resetInput();
    setItems([]);
    if (logRef.current) logRef.current.scrollTop = 0;
  };

  /* ---------- input ---------- */
  const autosize = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };
  const submit = () => {
    const v = draft.trim();
    if (!v || busyRef.current) return;
    setDraft("");
    requestAnimationFrame(autosize);
    void handleUser(v.slice(0, 1200));
  };

  return (
    <div className={cx("xc", open && "is-open", compact && !open && "is-compact")} ref={rootRef} data-xc-chat>
      <button
        ref={launchRef}
        className={cx("xc-launch")}
        type="button"
        aria-expanded={open}
        aria-controls="xc-panel"
        aria-label="Open chat with XcelCareers"
        style={LAUNCH_INIT}
        onClick={() => setOpen(true)}
      >
        <span className={cx("xc-launch-copy")} aria-hidden="true">
          <span className={cx("xc-launch-top", "xc-mono")}>
            <span className={cx("xc-dot", "xc-dot--pulse")} />
            Ask XcelCareers
          </span>
        </span>
        <span className={cx("xc-orb")}>
          <Mark />
        </span>
      </button>

      <section
        ref={panelRef}
        className={cx("xc-panel")}
        id="xc-panel"
        role="dialog"
        aria-label="Chat with XcelCareers"
        aria-modal={open && phone ? true : undefined}
        style={PANEL_INIT}
        data-lenis-prevent
      >
        <header className={cx("xc-head")}>
          <p className={cx("xc-brand", "xc-mono")}>
            <span>
              XcelCareers<span className={cx("xc-reg")}>®</span>
            </span>
          </p>
          {items.length > 0 && (
          <button className={cx("xc-icon")} type="button" aria-label="Start over" title="Start over" onClick={() => { if (!busyRef.current) reset(); }}>
            <IReset />
          </button>
          )}
          <button className={cx("xc-icon")} type="button" aria-label="Close chat" title="Close" onClick={() => setOpen(false)}>
            <IClose />
          </button>
        </header>
        <div className={cx("xc-log")} ref={logRef} aria-live="polite">
          <div className={cx("xc-hello")}>
            <h2 className={cx("xc-title")}>
              How can we <span className={cx("xc-accent")}>help?</span>
            </h2>
            <p className={cx("xc-lede")}>Ask about staffing, example roles or certifications.</p>
            <div className={cx("xc-starts")}>
              {START.map((x) => (
                <button type="button" className={cx("xc-start")} key={x.act} onClick={() => { if (!busyRef.current) void handleUser(x.say, x.act); }}>
                  <b>{x.b}</b>
                  <IArrow />
                </button>
              ))}
            </div>
          </div>

          {items.map((it) =>
            it.kind === "me" ? (
              <div className={cx("xc-msg", "xc-msg--me", "xc-in")} key={it.id}>
                <div className={cx("xc-bubble")}>{it.text}</div>
              </div>
            ) : (
              <div className={cx("xc-msg", "xc-msg--bot", "xc-in")} key={it.id} data-mid={it.id}>
                {it.typing ? (
                  <div className={cx("xc-text")}>
                    <span className={cx("xc-typing")} role="status" aria-label="XC is typing">
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                ) : (
                  <div className={cx("xc-text", it.streaming && "is-streaming")} dangerouslySetInnerHTML={{ __html: md(it.text) }} />
                )}
                {it.parts.map((p, k) => (
                  <PartView p={p} key={k} />
                ))}
                {it.chips.length > 0 && (
                  <div className={cx("xc-chips", "xc-in", it.spent && "is-spent")}>
                    {it.chips.map((c) => (
                      <button type="button" className={cx("xc-chip")} key={c.label} onClick={() => { if (!busyRef.current) void handleUser(c.label, c.act || undefined); }}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ),
          )}
        </div>

        <form
          className={cx("xc-compose")}
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <label className="sr-only" htmlFor="xc-input">
            Message
          </label>
          <textarea
            id="xc-input"
            ref={inputRef}
            rows={1}
            value={draft}
            placeholder={placeholder}
            enterKeyHint="send"
            inputMode={inputMode}
            onChange={(e) => { setDraft(e.target.value); requestAnimationFrame(autosize); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit();
              }
            }}
          />
          <button className={cx("xc-send")} type="submit" aria-label="Send" disabled={busy || !draft.trim()}>
            <ISend />
          </button>
        </form>
        <p className={cx("xc-fine", "xc-mono")}>
          Automated answers · Call {tel(CONTACT.phone)}
        </p>
      </section>
    </div>
  );
}

