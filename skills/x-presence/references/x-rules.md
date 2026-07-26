# Why some actions are refused

Read this when the user asks for a prohibited action, or asks why the skill won't do something.
Explain the reason — don't just decline.

Source: X's automation development rules,
https://help.x.com/en/rules-and-policies/x-automation, plus the X Rules on platform
manipulation and spam. X blocks automated fetching of these pages, so verify by opening them in
a browser.

## Refused, and why

**Automated following or unfollowing.** X prohibits automated following that is "bulk,
aggressive, or indiscriminate", and prohibits "applications that claim to get users more
followers" outright. Follow-then-unfollow churn is the most heavily policed behaviour on the
platform and the fastest route to suspension.

The 400 follows/day number that circulates is not a permission slip — X describes it as a
technical account limit and says separately that additional rules prohibit aggressive following.
So the compliant answer is abstention, not a lower rate.

**Automated liking.** Unconditional: "You may not like posts... in an automated manner." There is
no compliant volume.

**Keyword-triggered replies.** Banned by explicit example. Automated replies to accounts that
didn't ask for them are the canonical spam pattern. AI-driven reply bots additionally require
X's prior written approval.

**Near-duplicate or repeated content.** The Authenticity policy names "repeatedly posting
identical or nearly identical posts in a duplicative manner popularly known as 'Copypasta'", and
separately prohibits "posting and deleting the same content repeatedly". Note this is a *rules*
violation, not a ranking penalty — there is no text-similarity filter in the ranking code — but
enforcement is the more serious of the two.

**Volume.** X's published limits for unverified accounts are 50 original posts and 200 replies per
day. The skill's default caps sit far below this deliberately; approaching a stated ceiling with
automation is how accounts get reviewed.

**Bulk DMs.** Unsolicited automated DMs are prohibited.

## Permitted, and what this skill does

- **Scheduling original posts** — explicitly allowed. The core of this skill.
- **Drafting with AI** — allowed. Drafting is not publishing.
- **Reading and analysing public data** — allowed, and what monitors and research do.
- **Replying with human review** — a person deciding each reply is not automation.

## How the refusal is enforced

By omission. The prohibited actions are absent from the cycle's tool set rather than merely
discouraged in prose, because an instruction is something a model can drift past under pressure
while a missing capability is not.

If a user insists, the honest framing is: this account is theirs and the suspension risk is
theirs, but a public skill that ships prohibited automation exposes everyone who installs it —
and per the ranking weights, the banned actions buy no reach anyway. Point them at
`ranking-signals.md`.

## One more thing worth telling users

Bot disclosure: if an account is substantially automated, saying so in the bio is the
conventional, low-cost move. It costs nothing and removes a whole category of risk.
