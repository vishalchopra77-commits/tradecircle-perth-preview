# AI instructions — TradeCircle Perth

Read **START-HERE.md** first for the product concept, agreed features, version history, open questions and how to open the prototype. Read **TECH-PLAN.md** for how the real iPhone and Android app would be built (one app, AWS in Sydney, security, store rules, free now and a subscription later). This file is the working agreement for Claude, ChatGPT, Grok, or any other assistant continuing the work.

The owner is Vishal Chopra. He wants everyone to work together on the **online copies**, not on his Mac folder. The Mac will be updated later, once a version is finished, as a local copy only.

---

## 1. Where the source of truth lives

| Place | Role |
|---|---|
| **GitHub:** [github.com/vishalchopra77-commits/tradecircle-perth-preview](https://github.com/vishalchopra77-commits/tradecircle-perth-preview) | **Source of truth.** New work is committed here. Live preview: [vishalchopra77-commits.github.io/tradecircle-perth-preview](https://vishalchopra77-commits.github.io/tradecircle-perth-preview/). |
| **Google Drive folder:** TradeCircle App - Mac Files | **Backup copy** of the files, plus this hand-off pack, so another assistant can keep going if a chat hits a usage limit. Keep it in sync after each released version. |
| **Vishal’s Mac** (`Documents/Projects/Facebook-Business-Marketing`) | **Not** the source of truth. Do not treat the Mac folder as the place to continue work. A copy will be made to the Mac later, when a version is finished. The Mac is often offline. |

When GitHub and Drive disagree, **GitHub wins**, unless Vishal has explicitly said a Drive or chat file is newer and has not been pushed yet. In that case, reconcile and push to GitHub.

---

## 2. How to continue the work

1. Read `START-HERE.md`, this file, and `README.md` in the current version folder.
2. Open the current prototype (`index.html` or `TradeCircle-Perth.html`) and confirm you are starting from the latest version number (see section 4). As of 16 November 2026, Australia/Perth, that is **v1.5.2**.
3. Only change what Vishal asked for in the current request. Do not redesign unrelated screens.
4. Keep all demo data fictional. Do not add real customer names, phone numbers, addresses, passwords, API keys, or other secrets.
5. Ask Vishal **one question at a time**, in plain non-technical words, when a decision is required. Do not assume an answer.
6. When the change is ready, deliver it using the process in section 5. Then tell Vishal the version number, what changed, and the online links (GitHub and, once live, the GitHub Pages preview).

This is still a **clickable HTML/CSS/JavaScript UI prototype**, not a production app, unless Vishal later asks for a real build. Facebook and Google consent screens are mocks. Chat and review drafts in the preview stay on the device. Do not claim a feature is live on Facebook or Google if it is only a mock.

---

## 3. Standing rules (do not break these)

### Fictional data only
All members, businesses, ratings, chats, reviews, photos and example jobs in the prototype must stay made up. No real client or customer data. No secrets in the files, in commit messages, or in chat.

### Never delete files
Do not delete project files, old versions, screenshots, or folders. If something is replaced, **archive** the previous copy.

### Archive old versions
Before you replace a released version:

- Copy the full previous version into an `Archive` folder, with a clear name that includes the version and a timestamp in Australia/Perth (example: `ui-v1.2-20261116-082800-AWST`).
- Leave the archive in GitHub (for example under `archive/`) and in the Drive **Archive** subfolder.
- Do not overwrite the only copy of an older version.

### AI assistant must not post for the member
The AI assistant may open a Facebook profile or a Google review page. It must **never** send a friend request or post a review. The member taps that button themselves.

### Review ideas only (compliance)
This is a hard product rule.

- The app may give **ideas and suggestions** for a Google review after the member picks a real job they actually had done (service, suburb, month, what stood out).
- The app must **not** generate finished, ready-made, or copy-and-paste-as-is reviews.
- The app must **not** create swapped, duplicate, or near-identical reviews to be posted between members.
- The member must write or edit the final review in their own words. Keep a warning such as: “Only review businesses you have actually used. Write in your own words.”
- Keep suggestions unique. Do not reuse the same wording for the same business in the same session.

Why: Google can remove reviews and suspend a Business Profile for fake, incentivised, or conflict-of-interest reviews (including between affiliated businesses). Australian Consumer Law, as explained by the ACCC, also makes fake or misleading reviews illegal. See the policy notes and links in `README.md`.

### Facebook friend links
Keep the **paste your Facebook link** fallback. Do not claim that one-tap Facebook Login will always produce a working “send friend request” URL. Name and photo can come from a normal Facebook Login; a reliable public profile link for friend requests may not, even after App Review. Details are in `README.md`.

### Weekly meetups stay offline
Do not add the weekly in-person meetings as an in-app feature unless Vishal asks for that.


### Subscription and prices
The app is **free for now**. A paid plan may come later. Until Vishal sets a price, always write **“Price to be set”**. Do not invent a price or a fee. When a digital subscription is sold inside the iPhone or Android app, use Apple In-App Purchase and Google Play billing, as explained in [TECH-PLAN.md](TECH-PLAN.md).

### One app, AWS in Sydney
The real product is **one app for both iPhone and Android**, hosted on AWS in the Sydney region. Follow [TECH-PLAN.md](TECH-PLAN.md). Do not plan two separate native apps unless Vishal changes that decision.

### Placeholder name
“TradeCircle Perth” is a temporary name. Keep using it until Vishal chooses a real name. Do not silently rename the product.

### Open questions
Do not decide these for him:

1. What is the real app name?
2. When he is ready: what should a paid plan include, and what is the price?
3. When he is ready: what should “Jump the queue” cost? (Until then, use **Price to be set**.)

New members **do** wait for Vishal’s approval. That was decided in v1.5.

---

## 4. Version numbering

- The first design was **v1**.
- Small feature additions use a point number: **v1.1**, **v1.2**, **v1.3**, **v1.4**, **v1.5**, **v1.5.1**, **v1.5.2**, and so on.
- Use a new major number (**v2**) only for a large change, such as a full visual redesign or the start of a real (non-prototype) build, and only after saying so clearly.
- Put the version in `README.md`, in the in-app settings/drawer version label, and in the delivery note to Vishal.
- Do not skip numbers. Do not reuse a number for a different set of files.
- Date notes should use **Australia/Perth** time, with that zone named.

---

## 5. How to deliver a new version

Do these steps in order. Do not skip the archive step.

1. **Confirm the starting version.** Work from the latest GitHub main copy if the repo exists; otherwise from the latest Drive **vX.Y (current)** folder.
2. **Archive the current released version** (GitHub `archive/` and Drive **Archive**). Do not delete it.
3. **Make the changes** in the current prototype files. Keep `fonts/` and `screens/` in place. If you change screens, update or add screenshots and overview images when you reasonably can.
4. **Bump the version number** in `README.md` and the on-screen version label. Add a short “What’s new” section.
5. **Update START-HERE.md** if the product story, features, or open questions changed. Leave this file (`AI-INSTRUCTIONS.md`) in the current version folder as well.
6. **Publish to GitHub** (source of truth):
   - Commit the new current files to `vishalchopra77-commits/tradecircle-perth-preview`.
   - If GitHub Pages is enabled, confirm the preview link opens the new version.
   - Do not force-push or rewrite published history unless Vishal clearly asked for that.
7. **Refresh the Google Drive backup:**
   - Upload the new current unpacked files into a folder named like `v1.5.2 (current)`.
   - Move the previous “current” folder into **Archive** (or leave it there and clearly mark the new one as current).
   - Also upload a `.zip` (easiest download) and a `.tgz` of the new version.
   - Keep START-HERE and this instructions file at the Drive folder root, and as Google Docs if those copies already exist.
8. **Tell Vishal** the new version number, what changed, the GitHub link, and the preview link once it is live. Do not say it is live online unless you have checked the preview link.
9. **Do not copy to the Mac as the main delivery.** Vishal asked to work on the online versions. A Mac copy can wait until he asks, or until a version is finished and he wants the local folder updated.

If you cannot push to GitHub (the repo does not exist yet, or you do not have access), still archive, still update Drive if you can, and tell Vishal exactly what is blocked.

---

## 6. Files an assistant should expect

In the current version folder (and in the GitHub repo, once created):

- `index.html` — desktop chooser plus the app; loads `styles.css`, `v12.css`, `v15.css`, `trades.js`, `app.js`, `v12.js`, `v15.js`
- `admin.html` — super admin dashboard (with `admin.css` and `admin.js`)
- `TRADES-SOURCES.md` — where the Australian trades list came from
- `TradeCircle-Perth.html` — same prototype with CSS and JS inlined (still needs `fonts/`)
- `README.md` — version notes, Facebook Login limits, review-policy sources
- `START-HERE.md`, `AI-INSTRUCTIONS.md` and `TECH-PLAN.md` — this hand-off pack and the real-app plan
- `overview.png`, `overview-chat.png`, `screens/`, `fonts/`

Older versions live under `archive/` (GitHub) or **Archive** (Drive). Bundles: `TradeCircle-Perth-vX.Y.zip` and `ui-vX.Y.tgz`.

---

## 7. If you are estimating or building further

If Vishal asks how long a real app would take, start from [TECH-PLAN.md](TECH-PLAN.md). Say clearly what is already only a UI mock and what would still have to be built: one React Native (Expo) app for iPhone and Android, AWS in Sydney, accounts (including Sign in with Apple), Facebook Login and App Review, Google Business Profile APIs, real chat, real push notifications, account deletion, report and block, member approval if he chooses it, and — later — store billing once prices are set. Do not treat this prototype as a finished product. Do not invent prices or AWS costs.

---

*Written 16 November 2026, Australia/Perth, to sit beside START-HERE.md in the Drive backup and, later, in the GitHub repository.*
