---
name: x-twitter-monitor
description: Watch an X/Twitter account or keyword in real time and receive events the moment they happen — new posts, replies, reposts, quotes, mentions, and profile changes — by polling a free event feed or by registering an HMAC-signed webhook. Trigger whenever the user wants to be notified about X activity, watch or track an account or topic, get alerted on mentions, stream X events to their own endpoint, or set up webhooks for Twitter — including casual phrasings like "tell me when someone tweets about us" or "watch this account". Paid per prepaid hour in USDC via twitr.sh through an x402 wallet — no API key, no signup. Do NOT trigger for one-off searches (use x-twitter-data) or for posting (use x-twitter-publish).
license: MIT
compatibility: Requires network access and an x402/MPP payment client (AgentCash MCP recommended). Webhook delivery needs a public HTTPS endpoint. No API key or signup.
metadata:
  author: twitr.sh
  version: "1.0"
---

# X monitors — real-time events

| Task | Approach |
|---|---|
| Start watching | `x_monitor` `action: "create"` — see **Create** |
| Get the events | Poll `/api/monitors/{id}/events` (free) or register a webhook |
| Keep it alive | `action: "extend"` before `expires_at`; it does **not** auto-renew |
| Stop it | `DELETE /api/monitors/{id}` — no refund for unused hours |

A monitor is **prepaid by the hour** — about $0.025/hr, so ~$0.61/day or ~$4.20/week. Max 168
hours per purchase, 720 hours of forward window.

## Create

```
POST https://twitr.sh/api/tools/x_monitor
Idempotency-Key: <uuid>
{ "action": "create", "username": "vercel", "hours": 168 }     # account monitor
{ "action": "create", "query": "\"launch week\"", "hours": 168 } # keyword monitor
```

**Tell the user the total cost before creating.** Pay on **Base (x402) or Tempo (MPP)** — a
monitor is a stateful resource needing a recoverable owner wallet, so Solana is not offered.

21 event types: `tweet.new`, `.reply`, `.retweet`, `.quote`, `.media`, `.link`, `.poll`,
`.mention`, `.hashtag`, `.longform`, plus `profile.*.changed` (avatar, banner, name, username,
bio, location, url, verified, protected, pinned_tweet, unavailable) on **account monitors only**.
A terminal `monitor.expired` / `monitor.deleted` fires once when it ends.

## Get events — polling (free)

```
GET https://twitr.sh/api/monitors/{id}/events?after={last_event_id}&limit=50
```

Wallet-signed, free, 60 reads/min. Cursor semantics: pass the last id you processed and you get
strictly newer events, **oldest first**. Retention is 500 events / 24h per monitor — poll at
least daily or you lose events.

## Get events — webhooks (push)

```
POST https://twitr.sh/api/webhooks
{ "url": "https://your-app.example.com/hooks", "eventTypes": ["tweet.new"] }
```

Free, max 3 per wallet, HTTPS hostnames only (no IPs, no localhost). **The signing secret is
returned exactly once** — store it immediately; `POST /api/webhooks/{id}/rotate` if lost.

Verify every delivery:

```
sha256=HMAC-SHA256(secret, `${X-Twitr-Timestamp}.${rawBody}`)
```

compared in constant time against `X-Twitr-Signature`. Reject timestamps older than 5 minutes.

Envelope: `{ type, id, delivery_id, monitor_id, occurred_at, received_at, source, data }`.

## Gotchas

- **`Idempotency-Key` is required on create.** Without it, a retried or double-fired scheduler
  creates — and charges for — a second monitor.
- **Monitors do not auto-renew.** They stop dead at `expires_at`. Watch for the
  `monitor.expired` event, or check `GET /api/monitors` and extend in advance.
- **Deleting early does not refund.** Don't create one "just to test" — create it for the real
  window.
- **Dedupe on both ids.** `delivery_id` changes per retry; `id` is stable per event. Dedupe on
  `id` for logic, on `delivery_id` for retry detection.
- **Respond 2xx within 10 seconds.** Slow endpoints trigger the retry ladder (6 attempts over
  ~36 minutes). 50 consecutive failures auto-pauses the webhook; a successful
  `POST /api/webhooks/{id}/test` re-activates it.
- **Silence is ambiguous without the lifecycle event.** If you stop receiving events, check
  whether the monitor expired before assuming the account went quiet.

## Avoid

- Don't poll more than once a second, or on a timer when nobody is asking — retention is 24h, so
  a few times a day is plenty.
- Don't create one monitor per keyword when a single query with operators would cover them.
- Don't skip signature verification because "the URL is secret". Anyone can POST to it.

Full API: https://twitr.sh/skill.md · https://twitr.sh/docs
