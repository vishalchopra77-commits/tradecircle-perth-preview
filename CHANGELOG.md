# Changelog

All data in the app and admin is fictional demo data.

## v2.2.2 (build 17) — 22 Nov 2026

Welcome intro video fix (Vishal: video stopped after a few seconds, Continue never unlocked). versionCode 17.

- Real watch tracking (intro-live.js): the YouTube IFrame API counts only time actually played (seeking ahead does not count), against the video's real length from the player, so a wrong duration in the admin can no longer lock members out. Continue unlocks at min_watched_pct.
- Fallback: if the player API can't report in the WebView, Continue unlocks after duration_sec of elapsed play time.
- Live syncs no longer rebuild the intro player (a repeat go("intro-video") only refreshes the progress bar), so the video keeps playing.
- Server (already live, no APK change): migration 017 lets push-send read the FCM key from Vault (service_role only).

## v2.2.2 (build 16) — 22 Nov 2026

QA sweep fixes (55 items) and "make everything working". versionCode 16, labels in the app (More, Settings) and the web admin.

- Live-only: demo controls hidden when connected to Supabase (code kept; `?demo=1` shows them). No demo posts, notifications, request cards or Home lines in the live app; proper empty states.
- Accounts: suspended overlay + sign-out, change password, delete my account (archived), forgot password + reset landing (rb-early.js keeps the reset link before the router rewrites the hash).
- Friends: confirm / Not now for incoming requests, named notifications; Support live replies; feature status notices; gallery upload/remove to Storage (files deleted too); presence ("Online"); group header member counts; tap-tab-to-top.
- New group chats (create_group_chat RPC, notifications, visible in admin Chats).
- AI assistant + Voice: answers from live data with no key; own Grok/ChatGPT/Claude key tested for real and kept on the phone; ai-assist Edge Function for an admin key ("Needs an AI key" otherwise); speech in/out.
- Push (FCM): @capacitor/push-notifications, device_tokens, push-send Edge Function (respects toggles + quiet hours, off until the admin turns push on), google-services.json for com.ratebuddies.app. Needs the FCM_SERVICE_ACCOUNT function secret.
- Admin: chat moderation, Google Reviews/swaps, Vouches, FB friends, member page, sign out, Devi webhook live (devi-webhook + token), AI integrations status, push switch, Fictional-data chip only in Demo.
- Database: migrations 010–017 in supabase/migrations (20261122_v222i_*); 017 lets push-send read the FCM key from Vault (service_role only); test data cleanup archived in private.cleanup_archive.

