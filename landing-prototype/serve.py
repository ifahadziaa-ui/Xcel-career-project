"""Serve the XcelCareers prototype on http://127.0.0.1:3200 with caching off.

    python serve.py

The chatbot (XC Concierge) works with nothing else installed: it answers
from js/content.js in "guided" mode. To switch it to live Claude answers:

    pip install anthropic
    $env:ANTHROPIC_API_KEY = "sk-ant-..."      (PowerShell; or `ant auth login`)
    python serve.py

Optional settings: XC_CHAT_MODEL (default claude-opus-5-5), XC_PORT (default 3200).
The API key stays on this server; the browser only talks to /api/chat.
"""
import functools
import http.server
import json
import os
import threading

HERE = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("XC_PORT", "3200"))
MODEL = os.environ.get("XC_CHAT_MODEL", "claude-opus-5-5")
CONTENT_FILE = os.path.join(HERE, "js", "content.js")

try:
    import anthropic
except ImportError:
    anthropic = None


def make_client():
    if anthropic is None:
        return None, "anthropic package not installed (pip install anthropic)"
    try:
        return anthropic.Anthropic(), ""
    except Exception as exc:  # no credentials found, bad config, ...
        return None, f"Claude client unavailable: {exc}"


CLIENT, CLIENT_NOTE = make_client()
AI_DOWN = ""  # set after an authentication failure so the site falls back to guided mode


def ai_ready():
    return CLIENT is not None and not AI_DOWN


# ---------------------------------------------------------------------------
# System prompt: the site's own content file is the knowledge base, so the
# chatbot can never drift from what the page says. Reloaded when it changes.
# ---------------------------------------------------------------------------
PROMPT = """You are XC Concierge, the chat assistant on the XcelCareers website. XcelCareers (XC) is a healthcare staffing and government contracting company based in Dayton, Maryland. Healthcare staffing is the main focus: nurses and care staff for hospitals, clinics, long-term care, behavioral health providers and county and state health departments. Government contracting is the second line: staff augmentation, contract staffing, task orders and consulting for local, state and federal agencies and their prime contractors. IT, finance and cybersecurity specialists work across both. XC is a minority veteran-owned small business, certified in Maryland as an MBE, DBE and SBE.

You talk with three kinds of visitors: healthcare employers, government buyers and prime contractors, and job seekers in healthcare, IT, finance and cyber.

Everything you state as fact must come from the website content below. It is the site's JavaScript data file. Copy marked SAMPLE is placeholder text, so mention those details only as examples, and never repeat anything marked [CONFIRM] as fact. Don't invent openings, salaries, rates, contract numbers, customer details or promises. When the content doesn't answer a question, say you don't have that detail and point the visitor to Barry Klasson, Director of Business Development and Client Services: 240.579.0466 or bklasson@xcelcareers.com.

Licensing and certification questions from candidates get general guidance only: XC helps candidates through credentialing, licensing and clearance steps at no cost, and the state board has the final word on any specific license. Never tell someone they qualify for a license or a role.

Write the way a caring, professional recruiter talks in chat: plain English, two to four short sentences, or a short list when listing things. No headings, no slang. Use **bold** only for the one or two words that matter.

The chat window can show interface cards. Use the tools for them instead of typing the same details out:
- show_jobs when the visitor asks about open roles or jobs.
- start_talent_request when an employer, agency or prime wants to request staff. The card asks the questions itself, so don't ask about the role, requirements, headcount, timing or email in your text.
- show_contact when the visitor wants a phone number, an email, the office address, a call or a real person.
- show_certifications for certifications, set-asides, the CAGE code, UEI, NAICS codes or the capability statement.
Write one short sentence before a tool call so the visitor knows what's coming.

<website_content>
{{CONTENT}}
</website_content>"""

_prompt = {"mtime": None, "text": ""}
_prompt_lock = threading.Lock()


def system_prompt():
    mtime = os.path.getmtime(CONTENT_FILE)
    with _prompt_lock:
        if _prompt["mtime"] != mtime:
            with open(CONTENT_FILE, encoding="utf-8") as f:
                _prompt["text"] = PROMPT.replace("{{CONTENT}}", f.read())
            _prompt["mtime"] = mtime
        return _prompt["text"]


# UI tools: the browser renders the matching card. Inputs are tiny enums,
# validated below before they reach the page.
JOB_FILTERS = ["all", "healthcare", "it", "finance", "cyber", "cleared"]
REQUEST_FUNCTIONS = ["clinical", "behavioral_health", "healthcare_admin", "it_finance_cyber", "other", "unknown"]
TOOLS = [
    {
        "name": "show_jobs",
        "description": "Show open-role cards in the chat. Use when the visitor asks about jobs or open roles.",
        "eager_input_streaming": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "function": {
                    "type": "string",
                    "enum": JOB_FILTERS,
                    "description": "Which roles to show. 'cleared' means roles that need a security clearance.",
                }
            },
            "required": ["function"],
            "additionalProperties": False,
        },
    },
    {
        "name": "start_talent_request",
        "description": "Open the staffing-request card, which collects the type of staff, what the role requires (license, certification or clearance), headcount, start date and the requester's email. Use when an employer, agency or prime wants staff.",
        "eager_input_streaming": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "function": {
                    "type": "string",
                    "enum": REQUEST_FUNCTIONS,
                    "description": "The kind of staff the visitor mentioned: clinical (nursing and care), behavioral_health (behavioral health and social services), healthcare_admin (healthcare admin and billing), it_finance_cyber, other, or unknown.",
                }
            },
            "required": ["function"],
            "additionalProperties": False,
        },
    },
    {
        "name": "show_contact",
        "description": "Show the contact card for Barry Klasson in client services: phone, email and office address.",
        "eager_input_streaming": True,
        "input_schema": {"type": "object", "properties": {}, "additionalProperties": False},
    },
    {
        "name": "show_certifications",
        "description": "Show the certification badges (Maryland MBE, DBE, SBE) with the CAGE code, UEI, NAICS codes and the capability statement download.",
        "eager_input_streaming": True,
        "input_schema": {"type": "object", "properties": {}, "additionalProperties": False},
    },
]
ALLOWED = {
    "show_jobs": {"function": (JOB_FILTERS, "all")},
    "start_talent_request": {"function": (REQUEST_FUNCTIONS, "unknown")},
    "show_contact": {},
    "show_certifications": {},
}


