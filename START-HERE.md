# START HERE — TradeCircle Perth (Facebook Business Marketing)

This folder is a hand-off pack for another AI assistant (Claude, ChatGPT, or similar) so work can continue from these files.

**Owner:** Vishal Chopra, pest controller, Perth, Western Australia.  
**Project folder name (working title):** Facebook Business Marketing.  
**App placeholder name:** TradeCircle Perth — this is a temporary name only. It can be changed.  
**Current prototype version:** v1.5.4 (17 November 2026, Australia/Perth).  
**What this is:** a clickable HTML/CSS/JavaScript UI prototype (mock), not a real shipped app. Nothing is sent to Facebook or Google. All member names, businesses, ratings, chats, reviews and photos in the prototype are fictional.

---

## 0. Work on the online copies, not the Mac

Vishal wants him, Claude, ChatGPT and any other assistant to work **centrally on the online versions**, not in his Mac folder. His Mac will be updated later, once a version is finished.

- **Source of truth:** [github.com/vishalchopra77-commits/tradecircle-perth-preview](https://github.com/vishalchopra77-commits/tradecircle-perth-preview)
- **Live preview:** [vishalchopra77-commits.github.io/tradecircle-perth-preview](https://vishalchopra77-commits.github.io/tradecircle-perth-preview/)
- **How the real app will be built:** [TECH-PLAN.md](TECH-PLAN.md) (and the Google Doc of the same name, if present)
- **This Google Drive folder** is a **backup copy** of the files and this hand-off pack, so work can continue if a chat hits a usage limit.
- How to continue, the standing rules, version numbering, and how to deliver a new version are in **AI-INSTRUCTIONS.md** (and in the Google Doc of the same name, if present). Read that file before you change anything.

---

## 1. Project concept

Vishal is a pest controller. He wants a referral circle of local tradespeople (pest control, carpenter, painter, plumber, and other trades).

The real-world behaviour is:

- Members of the circle are also friends on Facebook.
- They meet in person every week. Those weekly meetups are **offline only**. They are not a feature in the app.
- When someone asks in a Facebook group, for example “Can you recommend a pest controller?”, circle members who know that person comment and recommend them, and tag their business page. The same happens when someone asks for a plumber, painter, carpenter, and so on.

The app’s job is to make it easy for tradies to find each other, become Facebook friends, and later leave genuine Google reviews for businesses they have actually used.

A coordinated or fake-looking recommendation can get Facebook accounts flagged, and Australian Consumer Law requires recommendations to be genuine. The plan is that members only vouch for people they have actually met or used, and can honestly say something like “I know him personally”, because they meet weekly and are friends on Facebook.

---

## 1a. Later build decisions (16 November 2026)

- Vishal already has Apple App Store and Google Play developer accounts.
- The real product will be **one app for iPhone and Android**, not two separate apps. The recommendation (React Native with Expo) and the reasons are in [TECH-PLAN.md](TECH-PLAN.md).
- Files and hosting will be on **AWS**, in the Sydney region (`ap-southeast-2`).
- The app is **free for now**. A subscription can be added later. Prices are not set. Use the label **“Price to be set”**. Do not invent a price. When a paid plan is sold inside the store apps, payment must go through Apple and Google billing — see TECH-PLAN.md.

## 2. What the app should do (agreed so far)

### Profiles and regions

- Tradies download the app and create a profile with their trade and a Facebook profile link.
- During profile setup, each tradie picks which **Perth regions** they want to join. They can join **more than one**. Example regions discussed: Hills, Kwinana, North, South (and Perth metro more broadly).
- All of a tradie’s areas are shown **together in one list** (one card of chips), not in separate per-region sections. There is a **Join all Perth metro** option that selects every region at once. Turning it off returns to their previous manual picks. They can change this later from **Your areas** or Edit profile.
- Weekly meetups stay offline. Region choice in the app is only about who appears in the member list.

### Finding members

- Members can browse other members.
- A filter shows either **members in my areas** or **everyone across Perth metro**. “My areas” shows people from **all** of the member’s areas in one combined list, with a Your areas summary at the top.
- Search by typing, with autocomplete suggestions for trades (and members). Typing “plu” should suggest Plumber. The same type-ahead is used on the trade picker during profile setup.

### Facebook

- Sign-up has **Sign up with Facebook**.
- There is also **Continue with Facebook** / **Connect Facebook** so a tradie can connect their Facebook in one tap.
- One-tap Facebook sign-up can reasonably bring in a name and photo. It **cannot reliably** bring in a public profile URL that works for sending friend requests. Facebook must approve the app before it shares that link (`user_link` permission + App Review; Advanced Access also needs Business Verification), and even then Meta’s docs say the official link may only open for people who are already connected. So the prototype keeps a **“paste your Facebook link” fallback**, and **Add friend** uses that pasted link.
- Every member card has a Facebook-style button: **Add friend**, **Request sent**, or **Friends ✓**.
- Member profiles and cards show Facebook friend status: already friends, request pending, or not connected yet.

### Google Business Profile and reviews

- Members can connect a **Google Business Profile** (one-tap connect in the prototype, plus paste-a-review-link fallback).
- Other members can leave a Google review.
- Member profiles show whether this member has left a review or not, and you can send a **Google review request** with as few taps as possible.
- **Review ideas / suggestions only — not finished, pre-written, or copy-and-paste-ready reviews, and not duplicate or identical reviews reused again and again.**

  This is a hard product rule, not a nice-to-have.

  Vishal originally asked for reviews generated with the business name, person name, and so on. That part is allowed as *ideas*. The app must **not** hand someone a finished review to post, and must **not** generate swapped or ready-made reviews between businesses.

  Reasons:

  - Google treats fake, incentivised, or conflict-of-interest reviews (including between affiliated businesses) as a policy violation. It can remove the reviews and suspend the business profile. Google has also said it will tighten this further from April 2026 (including bans on staff review quotas and on asking for specific content or staff names). Source: Google Maps User-Generated Content Policy — Prohibited and restricted content: https://support.google.com/contributionpolicy/answer/7400114?hl=en
  - Under Australian Consumer Law, as explained by the ACCC, fake or misleading reviews are illegal and can mean fines. Reviews must be genuine and independent. Similar wording or generic reviews are a warning sign. Source: ACCC — Online reviews: https://www.accc.gov.au/business/advertising-and-promotions/online-reviews-for-product-and-services

  What the prototype does instead: a “help me write” / review ideas helper. The member picks a **real job** they actually had done (service, suburb, month, what stood out). The app then shows **different sentence starters / suggestions** that mention the business, the person, the service and the suburb naturally. Ideas already shown for that business in the session are not reused. The member writes or edits the final review in their own words, then can copy it and open Google. A notice says: “Only review businesses you have actually used. Write in your own words.” A simple uniqueness check warns if the draft looks too similar to an earlier suggestion for that business. This only works for members who have really used each other’s services.

- The Reviews tab lists review requests received and sent.

### In-app chat and notifications

- Full internal chat between members, in the style of WhatsApp or Messenger, with push notifications.
- One-to-one messages, plus a group chat for each region.
- Chat features in the prototype: search, pinned chats, unread badges, online / last-seen, typing, read ticks, replies, emoji reactions, voice notes, photos, files, location, link previews, shared member profile cards, @mentions in region groups, message edit/delete (demo), mute, block or report, and quick actions such as “Send review request” and “Share my profile”.
- Push notifications for messages, review requests and new members, with on/off switches and quiet hours. The prototype includes a lock-screen mock, an in-app notifications centre, and notification settings.

### AI assistant (v1.5)

- Members can connect their own Grok, ChatGPT, Claude or other assistant (prototype mock only — nothing is sent).
- Voice commands while driving: updates, read messages, reminders, navigation, queue position and recommendation alerts.
- Friend requests and Google reviews are **never sent automatically**. The assistant opens the Facebook profile or Google review page, and the member taps the button.

### Recommendation alerts and promotion queue (v1.5)

- Paste a Facebook post, pick the trade, send to the circle. Members get a push alert and a card with Open post, comment ideas (suggestions only) and “Done, I commented”.
- Promotion queue: everyone takes a free turn. Jumping the queue is later, labelled **Price to be set**. No payment is taken in the prototype. A real paid jump in the iPhone or Android app would go through Apple or Google billing; a website payment could use Stripe.

### Super admin (v1.5.1)
The admin home screen now shows gradient KPI cards, weekly charts, recent profile requests you can approve or decline on the spot, a recent activity feed and a promotion-queue preview. The header has search, notifications and your avatar. Every sidebar item and button has an icon. On a phone, a bottom bar covers the main sections, and a menu drawer opens the rest.

### Super admin (v1.5)

- A separate, mobile-friendly web dashboard (`admin.html`) for Vishal as super admin.
- New profile requests can be approved or declined. New members see **Awaiting approval** until they are approved.
- Also: members, regions, trades, alerts log, queue, reports, chat moderation, plans, AI settings, broadcasts and an audit log. Demo login only.

### Subscription (v1.3, unchanged in later versions)

- The app is free for now. A **Subscription** screen shows the Free plan (current, everything included) and a **Pro (coming later)** card with the label **Price to be set**.
- Details of how a later paid plan would work, including store billing rules, are in [TECH-PLAN.md](TECH-PLAN.md).

### Navigation

- A **hamburger / burger menu** (three lines) at the top-left opens a slide-out drawer, so many items can fit.
- Drawer: profile header, then Members, Chats, Reviews, Notifications, My profile, Your areas, Facebook connection, Google Business Profile, Invite a tradie, Help, Settings, Sign out.
- Bottom tabs stay for the main areas: Members, Chats, Reviews, My Profile. A bell at the top-right opens notifications.

---

## 3. Version history

All earlier versions were archived, not deleted.

| Version | When (Australia/Perth) | What it added |
|---|---|---|
| **v1** | 16 Nov 2026, about 7:39–7:56 am | First 13 clickable screens: welcome, sign in, sign up, create profile, pick regions, a pending-approval screen (not yet decided — see open questions), members list with “My areas” and “All Perth metro” filters and a trade filter, member profile with “Open Facebook profile”, my profile, edit profile, settings. Placeholder name TradeCircle Perth. All members are made up. |
| **v1.1** | 16 Nov 2026, about 8:06–8:15 am | “Sign up with Facebook” and “Continue with Facebook”, Connect Facebook (mock consent), paste-your-Facebook-link fallback, Disconnect, **Add friend** on every member card, and typing search with autocomplete for trades and members (also on the trade picker). |
| v1.2 | 16 Nov 2026, about 8:26–8:28 am | Hamburger menu; Google Business Profile connection; Facebook friend and review status on every member, with filters such as “Not friends yet” and “Need my review”; Reviews tab with one-tap review requests; review **ideas** helper (not finished reviews); full in-app chat; push notification mocks and settings. |
| v1.3 | 16 Nov 2026, about 9:47 am | Subscription screen (Free now, Pro later, **Price to be set**); [TECH-PLAN.md](TECH-PLAN.md) for one iPhone-and-Android app, AWS in Sydney, security and store rules. |
| v1.4 | 16 Nov 2026, about 10:02 am | Your areas shown together in one list; **Join all Perth metro** (turn off to return to your own picks); Members “My areas” stays a combined list with a Your areas summary card; member cards drop region labels and use small Facebook and review icons instead of crowded status text. |
| **v1.5.4 (current)** | 17 Nov 2026, about 3:15 am | Copy buttons on suggested review and comment text; unique combinatorial idea engine with focus chips (see REVIEW-IDEAS-RESEARCH.md); daily Google review cap of 3 per business, Perth midnight reset, lock banner when full; profile website and social links; Google G for reviews and Facebook f for the promotion queue; typed icons on notifications, Home feed, settings and admin activity. |
| **v1.5.3** | 17 Nov 2026, about 2:25 am | Home member dashboard as the first tab; Chat in the top bar next to the bell; sign-in lands on Home. |
| **v1.5.2** | 17 Nov 2026, about 2:15 am | Facebook promotion queue on the bottom menu, a home card and a profile row. Five-tab bar: Reviews, Facebook, Chat, Queue, More (apps grid with search). |
| **v1.5.1** | 16 Nov 2026, about 10:50 am | Polished super admin (icons, gradient KPIs, charts, approve/decline on the dashboard, activity feed, queue preview, search and notifications). Mobile bottom nav. Alert headlines such as “Someone’s asking for a pest controller”. |
| **v1.5** | 16 Nov 2026, about 10:40 am | First and last name fields; new members wait for admin approval; AI assistant (mock, voice commands open pages to tap); chat photo/file/emoji; 241 Australian trades; super admin dashboard; Facebook-style friend buttons; Review back; recommendation alerts; promotion queue (jump later, price to be set). |

---

## 4. What is only a prototype / mock

Treat everything in these files as a **design preview**, not a backend or a production app.

- Facebook Login, Facebook consent, and Google Business Profile consent are on-screen mocks. Nothing is sent to Facebook or Google.
- Chat messages, friend-request status changes, and review drafts in the preview stay on the device only (in the browser).
- Push notifications are a lock-screen mock plus in-app UI, not real device push.
- Ratings, review counts, online status, and member data are fictional.
- “Create group”, some chat actions (edit/delete), and similar controls are demo behaviour.
- There is no real user accounts system, no real notifications service, and no live Facebook or Google API.

For a real build, read [TECH-PLAN.md](TECH-PLAN.md) and the Facebook Login notes in `README.md`. In short: name and photo are the easy part (`public_profile`); a usable friend-request profile URL is not guaranteed even after `user_link` App Review; keep the paste-link fallback.

---

## 5. Open questions (not decided yet)

1. **App name.** TradeCircle Perth is still a placeholder.
2. **Paid plan and queue jump prices.** Not set. Always use “Price to be set”. Do not invent a price.

Decided in v1.5: new members wait for Vishal to approve them.

Other context from earlier discussion, not yet locked as product rules: the circle is aimed at Perth trades (pest control, carpenter, painter, plumber, and similar). Regions mentioned so far are Hills, Kwinana, North and South, plus an All Perth metro view.

---

## 6. What’s in this Google Drive folder

```
TradeCircle App - Mac Files/
  START-HERE.md                          ← this file (plain text)
  START-HERE                             ← same content as a Google Doc, if present
  AI-INSTRUCTIONS.md                     ← rules and delivery process for assistants
  AI-INSTRUCTIONS                        ← same content as a Google Doc, if present
  TECH-PLAN.md                           ← how the real iPhone and Android app would be built
  TECH-PLAN                              ← same content as a Google Doc, if present
  TradeCircle-Perth-v1.2.zip             ← easiest download of the current prototype
  ui-v1.2.tgz                            ← same v1.2 files as a .tgz bundle
  v1.2 (current)/                        ← full unpacked current prototype
    index.html
    TradeCircle-Perth.html               ← same prototype, CSS/JS inlined
    styles.css, v12.css, app.js, v12.js
    README.md                            ← detailed v1.2 notes and policy sources
    overview.png, overview-chat.png
    fonts/                               ← required next to the HTML
    screens/                             ← screen screenshots
  Archive/
    TradeCircle-Perth-v1.zip
    TradeCircle-Perth-v1.1.zip
    ui-v1.tgz
    ui-v1.1.tgz
    v1/                                  ← unpacked v1, if present
    v1.1/                                ← unpacked v1.1, if present
```

The `.zip` files are the easiest way to download a whole version and open it locally.

---

## 7. How to open the prototype

1. Download **TradeCircle-Perth-v1.2.zip** and unzip it, or download the whole **v1.2 (current)** folder and keep its subfolders together.
2. On a computer: open `index.html` or `TradeCircle-Perth.html` in a web browser. `index.html` shows a desktop chooser with a phone frame and a list of screens on the right. `TradeCircle-Perth.html` is the same app with CSS and JavaScript inlined.
3. On a phone: open the same HTML file (or the hosted page, if one is published later) and the app should go full screen.
4. Keep the `fonts/` folder beside the HTML. `index.html` also needs `styles.css`, `v12.css`, `app.js` and `v12.js` in the same folder. Screenshots in `screens/` are previews only; they are not required to run the prototype.
5. Useful deep links once `index.html` is open: `#members`, `#member/liam`, or `?shot=welcome` (shot mode is 390×844, no studio chrome).

To compare older versions, unzip the matching file in **Archive** and open that copy of `index.html`. Do not mix files from different versions in the same folder.

---

## 8. Guidance for an assistant continuing this work

- Read AI-INSTRUCTIONS.md and follow it. Work on the GitHub / Drive copies, not the Mac folder. For the real build, also read [TECH-PLAN.md](TECH-PLAN.md).
- Stay on this project (Facebook Business Marketing / TradeCircle Perth). Do not invent a different product.
- Use “TradeCircle Perth” only as a placeholder name unless the owner chooses a new name.
- Keep weekly meetups offline. Do not add them as an in-app feature unless the owner asks.
- Do not add pre-written, auto-posted, swapped, or duplicate Google reviews. Keep the ideas/suggestions helper, and keep the “write in your own words / only review businesses you have actually used” warning.
- Keep the Facebook paste-link fallback. Do not claim that one-tap Facebook Login will always produce a working “send friend request” URL.
- All demo data must stay fictional. Do not put secrets, real customer data, passwords, or API keys in the files or in chat.
- Ask the owner one question at a time, in plain non-technical words, when a decision is needed.
- If you estimate build time, say clearly what is already only a UI mock and what would have to be built for real (accounts, Facebook Login and App Review, Google Business Profile APIs, real chat, real push notifications, member approval if chosen, and hosting).

---

*Pack written 16 November 2026, Australia/Perth, from the v1.2 prototype and the owner’s decisions up to that date.*
