/* Rate Buddies v2.2.1 — design spec v2.2 behaviour: header options (A/B/C), profile action row options (A/B),
   Awaiting approval (hourglass, no Submitted box, no demo approval in the live app), Facebook Friends wording,
   clear tier medal. Options: ?hdr=a|b|c and ?prof=a|b (saved); default A / A. Fictional demo data only. */
(function (root) {
  "use strict";
  var VERSION = "v2.2.1";
  var html = document.documentElement;
  function q(name) { var m = new RegExp("[?&]" + name + "=([a-z])").exec(location.search); return m ? m[1] : null; }
  function opt(name, def, allowed) { var v = q(name); try { if (v) localStorage.setItem("rb220-" + name, v); else v = localStorage.getItem("rb220-" + name); } catch (e) {} return allowed.indexOf(v) >= 0 ? v : def; }
  var HDR = opt("hdr", "a", ["a", "b", "c"]), PROF = opt("prof", "a", ["a", "b"]), REV = opt("rev", "c", ["a", "b", "c"]);
  html.classList.add("rb-hdr-" + HDR, "rb-prof-" + PROF, "rb-rev-" + REV); /* r8 default rb-rev-c: badges stacked top-right, action along the bottom; r7 rb-rev-a (compact) and rb-rev-b kept via ?rev=a|b */
  var DEMO_TOOLS = /[?&]demo=1\b/.test(location.search); /* web preview only; never in the APK or live app */
  function isLive() { return !!(root.Capacitor) || (root.RB && RB.isDemo && !RB.isDemo()); }
  var SVG = function (d, w) { return '<svg class="rb-keep-l" viewBox="0 0 24 24" width="' + (w || 24) + '" height="' + (w || 24) + '" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>"; };
  var HOURGLASS = '<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>';
  var MEDAL = '<path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><path d="M12 18v-2h-.5"/>';
  var DOTS = '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>';
  var MSG = '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>', USERS = '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', STAR = '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>';

  function pending(sc) {
    var art = sc.querySelector(".pending-art");
    if (art && !art.classList.contains("rb-wait")) { art.classList.add("rb-wait"); art.innerHTML = SVG(HOURGLASS, 32); art.setAttribute("aria-label", "Waiting for approval"); }
    sc.querySelectorAll(".areas-card").forEach(function (c) { var h = c.querySelector(".areas-card-h"); if (h && /submitted/i.test(h.textContent)) c.hidden = true, c.style.display = "none"; });
    if (false) { /* v2.2.1: restore tester continuation, no hiding without owner approval */
      var b = sc.querySelector('[data-action="simulate-approval"]');
      if (b) { b.style.setProperty("display", "none", "important"); var n = b.nextElementSibling; if (n && n.classList.contains("hint") && /super admin/i.test(n.textContent)) n.style.setProperty("display", "none", "important"); }
    }
  }
  function friendsWording(sc) {
    sc.querySelectorAll(".friend-btn span, .friend-btn").forEach(function (e) {
      if (e.children.length && e.tagName !== "SPAN") return;
      var t = e.textContent.trim();
      if (t === "Friends") e.textContent = "Facebook Friends";
      else if (t === "Add friend") e.textContent = "Add Facebook friend";
    });
    sc.querySelectorAll("button, a").forEach(function (b) {
      var s = b.querySelector(":scope > span") || b; if (s.children.length) return;
      if (s.textContent.trim() === "Friends") s.textContent = "Facebook Friends";
    });
  }
  function medals(sc) {
    sc.querySelectorAll(".v211-badge").forEach(function (b) { if (!b.querySelector(".rb-medal-svg")) { b.insertAdjacentHTML("afterbegin", SVG(MEDAL, 14).replace('class="rb-keep-l"', 'class="rb-medal-svg"')); } });
  }
  function profileRow(sc) {
    var row = sc.querySelector(".rb-act-row"); if (!row) return;
    if (PROF !== "b") return;
    var ic = { "open-chat": MSG, "mark-friends": USERS, "ask-review": STAR };
    Array.prototype.forEach.call(row.children, function (b) { if (b.querySelector(".rb-pic")) return; var a = b.getAttribute("data-action") || ""; var t = (b.textContent || "").toLowerCase(); var k = ic[a] ? a : (/message/.test(t) ? "open-chat" : /friend/.test(t) ? "mark-friends" : /ask/.test(t) ? "ask-review" : ""); var old = b.querySelector("svg"); if (old) old.remove(); if (ic[k]) { b.insertAdjacentHTML("afterbegin", SVG(ic[k], 20)); var sv = b.querySelector("svg"); if (sv) sv.classList.add("rb-pic"); } });
  }
  function headerMore(sc) {
    var hd = sc.querySelector(".tut-header-row") || sc.querySelector(".app-header"); if (!hd) return;
    if (!hd.querySelector(".rb-back, [aria-label='Back'], [data-action='nav-back']")) return;
    var hr = hd.querySelector(".header-right"); if (!hr || hr.querySelector(".rb-more-btn")) return;
    hr.insertAdjacentHTML("beforeend", '<button type="button" class="icon-btn bell-btn rb-more-btn" aria-label="More options" data-go="more">' + SVG(DOTS, 22) + "</button>");
  }
  /* Facebook / 2- and 3-way switches: make the label smaller until it fits (never clip), minimum 9px before text zoom */
  function textZoom() { var d = document.createElement("span"); d.style.cssText = "position:absolute;visibility:hidden;font-size:100px"; document.body.appendChild(d); var z = parseFloat(getComputedStyle(d).fontSize) / 100; d.remove(); return z || 1; }
  function textZoomReal() { var d = document.createElement("span"); d.textContent = "x"; d.style.fontSize = "10px"; (document.querySelector(".screen.active") || document.body).appendChild(d); var z = parseFloat(getComputedStyle(d).fontSize) / 10 || 1; d.remove(); return z; }
  function tw(el) { var r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().width; }
  function fitSeg(sc) {
    var z = textZoom();
    sc.querySelectorAll(".fb-seg-btn, .rb-seg > button, .fb-seg > button, .seg > button").forEach(function (b) {
      var lab = b.querySelector(".fb-seg-lab") || b; var badge = b.querySelector(".rb-seg-badge, .fb-seg-badge");
      var keep = lab.style.getPropertyValue("font-size"); lab.style.setProperty("font-size", "10px", "important"); z = parseFloat(getComputedStyle(lab).fontSize) / 10 || 1;
      var key = innerWidth + "x" + b.clientWidth + "x" + z + "x" + b.textContent; if (lab.getAttribute("data-rbfit") === key && b.getAttribute("data-rbfit") === key) { if (keep) lab.style.setProperty("font-size", keep, "important"); else lab.style.removeProperty("font-size"); return; }
      lab.style.removeProperty("font-size"); if (badge) badge.style.removeProperty("font-size");
      var cs = getComputedStyle(b), avail = b.clientWidth - 2 * Math.max(9, parseFloat(cs.paddingLeft), parseFloat(cs.paddingRight));
      var bw = (badge && badge.parentElement === lab.parentElement && badge !== lab) ? badge.offsetWidth + 4 : 0;
      var cssPx = parseFloat(getComputedStyle(lab).fontSize);
      var lw = tw(lab), base = cssPx / z;
      if (lw + bw > avail) {
        var r = (avail - bw * 0.85) / lw, n = Math.min(base - 0.5, Math.max(11, Math.floor(base * r * 2) / 2));
        lab.style.setProperty("font-size", n + "px", "important"); if (badge) badge.style.setProperty("font-size", "10px", "important");
        var g = 0; while (tw(lab) + ((badge && bw) ? badge.offsetWidth + 4 : 0) > avail && n > 11 && g++ < 8) { n -= 0.5; lab.style.setProperty("font-size", n + "px", "important"); if (badge) badge.style.setProperty("font-size", "10px", "important"); }
      }
      /* real edge gap from the laid-out children (want >= 8px each side) */
      var gap = function () { var br = b.getBoundingClientRect(), L = 1e9, R = -1e9; Array.prototype.forEach.call(b.children, function (c) { if (!c.getClientRects().length || getComputedStyle(c).display === "none" || c.classList.contains("rb-hide")) return; var r = c.getBoundingClientRect(); if (r.width < 1 || r.right < b.getBoundingClientRect().left - 50) return; L = Math.min(L, r.left); R = Math.max(R, r.right); }); return L > 1e8 ? 99 : Math.min(L - br.left, br.right - R); };
      if (z <= 1.05) { var nn = parseFloat(lab.style.getPropertyValue("font-size")) || base, gg = 0; while (gap() < 8.5 && nn > 11 && gg++ < 10) { nn -= 0.5; lab.style.setProperty("font-size", nn + "px", "important"); if (badge) badge.style.setProperty("font-size", "11px", "important"); } }
      b.classList.remove("rb-seg-stack");
      if (z > 1.05 || gap() < 7.5) { lab.style.removeProperty("font-size"); if (badge) badge.style.removeProperty("font-size"); b.classList.add("rb-seg-stack"); var lw2 = tw(lab); if (lw2 > avail) { var n2 = Math.max(9, Math.floor(base * avail / lw2 * 2) / 2); lab.style.setProperty("font-size", n2 + "px", "important"); } var bar = b.parentElement; if (bar) bar.classList.add("rb-seg-stacked"); }
      b.setAttribute("data-rbfit", key); lab.setAttribute("data-rbfit", key); b.setAttribute("data-rbdbg", [z, avail, bw, lw, base].join(","));
    });
  }
  /* More tiles: shrink a label only if its longest word does not fit, or it needs a 3rd line (large phone text) */
  function fitTiles(sc) {
    sc.querySelectorAll(".v21-more-tile > span:last-child").forEach(function (l) {
      var t = l.parentElement; l.style.removeProperty("font-size");
      var parts = l.querySelectorAll(".rb-l");
      if (parts.length) { var cs0 = getComputedStyle(t), av0 = t.clientWidth - parseFloat(cs0.paddingLeft) - parseFloat(cs0.paddingRight) - 2; var n0 = 12, g0 = 0; parts.forEach(function (x) { x.style.removeProperty("font-size"); });
        var wid = function () { var m = 0; parts.forEach(function (x) { m = Math.max(m, tw(x)); }); return m; };
        parts.forEach(function (x) { x.style.removeProperty("white-space"); });
        while (wid() > av0 && n0 > (innerWidth >= 400 ? 9 : 10.5) && g0++ < 10) { n0 -= 0.5; parts.forEach(function (x) { x.style.setProperty("font-size", n0 + "px", "important"); }); }
        if (wid() > av0) parts.forEach(function (x) { if (tw(x) > av0) x.style.setProperty("white-space", "normal", "important"); });
        return; }
      var cs = getComputedStyle(t), avail = t.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 2;
      var words = function () { var mx = 0; (l.textContent || "").split(/\s+/).forEach(function (w) { var sp = document.createElement("span"); sp.textContent = w; sp.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;font:inherit"; l.appendChild(sp); mx = Math.max(mx, sp.getBoundingClientRect().width); sp.remove(); }); return mx; };
      var lines = function () { return Math.round(l.getBoundingClientRect().height / (parseFloat(getComputedStyle(l).lineHeight) || 16)); };
      var n = 12.5, g = 0; while ((words() > avail || lines() > 2) && n > 9.5 && g++ < 8) { n -= 0.5; l.style.setProperty("font-size", n + "px", "important"); }
    });
  }
  /* button icons line up with the middle of the label text at any text size */
  function iconMid(sc) {
    sc.querySelectorAll(".btn-fb > svg").forEach(function (ic) {
      var b = ic.parentElement; ic.style.removeProperty("top"); var r = document.createRange(), tn = null;
      Array.prototype.some.call(b.childNodes, function (n) { if (n.nodeType === 3 && n.nodeValue.trim()) { tn = n; return true; } if (n.nodeType === 1 && n !== ic && (n.textContent || "").trim()) { tn = n; return true; } return false; });
      if (!tn) return; r.selectNodeContents(tn); var ls = r.getClientRects(); if (!ls.length) return;
      var l1 = ls[0], ir = ic.getBoundingClientRect(); var d = (l1.top + l1.height / 2) - (ir.top + ir.height / 2);
      if (ls.length === 1 && Math.abs(d) > 0.5 && Math.abs(d) < 6) ic.style.setProperty("top", d.toFixed(1) + "px", "important");
    });
  }
  /* unread dot sits on the first line of the title at any text size */
  function dots(sc) {
    sc.querySelectorAll(".notif-row.unread").forEach(function (row) {
      var t = row.querySelector(".ttl"); if (!t) return; var r = document.createRange(); r.selectNodeContents(t); var ls = r.getClientRects(); if (!ls.length) return;
      var l1 = ls[0], rr = row.getBoundingClientRect(); row.style.setProperty("--rb-dot-top", Math.round(l1.top + l1.height / 2 - rr.top - 4) + "px");
    });
  }
  /* chat threads: keep the last bubble above the quick-reply strip and the composer at any text size */
  function chatPad(sc) {
    var th = sc.querySelector(".chat-thread"); if (!th) return;
    var bars = sc.querySelectorAll(".chat-composer, .quick-row, .chat-quick, .rb-sup-chips, .chat-suggest"); var h = 0;
    bars.forEach(function (x) { if (x.getClientRects().length && getComputedStyle(x).position !== "static") h += x.getBoundingClientRect().height; });
    var top = Infinity; bars.forEach(function (x) { if (x.getClientRects().length) top = Math.min(top, x.getBoundingClientRect().top); });
    if (top < Infinity) { var gap = th.getBoundingClientRect().bottom - top; if (gap > 0) th.style.setProperty("padding-bottom", Math.ceil(gap + 12) + "px", "important"); }
  }
  var busy = false;
  /* r4: Reviews member cards keep the level badge under the trade line */
  function memBadge(sc) {
    Array.prototype.forEach.call(sc.querySelectorAll(".rb-mrow2 .meta > .n > .v211-badge"), function (b) {
      var f = b.parentElement.parentElement.querySelector(".v21-flags"); if (f) { b.classList.add("rb-flag-badge"); f.insertBefore(b, f.firstChild); }
    });
  }
  /* r4: Reviews filter menu always fits above the tab bar (scrolls inside when needed) */
  function fitMenu() {
    Array.prototype.forEach.call(document.querySelectorAll(".rb-dd.open .rb-dd-menu"), function (mn) {
      var tb = document.querySelector("#tabbar"); var bottom = tb && tb.getBoundingClientRect().height ? tb.getBoundingClientRect().top : window.innerHeight;
      var top = mn.parentElement.getBoundingClientRect().bottom + 6;
      mn.style.maxHeight = Math.max(160, Math.floor(bottom - top - 8)) + "px";
    });
  }
  root.TC220 = root.TC220 || {}; root.TC220.fitMenu = fitMenu;
  /* r7: one standard size for every member-card action (width of the longest label in the list) */
  /* r8/r9 (rev-c): trade line may run under the top tag (Facebook tag, or the level badge when alone), stopping 8px short of a level badge beside it */
  function tradeSpan(sc) {
    if (!html.classList.contains("rb-rev-c")) return;
    Array.prototype.forEach.call(sc.querySelectorAll(".rb-mrow2"), function (r) {
      var s = r.querySelector(".meta > .s"), fb = r.querySelector(".v21-flags > .rb-fb"), bd = r.querySelector(".v21-flags > .v211-badge");
      if (!s) return;
      /* r10: badges sit in row 2 pulled up to the card top, so they never stretch the name row (keeps name + trade tight) */
      var fl = r.querySelector(".meta > .v21-flags"), n = r.querySelector(".meta > .n");
      if (fl && n && fl.children.length) {
        var rg = parseFloat(getComputedStyle(r).rowGap) || 0;
        fl.style.setProperty("grid-row", "2", "important");
        fl.style.setProperty("margin-top", (-(n.getBoundingClientRect().height + rg) - 3).toFixed(2) + "px", "important");
      }
      s.style.removeProperty("grid-column"); s.style.removeProperty("padding-right");
      s.style.setProperty("grid-column", "2 / 4", "important");
      var top = fb || bd; if (!top) return;
      var sr = s.getBoundingClientRect(), tr = top.getBoundingClientRect();
      if (tr.bottom > sr.top + 1) { s.style.removeProperty("grid-column"); return; }
      if (!fb || !bd) return;
      var br = bd.getBoundingClientRect(), pad = Math.ceil(sr.right - br.left + 8);
      if (pad > 0 && br.top < sr.bottom && br.bottom > sr.top) s.style.setProperty("padding-right", pad + "px", "important");
    });
  }
  function actWidth(sc) {
    var list = sc.querySelector(".v21-list"); if (!list || !list.querySelector(".rb-mrow2")) return;
    var els = Array.prototype.slice.call(list.querySelectorAll(".rb-mrow2 .v21-right .rb-st, .rb-mrow2 .v21-right .rb-st-btn"));
    if (!html.classList.contains("rb-rev-a")) { els.forEach(function (e) { e.style.removeProperty("width"); }); return; }
    els.forEach(function (e) { e.style.removeProperty("width"); });
    var w = 0; els.forEach(function (e) { w = Math.max(w, Math.ceil(e.getBoundingClientRect().width)); });
    if (w) els.forEach(function (e) { e.style.setProperty("width", w + "px", "important"); });
  }
  function pass() {
    if (busy) return; busy = true;
    try {
      var sc = document.querySelector("#screens .screen.active") || document.querySelector(".screen.active"); if (!sc) return;
      var id = sc.dataset.screen;
      if (id === "pending") pending(sc);
      friendsWording(sc); medals(sc); memBadge(sc); try { fitMenu(); actWidth(sc); tradeSpan(sc); } catch (eM) {} profileRow(sc); headerMore(sc); try { document.documentElement.classList.toggle("rb-tz-big", textZoomReal() > 1.05); fitSeg(sc); chatPad(sc); dots(sc); fitTiles(sc); iconMid(sc); } catch (eF) { if (root.console) console.warn("v220 fit", eF && eF.message); }
      var ver = sc.querySelectorAll(".v21-ver, .set-row .b"); ver.forEach(function (e) { if (/v2\.(?:1\.\d|2\.0)\b/.test(e.textContent)) e.textContent = e.textContent.replace(/v2\.(?:1\.\d|2\.0)\b/, VERSION); });
    } catch (e) { if (root.console) console.warn("v220", e); } finally { busy = false; /* v2.2.1 perf fix: drop the mutations this pass made itself, so it can't re-trigger itself forever */ if (mo) try { mo.takeRecords(); } catch (eT) {} }
  }
  var t = null, t2 = null, t3 = null, mo = null, extra = [];
  function schedule() { clearTimeout(t); clearTimeout(t2); clearTimeout(t3); extra.forEach(clearTimeout); t = setTimeout(pass, 40); t2 = setTimeout(pass, 260); /* second pass after the older overlays finish */ t3 = setTimeout(pass, 700); extra = [120, 400, 520, 1300, 2000].map(function (ms) { return setTimeout(function () { if (!busy) pass(); }, ms); }); settle(); }
  /* v2.2.1: one more fit pass once the DOM has been quiet for 250ms (other layers finish after our timed passes) */
  var st = null; function settle() { clearTimeout(st); st = setTimeout(function () { if (busy) return settle(); requestAnimationFrame(function () { pass(); }); }, 250); }
  window.addEventListener("resize", function () { schedule(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { schedule(); });
  function install() {
    var s = document.getElementById("screens") || document.body;
    if (s && root.MutationObserver) { mo = new MutationObserver(function () { if (!busy) schedule(); else settle(); }); mo.observe(s, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] }); }
    try { var T = root.TradeCircle; if (T && T.go && !T.go.__rb220) { var og = T.go; T.go = function () { var r = og.apply(this, arguments); schedule(); return r; }; T.go.__rb220 = 1; } } catch (eG) {}
    pass();
  }
  root.RB220 = { VERSION: VERSION, header: HDR, profile: PROF, pass: pass };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install); else install();
})(window);
