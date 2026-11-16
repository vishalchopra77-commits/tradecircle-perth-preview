/* TradeCircle Perth — super admin prototype v1.5.1 */
(function () {
  "use strict";
  function svg(inner) {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + "</svg>";
  }
  var I = {
    dash: svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
    requests: svg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M16 11h6"/>'),
    members: svg('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
    regions: svg('<path d="M12 21s7-5.33 7-11a7 7 0 1 0-14 0c0 5.67 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
    trades: svg('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
    alerts: svg('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'),
    queue: svg('<path d="M4 6h16M4 12h10M4 18h7"/><circle cx="18" cy="15" r="3"/><path d="M18 14v1.2l.8.8"/>'),
    reports: svg('<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>'),
    chats: svg('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
    plans: svg('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>'),
    ai: svg('<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3.5"/>'),
    broadcast: svg('<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14"/>'),
    settings: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'),
    audit: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>'),
    check: svg('<path d="M20 6 9 17l-5-5"/>'),
    x: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
    edit: svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/>'),
    bell: svg('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>'),
    menu: svg('<path d="M4 6h16M4 12h16M4 18h16"/>'),
    login: svg('<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/>'),
    up: svg('<path d="M12 19V5M5 12l7-7 7 7"/>'),
    down: svg('<path d="M12 5v14M19 12l-7 7-7-7"/>'),
    send: svg('<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/>'),
    more: svg('<path d="M12 5v14M5 12h14"/>'),
    eye: svg('<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>'),
    trend: svg('<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>')
  };

  var trades = (window.TC_TRADES || []).slice();
  var requests = [
    { id: "p1", first: "Nina", last: "Kaur", business: "Kaur Tiling", trade: "Tiler", areas: "South, Fremantle", phone: "0412 000 201", status: "pending", when: "Today 8:10 am", bio: "Bathroom and floor tiling across the southern suburbs." },
    { id: "p2", first: "Owen", last: "Wright", business: "Wright Roofing Co", trade: "Roofer", areas: "Hills, North", phone: "0412 000 202", status: "pending", when: "Today 7:44 am", bio: "Roof repairs and restorations. Family-run." },
    { id: "p3", first: "Ayla", last: "Santos", business: "Santos Cleaning", trade: "End of Lease Cleaner", areas: "Central / CBD", phone: "0412 000 203", status: "pending", when: "Yesterday", bio: "End-of-lease and after-builders cleans." }
  ];
  var members = [
    { id: "jamie", name: "Jamie Hale", business: "Hale Pest Control", trade: "Pest Control", areas: "Hills, North", status: "active", joined: "12 Jan 2026" },
    { id: "sarah", name: "Sarah Nguyen", business: "Nguyen Carpentry", trade: "Carpenter", areas: "North, Joondalup", status: "active", joined: "18 Jan 2026" },
    { id: "liam", name: "Liam O’Connor", business: "O’Connor Plumbing", trade: "Plumber", areas: "South, Fremantle", status: "active", joined: "2 Feb 2026" },
    { id: "priya", name: "Priya Sharma", business: "Sharma Painting Co", trade: "Painter", areas: "Hills, East", status: "active", joined: "21 Feb 2026" },
    { id: "mei", name: "Mei Chen", business: "West Coast Gardens", trade: "Landscaper", areas: "Hills, East", status: "active", joined: "4 Mar 2026" },
    { id: "marcus", name: "Marcus Adeyemi", business: "Adeyemi Electrical", trade: "Electrician", areas: "Kwinana, South", status: "suspended", joined: "9 Mar 2026" },
    { id: "tom", name: "Tom Reeves", business: "Reeves Fencing", trade: "Fencer", areas: "South, Rockingham", status: "active", joined: "22 Mar 2026" },
    { id: "hannah", name: "Hannah Lewis", business: "Lewis Electrical", trade: "Electrician", areas: "North, Joondalup", status: "active", joined: "8 Apr 2026" }
  ];
  var regions = ["Hills", "Kwinana", "North", "South", "East", "Central / CBD", "Fremantle", "Rockingham", "Joondalup", "Armadale"];
  var queue = [
    { pos: 1, name: "Priya Sharma", plan: "Free turn", when: "This week" },
    { pos: 2, name: "Tom Reeves", plan: "Jump the queue", when: "Paid — this week", paid: true },
    { pos: 3, name: "Mei Chen", plan: "Free turn", when: "Next week" },
    { pos: 4, name: "Jamie Hale", plan: "Free turn", when: "In 2 weeks" },
    { pos: 5, name: "Hannah Lewis", plan: "Free turn", when: "In 3 weeks" }
  ];
  var flags = [
    { id: "f1", who: "Anonymous", about: "A group chat message", reason: "Off-topic promotion", status: "open", when: "Today 7:02 am" },
    { id: "f2", who: "Sarah Nguyen", about: "Member profile", reason: "Wrong trade listed", status: "open", when: "Yesterday" }
  ];
  var audit = [
    { at: "Today 9:12 am", who: "Vishal (you)", action: "Signed in to admin (demo)" },
    { at: "Today 8:10 am", who: "System", action: "New profile request from Nina Kaur" },
    { at: "Yesterday 4:20 pm", who: "Vishal (you)", action: "Approved Emma Brooks" },
    { at: "Yesterday 11:05 am", who: "System", action: "Recommendation alert sent for pest control" },
    { at: "Mon 3:40 pm", who: "System", action: "Jamie Hale requested a promotion turn" }
  ];
  var alerts = [
    { id: "a1", trade: "Pest Control", by: "Jamie Hale", status: "Open", comments: 4, when: "Today 7:30 am", post: "Hills group — pest controller this week" },
    { id: "a2", trade: "Plumber", by: "Liam O’Connor", status: "Handled", comments: 6, when: "Sat 2:15 pm", post: "Fremantle group — leaking hot water system" },
    { id: "a3", trade: "Electrician", by: "Hannah Lewis", status: "Open", comments: 1, when: "Fri 9:40 am", post: "Joondalup group — switchboard upgrade" }
  ];
  var chats = [
    { id: "c1", room: "Hills group", from: "Unknown number", text: "Cheap solar deals this week, DM me", flag: "Possible spam", when: "Today 6:55 am" },
    { id: "c2", room: "Jamie ↔ Sarah", from: "Jamie Hale", text: "Thanks for the intro to the Hills job.", flag: "None", when: "Yesterday" }
  ];
  var activity = [
    { kind: "ok", text: "Emma Brooks was approved and can now join the circle.", at: "Yesterday 4:20 pm" },
    { kind: "warn", text: "Three new profile requests are waiting for your review.", at: "Today 8:10 am" },
    { kind: "info", text: "A pest control recommendation alert was sent to the circle.", at: "Yesterday 11:05 am" },
    { kind: "ok", text: "Tom Reeves jumped the promotion queue (price to be set).", at: "Sat 10:12 am" },
    { kind: "info", text: "Hannah Lewis left a Google review for Jamie Hale.", at: "Fri 6:30 pm" }
  ];
  var memberWeeks = { labels: ["6 Oct", "13 Oct", "20 Oct", "27 Oct", "3 Nov", "10 Nov"], values: [2, 3, 1, 4, 2, 5] };
  var alertWeeks = { labels: ["6 Oct", "13 Oct", "20 Oct", "27 Oct", "3 Nov", "10 Nov"], values: [3, 5, 2, 6, 4, 7] };
  var page = "dashboard";
  var q = "";
  var notifOpen = false;

  var NAV = [
    ["dashboard", "Dashboard", "dash", "Overview"],
    ["requests", "Profile requests", "requests", "People"],
    ["members", "Members", "members"],
    ["regions", "Regions", "regions", "Lists"],
    ["trades", "Trades", "trades"],
    ["alerts", "Recommendation alerts", "alerts", "Circle"],
    ["queue", "Promotion queue", "queue"],
    ["reports", "Reports", "reports"],
    ["chats", "Chat moderation", "chats"],
    ["plans", "Subscriptions", "plans", "Account"],
    ["ai", "AI integrations", "ai"],
    ["broadcast", "Broadcast", "broadcast"],
    ["settings", "Settings", "settings"],
    ["audit", "Audit log", "audit"]
  ];
  var TITLES = {
    dashboard: ["Overview", "Dashboard"],
    requests: ["People", "Profile requests"],
    members: ["People", "Members"],
    regions: ["Lists", "Regions"],
    trades: ["Lists", "Trades"],
    alerts: ["Circle", "Recommendation alerts"],
    queue: ["Circle", "Promotion queue"],
    reports: ["Circle", "Reports"],
    chats: ["Circle", "Chat moderation"],
    plans: ["Account", "Subscriptions"],
    ai: ["Account", "AI integrations"],
    broadcast: ["Account", "Broadcast"],
    settings: ["Account", "Settings"],
    audit: ["Account", "Audit log"]
  };
  var AV = ["av-teal", "av-navy", "av-blue", "av-amber", "av-rose", "av-purple"];

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function initials(name) {
    return String(name || "?").split(/\s+/).filter(Boolean).slice(0, 2).map(function (p) { return p[0]; }).join("").toUpperCase();
  }
  function avClass(name) {
    var n = 0, s = String(name || "");
    for (var i = 0; i < s.length; i++) n += s.charCodeAt(i);
    return AV[n % AV.length];
  }
  function av(name, size) {
    return '<div class="av ' + (size || "") + " " + avClass(name) + '">' + esc(initials(name)) + "</div>";
  }
  function who(name, sub) {
    return '<div class="who">' + av(name) + '<div><div class="name">' + esc(name) + '</div><div class="sub">' + esc(sub || "") + "</div></div></div>";
  }
  function badge(status) {
    var map = {
      pending: ["b-wait", "Waiting"],
      approved: ["b-ok", "Approved"],
      declined: ["b-no", "Declined"],
      active: ["b-ok", "Active"],
      suspended: ["b-no", "Suspended"],
      Open: ["b-wait", "Open"],
      Handled: ["b-ok", "Handled"],
      open: ["b-wait", "Open"],
      "Free turn": ["b-info", "Free turn"],
      "Jump the queue": ["b-paid", "Jump the queue"]
    };
    var m = map[status] || ["b-info", status];
    return '<span class="badge ' + m[0] + '">' + esc(m[1]) + "</span>";
  }
  function icoBtn(action, id, kind, icon, label) {
    return '<button class="ico-btn ' + kind + '" type="button" data-action="' + action + '" data-id="' + esc(id) + '" title="' + esc(label) + '" aria-label="' + esc(label) + '">' + icon + "</button>";
  }
  function empty(title, body) {
    return '<div class="empty"><div class="empty-ico">' + I.check + "</div><h3>" + esc(title) + "</h3><p>" + esc(body) + "</p></div>";
  }
  function pendingCount() {
    return requests.filter(function (r) { return r.status === "pending"; }).length;
  }
  function bars(data, alt) {
    var max = Math.max.apply(null, data.values.concat([1]));
    return '<div class="bars">' + data.labels.map(function (lab, i) {
      var h = Math.round((data.values[i] / max) * 110);
      return '<div class="bar-col"><div class="bar' + (alt ? " alt" : "") + '" style="height:' + h + 'px" title="' + data.values[i] + '"></div><span>' + esc(lab) + "</span></div>";
    }).join("") + "</div>";
  }
  function panel(title, sub, extra, body) {
    return '<section class="panel"><div class="panel-h"><div><h2>' + title + "</h2>" + (sub ? '<p class="panel-sub">' + sub + "</p>" : "") + "</div>" + (extra || "") + "</div>" + body + "</section>";
  }

  function renderNav() {
    var html = "";
    var lastG = "";
    NAV.forEach(function (it) {
      if (it[3] && it[3] !== lastG) { lastG = it[3]; html += '<div class="nav-group">' + it[3] + "</div>"; }
      var count = it[0] === "requests" && pendingCount() ? '<span class="count">' + pendingCount() + "</span>" : "";
      html += '<button class="nav-btn' + (page === it[0] ? " active" : "") + '" data-page="' + it[0] + '">' + I[it[2]] + "<span>" + it[1] + "</span>" + count + "</button>";
    });
    $("nav").innerHTML = html;
    $("bottomNav").innerHTML = [
      ["dashboard", "Home", "dash"],
      ["requests", "Requests", "requests"],
      ["members", "Members", "members"],
      ["queue", "Queue", "queue"],
      ["more", "More", "menu"]
    ].map(function (it) {
      var active = it[0] === "more" ? ["regions", "trades", "alerts", "reports", "chats", "plans", "ai", "broadcast", "settings", "audit"].indexOf(page) >= 0 : page === it[0];
      var count = it[0] === "requests" && pendingCount() ? '<span class="count">' + pendingCount() + "</span>" : "";
      return '<button class="bnav' + (active ? " active" : "") + '" data-page="' + it[0] + '">' + I[it[2]] + "<span>" + it[1] + "</span>" + count + "</button>";
    }).join("");
  }

  function kpis() {
    return '<div class="kpis">' +
      '<article class="kpi kpi-amber"><div class="kpi-ico">' + I.requests + '</div><div class="n">' + pendingCount() + '</div><div class="l">Profiles waiting</div><div class="kpi-trend up">' + I.trend + " +2 this week</div></article>" +
      '<article class="kpi kpi-teal"><div class="kpi-ico">' + I.members + '</div><div class="n">' + members.filter(function (m) { return m.status === "active"; }).length + '</div><div class="l">Active members</div><div class="kpi-trend up">' + I.trend + " +5 this month</div></article>" +
      '<article class="kpi kpi-blue"><div class="kpi-ico">' + I.alerts + '</div><div class="n">7</div><div class="l">Alerts this week</div><div class="kpi-trend up">' + I.trend + " +3 vs last week</div></article>" +
      '<article class="kpi kpi-navy"><div class="kpi-ico">' + I.queue + '</div><div class="n">' + queue.length + '</div><div class="l">In the promo queue</div><div class="kpi-trend flat">1 paid jump pending</div></article>' +
      "</div>";
  }

  function requestRows(list, compact) {
    if (!list.length) return empty("No requests right now", "New member applications will appear here for you to approve.");
    return '<table><thead><tr><th>Member</th><th>Trade</th>' + (compact ? "" : "<th>Areas</th>") + "<th>When</th><th>Status</th><th></th></tr></thead><tbody>" +
      list.map(function (r) {
        var name = r.first + " " + r.last;
        return "<tr><td data-label=\"Member\">" + who(name, r.business) + "</td>" +
          '<td data-label="Trade">' + esc(r.trade) + "</td>" +
          (compact ? "" : '<td data-label="Areas">' + esc(r.areas) + "</td>") +
          '<td data-label="When">' + esc(r.when) + "</td>" +
          '<td data-label="Status">' + badge(r.status) + "</td>" +
          '<td data-label="">' + (r.status === "pending"
            ? '<div class="row-actions">' + icoBtn("approve", r.id, "ok", I.check, "Approve") + icoBtn("decline", r.id, "no", I.x, "Decline") + "</div>"
            : "") + "</td></tr>";
      }).join("") + "</tbody></table>";
  }

  function pageHTML() {
    if (page === "dashboard") {
      return kpis() +
        '<div class="dash-grid">' +
          '<section class="chart-card"><div class="panel-h"><div><h2>Members joined</h2><p class="panel-sub">Fictional weekly sign-ups</p></div></div>' + bars(memberWeeks) + "</section>" +
          '<section class="chart-card"><div class="panel-h"><div><h2>Recommendation alerts</h2><p class="panel-sub">Fictional weekly alerts sent</p></div></div>' + bars(alertWeeks, true) + "</section>" +
        "</div>" +
        '<div class="dash-grid">' +
          panel("Recent profile requests", "Approve or decline from here", '<button class="btn btn-ghost btn-sm" data-page="requests">' + I.requests + "<span>View all</span></button>", requestRows(requests, true)) +
          '<div>' +
            panel("Recent activity", "What has happened in the circle", "", '<div class="feed">' + activity.map(function (a) {
              return '<div class="feed-item"><div class="feed-dot ' + a.kind + '"></div><div><p>' + esc(a.text) + "</p><span>" + esc(a.at) + "</span></div></div>";
            }).join("") + "</div>") +
            panel("Promotion queue", "Who is up next", '<button class="btn btn-ghost btn-sm" data-page="queue">' + I.queue + "<span>Manage</span></button>", queue.slice(0, 4).map(function (row) {
              return '<div class="queue-row"><div class="pos' + (row.paid ? " paid" : "") + '">' + row.pos + "</div>" + av(row.name, "av-sm") + "<div><div class=\"name\">" + esc(row.name) + '</div><div class="sub">' + esc(row.when) + "</div></div>" + badge(row.plan) + "</div>";
            }).join("")) +
          "</div>" +
        "</div>";
    }
    if (page === "requests") {
      var detail = requests.filter(function (r) { return r.status === "pending"; }).map(function (r) {
        return '<article class="panel"><div class="panel-h">' + who(r.first + " " + r.last, r.business) + badge(r.status) + "</div>" +
          "<p class=\"panel-sub\" style=\"margin-bottom:10px\">" + esc(r.bio) + "</p>" +
          '<table><tbody><tr><td data-label="Trade">' + esc(r.trade) + '</td><td data-label="Areas">' + esc(r.areas) + '</td><td data-label="Phone">' + esc(r.phone) + '</td><td data-label="Submitted">' + esc(r.when) + "</td></tr></tbody></table>" +
          '<div class="row-actions" style="margin-top:12px"><button class="btn btn-ok btn-sm" data-action="approve" data-id="' + r.id + '">' + I.check + "<span>Approve</span></button>" +
          '<button class="btn btn-danger btn-sm" data-action="decline" data-id="' + r.id + '">' + I.x + "<span>Decline</span></button></div></article>";
      }).join("");
      return (detail || empty("No one is waiting", "New profile requests will land here.")) + panel("All requests", "Including ones you have already reviewed", "", requestRows(requests, false));
    }
    if (page === "members") {
      var list = members.filter(function (m) {
        var hay = (m.name + " " + m.business + " " + m.trade + " " + m.areas).toLowerCase();
        return !q || hay.indexOf(q.toLowerCase()) >= 0;
      });
      return panel("Members", members.length + " members in this fictional circle", "",
        '<div class="search"><input id="memSearch" type="search" placeholder="Search by name, trade or area" value="' + esc(q) + '"><select id="memFilter"><option value="">All statuses</option><option>active</option><option>suspended</option></select></div>' +
        (list.length ? '<table><thead><tr><th>Member</th><th>Trade</th><th>Areas</th><th>Joined</th><th>Status</th><th></th></tr></thead><tbody>' +
          list.map(function (m) {
            return "<tr><td data-label=\"Member\">" + who(m.name, m.business) + '</td><td data-label="Trade">' + esc(m.trade) + '</td><td data-label="Areas">' + esc(m.areas) + '</td><td data-label="Joined">' + esc(m.joined) + '</td><td data-label="Status">' + badge(m.status) + '</td><td data-label=""><div class="row-actions">' +
              icoBtn("edit-mem", m.id, "more", I.edit, "Edit") +
              icoBtn("suspend", m.id, m.status === "active" ? "no" : "ok", m.status === "active" ? I.x : I.check, m.status === "active" ? "Suspend" : "Reactivate") +
              "</div></td></tr>";
          }).join("") + "</tbody></table>" : empty("No members match", "Try a different name, trade or area.")));
    }
    if (page === "regions") {
      return panel("Service regions", "Used in the app’s area picker", '<button class="btn btn-primary btn-sm" data-action="add-region">' + I.plus + "<span>Add a region</span></button>",
        '<div class="chips">' + regions.map(function (r, i) {
          return '<span class="chip">' + esc(r) + ' <button type="button" data-action="del-region" data-id="' + i + '" aria-label="Remove">×</button></span>';
        }).join("") + "</div>");
    }
    if (page === "trades") {
      var shown = trades.slice(0, 80);
      return panel("Trade list", trades.length + " trades from Australian directories", '<button class="btn btn-primary btn-sm" data-action="add-trade">' + I.plus + "<span>Add a trade</span></button>",
        '<div class="chips">' + shown.map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") + "</div>" +
        (trades.length > 80 ? '<p class="panel-sub" style="margin-top:12px">Showing the first 80. The full list is in the app trade picker.</p>' : ""));
    }
    if (page === "alerts") {
      return panel("Recommendation alerts", "Posts the circle was asked to comment on", "",
        '<table><thead><tr><th>Posted by</th><th>Trade</th><th>Facebook post</th><th>Comments</th><th>When</th><th>Status</th></tr></thead><tbody>' +
        alerts.map(function (a) {
          return "<tr><td data-label=\"Posted by\">" + who(a.by, "") + '</td><td data-label="Trade">' + esc(a.trade) + '</td><td data-label="Facebook post">' + esc(a.post) + '</td><td data-label="Comments">' + a.comments + '</td><td data-label="When">' + esc(a.when) + '</td><td data-label="Status">' + badge(a.status) + "</td></tr>";
        }).join("") + "</tbody></table>");
    }
    if (page === "queue") {
      return panel("Promotion queue", "Everyone gets a free turn. Jumping the queue is paid, with the price still to be set.", "",
        (queue.length ? '<table><thead><tr><th>#</th><th>Member</th><th>Plan</th><th>When</th><th></th></tr></thead><tbody>' +
          queue.map(function (row) {
            return "<tr><td data-label=\"#\"><div class=\"pos" + (row.paid ? " paid" : "") + '">' + row.pos + "</div></td><td data-label=\"Member\">" + who(row.name, row.plan) + '</td><td data-label="Plan">' + badge(row.plan) + '</td><td data-label="When">' + esc(row.when) + '</td><td data-label=""><div class="row-actions">' +
              icoBtn("move-up", String(row.pos), "more", I.up, "Move up") +
              icoBtn("remove-q", String(row.pos), "no", I.x, "Remove") +
              "</div></td></tr>";
          }).join("") + "</tbody></table>" : empty("The queue is empty", "Members can request a turn from the app.")));
    }
    if (page === "reports") {
      return panel("Flagged content", "Reports from members, waiting for a decision", "",
        flags.length ? '<table><thead><tr><th>From</th><th>About</th><th>Reason</th><th>When</th><th>Status</th><th></th></tr></thead><tbody>' +
          flags.map(function (f) {
            return "<tr><td data-label=\"From\">" + who(f.who, "") + '</td><td data-label="About">' + esc(f.about) + '</td><td data-label="Reason">' + esc(f.reason) + '</td><td data-label="When">' + esc(f.when) + '</td><td data-label="Status">' + badge(f.status) + '</td><td data-label="">' +
              '<div class="row-actions">' + icoBtn("resolve", f.id, "ok", I.check, "Resolve") + "</div></td></tr>";
          }).join("") + "</tbody></table>" : empty("Nothing flagged", "When a member reports a message or profile, it will show here."));
    }
    if (page === "chats") {
      return panel("Chat moderation", "A sample of recent conversations. This is fictional.", "",
        '<table><thead><tr><th>From</th><th>Room</th><th>Message</th><th>Flag</th><th>When</th></tr></thead><tbody>' +
        chats.map(function (c) {
          return "<tr><td data-label=\"From\">" + who(c.from, "") + '</td><td data-label="Room">' + esc(c.room) + '</td><td data-label="Message">' + esc(c.text) + '</td><td data-label="Flag">' + (c.flag === "None" ? badge("Handled") : badge("Open")) + " " + esc(c.flag) + '</td><td data-label="When">' + esc(c.when) + "</td></tr>";
        }).join("") + "</tbody></table>");
    }
    if (page === "plans") {
      return '<div class="dash-grid">' +
        '<section class="panel"><div class="panel-h"><h2>Free</h2><span class="price-tbc">Current plan</span></div><p class="panel-sub">The circle is free for now. Members can join, chat, send alerts and take a free turn in the promotion queue.</p></section>' +
        '<section class="panel"><div class="panel-h"><h2>Pro</h2><span class="price-tbc">Price to be set</span></div><p class="panel-sub">Planned later. Could include jumping the promotion queue and extra tools. No payment is collected in this prototype.</p></section>' +
        "</div>" +
        panel("Members on a plan", "Fictional counts only", "",
          '<table><thead><tr><th>Plan</th><th>Members</th><th>Price</th></tr></thead><tbody>' +
          "<tr><td data-label=\"Plan\">Free</td><td data-label=\"Members\">8</td><td data-label=\"Price\">Free for now</td></tr>" +
          "<tr><td data-label=\"Plan\">Pro</td><td data-label=\"Members\">0</td><td data-label=\"Price\"><span class=\"price-tbc\">Price to be set</span></td></tr></tbody></table>");
    }
    if (page === "ai") {
      return panel("AI integrations", "Members can connect their own assistant in the app. This is a prototype — nothing is actually connected.", "",
        '<div class="setting-row"><div><strong>Allow Grok</strong><div class="panel-sub">Shown as a mock option in the app.</div></div><button class="toggle on" data-action="toggle" type="button" aria-pressed="true"><i></i></button></div>' +
        '<div class="setting-row"><div><strong>Allow ChatGPT</strong><div class="panel-sub">Shown as a mock option in the app.</div></div><button class="toggle on" data-action="toggle" type="button" aria-pressed="true"><i></i></button></div>' +
        '<div class="setting-row"><div><strong>Allow Claude</strong><div class="panel-sub">Shown as a mock option in the app.</div></div><button class="toggle on" data-action="toggle" type="button" aria-pressed="true"><i></i></button></div>' +
        '<div class="setting-row"><div><strong>Voice commands</strong><div class="panel-sub">The assistant opens the right screen. The member still taps to confirm friend requests and reviews.</div></div><button class="toggle on" data-action="toggle" type="button" aria-pressed="true"><i></i></button></div>');
    }
    if (page === "broadcast") {
      return panel("Broadcast a notification", "This is a mock. Nothing is sent to real phones.", "",
        '<div class="field"><label>Title</label><input id="bcTitle" value="Reminder: Hills meet this Thursday"></div>' +
        '<div class="field"><label>Message</label><textarea id="bcBody" rows="4">The weekly catch-up is at 6:30 pm in Midland. Bring a mate if you like.</textarea></div>' +
        '<button class="btn btn-primary btn-sm" data-action="broadcast" style="width:auto">' + I.send + "<span>Send mock broadcast</span></button>");
    }
    if (page === "settings") {
      return panel("General settings", "Prototype only — changes stay in this browser session.", "",
        '<div class="setting-row"><div><strong>New members need approval</strong><div class="panel-sub">Decided. New sign-ups wait until you approve them.</div></div><button class="toggle on" data-action="toggle" type="button" aria-pressed="true"><i></i></button></div>' +
        '<div class="setting-row"><div><strong>Recommendation alerts</strong><div class="panel-sub">Members get a push when someone shares a Facebook post.</div></div><button class="toggle on" data-action="toggle" type="button" aria-pressed="true"><i></i></button></div>' +
        '<div class="setting-row"><div><strong>Paid queue jumps</strong><div class="panel-sub">Price to be set. No payments are collected in this prototype.</div></div><button class="toggle on" data-action="toggle" type="button" aria-pressed="true"><i></i></button></div>');
    }
    if (page === "audit") {
      return panel("Audit log", "A record of admin and system actions. Fictional.", "",
        '<table><thead><tr><th>When</th><th>Who</th><th>Action</th></tr></thead><tbody>' +
        audit.map(function (a) {
          return "<tr><td data-label=\"When\">" + esc(a.at) + '</td><td data-label="Who">' + who(a.who, "") + '</td><td data-label="Action">' + esc(a.action) + "</td></tr>";
        }).join("") + "</tbody></table>");
    }
    return empty("Coming later", "This page is not in the prototype yet.");
  }

  function paint() {
    renderNav();
    var t = TITLES[page] || ["Admin", "Admin"];
    $("pageEyebrow").textContent = t[0];
    $("pageTitle").textContent = t[1];
    $("page").innerHTML = pageHTML();
    var search = $("memSearch");
    if (search) {
      search.value = q;
      search.focus();
      try { search.setSelectionRange(q.length, q.length); } catch (e) {}
    }
  }

  function openMenu() { $("side").classList.add("open"); $("backdrop").classList.remove("hidden"); }
  function closeMenu() { $("side").classList.remove("open"); $("backdrop").classList.add("hidden"); }

  function renderNotifs() {
    $("notifPanel").innerHTML =
      "<h3>Notifications</h3>" +
      [["Nina Kaur applied to join.", "Today 8:10 am", "requests"],
       ["A pest control alert is still open.", "Today 7:30 am", "alerts"],
       ["Tom Reeves jumped the promotion queue.", "Sat 10:12 am", "queue"]].map(function (n) {
        return '<button class="notif-item" type="button" data-page="' + n[2] + '">' + av(n[0]) + "<div><p>" + esc(n[0]) + "</p><span>" + n[1] + "</span></div></button>";
      }).join("");
  }

  function go(id) {
    if (id === "more") { openMenu(); return; }
    page = id;
    notifOpen = false;
    $("notifPanel").classList.add("hidden");
    closeMenu();
    paint();
  }

  $("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    $("loginView").classList.add("hidden");
    $("appView").classList.remove("hidden");
    paint();
  });
  $("menuBtn").addEventListener("click", function () {
    if ($("side").classList.contains("open")) closeMenu(); else openMenu();
  });
  $("backdrop").addEventListener("click", closeMenu);
  $("notifBtn").addEventListener("click", function (e) {
    e.stopPropagation();
    notifOpen = !notifOpen;
    $("notifPanel").classList.toggle("hidden", !notifOpen);
    if (notifOpen) renderNotifs();
  });
  document.addEventListener("click", function (e) {
    if (notifOpen && !$("notifPanel").contains(e.target) && e.target !== $("notifBtn") && !$("notifBtn").contains(e.target)) {
      notifOpen = false;
      $("notifPanel").classList.add("hidden");
    }
    var nav = e.target.closest("[data-page]");
    if (nav && !e.target.closest("[data-action]")) {
      go(nav.getAttribute("data-page"));
    }
    var btn = e.target.closest("[data-action]");
    if (!btn) return;
    var a = btn.getAttribute("data-action");
    var id = btn.getAttribute("data-id");
    if (a === "approve" || a === "decline") {
      requests.forEach(function (r) { if (r.id === id) r.status = a === "approve" ? "approved" : "declined"; });
      audit.unshift({ at: "Just now", who: "Vishal (you)", action: (a === "approve" ? "Approved" : "Declined") + " a profile request" });
      paint();
    }
    if (a === "suspend") {
      members.forEach(function (m) { if (m.id === id) m.status = m.status === "active" ? "suspended" : "active"; });
      audit.unshift({ at: "Just now", who: "Vishal (you)", action: "Updated a member’s status" });
      paint();
    }
    if (a === "edit-mem") { window.alert("In a real build this would open an edit form. This is a prototype."); }
    if (a === "add-trade") {
      var name = window.prompt("Trade name to add (prototype only)");
      if (name && name.trim()) { trades.unshift(name.trim()); paint(); }
    }
    if (a === "add-region") {
      var region = window.prompt("Region name to add (prototype only)");
      if (region && region.trim()) { regions.push(region.trim()); paint(); }
    }
    if (a === "del-region") {
      regions.splice(Number(id), 1);
      paint();
    }
    if (a === "resolve") { flags = flags.filter(function (f) { return f.id !== id; }); paint(); }
    if (a === "broadcast") {
      audit.unshift({ at: "Just now", who: "Vishal (you)", action: "Sent a mock broadcast" });
      window.alert("Mock broadcast queued. No real notification was sent.");
    }
    if (a === "move-up" || a === "remove-q") { window.alert("Queue change saved in this prototype only."); }
    if (a === "toggle") { btn.classList.toggle("on"); btn.setAttribute("aria-pressed", btn.classList.contains("on") ? "true" : "false"); }
  });
  document.addEventListener("input", function (e) {
    if (e.target.id === "memSearch") { q = e.target.value; paint(); }
    if (e.target.id === "globalSearch" && e.target.value.length > 1) {
      q = e.target.value;
      if (page !== "members") { page = "members"; paint(); $("globalSearch").value = q; }
      else paint();
    }
  });
  document.addEventListener("change", function (e) {
    if (e.target.id === "memFilter") {
      var val = e.target.value;
      q = val ? q : q;
      if (val) {
        // filter visually by temporarily wrapping paint — keep simple: store on element
      }
    }
  });

  $("loginBtn").innerHTML = I.login + "<span>Sign in to dashboard</span>";
  $("menuBtn").innerHTML = I.menu;
  $("notifBtn").insertAdjacentHTML("afterbegin", I.bell);

  if (/[?&]shot=/.test(location.search) || location.hash === "#app") {
    $("loginView").classList.add("hidden");
    $("appView").classList.remove("hidden");
    var m = location.search.match(/shot=([a-z-]+)/);
    if (m && m[1] && m[1] !== "login") page = m[1];
    if (location.hash.replace("#", "") && location.hash !== "#app") page = location.hash.replace("#", "");
    paint();
  }
})();
