"""Search X/Twitter with the twitr.sh API.

Get a key: sign in at https://twitr.sh/dashboard, top up by card, create an API key.
    export TWITR_API_KEY=tw_live_...
    python search_tweets.py "from:nasa since:2026-01-01"
"""
import os
import sys

import requests

query = sys.argv[1] if len(sys.argv) > 1 else "from:nasa"
r = requests.post(
    "https://twitr.sh/api/tools/x_search",
    headers={"Authorization": f"Bearer {os.environ['TWITR_API_KEY']}"},
    json={"q": query, "queryType": "Latest", "resultsLimit": 20},
    timeout=60,
)
r.raise_for_status()
for tweet in r.json()["items"]:
    print(tweet.get("createdAt"), "|", (tweet.get("text") or "").replace("\n", " ")[:100])
