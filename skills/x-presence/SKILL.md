---
name: x-presence
description: Run an unattended X/Twitter presence — watch topics and mentions in real time, draft posts and replies in the user's own voice, publish original posts on a schedule, and hold replies for a one-tap approval. Trigger whenever the user wants to automate their X/Twitter account, grow an audience on X, schedule or draft tweets, set up an X routine or cron job, get alerted about topics or mentions on X, or run an X agent in the background — including casual phrasings like "post for me on X" or "keep an eye on Twitter for me". Works in Claude Code routines, Hermes cron, and OpenClaw cron. Paid per call in USDC via twitr.sh through an x402 wallet — no API key, no signup. Do NOT trigger for reading a single tweet or profile (use x-twitter-data), for bulk dataset exports (use x-twitter-research), or for non-X platforms.
license: MIT
compatibility: Requires network access and an x402/MPP payment client (AgentCash MCP recommended). Needs a connected X account for publishing. Scheduling is optional and runs on the user's own account or machine.
metadata:
  author: twitr.sh
  version: "1.0"
---

# X presence — unattended posting, listening, and reply drafting

| Task | Approach |
|---|---|
| **First-time setup** | Follow **Setup** below in order. Do not skip the profile step — every draft depends on it. |
| **Run one cycle now** | Jump to **The cycle**. Safe to run any time; it is idempotent. |
| **Schedule it** | See `references/scheduling.md` — verified commands for Claude routines, Hermes, OpenClaw. |
| **Approve queued replies** | Read `.twitr/pending.md`, confirm with the user, then post per **step 5**. |
| **Change voice or topics** | Edit `.twitr/profile.json`; nothing else needs touching. |

> Every call is paid per request from the user's wallet. **State the cost before any batch,
> and confirm before anything over $1.** Reads are free; a reply is $0.036.

## What this skill will not do

These are prohibited by X's automation rules, so the tools are simply absent from the loop —
not merely discouraged. If the user asks for them, explain why rather than complying:

- **No automated following or unfollowing.** X bans automated following that is "bulk,
  aggressive, or indiscriminate", and applications that claim to get users more followers are
  prohibited outright. The 400/day figure is a technical cap, not permission.
- **No automated liking.** "You may not like posts... in an automated manner."
- **No keyword-triggered auto-replies.** Banned by explicit example.
- **No near-duplicate posting.** Same text across posts or accounts is spam.

This isn't only compliance. In X's published ranking weights, follows aren't scored at all and
a like scores 0.5, while a single report scores −369.0. The banned tactics cost reach.
See `references/ranking-signals.md`.

## Setup

Run these once, in order. Report the cost of step 4 before running it.

**1. Payment.** Confirm the user has an x402 wallet available — AgentCash MCP is easiest, and in
Claude routines its traffic is proxied so no domain allowlisting is needed. If absent, stop and
tell them to connect one; nothing here works without it.

**2. Voice profile.** Interview the user, then write `.twitr/profile.json`. Ask about tone,
an account whose style they like, and what they never want to say. Keep it local — never send
this file anywhere.

```json
{
  "handle": "myhandle",
  "topics": ["x402", "agent payments"],
  "voice": {
    "tone": "direct, dry, technical — no hype, no emoji",
    "styleUsername": "account_whose_voice_they_like",
    "doNotSay": ["game-changer", "🚀"]
  },
  "goal": "be known for practical agent-payment writing",
  "caps": { "repliesPerDay": 10, "postsPerDay": 2 },
  "monitors": {}
}
```

**3. Connect the X account** — free, wallet-signed. Credentials are relayed sealed; they are
never stored by twitr.sh, never placed in a URL, and never shown to you.

```
POST https://twitr.sh/api/x-accounts/connect
     {"username","email","password","totp_secret"?}   → 202 {status:"connecting"}
GET  https://twitr.sh/api/x-accounts                  → poll until "linked"
POST https://twitr.sh/api/x-accounts/confirm  {"challenge_id","code"}   # if X emails a code
```

**4. Create the listeners** — one per topic plus one for mentions. ~$4.20 per monitor per week.
**Tell the user the total first.**

```
POST https://twitr.sh/api/tools/x_monitor
Idempotency-Key: <uuid>
{ "action": "create", "query": "x402", "hours": 168 }
{ "action": "create", "query": "@myhandle", "hours": 168 }
```