def clean_action(block):
    spec = ALLOWED.get(block.name)
    raw = block.input if isinstance(block.input, dict) else None
    if spec is None or raw is None:
        return None
    out = {}
    for key, (choices, default) in spec.items():
        value = raw.get(key)
        out[key] = value if value in choices else default
    return {"name": block.name, "input": out}


def clean_messages(raw):
    """Keep the last 24 well-formed turns; the conversation must start and end with the visitor."""
    if not isinstance(raw, list):
        return []
    out = []
    for m in raw[-24:]:
        if not isinstance(m, dict):
            continue
        role, content = m.get("role"), m.get("content")
        if role not in ("user", "assistant") or not isinstance(content, str):
            continue
        content = content.strip()[:4000]
        if content:
            out.append({"role": role, "content": content})
    while out and out[0]["role"] != "user":
        out.pop(0)
    if not out or out[-1]["role"] != "user":
        return []
    return out


def stream_reply(messages, send):
    """Stream one assistant turn to the browser as NDJSON events."""
    global AI_DOWN
    try:
        with CLIENT.beta.messages.stream(
            model=MODEL,
            max_tokens=16000,
            system=[{"type": "text", "text": system_prompt(), "cache_control": {"type": "ephemeral"}}],
            tools=TOOLS,
            messages=messages,
            output_config={"effort": "low"},  # short chat answers; keeps replies quick
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",  # a declined request is retried on Anthropic's recommended model
        ) as stream:
            for event in stream:
                if event.type == "text":
                    send({"type": "text", "text": event.text})
            final = stream.get_final_message()
    except ValueError:
        # tool input JSON the SDK could not parse (eager input streaming); answer from the site instead
        send({"type": "error", "code": "tool_json"})
        return
    except (anthropic.AuthenticationError, anthropic.PermissionDeniedError):
        AI_DOWN = "authentication failed"
        send({"type": "error", "code": "auth"})
        return
    except anthropic.RateLimitError:
        send({"type": "error", "code": "busy"})
        return
    except anthropic.APIStatusError as exc:
        send({"type": "error", "code": "api", "status": exc.status_code})
        return
    except anthropic.APIConnectionError:
        send({"type": "error", "code": "offline"})
        return

    if final.stop_reason == "refusal":
        send({"type": "refusal"})  # the browser replaces any partial text
        return
    if final.stop_reason != "max_tokens":  # a truncated tool input is never run
        blocks = list(final.content)
        # after a mid-stream fallback, only blocks after the last fallback marker count
        start = max((i for i, b in enumerate(blocks) if b.type == "fallback"), default=-1) + 1
        for block in blocks[start:]:
            if block.type == "tool_use":
                action = clean_action(block)
                if action:
                    send({"type": "action", **action})
    send({"type": "done"})


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_json(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def same_origin(self):
        origin = self.headers.get("Origin")
        return origin is None or origin == f"http://{self.headers.get('Host', '')}"

    def do_GET(self):
        if self.path.split("?")[0] == "/api/chat/status":
            ready = ai_ready()
            return self.send_json(200, {"ai": ready, "model": MODEL if ready else None, "note": AI_DOWN or CLIENT_NOTE})
        return super().do_GET()

    def do_POST(self):
        if self.path.split("?")[0] != "/api/chat":
            return self.send_json(404, {"error": "not found"})
        if not self.same_origin():
            return self.send_json(403, {"error": "cross-origin requests are not allowed"})
        if not ai_ready():
            return self.send_json(503, {"error": "AI unavailable", "note": AI_DOWN or CLIENT_NOTE})
        try:
            length = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            length = 0
        if length <= 0 or length > 64_000:
            return self.send_json(413, {"error": "bad request size"})
        try:
            body = json.loads(self.rfile.read(length))
        except (ValueError, UnicodeDecodeError):
            return self.send_json(400, {"error": "invalid JSON"})
        messages = clean_messages(body.get("messages") if isinstance(body, dict) else None)
        if not messages:
            return self.send_json(400, {"error": "no usable messages"})

        self.send_response(200)
        self.send_header("Content-Type", "application/x-ndjson; charset=utf-8")
        self.end_headers()

        def send(obj):
            self.wfile.write((json.dumps(obj) + "\n").encode())
            self.wfile.flush()

        try:
            stream_reply(messages, send)
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            pass  # the visitor closed the chat mid-answer


if __name__ == "__main__":
    handler = functools.partial(Handler, directory=HERE)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    server.daemon_threads = True
    print(f"Prototype: http://127.0.0.1:{PORT}  (Ctrl+C to stop)")
    print(f"Chatbot:   {'live Claude (' + MODEL + ')' if ai_ready() else 'guided mode, ' + CLIENT_NOTE}", flush=True)
    server.serve_forever()
