# Testing Rate Buddies v1.9.0

This version connects the phone app and the web admin so they share the same live test data. Everything in the test data is fictional. Nothing is sent to Facebook or Google.

Test account emails and passwords are **not** in this repository. You’ll get a short private login file from the person who set this up. Keep that file to yourself.

## 1. Install the Android app (debug APK)

Once this version has been pushed, GitHub Actions builds a debug APK and attaches it to a release named **Rate Buddies test build v1.9.0** (tag `apk-latest`).

1. On your phone, open the GitHub release for tag `apk-latest` in the `rate-buddies-preview` repo. You can do this in the browser — you do not need to sign in to download from a public release.
2. Download `app-debug.apk`.
3. If Android asks, allow this browser (or your Files app) to install unknown apps.
4. Open the APK and install **Rate Buddies**.
5. This is a test build, not a Play Store app, so Android may show a warning. That’s expected.

If the release is not there yet, the same APK is also stored as a GitHub Actions artifact named `rate-buddies-debug-apk`. Artifacts usually need a GitHub login, which is why the release is the easier path from a phone.

You can also open the app in a phone browser after this version is published, at the usual preview link, and use **Full screen preview**. The admin stays in the browser at `admin.html`.

## 2. Sign in

Turn **Demo (offline)** off (it should be off by default). Use the accounts in the private login file:

- The **admin** account is for the web admin only.
- **Jamie** and **Michael** are approved members. Use them in the phone app.
- There is also a **pending** applicant (Nina) you can approve as a test.

Do not type those passwords into a public chat or into this file.

## 3. What to try in the web admin

Open `admin.html` (on the published preview site, or locally if you have the files).

1. Sign in with the admin account.
2. Open **Profile requests**. You should see Nina Kaur (Kaur Tiling) waiting.
3. Tap **Approve**. Nina can now sign in on the phone. The first screen she gets is the intro video, which she has to watch.
4. Open **Incoming requests** (Devi). There should be a plumber request from the Joondalup Community Noticeboard, featuring Michael.
5. Tap **Approve**. Members in Perth who are not plumbers (Jamie, for example) get an alert and see the request in **Recommend**.
6. After someone taps **I recommended Michael** in the app, the progress on that request should update here.

If you only want to click around the old sample screens, turn on **Demo (offline)** on the admin sign-in page. That mode does not change the shared test data.

## 4. What to try in the phone app

1. Sign in as Jamie (approved, intro already watched). You should land on Home.
2. After you approve the Joondalup plumber request in the admin, open **Facebook → Recommend**. You should see the alert to help Michael, with suggested texts, an “Add your own words” box, Copy, and Open post.
3. Choose a starter, add a couple of your own words, copy the text, then tap **I recommended Michael**. That progress should show in the admin.
4. Open **More → Video tutorials**. The sections and videos come from the admin’s Video tutorials list (the intro is the first pinned section).
5. Sign out, then sign in as Nina after you have approved her. You should be asked to watch the intro before the rest of the app.
6. Sign in as Michael if you want to check a plumber account. He should not be asked to recommend himself (same-trade members are not alerted).

## 5. New sign-ups

From the app, create an account with a new email and password (at least 8 characters). The profile waits in **Profile requests** until you approve or decline it. Until you approve it, that person stays on the waiting screen.

## 6. If something doesn’t look connected

- Confirm **Demo (offline)** is off.
- Confirm you are using the accounts from the private login file, not the old `demopass` sample.
- Pull to refresh or go back and into the screen again. Most lists also update live on their own.
- The APK and the web admin must both be this v1.9.0 build. An older preview on the public site will still show sample-only data until this version is published.

## 7. What this test build does not do yet

- It does not send Facebook comments or friend requests, or Google reviews, for you.
- Push notifications and a real Devi webhook still come later (with AWS).
- The APK is a debug build for your own phone, not a Play Store release.
