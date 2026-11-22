/* Rate Buddies v2.2.2 build 18 — bottom menu on every screen once a member is approved (Vishal: "once profile approved
   bottom navigation should be on every screen"; "I edited the profile, I am on the profile page, no bottom menu, dead end").
   Before approval (welcome, sign-in, sign-up steps, waiting for approval, intro video) the menu stays hidden.
   Every non-tab screen also gets a working Back arrow in its header if it has none. app.js and v213.js ask
   RBNav18.showTabs(id) instead of their own short lists. */
(function () {
  "use strict";
  var root = window;
  var PRE = /^(welcome|lockscreen|signin|signup|signup-[a-z-]+|create-profile|create-profile-[a-z-]+|create-regions|create-regions-all|choose-areas|fb-consent|fb-yes|fb-no|pending|intro-video|intro-done|suspended|forgot[a-z-]*|reset[a-z-]*|otp[a-z-]*)$/;
  var TAB_ROOTS = { home: 1, reviews: 1, "reviews-back": 1, members: 1, "members-all": 1, "members-filter": 1, "members-search": 1, more: 1, drawer: 1,
    "promo-queue": 1, "fb-recommend": 1, "fb-recommend-open": 1, "fb-recommend-mine": 1, "fb-recommend-done": 1 };
  function T() { return root.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function approved() {
    var RB = root.RB;
    if (RB && RB.session && !(RB.isDemo && RB.isDemo())) return !!(RB.profile && RB.profile.status === "approved" && !RB.profile.archivedAt);
    if (RB && RB.isDemo && !RB.isDemo() && !RB.session && root.RBConfig && RBConfig.url) return false; /* live build, signed out */
    return true; /* offline demo: decided by the screen */
  }
  function showTabs(id) { return !!id && !PRE.test(id) && approved(); }
  var BACK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
  function hasBack(sc) {
    return !!sc.querySelector('.app-header [aria-label="Back"], .app-header [data-action="nav-back"], .app-header .rb-back, .v21-header [aria-label="Back"], .v21-header [data-action="nav-back"], [data-rb-back], [aria-label="Close"]');
  }
  function ensureBack(sc, id) {
    if (TAB_ROOTS[id] || PRE.test(id) || id === "complete-profile" || hasBack(sc)) return;
    var head = sc.querySelector(".app-header, .v21-header");
    var btn = '<button type="button" class="icon-btn rb-back rb18-back" data-action="nav-back" data-rb-back="1" aria-label="Back">' + BACK_SVG + "</button>";
    if (head) head.insertAdjacentHTML("afterbegin", btn);
    else sc.insertAdjacentHTML("afterbegin", '<div class="app-header rb18-head">' + btn + "</div>");
  }
  var tabH = 0;
  function apply() {
    var tb = document.getElementById("tabbar");
    var sc = document.querySelector("#screens .screen.active") || document.querySelector(".screen.active");
    if (!tb || !sc) return;
    var id = S().screen || sc.getAttribute("data-screen"), drawn = sc.getAttribute("data-screen") || id;
    var on = showTabs(id) && showTabs(drawn); /* an unknown route falls back to Welcome: never show the menu over it */
    /* an approved member sent to a screen name that doesn't exist lands on Welcome / Lock screen (a dead end): go Home */
    if ((drawn === "welcome" || drawn === "lockscreen") && id !== drawn && approved() && root.RB && RB.session && T().go) { T().go("home", { replace: true }); return; }
    if (tb.classList.contains("show") !== on) tb.classList.toggle("show", on);
    document.documentElement.classList.toggle("rb18-tabs", on);
    if (on) {
      var h = Math.round(tb.getBoundingClientRect().height) || 64;
      if (h !== tabH) { tabH = h; document.documentElement.style.setProperty("--rb18-tab-h", h + "px"); }
      if (!sc.classList.contains("has-tabs")) sc.classList.add("rb18-tabpad");
      if (T().updateTabs) try { T().updateTabs(id); } catch (e) {}
    } else sc.classList.remove("rb18-tabpad");
    if (on) ensureBack(sc, drawn);
  }
  /* run after every screen change, after the older layers have finished */
  function wrapGo() {
    var TC = T();
    if (!TC.go || TC.go._rb18nav) return;
    var orig = TC.go;
    var w = function () { var r = orig.apply(this, arguments); try { apply(); } catch (e) {} setTimeout(apply, 0); return r; };
    Object.keys(orig).forEach(function (k) { w[k] = orig[k]; });
    w._rb18nav = true; TC.go = w;
  }
  var css = document.createElement("style");
  css.textContent =
    "html.rb18-tabs .screen.active.rb18-tabpad{padding-bottom:calc(var(--rb18-tab-h,64px) + env(safe-area-inset-bottom,0px)) !important;box-sizing:border-box}" +
    "html.rb18-tabs .screen.active.rb18-tabpad .chat-composer{padding-bottom:8px !important}" +
    "html.rb18-tabs .screen.active.rb18-tabpad .scroll{padding-bottom:16px}" +
    ".rb18-head{display:flex;align-items:center;min-height:52px;padding:6px 8px}";
  (document.head || document.documentElement).appendChild(css);
  root.RBNav18 = { showTabs: showTabs, apply: apply, approved: approved, PRE: PRE };
  setInterval(function () { wrapGo(); apply(); }, 400);
  wrapGo();
  if (document.readyState !== "loading") apply(); else document.addEventListener("DOMContentLoaded", apply);
})();
