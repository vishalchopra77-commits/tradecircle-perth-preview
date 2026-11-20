Rate Buddies — automatic recommendation requests
================================================

Plain-language plan for using Devi with Rate Buddies. This is the v1.8.0 matching rule, with v1.8.1 recommend-text and tutorial additions, and the v1.8.2 Rate Buddies name. Nothing here is live yet, and all sample posts and members are fictional.

How it works
------------

1. You join the local Facebook groups you care about (you do not need to be the group admin).
2. Devi, a Chrome add-on, watches those groups for phrases such as “recommend a plumber” or “anyone know a good electrician”.
3. When it finds a post, Devi sends a short alert to a Rate Buddies webhook: the post link, the group name, a short snippet of the text, the keyword that matched, and the time. It should not send the full thread or anything extra.
4. The Rate Buddies server reads the snippet, works out the trade (from the 456 business types) and the city (a suburb such as Joondalup is mapped to Perth). It then picks a featured Rate Buddies member of that trade in that city — the person other members will be asked to recommend. If several members share the trade, the next person in the promotion queue is chosen, and you can change who is featured in Incoming requests. Members of the same trade are never alerted (conflict of interest). If no member of that trade lives in the city, the request cannot be approved, because there is no one to help.
5. The server then notifies you through the channel you chose — Grok Bot by default, or email, SMS or a phone push. The message looks like:

   New recommendation request: Plumber wanted in Perth (Joondalup post), from Joondalup Community Noticeboard, 92% match, 12 Perth members will be alerted to recommend Michael (Plumber).
   [Approve]  [Edit]  [Dismiss]

6. You tap Approve. That is the only step you have to take. A signed one-tap link (an approve address with a secret token) can also be opened from email or SMS.
7. Rate Buddies then publishes the request to the Recommend feed and alerts every member in that city except people in the same trade. Their notification reads: Facebook recommendation alert for “Plumber” — Let’s help Michael! They open the Facebook post themselves and only vouch for Michael if they genuinely know his work.
8. When a member has recommended Michael, they tap “I recommended Michael”. You do not need to do anything else in admin.

Grok Bot can receive these alerts through a routine webhook trigger: when the Rate Buddies server posts a new match, the bot messages you the Approve / Edit / Dismiss card.

The default is Review first, so nothing reaches members until you approve it. You can later turn on Auto-publish for high-confidence matches if you want the strongest ones to go out on their own.

What is in this prototype
-------------------------

- Admin → Devi automation: connection status, the placeholder webhook, keyword ideas, approval channels, Review first / Auto-publish, match rules (city-wide alert, same-trade members never alerted), and a confidence slider.
- Admin → Incoming requests: a list of fictional Devi matches, including a strong plumber-in-Perth example that features Michael from Shaw Plumbing (Liam is the other Perth plumber, and you can switch who is featured), a pest-control request that features Jamie and is not sent to him, a low-confidence handyman example, and a Broome hairdresser request with no featured member, which cannot be approved. Approve & alert, Edit trade or city, Change featured member, and Dismiss all work in the preview.
- A Simulate Devi alert button that injects another sample match (a locksmith in Osborne Park, featuring Chris) and pretends to send you the Approve card.
- Member notifications, the Recommend feed card (Michael’s avatar and business, “Open post on Facebook”, “I recommended Michael”), and a “Requests in your city” count on Home — showing what members see after you approve.
- There is no real Devi connection and no real server. Nothing is sent to Facebook.

What is needed to go live
-------------------------

- A Rate Buddies backend with a webhook such as https://api.ratebuddies.com/hooks/devi/<token>, and signed approve links such as https://api.ratebuddies.com/hooks/approve/<id>?token=...
- A secret token so only Devi (and your approve links) can post in.
- Matching logic that maps a place to a city, picks a featured member of that trade in the city (fair rotation / promotion queue), counts every member in the city except the same trade, and blocks approval when no one of that trade exists there.
- A notifier that calls Grok Bot (a routine webhook trigger is enough to start), and optionally email, SMS or push, naming who will be featured.
- On Approve: publish to the Recommend feed and alert those members to recommend the featured person. On Dismiss: store the decision and do not alert anyone. On Edit: let you fix the trade, city or featured member, then approve.
- A Devi subscription. The starter plan is about $19 a month for 25 groups, then about $2 for each extra group (check Devi’s current prices before you pay).
- A keyword list in Devi, starting with the suggestions on the Devi automation page (for example “recommend a plumber”, “anyone know a good electrician”, “looking for a hairdresser”).

Things to be careful about
--------------------------

- Devi’s terms say you should not send group data off your computer to other servers without the platforms’ permission. Keep the payload light: post link, group name, a short snippet, the keyword and the time — not the full thread or member lists from Facebook.
- Facebook can treat a group of accounts that recommend each other on cue as fake engagement. Members must only recommend people they genuinely know or have worked with, in their own words. The app shows this tip on every request. Rate Buddies must never post the comment for them.
- This preview uses fictional groups, posts and members only.


v1.8.1 additions
----------------

- Unique starters are issued from a per-post ledger and never reused. Members must add their own words. The live server must keep this ledger and stagger alerts over a period of hours.
- See RECOMMEND-TEXT-RESEARCH.md.


v1.8.2
------

The product name is Rate Buddies. Webhook examples use https://api.ratebuddies.com/hooks/devi/<token>.
