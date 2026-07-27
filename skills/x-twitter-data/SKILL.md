---
name: x-twitter-data
description: "Read live X/Twitter data — a single tweet or profile, tweet and user search with the full operator set, user timelines, replies, quotes, followers and following, list and community contents, and trending topics. Trigger whenever the user wants information from X/Twitter: looking up a tweet or account, searching X for a topic or phrase, checking someone's followers or recent posts, reading a thread, or asking what's trending — including casual phrasings like \"what is @someone posting about\" or \"find tweets about x402\". Paid per call in USDC via twitr.sh through an x402 wallet — no API key, no signup. Do NOT trigger for posting or replying (use x-twitter-publish), for real-time watching (use x-twitter-monitor), or for large dataset exports (use x-twitter-research)."
license: MIT
compatibility: Requires network access and an x402/MPP payment client (AgentCash MCP recommended). No API key or signup.
metadata:
  author: twitr.sh
  version: "1.0"
---

# X data — reads, search, timelines

| Task | Tool |
|---|---|
| One tweet, profile, article, follow-check, trends | `POST /api/tools/x_read` |
| Search tweets or users | `POST /api/tools/x_search` |
| Timelines, follower graphs, engagement lists | `POST /api/tools/x_timeline` |
| List timelines, members, followers | `POST /api/tools/x_lists` |
| Community info, members, posts, in-community search | `POST /api/tools/x_communities` |
| Trending topics by region/category | `POST /api/tools/x_radar` |

Base URL `https://twitr.sh`. Every call is one POST. Prices are per returned item on the volume
tools, ~$0.0012 per unit, floor $0.001.

## Calling it

The first request returns **402** with the exact price; an x402 client pays and retries
automatically. With AgentCash MCP:

```
mcp__agentcash__fetch({
  url: "https://twitr.sh/api/tools/x_search",
  method: "POST",
  body: { kind: "tweets", q: "from:vercel launch", resultsLimit: 50 }
})
```

Read `amount` and `breakdown` from the 402 before signing. **Tell the user the cost for anything
non-trivial, and confirm above ~$0.10.**

## Gotchas

- **`resultsLimit` is mandatory on volume tools** (search, timelines, lists, some reads) — the
  call is rejected before charging without it. It's also the spend rail: you pay per returned
  item, so `resultsLimit: 1000` is a ~$1.20 call.
- **Failed calls are never charged.** A 4xx/5xx costs nothing, so retry freely on errors.
- **User ids are numeric, not handles.** Anything taking a user id wants the numeric form —
  get it from `x_read` `{"resource":"get-user","username":"..."}`.
- **`x_read` batch mode takes up to 100 ids** in one call, far cheaper than 100 single calls.
- **`x_radar` is priced at the floor** ($0.001), so trend checks are effectively free — use it
  before search when the question is "what's happening".

## Avoid

- Don't paginate blindly to "get everything" — set `resultsLimit` to what's actually needed.
- Don't call a read repeatedly for the same id in one session; cache it in context.
- Don't use this for datasets over a few hundred rows — `x-twitter-research` runs those async and
  returns a downloadable file instead of flooding context.

Full API: https://twitr.sh/skill.md · https://twitr.sh/docs · https://twitr.sh/openapi.json