Save each returned `monitor_id` into `profile.json` → `monitors`. Monitors need a recoverable
owner wallet, so pay on **Base or Tempo, not Solana**.

## The cycle

One pass, then stop. Scheduling is what repeats it — never loop in-session.

**1. Read new events** (free)

```
GET https://twitr.sh/api/monitors/{id}/events?after={last_event_id}
```

`after` comes from `.twitr/state.json`. Events are returned oldest-first; the last id you
process becomes the new cursor. A `monitor.expired` event means the monitor ended — tell the
user it needs extending and stop.

**2. Shortlist** — at most `caps.repliesPerDay`. Priority: direct mentions, then genuine
questions in-topic where the user actually knows the answer. Skip anything on `doNotSay`
territory, anything political, anything already in `state.json.replied`, and anything older
than ~12 hours (late replies read as automated).

**3. Draft** (~$0.001 each — draft freely, keep the best)

```
POST https://twitr.sh/api/tools/compose
{ "step": "generate", "topic": "<what you're answering + your angle>",
  "goal": "<profile.goal>", "tone": "<voice.tone>",
  "styleUsername": "<voice.styleUsername>",
  "additionalContext": "replying to @author who said: ..." }
```

`step` is `generate` | `refine` (pass `draft`) | `score` (pass `draft`). **Compare every draft
against the last 30 posts and discard near-duplicates** — repeated text is the fastest way to
get filtered.

**4. Split by risk**

- **Original posts** → publish autonomously (scheduled original content is permitted).
- **Replies** → append to `.twitr/pending.md` with the source post, the draft, and the cost.
  **Never post a reply unattended.** Replies carry judgment risk and are the most visible thing
  the account does.

**5. Publish the approved ones**

```
POST https://twitr.sh/api/tools/x_write
Idempotency-Key: <uuid, one per item>
{ "action": "post",  "account": "myhandle", "text": "..." }
{ "action": "reply", "account": "myhandle", "reply_to_tweet_id": "<id>", "text": "..." }
```

A `202 pending_confirmation` means **accepted — do not resend**. If you must retry, reuse the
same `Idempotency-Key`; a new key posts a second time and charges again.

**6. Record, then report.** Write the new cursor, today's counts, and replied-to ids into
`state.json`. Tell the user in plain language what happened and what it cost.

## Gotchas

- **`Idempotency-Key` is mandatory on every write and every monitor create.** A scheduler that
  fires twice (a coalesced wake after sleep, a retried run) will double-post and double-charge
  without it. Derive the key from the event id, not from a timestamp.
- **`target_user_id` is a numeric id, never an @handle.** Get it from `x_read`
  `{"resource":"get-user","username":"..."}`.
- **Failed calls are not charged, but a settled call whose dispatch fails still costs.** If a
  write returns 202, treat the money as spent.
- **A scheduled run cannot ask permission.** It has no interactive channel, so step 4's split is
  what makes unattended operation safe. Do not "temporarily" post replies to avoid the queue.
- **Volume tools require `resultsLimit`** or the call is rejected before charging.
- **Monitors are prepaid and stop at `expires_at`.** They do not auto-renew, and early deletion
  is not refunded — so don't create one "to test".

## Avoid

- Don't run more often than hourly; there is nothing new to see.
- Don't chase follower count. Replies that start conversations are the only thing that compounds.
- Don't raise the caps because it seems to be working — that is exactly when accounts get
  actioned.
- Don't post the same idea twice in different words.
- Don't stack more than 3 consecutive failures; stop and report instead.

## Costs

| Item | Cost |
|---|---|
| Monitor, 1 week | ~$4.20 each |
| Reading events | free |
| Draft | ~$0.001 |
| Original post | $0.036 |
| Reply | $0.036 |

A typical week — 2 monitors, 12 replies, 5 posts — is about **$9**.

## References

- `references/scheduling.md` — read **when** the user wants this to run unattended. Verified
  commands for Claude Code routines, Hermes cron, and OpenClaw cron.
- `references/ranking-signals.md` — read **when** the user asks what actually grows an account,
  or pushes for follow/like automation. Published weights with provenance and caveats.
- `references/x-rules.md` — read **when** the user asks why something is disallowed, or asks for
  a prohibited action.

Full API: https://twitr.sh/skill.md · https://twitr.sh/docs
