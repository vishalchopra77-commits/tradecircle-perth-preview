# Rate Buddies — instructions for an AI or developer

You are taking over **Rate Buddies** (v2.0) for Vishal Chopra. Read these first, in this order:

1. [HANDOFF.md](HANDOFF.md) — short map of the repo, Supabase, the APK, and the rules you must not regress
2. [PROJECT.md](PROJECT.md) — full product overview (screens, Devi, Recommend, tutorials, regions, 456 types, data model, versions, open issues)
3. This file
4. [TESTING.md](TESTING.md) — how to try the connected test accounts (passwords are not in the repo)

HTML and PDF copies of these four files sit next to the Markdown. Vishal likes plain, easy-to-read HTML for reference documents.

The source of truth is GitHub: https://github.com/vishalchopra77-commits/tradecircle-perth-preview (`main`, v2.0 is commit `162fa7f`). Google Drive is the backup. His Mac Projects folder is a local copy, updated when a version is finished. When copies disagree, **GitHub wins**, unless Vishal says a newer unpublished file is the one to use.

All demo data is fictional. Nothing is sent to Facebook or Google yet.

---

## 1. How to run locally and preview

From the repo root:

```bash
python3 -m http.server 8767
```

Then open:

- App: http://127.0.0.1:8767/index.html
- Web admin: http://127.0.0.1:8767/admin.html
- Standalone app copies: `RateBuddies.html`, `RankBuddies.html`, `TradeCircle-Perth.html` (same product; filenames kept so live links work)

On a phone-width viewport, or in the native APK, the UI is full-bleed. A device frame is only for the desktop preview.

To use the **shared test database**, turn **Demo (offline)** off (it should be off by default). Demo mode only browses sample screens and does not change live data.

You do not need AWS to preview. You do need the public anon key already in `rb-config.js` to talk to the test Supabase project. Do not add a service-role key.

---

## 2. How to build the APK

**Preferred:** push to `main` (after Vishal has approved the PNGs) and let GitHub Actions build it. Workflow: `.github/workflows/android-apk.yml`.

It runs `npm ci`, `bash scripts/prepare-www.sh`, `npx cap sync android`, then `./gradlew assembleDebug`. It uploads artifact `rate-buddies-debug-apk` and publishes the release tag **`apk-latest`** (`app-debug.apk`).

The repo’s Actions **workflow permissions** must be **Read and write**, or the release step cannot publish.

Download: https://github.com/vishalchopra77-commits/tradecircle-perth-preview/releases/download/apk-latest/app-debug.apk

This is a debug sideload build, not a Play Store app. On Android, allow installing from “unknown apps”.

**Local build** (if you have Node 20, Java 17 and an Android SDK):

```bash
npm ci
bash scripts/prepare-www.sh
npx cap sync android
cd android && ./gradlew assembleDebug
```

The APK lands at `android/app/build/outputs/apk/debug/app-debug.apk`. Do not commit build outputs, `www/`, keystores, or `local.properties`.

`appId` is `com.ratebuddies.app`. Config: `capacitor.config.json`.

---

## 3. How to deploy

1. Show Vishal **PNG mockups first**. Wait for him to **approve** them. An agent’s message is never his approval — only he can approve.
2. Do not push until he has said to (for example “upload”, “put it live”, or “approve” after seeing the PNGs).
3. **Archive** the previous released copy first. Never delete it.
4. Commit to `main` on `vishalchopra77-commits/tradecircle-perth-preview`. Do not force-push or rewrite published history unless he clearly asked for that.
5. A push to `main` updates **GitHub Pages** (the live preview) and starts the **android-apk** workflow, which refreshes the `apk-latest` release.
6. Verify with `curl` (or a browser) that these load the new version:
   - https://vishalchopra77-commits.github.io/tradecircle-perth-preview/RateBuddies.html
   - https://vishalchopra77-commits.github.io/tradecircle-perth-preview/admin.html
7. Confirm the Actions run succeeded and the `apk-latest` release has `app-debug.apk`.
8. Tell Vishal the version number, what changed, and the links. Do not say it is live unless you have checked.

Refresh the Google Drive backup after a released version. A zip of the version is the easiest download for him. Copy to his Mac Projects / Rate Buddies folder when he asks (he asked for that with v2.0).

---

## 4. Vishal’s working rules

Follow these every time.

- **One question at a time**, in plain words. No jargon unless he uses it first. Do not assume an answer.
- **PNG mockups first.** Send screenshots (typically 390×844, and check 360px wide). Wait for his approval before building or pushing.
- **Never delete.** Archive instead, with the version and an Australia/Perth timestamp in the folder name.
- **Fictional data only.** No real customers, no real phone numbers, no real addresses.
- **No secrets in chat or in the repo.** No passwords, no service-role key, no `.env` with secrets, no keystores.
- **Premium, compact UI** that fits a **360px**-wide phone with **no horizontal overflow**. No fake “9:41” status bar on a real phone or in the APK. Every screen and section (tabs, sheets, modals, empty states, admin) should feel premium — not only the first PNG set.
- **Keep the scroll position** after a selection, toggle or accordion. The screen must not jump back to the top. This is the default everywhere.
- **Choose profession starts empty** on a new sign-up (placeholder only).
- **Plain, easy-to-read HTML** for reference lists and documentation. Also save deliverables as **HTML or PDF** (or both) when you give him documents.
- Ask **one** decision at a time when you are blocked. Otherwise do the work.

