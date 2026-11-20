# Rate Buddies — handoff (v2.0)

This note is for a new developer or AI taking over the repo. It is a clickable HTML/CSS/JavaScript prototype plus a Capacitor Android wrapper and a web admin, wired to a free Supabase project for testing. **All member names, businesses, chats and photos are fictional.** Nothing is sent to Facebook or Google yet.

**Start here:**

- [PROJECT.md](PROJECT.md) — full project overview and product rules ([HTML](PROJECT.html), [PDF](PROJECT.pdf))
- [INSTRUCTIONS.md](INSTRUCTIONS.md) — how to run, build, deploy, and work with Vishal ([HTML](INSTRUCTIONS.html), [PDF](INSTRUCTIONS.pdf))
- [TESTING.md](TESTING.md) — how to try the connected test app and admin ([HTML](TESTING.html), [PDF](TESTING.pdf))
- This file also has [HTML](HANDOFF.html) and [PDF](HANDOFF.pdf) copies

v2.0 is on GitHub `main` as commit `162fa7f` (20 November 2026, Australia/Perth).

The product is **Rate Buddies** (ratebuddies.com, ratebuddies.app): a referral circle for local Australian trades. Members recommend people they genuinely know in Facebook groups, and leave Google reviews only after a real job, in their own words, with a daily cap of 3. The GitHub repo and many filenames still say `TradeCircle` so existing preview links keep working. The in-app API is `window.TradeCircle` / `T()`.

Owner: Vishal Chopra (Australia/Perth). Do not push unless he asks. Do not put passwords or the Supabase service-role key in the repo or in chat.

## File structure

| Path | What it is |
| --- | --- |
| `index.html` | Phone app shell (preview + native). |
| `RateBuddies.html`, `RankBuddies.html`, `TradeCircle-Perth.html` | Standalone copies of the app for existing links. |
| `app.js`, `styles.css`, `v12.*`–`v181.*` | Screen renderers and styles, stacked in order. |
| `v20.css`, `v20.js` | **v2.0 premium design system** (compact type, full-bleed on phones, welcome carousel, scroll-keep hooks). Linked after the older CSS. |
| `admin.html`, `admin.css`, `admin.js`, `admin-v180.js`, `admin-v181.js` | Web admin. `TradeCircle-Admin.html` is a bundled copy. |
| `rb-config.js` | Public Supabase URL + **anon key only**. Never add the service-role key here. |
| `rb-backend.js`, `rb-app.js`, `rb-admin.js` | Supabase client wrapper and live-data wiring for the app and admin. |
| `devi-city.js`, `tutorials-store.js`, `recommend-text` / `ideas-engine.js` | Devi city mapping, video tutorials + intro, unique recommend starters, review-idea helpers. |
| `supabase/migrations/` | Schema, RLS, and grant hardening for the test project. |
| `android/`, `capacitor.config.json`, `scripts/prepare-www.sh` | Capacitor 6 Android project, `appId` `com.ratebuddies.app`. |
| `.github/workflows/android-apk.yml` | Builds a debug APK on push to `main` and publishes the `apk-latest` release. |
| `screens/v2.0/` | Current design PNGs (390×844 @2x, plus two 360px shots). No fake 9:41 status bar. |
| `PROJECT.md`, `INSTRUCTIONS.md`, `TESTING.md`, `START-HERE.md`, `README.md` | Full overview, AI/developer instructions, testing steps, and older product notes (some older files still say v1.9.0). HTML and PDF copies sit next to the Markdown. |

Open the app at `index.html` and the admin at `admin.html` (local `python3 -m http.server` is enough). On a phone-width viewport, or in the native APK, the UI is full-bleed. A device frame is only for the desktop preview.

## Supabase

- Organisation: Ecofriendly Pest Control. **Test project only:** Rate Buddies Test, ref `gbkammdluulczowcergu`, region `ap-southeast-2`, URL `https://gbkammdluulczowcergu.supabase.co`.
- **Do not touch** project `khhptlbzxigkzhstkatf`.
- The browser and APK use the **anon key** in `rb-config.js`. There is no service-role key in this repo. Test account passwords are **not** in this repo — **ask Vishal** for them (or for a private login file).
- Test emails (passwords elsewhere): `admin@ratebuddies.test` (web admin only), `jamie@ratebuddies.test` and `michael@ratebuddies.test` (approved members). Nina Kaur is a pending applicant. A Joondalup plumber request is usually waiting in the Devi inbox (featured member: Michael).
- Turn **Demo (offline)** off to use the shared database. Demo mode only browses sample screens and does not change live test data.
- Ask Vishal to turn on leaked-password protection in the Supabase dashboard if it is still off (only he can do that).

