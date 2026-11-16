# TradeCircle Perth — how the real app would be built

This note is for Vishal and for any assistant (Claude, ChatGPT or similar) continuing the work. It is written in plain words. It is a plan, not a build yet.

**Date:** 16 November 2026, Australia/Perth.  
**App name:** TradeCircle Perth (placeholder, not final).  
**Current design:** clickable prototype v1.3.

---

## Decisions already made

- Vishal already has an **Apple App Store** developer account and a **Google Play** developer account.
- Build **one app that works on iPhone and Android**, not two separate apps.
- Host files and the back end on **Amazon Web Services (AWS)**, in the **Sydney** region (`ap-southeast-2`), so the data stays in Australia as far as practical.
- The app is **free for now**. A paid subscription can be added later. Prices are not set. Until they are, use the label **“Price to be set”**. Do not invent a price.

---

## 1. How one app can work on both iPhone and Android

We recommend **React Native with Expo**.

You write the app once, in JavaScript (the same family of language as this prototype). Expo then produces an iPhone app for the App Store and an Android app for Google Play. People still download it from the usual store on their phone. It looks and feels like a normal app, not a website.

**Why Expo, not two separate apps**

- One team, one set of screens, one set of features to keep up to date.
- Expo helps with building the store files, sending the app to Apple and Google, and sending push notifications.
- This prototype is already written in JavaScript, so the real app can stay in the same language.
- Facebook sign-in, Google sign-in, and AWS’s mobile tools (Amplify) all have a clear path for React Native.

**Flutter** (Google’s other “write once, run on both” option) is also a strong choice, especially if you later want a very custom look. We still recommend Expo to start with, because it matches this prototype, and because builds, store uploads and push notifications are simpler to get going.

Vishal already has both store accounts, so the finished app can be submitted to both stores from that one Expo project.

---

## 2. Publishing to the App Store and Google Play

When the first real version is ready:

1. Create the app listing in **App Store Connect** (Apple) and **Google Play Console** (Android), using the accounts Vishal already has.
2. Add a public **privacy policy** (see section 4), plus Apple’s privacy labels and Google’s Data safety form.
3. Test first: **TestFlight** on iPhone, and an internal or closed test on Play.
4. Build and upload the two store packages (Expo’s EAS Build and Submit can do this from the same project).
5. Apple and Google each review the app before it goes live.

The stores also have rules we must design for from the start (account deletion, reporting and blocking in chat, and — later — store billing for any subscription). Those are in sections 4 and 5.

---

## 3. AWS in Sydney (`ap-southeast-2`)

A simple, standard shape (names are AWS product names; the job each one does is in plain words):

