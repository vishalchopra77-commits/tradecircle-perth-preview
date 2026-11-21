# Changelog

All data in the app and admin is fictional demo data.

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
