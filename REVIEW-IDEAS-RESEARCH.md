# Review ideas research — Rate Buddies v1.5.4

This note records how the review-idea and Facebook-comment engine was built (17 November 2026, Australia/Perth). **All fragments in the app are original.** Real reviews were read only to learn common themes and everyday Australian wording. Nothing was copied verbatim.

## What was consulted (public pages)

Checked 17 November 2026:

- **hipages** customer recommendations on public tradie profiles (for example plastering, painting, tiling and handyman listings). Recurring praise: punctual, tidy/clean, professional, clear communication, fair or reasonable price, quality finish, would hire again, highly recommend. Reviews often name the job and suburb, and sometimes the tradie by first name.
- **Word of Mouth** (wordofmouth.com.au) reviews of Perth and other Australian trades, including plumbers, electricians and painters. Typical wording: “turned up on time”, “easy to deal with”, “tidy”, “fair price”, “would recommend”, “explained the issue”, “sorted the problem”.
- **Google review patterns** for Australian trades, plus guidance on writing useful local reviews (for example The Quote Yard’s 2026 note on leaving a tradie review in Australia). Useful reviews are specific: the job done, whether they arrived on time, how they communicated, the finish, and whether you would use them again — not a vague “great service, highly recommend”.
- **Oneflare** and **Word of Mouth** were also consulted as Australian home-service directories. Platform-level reviews of those marketplaces were not used as wording for tradie ideas.
- **Google’s maps / user-content rules** and the **ACCC** guidance on online reviews (same sources already cited in TECH-PLAN.md).

## Themes we captured (and mapped to “Focus on”)

| Theme | How it shows up in genuine reviews | In the engine |
| --- | --- | --- |
| Punctuality | Turned up on time, kept the booking | Timeliness |
| Tidiness | Left the place clean, protected floors | Cleanliness |
| Communication | Explained the work in plain words | Built into medium/detailed ideas |
| Quote / price | Fair, no surprises, charged as quoted | Value |
| Quality | Neat finish, careful, not rushed | Default praise |
| Friendliness / manner | Easy to deal with, polite on site | Staff (with the person’s name) |
| Problem solved | Fixed the actual cause, checked before leaving | Used in longer ideas |
| Recommend | Would use again, happy to recommend | Closings |
| Local search | Job + trade + suburb or “Perth”, written naturally | Search-friendly (SEO) |

## Search-friendly wording (not keyword stuffing)

“Search-friendly” here means the idea naturally mentions the **trade**, the **specific service** (for example “termite inspection” or “hot water system swap”) and the **suburb or Perth**, the way local search tends to favour. It must still read like something a person would say. The engine never repeats keywords for effect.

Google’s own review rules still apply: a review must be a **genuine experience**. **Incentives** (money, discounts or gifts in return for a review) are not allowed. RateBuddies ideas stay **suggestions only**. The member must edit the text in their own words and only post after a real job.

## How the engine is built

- Many openings, praise lines and closings, in three tones (Casual, Professional, Warm) and three lengths (Short, Medium, Detailed).
- Trade-specific job phrases for every trade group in the 241-name list (`trades.js`), with a sensible fallback when a trade is uncommon.
- Perth suburb and month chips, plus Focus on: Search-friendly, Service, Area, Staff, Value, Timeliness, Cleanliness. Defaults: Medium, Casual, Search-friendly + Service + Area.
- Ideas are unique per member viewing a business. A used or copied idea is not offered to anyone else for that same business. Near-duplicate wording is skipped. “Show different ideas” also retires the current set. The same rule applies to Facebook recommendation comments, per post.
- If the unused pool ever looks thin, the engine keeps combining openings, job synonyms, praise lines and closings so it does not run out.

## Combination count (17 Nov 2026)

For one electrician, holding suburb and month fixed, a conservative estimate is about **151,200** unique review-idea combinations (32 openings × 9 job phrases × praise pairings × closers × 3 lengths × 3 tones). The 12 suburb chips and 9 months multiply that further in real use. Facebook comment openings: **21** stems, combined with job, suburb and praise in the same way.

A node test (`ideas-engine.test.js`) checks uniqueness between two members, the used-idea rule, focus-flag coverage, and that a long run of “show different” batches does not stall.

In production, TECH-PLAN.md notes that the back end should store used-idea hashes per business and per Facebook post, run a similarity check, and may also use an LLM to write fresh unique suggestions that go through the same dedupe.