## v2.2.2 — 22 Nov 2026 (versionCode 10)
- Live test backend: the app and web admin now use the Rate Buddies Test Supabase project (ratebuddies@gmail.com org), set in rb-config.js and in the bundled RankBuddies.html / TradeCircle-Admin.html. Public anon key only.
- Live sign-up → admin approval (updates live), profile + photos (other members' photos show), extra profile fields (About, Ideal partner, Service areas, Gallery, Goals, ABN).
- Live Google Review swaps with the 3-per-Perth-day received cap, live chat + chat badge, notifications + bell, Facebook Friends status, recommendations (approve shows live for the member), member Feature Board, admin video manager saved to the database.
- Tailored Services and Referral partner suggestions for all 456 business types; "Watch how (1 min)" help under link boxes; Connect your own AI screen.
- Version shows as v2.2.2 in More/Settings and the admin header.

## v2.2.1 — 22 Nov 2026 (versionCode 9)
- Restore the existing "Demo: simulate approval" button and its original position on Awaiting approval.
- Fix nested search inputs: one wrapper, no inner white rounded box, consistent focus state.
- Trade suggestions: "Select" instead of "TYPE"; same row action.
- Owner rule: never remove or hide any button, screen, feature or file without explicit approval.

## v2.2.0 — 21 Nov 2026 (versionCode 8) — PNG review round, not built yet

### Design spec v2.2
- Calmer type (400 body, 500 labels, 600 buttons, 700 titles), main tab titles 22/700 (20 on small phones), words never break in half.
- Slimmer bottom tab bar: 22px icons, 11/500 labels, small pill behind the active icon only.
- One 1.75px icon stroke, 32px chips, 52px inputs with 16/400 text, 16px card corners.
- Android: WebView text zoom follows the phone but is capped at 115% (MainActivity).

### Vishal's batch
- Last welcome slide: no Next button (Continue with Facebook / Create account / Sign in only); "Work where you work" heading no longer clipped.
- Sign-up never copies demo data (name, business, trade, ABN, phone stay empty, also after Continue with Facebook); no state or region pre-selected or highlighted.
- Awaiting approval: hourglass icon in waiting orange, no Submitted box, white text under the video, no "Demo: simulate approval" button (web preview only with ?demo=1).
- Inner-page header options A (actions only on main tabs, default), B (one ⋯ menu), C (two rows) — ?hdr=a|b|c.
- Member profile: "Facebook Friends" wording, action row option A (full-width Message + two equal buttons, default) or B (three icon-on-top buttons) — ?prof=a|b; no dark band behind the header; clear medal icon on tier badges.
- Facebook switch labels always fully visible (the badge wraps under the label at large text sizes rather than clipping).

### QA
- Every screen checked at 100/115/130% text size × 360/390/412 (9 passes), new mid-word-break rule, plus the 48px nav-bar inset check.

## v2.1.4 — 21 Nov 2026 (versionCode 7)

### Android navigation bar fix
- Bottom buttons (onboarding Next, sign-up steps, tab bar, bottom CTAs, sheets, chat and Support message bars) no longer sit behind the Android navigation bar.
- Native (MainActivity): the content view holding the WebView is now padded by the navigation bar, display cutout and the open keyboard, so the page ends above the system bar. v2.1.3 padded the WebView itself, which a WebView ignores. Insets are consumed natively, so CSS env(safe-area-inset-bottom) is 0 in the app and nothing is padded twice. The status bar stays transparent with the header padded by --rb-sat. Nav-bar area uses the app background with dark icons.
- Web (v214.css): chat and Support message bars add env(safe-area-inset-bottom) for browsers and installed web apps; other bottom bars already did.
- QA: new inset check (qa/run_inset.py) emulates a 48px bottom inset on every screen at 360/390/412 and fails any control that ends inside it.

## v2.1.3 — 21 Nov 2026 (versionCode 6)

### Sign-up
- Step 2 "Your details" now holds first and last name plus the business details (business name, trade, ABN, phone). Step 3 is region selection only.

### Look and feel
- Flat header buttons with dark charcoal outlines, no shadows; one thin icon border used across the app (matches the More tiles).
- Taller header bar; page titles line up with the cards and section labels below.
- Coloured left line on Home cards, Google logo colours only: Google Reviews yellow, Facebook blue, Messages green, Facebook Friends red.
- Traffic-light status colours everywhere: green = done, orange = waiting/pending, red = problem.
- Android: edge-to-edge under a transparent status bar, light/dark status-bar icons per screen (MainActivity).

### Facebook
- Circle / Recommend / Queue switch: one white track, three equal segments, a single solid pill for the selected one, badges inside their segment.
- One queue number everywhere (badge-ranked queue, e.g. #5 of 8 on Home, the switch and the Queue page).
- "Friends" renamed "Facebook Friends"; Pending shown in orange.
- The selected trade filter chip scrolls into view.

### Chats and notifications
- The trade/profession shows next to every name: chat list, conversation header ("Carpenter · Online") and group-chat senders.
- Gaps between notification cards, unread dot clear of the title, same glyph size in every icon tile.

### More, Support, Tutorials
- More and Account grids: uniform tile height, icon and label centred. New "Join Our Facebook Group" tile (opens the group link outside the app).
- New Support page: members chat with the support desk. Admin gets a Support inbox. Uses demo data until the support table exists (migration `20261121_v213_support_messages.sql` is included but NOT applied; the app falls back to the demo thread if the table is missing).
- Video tutorials: no separate lesson page; tapping a video or title plays it inline in the list (Layout B2 kept).

### Subscription
- One plan: 1 month free, then $50 / month. "Pro coming later" card removed.

### Text and layout polish
- No "…" truncation on meaningful text (wraps to 2–3 lines instead); only the chat-list last message and collapsed tutorial descriptions are clipped.
- Tip box with a right-aligned "Got it" link and 16px padding; no orphan chips (e.g. Silver on My profile); separator dots never start a line.
- Automated QA extended (truncation, segmented-switch geometry, queue consistency, tip box, tile grids, orphan chips, glyph size, off-screen elements).