| Piece | What it is for | Typical AWS service in Sydney |
| --- | --- | --- |
| API | The app’s “brain” — profiles, members, regions, review requests | API Gateway with Lambda, or App Runner / ECS |
| Database | Member profiles, regions, friend and review status | Aurora PostgreSQL or DynamoDB, with encryption turned on |
| Files | Profile photos, chat photos, voice notes, files | S3 buckets in Sydney. Buckets stay **private**. The app uses short-lived, signed links to open a file |
| Login | Email sign-up, plus Facebook and Google sign-in | Amazon Cognito. If we offer Facebook or Google sign-in on iPhone, Apple also expects **Sign in with Apple** as an equal option (App Store Review Guideline 4.8: [developer.apple.com/app-store/review/guidelines](https://developer.apple.com/app-store/review/guidelines/)) |
| Chat | Live one-to-one and region group messages | AWS AppSync (live updates) or API Gateway WebSockets |
| Push notifications | New message, review request, new member in your area | Amazon SNS or Amazon Pinpoint, or Expo Push, talking to Apple Push (APNs) and Firebase Cloud Messaging (FCM) on Android |
| Logs and backups | Who did what, and a copy if something breaks | CloudTrail and app audit logs; automated backups in Sydney |

Keep personal information in `ap-southeast-2` unless a specific service has no Sydney option. If anything is stored or processed outside Australia, the privacy policy must say so. That sits under Australian Privacy Principle 8 (cross-border disclosure). See the OAIC’s [APP quick reference](https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-quick-reference).

This note does not include dollar costs for AWS. Those depend on how many members join and how much chat and photo traffic there is. A later estimate should use the official AWS pricing pages and be labelled as a rough estimate.

---

## 4. Security, privacy and store rules

### Technical security

- **In transit:** all traffic uses HTTPS (TLS).
- **At rest:** the database, file storage and backups are encrypted.
- **Login:** signed-in requests use short-lived tokens from Cognito. Passwords are not stored in the app.
- **Who can see what:** role-based access. Ordinary members only see what they should see. If Vishal later chooses to approve new members, only an admin role can do that.
- **Private files:** S3 buckets are not public. Photos and documents are opened with time-limited links.
- **Backups:** automatic, kept in Sydney, with a tested restore.
- **Audit logs:** sign-in, friend-request actions, review requests, admin approvals, and account deletion are recorded in a way that is hard to silently change.

### Australian privacy

If the app is an APP entity under the Privacy Act, it needs a clearly written, up-to-date **privacy policy**, available free of charge (usually on a website and in the app). That is Australian Privacy Principle 1. The policy should say what is collected, why, how it is stored, who it is shared with, how people can access or correct it, and how to complain. Source: OAIC, [APP 1 guidelines](https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-1-app-1-open-and-transparent-management-of-personal-information) and [Guide to developing an APP privacy policy](https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/more-guidance/guide-to-developing-an-app-privacy-policy).

The app must also take reasonable steps to protect personal information from misuse, loss and unauthorised access, and to destroy or de-identify it when it is no longer needed. Source: OAIC, [APP 11 guidelines](https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-11-app-11-security-of-personal-information).

A lawyer should review the privacy policy before the first store submission. This plan is not legal advice.

### Account deletion (both stores)

People who can create an account must also be able to **delete that account**.

- **Apple:** the request must start **inside the app**. Deleting the account also means deleting the personal data that goes with it, including user-generated content such as photos, messages and posts, unless a law says some of it must be kept — and then you must say what is kept. Source: Apple, [Guideline 5.1.1(v) — Offering account deletion in your app](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion/) and [Apple’s 2022 notice](https://developer.apple.com/news/?id=mdkbobfo).
- **Google Play:** there must be a way **in the app** and a **web page** where someone can request deletion (the web link is entered in Play Console). Freezing or disabling the account is not enough. Any data you are required to keep must be explained in the privacy policy. Source: Google Play, [User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311) and [account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111).

### Chat, photos and other content people create

This app will have profiles, messages, photos and similar user-generated content. Apple requires apps like that to include:

- a way to filter objectionable material
- a way to **report** content, and a timely response
- a way to **block** abusive users
- published contact information so people can reach you

Source: Apple App Store Review Guidelines, section 1.2, [developer.apple.com/app-store/review/guidelines](https://developer.apple.com/app-store/review/guidelines/). The current prototype already has demo block and report actions in chat; the real app must actually carry those through.

---

## 5. Facebook profile links, and Google reviews

These product rules do not change in the real build.

**Facebook.** One-tap Facebook sign-up can reasonably bring in a name and photo. A public profile URL that works for sending a friend request is not guaranteed. Facebook’s `user_link` permission needs App Review (and Advanced Access needs Business Verification), and even then the official link may only open for people who are already connected. **Keep the “paste your Facebook link” option.** Details and sources are in the prototype README.

**Google reviews.** The app may give **ideas and suggestions** after a member picks a real job they actually had done. It must not generate finished, ready-made, swapped or duplicate reviews. The member writes the final review in their own words. That is to stay within [Google’s maps user-content rules](https://support.google.com/contributionpolicy/answer/7400114?hl=en) and [Australian Consumer Law as explained by the ACCC](https://www.accc.gov.au/business/advertising-and-promotions/online-reviews-for-product-and-services).

---

## 6. Free now, subscription later

The app is **free for now**. Every feature in the current design is included in the free plan.

Later, a **Pro** plan can be added. The price is **not set**. Until Vishal chooses a price, screens and documents must say **“Price to be set”**. Do not invent a number.

When a digital subscription is sold **inside** the iPhone or Android app (for example, unlocking extra features in TradeCircle), the stores generally require you to use **their** payment systems, not a random card form in the app:

- **Apple:** if you unlock features or subscriptions inside the app, you must use in-app purchase. Apps may not use their own mechanism to unlock that content. Source: App Store Review Guidelines, section 3.1.1, [developer.apple.com/app-store/review/guidelines](https://developer.apple.com/app-store/review/guidelines/). Auto-renewable subscriptions also have extra rules (ongoing value, at least seven days, clear terms) in section 3.1.2 of the same guidelines, and in Apple’s [Auto-renewable Subscriptions](https://developer.apple.com/app-store/subscriptions/) page.
- **Google Play:** Google Play’s billing system is required for in-app purchases of digital goods and services, including subscription services and extra app features, unless a stated exception applies. Source: [Understanding Google Play’s Payments policy](https://support.google.com/googleplay/android-developer/answer/10281818) and [Google Play’s billing system](https://developer.android.com/google/play/billing). Play also requires a clear way to manage or cancel, including a link to Google Play’s Subscription Center or a direct cancellation path. Source: [Subscriptions policy](https://support.google.com/googleplay/android-developer/answer/9900533).

A paid membership that only exists as a website payment, and does not unlock anything inside the store apps, is a different case. For features inside the iPhone and Android apps, plan on Apple and Google billing. Their fees are set by Apple and Google; this plan does not invent a fee percentage.

The v1.3 prototype has a simple **Subscription** screen: a Free plan (current) and a Pro (coming later) card with “Price to be set”.

---

## 7. Rough phases

These are stages, not a quote and not a calendar. Time depends on how many people are building, store review, and Facebook / Google approvals.

**Phase A — Design (where we are now).** Clickable prototype, including the Subscription screen. No real accounts or live chat yet.

**Phase B — First real app, still free.** Accounts and login (including Facebook, Google, and Sign in with Apple). Profiles, regions, member list, search, paste-your-Facebook-link, add friend. AWS in Sydney, private file storage, privacy policy, in-app and web account deletion, report and block. TestFlight and Play testing, then a first store release if Vishal is happy.

**Phase C — Google reviews.** Google Business Profile connection, review status, one-tap review requests, and the **ideas** helper (not finished reviews).

**Phase D — Live chat and push.** Real one-to-one and region group chat, photos, voice notes, and push notifications for messages, review requests and new members.

**Phase E — Admin and safety.** If Vishal chooses to approve new members, build that. Strengthen moderation, audit logs and support contacts.

**Phase F — Subscription, when prices are set.** Turn on Pro through Apple In-App Purchase and Google Play billing. Until then, keep the app free and keep the “Price to be set” label.

---

## 8. Open questions (unchanged)

1. Should new tradies join straight away, or should Vishal approve each new member first?
2. What is the real app name?
3. When he is ready: what should Pro include, and what is the price?

---

*This plan is a technical and product note, not legal, tax or financial advice. Store rules and AWS services can change; check the official pages before a real build.*
