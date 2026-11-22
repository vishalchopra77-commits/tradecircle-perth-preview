/* Rate Buddies v2.2.2 build 18 — example (placeholder) text on sign-up / Complete your profile / Edit profile.
   Vishal (22 Nov): pest-control examples showed even with a different trade chosen. Examples now follow the trade
   picked on screen (the trade box), else the signed-in member's saved trade, else the sign-up draft, and update
   as soon as the trade changes. No trade yet = neutral examples. Never touches what the member typed. */
(function () {
  "use strict";
  var SCREENS = { signup: 1, "signup-email": 1, "signup-phone": 1, "signup-name": 1, "create-profile": 1, "create-profile-connected": 1, "signup-business": 1, "complete-profile": 1, "edit-profile": 1 };
  function cap(w) { return w ? w.charAt(0).toUpperCase() + w.slice(1) : w; }
  /* the member's trade right now: what is in the trade box on this screen, then the saved live profile */
  function trade() {
    try {
      var sc = document.querySelector(".screen.active"), box = sc && sc.querySelector("#tradeType");
      var v = box && String(box.value || "").trim();
      if (v) return v;
      if (box && sc && /create-profile|signup/.test(sc.getAttribute("data-screen") || "")) return ""; /* new member, nothing chosen yet */
      if (window.RB && RB.profile && RB.profile.trade) return String(RB.profile.trade).trim();
      var TC = window.TradeCircle, st = TC && TC.state;
      var d = st && st.signup && st.signup.draft; if (d && d.trade) return String(d.trade).trim();
      if (!(window.RB && RB.session) && TC && TC.me) { var m = TC.me(); if (m && m.trade && m.id !== "jamie") return String(m.trade).trim(); }
    } catch (e) {}
    return "";
  }
  /* "Electrician" -> "Electrical", "Plumber" -> "Plumbing" … for a sample business name */
  var NOUN = [[/plumb/, "Plumbing"], [/electr/, "Electrical"], [/paint/, "Painting"], [/carpent|joiner/, "Carpentry"], [/landscap|garden/, "Landscaping"],
    [/roof/, "Roofing"], [/fenc/, "Fencing"], [/til(e|er|ing)/, "Tiling"], [/hair|salon/, "Hair Studio"], [/barber/, "Barbers"], [/clean/, "Cleaning"],
    [/build/, "Building"], [/pest/, "Pest Control"], [/air ?con|hvac/, "Air Conditioning"], [/lock/, "Locksmiths"], [/mechanic|auto/, "Auto Care"],
    [/account|bookkeep/, "Accounting"], [/photo/, "Photography"], [/real ?estate/, "Realty"], [/beaut|nail|lash|brow/, "Beauty"], [/fitness|personal train/, "Fitness"]];
  function noun(t) { var k = t.toLowerCase(); for (var i = 0; i < NOUN.length; i++) if (NOUN[i][0].test(k)) return NOUN[i][1]; return t.split(/\s+/).map(cap).join(" "); }
  var ABOUT = {
    "pest control": "e.g. Family-run pest control serving Perth\u2019s northern suburbs since 2012. Fully licensed, safe treatments, and we always explain what we find.",
    "plumber": "e.g. Family-run plumbing serving Perth\u2019s northern suburbs since 2012. Fully licensed, upfront pricing, and we always leave the job clean.",
    "electrician": "e.g. Family-run electrical business serving Perth\u2019s northern suburbs since 2012. Fully licensed, safety-first, and we always explain the work before we start.",
    "painter": "e.g. Family-run painting business serving Perth\u2019s northern suburbs since 2012. Quality paints, tidy work, and we always protect your home while we paint.",
    "landscaper": "e.g. Family-run landscaping business serving Perth\u2019s northern suburbs since 2012. Waterwise gardens, reliable crews, and we always stick to the plan we agree.",
    "hairdresser": "e.g. Friendly local hair studio in Perth\u2019s northern suburbs since 2012. Cuts, colour and styling for the whole family, and we always listen to what you want."
  };
  var NEUTRAL = {
    business: "e.g. Northside Home Services",
    tagline: "e.g. Trusted local business serving Perth since 2012",
    bio: "e.g. I\u2019m Sam, based in Joondalup. I\u2019m on time, I explain everything clearly and I treat every customer like a neighbour.",
    profileAbout: "e.g. Family-run local business serving Perth\u2019s northern suburbs since 2012. Reliable, upfront pricing, and we always explain things before we start."
  };
  function ex(name, t) {
    t = t == null ? trade() : t; var k = t.toLowerCase();
    if (name === "business") return t ? "e.g. Northside " + noun(t) : NEUTRAL.business;
    if (name === "tagline") return t ? "e.g. Trusted local " + k + " serving Perth since 2012" : NEUTRAL.tagline;
    if (name === "bio") return t ? "e.g. I\u2019m Sam, a local " + k + " based in Joondalup. I\u2019m on time, I explain everything clearly and I treat every customer like a neighbour." : NEUTRAL.bio;
    if (name === "profileAbout") {
      if (!t) return NEUTRAL.profileAbout;
      for (var key in ABOUT) if (k.indexOf(key) !== -1) return ABOUT[key];
      return "e.g. Family-run " + k + " business serving Perth\u2019s northern suburbs since 2012. Reliable, upfront pricing, and we always explain things before we start.";
    }
    if (name === "profileSpecialties") {
      var svc = (window.TC158 && TC158.servicesForTrade) ? TC158.servicesForTrade(t) : [];
      return svc.length >= 2 ? "e.g. " + svc[0] + ", " + svc[1] : "e.g. Repairs, New installs";
    }
    return null;
  }
  function aboutPh() { return ex("profileAbout"); }
  /* trade-led examples are always kept current; the rest are only filled in where a field has none */
  var TRADE_LED = { business: 1, tagline: 1, bio: 1, profileAbout: 1, profileSpecialties: 1 };
  var BY_NAME = {
    profileIdealNote: function () { return "e.g. Builders and property managers who need a reliable trade they can trust with their clients."; },
    first: function () { return "e.g. Sam"; },
    last: function () { return "e.g. Nguyen"; },
    phone: function () { return "e.g. 0412 345 678"; },
    abn: function () { return "11-digit ABN"; },
    email: function () { return "you@example.com"; }
  };
  var SKIP = { hidden: 1, checkbox: 1, radio: 1, file: 1, submit: 1, button: 1, range: 1, color: 1, password: 1 };
  function fill() {
    var sc = document.querySelector(".screen.active"); if (!sc || !SCREENS[sc.getAttribute("data-screen")]) return;
    var t = trade();
    sc.querySelectorAll("input, textarea").forEach(function (el) {
      if (SKIP[el.type]) return;
      var n = el.name || el.id;
      if (TRADE_LED[n]) { var want = ex(n, t); if (want && el.getAttribute("placeholder") !== want) el.setAttribute("placeholder", want); return; }
      if (el.getAttribute("placeholder")) return;
      var f = BY_NAME[n]; if (f) el.setAttribute("placeholder", f());
    });
  }
  setInterval(fill, 400);
  document.addEventListener("input", function (e) { if (e.target && e.target.id === "tradeType") setTimeout(fill, 0); }, true);
  document.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("[data-ac-trade], [data-trade-pick]")) setTimeout(fill, 50); }, true);
  document.addEventListener("DOMContentLoaded", fill);
  window.RBPlaceholders = { fill: fill, aboutPh: aboutPh, ex: ex, trade: trade, neutral: NEUTRAL };
})();

