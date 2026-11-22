/* Rate Buddies v2.2.0 — Facebook › Circle member card, design B (Vishal picked B, 22 Nov).
   Compact: name + "trade · area" beside the avatar, Facebook Friends tag over the level badge (right, 8px gap),
   status chips, then two equal half buttons: [View profile | Add friend | Pending | Review back] + [Message].
   Old card stays available: set window.RB_CIRCLE_CARD = "old" (or localStorage rb_circle_card = "old"). */
(function (root) {
  "use strict";
  function T() { return root.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function oldOn() {
    if (root.RB_CIRCLE_CARD === "old") return true;
    try { return localStorage.getItem("rb_circle_card") === "old"; } catch (e) { return false; }
  }
  var REG = { hills: "Hills", north: "North", south: "South", east: "East", central: "Central", fremantle: "Fremantle", rockingham: "Rockingham", joondalup: "Joondalup", armadale: "Armadale", kwinana: "Kwinana" };
  function area(m) {
    var id = (m.regions || [])[0]; if (!id) return "";
    if (T().regionName) { try { var n = T().regionName(id); if (n && REG[id] === undefined) return n; } catch (e) {} }
    return REG[id] || String(id).charAt(0).toUpperCase() + String(id).slice(1);
  }
  var FBI = '<svg class="rb-keep" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="currentColor"/><path d="M13.4 19v-6.1h2.1l.3-2.4h-2.4V9c0-.7.2-1.2 1.2-1.2h1.3V5.6c-.2 0-1-.1-1.9-.1-1.9 0-3.1 1.1-3.1 3.2v1.8H8.8v2.4h2.1V19h2.5z" fill="#fff"/></svg>';
  var FBW = '<svg class="rb-keep" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.4 21v-7.6h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.6V21h3.1z" fill="currentColor"/></svg>';
  var G = function (n) { return '<svg class="rb-keep" width="' + n + '" height="' + n + '" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>'; };
  var CHAT = '<svg class="rb-keep" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z"/></svg>';
  var TICK = '<svg class="rb-keep" width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#16A34A"/><path d="m7 12.5 3.2 3L17 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CLOCK = '<svg class="rb-keep" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  var STAR = '<svg class="rb-keep" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>';
  var MEDAL = '<svg class="rb-keep" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/></svg>';

  function rel(m) { return (root.TC12 && TC12.relOf) ? TC12.relOf(m) : ((S()._rel || {})[m.id] || "none"); }
  function reviewed(m) {
    return !!((root.TC12 && TC12.iReviewed && TC12.iReviewed(m)) || (S()._given || {})[m.id] || (S()._reviewedBack || {})[m.id]);
  }
  function needsReview(m) {
    if (reviewed(m)) return false;
    return !!((root.TC12 && TC12.needsMyReview && TC12.needsMyReview(m)) || (S()._they || {})[m.id]);
  }
  function level(m) {
    try { var b = root.TC211 && TC211.badgeOf(m.id); return b && b.current ? b.current : null; } catch (e) { return null; }
  }
  function today(m) {
    var R = root.TCReviews; var n = 0, cap = 3;
    try { if (R) { n = R.countFor(m.id) || 0; cap = R.limit() || 3; } } catch (e) {}
    return { n: n, cap: cap };
  }
  function fbUrl(m) {
    var u = m.facebook || "";
    try { if (root.TCLinks && TCLinks.fromMember) { var L = TCLinks.fromMember(m); if (L && L.facebook) u = L.facebook; } } catch (e) {}
    return u;
  }
  function avatar(m) {
    if (root.TC12 && TC12.av) { try { return TC12.av(m, 52); } catch (e) {} }
    return "";
  }

  function cardB(m, avHtml) {
    var r = rel(m), id = esc(m.id), nm = esc(((m.first || "") + " " + (m.last || "")).trim() || m.name || "");
    var lv = level(m), td = today(m);
    var flags = "";
    if (r === "friends") flags += '<span class="rb-cb-fb">' + FBI + "<span>Facebook Friends</span></span>";
    if (lv) flags += '<span class="rb-cb-lv lv-' + esc(lv.id || String(lv.label).toLowerCase()) + '">' + MEDAL + "<span>" + esc(lv.label) + "</span></span>";
    var chips = "";
    if (r === "none") chips += '<span class="rb-cb-chip n">Not friends yet</span>';
    else if (r === "pending") chips += '<span class="rb-cb-chip a">' + CLOCK + "<span>Request pending</span></span>";
    if (reviewed(m)) chips += '<span class="rb-cb-chip g">' + TICK + "<span>Reviewed</span></span>";
    else if (needsReview(m)) chips += '<span class="rb-cb-chip a">' + STAR + "<span>Needs your review</span></span>";
    chips += meter(td);
    var second;
    if (r === "none") {
      second = '<a class="rb-cb-btn fb" data-action="mark-sent" data-id="' + id + '" href="' + esc(fbUrl(m)) + '" target="_blank" rel="noopener noreferrer">' + FBW + "<span>Add friend</span></a>";
    } else if (r === "pending") {
      second = '<button type="button" class="rb-cb-btn muted" data-action="mark-friends" data-id="' + id + '" aria-label="Friend request pending. Tap once they accept">' + CLOCK + "<span>Pending</span></button>";
    } else if (needsReview(m)) {
      var gl = (root.TC12 && TC12.gLink) ? TC12.gLink(m) : "#";
      second = '<a class="rb-cb-btn soft" data-action="review-back" data-id="' + id + '" href="' + esc(gl) + '" target="_blank" rel="noopener noreferrer">' + G(16) + "<span>Review back</span></a>";
    } else {
      second = '<button type="button" class="rb-cb-btn soft" data-go="member" data-id="' + id + '"><span>View profile</span></button>';
    }
    var msg = '<button type="button" class="rb-cb-btn navy" data-action="open-chat" data-id="' + id + '">' + CHAT + "<span>Message</span></button>";
    return '<div class="card member-card rb-cb" data-member="' + id + '">' +
      '<button type="button" class="rb-cb-top" data-go="member" data-id="' + id + '" aria-label="Open ' + nm + ' profile">' +
        '<span class="rb-cb-av">' + (avHtml || avatar(m)) + "</span>" +
        '<span class="rb-cb-id"><span class="rb-cb-n">' + nm + '</span><span class="rb-cb-s"><span class="rb-cb-t">' + esc(m.trade || "") + "</span>" + (area(m) ? '<span class="rb-cb-d">\u00a0· </span><span class="rb-cb-a">' + esc(area(m)) + "</span>" : "") + "</span></span>" +
        (flags ? '<span class="rb-cb-flags">' + flags + "</span>" : "<span></span>") +
      "</button>" +
      '<div class="rb-cb-chips">' + chips + "</div>" +
      '<div class="rb-cb-row">' + msg + second + "</div>" + /* v2.2.0 r2: Message left, main action right (right-handed, Vishal) */
      "</div>";
  }

  /* V3 "Today ●●○ 2/3" meter chip (Vishal picked Reviews card V3) */
  function meter(td) {
    var k = Math.max(1, Math.min(td.cap || 3, 5)), d = "";
    for (var i = 0; i < k; i++) d += '<i class="rb-cb-dot' + (i < td.n ? " on" : "") + '"></i>';
    return '<span class="rb-cb-chip n rb-cb-meter" aria-label="' + td.n + " of " + td.cap + ' Google Reviews today">' + G(14) + "<span>Today</span>" + d + "<b>" + td.n + "/" + td.cap + "</b></span>";
  }
  function topHtml(m, flags, avHtml, areaTxt) {
    var id = esc(m.id), nm = esc(((m.first || "") + " " + (m.last || "")).trim() || m.name || ""), ar = areaTxt != null ? areaTxt : area(m);
    return '<button type="button" class="rb-cb-top" data-go="member" data-id="' + id + '" aria-label="Open ' + nm + ' profile">' +
        '<span class="rb-cb-av">' + (avHtml || avatar(m)) + "</span>" +
        '<span class="rb-cb-id"><span class="rb-cb-n">' + nm + '</span><span class="rb-cb-s"><span class="rb-cb-t">' + esc(m.trade || "") + "</span>" + (ar ? '<span class="rb-cb-d">\u00a0· </span><span class="rb-cb-a">' + esc(ar) + "</span>" : "") + "</span></span>" +
        (flags ? '<span class="rb-cb-flags">' + flags + "</span>" : "<span></span>") +
      "</button>";
  }
  var BELL = '<svg class="rb-keep" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/></svg>';
  function reviewOld() {
    if (root.RB_REVIEW_CARD === "old") return true;
    try { return localStorage.getItem("rb_review_card") === "old"; } catch (e) { return false; }
  }
  /* Google Reviews tab card, V3 (Vishal picked V3, buttons swapped: Message left, action right).
     o = { st: "full"|"already"|"given"|"pending"|"", av: bool, friend: bool, area: string, avHtml: string } */
  function reviewCard(m, o) {
    o = o || {}; var id = esc(m.id), lv = level(m), td = today(m), st = o.st || "";
    var flags = "";
    if (o.friend) flags += '<span class="rb-cb-fb">' + FBI + "<span>Facebook Friends</span></span>";
    if (lv) flags += '<span class="rb-cb-lv lv-' + esc(lv.id || String(lv.label).toLowerCase()) + '">' + MEDAL + "<span>" + esc(lv.label) + "</span></span>";
    var chip, act;
    var muted = function (ic, t, extra) { return '<span class="rb-cb-btn muted" role="note"' + (extra || "") + ">" + ic + "<span>" + t + "</span></span>"; };
    if (st === "full") { chip = '<span class="rb-cb-chip a">' + CLOCK + "<span>Daily limit reached</span></span>";
      act = '<button type="button" class="rb-cb-btn muted" data-action="rb-remind-me" data-id="' + id + '" aria-label="Daily limit reached. Remind Me">' + BELL + "<span>Remind Me</span></button>"; }
    else if (st === "already") { chip = '<span class="rb-cb-chip g">' + TICK + "<span>Review Swapped</span></span>"; act = muted(TICK, "Reviewed"); }
    else if (st === "given") { chip = '<span class="rb-cb-chip g">' + TICK + "<span>Reviewed</span></span>"; act = muted(TICK, "Reviewed"); }
    else if (st === "pending") { chip = '<span class="rb-cb-chip a">' + CLOCK + "<span>Review Requested</span></span>"; act = muted(CLOCK, "Requested"); }
    else if (!o.av) { chip = '<span class="rb-cb-chip n"><span>Not available</span></span>'; act = '<button type="button" class="rb-cb-btn soft" data-go="member" data-id="' + id + '"><span>View profile</span></button>'; }
    else if (!o.friend) { chip = '<span class="rb-cb-chip n"><span>Not friends yet</span></span>';
      act = '<a class="rb-cb-btn fb" href="' + esc(fbUrl(m) || "#") + '" target="_blank" rel="noopener noreferrer">' + FBW + "<span>Add friend</span></a>"; }
    else { chip = '<span class="rb-cb-chip a">' + STAR + "<span>Needs your review</span></span>";
      act = '<button type="button" class="rb-cb-btn soft" data-action="rb-leave" data-id="' + id + '">' + G(16) + "<span>Leave Review</span></button>"; }
    var msg = '<button type="button" class="rb-cb-btn navy" data-action="open-chat" data-id="' + id + '">' + CHAT + "<span>Message</span></button>";
    queueFit();
    return '<div class="rb-cb rb-rv" data-member="' + id + '">' + topHtml(m, flags, o.avHtml, o.area) +
      '<div class="rb-cb-chips">' + chip + meter(td) + "</div>" +
      '<div class="rb-cb-row">' + msg + act + "</div></div>";
  }

  function wrapB(prev) {
    return function (m) {
      if (oldOn()) return prev.apply(this, arguments);
      /* reuse the avatar markup the old card renders (same trade icon + online dot) */
      var av = "";
      try { var mm = /<div class="avatar[\s\S]*?<\/div>/.exec(prev.apply(this, arguments)); if (mm) av = mm[0]; } catch (e) {}
      queueFit();
      return cardB(m, av);
    };
  }
  /* Other layers (v15, v154) assign/wrap TC12.memberCard after us; keep B outermost with an accessor. */
  function install() {
    if (!root.TC12 || TC12._circleB) return !!(root.TC12 && TC12._circleB);
    var inner = TC12.memberCard || function () { return ""; };
    var outer = wrapB(function () { return inner.apply(this, arguments); });
    try {
      Object.defineProperty(TC12, "memberCard", {
        configurable: true, enumerable: true,
        get: function () { return outer; },
        set: function (fn) { if (fn && fn !== outer) inner = fn; }
      });
    } catch (e) { TC12.memberCard = outer; }
    TC12._circleB = 1;
    /* the first screen can be painted before this file loads: repaint the Circle list in place (no navigation) */
    function repaint() {
      try { var sc0 = document.querySelector(".screen.active"); if (sc0 && sc0.querySelector(".rb-mrow2") && !reviewOld() && T().go && S().screen) T().go(S().screen); } catch (eR) {}
      if (oldOn()) return;
      var box = document.querySelector(".screen #memberList");
      if (!box || !box.querySelector(".member-card:not(.rb-cb)") || !T().filteredMembers) return;
      var list = T().filteredMembers();
      if (list.length) box.innerHTML = list.map(function (m) { return TC12.memberCard(m); }).join("");
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(repaint, 0); });
    else setTimeout(repaint, 0);
    return true;
  }
  if (!install()) {
    var tries = 0, t = setInterval(function () { if (install() || ++tries > 40) clearInterval(t); }, 50);
  }
  /* Add friend opens Facebook in a new tab; refresh the card so it shows Request pending straight away */
  window.addEventListener("click", function (e) {
    var a = e.target && e.target.closest && e.target.closest(".rb-cb [data-action='mark-sent']");
    if (!a) return;
    setTimeout(function () {
      var box = document.querySelector(".screen.active #memberList");
      if (!box || oldOn() || !T().filteredMembers) return;
      var list = T().filteredMembers();
      box.innerHTML = list.length ? list.map(function (m) { return TC12.memberCard(m); }).join("") : box.innerHTML;
      var cl = document.querySelector(".screen.active .count-line");
      if (cl) cl.textContent = cl.textContent.replace(/^\d+/, String(list.length));
    }, 450);
  }, true);
  /* trade · area: if it can't fit on one line beside the badges (narrow phone + large text), show trade and area on
     two lines without the dot, and shrink a little (min 11px) only if a single word still doesn't fit. */
  function broken(el) {
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n, bad = false;
    while ((n = w.nextNode()) && !bad) { var re = /\S+/g, mt; while ((mt = re.exec(n.data))) { var r = document.createRange(); r.setStart(n, mt.index); r.setEnd(n, mt.index + mt[0].length);
      var rs = Array.prototype.filter.call(r.getClientRects(), function (q) { return q.width > 0; }); if (rs.length > 1 && Math.abs(rs[0].top - rs[rs.length - 1].top) > 2) { bad = true; break; } } }
    return bad;
  }
  function fitSubs() {
    document.querySelectorAll(".screen.active .rb-cb .rb-cb-s").forEach(function (s) {
      s.classList.remove("rb-cb-s2"); s.style.removeProperty("font-size");
      var lh = parseFloat(getComputedStyle(s).lineHeight) || 18;
      if (s.getBoundingClientRect().height < lh * 1.5) return;
      if (s.querySelector(".rb-cb-a")) s.classList.add("rb-cb-s2");
      var px = 13.5, g = 0; while (broken(s) && px > 11 && g++ < 10) { px -= 0.5; s.style.setProperty("font-size", px + "px", "important"); }
    });
  }
  var fitT = [];
  function queueFit() { fitT.forEach(clearTimeout); fitT = [40, 300, 900, 1800].map(function (ms) { return setTimeout(fitSubs, ms); }); }
  window.addEventListener("resize", queueFit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueFit);
  try { var og = T().go; if (og && !og.__rbcb) { var ng = function () { var r = og.apply(this, arguments); queueFit(); return r; }; ng.__rbcb = 1; Object.keys(og).forEach(function (k) { ng[k] = og[k]; }); T().go = ng; } } catch (eG) {}
  root.TCCircleB = { cardB: cardB, install: install, fit: fitSubs, reviewCard: reviewCard, reviewOld: reviewOld };
})(window);
