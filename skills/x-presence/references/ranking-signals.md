# What actually ranks on X

Read this when the user asks what grows an account, or pushes for follow/like automation.

## The published weights

X open-sourced its ranking stack. The heavy ranker predicts ten engagement probabilities and
combines them as a weighted sum. These weights are **verbatim** from
[the-algorithm-ml/projects/home/recap/README.md](https://github.com/twitter/the-algorithm-ml/blob/main/projects/home/recap/README.md),
dated **April 5 2023** in the document itself:

| Signal | Weight |
|---|---|
| `reply_engaged_by_author` — you reply, the author replies back | **75.0** |
| `reply` | 13.5 |
| `good_profile_click` — opens your profile *and* likes/replies | 12.0 |
| `good_click` — opens the conversation and engages | 11.0 |
| `good_click_v2` — opens the conversation, stays 2+ minutes | 10.0 |
| `retweet` | 1.0 |
| `fav` (like) | 0.5 |
| `video_playback50` | 0.005 |
| `negative_feedback_v2` — "show less often", block, or mute | **−74.0** |
| `report` | **−369.0** |

## Read these honestly

**Treat them as direction, not arithmetic.** Three caveats matter, and the skill should not
overstate this:

1. **They are dated April 2023.** The same README says the weights are "not hardcoded in the
   code" and can be adjusted at any time. The current repo confirms it — the serving params hold
   no numeric constants.
2. **X deliberately jitters them.** `HomeGlobalParams.scala` exposes `AddNoiseInWeightsPerLabel`
   and `EnableDailyFrozenNoisyWeights`. Micro-optimising against exact values is futile by design.
3. **The famous multipliers are not Twitter's.** "A reply is worth 150 likes" was derived by a
   blogger dividing 75.0 by 0.5 the day the repo dropped, and it has been recycled ever since —
   including by sites presenting the 2023 numbers as current "Phoenix" ranker constants. The
   real current weights live in a params module X did not publish. **Do not quote multipliers as
   if X stated them.**

What survives all three caveats is the **ordering**, and that's enough to act on.

## What follows from the ordering

- **Conversation beats consumption.** Every high-weight signal involves someone replying,
  clicking through, or dwelling. Likes and retweets sit near the bottom.
- **The best single outcome is a reply the author answers.** So reply to people who actually
  converse — not megaphone accounts that never respond.
- **Negative feedback is catastrophic and asymmetric.** One report outweighs hundreds of likes.
  This is the mechanical case for conservative behaviour: a single spammy blast can undo weeks.
- **Follows and likes are not in the objective function.** Automating them buys nothing the
  ranker rewards, while risking the signal that destroys reach. The prohibited tactics are also
  the ineffective ones.
- **Profile matters.** `good_profile_click` at 12.0 means someone visiting your profile and then
  engaging is heavily rewarded — so bio and pinned post do real work.

## Pipeline facts worth knowing

From [the-algorithm/home-mixer/README.md](https://github.com/twitter/the-algorithm/blob/main/home-mixer/README.md)
and the repo root README:

- Candidate generation → ~6000 features hydrated → ML scoring → filters → mixing.
- **~50% of For You posts come from the in-network search index** (people who follow you). So
  followers still gate half your distribution — real follower growth compounds, which is why
  it's worth earning rather than automating.
- **RealGraph** predicts how likely user A is to interact with user B, and a graph-feature
  service tracks things like how many of A's following liked B's posts. Consistent engagement
  with one community compounds; scattershot engagement doesn't.
- Explicit filters include **author diversity** (you can't dominate one feed) and **feedback
  fatigue** (the same author repeatedly gets downranked). Posting more is not linearly more
  reach.

## Three systems, don't confuse them

Most bad X advice comes from collapsing these. Keep them separate and the guidance stays
defensible:

1. **The ranking code** — what scores a post. Weights, filters, candidate sources.
2. **The written rules** — what gets an account actioned. A rule violation is not a score.
3. **The monetization program** — what gets a post demonetized. Demonetization is not downranking.

Two concrete examples of the confusion. **Deleting posts** carries no ranking penalty — there's no
account-level engagement-average feature in the code, and X *requires* deletion to lift
enforcement — but "posting and deleting the same content repeatedly" is a written-rule violation.
**Duplicate content** ("copypasta") is likewise named in the rules, yet there is no text-similarity
ranking filter; dedup in the code is by tweet id and conversation id only. Both matter — as
policy, not as score.

## Official rate limits

Verified from X's own limits page: **50 original posts and 200 replies per day** for unverified
accounts. Treat these as the ceiling that must never be approached, not a target. (The old
"2,400 updates/day" figure still on that page is stale.)

## Premium, accurately

X documents "a slight preference for replies from verified accounts" and tiered reply
prioritization, and says it is "currently testing the levels." That is **replies and
conversations only**, of unstated magnitude. The widely-quoted 2–4× *For You* multiplier for
Premium does not exist in the code. Don't promise a reach boost from a subscription.

## The strategy this implies

1. Reply substantively in a narrow topic, to people who reply back.
2. Post original content on a steady cadence — permitted, and it feeds the in-network half.
3. Make the profile convert a visit into a follow.
4. Never earn a mute, block, or report.

Which is exactly what this skill automates, and exactly what it refuses to do.
