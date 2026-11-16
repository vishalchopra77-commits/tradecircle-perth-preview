(function () {
  const TRADES = (window.TC_TRADES && window.TC_TRADES.length) ? window.TC_TRADES.slice() : [
    "Pest Control", "Carpenter", "Painter", "Plumber", "Electrician",
    "Landscaper", "Roofer", "Air Conditioning", "Tiler", "Fencer",
    "Handyman", "Locksmith", "Plasterer"
  ];

  const REGIONS = [
    { id: "hills", name: "Hills", suggested: false },
    { id: "kwinana", name: "Kwinana", suggested: false },
    { id: "north", name: "North", suggested: false },
    { id: "south", name: "South", suggested: false },
    { id: "east", name: "East", suggested: true },
    { id: "central", name: "Central / CBD", suggested: true },
    { id: "fremantle", name: "Fremantle", suggested: true },
    { id: "rockingham", name: "Rockingham", suggested: true },
    { id: "joondalup", name: "Joondalup", suggested: true },
    { id: "armadale", name: "Armadale", suggested: true }
  ];

  const AVATAR_COLORS = {
    teal: ["#0FBE86", "#0A7A58"],
    navy: ["#1C4B73", "#0B1F33"],
    coral: ["#F07A5A", "#C44B32"],
    violet: ["#7B6CFF", "#4C3EBE"],
    amber: ["#F5B942", "#C48412"],
    moss: ["#6BA368", "#2F6B3C"],
    rust: ["#D9764F", "#8A3B22"],
    sky: ["#4C9BE8", "#1D5FA8"],
    indigo: ["#4F6AD7", "#2A3A8F"],
    olive: ["#9AA63B", "#5C6418"],
    rose: ["#E07A9B", "#A34462"],
    steel: ["#6B8499", "#334655"]
  };

  const MEMBERS = [
    {
      id: "jamie", first: "Jamie", last: "Hale",
      business: "Hale Pest Control", trade: "Pest Control",
      regions: ["hills", "north"],
      bio: "Family-run pest control covering the Hills and northern suburbs. Termites, general pests and pre-purchase inspections.",
      phone: "0412 000 101",
      facebook: "https://www.facebook.com/demo.halepestcontrol",
      page: "https://www.facebook.com/demo.halepestcontrol.biz",
      color: "teal", isMe: true
    },
    {
      id: "sarah", first: "Sarah", last: "Nguyen",
      business: "Nguyen Carpentry", trade: "Carpenter",
      regions: ["north", "joondalup"],
      bio: "Custom kitchens, decks and home renovations. Happy to share honest recommendations for other trades I have worked with.",
      phone: "0412 000 102",
      facebook: "https://www.facebook.com/demo.nguyencarpentry",
      page: "https://www.facebook.com/demo.nguyencarpentry.biz",
      color: "coral"
    },
    {
      id: "liam", first: "Liam", last: "O’Connor",
      business: "O’Connor Plumbing", trade: "Plumber",
      regions: ["south", "fremantle"],
      bio: "Blocked drains, hot water and bathroom fit-outs across the southern suburbs and Fremantle.",
      phone: "0412 000 103",
      facebook: "https://www.facebook.com/demo.oconnorplumbing",
      page: "https://www.facebook.com/demo.oconnorplumbing.biz",
      color: "navy"
    },
    {
      id: "priya", first: "Priya", last: "Sharma",
      business: "Sharma Painting Co", trade: "Painter",
      regions: ["east", "central"],
      bio: "Interior and exterior painting for homes and small commercial jobs. Neat, reliable and on time.",
      phone: "0412 000 104",
      facebook: "https://www.facebook.com/demo.sharmapainting",
      page: "",
      color: "violet"
    },
    {
      id: "jack", first: "Jack", last: "Thompson",
      business: "Thompson Electrical", trade: "Electrician",
      regions: ["kwinana", "rockingham"],
      bio: "Licensed electrician for homes and light commercial work around Kwinana and Rockingham.",
      phone: "0412 000 105",
      facebook: "https://www.facebook.com/demo.thompsonelectrical",
      page: "https://www.facebook.com/demo.thompsonelectrical.biz",
      color: "amber"
    },
    {
      id: "mei", first: "Mei", last: "Chen",
      business: "West Coast Gardens", trade: "Landscaper",
      regions: ["hills", "east"],
      bio: "Garden design, paving and retaining walls. Often works alongside carpenters and fence builders on the same jobs.",
      phone: "0412 000 106",
      facebook: "https://www.facebook.com/demo.westcoastgardens",
      page: "https://www.facebook.com/demo.westcoastgardens.biz",
      color: "moss"
    },
    {
      id: "daniel", first: "Daniel", last: "Walsh",
      business: "Walsh Roofing", trade: "Roofer",
      regions: ["armadale", "south"],
      bio: "Roof repairs, restorations and gutter work. Based in the south-east and happy to point clients to other trusted trades.",
      phone: "",
      facebook: "https://www.facebook.com/demo.walshroofing",
      page: "",
      color: "rust"
    },
    {
      id: "emma", first: "Emma", last: "Brooks",
      business: "Brooks Air & Gas", trade: "Air Conditioning",
      regions: ["north", "central"],
      bio: "Split-system installs and servicing for homes and offices across the north and inner city.",
      phone: "0412 000 108",
      facebook: "https://www.facebook.com/demo.brooksairgas",
      page: "https://www.facebook.com/demo.brooksairgas.biz",
      color: "sky"
    },
    {
      id: "marcus", first: "Marcus", last: "Adeyemi",
      business: "Adeyemi Tiling", trade: "Tiler",
      regions: ["fremantle", "south"],
      bio: "Bathroom, kitchen and floor tiling. Works closely with plumbers and painters on renovation jobs.",
      phone: "0412 000 109",
      facebook: "https://www.facebook.com/demo.adeyemitiling",
      page: "",
      color: "indigo"
    },
    {
      id: "tom", first: "Tom", last: "Reeves",
      business: "Reeves Fencing", trade: "Fencer",
      regions: ["hills", "armadale"],
      bio: "Colorbond, timber and gate work for homes in the Hills and Armadale area.",
      phone: "0412 000 110",
      facebook: "https://www.facebook.com/demo.reevesfencing",
      page: "https://www.facebook.com/demo.reevesfencing.biz",
      color: "olive"
    },
    {
      id: "hannah", first: "Hannah", last: "Lewis",
      business: "Lewis Handyman", trade: "Handyman",
      regions: ["central", "east"],
      bio: "Small home repairs, flat-packs and maintenance. A good first call when a job needs more than one trade.",
      phone: "0412 000 111",
      facebook: "https://www.facebook.com/demo.lewishandyman",
      page: "",
      color: "rose"
    },
    {
      id: "chris", first: "Chris", last: "Patel",
      business: "Patel Locksmiths", trade: "Locksmith",
      regions: ["joondalup", "north"],
      bio: "Mobile locksmith for homes and small businesses in the northern corridor. After-hours call-outs available.",
      phone: "0412 000 112",
      facebook: "https://www.facebook.com/demo.patellocksmiths",
      page: "https://www.facebook.com/demo.patellocksmiths.biz",
      color: "steel"
    }
  ];

  const CHOOSER = [
    { id: "welcome", title: "Welcome", sub: "First open of the app" },
    { id: "signin", title: "Sign in", sub: "Email and password" },
    { id: "signup", title: "Sign up", sub: "Sign up with Facebook or email" },
    { id: "fb-consent", title: "Facebook connect", sub: "Prototype consent sheet" },
    { id: "create-profile", title: "Create profile", sub: "Connect Facebook or paste a link" },
    { id: "create-profile-connected", title: "Create profile — connected", sub: "Name and profile link filled" },
    { id: "create-regions", title: "Choose regions", sub: "All areas in one list, plus join all Perth metro" },
    { id: "create-regions-all", title: "Choose regions — all metro", sub: "Join all Perth metro turned on" },
    { id: "pending", title: "Awaiting approval", sub: "New members wait for admin approval" },
    { id: "members", title: "Members — My areas", sub: "Default member list" },
    { id: "members-all", title: "Members — All Perth metro", sub: "Metro-wide filter" },
    { id: "members-filter", title: "Members — Trade filter", sub: "Plumbers only, as an example" },
    { id: "members-search", title: "Search autocomplete", sub: "Type a trade, e.g. plu → Plumber" },
    { id: "member", title: "Member profile", sub: "Facebook friend request CTA" },
    { id: "me", title: "My profile", sub: "How other members see you" },
    { id: "edit-profile", title: "Edit profile", sub: "Connected Facebook, with disconnect" },
    { id: "settings", title: "Settings", sub: "Connections and notification toggles" },
    { id: "google-consent", title: "Google Business connect", sub: "Prototype consent sheet" },
    { id: "reviews", title: "Reviews tab", sub: "Requests received and sent" },
    { id: "review-ideas", title: "Review ideas helper", sub: "Job details, ideas, write your own" },
    { id: "chats", title: "Chat list", sub: "Pinned, unread, online status" },
    { id: "chat-dm", title: "1:1 conversation", sub: "Replies, reactions, voice note, read ticks" },
    { id: "chat-group", title: "Region group chat", sub: "Hills tradies with @mention" },
    { id: "notifications", title: "Notifications centre", sub: "Messages, reviews, new members" },
    { id: "notif-settings", title: "Notification settings", sub: "Toggles and quiet hours" },
    { id: "lockscreen", title: "Lock screen push", sub: "Mock notifications on the lock screen" },
    { id: "drawer", title: "Menu drawer", sub: "Hamburger slide-out navigation" },
    { id: "subscription", title: "Subscription", sub: "Free now, Pro later — price to be set" },
    { id: "invite", title: "Invite a tradie", sub: "Share a join link" },
    { id: "help", title: "Help & how it works", sub: "Circle rules and review guidance" },
    { id: "my-regions", title: "Your areas", sub: "All of your areas in one list" },
    { id: "my-regions-all", title: "Your areas — all metro", sub: "Join all Perth metro turned on" },
    { id: "ai-assistant", title: "AI assistant", sub: "Connect Grok, ChatGPT or Claude" },
    { id: "ai-voice", title: "AI voice command", sub: "Hands-free mock conversation" },
    { id: "rec-alerts", title: "Recommendation alerts", sub: "Posts the circle can help with" },
    { id: "rec-compose", title: "Send a recommendation alert", sub: "Paste a Facebook post link" },
    { id: "rec-alert", title: "Alert card", sub: "Open post, comment ideas, mark done" },
    { id: "promo-queue", title: "Promotion queue", sub: "Free turns, or jump the queue later" },
    { id: "reviews-back", title: "Reviews — review back", sub: "Who left you a Google review" }
  ];

  const TABBED = new Set(["members", "members-all", "members-filter", "members-search", "me", "settings", "reviews", "reviews-back", "chats", "notifications", "notif-settings", "subscription", "invite", "help", "my-regions", "my-regions-all", "drawer", "google-consent", "ai-assistant", "ai-voice", "rec-alerts", "rec-compose", "rec-alert", "promo-queue"]);
  const DARK = new Set(["welcome"]);

  const state = {
    screen: "welcome",
    areaFilter: "mine",
    tradeFilter: "All",
    query: "",
    selectedMember: "liam",
    meId: "jamie",
    draft: null,
    stepRegions: ["hills", "north"],
    tipDismissed: false,
    notify: true,
    photoData: null,
    fbConnected: false,
    fbNext: "create-profile",
    relFilter: "all",
    googleConnected: true,
    regionBackup: {}
  };

  const $ = (sel, root) => (root || document).querySelector(sel);
  const screensEl = $("#screens");
  const tabbar = $("#tabbar");
  const statusBar = $("#statusBar");
  const chooserList = $("#chooserList");
  const toastEl = $("#toast");

  function regionName(id) {
    const r = REGIONS.find(function (x) { return x.id === id; });
    return r ? r.name : id;
  }
  function me() {
    return MEMBERS.find(function (m) { return m.id === state.meId; });
  }
  function fullName(m) { return m.first + " " + m.last; }
  function initials(m) { return ((m.first || "?").charAt(0) + (m.last || "").charAt(0)).toUpperCase(); }

  function escapeAttr(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }
  function escapeText(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function avatarHTML(m, size) {
    const pal = AVATAR_COLORS[m.color] || AVATAR_COLORS.teal;
    const font = size >= 88 ? 32 : size >= 64 ? 24 : 16;
    if (m.isMe && state.photoData) {
      return '<div class="avatar" style="width:' + size + 'px;height:' + size + 'px;background:#ccc"><img src="' + state.photoData + '" alt="" style="width:100%;height:100%;object-fit:cover"></div>';
    }
    return '<div class="avatar" style="width:' + size + 'px;height:' + size + 'px;background:linear-gradient(145deg,' + pal[0] + ',' + pal[1] + ');font-size:' + font + 'px">' +
      '<svg class="pattern" viewBox="0 0 80 80" aria-hidden="true"><circle cx="64" cy="16" r="22" fill="#fff"/><circle cx="12" cy="70" r="18" fill="#fff"/></svg>' +
      '<span style="position:relative;z-index:1">' + initials(m) + "</span></div>";
  }

  function icon(name) {
    const icons = {
      back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 19l-7-7 7-7"/></svg>',
      chev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>',
      search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
      cam: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 8h3l2-3h6l2 3h3v11H4V8z"/><circle cx="12" cy="13" r="3.2"/></svg>',
      check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 12l5 5L20 7"/></svg>',
      fb: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg>',
      phone: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3c0 .8-.7 1.6-1.5 1.5C10.5 18.2 5.8 13.5 4 6c-.1-.8.7-1.5 1.5-1.5z"/></svg>',
      pin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.2"/></svg>',
      link: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 5h5v5M19 5l-8 8"/><path d="M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/></svg>',
      pencil: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h4l10-10-4-4L4 16v4zM14 6l4 4"/></svg>',
      user: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>',
      bell: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
      addfriend: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="3.5"/><path d="M19 8v6M16 11h6"/></svg>'
    };
    if (name === "logo") {
      var dots = [0, 60, 120, 180, 240, 300].map(function (deg, i) {
        var a = (deg - 90) * Math.PI / 180;
        var x = 32 + Math.cos(a) * 22;
        var y = 32 + Math.sin(a) * 22;
        var r = i === 0 ? 4.2 : 3.4;
        return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r + '" fill="' + (i === 0 ? "#0FBE86" : "#E8EEF4") + '"/>';
      }).join("");
      return '<svg width="54" height="54" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="22" stroke="#0FBE86" stroke-width="2.2" opacity="0.9"/><circle cx="32" cy="32" r="3.2" fill="#0FBE86"/>' + dots + "</svg>";
    }
    return icons[name] || "";
  }

  function filteredMembers() {
    var mine = {};
    me().regions.forEach(function (r) { mine[r] = true; });
    return MEMBERS.filter(function (m) {
      if (m.isMe) return false;
      if (state.areaFilter === "mine") {
        if (!m.regions.some(function (r) { return mine[r]; })) return false;
      }
      if (state.tradeFilter !== "All" && m.trade !== state.tradeFilter) return false;
      if (state.query) {
        var q = state.query.toLowerCase();
        var blob = [fullName(m), m.business, m.trade, m.regions.map(regionName).join(" ")].join(" ").toLowerCase();
        if (blob.indexOf(q) === -1) return false;
      }
      if (window.TC12 && TC12.passRelFilter && !TC12.passRelFilter(m)) return false;
      return true;
    });
  }

  function memberCard(m) {
    if (window.TC12 && TC12.memberCard) return TC12.memberCard(m);
    return '<div class="card member-card">' +
      '<button type="button" class="member-main" data-go="member" data-id="' + m.id + '">' +
      avatarHTML(m, 52) +
      '<div class="meta"><div class="nm">' + escapeText(fullName(m)) + '</div>' +
      '<div class="biz">' + escapeText(m.business) + '</div>' +
      '<div class="tags"><span class="pill t-pill">' + escapeText(m.trade) + "</span>" +
      m.regions.map(function (r) { return '<span class="pill r-pill">' + regionName(r) + "</span>"; }).join("") +
      '</div></div></button>' +
      '<a class="friend-btn" href="' + escapeAttr(m.facebook) + '" target="_blank" rel="noopener noreferrer">' +
      icon("addfriend") + "<span>Add friend</span></a></div>";
  }



  function matchTrades(q) {
    q = String(q || "").toLowerCase().trim();
    if (!q) return TRADES.slice();
    return TRADES.filter(function (tr) { return tr.toLowerCase().indexOf(q) !== -1; });
  }
  function matchPeople(q) {
    q = String(q || "").toLowerCase().trim();
    if (!q) return [];
    return MEMBERS.filter(function (m) {
      if (m.isMe) return false;
      var blob = [fullName(m), m.business, m.trade].join(" ").toLowerCase();
      return blob.indexOf(q) !== -1;
    });
  }
  function acHTML(q, withMembers) {
    var trades = matchTrades(q);
    var people = withMembers ? matchPeople(q) : [];
    if (!String(q || "").trim()) {
      if (!withMembers) {
        var starter = trades.slice(0, 12);
        return '<div class="ac-group">Trades</div>' + starter.map(function (tr) {
          return '<button type="button" class="ac-item" data-ac-trade="' + escapeAttr(tr) + '"><span>' + escapeText(tr) + '</span></button>';
        }).join("") + (trades.length > 12 ? '<div class="ac-empty">Type to search all ' + trades.length + ' trades</div>' : "");
      }
      return "";
    }
    trades = trades.slice(0, 12);
    if (!trades.length && !people.length) return '<div class="ac-empty">No matches for “' + escapeText(q) + '”</div>';
    var html = "";
    if (trades.length) {
      html += '<div class="ac-group">Trades</div>' + trades.map(function (tr) {
        return '<button type="button" class="ac-item" data-ac-trade="' + escapeAttr(tr) + '"><span>' + escapeText(tr) + '</span><span class="ac-kind">Trade</span></button>';
      }).join("");
    }
    if (people.length) {
      html += '<div class="ac-group">Members</div>' + people.map(function (m) {
        return '<button type="button" class="ac-item" data-ac-member="' + m.id + '">' + avatarHTML(m, 32) +
          "<span><span>" + escapeText(fullName(m)) + '</span><span class="sub">' + escapeText(m.business) + " · " + escapeText(m.trade) + "</span></span></button>";
      }).join("");
    }
    return html;
  }
  function paintSearchAc() {
    var box = document.getElementById("searchAc");
    if (!box) return;
    var q = state.query || "";
    if (!q.trim()) { box.hidden = true; box.innerHTML = ""; return; }
    box.innerHTML = acHTML(q, true);
    box.hidden = false;
  }
  function paintTradeAc(openAll) {
    var box = document.getElementById("tradeAc");
    var input = document.getElementById("tradeType");
    if (!box) return;
    var q = input ? input.value : "";
    if (!openAll && !String(q).trim()) { box.hidden = true; box.innerHTML = ""; return; }
    box.innerHTML = acHTML(q, false);
    box.hidden = !box.innerHTML;
  }

  function allRegionIds() {
    return REGIONS.map(function (r) { return r.id; });
  }
  function isAllMetro(ids) {
    var all = allRegionIds();
    if (!ids || ids.length !== all.length) return false;
    var set = {};
    ids.forEach(function (id) { set[id] = true; });
    return all.every(function (id) { return set[id]; });
  }
  function rememberManual(prefix, ids) {
    if (!state.regionBackup) state.regionBackup = {};
    if (ids && ids.length && !isAllMetro(ids)) state.regionBackup[prefix] = ids.slice();
  }
  function restoreManual(prefix) {
    if (!state.regionBackup) state.regionBackup = {};
    var backup = state.regionBackup[prefix];
    if (backup && backup.length && !isAllMetro(backup)) return backup.slice();
    return ["hills", "north"];
  }
  function getPickedRegions(prefix) {
    if (prefix === "create") return (state.stepRegions || []).slice();
    if (prefix === "me-regions") return (me().regions || []).slice();
    var d = draftFromMe();
    return (d.regions || []).slice();
  }
  function setPickedRegions(prefix, ids) {
    ids = (ids || []).slice();
    if (prefix === "create") {
      state.stepRegions = ids;
      return isAllMetro(ids) && state.screen === "create-regions-all" ? "create-regions-all" : "create-regions";
    }
    if (prefix === "me-regions") {
      me().regions = ids;
      if (state.draft) state.draft.regions = ids.slice();
      return isAllMetro(ids) && state.screen === "my-regions-all" ? "my-regions-all" : "my-regions";
    }
    var d = draftFromMe();
    d.regions = ids;
    state.draft = d;
    return "edit-profile";
  }
  function toggleRegionId(prefix, rid, allowEmpty) {
    var cur = getPickedRegions(prefix);
    var ix = cur.indexOf(rid);
    if (ix >= 0) {
      if (!allowEmpty && cur.length === 1) return cur;
      cur.splice(ix, 1);
    } else {
      cur.push(rid);
    }
    rememberManual(prefix, cur);
    return cur;
  }
  function joinAllMetro(prefix) {
    var cur = getPickedRegions(prefix);
    if (isAllMetro(cur)) return restoreManual(prefix);
    rememberManual(prefix, cur);
    return allRegionIds();
  }
  function selectedAreasCard(ids, opts) {
    opts = opts || {};
    var title = opts.title || "Your areas";
    var all = isAllMetro(ids);
    var chips = (ids || []).map(function (id) {
      return '<span class="pill r-pill">' + regionName(id) + "</span>";
    }).join("");
    var badge = all ? '<span class="areas-all-badge">All Perth metro</span>' : "";
    var empty = !(ids && ids.length) ? '<p class="hint" style="margin:0">No areas selected yet.</p>' : "";
    var change = opts.changeTo
      ? '<button type="button" class="link areas-change" data-go="' + opts.changeTo + '">' + (opts.changeLabel || "Change") + "</button>"
      : "";
    var sub = opts.sub ? '<p class="hint" style="margin:8px 0 0">' + opts.sub + "</p>" : "";
    return '<div class="areas-card">' +
      '<div class="areas-card-top"><div class="areas-card-h">' + title + "</div>" + badge + change + "</div>" +
      (empty || '<div class="tags">' + chips + "</div>") +
      sub + "</div>";
  }
  function regionPicker(selectedIds, prefix) {
    selectedIds = selectedIds || [];
    var allOn = isAllMetro(selectedIds);
    var toggle = '<button type="button" class="join-all' + (allOn ? " on" : "") + '" data-action="join-all-metro" data-prefix="' + prefix + '" aria-pressed="' + (allOn ? "true" : "false") + '">' +
      '<span class="join-all-txt"><strong>Join all Perth metro</strong><span class="join-all-sub">' +
      (allOn ? "You’re in every Perth area. Turn this off to go back to your own picks." : "Select every Perth region at once.") +
      "</span></span><span class=\"toggle" + (allOn ? " on" : "") + '" aria-hidden="true"></span></button>';
    var card = selectedAreasCard(selectedIds, { title: "Your areas" });
    var grid = '<div class="region-sec"><h3>Perth metro areas</h3><p>All areas in one list. Tick the ones you work in, or join all of Perth metro above.</p>' +
      '<div class="region-grid">' + REGIONS.map(function (r) {
        var on = selectedIds.indexOf(r.id) !== -1;
        return '<button type="button" class="region-chip' + (on ? " on" : "") + '" data-region="' + r.id + '" data-prefix="' + prefix + '">' +
          "<span><span class=\"n\">" + r.name + "</span>" + (r.suggested ? '<span class="sug">Suggested</span>' : "") + "</span>" +
          '<span class="tick">' + icon("check") + "</span></button>";
      }).join("") + "</div></div>";
    return toggle + card + grid;
  }

  function draftFromMe() {
    var m = me();
    return state.draft || {
      first: m.first, last: m.last, business: m.business, trade: m.trade,
      bio: m.bio, phone: m.phone, facebook: m.facebook, page: m.page,
      regions: m.regions.slice()
    };
  }

  function parseName(name) {
    var parts = String(name || "").trim().split(/\s+/);
    if (!parts[0]) return { first: "Jamie", last: "Hale" };
    if (parts.length === 1) return { first: parts[0], last: "" };
    return { first: parts[0], last: parts.slice(1).join(" ") };
  }

  function captureDraft(form) {
    var fd = new FormData(form);
    var current = draftFromMe();
    var first = String(fd.get("first") || "").trim();
    var last = String(fd.get("last") || "").trim();
    if (!first && !last && fd.get("name")) {
      var n = parseName(fd.get("name"));
      first = n.first; last = n.last;
    }
    state.draft = {
      first: first || current.first, last: last || current.last,
      business: fd.get("business") || current.business,
      trade: current.trade,
      bio: fd.get("bio") || "",
      phone: fd.get("phone") || "",
      facebook: fd.get("facebook") || "",
      page: fd.get("page") || "",
      regions: (current.regions || me().regions).slice()
    };
  }

  function applyDraftToMe() {
    var d = draftFromMe();
    var m = me();
    m.first = d.first; m.last = d.last; m.business = d.business; m.trade = d.trade;
    m.bio = d.bio; m.phone = d.phone; m.facebook = d.facebook; m.page = d.page;
    m.regions = (d.regions || []).slice();
  }



  function demoFbLink() { return "https://www.facebook.com/demo.halepestcontrol"; }

  function fbConnectBlock(screenId, currentLink) {
    if (state.fbConnected) {
      var d = draftFromMe();
      var who = { first: d.first || "Jamie", last: d.last || "Hale", color: "teal", isMe: true };
      var link = d.facebook || demoFbLink();
      return '<div class="fb-card">' + avatarHTML(who, 44) +
        '<div class="fb-card-meta"><div class="fb-card-k">Facebook connected</div>' +
        '<div class="fb-card-n">' + escapeText(fullName(who)) + "</div>" +
        '<div class="fb-card-l">' + escapeText(String(link).replace("https://www.", "")) + "</div></div>" +
        '<button type="button" class="fb-disconnect" data-action="fb-disconnect">Disconnect</button>' +
        '<input type="hidden" name="facebook" value="' + escapeAttr(link) + '">' +
        "</div>";
    }
    return '<button type="button" class="btn btn-fb" data-action="fb-connect" data-next="' + screenId + '">' + icon("fb") + " Connect Facebook</button>" +
      '<div class="or-line"><span>or paste your link</span></div>' +
      '<div class="field"><label>Facebook profile link</label><input name="facebook" inputmode="url" placeholder="https://www.facebook.com/your.profile" value="' + escapeAttr(currentLink || "") + '">' +
      '<p class="hint">This is the profile other members will open to send you a friend request.</p></div>';
  }

  function renderWelcome() {
    return '<section class="screen dark" id="screen-welcome" data-screen="welcome">' +
      '<div class="welcome-bg" aria-hidden="true"><div class="ring" style="width:280px;height:280px"></div><div class="ring" style="width:400px;height:400px"></div><div class="ring" style="width:520px;height:520px"></div></div>' +
      '<div class="welcome-inner"><div class="logo-mark">' + icon("logo") + '</div>' +
      '<div class="welcome-kicker">Perth tradies</div>' +
      '<h2>TradeCircle<br><span>Perth</span></h2>' +
      '<span class="name-badge placeholder-note">Placeholder name</span>' +
      '<p class="welcome-copy">Join your local areas, meet other trades, and send a Facebook friend request so you can recommend each other in the groups.</p>' +
      '<ul class="welcome-points">' +
      '<li><span class="ic">' + icon("check") + "</span> Connect your Facebook in one tap, or paste your link.</li>" +
      '<li><span class="ic">' + icon("check") + "</span> Pick one or more Perth regions.</li>" +
      '<li><span class="ic">' + icon("check") + "</span> Weekly meet-ups stay offline — they are not in this app.</li>" +
      '</ul><div class="welcome-actions">' +
      '<button class="btn btn-fb" data-action="fb-connect" data-next="create-profile">' + icon("fb") + " Continue with Facebook</button>" +
      '<div class="or-line light"><span>or</span></div>' +
      '<button class="btn btn-primary has-ico" data-go="signup">' + icon("user") + "<span>Create account</span></button>" +
      '<button class="btn btn-ghost has-ico" data-go="signin">' + icon("user") + "<span>Sign in</span></button>" +
      '</div><p class="welcome-foot">Recommendations should only be for people you actually know.</p></div></section>';
  }

  function renderSignIn() {
    return '<section class="screen has-header" data-screen="signin">' +
      '<div class="app-header"><button class="icon-btn" data-go="welcome" aria-label="Back">' + icon("back") + '</button><div class="ht">Sign in</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="auth-hero"><h2>Welcome back</h2><p>Sign in to see members in your Perth areas.</p></div>' +
      '<form data-form="signin">' +
      '<div class="field"><label>Email</label><input type="email" name="email" placeholder="you@example.com" value="jamie@halepest.demo" autocomplete="username"></div>' +
      '<div class="field"><label>Password</label><input type="password" name="password" placeholder="••••••••" value="demopass" autocomplete="current-password"></div>' +
      '<button class="btn btn-primary has-ico" type="submit" style="margin-top:8px">' + icon("check") + "<span>Sign in</span></button></form>" +
      '<p class="hint" style="text-align:center;margin-top:14px">This is a prototype — tap Sign in to continue as Jamie Hale.</p>' +
      '<div class="auth-bottom">New here? <a class="link" data-go="signup" href="#signup">Create an account</a></div></div></section>';
  }

  function renderSignUp() {
    return '<section class="screen has-header" data-screen="signup">' +
      '<div class="app-header"><button class="icon-btn" data-go="welcome" aria-label="Back">' + icon("back") + '</button><div class="ht">Create account</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="auth-hero"><h2>Join the circle</h2><p>Sign up with Facebook in one tap, or create an account with email.</p></div>' +
      '<button type="button" class="btn btn-fb" data-action="fb-connect" data-next="create-profile">' + icon("fb") + " Sign up with Facebook</button>" +
      '<div class="or-line"><span>or sign up with email</span></div>' +
      '<form data-form="signup">' +
      '<div class="name-row"><div class="field"><label>First name</label><input name="first" placeholder="Jamie" required autocomplete="given-name"></div>' +
      '<div class="field"><label>Last name</label><input name="last" placeholder="Hale" required autocomplete="family-name"></div></div>' +
      '<div class="field"><label>Email</label><input type="email" name="email" placeholder="you@example.com" required></div>' +
      '<div class="field"><label>Password</label><input type="password" name="password" placeholder="At least 8 characters" required></div>' +
      '<button class="btn btn-primary has-ico" type="submit" style="margin-top:8px">' + icon("chev") + "<span>Continue</span></button></form>" +
      '<div class="auth-bottom">Already have an account? <a class="link" data-go="signin" href="#signin">Sign in</a></div></div></section>';
  }

  function renderCreateProfile() {
    if (window.TC12 && TC12.renderCreateProfile) return TC12.renderCreateProfile();
    var d = draftFromMe();
    var dummy = { first: d.first || "Add", last: d.last || "photo", color: "teal", isMe: true };
    return '<section class="screen has-header" data-screen="create-profile">' +
      '<div class="app-header"><button class="icon-btn" data-go="signup" aria-label="Back">' + icon("back") + '</button><div class="ht">Your profile</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="steps" aria-hidden="true"><span class="on"></span><span></span></div>' +
      '<div class="auth-hero"><h2>About your business</h2><p>Step 1 of 2. Other members will see this before they send a friend request.</p></div>' +
      '<form data-form="create-profile"><div class="photo-row">' +
      '<button type="button" class="photo-btn" data-photo="1" aria-label="Add photo">' + avatarHTML(dummy, 80) + '<span class="cam">' + icon("cam") + "</span></button>" +
      "<div><strong style=\"font-size:15px;font-weight:800\">Profile photo or logo</strong><p class=\"hint\">Optional. Initials are used if you skip this.</p></div></div>" +
      '<div class="name-row"><div class="field"><label>First name</label><input name="first" placeholder="Jamie" value="' + escapeAttr(d.first || "") + '" autocomplete="given-name"></div>' +
      '<div class="field"><label>Last name</label><input name="last" placeholder="Hale" value="' + escapeAttr(d.last || "") + '" autocomplete="family-name"></div></div>' +
      '<div class="field"><label>Business name</label><input name="business" placeholder="Hale Pest Control" value="' + escapeAttr(d.business || "") + '"></div>' +
      '<div class="field"><label>Trade</label><div class="search-wrap"><div class="search">' + icon("search") + '<input id="tradeType" type="text" placeholder="Type a trade, e.g. plumber" value="' + escapeAttr(d.trade || "") + '" autocomplete="off"></div><div id="tradeAc" class="ac-drop" hidden></div></div><p class="hint">Suggestions appear as you type. <button type="button" class="link" data-open-trades="1">See all trades</button></p></div>' +
      '<div class="field"><label>Short bio</label><textarea name="bio" rows="3" placeholder="What you do and where you work">' + escapeText(d.bio || "") + "</textarea></div>" +
      '<div class="field"><label>Phone <span class="opt">(optional)</span></label><input name="phone" inputmode="tel" placeholder="0412 000 000" value="' + escapeAttr(d.phone || "") + '"></div>' +
      '<div class="group-label" style="margin-top:4px">Facebook profile</div>' +
      fbConnectBlock("create-profile", d.facebook || "") +
      '<div class="field"><label>Facebook business page <span class="opt">(optional)</span></label><input name="page" inputmode="url" placeholder="https://www.facebook.com/your.business" value="' + escapeAttr(d.page || "") + '"></div>' +
      '<button class="btn btn-primary has-ico" type="submit" style="margin-top:6px">' + icon("pin") + "<span>Continue to regions</span></button></form></div></section>";
  }

  function renderCreateRegions() {
    var selected = state.stepRegions || [];
    var disabled = selected.length ? "" : ' disabled style="opacity:.45"';
    var count = selected.length ? (selected.length + " region" + (selected.length > 1 ? "s" : "") + " selected") : "Select at least one region";
    return '<section class="screen has-header" data-screen="create-regions">' +
      '<div class="app-header"><button class="icon-btn" data-go="create-profile" aria-label="Back">' + icon("back") + '</button><div class="ht">Your areas</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="steps" aria-hidden="true"><span class="on"></span><span class="on"></span></div>' +
      '<div class="auth-hero"><h2>Where do you work?</h2><p>Step 2 of 2. All of your areas are shown together. Join all of Perth metro at once, or tick only the areas you work in. You can change this later.</p></div>' +
      regionPicker(selected, "create") +
      '<p class="selected-count">' + count + "</p>" +
      '<button class="btn btn-primary has-ico" data-action="finish-create"' + disabled + ">" + icon("check") + "<span>Submit for approval</span></button>" +
      '<p class="hint" style="text-align:center;margin-top:12px">New members wait for a super admin to approve their profile before they appear in the list.</p></div></section>';
  }

  function renderPending() {
    var d = draftFromMe();
    var who = escapeText((d.first || "Jamie") + (d.last ? " " + d.last : ""));
    return '<section class="screen has-header" data-screen="pending">' +
      '<div class="app-header"><button class="icon-btn" data-go="create-regions" aria-label="Back">' + icon("back") + '</button><div class="ht">Awaiting approval</div><span class="header-spacer"></span></div>' +
      '<div class="scroll">' +
      '<div class="pending-art">' + icon("check") + "</div>" +
      '<div class="auth-hero" style="text-align:center"><h2>Thanks, ' + escapeText(d.first || "Jamie") + '. We’re reviewing your profile.</h2>' +
      "<p>Your profile stays hidden until a TradeCircle admin approves it. You’ll get a notification when you’re in. This usually takes a day.</p></div>" +
      '<div class="areas-card"><div class="areas-card-h">Submitted</div>' +
      '<p class="hint" style="margin:0">Name: ' + who + '<br>Trade: ' + escapeText(d.trade || "To be added") + "</p></div>" +
      '<p class="hint" style="text-align:center">This is a prototype. Use the screen list, or the preview below, to look around while you wait.</p>' +
      '<button class="btn btn-navy has-ico" data-go="members" style="margin-top:8px">' + icon("user") + "<span>Preview the members list</span></button>" +
      '<button class="btn btn-ghost ink has-ico" data-go="edit-profile" style="margin-top:10px">' + icon("pencil") + "<span>Edit my profile while I wait</span></button></div></section>";
  }

  function renderMembers() {
    if (window.TC12 && TC12.renderMembers) return TC12.renderMembers();
    var list = filteredMembers();
    var used = {};
    MEMBERS.forEach(function (m) { if (!m.isMe) used[m.trade] = true; });
    var trades = ["All"].concat(TRADES.filter(function (t) { return used[t]; }));
    var countLabel = state.areaFilter === "mine"
      ? (list.length + " member" + (list.length === 1 ? "" : "s") + " in your areas")
      : (list.length + " member" + (list.length === 1 ? "" : "s") + " across Perth metro");
    return '<section class="screen has-tabs" data-screen="members"><div class="scroll">' +
      '<h1 class="large-title">Members</h1><p class="count-line">' + countLabel + "</p>" +
      '<div class="search-wrap"><div class="search">' + icon("search") + '<input id="memberSearch" type="search" placeholder="Search name, business or trade" value="' + escapeAttr(state.query) + '" autocomplete="off"></div><div id="searchAc" class="ac-drop" hidden></div></div>' +
      '<div style="height:12px"></div><div class="seg">' +
      '<button class="' + (state.areaFilter === "mine" ? "active" : "") + '" data-area="mine">My areas</button>' +
      '<button class="' + (state.areaFilter === "all" ? "active" : "") + '" data-area="all">All Perth metro</button>' +
      '</div><div style="height:12px"></div><div class="chips">' +
      trades.map(function (t) { return '<button class="chip' + (state.tradeFilter === t ? " active" : "") + '" data-trade="' + escapeAttr(t) + '">' + t + "</button>"; }).join("") +
      "</div>" +
      (state.tipDismissed ? '<div style="height:10px"></div>' : '<div class="banner info" style="margin:8px 0 14px" id="tipBanner">Tap Add friend to send a Facebook request, or open a profile for details. Weekly meet-ups stay offline. <button class="link" data-action="dismiss-tip" style="margin-left:6px">Got it</button></div>') +
      '<div id="memberList">' + (list.length ? list.map(memberCard).join("") : '<div class="empty"><h3>No members match</h3><p>Try All Perth metro, or clear the trade filter and search.</p></div>') +
      "</div></div></section>";
  }

  function renderMember(id) {
    if (window.TC12 && TC12.renderMember) return TC12.renderMember(id);
    var m = MEMBERS.find(function (x) { return x.id === (id || state.selectedMember); }) || MEMBERS[1];
    state.selectedMember = m.id;
    var pageBtn = m.page
      ? '<a class="btn btn-ghost ink" href="' + m.page + '" target="_blank" rel="noopener noreferrer">' + icon("link") + " View business page</a>"
      : '<button class="btn btn-ghost ink" disabled style="opacity:.45">No business page listed</button>';
    var phoneRow = m.phone ? '<div class="info-row"><div class="ic">' + icon("phone") + '</div><div><div class="k">Phone</div><div class="v">' + m.phone + "</div></div></div>" : "";
    return '<section class="screen has-header" data-screen="member">' +
      '<div class="app-header"><button class="icon-btn" data-go="members" aria-label="Back">' + icon("back") + '</button><div class="ht">Member</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="profile-hero">' + avatarHTML(m, 96) +
      '<div class="nm">' + escapeText(fullName(m)) + '</div><div class="biz">' + escapeText(m.business) + "</div>" +
      '<div class="tags"><span class="pill t-pill">' + escapeText(m.trade) + "</span>" +
      m.regions.map(function (r) { return '<span class="pill r-pill">' + regionName(r) + "</span>"; }).join("") +
      "</div></div><p class=\"bio\">" + escapeText(m.bio) + "</p>" +
      '<div class="action-stack"><a class="btn btn-fb btn-lg" href="' + m.facebook + '" target="_blank" rel="noopener noreferrer">' +
      '<span style="display:flex;align-items:center;gap:8px;font-size:16px;font-weight:800">' + icon("fb") + " Open Facebook profile</span><small>Send a friend request</small></a>" +
      pageBtn + "</div>" +
      '<p class="hint" style="text-align:center;margin-top:10px">The friend request is sent on Facebook, not inside this app.</p>' +
      '<div class="info-rows">' + phoneRow +
      '<div class="info-row"><div class="ic">' + icon("pin") + '</div><div><div class="k">Regions</div><div class="v">' + m.regions.map(regionName).join(", ") + "</div></div></div>" +
      '<div class="info-row"><div class="ic">' + icon("link") + '</div><div><div class="k">Facebook profile</div><div class="v">' + m.facebook.replace("https://www.", "") + "</div></div></div>" +
      "</div></div></section>";
  }

  function renderMe() {
    if (window.TC12 && TC12.renderMe) return TC12.renderMe();
    var m = me();
    var phoneRow = m.phone ? '<div class="info-row"><div class="ic">' + icon("phone") + '</div><div><div class="k">Phone</div><div class="v">' + m.phone + "</div></div></div>" : "";
    var pageRow = m.page ? '<div class="info-row"><div class="ic">' + icon("link") + '</div><div><div class="k">Business page</div><div class="v">' + m.page.replace("https://www.", "") + "</div></div></div>" : "";
    return '<section class="screen has-tabs has-header" data-screen="me">' +
      '<div class="app-header"><span class="header-spacer"></span><div class="ht">My profile</div><button class="header-link" data-go="edit-profile">Edit</button></div>' +
      '<div class="scroll"><div class="profile-hero">' + avatarHTML(m, 96) +
      '<div class="nm">' + escapeText(fullName(m)) + ' <span class="you-badge">You</span></div>' +
      '<div class="biz">' + escapeText(m.business) + '</div><div class="tags"><span class="pill t-pill">' + escapeText(m.trade) + "</span>" +
      m.regions.map(function (r) { return '<span class="pill r-pill">' + regionName(r) + "</span>"; }).join("") +
      "</div></div><p class=\"bio\">" + escapeText(m.bio) + "</p>" +
      '<div class="banner info">This is how other members see you. They will use your Facebook profile link to send a friend request.</div>' +
      '<div class="info-rows">' + phoneRow +
      '<div class="info-row"><div class="ic">' + icon("pin") + '</div><div><div class="k">Regions</div><div class="v">' + m.regions.map(regionName).join(", ") + "</div></div></div>" +
      '<div class="info-row"><div class="ic">' + icon("link") + '</div><div><div class="k">Facebook profile</div><div class="v">' + m.facebook.replace("https://www.", "") + "</div></div></div>" +
      pageRow + "</div></div></section>";
  }

  function renderEdit() {
    if (window.TC12 && TC12.renderEdit) return TC12.renderEdit();
    var d = draftFromMe();
    var m = Object.assign({}, me(), d, { isMe: true });
    return '<section class="screen has-header" data-screen="edit-profile">' +
      '<div class="app-header"><button class="icon-btn" data-go="me" aria-label="Back">' + icon("back") + '</button><div class="ht">Edit profile</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><form data-form="edit-profile"><div class="photo-row">' +
      '<button type="button" class="photo-btn" data-photo="1" aria-label="Change photo">' + avatarHTML(m, 80) + '<span class="cam">' + icon("cam") + "</span></button>" +
      "<div><strong style=\"font-size:15px;font-weight:800\">Profile photo or logo</strong><p class=\"hint\">Tap to add a photo. Initials are used if you skip this.</p></div></div>" +
      '<div class="name-row"><div class="field"><label>First name</label><input name="first" value="' + escapeAttr(d.first || "") + '" autocomplete="given-name"></div>' +
      '<div class="field"><label>Last name</label><input name="last" value="' + escapeAttr(d.last || "") + '" autocomplete="family-name"></div></div>' +
      '<div class="field"><label>Business name</label><input name="business" value="' + escapeAttr(d.business) + '"></div>' +
      '<div class="field"><label>Trade</label><div class="search-wrap"><div class="search">' + icon("search") + '<input id="tradeType" type="text" placeholder="Type a trade, e.g. plumber" value="' + escapeAttr(d.trade || "") + '" autocomplete="off"></div><div id="tradeAc" class="ac-drop" hidden></div></div><p class="hint">Suggestions appear as you type. <button type="button" class="link" data-open-trades="1">See all trades</button></p></div>' +
      '<div class="field"><label>Short bio</label><textarea name="bio" rows="3">' + escapeText(d.bio) + "</textarea></div>" +
      '<div class="field"><label>Phone <span class="opt">(optional)</span></label><input name="phone" value="' + escapeAttr(d.phone || "") + '"></div>' +
      '<div class="group-label">Facebook profile</div>' +
      fbConnectBlock("edit-profile", d.facebook || "") +
      '<div class="field"><label>Facebook business page <span class="opt">(optional)</span></label><input name="page" inputmode="url" value="' + escapeAttr(d.page || "") + '"></div>' +
      '<div class="group-label">Your areas</div>' + regionPicker(d.regions || [], "edit") +
      '<button class="btn btn-primary has-ico" type="submit" style="margin-top:8px">' + icon("check") + "<span>Save changes</span></button></form></div></section>";
  }

  function renderSettings() {
    if (window.TC12 && TC12.renderSettings) return TC12.renderSettings();
    var m = me();
    return '<section class="screen has-tabs has-header" data-screen="settings">' +
      '<div class="app-header"><span class="header-spacer"></span><div class="ht">Settings</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><p class="group-label">Account</p><div class="card group">' +
      '<button class="set-row" data-go="me"><span class="ic" style="background:#E7F8F1;color:#066B4C">' + icon("pin") + '</span><span class="lab"><span class="a">View my profile</span><span class="b">' + escapeText(fullName(m)) + " · " + escapeText(m.trade) + '</span></span><span class="chev">' + icon("chev") + "</span></button>" +
      '<button class="set-row" data-go="edit-profile"><span class="ic" style="background:#EEF2F6;color:#14314C">' + icon("pencil") + '</span><span class="lab"><span class="a">Edit profile and regions</span><span class="b">Name, trade, Facebook links, areas</span></span><span class="chev">' + icon("chev") + "</span></button>" +
      (state.fbConnected
        ? '<button class="set-row" type="button" data-go="edit-profile"><span class="ic" style="background:#E8F1FD;color:#1877F2">' + icon("fb") + '</span><span class="lab"><span class="a">Facebook: Connected</span><span class="b">' + escapeText(String(m.facebook || demoFbLink()).replace("https://www.", "")) + '</span></span><span class="chev">' + icon("chev") + "</span></button>"
        : '<button class="set-row" type="button" data-action="fb-connect" data-next="settings"><span class="ic" style="background:#E8F1FD;color:#1877F2">' + icon("fb") + '</span><span class="lab"><span class="a">Connect Facebook</span><span class="b">One tap to add your profile link</span></span><span class="chev">' + icon("chev") + "</span></button>") +
      '</div><p class="group-label">Preferences</p><div class="card group">' +
      '<button class="set-row" data-action="toggle-notify"><span class="ic" style="background:#FFF6E0;color:#8A5A00">' + icon("bell") + '</span><span class="lab"><span class="a">New member alerts</span><span class="b">A simple on/off for a later build</span></span><span class="toggle' + (state.notify ? " on" : "") + '" id="notifyToggle"></span></button>' +
      '</div><p class="group-label">How the circle works</p>' +
      '<div class="card group" style="padding:12px 14px"><p style="font-size:14px;font-weight:600;line-height:1.5;color:var(--text)">Only recommend members you have actually met or worked with, and say so in your comment. Weekly catch-ups are organised in person, not in this app.</p></div>' +
      '<p class="group-label">About</p><div class="card group">' +
      '<div class="set-row"><span class="lab"><span class="a">App name</span><span class="b">TradeCircle Perth — placeholder, not final</span></span></div>' +
      '<div class="set-row"><span class="lab"><span class="a">Version</span><span class="b">UI prototype v1.1 · 16 Nov 2026</span></span></div></div>' +
      '<button class="btn btn-ghost ink" data-go="welcome" style="margin-top:14px;color:var(--danger);border-color:#F3C4C4">Sign out</button>' +
      '<p class="settings-foot" style="padding-top:12px">Fictional demo data only.</p></div></section>';
  }


  function screenHTML(id) {
    switch (id) {
      case "welcome": return renderWelcome();
      case "signin": return renderSignIn();
      case "signup": return renderSignUp();
      case "create-profile":
      case "create-profile-connected":
        return renderCreateProfile();
      case "fb-consent":
        return renderWelcome();
      case "create-regions":
      case "create-regions-all":
        return renderCreateRegions();
      case "pending": return renderPending();
      case "members":
      case "members-all":
      case "members-filter":
      case "members-search":
        return renderMembers();
      case "member": return renderMember(state.selectedMember);
      case "me": return renderMe();
      case "edit-profile": return renderEdit();
      case "settings": return renderSettings();
      default:
        if (window.TC12 && TC12.render) {
          var extra = TC12.render(id);
          if (extra) return extra;
        }
        return renderWelcome();
    }
  }

  function setHash(id) {
    var url = new URL(location.href);
    url.hash = (id === "member") ? ("member/" + state.selectedMember) : id;
    history.replaceState(null, "", url);
  }

  function go(id, opts) {
    opts = opts || {};
    if (opts.memberId) state.selectedMember = opts.memberId;
    if (id === "create-profile" && !state.draft) {
      state.draft = { first: "", last: "", business: "", trade: "", bio: "", phone: "", facebook: "", page: "", regions: [] };
      state.stepRegions = [];
    }
    if (id === "edit-profile") state.draft = draftFromMe();
    if (id === "create-regions" && !state.stepRegions) {
      state.stepRegions = (draftFromMe().regions || []).slice();
    }
    if (id === "create-regions-all") {
      if (!state.regionBackup) state.regionBackup = {};
      if (!state.regionBackup.create || isAllMetro(state.regionBackup.create)) {
        state.regionBackup.create = ["hills", "north"];
      }
      state.stepRegions = allRegionIds();
    }
    if (id === "my-regions-all") {
      if (!state.regionBackup) state.regionBackup = {};
      if (!state.regionBackup["me-regions"] || isAllMetro(state.regionBackup["me-regions"])) {
        state.regionBackup["me-regions"] = ["hills", "north"];
      }
      me().regions = allRegionIds();
      if (state.draft) state.draft.regions = allRegionIds();
    }

    state.screen = id;
    screensEl.innerHTML = screenHTML(id);
    var sc = screensEl.querySelector(".screen");
    if (sc) sc.classList.add("active");

    var showTabs = TABBED.has(id);
    tabbar.classList.toggle("show", showTabs);
    tabbar.querySelectorAll(".tab").forEach(function (t) {
      var tab = t.dataset.tab;
      var on = (tab === "members" && (id === "members" || id === "members-all" || id === "members-filter" || id === "members-search" || id === "drawer"))
        || (tab === "me" && (id === "me" || id === "my-regions" || id === "my-regions-all"))
        || (tab === "reviews" && (id === "reviews" || id === "reviews-back" || id === "review-ideas"))
        || (tab === "chats" && (id === "chats" || id === "chat-dm" || id === "chat-group"));
      t.classList.toggle("active", on);
    });
    statusBar.classList.toggle("light", DARK.has(id) || id === "welcome");
    var item = CHOOSER.find(function (c) { return c.id === id; });
    $("#deviceCaption").textContent = item ? item.title : "TradeCircle Perth";
    chooserList.querySelectorAll(".chooser-item").forEach(function (b) {
      b.classList.toggle("active", b.dataset.id === id);
    });
    setHash(id);
    bindScreen();
    if (id === "fb-consent") openFbSheet("create-profile");
    if (window.TC12 && TC12.afterGo) TC12.afterGo(id);
  }

  function bindScreen() {
    var search = $("#memberSearch");
    if (search) {
      var refreshList = function () {
        var wrap = $("#memberList");
        if (!wrap) return;
        var list = filteredMembers();
        wrap.innerHTML = list.length ? list.map(memberCard).join("") : '<div class="empty"><h3>No members match</h3><p>Try All Perth metro, or clear the trade filter and search.</p></div>';
        var cl = document.querySelector(".count-line");
        if (cl) {
          cl.textContent = state.areaFilter === "mine"
            ? (list.length + " member" + (list.length === 1 ? "" : "s") + " in your areas")
            : (list.length + " member" + (list.length === 1 ? "" : "s") + " across Perth metro");
        }
      };
      search.addEventListener("input", function (e) {
        state.query = e.target.value;
        refreshList();
        paintSearchAc();
      });
      search.addEventListener("focus", function () { if (state.query) paintSearchAc(); });
      if (state.query) paintSearchAc();
    }
    var tradeType = $("#tradeType");
    if (tradeType) {
      tradeType.addEventListener("input", function (e) {
        var form = e.target.closest("form");
        if (form) captureDraft(form);
        var typed = e.target.value;
        var exact = TRADES.find(function (tr) { return tr.toLowerCase() === typed.toLowerCase(); });
        if (exact) {
          var d = draftFromMe();
          d.trade = exact;
          state.draft = d;
        }
        paintTradeAc(true);
      });
      tradeType.addEventListener("focus", function () { paintTradeAc(true); });
    }
    if (!$("#photoFile")) {
      var inp = document.createElement("input");
      inp.type = "file";
      inp.accept = "image/*";
      inp.id = "photoFile";
      inp.className = "hidden-file";
      $("#phone").appendChild(inp);
      inp.addEventListener("change", function () {
        var f = inp.files && inp.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function () { state.photoData = r.result; go(state.screen); };
        r.readAsDataURL(f);
      });
    }
  }

  var sheetEl = null;
  function closeSheet() {
    if (sheetEl) { sheetEl.remove(); sheetEl = null; }
  }
  function openTradeSheet() {
    closeSheet();
    var current = draftFromMe().trade;
    sheetEl = document.createElement("div");
    sheetEl.className = "overlay show";
    sheetEl.innerHTML = '<div class="sheet"><div class="sheet-handle"></div><h3>Choose your trade</h3>' +
      '<div class="search" style="margin-bottom:12px">' + icon("search") + '<input id="sheetTradeSearch" type="search" placeholder="Type a trade, e.g. plumber" autocomplete="off"></div>' +
      '<div id="sheetTradeList">' +
      TRADES.map(function (tr) {
        return '<button class="trade-opt' + (tr === current ? " on" : "") + '" data-trade-pick="' + escapeAttr(tr) + '"><span>' + tr + '</span><span class="ck">' + icon("check") + "</span></button>";
      }).join("") + "</div></div>";
    var sheetSearch = sheetEl.querySelector("#sheetTradeSearch");
    if (sheetSearch) {
      sheetSearch.addEventListener("input", function (e) {
        var q = e.target.value;
        var list = matchTrades(q);
        var box = sheetEl.querySelector("#sheetTradeList");
        box.innerHTML = list.length ? list.map(function (tr) {
          return '<button class="trade-opt' + (tr === current ? " on" : "") + '" data-trade-pick="' + escapeAttr(tr) + '"><span>' + tr + '</span><span class="ck">' + icon("check") + "</span></button>";
        }).join("") : '<div class="ac-empty">No trades match “' + escapeText(q) + '”</div>';
      });
    }
    $("#phone").appendChild(sheetEl);
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toastEl.classList.remove("show"); }, 2400);
  }


  function applyFbConnect() {
    var form = document.querySelector("#screens form");
    if (form) captureDraft(form);
    var d = draftFromMe();
    if (!d.first) { d.first = "Jamie"; d.last = "Hale"; }
    d.facebook = demoFbLink();
    state.draft = d;
    state.fbConnected = true;
    var m = me();
    if (m) {
      if (!m.first) { m.first = d.first; m.last = d.last; }
      m.facebook = d.facebook;
    }
  }

  function openFbSheet(next) {
    state.fbNext = next || state.screen || "create-profile";
    closeSheet();
    sheetEl = document.createElement("div");
    sheetEl.className = "overlay show";
    sheetEl.innerHTML = '<div class="sheet">' +
      '<div class="sheet-handle"></div>' +
      '<div class="consent-banner">Prototype mock — this is not a real Facebook login. Nothing is sent to Facebook.</div>' +
      '<div class="consent-brand"><div class="consent-f">' + icon("fb") + '</div><div><h3>Continue with Facebook</h3><p>TradeCircle Perth is asking for access</p></div></div>' +
      '<ul class="consent-list">' +
      '<li><span class="ic">' + icon("check") + "</span><span>Your name and profile photo, so members can recognise you.</span></li>" +
      '<li><span class="ic">' + icon("link") + "</span><span>A link to your Facebook profile, so members can send you a friend request.</span></li>" +
      "</ul>" +
      '<div class="consent-actions">' +
      '<button type="button" class="btn btn-ghost ink" data-action="fb-consent-cancel">Cancel</button>' +
      '<button type="button" class="btn btn-fb" data-action="fb-consent-continue">' + icon("fb") + " Continue</button>" +
      "</div>" +
      '<p class="consent-note">In a real app this would be Facebook’s own login screen.</p>' +
      "</div>";
    document.getElementById("phone").appendChild(sheetEl);
  }

  function buildChooser() {
    chooserList.innerHTML = CHOOSER.map(function (c, i) {
      var num = String(i + 1).padStart(2, "0");
      return '<button class="chooser-item" data-id="' + c.id + '"><span class="chooser-num">' + num + "</span><span><div class=\"t\">" + c.title + '</div><div class="s">' + c.sub + "</div></span>" +
        (c.tbc ? '<span class="chooser-tag">TBC</span>' : "") + "</button>";
    }).join("");
  }

  document.addEventListener("click", function (e) {
    if (window.TC12 && TC12.handleClick && TC12.handleClick(e)) return;
    var chooserBtn = e.target.closest(".chooser-item");
    if (chooserBtn) {
      var id = chooserBtn.dataset.id;
      if (id === "members") { state.areaFilter = "mine"; state.tradeFilter = "All"; state.query = ""; }
      if (id === "members-all") { state.areaFilter = "all"; state.tradeFilter = "All"; state.query = ""; }
      if (id === "members-filter") { state.areaFilter = "all"; state.tradeFilter = "Plumber"; state.query = ""; }
      if (id === "members-search") { state.areaFilter = "all"; state.tradeFilter = "All"; state.query = "plu"; state.tipDismissed = true; }
      if (id === "member") state.selectedMember = "sarah";
      if (id === "welcome" || id === "signin" || id === "signup" || id === "fb-consent") {
        state.fbConnected = false;
      }
      if (id === "create-profile") {
        var m = me();
        state.fbConnected = false;
        state.draft = { first: m.first, last: m.last, business: m.business, trade: m.trade, bio: m.bio, phone: m.phone, facebook: "", page: m.page, regions: m.regions.slice() };
      }
      if (id === "create-profile-connected") {
        var m2 = me();
        state.fbConnected = true;
        state.draft = { first: m2.first, last: m2.last, business: m2.business, trade: m2.trade, bio: m2.bio, phone: m2.phone, facebook: demoFbLink(), page: m2.page, regions: m2.regions.slice() };
      }
      if (id === "edit-profile" || id === "settings" || id === "me") {
        state.fbConnected = true;
        me().facebook = me().facebook || demoFbLink();
      }
      if (id === "create-regions") {
        state.stepRegions = ["hills", "north"];
        if (!state.regionBackup) state.regionBackup = {};
        state.regionBackup.create = ["hills", "north"];
      }
      if (id === "create-regions-all") {
        if (!state.regionBackup) state.regionBackup = {};
        state.regionBackup.create = ["hills", "north"];
        state.stepRegions = allRegionIds();
      }
      if (id === "my-regions") {
        if (!state.regionBackup) state.regionBackup = {};
        if (!me().regions || !me().regions.length) me().regions = ["hills", "north"];
      }
      if (id === "my-regions-all") {
        if (!state.regionBackup) state.regionBackup = {};
        state.regionBackup["me-regions"] = ["hills", "north"];
        me().regions = allRegionIds();
      }
      if (id === "edit-profile" || id === "settings" || id === "me" || id === "google-consent") {
        state.googleConnected = (id !== "google-consent");
      }
      go(id);
      return;
    }

    var tab = e.target.closest(".tab");
    if (tab) {
      var t = tab.dataset.tab;
      go(t === "members" ? "members" : t);
      return;
    }

    var area = e.target.closest("[data-area]");
    if (area) {
      state.areaFilter = area.dataset.area;
      go(state.areaFilter === "all" ? "members-all" : "members");
      return;
    }

    var acTrade = e.target.closest("[data-ac-trade]");
    if (acTrade) {
      var picked = acTrade.dataset.acTrade;
      if (document.getElementById("tradeType")) {
        var form = e.target.closest("form");
        if (form) captureDraft(form);
        var d = draftFromMe();
        d.trade = picked;
        state.draft = d;
        var tin = document.getElementById("tradeType");
        if (tin) tin.value = picked;
        var box = document.getElementById("tradeAc");
        if (box) { box.hidden = true; box.innerHTML = ""; }
        return;
      }
      state.tradeFilter = picked;
      state.query = "";
      go(state.areaFilter === "all" ? "members-all" : "members");
      return;
    }
    var acMem = e.target.closest("[data-ac-member]");
    if (acMem) {
      state.selectedMember = acMem.dataset.acMember;
      go("member");
      return;
    }

    var trade = e.target.closest("[data-trade]");
    if (trade && !trade.dataset.tradePick && !trade.dataset.acTrade) {
      state.tradeFilter = trade.dataset.trade;
      go(state.areaFilter === "all" ? "members-all" : "members");
      return;
    }

    var goBtn = e.target.closest("[data-go]");
    if (goBtn) {
      e.preventDefault();
      var dest = goBtn.dataset.go;
      if (goBtn.dataset.id) state.selectedMember = goBtn.dataset.id;
      if (dest === "welcome") { state.draft = null; state.fbConnected = false; }
      go(dest);
      return;
    }

    if (e.target.closest("[data-action='fb-connect']")) {
      var btn = e.target.closest("[data-action='fb-connect']");
      var form = e.target.closest("form");
      if (form) captureDraft(form);
      openFbSheet(btn.dataset.next || state.screen);
      return;
    }

    if (e.target.closest("[data-action='fb-consent-cancel']")) {
      closeSheet();
      if (state.screen === "fb-consent") go("welcome");
      return;
    }

    if (e.target.closest("[data-action='fb-consent-continue']")) {
      applyFbConnect();
      closeSheet();
      var next = state.fbNext || "create-profile";
      if (next === "signin" || next === "welcome") next = "create-profile";
      toast("Facebook connected. Your profile link is filled in.");
      go(next);
      return;
    }

    if (e.target.closest("[data-action='fb-disconnect']")) {
      state.fbConnected = false;
      toast("Facebook disconnected. You can paste a link instead.");
      go(state.screen === "create-profile-connected" ? "create-profile" : state.screen);
      return;
    }

    if (e.target.closest("[data-photo]")) {
      var pf = $("#photoFile");
      if (pf) pf.click();
      return;
    }

    if (e.target.closest("[data-open-trades]")) {
      var form = e.target.closest("form");
      if (form) captureDraft(form);
      openTradeSheet();
      return;
    }

    var pick = e.target.closest("[data-trade-pick]");
    if (pick) {
      var d = draftFromMe();
      d.trade = pick.dataset.tradePick;
      state.draft = d;
      closeSheet();
      go(state.screen);
      return;
    }

    if (e.target.closest(".overlay") && !e.target.closest(".sheet")) {
      closeSheet();
      return;
    }

    var joinAllBtn = e.target.closest("[data-action='join-all-metro']");
    if (joinAllBtn) {
      var prefixJ = joinAllBtn.getAttribute("data-prefix") || "edit";
      var formJ = e.target.closest("form");
      if (formJ) captureDraft(formJ);
      go(setPickedRegions(prefixJ, joinAllMetro(prefixJ)));
      return;
    }

    var region = e.target.closest("[data-region]");
    if (region) {
      var prefixR = region.dataset.prefix || "edit";
      var rid = region.dataset.region;
      var form2 = e.target.closest("form");
      if (form2) captureDraft(form2);
      var allowEmpty = (prefixR === "create" || prefixR === "edit");
      go(setPickedRegions(prefixR, toggleRegionId(prefixR, rid, allowEmpty)));
      return;
    }

    if (e.target.closest("[data-action='finish-create']")) {
      if (!(state.stepRegions || []).length) return;
      var d3 = draftFromMe();
      d3.regions = state.stepRegions.slice();
      state.draft = d3;
      applyDraftToMe();
      state.areaFilter = "mine";
      state.tradeFilter = "All";
      state.query = "";
      go("pending");
      toast("Thanks. Your profile is waiting for approval.");
      return;
    }

    if (e.target.closest("[data-action='dismiss-tip']")) {
      state.tipDismissed = true;
      var b = $("#tipBanner");
      if (b) b.remove();
      return;
    }

    if (e.target.closest("[data-action='toggle-notify']")) {
      state.notify = !state.notify;
      var tg = $("#notifyToggle");
      if (tg) tg.classList.toggle("on", state.notify);
    }
  });

  document.addEventListener("submit", function (e) {
    var form = e.target.closest("form");
    if (!form) return;
    e.preventDefault();
    var type = form.dataset.form;
    if (type === "signin") {
      state.areaFilter = "mine";
      state.tradeFilter = "All";
      state.query = "";
      go("members");
      return;
    }
    if (type === "signup") {
      var fd = new FormData(form);
      var first = String(fd.get("first") || "").trim();
      var last = String(fd.get("last") || "").trim();
      if (!first && fd.get("name")) { var n = parseName(fd.get("name")); first = n.first; last = n.last; }
      state.draft = { first: first || "Jamie", last: last || "Hale", business: "", trade: "", bio: "", phone: "", facebook: "", page: "", regions: [] };
      state.stepRegions = [];
      go("create-profile");
      return;
    }
    if (type === "create-profile") {
      captureDraft(form);
      if (!state.draft.trade) { toast("Please choose your trade."); return; }
      if (!state.draft.facebook && !state.fbConnected) { toast("Connect Facebook or paste your profile link."); return; }
      go("create-regions");
      return;
    }
    if (type === "edit-profile") {
      captureDraft(form);
      if (!(state.draft.regions || []).length) { toast("Select at least one region."); return; }
      applyDraftToMe();
      go("me");
      toast("Profile saved.");
    }
  });

  function fromHash() {
    var h = (location.hash || "").replace(/^#\/?/, "");
    if (!h) return null;
    if (h.indexOf("member/") === 0) {
      var mid = h.split("/")[1];
      if (MEMBERS.some(function (m) { return m.id === mid; })) return { id: "member", memberId: mid };
    }
    if (CHOOSER.some(function (c) { return c.id === h; })) return { id: h };
    return null;
  }

  window.addEventListener("hashchange", function () {
    var r = fromHash();
    if (r && r.id !== state.screen) go(r.id, { memberId: r.memberId });
  });

  buildChooser();

  var params = new URLSearchParams(location.search);
  if (params.has("shot") || params.get("mode") === "shot") {
    document.body.classList.add("shot");
  }
  var route = fromHash();
  var shot = params.get("shot");
  var start = (shot && CHOOSER.some(function (c) { return c.id === shot; })) ? shot : ((route && route.id) || "welcome");
  if (start === "members") { state.areaFilter = "mine"; state.tradeFilter = "All"; }
  if (start === "members-all") { state.areaFilter = "all"; state.tradeFilter = "All"; }
  if (start === "members-filter") { state.areaFilter = "all"; state.tradeFilter = "Plumber"; }
  if (start === "members-search") { state.areaFilter = "all"; state.tradeFilter = "All"; state.query = "plu"; state.tipDismissed = true; }
  if (start === "member") state.selectedMember = (route && route.memberId) || "sarah";
  if (start === "welcome" || start === "signin" || start === "signup" || start === "fb-consent") {
    state.fbConnected = false;
  }
  if (start === "create-profile") {
    var mm = me();
    state.fbConnected = false;
    state.draft = { first: mm.first, last: mm.last, business: mm.business, trade: mm.trade, bio: mm.bio, phone: mm.phone, facebook: "", page: mm.page, regions: mm.regions.slice() };
  }
  if (start === "create-profile-connected") {
    var mm2 = me();
    state.fbConnected = true;
    state.draft = { first: mm2.first, last: mm2.last, business: mm2.business, trade: mm2.trade, bio: mm2.bio, phone: mm2.phone, facebook: demoFbLink(), page: mm2.page, regions: mm2.regions.slice() };
  }
  if (start === "edit-profile" || start === "settings" || start === "me" || start === "reviews" || start === "chats" || start === "drawer" || start === "google-consent" || start === "subscription" || start === "invite" || start === "help") {
    state.fbConnected = true;
    state.googleConnected = true;
    me().facebook = me().facebook || demoFbLink();
  }
  if (start === "google-consent") state.googleConnected = false;
  if (start === "create-regions") {
    state.stepRegions = ["hills", "north"];
    state.regionBackup = state.regionBackup || {};
    state.regionBackup.create = ["hills", "north"];
  }
  if (start === "create-regions-all") {
    state.regionBackup = state.regionBackup || {};
    state.regionBackup.create = ["hills", "north"];
    state.stepRegions = allRegionIds();
  }
  if (start === "my-regions-all") {
    state.regionBackup = state.regionBackup || {};
    state.regionBackup["me-regions"] = ["hills", "north"];
    me().regions = allRegionIds();
  }
  go(start);

  window.TradeCircle = {
    go: go, state: state, MEMBERS: MEMBERS, REGIONS: REGIONS, CHOOSER: CHOOSER,
    TRADES: TRADES, filteredMembers: filteredMembers,
    icon: icon, avatarHTML: avatarHTML, escapeText: escapeText, escapeAttr: escapeAttr,
    fullName: fullName, me: me, regionName: regionName, toast: toast,
    closeSheet: closeSheet, draftFromMe: draftFromMe, demoFbLink: demoFbLink,
    captureDraft: captureDraft, fbConnectBlock: fbConnectBlock, regionPicker: regionPicker,
    allRegionIds: allRegionIds, isAllMetro: isAllMetro, selectedAreasCard: selectedAreasCard,
    buildChooser: buildChooser, paintSearchAc: paintSearchAc
  };
})();
