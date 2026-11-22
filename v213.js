/* Rate Buddies v2.1.3 — design-system pass (design review v2.1.1 fixes).
   Runs after every render: one header component, back on every sub-page, button/type/status
   normalisation, wording, scroll preservation and dead-tap fixes. Nothing is deleted; old layers stay. */
(function (root) {
  "use strict";
  var VERSION = "v2.2.0";
  function T() { return root.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function me() { try { return T().me ? T().me() : {}; } catch (e) { return {}; } }
  var ROOTS = { home: 1, reviews: 1, "reviews-back": 1, members: 1, "members-all": 1, "members-filter": 1, "members-search": 1,
    "promo-queue": 1, "fb-recommend": 1, "fb-recommend-open": 1, "fb-recommend-mine": 1, "fb-recommend-done": 1, more: 1, drawer: 1 };
  var NO_HEADER_BACK = { welcome: 1, lockscreen: 1, "intro-video": 1, "complete-profile": 1, "fb-consent": 1 };
  var SVG = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    chat: '<svg width="20" height="20" class="rb-chat2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3h9a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9.2L5 18.4V15a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z"/><path d="M17 9h2a3 3 0 0 1 3 3v4a3 3 0 0 1-2 2.83v2.67l-3.2-2.5H14a3 3 0 0 1-3-3v-1"/><g fill="currentColor" stroke="none"><circle cx="6.5" cy="9" r="1.15"/><circle cx="9.5" cy="9" r="1.15"/><circle cx="12.5" cy="9" r="1.15"/></g></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
    chev: '<svg class="rb-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    userPlus: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="3.5"/><path d="M19 8v6M16 11h6"/></svg>',
    megaphone: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11v2a1 1 0 001 1h3l5 4V6L7 10H4a1 1 0 00-1 1z"/><path d="M16 9a3 3 0 010 6M19 6a7 7 0 010 12"/></svg>',
    message: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="13" rx="3"/><path d="M8 18l-3 3v-3"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 01-11.8 7L4 20l1.1-4A8 8 0 1120 12z"/><path d="M9 9.5c.3 2 2.2 4.2 4.5 4.8l1.2-1.2 1.8.8"/></svg>',
    at: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-4 8"/></svg>',
    moon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>',
    ai: '<svg viewBox="1.65 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 4.8L18.7 9.7l-4.8 1.9L12 16.4l-1.9-4.8L5.3 9.7l4.8-1.9z"/><path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z"/></svg>',
    smile: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4 4 0 007 0"/><path d="M9 9.5h.01M15 9.5h.01"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z" fill="currentColor"/></svg>',
    people: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="3.5"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>'
  };
  function gColor(n) { n = n || 20; return '<svg viewBox="0 0 24 24" width="' + n + '" height="' + n + '" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>'; }
  function $all(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function txt(el) { return ((el && (el.innerText || el.textContent)) || "").replace(/\s+/g, " ").trim(); }
  function unread(kind) {
    try {
      if (kind === "chat") return (root.TC12 && TC12.unreadTotal) ? TC12.unreadTotal() : 3;
      return (root.TC12 && TC12.notifUnread) ? TC12.notifUnread() : 6;
    } catch (e) { return kind === "chat" ? 3 : 6; }
  }
  function headerBtn(kind) {
    var n = unread(kind);
    return '<button class="icon-btn bell-btn" data-go="' + (kind === "chat" ? "chats" : "notifications") + '" aria-label="' + (kind === "chat" ? "Chats" : "Notifications") + '">' +
      SVG[kind] + (n ? '<span class="bell-dot">' + n + "</span>" : "") + "</button>";
  }

  /* ---------- text and wording ---------- */
  var REPL = [
    [/\bGoogle review(s?)\b/g, "Google Review$1"],
    [/\bPromo queue\b/g, "Promotion queue"],
    [/\bVishal\b/g, function () { return me().first || "Jamie"; }],
    [/Rate Buddies v2\.1\.[12]\b/g, "Rate Buddies " + VERSION],
    [/UI prototype v2\.1\.[12]/g, "UI prototype " + VERSION]
  ];
  function fixText(rootEl) {
    if (!rootEl) return;
    var w = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null), n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (t) {
      var p = t.parentNode; if (!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) return;
      var v = t.nodeValue, o = v;
      REPL.forEach(function (r) { v = v.replace(r[0], r[1]); });
      if (v !== o) t.nodeValue = v;
    });
    $all("input[placeholder], textarea[placeholder]", rootEl).forEach(function (i) {
      i.placeholder = i.placeholder.replace(/\bGoogle review(s?)\b/g, "Google Review$1");
    });
  }

  /* ---------- G1 header ---------- */
  function fixHeader(sc, id) {
    var isRoot = !!ROOTS[id];
    sc.classList.toggle("rb-root", isRoot);
    sc.classList.toggle("rb-sub", !isRoot);
    var vf = sc.querySelector(".v21-header .v21-float");
    if (vf && !vf.querySelector(".rb-ai-btn")) {
      var vc = vf.querySelector('[data-go="chats"]');
      var vh = '<button class="icon-btn v21-float-btn rb-ai-btn" data-go="ai-assistant" aria-label="AI assistant">' + SVG.ai + "</button>";
      if (vc) vc.insertAdjacentHTML("beforebegin", vh); else vf.insertAdjacentHTML("afterbegin", vh);
    }
    var hd = sc.querySelector(".app-header");
    if (!hd) return;
    var ht = hd.querySelector(".ht");
    /* unify any existing back control */
    var back = hd.querySelector('[aria-label="Back"]');
    if (back) { back.classList.add("rb-back"); back.innerHTML = SVG.back; }
    if (!isRoot && !back && !NO_HEADER_BACK[id]) {
      var b = document.createElement("button");
      b.className = "icon-btn rb-back"; b.type = "button"; b.setAttribute("aria-label", "Back"); b.setAttribute("data-action", "nav-back");
      b.innerHTML = SVG.back;
      hd.insertBefore(b, hd.firstChild);
    }
    /* Messages + Notifications on every main screen and on sub-pages where space allows (Vishal, 21 Nov).
       Not shown: inside a chat, on the Chats list (bell only), on Notifications (chat only), sign-up/gate flows,
       and screens whose header already carries its own actions (e.g. Video tutorials search). */
    $all('[aria-label="Menu"], [data-action="open-drawer"]', hd).forEach(function (x) { x.classList.add("rb-hide"); });
    var NO_BELLS = { "chat-dm": 1, "chat-group": 1, tutorials: 1, signin: 1, signup: 1, "signup-email": 1, "signup-phone": 1, "signup-name": 1, "create-profile": 1, "create-profile-connected": 1, "signup-business": 1, "complete-profile": 1, "choose-areas": 1, "create-regions": 1, "create-regions-all": 1, pending: 1, "fb-consent": 1, "google-consent": 1, welcome: 1, lockscreen: 1, "intro-video": 1, "ai-voice": 1 };
    if (!NO_BELLS[id]) {
      var r = hd.querySelector(".header-right");
      if (!r) { r = document.createElement("div"); r.className = "header-right"; hd.appendChild(r); }
      if (id !== "chats" && !hd.querySelector('[data-go="chats"]')) r.insertAdjacentHTML("afterbegin", headerBtn("chat"));
      if (id !== "notifications" && !hd.querySelector('[data-go="notifications"]')) r.insertAdjacentHTML("beforeend", headerBtn("bell"));
      $all(".bell-btn", hd).forEach(function (x) { x.classList.remove("rb-hide"); });
      /* AI assistant always one tap away: order is AI · Chat · Bell (Vishal, 21 Nov) */
      if (id !== "ai-assistant" && !hd.querySelector(".rb-ai-btn")) {
        var chatB = hd.querySelector('.header-right [data-go="chats"]');
        var aiHtml = '<button class="icon-btn bell-btn rb-ai-btn" data-go="ai-assistant" aria-label="AI assistant">' + SVG.ai + "</button>";
        if (chatB && id !== "chats") chatB.insertAdjacentHTML("beforebegin", aiHtml); else r.insertAdjacentHTML("afterbegin", aiHtml);
      }
      if (id === "chats") $all('[data-go="chats"]', hd).forEach(function (x) { x.classList.add("rb-hide"); });
      if (id === "notifications") $all('[data-go="notifications"]', hd).forEach(function (x) { x.classList.add("rb-hide"); });
    } else {
      $all(".bell-btn", hd).forEach(function (x) { x.classList.add("rb-hide"); });
    }
    if (ht) {
      var t = txt(ht);
      if (t === "Help & how it works") ht.textContent = "Help";
      if (t === "Vouch received?") ht.textContent = "Vouches received";
      if (id === "tutorial-play") { if (t !== "Videos" && t !== "Video") ht.setAttribute("data-full", t); ht.textContent = "Videos"; }
    }
    /* duplicate title directly under header */
    var h2 = sc.querySelector(".scroll .auth-hero h2, .scroll > h2");
    if (h2 && ht && id !== "signup-name") {
      var a = txt(h2).toLowerCase(), c = txt(ht).toLowerCase();
      if ((c.length > 3 && (a.indexOf(c) === 0 || c.indexOf(a) === 0)) || /^(invite|rec-alerts|promo-queue)$/.test(id)) h2.classList.add("rb-dup-title");
    }
    $all(".scroll span.now", sc).forEach(function (x) { if (txt(x) === "State") x.classList.add("rb-hide"); });
  }

  /* ---------- buttons ---------- */
  var DECO = /^(Continue|Sign in|Verify and continue|Send for approval|Demo: simulate approval|Done, I commented|Leave the queue|Done)$/;
  function fixButtons(sc) {
    $all(".btn", sc).forEach(function (b) {
      var t = txt(b);
      if (DECO.test(t)) $all("svg", b).forEach(function (s) { s.classList.add("rb-deco-ico"); });
      if (t === "Coming later") { b.classList.add("rb-disabled"); b.setAttribute("aria-disabled", "true"); $all("svg", b).forEach(function (s) { s.classList.add("rb-deco-ico"); }); }
      if (t === "Leave the queue") { b.classList.add("rb-destructive"); }
      if (t === "Sign out") b.classList.add("rb-destructive");
      if (t === "Leave a Facebook vouch") { b.classList.remove("btn-ghost", "ink"); b.classList.add("btn-primary", "rb-sticky-cta"); }
    });
    $all('button[aria-label^="Slide"]').forEach(function (d) { d.classList.add("rb-dot"); });
    /* badge colours */
    $all(".v211-badge", sc).forEach(function (b) {
      var t = txt(b).toLowerCase();
      ["gold", "silver", "bronze", "platinum"].forEach(function (k) { if (t.indexOf(k) > -1) b.classList.add("rb-" + k); });
    });
    /* status pills: 'Remind' → 'Remind me' */
    $all(".v21-act", sc).forEach(function (b) { if (txt(b) === "Remind") b.textContent = "Remind me"; });
  }

  /* ---------- generic readability: min 12px, dark secondary text ---------- */
  function lum(c) { var m = (c || "").match(/[\d.]+/g); if (!m) return null; var a = m.slice(0, 3).map(function (v) { v = v / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return { L: 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2], rgb: m.slice(0, 3).map(Number), a: m[3] !== undefined ? +m[3] : 1 }; }
  function darkBg(el) { var p = el; while (p && p !== document.body) { var cs = getComputedStyle(p); if (cs.backgroundImage && cs.backgroundImage !== "none" && !/gradient\(.*(255, 255, 255|248|245|241|236)/.test(cs.backgroundImage)) { if (/url\(/.test(cs.backgroundImage)) return true; var mm = cs.backgroundImage.match(/rgba?\([^)]+\)/); if (mm) { var l = lum(mm[0]); if (l && l.L < 0.35) return true; } } var bl = lum(cs.backgroundColor); if (bl && bl.a > 0.6) return bl.L < 0.35; p = p.parentElement; } return false; }
  function fixReadability(scope) {
    $all("*", scope).forEach(function (el) {
      if (el.closest("svg")) return;
      var hasText = false; for (var i = 0; i < el.childNodes.length; i++) { var n = el.childNodes[i]; if (n.nodeType === 3 && n.nodeValue.trim()) { hasText = true; break; } }
      if (!hasText) return;
      var cs = getComputedStyle(el);
      if (el.classList.contains("bell-dot")) { el.style.removeProperty("font-size"); return; }
      if (parseFloat(cs.fontSize) < 12 && !el.closest(".fb-seg-btn, .v21-more-tile")) el.style.setProperty("font-size", "12px", "important"); /* v2.2.0: switch labels are fitted by v220.js (min 11px) */
      var c = lum(cs.color); if (!c) return;
      var r = c.rgb, grey = Math.max(r[0], r[1], r[2]) - Math.min(r[0], r[1], r[2]) < 40;
      if (grey && c.L > 0.17 && c.L < 0.8 && !el.closest(".btn[disabled], .rb-disabled, .is-locked, #tabbar") && !darkBg(el)) el.style.setProperty("color", "#475569", "important");
    });
  }

  /* ---------- screen specifics ---------- */
  function hideDupRevToday(sc) {
    $all(".card, .member-card, .profile-hero, .mem-hero", sc).forEach(function (c) {
      var r = $all(":scope > .rev-today, .rev-today", c); r.slice(1).forEach(function (x) { if (x.closest(".card, .member-card") === r[0].closest(".card, .member-card")) x.classList.add("rb-hide"); });
    });
  }
  function dupAreaLabels(sc) {
    $all(".areas-card-h", sc).forEach(function (h) {
      var card = h.closest(".card, .areas-card") || h.parentElement; var prev = card && card.previousElementSibling;
      if (prev && prev.classList.contains("group-label") && txt(prev).toLowerCase() === txt(h).toLowerCase()) h.classList.add("rb-hide");
    });
  }
  function home(sc) {
    $all(".ov-msg", sc).forEach(function (row) {
      var who = row.querySelector(".ov-msg-who"), main = row.querySelector(".ov-msg-main");
      if (!who || !main || main.querySelector(".rb-nm")) return;
      var nm = who.querySelector(".nm"); if (!nm) return;
      main.insertAdjacentHTML("afterbegin", '<span class="rb-nm">' + txt(nm) + "</span>");
    });
    var map = { "Received": "reviews", "Given": "reviews", "Queue place": "promo-queue", "Circle in queue": "promo-queue", "Unread": "chats", "Chats": "chats", "Friends": "members", "Pending": "members" };
    $all(".ov-card .l", sc).forEach(function (l) {
      var tile = l.parentElement; var dest = map[txt(l)]; if (!dest || tile.dataset.rbGo) return;
      tile.dataset.rbGo = dest; tile.setAttribute("role", "button"); tile.setAttribute("tabindex", "0"); tile.setAttribute("aria-label", txt(l));
    });
    var inv = sc.querySelector('.dash-action[data-go="invite"]'); if (inv) { var s1 = inv.querySelector("svg"); if (s1 && !inv.dataset.rbIco) { s1.outerHTML = SVG.userPlus; inv.dataset.rbIco = 1; } }
    var al = sc.querySelector('.dash-action[data-go="rec-compose"]'); if (al) { var s2 = al.querySelector("svg"); if (s2 && !al.dataset.rbIco) { s2.outerHTML = SVG.megaphone; al.dataset.rbIco = 1; } }
    /* consistent demo counts: Google Reviews given = 8 (same as Reviews and My badges) */
    var given = 8; try { if (root.TC21 && TC21.givenTotal) given = TC21.givenTotal(); } catch (e) {}
    $all(".ov-google .l", sc).forEach(function (l) { if (txt(l) === "Given") { var n = l.parentElement.querySelector(".n"); if (n) n.textContent = String(given); } if (txt(l) === "Received") l.textContent = "Received this week"; });
  }
  /* glyph centring: shift each icon's viewBox so its painted shape sits in the exact middle of its tile */
  var GLYPH_SEL = ".avatar svg, .trade-ico svg, .icon-btn svg, .v21-more-ico svg, .apps-ico svg, .ov-ico svg, .dash-tile-ico svg, .set-ico svg, .rb-search-chip svg, .notif-tile svg, .v21-float-btn svg";
  function centreGlyphs(sc) {
    $all(GLYPH_SEL, sc).forEach(function (svg) {
      if (svg.dataset.rbCentred || svg.closest("[class*='play'], .rb-back, [aria-label='Back']") || svg.parentElement.closest("svg")) return;
      var vb = (svg.getAttribute("viewBox") || "").split(/[\s,]+/).map(parseFloat); if (vb.length !== 4 || vb.some(isNaN)) return;
      var b; try { b = svg.getBBox(); } catch (e) { return; }
      if (!b || !b.width || !b.height) return;
      svg.dataset.rbCentred = 1;
      var dx = (b.x + b.width / 2) - (vb[0] + vb[2] / 2), dy = (b.y + b.height / 2) - (vb[1] + vb[3] / 2);
      if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3) return;
      svg.setAttribute("viewBox", [(vb[0] + dx).toFixed(2), (vb[1] + dy).toFixed(2), vb[2], vb[3]].join(" "));
    });
  }
  /* play buttons: centre the triangle on its centroid (1/3 from the flat side) */
  function centrePlays(sc) {
    $all(".rb-thumb-play svg, .tut-hero-play svg, .play-big svg", sc).forEach(function (svg) {
      if (svg.dataset.rbPlay) return; var box = svg.closest(".rb-thumb-play, .tut-hero-play, .play-big"); if (!box) return;
      var p = svg.querySelector("path, polygon"); if (!p) return;
      var br = box.getBoundingClientRect(), gr = p.getBoundingClientRect(), sr = svg.getBoundingClientRect(); if (!gr.width || !sr.width) return;
      svg.dataset.rbPlay = 1;
      var dx = (gr.left + gr.width / 3) - (br.left + br.width / 2), dy = (gr.top + gr.height / 2) - (br.top + br.height / 2);
      if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3) return;
      var vb = (svg.getAttribute("viewBox") || "0 0 24 24").split(/[\s,]+/).map(parseFloat), k = vb[2] / sr.width;
      svg.setAttribute("viewBox", [(vb[0] + dx * k).toFixed(2), (vb[1] + dy * k).toFixed(2), vb[2], vb[3]].join(" "));
    });
  }
  /* ---------- tutorials: play inline, accordion (Vishal, 21 Nov: no separate lesson page) ---------- */
  function tutVideo(id) { try { return root.TCTutorials && TCTutorials.videoById ? TCTutorials.videoById(id) : null; } catch (e) { return null; } }
  function escH(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function tutInline(sc) {
    var st = S(), id = st._tutExpand; if (!id) return;
    var src = sc.querySelector('.scroll [data-action="tut-open"][data-id="' + id + '"]:not(.rb-tut-title)'); if (!src || src.dataset.rbOpen) return;
    var v = tutVideo(id) || {};
    var img = src.querySelector("img"); var poster = img ? img.getAttribute("src") : "";
    var title = v.title || txt(src.querySelector(".tut-lesson-title, .tut-hero-title") || src);
    var isNew = !!src.querySelector(".tut-new-pill") || v.isNew, watched = !!src.querySelector(".tut-watched-pill");
    var idx = src.querySelector(".tut-idx"); var n = idx ? txt(idx) : (src.classList.contains("tut-hero") ? "01" : "");
    var playing = st._tutInlinePlaying === id && v.embed;
    var player = playing
      ? '<iframe src="' + escH(v.embed + (v.embed.indexOf("?") > -1 ? "&" : "?") + "autoplay=1") + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="' + escH(title) + '"></iframe>'
      : (poster ? '<img src="' + escH(poster) + '" alt="">' : "") + '<button type="button" class="play-big rb-inline-play" data-action="tut-inline-play" data-id="' + escH(id) + '" aria-label="Play ' + escH(title) + '"><svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></button>';
    var card = document.createElement("div");
    card.className = "tut-lesson rb-tut-open"; card.setAttribute("data-id", id); card.dataset.rbOpen = 1; card.setAttribute("role", "region"); card.setAttribute("aria-label", title);
    card.innerHTML = '<div class="rb-tut-player' + (playing ? " is-playing" : "") + '">' + player + (n ? '<span class="tut-idx">' + escH(n) + "</span>" : "") + "</div>" +
      '<div class="rb-tut-open-body">' +
      '<button type="button" class="rb-tut-title" data-action="tut-open" data-id="' + escH(id) + '" aria-expanded="true"><span>' + escH(title) + '</span><svg class="rb-tut-chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg></button>' +
      (v.description ? '<p class="rb-tut-desc">' + escH(v.description) + "</p>" : "") +
      '<div class="tut-lesson-meta">' + (v.duration ? '<span class="tut-dur-inline">' + escH(v.duration) + "</span>" : "") +
      (watched ? '<span class="tut-watched-pill">Watched ✓</span>' : (isNew ? '<span class="tut-new-pill">New</span>' : "")) + "</div></div>";
    src.parentNode.replaceChild(card, src);
    if (st._tutScrollTo) {
      st._tutScrollTo = 0;
      var scr = sc.querySelector(".scroll"), hd = sc.querySelector(".app-header");
      setTimeout(function () {
        if (!scr) return; var top = card.getBoundingClientRect().top - (hd ? hd.getBoundingClientRect().bottom : 0) - 12;
        var reduce = root.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
        scr.scrollTo({ top: Math.max(0, scr.scrollTop + top), behavior: reduce ? "auto" : "smooth" });
      }, 60);
    }
  }
  root.addEventListener("click", function (e) { /* window capture: runs before the older tut-open handlers */
    var b = e.target && e.target.closest && e.target.closest('[data-action="tut-open"], [data-action="tut-inline-play"]'); if (!b) return;
    var st = S(), id = b.getAttribute("data-id"), act = b.getAttribute("data-action"), go = T().go; if (!go) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (act === "tut-inline-play") {
      st._tutExpand = id; st._tutInlinePlaying = id; try { if (root.TCTutorials && TCTutorials.markWatched) TCTutorials.markWatched(id); } catch (eW) {}
      var v = tutVideo(id), wrap = b.closest(".rb-tut-player");
      if (v && v.embed && wrap) { wrap.classList.add("is-playing"); wrap.innerHTML = '<iframe src="' + escH(v.embed + (v.embed.indexOf("?") > -1 ? "&" : "?") + "autoplay=1") + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="' + escH(v.title || "Video") + '"></iframe>'; }
      return;
    }
    if (st._tutExpand === id && S().screen === "tutorials") { st._tutExpand = null; st._tutInlinePlaying = null; }
    else { st._tutExpand = id; st._tutInlinePlaying = null; st._tutScrollTo = 1; }
    var keep = document.querySelector('.screen.active[data-screen="tutorials"] .scroll'), y = keep ? keep.scrollTop : 0;
    go("tutorials", { replace: true });
    var ns = document.querySelector('.screen.active[data-screen="tutorials"] .scroll'); if (ns && !st._tutScrollTo) ns.scrollTop = y; else if (ns && st._tutScrollTo) ns.scrollTop = y;
  }, true);
  /* one segmented switch: equal segments + one sliding pill (slides from the last selected segment) */
  function segSwitch(sc) {
    $all(".fb-seg, .seg", sc).forEach(function (tr) {
      var btns = $all(":scope > button", tr); if (btns.length < 2 || btns.length > 4) return;
      var idx = -1; btns.forEach(function (b, i) { if (b.classList.contains("active") || b.getAttribute("aria-selected") === "true") idx = i; });
      if (idx < 0) return;
      var key = tr.classList.contains("fb-seg") ? "fb" : ("seg:" + btns.map(function (b) { return txt(b); }).join("|"));
      root.__rbSegIdx = root.__rbSegIdx || {};
      var pill = tr.querySelector(":scope > .rb-seg-pill");
      if (!pill) { pill = document.createElement("span"); pill.className = "rb-seg-pill"; pill.setAttribute("aria-hidden", "true"); tr.insertBefore(pill, tr.firstChild); }
      tr.classList.add("rb-seg"); tr.style.setProperty("--n", btns.length);
      var prev = root.__rbSegIdx[key];
      if (tr.dataset.rbSegI === String(idx)) return;
      tr.dataset.rbSegI = String(idx);
      if (prev != null && prev !== idx && !tr.dataset.rbSegAnim) {
        tr.dataset.rbSegAnim = 1; pill.style.transition = "none"; tr.style.setProperty("--i", prev); void pill.offsetWidth; pill.style.transition = "";
        requestAnimationFrame(function () { tr.style.setProperty("--i", idx); });
      } else tr.style.setProperty("--i", idx);
      root.__rbSegIdx[key] = idx;
    });
  }
  function fbSeg(sc) {
    $all(".fb-seg-btn", sc).forEach(function (b) {
      if (b.dataset.rbSeg) return; b.dataset.rbSeg = 1;
      var place = b.querySelector(".fb-seg-place"), lab = b.querySelector(".fb-seg-lab");
      if (place) {
        var pt = txt(place), m = pt.match(/(#?)\s*(\d+)/); place.classList.add("rb-hide");
        var inner = place.querySelector(".fb-seg-badge"); if (inner && lab) { inner.setAttribute("aria-label", pt); lab.insertAdjacentElement("afterend", inner); }
        if (m && lab && !b.querySelector(".fb-seg-badge")) lab.insertAdjacentHTML("afterend", '<span class="rb-seg-badge" aria-label="' + pt.replace(/"/g, "") + '">' + m[1] + m[2] + "</span>");
      }
      var bd = b.querySelector(".fb-seg-badge"); if (bd) { var n = txt(bd).match(/\d+/); if (n) bd.textContent = n[0]; bd.classList.add("rb-seg-badge"); }
    });
    /* one queue place everywhere: the Recommend tab's bar hard-codes "#4", so reuse the place shown on Circle / Queue */
    var qb = sc.querySelector('.fb-seg-btn[data-go="promo-queue"] .rb-seg-badge, .fb-seg-btn[data-go="promo-queue"] .fb-seg-badge');
    var truth = 0; try { if (root.TC211 && TC211.myPlace) truth = TC211.myPlace().mine || 0; } catch (eQ) {}
    if (qb && truth) { qb.textContent = "#" + truth; qb.setAttribute("aria-label", "Your place #" + truth); root.__rbQueuePlace = "#" + truth; qb = null; }
    if (qb) {
      var ds = sc.getAttribute("data-screen");
      if (ds !== "fb-recommend") root.__rbQueuePlace = txt(qb);
      else if (root.__rbQueuePlace) qb.textContent = root.__rbQueuePlace;
      else {
        try { var q = (T().state && T().state._queue) || []; q.forEach(function (row, i) { if (row.mine) qb.textContent = "#" + (i + 1); }); } catch (e) {}
      }
    }
  }
  function members(sc) {
    $all(".il", sc).slice(0, 1).forEach(function (il) { var box = il.closest(".card") || il.parentElement.parentElement; if (box && !box.querySelector(".member-card")) box.classList.add("rb-hide"); });
    var rel = sc.querySelector(".rel-chips");
    if (rel && !rel.previousElementSibling?.classList?.contains("rb-row-label")) { rel.insertAdjacentHTML("beforebegin", '<div class="rb-row-label">Status</div>'); rel.classList.add("rb-hscroll"); }
    var tchip = sc.querySelector(".chip.trade-with-ico"); var trow = tchip && tchip.parentElement;
    if (trow && !trow.previousElementSibling?.classList?.contains("rb-row-label")) { trow.insertAdjacentHTML("beforebegin", '<div class="rb-row-label">Trade</div>'); trow.classList.add("rb-hscroll"); }
    $all(".friend-btn span", sc).forEach(function (s) { s.textContent = s.textContent.replace(/\s*✓\s*$/, ""); });
  }
  function reviews(sc) {
    var f = sc.querySelector(".v21-fchip"); if (f) f.parentElement.classList.add("rb-hscroll");
    var inc = sc.querySelector(".v21-incoming");
    if (inc && !inc.dataset.rb) {
      inc.dataset.rb = 1;
      $all("div", inc).forEach(function (d) { if (txt(d) === "›" && !d.children.length) d.innerHTML = SVG.chev; });
      var cnt = inc.querySelector(".v21-count"); if (cnt) cnt.classList.add("rb-count-red");
    }
    $all(".v21-mrow .n", sc).forEach(function (n) { n.style.setProperty("max-width", "none", "important"); });
  }
  function member(sc, id) {
    var hero = sc.querySelector(".v211-actions, .mem-actions") || (sc.querySelector('[data-action="ask-review"]') || {}).parentElement;
    var ask = sc.querySelector('[data-action="ask-review"]'), msg = sc.querySelector('.scroll [data-action="open-chat"].btn'), fr = sc.querySelector(".scroll .friend-btn");
    if (ask && msg && fr && !sc.querySelector(".rb-act-row")) {
      var row = document.createElement("div"); row.className = "rb-act-row";
      ask.parentElement.insertBefore(row, ask);
      [msg, fr, ask].forEach(function (b) { row.appendChild(b); });
      var s = ask.querySelector("span"); if (s) s.textContent = "Ask review";
      var fs = fr.querySelector("span"); if (fs) fs.textContent = fs.textContent.replace(/\s*✓\s*$/, "");
    }
    $all(".scroll .btn", sc).forEach(function (b) { if (txt(b) === "View Facebook profile") b.classList.add("rb-hide"); });
    $all(".reviewed-tick", sc).forEach(function (r) { r.textContent = r.textContent.replace(/\s*✓\s*$/, ""); });
    /* expertise / referral chips: text only (main trade pill keeps its glyph) */
    $all(".scroll .t-pill", sc).forEach(function (p, i) { if (i > 0) $all("svg", p).forEach(function (s) { s.classList.add("rb-hide"); }); });
    if (id === "me") { $all(".v211-badge.lg", sc).forEach(function (b) { if (!b.closest(".v211-progress, .v211-badges")) b.classList.add("rb-hide-hero"); }); }
  }
  function incoming(sc) {
    $all('[data-action="swap-leave"]', sc).forEach(function (b) {
      var box = b.parentElement; box.classList.add("rb-swap-acts");
      var card = box.closest(".card, .v211-qcard") || box.parentElement; card.classList.add("rb-rel");
      var st = card.querySelector(".v211-st"); var who = card.querySelector(".who");
      if (st && !st.classList.contains("rb-st-tr")) { st.classList.add("rb-st-tr"); if (who) who.classList.add("rb-pad-r"); }
    });
  }
  function recRequest(sc) {
    $all(".who", sc).forEach(function (w) {
      var card = w.closest(".card, .v211-qcard") || w.parentElement; card.classList.add("rb-rel");
      var st = card.querySelector(".v211-st"); if (st && !st.classList.contains("rb-st-tr")) { st.classList.add("rb-st-tr"); w.classList.add("rb-pad-r"); }
    });
  }
  function vouches(sc) {
    $all(".v211-qwho .n svg, .v211-qwho .n .v211-thumb, .who .n svg", sc).forEach(function (s) { if (s.closest(".card") && s.closest(".card").querySelector(".v211-st.confirmed")) s.classList.add("rb-hide"); });
  }
  function promo(sc) {
    var n = sc.querySelector(".scroll span.n"), h = n && n.nextElementSibling;
    if (n && h && h.classList.contains("hint") && !n.dataset.rb) {
      var m = txt(h).match(/of (\d+)/); n.dataset.rb = 1;
      n.innerHTML = '<span class="rb-queue-head">#' + txt(n) + (m ? " of " + m[1] : "") + "</span>";
      var d = txt(h).match(/about (\d+) days/); h.innerHTML = '<span class="rb-queue-sub">' + (d ? "About " + d[1] + " days to your turn" : txt(h)) + "</span>";
    }
  }
  function fbRecommend(sc) {
    $all(".btn", sc).forEach(function (b) {
      var t = txt(b);
      if (/^Open post on Facebook$/.test(t) || /^I recommended /.test(t)) { b.classList.remove("btn-primary", "btn-fb", "btn-navy"); b.classList.add("btn-ghost", "ink"); }
    });
    $all(".rec-quick button, .rec-chip", sc).forEach(function (c) { c.classList.add("rb-chip"); });
  }
  function more(sc) {
    $all(".v21-more-tile span", sc).forEach(function (s) { if (txt(s) === "Your areas") s.textContent = "My areas"; if (txt(s) === "Promotion queue") s.textContent = "Queue"; if (txt(s) === "Members") s.textContent = "Facebook circle"; });
    var pq = sc.querySelector('.v21-more-tile[data-go="promo-queue"]');
    if (pq && !pq.dataset.rb) { pq.dataset.rb = 1; var i = pq.firstElementChild; if (i && i !== pq.querySelector("span:last-child")) i.setAttribute("style", "background:#EFF6FF;color:#1D4ED8"); $all("svg", pq).forEach(function (s) { s.setAttribute("fill", "currentColor"); }); }
  }
  function settings(sc) {
    $all(".set-row", sc).forEach(function (r) {
      var a = r.querySelector(".a"); if (!a || r.dataset.rb) return; var t = txt(a);
      var m = t.match(/^(Facebook|Google Business Profile): Connected$/);
      if (m) { r.dataset.rb = 1; a.textContent = m[1]; a.insertAdjacentHTML("beforeend", ' <span class="rb-status-chip">Connected</span>'); }
      var ic = r.querySelector(".ic"); if (ic && txt(ic) === "G") ic.innerHTML = gColor(20);
      var ch = r.querySelector(".chev"); if (ch && txt(ch) === "›") ch.innerHTML = SVG.chev;
    });
  }
  function subscription(sc) {
    $all("h3", sc).forEach(function (h) { if (txt(h) === "Free") h.textContent = "Free plan"; });
    /* v2.1.3 membership card: nothing to rewrite */
  }
  function invite(sc) {
    $all(".copy-btn", sc).forEach(function (b) { b.classList.add("rb-hide"); });
    $all(".btn", sc).forEach(function (b) {
      var t = txt(b), s = b.querySelector("svg"); if (!s || b.dataset.rb) return;
      if (t === "Share by SMS") { s.outerHTML = SVG.message; b.dataset.rb = 1; }
      if (t === "Share on WhatsApp") { s.outerHTML = SVG.whatsapp; b.dataset.rb = 1; }
    });
    $all("input", sc).forEach(function (i) { i.style.textOverflow = "ellipsis"; });
  }
  function help(sc) {
    var c = sc.querySelector('.card[data-go="tutorials"]');
    if (c && !c.dataset.rb) {
      c.dataset.rb = 1; c.classList.add("rb-help-link");
      var ps = $all("p", c); var title = ps[0], body = ps[1];
      var wrap = document.createElement("div"); wrap.style.flex = "1"; wrap.style.minWidth = "0";
      if (title) { title.classList.add("rb-help-t"); wrap.appendChild(title); } if (body) wrap.appendChild(body);
      c.innerHTML = ""; c.insertAdjacentHTML("beforeend", '<span style="width:40px;height:40px;border-radius:12px;background:#DBEAFE;color:#1D4ED8;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto">' + SVG.play + "</span>");
      c.appendChild(wrap); c.insertAdjacentHTML("beforeend", SVG.chev);
    }
  }
  function myRegions(sc) {
    if (sc.querySelector('[data-action="save-regions"]')) $all('[data-action="area-next"]', sc).forEach(function (b) { b.classList.add("rb-hide"); });
  }
  function chats(sc) {
    $all(".chat-row div, .chat-list div", sc).forEach(function (d) { if (!d.children.length && /^[A-Z]$/.test(txt(d))) { d.style.borderRadius = "14px"; d.innerHTML = SVG.people; d.style.color = "#fff"; } });
  }
  function notifSettings(sc) {
    $all("strong, .a, .ttl, .t", sc).forEach(function (t) {
      var row = t.closest(".set-row, .ns-row, .toggle-row, li, .row") || t.parentElement.parentElement; if (!row || row.dataset.rb) return;
      var s = row.querySelector("svg"); if (!s) return;
      if (txt(t) === "Group mentions") { s.outerHTML = SVG.at; row.dataset.rb = 1; }
      if (txt(t) === "Quiet hours") { s.outerHTML = SVG.moon; row.dataset.rb = 1; }
    });
  }
  function chatDm(sc) {
    $all("button", sc).forEach(function (b) { if (txt(b) === "😊") { b.innerHTML = SVG.smile; b.setAttribute("aria-label", "Emoji"); } });
  }
  function editProfile(sc) {
    var card = sc.querySelector(".fb-card");
    if (card && !card.dataset.rb && T().avatarHTML) {
      var av = card.querySelector(".avatar, .av, [class*='av']");
      try { if (av) { av.outerHTML = T().avatarHTML(me(), 44); card.dataset.rb = 1; } } catch (e) {}
    }
    var sel = $all(".chip.active", sc).map(function (c) { return txt(c).replace(/[×✕]/g, "").trim().toLowerCase().replace(/s$/, ""); });
    $all(".cp-pop, .chip", sc).forEach(function (c) { var t = txt(c); if (t.charAt(0) !== "+") return; var k = t.slice(1).trim().toLowerCase().replace(/s$/, ""); if (sel.indexOf(k) > -1) c.classList.add("rb-hide"); });
  }


  /* region chips: shrink the font (15 → 12px) until the longest single word fits; wrap only at spaces */
  function fitRegions(sc) {
    /* chip labels: 14px/600, wrap only at spaces, max 2 lines; shrink (min 12px) only if a single word
       does not fit or the name needs a 3rd line; last resort: give the chip the full row */
    $all(".region-chip .n", sc).forEach(function (n) {
      n.style.removeProperty("font-size");
      var lh = function () { return parseFloat(getComputedStyle(n).lineHeight) || 17.5; };
      var tooBig = function () {
        n.style.setProperty("-webkit-line-clamp", "unset", "important");
        var over = n.scrollWidth > n.clientWidth + 0.5 || n.scrollHeight > lh() * 2 + 1;
        n.style.removeProperty("-webkit-line-clamp"); return over;
      };
      var size = 14, guard = 0;
      while (tooBig() && size > 12 && guard++ < 8) { size -= 0.5; n.style.setProperty("font-size", size + "px", "important"); }
      if (tooBig()) {
        var chip = n.closest(".region-chip"); if (chip) chip.style.gridColumn = "1 / -1";
        n.style.removeProperty("font-size"); size = 14; guard = 0;
        while (tooBig() && size > 12 && guard++ < 8) { size -= 0.5; n.style.setProperty("font-size", size + "px", "important"); }
      }
      n.dataset.rbFit = size;
    });
  }


  /* ---------- shared "name + trade" component: a member's trade always shows with their name ---------- */
  function memberIndex() {
    var list = (T().MEMBERS || []), idx = {};
    list.forEach(function (m) {
      var full = ((m.first || "") + " " + (m.last || "")).trim(); if (!full || !m.trade) return;
      idx[full.replace(/[’']/g, "'")] = m;
    });
    return idx;
  }
  function ownText(el) { var t = ""; for (var i = 0; i < el.childNodes.length; i++) { var n = el.childNodes[i]; if (n.nodeType === 3) t += n.nodeValue; } return t.replace(/\s+/g, " ").trim().replace(/[’']/g, "'"); }
  var ROW_SEL = ".chat-row, .notif-row, .ov-item, .ov-msg, .v21-mrow, .member-card, .who, .v211-qwho, .card, li, button, a, .set-row, .ac-item, .rb-row";
  function tradeLine(trade, rest) { return '<span class="rb-trade-line">' + trade + (rest ? " · " + rest : "") + "</span>"; }
  function addTrades(sc) {
    var idx = memberIndex(), names = Object.keys(idx); if (!names.length) return;
    $all("*", sc).forEach(function (el) {
      if (el.dataset.rbTrade || el.closest("svg, .rb-trade-line, .region-chip, .tabbar, input, textarea, select")) return;
      var own = ownText(el); if (!own || own.length > 40) return;
      var m = idx[own.replace(/\s*YOU$/, "")]; if (!m) return;
      var trade = m.trade, row = el.closest(ROW_SEL) || el.parentElement;
      if (el.closest(".app-header")) row = el.closest(".app-header");
      var hay = txt(row).toLowerCase();
      if (hay.indexOf(trade.toLowerCase()) > -1) { el.dataset.rbTrade = "has"; return; }
      el.dataset.rbTrade = "added";
      var sub = el.nextElementSibling;
      var rest = sub && !sub.children.length ? txt(sub) : "";
      if (rest && rest.length <= 40 && rest.split(" ").length <= 6 && !/[.!?]$/.test(rest) && !sub.classList.contains("v211-badge") && !/^[\d@]/.test(rest) && !el.closest(".msg, .bubble, .chat-msg, .msg-row, [class*='bubble']")) {
        sub.textContent = trade + " · " + rest; sub.classList.add("rb-trade-sub");
      } else if (sub || el.closest(".ov-msg, .chat-row, .notif-row") || getComputedStyle(el).display === "inline") {
        el.insertAdjacentHTML("beforeend", '<span class="rb-trade-inline"> · ' + trade + "</span>");
      } else {
        el.insertAdjacentHTML("afterend", tradeLine(trade));
      }
    });
    /* running text ("Tom Reeves asked you…"): add the trade in brackets right after the first mention */
    var tw = document.createTreeWalker(sc, NodeFilter.SHOW_TEXT), hits = [];
    while (tw.nextNode()) {
      var tn = tw.currentNode, pe = tn.parentElement; if (!pe || pe.closest("svg, input, textarea, .rb-trade-line, .rb-trade-inline, .rb-trade-sub, .tabbar")) continue;
      var v = tn.nodeValue.replace(/[’']/g, "'"); if (v.length < 12 || v.length > 240) continue;
      for (var j = 0; j < names.length; j++) {
        var nm2 = names[j], at = v.indexOf(nm2); if (at < 0) continue;
        var rowEl = pe.closest(ROW_SEL + ", .msg, .bubble, .dash-feed-item, .voice-line, .hint, .bd") || pe;
        if (txt(rowEl).toLowerCase().indexOf(idx[nm2].trade.toLowerCase()) > -1) break;
        var up2 = (pe.parentElement && pe.parentElement.parentElement) || pe; if (rowEl === pe && txt(up2).length < 300 && txt(up2).toLowerCase().indexOf(idx[nm2].trade.toLowerCase()) > -1) break;
        hits.push([tn, at + nm2.length, idx[nm2].trade]); break;
      }
    }
    hits.forEach(function (h) { var after = h[0].splitText(h[1]); var sp = document.createElement("span"); sp.className = "rb-trade-inline rb-trade-paren"; if (/^\s\(/.test(after.nodeValue)) { sp.textContent = " (" + h[2] + ", "; after.nodeValue = after.nodeValue.replace(/^\s\(/, ""); } else sp.textContent = " (" + h[2] + ")"; after.parentNode.insertBefore(sp, after); });
    /* notifications and sentences: name inside a longer title */
    $all(".notif-row", sc).forEach(function (r) {
      if (r.dataset.rbTrade) return; r.dataset.rbTrade = 1;
      var t = r.querySelector(".ttl") || r; var tt = txt(t).replace(/[’']/g, "'");
      var hay = txt(r).toLowerCase();
      for (var i = 0; i < names.length; i++) {
        var nm = names[i], m = idx[nm];
        if (tt.indexOf(nm) > -1 && hay.indexOf(m.trade.toLowerCase()) === -1) { t.insertAdjacentHTML("afterend", tradeLine(nm + " · " + m.trade).replace(nm + " · " + m.trade + "", nm + " · " + m.trade)); break; }
      }
    });
  }

  /* one Messages glyph everywhere: two rounded speech bubbles (Vishal, 21 Nov) */
  function chatIcons(sc) {
    var sel = ['[data-go="chats"] svg', '.v21-more-tile[data-go="chats"] svg', '.ov-messages > * .ov-ico svg', '.ov-messages .ov-ico svg', '[data-action="open-chat"] svg', '.msg-btn svg', '[data-go="chat-dm"].btn svg'];
    $all(sel.join(","), sc).forEach(function (svg) {
      if (svg.classList.contains("rb-chat2") || svg.closest(".avatar, [aria-label='Back'], .rb-back, [data-action='nav-back']")) return;
      var w = svg.getAttribute("width") || 20;
      var t = document.createElement("span"); t.innerHTML = SVG.chat.replace('width="20" height="20"', 'width="' + w + '" height="' + w + '"');
      var n = t.firstChild; if (svg.getAttribute("class")) n.setAttribute("class", svg.getAttribute("class") + " rb-chat2");
      svg.parentNode.replaceChild(n, svg);
    });
  }
  /* ---------- tutorials: branded thumbnails ---------- */
  var TOPICS = [
    [/welcome|introduction|what rate buddies/i, "assets/tutorials/thumb-welcome.svg"],
    [/tour|home, reviews/i, "assets/tutorials/thumb-tour.svg"],
    [/google review/i, "assets/tutorials/thumb-google-reviews.svg"],
    [/recommend|facebook/i, "assets/tutorials/thumb-facebook.svg"],
    [/profile/i, "assets/tutorials/thumb-profile.svg"]
  ];
  function thumbFor(title) { for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i][0].test(title)) return TOPICS[i][1]; return "assets/tutorials/thumb-welcome.svg"; }
  function tutorials(sc, id) {
    $all("img", sc).forEach(function (img) {
      if (img.dataset.rbThumb) return;
      var src = img.getAttribute("src") || "";
      var inTut = img.closest(".tut-hero, .tut-lesson, .tut-lesson-thumb, .tut-player, .tut-card, .v211-video-card, .intro-video, [class*='tut']");
      if (!/youtube|ytimg|vumbnail|vimeo|bunny|sintel|tutorial|gtv|sample/i.test(src) && !inTut) return;
      var variant = "";
      var title;
      if (img.closest(".tut-hero")) { variant = "-bg"; var hh = img.closest(".tut-hero"); title = txt(hh.querySelector(".tut-hero-title")) || txt(hh); }
      else if (img.closest(".tut-lesson, .tut-lesson-thumb")) { variant = "-lesson"; var ll = img.closest(".tut-lesson") || img.parentElement.parentElement; title = txt(ll.querySelector(".tut-lesson-title")) || txt(ll); }
      else if (id === "tutorial-play") { title = txt(sc.querySelector(".tut-player") ? sc.querySelector(".scroll") : sc).slice(0, 200); var h = sc.querySelector(".app-header .ht"); if (h && h.getAttribute("data-full")) title = h.getAttribute("data-full"); }
      else title = "Welcome";
      if (id === "intro-video" || id === "pending") title = "Welcome";
      img.src = thumbFor(title).replace(".svg", variant + ".svg"); img.dataset.rbThumb = 1; img.classList.add("rb-thumb");
    });
    if (id === "tutorials") {
      /* shared header set here too (Vishal: messages + notifications everywhere): back · title · AI · Chat · Bell; search moves to the start of the chips row */
      var row = sc.querySelector(".tut-header-row");
      if (row && !row.querySelector(".rb-ai-btn")) {
        var sb = row.querySelector(".tut-search-btn"), chips = sc.querySelector(".tut-chips");
        if (sb && chips) { sb.classList.add("rb-search-chip"); chips.insertBefore(sb, chips.firstChild); }
        var rr = document.createElement("div"); rr.className = "header-right rb-tut-right";
        rr.innerHTML = '<button class="icon-btn bell-btn rb-ai-btn" data-go="ai-assistant" aria-label="AI assistant">' + SVG.ai + "</button>" + headerBtn("chat") + headerBtn("bell");
        row.appendChild(rr);
      }
    }
    var PLAY = '<span class="rb-thumb-play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.8v14.4a1 1 0 0 0 1.5.86l11.2-7.2a1 1 0 0 0 0-1.72L8.5 3.94A1 1 0 0 0 7 4.8z"/></svg></span>';
    $all(".tut-lesson-thumb, .tut-thumb, .v211-video-card .thumb", sc).forEach(function (t) {
      if (t.querySelector(".rb-thumb-play")) return;
      var old = t.querySelector(":scope > .play"); if (old) old.classList.add("rb-hide-old");
      t.insertAdjacentHTML("beforeend", PLAY);
    });
    $all(".tut-sample", sc).forEach(function (x) { x.classList.add("rb-hide"); });
    $all(".tut-watched", sc).forEach(function (x) { if (txt(x) === "Start here") x.classList.add("rb-hide"); });
    $all("p.hint, span, div", sc).forEach(function (p) { if (!p.children.length && /Sample video\s*—\s*placeholder only/.test(p.textContent)) { var v = p.textContent.replace(/\s*·?\s*Sample video\s*—\s*placeholder only\.?/, "").trim(); if (v) p.textContent = v; else p.classList.add("rb-hide"); } });
    if (id === "tutorial-play") {
      /* Lesson page (Vishal, 21 Nov): header just says "Videos"; full title big above the player, then meta, player, description */
      var ht = sc.querySelector(".app-header .ht"); var full = ht && ht.getAttribute("data-full");
      var pb = sc.querySelector(".tut-player [data-id]"); var vid = pb && pb.getAttribute("data-id");
      var lessonNo = "", dur = "";
      try {
        var all = (root.TCTutorials && TCTutorials.load) ? TCTutorials.load() : null;
        var list = []; if (all) { if (all.intro) list.push(all.intro); (all.lessons || all.videos || []).forEach(function (v) { if (!all.intro || v.id !== all.intro.id) list.push(v); }); }
        list.forEach(function (v, i) { if (v.id === vid) { full = v.title || full; lessonNo = String(i + 1).padStart(2, "0"); dur = v.duration || v.dur || ""; } });
      } catch (e) {}
      var player = sc.querySelector(".tut-player");
      var scroll = sc.querySelector(".scroll");
      $all(".scroll > p.hint", sc).forEach(function (h) { if (/^\d{1,2}:\d{2}$/.test(txt(h))) { if (!dur) dur = txt(h); h.classList.add("rb-hide"); } });
      if (full && player && !sc.querySelector(".rb-play-head")) {
        $all(".rb-play-title", sc).forEach(function (x) { x.remove(); });
        var meta = [lessonNo ? "Lesson " + lessonNo : "", dur].filter(Boolean).join(" · ");
        player.insertAdjacentHTML("beforebegin", '<div class="rb-play-head"><h1 class="rb-play-title">' + full.replace(/</g, "&lt;") + "</h1>" + (meta ? '<div class="rb-play-meta">' + meta + "</div>" : "") + "</div>");
      }
      if (player) player.classList.add("rb-player-dim");
    }
  }

  /* ---------- interaction: keep scroll position on in-place filters ---------- */
  var pend = null;
  document.addEventListener("click", function (e) {
    var sc = document.querySelector(".screen.active"); if (!sc) return;
    var tile = e.target.closest && e.target.closest("[data-rb-go]");
    if (tile) { e.preventDefault(); e.stopPropagation(); if (T().go) T().go(tile.dataset.rbGo); return; }
    var f = e.target.closest && e.target.closest(".rel-chip, .chip, .v21-fchip, .v21-only, .v21-toggle, [data-rel], [data-action='rb-filter'], [data-action='rb-only-avail'], [data-action='rb-toggle-avail'], .seg button, [data-action='set-area'], [data-action='set-trade'], .toggle");
    if (!f || f.closest(".app-header")) return;
    var scroll = sc.querySelector(".scroll"); if (!scroll) return;
    pend = { id: S().screen, top: scroll.scrollTop, at: Date.now() }; root.__rbPend = pend;
  }, true);
  function fam(x) { return String(x || "").replace(/-(all|filter|search|back|open|mine|done)$/, ""); }
  function restoreScroll() {
    if (!pend || Date.now() - pend.at > 2500) return;
    if (fam(S().screen) !== fam(pend.id)) { pend = null; return; }
    var sc = document.querySelector(".screen.active .scroll"); if (!sc) return;
    var want = pend.top;
    [0, 60, 160, 320, 600].forEach(function (ms) { setTimeout(function () { var s2 = document.querySelector(".screen.active .scroll"); if (s2 && s2.scrollTop < want - 4) s2.scrollTop = want; }, ms); });
  }


  /* ---------- back behaviour: one history stack for every way of navigating ---------- */
  var hstack = [], lastId = null, lastSnap = null, backing = false;
  function snap() {
    var st = S(), scr = document.querySelector(".screen.active .scroll");
    return { id: st.screen, scroll: scr ? scr.scrollTop : 0, selectedMember: st.selectedMember, chatId: st.chatId, tutOpen: st._tutOpen,
      requestId: st._requestId, recOpen: st.recOpen, recFilter: st.recFilter, reviewFor: st.reviewFor, swapPending: st._swapPending };
  }
  function track(id) {
    if (id === lastId) { lastSnap = snap(); return; }
    if (!backing && lastId && !(ROOTS[lastId] && ROOTS[id]) && !NO_HEADER_BACK[id]) { hstack.push(lastSnap || { id: lastId, scroll: 0 }); if (hstack.length > 80) hstack.shift(); }
    if (ROOTS[id] && !backing) hstack = hstack.filter(function (h) { return !ROOTS[h.id] || h.id !== id; });
    lastId = id; lastSnap = snap();
  }
  function rbBack() {
    var prev = hstack.pop();
    if (!prev) {
      var cur = S().screen, FB = { tutorials: "more", "tutorial-play": "tutorials", support: "more", "support-empty": "more", settings: "more", subscription: "more", invite: "more", help: "more", "my-regions": "more", "notif-settings": "settings", "edit-profile": "me", "my-vouches": "me", "vouch-received": "me", "chat-dm": "chats", "chat-group": "chats", "incoming-swap": "reviews", "recommend-request": "fb-recommend" };
      prev = { id: FB[cur] || (ROOTS[cur] && cur !== "home" ? "home" : "home"), scroll: 0 };
      if (cur === "home") return false;
    }
    var st = S(); backing = true;
    try {
      ["selectedMember", "chatId", "recOpen", "recFilter", "reviewFor"].forEach(function (k) { if (typeof prev[k] !== "undefined") st[k] = prev[k]; });
      if (prev.tutOpen) st._tutOpen = prev.tutOpen; if (prev.requestId) st._requestId = prev.requestId; if (prev.swapPending) st._swapPending = prev.swapPending;
      T().go(prev.id, { back: true, memberId: prev.selectedMember, keepScroll: false });
      lastId = S().screen; lastSnap = snap();
    } finally { backing = false; }
    var tries = 0; (function tick() { var sc = document.querySelector(".screen.active .scroll"); if (sc) sc.scrollTop = prev.scroll || 0; if (++tries < 8) setTimeout(tick, 40); })();
    return true;
  }
  window.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest('.screen.active .app-header [aria-label="Back"], .screen.active [data-action="nav-back"]');
    if (!b) return;
    e.preventDefault(); e.stopImmediatePropagation(); e.stopPropagation();
    rbBack();
  }, true);

  /* ---------- main pass ---------- */
  var busy = false;

  /* v2.1.3 r2: ONE queue number everywhere (TC211.myPlace = badge-ranked queue) — rewrite any older hard-coded place text */
  function queueText(sc) {
    var p = null; try { if (root.TC211 && TC211.myPlace) p = TC211.myPlace(); } catch (e) {}
    if (!p || !p.mine) return;
    var tw = document.createTreeWalker(sc, NodeFilter.SHOW_TEXT), list = [];
    while (tw.nextNode()) list.push(tw.currentNode);
    list.forEach(function (tn) { var v = tn.nodeValue, o = v;
      v = v.replace(/You[’']re fourth in the queue\./, "You’re number " + p.mine + " of " + p.total + " in the queue.");
      v = v.replace(/Your place #\d+/, "Your place #" + p.mine);
      v = v.replace(/^#\d+ of \d+$/, "#" + p.mine + " of " + p.total);
      v = v.replace(/number \d+( of \d+)? in the/, "number " + p.mine + " of " + p.total + " in the");
      if (v !== o) tn.nodeValue = v; });
  }
  /* v2.1.3 r2: no ellipsis on meaningful text — wrap instead. Allowed one-line previews: chat-list last message, collapsed tutorial description */
  var TRUNC_OK = '[data-screen="chats"] .prev, .tut-lesson-desc, .fb-seg *, .rb-seg *, .tabbar *, input, textarea, select';
  function unTruncate(sc) {
    $all("*", sc).forEach(function (e) {
      if (!e.getClientRects().length || e.classList.contains("rb-wrap")) return;
      var cs = getComputedStyle(e); if (cs.display === "none" || !e.textContent.trim()) return;
      var ell = cs.textOverflow === "ellipsis" && e.scrollWidth > e.clientWidth + 1;
      var lc = cs.webkitLineClamp && cs.webkitLineClamp !== "none" && e.scrollHeight > e.clientHeight + 2;
      if (!ell && !lc) return;
      if (e.matches(TRUNC_OK) || (sc.matches && sc.matches('[data-screen="chats"]') && e.closest(".prev"))) return;
      e.classList.add("rb-wrap");
      if (/[a-z0-9-]+\.[a-z]{2,}\/\S+/i.test(e.textContent)) { var tw2 = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), tns = []; while (tw2.nextNode()) tns.push(tw2.currentNode);
        tns.forEach(function (tn) { if (!/[\/?=&]/.test(tn.nodeValue)) return; var parts = tn.nodeValue.split(/(?<=[\/?=&.])/); if (parts.length < 2) return; var fr = document.createDocumentFragment(); parts.forEach(function (pt, i) { fr.appendChild(document.createTextNode(pt)); if (i < parts.length - 1) fr.appendChild(document.createElement("wbr")); }); tn.parentNode.replaceChild(fr, tn); }); }
      var hd = e.closest(".app-header, .v21-header"); if (hd) e.classList.add("rb-wrap-ht");
    });
  }
  /* v2.1.3 r2: "Join Our / Facebook Group" on two balanced lines */
  function moreLabels(sc) {
    $all(".v21-more-tile.rb-fb-group > span:last-child", sc).forEach(function (s) { if (s.dataset.rb2) return; s.dataset.rb2 = 1; s.innerHTML = '<span class="rb-l">Join Our</span><span class="rb-l">Facebook Group</span>'; });
  }

  /* v2.1.3 r2: profile badge sits in the chip row (no orphan line); chips stay on one centred row, or two balanced rows */
  function heroBadge(sc) {
    var hero = sc.querySelector(".profile-hero"); if (!hero) return;
    var hb = hero.querySelector(".v211-hero-badge"), tags = hero.querySelector(".tags");
    if (hb && tags && !tags.querySelector(".v211-badge")) { var b = hb.querySelector(".v211-badge"); if (b) { b.classList.remove("lg", "rb-hide-hero"); b.classList.add("rb-tag-badge"); tags.appendChild(b); hb.classList.add("rb-hide"); } }
    if (!tags) return;
    $all(".rb-break", tags).forEach(function (x) { x.remove(); });
    var chips = Array.prototype.filter.call(tags.children, function (c) { return c.getClientRects().length; });
    var tops = {}; chips.forEach(function (c) { tops[Math.round(c.getBoundingClientRect().top)] = 1; });
    if (Object.keys(tops).length > 1 && chips.length > 1) { var k = Math.ceil(chips.length / 2); chips[k - 1].insertAdjacentHTML("afterend", '<i class="rb-break" aria-hidden="true"></i>'); }
  }

  /* v2.1.3 r2: notification tiles — same optical glyph size (sqrt of painted area = 18/24), centred */
  function normNotifGlyphs(sc) {
    $all(".notif-ico svg", sc).forEach(function (s) {
      if (s.dataset.rbNorm) return; var b; try { b = s.getBBox(); } catch (e) { return; } if (!b || !b.width || !b.height) return;
      var k = 18 / Math.sqrt(b.width * b.height); k = Math.min(k, 22.5 / Math.max(b.width, b.height));
      var V = 24 / k, cx = b.x + b.width / 2, cy = b.y + b.height / 2;
      s.setAttribute("viewBox", (cx - V / 2).toFixed(2) + " " + (cy - V / 2).toFixed(2) + " " + V.toFixed(2) + " " + V.toFixed(2)); s.dataset.rbNorm = 1; s.dataset.rbCentred = 1;
    });
  }
  /* v2.1.3 r2: tip banners — text, then a right-aligned "Got it" link, 16px padding */
  function tipBanners(sc) {
    $all(".banner", sc).forEach(function (bn) {
      var btn = bn.querySelector('[data-action="dismiss-tip"]'); if (!btn || bn.classList.contains("rb-tip")) return;
      var sp = document.createElement("span"); sp.className = "rb-tip-t";
      Array.prototype.slice.call(bn.childNodes).forEach(function (n) { if (n !== btn) sp.appendChild(n); });
      bn.insertBefore(sp, btn); btn.removeAttribute("style"); bn.classList.add("rb-tip"); bn.style.margin = "8px 0 14px";
    });
  }

  /* v2.1.3 r2: wrapped chip rows never leave one chip alone on the last line */
  function balanceChips(sc) {
    $all("*", sc).forEach(function (c) {
      if (c.closest(".profile-hero .tags")) return; var cs = getComputedStyle(c); if (cs.flexWrap !== "wrap" || !/flex/.test(cs.display)) return;
      var kids = Array.prototype.filter.call(c.children, function (k) { return k.getClientRects().length && !k.classList.contains("rb-break") && /chip|pill|badge|tag/.test(k.className || ""); });
      if (kids.length < 3) return;
      var lines = []; kids.forEach(function (k) { var t = Math.round(k.getBoundingClientRect().top / 4); var L = lines[lines.length - 1]; if (!L || L.t !== t) lines.push({ t: t, k: [k] }); else L.k.push(k); });
      if (lines.length > 1 && lines[lines.length - 1].k.length === 1 && lines[lines.length - 2].k.length >= 3) { var mv = lines[lines.length - 2].k; mv[mv.length - 1].insertAdjacentHTML("beforebegin", '<i class="rb-break" aria-hidden="true"></i>'); }
    });
  }

  /* v2.1.3 r2: a tier badge that wraps under the name moves into the row's chip line (no lone badge line) */
  function badgeRows(sc) {
    /* if any badge in a list wraps below its name, move every badge in that list to the flags row so the rows stay consistent */
    var bs = $all(".meta > .n > .v211-badge", sc).filter(function (b) { return b.parentElement.parentElement.querySelector(".v21-flags"); });
    var anyWrap = bs.some(function (b) { var n = b.parentElement; var rg = document.createRange(); rg.setStart(n, 0); rg.setEnd(n, 1); return b.getBoundingClientRect().top > rg.getBoundingClientRect().top + 4; });
    if (anyWrap) bs.forEach(function (b) { var flags = b.parentElement.parentElement.querySelector(".v21-flags"); b.classList.add("rb-flag-badge"); flags.insertBefore(b, flags.firstChild); });
  }

  /* v2.1.3 r2: conversation header — trade sits right after the name, "Online" underneath; proper dots icon on More */
  function chatHead(sc) {
    $all(".app-header .chat-head-who", sc).forEach(function (w) {
      var tl = w.querySelector(":scope > .rb-trade-line"), ht = w.querySelector(".ht"); if (!tl || !ht) return;
      var first = ht.firstChild; var sp = document.createElement("span"); sp.className = "rb-trade-inline rb-head-trade"; sp.textContent = " · " + txt(tl);
      if (first && first.nodeType === 3) first.parentNode.insertBefore(sp, first.nextSibling); else ht.insertBefore(sp, ht.firstChild);
      tl.remove();
    });
    $all('.app-header [data-action="chat-more"]', sc).forEach(function (b) { if (b.querySelector("svg")) return; b.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>'; });
  }

  /* v2.1.3 r2: when "Name · Trade" has to wrap, the trade moves to its own line without a dangling "·" */
  function tradeBreaks(sc) {
    $all(".rb-trade-inline:not(.rb-trade-paren)", sc).forEach(function (sp) {
      if (!sp.dataset.rbFull) { sp.dataset.rbFull = sp.textContent; sp.textContent = sp.textContent.replace(/^\s*·\s*/, " ·\u00a0"); }
      sp.classList.remove("rb-trade-own"); sp.textContent = sp.dataset.rbFull.replace(/^\s*·\s*/, " ·\u00a0");
      var host = sp.parentElement; if (!host || !sp.getClientRects().length) return;
      var rg = document.createRange(); rg.setStart(host, 0); rg.setEnd(host, 0); var r0 = host.getBoundingClientRect();
      var first = sp.getClientRects()[0]; var nameRg = document.createRange(); nameRg.selectNodeContents(host.firstChild || host); var nr = nameRg.getClientRects()[0];
      var st = sp.classList.contains("rb-head-trade") && sp.nextElementSibling && sp.nextElementSibling.tagName === "DIV" ? sp.nextElementSibling : null;
      if (st) { if (st.dataset.rbOrig == null) st.dataset.rbOrig = st.textContent; st.textContent = st.dataset.rbOrig; sp.style.display = ""; }
      if (st) { sp.style.display = "none"; st.textContent = sp.dataset.rbFull.replace(/^\s*·\s*/, "") + " · " + st.dataset.rbOrig; return; }
      if (first && nr && first.top >= nr.bottom - 2) {
        var tr = sp.dataset.rbFull.replace(/^\s*·\s*/, "");
        if (st) { sp.style.display = "none"; st.textContent = tr + " · " + st.dataset.rbOrig; }
        else { sp.textContent = tr; sp.classList.add("rb-trade-own"); }
      }
    });
  }
  function glueDots(sc) {
    /* keep a " · " separator on the end of the line it follows, never at the start of the next line */
    var w = document.createTreeWalker(sc, NodeFilter.SHOW_TEXT, null), n, list = [];
    while ((n = w.nextNode())) if (/ · /.test(n.nodeValue)) list.push(n);
    list.forEach(function (t) { if (t.parentElement && t.parentElement.closest("input,textarea,script,style")) return; t.nodeValue = t.nodeValue.replace(/ · /g, "\u00a0· "); });
  }
  function showActiveChip(sc) {
    $all(".chips", sc).forEach(function (row) {
      if (row.scrollWidth <= row.clientWidth + 1) return;
      var a = row.querySelector(":scope > .chip.active, :scope > .chip.on, :scope > [aria-pressed=true]"); if (!a) return;
      var key = a.textContent.trim(); if (row.dataset.rbAct === key) return; row.dataset.rbAct = key;
      var rr = row.getBoundingClientRect(), ar = a.getBoundingClientRect();
      if (ar.right > rr.right - 8 || ar.left < rr.left) row.scrollLeft += Math.round(ar.left - rr.left - 48);
    });
  }
  function pass() {
    if (busy) return; busy = true;
    try {
      var sc = document.querySelector("#screens .screen.active") || document.querySelector(".screen.active");
      var id = (S().screen) || (sc && sc.dataset.screen);
      if (!sc) return;
      track(id);
      var tb = document.getElementById("tabbar"); if (tb) tb.classList.toggle("show", !!ROOTS[id]);
      fixText(sc); fixText(document.getElementById("tabbar"));
      fixHeader(sc, id);
      fixButtons(sc);
      hideDupRevToday(sc); dupAreaLabels(sc); fbSeg(sc); try { segSwitch(sc); } catch (eSeg) {}
      var ds = sc.dataset.screen || id;
      if (ds === "home") home(sc);
      if (/^members/.test(id)) members(sc);
      if (ds === "reviews") reviews(sc);
      if (ds === "member" || ds === "me") member(sc, ds);
      if (ds === "incoming-swap") incoming(sc);
      if (ds === "recommend-request") recRequest(sc);
      if (ds === "my-vouches" || ds === "vouch-received" || ds === "recommend-request") vouches(sc);
      if (ds === "promo-queue") promo(sc);
      if (/^fb-recommend/.test(ds)) fbRecommend(sc);
      if (ds === "more") more(sc);
      if (ds === "settings") settings(sc);
      if (ds === "subscription") subscription(sc);
      if (ds === "invite") invite(sc);
      if (ds === "help") help(sc);
      if (ds === "my-regions") myRegions(sc);
      if (ds === "chats") chats(sc);
      if (ds === "notif-settings") notifSettings(sc);
      if (ds === "chat-dm" || ds === "chat-group") chatDm(sc);
      if (ds === "edit-profile") editProfile(sc);
      tutorials(sc, ds);
      if (ds === "tutorials") { try { tutInline(sc); } catch (eT) { if (root.console) console.warn("v213 tut inline", eT); } }
      /* Android: white status-bar icons over dark covers, dark icons over light headers */
      try { if (root.RBStatusBar) { var darkTop = sc.classList.contains("has-trade-cover"); if (darkTop !== root.__rbDarkTop) { root.__rbDarkTop = darkTop; RBStatusBar.setDarkIcons(!darkTop); } if (!root.__rbInsetAsked) { root.__rbInsetAsked = 1; RBStatusBar.refreshInset(); } } } catch (eSB) {}
      fitRegions(sc); chatIcons(sc); chatIcons(document.getElementById("tabbar"));
      try { addTrades(sc); } catch (e2) { if (root.console) console.warn("v213 trades", e2); }
      try { centreGlyphs(sc); centreGlyphs(document.getElementById("tabbar")); centrePlays(sc); } catch (eG) {}
      try { queueText(sc); moreLabels(sc); heroBadge(sc); badgeRows(sc); chatHead(sc); tipBanners(sc); normNotifGlyphs(sc); } catch (eQ2) {}
      fixReadability(sc); fixReadability(document.getElementById("tabbar"));
      try { glueDots(sc); unTruncate(sc); balanceChips(sc); tradeBreaks(sc); showActiveChip(sc); } catch (eU) {}
      restoreScroll();
    } catch (err) { if (root.console) console.warn("v213", err); }
    finally { busy = false; /* v2.2.0 perf fix: ignore this pass's own DOM changes */ if (mo213) try { mo213.takeRecords(); } catch (eT) {} }
  }
  var mo213 = null;
  function stamp() {
    var ph = document.getElementById("phone"); if (!ph || ph.querySelector(".rb-draft-stamp")) return;
    ph.insertAdjacentHTML("beforeend", '<div class="rb-draft-stamp">Rate Buddies ' + VERSION + "</div>");
  }
  var timer = null;
  function schedule() { clearTimeout(timer); timer = setTimeout(pass, 30); }
  function install() {
    var screens = document.getElementById("screens");
    if (screens && root.MutationObserver) { mo213 = new MutationObserver(function () { if (!busy) schedule(); }); mo213.observe(screens, { childList: true, subtree: true }); }
    var tc = T();
    /* v2.1.3 r2: the first screen was drawn before v211 loaded (old 5-member seed queue). Sync to the badge-ranked queue and redraw queue screens once. */
    try { if (root.TC211 && TC211.myPlace && tc && tc.go) { var q0 = JSON.stringify((S()._queue || []).map(function (r) { return r.memberId; })); TC211.myPlace(); var q1 = JSON.stringify((S()._queue || []).map(function (r) { return r.memberId; }));
      var cur0 = S().screen; if (q0 !== q1 && cur0 && /^(home|promo-queue|me|members|members-all|members-filter|members-search|member|fb-recommend|notifications|ai-assistant|drawer)$/.test(cur0)) { var y0 = 0; tc.go(cur0); } } } catch (eQ0) { if (root.console) console.warn("v213 queue sync", eQ0); }
    if (tc && typeof tc.go === "function" && !tc.__rb213) {
      var orig = tc.go; tc.go = function (gid) {
        /* v2.1.3: no separate lesson page any more (archived route) — open the list with that video expanded */
        if (gid === "tutorial-play") { var st = S(); var vid = st._tutOpen; try { if (!vid && root.TCTutorials) vid = TCTutorials.load().intro.id; } catch (eI) {} st._tutExpand = vid || null; st._tutScrollTo = 1; var args = Array.prototype.slice.call(arguments); args[0] = "tutorials"; var r0 = orig.apply(tc, args); pass(); return r0; }
        var r = orig.apply(tc, arguments); pass(); return r; }; tc.__rb213 = true;
    }
    pass();
    var origBack = (root.TCNav && TCNav.goBack) || tc.goBack;
    function hwBack() { if (closeAny()) return true; return rbBack() || (origBack ? origBack() : false); }
    function closeAny() { var sh = document.querySelector(".v211-sheet, .sheet.open, .drawer.open, #tc12Overlay.show"); if (sh && origBack) { origBack(); return true; } return false; }
    if (root.TCNav) TCNav.goBack = hwBack; tc.goBack = hwBack;
    document.title = document.title.replace(/v2\.1\.[12]/, VERSION);
    $all(".version-pill").forEach(function (v) { v.textContent = "Prototype " + VERSION; });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(install, 0); }); else setTimeout(install, 0);
  root.TC213 = { pass: pass, VERSION: VERSION, hist: function () { return hstack; }, back: function () { return rbBack(); }, last: function () { return lastId; } };
})(window);
