/* Rate Buddies v2.1.1 — Google Reviews flow, trade-icon avatars, region UX, chrome. */
(function (root) {
  "use strict";

  var LS_AVAIL = "rb_swap_available";
  var LS_GIVEN = "rb_reviews_given_total";
  var LS_REMIND = "rb_google_review_reminders";
  var LS_FILTER = "rb_gr_filter";
  var LS_ONLY = "rb_gr_only_available";

  function T() { return root.TradeCircle || {}; }
  function S() { return (T().state || {}); }
  function me() { return (T().MEMBERS || []).find(function (m) { return m.isMe || m.id === S().meId; }) || { id: "jamie", first: "Jamie", last: "Hale", trade: "Pest Control", business: "Hale Pest Control" }; }
  function esc(s) { return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function esa(s) { return String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
  function load(key, fb) {
    try { var r = localStorage.getItem(key); if (r != null) return JSON.parse(r); } catch (e) {}
    return fb;
  }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  /* ---------- Trade icon styles (rounded-square gradient + white glyph) ---------- */
  var STYLES = {
    pest:        { a: "#2F9E5A", b: "#1B6B3C", accent: "#2F9E5A" },
    carpenter:   { a: "#C67A3A", b: "#8A4A1C", accent: "#C67A3A" },
    electrician: { a: "#E8A317", b: "#B86A00", accent: "#E8A317" },
    fencing:     { a: "#8B7355", b: "#5C4330", accent: "#8B7355" },
    painter:     { a: "#A78BFA", b: "#6D28D9", accent: "#7C3AED" },
    hvac:        { a: "#22D3EE", b: "#0E7490", accent: "#0891B2" },
    plumber:     { a: "#1D4E8C", b: "#0A1328", accent: "#1D4E8C" },
    landscaper:  { a: "#22C55E", b: "#15803D", accent: "#16A34A" },
    roofer:      { a: "#B45309", b: "#7C2D12", accent: "#B45309" },
    handyman:    { a: "#E11D48", b: "#9F1239", accent: "#E11D48" },
    locksmith:   { a: "#64748B", b: "#334155", accent: "#475569" },
    barber:      { a: "#0F766E", b: "#115E59", accent: "#0F766E" },
    tiler:       { a: "#6366F1", b: "#3730A3", accent: "#4F46E5" },
    default:     { a: "#1A5FD4", b: "#163A8A", accent: "#1A5FD4" }
  };
  var GLYPHS = {
    pest:        { d: '<path d="M12 6v4"/><circle cx="12" cy="14" r="5"/><path d="M5 10l3 2M19 10l-3 2M5 18l3-2M19 18l-3-2M8 4l2 3M16 4l-2 3"/>', fill: false },
    carpenter:   { d: '<path d="M14 5l5 5-3 3-2-2-6 8-3-3 8-6-2-2z"/>', fill: false },
    electrician: { d: '<path d="M13 2L4 14h7l-1 8 10-13h-7l1-7z"/>', fill: true },
    fencing:     { d: '<path d="M4 20V8l3-3 3 3 3-3 3 3 3-3v15"/><path d="M4 12h15M4 16h15"/>', fill: false },
    painter:     { d: '<rect x="3" y="3" width="14" height="6" rx="1"/><path d="M17 6h2a2 2 0 010 4h-6v9"/>', fill: false },
    hvac:        { d: '<path d="M12 2v20M5 6l14 12M19 6L5 18M3 12h18"/>', fill: false },
    plumber:     { d: '<path d="M3 12h11"/><path d="M14 12V7h7"/><path d="M17.5 7v3"/><path d="M14 12v4a3 3 0 01-3 3H8"/><path d="M10.4 22c0-1.3.9-2 1.6-2s1.6.7 1.6 2"/>', fill: false },
    landscaper:  { d: '<path d="M5 19c8-1 14-8 14-16-8 0-15 6-16 14 4-1 6 0 8 2"/><path d="M8 16c2-3 5-6 9-8"/>', fill: false },
    roofer:      { d: '<path d="M3 12l9-8 9 8"/><path d="M5 10v10h14V10"/>', fill: false },
    handyman:    { d: '<path d="M14.7 6.3a4 4 0 00-5.6 5.6L3 18l3 3 6.1-6.1a4 4 0 005.6-5.6L15 12z"/>', fill: false },
    locksmith:   { d: '<circle cx="8" cy="15" r="4"/><path d="M11.5 13.5L20 5v3M16 5v3"/>', fill: false },
    barber:      { d: '<circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><path d="M8.5 16.5L20 4M15.5 16.5L4 4"/>', fill: false },
    tiler:       { d: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>', fill: false },
    default:     { d: '<path d="M14 5l5 5-3 3-2-2-6 8-3-3 8-6-2-2z"/>', fill: false }
  };
  function tradeKey(trade) {
    var t = String(trade || "").toLowerCase();
    if (/pest|termite|vermin|rodent|cockroach|insect/.test(t)) return "pest";
    if (/electric|solar|data cabling|switchboard/.test(t)) return "electrician";
    if (/plumb|gasfit|drain|hot water/.test(t)) return "plumber";
    if (/fence|fencing|gate|fencer/.test(t)) return "fencing";
    if (/air cond|hvac|refrigerat|cooling/.test(t)) return "hvac";
    if (/paint/.test(t)) return "painter";
    if (/landscape|garden|arborist|turf|irrigation|horticult/.test(t)) return "landscaper";
    if (/carpent|joiner|cabinet/.test(t)) return "carpenter";
    if (/roof/.test(t)) return "roofer";
    if (/handyman/.test(t)) return "handyman";
    if (/locksmith|lock/.test(t)) return "locksmith";
    if (/barber|hair/.test(t)) return "barber";
    if (/tiler|tiling/.test(t)) return "tiler";
    return "default";
  }
  function tradeStyle(trade) { return STYLES[tradeKey(trade)] || STYLES.default; }
  function glyphSvg(trade, px) {
    var g = GLYPHS[tradeKey(trade)] || GLYPHS.default;
    if (g.fill) {
      return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 24 24" fill="#fff" stroke="none" aria-hidden="true">' + g.d + "</svg>";
    }
    return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + g.d + "</svg>";
  }
  function isAvailable(m) {
    if (!m) return false;
    if (m.isMe || m.id === me().id) return isMeAvailable();
    var map = load("rb_member_avail", null);
    if (map && Object.prototype.hasOwnProperty.call(map, m.id)) return !!map[m.id];
    /* Demo: Priya is not available (full today). Everyone else is. */
    if (m.id === "priya") return false;
    return true;
  }
  function avatar(m, size) {
    size = size || 40;
    m = m || me();
    if (m.isMe && S().photoData) {
      var rad = Math.max(8, Math.round(size * 0.28));
      return '<div class="avatar av-trade" style="width:' + size + "px;height:" + size + "px;border-radius:" + rad + 'px;background:#ccc">' +
        '<img src="' + S().photoData + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:' + rad + 'px">' +
        (isAvailable(m) ? '<span class="dot" title="Available"></span>' : "") + "</div>";
    }
    var st = tradeStyle(m.trade);
    var rad = Math.max(8, Math.round(size * 0.28));
    var ico = Math.max(16, Math.round(size * 0.64));
    var dot = isAvailable(m) ? '<span class="dot" title="Available"></span>' : "";
    return '<div class="avatar av-trade" style="width:' + size + "px;height:" + size + "px;border-radius:" + rad + "px;background:linear-gradient(160deg," + st.a + "," + st.b + ");--trade-accent:" + st.accent + '">' +
      glyphSvg(m.trade, ico) + dot + "</div>";
  }

  /* ---------- Received cap / availability / reminders (local, Perth day) ---------- */
  var RC = root.TCReviews;
  function receivedToday(id) { return RC ? RC.countFor(id) : 0; }
  function atReceivedCap(id) { return RC ? RC.atLimit(id) : false; }
  function cap() { return RC ? RC.limit() : 3; }
  function givenTotal() {
    if (root.TC211 && TC211.scoreOf) {
      var sc = TC211.scoreOf((me() && me().id) || "jamie");
      return (sc && sc.reviews) || 0;
    }
    var n = load(LS_GIVEN, null);
    if (typeof n === "number" && n !== 47) return n;
    return 8;
  }
  function addGiven() {
    if (root.TC211 && TC211.bumpReviews) TC211.bumpReviews((me() && me().id) || "jamie", 1);
    else save(LS_GIVEN, givenTotal() + 1);
  }

  function perthToday() { return RC && RC.perthToday ? RC.perthToday() : new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Perth" }); }

  function isMeAvailable() {
    if (atReceivedCap(me().id)) return false;
    var v = load(LS_AVAIL, null);
    if (v == null) return true;
    return !!v;
  }
  function setMeAvailable(on) {
    if (atReceivedCap(me().id) && on) return false;
    save(LS_AVAIL, !!on);
    syncAvailToSupabase(!!on);
    return true;
  }

  function reminders() { return load(LS_REMIND, []) || []; }
  function saveReminders(list) { save(LS_REMIND, list); }
  function addReminder(memberId, whenIso, label) {
    var list = reminders().filter(function (r) { return r.memberId !== memberId; });
    list.push({ memberId: memberId, when: whenIso, label: label || "Tomorrow, 9:00 AM", created: Date.now() });
    saveReminders(list);
    scheduleNotification(list.length, label);
  }

  function tomorrowNineIso() {
    var now = new Date();
    var parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Perth", year: "numeric", month: "2-digit", day: "2-digit" }).format(now).split("-");
    /* Next 09:00 AWST = 01:00 UTC on that calendar date + 1 day */
    var d = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]) + 1, 1, 0, 0));
    return d.toISOString();
  }

  var notificationGap = "";
  function scheduleNotification(count, label) {
    var title = "Google Review time";
    var body = count + " members are ready for your Google Review. Tap to open Rate Buddies.";
    var when = new Date(tomorrowNineIso());
    try {
      var Cap = root.Capacitor;
      var LN = Cap && (Cap.Plugins && Cap.Plugins.LocalNotifications || (Cap.registerPlugin && Cap.registerPlugin("LocalNotifications")));
      if (LN && LN.schedule) {
        LN.requestPermissions && LN.requestPermissions();
        LN.schedule({
          notifications: [{
            id: 2101,
            title: title,
            body: body,
            schedule: { at: when },
            extra: { screen: "reviews" }
          }]
        });
        notificationGap = "";
        return;
      }
    } catch (e) {}
    notificationGap = "In-app reminder is saved. A phone pop-up needs the Local Notifications plugin on the Android build.";
    try {
      if (Notification && Notification.permission === "granted") {
        /* Browsers cannot reliably schedule at a future clock time without a service worker; we keep the in-app list. */
      }
    } catch (e2) {}
  }

  async function syncAvailToSupabase(on) {
    try {
      var rb = root.RB || root.RBApp;
      var client = root.RB && root.RB.client;
      if (!client && root.supabase && root.RB_CONFIG) return;
      var sb = client || (root.rb && root.rb.sb);
      if (!sb || !sb.from) return;
      var uid = null;
      try {
        var sess = await sb.auth.getUser();
        uid = sess && sess.data && sess.data.user && sess.data.user.id;
      } catch (e) {}
      if (!uid) return;
      await sb.from("profiles").update({ available_for_swap: on }).eq("id", uid);
    } catch (e) { /* stay local */ }
  }

  /* Review status for the list */
  function iReviewed(m) { return !!(S()._reviewed && S()._reviewed[m.id]); }
  function theyReviewed(m) { return !!(S()._they && S()._they[m.id]); }
  function pendingOf(m) { return !!(S()._pendingReq && S()._pendingReq[m.id]); }
  function alreadyGiven(m) { return iReviewed(m) && theyReviewed(m); }
  function seedDemoRelations() {
    S()._reviewed = S()._reviewed || { sarah: true, daniel: true, chris: true };
    S()._they = S()._they || { sarah: true, mei: true, liam: true };
    S()._pendingReq = S()._pendingReq || { jack: true, emma: true };
  }
  function statusOf(m) {
    if (atReceivedCap(m.id)) return "full";
    if (alreadyGiven(m)) return "already";
    if (iReviewed(m)) return "given";
    if (pendingOf(m)) return "pending";
    return "not";
  }

  var FILTERS = [
    { id: "all", label: "All" },
    { id: "available", label: "Available" },
    { id: "not-available", label: "Not available" },
    { id: "given", label: "Given" },
    { id: "not-given", label: "Not given" },
    { id: "pending", label: "Pending" },
    { id: "already", label: "Already given" }
  ];

  function membersForList() {
    seedDemoRelations();
    return (T().MEMBERS || []).filter(function (m) { return !m.isMe && m.id !== me().id; });
  }
  function countFilter(id, list) {
    return list.filter(function (m) { return matchFilter(id, m); }).length;
  }
  function matchFilter(id, m) {
    var av = isAvailable(m);
    var st = statusOf(m);
    if (id === "all") return true;
    if (id === "available") return av;
    if (id === "not-available") return !av;
    if (id === "given") return st === "given" || st === "already";
    if (id === "not-given") return st === "not";
    if (id === "pending") return st === "pending";
    if (id === "already") return st === "already";
    return true;
  }

  function googleG(n) {
    n = n || 12;
    return '<svg width="' + n + '" height="' + n + '" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.6 7.1l.1.1 6.3 5.3C36.5 41.3 44 36 44 24c0-1.3-.1-2.7-.4-3.9z"/></svg>';
  }
  function chatIco() {
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12a7.5 7.5 0 0 1-7.5 7.5H8l-4 3v-4.2A7.5 7.5 0 1 1 20 12z"/></svg>';
  }
  function bellIco() {
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>';
  }
  function unreadChat() { return (root.TC12 && TC12.unreadTotal) ? TC12.unreadTotal() : 3; }
  function unreadBell() { return (root.TC12 && TC12.notifUnread) ? TC12.notifUnread() : 5; }

  function heroHeader(kicker, title) {
    var n = unreadChat();
    var b = unreadBell();
    return '<div class="v21-header">' +
      '<div class="v21-titles">' + (kicker ? '<div class="v21-kicker">' + esc(kicker) + "</div>" : "") +
      "<h1>" + esc(title) + "</h1></div>" +
      '<div class="v21-float">' +
      '<button class="icon-btn v21-float-btn" data-go="chats" aria-label="Chats">' + chatIco() +
      (n ? '<span class="bell-dot">' + n + "</span>" : "") + "</button>" +
      '<button class="icon-btn v21-float-btn" data-go="notifications" aria-label="Notifications">' + bellIco() +
      (b ? '<span class="bell-dot">' + b + "</span>" : "") + "</button>" +
      "</div></div>";
  }

  function regionLabel(m) {
    var ids = m.regions || [];
    var Chooser = (T().CHOOSER || root.CHOOSER);
    /* Fall back to the first region id, capitalised. */
    if (!ids.length) return "";
    var id = ids[0];
    var names = { hills: "Hills", north: "North", south: "South", east: "East", central: "Central", fremantle: "Fremantle", rockingham: "Rockingham", joondalup: "Joondalup", armadale: "Armadale", kwinana: "Kwinana" };
    return names[id] || id;
  }

  function renderReviews() {
    seedDemoRelations();
    var I = me();
    var rec = receivedToday(I.id);
    var c = cap();
    var capped = rec >= c;
    var available = isMeAvailable() && !capped;
    var given = givenTotal();
    var incoming = (root.TC211 && TC211.incomingNewCount) ? TC211.incomingNewCount() : 5;
    var filter = load(LS_FILTER, "all") || "all";
    var only = !!load(LS_ONLY, false);
    var all = membersForList();
    var visible = all.filter(function (m) {
      if (only && !isAvailable(m)) return false;
      return matchFilter(filter, m);
    });
    var pips = "";
    for (var i = 0; i < c; i++) pips += "<i" + (i < rec ? ' class="on"' : "") + "></i>";

    var html = '<section class="screen has-tabs has-header" data-screen="reviews">' +
      heroHeader("Google", "Reviews") +
      '<div class="scroll">' +
      '<div class="v21-who">' + avatar(I, 40) +
      "<div><div class=\"nm\">" + esc(I.first) + "</div><div class=\"sub\">" + esc(I.trade) + " · Perth</div></div></div>" +
      '<div class="v21-stats">' +
      '<div class="v21-stat gold"><div class="num">' + rec + "/" + c + '</div><div class="hint">Received today</div><div class="v21-pbar" aria-label="' + rec + " of " + c + '">' + pips + "</div></div>" +
      '<div class="v21-stat navy"><div class="num">' + given + '</div><div class="hint">Google Reviews given</div></div>' +
      "</div>";

    if (capped) {
      html += '<div class="v21-banner"><div>' +
        '<div class="t">You’ve received ' + rec + " of " + c + " Google Reviews today</div>" +
        '<div class="c">Your listing is protected. Your toggle is paused until tomorrow and new requests are queued for tomorrow. You can still give as many Google Reviews as you like.</div></div></div>';
    }

    html += '<div class="v21-card v21-avail' + (available ? "" : " off") + '">' +
      '<div style="flex:1;min-width:0"><div class="t">' + (available ? "Available for swapping Google Reviews" : "Not available for swapping Google Reviews") + "</div>" +
      '<div class="c">' + (capped ? "Paused automatically · back on tomorrow" : "Visible to all members — they can send you a Google Review swap request") + "</div></div>" +
      '<button type="button" class="v21-toggle' + (available ? "" : " off") + '" role="switch" aria-checked="' + (available ? "true" : "false") + '" data-action="rb-toggle-avail"' + (capped ? " disabled" : "") + "><i></i></button></div>";

    html += '<button type="button" class="v21-card v21-incoming" data-action="rb-incoming" style="width:100%;text-align:left">' +
      '<div style="flex:1"><div class="t">Incoming Google Review swap requests' + (incoming ? ' <span class="v21-count">' + incoming + " new</span>" : "") + "</div>" +
      '<div class="c">Tap to view who asked you</div></div><div style="color:var(--accent-2);font-weight:800;font-size:16px">›</div></button>';

    html += '<div class="v21-chips" aria-label="Filters"><div class="v21-chip-row">';
    FILTERS.forEach(function (f) {
      html += '<button type="button" class="v21-fchip' + (filter === f.id ? " on" : "") + '" data-action="rb-filter" data-id="' + f.id + '"><b>' + countFilter(f.id, all) + "</b> " + esc(f.label) + "</button>";
    });
    html += "</div></div>";

    html += '<div class="v21-sec-row"><div class="sec">Members in your areas</div>' +
      '<button type="button" class="v21-only" data-action="rb-only-avail">Show only available' +
      '<span class="v21-toggle' + (only ? "" : " off") + '" style="width:36px;height:22px"><i style="width:16px;height:16px"></i></span></button></div>';

    html += '<div class="v21-list">';
    visible.forEach(function (m) { html += memberRow(m); });
    if (!visible.length) html += '<div class="v21-mrow"><div class="s">No members match this filter.</div></div>';
    html += "</div>";

    if (capped) {
      var rem = reminders();
      if (!rem.length) {
        ["emma", "liam", "mei"].forEach(function (id) { addReminder(id, tomorrowNineIso(), "Tomorrow, 9:00 AM"); });
        rem = reminders();
      }
      html += '<div class="v21-card v21-picker" style="margin-top:10px;align-items:center">' +
        '<div style="flex:1"><div class="t" style="font-size:12px;font-weight:700;color:var(--muted)">Set reminder time</div>' +
        '<div style="font-size:15px;font-weight:800;letter-spacing:-0.03em">Tomorrow, 9:00 AM</div></div>' +
        '<button type="button" class="v21-act" data-action="rb-set-time" style="max-width:none;padding:6px 10px">Change</button></div>';
      html += '<div class="sec" style="margin:8px 0 6px">My Google Review reminders · ' + rem.length + " full today</div>";
      html += '<div class="v21-list">';
      rem.forEach(function (r) {
        var m = (T().MEMBERS || []).find(function (x) { return x.id === r.memberId; });
        if (m) html += reminderRow(m, r.label || "Tomorrow 9:00");
      });
      html += "</div>";
      html += '<p class="v21-note">These members hit their 3 received today. At 9:00 AM you get “Google Review time” — open Rate Buddies and leave your Google Reviews, in your own words, after a real job.</p>';
    }

    html += "</div></section>";
    return html;
  }

  function memberRow(m) {
    var st = statusOf(m);
    var av = isAvailable(m);
    var style = tradeStyle(m.trade);
    var statusChip = "";
    var act = "";
    if (st === "full") {
      statusChip = '<span class="v21-chip full">' + googleG(11) + " Full today · 3/3</span>";
      act = '<button type="button" class="v21-act warn" data-action="rb-remind-me" data-id="' + esa(m.id) + '">Remind me</button>';
    } else if (st === "given" || st === "already") {
      statusChip = '<span class="v21-chip given">' + googleG(11) + (st === "already" ? " Already given" : " Given") + "</span>";
      act = '<button type="button" class="v21-act ghost" data-action="rb-view" data-id="' + esa(m.id) + '">View</button>';
    } else if (st === "pending") {
      statusChip = '<span class="v21-chip pend">' + googleG(11) + " Pending</span>";
      act = '<button type="button" class="v21-act warn" data-action="rb-remind-me" data-id="' + esa(m.id) + '">Remind</button>';
    } else {
      statusChip = '<span class="v21-chip not">' + googleG(11) + " Not given</span>";
      act = '<button type="button" class="v21-act" data-action="rb-leave" data-id="' + esa(m.id) + '">' + googleG(12) + " Leave review</button>";
    }
    var availChip = av ? '<span class="v21-chip yes">Available</span>' : '<span class="v21-chip no">Not available</span>';
    var nm = esc(((m.first || "") + " " + (m.last || "")).trim());
    return '<div class="v21-mrow" style="--trade-accent:' + style.accent + '">' +
      '<button type="button" class="mem-open v21-who" data-go="member" data-id="' + esa(m.id) + '" aria-label="Open ' + nm + ' profile">' +
      avatar(m, 36) +
      '<div class="meta"><div class="n">' + nm + "</div>" +
      '<div class="s">' + esc(m.trade) + " · " + esc(regionLabel(m)) + "</div>" +
      '<div class="v21-flags">' + availChip + statusChip + "</div></div></button>" +
      '<div class="v21-right">' + act + "</div></div>";
  }

  function reminderRow(m, label) {
    var style = tradeStyle(m.trade);
    var nm = esc(((m.first || "") + " " + (m.last || "")).trim());
    return '<div class="v21-mrow" style="--trade-accent:' + style.accent + '">' +
      '<button type="button" class="mem-open v21-who" data-go="member" data-id="' + esa(m.id) + '" aria-label="Open ' + nm + ' profile">' +
      avatar(m, 36) +
      '<div class="meta"><div class="n">' + nm + "</div>" +
      '<div class="s">' + esc(m.trade) + " · " + esc(regionLabel(m)) + "</div></div></button>" +
      '<div class="v21-right"><span class="v21-chip full">' + googleG(11) + " Full today</span>" +
      '<span class="v21-act ghost">' + esc(label || "Tomorrow 9:00") + "</span></div></div>";
  }

  function renderLockNotif() {
    return '<section class="screen" data-screen="lockscreen"><div class="lock" style="background:radial-gradient(120% 80% at 50% 0%, #2A4F93 0%, #102047 42%, #070E1C 100%);color:#fff;min-height:100%;padding:72px 16px 0;text-align:center">' +
      '<div style="font-size:84px;font-weight:200;letter-spacing:-0.06em;line-height:1">9:00</div>' +
      '<div style="font-size:18px;font-weight:500;margin-top:4px;opacity:.92">Saturday 21 November</div>' +
      '<div style="margin:54px 0 0;background:rgba(18,32,64,.72);border:1px solid rgba(255,255,255,.22);border-radius:22px;padding:12px 14px 13px;text-align:left">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:12.5px;font-weight:700">RATE BUDDIES<span style="margin-left:auto;opacity:.75;font-weight:500">now</span></div>' +
      "<h2 style=\"margin:0 0 4px;font-size:16px;font-weight:800;letter-spacing:-0.03em\">Google Review time</h2>" +
      "<p style=\"margin:0;font-size:14px;line-height:1.35;opacity:.95\">3 members are ready for your Google Review. Tap to open Rate Buddies.</p></div>" +
      '<div style="position:absolute;left:0;right:0;bottom:22px;text-align:center;font-size:13px;font-weight:600;opacity:.7">Swipe up to open</div></div></section>';
  }

  function toast(msg) { if (T().toast) T().toast(msg); }

  function handle(e) {
    var el = e.target.closest("[data-action]");
    if (!el) return false;
    var action = el.getAttribute("data-action");
    var id = el.getAttribute("data-id");
    if (action === "rb-toggle-avail") {
      if (atReceivedCap(me().id)) { toast("Your listing is protected until tomorrow."); return true; }
      setMeAvailable(!isMeAvailable());
      T().go("reviews");
      return true;
    }
    if (action === "rb-filter") {
      save(LS_FILTER, id);
      T().go("reviews");
      return true;
    }
    if (action === "rb-only-avail") {
      save(LS_ONLY, !load(LS_ONLY, false));
      T().go("reviews");
      return true;
    }
    if (action === "rb-remind-me") {
      addReminder(id, tomorrowNineIso(), "Tomorrow, 9:00 AM");
      toast("Added to your Google Review reminders for tomorrow at 9:00 AM.");
      T().go("reviews");
      return true;
    }
    if (action === "rb-leave") {
      /* Ideas only — never auto-post. */
      S().selectedMember = id;
      if (T().go) T().go("review-ideas");
      else toast("Write the Google Review yourself, in your own words, after a real job.");
      return true;
    }
    if (action === "rb-view") {
      S().selectedMember = id;
      T().go("member");
      return true;
    }
    if (action === "rb-incoming") {
      if (T().go) T().go("incoming-swap");
      else toast("Open Incoming swap requests.");
      return true;
    }
    if (action === "rb-set-time") {
      toast("Reminder set for tomorrow, 9:00 AM (Australia/Perth).");
      scheduleNotification(Math.max(3, reminders().length), "Tomorrow, 9:00 AM");
      return true;
    }
    return false;
  }


  function icoStroke(d, px) {
    px = px || 22;
    return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>";
  }
  var MORE_ICOS = {
    user: icoStroke('<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0114 0"/>'),
    people: icoStroke('<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="3.4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>'),
    chat: icoStroke('<path d="M21 12a8 8 0 01-8 8H7l-4 3V12a8 8 0 018-8h2a8 8 0 018 8z"/>'),
    pin: icoStroke('<path d="M12 21s7-5.4 7-11a7 7 0 10-14 0c0 5.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.2"/>'),
    spark: icoStroke('<path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8z"/><path d="M19 15l.7 2.1L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.9z"/>'),
    play: icoStroke('<path d="M8 6.5v11L19 12z"/>'),
    gear: icoStroke('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/>'),
    crown: icoStroke('<path d="M3 19h18"/><path d="M5 19V9l4.2 3.2L12 6l2.8 6.2L19 9v10"/>'),
    send: icoStroke('<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>'),
    help: icoStroke('<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 015.8 1c0 2-3 2.5-3 4.5"/><path d="M12 17.5h.01"/>'),
    chev: icoStroke('<path d="M9 6l6 6-6 6"/>', 20)
  };
  function moreTile(go, kind, ico, label) {
    var well = '<span class="v21-more-ico' + (kind ? " " + kind : "") + '">' + ico + "</span>";
    return '<button type="button" class="v21-more-tile" data-go="' + esa(go) + '">' + well + "<span>" + esc(label) + "</span></button>";
  }
  function renderMore() {
    var I = me();
    var name = ((I.first || "") + " " + (I.last || "")).trim() || "Member";
    var biz = I.business || I.trade || "";
    var sub = biz ? (biz + " · View your profile") : "View your profile";
    var forYou = [
      moreTile("me", "", MORE_ICOS.user, "My profile"),
      moreTile("members", "", MORE_ICOS.people, "Members"),
      moreTile("chats", "", MORE_ICOS.chat, "Chats"),
      moreTile("my-regions", "", MORE_ICOS.pin, "Your areas"),
      moreTile("promo-queue", "fb", facebookFMore(), "Promotion queue"),
      moreTile("reviews", "g", googleG(20), "Reviews"),
      moreTile("ai-assistant", "", MORE_ICOS.spark, "AI assistant"),
      moreTile("tutorials", "", MORE_ICOS.play, "Tutorials")
    ].join("");
    var account = [
      moreTile("settings", "", MORE_ICOS.gear, "Settings"),
      moreTile("subscription", "", MORE_ICOS.crown, "Subscription"),
      moreTile("invite", "", MORE_ICOS.send, "Invite"),
      moreTile("help", "", MORE_ICOS.help, "Help")
    ].join("");
    return '<section class="screen has-tabs has-header" data-screen="more" data-more="v21">' +
      heroHeader("", "More") +
      '<div class="scroll v21-more">' +
      '<button type="button" class="v21-more-profile" data-go="me">' +
      avatar(I, 48) +
      '<div class="meta"><div class="nm">' + esc(name) + '</div><div class="sub">' + esc(sub) + "</div></div>" +
      '<span class="chev" aria-hidden="true">' + MORE_ICOS.chev + "</span></button>" +
      '<div class="v21-more-sec">For you</div>' +
      '<div class="v21-more-card"><div class="v21-more-grid">' + forYou + "</div></div>" +
      '<div class="v21-more-sec">Account</div>' +
      '<div class="v21-more-card"><div class="v21-more-grid">' + account + "</div></div>" +
      '<button type="button" class="v21-signout" data-go="welcome">Sign out</button>' +
      '<p class="v21-ver">Rate Buddies v2.1.1</p>' +
      "</div></section>";
  }
  function facebookFMore() {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="#fff" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg>';
  }

  function enhanceTabLabel() {
    var tab = document.getElementById("tab-reviews");
    if (!tab) return;
    var label = tab.childNodes[tab.childNodes.length - 1];
    var existing = tab.querySelector(".tab-lab");
    if (existing) { existing.textContent = "Reviews"; return; }
    /* Replace trailing text node "Reviews" */
    for (var i = 0; i < tab.childNodes.length; i++) {
      if (tab.childNodes[i].nodeType === 3 && /Reviews/.test(tab.childNodes[i].textContent)) {
        var span = document.createElement("span");
        span.className = "tab-lab";
        span.textContent = "Reviews";
        tab.replaceChild(span, tab.childNodes[i]);
        break;
      }
    }
  }

  function enhanceTabHeaders(id) {
    /* Tab screens keep their existing header (drawer + actions).
       v21.css restyles those headers: large title, floating white buttons. */
    return;
  }

  function paintMemberCardAccents() {
    document.querySelectorAll(".member-card, .req-card").forEach(function (card) {
      var tradeEl = card.querySelector(".t-pill, [data-trade], .meta .tags");
      var trade = "";
      if (tradeEl) trade = (tradeEl.getAttribute("data-trade") || tradeEl.textContent || "").trim();
      if (!trade) return;
      var st = tradeStyle(trade);
      card.style.setProperty("--trade-accent", st.accent);
    });
  }

  function afterGo(id) {
    enhanceTabLabel();
    enhanceTabHeaders(id);
    paintMemberCardAccents();
    /* Keep the More screen free of the prototype Demo sign-up tile. */
    if (id === "more" || id === "drawer") {
      document.querySelectorAll(".screen[data-screen='more'] [data-action='demo-signup'], .screen[data-screen='more'] .apps-section").forEach(function (el) {
        if (el.getAttribute("data-action") === "demo-signup" || /Prototype/i.test(el.textContent || "")) el.remove();
      });
    }
  }

  function install() {
    /* Hook avatar everywhere (app.js calls window.TC21.avatar at render time). */
    if (root.TC12 && TC12.render) {
      var prev = TC12.render;
      TC12.render = function (id) {
        if (id === "reviews" || id === "reviews-back") return renderReviews();
        if (id === "more" || id === "drawer") return renderMore();
        if (id === "google-review-time" || (id === "lockscreen" && S()._grLock)) return renderLockNotif();
        return prev(id);
      };
    }
    document.addEventListener("click", function (e) {
      if (handle(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
    var prevAfter = root.TC20 && TC20.afterGo;
    if (root.TC20) {
      TC20.afterGo = function (id) {
        if (prevAfter) prevAfter(id);
        afterGo(id);
      };
    } else if (root.TC12) {
      var pa = TC12.afterGo;
      TC12.afterGo = function (id) { if (pa) pa(id); afterGo(id); };
    }
    enhanceTabLabel();
    /* Re-render if the first go() ran before this file hooked avatars / reviews. */
    var cur = S().screen;
    if (cur && cur !== "welcome" && T().go) {
      try { T().go(cur); } catch (err) {}
    }
  }

  root.TC21 = {
    avatar: avatar,
    tradeStyle: tradeStyle,
    tradeKey: tradeKey,
    renderReviews: renderReviews,
    renderMore: renderMore,
    renderLockNotif: renderLockNotif,
    afterGo: afterGo,
    isMeAvailable: isMeAvailable,
    notificationGap: function () { return notificationGap; },
    VERSION: "2.1.1"
  };
  install();
})(typeof window !== "undefined" ? window : this);