/* v2.2.2 b16 (Vishal, 22 Nov): a new screen always opens at the TOP.
   After Save / Skip on "Complete your profile", Home was opening scrolled to the bottom. Reset the real scroller
   (.screen.active .scroll), every scrolled ancestor and the document whenever the screen id changes — except Back,
   which restores the earlier position on purpose, and in-place re-renders of the same screen. */
(function () {
  "use strict";
  var last = null, lastOpts = {}, lastAt = 0, userAt = 0;
  function T() { return window.TradeCircle || {}; }
  function wrap() {
    var TC = T(); if (!TC.go || TC.go._rb222g) return;
    var orig = TC.go;
    var w = function (id, opts) { lastOpts = opts || {}; lastAt = Date.now(); return orig.apply(this, arguments); };
    w._rb222g = true; Object.keys(orig).forEach(function (k) { w[k] = orig[k]; });
    TC.go = w;
  }
  ["pointerdown", "touchstart", "wheel", "keydown"].forEach(function (ev) { document.addEventListener(ev, function (e) { if (!(e.target && e.target.closest && e.target.closest("button, a, [data-action], [data-go]"))) userAt = Date.now(); }, { capture: true, passive: true }); });
  function toTop() {
    var sc = document.querySelector(".screen.active"); if (!sc) return;
    var el = sc.querySelector(".scroll") || sc;
    for (var n = el; n && n !== document.documentElement; n = n.parentElement) if (n.scrollTop) n.scrollTop = 0;
    var se = document.scrollingElement || document.documentElement; if (se.scrollTop) se.scrollTop = 0;
    if (window.scrollY) window.scrollTo(0, 0);
  }
  function check() {
    wrap();
    var sc = document.querySelector(".screen.active"); if (!sc) return;
    var id = sc.getAttribute("data-screen");
    if (id === last) return;
    var prev = last; last = id;
    if (prev === null) return;
    var recent = Date.now() - lastAt < 1500;
    if (recent && (lastOpts.back || lastOpts.keepScroll === true)) return;   /* Back keeps its saved position */
    var a = document.activeElement;                                          /* close the keyboard: a focused field on the old screen can drag the view */
    if (a && a !== document.body && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && !sc.contains(a)) a.blur();
    var started = Date.now();
    toTop();
    [40, 120, 300, 600].forEach(function (ms) { setTimeout(function () {
      var s2 = document.querySelector(".screen.active"); if (!s2 || s2.getAttribute("data-screen") !== id) return;
      if (userAt > started) return;                                          /* never fight a finger */
      toTop();
    }, ms); });
  }
  function start() {
    wrap();
    var host = document.querySelector(".screen.active") ; host = host ? host.parentElement : document.body;
    new MutationObserver(check).observe(host, { childList: true });
    check();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  setInterval(check, 250);
  window.RBScrollTop = { toTop: toTop };
})();

/* v2.2.2 b16 (Vishal, 22 Nov): every profile page gets two clear buttons near the top -
   "Facebook Profile" (send a friend request) and "Google Business Profile" (leave a review).
   Links come from the member row: live = profiles.facebook (or a facebook.com profile_url) and google_business_url;
   local demo = the fictional seed links in app.js. A missing link shows "Not added yet" and explains itself when tapped. */
(function () {
  "use strict";
  function T() { return window.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
  function okUrl(u) { u = String(u || "").trim(); if (!u) return ""; if (!/^https?:\/\//i.test(u)) u = "https://" + u.replace(/^\/+/, ""); return u; }
  function fbUrl(m) {
    if (!m) return "";
    var c = [m.facebook, m.links && m.links.facebook, m.profileUrl, m.profile_url, m.page];
    for (var i = 0; i < c.length; i++) { var u = String(c[i] || ""); if (/facebook\.com|fb\.com|fb\.me/i.test(u)) return okUrl(u); }
    return "";
  }
  function gbpUrl(m) {
    if (!m) return "";
    return okUrl((m.links && m.links.google) || m.googleBusinessUrl || m.google_business_url || m.googleLink || m.google || "");
  }
  /* writereview link when a place ID is visible, otherwise the GBP link itself */
  function reviewUrl(m) {
    var u = gbpUrl(m); if (!u) return "";
    if (/writereview|\/review\b|lrd=/i.test(u)) return u;
    var pid = (u.match(/[?&](?:placeid|place_id)=([^&#]+)/i) || [])[1] || (u.match(/place_id:([A-Za-z0-9_-]+)/) || [])[1];
    if (pid) return "https://search.google.com/local/writereview?placeid=" + pid;
    var gp = u.match(/^https?:\/\/g\.page\/r\/([^/?#]+)/i); if (gp) return "https://g.page/r/" + gp[1] + "/review";
    return u;
  }
  function native() { var c = window.Capacitor; return !!(c && c.isNativePlatform && c.isNativePlatform()); }
  /* Capacitor's Android bridge hands any non-app URL to the system (ACTION_VIEW): Facebook / Maps app or the browser */
  function openExternal(u) { if (window.RBOpen && RBOpen.open) { RBOpen.open(u); return; } /* b18: Maps / Facebook app, never the WebView */ if (native()) window.location.href = u; else window.open(u, "_blank", "noopener"); }
  function openFacebook(u) {
    if (window.RBFb && RBFb.open) { RBFb.open(u); return; } /* b18: Facebook app first (links-b18.js) */
    if (!native()) { window.open(u, "_blank", "noopener"); return; }
    var left = false;
    function vis() { if (document.visibilityState === "hidden") left = true; }
    document.addEventListener("visibilitychange", vis);
    try { window.location.href = "fb://facewebmodal/f?href=" + encodeURIComponent(u); } catch (e) {}
    setTimeout(function () { document.removeEventListener("visibilitychange", vis); if (!left) window.location.href = u; }, 1400);
  }
  var F_ICO = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg>';
  var G_ICO = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
  function btn(kind, m, url, mine) {
    var label = kind === "fb" ? "Facebook Profile" : "Google Business Profile";
    var sub = url ? (kind === "fb" ? (mine ? "Open my profile" : "Send a friend request") : (mine ? "Open my listing" : "Leave a review")) : "Not added yet";
    return '<button type="button" class="rb-ext-btn rb-ext-' + kind + (url ? "" : " is-missing") + '" data-action="rb-ext-' + kind + '" data-id="' + esc(m.id) + '"' +
      (url ? ' data-url="' + esc(url) + '"' : ' aria-disabled="true"') + ' aria-label="' + esc(label + ": " + sub) + '">' +
      '<span class="rb-ext-ico">' + (kind === "fb" ? F_ICO : G_ICO) + '</span><span class="rb-ext-txt"><span class="rb-ext-l">' + label + '</span><span class="rb-ext-s">' + sub + "</span></span></button>";
  }
  function inject() {
    var sc = document.querySelector(".screen.active"); if (!sc) return;
    var id = sc.getAttribute("data-screen"), m = null, mine = false, anchor = null, where = "afterend";
    if (id === "member") {
      m = (T().MEMBERS || []).filter(function (x) { return x.id === S().selectedMember; })[0];
      var leave = sc.querySelector(".v211-actions .action-stack > [data-action='open-ideas'], .v211-actions .action-stack > a.btn-primary");
      anchor = leave || sc.querySelector(".v211-actions .action-stack") || sc.querySelector(".profile-hero");
      if (!leave && anchor && anchor.classList.contains("action-stack")) where = "afterbegin";
    } else if (id === "me") {
      m = T().me && T().me(); mine = true;
      anchor = sc.querySelector(".profile-hero");
    }
    var old = sc.querySelector(".rb-ext-row");
    if (!m || !anchor) { if (old) old.remove(); return; }
    var sig = fbUrl(m) + "|" + gbpUrl(m);
    if (old && old.getAttribute("data-for") === m.id && old.getAttribute("data-sig") === sig) return;
    if (old) old.remove();
    anchor.insertAdjacentHTML(where, '<div class="rb-ext-row" data-for="' + esc(m.id) + '" data-sig="' + esc(sig) + '">' + btn("fb", m, fbUrl(m), mine) + btn("g", m, gbpUrl(m), mine) + "</div>");
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-action='rb-ext-fb'], [data-action='rb-ext-g']"); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var fb = b.getAttribute("data-action") === "rb-ext-fb", u = b.getAttribute("data-url");
    if (!u) {
      var mine = S().screen === "me", m = (T().MEMBERS || []).filter(function (x) { return x.id === b.getAttribute("data-id"); })[0] || {};
      var what = fb ? "Facebook profile" : "Google Business Profile";
      var msg = mine ? "You haven't added your " + what + " yet. Add it in Edit profile." : (m.first || "This member") + " hasn't added their " + what + " yet.";
      if (T().toast) T().toast(msg); else alert(msg);
      if (mine && T().go) T().go("edit-profile");
      return;
    }
    if (fb) openFacebook(u); else openExternal(u);
  }, true);
  setInterval(inject, 400);
  window.RBLinks = { fbUrl: fbUrl, gbpUrl: gbpUrl, reviewUrl: reviewUrl, openFacebook: openFacebook, openExternal: openExternal, inject: inject };
})();

/* v2.2.2 b16: Reviews cards — after "Send swap request" in demo mode the card shows "Request sent"
   (live mode gets the same from review_swaps via RBLive.sync). */
(function () {
  "use strict";
  function T() { return window.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function live() { return !!(window.RBLive && RBLive.isLive && RBLive.isLive()); }
  window.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-action='rb-swq-send']"); if (!b) return;
    var id = b.getAttribute("data-id"); if (!id || live()) return;
    var st = S(); st._pendingReq = st._pendingReq || {}; st._pendingReq[id] = true;
    setTimeout(function () { if (S().screen === "reviews" && T().go) T().go("reviews", { keepScroll: true }); }, 60);
  }, true);
})();

/* v2.2.2 b16 (Vishal, "look at the top header"): header badges are live everywhere.
   Chat = unread chat messages (DMs + groups) from TC12.unreadTotal() (rb-live fills it from Supabase, realtime);
   bell = unread notifications (TC12.notifUnread()). Every header variant is repainted, so a count never goes stale
   and clears as soon as the chat / notification is read. The AI sparkle never had a badge in the design: none added. */
(function () {
  "use strict";
  function n(kind) {
    try { var t = window.TC12; if (!t) return null; return kind === "chat" ? (t.unreadTotal ? t.unreadTotal() : null) : (t.notifUnread ? t.notifUnread() : null); } catch (e) { return null; }
  }
  function paint() {
    var c = n("chat"), b = n("bell");
    [["chats", c], ["notifications", b]].forEach(function (p) {
      if (p[1] == null) return;
      document.querySelectorAll('.app-header [data-go="' + p[0] + '"], .v21-header [data-go="' + p[0] + '"], .v21-float [data-go="' + p[0] + '"]').forEach(function (btn) {
        if (!btn.classList.contains("bell-btn") && !btn.classList.contains("v21-float-btn") && !btn.closest(".header-right, .v21-float")) return;
        var dot = btn.querySelector(".bell-dot");
        var txt = p[1] > 99 ? "99+" : String(p[1]);
        if (p[1] > 0) {
          if (!dot) { dot = document.createElement("span"); dot.className = "bell-dot"; btn.appendChild(dot); }
          if (dot.textContent !== txt) dot.textContent = txt;
          dot.hidden = false; dot.removeAttribute("hidden");
          btn.setAttribute("aria-label", (p[0] === "chats" ? "Chats, " : "Notifications, ") + txt + " unread");
        } else if (dot) { dot.textContent = ""; dot.hidden = true; btn.setAttribute("aria-label", p[0] === "chats" ? "Chats" : "Notifications"); }
      });
    });
    var tab = document.getElementById("tabChatBadge"); if (tab && c != null) { tab.textContent = c ? String(c) : ""; tab.hidden = !c; }
  }
  setInterval(paint, 500);
  window.RBBadges = { paint: paint };
})();

/* v2.2.2 b16: 1:1 chat — header kept to two lines (name / "Trade · Last seen …", both ellipsised, "Seen …" when tight),
   and an empty new chat gets a "Say hi" mini-card with quick-start chips that fill the composer. */
(function () {
  "use strict";
  function T() { return window.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
  function memberOfChat() {
    var who = document.querySelector('.screen.active[data-screen="chat-dm"] .chat-head-who');
    var id = who && who.getAttribute("data-id");
    return (T().MEMBERS || []).filter(function (m) { return m.id === id; })[0] || null;
  }
  function header(sc) {
    var st = sc.querySelector(".chat-head-who .ht > div"); if (!st) return;
    if (st.scrollWidth > st.clientWidth + 1 && /Last seen/.test(st.dataset.rbOrig || st.textContent)) {
      if (st.dataset.rbOrig) st.dataset.rbOrig = st.dataset.rbOrig.replace("Last seen", "Seen");
      st.textContent = st.textContent.replace("Last seen", "Seen");
    }
  }
  function empty(sc) {
    var th = sc.querySelector("#chatThread, .chat-thread"); if (!th) return;
    var card = th.querySelector(".rb-chat-empty");
    var others = Array.prototype.filter.call(th.children, function (c) { return !c.classList.contains("rb-chat-empty"); });
    if (others.length) { if (card) card.remove(); return; }
    var m = memberOfChat(); if (!m) return;
    if (card && card.getAttribute("data-for") === m.id) return;
    if (card) card.remove();
    var av = sc.querySelector(".chat-head-who .avatar");
    var avHtml = av ? av.outerHTML.replace(/width:\s*32px;height:\s*32px;border-radius:\s*9px/, "width:64px;height:64px;border-radius:18px").replace(/width="(\d+)" height="(\d+)"/, 'width="36" height="36"') : "";
    var first = m.first || "there";
    var chips = ["Hi " + first + " \uD83D\uDC4B", "Want to swap Google Reviews?", "Can we connect on Facebook?"];
    th.insertAdjacentHTML("beforeend", '<div class="rb-chat-empty" data-for="' + esc(m.id) + '">' +
      '<div class="rb-ce-card"><div class="rb-ce-av">' + avHtml + '</div>' +
      '<div class="rb-ce-n">' + esc(((m.first || "") + " " + (m.last || "")).trim()) + '</div>' +
      '<div class="rb-ce-s">' + esc([m.trade, m.business].filter(Boolean).join(" \u00b7 ")) + '</div>' +
      '<div class="rb-ce-h">Say hi to ' + esc(first) + '</div>' +
      '<p class="rb-ce-p">This is the start of your chat. Pick a quick opener or write your own.</p></div>' +
      '<div class="rb-ce-chips">' + chips.map(function (c) { return '<button type="button" class="rb-ce-chip" data-action="rb-chat-starter" data-text="' + esc(c) + '">' + esc(c) + "</button>"; }).join("") + "</div></div>");
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-action='rb-chat-starter']"); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var box = document.getElementById("chatInput"); if (!box) return;
    box.value = b.getAttribute("data-text") || ""; box.focus();
    try { box.setSelectionRange(box.value.length, box.value.length); } catch (er) {}
    box.dispatchEvent(new Event("input", { bubbles: true }));
  }, true);
  setInterval(function () {
    var sc = document.querySelector('.screen.active[data-screen="chat-dm"]'); if (!sc) return;
    header(sc); empty(sc);
  }, 300);
})();

/* v2.2.2 b16 (Vishal, "missing reminder setup time"): Notifications settings → REMINDERS.
   Daily reminder toggle, time (default 9:00 AM), days (default Mon–Fri). Saved in profiles.extras.reminder (live)
   and localStorage. In the Android app it is scheduled with @capacitor/local-notifications (weekly repeats per day);
   on the web it is only stored. */
(function () {
  "use strict";
  function T() { return window.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function toast(m) { if (T().toast) T().toast(m); }
  var DAYS = [["mon", "Mon", 2], ["tue", "Tue", 3], ["wed", "Wed", 4], ["thu", "Thu", 5], ["fri", "Fri", 6], ["sat", "Sat", 7], ["sun", "Sun", 1]]; /* [key, label, Capacitor weekday 1=Sun] */
  var LS = "rb_daily_reminder", BASE_ID = 3100;
  function live() { return !!(window.RB && RB.client && RB.session && RB.profile && !(RB.isDemo && RB.isDemo())); }
  function load() {
    var r = null;
    try { if (live() && RB.profile.extras && RB.profile.extras.reminder) r = RB.profile.extras.reminder; } catch (e) {}
    if (!r) try { r = JSON.parse(localStorage.getItem(LS) || "null"); } catch (e) {}
    r = r || {};
    return { on: !!r.on, time: /^\d\d:\d\d$/.test(r.time || "") ? r.time : "09:00", days: Array.isArray(r.days) ? r.days : ["mon", "tue", "wed", "thu", "fri"] };
  }
  function label12(t) { var h = +t.slice(0, 2), m = t.slice(3); return ((h % 12) || 12) + ":" + m + (h < 12 ? " AM" : " PM"); }
  function LN() { var c = window.Capacitor; if (!c || !c.isNativePlatform || !c.isNativePlatform()) return null; return (c.Plugins && c.Plugins.LocalNotifications) || (c.registerPlugin && c.registerPlugin("LocalNotifications")) || null; }
  async function schedule(r) {
    var ln = LN(); if (!ln) return "stored";
    try {
      await ln.cancel({ notifications: DAYS.map(function (d, i) { return { id: BASE_ID + i }; }) });
      if (!r.on || !r.days.length) return "cancelled";
      var p = ln.checkPermissions ? await ln.checkPermissions() : { display: "granted" };
      if (p.display !== "granted" && ln.requestPermissions) p = await ln.requestPermissions(); /* Android 13+: POST_NOTIFICATIONS prompt */
      if (p.display !== "granted") { toast("Turn on notifications for Rate Buddies in your phone settings to get the reminder."); return "denied"; }
      var hh = +r.time.slice(0, 2), mm = +r.time.slice(3);
      var list = [];
      DAYS.forEach(function (d, i) {
        if (r.days.indexOf(d[0]) === -1) return;
        list.push({ id: BASE_ID + i, title: "Rate Buddies reminder", body: "Time to leave your Google Reviews and check your queue.", schedule: { on: { weekday: d[2], hour: hh, minute: mm }, repeats: true }, extra: { screen: "reviews" } });
      });
      if (list.length) await ln.schedule({ notifications: list });
      return "scheduled";
    } catch (e) { console.warn("reminder schedule", e); return "error"; }
  }
  async function save(r, quiet) {
    try { localStorage.setItem(LS, JSON.stringify(r)); } catch (e) {}
    var where = "on this phone";
    if (live()) {
      var ex = Object.assign({}, RB.profile.extras || {}, { reminder: r });
      var res = await RB.client.from("profiles").update({ extras: ex }).eq("id", RB.profile.id);
      if (res.error) { toast("Reminder not saved online: " + res.error.message); }
      else { RB.profile.extras = ex; where = "to your profile"; }
    }
    var st = await schedule(r);
    if (!quiet) toast(r.on ? "Daily reminder " + (st === "scheduled" ? "set" : "saved") + ": " + label12(r.time) + ", " + (r.days.length === 7 ? "every day" : r.days.length === 5 && r.days.indexOf("sat") === -1 && r.days.indexOf("sun") === -1 ? "weekdays" : r.days.map(function (d) { return d.charAt(0).toUpperCase() + d.slice(1); }).join(", ")) + "." : "Daily reminder off.");
    S()._reminderStatus = st; S()._reminderWhere = where;
  }
  function html(r) {
    return '<p class="group-label rb-rem-label">Reminders</p><div class="card group rb-rem" data-rb-rem="1">' +
      '<button type="button" class="set-row" data-action="rb-rem-toggle" aria-pressed="' + r.on + '"><span class="lab"><span class="a">Daily reminder</span><span class="b">A nudge to leave your Google Reviews and check your queue</span></span><span class="toggle' + (r.on ? " on" : "") + '"></span></button>' +
      '<label class="set-row rb-rem-time' + (r.on ? "" : " is-off") + '"><span class="lab"><span class="a">Time</span><span class="b">' + label12(r.time) + '</span></span><input type="time" data-rb-rem-time="1" value="' + r.time + '" aria-label="Reminder time"></label>' +
      '<div class="set-row rb-rem-days' + (r.on ? "" : " is-off") + '"><span class="lab"><span class="a">Days</span></span><div class="rb-rem-chips" role="group" aria-label="Reminder days">' +
      DAYS.map(function (d) { var on = r.days.indexOf(d[0]) !== -1; return '<button type="button" class="rb-rem-day' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-action="rb-rem-day" data-day="' + d[0] + '">' + d[1] + "</button>"; }).join("") +
      "</div></div></div>";
  }
  function inject() {
    var sc = document.querySelector('.screen.active[data-screen="notif-settings"]'); if (!sc) return;
    if (sc.querySelector("[data-rb-rem]")) return;
    var r = load();
    var labels = sc.querySelectorAll(".scroll > .group-label"), quiet = null;
    labels.forEach(function (l) { if (/quiet/i.test(l.textContent)) quiet = l; });
    if (quiet) quiet.insertAdjacentHTML("beforebegin", html(r));
    else { var scr = sc.querySelector(".scroll"); if (scr) scr.insertAdjacentHTML("beforeend", html(r)); }
  }
  function redraw(r) { var box = document.querySelector("[data-rb-rem]"); if (!box) return; var lab = box.previousElementSibling; if (lab && lab.classList.contains("rb-rem-label")) lab.remove(); box.outerHTML = html(r).replace(/^<p[^>]*>Reminders<\/p>/, '<p class="group-label rb-rem-label">Reminders</p>'); }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-action='rb-rem-toggle'], [data-action='rb-rem-day']"); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var r = load();
    if (b.getAttribute("data-action") === "rb-rem-toggle") r.on = !r.on;
    else { var d = b.getAttribute("data-day"), i = r.days.indexOf(d); if (i === -1) r.days.push(d); else r.days.splice(i, 1); if (!r.days.length) { toast("Pick at least one day."); r.days.push(d); } r.on = true; }
    r.days = DAYS.map(function (x) { return x[0]; }).filter(function (k) { return r.days.indexOf(k) !== -1; });
    redraw(r); save(r);
  }, true);
  document.addEventListener("change", function (e) {
    if (!e.target || !e.target.hasAttribute || !e.target.hasAttribute("data-rb-rem-time")) return;
    var r = load(); r.time = e.target.value || "09:00"; r.on = true; redraw(r); save(r);
  }, true);
  setInterval(inject, 400);
  /* re-arm the phone schedule once after sign-in (e.g. new phone / reinstall) */
  var armed = false;
  setInterval(function () { if (armed || !LN()) return; if (window.RB && RB.session && RB.profile) { armed = true; var r = load(); if (r.on) schedule(r); } }, 3000);
  window.RBReminder = { load: load, save: save, schedule: schedule };
})();

/* v2.2.2 b16: chat badge clears as soon as a chat is read. Opening a DM from a profile / list can leave the chat id as
   "dm-<member>" until the next sync, so rb-live's markRead skipped it; map it to the live conversation id right away.
   Also a 20 s safety re-sync of chats + notifications in case the realtime socket drops (badges never go stale). */
(function () {
  "use strict";
  function S() { return (window.TradeCircle && TradeCircle.state) || {}; }
  function live() { return !!(window.RBLive && RBLive.isLive && RBLive.isLive()); }
  setInterval(function () {
    if (!live() || !window.TC12 || !TC12.liveChats) return;
    var st = S(), cid = String(st.chatId || "");
    if ((st.screen === "chat-dm" || st.screen === "chat-group") && cid.indexOf("dm-") === 0) {
      var other = cid.slice(3);
      var hit = (TC12.liveChats() || []).filter(function (c) { return c.type === "dm" && c.memberId === other && /^[0-9a-f]{8}-/i.test(c.id); })[0];
      if (hit) { st.chatId = hit.id; hit.unread = 0; if (window.RBBadges) RBBadges.paint(); }
    }
  }, 700);
  var last = 0;
  setInterval(function () {
    if (!live() || Date.now() - last < 20000) return;
    last = Date.now();
    try { RBLive.syncChats(); RBLive.syncNotifs(); } catch (e) {}
  }, 2000);
})();

/* v2.2.2 b16: chat composer grows with its text (up to the CSS max-height), so a long starter chip or a typed
   message is never clipped at the top; it shrinks back after sending. */
(function () {
  "use strict";
  function fit(t) {
    if (!t || t.id !== "chatInput") return;
    t.style.height = "auto";
    if (t.value) { t.style.height = (t.scrollHeight + 3) + "px"; } else { t.style.height = ""; }
  }
  document.addEventListener("input", function (e) { fit(e.target); }, true);
  setInterval(function () { var t = document.getElementById("chatInput"); if (t && !t.value && t.style.height) t.style.height = ""; }, 600);
})();
