/* Rate Buddies v2.2.2 build 18 — every "Leave Google Review" / "Review back" / "Copy and open Google" button opens the
   member's own Google Business Profile exactly like the working "Google Business Profile" button on their profile:
   same link (RBLinks.reviewUrl: the saved google_business_url, or a direct write-review link only when a real Place ID is
   in it) and the same way of opening (handed to Android, so it opens in the Google Maps app, never an in-app Google sign-in).
   Vishal, 22 Nov: "Leave Google Review is going to Google sign-in rather than opening John's Google profile in Maps".
   Root cause: Incoming swap requests looked for the link in fields live members don't have, then fell back to a demo
   write-review link (placeid=demo-...), which Google answers with a sign-in page. If a member has no link, say so. */
(function () {
  "use strict";
  var root = window;
  function T() { return root.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function member(id) { return (T().MEMBERS || []).filter(function (m) { return m.id === id; })[0] || null; }
  function toast(m) { if (T().toast) T().toast(m); else alert(m); }
  function urlFor(m) { return (m && root.RBLinks && RBLinks.reviewUrl) ? RBLinks.reviewUrl(m) : ""; }
  function open(u) { if (root.RBLinks && RBLinks.openExternal) RBLinks.openExternal(u); else root.open(u, "_blank", "noopener"); }
  function missing(m) { toast(((m && m.first) || "This member") + " hasn't added their Google Business Profile link yet, so there's nowhere to leave the review. Ask them to add it in Edit profile."); }
  /* returns true when it opened (or explained) */
  function leave(id) {
    var m = member(id);
    var u = urlFor(m);
    if (!u) { missing(m); return false; }
    open(u); return true;
  }
  var GOOGLE_HREF = /(^https?:\/\/)(search\.google\.com\/local\/writereview|www\.google\.[a-z.]+\/search\?q=|maps\.app\.goo\.gl|goo\.gl\/maps|g\.page|www\.google\.[a-z.]+\/maps|maps\.google\.)/i;
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented) return; /* e.g. daily limit reached, or "write or pick an idea first" */
    var el = e.target.closest && e.target.closest("[data-action='review-back'], [data-action='copy-open'], a[href]");
    if (!el || el.closest("#tabbar")) return;
    var act = el.getAttribute("data-action") || "";
    if (act !== "review-back" && act !== "copy-open") {
      var href = el.getAttribute("href") || "";
      if (!GOOGLE_HREF.test(href) || el.hasAttribute("data-rb-raw")) return;
    }
    var id = el.getAttribute("data-id") || (act === "copy-open" ? S().reviewFor : "") || (S().screen === "member" ? S().selectedMember : "");
    if (!id) return;
    e.preventDefault(); /* the app's own handlers still run (copy text, mark reviewed); only the opening is ours */
    leave(id);
  }, true);
  root.RBReviewLink = { leave: leave, urlFor: urlFor };
})();

/* Rate Buddies v2.2.2 build 18 — Facebook profile links (Add friend / Facebook Profile / friends queue / grey "Facebook
   friends" chip / any facebook.com link) open in the FACEBOOK APP (Vishal, 22 Nov: "when adding a Facebook friend, the
   profile link should open in the Facebook app itself"). Android: App Launcher checks the Facebook app is installed and
   opens fb://facewebmodal/f?href=<profile>; without the app, the normal https link is handed to Android (browser).
   The old Android "intent://" link did nothing inside the app, because the app shell only hands real links to Android. */
