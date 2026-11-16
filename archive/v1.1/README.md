# TradeCircle Perth — UI prototype v1.1

Placeholder app name for the Facebook Business Marketing project.

## Open it

- Desktop: open `index.html` (or `TradeCircle-Perth.html`) in a browser. Use the screen list on the right to preview each screen in the phone.
- Phone: the same file opens the app full screen.
- Deep links: `index.html#members`, `index.html#member/liam`, `index.html?shot=welcome` (shot mode is 390×844, no studio chrome).

`index.html` loads `styles.css` and `app.js`. `TradeCircle-Perth.html` is the same prototype with CSS and JS inlined. Both need the `fonts/` folder beside them.

## What’s new in v1.1

- **Sign up with Facebook** on the sign-up screen, and **Continue with Facebook** on Welcome. Create profile and Edit profile have a one-tap **Connect Facebook** button. Tapping it opens a consent sheet clearly marked as a **prototype mock** — it is not a real Facebook login and nothing is sent to Facebook. After Continue, the demo fills in the name, initials and a fictional Facebook profile link, and shows a **Facebook connected** state with **Disconnect**. Pasting a link by hand is still available (“or paste your link”). Settings shows a **Facebook: Connected** row.
- Each member card has a compact Facebook-blue **Add friend** button. It opens that member’s Facebook profile to send a friend request, without opening their in-app profile. Tapping the rest of the card still opens the in-app profile.
- The Members search box suggests matching **Trades** and **Members** as you type (for example, “plu” brings up Plumber and matching people). Picking a trade applies the trade filter chip. The trade field on Create and Edit profile uses the same type-ahead suggestions.

## What a real Facebook Login can and cannot do

This is important for the real build. The in-app button is only a mock. Facebook’s own rules are tighter than “one tap and we always get a public profile URL”.

**Name and photo are the easy part.** A standard Facebook Login with the default `public_profile` permission can return the person’s name, profile picture, and an app-scoped ID. Email is a separate `email` permission, which does not need App Review. Sources: [Facebook Login privacy update (1 May 2018, page updated 22 Oct 2025)](https://developers.facebook.com/blog/post/2018/05/01/facebook-login-updates-further-protect-privacy/) and [Permissions reference](https://developers.facebook.com/docs/permissions/).

**A Facebook profile URL is not included in that default login.** Since Graph API 3.0, apps that want a profile link must request the `user_link` permission, the person must grant it, and the app then reads the `link` field on the User object. You cannot build a working profile URL from the app-scoped ID any more. Sources: same 2018/2025 Login post; [Graph API User `link` field](https://developers.facebook.com/docs/graph-api/reference/user/); [Permissions reference, `user_link`](https://developers.facebook.com/docs/permissions/) (the `user_link` allowed use is “provide a way for someone who uses your app to visit another person's Facebook profile”).

**Going live needs a Facebook App Review.** `public_profile` and `email` can be used without review. `user_link` is beyond that, so Meta App Review is required before people who are not testers or app-role users can grant it. For **Advanced Access** (anyone, not just people with a role on the app), Meta also requires **Business Verification**. Sources: [Permissions reference — requirements](https://developers.facebook.com/docs/permissions/); [Access levels](https://developers.facebook.com/docs/graph-api/overview/access-levels/); [Login / permissions review](https://developers.facebook.com/docs/facebook-login/guides/permissions/review/).

**The link Facebook returns is not a simple, permanent `facebook.com/username` address.** Meta says these links should be treated as **opaque**. They can stop working if the person removes the permission or when access to their data expires. They should only be shared with other users of the app, not with analytics or similar tools. Sources: [2018/2025 Login post](https://developers.facebook.com/blog/post/2018/05/01/facebook-login-updates-further-protect-privacy/).

**There is a further catch for friend requests.** Meta’s User docs say the `link` field “will only resolve if the person clicking the link is logged into Facebook and is a friend of the person whose profile is being viewed.” The 2018/2025 Login post says that for most apps, the link only opens the profile for logged-in people in that person’s extended network. So even after a successful `user_link` approval, the official link may not work as a “send a friend request” button for people who are not already connected on Facebook. That is the opposite of what this app needs. **Do not assume one-tap Facebook Login will replace a pasted public profile URL for friend requests.** Keep the “paste your link” option in the real product, and test a live `user_link` result with two Facebook accounts that are not already friends before committing to it. Sources: [Graph API User `link` field](https://developers.facebook.com/docs/graph-api/reference/user/); [2018/2025 Login post](https://developers.facebook.com/blog/post/2018/05/01/facebook-login-updates-further-protect-privacy/).

## Screenshots

See `screens/` (390×844 at 2×) and `overview.png` (six key screens, including the connect flow).
