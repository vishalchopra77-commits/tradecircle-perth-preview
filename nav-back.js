/* Rate Buddies v2.1.1 — unified back navigation (on-screen arrow + Android hardware/gesture). */
(function (root) {
  "use strict";

  var ROOT_TABS = { home: 1, reviews: 1, members: 1, "members-all": 1, "members-filter": 1, "members-search": 1, more: 1 };
  var stack = [];
  var restoring = false;
  var wrapped = false;

  function T() { return root.TradeCircle || {}; }
  function S() { return T().state || {}; }

  function snapshot() {
    var st = S();
    var sc = document.querySelector("#phone .screen.active .scroll, #phone .scroll, .screen.active .scroll, .scroll");
    return {
      id: st.screen,
      scroll: sc ? sc.scrollTop : 0,
      selectedMember: st.selectedMember,
      reviewFor: st.reviewFor,
      recOpen: st.recOpen,
      recFilter: st.recFilter,
      chatId: st.chatId,
      tutOpen: st._tutOpen,
      requestId: st._requestId,
      swapPending: st._swapPending
    };
  }

  function applySnap(snap) {
    var st = S();
    if (!st || !snap) return;
    if (snap.selectedMember) st.selectedMember = snap.selectedMember;
    if (snap.reviewFor) st.reviewFor = snap.reviewFor;
    if (typeof snap.recOpen !== "undefined") st.recOpen = snap.recOpen;
    if (snap.recFilter) st.recFilter = snap.recFilter;
    if (snap.chatId) st.chatId = snap.chatId;
    if (snap.tutOpen) st._tutOpen = snap.tutOpen;
    if (snap.requestId) st._requestId = snap.requestId;
    if (snap.swapPending) st._swapPending = snap.swapPending;
  }

  function restoreScroll(top) {
    var tries = 0;
    function tick() {
      var sc = document.querySelector("#phone .screen.active .scroll, #phone .scroll, .screen.active .scroll, .scroll");
      if (sc) sc.scrollTop = top || 0;
      if (++tries < 8) setTimeout(tick, 40);
    }
    tick();
  }

  function closeOverlays() {
    var closed = false;
    var sheet = document.querySelector(".v211-sheet");
    if (sheet && sheet.parentNode) { sheet.parentNode.removeChild(sheet); closed = true; }
    if (T().closeSheet) { try { T().closeSheet(); } catch (e1) {} }
    if (root.TC12 && TC12.closeDrawer) {
      var drawer = document.querySelector(".drawer.open, .drawer-overlay.show");
      if (drawer) { try { TC12.closeDrawer(); closed = true; } catch (e2) {} }
    }
    if (root.TC12 && TC12.closeMine) {
      var ov = document.querySelector("#tc12Overlay, .sheet, .overflow-menu");
      if (ov && ov.offsetParent !== null) { try { TC12.closeMine(); closed = true; } catch (e3) {} }
    }
    var visSheet = document.querySelector(".sheet, .overflow-menu, #tc12Overlay.show, .drawer.open");
    if (visSheet) {
      visSheet.classList.remove("show", "open");
      if (visSheet.id === "tc12Overlay") visSheet.style.display = "none";
      closed = true;
    }
    return closed;
  }

  function isRoot(id) { return !!ROOT_TABS[id]; }

  function wrapGo() {
    var tc = T();
    if (!tc || typeof tc.go !== "function" || wrapped) return false;
    var orig = tc.go;
    tc.go = function (id, opts) {
      opts = opts || {};
      var st = S();
      var from = st && st.screen;
      if (!restoring && !opts.back && !opts.replace && from && id && from !== id) {
        if (!(isRoot(from) && isRoot(id))) {
          stack.push(snapshot());
          if (stack.length > 80) stack.shift();
        }
      }
      return orig.call(tc, id, opts);
    };
    wrapped = true;
    return true;
  }

  function exitApp() {
    try {
      var Cap = root.Capacitor;
      var App = Cap && ((Cap.Plugins && Cap.Plugins.App) || (Cap.Plugins && Cap.Plugins.app));
      if (!App && Cap && Cap.registerPlugin) App = Cap.registerPlugin("App");
      if (App && App.exitApp) { App.exitApp(); return true; }
    } catch (e) {}
    return false;
  }

  function goBack() {
    if (closeOverlays()) return true;
    var st = S();
    var cur = st && st.screen;
    if (stack.length) {
      var prev = stack.pop();
      restoring = true;
      try {
        applySnap(prev);
        if (T().go) T().go(prev.id, { back: true, memberId: prev.selectedMember, keepScroll: false });
      } finally {
        restoring = false;
      }
      restoreScroll(prev.scroll || 0);
      return true;
    }
    if (cur && isRoot(cur) && cur !== "home") {
      restoring = true;
      try { if (T().go) T().go("home", { back: true, replace: true }); }
      finally { restoring = false; }
      return true;
    }
    if (cur === "home" || cur === "welcome" || cur === "lockscreen") {
      return exitApp();
    }
    /* Unknown sub-screen with empty stack: go to Home rather than exiting. */
    if (cur && cur !== "home") {
      restoring = true;
      try { if (T().go) T().go("home", { back: true, replace: true }); }
      finally { restoring = false; }
      return true;
    }
    return exitApp();
  }

  function isBackControl(el) {
    if (!el || !el.closest) return false;
    var btn = el.closest("button, a, [role='button']");
    if (!btn) return false;
    var act = (btn.getAttribute("data-action") || "").toLowerCase();
    if (act === "nav-back" || act === "go-back" || act === "back") return true;
    var al = (btn.getAttribute("aria-label") || "").trim().toLowerCase();
    if (al === "back" || al === "go back" || al === "navigate back") return true;
    if (btn.classList.contains("icon-btn") && btn.closest(".app-header")) {
      var html = (btn.innerHTML || "") + al;
      if (/aria-label="back"|‹|←|M15 19l-7-7 7-7|M15 18l-6-6 6-6/i.test(html) && al.indexOf("open") === -1 && al.indexOf("chat") === -1 && al.indexOf("menu") === -1 && al.indexOf("notif") === -1) {
        /* Header first control that looks like a chevron, if labelled or clearly a back path. */
        if (al === "back" || /‹|←/.test(btn.textContent || "") || btn.querySelector("path")) {
          if (al === "back") return true;
        }
      }
    }
    return false;
  }

  function onClick(e) {
    if (!isBackControl(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    goBack();
  }

  function bindHardware() {
    try {
      var Cap = root.Capacitor;
      if (!Cap) return;
      var App = (Cap.Plugins && (Cap.Plugins.App || Cap.Plugins.app)) || null;
      if (!App && Cap.registerPlugin) App = Cap.registerPlugin("App");
      if (App && App.addListener) {
        App.addListener("backButton", function () { goBack(); });
      }
    } catch (e) {}
  }

  function install() {
    wrapGo();
    /* T() may be assigned at the end of app.js after early scripts; retry once. */
    if (!wrapped) setTimeout(wrapGo, 0);
    document.addEventListener("click", onClick, true);
    bindHardware();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () { wrapGo(); bindHardware(); });
    }
  }

  root.TCNav = {
    goBack: goBack,
    closeOverlays: closeOverlays,
    stack: function () { return stack.slice(); },
    wrapGo: wrapGo
  };
  /* Also expose on TradeCircle once it exists. */
  function publish() {
    if (T()) {
      T().goBack = goBack;
      wrapGo();
    }
  }
  publish();
  setTimeout(publish, 0);
  install();
})(typeof window !== "undefined" ? window : this);
