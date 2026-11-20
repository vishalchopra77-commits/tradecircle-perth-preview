# Rate Buddies — project overview

**Version:** v2.0 (design + connected test app) · **Date:** 20 November 2026, Australia/Perth  
**Owner:** Vishal Chopra  
**Domains:** [ratebuddies.com](https://ratebuddies.com), [ratebuddies.app](https://ratebuddies.app)

This is the full product overview for Rate Buddies. For a short take-over note see [HANDOFF.md](HANDOFF.md). For how an AI or developer should work, see [INSTRUCTIONS.md](INSTRUCTIONS.md). Testing steps are in [TESTING.md](TESTING.md). HTML and PDF copies of these files sit next to the Markdown.

All member names, businesses, chats, reviews and photos in the prototype and the test database are **fictional**. The app does not yet send Facebook comments, friend requests, or Google reviews.

---

## 1. What it is

Rate Buddies is a referral circle for local Australian businesses (trades and other physical / local services). Members meet in person every week — those meet-ups stay **offline**, not in the app — and are friends on Facebook.

When someone asks in a Facebook group for a recommendation (for example “recommend a plumber in Joondalup”), circle members who **genuinely know** that person can vouch for them in the group, in their own words. Members can also leave genuine Google reviews, only after a real job, in their own words, with a daily cap of 3 per business.

Vishal Chopra is a pest controller in Perth, Western Australia. He is the product owner and super admin.

The current software is a **clickable HTML/CSS/JavaScript prototype** plus:

- a web admin (`admin.html`)
- a Capacitor 6 Android wrapper (`appId` `com.ratebuddies.app`)
- a free Supabase test project so the phone app and the web admin share the same data

The long-term plan is one real iPhone and Android app, hosted on AWS in Sydney. See [TECH-PLAN.md](TECH-PLAN.md). AWS sign-up was started but is waiting on the account-owner email. The account name is “Rate Buddies”.

The GitHub repository and many filenames still say **TradeCircle** so existing preview links keep working. The in-app JavaScript API is `window.TradeCircle` / `T()`. The on-screen name is **RATE BUDDIES** (all caps), with a royal-blue four-buddy logo.

---

## 2. Links

| What | URL |
| --- | --- |
| GitHub (source of truth) | https://github.com/vishalchopra77-commits/tradecircle-perth-preview |
| Live preview (GitHub Pages) | https://vishalchopra77-commits.github.io/tradecircle-perth-preview/ |
| App | https://vishalchopra77-commits.github.io/tradecircle-perth-preview/RateBuddies.html |
| Web admin | https://vishalchopra77-commits.github.io/tradecircle-perth-preview/admin.html |
| Latest debug APK | https://github.com/vishalchopra77-commits/tradecircle-perth-preview/releases/download/apk-latest/app-debug.apk |
| v2.0 design PNGs | [`screens/v2.0/`](screens/v2.0/) |
| v2.0 on GitHub | commit `162fa7f` on `main` (20 Nov 2026) |

Google Drive is the backup of the files. Vishal’s Mac Projects folder is a local copy, not the source of truth.

---

## 3. User roles

| Role | Who | What they can do |
| --- | --- | --- |
| **Visitor / applicant** | Someone creating an account | Welcome slides, sign up (email or phone; Facebook is still a mock), fill business and areas, send for approval. They wait on the Awaiting approval screen. |
| **Approved member** | A local business Vishal has approved | After the mandatory intro video, they use Home, Reviews, Facebook (Circle / Recommend / Queue), More, chat, notifications, profile, settings, tutorials, subscription. |
| **Featured member** | The same-trade member named on a recommendation request | Rotated fairly among members of that trade in that city. The alert says “Let’s help [Name]!”. They are not asked to recommend themselves. |
| **Super admin** | Vishal (and the admin test account) | Signs in only at the web admin. Approves or declines profiles, reviews Devi incoming requests (Approve / Edit / Dismiss), manages members, regions, trades, the queue, tutorials (including the pinned intro), reports and settings. |

New members **must** wait for admin approval before they appear in the circle. That was decided in v1.5.

Test emails (passwords are **not** in this repo — ask Vishal):

- `admin@ratebuddies.test` — web admin only
- `jamie@ratebuddies.test` — approved member (pest control, Perth)
- `michael@ratebuddies.test` — approved member (plumber, Perth)
- Nina Kaur (Kaur Tiling) is usually a pending applicant

Turn **Demo (offline)** off to use the shared test database. Demo mode only browses sample screens and does not change live data.

---

## 4. Screens and features

### 4.1 Phone app — sign up and first run

- **Welcome (`welcome`)** — v2.0 swipeable image slides (short headline + one line, dots, Skip / Next). The last slide shows Continue with Facebook, Create account, and Sign in. Much less text than v1.9.
- **Sign in (`signin`)** — email and password against Supabase. Demo (offline) toggle.
- **Create account** — step 1 of 3: Facebook (mock), email, or phone. Then name (`signup-name`). Then **Business and areas** (`create-profile`): business name, **trade / profession starts empty** with the placeholder “Choose your profession”, optional ABN, phone, and areas. Send for approval.
- **Choose areas (`create-regions` / `choose-areas` / `my-regions`)** — pick a state, then Metro and Regional accordions on one list (Metro open first). Multi-select regions. A tip explains that Google rewards nearby reviews, so members should only pick areas they really work in. **The scroll position must stay put** after a tap, toggle or accordion — it must not jump to the top. This is the default everywhere in the app.
- **Awaiting approval (`pending`)** — profile stays hidden until a super admin approves it.
- **Intro video (`intro-video`, then `intro-done`)** — mandatory and unskippable on first login after approval. Continue stays locked until the video has been watched (about 90%; seeking to the end does not count). It then points the member to Video tutorials. The current clip is a sample placeholder.
- **Complete your profile (`complete-profile`)** — fill or skip extra fields after approval. A “Finish your profile” card appears on Home if skipped.

### 4.2 Phone app — main tabs

Bottom tabs: **Home, Reviews, Facebook, More**. Chat and notifications sit in the header, with unread badges. A hamburger drawer is also in the header.

- **Home (`home`)** — greeting, Google reviews card (received / given, daily cap, Review back), Facebook card (queue place, circle in queue). (Google counts on Home are still sample numbers — see open issues.)
- **Reviews (`reviews`)** — people who left you a Google review, Review back, daily-limit lock, link to the review-ideas helper. Reviews use the Google **G** icon.
- **Facebook (`fb-recommend` / Circle / `promo-queue`)** — one tab with a segment control: **Circle | Recommend | Queue**, Facebook **f** icon.
  - **Circle** — members in your areas (and all-metro), trade search, friend status, Add friend (opens Facebook; the app never sends the request).
  - **Recommend** — admin / Devi requests. See §5 and §6.
  - **Queue** — Facebook promotion queue. See §9.
- **More (`more`)** — searchable grid: My profile, Promo queue, Alerts, AI assistant, Your areas, Reviews, Chat, Facebook, Settings, Notifications, Subscription, Invite, Help, Sign out, and a prototype Demo sign-up shortcut.

### 4.3 Phone app — other screens

- **Member profile (`member`) and My profile (`me`)** — cover photo (trade cover; do not swap the barber cover), avatar, trade, areas, about, years in business, expertise, licences, links, gallery, ideal referral partner, goals, review status, message, leave / ask for a Google review, Add friend.
- **Edit profile (`edit-profile`)** — name, trade, links, areas.
- **Chat (`chats`)** — one-to-one and a group per region, search, pinned, unread badges. Individual threads exist in the prototype.
- **Notifications (`notifications`)** and **Notification settings (`notif-settings`)**.
- **Recommendation alerts (`rec-alerts`, `rec-alert`, `rec-compose`)**.
- **Review ideas (`review-ideas`)** — suggestions only, not finished reviews. Copy button. Unique ideas per member. The member must write the final review in their own words.
- **Video tutorials (`tutorials`, `tutorial-play`)** — sections and videos from the admin list. The intro is the first pinned section (“Start here”).
- **Subscription (`subscription`)** — Free now; Pro coming later, always labelled **Price to be set**. No in-app payment yet.
- **Settings (`settings`)**, **Help (`help`)**, **Invite (`invite`)**, **AI assistant (`ai-assistant`, `ai-voice`)** (mock).
- **Lock screen (`lockscreen`)** — desktop preview chrome only. The fake iOS “9:41” bar must **not** show on a real phone or in the APK.

### 4.4 Web admin

Desktop-first (also usable on a phone). Pages include:

Dashboard · Profile requests · Members · Regions · Trades & businesses · Recommendation alerts · Facebook recommendations · Promotion queue · Reports · Chat moderation · Devi automation · Incoming requests (Devi inbox) · Video tutorials (Introduction video is the **first pinned** section, not a separate page) · Subscriptions · AI integrations · Broadcast · Settings · Audit log.

The admin and the phone app share the same Supabase test data when Demo (offline) is off.

---

## 5. Devi recommendation flow

Devi (ddevi.com) is meant to catch a Facebook group post such as “recommend a plumber in Joondalup”. The app maps the suburb to a city. An AI agent (Grok card) notifies Vishal with **Approve / Edit / Dismiss**. When he taps Approve, the rest is automatic.

**Rules Vishal confirmed — do not change these:**

1. The alert goes to **all members in that city except members of the same trade** (conflict of interest). A plumber is not asked to recommend another plumber.
2. The alert wording is like: **Facebook recommendation alert for “Plumber” — Let’s help Michael!**, naming the **featured** member of that trade.
3. Featured members **rotate fairly**. The admin can switch who is featured on a request.
4. If **no member of that trade is in the city**, the request **cannot be approved**.
5. After members mark “I recommended [Name]”, progress should update on the request in the admin.

The current test seed usually has a Joondalup Community Noticeboard plumber request waiting, featuring Michael Shaw (Shaw Plumbing), city Perth. Push notifications and a **real Devi webhook** are not built yet (planned with AWS). Incoming requests can be simulated in the admin for testing. Suburb-to-city mapping lives in `devi-city.js`.

---

## 6. Recommend card

Shown on Facebook → Recommend when a request has been approved. Research and policy notes: [RECOMMEND-TEXT-RESEARCH.md](RECOMMEND-TEXT-RESEARCH.md) and [recommend-text-research.html](recommend-text-research.html).

**Rules:**

1. **Pick a starter.** Each member gets unique suggested texts for that Facebook post. No two members get the same wording on the same post. “More options” can offer a fresh set; used wording is not reused.
2. **Add your own words (required intent).** Members must add a few of their own words (how they know the person, what job they did, one thing they liked) so comments do not all look the same to Facebook. The card should show when a personal touch has been added. If they try to copy without their own words, warn them once, then allow a second tap.
3. **Optional details** the member can include: name, business, phone, Facebook page, profile link. Phone and links stay off unless the member turns them on. On My profile, a member can choose which details others are allowed to share.
4. **Copy** (“Copy my recommendation”) copies the starter + their own words + any details they chose. Then they paste it on Facebook themselves. **Open post** opens the Facebook group post. “I recommended [Name]” marks it done.
5. The app **never posts** the comment, never sends a friend request, and never posts a Google review. The member does that themselves.
6. Members only vouch for people they **genuinely know**. Tip copy reminds them of this.
7. When this goes live, alerts in a city should be spread out over a few hours so a burst of similar comments does not land at once.

---

## 7. Video tutorials and the intro

- The admin creates **sections** and adds **YouTube or Vimeo** links with titles and descriptions.
- **Introduction video** is the first pinned section inside Video tutorials. It cannot be reordered or hidden. Replacing it archives the previous intro (nothing is deleted).
- After a member’s profile is approved, their first login is the intro. It cannot be skipped. When it ends, they are pointed to More → Video tutorials, then to Complete your profile.
- Continue stays locked until they have actually watched about 90% of the video. Seeking to the end does not count.
- Sample / prototype clips may still be labelled “Sample video — placeholder only”.

Implementation: `tutorials-store.js`, `v181.js` / `v181.css`, `admin-v181.js`.

---

## 8. Regions

Australia-wide area picker (v1.6.1–v1.6.2), in `locations.js` (`window.TC_LOCATIONS`).

Hierarchy: **State / Territory → Metro or Regional → Region**. No suburb list in the picker (Devi maps a suburb to a city separately).

After the state, Metro and Regional are accordions on one screen (Metro open first). Members can select many regions, including in more than one state (“Add areas in another state”). “Join all [metro]” selects every area in that list; turning it off returns to their own picks. A summary of chosen areas appears on sign-up and My profile.

**Western Australia metro ids must stay exact** (do not rename or replace them):

`hills`, `kwinana`, `north`, `south`, `east`, `central`, `fremantle`, `rockingham`, `joondalup`, `armadale`.

WA regional ids use a `wa-` prefix (Peel, South West, Great Southern, Wheatbelt, Goldfields-Esperance, Mid West, Gascoyne, Pilbara, Kimberley).

---

## 9. Business types (456)

The profession picker covers all physical / local businesses, not only traditional trades. The list is in `trades.js`:

- `window.TC_TRADES` — 456 unique names
- `window.TC_BUSINESS_CATEGORIES` — the same 456 types in **16 groups**, with icons and cover fallbacks
- `window.TC_TRADE_ALIASES` — autofill aliases

Groups: Building & construction trades (147); Home services & maintenance (37); Outdoor & garden (37); Cleaning (19); Hair & beauty (14); Health & wellness (29); Fitness & sport (13); Food & drink (23); Shops & retail (36); Automotive & transport (23); Pets & animals (8); Kids, education & lessons (10); Events, creative & photography (11); Professional & business services (16); Property & real estate (7); Other local services (26).

Sources and judgement calls: [TRADES-SOURCES.md](TRADES-SOURCES.md). Cover photo credits: [TRADE-COVER-CREDITS.md](TRADE-COVER-CREDITS.md). Do not swap the fictional barber’s cover photo.

On sign-up, **Choose profession starts empty**, with the placeholder “Choose your profession”. Suggestions appear as the member types; “See all” opens the grouped list.

---

## 10. Promotion queue and Google reviews

### Facebook promotion queue

The circle takes turns posting in the Facebook group. The ordinary queue is free. “Jump the queue” may be paid later and must stay labelled **Price to be set** until Vishal sets a price. No payment is taken in the prototype.

Queue place is shared (for example place #4 is about 6 days, at one post every couple of days). Members can leave the queue. The admin can manage the queue.

### Google reviews

- Members may only review businesses they have **actually used**, after a **real job**, in their **own words**.
- The app may offer **ideas only** — never a finished, copy-and-paste-as-is review, and never swapped or near-identical reviews between members. See [REVIEW-IDEAS-RESEARCH.md](REVIEW-IDEAS-RESEARCH.md).
- **Daily cap: 3 Google reviews per business per Perth day** (midnight reset). At 3 of 3, a lock banner says the limit is reached and when it opens again. Review / Review back is locked. The cap is configurable in super admin Settings.
- The app never posts the review. It may open the Google listing.
- Google review **counts on Home are still sample / prototype numbers**, not live counts.

Australian Consumer Law (ACCC) and Google / Meta policies are why these rules exist. Do not weaken them.

---

## 11. Supabase data model and RLS

**Test project only:** Rate Buddies Test, ref `gbkammdluulczowcergu`, region `ap-southeast-2`, URL `https://gbkammdluulczowcergu.supabase.co`. Organisation: Ecofriendly Pest Control.

**Do not touch** project `khhptlbzxigkzhstkatf`.

The browser and APK use the **anon key** in `rb-config.js`. There is **no service-role key** in this repository.

Migrations (apply in order) live in `supabase/migrations/`:

1. `20261120_init_rate_buddies.sql` — schema, functions, RLS
2. `20261120_harden_function_grants_and_search_path.sql`
3. `20261120_fix_profiles_guard_service_role.sql`

### Tables

| Table | Purpose |
| --- | --- |
| `profiles` | One row per `auth.users` id. Name, business, trade, state, city, regions[], status (`pending` / `approved` / `rejected`), role (`member` / `admin`), intro_watched, share flags, links, bio. |
| `recommendation_requests` | Devi / admin Facebook recommendation requests (city, trade, featured member, status). |
| `rec_progress` | Who has marked a request as recommended. |
| `rec_text_ledger` | Unique starter texts already issued for a post, so they are not duplicated. |
| `google_reviews` | Review records between members (and cap enforcement). |
| `facebook_friends` | Friend-request status (the request itself is made on Facebook). |
| `facebook_queue` | Promotion queue. |
| `notifications` | In-app notifications. |
| `messages` | Chat messages. |
| `tutorial_sections`, `tutorial_videos` | Admin-managed tutorial content. |
| `intro_settings`, `previous_intros` | Current intro (pinned) and archived intros. |
| `tutorial_watched` | Who has watched the intro / videos. |
| `app_settings` | Admin-configurable settings (for example the daily review cap). |

Helpers include `is_admin()` and `is_approved()` (`security definer`, locked `search_path`). RLS is enabled. Typical pattern: approved members can read what they need; they can insert/update their own rows; admins can write request, queue, tutorial and settings rows. Function grants were hardened so only the intended roles can execute them.

Client wiring: `rb-config.js`, `rb-backend.js`, `rb-app.js`, `rb-admin.js`.

Ask Vishal to turn on **leaked-password protection** in the Supabase dashboard if it is still off (only he can do that).

---

## 12. Android APK and CI

- Capacitor 6, `appId` `com.ratebuddies.app`, config in `capacitor.config.json`.
- `scripts/prepare-www.sh` copies the web app into `www/`, then `npx cap sync android`.
- GitHub Actions: `.github/workflows/android-apk.yml`. On push to `main` (or `workflow_dispatch`) it runs `npm ci`, prepare-www, `cap sync`, and `./gradlew assembleDebug`.
- It uploads artifact `rate-buddies-debug-apk` and publishes / updates the GitHub release tag **`apk-latest`** (`app-debug.apk`).
- The repo’s Actions workflow permissions need **Read and write** so the release step can publish.
- This is a **debug sideload** build, not a Play Store app. On a phone, allow “install unknown apps”.
- The workflow release title may still say v1.9.0 until that string is updated.
- GitHub Pages (`pages.yml` / the repo Pages setting) serves the preview site from `main`.

---

## 13. Brand and v2.0 UI

- Logo: royal-blue **four cheering buddies** mark (no map pin). Wordmark **RATE BUDDIES** in all caps. The in-app wordmark is real HTML text so the A has its crossbar. On dark: RATE white, BUDDIES gradient; on light: RATE navy. Logo pack: `rate-buddies-logo-canva` (PNG and SVG, dark and light).
- Colour: royal blue across the app (from v1.7.1). Admin ‘RB’ mark stays RB.
- Facebook-related icons use the **f**. Google reviews use the **G**.
- v2.0 design system: `v20.css` and `v20.js`, loaded after the older stacked CSS/JS. Compact type (body about 15px, titles 22–28px), 16px side padding on an 8pt grid, refined cards, subtle shadows. Primarily light UI with tasteful gradients.
- Must fit **360–412px Android** with **zero horizontal overflow** (`viewport-fit=cover`, `border-box`, nothing fixed wider than 100vw, `env(safe-area-inset-*)`).
- Full-bleed on native / narrow viewports. No fake “9:41” status bar on real phones. A device frame is only for the desktop preview.
- Premium feel should apply to every tab, sub-screen, sheet, modal, empty state, and the web admin — not only the first PNG set.

Design stills: [`screens/v2.0/`](screens/v2.0/) (300–325).

---

## 14. Version history

Dates are Australia/Perth.

| Version | When | What it added |
| --- | --- | --- |
| v1 | 16 Nov 2026, morning | First 13 screens: sign-up, profile, regions, member list, settings |
| v1.1 | 16 Nov 2026, morning | Facebook sign-up and connect, Add friend, trade autocomplete, paste-link backup |
| v1.2 | 16 Nov 2026, morning | Menu drawer, Google Business Profile, friend and review status, Reviews tab, review ideas helper, full chat, notification mocks |
| v1.3 | 16 Nov 2026, morning | Subscription screen (Free now, Pro later, Price to be set); TECH-PLAN for AWS in Sydney |
| v1.4 | 16 Nov 2026, morning | Your areas in one list; Join all Perth metro; cleaner member cards |
| v1.5 | 16 Nov 2026, late morning | First/last name; awaiting approval; AI assistant mock; 241 trades; admin dashboard; Review back; recommendation alerts; promotion queue |
| v1.5.1 | 16 Nov 2026, late morning | Polished super admin (KPIs, charts, mobile nav) |
| v1.5.2 | 17 Nov 2026, early morning | Queue on the bottom menu; More as a searchable apps grid |
| v1.5.3 | 17 Nov 2026, early morning | Home as the first tab; chat icon in the header |
| v1.5.4 | 17 Nov 2026, early morning | Copy buttons; unique idea engine; daily Google cap of 3; profile links; G and f icons |
| v1.5.5–v1.5.6 | 17 Nov 2026, evening | Home split into Google / Facebook / Messages / Friends cards; gradient tiles restored |
| v1.5.7 | 17 Nov 2026, evening | Facebook and Queue combined; four-tab bar (Home, Reviews, Facebook, More) |
| v1.5.8 | 18 Nov 2026, morning | Multi-step sign-up; send for approval; Complete your profile; shared queue wait days |
| v1.5.9 | 18 Nov 2026, morning | Trade cover photos; Facebook Recommend segment; admin Facebook recommendations page |
| v1.6.0 | 19 Nov 2026, morning | 456 business types in 16 groups; aliases; fictional barber |
| v1.6.1 | 19 Nov 2026, morning | Australia-wide area picker (state, then metro or regional) |
| v1.6.2 | 19 Nov 2026, morning | Metro and Regional as accordions on one screen; nearby-reviews tip |
| v1.7.0 | 19 Nov 2026, evening | Rebranded on-screen to Rank Buddies. Filenames and repo unchanged |
| v1.7.1 | 20 Nov 2026, morning | Royal-blue logo and colour scheme; HTML wordmark |
| v1.8.0 | 20 Nov 2026, morning | Devi automation preview: Approve publishes a request, features a same-trade member, alerts the city except the same trade |
| v1.8.1 | 20 Nov 2026, morning | Unique recommend starters, add-your-own-words, Video tutorials, mandatory intro (first pinned admin section) |
| v1.8.2 | 20 Nov 2026, morning | Renamed to Rate Buddies (ratebuddies.com, ratebuddies.app). Canva logo pack. `RateBuddies.html` added |
| v1.9.0 | 20 Nov 2026, morning | App and web admin wired to the Supabase test project; RLS; Capacitor Android; GitHub Actions APK (`apk-latest`) |
| **v2.0** | 20 Nov 2026, afternoon | Premium compact redesign: welcome image slides, no fake status bar, no side overflow at 360px, empty profession, scroll position kept, same look on other screens and the web admin. Pushed as commit `162fa7f`. |

Older copies belong in `archive/`. Do not delete them.

---

## 15. Open issues (as of 20 Nov 2026, Australia/Perth)

**Still open from v1.9.0**

- Google review counts on Home are sample / prototype numbers, not live counts.
- The admin “All requests” history stays empty after you approve something.
- Facebook login / sign-up is still a demo sheet. A real Facebook developer app has not been set up.
- Push notifications and a real Devi webhook are not built yet.
- Intro / tutorials screens still show “Prototype only” / “Sample video — placeholder only” notes.
- The APK workflow release title may still say v1.9.0.
- Leaked-password protection in Supabase may still need turning on (Vishal only).

**From the v2.0 design pass**

- On a 360px-wide Home, the Facebook card starts at the tab-bar fold (queue tiles are clipped until you scroll). There is no horizontal overflow. At 390px the Facebook note clears the tab bar.
- These screens inherit the v2.0 type, spacing and full-bleed rules but were not given their own signed-off PNGs: the Facebook mock login sheet, the hamburger drawer, an individual chat thread, the Facebook Circle tab, Edit profile, signup steps 2–3 (name), the state-picker step, Notification settings, Help, Invite, AI assistant, empty states, and confirm/sheets (recommend copy, review ideas, friend request, leave-queue, and similar). Admin pages not shot: Profile requests, Members, Regions, Trades, Recommendation alerts, Facebook recommendations, Promotion queue, Reports, Chat moderation, and Devi settings.
- Vishal asked for a premium feel on every screen, including those.

**Not for the assistant to decide**

- Paid plan contents and price (until then: **Price to be set**).
- “Jump the queue” price (until then: **Price to be set**).
- The AWS account-owner email.

---

## 16. Related files

| File | Role |
| --- | --- |
| [HANDOFF.md](HANDOFF.md) | Short take-over note |
| [INSTRUCTIONS.md](INSTRUCTIONS.md) | Working rules for an AI or developer |
| [TESTING.md](TESTING.md) | How to test the connected app and admin |
| [START-HERE.md](START-HERE.md), [README.md](README.md), [AI-INSTRUCTIONS.md](AI-INSTRUCTIONS.md) | Earlier hand-off and version notes (some labels still say v1.9.0) |
| [TECH-PLAN.md](TECH-PLAN.md) | Plan for the real AWS-hosted app |
| [AUTOMATION-PLAN.md](AUTOMATION-PLAN.md) | Devi / automation notes |
| `index.html`, `admin.html`, `app.js`, `v20.css`, `v20.js` | App and design system entry points |

*Written 20 November 2026, Australia/Perth, for the v2.0 handoff to a new developer or AI.*
