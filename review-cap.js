/* TradeCircle Perth — daily Google review cap per business, v1.5.4
   Cap is per reviewee, per Perth calendar day. Default 3. */
(function (root) {
  "use strict";

  var LS_LIMIT = "tc_review_daily_limit";
  var LS_COUNTS = "tc_review_daily_counts";
  var DEFAULT_LIMIT = 3;

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

  function perthToday() {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Australia/Perth",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date());
  }
  function msUntilMidnightPerth() {
    var today = perthToday();
    var p = today.split("-").map(Number);
    /* Next midnight AWST (UTC+8) is 16:00 UTC on this calendar date. */
    var next = Date.UTC(p[0], p[1] - 1, p[2], 16, 0, 0);
    return Math.max(0, next - Date.now());
  }
  function opensInLabel() {
    var ms = msUntilMidnightPerth();
    var h = Math.floor(ms / 3600000);
    var m = Math.floor((ms % 3600000) / 60000);
    if (h <= 0 && m <= 0) return "Opens shortly";
    if (h <= 0) return "Opens in " + m + "m";
    return "Opens in " + h + "h " + m + "m";
  }

  function limit() {
    var n = load(LS_LIMIT, null);
    if (typeof n === "number" && n >= 1 && n <= 20) return n;
    if (root.TradeCircle && root.TradeCircle.state && root.TradeCircle.state.reviewDailyLimit) {
      return Number(root.TradeCircle.state.reviewDailyLimit) || DEFAULT_LIMIT;
    }
    return DEFAULT_LIMIT;
  }
  function setLimit(n) {
    n = Math.max(1, Math.min(20, Number(n) || DEFAULT_LIMIT));
    save(LS_LIMIT, n);
    if (root.TradeCircle && root.TradeCircle.state) root.TradeCircle.state.reviewDailyLimit = n;
    return n;
  }

  function rawCounts() {
    return load(LS_COUNTS, null) || seedCounts();
  }
  function seedCounts() {
    /* Priya Sharma / Prism Painting is at the daily RECEIVED cap (fictional).
       Jamie Hale (logged-in member) has received 2 of 3 today. Giving is unlimited. */
    var today = perthToday();
    var data = {
      priya: { date: today, n: 3, by: ["sarah", "mei", "jack"] },
      jamie: { date: today, n: 2, by: ["sarah", "liam"] }
    };
    save(LS_COUNTS, data);
    return data;
  }
  function row(bizId) {
    var all = rawCounts();
    var today = perthToday();
    var r = all[bizId] || { date: today, n: 0, by: [] };
    if (r.date !== today) r = { date: today, n: 0, by: [] };
    return r;
  }
  function persistRow(bizId, r) {
    var all = rawCounts();
    all[bizId] = r;
    save(LS_COUNTS, all);
  }
  function countFor(bizId) { return row(bizId).n || 0; }
  function atLimit(bizId) { return countFor(bizId) >= limit(); }
  function remaining(bizId) { return Math.max(0, limit() - countFor(bizId)); }
  function record(bizId, viewerId) {
    if (!bizId) return row(bizId);
    var r = row(bizId);
    var cap = limit();
    if (r.n >= cap) return r;
    r.n += 1;
    if (viewerId && r.by.indexOf(viewerId) === -1) r.by.push(viewerId);
    persistRow(bizId, r);
    return r;
  }

  function svgLock() {
    return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>';
  }

  function counterHTML(bizId) {
    var n = countFor(bizId);
    var cap = limit();
    var cls = n >= cap ? "rev-today warn" : "rev-today";
    return '<div class="' + cls + '">Google Reviews received today: ' + n + " of " + cap + "</div>";
  }

  function bannerHTML(bizId, opts) {
    opts = opts || {};
    if (!atLimit(bizId)) return "";
    var cap = limit();
    var n = countFor(bizId);
    return '<div class="limit-banner" role="status">' +
      '<div class="limit-lock" aria-hidden="true">' + svgLock() + "</div>" +
      "<div><strong>Daily received limit reached: " + n + " of " + cap + " Google Reviews today</strong>" +
      '<div class="sub">Opens tomorrow<span class="limit-eta"> \u00b7 ' + opensInLabel() + "</span></div>" +
      "</div></div>";
  }

  function lockedButton(label) {
    return '<button type="button" class="btn btn-locked has-ico" disabled aria-disabled="true">' +
      svgLock() + "<span>" + (label || "Locked today") + "</span></button>";
  }

  root.TCReviews = {
    DEFAULT_LIMIT: DEFAULT_LIMIT,
    perthToday: perthToday,
    opensInLabel: opensInLabel,
    msUntilMidnightPerth: msUntilMidnightPerth,
    limit: limit,
    setLimit: setLimit,
    countFor: countFor,
    atLimit: atLimit,
    remaining: remaining,
    record: record,
    counterHTML: counterHTML,
    bannerHTML: bannerHTML,
    lockedButton: lockedButton,
    lockIcon: svgLock,
    row: row
  };
})(typeof window !== "undefined" ? window : global);
