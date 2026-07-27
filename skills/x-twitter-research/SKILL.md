---
name: x-twitter-research
description: "Export bulk X/Twitter datasets as downloadable files — follower and following lists, everyone who replied to or reposted or quoted a post, full threads, likers, mentions, user media, community members, list members, and people or tweet search results, across 23 extractors. Trigger whenever the user wants X data in bulk or as a file: exporting followers, analysing who engaged with a post, auditing an audience, building a CSV or spreadsheet of X accounts, or researching a competitor's following — including casual phrasings like \"get me everyone who follows @x\" or \"export the replies to this tweet\". Paid per returned record in USDC via twitr.sh through an x402 wallet — no API key, no signup. Do NOT trigger for small live lookups (use x-twitter-data) or for real-time watching (use x-twitter-monitor)."
license: MIT
compatibility: Requires network access and an x402/MPP payment client (AgentCash MCP recommended). Results arrive as a download URL, so large jobs need somewhere to put the file. No API key or signup.
metadata:
  author: twitr.sh
  version: "1.0"
---

# X research — bulk exports

Extractions run **asynchronously**: the call returns a claim check, you poll, and you get a
**download URL** — not inline rows. That's deliberate; a 5,000-row dataset would swamp context.

## Run one

```
POST https://twitr.sh/api/tools/x_extract
Idempotency-Key: <uuid>
{ "tool": "follower_explorer", "targetUsername": "vercel", "resultsLimit": 500 }
```

→ `{ "snapshot_id": "sd_…", "status": "pending", "status_url": "/api/snapshots/sd_…" }`

Then poll (free, wallet-signed) until ready:

```
GET https://twitr.sh/api/snapshots/sd_…
→ { "status": "ready", "record_count": 500, "download_url": "https://…" }
```

## Picking the target field

The `tool` decides which target you must supply — getting this wrong is the most common error:

| Target field | Used by |
|---|---|
| `targetUsername` | follower / following / verified-follower / post / mention / likes / media |
| `targetTweetId` | reply / repost / quote / thread / article / favoriters |
| `targetCommunityId` | community members / moderators / posts |
| `targetListId` | list members / followers |
| `targetSpaceId` | space extractors |
| `searchQuery` | `people_search`, `tweet_search_extractor` |

## Gotchas

- **`resultsLimit` is mandatory and it is the price.** Billed per returned record at ~$0.0012, so
  5,000 records ≈ $6. **Quote the cost before running, and confirm above ~$1.**
- **`article_extractor` bills 5× per record.** Budget accordingly.
- **`Idempotency-Key` is required.** Retrying without the same key starts — and charges for — a
  second job.
- **The response is a claim check, not data.** Don't try to read rows from the create response.
- **Don't poll in a tight loop.** Hand the user the `snapshot_id` and check when they ask;
  spinning burns tokens for no benefit. Large jobs take minutes.
- **When ready, the data is behind `download_url`.** Fetch and summarise, or hand over the URL —
  never paste a large dataset into context.
- **`GET /api/snapshots`** lists every dataset this wallet has paid for, so past exports are free
  to re-find.

## Avoid

- Don't export 5,000 records when 200 answers the question. Sample first, then scale.
- Don't use extractions to build a follow list — automated following is prohibited by X and
  unsupported by these skills (see `x-twitter-publish`).
- Don't re-run an export you've already paid for; check `/api/snapshots` first.

Full API: https://twitr.sh/skill.md · https://twitr.sh/docs