(function () {
  "use strict";
  var root = window;
  function cap() { return root.Capacitor; }
  function native() { var c = cap(); return !!(c && c.isNativePlatform && c.isNativePlatform()); }
  function platform() { var c = cap(); return (c && c.getPlatform && c.getPlatform()) || "web"; }
  function launcher() { var c = cap(); return c && c.Plugins && c.Plugins.AppLauncher; }
  /* facebook.com/profile.php?id=…, vanity names, m./mbasic./web./fb.com links -> one clean https://www.facebook.com/... link */
  function norm(u) {
    u = String(u || "").trim(); if (!u) return "";
    if (!/^https?:\/\//i.test(u)) u = "https://" + u.replace(/^\/+/, "");
    try {
      var x = new URL(u);
      var h = x.hostname.toLowerCase();
      if (/(^|\.)fb\.me$/.test(h)) return x.href; /* short link: let Facebook resolve it */
      if (/(^|\.)(facebook\.com|fb\.com)$/.test(h)) {
        x.protocol = "https:"; x.hostname = "www.facebook.com";
        ["fbclid", "mibextid", "rdid", "share_url", "_rdr"].forEach(function (k) { x.searchParams.delete(k); });
        var keepQ = /^\/profile\.php$/i.test(x.pathname) || /^\/people\//i.test(x.pathname);
        if (!keepQ) { var id = x.searchParams.get("id"); x.search = ""; if (id && /^\/profile\.php/i.test(x.pathname)) x.searchParams.set("id", id); }
        x.hash = "";
        return x.href;
      }
      return x.href;
    } catch (e) { return u; }
  }
  function external(u) { if (native()) root.location.href = u; else root.open(u, "_blank", "noopener"); }
  var busy = 0;
  async function open(url) {
    var u = norm(url); if (!u) return false;
    if (Date.now() - busy < 1200) return true; busy = Date.now(); /* one tap = one open */
    var fbApp = "fb://facewebmodal/f?href=" + encodeURIComponent(u);
    if (!native()) { root.open(u, "_blank", "noopener"); return true; }
    var L = launcher();
    if (L && L.canOpenUrl && L.openUrl) {
      try {
        var pkg = platform() === "ios" ? "fb://" : "com.facebook.katana";
        var c = await L.canOpenUrl({ url: pkg });
        if (c && c.value) { var r = await L.openUrl({ url: fbApp }); if (!r || r.completed !== false) return true; }
      } catch (e) {}
      external(u); return true;
    }
    /* older app shell without App Launcher: try the app, fall back to the link if nothing opened */
    var left = false;
    function vis() { if (document.visibilityState === "hidden") left = true; }
    document.addEventListener("visibilitychange", vis);
    try { root.location.href = fbApp; } catch (e2) {}
    setTimeout(function () { document.removeEventListener("visibilitychange", vis); if (!left) external(u); }, 1500);
    return true;
  }
  root.RBFb = { open: open, norm: norm };
  var FB_HREF = /^(https?:)?\/\/((www|m|mbasic|web|touch)\.)?(facebook\.com|fb\.com|fb\.me)\//i;
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented) return;
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || !FB_HREF.test(a.getAttribute("href") || "")) return;
    e.preventDefault(); /* the app's own handler (e.g. mark the request as pending) still runs */
    open(a.getAttribute("href"));
  }, true);
})();

/* Rate Buddies v2.2.2 build 18 — ONE way out of the app for every external link (Vishal, 23 Nov: "make sure all links
   open in Facebook and Google Maps itself"). Facebook links (profiles, pages, groups, posts, friend requests) -> the Facebook
   app; Google / Maps / Google Business Profile / review links -> the Google Maps app; anything else -> the phone's browser.
   Never inside the app's WebView. Android: the app shell's RBOpenNative bridge opens the link in that app by package
   (com.facebook.katana / com.google.android.apps.maps) and falls back to the browser when the app isn't installed. */