## Android APK

1. GitHub Actions workflow: `.github/workflows/android-apk.yml`.
2. On push to `main` (or `workflow_dispatch`) it runs `npm ci`, `bash scripts/prepare-www.sh`, `npx cap sync android`, then `./gradlew assembleDebug`.
3. It uploads artifact `rate-buddies-debug-apk` and publishes / updates the GitHub release tag **`apk-latest`** (`app-debug.apk`).
4. The workflow release title may still say v1.9.0 until that string is updated. The repo’s Actions workflow permissions need **Read and write** so the release step can publish.
5. This is a debug sideload build, not a Play Store app. Sign-in details stay in the private login file, not in the release notes.

Public preview (updates only after a push):  
https://github.com/vishalchopra77-commits/tradecircle-perth-preview  
https://vishalchopra77-commits.github.io/tradecircle-perth-preview/RateBuddies.html  
https://vishalchopra77-commits.github.io/tradecircle-perth-preview/admin.html

## Key product rules (do not regress)

- **Devi flow:** a Facebook group post such as “recommend a plumber in Joondalup” is matched to a city. An Approve / Edit / Dismiss card goes to the admin. On Approve, the rest is automatic.
- Alerts go to **all members in that city except the same trade** (conflict of interest). The text is like “Facebook recommendation alert for ‘Plumber’ — Let’s help Michael!”, naming the featured member of that trade. Featured members rotate fairly; the admin can switch who is featured. If no member of that trade is in the city, the request cannot be approved.
- **Recommend card:** unique suggested texts, no duplicates on the same post; Copy button; optional name, business, phone, Facebook page and profile link. Members **must add their own words** so comments do not look identical to Facebook. The app never sends Facebook comments, friend requests, or Google reviews automatically. Members only vouch for people they genuinely know.
- **Video tutorials:** admin creates sections and adds YouTube or Vimeo links with descriptions. **Introduction video** is the first pinned section inside Video tutorials (not a separate admin page). After approval, the first login shows that intro and it cannot be skipped; it then points members to Video tutorials.
- **UI (v2.0):** premium, compact, royal-blue Rate Buddies brand, four-buddy logo, RATE BUDDIES wordmark in all caps. Must fit 360–412px Android with **no horizontal overflow**. No fake iOS “9:41” status bar on real phones or in the APK. **Choose profession starts empty.** After choosing a region (and after any same-screen toggle or accordion), **the scroll position stays put** — it must not jump to the top. The first screen is image slides with little text, then the sign-up buttons. Facebook icons use the “f”. Facebook sign-up is still a mock; email sign-up and login against Supabase must keep working.
- Standalone rules still in force: WA metro ids stay exact; do not swap the barber cover photo; archive instead of deleting; fictional data only.

## Known open issues (as of 20 Nov 2026, Australia/Perth)

**From v1.9.0 (still open)**

- Google review counts on Home are sample / prototype numbers, not live counts.
- The admin “All requests” history stays empty after you approve something.
- Facebook login / sign-up is still a demo sheet. A real Facebook developer app has not been set up.
- Push notifications and a real Devi webhook are not built yet (AWS sign-up was started but is waiting on the account-owner email).
- Intro / tutorials screens still show “Prototype only” / “Sample video — placeholder only” notes.
- The APK workflow release name still says v1.9.0.

**From the v2.0 design pass**

- On a 360px-wide Home, the Facebook card starts at the tab-bar fold (the queue tiles are clipped until you scroll). There is no horizontal overflow. At 390px the Facebook note clears the tab bar.
- These screens inherit the v2.0 type, spacing and full-bleed rules but were **not** given their own signed-off PNGs: the Facebook mock login sheet, the hamburger drawer, an individual chat thread, the Facebook Circle tab, Edit profile, signup steps 2–3 (name), the state-picker step, Notification settings, Help, Invite, AI assistant, empty states, and confirm/sheets (recommend copy, review ideas, friend request, leave-queue, and similar). Admin pages not shot: Profile requests, Members, Regions, Trades, Recommendation alerts, Facebook recommendations, Promotion queue, Reports, Chat moderation, and Devi settings.
- Vishal asked for a premium feel on every screen, including those.

v2.0 design work lives in `screens/v2.0/` and on `main` (commit `162fa7f`).

## What not to do

- Do not put passwords, the service-role key, or other secrets in the repo, in `HANDOFF.md`, `PROJECT.md`, `INSTRUCTIONS.md`, `TESTING.md`, or in chat.
- Do not delete files; archive them.
- Do not claim Facebook, Google, or AWS work is live if it is only mocked or unfinished.
