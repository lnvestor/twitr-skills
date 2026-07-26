# twitr.sh agent skills

Agent Skills for [twitr.sh](https://twitr.sh) — a pay-per-call X/Twitter API for AI agents.
**No API key, no signup, no subscription.** Your agent's wallet pays a fraction of a cent per
request in USDC over [x402](https://x402.org) or MPP.

Works with any skill-aware agent: Claude Code, Cursor, Copilot, OpenClaw, Hermes.

## Install

```sh
npx skills add lnvestor/twitr-skills --skill x-presence
```

Swap the skill name, or install several:

| Skill | What it does |
|---|---|
| **`x-presence`** | Unattended presence: watch topics, draft in your voice, publish original posts, queue replies for approval. Runs on a schedule. |
| `x-twitter-data` | Live reads — tweets, profiles, search, timelines, lists, communities, trends. |
| `x-twitter-monitor` | Real-time monitors with free event polling or HMAC-signed webhooks. |
| `x-twitter-publish` | Draft with AI, then post/reply/quote through a connected account. |
| `x-twitter-research` | Bulk dataset exports — followers, repliers, reposters — as downloadable files. |

`x-presence` is the one to start with; it uses the others' endpoints internally.

## Setup

**1. A wallet.** Connect [AgentCash](https://agentcash.dev) as an MCP connector, or any
x402-capable client. Fund it with USDC on Base or Tempo. That's the only account you need.

**2. Nothing else.** There is no signup, no dashboard step, no key to paste. The first call
returns HTTP 402 with the exact price; your client pays and retries.

For scheduling `x-presence`, see
[`skills/x-presence/references/scheduling.md`](skills/x-presence/references/scheduling.md) —
verified commands for Claude Code routines, Hermes cron, and OpenClaw cron.

## What it costs

| | |
|---|---|
| Reading events from a monitor | free |
| Drafting a post | ~$0.001 |
| A read or search | ~$0.0012 per item |
| A post or reply | $0.036 |
| A monitor | ~$0.025/hour (~$4.20/week) |

A typical week running `x-presence` — two monitors, a dozen replies, a few posts — is about **$9**.
Failed calls are never charged, and every 402 quotes the exact price before your wallet signs.

## What these skills will not do

No automated following, unfollowing, or liking, and no keyword-triggered replies. X prohibits
these by name, and its published ranking weights show follows aren't scored at all while a
single report scores −369.0 — so the banned tactics cost reach as well as risking the account.
The prohibited actions are omitted from the skills rather than merely discouraged.

Reasoning and sources:
[`ranking-signals.md`](skills/x-presence/references/ranking-signals.md) ·
[`x-rules.md`](skills/x-presence/references/x-rules.md)

## Discovery

- Agent guide: https://twitr.sh/skill.md
- Docs: https://twitr.sh/docs
- OpenAPI 3.1: https://twitr.sh/openapi.json
- MCP: `POST https://twitr.sh/api/mcp`
- Payment discovery: https://twitr.sh/.well-known/x402 · https://twitr.sh/.well-known/mpp.json

## License

MIT — see [LICENSE](LICENSE).

Independent service. Not affiliated with X Corp. "X" and "Twitter" are trademarks of X Corp.
