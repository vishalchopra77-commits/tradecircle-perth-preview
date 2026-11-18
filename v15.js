/* TradeCircle Perth — prototype v1.6.2 */
(function () {
  "use strict";

  function T() { return window.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function esc(s) { return T().escapeText ? T().escapeText(s) : String(s == null ? "" : s); }
  function esa(s) { return T().escapeAttr ? T().escapeAttr(s) : String(s == null ? "" : s).replace(/"/g, "&quot;"); }
  function ico(n) { return T().icon ? T().icon(n) : ""; }
  function av(m, n) { return T().avatarHTML(m, n); }
  function fn(m) { return T().fullName(m); }
  function toast(m) { if (T().toast) T().toast(m); }
  function go(id, mid) { T().go(id, mid); }
  function member(id) {
    return (T().MEMBERS || []).find(function (m) { return m.id === id; }) || T().me();
  }

  function svg(p, w) {
    w = w || 18;
    return '<svg viewBox="0 0 24 24" width="' + w + '" height="' + w + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + p + "</svg>";
  }
  var I = {
    mic: svg('<path d="M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3z"/><path d="M19 11a7 7 0 01-14 0"/><path d="M12 18v3"/>', 26),
    spark: svg('<path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8z"/>'),
    send: svg('<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>'),
    link: svg('<path d="M10 13a5 5 0 007.07 0l2-2a5 5 0 00-7.07-7.07l-1.2 1.2"/><path d="M14 11a5 5 0 00-7.07 0l-2 2a5 5 0 007.07 7.07l1.2-1.2"/>'),
    copy: svg('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 012-2h10"/>'),
    check: svg('<path d="M5 12l5 5L20 7"/>'),
    star: svg('<path d="M12 3l2.6 5.4L20 9.3l-4 3.9.9 5.5L12 16.2 7.1 18.7 8 13.2 4 9.3l5.4-.9z"/>'),
    bell: svg('<path d="M18 8A6 6 0 106 8c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21a2 2 0 004 0"/>'),
    queue: svg('<path d="M4 6h16M4 12h16M4 18h10"/>'),
    mega: svg('<path d="M3 10v4h4l6 4V6L7 10H3z"/><path d="M16.8 8.2a4.2 4.2 0 010 7.6"/><path d="M18.7 5.6a8 8 0 010 12.8"/>'),
    gear: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1A1.7 1.7 0 009 19.4a1.7 1.7 0 00-1.82.33l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.7 1.7 0 004.68 15a1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1A1.7 1.7 0 004.6 9a1.7 1.7 0 00-.33-1.82l-.1-.1a2 2 0 112.8-2.8l.1.1A1.7 1.7 0 009 4.68a1.7 1.7 0 001-1.51V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.51 1.7 1.7 0 001.82-.33l.1-.1a2 2 0 112.8 2.8l-.1.1A1.7 1.7 0 0019.4 9V9c.3.6.9 1 1.6 1.1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>'),
    user: svg('<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0114 0"/>'),
    cam: svg('<path d="M4 8h3l2-3h6l2 3h3v11H4V8z"/><circle cx="12" cy="13" r="3.2"/>'),
    image: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="M21 16l-5-5-9 9"/>'),
    file: svg('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/>'),
    smile: svg('<circle cx="12" cy="12" r="9"/><path d="M8 10h.01M16 10h.01M8.5 15a5 5 0 007 0"/>'),
    fb: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg>',
    chat: svg('<path d="M21 12a8 8 0 01-8 8H7l-4 3V12a8 8 0 018-8h2a8 8 0 018 8z"/>'),
    open: svg('<path d="M14 5h5v5"/><path d="M19 5L10 14"/><path d="M5 10v9h9"/>')
  };

function googleG(size, mono) {
    size = size || 18;
    if (mono) {
      return '<svg class="g-ico" viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09zM12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23zM5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84zM12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
    }
    return '<svg class="g-ico g-color" viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
  }
  I.g = googleG(18);
  I.gMono = googleG(18, true);
  function facebookF(size, color) {
    size = size || 18;
    return '<svg class="f-ico" viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="' + (color || 'currentColor') + '" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg>';
  }
  I.fLogo = facebookF(18);
  function gLink(m) {
    var name = encodeURIComponent((m && m.business) || "Business");
    return "https://www.google.com/search?q=" + name + "+Perth+reviews";
  }
  function tradeAsk(trade) {
    var t = String(trade || "").trim();
    var map = {
      "Pest Control": "a pest controller",
      "Air Conditioning": "an air conditioning technician",
      "HVAC Technician": "an HVAC technician",
      "End of Lease Cleaner": "an end-of-lease cleaner"
    };
    if (map[t]) return map[t];
    var lower = t.toLowerCase();
    if (/(er|or|ist|ian|man|person|technician)$/i.test(t.replace(/\s/g,"")) || /(er|or|ist|ian|man|person|technician)$/i.test(t)) {
      return (/^[aeiou]/i.test(lower) ? "an " : "a ") + lower;
    }
    return "a " + lower + " professional";
  }

  var rel = {};
  var given = {};
  var they = {};
  function bootRel() {
    if (window.TC12) {
      /* statuses live in v12 closures; use DOM-free copies kept on S() */
    }
    rel = S()._rel || rel;
    given = S()._given || given;
    they = S()._they || they;
  }
  /* Seed from the same demo relationships v12 uses */
  var SEED_REL = { sarah: "friends", liam: "pending", priya: "friends", jack: "friends", mei: "none", daniel: "pending", emma: "friends", marcus: "none", tom: "friends", hannah: "none", chris: "friends", noah: "friends" };
  var SEED_GIVEN = { sarah: 1, priya: 1, chris: 1 };
  var SEED_THEY = { sarah: 1, jack: 1, chris: 1, tom: 1 };
  if (!S()._rel) S()._rel = Object.assign({}, SEED_REL);
  if (!S()._given) S()._given = Object.assign({}, SEED_GIVEN);
  if (!S()._they) S()._they = Object.assign({}, SEED_THEY);
  if (!S()._reviewedBack) S()._reviewedBack = { sarah: 1, chris: 1 };
  rel = S()._rel; given = S()._given; they = S()._they;
  function relOf(m) { return (S()._rel || {})[m.id] || "none"; }
  function iReviewed(m) { return !!(S()._given || {})[m.id]; }
  function theyReviewed(m) { return !!(S()._they || {})[m.id]; }
  function reviewedBack(m) { return !!(S()._reviewedBack || {})[m.id]; }

  function topbar(title, right) {
    var n = (window.TC12 && TC12.unreadTotal) ? TC12.unreadTotal() : 0;
    var bn = (window.TC12 && TC12.notifUnread) ? TC12.notifUnread() : 0;
    var chatDot = n ? '<span class="bell-dot" id="headerChatBadge">' + n + "</span>" : '<span class="bell-dot" id="headerChatBadge" hidden></span>';
    var bellDot = bn ? '<span class="bell-dot">' + bn + "</span>" : "";
    return '<div class="app-header">' +
      '<div class="header-left"><button class="icon-btn" data-action="open-drawer" aria-label="Open menu">' + svg('<path d="M4 7h16M4 12h16M4 17h16"/>', 20) + "</button></div>" +
      '<div class="ht">' + title + "</div>" +
      '<div class="header-right">' + (right || "") +
      '<button class="icon-btn bell-btn" data-go="chats" aria-label="Chats">' + I.chat + chatDot + "</button>" +
      '<button class="icon-btn bell-btn" data-go="notifications" aria-label="Notifications">' + I.bell + bellDot + "</button>" +
      "</div></div>";
  }

  function friendButton(m, size) {
    var r = relOf(m);
    var sm = size === "sm" ? " sm" : "";
    if (r === "friends") {
      return '<button type="button" class="friend-btn friends' + sm + '" data-action="open-fb" data-id="' + m.id + '">' + I.fb + "<span>Friends \u2713</span></button>";
    }
    if (r === "pending") {
      return '<button type="button" class="friend-btn sent' + sm + '" data-action="mark-friends" data-id="' + m.id + '"><span>Request sent</span></button>';
    }
    return '<a class="friend-btn' + sm + '" data-action="mark-sent" data-id="' + m.id + '" href="' + esa(m.facebook) + '" target="_blank" rel="noopener noreferrer">' +
      ico("addfriend") + "<span>Add friend</span></a>";
  }

  function memberCard(m) {
    var actions = '<div class="card-actions">' + friendButton(m, "sm") +
      '<button type="button" class="msg-btn sm" data-action="open-chat" data-id="' + m.id + '">' + I.chat + "<span>Message</span></button></div>";
    var back = "";
    if (theyReviewed(m) && !iReviewed(m) && !reviewedBack(m)) {
      back = '<button type="button" class="slim-cta" data-action="review-back" data-id="' + m.id + '">' + googleG(16) + " Review back</button>";
    } else if (theyReviewed(m) && (iReviewed(m) || reviewedBack(m))) {
      back = '<div class="reviewed-tick">' + I.check + " Reviewed \u2713</div>";
    }
    var icons = (window.TC12 && TC12.memberCard) ? "" : "";
    /* Reuse v12 status icons by calling into a temporary? We recreate a slim icon row via existing DOM classes. */
    var status = "";
    if (window.TC12) {
      /* Keep icons: reconstruct using same classes as v12 */
      var r = relOf(m);
      var fb = r === "friends" ? "sb-friends" : r === "pending" ? "sb-pending" : "sb-none";
      var fl = r === "friends" ? "Facebook friends" : r === "pending" ? "Friend request pending" : "Not connected on Facebook";
      status = '<div class="sb-row"><span class="sb ' + fb + '" role="img" aria-label="' + fl + '" title="' + fl + '">' + I.fb + "</span>";
      if (iReviewed(m) || reviewedBack(m)) status += '<span class="sb sb-you" role="img" aria-label="You reviewed them" title="You reviewed them">' + googleG(13, true) + "</span>";
      else if (theyReviewed(m)) status += '<span class="sb sb-need" role="img" aria-label="Needs your review" title="Needs your review">' + googleG(13, true) + "</span>";
      if (theyReviewed(m)) status += '<span class="sb sb-they" role="img" aria-label="They reviewed you" title="They reviewed you">' + googleG(13, true) + "</span>";
      status += "</div>";
    }
    return '<div class="card member-card">' +
      '<button type="button" class="member-main" data-go="member" data-id="' + m.id + '">' +
      av(m, 52) +
      '<div class="meta"><div class="nm">' + esc(fn(m)) + "</div>" +
      '<div class="biz">' + esc(m.business) + "</div>" +
      '<div class="tags"><span class="pill t-pill">' + esc(m.trade) + "</span></div>" +
      status + back +
      "</div></button>" + actions + "</div>";
  }

  function reviewBackBanner(m, compact) {
    if (!theyReviewed(m)) return "";
    if (iReviewed(m) || reviewedBack(m)) {
      return '<div class="review-back-banner"><div>' + I.check + '</div><div><p>' + esc(m.first) + " left you a Google review.</p>" +
        '<div class="reviewed-tick">Reviewed \u2713</div></div></div>';
    }
    return '<div class="review-back-banner"><div>' + googleG(18) + "</div><div><p>" + esc(m.first) + " left you a Google review.</p>" +
      '<a class="btn-review-back" href="' + esa(gLink(m)) + '" target="_blank" rel="noopener noreferrer" data-action="review-back" data-id="' + m.id + '">' +
      googleG(16) + "<span>Review back</span></a></div></div>";
  }

  /* ---------- Recommendation alerts (fictional) ---------- */
  function alerts() {
    if (!S()._alerts) {
      S()._alerts = [
        {
          id: "a1",
          link: "https://www.facebook.com/groups/perth.homeowners.demo/posts/840211",
          trade: "Pest Control",
          by: "jamie",
          ask: "Someone in the Hills Facebook group is asking for a pest controller this week.",
          status: "open",
          helped: ["sarah", "mei"],
          ideas: [
            "I have used Vishal at Hale Pest Control in the Hills and would recommend getting in touch.",
            "Hale Pest Control looked after a termite check for us in Midland. Happy to recommend from that job.",
            "If you want a local Hills pest controller, I can vouch for Vishal from work I have actually seen."
          ]
        },
        {
          id: "a2",
          link: "https://www.facebook.com/groups/joondalup.renos.demo/posts/119004",
          trade: "Plumber",
          by: "emma",
          ask: "A Joondalup page asked for a plumber for a leaking hot water system.",
          status: "handled",
          helped: ["liam", "chris"],
          ideas: [
            "We used O’Connor Plumbing for a leak in Fremantle and they were easy to deal with.",
            "If you need a plumber in the northern suburbs, I can recommend Liam from a job I was on."
          ]
        }
      ];
    }
    return S()._alerts;
  }
  function alertById(id) {
    return alerts().find(function (a) { return a.id === id; }) || alerts()[0];
  }

  /* ---------- Promotion queue (fictional) ---------- */
  function queue() {
    if (!S()._queue) {
      S()._queue = [
        { id: "q1", memberId: "priya", when: "Mon", paid: false },
        { id: "q2", memberId: "tom", when: "Tue", paid: false },
        { id: "q3", memberId: "mei", when: "Wed", paid: false },
        { id: "q4", memberId: "jamie", when: "Thu", paid: false, mine: true },
        { id: "q5", memberId: "hannah", when: "Fri", paid: false }
      ];
    }
    return S()._queue;
  }


  function queueWaitDays(placeNum) {
    placeNum = Number(placeNum) || 0;
    if (placeNum <= 1) return 0;
    return (placeNum - 1) * 2;
  }
  function queueWaitPhrase(placeNum) {
    var d = queueWaitDays(placeNum);
    if (!d) return "Your turn is now";
    return "about " + d + " days";
  }
  window.TCQueueWait = { days: queueWaitDays, phrase: queueWaitPhrase };
  function myQueuePlace() {
    var q = queue();
    var mine = 0;
    q.forEach(function (row, i) { if (row.memberId === "jamie") mine = i + 1; });
    return { q: q, mine: mine, total: q.length };
  }
  function fbSegment(which) {
    var p = myQueuePlace();
    var place = p.mine ? ("Your place #" + p.mine) : "Request a turn";
    var circleOn = which === "circle";
    var recOn = which === "recommend";
    var queueOn = which === "queue";
    var pending = (window.TC159 && TC159.pendingCount) ? TC159.pendingCount() : 2;
    var recSub = pending
      ? '<span class="fb-seg-place"><span class="fb-seg-badge">' + pending + "</span> to do</span>"
      : '<span class="fb-seg-place">All done</span>';
    return '<div class="fb-seg-bar" role="tablist" aria-label="Facebook sections">' +
      '<div class="fb-seg fb-seg-3">' +
      '<button type="button" role="tab" class="fb-seg-btn' + (circleOn ? " active" : "") + '" data-go="members" aria-selected="' + (circleOn ? "true" : "false") + '">' +
      '<span class="fb-seg-lab">Circle</span></button>' +
      '<button type="button" role="tab" class="fb-seg-btn' + (recOn ? " active" : "") + '" data-go="fb-recommend" aria-selected="' + (recOn ? "true" : "false") + '">' +
      '<span class="fb-seg-lab">Recommend</span>' + recSub + "</button>" +
      '<button type="button" role="tab" class="fb-seg-btn' + (queueOn ? " active" : "") + '" data-go="promo-queue" aria-selected="' + (queueOn ? "true" : "false") + '">' +
      '<span class="fb-seg-lab">Queue</span>' +
      '<span class="fb-seg-place">' + esc(place) + "</span></button>" +
      "</div></div>";
  }
  function withFbSeg(html, which) {
    if (!html) return html;
    html = html.replace('class="screen has-tabs has-header"', 'class="screen has-tabs has-header has-fb-seg"');
    html = html.replace('<div class="ht">Members</div>', '<div class="ht">Facebook</div>');
    html = html.replace('<div class="ht">Facebook promotion queue</div>', '<div class="ht">Facebook</div>');
    html = html.replace('<div class="ht">Recommend</div>', '<div class="ht">Facebook</div>');
    if (html.indexOf("fb-seg-bar") === -1) {
      html = html.replace('<div class="scroll">', fbSegment(which) + '<div class="scroll">');
    }
    return html;
  }
  function homePromoBlock() {
    var p = myQueuePlace();
    var sub = p.mine
      ? "You’re number " + p.mine + " of " + p.total + " in the Facebook promotion queue"
      : "Request a free turn in the Facebook promotion queue";
    var cta = p.mine ? "View queue" : "Request a turn";
    return '<button type="button" class="home-promo" data-go="promo-queue">' +
      '<span class="home-promo-ico">' + facebookF(18) + "</span>" +
      '<span class="home-promo-body"><strong>Your turn to promote</strong><span>' + esc(sub) + "</span></span>" +
      '<span class="home-promo-cta">' + cta + "</span></button>";
  }
  function meToolRows() {
    var p = myQueuePlace();
    var qSub = p.mine ? "You’re number " + p.mine + " in the queue" : "Request a free turn";
    function row(go, ico, color, title, sub) {
      return '<button class="set-row" type="button" data-go="' + go + '"><span class="ic" style="' + color + '">' + ico + '</span><span class="lab"><span class="a">' + title + '</span><span class="b">' + sub + '</span></span><span class="chev">' + icoWait("chev") + "</span></button>";
    }
    function icoWait(n) { return (T().icon ? T().icon(n) : ""); }
    return '<p class="group-label">Circle tools</p><div class="card group me-tools">' +
      row("promo-queue", facebookF(18), "background:linear-gradient(180deg,#24E0A6,#0FBE86);color:#05281C", "Facebook promotion queue", qSub) +
      row("rec-alerts", I.bell, "background:#FFF6E0;color:#8A5A00", "Recommendation alerts", "Help the circle comment on a post") +
      row("ai-assistant", I.spark, "background:#EEF2F6;color:#0B1F33", "AI assistant", "Voice commands while you drive") +
      "</div>";
  }
  function renderMore() {
    var m = T().me && T().me();
    var tiles = [
      ["For you", [
        ["me", I.user, "teal", "My profile"],
        ["promo-queue", facebookF(18), "navy", "Promo queue"],
        ["rec-alerts", I.bell, "amber", "Alerts"],
        ["ai-assistant", I.spark, "moss", "AI assistant"],
        ["my-regions", I.queue, "steel", "Your areas"],
        ["reviews", googleG(18), "amber", "Reviews"],
        ["chats", I.chat, "navy", "Chat"],
        ["members", I.fb.indexOf("<svg") === 0 ? I.user : I.user, "teal", "Facebook"]
      ]],
      ["Account", [
        ["settings", I.gear, "steel", "Settings"],
        ["notifications", I.bell, "amber", "Notifications"],
        ["subscription", I.star, "navy", "Subscription"],
        ["invite", I.send, "teal", "Invite"],
        ["help", I.spark, "moss", "Help"],
        ["welcome", I.open, "rose", "Sign out"]
      ]]
    ];
    var q = (S()._moreQuery || "").trim().toLowerCase();
    function grid(list) {
      var shown = list.filter(function (it) { return !q || it[3].toLowerCase().indexOf(q) >= 0; });
      if (!shown.length) return "";
      return '<div class="apps-grid">' + shown.map(function (it) {
        return '<button type="button" class="apps-tile" data-go="' + it[0] + '"><span class="apps-ico ' + it[2] + '">' + it[1] + "</span><span>" + it[3] + "</span></button>";
      }).join("") + "</div>";
    }
    var body = tiles.map(function (sec) {
      var g = grid(sec[1]);
      if (!g) return "";
      return '<div class="apps-section"><h3>' + sec[0] + "</h3>" + g + "</div>";
    }).join("");
    if (!body) body = '<p class="apps-empty">No matches for that search.</p>';
    return '<section class="screen has-tabs has-header" data-screen="more">' + topbar("More") +
      '<div class="scroll"><div class="more-head"><h2>More</h2></div>' +
      '<div class="search-wrap"><div class="search">' + ico("search") +
      '<input id="moreSearch" type="search" placeholder="Search the menu" value="' + esa(S()._moreQuery || "") + '" autocomplete="off"></div></div>' +
      (m ? '<button type="button" class="more-profile" data-go="me">' + av(m, 48) +
        '<div style="flex:1;min-width:0;text-align:left"><div class="nm">' + esc(fn(m)) + '</div><div class="sub">View your profile</div></div>' +
        (T().icon ? T().icon("chev") : "") + "</button>" : "") +
      body + "</div></section>";
  }


  function greetName() {
    var h = new Date().getHours();
    var hi = (h >= 5 && h < 12) ? "Good morning" : (h >= 12 && h < 17) ? "Good afternoon" : (h >= 17 && h < 21) ? "Good evening" : "Hello";
    var m = T().me && T().me();
    return { hi: hi, first: m ? (m.first || fn(m).split(" ")[0]) : "Jamie", biz: m ? m.business : "Hale Pest Control", m: m };
  }
  function renderHome() {
    bootRel();
    var g = greetName();
    var me = (T().me && T().me()) || { id: "jamie" };
    var friends = 0;
    var pending = [];
    Object.keys(rel || {}).forEach(function (id) {
      if (rel[id] === "friends") friends++;
      if (rel[id] === "pending") pending.push(id);
    });
    var recd = Object.keys(they || {}).filter(function (id) { return they[id]; }).length;
    var gave = Object.keys(given || {}).filter(function (id) { return given[id]; }).length;
    var place = myQueuePlace();
    var cap = (window.TCReviews && TCReviews.limit) ? TCReviews.limit() : 3;
    var today = (window.TCReviews && TCReviews.countFor) ? TCReviews.countFor(me.id) : 0;
    var locked = (window.TCReviews && TCReviews.atLimit) ? TCReviews.atLimit(me.id) : false;

    var backs = [];
    Object.keys(they || {}).forEach(function (id) {
      if (they[id] && !reviewedBack({ id: id })) {
        var mm = member(id);
        if (mm) backs.push(mm);
      }
    });

    var openAlert = (alerts() || []).find(function (a) { return a.status === "open"; });
    var unread = (window.TC12 && TC12.unreadTotal) ? TC12.unreadTotal() : 0;
    var recents = (window.TC12 && TC12.recentChats) ? TC12.recentChats(3) : [];

    function ovStat(label, value, color, icon) {
      return '<div class="dash-tile ov-tile ' + color + '">' +
        '<div class="dash-tile-ico">' + icon + "</div>" +
        '<div class="n">' + value + "</div>" +
        '<div class="l">' + label + "</div></div>";
    }

    var googleBody = '<div class="ov-stats">' +
      ovStat("Received", String(recd), "amber", googleG(16)) +
      ovStat("Given", String(gave), "navy", googleG(16)) +
      "</div>";
    if (locked) {
      googleBody += '<div class="ov-lock">' +
        '<strong>Daily limit reached: ' + today + " of " + cap + " today</strong>" +
        '<span>Opens tomorrow' + (window.TCReviews && TCReviews.opensInLabel ? " · " + TCReviews.opensInLabel() : "") + "</span></div>";
    } else {
      googleBody += '<div class="ov-cap">Reviews on your listing today: <strong>' + today + " of " + cap + "</strong></div>";
    }
    if (backs.length) {
      googleBody += '<p class="ov-subhead">Review back</p>' + backs.map(function (mm) {
        var atCap = window.TCReviews && TCReviews.atLimit && TCReviews.atLimit(mm.id);
        var btn = atCap
          ? '<span class="ov-pill locked">Locked today</span>'
          : '<button type="button" class="dash-attn-btn" data-action="review-back" data-id="' + mm.id + '">Review back</button>';
        return '<div class="dash-attn ov-attn">' + av(mm, 36) +
          '<div class="dash-attn-body"><strong>' + esc(fn(mm)) + '</strong><span>left you a Google review</span></div>' +
          btn + "</div>";
      }).join("");
    } else {
      googleBody += '<p class="ov-empty">No review-backs waiting.</p>';
    }

    var nextTurn = place.mine
      ? ("Your turn is in " + queueWaitPhrase(place.mine) + ", at one post every couple of days.")
      : "Request a free turn when you are ready.";
    var fbBody = '<div class="ov-stats">' +
      ovStat("Queue place", place.mine ? "#" + place.mine + " of " + place.total : "—", "fb", facebookF(16)) +
      ovStat("Circle in queue", String(place.total), "navy", facebookF(16)) +
      "</div>" +
      '<div class="ov-note-line">' + esc(nextTurn) + "</div>";
    if (openAlert) {
      fbBody += '<button type="button" class="ov-item" data-action="open-alert" data-id="' + openAlert.id + '">' +
        '<span class="ov-item-ico amber">' + I.bell + "</span>" +
        '<span class="ov-item-body"><strong>Pending comment</strong><span>Someone’s asking for ' + esc(tradeAsk(openAlert.trade)) + ". Comment in your own words when you can.</span></span></button>";
    } else {
      fbBody += '<div class="ov-note-line">No recommendation alerts waiting for a comment.</div>';
    }
    fbBody += '<div class="ov-note-line faint">Last promotion: 14 comments on your business post.</div>';

    function clip(t, n) {
      t = String(t || "").replace(/\s+/g, " ").trim();
      if (t.length <= n) return t;
      return t.slice(0, n - 1) + "…";
    }
    var chatN = (window.TC12 && TC12.chatCount) ? TC12.chatCount() : recents.length;
    var msgBody = '<div class="ov-stats">' +
      ovStat("Unread", String(unread), "teal", I.chat) +
      ovStat("Chats", String(chatN), "teal-deep", I.chat) +
      "</div>";
    if (!unread) msgBody += '<div class="ov-note-line faint">You’re up to date on messages.</div>';
    if (recents.length) {
      msgBody += recents.map(function (c) {
        var isGroup = c.type === "group";
        var mm = isGroup ? null : member(c.memberId);
        var name = isGroup ? (c.name || "Group") : (mm ? fn(mm) : "Member");
        var avHtml = isGroup
          ? '<div class="ov-av-g">' + (c.id === "grp-north" ? "N" : "H") + "</div>"
          : av(mm, 36);
        var prev = clip(c.preview, 48);
        return '<button type="button" class="ov-msg" data-action="open-thread" data-chat="' + c.id + '">' +
          avHtml +
          '<div class="ov-msg-meta"><div class="nm">' + esc(name) + "</div>" +
          '<div class="prev">' + esc(prev) + "</div></div>" +
          '<div class="when">' + esc(c.when || "") + (c.unread ? '<span class="ub">' + c.unread + "</span>" : "") + "</div></button>";
      }).join("");
    } else {
      msgBody += '<p class="ov-empty">No conversations yet.</p>';
    }

    var frBody = '<div class="ov-stats">' +
      ovStat("Friends", String(friends), "teal", I.user) +
      ovStat("Pending", String(pending.length), "green-deep", I.user) +
      "</div>";
    if (pending.length) {
      frBody += '<p class="ov-subhead">Pending requests</p>' + pending.map(function (id) {
        var mm = member(id);
        if (!mm) return "";
        return '<button type="button" class="ov-item" data-go="member" data-id="' + mm.id + '">' +
          av(mm, 36) +
          '<span class="ov-item-body"><strong>' + esc(fn(mm)) + '</strong><span>Friend request pending</span></span></button>';
      }).join("");
    } else {
      frBody += '<p class="ov-empty">No pending friend requests.</p>';
    }

    function card(mod, icon, title, body, goTo, cta) {
      return '<section class="ov-card ov-' + mod + '">' +
        '<div class="ov-head"><span class="ov-ico">' + icon + "</span><h2>" + title + "</h2></div>" +
        body +
        '<button type="button" class="ov-cta" data-go="' + goTo + '">' + cta + "</button></section>";
    }

    var actions = [
      ["rec-compose", I.send, "teal", "Send alert"],
      ["promo-queue", facebookF(18), "navy", place.mine ? "View the queue" : "Request a turn"],
      ["ai-assistant", I.spark, "moss", "AI assistant"],
      ["invite", I.send, "amber", "Invite"]
    ];
    var actHtml = '<div class="dash-actions">' + actions.map(function (a) {
      return '<button type="button" class="dash-action" data-go="' + a[0] + '"><span class="apps-ico ' + a[2] + '">' + a[1] + "</span><span>" + a[3] + "</span></button>";
    }).join("") + "</div>";

    var feed = [
      ["review", "Hannah Lewis left a Google review for Hale Pest Control.", "Friday 6:30 pm"],
      ["alert", "You marked a recommendation alert as commented.", "Yesterday 11:20 am"],
      ["queue", "Tom Reeves jumped the Facebook promotion queue (price to be set).", "Saturday 10:12 am"],
      ["admin", "Emma Brooks was approved and joined the circle.", "Yesterday 4:20 pm"],
      ["limit", "Thompson Electrical reached the daily Google review limit (3 of 3).", "Today 8:02 am"]
    ];
    var feedHtml = feed.map(function (f) {
      var tile = (window.notifTile ? window.notifTile(f[0], 16) : '<div class="feed-dot ' + f[0] + '"></div>');
      return '<div class="dash-feed-item">' + tile + '<div><p>' + esc(f[1]) + "</p><span>" + esc(f[2]) + "</span></div></div>";
    }).join("");

    return '<section class="screen has-tabs has-header" data-screen="home">' + topbar("Home") +
      '<div class="scroll"><div class="dash-hello">' +
      (g.m ? av(g.m, 56) : "") +
      "<div><p class=\"dash-greet\">" + esc(g.hi) + ", " + esc(g.first) + "</p><p class=\"dash-biz\">" + esc(g.biz) + "</p></div></div>" +
      card("google", googleG(18), "Google reviews", googleBody, "reviews", "Open Reviews") +
      card("facebook", facebookF(18), "Facebook", fbBody, "promo-queue", "View the queue") +
      card("messages", I.chat, "Messages", msgBody, "chats", "Open chats") +
      card("friends", I.user, "Friends", frBody, "members", "Open Facebook") +
      '<p class="group-label">Quick actions</p>' + actHtml +
      '<p class="group-label">Recent activity</p>' +
      '<div class="dash-feed">' + feedHtml + "</div></div></section>";
  }

  /* ---------- Screens ---------- */
  function renderAI() {
    var connected = S().aiProvider || "grok";
    function card(id, label, sub, color, letter) {
      var on = connected === id;
      return '<button type="button" class="connect-card' + (on ? " on" : "") + '" data-action="ai-connect" data-provider="' + id + '">' +
        '<span class="mark" style="background:' + color + '">' + letter + "</span>" +
        "<span style=\"flex:1;min-width:0;text-align:left\"><strong>" + label + "</strong><div class=\"hint\" style=\"margin:0\">" + sub + "</div></span>" +
        (on ? '<span class="mock-tag">Connected (mock)</span>' : '<span class="mock-tag">Prototype</span>') +
        "</button>";
    }
    var cmds = [
      ["Any new friend requests?", "updates"],
      ["Who left me a Google review?", "reviews"],
      ["Open Liam’s Facebook profile", "open-liam"],
      ["Read my latest messages", "messages"],
      ["Where am I in the Facebook promotion queue?", "queue"],
      ["Any recommendation alerts?", "alerts"],
      ["Remind me to review Jack tomorrow", "remind"]
    ];
    return '<section class="screen has-tabs has-header" data-screen="ai-assistant">' + topbar("AI assistant") +
      '<div class="scroll"><div class="auth-hero"><h2>Hands-free help while you drive</h2>' +
      "<p>Connect your own assistant, then use voice commands for updates, reminders and navigation. This screen is a prototype mock. Nothing is sent to Grok, ChatGPT or Claude.</p></div>" +
      '<p class="group-label">Connect your assistant</p>' +
      card("grok", "Grok", "Use your own Grok account", "#0B1F33", "G") +
      card("chatgpt", "ChatGPT", "Use your own ChatGPT account", "#10A37F", "C") +
      card("claude", "Claude", "Use your own Claude account", "#D97757", "C") +
      card("other", "Other", "Paste a compatible assistant later", "#5B6B7C", "+") +
      '<p class="hint">Friend requests and Google reviews are never sent automatically. The assistant opens the right page, and you tap the button yourself.</p>' +
      '<p class="group-label">Try a voice command</p>' +
      '<button type="button" class="ai-mic" data-go="ai-voice" aria-label="Start voice command">' + I.mic + "</button>" +
      '<p class="hint" style="text-align:center;margin-top:0">Tap the mic, then say a command.</p>' +
      cmds.map(function (c) {
        return '<button type="button" class="cmd-chip" data-action="ai-cmd" data-cmd="' + c[1] + '">“' + esc(c[0]) + '”</button>';
      }).join("") +
      "</div></section>";
  }

  function renderVoice() {
    var step = S().aiStep || 0;
    var log = S().aiLog || [
      { who: "you", text: "Any new friend requests?" },
      { who: "ai", text: "Liam O’Connor sent a friend request. I can’t send Facebook requests for you. I can open his Facebook profile so you only have to tap Add friend." }
    ];
    return '<section class="screen has-header" data-screen="ai-voice">' +
      '<div class="app-header"><button class="icon-btn" data-go="ai-assistant" aria-label="Back">' + ico("back") + '</button><div class="ht">Voice</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="auth-hero" style="text-align:center"><h2>Listening (mock)</h2><p>Prototype only. Your phone would speak this aloud while you drive.</p></div>' +
      '<button type="button" class="ai-mic listen" data-action="ai-next" aria-label="Continue the mock conversation">' + I.mic + "</button>" +
      '<div class="voice-log">' + log.map(function (l) {
        return '<div class="voice-line ' + l.who + '">' + esc(l.text) + "</div>";
      }).join("") + "</div>" +
      '<a class="btn btn-fb has-ico" href="https://www.facebook.com/demo.oconnorplumbing" target="_blank" rel="noopener noreferrer" data-action="ai-open-fb" data-id="liam">' + I.fb + "<span>Open Liam’s Facebook profile</span></a>" +
      '<button class="btn btn-ghost ink has-ico" data-go="member" data-id="liam" style="margin-top:10px">' + ico("user") + "<span>Open Liam’s member card first</span></button>" +
      '<p class="hint" style="text-align:center">You tap Add friend yourself. The assistant only opens the page.</p></div></section>';
  }

  function renderRecList() {
    var list = alerts();
    return '<section class="screen has-tabs has-header" data-screen="rec-alerts">' + topbar("Alerts") +
      '<div class="scroll"><div class="auth-hero"><h2>Recommendation alerts</h2><p>Paste a Facebook post where someone is asking for a trade. The circle sees it at once and can go and comment in their own words.</p></div>' +
      '<button class="btn btn-primary has-ico" data-go="rec-compose">' + I.send + "<span>Send an alert to the circle</span></button>" +
      '<p class="group-label">Open</p>' +
      list.filter(function (a) { return a.status === "open"; }).map(alertCard).join("") +
      '<p class="group-label">Handled</p>' +
      list.filter(function (a) { return a.status !== "open"; }).map(alertCard).join("") +
      "</div></section>";
  }
  function alertCard(a) {
    var who = fn(member(a.by));
    return '<button type="button" class="alert-card" data-action="open-alert" data-id="' + a.id + '" style="width:100%;text-align:left">' +
      '<div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><h3>' + esc(a.trade) + '</h3><span class="mock-tag">' + (a.status === "open" ? "Open" : "Handled") + "</span></div>" +
      '<p class="hint" style="margin:0 0 6px">' + esc(a.ask) + "</p>" +
      '<p class="hint" style="margin:0">From ' + esc(who) + " \u00b7 " + a.helped.length + " helped</p></button>";
  }
  function renderRecCompose() {
    var trade = S().recTrade || "Pest Control";
    return '<section class="screen has-header" data-screen="rec-compose">' +
      '<div class="app-header"><button class="icon-btn" data-go="rec-alerts" aria-label="Back">' + ico("back") + '</button><div class="ht">Send alert</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="auth-hero"><h2>Share a Facebook post</h2><p>Paste the link, pick the trade they asked for, and send it to the circle.</p></div>' +
      '<div class="field"><label>Facebook post link</label><input id="recLink" inputmode="url" placeholder="https://www.facebook.com/groups/..." value="https://www.facebook.com/groups/perth.homeowners.demo/posts/840211"></div>' +
      '<div class="field"><label>Trade or business type they are asking for</label><div class="search-wrap"><div class="search">' + ico("search") +
      '<input id="tradeType" type="text" placeholder="Search, e.g. hairdresser or cafe" value="' + esa(trade) + '" autocomplete="off"></div><div id="tradeAc" class="ac-drop" hidden></div></div></div>' +
      '<button class="btn btn-primary has-ico" data-action="send-alert">' + I.bell + "<span>Send to circle</span></button>" +
      '<p class="hint" style="text-align:center">Members get a push alert. Comment ideas are suggestions only. Each person writes their own words on Facebook.</p></div></section>';
  }
  function renderRecAlert() {
    var a = alertById(S().alertId || "a1");
    var ideas = a.ideas || [];
    var helped = (a.helped || []).map(function (id) { return esc(fn(member(id))); }).join(", ");
    return '<section class="screen has-header" data-screen="rec-alert">' +
      '<div class="app-header"><button class="icon-btn" data-go="rec-alerts" aria-label="Back">' + ico("back") + '</button><div class="ht">Alert</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="auth-hero"><h2>Someone’s asking for ' + esc(tradeAsk(a.trade)) + '</h2><p>' + esc(a.ask) + " Help " + esc(fn(member(a.by)).split(" ")[0]) + " get a genuine recommendation.</p></div>" +
      '<a class="btn btn-fb has-ico" href="' + esa(a.link) + '" target="_blank" rel="noopener noreferrer">' + I.open + "<span>Open post</span></a>" +
      '<p class="group-label">What to do</p><ol class="steps-ol">' +
      "<li>Open the Facebook post.</li>" +
      "<li>Only comment if you actually know or have used this tradie.</li>" +
      "<li>Use an idea below if you like, then write it in your own words.</li>" +
      "<li>Tap Done when you have commented.</li></ol>" +
      '<p class="group-label">Comment ideas (suggestions only)</p>' +
      ideas.map(function (t, i) {
        return '<div class="idea-mini">' + esc(t) +
          '<div><button type="button" class="slim-cta" data-action="copy-idea" data-text="' + esa(t) + '">' + I.copy + " Copy</button></div></div>";
      }).join("") +
      (a.status === "open"
        ? '<button class="btn btn-primary has-ico" data-action="alert-done" data-id="' + a.id + '">' + I.check + "<span>Done, I commented</span></button>"
        : '<div class="reviewed-tick" style="margin:12px 0">' + I.check + " Marked as handled</div>") +
      '<p class="hint">Who has helped: ' + (helped || "No one yet") + "</p></div></section>";
  }

  function renderQueue() {
    var q = queue();
    var mine = 0;
    q.forEach(function (row, i) { if (row.memberId === "jamie") mine = i + 1; });
    return withFbSeg('<section class="screen has-tabs has-header" data-screen="promo-queue">' + topbar("Facebook") +
      '<div class="scroll"><div class="auth-hero"><h2>Facebook promotion queue</h2><p>The circle takes turns posting in the Facebook group. The ordinary queue is free. Jumping the queue is paid later — the price has not been set.</p></div>' +
      '<div class="queue-card"><div class="areas-card-h">Your place</div>' +
      (mine ? '<div class="queue-pos"><span class="n">' + mine + '</span><span class="hint" style="margin:0">of ' + q.length + " \u00b7 " + queueWaitPhrase(mine) + ", at one post every couple of days</span></div>"
        : '<p class="hint">You’re not in the queue yet.</p>') +
      (mine ? '<button class="btn btn-ghost ink has-ico" data-action="leave-queue">' + I.check + "<span>Leave the queue</span></button>"
        : '<button class="btn btn-primary has-ico" data-action="join-queue">' + facebookF(18) + "<span>Request a turn</span></button>") +
      "</div>" +
      '<div class="queue-card"><div class="areas-card-h">Jump the queue</div>' +
      '<p class="plan-price"><span class="price-tbc">Price to be set</span></p>' +
      '<p class="hint">No payment is taken in this prototype. In the real app, a paid jump would go through the App Store, Google Play, or Stripe on the web. Until a price is chosen, this stays on the waiting list.</p>' +
      '<button class="btn btn-navy has-ico" data-action="jump-queue" disabled>' + facebookF(18) + "<span>Coming later</span></button></div>" +
      '<p class="group-label">Current queue</p>' +
      q.map(function (row, i) {
        var m = member(row.memberId);
        return '<div class="queue-card" style="display:flex;gap:10px;align-items:center">' +
          '<div style="font-weight:800;width:24px">' + (i + 1) + "</div>" + av(m, 40) +
          "<div style=\"flex:1;min-width:0\"><strong>" + esc(fn(m)) + "</strong><div class=\"hint\" style=\"margin:0\">" + esc(m.business) + (row.paid ? " \u00b7 Paid jump (later)" : " \u00b7 Free turn") + "</div></div></div>";
      }).join("") +
      "</div></section>", "queue");
  }

  function renderReviews() {
    var theyList = (T().MEMBERS || []).filter(function (m) { return !m.isMe && theyReviewed(m); });
    var html = '<section class="screen has-tabs has-header" data-screen="reviews">' + topbar("Reviews") +
      '<div class="scroll"><div class="notice">This helper gives ideas only. Write the review yourself, and only for a job you actually had done.</div>' +
      '<p class="group-label">They left you a Google review</p>';
    theyList.forEach(function (m) {
      html += '<div class="card req-card">' + reviewBackBanner(m) +
        '<div style="display:flex;gap:10px;align-items:center">' + av(m, 44) +
        '<div><div class="who">' + esc(fn(m)) + '</div><div class="meta">' + esc(m.business) + " \u00b7 " + esc(m.trade) + "</div></div></div></div>";
    });
    html += '<p class="group-label">Requests received</p>';
    html += '<div class="card req-card"><div style="display:flex;gap:10px;align-items:center">' + av(member("jack"), 44) +
      '<div><div class="who">Jack Thompson</div><div class="meta">Thompson Electrical \u00b7 Today 7:12 am</div></div></div>' +
      '<button class="btn btn-primary has-ico" style="margin-top:10px" data-action="open-ideas" data-id="jack">' + googleG(16) + "<span>Write review</span></button></div>";
    html += '<div class="card req-card"><div style="display:flex;gap:10px;align-items:center">' + av(member("tom"), 44) +
      '<div><div class="who">Tom Reeves</div><div class="meta">Reeves Fencing \u00b7 Yesterday</div></div></div>' +
      '<button class="btn btn-primary has-ico" style="margin-top:10px" data-action="open-ideas" data-id="tom">' + googleG(16) + "<span>Write review</span></button></div>";
    html += "</div></section>";
    return html;
  }

  function renderLock() {
    return '<section class="screen" data-screen="lockscreen"><div class="lock">' +
      '<div class="clk">8:16</div><div class="dt">Monday 16 November</div>' +
      '<div class="lock-card"><div class="app">TradeCircle</div><div class="tl">Recommendation alert</div><div class="bd">Someone’s asking for a pest controller — help Vishal!</div></div>' +
      '<div class="lock-card"><div class="app">TradeCircle</div><div class="tl">Jack Thompson</div><div class="bd">Could you leave a Google review when you get a minute?</div></div>' +
      '<div class="lock-card"><div class="app">TradeCircle</div><div class="tl">Sarah left you a Google review</div><div class="bd">Review back when you can.</div></div>' +
      "</div></section>";
  }

  function renderMember(id) {
    var prev = window._tc12_renderMember;
    var m = member(id || S().selectedMember || "sarah");
    S().selectedMember = m.id;
    var r = relOf(m);
    var html = "";
    if (typeof prev === "function") {
      /* We'll build our own for consistency */
    }
    var pageBtn = m.page
      ? '<a class="btn btn-ghost ink has-ico" href="' + esa(m.page) + '" target="_blank" rel="noopener noreferrer">' + I.open + " View business page</a>"
      : "";
    return '<section class="screen has-header" data-screen="member">' +
      '<div class="app-header"><button class="icon-btn" data-go="members" aria-label="Back">' + ico("back") + '</button><div class="ht">Member</div>' +
      '<button class="icon-btn" data-action="open-chat" data-id="' + m.id + '" aria-label="Message">' + I.chat + "</button></div>" +
      '<div class="scroll"><div class="profile-hero">' + av(m, 96) +
      '<div class="nm">' + esc(fn(m)) + '</div><div class="biz">' + esc(m.business) + "</div>" +
      '<div class="tags"><span class="pill t-pill">' + esc(m.trade) + "</span></div></div>" +
      reviewBackBanner(m) +
      '<p class="bio">' + esc(m.bio) + "</p>" +
      '<div class="action-stack">' + friendButton(m) +
      '<a class="btn btn-primary has-ico" href="' + esa(gLink(m)) + '" target="_blank" rel="noopener noreferrer" data-action="open-ideas" data-id="' + m.id + '">' + googleG(16) + "<span>Leave a Google review</span></a>" +
      '<button class="btn btn-ghost ink has-ico" data-action="ask-review" data-id="' + m.id + '">' + I.send + "<span>Ask for a Google review</span></button>" +
      '<button class="btn btn-ghost ink has-ico" data-action="open-chat" data-id="' + m.id + '">' + I.chat + "<span>Message</span></button>" +
      pageBtn + "</div>" +
      (T().selectedAreasCard ? T().selectedAreasCard(m.regions || [], { title: "Areas they work in" }) : "") +
      '<p class="hint" style="text-align:center">Only review businesses you have actually used. Friend requests are sent on Facebook, not inside this app.</p>' +
      "</div></section>";
  }

  /* ---------- Chat attach / emoji patches via afterGo ---------- */
  var EMOJIS = ["\uD83D\uDC4D","\u2764\uFE0F","\uD83D\uDE02","\uD83D\uDE0A","\uD83D\uDE4C","\uD83C\uDF89","\uD83D\uDE80","\uD83D\uDC4F","\u2705","\uD83C\uDFE0"];

  function enhanceComposer() {
    var composer = document.querySelector(".chat-composer");
    if (!composer || composer.getAttribute("data-v15") === "1") return;
    composer.setAttribute("data-v15", "1");
    var emojiBtn = document.createElement("button");
    emojiBtn.type = "button";
    emojiBtn.className = "composer-emoji";
    emojiBtn.setAttribute("data-action", "emoji-pick");
    emojiBtn.setAttribute("aria-label", "Emoji");
    emojiBtn.textContent = "\uD83D\uDE0A";
    var send = composer.querySelector(".send");
    if (send) composer.insertBefore(emojiBtn, send);
    var panel = document.createElement("div");
    panel.id = "emojiPanel";
    panel.className = "emoji-panel";
    panel.innerHTML = EMOJIS.map(function (e) {
      return '<button type="button" data-action="insert-emoji" data-emoji="' + e + '">' + e + "</button>";
    }).join("");
    composer.appendChild(panel);
  }

  /* ---------- Click handling ---------- */
  function handle(e) {
    var el = e.target.closest("[data-action]");
    var action = el ? el.getAttribute("data-action") : "";
    var id = el ? el.getAttribute("data-id") : "";

    if (action === "ai-connect") {
      S().aiProvider = el.getAttribute("data-provider");
      toast("Connected in this prototype only. Nothing was sent to the provider.");
      go("ai-assistant");
      return true;
    }
    if (action === "ai-cmd") {
      var cmd = el.getAttribute("data-cmd");
      var map = {
        updates: [{ who: "you", text: "Any new friend requests?" }, { who: "ai", text: "Liam O’Connor sent a friend request. I can open his Facebook profile so you can tap Add friend yourself." }],
        reviews: [{ who: "you", text: "Who left me a Google review?" }, { who: "ai", text: "Sarah Nguyen and Jack Thompson left you a Google review. Thompson Electrical has already had 3 Google reviews from the circle today, which is the daily limit, so that review page is locked until tomorrow. I can open Sarah’s Google review page so you can tap Review back." }],
        "open-liam": [{ who: "you", text: "Open Liam’s Facebook profile." }, { who: "ai", text: "Opening Liam’s Facebook profile now. Tap Add friend when you’re ready. I won’t send the request for you." }],
        messages: [{ who: "you", text: "Read my latest messages." }, { who: "ai", text: "Sarah said: “Thanks — I will have a look this week.” Jack asked if you could leave a Google review." }],
        queue: [{ who: "you", text: "Where am I in the promotion queue?" }, { who: "ai", text: "You’re number " + ((window.TCQueueWait && myQueuePlace) ? (myQueuePlace().mine || 4) : 4) + " in the Facebook promotion queue, " + (window.TCQueueWait ? window.TCQueueWait.phrase((myQueuePlace && myQueuePlace().mine) || 4) : "about 6 days") + " at the current pace. Jumping the queue is not priced yet." }],
        alerts: [{ who: "you", text: "Any recommendation alerts?" }, { who: "ai", text: "Yes. Someone is asking for a pest controller. I can open the alert so you can go to the Facebook post and comment in your own words." }],
        remind: [{ who: "you", text: "Remind me to review Jack tomorrow." }, { who: "ai", text: "Reminder set for tomorrow morning (mock). I’ll nudge you to open Jack’s Google review page — you’ll write and post it yourself." }]
      };
      S().aiLog = map[cmd] || map.updates;
      go("ai-voice");
      return true;
    }
    if (action === "ai-next") {
      toast("In a real build your phone would keep listening.");
      return true;
    }
    if (action === "ai-open-fb") {
      toast("Facebook is open. You tap Add friend yourself.");
      return false;
    }
    if (action === "open-fb") {
      var m = member(id);
      if (m && m.facebook) window.open(m.facebook, "_blank", "noopener");
      return true;
    }
    if (action === "review-back") {
      if (!S()._reviewedBack) S()._reviewedBack = {};
      S()._reviewedBack[id] = 1;
      toast("Opening Google. Write the review in your own words, then come back and it will show as Reviewed.");
      go(S().screen === "reviews" || S().screen === "reviews-back" ? "reviews" : (S().screen || "member"));
      return false; /* allow the link to open */
    }
    if (action === "send-alert") {
      var linkEl = document.getElementById("recLink");
      var tradeEl = document.getElementById("tradeType");
      var trade = (tradeEl && tradeEl.value.trim()) || "Pest Control";
      S().recTrade = trade;
      alerts().unshift({
        id: "a" + Date.now(),
        link: (linkEl && linkEl.value) || "https://www.facebook.com/groups/demo",
        trade: trade,
        by: "jamie",
        ask: "Someone in a Facebook group is asking for " + tradeAsk(trade) + ".",
        status: "open",
        helped: [],
        ideas: [
          "I have used this tradie and would recommend getting in touch.",
          "Happy to recommend from a job I actually saw in Perth."
        ]
      });
      S().alertId = alerts()[0].id;
      toast("Alert sent. Members would get a push notification now.");
      go("rec-alert");
      return true;
    }
    if (action === "open-alert") {
      S().alertId = id || el.getAttribute("data-id");
      go("rec-alert");
      return true;
    }
    if (action === "copy-idea") {
      var text = el.getAttribute("data-text") || "";
      try { navigator.clipboard.writeText(text); } catch (err) {}
      toast("Copied. Edit it in your own words before you post.");
      return true;
    }
    if (action === "alert-done") {
      var a = alertById(id);
      if (a) {
        if (a.helped.indexOf("jamie") === -1) a.helped.push("jamie");
        a.status = "handled";
      }
      toast("Thanks. Marked as commented.");
      go("rec-alert");
      return true;
    }
    if (action === "join-queue") {
      var q = queue();
      if (!q.some(function (r) { return r.memberId === "jamie"; })) {
        q.push({ id: "q" + Date.now(), memberId: "jamie", when: "Now", paid: false, mine: true });
      }
      toast("You’re in the free queue.");
      go("promo-queue");
      return true;
    }
    if (action === "leave-queue") {
      S()._queue = queue().filter(function (r) { return r.memberId !== "jamie"; });
      toast("You’ve left the queue.");
      go("promo-queue");
      return true;
    }
    if (action === "jump-queue") {
      toast("Price to be set. No payment is taken in this prototype.");
      return true;
    }
    if (action === "emoji-pick") {
      var p = document.getElementById("emojiPanel");
      if (p) p.classList.toggle("show");
      return true;
    }
    if (action === "insert-emoji") {
      var box = document.getElementById("chatInput");
      if (box) box.value += el.getAttribute("data-emoji") || "";
      var p2 = document.getElementById("emojiPanel");
      if (p2) p2.classList.remove("show");
      return true;
    }
    if (action === "attach-photo" || action === "attach-camera" || action === "attach-file") {
      var c = null;
      if (window.TC12) {
        /* fall through after toast by injecting a demo message if possible */
      }
      toast(action === "attach-file" ? "In a real build you could pick a file. A sample file is already in this chat." : "In a real build you could take or pick a photo. A sample photo is already in this chat.");
      return true;
    }
    return false;
  }

  function render(id) {
    if (id === "ai-assistant") return renderAI();
    if (id === "ai-voice") return renderVoice();
    if (id === "rec-alerts") return renderRecList();
    if (id === "rec-compose") return renderRecCompose();
    if (id === "rec-alert") return renderRecAlert();
    if (id === "promo-queue") return renderQueue();
    if (id === "fb-recommend" || id === "fb-recommend-open" || id === "fb-recommend-mine" || id === "fb-recommend-done") {
      return window.TC159 && TC159.render ? TC159.render(id) : null;
    }
    if (id === "more" || id === "drawer") return renderMore();
    if (id === "home") return renderHome();
    if (id === "reviews" || id === "reviews-back") return renderReviews();
    if (id === "lockscreen") return renderLock();
    return null;
  }

  function install() {
    if (!window.TC12) return;
    var prevClick = TC12.handleClick;
    TC12.handleClick = function (e) {
      if (handle(e)) return true;
      return prevClick ? prevClick(e) : false;
    };
    var prevRender = TC12.render;
    TC12.render = function (id) {
      return render(id) || (prevRender ? prevRender(id) : null);
    };
    TC12.memberCard = memberCard;
    TC12.renderMember = function (id) { return renderMember(id); };
    var prevAfter = TC12.afterGo;
    TC12.afterGo = function (id) {
      if (prevAfter) prevAfter(id);
      enhanceComposer();
      if (id === "more" || id === "drawer") {
        if (window.TC12 && TC12.closeDrawer) TC12.closeDrawer();
        var ms = document.getElementById("moreSearch");
        if (ms) {
          ms.addEventListener("input", function () {
            S()._moreQuery = ms.value;
            var html = renderMore();
            var screens = document.getElementById("screens");
            if (screens) {
              screens.innerHTML = html;
              var sc = screens.querySelector(".screen");
              if (sc) sc.classList.add("active");
            }
            var again = document.getElementById("moreSearch");
            if (again) { again.focus(); try { again.setSelectionRange(again.value.length, again.value.length); } catch (e) {} }
          });
        }
      }
      /* inject extra drawer items if the (legacy) drawer exists */
      var nav = document.querySelector(".drawer-nav");
      if (nav && !nav.getAttribute("data-v15")) {
        nav.setAttribute("data-v15", "1");
        var extra = [
          ["ai-assistant", I.spark, "AI assistant"],
          ["rec-alerts", I.bell, "Recommendation alerts"],
          ["promo-queue", facebookF(18), "Facebook promotion queue"]
        ];
        extra.forEach(function (it) {
          if (nav.querySelector('[data-go="' + it[0] + '"]')) return;
          var b = document.createElement("button");
          b.type = "button";
          b.className = "drawer-item";
          b.setAttribute("data-go", it[0]);
          b.innerHTML = '<span class="ic">' + it[1] + "</span><span>" + it[2] + "</span>";
          var settings = nav.querySelector('[data-go="settings"]');
          nav.insertBefore(b, settings || null);
        });
      }
    };
    var prevMembers = TC12.renderMembers;
    if (prevMembers) {
      TC12.renderMembers = function () { return withFbSeg(prevMembers.apply(this, arguments), "circle"); };
    }
    var prevMe = TC12.renderMe;
    TC12.renderMe = function () {
      var html = prevMe ? prevMe() : "";
      return html.replace('<div class="info-rows">', meToolRows() + '<div class="info-rows">');
    };
    /* Header hamburger opens the More apps screen */
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action='open-drawer']");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      go("more");
    }, true);
    /* Patch attach sheet by wrapping later clicks — openAttach is internal.
       We intercept data-action=attach after v12 opens the sheet, then rewrite it. */
    document.addEventListener("click", function (e) {
      if (!e.target.closest("[data-action='attach']")) return;
      setTimeout(function () {
        var sheet = document.querySelector(".sheet .overflow-menu") || document.querySelector("#tc12Overlay .overflow-menu");
        if (!sheet || sheet.getAttribute("data-v15") === "1") return;
        sheet.setAttribute("data-v15", "1");
        sheet.innerHTML =
          '<button data-action="attach-camera">' + I.cam + " Camera</button>" +
          '<button data-action="attach-photo">' + I.image + " Photo</button>" +
          '<button data-action="attach-file">' + I.file + " File</button>" +
          '<button data-action="share-location">Location</button>' +
          '<button data-action="share-my-profile">Member profile card</button>' +
          '<button data-action="close-sheet">Cancel</button>';
      }, 30);
    }, true);
  }

  function boot() {
    install();
    if (T().go && S().screen) {
      try { T().go(S().screen); } catch (err) {}
    }
  }
  if (window.TC12) boot();
  else document.addEventListener("DOMContentLoaded", boot);

  window.TC15 = { render: render, handle: handle, memberCard: memberCard };
})();
