// Search X/Twitter with the twitr.sh API (Node 18+).
// Get a key: sign in at https://twitr.sh/dashboard, top up by card, create an API key.
//   TWITR_API_KEY=tw_live_... node search-tweets.mjs "from:nasa since:2026-01-01"
const q = process.argv[2] ?? "from:nasa";
const res = await fetch("https://twitr.sh/api/tools/x_search", {
  method: "POST",
  headers: { authorization: `Bearer ${process.env.TWITR_API_KEY}`, "content-type": "application/json" },
  body: JSON.stringify({ q, queryType: "Latest", resultsLimit: 20 }),
});
if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
for (const t of (await res.json()).items) console.log(t.createdAt, "|", (t.text ?? "").replace(/\n/g, " ").slice(0, 100));
