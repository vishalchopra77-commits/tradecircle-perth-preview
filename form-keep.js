/* Rate Buddies v2.2.2 build 18 — keep what a member has typed when a screen redraws (Vishal: "I fill the profile, it keeps
   getting cleared again and again").
   Root cause: live syncs (every 60 s, realtime changes, after sign-in, presence/profile reloads and several older layers)
   redraw the CURRENT screen with TC.go(sameScreen). The redraw rebuilt every form from saved data, so anything typed but
   not saved yet was wiped. Now any same-screen redraw keeps typed values, picked chips (hidden fields), focus, caret and
   scroll. A value the app itself changed on purpose (e.g. picking a trade from the list) is not overwritten.
   Profile / sign-up / support drafts are also kept on this phone (per member, 12 h) and offered back if the app restarts;
   cleared on Save / Skip / Send. Passwords, codes and card fields are never stored. Also used by the web admin (paint()). */
(function () {
  "use strict";
  var root = window;
  var SECRET = /pass|otp|code|card|cvc|cvv|secret|token|key/i;
  var PERSIST = /^(complete-profile|edit-profile|create-profile|create-profile-connected|signup-name|signup-business|signup|signup-email|signup-phone|support|support-empty)$/;
  var CLEAR_ON = '[data-action="save-complete"], [data-action="skip-complete"], [data-action="save-profile"], [data-action="save-edit"], [data-action="sup-send"], [data-action="support-send"], form[data-form="edit-profile"] [type="submit"], [data-action="signup-submit"], [data-action="create-account"]';
  function keyOf(el) {
    if (!el || el.disabled) return null;
    var t = (el.type || "").toLowerCase();
    if (t === "password" || t === "file" || t === "submit" || t === "button" || t === "image" || t === "reset") return null;
    var k = el.name || el.id || el.getAttribute("data-cp-custom") && "cpc:" + el.getAttribute("data-cp-custom");
    if (!k || SECRET.test(k) || SECRET.test(el.getAttribute("autocomplete") || "")) return null;
    if (t === "radio") k += "=" + el.value;
    return k;
  }
  function fields(scope) { return scope ? Array.prototype.slice.call(scope.querySelectorAll("input, textarea, select")) : []; }
  function cur(el) { var t = (el.type || "").toLowerCase(); return (t === "checkbox" || t === "radio") ? (el.checked ? "1" : "0") : el.value; }
  function rendered(el) {
    var t = (el.type || "").toLowerCase();
    if (t === "checkbox" || t === "radio") return el.defaultChecked ? "1" : "0";
    if (el.tagName === "SELECT") { for (var i = 0; i < el.options.length; i++) if (el.options[i].defaultSelected) return el.options[i].value; return el.options.length ? el.options[0].value : ""; }
    if (t === "hidden") return el.__rbInit != null ? el.__rbInit : el.value; /* hidden inputs have no separate default */
    return el.defaultValue;
  }
  function setVal(el, v) {
    var t = (el.type || "").toLowerCase();
    if (t === "checkbox" || t === "radio") el.checked = v === "1"; else el.value = v;
    if (t === "hidden") el.__rbInit = el.__rbInit; /* keep the rendered base */
  }
  /* remember what each field looked like when it was drawn (hidden fields need this) */
  function stamp(scope) { fields(scope).forEach(function (el) { if (el.__rbInit == null) el.__rbInit = el.type === "hidden" ? el.value : rendered(el); }); }
  function snapshot(scope) {
    var out = {}, any = false;
    fields(scope).forEach(function (el) {
      var k = keyOf(el); if (!k) return;
      var base = el.type === "hidden" ? (el.__rbInit != null ? el.__rbInit : el.value) : rendered(el), v = cur(el);
      if (v !== base) { out[k] = { v: v, base: base }; any = true; }
    });
    var ae = document.activeElement, focus = null;
    if (ae && scope && scope.contains(ae)) { var fk = keyOf(ae); if (fk) { focus = { k: fk, s: null, e: null }; try { focus.s = ae.selectionStart; focus.e = ae.selectionEnd; } catch (e) {} } }
    var sc = scope && (scope.querySelector(".scroll") || scope);
    return { vals: out, any: any, focus: focus, scroll: sc ? sc.scrollTop : 0 };
  }
  function restore(scope, snap, opts) {
    if (!scope || !snap) return 0;
    var n = 0;
    fields(scope).forEach(function (el) {
      var k = keyOf(el); if (!k || !snap.vals[k]) return;
      var d = snap.vals[k], now = el.type === "hidden" ? el.value : rendered(el);
      if (now !== d.base && !(opts && opts.force)) return; /* the app changed this on purpose: keep the app's value */
      if (cur(el) === d.v) return;
      if (el.type === "hidden") el.__rbInit = now;
      setVal(el, d.v); n++;
      var t = (el.type || "").toLowerCase();
      if (t !== "hidden" && t !== "search" && !el.hasAttribute("data-cp-q") && !el.hasAttribute("data-cp-custom")) {
        try { el.dispatchEvent(new Event("input", { bubbles: true })); } catch (e) {}
      }
    });
    stamp(scope);
    if (n) {
      scope.querySelectorAll("form").forEach(function (f) { if (root.TC158 && TC158.repaintPickers) try { TC158.repaintPickers(f); } catch (e) {} });
    }
    if (snap.focus) {
      var el2 = fields(scope).filter(function (x) { return keyOf(x) === snap.focus.k; })[0];
      if (el2) { try { el2.focus({ preventScroll: true }); if (snap.focus.s != null) el2.setSelectionRange(snap.focus.s, snap.focus.e); } catch (e) {} }
    }
    var sc = scope.querySelector(".scroll") || scope;
    if (snap.scroll && sc) sc.scrollTop = snap.scroll;
    return n;
  }
  root.RBFormKeep = { snapshot: snapshot, restore: restore, stamp: stamp };

  /* ---------------- phone app: wrap TradeCircle.go ---------------- */
  function T() { return root.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function uid() { return (root.RB && RB.profile && RB.profile.id) || "anon"; }
  function dkey(screen) { return "rb_draft_v1:" + uid() + ":" + screen; }
  function active() { return document.querySelector(".screen.active"); }
  function loadDraft(screen) { try { var d = JSON.parse(localStorage.getItem(dkey(screen)) || "null"); if (d && Date.now() - d.at < 12 * 3600e3) return d; } catch (e) {} return null; }
  /* b18: a draft holds EVERY filled field (the profile screens keep typing in app memory, so "changed since drawn" is not enough:
     after an Android WebView restart, e.g. coming back from the photo picker, that memory is gone and the screen starts empty). */
  function draftSnap(scope) {
    var out = {}, any = false;
    fields(scope).forEach(function (el) {
      var k = keyOf(el); if (!k) return;
      var t = (el.type || "").toLowerCase(), v = cur(el), base = el.type === "hidden" ? (el.__rbInit != null ? el.__rbInit : el.value) : rendered(el);
      if (t === "search" || el.hasAttribute("data-cp-q")) return;
      if ((t === "checkbox" || t === "radio") ? v !== base : (v !== "" || v !== base)) { out[k] = { v: v, base: base }; any = true; }
    });
    return { vals: out, any: any };
  }
  function saveDraft(screen, snap) { try { if (snap && snap.any) localStorage.setItem(dkey(screen), JSON.stringify({ at: Date.now(), vals: snap.vals })); else localStorage.removeItem(dkey(screen)); } catch (e) {} }
  /* put a draft back only into fields that are empty or still show what was saved when the draft was taken */
  function restoreDraft(scope, d) {
    var vals = {}, n = 0;
    fields(scope).forEach(function (el) {
      var k = keyOf(el); if (!k || !d.vals[k]) return;
      var x = d.vals[k], c = cur(el);
      if (c === x.v) return;
      var t = (el.type || "").toLowerCase();
      if ((t === "checkbox" || t === "radio") || c === "" || c === x.base) vals[k] = { v: x.v, base: el.type === "hidden" ? el.value : rendered(el) };
    });
    for (var k in vals) n++;
    return n ? restore(scope, { vals: vals }) : 0;
  }
  function clearDraft(screen) { try { localStorage.removeItem(dkey(screen)); } catch (e) {} }
  root.RBFormKeep.clearDraft = clearDraft;
  var kept = 0, clearing = {};

  /* ---------------- b18 chat: new messages are added in place, the composer is never rebuilt ----------------
     (Vishal: "when I am chatting it keeps deleting the typed text"). A live sync / realtime message used to redraw the
     whole chat screen, composer included. Now a redraw of the SAME chat only updates the message bubbles; the text box,
     its focus, caret and the phone keyboard stay as they are. Each chat also keeps an unsent draft on this phone. */
  function isChat(id) { return id === "chat-dm" || id === "chat-group"; }
  function chatKey(scope) {
    var w = scope && scope.querySelector(".chat-head-who[data-id]");
    return w ? "dm:" + w.getAttribute("data-id") : "c:" + String(S().chatId || "");
  }
  function ckey(k) { return "rb_chat_draft_v1:" + uid() + ":" + k; }
  var chatStats = { inPlace: 0, appended: 0 };
  function chatInPlace(id) {
    if (!isChat(id) || !root.TC12 || !TC12.render) return false;
    var sc = active(); if (!sc || sc.getAttribute("data-screen") !== id) return false;
    var ci = document.getElementById("chatInput"), th = sc.querySelector("#chatThread");
    if (!ci || !th || !sc.contains(ci)) return false;
    var html; try { html = TC12.render(id); } catch (e) { return false; }
    if (!html) return false;
    var tpl = document.createElement("template"); tpl.innerHTML = html;
    var nsc = tpl.content.querySelector(".screen");
    if (!nsc || nsc.getAttribute("data-screen") !== id || chatKey(nsc) !== sc.getAttribute("data-rb-chat")) return false;
    var nth = nsc.querySelector("#chatThread"); if (!nth) return false;
    var nearBottom = th.scrollHeight - th.scrollTop - th.clientHeight < 80;
    var olds = {}; Array.prototype.forEach.call(th.querySelectorAll(":scope > .bub[data-msg]"), function (b) { olds[b.getAttribute("data-msg")] = b; });
    var news = Array.prototype.slice.call(nth.querySelectorAll(":scope > .bub[data-msg]"));
    var keep = {}, prev = null, added = 0;
    news.forEach(function (nb) {
      var k = nb.getAttribute("data-msg"), ob = olds[k];
      keep[k] = 1;
      if (ob) { if (ob.outerHTML !== nb.outerHTML) { var c = document.importNode(nb, true); ob.replaceWith(c); ob = c; } }
      else { ob = document.importNode(nb, true); added++; }
      if (prev) { if (prev.nextElementSibling !== ob) prev.after(ob); }
      else if (th.firstElementChild !== ob) th.insertBefore(ob, th.firstChild);
      prev = ob;
    });
    Object.keys(olds).forEach(function (k) { if (!keep[k] && olds[k].parentNode) olds[k].remove(); });
    var nh = nsc.querySelector(".chat-head-who .ht > div"), h = sc.querySelector(".chat-head-who .ht > div");
    if (nh && h && !h.dataset.rbOrig && h.textContent !== nh.textContent) h.textContent = nh.textContent;
    if (added && nearBottom) th.scrollTop = th.scrollHeight;
    chatStats.inPlace++; chatStats.appended += added;
    return true;
  }
  function chatOpened(sc) {
    if (!sc || !isChat(sc.getAttribute("data-screen"))) return;
    var k = chatKey(sc); sc.setAttribute("data-rb-chat", k);
    var ci = document.getElementById("chatInput");
    if (ci && !ci.value) { try { var v = localStorage.getItem(ckey(k)); if (v) { ci.value = v; ci.__rbChatV = v; ci.dispatchEvent(new Event("input", { bubbles: true })); } } catch (e) {} }
  }
  function chatSaveDraft() {
    var sc = active(); if (!sc || !isChat(sc.getAttribute("data-screen"))) return;
    var ci = document.getElementById("chatInput"), k = sc.getAttribute("data-rb-chat"); if (!ci || !k) return;
    if (ci.__rbChatV === ci.value) return;
    ci.__rbChatV = ci.value;
    try { if (ci.value.trim()) localStorage.setItem(ckey(k), ci.value); else localStorage.removeItem(ckey(k)); } catch (e) {}
  }
  /* after Send: every send handler has read the text by now (they run in this same click / Enter), so empty the box here,
     because the composer is no longer rebuilt by a redraw */
  function chatSent() {
    var sc = active(), k = sc && sc.getAttribute("data-rb-chat"); if (k) try { localStorage.removeItem(ckey(k)); } catch (e) {}
    var ci = document.getElementById("chatInput"); if (!ci) return;
    var sent = ci.value;
    setTimeout(function () {
      var c2 = document.getElementById("chatInput"); if (!c2) return;
      if (c2.value === sent || c2.value.indexOf(sent) === 0) c2.value = c2.value.slice(sent.length).replace(/^\s+/, "");
      c2.__rbChatV = c2.value; c2.style.height = "";
      try { c2.dispatchEvent(new Event("input", { bubbles: true })); } catch (e) {}
    }, 0);
  }
  document.addEventListener("input", function (e) { if (e.target && e.target.id === "chatInput") chatSaveDraft(); }, true);
  /* keep the text box focused (and the phone keyboard open) when Send is tapped */
  ["mousedown", "pointerdown", "touchstart"].forEach(function (t) {
    document.addEventListener(t, function (e) {
      var b = e.target.closest && e.target.closest('[data-action="send-chat"]');
      if (b && document.activeElement && document.activeElement.id === "chatInput") e.preventDefault();
    }, { capture: true, passive: false });
  });
  document.addEventListener("click", function (e) { if (e.target.closest && e.target.closest('[data-action="send-chat"]')) { var ci = document.getElementById("chatInput"); if (ci && ci.value.trim()) chatSent(); } }, true);
  document.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey && e.target && e.target.id === "chatInput" && e.target.value.trim()) chatSent(); }, true);
  root.RBFormKeep.chatStats = function () { return chatStats; };

  function wrapGo() {
    var TC = T();
    if (!TC.go || TC.go._rbFormKeep) return;
    var orig = TC.go;
    function wrapped(id, opts) {
      var sc = active(), was = S().screen, same = sc && id === was && sc.getAttribute("data-screen") === id;
      if (same && !(opts && opts.force) && chatInPlace(id)) return;
      var snap = same ? snapshot(sc) : null;
      var res = orig.apply(this, arguments);
      var now = active();
      if (now) {
        stamp(now);
        if (isChat(id) && (!same || now.getAttribute("data-rb-chat") == null)) chatOpened(now);
        if (same) now.__rbDraftTried = 1;
        if (snap && snap.any) { var n = restore(now, snap); if (n) kept += n; }
        else if (!same && PERSIST.test(id) && !liveNoUser()) tryDraft(now, id);
      }
      return res;
    }
    Object.keys(orig).forEach(function (k) { wrapped[k] = orig[k]; });
    wrapped._rbFormKeep = true;
    TC.go = wrapped;
  }
  function liveNoUser() { return !!(root.RB && RB.isDemo && !RB.isDemo() && !(RB.profile && RB.profile.id)); }
  function tryDraft(sc, id) {
    if (sc.__rbDraftTried) return; sc.__rbDraftTried = 1;
    var d = loadDraft(id);
    if (d) { var n = restoreDraft(sc, d); if (n && T().toast) T().toast("We kept what you typed earlier."); }
  }
  setInterval(function () {
    wrapGo();
    var sc = active(); if (!sc) return;
    stamp(sc);
    var id = sc.getAttribute("data-screen");
    if (!PERSIST.test(id || "") || clearing[id] || liveNoUser()) return;
    /* b18: a screen drawn before this file wrapped go() (e.g. straight after an app restart) gets its draft back
       BEFORE anything is saved, otherwise the empty screen would overwrite the draft */
    tryDraft(sc, id);
    saveDraft(id, draftSnap(sc));
  }, 700);
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(CLEAR_ON);
    if (!b) return;
    var id = (active() || {}).getAttribute && active().getAttribute("data-screen");
    if (id) { clearing[id] = 1; clearDraft(id); setTimeout(function () { clearDraft(id); delete clearing[id]; }, 2500); }
  }, true);
  root.RBFormKeep.stats = function () { return { kept: kept }; };

  /* ---------------- web admin: wrap TCAdmin.paint (#page redraws every ~20 s) ---------------- */
  function wrapAdmin() {
    var A = root.TCAdmin;
    if (!A || !A.paint || A.paint._rbFormKeep) return;
    var orig = A.paint;
    var w = function () {
      var pg = document.getElementById("page");
      var snap = pg ? snapshot(pg) : null;
      var res = orig.apply(this, arguments);
      pg = document.getElementById("page");
      if (pg) { stamp(pg); if (snap && snap.any) restore(pg, snap); }
      return res;
    };
    Object.keys(orig).forEach(function (k) { w[k] = orig[k]; });
    w._rbFormKeep = true;
    A.paint = w;
  }
  if (document.getElementById("page") || /admin/.test(location.pathname)) setInterval(function () { wrapAdmin(); var pg = document.getElementById("page"); if (pg) stamp(pg); }, 500);
  /* admin.js also redraws #page from inside its own closure: remember typed values and put them back after any redraw */
  var typed = {}, typedPage = "";
  function pageKey() { var t = document.getElementById("pageTitle"); return t ? t.textContent : ""; }
  function inPage(el) { var pg = document.getElementById("page"); return pg && pg.contains(el); }
  document.addEventListener("input", function (e) {
    if (!inPage(e.target)) return;
    var k = keyOf(e.target); if (!k) return;
    if (typedPage !== pageKey()) { typed = {}; typedPage = pageKey(); }
    typed[k] = { v: cur(e.target), base: rendered(e.target) };
  }, true);
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("button, a, [data-page], [type=submit]");
    if (!b) return;
    if (!inPage(b)) { typed = {}; return; } /* left this page (sidebar etc.) */
    var lab = (b.getAttribute("data-action") || "") + " " + (b.textContent || "");
    if (/send|save|reply|submit|post|create|add|approve|decline|reject|delete|publish|update/i.test(lab)) setTimeout(function () { typed = {}; }, 1200);
  }, true);
  function reapply() {
    var pg = document.getElementById("page"); if (!pg) return;
    if (typedPage !== pageKey()) { typed = {}; typedPage = pageKey(); return; }
    var any = false; for (var k in typed) { any = true; break; }
    if (!any) return;
    restore(pg, { vals: typed });
  }
  (function watch() {
    var pg = document.getElementById("page");
    if (!pg || !root.MutationObserver) { if (!document.getElementById("page") && document.readyState !== "complete") setTimeout(watch, 500); return; }
    new MutationObserver(function (m) { for (var i = 0; i < m.length; i++) if (m[i].type === "childList" && m[i].addedNodes.length) { reapply(); break; } }).observe(pg, { childList: true, subtree: true });
  })();
})();
