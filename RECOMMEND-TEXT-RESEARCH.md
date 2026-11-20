Rate Buddies — research: genuine Facebook recommendation comments
==================================================================

20 November 2026, Australia/Perth. Written before the v1.8.1 recommend-text design was built. This is not legal advice. Rules change, and Facebook groups also have their own rules.

What we were trying to learn
----------------------------

Vishal wants members to get a few suggested lines they can copy, plus the option to add a name, phone number or page link. The risk is that a circle of businesses leaving similar comments, all at once, can look fake to Facebook, to group admins, and under Australian Consumer Law. This note records what official sources say, and the design choices that follow.

Findings
--------

### 1. Meta (Facebook) — spam, repetition and coordinated comments

Meta’s Spam policy says it does not allow content designed to deceive, mislead or overwhelm people, or to artificially increase viewership. It does not allow posting, sharing or engaging at very high frequencies, manually or automatically. It may also restrict accounts acting at *lower* frequencies when other spam signs are present, and it names “posting repetitive content” as one of those signs. Buying or exchanging engagement (likes, comments, follows and so on) is not allowed.

Source: https://transparency.meta.com/en-us/policies/community-standards/spam/

In April 2025 Meta said it would take more aggressive steps against spam networks that coordinate fake engagement, and that comments detected as coordinated fake engagement “will be seen less”.

Source: https://about.fb.com/news/2025/04/cracking-down-spammy-content-facebook/

Meta’s Inauthentic Behavior policy is aimed at networks of fake accounts, Pages or Groups used to deceive people or to dodge enforcement. A genuine member commenting from their own account is not the same thing. Even so, a group of real accounts posting near-identical comments on cue can still look like coordinated fake engagement under the spam rules above.

Source: https://transparency.meta.com/en-us/policies/community-standards/inauthentic-behavior

What this means for Rate Buddies:

- The app must never post the Facebook comment for the member.
- No two members should be given the same starter text for the same post, and starters should not be near-copies of each other.
- A starter is not enough. Each member should add a few of their own words, so the comment that lands on Facebook is not a shared script.
- Alerts should not all go out at the same moment. If twelve people comment in two minutes, that is the “spike” pattern both Meta and the ACCC treat as a warning sign. The live server should stagger alerts (for example, over a few hours). The preview can only show the advice.

### 2. Facebook groups — links, phone numbers and self-promotion

Each group sets its own rules. Many community groups ban self-promotion, unsolicited business messages, and comments that are mostly a website, price list or phone number. What is allowed in one Joondalup noticeboard may be removed in another.

Rate Buddies cannot know every group’s rules. The safe default is: do not put a link or phone number in the suggestion unless the member chooses to. If they do add a link, add only one. Remind them to check the group’s rules before they paste.

### 3. Australian Consumer Law (ACCC)

The ACCC says reviews should be independent and reflect the genuine opinion of the person who experienced the product or service. It is against the law for a business to create fake or misleading reviews, or to arrange for others to do so. This applies on a business’s own website, on review platforms, and on social media.

Signs the ACCC lists that a review may be fake include:

- a spike in highly positive or negative reviews over a short period
- generic reviews without specific detail about the business or product
- reviews written in similar language as other reviews for the same business or product

Reviews can also mislead if they are written by family, employees, or people paid by the business, without stating that connection; if they are written by someone who has not actually used the product or service; or if they are edited by someone else after being created.

Incentives (discounts, free gifts and the like) for a *positive* review risk breaching the law. If an incentive is offered at all, it must apply whether the review is positive or negative, and it must be clearly disclosed.

Source: https://www.accc.gov.au/consumers/advertising-and-promotions/online-reviews-for-product-and-services

business.gov.au states the same Australian Consumer Law position: it is illegal to create or arrange a fake or misleading review, and connections or incentives must be disclosed.

Source: https://business.gov.au/online-and-digital/online-reviews

The Federal Court has penalised businesses for fabricated testimonials, including cases where a franchisor induced franchisees to post false reviews.

Source: https://www.accc.gov.au/media-release/federal-court-orders-electrodry-franchisor-to-pay-215000-in-penalties-for-fake-testimonials

What this means for Rate Buddies:

- Members must only recommend Michael (or anyone else) if they genuinely know his work. The app should say so clearly, every time.
- Suggestions must not be generic praise. They should leave room for a specific job or how the member knows him.
- Rate Buddies must not pay, gift or otherwise reward someone for leaving a positive Facebook comment.
- If the member knows Michael as a fellow local business, they should be able to say so. Hiding that connection can mislead.
- The app must not silently rewrite the member’s words after they copy them.

### 4. Google’s review rules (useful even though this card is for Facebook)

Google allows a business to ask for a review of a genuine experience, but not to offer payment, discounts or free goods in return, and not to try to influence the rating or the wording. Merchants must not ask staff to solicit reviews that include specific content. Unusual volumes or patterns of reviews, and conflicts of interest (including competitors), are treated as rating manipulation.

