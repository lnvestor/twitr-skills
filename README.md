<div align="center">

<img src="https://twitr.sh/icon.svg" width="80" alt="twitr.sh">

# X (Twitter) skills for Claude Code — no API key, no developer account

**Six installable X/Twitter skills for Claude Code, Cursor, OpenClaw and Hermes — paid per call
in USDC. No X developer account, no API keys, no OAuth, no signup, no subscription.**

[![skills.sh](https://skills.sh/b/lnvestor/twitr-skills)](https://skills.sh/lnvestor/twitr-skills)
[![Skills](https://img.shields.io/badge/skills-5-111?style=flat-square)](#-the-skills)
[![Payment](https://img.shields.io/badge/x402%20%C2%B7%20MPP-USDC-111?style=flat-square)](https://x402.org)
[![Networks](https://img.shields.io/badge/Base%20%C2%B7%20Solana%20%C2%B7%20Tempo-111?style=flat-square)](https://twitr.sh/.well-known/x402)
[![License](https://img.shields.io/badge/license-MIT-111?style=flat-square)](LICENSE)

[Start in 60 seconds](#-start-in-60-seconds) · [Ideas](#-what-can-my-agent-do) · [The skills](#-the-skills) · [Wallets](#-wallet-setup) · [Pricing](#-what-it-costs) · [Links](#-links)

</div>

---

## ⚡ Start in 60 seconds

Most X/Twitter skills wrap the official API, so the setup is yours: register an X developer
account, create an app, complete OAuth, store the tokens, and pay X directly. These skip all of
it — your agent's wallet pays per request, and that payment *is* the authentication.

**1 · Install the skills** (needs Node 18+ and `git` on PATH):

```sh
npx skills add lnvestor/twitr-skills
```

Claude Code users can install from the plugin marketplace instead — either path works:

```sh
/plugin marketplace add lnvestor/twitr-skills
/plugin install twitr-skills@twitr
```

**2 · Get a wallet.** Any x402/MPP wallet works — each one's own documented command:

| | Wallet | Try it | Pays on |
|:--|:--|:--|:--|
| <img src="https://twitr.sh/wallets/agentcash.svg" width="16" alt=""> | [AgentCash](https://agentcash.dev) ⭐ | `npx agentcash try https://twitr.sh` | Base · Solana · Tempo |
| <img src="https://twitr.sh/wallets/awal.png" width="16" alt=""> | [awal](https://github.com/coinbase/agentic-wallet-skills) (Coinbase) | `npx awal x402 bazaar search twitr.sh` | Base |
| <img src="https://twitr.sh/wallets/paysh.png" width="16" alt=""> | [pay.sh](https://pay.sh) (Solana Foundation) | `pay curl https://twitr.sh` | Solana |
| <img src="https://twitr.sh/wallets/poncho.svg" width="16" alt=""> | [Poncho](https://tryponcho.com) | [tryponcho.com/m/twitr.sh](https://tryponcho.com/m/twitr.sh) | — |
| <img src="https://twitr.sh/wallets/circle.ico" width="16" alt=""> | [Circle Agent Wallet](https://www.circle.com) | `circle services search "twitr.sh"` | — |

First time with agent wallets? → [Wallet setup](#-wallet-setup) has step-by-step guides (AgentCash's onboarding bonus can even fund you **up to $25 for free**).

**3 · Ask your agent something.** The first call returns HTTP 402 with the exact price — that's the quote, not an error. Your wallet pays and retries automatically. $5 covers thousands of reads.

## 💡 What can my agent do?

Copy-paste any of these once the skills are installed:

> *"What is **@vercel** posting about this week?"*

> *"Search X for what people are saying about **my product** — top 50 by likes, English only."*

> *"**Watch @competitor** and tell me the moment they announce something."* — a real-time monitor; events reach your agent by free polling or signed webhook

> *"Draft 3 tweet variants announcing **our launch** in my voice — I'll pick one, then post it."*

> *"Export **everyone who replied** to this tweet as a dataset."*

> *"Run my X presence: watch these 3 topics, queue drafts every morning, replies wait for my approval."*

## 📦 The skills

Six focused skills with explicit trigger boundaries, so they don't fire over each other.

| | Skill | What it does |
|:--|:--|:--|
| ⭐ | **[`x-presence`](https://twitr.sh/skills/x-presence)** | Unattended presence — watch topics, draft in your voice, publish on a schedule, queue replies for approval. **Start here** — it drives the others internally. |
| 🤖 | [`twitter-automation`](https://twitr.sh/skills/twitter-automation) | The automation builder — describe the automation you want (auto-reply, scheduler, watcher, engagement) and it designs, prices, and wires it from the primitives. |
| 🔎 | [`x-twitter-data`](https://twitr.sh/skills/x-twitter-data) | Live reads — tweets, profiles, search, timelines, lists, communities, trends. |
| 🔔 | [`x-twitter-monitor`](https://twitr.sh/skills/x-twitter-monitor) | Real-time monitors, delivered by free polling or HMAC-signed webhooks. |
| ✍️ | [`x-twitter-publish`](https://twitr.sh/skills/x-twitter-publish) | Draft with AI, then post, reply, or quote through a connected account. |
| 📦 | [`x-twitter-research`](https://twitr.sh/skills/x-twitter-research) | Bulk exports — followers, repliers, reposters — as downloadable datasets. |

Install one instead of all six with `--skill <name>`.

Scheduling `x-presence`? See [`scheduling.md`](skills/x-presence/references/scheduling.md) — verified commands for Claude Code routines, Hermes cron, and OpenClaw cron.

## 👛 Wallet setup

<details>
<summary><img src="https://twitr.sh/wallets/agentcash.svg" width="14" alt=""> <b>AgentCash</b> — one command, ~2 minutes, and it may pay <i>you</i> up to $25.</summary>

<br>

**1. Onboard** (creates a local wallet, installs the AgentCash skill, and wires up MCP for your agent):

```sh
npx agentcash@latest onboard
```

Visiting [agentcash.dev/onboard](https://agentcash.dev/onboard) first and connecting GitHub/X/LinkedIn
gets you a claim code worth **up to $25 in free USDC** — often enough to run these skills for weeks
without depositing anything.

**2. Fund it** (skip if the bonus covered you):

```sh
npx agentcash fund
```

Guided flow with card on-ramp and bridging. No minimum.

**3. Check it works** — ask your agent *"What is my AgentCash balance?"* If it answers with a number,
you're done.

Claude Code users can alternatively install just the MCP server:
`claude mcp add agentcash --scope user -- npx -y agentcash@latest`

</details>

<details>
<summary><img src="https://twitr.sh/wallets/awal.png" width="14" alt=""> <b>Coinbase Agentic Wallet (awal)</b> — email OTP login, fund with Apple Pay/card.</summary>

<br>

**1. Sign in** (a 6-digit code lands in your email; verify it):

```sh
npx awal@latest auth login
npx awal@latest auth verify <flowId> <otp>
```

**2. Fund it** — `npx awal@latest show` opens the Coinbase Onramp UI (Apple Pay, card, bank).

**3. Done.** Your agent pays twitr.sh over x402 on Base; to pay an endpoint by hand:
`npx awal@latest x402 pay <url>`.

</details>

<details>
<summary><img src="https://twitr.sh/wallets/paysh.png" width="14" alt=""> <b>pay.sh</b> — Solana Foundation's payment layer; wraps your agent CLI.</summary>

<br>

**1. Set up** the wallet, then wrap the tool you use:

```sh
pay setup
pay claude   # or: pay curl https://twitr.sh/api/tools/x_read ...
```

`pay` detects the 402/MPP challenge, asks your local wallet to sign, and retries with
payment proof — USDC on Solana. twitr.sh accepts Solana x402 natively.

</details>

Your client's per-call cap is a hard spend limit — no call can exceed it, and **failed calls are never charged**.

**Connecting an X account?** Your agent never sees your password — it hands you a single-use link
and you sign in on twitr.sh in your own browser. Your wallet owns the account; the agent's wallet
only gets write access, and only you can revoke it. See [SECURITY.md](SECURITY.md) ·
[full write-up](https://twitr.sh/agent-security).

## 💸 What it costs

| Action | Price |
|:--|--:|
| Reading events from a monitor | **free** |
| Drafting a post | ~$0.001 |
| A read or search | ~$0.0012 / item |
| A post or reply | $0.036 |
| A monitor | ~$0.025 / hour |

A typical week running `x-presence` — two monitors, a dozen replies, a few posts — is about
**$9**. Every 402 quotes the exact price before your wallet signs anything.

## 🚫 What these skills will not do

The presence and publish skills contain no automated following, unfollowing, or liking, and no
keyword-triggered replies.

X prohibits these by name, and its published ranking weights show follows aren't scored at all
while a single report scores **−369.0** — so the banned tactics cost reach *as well as* risking
the account. `twitter-automation` exposes the full action set for users who need it, but it
prices every design up front, requires explicit confirmation, and warns when a design is
spam-shaped enough to risk the account.

Reasoning and sources: [`ranking-signals.md`](skills/x-presence/references/ranking-signals.md) ·
[`x-rules.md`](skills/x-presence/references/x-rules.md)

## 🔗 Links

| | |
|:--|:--|
| All six skills | https://twitr.sh/skills |
| Agent guide | https://twitr.sh/skill.md |
| Docs | https://twitr.sh/docs |
| Security model | https://twitr.sh/agent-security |
| OpenAPI 3.1 | https://twitr.sh/openapi.json |
| MCP | `POST https://twitr.sh/api/mcp` |
| Payment discovery | [x402](https://twitr.sh/.well-known/x402) · [MPP](https://twitr.sh/.well-known/mpp.json) |
| Explorer listings | [x402scan](https://www.x402scan.com) · [agentcash](https://agentcash.dev) |

## License

MIT — see [LICENSE](LICENSE).

<sub>Independent service. Not affiliated with X Corp. "X" and "Twitter" are trademarks of X Corp.</sub>

---

Enjoying twitr-skills? A ⭐ on this repo helps other agents find it.
