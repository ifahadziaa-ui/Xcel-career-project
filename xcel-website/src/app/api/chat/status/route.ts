// The chat runs in "guided" mode (answers from the site's own content). A live AI mode needs a server
// route that calls a model with an API key; until that is built, report it as off.
export function GET() {
  return Response.json({ ai: false });
}
