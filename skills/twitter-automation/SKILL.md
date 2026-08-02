---
name: twitter-automation
description: "Build and run Twitter/X automations end-to-end — the user describes what they want in plain English and this skill designs it, prices it, and wires it up from twitr.sh primitives. Capabilities: post tweets, reply, quote, post with media (images/video/GIF), like, retweet, follow, unfollow, send DMs, delete tweets, download media from any tweet, AI tweet drafting, real-time monitors on accounts or keywords, webhook event delivery to your own endpoint, scheduled posting via agent cron. Use for: social media automation, content scheduling, engagement bots, auto-reply bots, mention alerts, audience growth, X API alternative. Triggers: twitter api, x api, tweet automation, post to twitter, twitter bot, social media automation, x automation, tweet scheduler, twitter integration, post tweet, twitter post, x post, send tweet, twitter dm, follow users, auto-reply bot, reply to mentions automatically, twitter webhook, watch a twitter account, twitter monitoring, engagement bot. No X developer account, no API keys, no OAuth, no signup — the agent's wallet pays per call in USDC (x402 on Base/Solana, MPP on Tempo)."
license: MIT
compatibility: Requires network access and an x402/MPP payment client (AgentCash MCP recommended). Publishing and engagement need a connected X account (one-time, user signs in themselves). Webhook delivery needs a public HTTPS endpoint; scheduling runs on the agent's own cron. No API key or signup.
metadata:
  author: twitr.sh
  version: "1.0"
---

# Twitter/X Automation