(function () {
  "use strict";
  var root = window;
  function cap() { return root.Capacitor; }
  function native() { var c = cap(); return !!(c && c.isNativePlatform && c.isNativePlatform()); }
  var FB_HOST = /(^|\.)(facebook\.com|fb\.com|fb\.me|fb\.watch|m\.me)$/i;
  var G_HOST = /(^|\.)(maps\.app\.goo\.gl|goo\.gl|g\.page|g\.co|maps\.google\.[a-z.]+|google\.[a-z.]+)$/i;
  function host(u) { try { return new URL(u).hostname.toLowerCase(); } catch (e) { return ""; } }
  function kind(u) {
    var h = host(u); if (!h) return "";
    if (FB_HOST.test(h)) return "fb";
    if (G_HOST.test(h)) { if (/^(accounts|mail|docs|drive|play|calendar)\./.test(h)) return "web"; return "maps"; }
    return "web";
  }
  /* Google Maps can't open a write-review link; with a Place ID open that place in Maps (Write a review is one tap there) */
  function mapsUrl(u) {
    var pid = (u.match(/[?&](?:placeid|place_id)=([^&#]+)/i) || [])[1];
    if (pid && /writereview|local\/write/i.test(u)) return "https://www.google.com/maps/search/?api=1&query=Google&query_place_id=" + pid;
    return u;
  }
  var log = [];
  function rec(how, url) { log.push({ how: how, url: url, at: Date.now() }); if (log.length > 30) log.shift(); }
  var last = 0;
  function nativeOpen(url, pkg) {
    var B = root.RBOpenNative;
    if (B && B.open) { try { var r = B.open(url, pkg || ""); rec("bridge:" + (pkg || "browser") + ":" + r, url); return r !== "error"; } catch (e) {} }
    return false;
  }
  function open(u) {
    u = String(u || "").trim(); if (!u) return false;
    if (!/^https?:\/\//i.test(u)) { if (/^(www\.|m\.)?(facebook|google)\./i.test(u)) u = "https://" + u; else return false; }
    if (Date.now() - last < 900) return true; last = Date.now(); /* one tap = one open */
    var k = kind(u);
    if (k === "fb") {
      var fu = (root.RBFb && RBFb.norm) ? RBFb.norm(u) : u;
      if (!native()) { rec("window.open", fu); root.__rbWinOpen ? root.__rbWinOpen.call(root, fu, "_blank", "noopener") : root.open(fu, "_blank", "noopener"); return true; }
      if (root.RBOpenNative) {
        var B = root.RBOpenNative, inst = false; try { inst = B.has("com.facebook.katana"); } catch (e) {}
        if (inst && nativeOpen("fb://facewebmodal/f?href=" + encodeURIComponent(fu), "com.facebook.katana")) return true;
        return nativeOpen(fu, "com.facebook.katana") || (root.location.href = fu, true);
      }
      if (root.RBFb && RBFb._appLauncher) return RBFb._appLauncher(fu);
      root.location.href = fu; return true;
    }
    if (k === "maps") {
      var mu = mapsUrl(u);
      if (!native()) { rec("window.open", u); root.__rbWinOpen ? root.__rbWinOpen.call(root, u, "_blank", "noopener") : root.open(u, "_blank", "noopener"); return true; }
      if (nativeOpen(mu, "com.google.android.apps.maps")) return true;
      root.location.href = mu; return true; /* older app shell: Android opens Maps links in Maps */
    }
    if (!native()) { rec("window.open", u); root.__rbWinOpen ? root.__rbWinOpen.call(root, u, "_blank", "noopener") : root.open(u, "_blank", "noopener"); return true; }
    if (nativeOpen(u, "")) return true;
    root.location.href = u; return true;
  }
  root.RBOpen = { open: open, kind: kind, mapsUrl: mapsUrl, log: function () { return log.slice(); } };
  /* route the older openers through here */
  function hook() {
    if (root.RBLinks && !RBLinks._b18) { RBLinks._b18 = 1; RBLinks.openExternal = open; }
    if (root.RBFb && !RBFb._b18) { RBFb._b18 = 1; RBFb._appLauncher = RBFb.open; RBFb.open = function (u) { return open(u); }; }
  }
  hook(); setInterval(hook, 1000);
  /* window.open(...) of an outside link from any older screen -> same route (never a WebView window) */
  if (!root.__rbWinOpen) {
    root.__rbWinOpen = root.open;
    root.open = function (u, t, f) {
      var s = String(u || "");
      if (/^https?:\/\//i.test(s) && host(s) && host(s) !== location.hostname) { open(s); return null; }
      return root.__rbWinOpen.apply(root, arguments);
    };
  }
  /* any tapped link that leaves the app (target=_blank or an outside host) */
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented) return;
    var a = e.target.closest && e.target.closest("a[href]"); if (!a) return;
    var href = a.getAttribute("href") || "";
    if (!/^https?:\/\//i.test(href) || host(href) === location.hostname) return;
    e.preventDefault();
    open(href);
  }, true);
})();
