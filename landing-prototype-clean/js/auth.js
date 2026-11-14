/* =====================================================================
   CANDIDATE ACCOUNTS: PROTOTYPE ONLY.
   Nothing here is real authentication. Accounts, saved jobs and applications
   live in this browser's localStorage so the screens can be shown and
   clicked through. "Continue with Google" creates a demo account without
   contacting Google. A production build needs a server, a real identity
   provider (Google OAuth client ID and secret) and secure sessions.
   Employers do not get accounts: they use the staffing request form.
   ===================================================================== */
const KEY = "xc-proto-account";
const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
};
const write = (v) => {
  try { v ? localStorage.setItem(KEY, JSON.stringify(v)) : localStorage.removeItem(KEY); } catch { /* storage blocked: stays signed out */ }
  dispatchEvent(new CustomEvent("xc-account"));
};

export const currentUser = () => read();

export function signUp({ name, email, provider = "email" }) {
  const user = { name: name || email.split("@")[0], email, provider, phone: "", location: "", field: "", credential: "", resume: "", saved: [], applied: [], created: Date.now() };
  write(user);
  return user;
}

// prototype: any email + password signs in; the name is kept if the account exists in this browser
export function signIn({ email }) {
  const u = read();
  if (u && u.email === email) return u;
  return signUp({ email });
}

export function signInWithGoogle() {
  return signUp({ name: "Demo Candidate", email: "demo.candidate@gmail.com", provider: "google" });
}

export const signOut = () => write(null);

export function update(patch) {
  const u = read();
  if (!u) return null;
  const next = { ...u, ...patch };
  write(next);
  return next;
}

export function toggleSaved(id) {
  const u = read();
  if (!u) return null;
  const saved = u.saved.includes(id) ? u.saved.filter((x) => x !== id) : [...u.saved, id];
  return update({ saved });
}

export function recordApplication(id) {
  const u = read();
  if (!u || u.applied.some((a) => a.id === id)) return u;
  return update({ applied: [...u.applied, { id, at: Date.now() }] });
}