Google also does not allow email addresses, phone numbers, social media links or links to other websites in Google reviews.

Sources:

- https://support.google.com/contributionpolicy/answer/7400114?hl=en
- https://support.google.com/contributionpolicy/answer/16597558?hl=en
- https://support.google.com/business/answer/3474122?hl=en

We already skip same-trade members on a recommendation request (conflict of interest). We should also treat suggested text as a *starter*, not a required script, and keep phone numbers and links off unless the member turns them on.

### 5. Nextdoor and other word-of-mouth apps

Nextdoor’s public position is that a recommendation should come from a real, verified neighbour who has actually used or chosen the business. It does not sell recommendations, and it does not use anonymous reviews. The value is first-hand, local word of mouth — not a bought or scripted endorsement.

Sources:

- https://blog.nextdoor.com/small-business-improvements
- https://business.nextdoor.com/en-us/small-business/faves
- https://about.nextdoor.com/press-releases/nextdoor-deepens-its-commitment-to-local-business-discovery-and-recommendations

That matches what Rate Buddies should aim for: a real person, a real experience, in their own words.

Design decisions for v1.8.1
---------------------------

1. **A short four-step card, not a wall of text.**  
   1. Pick a starter (three unique options, with a “More options” refresh).  
   2. Add your own words (required in spirit; a clear box and prompts).  
   3. Add details (name and business on by default; phone and links off).  
   4. Copy and open the Facebook post.

2. **Unique starters per request.**  
   Each member gets three starters that have not been issued to anyone else on that Facebook post. The preview keeps a ledger of issued texts and rejects exact and near-duplicate wording (the same approach as the existing review-ideas engine). A live server must do the same, for every member, not only the person using this phone.

3. **“Add your own words” is the main safeguard.**  
   Prompts: “How do you know Michael?”, “What job did he do for you or someone you know?”, “One thing you liked”. Quick-pick chips only start a sentence; the member still types. When they have added words, the card shows “Personal touch added ✓”. The copied text is: chosen starter + their own words + any details they turned on.

4. **Copy is labelled “Copy my recommendation”.**  
   If the own-words box is empty, show a gentle warning: “Add a few words of your own so it doesn’t look copied.” A second tap still copies, so we do not trap them, but we do not hide the risk. After a copy: “Copied — now paste it on Facebook”, with “Open post on Facebook” kept prominent. “I recommended Michael” still marks the card done.

5. **Details and links are conservative.**  
   Name and business can be in the starter. Phone, Facebook page, website and Rate Buddies profile are off by default. At most one link can be on at a time. A short note reminds the member to check the group’s rules. The featured member can allow or block phone, Facebook page, website and profile in My profile → Recommendation details.

6. **Stagger alerts (live).**  
   The preview shows a tip that comments look more natural if they do not all land at once. The live backend should space member alerts over hours, not send twelve pushes in one minute.

7. **Bottom tip.**  
   “Make it yours: tweak a word or two before posting. Only recommend Michael if you genuinely know his work.”

8. **Fictional data only in this preview.**  
   Michael Shaw, Shaw Plumbing, 0400 000 114, facebook.com/shawplumbing.demo, and a fictional Rate Buddies profile link.

What the live backend must do
-----------------------------

- Keep a per-post ledger of every starter issued, and never issue the same or a closely similar starter twice.
- Allocate starters when a member opens the card, and keep them reserved even if the member hits “More options” (old ones stay used).
- Stagger alerts to members in that city (same trade excluded) over a period of hours.
- Never post to Facebook, never edit the member’s copied text after they leave the screen, and never reward a positive comment.
- Respect each featured member’s Recommendation details settings.
- Store the member’s own words only on their device unless they later choose to save a draft (not required for launch).

Sources (real URLs only)
------------------------

- https://transparency.meta.com/en-us/policies/community-standards/spam/
- https://transparency.meta.com/en-us/policies/community-standards/inauthentic-behavior
- https://about.fb.com/news/2025/04/cracking-down-spammy-content-facebook/
- https://www.accc.gov.au/consumers/advertising-and-promotions/online-reviews-for-product-and-services
- https://business.gov.au/online-and-digital/online-reviews
- https://www.accc.gov.au/media-release/federal-court-orders-electrodry-franchisor-to-pay-215000-in-penalties-for-fake-testimonials
- https://support.google.com/contributionpolicy/answer/7400114?hl=en
- https://support.google.com/contributionpolicy/answer/16597558?hl=en
- https://support.google.com/business/answer/3474122?hl=en
- https://blog.nextdoor.com/small-business-improvements
- https://business.nextdoor.com/en-us/small-business/faves
- https://about.nextdoor.com/press-releases/nextdoor-deepens-its-commitment-to-local-business-discovery-and-recommendations