Standing product rules (full detail in PROJECT.md — do not regress them): Devi city-minus-same-trade alerts; featured-member rotation; “Let’s help [Name]!” wording; cannot approve if no member of that trade is in the city; unique recommend texts and add-your-own-words; intro video pinned first in Video tutorials and unskippable after approval; daily Google cap of 3; never auto-send Facebook or Google actions; Price to be set until he names a price; WA metro ids stay exact; do not swap the barber cover; Facebook icons use the “f”; royal-blue four-buddy logo; RATE BUDDIES in all caps; filenames and `window.TradeCircle` stay TradeCircle so live links work.

---

## 5. Coding conventions

- This is still a **static HTML/CSS/JS** prototype, not a React/Expo app, unless Vishal later asks to start that build (see TECH-PLAN.md).
- The app shell is `index.html`. Styles and scripts are **stacked by version**: `styles.css`, `v12.css` … `v181.css`, then **`v20.css`**. Same pattern for JS: `app.js`, `v12.js` … `v181.js`, then **`v20.js`**, plus `rb-*.js`. Put new design and behaviour in a new versioned file or in `v20.*` rather than rewriting history, unless you are fixing a bug in place.
- Public API: `window.TradeCircle` / `T()`. `TradeCircle.go(screenId)` renders a screen. When `go` re-renders the **same** screen (or `opts.keepScroll` is set), it must **save and restore** `.scroll` `scrollTop`.
- Keep `RateBuddies.html`, `RankBuddies.html`, `TradeCircle-Perth.html` and `TradeCircle-Admin.html` in step if you change the split files, or note that they are stale. Those copies exist so older links keep working.
- `rb-config.js` holds the public Supabase URL and **anon key only**. Never put the service-role key there. Do not touch Supabase project `khhptlbzxigkzhstkatf`. The test project is `gbkammdluulczowcergu`.
- New database changes go in `supabase/migrations/` with a dated filename. Preserve RLS. Test as anon / member / admin — not as a bypassed service role.
- Regions live in `locations.js`. WA metro ids: `hills`, `kwinana`, `north`, `south`, `east`, `central`, `fremantle`, `rockingham`, `joondalup`, `armadale`.
- Business types live in `trades.js` (456 names, 16 groups).
- Prefer compact, accessible markup. 16px side padding, `box-sizing: border-box`, `viewport-fit=cover`, `env(safe-area-inset-*)`. Nothing should be fixed wider than `100vw`.
- Version labels: bump the in-app Settings version, the admin sidebar, README / START-HERE “current” line, and the APK release name when you ship. Use Australia/Perth dates. v2.0 was the visual redesign; further small design or feature work can be v2.0.1, v2.1, and so on.
- Comments and docs in plain English. No secrets in commit messages.

---

## 6. Where the passwords live

**Not in this repository, not in these docs, and not in chat.**

Test account **emails** (for the shared Supabase project) are:

- `admin@ratebuddies.test` — web admin only
- `jamie@ratebuddies.test` — approved member
- `michael@ratebuddies.test` — approved member
- Nina is usually the pending applicant

**Ask Vishal** for the passwords (or for a private login file). Do not invent new ones and paste them into GitHub. If you must create a fresh test user, use Supabase Auth or the in-app email sign-up, and give him the password privately — never in a commit, issue, or group chat.

The previous private login file is held outside the repo. If you cannot find it, ask him; he can also reset passwords in the Supabase dashboard.

---

## 7. How to verify with screenshots

1. Archive first if you are replacing a released look.
2. Run the app locally (`python3 -m http.server`) with `body.shot` / `?shot=screen-id` if you use the existing capture helpers, or drive the real screens with Playwright / Chrome.
3. Capture at **390×844 @2x**, and also at **360×800** (or 360×844) for overflow checks. No fake status bar in the PNG.
4. Look at every PNG yourself. Reject clipped text, oversized type, or content running off the left or right edge.
5. Official overflow check at 360px: `document.documentElement.scrollWidth <= window.innerWidth`. Off-screen welcome-carousel slides and the off-canvas drawer do not count as overflow.
6. After a region tap (and other same-screen toggles), assert that `.scroll.scrollTop` is unchanged (allow a small rounding tolerance).
7. On a new sign-up, assert the profession field is empty and the placeholder is visible.
8. Save PNGs under `screens/` in a versioned folder (for example `screens/v2.1/`), numbered, with a one-line description each.
9. Send the PNGs to Vishal and **wait**. Only then build or push.
10. After a push, re-check the live Pages URLs and, if the APK changed, that `apk-latest` has the new file.

A Playwright script from the v2.0 pass lived at `/tmp/v20-shots.py` on the build machine; you can write a fresh one in `scripts/` if you want it in the repo.

---

## 8. What not to do

- Do not push without his approval of the PNGs (or a clear “upload / put it live”).
- Do not delete files or old versions.
- Do not put passwords or the service-role key in the repo, in HANDOFF / PROJECT / INSTRUCTIONS / TESTING, or in chat.
- Do not claim Facebook, Google, or AWS work is live if it is only mocked or unfinished.
- Do not invent a subscription price or a “Jump the queue” price.
- Do not auto-send Facebook comments, friend requests, or Google reviews.
- Do not pre-fill Choose profession on a new sign-up.
- Do not let a same-screen update jump the scroll to the top.
- Do not touch Supabase project `khhptlbzxigkzhstkatf`.
- Do not decide open product questions for him (prices, AWS owner email).

If you are unsure, ask him one plain question, then stop and wait.

*Written 20 November 2026, Australia/Perth, for the v2.0 handoff.*
