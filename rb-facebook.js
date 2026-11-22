/* Rate Buddies v2.2.2b — "Continue with Facebook" (Supabase OAuth provider "facebook").
   - Live mode only, and only once the Facebook provider is switched on in Supabase (checked via /auth/v1/settings);
     until then the existing prototype Facebook screens behave exactly as before.
   - APK: opens Facebook in the phone's browser and comes back through the deep link
     com.ratebuddies.app://auth-callback (@capacitor/app appUrlOpen), then exchanges the code for a session.
   - Web (GitHub Pages): normal redirect back to this page; supabase-js picks up the code.
   - After sign-in: first + last name, email and photo are filled from Facebook, then the usual
     business details → areas → Awaiting approval. The Facebook profile link is filled only if Facebook sends one
     (needs the user_link permission); otherwise the existing paste box + help video stays.
   Email sign-up and every existing button stay. */
(function (root) {
  "use strict";
  var DEEP = "com.ratebuddies.app://auth-callback";
  function T() { return root.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function toast(m) { if (T().toast) T().toast(m); }
  function cfg() { return root.RBConfig || {}; }
  function isNative() { try { return !!(root.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform()); } catch (e) { return false; } }
  var fb = { enabled: null, checking: null, busy: false };

  function checkEnabled() {
    if (fb.enabled !== null) return Promise.resolve(fb.enabled);
    if (fb.checking) return fb.checking;
    if (!cfg().url || !cfg().anonKey) return Promise.resolve(false);
    fb.checking = fetch(cfg().url + "/auth/v1/settings", { headers: { apikey: cfg().anonKey } })
      .then(function (r) { return r.json(); })
      .then(function (j) { fb.enabled = !!(j && j.external && j.external.facebook); return fb.enabled; })
      .catch(function () { fb.checking = null; return false; });
    return fb.checking;
  }

  async function start() {
    if (fb.busy) return; fb.busy = true;
    try {
      RB.init();
      var native = isNative();
      var redirectTo = native ? DEEP : (location.origin + location.pathname);
      try { localStorage.setItem("rb_fb_pending", String(Date.now())); } catch (e) {}
      var res = await RB.client.auth.signInWithOAuth({ provider: "facebook", options: { redirectTo: redirectTo, scopes: "email,public_profile,user_link", skipBrowserRedirect: native } });
      if (res.error) throw res.error;
      if (native && res.data && res.data.url) root.location.href = res.data.url; /* Capacitor hands non-app URLs to the system browser */
    } catch (err) {
      toast("Facebook sign-in did not start: " + ((err && err.message) || "please try again"));
    } finally { setTimeout(function () { fb.busy = false; }, 1500); }
  }

  /* deep link back into the APK */
  async function handleUrl(url) {
    if (!url || url.indexOf("com.ratebuddies.app://") !== 0) return;
    try {
      var u = new URL(url.replace("com.ratebuddies.app://", "https://app.local/"));
      var hash = new URLSearchParams((u.hash || "").replace(/^#/, ""));
      var err = u.searchParams.get("error_description") || hash.get("error_description");
      if (err) { toast("Facebook sign-in was cancelled: " + err); return; }
      RB.init();
      var code = u.searchParams.get("code");
      if (code) {
        var r = await RB.client.auth.exchangeCodeForSession(code);
        if (r.error) throw r.error;
      } else if (hash.get("access_token")) {
        var r2 = await RB.client.auth.setSession({ access_token: hash.get("access_token"), refresh_token: hash.get("refresh_token") || "" });
        if (r2.error) throw r2.error;
      } else return;
      await afterLogin();
    } catch (e) { toast("Facebook sign-in failed: " + ((e && e.message) || e)); }
  }

  function splitName(md) {
    var first = md.first_name || md.given_name || "", last = md.last_name || md.family_name || "";
    if (!first && (md.full_name || md.name)) { var parts = String(md.full_name || md.name).trim().split(/\s+/); first = parts.shift() || ""; last = last || parts.join(" "); }
    return { first: first, last: last };
  }
  function fbLink(user) {
    var md = user.user_metadata || {}, ids = user.identities || [], link = md.link || md.profile_url || "";
    ids.forEach(function (i) { var d = i.identity_data || {}; if (!link && (d.link || d.profile_url)) link = d.link || d.profile_url; });
    return /^https:\/\/(www\.|m\.)?facebook\.com\//i.test(link) ? link : "";
  }

  /* user_link permission: ask Facebook for the profile link with the one-time provider token (never stored) */
  async function graphLink(token) {
    try {
      var r = await fetch("https://graph.facebook.com/me?fields=link&access_token=" + encodeURIComponent(token));
      var j = await r.json();
      return (j && /^https:\/\/(www\.|m\.)?facebook\.com\//i.test(j.link || "")) ? j.link : "";
    } catch (e) { return ""; }
  }

  /* After Facebook: fill what Facebook gave us, then the usual details → areas → Awaiting approval */
  async function afterLogin() {
    var sess = (await RB.client.auth.getSession()).data.session;
    if (!sess) return;
    var user = sess.user, md = user.user_metadata || {};
    var isFb = (user.app_metadata && (user.app_metadata.provider === "facebook" || (user.app_metadata.providers || []).indexOf("facebook") >= 0));
    if (!isFb) return;
    try { localStorage.removeItem("rb_fb_pending"); } catch (e) {}
    await RB.getSession(); await RB.loadProfile();
    var p = RB.profile || {}, nm = splitName(md), avatar = md.avatar_url || md.picture || "", link = fbLink(user);
    if (!link && sess.provider_token) link = await graphLink(sess.provider_token);
    var patch = {}, ex = Object.assign({}, p.extras || {});
    if (!p.first && nm.first) patch.first_name = nm.first.slice(0, 60);
    if (!p.last && nm.last) patch.last_name = nm.last.slice(0, 60);
    if (avatar && /^https:\/\//.test(avatar) && ex.avatar_url !== avatar) { ex.avatar_url = avatar; patch.extras = ex; }
    if (link && !p.facebook) patch.facebook = link;
    if (Object.keys(patch).length) { await RB.client.from("profiles").update(patch).eq("id", user.id); await RB.loadProfile(); p = RB.profile || p; }
    if (p.business && p.trade) {
      /* returning member: same as signing in with email */
      if (root.RBApp && RBApp.refresh) await RBApp.refresh();
      toast("Signed in with Facebook.");
      if (p.status === "approved") T().go("home"); else { T().go("pending"); if (root.RBApp && RBApp.watchApproval) RBApp.watchApproval(); }
      return;
    }
    var st = S(), d = st.draft || {};
    d.first = d.first || p.first || nm.first; d.last = d.last || p.last || nm.last;
    d.email = user.email || md.email || d.email || "";
    if (link) d.facebook = link;
    st.draft = d; st.signupMethod = "facebook"; st._rbFbSignup = true; st._rbSignupError = "";
    var got = ["name"]; if (d.email) got.push("email"); if (avatar) got.push("photo"); if (link) got.push("Facebook profile link");
    toast("Connected to Facebook. Your " + got.slice(0, -1).join(", ") + (got.length > 1 ? " and " : "") + got[got.length - 1] + (got.length > 1 ? " are" : " is") + " filled in. Add your business next.");
    T().go("signup-name");
  }

  /* Finish: the account already exists (Facebook), so save the details on the profile instead of signing up */
  async function finishFacebookSignup() {
    var st = S(), d = st.draft || {};
    if (!RB.session || !st._rbFbSignup) return;
    var ex = Object.assign({}, (RB.profile && RB.profile.extras) || {});
    if (d.abn) ex.abn = String(d.abn).trim();
    var patch = { first_name: (d.first || "").slice(0, 60), last_name: (d.last || "").slice(0, 60), business: (d.business || "").slice(0, 120), trade: (d.trade || "").slice(0, 120), extras: ex };
    if (d.phone) patch.phone = String(d.phone).slice(0, 30);
    var regs = (d.regions && d.regions.length ? d.regions : st.stepRegions) || [];
    if (regs.length) patch.regions = regs;
    if (d.facebook && !(RB.profile && RB.profile.facebook)) patch.facebook = d.facebook;
    var r = await RB.client.from("profiles").update(patch).eq("id", RB.session.user.id);
    if (r.error) { st._rbSignupError = r.error.message; toast("Your details were not saved: " + r.error.message); return; }
    st._rbFbSignup = false;
    await RB.loadProfile();
    toast("Thanks. Your profile is waiting for approval.");
    if (root.RBApp && RBApp.watchApproval) RBApp.watchApproval();
    if (S().screen === "pending") T().go("pending", { replace: true });
  }

  document.addEventListener("click", function (e) {
    if (!root.RB || RB.isDemo()) return;
    var b = e.target.closest && e.target.closest("[data-action]");
    if (!b) return;
    var a = b.getAttribute("data-action");
    if ((a === "fb-connect" && b.getAttribute("data-next") === "signup-name") || a === "rb-fb-signin") {
      if (fb.enabled === true && !RB.session) { e.preventDefault(); e.stopImmediatePropagation(); start(); return; }
      if (a === "rb-fb-signin") { e.preventDefault(); e.stopImmediatePropagation(); toast("Facebook sign-in is being switched on. Use your email and password for now."); }
      return; /* provider off: the prototype Facebook screens run as before */
    }
    if (a === "finish-create" && RB.session && S()._rbFbSignup) {
      setTimeout(function () { if (S().screen === "pending") finishFacebookSignup(); }, 0);
    }
  }, true);
  document.addEventListener("submit", function (e) {
    if (!root.RB || RB.isDemo()) return;
    var f = e.target, type = f && f.getAttribute && f.getAttribute("data-form");
    if ((type === "create-profile" || type === "signup-business") && RB.session && S()._rbFbSignup) {
      setTimeout(function () { if (S().screen === "pending") finishFacebookSignup(); }, 0);
    }
  }, true);

  /* Sign in screen: add "Continue with Facebook" under the form (nothing removed) */
  var FB_BTN = '<button type="button" class="btn btn-fb" data-action="rb-fb-signin" style="margin-top:10px;width:100%">' +
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg> Continue with Facebook</button>';
  function patchSignin() {
    if (patchSignin._t) return;
    patchSignin._t = setInterval(function () {
      if (!root.RB || RB.isDemo()) return;
      var sc = document.querySelector('[data-screen="signin"]'); if (!sc) return;
      var f = sc.querySelector('form[data-form="signin"]');
      if (f && !sc.querySelector('[data-action="rb-fb-signin"]')) f.insertAdjacentHTML("afterend", FB_BTN);
    }, 400);
  }

  function boot() {
    patchSignin();
    checkEnabled();
    try {
      var App = root.Capacitor && Capacitor.Plugins && Capacitor.Plugins.App;
      if (App && App.addListener && !boot._l) {
        boot._l = true;
        App.addListener("appUrlOpen", function (ev) { handleUrl(ev && ev.url); });
        if (App.getLaunchUrl) App.getLaunchUrl().then(function (r) { if (r && r.url) handleUrl(r.url); }).catch(function () {});
      }
    } catch (e) {}
    /* web return (?code=…) or a Facebook session that has not finished the details yet */
    setTimeout(function () {
      if (!root.RB || RB.isDemo() || !RB.client) return;
      var pending = false; try { pending = !!localStorage.getItem("rb_fb_pending"); } catch (e) {}
      RB.client.auth.getSession().then(function (r) {
        var s = r.data && r.data.session; if (!s) return;
        var prov = s.user.app_metadata || {};
        if (prov.provider === "facebook" || (prov.providers || []).indexOf("facebook") >= 0) {
          if (pending || !(RB.profile && RB.profile.business && RB.profile.trade)) afterLogin();
        }
      });
    }, 1800);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else setTimeout(boot, 0);
  root.RBFacebook = { start: start, checkEnabled: checkEnabled, handleUrl: handleUrl, afterLogin: afterLogin, state: fb };
})(window);