Automate X/Twitter via [twitr.sh](https://twitr.sh) — no developer account, no API keys, no
OAuth app review. Every paid call is one POST to `https://twitr.sh/api/tools/{tool}`; the
first call returns HTTP 402 with the exact price, your wallet pays in USDC, the retry runs.
Failed calls are never charged.

## How to use this skill — you are the automation builder

The user states an outcome ("reply to anyone who mentions my brand", "post my changelog every
morning", "alert me when a competitor tweets"). Your job:

1. **Design** — compose the automation from the recipe table below.
2. **Price** — state the total running cost BEFORE spending: monitor $/day + per-action price
   (always shown in the 402 before you commit).
3. **Wire it up** — connect account (if writing), create the monitor, register the webhook or
   plan the polling, then run the action loop.
4. **Confirm with the user** before creating a monitor or posting as their account. Always.

### Recipe table — intent → wiring

| User wants | Wiring | Running cost |
|---|---|---|
| Auto-reply to mentions | connect account → `x_monitor` on `"query": "@handle"` → webhook `tweet.mention` → `x_compose` draft → `x_write` reply | ~$0.61/day + ~$0.04/reply |
| Scheduled posting / "tweet daily" | agent-side cron (Claude Code routine, OpenClaw cron) → `x_compose` → `x_write` post | ~$0.037/post |
| Watch an account or topic, get alerted | `x_monitor` (account or keyword) → poll events free, or webhook to your endpoint | ~$0.61/day |
| Repost / mirror media | `x_read` download-media → `x_write` upload_media → `x_write` post with `media_ids` | ~$0.05/post |
| Engagement (like/retweet/follow on a topic) | `x_monitor` keyword → `x_write` like / retweet / follow | ~$0.61/day + ~$0.012/action |
| DM new engagers | `x_timeline` engagement lists or monitor events → `x_write` send_dm | per item + ~$0.036/DM |
| One-off post / reply / thread | `x_compose` → `x_write` | ~$0.037 |

Automations that publish or engage should stay useful, not spammy — X suspends accounts for
aggressive follow/like churn and unsolicited DM blasts. Keep volumes human-scale and tell the
user when a design risks their account.

## Quick start

Use AgentCash MCP — it handles the 402, payment, and retry automatically:

```
mcp__agentcash__fetch({
  url: "https://twitr.sh/api/tools/x_write",
  method: "POST",
  headers: { "Idempotency-Key": "<uuid>" },
  body: { "action": "post", "account": "myhandle", "text": "Hello from my agent 🤖" }
})
```

AgentCash surfaces the 402 body BEFORE signing — read `amount` and confirm with the user when
the price is non-trivial (~$0.10+).

Without AgentCash: any x402/MPP client works. Discovery: `https://twitr.sh/openapi.json`,
`/.well-known/x402`, `/.well-known/mpp.json`.

## Actions

All writes go to `POST /api/tools/x_write` with a mandatory `Idempotency-Key` header and a
connected `account`:

| Action | Input | Price |
|---|---|---|
| `post` | `text` (+ optional `media_ids`) | ~$0.036 |
| `reply` | `text` + `reply_to_tweet_id` | ~$0.036 |
| `like` / `unlike` | `target_tweet_id` | ~$0.012 |
| `retweet` / `unretweet` | `target_tweet_id` | ~$0.012 |
| `follow` / `unfollow` | `target_user_id` (numeric — get it from `x_read` get-user) | ~$0.012 |
| `send_dm` | `target_user_id` + `text` | ~$0.036 |
| `delete_tweet` | `target_tweet_id` | ~$0.012 |
| `remove_follower` | `target_user_id` | ~$0.012 |
| `upload_media` | `media_url` (public URL) → returns `media_id` | ~$0.012 |

Reads that pair with automation:

| Tool | What | 
|---|---|
| `x_read` | Get a tweet, profile, batch (≤100), or **download-media** from a tweet (returns download URLs) |
| `x_compose` | AI drafting: generate → refine → score tweet text (~$0.001, posts nothing) |
| `x_search` / `x_timeline` | Search tweets/users, timelines, engagement lists (`resultsLimit` required, billed per item) |

A 202 `{"status":"pending_confirmation","action_id":"..."}` means the write was accepted and
is being applied — **do NOT resend** (it's already paid). Retrying with the same
`Idempotency-Key` replays the original result instead of double-posting.

## Connect an X account (one-time, free)

**Never ask the user for their X password, email, or 2FA secret — never accept one if
offered.** The connect flow keeps credentials out of your context entirely:

1. `POST /api/x-accounts/start` `{ "username": "myhandle" }` → `{connect_url, expires_in}`.
2. Show the user `connect_url`: *open this in your browser and sign in to X there.* The link
   is single-use and expires in 15 minutes.
3. Poll `GET /api/x-accounts` (free, SIWX) until the handle shows `linked`.

One X handle belongs to exactly ONE wallet; ownership is re-checked server-side on every
write. Disconnect: `DELETE /api/x-accounts/{handle}`.

## Real-time triggers — monitors + webhooks

Monitors are prepaid by the hour (~$0.025/hr, 24h ≈ $0.61; max 168h per purchase). They stop
at `expires_at` unless extended; early deletion does not refund. Pay on Base (x402) or Tempo
(MPP) — Solana is not offered for monitors. `Idempotency-Key` required on create.

```
POST /api/tools/x_monitor  { "action": "create", "username": "vercel", "hours": 24 }
POST /api/tools/x_monitor  { "action": "create", "query": "\"launch week\"", "hours": 24 }
POST /api/tools/x_monitor  { "action": "extend", "monitorId": "mn_...", "hours": 48 }
```

Event types: `tweet.new`, `tweet.reply`, `tweet.retweet`, `tweet.quote`, `tweet.media`,
`tweet.link`, `tweet.mention`, `tweet.hashtag`, `tweet.longform`, and (account monitors)
`profile.*.changed`. A terminal `monitor.expired` / `monitor.deleted` event always fires.

**Poll (free, SIWX):** `GET /api/monitors/{id}/events?after={last_event_id}&limit=50` —
strictly newer events, oldest→newest. Poll at most 1/s, ideally only when the user asks.

**Push (webhooks — free, SIWX, max 3 per wallet):**

```
POST /api/webhooks  { "url": "https://your-agent.example.com/hooks", "eventTypes": ["tweet.mention"] }
```

The 201 response contains the signing `secret` exactly once — store it. Verify every
delivery: `sha256=HMAC-SHA256(secret, "{X-Twitr-Timestamp}.{rawBody}")` against
`X-Twitr-Signature`, reject timestamps older than 5 minutes, dedupe on `delivery_id`.
Respond 2xx within 10s; retries back off over ~36 min.

## Worked example — auto-reply agent in 4 calls

1. **Connect** (free): `/api/x-accounts/start` → user opens link → `linked`.
2. **Monitor**: `x_monitor` create on `"query": "@myhandle"`, 24h (~$0.61).
3. **Listen**: `POST /api/webhooks` for `["tweet.mention"]` — or poll events when asked.
4. **React**: on each event, `x_compose` a draft (~$0.001), show the user, then `x_write`
   `{action:"reply", account, reply_to_tweet_id, text}` (~$0.036).

Total: ~$0.61/day + ~$0.04 per reply.

## Don't do

- Don't create a monitor or post as the user's account without confirming design + cost first.
- Don't skip the 402 price check — surface any non-trivial cost before signing.
- Don't resend a write after a 202 or a timeout — reuse the same `Idempotency-Key`.
- Don't auto-poll events in a loop without the user asking — burns tokens.
- Don't keep calling after 3 consecutive failures — surface the error and stop.
- Don't design spam: mass-follow/unfollow churn, unsolicited DM blasts, or reply floods get
  the user's X account suspended.

## Related skills

```sh
npx skills add lnvestor/twitr-skills
```

- `x-twitter-data` — live reads, search, timelines, trends
- `x-twitter-research` — bulk exports as downloadable datasets
- `x-twitter-monitor` — deep dive on monitors, events, and webhook verification
- `x-twitter-publish` — deep dive on drafting and publishing
- `x-presence` — unattended posting + monitoring routine for cron

## Documentation

- Agent guide: `https://twitr.sh/llms.txt`
- OpenAPI + payment discovery: `https://twitr.sh/openapi.json`
- Dashboard (browser): `https://twitr.sh/dashboard`
