/* Rate Buddies — prototype v1.7.1 */
(function () {
  "use strict";

  function T() { return window.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function esc(s) { return T().escapeText ? T().escapeText(s) : String(s == null ? "" : s); }
  function esa(s) { return T().escapeAttr ? T().escapeAttr(s) : String(s == null ? "" : s).replace(/"/g, "&quot;"); }
  function ico(n) { return T().icon ? T().icon(n) : ""; }
  function av(m, n) { return T().avatarHTML(m, n); }
  function fn(m) { return T().fullName(m); }
  function rn(id) { return (T().formatRegionPill || T().regionName)(id); }
  function toast(m) { if (T().toast) T().toast(m); }
  function go(id, mid) { T().go(id, mid); }

  function svg(p, w) {
    w = w || 20;
    return '<svg viewBox="0 0 24 24" width="' + w + '" height="' + w + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + p + "</svg>";
  }
  const I = {
    menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    bell: svg('<path d="M18 8A6 6 0 106 8c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21a2 2 0 004 0"/>'),
    chat: svg('<path d="M21 12a8 8 0 01-8 8H7l-4 3V12a8 8 0 018-8h2a8 8 0 018 8z"/>'),
    star: svg('<path d="M12 3l2.6 5.4L20 9.3l-4 3.9.9 5.5L12 16.2 7.1 18.7 8 13.2 4 9.3l5.4-.9z"/>'),
    pin: svg('<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.2"/>'),
    user: svg('<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0114 0"/>'),
    regions: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>'),
    fb: svg('<path d="M14 8h3V4h-3a5 5 0 00-5 5v3H6v4h3v7h4v-7h3l1-4h-4V9a1 1 0 011-1z" stroke-width="1.6"/>'),
    google: '<span class="gmark" aria-hidden="true">G</span>',
    invite: svg('<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="3.5"/><path d="M19 8v6M16 11h6"/>'),
    help: svg('<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 115 1c0 1.5-2.5 2-2.5 3.5"/><path d="M12 17.5h.01"/>'),
    sub: svg('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/>'),
    gear: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9c.3.6.9 1 1.6 1.1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>'),
    out: svg('<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    send: svg('<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>'),
    play: svg('<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>'),
    file: svg('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/>'),
    loc: svg('<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.2"/>'),
    tick: '<span class="ticks deliv">OK</span>',
    tickRead: '<span class="ticks read">OK</span>'
  };
  I.tick = '<span class="ticks deliv">++ </span>'.replace("++", "\u2713\u2713");
  I.tickRead = '<span class="ticks read">++ </span>'.replace("++", "\u2713\u2713");

  const LS = {
    rel: "tc12_relations",
    given: "tc12_reviews_given",
    they: "tc12_they_reviewed",
    req: "tc12_requests",
    ideas: "tc12_used_ideas",
    chats: "tc12_chats",
    notif: "tc12_notif",
    glink: "tc12_google_link"
  };

  const SEED_REL = {
    sarah: "friends", liam: "pending", priya: "friends", jack: "friends",
    mei: "none", daniel: "pending", emma: "friends", marcus: "none",
    tom: "friends", hannah: "none", chris: "friends"
  };
  const SEED_GIVEN = { sarah: 1, priya: 1, chris: 1 };
  const SEED_THEY = { sarah: 1, jack: 1, chris: 1, tom: 1 };
  const SEED_REQ = [
    { id: "r1", from: "jack", to: "jamie", dir: "in", status: "open", at: "Today 7:12 am" },
    { id: "r2", from: "tom", to: "jamie", dir: "in", status: "open", at: "Yesterday" },
    { id: "r3", from: "jamie", to: "sarah", dir: "out", status: "done", at: "Mon" },
    { id: "r4", from: "jamie", to: "priya", dir: "out", status: "open", at: "Tue" }
  ];
  const GMAP = {
    jamie: { rating: "4.9", count: 128 }, sarah: { rating: "4.8", count: 86 },
    liam: { rating: "4.7", count: 54 }, priya: { rating: "4.9", count: 71 },
    jack: { rating: "4.6", count: 93 }, mei: { rating: "4.8", count: 40 },
    daniel: { rating: "4.5", count: 33 }, emma: { rating: "4.7", count: 61 },
    marcus: { rating: "4.8", count: 29 }, tom: { rating: "4.6", count: 47 },
    hannah: { rating: "4.9", count: 22 }, chris: { rating: "4.8", count: 58 }
  };
  const JOBS = {
    "Pest Control": ["Termite inspection", "General pest treatment", "Pre-purchase inspection", "Rodent control", "Cockroach treatment"],
    "Carpenter": ["Kitchen install", "Decking", "Home renovation", "Custom cabinetry", "Door hanging"],
    "Plumber": ["Blocked drain", "Hot water install", "Bathroom fit-out", "Leak repair", "Toilet repair"],
    "Painter": ["Interior repaint", "Exterior painting", "Room refresh", "Commercial paint job"],
    "Electrician": ["Power points", "Safety switch upgrade", "Lighting install", "Switchboard work"],
    "Landscaper": ["Garden design", "Paving", "Retaining wall", "Turf laying"],
    "Roofer": ["Roof repair", "Gutter replacement", "Roof restoration"],
    "Air Conditioning": ["Split-system install", "Service and clean", "Repair call-out"],
    "Tiler": ["Bathroom tiling", "Kitchen splashback", "Floor tiling"],
    "Fencer": ["Colorbond fence", "Timber fence", "Gate install"],
    "Handyman": ["Home repairs", "Flat-pack assembly", "General maintenance"],
    "Locksmith": ["Lock change", "Emergency call-out", "Key cutting"]
  };
  const SUBURBS = ["Midland", "Ellenbrook", "Joondalup", "Mundaring", "Kwinana", "Rockingham", "Fremantle", "Armadale", "Morley", "Osborne Park", "Whitfords", "Byford"];
  const MONTHS = ["July", "August", "September", "October", "November"];
  const STANDS = [
    { id: "ontime", label: "On time" },
    { id: "clean", label: "Left it clean" },
    { id: "explained", label: "Explained clearly" },
    { id: "price", label: "Fair price" },
    { id: "friendly", label: "Friendly" },
    { id: "quality", label: "Quality work" },
    { id: "again", label: "Would use again" }
  ];
  const STARTERS = [
    "Had {job} done by {business} in {suburb} this {month}.",
    "{first} from {business} came out to {suburb} for a {job}.",
    "Used {business} for {job} in {suburb}.",
    "Needed a {job} around {suburb} and went with {name} at {business}.",
    "{business} looked after our {job} in {suburb} this {month}.",
    "Called {name} at {business} when we needed a {job} in {suburb}.",
    "Booked {business} for a {job} in {suburb}.",
    "{name} at {business} handled a {job} for us in {suburb}."
  ];
  const MID = {
    ontime: ["Arrived when they said they would.", "Turned up on time.", "Kept to the time they gave us."],
    clean: ["Left the place tidy afterwards.", "Worked cleanly and packed up after.", "No mess left behind."],
    explained: ["Explained the work in plain words.", "Talked us through the job clearly.", "Made the next steps easy to follow."],
    price: ["The quote felt fair.", "The price was clear from the start.", "No surprise costs."],
    friendly: ["Friendly and easy to deal with.", "Pleasant to have on site.", "Good to work with."],
    quality: ["The finish was neat.", "Solid, careful work.", "Happy with the standard of the job."],
    again: ["Would book them again.", "I would use them next time.", "Happy to call them back."]
  };

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return fallback;
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  var rel = load(LS.rel, null) || Object.assign({}, SEED_REL);
  var given = load(LS.given, null) || Object.assign({}, SEED_GIVEN);
  var they = load(LS.they, null) || Object.assign({}, SEED_THEY);
  var reqs = load(LS.req, null) || SEED_REQ.slice();
  var usedIdeas = load(LS.ideas, null) || {};
  var notif = load(LS.notif, null) || {
    messages: true, mentions: true, reviews: true, members: true,
    quietOn: false, quietFrom: "21:00", quietTo: "07:00"
  };
  var googleLink = load(LS.glink, "") || "https://search.google.com/local/writereview?placeid=demo-hale-pest";

  function persist() {
    save(LS.rel, rel); save(LS.given, given); save(LS.they, they);
    save(LS.req, reqs); save(LS.ideas, usedIdeas); save(LS.notif, notif);
    save(LS.glink, googleLink);
  }

  function member(id) {
    var list = T().MEMBERS || [];
    return list.find(function (m) { return m.id === id; }) || list[1] || {};
  }
  function gLink(m) {
    return "https://search.google.com/local/writereview?placeid=demo-" + m.id;
  }
  function relOf(m) { return rel[m.id] || "none"; }
  function iReviewed(m) { return !!given[m.id]; }
  function theyReviewed(m) { return !!they[m.id]; }
  function incomingOpen(id) {
    return reqs.some(function (r) { return r.dir === "in" && r.from === id && r.status === "open"; });
  }
  function needsMyReview(m) {
    return !iReviewed(m) && (theyReviewed(m) || incomingOpen(m.id));
  }
  function passRelFilter(m) {
    var f = S().relFilter || "all";
    if (f === "all") return true;
    if (f === "friends") return relOf(m) === "friends";
    if (f === "notfriends") return relOf(m) === "none";
    if (f === "pending") return relOf(m) === "pending";
    if (f === "need") return needsMyReview(m);
    return true;
  }
  function unreadTotal() {
    return (chats || []).reduce(function (n, c) { return n + (c.unread || 0); }, 0);
  }
  function chatCount() { return (chats || []).length; }
  function recentChats(n) {
    var list = (chats || []).slice();
    list.sort(function (a, b) { return (b.unread || 0) - (a.unread || 0); });
    return list.slice(0, n || 3);
  }
  function notifUnread() {
    return NOTIFS.filter(function (n) { return n.unread; }).length;
  }
  function bellBadge() {
    var n = notifUnread();
    return n ? '<span class="bell-dot">' + n + "</span>" : "";
  }
  function chatBadge() {
    var n = unreadTotal();
    return n ? '<span class="bell-dot" id="headerChatBadge">' + n + "</span>" : '<span class="bell-dot" id="headerChatBadge" hidden></span>';
  }
  function updateBadges() {
    var n = unreadTotal();
    ["tabChatBadge", "headerChatBadge"].forEach(function (id) {
      var b = document.getElementById(id);
      if (!b) return;
      b.textContent = n ? String(n) : "";
      b.hidden = !n;
    });
  }

  function topbar(title, right) {
    return '<div class="app-header">' +
      '<div class="header-left"><button class="icon-btn" data-action="open-drawer" aria-label="Open menu">' + I.menu + "</button></div>" +
      '<div class="ht">' + title + "</div>" +
      '<div class="header-right">' + (right || "") +
      '<button class="icon-btn bell-btn" data-go="chats" aria-label="Chats">' + I.chat + chatBadge() + "</button>" +
      '<button class="icon-btn bell-btn" data-go="notifications" aria-label="Notifications">' + I.bell + bellBadge() + "</button>" +
      "</div></div>";
  }

function googleG(size, mono) {
    size = size || 18;
    if (mono) {
      return '<svg class="g-ico" viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09zM12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23zM5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84zM12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
    }
    return '<svg class="g-ico g-color" viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
  }
function facebookF(size, color) {
    size = size || 18;
    var fill = color || "currentColor";
    return '<svg class="f-ico" viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="' + fill + '" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg>';
  }
  function peopleIco(size) {
    size = size || 18;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="3.5"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>';
  }
  function personPlusIco(size) {
    size = size || 18;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="3.5"/><path d="M19 8v6M16 11h6"/></svg>';
  }
  function shieldCheckIco(size) {
    size = size || 18;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-3z"/><path d="M8.5 12l2.5 2.5 5-5"/></svg>';
  }
  function lockIco(size) {
    size = size || 18;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>';
  }
  function megaIco(size) {
    size = size || 18;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10v4h4l6 4V6L7 10H3z"/><path d="M16.8 8.2a4.2 4.2 0 010 7.6"/><path d="M18.7 5.6a8 8 0 010 12.8"/></svg>';
  }
  function chatIco(size) {
    size = size || 18;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 01-8 8H7l-4 3V12a8 8 0 018-8h2a8 8 0 018 8z"/></svg>';
  }
  var NOTIF_STYLE = {
    review: { bg: "#E8F1FD", color: "#1A73E8", icon: "review" },
    queue: { bg: "#E8F1FD", color: "#1877F2", icon: "queue" },
    friend: { bg: "#E8F1FD", color: "#1877F2", icon: "friend" },
    member: { bg: "#E8F1FD", color: "#0D3F9C", icon: "member" },
    chat: { bg: "#EEF2F6", color: "#0B1F33", icon: "chat" },
    alert: { bg: "#FFF6E0", color: "#8A5A00", icon: "alert" },
    admin: { bg: "#EEF2F6", color: "#14314C", icon: "admin" },
    limit: { bg: "#F6E8E8", color: "#7A1F1A", icon: "limit" }
  };
  function notifGlyph(type, size) {
    size = size || 16;
    if (type === "review") return (typeof googleG === "function" ? googleG(size) : "");
    if (type === "queue") return facebookF(size);
    if (type === "friend") return facebookF(size);
    if (type === "member") return personPlusIco(size);
    if (type === "chat") return chatIco(size);
    if (type === "alert") return megaIco(size);
    if (type === "admin") return shieldCheckIco(size);
    if (type === "limit") return lockIco(size);
    return megaIco(size);
  }
  function notifTile(type, size) {
    var st = NOTIF_STYLE[type] || NOTIF_STYLE.alert;
    return '<div class="notif-ico" style="background:' + st.bg + ';color:' + st.color + '">' + notifGlyph(type, size || 16) + "</div>";
  }
  function fbMark() {
    return '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg>';
  }
  function starMark() {
    return googleG(13, true);
  }
  function statusIcon(cls, label, inner) {
    return '<span class="sb ' + cls + '" role="img" aria-label="' + label + '" title="' + label + '">' + inner + "</span>";
  }
  function statusIcons(m) {
    var r = relOf(m);
    var fb = r === "friends"
      ? statusIcon("sb-friends", "Facebook friends", fbMark())
      : r === "pending"
        ? statusIcon("sb-pending", "Friend request pending", fbMark())
        : statusIcon("sb-none", "Not connected on Facebook", fbMark());
    var bits = [fb];
    if (iReviewed(m)) bits.push(statusIcon("sb-you", "You reviewed them", starMark()));
    else if (needsMyReview(m)) bits.push(statusIcon("sb-need", "Needs your review", starMark()));
    if (theyReviewed(m)) bits.push(statusIcon("sb-they", "They reviewed you", starMark()));
    return '<div class="sb-row">' + bits.join("") + "</div>";
  }
  function statusLegend() {
    return '<div class="icon-legend" aria-label="Icon guide">' +
      '<span class="il">' + statusIcon("sb-friends", "Facebook friends", fbMark()) + "Friends</span>" +
      '<span class="il">' + statusIcon("sb-pending", "Friend request pending", fbMark()) + "Pending</span>" +
      '<span class="il">' + statusIcon("sb-none", "Not connected on Facebook", fbMark()) + "Not connected</span>" +
      '<span class="il">' + statusIcon("sb-you", "You reviewed them", starMark()) + "You reviewed</span>" +
      '<span class="il">' + statusIcon("sb-they", "They reviewed you", starMark()) + "They reviewed you</span>" +
      '<span class="il">' + statusIcon("sb-need", "Needs your review", starMark()) + "Needs your review</span>" +
      "</div>";
  }
  function statusPills(m, compact) {
    if (compact) return statusIcons(m);
    var r = relOf(m);
    var fb = r === "friends"
      ? '<span class="st st-friends">Facebook friends</span>'
      : r === "pending"
        ? '<span class="st st-pending">Request Pending</span>'
        : '<span class="st st-none">Not connected</span>';
    var mine = iReviewed(m)
      ? '<span class="st st-yes">You reviewed them</span>'
      : '<span class="st st-need">Not yet reviewed</span>';
    var theirs = theyReviewed(m)
      ? '<span class="st st-yes">They reviewed you</span>'
      : '<span class="st st-none">They have not reviewed you</span>';
    return '<div class="st-row">' + fb + mine + theirs + "</div>";
  }

  function memberCard(m) {
    var r = relOf(m);
    var actions = '<div class="card-actions">';
    if (r === "none") {
      actions += '<a class="friend-btn sm" data-action="mark-sent" data-id="' + m.id + '" href="' + esa(m.facebook) + '" target="_blank" rel="noopener noreferrer">' +
        ico("fb") + "<span>Add friend</span></a>";
    } else if (r === "pending") {
      actions += '<button type="button" class="friend-btn sm" style="background:#8A9BB0" data-action="mark-friends" data-id="' + m.id + '"><span>Pending</span></button>';
    }
    actions += '<button type="button" class="msg-btn sm" data-action="open-chat" data-id="' + m.id + '">' + I.chat + "<span>Message</span></button></div>";
    return '<div class="card member-card">' +
      '<button type="button" class="member-main" data-go="member" data-id="' + m.id + '">' +
      av(m, 52) +
      '<div class="meta"><div class="nm">' + esc(fn(m)) + "</div>" +
      '<div class="biz">' + esc(m.business) + "</div>" +
      '<div class="tags"><span class="pill t-pill">' + esc(m.trade) + "</span></div>" +
      statusIcons(m) +
      "</div></button>" + actions + "</div>";
  }

  /* v2.2.0 (Vishal, 22 Nov): Status chips replaced by ONE filter dropdown, same component as Reviews (rb-dd). Friends option added. relChips kept for rollback. */
  var REL_OPTS = [
    ["all", "All"],
    ["friends", "Friends"],
    ["notfriends", "Not friends yet"],
    ["pending", "Pending"],
    ["need", "Need my review"]
  ];
  function relChips() {
    var cur = S().relFilter || "all";
    var items = [
      ["all", "All"],
      ["notfriends", "Not friends yet"],
      ["pending", "Pending"],
      ["need", "Need my review"]
    ];
    return '<div class="rel-chips">' + items.map(function (it) {
      return '<button type="button" class="rel-chip' + (cur === it[0] ? " active" : "") + '" data-rel="' + it[0] + '">' + it[1] + "</button>";
    }).join("") + "</div>";
  }

  function relCount(id) {
    var keep = S().relFilter;
    S().relFilter = id;
    var n = 0;
    try { n = T().filteredMembers().length; } catch (e) {}
    S().relFilter = keep;
    return n;
  }
  function relDropdown() {
    var cur = S().relFilter || "all";
    var curO = REL_OPTS.filter(function (o) { return o[0] === cur; })[0] || REL_OPTS[0];
    var open = !!S()._relMenuOpen;
    var chev = '<svg class="rb-keep" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
    return '<div class="v21-sec-row rb-sec-filter rb-circle-filter"><div class="sec">Status</div>' +
      '<div class="rb-dd' + (open ? " open" : "") + '">' +
      '<button type="button" class="rb-dd-btn" data-action="rb-rel-menu" aria-haspopup="listbox" aria-expanded="' + (open ? "true" : "false") + '">' +
      esc(curO[1]) + " (" + relCount(curO[0]) + ")" + chev + "</button>" +
      '<div class="rb-dd-menu" role="listbox" aria-label="Filter Circle members">' +
      REL_OPTS.map(function (o) {
        return '<button type="button" role="option" aria-selected="' + (cur === o[0] ? "true" : "false") + '" class="rb-dd-opt' + (cur === o[0] ? " on" : "") + '" data-action="rb-rel" data-rel-id="' + o[0] + '"><span>' + esc(o[1]) + '</span><span class="rb-dd-n">' + relCount(o[0]) + "</span></button>";
      }).join("") +
      "</div></div></div>";
  }

  function renderMembers() {
    var st = S();
    /* v2.2.0: Trade row removed from Circle (flag RB_CIRCLE_TRADE brings it back); no hidden trade filter left applied. */
    if (!window.RB_CIRCLE_TRADE) st.tradeFilter = "All";
    var list = T().filteredMembers();
    var used = {};
    (T().MEMBERS || []).forEach(function (m) { if (!m.isMe) used[m.trade] = true; });
    var trades = ["All"].concat((T().TRADES || []).filter(function (t) { return used[t]; }));
    var countLabel = st.areaFilter === "mine"
      ? (list.length + " member" + (list.length === 1 ? "" : "s") + " in your areas")
      : (list.length + " member" + (list.length === 1 ? "" : "s") + " across Perth metro");
    var mineIds = (T().me() && T().me().regions) ? T().me().regions : [];
    var allMine = T().isAllMetro && T().isAllMetro(mineIds);
    return '<section class="screen has-tabs has-header" data-screen="members">' + topbar("Members") +
      '<div class="scroll">' + ((window.TC15 && TC15.fbStatsBlock && window.RB_FB_TILES !== "old") ? TC15.fbStatsBlock() : "") + '<p class="count-line">' + countLabel + "</p>" +
      '<div class="search-wrap"><div class="search">' + ico("search") + '<input id="memberSearch" type="search" placeholder="Search name or trade" value="' + esa(st.query || "") + '" autocomplete="off"></div><div id="searchAc" class="ac-drop" hidden></div></div>' +
      '<div style="height:10px"></div><div class="seg">' +
      '<button class="' + (st.areaFilter === "mine" ? "active" : "") + '" data-area="mine">My areas</button>' +
      '<button class="' + (st.areaFilter === "all" ? "active" : "") + '" data-area="all">All Perth metro</button>' +
      '</div>' + (window.RB_CIRCLE_CHIPS ? relChips() : relDropdown()) +
      (window.RB_CIRCLE_TRADE ? '<div style="height:8px"></div><div class="chips">' +
      trades.map(function (t) { return '<button class="chip' + (st.tradeFilter === t ? " active" : "") + '" data-trade="' + esa(t) + '">' + t + "</button>"; }).join("") +
      "</div>" : "") +
      (st.tipDismissed ? '<div style="height:10px"></div>' : '<div class="banner info" style="margin:8px 0 14px" id="tipBanner">Tap Add friend to send a Facebook request, or Message to chat in the app. Weekly meet-ups stay offline. <button class="link" data-action="dismiss-tip" style="margin-left:6px">Got it</button></div>') +
      statusLegend() +
      '<div id="memberList">' + (list.length ? list.map(function (m) { return (window.TC12 && TC12.memberCard) ? TC12.memberCard(m) : memberCard(m); }).join("") : '<div class="empty"><h3>No members match</h3><p>' + ((st.relFilter && st.relFilter !== "all") ? "Try setting Status to All, choose All Perth metro, or clear the search." : "Try All Perth metro, or clear the search.") + "</p></div>") +
      "</div></div></section>";
  }

  function gBadge(m) {
    var g = GMAP[m.id] || { rating: "\u2014", count: 0 };
    return '<div class="g-badge">' + googleG(14) + " " + g.rating + " \u00b7 " + g.count + " Google Reviews</div>";
  }

  function renderMember(id) {
    var m = member(id || S().selectedMember);
    S().selectedMember = m.id;
    var r = relOf(m);
    var fbCta = r === "friends"
      ? '<a class="btn btn-fb btn-lg" href="' + esa(m.facebook) + '" target="_blank" rel="noopener noreferrer"><span style="display:flex;align-items:center;gap:8px;font-size:16px;font-weight:800">' + ico("fb") + " Open Facebook profile</span><small>You are marked as friends</small></a>"
      : r === "pending"
        ? '<a class="btn btn-fb btn-lg" href="' + esa(m.facebook) + '" target="_blank" rel="noopener noreferrer" data-action="mark-sent" data-id="' + m.id + '"><span style="display:flex;align-items:center;gap:8px;font-size:16px;font-weight:800">' + ico("fb") + " Open Facebook profile</span><small>Friend request pending \u2014 tap Friends once they accept</small></a>"
        : '<a class="btn btn-fb btn-lg" href="' + esa(m.facebook) + '" target="_blank" rel="noopener noreferrer" data-action="mark-sent" data-id="' + m.id + '"><span style="display:flex;align-items:center;gap:8px;font-size:16px;font-weight:800">' + ico("fb") + " Open Facebook profile</span><small>Send a friend request</small></a>";
    var mark = r === "pending"
      ? '<button class="btn btn-ghost ink" data-action="mark-friends" data-id="' + m.id + '">Mark as friends</button>'
      : r === "none"
        ? '<button class="btn btn-ghost ink" data-action="mark-sent" data-id="' + m.id + '">Mark request as sent</button>'
        : "";
    var pageBtn = "";
    var phoneRow = m.phone ? '<div class="info-row"><div class="ic">' + ico("phone") + '</div><div><div class="k">Phone</div><div class="v">' + esc(m.phone) + "</div></div></div>" : "";
    return '<section class="screen has-header" data-screen="member">' +
      '<div class="app-header"><button class="icon-btn" data-go="members" aria-label="Back">' + ico("back") + '</button><div class="ht">Member</div>' +
      '<button class="icon-btn" data-action="open-chat" data-id="' + m.id + '" aria-label="Message">' + I.chat + "</button></div>" +
      '<div class="scroll"><div class="profile-hero">' + av(m, 96) +
      '<div class="nm">' + esc(fn(m)) + '</div><div class="biz">' + esc(m.business) + "</div>" +
      '<div class="tags"><span class="pill t-pill">' + esc(m.trade) + "</span>" +
      m.regions.map(function (x) { return '<span class="pill r-pill">' + rn(x) + "</span>"; }).join("") +
      "</div>" + gBadge(m) + statusPills(m, false) +
      "</div><p class=\"bio\">" + esc(m.bio) + "</p>" +
      '<div class="action-stack">' + fbCta +
      '<a class="btn btn-primary" href="' + esa(gLink(m)) + '" target="_blank" rel="noopener noreferrer" data-action="open-ideas" data-id="' + m.id + '">Leave a Google review</a>' +
      '<button class="btn btn-ghost ink" data-action="ask-review" data-id="' + m.id + '">Ask for review swap</button>' +
      '<button class="btn btn-ghost ink" data-action="open-chat" data-id="' + m.id + '">Message</button>' +
      mark + pageBtn + "</div>" +
      '<p class="hint" style="text-align:center;margin-top:10px">Only review businesses you have actually used. Friend requests are sent on Facebook, not inside this app.</p>' +
      (T().selectedAreasCard ? T().selectedAreasCard(m.regions || [], { title: "Areas they work in" }) : "") +
      '<div class="info-rows">' + phoneRow +
      '<div class="info-row"><div class="ic">' + ico("link") + '</div><div><div class="k">Facebook profile</div><div class="v">' + esc(String(m.facebook).replace("https://www.", "")) + "</div></div></div>" +
      "</div></div></section>";
  }
  function renderMe() {
    var m = T().me();
    var phoneRow = m.phone ? '<div class="info-row"><div class="ic">' + ico("phone") + '</div><div><div class="k">Phone</div><div class="v">' + esc(m.phone) + "</div></div></div>" : "";
    var pageRow = "";
    return '<section class="screen has-tabs has-header" data-screen="me">' +
      topbar("My profile") +
      '<div class="scroll"><div class="profile-hero">' + av(m, 96) +
      '<div class="nm">' + esc(fn(m)) + ' <span class="you-badge">You</span></div>' +
      '<div class="biz">' + esc(m.business) + '</div><div class="tags"><span class="pill t-pill">' + esc(m.trade) + "</span>" +
      m.regions.map(function (x) { return '<span class="pill r-pill">' + rn(x) + "</span>"; }).join("") +
      "</div>" + (S().googleConnected ? gBadge(m) : '<div class="g-badge" style="background:#EEF2F6;color:#5B6B7C">Google profile not connected</div>') +
      "</div><p class=\"bio\">" + esc(m.bio) + "</p>" +
      '<div class="banner info">This is how other members see you. They can friend you on Facebook, message you here, or leave a Google review after a real job.</div>' +
      (T().selectedAreasCard ? T().selectedAreasCard(m.regions || [], { title: "My areas", changeTo: "my-regions", changeLabel: "Change", sub: "These are the regions on your profile. Change them here anytime." }) : "") +
      '<div class="info-rows">' + phoneRow +
      '<div class="info-row"><div class="ic">' + ico("link") + '</div><div><div class="k">Facebook profile</div><div class="v">' + esc(String(m.facebook || "").replace("https://www.", "")) + "</div></div></div>" +
      pageRow +
      (S().googleConnected ? '<div class="info-row"><div class="ic" style="background:#E8F1FD;color:#1A73E8">G</div><div><div class="k">Google review link</div><div class="v">' + esc(String(googleLink).replace("https://", "")) + "</div></div></div>" : "") +
      "</div></div></section>";
  }

  function renderSettings() {
    var m = T().me();
    var fbRow = S().fbConnected
      ? '<button class="set-row" type="button" data-go="edit-profile"><span class="ic" style="background:#E8F1FD;color:#1877F2">' + ico("fb") + '</span><span class="lab"><span class="a">Facebook: Connected</span><span class="b">' + esc(String(m.facebook || T().demoFbLink()).replace("https://www.", "")) + '</span></span><span class="chev">' + ico("chev") + "</span></button>"
      : '<button class="set-row" type="button" data-action="fb-connect" data-next="settings"><span class="ic" style="background:#E8F1FD;color:#1877F2">' + ico("fb") + '</span><span class="lab"><span class="a">Connect Facebook</span><span class="b">One tap to add your profile link</span></span><span class="chev">' + ico("chev") + "</span></button>";
    var gRow = S().googleConnected
      ? '<button class="set-row" type="button" data-action="google-manage"><span class="ic" style="background:#F5F8FF;color:#1A73E8;font-weight:800">G</span><span class="lab"><span class="a">Google Business Profile: Connected</span><span class="b">Members can open your review link</span></span><span class="chev">' + ico("chev") + "</span></button>"
      : '<button class="set-row" type="button" data-action="google-connect"><span class="ic" style="background:#F5F8FF;color:#1A73E8;font-weight:800">G</span><span class="lab"><span class="a">Connect Google Business Profile</span><span class="b">Add a review link for members</span></span><span class="chev">' + ico("chev") + "</span></button>";
    return '<section class="screen has-tabs has-header" data-screen="settings">' + topbar("Settings") +
      '<div class="scroll"><p class="group-label">Account</p><div class="card group">' +
      '<button class="set-row" data-go="me"><span class="ic" style="background:#E8F1FD;color:#0D3F9C">' + I.user + '</span><span class="lab"><span class="a">View my profile</span><span class="b">' + esc(fn(m)) + " \u00b7 " + esc(m.trade) + '</span></span><span class="chev">' + ico("chev") + "</span></button>" +
      '<button class="set-row" data-go="edit-profile"><span class="ic" style="background:#EEF2F6;color:#14314C">' + ico("pencil") + '</span><span class="lab"><span class="a">Edit profile and regions</span><span class="b">Name, trade, links, areas</span></span><span class="chev">' + ico("chev") + "</span></button>" +
      fbRow + gRow +
      '</div><p class="group-label">Notifications</p><div class="card group">' +
      '<button class="set-row" data-go="notif-settings"><span class="ic" style="background:#FFF6E0;color:#8A5A00">' + I.bell + '</span><span class="lab"><span class="a">Notification settings</span><span class="b">Messages, reviews, new members, quiet hours</span></span><span class="chev">' + ico("chev") + "</span></button>" +
      '</div><p class="group-label">How the circle works</p>' +
      '<div class="card group" style="padding:12px 14px"><p style="font-size:14px;font-weight:600;line-height:1.5;color:var(--text)">Only recommend members you have actually met or worked with, and say so in your comment. Weekly catch-ups are organised in person, not in this app. Only leave a Google review after a real job, in your own words.</p></div>' +
      '<p class="group-label">About</p><div class="card group">' +
      '<div class="set-row"><span class="lab"><span class="a">App name</span><span class="b">Rate Buddies</span></span></div>' +
      '<div class="set-row"><span class="lab"><span class="a">Version</span><span class="b">UI prototype v2.2.1 \u00b7 22 Nov 2026</span></span></div></div>' +
      '<button class="btn btn-ghost ink" data-go="welcome" style="margin-top:14px;color:var(--danger);border-color:#F3C4C4">Sign out</button>' +
      '<p class="settings-foot" style="padding-top:12px">Fictional demo data only.</p></div></section>';
  }

  function gBlock() {
    if (S().googleConnected) {
      return '<div class="g-card" data-g-block="1"><div class="gmark">G</div><div style="flex:1;min-width:0"><div class="fb-card-k">Google Business Profile connected</div>' +
        '<div class="fb-card-n">Hale Pest Control</div>' +
        '<div class="fb-card-l">' + esc(String(googleLink).replace("https://", "")) + '</div></div>' +
        '<button type="button" class="fb-disconnect" data-action="google-disconnect">Disconnect</button></div>';
    }
    return '<div data-g-block="1"><button type="button" class="btn btn-google" data-action="google-connect">' + I.google + " Connect Google Business Profile</button>" +
      '<div class="or-line"><span>or paste your review link</span></div>' +
      '<div class="field"><label>Google review link</label><input name="google" inputmode="url" placeholder="Paste your Google Review link" value="' + esa(googleLink) + '">' +
      '<p class="hint">Prototype only \u2014 a real build would use Google official Business Profile connection. Members use this link to leave a review after a real job.</p></div></div>';
  }

  function injectGoogle() {
    var form = document.querySelector("form[data-form='create-profile'], form[data-form='edit-profile']");
    if (!form || form.querySelector("[data-g-block]")) return;
    var anchor = null;
    form.querySelectorAll(".group-label").forEach(function (lab) {
      if (/facebook profile/i.test(lab.textContent)) anchor = lab;
    });
    var wrap = document.createElement("div");
    wrap.innerHTML = '<div class="group-label">Google Business Profile</div>' + gBlock();
    var fbBlock = form.querySelector("[data-fb-block], .fb-card, .fb-connect, [data-action='fb-connect']");
    if (fbBlock && fbBlock.parentNode) {
      var after = fbBlock.closest(".field") || fbBlock;
      after.parentNode.insertBefore(wrap, after.nextSibling);
    } else if (anchor && anchor.parentNode) {
      var next = anchor.nextElementSibling;
      if (next) next.parentNode.insertBefore(wrap, next.nextSibling);
      else anchor.parentNode.appendChild(wrap);
    } else {
      form.insertBefore(wrap, form.querySelector("[type='submit']") || null);
    }
  }

  function renderReviews() {
    var incoming = reqs.filter(function (r) { return r.dir === "in"; });
    var outgoing = reqs.filter(function (r) { return r.dir === "out"; });
    var openIn = incoming.filter(function (r) { return r.status === "open"; }).length;
    var html = '<section class="screen has-tabs has-header" data-screen="reviews">' + topbar("Reviews") +
      '<div class="scroll"><div class="rev-counts">' +
      '<div class="rev-count"><div class="n">' + openIn + '</div><div class="l">Requests to write</div></div>' +
      '<div class="rev-count"><div class="n">' + outgoing.length + '</div><div class="l">Requests you sent</div></div>' +
      "</div>" +
      '<div class="notice">This helper gives ideas only. Write the review yourself, and only for a job you actually had done.</div>' +
      '<p class="group-label">Requests received</p>';
    incoming.forEach(function (r) {
      var m = member(r.from);
      html += '<div class="card req-card"><div style="display:flex;gap:10px;align-items:center">' + av(m, 44) +
        '<div><div class="who">' + esc(fn(m)) + '</div><div class="meta">' + esc(m.business) + " \u00b7 " + r.at + "</div></div></div>" +
        (r.status === "open"
          ? '<button class="btn btn-primary" style="margin-top:10px" data-action="open-ideas" data-id="' + m.id + '">Write review</button>'
          : '<p class="hint" style="margin-top:8px">You already left a review.</p>') +
        "</div>";
    });
    html += '<p class="group-label">Requests you sent</p>';
    outgoing.forEach(function (r) {
      var m = member(r.to);
      html += '<div class="card req-card"><div style="display:flex;gap:10px;align-items:center">' + av(m, 44) +
        '<div><div class="who">' + esc(fn(m)) + '</div><div class="meta">' + esc(m.business) + " \u00b7 " + r.at + " \u00b7 " +
        (r.status === "done" ? "They left a review" : "Waiting") + "</div></div></div></div>";
    });
    html += "</div></section>";
    return html;
  }

  function ideaState() {
    var st = S();
    st.reviewFor = st.reviewFor || "jack";
    st.ideaJob = st.ideaJob || "";
    st.ideaSuburb = st.ideaSuburb || "";
    st.ideaMonth = st.ideaMonth || "";
    st.ideaStands = st.ideaStands || [];
    st.reviewDraft = st.reviewDraft || "";
    st.pickedIdea = (typeof st.pickedIdea === "number") ? st.pickedIdea : -1;
    return st;
  }

  function hash(s) {
    var h = 0;
    String(s).split("").forEach(function (c) { h = ((h << 5) - h) + c.charCodeAt(0); h |= 0; });
    return Math.abs(h);
  }
  function fillTpl(tpl, map) {
    return tpl.replace(/\{(\w+)\}/g, function (_, k) { return map[k] || ""; });
  }
  function buildIdeas(m) {
    var st = ideaState();
    var job = st.ideaJob || (JOBS[m.trade] || ["the job"])[0];
    var suburb = st.ideaSuburb || "Midland";
    var month = st.ideaMonth || "October";
    var map = { business: m.business, name: fn(m), first: m.first, job: job.toLowerCase(), suburb: suburb, month: month };
    var used = usedIdeas[m.id] || [];
    var out = [];
    var i = 0;
    var guard = 0;
    while (out.length < 3 && guard < 40) {
      var starter = STARTERS[(hash(m.id + job + suburb + month + i) + i * 3) % STARTERS.length];
      var stands = (st.ideaStands.length ? st.ideaStands : ["quality"]).slice();
      var mids = stands.map(function (sid, idx) {
        var arr = MID[sid] || [];
        return arr.length ? arr[(hash(m.id + sid + i + idx) + i) % arr.length] : "";
      }).filter(Boolean);
      var text = [fillTpl(starter, map)].concat(mids).join(" ");
      if (used.indexOf(text) === -1 && out.indexOf(text) === -1) out.push(text);
      i++; guard++;
    }
    while (out.length < 3) {
      out.push(fillTpl(STARTERS[out.length % STARTERS.length], map) + " Write a short note in your own words about how the job went.");
    }
    return out;
  }

  function similar(a, b) {
    function toks(s) {
      return String(s).toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter(function (w) { return w.length > 3; });
    }
    var A = toks(a), B = toks(b);
    if (!A.length || !B.length) return 0;
    var set = {};
    B.forEach(function (w) { set[w] = 1; });
    var hit = A.filter(function (w) { return set[w]; }).length;
    return hit / Math.max(A.length, B.length);
  }

  function uniqNote(m, draft) {
    var samples = [];
    if (given[m.id] && given[m.id].text) samples.push(given[m.id].text);
    (usedIdeas[m.id] || []).forEach(function (t) { samples.push(t); });
    if (!draft || draft.length < 12) return { ok: true, msg: "Write the review in your own words before you copy it." };
    var worst = 0;
    samples.forEach(function (s) { worst = Math.max(worst, similar(draft, s)); });
    if (worst >= 0.7) return { ok: false, msg: "This looks very similar to an earlier suggestion for this business. Change it in your own words." };
    return { ok: true, msg: "Looks different enough \u2014 remember to edit it so it sounds like you." };
  }

  function renderReviewIdeas() {
    var st = ideaState();
    var m = member(st.reviewFor);
    var jobs = JOBS[m.trade] || ["General job"];
    if (!st.ideaJob) st.ideaJob = jobs[1] || jobs[0];
    if (!st.ideaSuburb) st.ideaSuburb = m.regions && m.regions[0] === "kwinana" ? "Kwinana" : "Joondalup";
    if (!st.ideaMonth) st.ideaMonth = "October";
    if (!st.ideaStands.length) st.ideaStands = ["ontime", "explained"];
    var ideas = buildIdeas(m);
    st._ideas = ideas;
    var u = uniqNote(m, st.reviewDraft);
    return '<section class="screen has-header" data-screen="review-ideas">' +
      '<div class="app-header"><button class="icon-btn" data-go="reviews" aria-label="Back">' + ico("back") + '</button><div class="ht">Review ideas</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div style="display:flex;gap:10px;align-items:center;margin-bottom:10px">' + av(m, 48) +
      '<div><div style="font-weight:800">' + esc(fn(m)) + '</div><div class="hint" style="margin:0">' + esc(m.business) + " \u00b7 " + esc(m.trade) + "</div></div></div>" +
      '<div class="notice">Only review businesses you have actually used. These are ideas and sentence starters, not finished reviews. Write in your own words.</div>' +
      '<p class="group-label">What job did they do?</p><div class="chips">' +
      jobs.map(function (j) { return '<button type="button" class="chip' + (st.ideaJob === j ? " active" : "") + '" data-idea-job="' + esa(j) + '">' + esc(j) + "</button>"; }).join("") +
      '</div><p class="group-label">Suburb</p><div class="chips">' +
      SUBURBS.map(function (j) { return '<button type="button" class="chip' + (st.ideaSuburb === j ? " active" : "") + '" data-idea-sub="' + esa(j) + '">' + esc(j) + "</button>"; }).join("") +
      '</div><p class="group-label">When</p><div class="chips">' +
      MONTHS.map(function (j) { return '<button type="button" class="chip' + (st.ideaMonth === j ? " active" : "") + '" data-idea-mo="' + esa(j) + '">' + esc(j) + "</button>"; }).join("") +
      '</div><p class="group-label">What stood out?</p><div class="chips">' +
      STANDS.map(function (j) { return '<button type="button" class="chip' + (st.ideaStands.indexOf(j.id) >= 0 ? " active" : "") + '" data-idea-st="' + j.id + '">' + esc(j.label) + "</button>"; }).join("") +
      '</div><p class="group-label">Ideas you can start from</p>' +
      ideas.map(function (t, i) {
        return '<button type="button" class="idea-card' + (st.pickedIdea === i ? " on" : "") + '" data-pick-idea="' + i + '">' + esc(t) + "</button>";
      }).join("") +
      '<button type="button" class="link" data-action="refresh-ideas" style="margin:4px 0 12px">Show different ideas</button>' +
      '<div class="field"><label>Write or edit your review</label><textarea id="reviewDraft" rows="4" placeholder="Use an idea as a starting point, then write it in your own words.">' + esc(st.reviewDraft) + "</textarea></div>" +
      '<div class="uniq ' + (u.ok ? "ok" : "bad") + '">' + u.msg + "</div>" +
      '<a class="btn btn-primary has-ico" href="' + esa(gLink(m)) + '" target="_blank" rel="noopener noreferrer" data-action="copy-open" data-id="' + m.id + '">' + googleG(18) + "<span>Copy and open Google</span></a>" +
      '<p class="hint" style="text-align:center">The text is copied so you can paste it into Google and change it before you post.</p></div></section>';
  }
  function seedChats() {
    return [
      {
        id: "dm-sarah", type: "dm", memberId: "sarah", pinned: true, muted: false, unread: 0, when: "8:04 am",
        preview: "Thanks \u2014 I will have a look this week",
        online: true,
        messages: [
          { id: "s1", from: "sarah", type: "text", text: "Morning Jamie, that termite check in Midland was a real help for my client.", time: "7:48 am", ticks: "read" },
          { id: "s2", from: "me", type: "text", text: "Glad it was useful. I will drop a review for the kitchen job too.", time: "7:51 am", ticks: "read", replyTo: { from: "Sarah", text: "that termite check in Midland was a real help" } },
          { id: "s3", from: "sarah", type: "text", text: "Legend. I will mention Hale Pest if anyone in the Hills group asks.", time: "7:53 am", ticks: "read", reactions: [{ e: "\ud83d\udc4d", n: 1 }] },
          { id: "s4", from: "me", type: "voice", duration: "0:08", time: "7:56 am", ticks: "read" },
          { id: "s5", from: "sarah", type: "photo", time: "8:01 am", ticks: "read" },
          { id: "s6", from: "me", type: "text", text: "Looks great. Thanks \u2014 I will have a look this week.", time: "8:04 am", ticks: "read" }
        ]
      },
      {
        id: "grp-hills", type: "group", region: "hills", name: "Hills tradies", pinned: true, muted: false, unread: 2, when: "7:40 am",
        preview: "@Jamie can you take a termite job in Mundaring?",
        messages: [
          { id: "h1", from: "mei", type: "text", text: "Morning team \u2014 I am in Mundaring today if anyone needs a hand on site.", time: "7:12 am" },
          { id: "h2", from: "tom", type: "location", place: "Stoneville, WA", time: "7:21 am" },
          { id: "h3", from: "mei", type: "file", fileName: "Site-notes.pdf", size: "240 KB", time: "7:28 am" },
          { id: "h4", from: "tom", type: "profile", memberId: "mei", time: "7:31 am" },
          { id: "h5", from: "mei", type: "link", url: "https://example.com/hills-tip", title: "Council tip hours \u2014 Hills", time: "7:36 am" },
          { id: "h6", from: "tom", type: "text", text: "@Jamie can you take a termite job in Mundaring this afternoon?", time: "7:40 am", mention: "Jamie" }
        ]
      },
      {
        id: "grp-north", type: "group", region: "north", name: "North tradies", pinned: false, muted: false, unread: 0, when: "Yesterday",
        preview: "Emma: Servicing in Joondalup tomorrow",
        messages: [
          { id: "n1", from: "emma", type: "text", text: "Servicing in Joondalup tomorrow if anyone has a client nearby.", time: "Yesterday" },
          { id: "n2", from: "chris", type: "text", text: "I might. I will message you.", time: "Yesterday" }
        ]
      },
      {
        id: "dm-jack", type: "dm", memberId: "jack", pinned: false, muted: false, unread: 1, when: "7:12 am",
        preview: "Could you leave a Google review when you get a minute?",
        online: false,
        messages: [
          { id: "j1", from: "jack", type: "text", text: "Thanks for coming out to Kwinana last month.", time: "7:05 am" },
          { id: "j2", from: "jack", type: "text", text: "Could you leave a Google review when you get a minute?", time: "7:12 am" }
        ]
      },
      {
        id: "dm-liam", type: "dm", memberId: "liam", pinned: false, muted: false, unread: 0, when: "Mon",
        preview: "Hey Jamie, just sent you a friend request",
        online: true,
        messages: [
          { id: "l1", from: "liam", type: "text", text: "Hey Jamie, just sent you a friend request.", time: "Mon" },
          { id: "l2", from: "me", type: "text", text: "Got it \u2014 I will accept after I jump on Facebook.", time: "Mon", ticks: "delivered" }
        ]
      }
    ];
  }
  var chats = load(LS.chats, null) || seedChats();
  if (!Array.isArray(chats) || !chats.length) chats = seedChats();

  function chatById(id) {
    return chats.find(function (c) { return c.id === id; });
  }
  function dmFor(memberId) {
    var c = chats.find(function (x) { return x.type === "dm" && x.memberId === memberId; });
    if (c) return c;
    c = { id: "dm-" + memberId, type: "dm", memberId: memberId, pinned: false, muted: false, unread: 0, when: "Now", preview: "", online: false, messages: [] };
    chats.unshift(c);
    return c;
  }

  function renderChats() {
    var q = (S().chatQuery || "").toLowerCase();
    var list = chats.filter(function (c) {
      if (!q) return true;
      var name = c.type === "group" ? c.name : fn(member(c.memberId));
      return (name + " " + (c.preview || "")).toLowerCase().indexOf(q) !== -1;
    });
    var pinned = list.filter(function (c) { return c.pinned; });
    var rest = list.filter(function (c) { return !c.pinned; });
    function row(c) {
      var m = c.type === "group" ? { first: c.name.split(" ")[0], last: "", color: "navy", isMe: false, trade: "Group" } : member(c.memberId);
      var name = c.type === "group" ? c.name : fn(m);
      var avHtml = c.type === "group"
        ? '<div style="width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font-weight:800;background:#0A1328;color:#7EC8FF">' + (c.id === "grp-north" ? "N" : "H") + "</div>"
        : av(m, 52);
      var online = c.type === "dm" ? '<span class="' + (c.online ? "dot-on" : "dot-off") + '"></span>' : "";
      if (c.type === "group" || !m || !m.id) {
        return '<button type="button" class="chat-row" data-action="open-thread" data-chat="' + c.id + '">' +
          '<div class="av-wrap">' + avHtml + online + "</div>" +
          '<div class="meta"><div class="nm">' + esc(name) + (c.muted ? ' <span class="muted-ico">M</span>' : "") + "</div>" +
          '<div class="prev">' + esc(c.preview) + "</div></div>" +
          '<div class="when">' + esc(c.when) + (c.unread ? '<div class="ub">' + c.unread + "</div>" : "") + "</div></button>";
      }
      return '<div class="chat-row">' +
        '<button type="button" class="mem-open av-wrap" data-go="member" data-id="' + m.id + '" aria-label="Open ' + esc(name) + ' profile">' + avHtml + online + "</button>" +
        '<div class="meta">' +
        '<button type="button" class="mem-open nm" data-go="member" data-id="' + m.id + '">' + esc(name) + (c.muted ? ' <span class="muted-ico">M</span>' : "") + "</button>" +
        '<button type="button" class="prev chat-open" data-action="open-thread" data-chat="' + c.id + '">' + esc(c.preview) + "</button></div>" +
        '<button type="button" class="when chat-open" data-action="open-thread" data-chat="' + c.id + '">' + esc(c.when) + (c.unread ? '<div class="ub">' + c.unread + "</div>" : "") + "</button></div>";
    }
    return '<section class="screen has-tabs has-header" data-screen="chats">' +
      topbar("Chats", '<button class="icon-btn" data-action="new-group" aria-label="New group">' + I.plus + "</button>") +
      '<div class="scroll"><div class="search-wrap"><div class="search">' + ico("search") + '<input id="chatSearch" type="search" placeholder="Search chats" value="' + esa(S().chatQuery || "") + '"></div></div>' +
      (pinned.length ? '<div class="pin-lab">Pinned</div>' + pinned.map(row).join("") : "") +
      (rest.length ? '<div class="pin-lab">Chats</div>' + rest.map(row).join("") : "") +
      "</div></section>";
  }

  function findMemberByName(from) {
    if (from === "me") return T().me();
    return member(from);
  }

  function bubble(msg, chat) {
    var mine = msg.from === "me";
    var inner = "";
    if (msg.replyTo) {
      inner += '<div class="quote">' + esc(msg.replyTo.from) + " \u2014 " + esc(msg.replyTo.text) + "</div>";
    }
    if (msg.type === "voice") {
      inner += '<div class="voice"><span class="play">' + I.play + '</span><span class="wave">';
      [8, 14, 10, 18, 12, 16, 9, 15, 11, 7].forEach(function (h) { inner += "<i style=\"height:" + h + 'px"></i>'; });
      inner += '</span><span style="font-size:11px;font-weight:800">' + (msg.duration || "0:08") + "</span></div>";
    } else if (msg.type === "photo") {
      inner += '<div class="photo-bub" role="img" aria-label="Photo of a finished kitchen"></div>';
    } else if (msg.type === "file") {
      inner += '<div class="file-row"><span class="file-ico">' + I.file + "</span><div><strong>" + esc(msg.fileName) + "</strong><div class=\"hint\" style=\"margin:0\">" + esc(msg.size || "") + "</div></div></div>";
    } else if (msg.type === "location") {
      inner += '<div class="loc-card"><span class="loc-ico">' + I.loc + "</span><div><strong>Location</strong><div class=\"hint\" style=\"margin:0\">" + esc(msg.place) + "</div></div></div>";
    } else if (msg.type === "profile") {
      var pm = member(msg.memberId);
      inner += '<div class="p-card">' + av(pm, 36) + "<div><strong>" + esc(fn(pm)) + "</strong><div class=\"hint\" style=\"margin:0\">" + esc(pm.business) + "</div></div></div>";
    } else if (msg.type === "link") {
      inner += '<div class="link-card"><div><strong>' + esc(msg.title) + '</strong><div class="hint" style="margin:0">' + esc((msg.url || "").replace("https://", "")) + "</div></div></div>";
    } else if (msg.type === "deleted") {
      inner += '<span class="deleted">Message deleted</span>';
    } else {
      var t = esc(msg.text || "");
      t = t.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
      inner += t;
      if (msg.edited) inner += ' <span class="edited">(edited)</span>';
    }
    if (msg.reactions && msg.reactions.length) {
      inner += '<div class="reacts">' + msg.reactions.map(function (r) { return "<span>" + r.e + " " + r.n + "</span>"; }).join("") + "</div>";
    }
    inner += '<div class="time">' + esc(msg.time || "") + (mine ? (msg.ticks === "read" ? I.tickRead : I.tick) : "") + "</div>";
    var who = mine ? "" : (chat.type === "group" ? '<div style="font-size:11px;font-weight:800;color:#5B6B7C;margin-bottom:2px">' + esc(fn(findMemberByName(msg.from))) + "</div>" : "");
    return '<div class="bub ' + (mine ? "out" : "in") + '" data-msg="' + msg.id + '" data-action="msg-menu">' + who + inner + "</div>";
  }

  function renderThread(chatId) {
    var preset = S().screen;
    var id = chatId || S().chatId || (preset === "chat-group" ? "grp-hills" : "dm-sarah");
    S().chatId = id;
    var c = chatById(id) || chats[0];
    c.unread = 0;
    var title, sub, avHtml;
    if (c.type === "group") {
      title = c.name;
      sub = "Group \u00b7 " + rn(c.region);
      avHtml = "";
    } else {
      var m = member(c.memberId);
      title = fn(m);
      sub = c.online ? "Online" : "Last seen 2h ago";
      avHtml = av(m, 32);
    }
    var headWho = (c.type !== "group" && m && m.id)
      ? ('<button type="button" class="mem-open chat-head-who" data-go="member" data-id="' + m.id + '" aria-label="Open ' + esc(title) + ' profile">' + avHtml +
        '<div class="ht" style="text-align:left">' + esc(title) + '<div style="font-size:11px;font-weight:600;color:var(--muted)">' + esc(sub) + "</div></div></button>")
      : (avHtml + '<div class="ht" style="text-align:left">' + esc(title) + '<div style="font-size:11px;font-weight:600;color:var(--muted)">' + esc(sub) + "</div></div>");
    return '<section class="screen has-header chat-screen" data-screen="' + (c.type === "group" ? "chat-group" : "chat-dm") + '">' +
      '<div class="app-header"><button class="icon-btn" data-go="chats" aria-label="Back">' + ico("back") + "</button>" +
      headWho +
      '<button class="icon-btn" data-action="chat-more" aria-label="More">...</button></div>' +
      '<div class="chat-thread" id="chatThread">' + c.messages.map(function (msg) { return bubble(msg, c); }).join("") + "</div>" +
      /* v2.2.0: quick-action chips removed from the chat (Vishal, 22 Nov). Handlers stay; set window.RB_CHAT_QUICK = true to bring them back. */
      (window.RB_CHAT_QUICK ? '<div class="quick-row">' +
      '<button type="button" data-action="ask-review-chat">Send review swap request</button>' +
      '<button type="button" data-action="share-my-profile">Share my profile</button>' +
      '<button type="button" data-action="share-location">Share location</button>' +
      "</div>" : "") +
      '<div class="chat-composer">' +
      '<button class="plus" data-action="attach" aria-label="Attach">' + I.plus + "</button>" +
      '<textarea id="chatInput" rows="1" placeholder="Message"></textarea>' +
      '<button class="send" data-action="send-chat" aria-label="Send">' + I.send + "</button>" +
      "</div></section>";
  }
  const NOTIFS = [
    { id: "n0", type: "limit", title: "Daily review limit reached", body: "Thompson Electrical already has 3 of 3 Google reviews from the circle today. Opens tomorrow.", time: "8:02 am", unread: true, go: "member", who: "jack" },
    { id: "n-swap", type: "review", title: "Incoming Google Review swap requests", body: "5 members asked you to swap a Google Review.", time: "Now", unread: true, go: "incoming-swap" },
    { id: "n1", type: "review", title: "Jack Thompson", body: "Could you leave a Google review when you get a minute?", time: "7:12 am", unread: true, go: "review-ideas", who: "jack" },
    { id: "n2", type: "review", title: "Review request", body: "Tom Reeves asked you to leave a Google review for Reeves Fencing.", time: "Yesterday", unread: true, go: "review-ideas", who: "tom" },
    { id: "n5", type: "review", title: "Sarah left you a Google review", body: "Review back when you can, if the daily limit is not already full.", time: "Yesterday", unread: true, go: "reviews-back", who: "sarah" },
    { id: "n6", type: "friend", title: "Liam O’Connor", body: "Sent you a Facebook friend request.", time: "Yesterday", unread: true, go: "member", who: "liam" },
    { id: "n7", type: "queue", title: "Facebook promotion queue", body: "You’re fourth in the queue. Your turn is coming up this week.", time: "Yesterday", unread: false, go: "promo-queue" },
    { id: "n8", type: "alert", title: "Recommendation alert", body: "Someone in the Hills group is asking for a pest controller.", time: "Yesterday", unread: false, go: "rec-alerts" },
    { id: "n3", type: "member", title: "New member in Hills", body: "Mei Chen (West Coast Gardens) joined the Hills region.", time: "Yesterday", unread: false, go: "member", who: "mei" },
    { id: "n4", type: "chat", title: "Sarah mentioned you", body: "In Hills tradies: @Jamie can you take a termite job in Mundaring?", time: "Mon", unread: false, go: "chat-group", chat: "grp-hills" },
    { id: "n9", type: "admin", title: "Emma Brooks was approved", body: "Emma has joined the circle after admin approval.", time: "Mon", unread: false, go: "member", who: "emma" }
  ];

  function renderNotifications() {
    return '<section class="screen has-tabs has-header" data-screen="notifications">' + topbar("Notifications") +
      '<div class="scroll" style="padding-left:0;padding-right:0">' +
      NOTIFS.map(function (n) {
        var who = n.who ? (member(n.who) || null) : null;
        var tile = (who && T().avatarHTML) ? T().avatarHTML(who, 36) : notifTile(n.type || "alert", 16);
        if (who) {
          return '<div class="notif-row' + (n.unread ? " unread" : "") + '">' +
            '<button type="button" class="mem-open notif-who" data-go="member" data-id="' + who.id + '" aria-label="Open ' + esc(fn(who)) + ' profile">' + tile + "</button>" +
            '<button type="button" class="notif-main" data-action="open-notif" data-nid="' + n.id + '">' +
            '<div class="ttl">' + esc(n.title) + '</div><div class="bd">' + esc(n.body) + '</div><div class="tm">' + esc(n.time) + "</div></button></div>";
        }
        return '<button type="button" class="notif-row' + (n.unread ? " unread" : "") + '" data-action="open-notif" data-nid="' + n.id + '">' +
          tile +
          '<div style="flex:1;min-width:0"><div class="ttl">' + esc(n.title) + '</div><div class="bd">' + esc(n.body) + '</div><div class="tm">' + esc(n.time) + "</div></div></button>";
      }).join("") +
      "</div></section>";
  }

  function renderNotifSettings() {
    function tog(key, a, b, type) {
      return '<button class="set-row" data-action="tog-notif" data-key="' + key + '">' + notifTile(type || "alert", 16) + '<span class="lab"><span class="a">' + a + "</span><span class=\"b\">" + b + '</span></span><span class="toggle' + (notif[key] ? " on" : "") + '"></span></button>';
    }
    if (typeof notif.queue === "undefined") notif.queue = true;
    if (typeof notif.friends === "undefined") notif.friends = true;
    if (typeof notif.alerts === "undefined") notif.alerts = true;
    if (typeof notif.limits === "undefined") notif.limits = true;
    return '<section class="screen has-tabs has-header" data-screen="notif-settings">' + topbar("Notifications") +
      '<div class="scroll"><p class="group-label">Alerts</p><div class="card group">' +
      tog("messages", "Messages", "New direct messages", "chat") +
      tog("mentions", "Group mentions", "When someone types @ your name", "chat") +
      tog("reviews", "Review requests", "When a member asks you for a Google review", "review") +
      tog("friends", "Friend requests", "When someone sends you a Facebook friend request", "friend") +
      tog("queue", "Promotion queue", "When your Facebook queue turn is coming up", "queue") +
      tog("alerts", "Recommendation alerts", "When someone shares a Facebook post with the circle", "alert") +
      tog("members", "New members", "When a tradie joins one of your regions", "member") +
      tog("limits", "Daily review limit", "When a business reaches 3 Google reviews for the day", "limit") +
      '</div><p class="group-label">Quiet hours</p><div class="card group">' +
      tog("quietOn", "Quiet hours", "Mute alerts overnight") +
      '<div class="set-row"><span class="lab"><span class="a">From</span></span><input type="time" data-quiet="quietFrom" value="' + esa(notif.quietFrom) + '" style="border:0;font-weight:700"></div>' +
      '<div class="set-row"><span class="lab"><span class="a">To</span></span><input type="time" data-quiet="quietTo" value="' + esa(notif.quietTo) + '" style="border:0;font-weight:700"></div>' +
      "</div><p class=\"hint\">This is a prototype. A real build would use your phone notification settings as well.</p></div></section>";
  }

  function renderLock() {
    return '<section class="screen" data-screen="lockscreen"><div class="lock">' +
      '<div class="clk">8:16</div><div class="dt">Monday 16 November</div>' +
      '<div class="lock-card"><div class="app">Rate Buddies</div><div class="tl">Jack Thompson</div><div class="bd">Could you leave a Google review when you get a minute?</div></div>' +
      '<div class="lock-card"><div class="app">Rate Buddies</div><div class="tl">Review request</div><div class="bd">Tom Reeves asked you to review Reeves Fencing.</div></div>' +
      '<div class="lock-card"><div class="app">Rate Buddies</div><div class="tl">New member in Hills</div><div class="bd">Mei Chen joined the Hills region.</div></div>' +
      "</div></section>";
  }

  function renderSubscription() {
    var trialLeft = 23; /* demo state: fictional member 7 days into the free month */
    return '<section class="screen has-tabs has-header" data-screen="subscription">' + topbar("Subscription") +
      '<div class="scroll">' +
      '<div class="auth-hero"><h2>Your plan</h2><p>One simple membership. Try everything free for a month.</p></div>' +
      '<article class="plan-card current rb-plan">' +
        '<div class="plan-top"><h3>Rate Buddies membership</h3><span class="plan-badge trial">Free trial · ' + trialLeft + ' days left</span></div>' +
        '<p class="plan-hero">1 month free</p>' +
        '<p class="plan-price">$50 / month after your free month</p>' +
        '<p class="plan-gst">AUD, incl. GST. Cancel any time before the free month ends and you will not be charged.</p>' +
        '<ul class="plan-list">' +
          '<li>Profile, regions and member list</li>' +
          '<li>Facebook friend requests and Facebook recommendations</li>' +
          '<li>Google Review requests, swaps and review ideas</li>' +
          '<li>Your turn in the Facebook promotion queue</li>' +
          '<li>Badges and vouches</li>' +
          '<li>In-app chat, group chats and notifications</li>' +
          '<li>AI assistant and video tutorials</li>' +
        '</ul>' +
        '<p class="plan-note">Payment goes through the App Store or Google Play, not a card form in the app.</p>' +
      '</article>' +
      '<p class="settings-foot plan-proto">Prototype placeholder. This screen does not take payment.</p>' +
      "</div></section>";
  }

    function renderInvite() {
    return '<section class="screen has-tabs has-header" data-screen="invite">' + topbar("Invite a tradie") +
      '<div class="scroll"><div class="auth-hero"><h2>Invite someone you know</h2><p>Share a join link with a tradie you have actually met. They can make a profile and pick their Perth regions.</p></div>' +
      '<div class="field"><label>Invite link</label><input readonly value="https://ratebuddies.demo/join/hale-circle"></div>' +
      '<button class="btn btn-primary has-ico" data-action="copy-invite">' + I.invite + "<span>Copy invite link</span></button>" +
      '<div class="action-stack" style="margin-top:12px">' +
      '<button class="btn btn-ghost ink has-ico" data-action="share-invite" data-via="sms">' + I.send + "<span>Share by SMS</span></button>" +
      '<button class="btn btn-ghost ink has-ico" data-action="share-invite" data-via="whatsapp">' + I.send + "<span>Share on WhatsApp</span></button>" +
      '<button class="btn btn-ghost ink has-ico" data-action="share-invite" data-via="messenger">' + I.fb + "<span>Share on Messenger</span></button>" +
      "</div></div></section>";
  }

  function renderHelp() {
    return '<section class="screen has-tabs has-header" data-screen="help">' + topbar("Help & how it works") +
      '<div class="scroll"><div class="auth-hero"><h2>How the circle works</h2><p>A simple way for local tradies who already know each other to stay in touch and recommend people they have actually met.</p></div>' +
      '<div class="card group" style="padding:14px;margin-bottom:10px"><p style="font-weight:800;margin-bottom:6px">Weekly meet-ups stay offline</p><p style="font-size:14px;font-weight:600;line-height:1.5;color:var(--text)">The app is for profiles, Facebook friend requests, messages and genuine Google reviews. Catch-ups are organised in person.</p></div>' +
      '<div class="card group" style="padding:14px;margin-bottom:10px"><p style="font-weight:800;margin-bottom:6px">Recommendations</p><p style="font-size:14px;font-weight:600;line-height:1.5;color:var(--text)">Only recommend a member in a Facebook group if you have actually met or used them, and say so in your comment.</p></div>' +
      '<div class="card group" style="padding:14px;margin-bottom:10px"><p style="font-weight:800;margin-bottom:6px">Google Reviews</p><p style="font-size:14px;font-weight:600;line-height:1.5;color:var(--text)">The app can suggest ideas after you pick a real job. It will not write a finished review for you. Swapped or ready-made reviews can get a Google profile taken down, and they are against Australian Consumer Law.</p></div>' +
      "</div></section>";
  }

  function renderMyRegions() {
    var m = T().me();
    var html = (T().areaWizardHTML ? T().areaWizardHTML("me-regions") : T().regionPicker(m.regions || [], "me-regions"));
    return '<section class="screen has-tabs has-header" data-screen="my-regions">' + topbar("My areas") +
      '<div class="scroll">' + html +
      '<button class="btn btn-primary has-ico" data-action="save-regions" style="margin-top:12px">' + I.regions + "<span>Save areas</span></button></div></section>";
  }

  function drawerInner() {
    var m = T().me();
    var items = [
      ["members", I.fb, "Facebook", ""],
      ["chats", I.chat, "Chats", ""],
      ["reviews", googleG(18), "Reviews", ""],
      ["notifications", I.bell, "Notifications", ""],
      ["me", I.user, "My profile", ""],
      ["my-regions", I.regions, "Your areas", ""],
      ["edit-profile", I.fb, "Facebook connection", "drawer-fb"],
      ["settings", I.google, "Google Business Profile", "drawer-google"],
      ["invite", I.invite, "Invite a tradie", ""],
      ["help", I.help, "Help & how it works", ""],
      ["subscription", I.sub, "Subscription", ""],
      ["settings", I.gear, "Settings", ""]
    ];
    var html = '<div class="drawer-head">' + av(m, 64) +
      '<div class="nm">' + esc(fn(m)) + '</div><div class="biz">' + esc(m.business) + "</div>" +
      '<div class="tags"><span class="pill t-pill">' + esc(m.trade) + "</span>" +
      (m.regions || []).map(function (x) { return '<span class="pill r-pill">' + rn(x) + "</span>"; }).join("") +
      "</div></div><nav class=\"drawer-nav\">";
    items.forEach(function (it, i) {
      if (i === 4 || i === 8 || i === 10) html += '<div class="drawer-sep"></div>';
      var action = it[3] ? ' data-action="' + it[3] + '"' : "";
      html += '<button type="button" class="drawer-item" data-go="' + it[0] + '"' + action + '><span class="ic">' + it[1] + "</span>" + it[2] + "</button>";
    });
    html += '<div class="drawer-sep"></div>';
    html += '<button type="button" class="drawer-item danger" data-go="welcome"><span class="ic">' + I.out + "</span>Sign out</button>";
    html += '</nav><div class="drawer-ver">Rate Buddies \u00b7 Prototype v1.7.1</div>';
    return html;
  }

  function ensureDrawer() {
    var phone = document.getElementById("phone");
    if (!phone) return;
    var o = document.getElementById("drawerOverlay");
    if (!o) {
      o = document.createElement("div");
      o.id = "drawerOverlay";
      o.className = "drawer-overlay";
      o.setAttribute("data-action", "close-drawer");
      phone.appendChild(o);
    }
    var d = document.getElementById("appDrawer");
    if (!d) {
      d = document.createElement("aside");
      d.id = "appDrawer";
      d.className = "drawer";
      d.setAttribute("aria-label", "Menu");
      phone.appendChild(d);
    }
    d.innerHTML = drawerInner();
  }
  function openDrawer() {
    ensureDrawer();
    document.getElementById("appDrawer").classList.add("open");
    document.getElementById("drawerOverlay").classList.add("show");
  }
  function closeDrawer() {
    var d = document.getElementById("appDrawer");
    var o = document.getElementById("drawerOverlay");
    if (d) d.classList.remove("open");
    if (o) o.classList.remove("show");
  }

  function closeMine() {
    var o = document.getElementById("tc12Overlay");
    if (o) o.remove();
    if (T().closeSheet) T().closeSheet();
  }
  function openOverlay(html) {
    closeMine();
    var phone = document.getElementById("phone");
    if (!phone) return;
    var overlay = document.createElement("div");
    overlay.className = "overlay show";
    overlay.id = "tc12Overlay";
    overlay.innerHTML = '<div class="sheet">' + html + "</div>";
    phone.appendChild(overlay);
  }

  function openGoogleSheet() {
    openOverlay('<div class="sheet-handle"></div><h3>Connect Google Business Profile</h3>' +
      '<p style="font-size:14px;font-weight:600;color:var(--muted);margin:0 0 14px">Prototype only. In a real app Google would ask you to sign in and pick your business. This preview does not talk to Google.</p>' +
      '<div class="g-card"><div class="gmark">G</div><div><div class="fb-card-n">Hale Pest Control</div><div class="fb-card-l">Midland, Western Australia</div></div></div>' +
      '<button class="btn btn-primary has-ico" data-action="google-allow">' + I.google + "<span>Allow and connect</span></button>" +
      '<button class="btn btn-ghost ink" style="margin-top:8px" data-action="close-sheet">Not now</button>');
  }

  function render(id) {
    if (id === "drawer") return renderMembers();
    if (id === "google-consent") return renderSettings();
    if (id === "reviews") return renderReviews();
    if (id === "review-ideas") return renderReviewIdeas();
    if (id === "chats") return renderChats();
    if (id === "chat-dm" || id === "chat-group") return renderThread();
    if (id === "notifications") return renderNotifications();
    if (id === "notif-settings") return renderNotifSettings();
    if (id === "lockscreen") return renderLock();
    if (id === "subscription") return renderSubscription();
    if (id === "invite") return renderInvite();
    if (id === "help") return renderHelp();
    if (id === "my-regions" || id === "my-regions-all") return renderMyRegions();
    return null;
  }

  function refreshIdeasScreen() { go("review-ideas"); }
  function handleClick(e) {
    if (e.target.id === "tc12Overlay" || (e.target.closest("#tc12Overlay") && !e.target.closest(".sheet"))) { closeMine(); return true; }
    if (e.target.closest("[data-action='close-drawer'], #drawerOverlay")) {
      closeDrawer();
      return true;
    }
    if (e.target.closest("[data-action='open-drawer']")) {
      openDrawer();
      return true;
    }
    var dItem = e.target.closest(".drawer-item");
    if (dItem) {
      var act = dItem.getAttribute("data-action");
      closeDrawer();
      if (act === "drawer-fb") { go("edit-profile"); return true; }
      if (act === "drawer-google") { go("settings"); setTimeout(openGoogleSheet, 30); return true; }
      if (dItem.dataset.go) { go(dItem.dataset.go); return true; }
    }
    var relMenu = e.target.closest("[data-action='rb-rel-menu']");
    if (relMenu) {
      S()._relMenuOpen = !S()._relMenuOpen;
      var rdd = relMenu.closest(".rb-dd");
      if (rdd) { rdd.classList.toggle("open", !!S()._relMenuOpen); relMenu.setAttribute("aria-expanded", S()._relMenuOpen ? "true" : "false"); if (window.TC220 && TC220.fitMenu) TC220.fitMenu(); }
      return true;
    }
    var relOpt = e.target.closest("[data-action='rb-rel']");
    if (relOpt) {
      S()._relMenuOpen = false;
      S().relFilter = relOpt.getAttribute("data-rel-id") || "all";
      go("members");
      return true;
    }
    var relB = e.target.closest("[data-rel]");
    if (relB) {
      S().relFilter = relB.getAttribute("data-rel");
      go("members");
      return true;
    }
    var job = e.target.closest("[data-idea-job]");
    if (job) { S().ideaJob = job.getAttribute("data-idea-job"); refreshIdeasScreen(); return true; }
    var sub = e.target.closest("[data-idea-sub]");
    if (sub) { S().ideaSuburb = sub.getAttribute("data-idea-sub"); refreshIdeasScreen(); return true; }
    var mo = e.target.closest("[data-idea-mo]");
    if (mo) { S().ideaMonth = mo.getAttribute("data-idea-mo"); refreshIdeasScreen(); return true; }
    var stc = e.target.closest("[data-idea-st]");
    if (stc) {
      var sid = stc.getAttribute("data-idea-st");
      var arr = S().ideaStands || [];
      var ix = arr.indexOf(sid);
      if (ix >= 0) arr.splice(ix, 1); else arr.push(sid);
      S().ideaStands = arr;
      refreshIdeasScreen();
      return true;
    }
    var pick = e.target.closest("[data-pick-idea]");
    if (pick) {
      var i = Number(pick.getAttribute("data-pick-idea"));
      var ideas = S()._ideas || [];
      S().pickedIdea = i;
      S().reviewDraft = ideas[i] || "";
      refreshIdeasScreen();
      return true;
    }
    var el = e.target.closest("[data-action]");
    if (!el) return false;
    var action = el.getAttribute("data-action");
    var id = el.getAttribute("data-id");

    if (action === "mark-sent") {
      if (id) { rel[id] = "pending"; persist(); }
      toast("Marked as request sent. Confirm Friends once they accept.");
      if (el.tagName === "A") {
        setTimeout(function () { if (S().screen === "members") go("members"); else go("member", id); }, 200);
        return false;
      }
      go(S().screen === "members" ? "members" : "member", id);
      return true;
    }
    if (action === "mark-friends") {
      if (id) { rel[id] = "friends"; persist(); }
      toast("Marked as Facebook friends.");
      go(S().screen === "members" ? "members" : "member", id);
      return true;
    }
    if (action === "open-chat") {
      var c = dmFor(id);
      S().chatId = c.id;
      go("chat-dm");
      return true;
    }
    if (action === "open-thread") {
      S().chatId = el.getAttribute("data-chat");
      var ch = chatById(S().chatId);
      go(ch && ch.type === "group" ? "chat-group" : "chat-dm");
      return true;
    }
    if (action === "open-ideas") {
      e.preventDefault();
      S().reviewFor = id || S().reviewFor || "jack";
      S().reviewDraft = "";
      S().pickedIdea = -1;
      go("review-ideas");
      return true;
    }
    if (action === "ask-review" || action === "ask-review-chat") {
      var mid = id || (chatById(S().chatId) || {}).memberId || "sarah";
      reqs.unshift({ id: "r" + Date.now(), from: "jamie", to: mid, dir: "out", status: "open", at: "Just now" });
      persist();
      openShareSheet(mid);
      return true;
    }
    if (action === "google-connect") { openGoogleSheet(); return true; }
    if (action === "google-allow") {
      S().googleConnected = true;
      persist();
      closeMine();
      toast("Google Business Profile connected (prototype).");
      go(S().screen === "google-consent" ? "settings" : S().screen);
      return true;
    }
    if (action === "google-disconnect") {
      S().googleConnected = false;
      persist();
      toast("Google profile disconnected.");
      go(S().screen);
      return true;
    }
    if (action === "google-manage") { openGoogleSheet(); return true; }
    if (action === "close-sheet") { closeMine(); return true; }
    if (action === "refresh-ideas") {
      var mm0 = member(S().reviewFor || "jack");
      usedIdeas[mm0.id] = (usedIdeas[mm0.id] || []).concat(S()._ideas || []);
      persist();
      S().pickedIdea = -1;
      refreshIdeasScreen();
      return true;
    }
    if (action === "copy-open") {
      var text = S().reviewDraft || "";
      var mm = member(id || S().reviewFor);
      var u = uniqNote(mm, text);
      if (!text) { toast("Write or pick an idea first."); e.preventDefault(); return true; }
      if (window.TC154 && TC154.copyText) TC154.copyText(text); else { try { navigator.clipboard.writeText(text); } catch (err) {} }
      usedIdeas[mm.id] = (usedIdeas[mm.id] || []).concat(S()._ideas || []);
      given[mm.id] = { text: text, at: Date.now() };
      reqs.forEach(function (r) { if (r.dir === "in" && r.from === mm.id) r.status = "done"; });
      persist();
      toast(u.ok ? "Copied. Paste it into Google and edit it before you post." : "Copied, but it looks similar \u2014 please edit it.");
      return false;
    }
    if (action === "send-chat") { sendChat(); return true; }
    if (action === "attach") { openAttach(); return true; }
    if (action === "new-group") {
      toast("In a later build you could create a new group. This preview already has a group for each region you joined.");
      return true;
    }
    if (action === "share-my-profile") {
      var c2 = chatById(S().chatId);
      if (c2) {
        c2.messages.push({ id: "m" + Date.now(), from: "me", type: "profile", memberId: "jamie", time: "Now", ticks: "sent" });
        c2.preview = "You shared your profile";
        c2.when = "Now";
        save(LS.chats, chats);
        go(c2.type === "group" ? "chat-group" : "chat-dm");
      }
      return true;
    }
    if (action === "share-location") {
      var c3 = chatById(S().chatId);
      if (c3) {
        c3.messages.push({ id: "m" + Date.now(), from: "me", type: "location", place: "Midland, WA", time: "Now", ticks: "sent" });
        c3.preview = "You shared a location";
        c3.when = "Now";
        save(LS.chats, chats);
        go(c3.type === "group" ? "chat-group" : "chat-dm");
      }
      return true;
    }
    if (action === "chat-more") { openChatMore(); return true; }
    if (action === "msg-menu") { openReact(el); return true; }
    if (action === "react") {
      var mid2 = el.getAttribute("data-msg");
      var emoji = el.getAttribute("data-emoji");
      var c4 = chatById(S().chatId);
      if (c4) {
        c4.messages.forEach(function (msg) {
          if (msg.id === mid2) {
            msg.reactions = msg.reactions || [];
            var existing = msg.reactions.find(function (r) { return r.e === emoji; });
            if (existing) existing.n += 1; else msg.reactions.push({ e: emoji, n: 1 });
          }
        });
        save(LS.chats, chats);
        closeMine();
        go(c4.type === "group" ? "chat-group" : "chat-dm");
      }
      return true;
    }
    if (action === "open-notif") {
      var n = NOTIFS.find(function (x) { return x.id === el.getAttribute("data-nid"); });
      if (!n) return true;
      n.unread = false;
      if (n.chat) S().chatId = n.chat;
      if (n.who && n.go === "review-ideas") S().reviewFor = n.who;
      if (n.who && n.go === "member") { go("member", { memberId: n.who }); return true; }
      go(n.go);
      return true;
    }
    if (action === "tog-notif") {
      var key = el.getAttribute("data-key");
      notif[key] = !notif[key];
      persist();
      go("notif-settings");
      return true;
    }
    if (action === "copy-invite") {
      if (window.TC154 && TC154.copyText) TC154.copyText("https://ratebuddies.demo/join/hale-circle"); else { try { navigator.clipboard.writeText("https://ratebuddies.demo/join/hale-circle"); } catch (err) {} }
      toast("Invite link copied.");
      return true;
    }
    if (action === "share-invite") {
      toast("In a real build this would open " + el.getAttribute("data-via") + " with your invite link.");
      return true;
    }
    if (action === "save-regions") {
      toast("My areas were saved.");
      go("me");
      return true;
    }
    if (action === "mute-chat") {
      var c5 = chatById(S().chatId);
      if (c5) { c5.muted = !c5.muted; save(LS.chats, chats); }
      closeMine();
      toast(c5 && c5.muted ? "Chat muted." : "Chat unmuted.");
      return true;
    }
    if (action === "block-chat") {
      closeMine();
      toast("In a real build you could block or report a member from here.");
      return true;
    }
    if (action === "search-chat") {
      closeMine();
      toast("Search in chat would filter messages in a later polish. This preview keeps the conversation in view.");
      return true;
    }
    return false;
  }

  function openShareSheet(mid) {
    var m = member(mid);
    /* v2.2.2: "Ask for review swap". Two options + optional note. Share buttons kept. */
    var mode = S()._swapMode || "send";
    openOverlay('<div class="sheet-handle"></div><h3>Ask for a Google Review swap</h3>' +
      '<p class="rb-swq-intro">Send a swap request to ' + esc(fn(m)) + '. They leave you a Google Review, then you leave one back.</p>' +
      '<div class="rb-swq" role="radiogroup" aria-label="How should they write it?" data-mid="' + esc(mid) + '">' +
      '<button type="button" role="radio" class="rb-swq-opt' + (mode === "send" ? " on" : "") + '" aria-checked="' + (mode === "send") + '" data-action="rb-swq-mode" data-mode="send"><span class="rb-swq-dot"></span><span><b>I\u2019m sending you the review</b><small>Type the review you\u2019d like. They can copy it.</small></span></button>' +
      '<button type="button" role="radio" class="rb-swq-opt' + (mode === "own" ? " on" : "") + '" aria-checked="' + (mode === "own") + '" data-action="rb-swq-mode" data-mode="own"><span class="rb-swq-dot"></span><span><b>Write it in your own words</b><small>They write the review themselves.</small></span></button>' +
      "</div>" +
      '<label class="rb-swq-field" data-swq-review' + (mode === "send" ? "" : " hidden") + '><span class="rb-swq-lab">What review would you like? <em>Optional</em></span>' +
      '<textarea rows="5" maxlength="500" name="swapReview" placeholder="e.g. Sam from Joondalup Pest Control sorted our termite problem fast. On time, explained everything and left the place spotless. Highly recommend."></textarea></label>' +
      '<label class="rb-swq-field"><span class="rb-swq-lab">Short note <em>Optional</em></span>' +
      '<textarea rows="2" maxlength="140" name="swapNote" placeholder="e.g. Please mention my name and the job type"></textarea></label>' +
      '<button class="btn btn-primary" data-action="rb-swq-send" data-id="' + esc(mid) + '">Send swap request</button>' +
      '<div class="action-stack" style="margin-top:10px">' +
      '<button class="btn btn-ghost ink" data-action="share-invite" data-via="sms">Share via SMS</button>' +
      '<button class="btn btn-ghost ink" data-action="share-invite" data-via="whatsapp">Share via WhatsApp</button>' +
      '<button class="btn btn-ghost ink" data-action="share-invite" data-via="messenger">Share via Messenger</button></div>');
  }
  document.addEventListener("click", function (e) {
    var el = e.target.closest && e.target.closest('[data-action="rb-swq-mode"], [data-action="rb-swq-send"]');
    if (!el) return;
    e.preventDefault(); e.stopPropagation();
    var ov = el.closest("#tc12Overlay") || document;
    if (el.getAttribute("data-action") === "rb-swq-mode") {
      var md = el.getAttribute("data-mode"); S()._swapMode = md;
      Array.prototype.forEach.call(ov.querySelectorAll(".rb-swq-opt"), function (b) { var on = b === el; b.classList.toggle("on", on); b.setAttribute("aria-checked", on ? "true" : "false"); });
      var f = ov.querySelector("[data-swq-review]"); if (f) f.hidden = md !== "send";
      return;
    }
    var rv = ov.querySelector("[name=swapReview]"), nt = ov.querySelector("[name=swapNote]");
    var modeNow = S()._swapMode || "send";
    var last = reqs[0];
    if (last && last.dir === "out") { last.kind = "swap"; last.mode = modeNow; last.review = modeNow === "send" && rv ? rv.value.trim() : ""; last.note = nt ? nt.value.trim() : ""; persist(); }
    closeMine();
    toast("Google Review swap request sent to " + fn(member(el.getAttribute("data-id"))) + ".");
  }, true);
  function openAttach() {
    openOverlay('<div class="sheet-handle"></div><h3>Attach</h3><div class="overflow-menu">' +
      '<button data-action="share-location">Location</button>' +
      '<button data-action="share-my-profile">Member profile card</button>' +
      '<button data-action="close-sheet">Photo or video (demo)</button>' +
      '<button data-action="close-sheet">Voice note (demo)</button>' +
      '<button data-action="close-sheet">File (demo)</button></div>');
  }
  function openChatMore() {
    var c = chatById(S().chatId);
    openOverlay('<div class="sheet-handle"></div><h3>Chat options</h3><div class="overflow-menu">' +
      '<button data-action="search-chat">Search in chat</button>' +
      '<button data-action="mute-chat">' + (c && c.muted ? "Unmute" : "Mute") + "</button>" +
      '<button data-action="block-chat">Block or report</button>' +
      '<button data-action="close-sheet">Cancel</button></div>');
  }
  function openReact(bub) {
    var mid = bub.getAttribute("data-msg");
    var emojis = ["\uD83D\uDC4D", "\u2764\uFE0F", "\uD83D\uDE02", "\uD83D\uDE2E", "\uD83C\uDF89"];
    openOverlay('<div class="sheet-handle"></div><h3>React or reply</h3>' +
      '<div class="react-bar" style="margin:8px auto 14px;width:max-content">' +
      emojis.map(function (em) {
        return '<button type="button" style="font-size:22px;background:none;border:0" data-action="react" data-msg="' + mid + '" data-emoji="' + em + '">' + em + "</button>";
      }).join("") + "</div>" +
      '<div class="overflow-menu"><button data-action="close-sheet">Reply (demo)</button><button data-action="close-sheet">Edit or delete (your messages)</button></div>');
  }

  function sendChat() {
    var box = document.getElementById("chatInput");
    var text = box ? box.value.trim() : "";
    if (!text) return;
    var c = chatById(S().chatId);
    if (!c) return;
    c.messages.push({ id: "m" + Date.now(), from: "me", type: "text", text: text, time: "Now", ticks: "sent" });
    c.preview = text;
    c.when = "Now";
    save(LS.chats, chats);
    go(c.type === "group" ? "chat-group" : "chat-dm");
    setTimeout(function () {
      var thread = document.getElementById("chatThread");
      if (thread) thread.scrollTop = thread.scrollHeight;
    }, 30);
  }

  function afterGo(id) {
    ensureDrawer();
    if (id !== "drawer") closeDrawer();
    updateBadges();
    if (id === "drawer") openDrawer();
    if (id === "google-consent") {
      S().googleConnected = false;
      openGoogleSheet();
    }
    if (id === "create-profile" || id === "create-profile-connected" || id === "edit-profile") injectGoogle();
    if (id === "review-ideas") {
      var ta = document.getElementById("reviewDraft");
      if (ta) {
        ta.addEventListener("input", function () {
          S().reviewDraft = ta.value;
          var note = document.querySelector(".uniq");
          if (note) {
            var u = uniqNote(member(S().reviewFor || "jack"), ta.value);
            note.className = "uniq " + (u.ok ? "ok" : "bad");
            note.textContent = u.msg;
          }
        });
      }
    }
    var cs = document.getElementById("chatSearch");
    if (cs) {
      cs.addEventListener("input", function (ev) {
        S().chatQuery = ev.target.value;
        go("chats");
        var again = document.getElementById("chatSearch");
        if (again) { again.value = S().chatQuery; again.focus(); }
      });
    }
    var ci = document.getElementById("chatInput");
    if (ci) {
      ci.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); sendChat(); }
      });
      var thread = document.getElementById("chatThread");
      if (thread) thread.scrollTop = thread.scrollHeight;
    }
    document.querySelectorAll("[data-quiet]").forEach(function (inp) {
      inp.addEventListener("change", function () {
        notif[inp.getAttribute("data-quiet")] = inp.value;
        persist();
      });
    });
  }

  window.notifTile = notifTile;
  window.TC12 = {
    passRelFilter: passRelFilter,
    relOf: relOf,
    iReviewed: iReviewed,
    theyReviewed: theyReviewed,
    needsMyReview: needsMyReview,
    gLink: gLink,
    memberCard: memberCard,
    renderMembers: renderMembers,
    renderMember: renderMember,
    renderMe: renderMe,
    renderSettings: renderSettings,
    render: render,
    handleClick: handleClick,
    afterGo: afterGo,
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
    unreadTotal: unreadTotal,
    chatCount: chatCount,
    recentChats: recentChats,
    notifUnread: notifUnread,
    notifTile: notifTile,
    /* v2.2.2 live: let rb-live.js fill chats + notifications from the test database */
    liveChats: function () { return chats; },
    setLiveChats: function (list) { chats.splice.apply(chats, [0, chats.length].concat(list || [])); save(LS.chats, chats); },
    setLiveNotifs: function (list) { NOTIFS.splice.apply(NOTIFS, [0, NOTIFS.length].concat(list || [])); },
    liveNotifs: function () { return NOTIFS; },
    setLiveRel: function (map) { Object.keys(rel).forEach(function (k) { delete rel[k]; }); Object.assign(rel, map || {}); persist(); },
    updateBadges: updateBadges
  };

  if (T().go && S().screen) {
    try { T().go(S().screen, S().selectedMember); } catch (err) {}
  }
})();
