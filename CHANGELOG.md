# Changelog

All data in the app and admin is fictional demo data.

## v2.2.2 (build 19 candidates — NOT built) — 23 Nov 2026

Fixes found by the two-member + admin end-to-end test of build 18 (fictional members Liam Carter and Sophie Bennett). versionCode 19. Not built or published until the owner says so.

- Profile kept clearing (Vishal: "I fill the profile, it keeps getting cleared"): Edit profile was filled from a stale local member row (no private phone, and Complete profile only refreshed the extras), so saving Edit profile wrote blanks over bio, tagline, goal, services, ideal partners, links and phone. My own row is now built from the saved profile (RB.profile) and refreshed straight after every save (rb-app.js refreshMe/applyMembers, rb-live.js saveProfileNow).
- Approval while waiting: a member approved while on the "waiting for approval" screen now goes to the must-watch welcome video first, instead of skipping it (rb-app.js moveOnApproved).
- Suspended while the app is open: the member is now signed out within seconds with the reason, as the admin prompt promises (rb-live.js sync self-status check). Before, they kept using the app until they restarted it.
- Deleted while the app is open: the member is now signed out with "This account is closed" (rb-live.js checkRemoved, checked every 15 s once the member was live). Approved members are never signed out by it.
- Home: "Reviews Swapped" counts a member you and they have both reviewed, even when it was two one-way requests (was 0). The "Review back" card no longer shows a member you have already reviewed (rb-live.js periodStats/swappedCount, v15.js).
- Group chat @mentions notify the mentioned member (bell + push "Mentions" setting): new migration supabase/migrations/20261123_b19_011_group_mentions.sql (NOT applied yet), push-send KIND_PREF mention → mentions, app opens Chats from a mention notification (rb-live.js NOTIF_MAP, v222i.js).

## v2.2.2 (build 18) — 22 Nov 2026

Services picker, typing kept, bottom menu everywhere, Google/Facebook links, admin Delete member (Vishal). versionCode 18.

- Edit profile for a brand-new member (opened from "Complete your profile") now shows their saved name and business instead of blank fields, so Save can no longer store blanks.
- Every selected and suggested service chip has a visible ✕ (32px tap target, wraps at 130 % text). ✕ on a selected chip removes it; ✕ on a suggestion hides that suggestion (tap the chip to add it). All suggestions are kept.
- "Add your own services": a text box with an Add button; Enter adds; commas (typed or pasted) make separate chips; trimmed, duplicates ignored whatever the case. Custom chips get ✕ too.
- Same picker on Complete your profile and Edit profile. Saved to profiles.services; shows on My profile and in the admin member page.
- Removing every service and saving now saves an empty list.
- Example text follows the member's trade (Vishal: pest-control examples showed with another trade chosen): business name, tagline, bio, About and the suggested services use the trade in the trade box, else the saved trade, and update as soon as it changes. No trade = neutral examples. The old "Pest Control" fallback for suggestions is gone.
- Typed text is never wiped (Vishal: "I fill the profile, it keeps getting cleared"; "when I am chatting it keeps deleting the typed text"). form-keep.js: any redraw of the screen you are on (live sync every 60 s, realtime changes, presence, older layers) keeps typed values, picked chips, focus, caret and scroll. Complete/Edit profile, sign-up steps and Support also keep a draft on the phone (per member, 12 h) that comes back after an app restart (Android can restart the app view after the photo picker; the profile screen used to start empty then); cleared on Save / Skip / Send. Passwords and codes are never stored.
- Chat: a new or realtime message is added to the conversation in place; the text box is never rebuilt, so typing, focus and the keyboard stay put. Each chat keeps its unsent draft. Send clears the box and keeps the keyboard open.
- Bottom menu on every screen once a member is approved (Vishal: "no bottom menu on the profile page, dead end"), including My profile after saving Edit profile, member profiles, chats, settings pages, AI, tutorials, Support and Alerts. Hidden only before approval (welcome, sign-in, sign-up, waiting, intro). Chat and Support composers sit above it. Any sub-screen without a Back arrow gets one.
- Phone back button: goes back one screen; on Home it asks "Press back again to close Rate Buddies" instead of closing; never steps back into Sign-in. Fixed a double listener that could skip two screens per press. The phone button and the on-screen Back arrow now share one history. A screen name that does not exist sends an approved member Home instead of the Welcome screen.
- Leave Google Review (Incoming swap requests, Review back, Copy and open Google) opens the member's own Google Business Profile link exactly like the Google Business Profile button on their profile (Google Maps app), never a Google sign-in page. Cause: Incoming swap requests fell back to a demo write-review link. No link saved = a clear message.
- Facebook profile links (Facebook Profile button, Add friend, grey "Facebook friends" chip, any facebook.com profile link) open in the Facebook app (App Launcher + fb://facewebmodal), falling back to the browser if the app isn't installed. Handles profile.php?id=, vanity names and m./web./fb.com links. Adds @capacitor/app-launcher.
- The prototype "Connect Google Business Profile" sheet no longer opens for live members.
- Web admin: "Delete member" is back on every member page (top right, and under Save links), as a red trash button on every Members row (active, suspended, waiting) and on pending requests. One simple confirm: "Delete <name>? A copy is kept in the archive." Cancel / Delete. No reason asked. Never shown for admins or yourself. Archive first, then the login is removed so the email can sign up again (admin-delete-member). Typed admin fields survive the 20-second refresh.

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
