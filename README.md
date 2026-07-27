<div align="center">

<img src="https://twitr.sh/icon.svg" width="72" alt="twitr.sh">

# twitr.sh agent skills

**X/Twitter for AI agents — paid per call in USDC. No API key, no signup, no subscription.**

[![skills.sh](https://skills.sh/b/lnvestor/twitr-skills)](https://skills.sh/lnvestor/twitr-skills)
[![Skills](https://img.shields.io/badge/skills-5-111?style=flat-square)](#the-skills)
[![Payment](https://img.shields.io/badge/x402%20%C2%B7%20MPP-USDC-111?style=flat-square)](https://x402.org)
[![Networks](https://img.shields.io/badge/Base%20%C2%B7%20Solana%20%C2%B7%20Tempo-111?style=flat-square)](https://twitr.sh/.well-known/x402)
[![License](https://img.shields.io/badge/license-MIT-111?style=flat-square)](LICENSE)

[Install](#install) · [The skills](#the-skills) · [Setup](#setup) · [Pricing](#what-it-costs) · [Docs](https://twitr.sh/docs)

</div>

---

```sh
npx skills add lnvestor/twitr-skills
```

Works with any skill-aware agent — Claude Code, Cursor, Copilot, OpenClaw, Hermes. Your agent's
wallet pays a fraction of a cent per request over [x402](https://x402.org) or MPP. The wallet
*is* the account: there is no key to paste and nothing to sign up for.

## The skills

Five focused skills, each with explicit trigger boundaries so they don't fire over each other.

| | Skill | What it does |
|:--|:--|:--|
| ⭐ | **`x-presence`** | Unattended presence — watch topics, draft in your voice, publish on a schedule, queue replies for approval. |
| 🔎 | `x-twitter-data` | Live reads — tweets, profiles, search, timelines, lists, communities, trends. |
| 🔔 | `x-twitter-monitor` | Real-time monitors, delivered by free polling or HMAC-signed webhooks. |
| ✍️ | `x-twitter-publish` | Draft with AI, then post, reply, or quote through a connected account. |
| 📦 | `x-twitter-research` | Bulk exports — followers, repliers, reposters — as downloadable datasets. |

Install one instead of all five with `--skill <name>`.
**Start with `x-presence`** — it drives the others' endpoints internally.

## Setup

**1. A wallet.** Connect [AgentCash](https://agentcash.dev) as an MCP connector, or any
x402-capable client, and fund it with USDC on Base, Solana, or Tempo.

**2. There is no step two.** No signup, no dashboard, no key. The first call returns HTTP 402
with the exact price; your client pays and retries automatically.

Scheduling `x-presence`? See
[`scheduling.md`](skills/x-presence/references/scheduling.md) — verified commands for Claude Code
routines, Hermes cron, and OpenClaw cron.

## What it costs

| Action | Price |
|:--|--:|
| Reading events from a monitor | **free** |
| Drafting a post | ~$0.001 |
| A read or search | ~$0.0012 / item |
| A post or reply | $0.036 |
| A monitor | ~$0.025 / hour |

A typical week running `x-presence` — two monitors, a dozen replies, a few posts — is about
**$9**. Failed calls are never charged, and every 402 quotes the exact price before your wallet
signs anything.

## What these skills will not do

No automated following, unfollowing, or liking, and no keyword-triggered replies.

X prohibits these by name, and its published ranking weights show follows aren't scored at all
while a single report scores **−369.0** — so the banned tactics cost reach *as well as* risking
the account. The prohibited actions are omitted from the skills rather than merely discouraged.

Reasoning and sources: [`ranking-signals.md`](skills/x-presence/references/ranking-signals.md) ·
[`x-rules.md`](skills/x-presence/references/x-rules.md)

## Discovery

| | |
|:--|:--|
| Agent guide | https://twitr.sh/skill.md |
| Docs | https://twitr.sh/docs |
| OpenAPI 3.1 | https://twitr.sh/openapi.json |
| MCP | `POST https://twitr.sh/api/mcp` |
| Payment discovery | [x402](https://twitr.sh/.well-known/x402) · [MPP](https://twitr.sh/.well-known/mpp.json) |

## License

MIT — see [LICENSE](LICENSE).

<sub>Independent service. Not affiliated with X Corp. "X" and "Twitter" are trademarks of X Corp.</sub>
