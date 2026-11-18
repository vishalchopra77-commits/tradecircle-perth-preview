/* TradeCircle Perth v1.5.9 — recommendations, trade covers, trade icons, My areas */
(function (root) {
  "use strict";

  function T() { return root.TradeCircle || {}; }
  function state() { return T().state || {}; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }
  function toast(msg) { if (T().toast) T().toast(msg); }
  function go(id, opts) { if (T().go) T().go(id, opts); }
  function me() { return T().me ? T().me() : null; }
  function member(id) {
    var list = T().MEMBERS || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function fn(m) { return T().fullName ? T().fullName(m) : ((m.first || "") + " " + (m.last || "")).trim(); }
  function av(m, n) { return T().avatarHTML ? T().avatarHTML(m, n) : ""; }
  function icoFb() {
    return (T().icon ? T().icon("fb") : '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg>');
  }

  /* ---------- Trade covers ---------- */
  var COVER = {
    pest: "covers/pest.jpg",
    carpenter: "covers/carpenter.jpg",
    electrician: "covers/electrician.jpg",
    plumber: "covers/plumber.jpg",
    hvac: "covers/hvac.jpg",
    landscaper: "covers/landscaper.jpg",
    painter: "covers/painter.jpg",
    builder: "covers/builder.jpg",
    roofer: "covers/roofer.jpg",
    cleaner: "covers/cleaner.jpg",
    tradie: "covers/tradie.jpg",
    beauty: "covers/beauty.jpg",
    food: "covers/cafe.jpg",
    cafe: "covers/cafe.jpg",
    retail: "covers/retail.jpg",
    auto: "covers/auto.jpg",
    health: "covers/health.jpg",
    fitness: "covers/fitness.jpg",
    pets: "covers/pets.jpg",
    kids: "covers/kids.jpg",
    events: "covers/events.jpg",
    professional: "covers/professional.jpg",
    property: "covers/property.jpg"
  };
  function resolveGroup(trade) {
    var want = String(trade || "").toLowerCase().trim();
    var map = window.TC_TRADE_ALIASES || {};
    var canonical = want, a;
    for (a in map) if (String(a).toLowerCase() === want) canonical = String(map[a]).toLowerCase();
    var groups = (window.TC_BUSINESS_CATEGORIES && TC_BUSINESS_CATEGORIES.groups) || [];
    var i, j, g, it, als;
    for (i = 0; i < groups.length; i++) {
      g = groups[i];
      for (j = 0; j < (g.items || []).length; j++) {
        it = g.items[j];
        if (String(it.name).toLowerCase() === want || String(it.name).toLowerCase() === canonical) return g;
        als = it.aliases || [];
        if (als.some(function (x) { return String(x).toLowerCase() === want || String(x).toLowerCase() === canonical; })) return g;
      }
    }
    return null;
  }
  function coverKey(trade) {
    var t = String(trade || "").toLowerCase();
    if (/pest|termite|vermin|rodent|cockroach/.test(t)) return "pest";
    if (/electric/.test(t)) return "electrician";
    if (/plumb|gasfit|drain|hot water/.test(t)) return "plumber";
    if (/air cond|hvac|refrigerat/.test(t)) return "hvac";
    if (/landscape|garden|arborist|turf|irrigation/.test(t)) return "landscaper";
    if (/paint/.test(t)) return "painter";
    if (/roof/.test(t)) return "roofer";
    if (/clean/.test(t)) return "cleaner";
    if (/carpenter|cabinet|joiner|furniture/.test(t)) return "carpenter";
    if (/builder|building|brick|concre/.test(t)) return "builder";
    if (/barber|hairdress|hair salon|beauty|nail salon|tattoo|lash|brow|makeup|spa|wax/.test(t)) return "beauty";
    if (/cafe|café|restaurant|baker|takeaway|pizza|butcher|coffee/.test(t)) return "food";
    if (/mechanic|panel beat|tyre|car wash|car detail|auto parts|towing/.test(t)) return "auto";
    if (/dentist|physio|chiro|optometr|pharmac|chemist|massage|gp clinic|doctor/.test(t)) return "health";
    if (/gym|pilates|yoga|personal train|martial/.test(t)) return "fitness";
    if (/vet|groomer|dog train|pet shop|pet sit/.test(t)) return "pets";
    var g0 = resolveGroup(trade);
    if (g0 && (COVER[g0.id] || (g0.cover && g0.cover.indexOf("covers/") === 0))) return g0.id;
    return "tradie";
  }
  function coverUrl(trade) {
    var key = coverKey(trade);
    if (key && key !== "tradie" && COVER[key]) return COVER[key];
    var g = resolveGroup(trade);
    if (g && g.cover) return g.cover;
    return COVER[key] || COVER.tradie;
  }

  function applyCover(screen, trade) {
    if (!screen || screen.querySelector(".trade-cover")) return;
    screen.classList.add("has-trade-cover");
    var cover = document.createElement("div");
    cover.className = "trade-cover";
    cover.setAttribute("aria-hidden", "true");
    cover.style.backgroundImage = "url('" + coverUrl(trade) + "')";
    var scroll = screen.querySelector(".scroll");
    if (scroll) scroll.insertBefore(cover, scroll.firstChild);
    var sb = document.getElementById("statusBar");
    if (sb) sb.classList.add("light");
  }

  /* ---------- Trade icons ---------- */
  function svg(path, extra) {
    return '<svg class="trade-ico-svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + (extra || "") + "</svg>";
  }
  var ICONS = {
    bug: svg('<path d="M12 6v4"/><circle cx="12" cy="14" r="5"/><path d="M5 10l3 2M19 10l-3 2M5 18l3-2M19 18l-3-2M8 4l2 3M16 4l-2 3"/>'),
    bolt: svg('<path d="M13 2L4 14h7l-1 8 10-13h-7l1-7z" fill="currentColor" stroke="none"/>'),
    tap: svg('<path d="M4 14h9a3 3 0 003-3V7a3 3 0 00-3-3H9"/><path d="M13 14v3a3 3 0 01-6 0"/><path d="M4 11v6"/>'),
    fence: svg('<path d="M4 20V8l3-3 3 3 3-3 3 3 3-3v15"/><path d="M4 12h15M4 16h15"/>'),
    snow: svg('<path d="M12 2v20M5 6l14 12M19 6L5 18M3 12h18"/>'),
    roller: svg('<rect x="3" y="3" width="14" height="6" rx="1"/><path d="M17 6h2a2 2 0 010 4h-6v9"/>'),
    leaf: svg('<path d="M5 19c8-1 14-8 14-16-8 0-15 6-16 14 4-1 6 0 8 2"/><path d="M8 16c2-3 5-6 9-8"/>'),
    roof: svg('<path d="M3 12l9-8 9 8"/><path d="M5 10v10h14V10"/>'),
    sparkle: svg('<path d="M12 3l1.2 5.2L18 9.5l-4.8 1.3L12 16l-1.2-5.2L6 9.5l4.8-1.3z"/><path d="M18 14l.6 2.4L21 17l-2.4.6L18 20l-.6-2.4L15 17l2.4-.6z"/>'),
    grid: svg('<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>'),
    key: svg('<circle cx="8" cy="15" r="4"/><path d="M11.5 13.5L20 5v3M16 5v3"/>'),
    hammer: svg('<path d="M14 5l5 5-3 3-2-2-6 8-3-3 8-6-2-2z"/>'),
    hat: svg('<path d="M4 14h16v2a4 4 0 01-4 4H8a4 4 0 01-4-4v-2z"/><path d="M4 14a8 8 0 0116 0"/><path d="M12 4v3"/>'),
    wrench: svg('<path d="M14.7 6.3a4 4 0 00-5.6 5.6L3 18l3 3 6.1-6.1a4 4 0 005.6-5.6L15 12z"/>'),
    scissors: svg('<circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><path d="M8.5 16.5L20 4M15.5 16.5L4 4"/>'),
    plus: svg('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>'),
    dumbbell: svg('<path d="M6 8v8M18 8v8M4 10v4M20 10v4M6 12h12"/>'),
    utensils: svg('<path d="M4 3v18M4 3c2 3 2 6 0 8M8 3v7c0 2-1 3-2 3M16 3v18M16 3c3 0 5 2 5 6v3h-5"/>'),
    bag: svg('<path d="M6 8h12l-1 13H7L6 8z"/><path d="M9 8V7a3 3 0 016 0v1"/>'),
    car: svg('<path d="M3 13l2-5h14l2 5"/><path d="M3 13h18v5H3z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'),
    paw: svg('<circle cx="8" cy="9" r="2"/><circle cx="16" cy="9" r="2"/><circle cx="6" cy="14" r="2"/><circle cx="18" cy="14" r="2"/><path d="M12 11c3 0 5 3 5 5 0 0-2 3-5 3s-5-3-5-3c0-2 2-5 5-5z"/>'),
    book: svg('<path d="M4 5a2 2 0 012-2h6v16H6a2 2 0 00-2 2z"/><path d="M12 3h6a2 2 0 012 2v16a2 2 0 00-2-2h-6"/>'),
    camera: svg('<path d="M4 8h3l2-2h6l2 2h3v12H4z"/><circle cx="12" cy="13" r="3"/>'),
    briefcase: svg('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 13h18"/>'),
    house: svg('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>'),
    pin: svg('<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>')
  };
  function iconKey(trade) {
    var t = String(trade || "").toLowerCase();
    if (/pest|termite|vermin|rodent|cockroach|insect/.test(t)) return "bug";
    if (/auto electric|electric|solar|data cabling|security system|switchboard/.test(t)) return "bolt";
    if (/plumb|gasfit|drain|hot water|blocked/.test(t)) return "tap";
    if (/fence|fencing|gate/.test(t)) return "fence";
    if (/air cond|hvac|refrigerat|cooling/.test(t)) return "snow";
    if (/paint/.test(t)) return "roller";
    if (/landscape|garden|arborist|turf|irrigation|horticult/.test(t)) return "leaf";
    if (/roof/.test(t)) return "roof";
    if (/clean/.test(t)) return "sparkle";
    if (/tiler|tiling/.test(t)) return "grid";
    if (/locksmith|lock/.test(t)) return "key";
    if (/carpenter|cabinet|joiner|furniture|shopfit/.test(t)) return "hammer";
    if (/builder|building|brick|concre|scaffold|formwork|renderer|plaster/.test(t)) return "hat";
    if (/handyman/.test(t)) return "wrench";
    if (/barber|hairdress|hair salon|beauty|nail|tattoo|lash|brow|makeup|spa|wax|pierc|tanning/.test(t)) return "scissors";
    if (/dentist|physio|chiro|optometr|pharmac|chemist|massage|clinic|doctor|gp |podiatr|psycholog|naturopath|acupunct/.test(t)) return "plus";
    if (/gym|pilates|yoga|personal train|martial|boxing|swim school|fitness/.test(t)) return "dumbbell";
    if (/cafe|café|restaurant|baker|takeaway|pizza|butcher|coffee|bar & pub|bottle shop/.test(t)) return "utensils";
    if (/store|shop|retail|grocer|florist|jeweller|boutique|op shop|bookshop/.test(t)) return "bag";
    if (/mechanic|panel beat|tyre|car wash|car detail|auto |towing|windscreen|car dealer/.test(t)) return "car";
    if (/vet|groomer|dog |pet /.test(t)) return "paw";
    if (/childcare|tutor|dance school|driving school|music teacher|preschool/.test(t)) return "book";
    if (/photograph|videograph|event plan|celebrant|wedding|dj\b/.test(t)) return "camera";
    if (/accountant|bookkeeper|lawyer|solicitor|mortgage|insurance|financial plan|marketing/.test(t)) return "briefcase";
    if (/real estate|property manager|conveyanc|buyer.?s agent|strata/.test(t)) return "house";
    var g1 = resolveGroup(trade);
    if (g1 && ICONS[g1.icon]) return g1.icon;
    return "wrench";
  }
  function tradeIcon(trade) {
    var key = iconKey(trade);
    return '<span class="trade-ico" title="' + esc(trade) + '">' + (ICONS[key] || ICONS.wrench) + "</span>";
  }

  function isTradeLabel(trade) {
    var t = String(trade || "").trim();
    if (!t || t.length > 48) return false;
    if (/\b(today|yesterday|tomorrow|am|pm|ago|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(t)) return false;
    if (/\d/.test(t) && /:|\b(am|pm|h|m)\b/i.test(t)) return false;
    var list = root.TC_TRADES || T().TRADES || [];
    var low = t.toLowerCase();
    var i, n;
    for (i = 0; i < list.length; i++) {
      n = typeof list[i] === "string" ? list[i] : (list[i] && (list[i].name || list[i].label || ""));
      if (String(n).toLowerCase() === low) return true;
    }
    var map = root.TC_TRADE_ALIASES || {};
    for (n in map) if (String(n).toLowerCase() === low || String(map[n]).toLowerCase() === low) return true;
    var k = iconKey(t);
    if (k !== "wrench") return true;
    if (/handyman/i.test(t)) return true;
    return false;
  }
  function decorateTradeLabels(root) {
    root = root || document;
    root.querySelectorAll(".t-pill, [data-trade], .trade-name").forEach(function (el) {
      if (el.getAttribute("data-ico") === "1") return;
      var name = el.getAttribute("data-trade") || "";
      if (!name) {
        var t = el.childNodes[0] ? el.childNodes[0].textContent : el.textContent;
        name = String(t || "").trim();
      }
      if (!name || /^all$/i.test(name)) return;
      el.setAttribute("data-ico", "1");
      el.classList.add("trade-with-ico");
      el.insertAdjacentHTML("beforeend", tradeIcon(name));
    });
    /* Review-back and similar "Business · Trade" lines */
    root.querySelectorAll(".meta, .chat-sub, .who-trade").forEach(function (el) {
      if (el.getAttribute("data-ico") === "1") return;
      if (el.querySelector(".trade-ico")) { el.setAttribute("data-ico", "1"); return; }
      var raw = el.textContent || "";
      var parts = raw.split("·");
      if (parts.length < 2) return;
      var trade = parts[parts.length - 1].trim();
      if (!isTradeLabel(trade)) return;
      el.setAttribute("data-ico", "1");
      var lead = parts.slice(0, -1).join("·").trim();
      el.innerHTML = esc(lead) + " · " + esc(trade) + tradeIcon(trade);
    });
  }

  /* ---------- Recommendations feed ---------- */
  function posts() {
    var s = state();
    if (!s._fbPosts) {
      s._fbPosts = [
        {
          id: "r1", status: "new",
          group: "Perth Hills Community Noticeboard",
          ask: "Anyone recommend a good electrician in Kalamunda?",
          forId: "jack", suburb: "Kalamunda",
          link: "https://www.facebook.com/groups/perth.hills.noticeboard.demo/posts/482190",
          when: "2 hours ago", vouched: 3, of: 8, idea: ""
        },
        {
          id: "r2", status: "new",
          group: "Hills Mums & Dads",
          ask: "Need a reliable pest controller in Midland for termites — any recommendations?",
          forId: "jamie", suburb: "Midland",
          link: "https://www.facebook.com/groups/hills.mums.dads.demo/posts/771204",
          when: "Today 8:10 am", vouched: 5, of: 12, idea: ""
        },
        {
          id: "r3", status: "new",
          group: "Joondalup Home Owners",
          ask: "Looking for a plumber in Mullaloo, leaking tap under the kitchen sink.",
          forId: "liam", suburb: "Mullaloo",
          link: "https://www.facebook.com/groups/joondalup.homeowners.demo/posts/119004",
          when: "Yesterday", vouched: 1, of: 8, idea: ""
        },
        {
          id: "r4", status: "done",
          group: "Northern Suburbs Tradie Talk",
          ask: "Anyone know a good carpenter in Warwick for a deck repair?",
          forId: "sarah", suburb: "Warwick",
          link: "https://www.facebook.com/groups/northern.tradie.talk.demo/posts/330112",
          when: "Yesterday", vouched: 6, of: 8, idea: ""
        },
        {
          id: "r5", status: "expired",
          group: "Fremantle Community Noticeboard",
          ask: "Need an air-con technician in Fremantle before the weekend.",
          forId: "emma", suburb: "Fremantle",
          link: "https://www.facebook.com/groups/fremantle.community.demo/posts/908441",
          when: "5 days ago", vouched: 2, of: 8, idea: ""
        }
      ];
    }
    return s._fbPosts;
  }
  function pendingCount() {
    return posts().filter(function (p) { return p.status === "new" && p.forId !== "jamie"; }).length;
  }
  function ideaFor(post, fresh) {
    var m = member(post.forId);
    if (!m) return "I can recommend this tradie from work I have actually seen.";
    if (root.TCIdeas && TCIdeas.buildAlertIdeas) {
      var used = post._used || [];
      if (post.idea && !fresh) return post.idea;
      var ideas = TCIdeas.buildAlertIdeas({
        member: m, viewerId: "jamie", suburb: post.suburb, used: used, round: used.length
      });
      var text = ideas[0] || "";
      if (fresh && post.idea) used.push(post.idea);
      post.idea = text;
      post._used = used;
      return text;
    }
    return "I have used " + m.business + " in " + post.suburb + " and would recommend getting in touch.";
  }

  function recCard(p, open) {
    var m = member(p.forId) || { first: "Member", last: "", business: "", trade: "", id: "" };
    var mine = p.forId === "jamie";
    var st = p.status === "done" ? "done" : p.status === "expired" ? "expired" : "new";
    var stLab = st === "done" ? "Done" : st === "expired" ? "Expired" : "New";
    var pct = Math.round((p.vouched / p.of) * 100);
    var cls = "rec-card" + (mine ? " is-mine" : "") + (st === "done" ? " is-done" : "") + (st === "expired" ? " is-expired" : "");
    var html = '<article class="' + cls + '" data-rec="' + p.id + '">' +
      '<div class="rec-top"><div class="rec-gmark">' + icoFb() + "</div>" +
      '<div class="rec-group"><div class="g">' + esc(p.group) + '</div><div class="t">Posted by admin · ' + esc(p.when) + "</div></div>" +
      '<span class="rec-status ' + st + '">' + stLab + "</span></div>" +
      '<p class="rec-ask">' + esc(p.ask) + "</p>" +
      '<div class="rec-who">' + av(m, 44) +
      '<div class="meta"><div class="nm">' + esc(fn(m)) + (mine ? ' <span class="you-badge">You</span>' : "") + "</div>" +
      '<div class="biz">' + esc(m.business) + "</div>" +
      '<div class="pills"><span class="pill t-pill">' + esc(m.trade) + "</span>" +
      '<span class="pill r-pill">' + esc(p.suburb) + "</span></div></div></div>" +
      '<div class="rec-progress"><div class="bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="lab">' + p.vouched + " of " + p.of + " members have vouched</div></div>";
    if (mine) {
      html += '<div class="rec-mine-banner">This one is for you. Other members are vouching for you on this Facebook post — you do not leave a recommendation on your own business.</div>' +
        '<a class="btn btn-fb has-ico" href="' + esc(p.link) + '" target="_blank" rel="noopener noreferrer">' + icoFb() + "<span>View post in Facebook</span></a>";
    } else if (st === "expired") {
      html += '<p class="hint" style="margin:0 0 8px">This post has closed. You can still open it on Facebook.</p>' +
        '<a class="btn btn-ghost ink has-ico" href="' + esc(p.link) + '" target="_blank" rel="noopener noreferrer">' + icoFb() + "<span>Open post in Facebook</span></a>";
    } else {
      html += '<a class="btn btn-fb has-ico" href="' + esc(p.link) + '" target="_blank" rel="noopener noreferrer">' + icoFb() + "<span>Open post in Facebook</span></a>";
      if (open) {
        var idea = ideaFor(p, false);
        html += '<div class="rec-copy"><p>' + esc(idea) + "</p><div class=\"row\">" +
          '<button type="button" class="btn btn-ghost ink" data-action="copy-rec" data-id="' + p.id + '">Copy recommendation</button>' +
          '<button type="button" class="btn btn-ghost ink" data-action="regen-rec" data-id="' + p.id + '">Generate new</button></div>' +
          '<p class="hint" style="margin:8px 0 0">Suggestions only. Write it in your own words, and only vouch for someone you actually know or have worked with.</p></div>';
      } else {
        html += '<button type="button" class="btn btn-ghost ink" data-action="open-rec" data-id="' + p.id + '">View recommendation idea</button>';
      }
      if (st === "new") {
        html += '<button type="button" class="btn btn-primary btn-done" data-action="done-rec" data-id="' + p.id + '">Mark as done — I’ve vouched</button>';
      } else if (st === "done") {
        html += '<div class="reviewed-tick" style="margin-top:8px">You’ve marked this as done.</div>';
      }
    }
    return html + "</article>";
  }

  function renderRecommend(id) {
    var s = state();
    var filter = s.recFilter || (id === "fb-recommend-done" ? "done" : "todo");
    s.recFilter = filter;
    var openId = s.recOpen || (id === "fb-recommend-open" ? "r1" : id === "fb-recommend-mine" ? "r2" : "");
    var list = posts().filter(function (p) {
      if (filter === "done") return p.status === "done" || p.status === "expired";
      return p.status === "new";
    });
    var todoN = pendingCount();
    var doneN = posts().filter(function (p) { return p.status !== "new"; }).length;
    var body = list.length
      ? list.map(function (p) { return recCard(p, openId === p.id || (id === "fb-recommend-mine" && p.id === "r2")); }).join("")
      : '<div class="rec-empty"><h3>Nothing here</h3><p>When admin posts a Facebook group link, it will show up in To do.</p></div>';
    var html = '<section class="screen has-tabs has-header" data-screen="fb-recommend">' +
      '<div class="app-header"><button class="icon-btn" data-action="open-drawer" aria-label="Menu">' +
      (T().icon ? T().icon("menu") : "") + '</button><div class="ht">Facebook</div>' +
      '<span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="rec-hero"><h2>Recommendations</h2>' +
      "<p>Admin shares Facebook group posts where someone is asking for a trade. Open the post, leave a genuine recommendation, and vouch for the member — only if you actually know their work.</p></div>" +
      '<div class="rec-filters">' +
      '<button type="button" class="' + (filter === "todo" ? "active" : "") + '" data-action="rec-filter" data-filter="todo">To do<span class="n">' + todoN + "</span></button>" +
      '<button type="button" class="' + (filter === "done" ? "active" : "") + '" data-action="rec-filter" data-filter="done">Done<span class="n">' + doneN + "</span></button>" +
      "</div>" + body + "</div></section>";
    if (window.withFbSeg || false) { /* filled below via v15 */ }
    /* wrap with the Facebook segment bar using the same helper if present */
    /* v15 withFbSeg is closed over; inject bar by rendering then... we return raw and patch after, or duplicate call:
       v15 already routes fb-recommend through TC159.render and then... no, it returns our HTML. We need the seg bar.
       We'll include a hook: if TC15-like, we add the bar ourselves by calling a tiny clone. */
    html = html.replace('class="screen has-tabs has-header"', 'class="screen has-tabs has-header has-fb-seg"');
    html = html.replace('<div class="scroll">', (function () {
      /* Reuse the live Facebook switch already in the DOM convention from v15: ask go() afterGo? Better: build via clicking isn't available.
         We render a placeholder and let afterGo leave v15's fbSegment if we expose it.
         Simplest: include the same 3-button bar markup here by calling document? No.
         Reconstruct using pendingCount and queue place. */
      var place = (root.TCQueueWait && T().state) ? "" : "Your place #4";
      try {
        /* myQueuePlace isn't exported; default #4 matches the prototype. */
        place = "Your place #4";
      } catch (e) {}
      var pending = pendingCount();
      var recSub = pending
        ? '<span class="fb-seg-place"><span class="fb-seg-badge">' + pending + "</span> to do</span>"
        : '<span class="fb-seg-place">All done</span>';
      return '<div class="fb-seg-bar" role="tablist" aria-label="Facebook sections"><div class="fb-seg fb-seg-3">' +
        '<button type="button" role="tab" class="fb-seg-btn" data-go="members"><span class="fb-seg-lab">Circle</span></button>' +
        '<button type="button" role="tab" class="fb-seg-btn active" data-go="fb-recommend" aria-selected="true"><span class="fb-seg-lab">Recommend</span>' + recSub + "</button>" +
        '<button type="button" role="tab" class="fb-seg-btn" data-go="promo-queue"><span class="fb-seg-lab">Queue</span><span class="fb-seg-place">' + esc(place) + "</span></button>" +
        "</div></div>" + '<div class="scroll">';
    })());
    return html;
  }

  function placeMyAreas() {
    var screen = document.querySelector('.screen[data-screen="me"]');
    if (!screen) return;
    var card = screen.querySelector(".areas-card");
    var hero = screen.querySelector(".profile-hero");
    if (!card || !hero || card.parentNode.classList.contains("my-areas-block")) return;
    var wrap = document.createElement("div");
    wrap.className = "my-areas-block";
    /* retitle if needed */
    var h = card.querySelector(".areas-card-h");
    if (h) h.textContent = "My areas";
    card.parentNode.removeChild(card);
    wrap.appendChild(card);
    if (hero.nextSibling) hero.parentNode.insertBefore(wrap, hero.nextSibling);
    else hero.parentNode.appendChild(wrap);
  }

  function addCardStrips(root) {
    root = root || document;
    root.querySelectorAll(".member-card").forEach(function (card) {
      if (card.querySelector(".card-cover-strip")) return;
      var pill = card.querySelector(".t-pill");
      var trade = pill ? (pill.childNodes[0] ? pill.childNodes[0].textContent : pill.textContent) : "";
      var strip = document.createElement("div");
      strip.className = "card-cover-strip";
      strip.style.backgroundImage = "url('" + coverUrl(trade) + "')";
      card.classList.add("has-cover-strip");
      card.insertBefore(strip, card.firstChild);
    });
  }

  function after(id) {
    var screen = document.querySelector(".screen.active") || document.querySelector(".screen");
    if (!screen) return;
    if (id === "me" || id === "member") {
      var m = id === "me" ? me() : member((state().selectedMember) || "sarah");
      if (m) applyCover(screen, m.trade);
      if (id === "me") placeMyAreas();
    }
    if (id === "members" || id === "members-all" || id === "members-filter" || id === "members-search" || id === "fb-recommend" || id === "fb-recommend-open" || id === "fb-recommend-mine" || id === "fb-recommend-done" || id === "reviews" || id === "reviews-back" || id === "me" || id === "member" || id === "chats" || id === "create-profile" || id === "edit-profile" || id === "signup-business") {
      decorateTradeLabels(screen);
    }
    if (id === "members" || id === "members-all" || id === "members-filter" || id === "members-search") {
      addCardStrips(screen);
    }
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-action]");
    if (!btn) return;
    var act = btn.getAttribute("data-action");
    var id = btn.getAttribute("data-id");
    if (act === "rec-filter") {
      state().recFilter = btn.getAttribute("data-filter") || "todo";
      state().recOpen = "";
      go("fb-recommend");
      e.preventDefault();
      return;
    }
    if (act === "open-rec") {
      state().recOpen = id;
      go("fb-recommend");
      e.preventDefault();
      return;
    }
    if (act === "copy-rec") {
      var p = posts().filter(function (x) { return x.id === id; })[0];
      var text = p ? ideaFor(p, false) : "";
      if (navigator.clipboard && text) navigator.clipboard.writeText(text).catch(function () {});
      toast("Copied, now paste it in the Facebook post.");
      e.preventDefault();
      return;
    }
    if (act === "regen-rec") {
      var p2 = posts().filter(function (x) { return x.id === id; })[0];
      if (p2) ideaFor(p2, true);
      state().recOpen = id;
      go("fb-recommend");
      toast("New suggestion — write it in your own words on Facebook.");
      e.preventDefault();
      return;
    }
    if (act === "done-rec") {
      var p3 = posts().filter(function (x) { return x.id === id; })[0];
      if (p3 && p3.status === "new") {
        p3.status = "done";
        p3.vouched = Math.min(p3.of, p3.vouched + 1);
      }
      toast("Marked as done. Thank you for vouching in your own words.");
      go("fb-recommend");
      e.preventDefault();
    }
  });

  function hookAfterGo() {
    if (!root.TC12) root.TC12 = {};
    var prev = TC12.afterGo;
    TC12.afterGo = function (id) {
      if (typeof prev === "function") prev(id);
      after(id);
    };
  }
  hookAfterGo();
  if (T().state && T().state.screen && T().go) {
    var sc0 = T().state.screen;
    if (/^fb-recommend/.test(sc0)) T().go(sc0);
    else after(sc0);
  }

  root.TC159 = {
    render: renderRecommend,
    pendingCount: pendingCount,
    tradeIcon: tradeIcon,
    coverUrl: coverUrl,
    decorate: decorateTradeLabels,
    posts: posts
  };
})(window);
