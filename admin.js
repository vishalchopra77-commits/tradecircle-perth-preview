/* Rate Buddies — super admin prototype v1.8.0 */
(function () {
  "use strict";
  function svg(inner) {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + "</svg>";
  }
  function facebookF(size, color) {
    size = size || 18;
    return '<svg class="f-ico" viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="' + (color || "currentColor") + '" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg>';
  }
  function googleG(size, mono) {
    size = size || 16;
    if (mono) return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09zM12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23zM5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84zM12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
  }
  function notifGlyph(type, size) {
    size = size || 16;
    var stroke = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    if (type === "review") return googleG(size);
    if (type === "queue") return facebookF(size);
    if (type === "friend") return facebookF(size);
    if (type === "member") return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" ' + stroke + ' aria-hidden="true"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="3.5"/><path d="M19 8v6M16 11h6"/></svg>';
    if (type === "chat") return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" ' + stroke + ' aria-hidden="true"><path d="M21 12a8 8 0 01-8 8H7l-4 3V12a8 8 0 018-8h2a8 8 0 018 8z"/></svg>';
    if (type === "alert") return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" ' + stroke + ' aria-hidden="true"><path d="M3 10v4h4l6 4V6L7 10H3z"/><path d="M16.8 8.2a4.2 4.2 0 010 7.6"/><path d="M18.7 5.6a8 8 0 010 12.8"/></svg>';
    if (type === "admin") return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" ' + stroke + ' aria-hidden="true"><path d="M12 3l8 3v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-3z"/><path d="M8.5 12l2.5 2.5 5-5"/></svg>';
    if (type === "limit") return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" ' + stroke + ' aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>';
    return facebookF(size);
  }
  function notifTile(type, size) {
    var styles = { review: ["#E8F1FD","#1A73E8"], queue: ["#E8F1FD","#1877F2"], friend: ["#E8F1FD","#1877F2"], member: ["#E8F1FD","#0D3F9C"], chat: ["#EEF2F6","#0B1F33"], alert: ["#FFF6E0","#8A5A00"], admin: ["#EEF2F6","#14314C"], limit: ["#F6E8E8","#7A1F1A"] };
    var st = styles[type] || styles.admin;
    return '<div class="notif-ico" style="background:' + st[0] + ';color:' + st[1] + '">' + notifGlyph(type, size || 16) + "</div>";
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


  function defaultBadgeTiers() {
    return [
      { id: "bronze", label: "Bronze", min: 5 },
      { id: "silver", label: "Silver", min: 12 },
      { id: "gold", label: "Gold", min: 25 },
      { id: "platinum", label: "Platinum", min: 50 }
    ];
  }
  function badgeTiers() {
    try {
      var raw = JSON.parse(localStorage.getItem("tc_badge_tiers"));
      if (Array.isArray(raw) && raw.length) {
        return defaultBadgeTiers().map(function (d, i) {
          var x = raw[i] || {};
          return { id: x.id || d.id, label: x.label || d.label, min: Math.max(0, Number(x.min) || d.min) };
        });
      }
    } catch (e) {}
    return defaultBadgeTiers();
  }
  function badgeTiersAdmin() {
    var rows = badgeTiers().map(function (t) {
      return '<div class="setting-row"><div><strong>' + t.label + ' badge</strong><div class="panel-sub">Combined Google Reviews given + confirmed Facebook vouches needed to reach ' + t.label + '.</div></div>' +
        '<input class="badge-tier" data-tier="' + t.id + '" type="number" min="0" max="200" value="' + t.min + '" style="width:72px;height:40px;border:1px solid var(--line,#d5dde6);border-radius:10px;padding:0 10px;font-weight:800"></div>';
    }).join("");
    return '<div style="margin-top:16px"><p class="panel-sub" style="margin-bottom:8px"><strong>Badge levels</strong> — members earn a badge from the Google Reviews they give and the Facebook vouches that are confirmed. A badge is what gets them into the Facebook Promotion queue. These counts are easy to change.</p>' + rows + "</div>";
  }

  function reviewCap() {
    try {
      var n = JSON.parse(localStorage.getItem("tc_review_daily_limit"));
      if (typeof n === "number" && n >= 1) return n;
    } catch (e) {}
    return 3;
  }
  var selectedMem = null;
  var trades = (window.TC_TRADES || []).slice();
  var requests = [
    { id: "p1", first: "Nina", last: "Kaur", business: "Kaur Tiling", trade: "Tiler", areas: "South, Fremantle", phone: "0412 000 201", status: "pending", when: "Today 8:10 am", bio: "Bathroom and floor tiling across the southern suburbs." },
    { id: "p2", first: "Owen", last: "Wright", business: "Wright Roofing Co", trade: "Roofer", areas: "Hills, North", phone: "0412 000 202", status: "pending", when: "Today 7:44 am", bio: "Roof repairs and restorations. Family-run." },
    { id: "p3", first: "Ayla", last: "Santos", business: "Santos Cleaning", trade: "End of Lease Cleaner", areas: "Central / CBD", phone: "0412 000 203", status: "pending", when: "Yesterday", bio: "End-of-lease and after-builders cleans." }
  ];
  var members = [
    { id: "jamie", name: "Jamie Hale", business: "Hale Pest Control", trade: "Pest Control", areas: "Hills, North", status: "active", joined: "12 Jan 2026", website: "https://www.halepest.example.au", facebook: "https://www.facebook.com/demo.halepestcontrol.biz", instagram: "https://www.instagram.com/demo.halepest", linkedin: "https://www.linkedin.com/company/demo-hale-pest", tiktok: "", youtube: "", google: "https://search.google.com/local/writereview?placeid=demo-hale-pest", other: "" },
    { id: "sarah", name: "Sarah Nguyen", business: "Nguyen Carpentry", trade: "Carpenter", areas: "North, Joondalup", status: "active", joined: "18 Jan 2026", website: "https://www.nguyencarpentry.example.au", facebook: "https://www.facebook.com/demo.nguyencarpentry.biz", instagram: "https://www.instagram.com/demo.nguyencarpentry", linkedin: "", tiktok: "", youtube: "", google: "https://search.google.com/local/writereview?placeid=demo-nguyen-carpentry", other: "" },
    { id: "liam", name: "Liam O’Connor", business: "O’Connor Plumbing", trade: "Plumber", areas: "South, Fremantle", status: "active", joined: "2 Feb 2026" },
    { id: "michael", name: "Michael Shaw", business: "Shaw Plumbing", trade: "Plumber", areas: "Joondalup, North", status: "active", joined: "15 Apr 2026" },
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
    { type: "admin", text: "Emma Brooks was approved and can now join the circle.", at: "Yesterday 4:20 pm" },
    { type: "admin", text: "Three new profile requests are waiting for your review.", at: "Today 8:10 am" },
    { type: "alert", text: "A pest control recommendation alert was sent to the circle.", at: "Yesterday 11:05 am" },
    { type: "queue", text: "Tom Reeves jumped the promotion queue (price to be set).", at: "Sat 10:12 am" },
    { type: "review", text: "Hannah Lewis left a Google review for Jamie Hale.", at: "Fri 6:30 pm" },
    { type: "limit", text: "Thompson Electrical reached the daily Google review limit (3 of 3).", at: "Today 8:02 am" }
  ];
  var memberWeeks = { labels: ["6 Oct", "13 Oct", "20 Oct", "27 Oct", "3 Nov", "10 Nov"], values: [2, 3, 1, 4, 2, 5] };
  var alertWeeks = { labels: ["6 Oct", "13 Oct", "20 Oct", "27 Oct", "3 Nov", "10 Nov"], values: [3, 5, 2, 6, 4, 7] };
  var fbPosts = [
    { id: "p1", group: "Perth Hills Community Noticeboard", ask: "Anyone recommend a good electrician in Kalamunda?", member: "Jack Thompson", trade: "Electrician", link: "facebook.com/groups/perth.hills.noticeboard.demo/posts/482190", when: "Today 8:04 am", vouched: 3, of: 8, status: "Open", notified: true },
    { id: "p2", group: "Hills Mums & Dads", ask: "Need a reliable pest controller in Midland for termites.", member: "Jamie Hale", trade: "Pest Control", link: "facebook.com/groups/hills.mums.dads.demo/posts/771204", when: "Today 8:10 am", vouched: 5, of: 12, status: "Open", notified: true },
    { id: "p3", group: "Joondalup Home Owners", ask: "Looking for a plumber in Mullaloo, leaking tap.", member: "Liam O’Connor", trade: "Plumber", link: "facebook.com/groups/joondalup.homeowners.demo/posts/119004", when: "Yesterday", vouched: 1, of: 8, status: "Open", notified: true },
    { id: "p4", group: "Northern Suburbs Tradie Talk", ask: "Anyone know a good carpenter in Warwick for a deck repair?", member: "Sarah Nguyen", trade: "Carpenter", link: "facebook.com/groups/northern.tradie.talk.demo/posts/330112", when: "Yesterday", vouched: 6, of: 8, status: "Done", notified: true },
    { id: "p5", group: "Fremantle Community Noticeboard", ask: "Need an air-con technician in Fremantle before the weekend.", member: "Emma Brooks", trade: "Air Conditioning", link: "facebook.com/groups/fremantle.community.demo/posts/908441", when: "5 days ago", vouched: 2, of: 8, status: "Expired", notified: false }
  ];
  var page = "dashboard";
  var q = "";
  var notifOpen = false;

  I.queue = facebookF(18);
  var NAV = [
    ["dashboard", "Dashboard", "dash", "Overview"],
    ["requests", "Profile requests", "requests", "People"],
    ["members", "Members", "members"],
    ["regions", "Regions", "regions", "Lists"],
    ["trades", "Trades &amp; businesses", "trades"],
    ["alerts", "Recommendation alerts", "alerts", "Circle"],
    ["fb-posts", "Facebook recommendations", "alerts"],
    ["queue", "Promotion queue", "queue"],
    ["reports", "Reports", "reports"],
    ["chats", "Chat moderation", "chats"],
    ["support", "Support inbox", "chats"],
    ["devi", "Devi automation", "ai", "Automations"],
    ["devi-inbox", "Incoming requests", "alerts"],
    ["tutorials", "Video tutorials", "ai", "Content"],
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
    trades: ["Lists", "Trades and business types"],
    alerts: ["Circle", "Recommendation alerts"],
    "fb-posts": ["Circle", "Facebook recommendations"],
    "fb-posts-list": ["Circle", "Facebook recommendations"],
    queue: ["Circle", "Promotion queue"],
    reports: ["Circle", "Reports"],
    chats: ["Circle", "Chat moderation"],
    support: ["Circle", "Support inbox"],
    devi: ["Automations", "Devi automation"],
    "devi-inbox": ["Automations", "Incoming requests"],
    tutorials: ["Content", "Video tutorials"],
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
    /* v2.1.3: a member's trade always shows with their name (shared in admin lists) */
    try {
      var mm = (typeof members !== "undefined" && members || []).find(function (x) { return x.name === name; });
      if (mm && mm.trade && String(sub || "").toLowerCase().indexOf(String(mm.trade).toLowerCase()) === -1) sub = mm.trade + (sub ? " · " + sub : "");
    } catch (e) {}
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
      Done: ["b-ok", "Done"],
      Expired: ["b-info", "Expired"],
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
      var count = "";
      if (it[0] === "requests" && pendingCount()) count = '<span class="count">' + pendingCount() + "</span>";
      if (it[0] === "devi-inbox" && window.TC180Admin && TC180Admin.pendingCount) {
        var dc = TC180Admin.pendingCount();
        if (dc) count = '<span class="count">' + dc + "</span>";
      }
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
      var active = it[0] === "more" ? ["regions", "trades", "alerts", "fb-posts", "reports", "chats", "devi", "devi-inbox", "tutorials", "plans", "ai", "broadcast", "settings", "audit"].indexOf(page) >= 0 : page === it[0];
      var count = it[0] === "requests" && pendingCount() ? '<span class="count">' + pendingCount() + "</span>" : "";
      return '<button class="bnav' + (active ? " active" : "") + '" data-page="' + it[0] + '">' + I[it[2]] + "<span>" + it[1] + "</span>" + count + "</button>";
    }).join("");
  }

  function kpis() {
    return '<div class="kpis">' +
      '<article class="kpi kpi-amber"><div class="kpi-ico">' + I.requests + '</div><div class="n">' + pendingCount() + '</div><div class="l">Profiles waiting</div><div class="kpi-trend up">' + I.trend + (window.__rbKpi ? " " + __rbKpi.pendingTrend : " +2 this week") + "</div></article>" +
      '<article class="kpi kpi-teal"><div class="kpi-ico">' + I.members + '</div><div class="n">' + members.filter(function (m) { return m.status === "active"; }).length + '</div><div class="l">Active members</div><div class="kpi-trend up">' + I.trend + (window.__rbKpi ? " " + __rbKpi.membersTrend : " +5 this month") + "</div></article>" +
      '<article class="kpi kpi-blue"><div class="kpi-ico">' + I.alerts + '</div><div class="n">' + (window.__rbKpi ? __rbKpi.alertsWeek : 7) + '</div><div class="l">Alerts this week</div><div class="kpi-trend up">' + I.trend + (window.__rbKpi ? " " + __rbKpi.alertsTrend : " +3 vs last week") + "</div></article>" +
      '<article class="kpi kpi-navy"><div class="kpi-ico">' + I.queue + '</div><div class="n">' + queue.length + '</div><div class="l">In the promo queue</div><div class="kpi-trend flat">' + (window.__rbKpi ? __rbKpi.queueTrend : "1 paid jump pending") + '</div></article>' +
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
          '<section class="chart-card"><div class="panel-h"><div><h2>Members joined</h2><p class="panel-sub">' + (window.__rbKpi ? "Weekly sign-ups (live)" : "Fictional weekly sign-ups") + '</p></div></div>' + bars(memberWeeks) + "</section>" +
          '<section class="chart-card"><div class="panel-h"><div><h2>Recommendation alerts</h2><p class="panel-sub">' + (window.__rbKpi ? "Weekly alerts approved (live)" : "Fictional weekly alerts sent") + '</p></div></div>' + bars(alertWeeks, true) + "</section>" +
        "</div>" +
        '<div class="dash-grid">' +
          panel("Recent profile requests", "Approve or decline from here", '<button class="btn btn-ghost btn-sm" data-page="requests">' + I.requests + "<span>View all</span></button>", requestRows(requests, true)) +
          '<div>' +
            panel("Recent activity", "What has happened in the circle", "", '<div class="feed">' + activity.map(function (a) {
              return '<div class="feed-item">' + notifTile(a.type || "admin", 16) + '<div><p>' + esc(a.text) + "</p><span>" + esc(a.at) + "</span></div></div>";
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
      return panel("Members", members.length + (window.__rbKpi ? " members (live)" : " members in this fictional circle"), "",
        '<div class="search"><input id="memSearch" type="search" placeholder="Search by name, trade or area" value="' + esc(q) + '"><select id="memFilter"><option value="">All statuses</option><option>active</option><option>suspended</option></select></div>' +
        (list.length ? '<table><thead><tr><th>Member</th><th>Trade</th><th>Areas</th><th>Joined</th><th>Status</th><th>Intro</th><th></th></tr></thead><tbody>' +
          list.map(function (m) {
            var intro = (window.TCTutorials && TCTutorials.introWatched(m.id)) ? "✓" : "✗";
            return "<tr><td data-label=\"Member\">" + who(m.name, m.business) + '</td><td data-label="Trade">' + esc(m.trade) + '</td><td data-label="Areas">' + esc(m.areas) + '</td><td data-label="Joined">' + esc(m.joined) + '</td><td data-label="Status">' + badge(m.status) + '</td><td data-label="Intro">' + intro + '</td><td data-label=""><div class="row-actions">' +
              icoBtn("edit-mem", m.id, "more", I.edit, "Edit") +
              icoBtn("suspend", m.id, m.status === "active" ? "no" : "ok", m.status === "active" ? I.x : I.check, m.status === "active" ? "Suspend" : "Reactivate") +
              "</div></td></tr>";
          }).join("") + "</tbody></table>" : empty("No members match", "Try a different name, trade or area.")));
    }
    if (page === "regions") {
      var locStates = (window.TC_LOCATIONS && TC_LOCATIONS.states) || [];
      var official = "";
      if (locStates.length) {
        official = locStates.map(function (st) {
          var metro = st.regions.filter(function (r) { return r.type === "metro"; });
          var regional = st.regions.filter(function (r) { return r.type === "regional"; });
          function chips(list) {
            return '<div class="chips">' + list.map(function (r) { return '<span class="chip">' + esc(r.name) + "</span>"; }).join("") + "</div>";
          }
          var body = '<details class="acc metro" open><summary>Metro · ' + metro.length + "</summary>" + chips(metro) + "</details>";
          if (regional.length) body += '<details class="acc regional"><summary>Regional · ' + regional.length + "</summary>" + chips(regional) + "</details>";
          return '<div style="margin-bottom:18px"><h3 style="margin:0 0 4px;font-size:16px">' + esc(st.name) + " <span style=\"font-weight:650;color:var(--muted, #5B6B7C)\">" + esc(st.abbrev) + "</span></h3>" + body + "</div>";
        }).join("");
      }
      var extras = regions.filter(function (r) {
        return !locStates.some(function (st) { return st.regions.some(function (x) { return x.name === r; }); });
      });
      var extraHtml = extras.length ? ('<p class="group-label" style="margin:16px 0 8px">Custom additions</p><div class="chips">' + extras.map(function (r) {
        var i = regions.indexOf(r);
        return '<span class="chip">' + esc(r) + ' <button type="button" data-action="del-region" data-id="' + i + '" aria-label="Remove">×</button></span>';
      }).join("") + "</div>") : "";
      var count = locStates.reduce(function (n, st) { return n + st.regions.length; }, 0);
      return panel("Service regions", count ? (count + " regions across Australia, grouped by state then metro or regional. Used in the app’s area picker. Perth metro names are unchanged.") : "Used in the app’s area picker",
        '<button class="btn btn-primary btn-sm" data-action="add-region">' + I.plus + "<span>Add a region</span></button>",
        official + extraHtml);
    }
    if (page === "trades") {
      var groups = (window.TC_BUSINESS_CATEGORIES && TC_BUSINESS_CATEGORIES.groups) || [];
      var body;
      if (groups.length) {
        body = groups.map(function (g) {
          return '<p class="group-label" style="margin:16px 0 8px">' + esc(g.name) + " · " + g.items.length + '</p><div class="chips">' +
            g.items.map(function (it) { return '<span class="chip">' + esc(it.name) + "</span>"; }).join("") + "</div>";
        }).join("");
      } else {
        body = '<div class="chips">' + trades.map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") + "</div>";
      }
      return panel("Trades and business types", trades.length + " types from Australian directories (every existing trade, plus shops, salons, cafes and other local businesses)", '<button class="btn btn-primary btn-sm" data-action="add-trade">' + I.plus + "<span>Add a type</span></button>", body);
    }
    if (page === "alerts") {
      return panel("Recommendation alerts", "Posts the circle was asked to comment on", "",
        '<table><thead><tr><th>Posted by</th><th>Trade</th><th>Facebook post</th><th>Comments</th><th>When</th><th>Status</th></tr></thead><tbody>' +
        alerts.map(function (a) {
          return "<tr><td data-label=\"Posted by\">" + who(a.by, "") + '</td><td data-label="Trade">' + esc(a.trade) + '</td><td data-label="Facebook post">' + esc(a.post) + '</td><td data-label="Comments">' + a.comments + '</td><td data-label="When">' + esc(a.when) + '</td><td data-label="Status">' + badge(a.status) + "</td></tr>";
        }).join("") + "</tbody></table>");
    }

    if (page === "fb-posts" || page === "fb-posts-list") {
      var groups = ["Perth Hills Community Noticeboard", "Hills Mums & Dads", "Joondalup Home Owners", "Northern Suburbs Tradie Talk", "Fremantle Community Noticeboard"];
      var form = panel("Post a recommendation request", "Paste a Facebook group post and choose the member the circle should vouch for. Members will see this in the Facebook tab, under Recommend.", "",
        '<form id="fbPostForm" class="fb-post-form">' +
        '<div class="field"><label>Facebook post link</label><input name="link" inputmode="url" placeholder="https://www.facebook.com/groups/..." value=""></div>' +
        '<div class="field"><label>Facebook group</label><select name="group">' + groups.map(function (g) { return "<option>" + esc(g) + "</option>"; }).join("") + "</select></div>" +
        '<div class="field"><label>Member to recommend</label><div class="admin-mem-chips">' +
        members.filter(function (m) { return m.status === "active"; }).map(function (m) {
          return '<label><input type="checkbox" name="mem" value="' + esc(m.id) + '"> ' + esc(m.name) + " · " + esc(m.trade) + "</label>";
        }).join("") + "</div></div>" +
        '<div class="field"><label>Note for members <span style="font-weight:600;text-transform:none;letter-spacing:0">(optional)</span></label><textarea name="note" rows="3" placeholder="e.g. They asked for an electrician in Kalamunda. Only comment if you actually know Jack’s work."></textarea></div>' +
        '<div class="field"><label class="admin-toggle"><input type="checkbox" name="notify" checked> Notify members in the circle</label></div>' +
        '<button class="btn btn-primary" type="submit" data-action="post-fb-rec">' + I.alerts + "<span>Post to the circle</span></button>" +
        '<p class="panel-sub" style="margin-top:10px">This is a prototype. Nothing is posted to Facebook. Members open the link themselves and write their own recommendation.</p></form>');
      var list = panel("Posted links", fbPosts.length + " posts · completion is fictional", "",
        '<table><thead><tr><th>Group</th><th>Member</th><th>Request</th><th>Vouched</th><th>When</th><th>Status</th></tr></thead><tbody>' +
        fbPosts.map(function (p) {
          var pct = Math.round((p.vouched / p.of) * 100);
          return "<tr><td data-label=\"Group\">" + esc(p.group) + '</td><td data-label="Member">' + who(p.member, p.trade) + '</td><td data-label="Request">' + esc(p.ask) + '</td><td data-label="Vouched"><span class="prog-mini"><i style="width:' + pct + '%"></i></span>' + p.vouched + " of " + p.of + '</td><td data-label="When">' + esc(p.when) + '</td><td data-label="Status">' + badge(p.status) + "</td></tr>";
        }).join("") + "</tbody></table>");
      if (page === "fb-posts-list") return list + form;
      return form + list;
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
    if (page === "support") {
      /* v2.1.3: member <-> support desk threads. Demo: fictional rows. Live: RB.listSupport() (needs migration 20261121, not applied yet). */
      var sup = window.__rbSupportRows || [
        { member: "Jamie Hale", trade: "Pest Control", topic: "Reviews", last: "My Google Review for Reeves Fencing is not showing on their card yet.", when: "Yesterday 4:05 pm", open: false },
        { member: "Priya Sharma", trade: "Painter", topic: "Billing", last: "When does my free month end?", when: "Today 9:12 am", open: true },
        { member: "Tom Reeves", trade: "Fencer", topic: "Facebook", last: "The Join Our Facebook Group link opened the browser, is that right?", when: "Today 10:40 am", open: true }
      ];
      var sel = window.__rbSupportSel || 0;
      var th = sup[sel] || sup[0];
      var list = sup.map(function (r, i) {
        return '<button type="button" class="sup-row' + (i === sel ? " active" : "") + '" data-sup-sel="' + i + '">' + who(r.member, r.trade) +
          '<div class="sup-row-m"><span class="price-tbc">' + esc(r.topic) + "</span> " + esc(r.last) + '</div><div class="sup-row-w">' + esc(r.when) + (r.open ? " " + badge("Open") : " " + badge("Handled")) + "</div></button>";
      }).join("");
      var reply = '<form class="sup-reply" data-sup-reply="' + sel + '"><textarea rows="3" placeholder="Reply to ' + esc(th.member) + '…" aria-label="Reply"></textarea><div class="sup-reply-a"><span class="panel-sub">Replies appear in the member\'s Support chat in the app.</span><button class="btn btn-primary btn-sm" type="submit">Send reply</button></div></form>';
      return '<div class="dash-grid">' +
        panel("Support inbox", sup.filter(function (r) { return r.open; }).length + " open · fictional demo threads", "", '<div class="sup-list">' + list + "</div>") +
        panel(esc(th.member) + " · " + esc(th.trade), "Topic: " + esc(th.topic), "", '<div class="sup-thread"><div class="sup-msg in">' + esc(th.last) + '<span>' + esc(th.when) + "</span></div></div>" + reply) +
        "</div>";
    }
    if (page === "plans") {
      return '<div class="dash-grid">' +
        '<section class="panel"><div class="panel-h"><h2>Rate Buddies membership</h2><span class="price-tbc">One plan</span></div><p class="panel-sub">1 month free, then $50 / month (AUD, incl. GST). Members can join, chat, send alerts and take their turn in the promotion queue. Billing goes through the App Store and Google Play.</p></section>' +
        '<section class="panel"><div class="panel-h"><h2>Queue jumps</h2><span class="price-tbc">Price to be set</span></div><p class="panel-sub">Jumping the promotion queue may be paid later. No payment is collected in this prototype.</p></section>' +
        "</div>" +
        panel("Members on a plan", "Fictional counts only", "",
          '<table><thead><tr><th>Status</th><th>Members</th><th>Price</th></tr></thead><tbody>' +
          "<tr><td data-label=\"Status\">Free month</td><td data-label=\"Members\">3</td><td data-label=\"Price\">$0 (first month)</td></tr>" +
          "<tr><td data-label=\"Status\">Paying</td><td data-label=\"Members\">5</td><td data-label=\"Price\">$50 / month (AUD, incl. GST)</td></tr></tbody></table>");
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
        '<div class="field"><label>Title</label><input id="bcTitle" value="" placeholder="e.g. Reminder: meet-up this Thursday"></div>' +
        '<div class="field"><label>Message</label><textarea id="bcBody" rows="4" placeholder="Write the message members will see"></textarea></div>' +
        '<button class="btn btn-primary btn-sm" data-action="broadcast" style="width:auto">' + I.send + "<span>Send mock broadcast</span></button>");
    }
    if (page === "member-detail") {
      var m = members.find(function (x) { return x.id === selectedMem; }) || members[0];
      function linkField(key, label, val) {
        return '<div class="field"><label>' + label + '</label><input data-link="' + key + '" value="' + esc(val || "") + '" inputmode="url" placeholder="https://"></div>';
      }
      return panel("Member", esc(m.name) + " · " + esc(m.business), '<button class="btn btn-ghost btn-sm" data-page="members">Back to members</button>',
        '<div class="field"><label>Name</label><input value="' + esc(m.name) + '" readonly></div>' +
        '<div class="field"><label>Business</label><input value="' + esc(m.business) + '" readonly></div>' +
        '<div class="field"><label>Trade or business type</label><input value="' + esc(m.trade) + '" readonly></div>' +
        '<p class="panel-sub" style="margin:12px 0 8px"><strong>Links</strong> — Facebook personal profile and Google Business Profile. Only filled links show in the app.</p>' +
        linkField("facebook", "Facebook personal profile link", m.facebook) +
        linkField("google", "Google Business Profile link", m.google) +
        '<button class="btn btn-primary" data-action="save-mem" data-id="' + m.id + '" style="margin-top:12px">Save links (prototype)</button>' +
        (window.TCProfile ? '<div style="margin-top:18px"><p class="panel-sub" style="margin-bottom:8px"><strong>Profile</strong> — about the business, expertise, gallery, ideal referral partner and goals. These are optional in the app.</p>' +
          window.TCProfile.adminHTML({ id: m.id, bio: m.bio || ((window.TradeCircle && TradeCircle.MEMBERS || []).filter(function (x) { return x.id === m.id; })[0] || {}).bio || "", profile: m.profile || (window.TCProfile.seedFor({ id: m.id })) }) +
          "</div>" : ""));
    }
    if (page === "settings") {
      return panel("General settings", "Prototype only — changes stay in this browser session.", "",
        '<div class="setting-row"><div><strong>New members need approval</strong><div class="panel-sub">Decided. New sign-ups wait until you approve them.</div></div><button class="toggle on" data-action="toggle" type="button" aria-pressed="true"><i></i></button></div>' +
        '<div class="setting-row"><div><strong>Recommendation alerts</strong><div class="panel-sub">Members get a push when someone shares a Facebook post.</div></div><button class="toggle on" data-action="toggle" type="button" aria-pressed="true"><i></i></button></div>' +
        '<div class="setting-row"><div><strong>Paid queue jumps</strong><div class="panel-sub">Price to be set. No payments are collected in this prototype.</div></div><button class="toggle on" data-action="toggle" type="button" aria-pressed="true"><i></i></button></div>' +
        '<div class="setting-row"><div><strong>Daily Google Review cap</strong><div class="panel-sub">At most this many Google Reviews may be left for one business, from the circle, in a Perth calendar day. The default is 3, to reduce the chance of spam flags. The cap resets at midnight, Australia/Perth. The server would enforce this in the real app.</div></div><input id="reviewCap" type="number" min="1" max="20" value="' + reviewCap() + '" style="width:72px;height:40px;border:1px solid var(--line,#d5dde6);border-radius:10px;padding:0 10px;font-weight:800"></div>' +
        badgeTiersAdmin());
    }
    if (page === "audit") {
      return panel("Audit log", "A record of admin and system actions. Fictional.", "",
        '<table><thead><tr><th>When</th><th>Who</th><th>Action</th></tr></thead><tbody>' +
        audit.map(function (a) {
          return "<tr><td data-label=\"When\">" + esc(a.at) + '</td><td data-label="Who">' + who(a.who, "") + '</td><td data-label="Action">' + esc(a.action) + "</td></tr>";
        }).join("") + "</tbody></table>");
    }
    if (window.TC181Admin && TC181Admin.pageHTML) {
      var extra181 = TC181Admin.pageHTML(page);
      if (extra181 != null) return extra181;
    }
    if (window.TC180Admin && TC180Admin.pageHTML) {
      var extra = TC180Admin.pageHTML(page);
      if (extra) return extra;
    }
    return empty("Coming later", "This page is not in the prototype yet.");
  }

  function paint() {
    renderNav();
    var t = TITLES[page] || ["Admin", "Admin"];
    $("pageEyebrow").textContent = t[0];
    $("pageTitle").textContent = t[1];
    $("page").innerHTML = pageHTML();
    var capInput = $("reviewCap");
    if (capInput) {
      capInput.addEventListener("change", function () {
        var n = Math.max(1, Math.min(20, Number(capInput.value) || 3));
        localStorage.setItem("tc_review_daily_limit", JSON.stringify(n));
        audit.unshift({ at: "Just now", who: "Vishal (you)", action: "Set daily Google Review cap to " + n });
      });
    }
    document.querySelectorAll(".badge-tier").forEach(function (inp) {
      inp.addEventListener("change", function () {
        var list = badgeTiers();
        list.forEach(function (tier) {
          var el = document.querySelector('.badge-tier[data-tier="' + tier.id + '"]');
          if (el) tier.min = Math.max(0, Math.min(200, Number(el.value) || tier.min));
        });
        list.sort(function (a, b) { return a.min - b.min; });
        localStorage.setItem("tc_badge_tiers", JSON.stringify(list));
        audit.unshift({ at: "Just now", who: "Vishal (you)", action: "Updated badge levels: " + list.map(function (x) { return x.label + " " + x.min; }).join(", ") });
      });
    });
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
      (window.__rbAdminNotifs || [["Devi found a plumber request in Perth (Joondalup post) — 12 members will be asked to recommend Michael. Tap to approve.", "Today 7:58 am", "devi-inbox"],
       ["Nina Kaur applied to join.", "Today 8:10 am", "requests"],
       ["A pest control alert is still open.", "Today 7:30 am", "alerts"],
       ["Tom Reeves jumped the promotion queue.", "Sat 10:12 am", "queue"]]).map(function (n) {
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
    if (a === "edit-mem") { selectedMem = id; page = "member-detail"; paint(); }
    if (a === "save-mem") {
      var mem = members.find(function (x) { return x.id === id; });
      if (mem) {
        document.querySelectorAll("[data-link]").forEach(function (inp) { mem[inp.getAttribute("data-link")] = inp.value.trim(); });
        audit.unshift({ at: "Just now", who: "Vishal (you)", action: "Updated profile links for " + mem.name });
      }
      window.alert("Links saved in this prototype only.");
      paint();
    }
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
    if (window.TC181Admin && TC181Admin.handle && TC181Admin.handle(a, id, btn, e)) {
      paint();
      return;
    }
    if (window.TC180Admin && TC180Admin.handle && TC180Admin.handle(a, id, btn, e)) {
      paint();
    }
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

  window.TCAdmin = { go: go, paint: paint, esc: esc, panel: panel, badge: badge, facebookF: facebookF, I: I, who: who, av: av, requests: requests, members: members, getRequests: function(){return requests;}, getMembers: function(){return members;},
    /* v2.2.2b live: the live bridge (rb-admin-live2.js) refills these arrays in place */
    queue: queue, flags: flags, audit: audit, alerts: alerts, chats: chats, activity: activity, fbPosts: fbPosts, memberWeeks: memberWeeks, alertWeeks: alertWeeks, regions: regions, trades: trades, page: function () { return page; }, empty: empty, icoBtn: icoBtn };
  if (window.TC180Admin && TC180Admin.attach) TC180Admin.attach();
  if (window.TC181Admin && TC181Admin.attach) TC181Admin.attach();

  if (/[?&]shot=/.test(location.search) || location.hash === "#app") {
    $("loginView").classList.add("hidden");
    $("appView").classList.remove("hidden");
    var m = location.search.match(/shot=([a-z-]+)/);
    if (m && m[1] && m[1] !== "login") page = m[1];
    if (location.hash.replace("#", "") && location.hash !== "#app") page = location.hash.replace("#", "");
    paint();
  }
})();
