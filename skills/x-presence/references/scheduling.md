# Scheduling the cycle

Pick one runtime. All three below were verified against installed versions; flags and
subcommands that don't exist have been left out deliberately.

The prompt is the same everywhere:

> Run one x-presence cycle. Read new monitor events, draft in my voice, publish approved
> original posts, and append reply drafts to .twitr/pending.md. Post no replies.

**Every runtime starts a fresh session with no memory of the last run.** State lives in
`.twitr/state.json`, never in context. Read it first, write it last.

---

## Claude Code routines — cloud, runs with your laptop closed

Best option if the user is on Pro/Max/Team/Enterprise with Claude Code on the web.

```
/schedule every 4 hours, run one x-presence cycle and queue reply drafts
```

Or create it at https://claude.ai/code/routines. Then:

1. **Repositories** — routines require at least one GitHub repo. It gets cloned each run, and
   it's where `.twitr/` lives. Claude pushes to `claude/`-prefixed branches unless you enable
   unrestricted pushes.
2. **Connectors** — include **AgentCash**. Connector traffic is proxied through Anthropic's
   servers, so it works *without* adding any host to the allowed-domains list.
3. **Network access** — if the routine calls `twitr.sh` over plain HTTPS rather than through the
   AgentCash connector, the Default environment blocks it (`403`,
   `x-deny-reason: host_not_allowed`). Fix: edit the environment → Network access → **Custom** →
   add `twitr.sh`, keeping the default list checked. Using the connector avoids this entirely.

Constraints: **minimum interval is one hour**; runs are staggered a few minutes; they draw down
subscription usage and a daily routine cap. Runs are fully autonomous — no approval prompts —
which is exactly why the cycle queues replies instead of posting them.

A green run status only means the session exited without an infrastructure error. Open the run
to confirm what actually happened.

Docs: https://code.claude.com/docs/en/routines

---

## Hermes cron — local daemon

Verified on Hermes Agent 0.19.x.

```sh
hermes cron create "every 4h" \
  "Run one x-presence cycle. Queue reply drafts to .twitr/pending.md. Post no replies." \
  --name x-presence --skill x-presence
```

Schedule accepts `30m`, `every 2h`, or a 5-field cron expression. Useful neighbours:
`hermes cron list`, `hermes cron run <id>` (fires on the next tick), `hermes cron pause`,
`hermes cron status` to confirm the scheduler is alive, and `hermes cron tick` to drain due jobs
once and exit — handy for testing without waiting.

The scheduler ticks about once a minute and locks against overlapping runs, so a slow cycle
won't be started twice.

---

## OpenClaw cron — local, via the Gateway

Verified on OpenClaw 2026.3.1.

```sh
openclaw cron add --name x-presence \
  --cron "0 */4 * * *" \
  --message "Run one x-presence cycle. Queue reply drafts to .twitr/pending.md. Post no replies." \
  --session isolated \
  --tz "$(readlink /etc/localtime | sed 's|.*zoneinfo/||')"
```

`--cron` takes a 5-field expression (or 6-field with seconds). Use `--session isolated` so the
job doesn't accumulate context in the main session. `--stagger 5m` spreads load. Inspect with
`openclaw cron list`, `openclaw cron runs` for history, and `openclaw cron run <id>` to fire once.

Set `--tz` explicitly — an unset timezone means the expression is interpreted in the Gateway's
zone, which may not be the user's.

Docs: https://docs.openclaw.ai/cli/cron

---

## Local cron / launchd + headless Claude

If none of the above fit. **Only these flags exist** — verified against Claude Code 2.1.220:
`-p`/`--print`, `--permission-mode`, `--output-format`, `--allowed-tools`,
`--disallowed-tools`, `--max-budget-usd`. (`--max-turns` does **not** exist; ignore any guide
that uses it.)

```sh
0 */4 * * * cd /path/to/repo && /usr/local/bin/claude -p \
  "Run one x-presence cycle. Queue reply drafts. Post no replies." \
  --permission-mode acceptEdits \
  --max-budget-usd 2 \
  --output-format json >> .twitr/cron.log 2>&1
```

Prefer `acceptEdits` over `bypassPermissions` — an unattended presence loop should not hold
blanket permission. `--max-budget-usd` is a real spend rail; set it.

On macOS prefer **launchd** over crontab: launchd runs jobs missed while the machine slept
(coalesced into one), whereas cron silently skips them. That coalescing is precisely why every
write needs an `Idempotency-Key`.

Log in first — headless cannot establish auth mid-run. `claude setup-token` mints a long-lived
subscription token for unattended use. Note `ANTHROPIC_API_KEY` **outranks** it and silently
switches you to metered API billing, so unset it in the cron environment if you don't want that.

---

## Approving the queue

Scheduling handles everything except replies. In any interactive session:

> review my pending X replies

The skill reads `.twitr/pending.md`, shows each draft with its source post and cost, and posts
only what the user approves.
