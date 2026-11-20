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
    teal: ["#1A5FD4", "#1E38B0"],
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
      links: {
        website: "https://www.halepest.example.au",
        facebook: "https://www.facebook.com/demo.halepestcontrol.biz",
        instagram: "https://www.instagram.com/demo.halepest",
        linkedin: "https://www.linkedin.com/company/demo-hale-pest",
        tiktok: "",
        youtube: "",
        google: "https://search.google.com/local/writereview?placeid=demo-hale-pest",
        other: ""
      },
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
      links: {
        website: "https://www.nguyencarpentry.example.au",
        facebook: "https://www.facebook.com/demo.nguyencarpentry.biz",
        instagram: "https://www.instagram.com/demo.nguyencarpentry",
        linkedin: "",
        tiktok: "",
        youtube: "",
        google: "https://search.google.com/local/writereview?placeid=demo-nguyen-carpentry",
        other: ""
      },
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
      links: {
        website: "https://www.oconnorplumbing.example.au",
        facebook: "https://www.facebook.com/demo.oconnorplumbing.biz",
        instagram: "",
        linkedin: "",
        tiktok: "",
        youtube: "",
        google: "https://search.google.com/local/writereview?placeid=demo-oconnor-plumbing",
        other: ""
      },
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
      links: {
        website: "https://www.thompsonelectrical.example.au",
        facebook: "https://www.facebook.com/demo.thompsonelectrical.biz",
        instagram: "",
        linkedin: "https://www.linkedin.com/company/demo-thompson-electrical",
        tiktok: "",
        youtube: "https://www.youtube.com/@demo.thompsonelectrical",
        google: "https://search.google.com/local/writereview?placeid=demo-thompson-electrical",
        other: ""
      },
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
      links: {
        website: "https://www.reevesfencing.example.au",
        facebook: "https://www.facebook.com/demo.reevesfencing.biz",
        instagram: "https://www.instagram.com/demo.reevesfencing",
        linkedin: "",
        tiktok: "https://www.tiktok.com/@demo.reevesfencing",
        youtube: "",
        google: "",
        other: ""
      },
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
    },
    {
      id: "noah", first: "Noah", last: "Barrett",
      business: "Barrett Barbers", trade: "Barber",
      regions: ["fremantle", "south"],
      bio: "A small Fremantle barber shop for classic cuts, fades and a proper shave. Walk-ins and bookings welcome.",
      phone: "0412 000 113",
      facebook: "https://www.facebook.com/demo.barrettbarbers",
      page: "https://www.facebook.com/demo.barrettbarbers.biz",
      links: {
        website: "https://www.barrettbarbers.example.au",
        facebook: "https://www.facebook.com/demo.barrettbarbers.biz",
        instagram: "https://www.instagram.com/demo.barrettbarbers",
        linkedin: "",
        tiktok: "",
        youtube: "",
        google: "",
        other: ""
      },
      color: "rust"
    },
    {
      id: "michael", first: "Michael", last: "Shaw",
      business: "Shaw Plumbing", trade: "Plumber",
      regions: ["joondalup", "north"],
      bio: "Hot water, leaking taps and bathroom plumbing across Joondalup and the northern suburbs.",
      phone: "0400 000 114",
      facebook: "https://www.facebook.com/shawplumbing.demo",
      page: "https://www.facebook.com/shawplumbing.demo",
      profileUrl: "https://ratebuddies.com/m/michael-shaw",
      links: { website: "https://www.shawplumbing.example.au", facebook: "https://www.facebook.com/shawplumbing.demo" },
      recShare: { phone: true, facebook: true, website: true, profile: true },
      color: "navy"
    }
  ];

  const CHOOSER = [
    { id: "welcome", title: "Welcome", sub: "First open of the app" },
    { id: "signin", title: "Sign in", sub: "Email and password" },
    { id: "signup", title: "Sign up — choose method", sub: "Facebook, email or phone" },
    { id: "signup-email", title: "Sign up — email", sub: "Email and password" },
    { id: "signup-phone", title: "Sign up — phone", sub: "Phone number and a one-time code" },
    { id: "signup-name", title: "Sign up — name", sub: "First and last name" },
    { id: "fb-consent", title: "Facebook connect", sub: "Prototype consent sheet" },
    { id: "create-profile", title: "Sign up — business and areas", sub: "Business details, trade, regions, then send for approval" },
    { id: "create-profile-connected", title: "Create profile — connected", sub: "Name and profile link filled" },
    { id: "choose-areas", title: "Choose areas — state", sub: "State, then metro and regional accordions" },
    { id: "create-regions", title: "Choose areas — WA regions", sub: "Metro accordion open, regional collapsed" },
    { id: "create-regions-all", title: "Choose areas — all Perth metro", sub: "WA metro with Select all on" },
    { id: "pending", title: "Awaiting approval", sub: "Waiting for a super admin, with a demo approve button" },
    { id: "complete-profile", title: "Complete your profile", sub: "After approval: fill or skip the extra profile details" },
    { id: "home", title: "Home — member dashboard", sub: "Greeting, stats, things that need you, quick actions" },
    { id: "members", title: "Members — My areas", sub: "Default member list" },
    { id: "members-all", title: "Members — All Perth metro", sub: "Metro-wide filter" },
    { id: "members-filter", title: "Members — Trade filter", sub: "Plumbers only, as an example" },
    { id: "members-search", title: "Search autocomplete", sub: "Type a trade, e.g. plu → Plumber" },
    { id: "member", title: "Member profile", sub: "Facebook friend request CTA" },
    { id: "me", title: "My profile", sub: "How other members see you" },
    { id: "edit-profile", title: "Edit profile", sub: "Connected Facebook, with disconnect" },
    { id: "settings", title: "Settings", sub: "Connections and notification toggles" },
    { id: "google-consent", title: "Google Business connect", sub: "Prototype consent sheet" },
    { id: "reviews", title: "Google Reviews", sub: "Received today, swap toggle, filters and member list" },
    { id: "review-ideas", title: "Review ideas helper", sub: "Job details, ideas, write your own" },
    { id: "chats", title: "Chat list", sub: "Pinned, unread, online status" },
    { id: "chat-dm", title: "1:1 conversation", sub: "Replies, reactions, voice note, read ticks" },
    { id: "chat-group", title: "Region group chat", sub: "Hills tradies with @mention" },
    { id: "notifications", title: "Notifications centre", sub: "Messages, reviews, new members" },
    { id: "notif-settings", title: "Notification settings", sub: "Toggles and quiet hours" },
    { id: "lockscreen", title: "Lock screen push", sub: "Mock notifications on the lock screen" },
    { id: "more", title: "More menu", sub: "Search, shortcuts and account in an apps grid" },
    { id: "tutorials", title: "Video tutorials", sub: "Short guides on how to use Rate Buddies" },
    { id: "drawer", title: "More menu", sub: "Search, shortcuts and account in an apps grid" },
    { id: "subscription", title: "Subscription", sub: "Free now, Pro later — price to be set" },
    { id: "invite", title: "Invite a tradie", sub: "Share a join link" },
    { id: "help", title: "Help & how it works", sub: "Circle rules and review guidance" },
    { id: "my-regions", title: "Your areas", sub: "State, then metro or regional, then regions" },
    { id: "my-regions-all", title: "Your areas — all metro", sub: "Join all Perth metro turned on" },
    { id: "ai-assistant", title: "AI assistant", sub: "Connect Grok, ChatGPT or Claude" },
    { id: "ai-voice", title: "AI voice command", sub: "Hands-free mock conversation" },
    { id: "rec-alerts", title: "Recommendation alerts", sub: "Posts the circle can help with" },
    { id: "rec-compose", title: "Send a recommendation alert", sub: "Paste a Facebook post link" },
    { id: "rec-alert", title: "Alert card", sub: "Open post, comment ideas, mark done" },
    { id: "promo-queue", title: "Facebook promotion queue", sub: "Free turns, or jump the queue later" },
    { id: "fb-recommend", title: "Facebook — Recommend", sub: "Admin-posted group links to vouch on" },
    { id: "fb-recommend-open", title: "Facebook — Recommend (open card)", sub: "Copy a unique recommendation" },
    { id: "fb-recommend-mine", title: "Facebook — This one is for you", sub: "A post recommending you" },
    { id: "fb-recommend-done", title: "Facebook — Recommend done", sub: "Posts you have already vouched on" },
    { id: "reviews-back", title: "Reviews — review back", sub: "Who left you a Google review" }
  ];

  const TABBED = new Set(["home", "members", "members-all", "members-filter", "members-search", "me", "settings", "reviews", "reviews-back", "chats", "notifications", "notif-settings", "subscription", "invite", "help", "my-regions", "my-regions-all", "drawer", "more", "google-consent", "ai-assistant", "ai-voice", "rec-alerts", "rec-compose", "rec-alert", "promo-queue", "fb-recommend", "fb-recommend-open", "fb-recommend-mine", "fb-recommend-done", "tutorials", "tutorial-play"]);
  const DARK = new Set(["welcome"]);

  const state = {
    screen: "welcome",
    areaFilter: "mine",
    tradeFilter: "All",
    query: "",
    selectedMember: "liam",
    meId: "jamie",
    draft: null,
    stepRegions: [],
    tipDismissed: false,
    notify: true,
    photoData: null,
    fbConnected: false,
    fbNext: "create-profile",
    relFilter: "all",
    googleConnected: true,
    regionBackup: {},
    areaPick: null
  };

  const $ = (sel, root) => (root || document).querySelector(sel);
  const screensEl = $("#screens");
  const tabbar = $("#tabbar");
  const statusBar = $("#statusBar");
  const chooserList = $("#chooserList");
  const toastEl = $("#toast");

  function regionName(id) {
    var hit = auRegionById(id);
    return hit ? hit.region.name : id;
  }

  function auStates() {
    return (window.TC_LOCATIONS && TC_LOCATIONS.states) || [];
  }
  function auState(id) {
    if (!id) return null;
    var key = String(id).toLowerCase();
    return auStates().find(function (s) { return s.id === key || s.abbrev.toLowerCase() === key; }) || null;
  }
  function auRegionById(id) {
    var i, j, s, list = auStates();
    for (i = 0; i < list.length; i++) {
      s = list[i];
      for (j = 0; j < s.regions.length; j++) {
        if (s.regions[j].id === id) return { region: s.regions[j], state: s };
      }
    }
    var p = REGIONS.find(function (x) { return x.id === id; });
    if (p) {
      return { region: { id: p.id, name: p.name, type: "metro" }, state: auState("wa") || { id: "wa", name: "Western Australia", abbrev: "WA", regions: [] } };
    }
    return null;
  }
  function formatRegionPill(id) {
    var hit = auRegionById(id);
    if (!hit) return id;
    if (hit.state && hit.state.abbrev !== "WA") return hit.region.name + " · " + hit.state.abbrev;
    return hit.region.name;
  }
  function capitalLabel(st) {
    var map = {
      wa: "Perth",
      nsw: "Sydney",
      vic: "Melbourne",
      qld: "Brisbane, the Gold Coast and the Sunshine Coast",
      sa: "Adelaide",
      tas: "Hobart",
      nt: "Darwin",
      act: "Canberra"
    };
    return (st && map[st.id]) || (st ? st.name : "");
  }
  function capitalShort(st) {
    var map = { wa: "Perth", nsw: "Sydney", vic: "Melbourne", qld: "SEQ", sa: "Adelaide", tas: "Hobart", nt: "Darwin", act: "Canberra" };
    return (st && map[st.id]) || (st ? st.name : "");
  }
  function kindCount(st, kind) {
    return (st.regions || []).filter(function (r) { return r.type === kind; }).length;
  }
  function selectAllLabel(st, kind) {
    if (!st) return "Select all";
    if (kind === "metro") return "Select all " + capitalShort(st) + " metro";
    return "Select all regional " + st.abbrev;
  }
  function kindCardTitle(st, kind) {
    if (kind === "metro") return "Metro: " + capitalLabel(st) + " city areas";
    return "Regional: country " + st.abbrev;
  }
  function allPerthMetroIds() {
    return REGIONS.map(function (r) { return r.id; });
  }
  function currentListRegions(kind) {
    var pick = state.areaPick || {};
    var st = auState(pick.stateId || "wa");
    kind = kind || pick.kind || "metro";
    if (!st) return [];
    return (st.regions || []).filter(function (r) { return r.type === kind; });
  }
  function currentListIds(kind) {
    return currentListRegions(kind).map(function (r) { return r.id; });
  }
  function isAccOpen(kind) {
    var pick = state.areaPick || {};
    if (pick.open && typeof pick.open[kind] === "boolean") return pick.open[kind];
    return kind === "metro";
  }
  function ensureAccOpen(pick) {
    pick = pick || ensureAreaPick();
    if (!pick.open) pick.open = { metro: true, regional: false };
    return pick.open;
  }
  function groupSelectedAreas(ids) {
    var groups = [];
    var index = {};
    (ids || []).forEach(function (id) {
      var hit = auRegionById(id);
      if (!hit) return;
      var key = hit.state.id + ":" + hit.region.type;
      if (!index[key]) {
        index[key] = { state: hit.state, kind: hit.region.type, regions: [] };
        groups.push(index[key]);
      }
      index[key].regions.push(hit.region);
    });
    return groups;
  }
  function areasSummaryLines(ids) {
    return groupSelectedAreas(ids).map(function (g) {
      var kindLab = g.kind === "metro" ? "Metro" : "Regional";
      var allIds = g.state.regions.filter(function (r) { return r.type === g.kind; }).map(function (r) { return r.id; });
      var bit;
      if (allIds.length && allIds.every(function (id) { return (ids || []).indexOf(id) !== -1; })) {
        bit = g.kind === "metro" ? ("All " + capitalShort(g.state) + " metro") : ("All regional " + g.state.abbrev);
      } else {
        bit = g.regions.map(function (r) { return r.name; }).join(", ");
      }
      return g.state.abbrev + " · " + kindLab + " · " + bit;
    });
  }
  function areasSummaryHTML(ids) {
    var lines = areasSummaryLines(ids);
    if (!lines.length) return "";
    return '<div class="area-lines">' + lines.map(function (line) {
      return '<div class="area-line">' + escapeText(line) + "</div>";
    }).join("") + "</div>";
  }
  function wizardScreen() {
    var prefix = (state.areaPick && state.areaPick.prefix) || "create";
    if (prefix === "me-regions") return state.screen === "my-regions-all" ? "my-regions-all" : "my-regions";
    if (state.screen === "create-regions-all") return "create-regions-all";
    if (state.screen === "create-regions") return "create-regions";
    return "choose-areas";
  }
  function ensureAreaPick(prefix, returnTo) {
    if (!state.areaPick) {
      state.areaPick = { step: "state", stateId: "wa", kind: null, prefix: prefix || "create", returnTo: returnTo || "create-profile" };
    }
    if (prefix) state.areaPick.prefix = prefix;
    if (returnTo) state.areaPick.returnTo = returnTo;
    return state.areaPick;
  }
  function openAreaWizard(prefix, returnTo) {
    state.areaPick = { step: "state", stateId: "wa", kind: null, prefix: prefix, returnTo: returnTo };
    go(prefix === "me-regions" ? "my-regions" : "choose-areas");
  }
  function rememberListManual(prefix, ids, kind) {
    var pick = state.areaPick || {};
    rememberManual(prefix + ":" + (pick.stateId || "") + ":" + (kind || pick.kind || ""), ids);
  }
  function restoreListManual(prefix, fallback, kind) {
    var pick = state.areaPick || {};
    var key = prefix + ":" + (pick.stateId || "") + ":" + (kind || pick.kind || "");
    var bak = state.regionBackup && state.regionBackup[key];
    return (bak && bak.length) ? bak.slice() : (fallback || []).slice();
  }
  function areasBreadcrumb() {
    var pick = state.areaPick || {};
    var st = auState(pick.stateId);
    var html = '<div class="crumb">';
    if (pick.step === "state") {
      html += '<span class="now">State</span>';
    } else {
      html += '<button type="button" data-area-step="state">' + escapeText(st ? st.abbrev : "State") + "</button>";
    }
    html += "</div>";
    return html;
  }
  function areaStepTitle(step) {
    if (step === "list" || step === "kind") return "Choose your regions";
    return "Choose your state";
  }
  function areaStepHero(step) {
    if (step === "list" || step === "kind") return '<div class="auth-hero"><h2>Choose your regions</h2></div>';
    return '<div class="auth-hero"><h2>Choose your state or territory</h2><p>Western Australia is highlighted because this circle began in Perth — tap any state.</p></div>';
  }
  function areaGoogleG() {
    return '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
  }
  function areaTipHTML(prefix) {
    var ids = getPickedRegions(prefix);
    var groups = groupSelectedAreas(ids);
    var stateIds = {};
    groups.forEach(function (g) { stateIds[g.state.id] = true; });
    var tip = '<div class="area-tip"><span class="ic" aria-hidden="true">' + areaGoogleG() + "</span><p>Only pick the areas you really work in. Google rewards reviews from nearby customers in local search, so picking areas outside your working zone can hurt your reputation and rankings.</p></div>";
    var nudge = (ids.length >= 6 || Object.keys(stateIds).length >= 2)
      ? '<div class="area-nudge">That’s a lot of areas. Are you sure you work in all of them?</div>'
      : "";
    return tip + nudge;
  }
  function alreadyChosenHTML(prefix) {
    var ids = getPickedRegions(prefix);
    if (!ids.length) return "";
    return '<div class="areas-card" style="margin-bottom:14px"><div class="areas-card-top"><div class="areas-card-h">Already chosen</div></div>' +
      areasSummaryHTML(ids) + "</div>";
  }
  function stateStepHTML(prefix) {
    var pick = ensureAreaPick(prefix);
    var selected = pick.stateId || "wa";
    var rows = auStates().map(function (st) {
      var metro = kindCount(st, "metro");
      var regional = kindCount(st, "regional");
      var sub = regional ? (metro + " metro · " + regional + " regional") : (metro + " metro areas");
      var cls = "state-row";
      if (st.id === selected) cls += " on";
      else if (st.id === "wa") cls += " hinted";
      return '<button type="button" class="' + cls + '" data-area-state="' + st.id + '">' +
        '<span class="abbr">' + escapeText(st.abbrev) + "</span>" +
        '<span><div class="nm">' + escapeText(st.name) + '</div><div class="sub">' + escapeText(sub) + "</div></span>" +
        '<span class="chev">' + icon("chev") + "</span></button>";
    }).join("");
    return alreadyChosenHTML(prefix) + '<div class="state-list">' + rows + "</div>" +
      '<button type="button" class="btn btn-primary" style="margin-top:16px" data-action="area-next">Continue</button>';
  }
  function kindStepHTML(prefix) {
    /* v1.6.2: Metro/Regional is an accordion on the regions screen, not a step. */
    return regionListPicker(getPickedRegions(prefix), prefix);
  }
  function kindSectionHTML(st, kind, selectedIds, prefix) {
    var list = (st.regions || []).filter(function (r) { return r.type === kind; });
    if (!list.length) return "";
    var open = isAccOpen(kind);
    var n = list.length;
    var title = kindCardTitle(st, kind) + " (" + n + ")";
    var ids = list.map(function (r) { return r.id; });
    var allOn = ids.length && ids.every(function (id) { return selectedIds.indexOf(id) !== -1; });
    var nSel = ids.filter(function (id) { return selectedIds.indexOf(id) !== -1; }).length;
    var label = selectAllLabel(st, kind);
    var subOn = allOn ? "Every area in this list is selected. Turn this off to go back to your own picks." : "Select every area in this list at once.";
    var toggle = '<button type="button" class="join-all' + (allOn ? " on" : "") + '" data-action="join-all-metro" data-kind="' + kind + '" data-prefix="' + prefix + '" aria-pressed="' + (allOn ? "true" : "false") + '">' +
      '<span class="join-all-txt"><strong>' + escapeText(label) + '</strong><span class="join-all-sub">' + subOn +
      "</span></span><span class=\"toggle" + (allOn ? " on" : "") + '" aria-hidden="true"></span></button>';
    var grid = '<div class="region-sec"><div class="region-grid">' + list.map(function (r) {
      var on = selectedIds.indexOf(r.id) !== -1;
      return '<button type="button" class="region-chip' + (on ? " on" : "") + '" data-region="' + r.id + '" data-prefix="' + prefix + '">' +
        "<span class=\"lbl\"><span class=\"n\">" + escapeText(r.name) + "</span></span>" +
        '<span class="tick" aria-hidden="true">' + icon("check") + "</span></button>";
    }).join("") + "</div></div>";
    var sel = nSel ? (nSel + " selected") : "";
    return '<div class="acc ' + kind + (open ? " open" : "") + '">' +
      '<button type="button" class="acc-h ' + kind + '" data-area-acc="' + kind + '" aria-expanded="' + (open ? "true" : "false") + '">' +
        '<span class="acc-lab">' + (kind === "metro" ? "Metro" : "Regional") + "</span>" +
        '<span><span class="nm">' + escapeText(title) + "</span>" + (sel ? '<span class="acc-sel">' + sel + "</span>" : "") + "</span>" +
        '<span class="acc-chev">' + icon("chev") + "</span></button>" +
      (open ? ('<div class="acc-body">' + toggle + grid + "</div>") : "") +
      "</div>";
  }
  function regionListPicker(selectedIds, prefix) {
    selectedIds = selectedIds || [];
    var pick = ensureAreaPick(prefix);
    if (pick.step === "kind") pick.step = "list";
    ensureAccOpen(pick);
    var st = auState(pick.stateId || "wa");
    if (!st) return stateStepHTML(prefix);
    var kinds = ["metro", "regional"].filter(function (k) { return kindCount(st, k); });
    var sections = kinds.map(function (k) { return kindSectionHTML(st, k, selectedIds, prefix); }).join("");
    var addMore = '<button type="button" class="btn btn-ghost ink" style="margin-top:8px" data-area-step="state">Add areas in another state</button>';
    return areaTipHTML(prefix) + alreadyChosenHTML(prefix) + sections + addMore;
  }
  function areaWizardHTML(prefix) {
    prefix = prefix || ((state.areaPick && state.areaPick.prefix) || "create");
    var pick = ensureAreaPick(prefix);
    var step = pick.step || "state";
    var body = (step === "list" || step === "kind") ? regionListPicker(getPickedRegions(prefix), prefix) : stateStepHTML(prefix);
    return areasBreadcrumb() + areaStepHero(step) + body;
  }
  function renderChooseAreas() {
    var pick = ensureAreaPick();
    var prefix = pick.prefix || "create";
    var title = areaStepTitle(pick.step || "state");
    var right = '<span class="header-spacer"></span>';
    var bottom = "";
    if ((pick.step || "state") === "state") {
      right = '<button type="button" class="header-link" data-action="area-next">Continue</button>';
    } else if (pick.step === "list" || pick.step === "kind") {
      bottom = '<div class="area-done-bar"><button type="button" class="btn btn-primary" data-action="area-done">Done</button></div>';
    }
    return '<section class="screen has-header" data-screen="choose-areas">' +
      '<div class="app-header"><button class="icon-btn" data-action="area-back" aria-label="Back">' + icon("back") + '</button><div class="ht">' + title + "</div>" + right + "</div>" +
      '<div class="scroll">' + areaWizardHTML(prefix) + "</div>" + bottom + "</section>";
  }
  function areaAdvanceFromState() {
    var pick = ensureAreaPick();
    var st = auState(pick.stateId || "wa");
    if (!st) { pick.stateId = "wa"; st = auState("wa"); }
    pick.step = "list";
    pick.kind = (st && st.id === "act") ? "metro" : null;
    ensureAccOpen(pick);
    pick.open.metro = true;
    pick.open.regional = false;
  }
  function handleAreaBack() {
    var pick = ensureAreaPick();
    if (pick.step === "list" || pick.step === "kind") {
      pick.step = "state";
      go(wizardScreen());
      return;
    }
    go(pick.returnTo || "create-profile");
  }
  function handleAreaDone() {
    var pick = ensureAreaPick();
    var prefix = pick.prefix || "create";
    var ids = getPickedRegions(prefix);
    if (!ids.length) { toast("Select at least one region."); return; }
    setPickedRegions(prefix, ids);
    if (prefix === "create") {
      state.stepRegions = ids.slice();
      if (state.draft) state.draft.regions = ids.slice();
    }
    if (prefix === "me-regions") toast("My areas were saved.");
    go(pick.returnTo || "create-profile");
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
    if (window.TC21 && TC21.avatar) return TC21.avatar(m, size);
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
        return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r + '" fill="' + (i === 0 ? "#1A5FD4" : "#E8EEF4") + '"/>';
      }).join("");
      return '<svg width="54" height="54" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="22" stroke="#1A5FD4" stroke-width="2.2" opacity="0.9"/><circle cx="32" cy="32" r="3.2" fill="#1A5FD4"/>' + dots + "</svg>";
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
      m.regions.map(function (r) { return '<span class="pill r-pill">' + formatRegionPill(r) + "</span>"; }).join("") +
      '</div></div></button>' +
      '<a class="friend-btn" href="' + escapeAttr(m.facebook) + '" target="_blank" rel="noopener noreferrer">' +
      icon("fb") + "<span>Add friend</span></a></div>";
  }



  function businessGroups() {
    return (window.TC_BUSINESS_CATEGORIES && TC_BUSINESS_CATEGORIES.groups) || [];
  }
  function canonicalTrade(name) {
    var key = String(name || "").toLowerCase().trim();
    var map = window.TC_TRADE_ALIASES || {};
    var a;
    for (a in map) if (a.toLowerCase() === key) return map[a];
    return String(name || "").trim();
  }
  function tradeTextScore(text, q) {
    text = String(text || "").toLowerCase();
    if (!q) return 1;
    var words, i, w, best = 0;
    if (text === q) best = 100;
    else if (text.indexOf(q) === 0) best = 90;
    else {
      words = text.split(/[^a-z0-9&+]+/).filter(Boolean);
      for (i = 0; i < words.length; i++) {
        w = words[i];
        if (w === q) best = Math.max(best, 80);
        else if (w.indexOf(q) === 0) best = Math.max(best, 70);
        else if (q.length >= 4 && w.length >= q.length + 3 && w.slice(-q.length) === q) best = Math.max(best, 50); /* bookstore */
      }
    }
    if (best && text.length) best += Math.round(10 * Math.min(1, q.length / text.length));
    return best;
  }
  function matchTradeSuggestions(q) {
    q = String(q || "").toLowerCase().trim();
    var out = [];
    var seen = {};
    function add(label, value, score) {
      var k = String(label || "").toLowerCase();
      if (!k || seen[k]) return;
      seen[k] = true;
      out.push({ label: label, value: value || label, score: score || 0 });
    }
    var groups = businessGroups();
    if (groups.length) {
      groups.forEach(function (g) {
        (g.items || []).forEach(function (it) {
          var name = it.name;
          var aliases = it.aliases || [];
          if (!q) { add(name, name, 1); return; }
          var nameScore = tradeTextScore(name, q);
          var bestAlias = 0, bestAliasText = "";
          aliases.forEach(function (a) {
            var sc = tradeTextScore(a, q);
            if (sc > bestAlias) { bestAlias = sc; bestAliasText = a; }
          });
          if (nameScore) add(name, name, nameScore);
          if (bestAlias && bestAliasText.toLowerCase() !== name.toLowerCase()) add(bestAliasText, name, bestAlias);
        });
      });
      out.sort(function (a, b) { return (b.score - a.score) || String(a.label).localeCompare(String(b.label)); });
      return out;
    }
    var list = TRADES.slice();
    if (!q) return list.map(function (tr) { return { label: tr, value: tr }; });
    return list.filter(function (tr) { return tr.toLowerCase().indexOf(q) !== -1; })
      .map(function (tr) { return { label: tr, value: tr }; });
  }
  function matchTrades(q) {
    var seen = {};
    return matchTradeSuggestions(q).map(function (s) { return s.value; }).filter(function (n) {
      var k = n.toLowerCase();
      if (seen[k]) return false;
      seen[k] = true;
      return true;
    });
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
    var people = withMembers ? matchPeople(q) : [];
    if (!String(q || "").trim()) {
      if (!withMembers) {
        var popular = ["Hairdresser", "Barber", "Cafe", "Plumber", "Electrician", "Mechanic", "Dentist", "Beauty Salon", "Cleaner", "Personal Trainer", "Carpenter", "Restaurant"];
        var starter = popular.filter(function (n) { return TRADES.indexOf(n) !== -1; }).slice(0, 12);
        if (starter.length < 8) starter = TRADES.slice(0, 12);
        return '<div class="ac-group">Trades &amp; businesses</div>' + starter.map(function (tr) {
          return '<button type="button" class="ac-item" data-ac-trade="' + escapeAttr(tr) + '"><span>' + escapeText(tr) + "</span></button>";
        }).join("") + (TRADES.length > 12 ? '<div class="ac-empty">Type to search all ' + TRADES.length + " trades and businesses</div>" : "");
      }
      return "";
    }
    var sugg = matchTradeSuggestions(q).slice(0, 12);
    if (!sugg.length && !people.length) return '<div class="ac-empty">No matches for “' + escapeText(q) + '”</div>';
    var html = "";
    if (sugg.length) {
      html += '<div class="ac-group">Trades &amp; businesses</div>' + sugg.map(function (tr) {
        var label = tr.label || tr;
        var value = tr.value || tr;
        var kind = label === value ? "Type" : "Also called";
        return '<button type="button" class="ac-item" data-ac-trade="' + escapeAttr(value) + '"><span>' + escapeText(label) + (label !== value ? '<span class="sub"> · ' + escapeText(value) + "</span>" : "") + '</span><span class="ac-kind">' + kind + "</span></button>";
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
    return allPerthMetroIds();
  }
  function isAllMetro(ids) {
    var all = allPerthMetroIds();
    if (!ids || ids.length !== all.length) return false;
    return all.every(function (id) { return ids.indexOf(id) !== -1; });
  }
  function rememberManual(key, ids) {
    if (!state.regionBackup) state.regionBackup = {};
    state.regionBackup[key] = (ids || []).slice();
  }
  function restoreManual(key) {
    var ids = state.regionBackup && state.regionBackup[key];
    return ids && ids.length ? ids.slice() : [];
  }
  function getPickedRegions(prefix) {
    if (prefix === "create") return (state.stepRegions || []).slice();
    if (prefix === "me-regions") return (me().regions || []).slice();
    var d = draftFromMe();
    return (d.regions || []).slice();
  }
  function setPickedRegions(prefix, ids) {
    ids = (ids || []).slice();
    var onWizard = state.screen === "choose-areas" || state.screen === "create-regions" || state.screen === "create-regions-all" || state.screen === "my-regions" || state.screen === "my-regions-all";
    if (prefix === "create") {
      state.stepRegions = ids;
      if (state.draft) state.draft.regions = ids.slice();
      if (onWizard) return wizardScreen();
      if (state.screen === "create-profile" || state.screen === "create-profile-connected" || state.screen === "signup-business") {
        return state.screen;
      }
      return isAllMetro(ids) && state.screen === "create-regions-all" ? "create-regions-all" : "create-regions";
    }
    if (prefix === "me-regions") {
      me().regions = ids;
      if (state.draft) state.draft.regions = ids.slice();
      if (onWizard) return wizardScreen();
      return isAllMetro(ids) && state.screen === "my-regions-all" ? "my-regions-all" : "my-regions";
    }
    var d = draftFromMe();
    d.regions = ids;
    state.draft = d;
    if (onWizard) return wizardScreen();
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
    if (state.areaPick && (state.areaPick.step === "list" || state.areaPick.step === "kind")) {
      var hitT = auRegionById(rid);
      var kindT = hitT ? hitT.region.type : "metro";
      rememberListManual(prefix, cur.filter(function (id) { return currentListIds(kindT).indexOf(id) !== -1; }), kindT);
    }
    return cur;
  }
  function joinAllMetro(prefix, kind) {
    var cur = getPickedRegions(prefix);
    var onWizard = state.screen === "choose-areas" || state.screen === "create-regions" || state.screen === "create-regions-all" || state.screen === "my-regions" || state.screen === "my-regions-all";
    if (onWizard && state.areaPick && (state.areaPick.step === "list" || state.areaPick.step === "kind")) {
      kind = kind || state.areaPick.kind || "metro";
      var list = currentListIds(kind);
      var allOn = list.length && list.every(function (id) { return cur.indexOf(id) !== -1; });
      if (allOn) {
        var restored = restoreListManual(prefix, [], kind);
        var next = cur.filter(function (id) { return list.indexOf(id) === -1; });
        restored.forEach(function (id) { if (next.indexOf(id) === -1 && list.indexOf(id) !== -1) next.push(id); });
        if (!next.length) {
          var kept = cur.filter(function (id) { return list.indexOf(id) !== -1; }).slice(0, 1);
          return cur.filter(function (id) { return list.indexOf(id) === -1; }).concat(kept);
        }
        return next;
      }
      rememberListManual(prefix, cur.filter(function (id) { return list.indexOf(id) !== -1; }), kind);
      list.forEach(function (id) { if (cur.indexOf(id) === -1) cur.push(id); });
      return cur;
    }
    if (isAllMetro(cur)) return restoreManual(prefix);
    rememberManual(prefix, cur);
    return allRegionIds();
  }
  function selectedAreasCard(ids, opts) {
    opts = opts || {};
    var title = opts.title || "Your areas";
    var all = isAllMetro(ids);
    var chips = (ids || []).map(function (id) {
      return '<span class="pill r-pill">' + escapeText(formatRegionPill(id)) + "</span>";
    }).join("");
    var badge = all ? '<span class="areas-all-badge">All Perth metro</span>' : "";
    var empty = !(ids && ids.length) ? '<p class="hint" style="margin:0">No areas selected yet.</p>' : "";
    var change = "";
    if (opts.openAreas) {
      change = '<button type="button" class="link areas-change" data-action="open-areas" data-prefix="' + (opts.prefix || "create") + '" data-return="' + (opts.returnTo || "") + '">' + (opts.changeLabel || (ids && ids.length ? "Change" : "Choose areas")) + "</button>";
    } else if (opts.changeTo) {
      change = '<button type="button" class="link areas-change" data-go="' + opts.changeTo + '">' + (opts.changeLabel || "Change") + "</button>";
    }
    var sub = opts.sub ? '<p class="hint" style="margin:8px 0 0">' + opts.sub + "</p>" : "";
    var summary = (ids && ids.length) ? areasSummaryHTML(ids) : "";
    return '<div class="areas-card">' +
      '<div class="areas-card-top"><div class="areas-card-h">' + title + "</div>" + badge + change + "</div>" +
      (empty || (summary + '<div class="tags" style="margin-top:8px">' + chips + "</div>")) +
      sub + "</div>";
  }
  function regionPicker(selectedIds, prefix) {
    prefix = prefix || "create";
    var ret = prefix === "me-regions" ? "me" : (prefix === "edit" ? "edit-profile" : "create-profile");
    return selectedAreasCard(selectedIds || [], {
      title: "Your areas",
      openAreas: true,
      prefix: prefix,
      returnTo: ret,
      changeLabel: (selectedIds && selectedIds.length) ? "Change" : "Choose areas",
      sub: "Choose a state, then the metro or regional areas you work in."
    });
  }

  function draftFromMe() {
    var m = me();
    return state.draft || {
      first: m.first, last: m.last, business: m.business, trade: m.trade,
      bio: m.bio, phone: m.phone, facebook: m.facebook, page: m.page,
      abn: m.abn || "", email: m.email || "", tagline: m.tagline || "",
      links: (window.TCLinks ? TCLinks.fromMember(m) : (m.links || {})),
      profile: (window.TCProfile ? TCProfile.fromMember(m) : (m.profile || {})),
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
      facebook: fd.get("facebook") || current.facebook || "",
      page: fd.get("page") || current.page || "",
      abn: (fd.get("abn") != null ? String(fd.get("abn") || "").trim() : (current.abn || "")),
      email: (fd.get("email") != null ? String(fd.get("email") || "").trim() : (current.email || "")),
      tagline: (fd.get("tagline") != null ? String(fd.get("tagline") || "").trim() : (current.tagline || "")),
      links: (window.TCLinks ? TCLinks.collect(form, current.links || current) : (current.links || {})),
      profile: (window.TCProfile ? TCProfile.collect(form, current.profile || current) : (current.profile || {})),
      regions: (current.regions || me().regions || []).slice()
    };
  }

  function applyDraftToMe() {
    var d = draftFromMe();
    var m = me();
    m.first = d.first; m.last = d.last; m.business = d.business; m.trade = d.trade;
    m.bio = d.bio; m.phone = d.phone; m.facebook = d.facebook; m.page = d.page;
    m.abn = d.abn || m.abn || ""; m.email = d.email || m.email || ""; m.tagline = d.tagline || m.tagline || "";
    if (window.TCLinks) TCLinks.applyToMember(m, d.links || d);
    if (window.TCProfile) TCProfile.applyToMember(m, d.profile || d);
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

  function signupSteps(n, total) {
    total = total || 3;
    var bits = [];
    for (var i = 1; i <= total; i++) bits.push('<span' + (i <= n ? ' class="on"' : "") + "></span>");
    return '<div class="steps signup-steps" aria-label="Step ' + n + " of " + total + '">' + bits.join("") +
      '</div><p class="step-lab">Step ' + n + " of " + total + "</p>";
  }

  function renderWelcome() {
    var slides = [
      { img: "assets/welcome/slide-1.jpg", title: "Your local circle", copy: "Join the businesses around you." },
      { img: "assets/welcome/slide-2.jpg", title: "Help a buddy get hired", copy: "Recommend someone you actually know." },
      { img: "assets/welcome/slide-3.jpg", title: "Reviews that sound like you", copy: "Ideas only. You write the real words." },
      { img: "assets/welcome/slide-4.jpg", title: "Work where you work", copy: "Pick your areas and meet nearby trades." }
    ];
    var slideHtml = slides.map(function (s, i) {
      return '<article class="w20-slide" data-slide="' + i + '">' +
        '<div class="w20-hero"><img src="' + s.img + '" alt="" draggable="false"></div>' +
        "<h1>" + s.title + "</h1><p>" + s.copy + "</p></article>";
    }).join("");
    var dots = slides.map(function (_, i) {
      return '<button type="button" data-action="welcome-dot" data-index="' + i + '" aria-label="Slide ' + (i + 1) + '"' + (i === 0 ? ' class="on"' : "") + "></button>";
    }).join("");
    var actions = '<button class="btn btn-fb" data-action="fb-connect" data-next="signup-name">' + icon("fb") + " Continue with Facebook</button>" +
      '<div class="or-line light"><span>or</span></div>' +
      '<button class="btn btn-navy has-ico" data-go="signup">' + icon("user") + "<span>Create account</span></button>" +
      '<button class="btn btn-ghost has-ico" data-go="signin">' + icon("user") + "<span>Sign in</span></button>";
    return '<section class="screen dark welcome-v20" id="screen-welcome" data-screen="welcome">' +
      '<div class="w20-top"><div class="w20-brand">' +
      '<img class="brand-mark" src="assets/logo/rank-buddies-mark.png" alt="">' +
      '<div class="brand-wordmark">RATE <span class="w-buddies">BUDDIES</span></div></div>' +
      '<button type="button" class="w20-skip" data-action="welcome-skip">Skip</button></div>' +
      '<div class="w20-carousel"><div class="w20-track" id="welcomeTrack">' + slideHtml + "</div></div>" +
      '<div class="w20-dots" id="welcomeDots">' + dots + "</div>" +
      '<div class="w20-foot" id="welcomeFoot">' +
      '<button type="button" class="btn btn-primary w20-next" data-action="welcome-next">Next</button>' +
      '<div class="w20-actions" id="welcomeActions" hidden>' + actions + "</div>" +
      "</div></section>";
  }

  function renderSignIn() {
    return '<section class="screen has-header" data-screen="signin">' +
      '<div class="app-header"><button class="icon-btn" data-go="welcome" aria-label="Back">' + icon("back") + '</button><div class="ht">Sign in</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="auth-lockup">' +
      '<img class="brand-mark" src="assets/logo/rank-buddies-mark.png" alt="">' +
      '<div class="brand-wordmark">RATE <span class="w-buddies">BUDDIES</span></div>' +
      '</div>' +
      '<div class="auth-hero"><h2>Welcome back</h2><p>Sign in to see members in your areas.</p></div>' +
      '<form data-form="signin">' +
      '<div class="field"><label>Email</label><input type="email" name="email" placeholder="you@example.com" value="" autocomplete="username"></div>' +
      '<div class="field"><label>Password</label><input type="password" name="password" placeholder="Your password" value="" autocomplete="current-password"></div>' +
      '<button class="btn btn-primary has-ico" type="submit" style="margin-top:8px">' + icon("check") + "<span>Sign in</span></button></form>" +
      '<p class="hint" style="text-align:center;margin-top:14px">Sign in with your Rate Buddies test account. Turn on Demo (offline) to browse the sample screens without a login.</p>' +
      '<label class="rb-demo-toggle"><input type="checkbox" data-action="rb-demo"' + ((window.RB && RB.isDemo()) ? " checked" : "") + '> Demo (offline)</label>' +
      '<div class="auth-bottom">New here? <a class="link" data-go="signup" href="#signup">Create an account</a></div></div></section>';
  }

  function renderSignUp() {
    var method = state.signupMethod || (state.screen === "signup-email" ? "email" : state.screen === "signup-phone" ? "phone" : "");
    var screenId = state.screen === "signup-email" || state.screen === "signup-phone" ? state.screen : "signup";
    var d = draftFromMe();
    var body;
    if (method === "email") {
      body = '<div class="auth-hero"><h2>Continue with email</h2><p>Use an email and a password. This is a prototype — nothing is sent to a real inbox.</p></div>' +
        '<form data-form="signup-email">' +
        '<div class="field"><label>Email</label><input type="email" name="email" placeholder="you@example.com" value="' + escapeAttr(d.email || "") + '" required autocomplete="email"></div>' +
        '<div class="field"><label>Password</label><input type="password" name="password" placeholder="At least 8 characters" required autocomplete="new-password"></div>' +
        '<button class="btn btn-primary has-ico" type="submit" style="margin-top:8px">' + icon("chev") + "<span>Continue</span></button></form>" +
        '<button type="button" class="btn btn-ghost ink" data-action="signup-method" data-method="" style="margin-top:10px">Back to options</button>';
    } else if (method === "phone") {
      body = '<div class="auth-hero"><h2>Continue with your phone</h2><p>We will send a one-time code. This is a prototype — no SMS is really sent.</p></div>' +
        '<form data-form="signup-phone">' +
        '<div class="field"><label>Phone number</label><input name="phone" inputmode="tel" placeholder="Mobile number" value="' + escapeAttr(d.phone || "") + '" required autocomplete="tel"></div>' +
        (state.otpSent
          ? '<div class="field"><label>One-time code</label><input name="otp" inputmode="numeric" placeholder="6-digit code" value="482913" required><p class="hint">Prototype code: 482913. Use this to continue.</p></div>' +
            '<button class="btn btn-primary has-ico" type="submit" style="margin-top:8px">' + icon("check") + "<span>Verify and continue</span></button>"
          : '<button class="btn btn-primary has-ico" type="button" data-action="send-otp" style="margin-top:8px">' + icon("phone") + "<span>Send code</span></button>") +
        "</form>" +
        '<button type="button" class="btn btn-ghost ink" data-action="signup-method" data-method="" style="margin-top:10px">Back to options</button>';
    } else {
      body = '<div class="auth-hero"><h2>Join the circle</h2><p>Start with Facebook, email or your phone number. First and last name come next, then your business and areas.</p></div>' +
        '<button type="button" class="btn btn-fb" data-action="fb-connect" data-next="signup-name">' + icon("fb") + " Continue with Facebook</button>" +
        '<div class="or-line"><span>or</span></div>' +
        '<button type="button" class="btn btn-primary has-ico" data-action="signup-method" data-method="email">' + icon("user") + "<span>Continue with email</span></button>" +
        '<button type="button" class="btn btn-ghost ink has-ico" data-action="signup-method" data-method="phone" style="margin-top:10px">' + icon("phone") + "<span>Continue with phone number</span></button>";
    }
    return '<section class="screen has-header" data-screen="' + screenId + '">' +
      '<div class="app-header"><button class="icon-btn" data-go="welcome" aria-label="Back">' + icon("back") + '</button><div class="ht">Create account</div><span class="header-spacer"></span></div>' +
      '<div class="scroll">' + signupSteps(1) + body +
      '<div class="auth-bottom">Already have an account? <a class="link" data-go="signin" href="#signin">Sign in</a></div></div></section>';
  }

  function renderSignupName() {
    var d = draftFromMe();
    var note = state.fbConnected
      ? "We have filled these from Facebook. You can change them."
      : "Use the name other members should see.";
    return '<section class="screen has-header" data-screen="signup-name">' +
      '<div class="app-header"><button class="icon-btn" data-go="signup" aria-label="Back">' + icon("back") + '</button><div class="ht">Your name</div><span class="header-spacer"></span></div>' +
      '<div class="scroll">' + signupSteps(2) +
      '<div class="auth-hero"><h2>What is your name?</h2><p>' + note + "</p></div>" +
      '<form data-form="signup-name">' +
      '<div class="name-row"><div class="field"><label>First name</label><input name="first" placeholder="Jamie" value="' + escapeAttr(d.first || "") + '" required autocomplete="given-name"></div>' +
      '<div class="field"><label>Last name</label><input name="last" placeholder="Hale" value="' + escapeAttr(d.last || "") + '" required autocomplete="family-name"></div></div>' +
      '<button class="btn btn-primary has-ico" type="submit" style="margin-top:8px">' + icon("chev") + "<span>Continue</span></button></form></div></section>";
  }

  function renderCreateProfile() {
    var d = draftFromMe();
    var selected = state.stepRegions || d.regions || [];
    state.stepRegions = selected.slice();
    var count = selected.length ? (selected.length + " region" + (selected.length > 1 ? "s" : "") + " selected") : "Select at least one region";
    return '<section class="screen has-header" data-screen="create-profile">' +
      '<div class="app-header"><button class="icon-btn" data-go="signup-name" aria-label="Back">' + icon("back") + '</button><div class="ht">Business and areas</div><span class="header-spacer"></span></div>' +
      '<div class="scroll">' + signupSteps(3) +
      '<div class="auth-hero"><h2>Business details and areas</h2><p>Tell the circle what you do and where you work, then send your profile for approval.</p></div>' +
      '<form data-form="signup-business">' +
      '<div class="field"><label>Business name</label><input name="business" placeholder="Your business name" value="' + escapeAttr(d.business || "") + '" required></div>' +
      '<div class="field"><label>Trade or business type</label><div class="search-wrap"><div class="search">' + icon("search") + '<input id="tradeType" type="text" placeholder="Choose your profession" value="' + escapeAttr(d.trade || "") + '" autocomplete="off"></div><div id="tradeAc" class="ac-drop" hidden></div></div><p class="hint">Suggestions appear as you type from the full list of Australian businesses. <button type="button" class="link" data-open-trades="1">See all</button></p></div>' +
      '<div class="field"><label>ABN <span class="opt">(optional)</span></label><input name="abn" inputmode="numeric" placeholder="Optional" value="' + escapeAttr(d.abn || "") + '"></div>' +
      '<div class="field"><label>Business phone</label><input name="phone" inputmode="tel" placeholder="Mobile number" value="' + escapeAttr(d.phone || "") + '"></div>' +
      '<p class="group-label">Your areas</p>' +
      selectedAreasCard(selected, { title: "Your areas", openAreas: true, prefix: "create", returnTo: "create-profile", changeLabel: selected.length ? "Change" : "Choose areas", sub: "Choose a state, then the metro or regional areas you work in." }) +
      '<p class="selected-count">' + count + "</p>" +
      '<button class="btn btn-primary has-ico" type="button" data-action="finish-create">' + icon("check") + "<span>Send for approval</span></button>" +
      '<p class="hint" style="text-align:center;margin-top:12px">New members wait for a super admin to approve their profile before they appear in the circle. You can add a bio, links and more after you are approved.</p></form></div></section>';
  }

  function renderCreateRegions() {
    return renderChooseAreas();
  }

  function renderPending() {
    var d = draftFromMe();
    var who = escapeText((d.first || "Jamie") + (d.last ? " " + d.last : ""));
    var bits = "Name: " + who + "<br>Trade: " + escapeText(d.trade || "To be added");
    if (d.business) bits += "<br>Business: " + escapeText(d.business);
    if (d.abn) bits += "<br>ABN: " + escapeText(d.abn);
    return '<section class="screen has-header" data-screen="pending">' +
      '<div class="app-header"><button class="icon-btn" data-go="create-profile" aria-label="Back">' + icon("back") + '</button><div class="ht">Awaiting approval</div><span class="header-spacer"></span></div>' +
      '<div class="scroll">' +
      '<div class="pending-art">' + icon("check") + "</div>" +
      '<div class="auth-hero" style="text-align:center"><h2>Thanks, ' + escapeText(d.first || "Jamie") + ". We are reviewing your profile.</h2>" +
      "<p>Your profile stays hidden until a Rate Buddies admin approves it. You will get a notification when you are in. This usually takes a day.</p></div>" +
      '<div class="areas-card"><div class="areas-card-h">Submitted</div>' +
      '<p class="hint" style="margin:0">' + bits + "</p></div>" +
      '<button class="btn btn-primary has-ico" type="button" data-action="simulate-approval" style="margin-top:16px">' + icon("check") + "<span>Demo: simulate approval</span></button>" +
      '<p class="hint" style="text-align:center;margin-top:10px">In the real app a super admin approves new members from the admin dashboard. This button is only here so you can try the next step.</p></div></section>';
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
      m.regions.map(function (r) { return '<span class="pill r-pill">' + formatRegionPill(r) + "</span>"; }).join("") +
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
      m.regions.map(function (r) { return '<span class="pill r-pill">' + formatRegionPill(r) + "</span>"; }).join("") +
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
      '<div class="field"><label>Trade or business type</label><div class="search-wrap"><div class="search">' + icon("search") + '<input id="tradeType" type="text" placeholder="Choose your profession" value="' + escapeAttr(d.trade || "") + '" autocomplete="off"></div><div id="tradeAc" class="ac-drop" hidden></div></div><p class="hint">Suggestions appear as you type from the full list of Australian businesses. <button type="button" class="link" data-open-trades="1">See all</button></p></div>' +
      '<div class="field"><label>Short bio</label><textarea name="bio" rows="3">' + escapeText(d.bio) + "</textarea></div>" +
      '<div class="field"><label>Phone <span class="opt">(optional)</span></label><input name="phone" value="' + escapeAttr(d.phone || "") + '"></div>' +
      '<div class="group-label">Facebook profile</div>' +
      fbConnectBlock("edit-profile", d.facebook || "") +
      '<div class="group-label">My areas</div>' + selectedAreasCard(d.regions || [], { title: "My areas", openAreas: true, prefix: "edit", returnTo: "edit-profile", changeLabel: (d.regions && d.regions.length) ? "Change" : "Choose areas", sub: "Choose a state, then the metro or regional areas you work in." }) +
      '<button class="btn btn-primary has-ico" type="submit" style="margin-top:8px">' + icon("check") + "<span>Save changes</span></button></form></div></section>";
  }

  function renderSettings() {
    if (window.TC12 && TC12.renderSettings) return TC12.renderSettings();
    var m = me();
    return '<section class="screen has-tabs has-header" data-screen="settings">' +
      '<div class="app-header"><span class="header-spacer"></span><div class="ht">Settings</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><p class="group-label">Account</p><div class="card group">' +
      '<button class="set-row" data-go="me"><span class="ic" style="background:#E8F1FD;color:#0D3F9C">' + icon("pin") + '</span><span class="lab"><span class="a">View my profile</span><span class="b">' + escapeText(fullName(m)) + " · " + escapeText(m.trade) + '</span></span><span class="chev">' + icon("chev") + "</span></button>" +
      '<button class="set-row" data-go="edit-profile"><span class="ic" style="background:#EEF2F6;color:#14314C">' + icon("pencil") + '</span><span class="lab"><span class="a">Edit profile and regions</span><span class="b">Name, trade, Facebook links, areas</span></span><span class="chev">' + icon("chev") + "</span></button>" +
      (state.fbConnected
        ? '<button class="set-row" type="button" data-go="edit-profile"><span class="ic" style="background:#E8F1FD;color:#1877F2">' + icon("fb") + '</span><span class="lab"><span class="a">Facebook: Connected</span><span class="b">' + escapeText(String(m.facebook || demoFbLink()).replace("https://www.", "")) + '</span></span><span class="chev">' + icon("chev") + "</span></button>"
        : '<button class="set-row" type="button" data-action="fb-connect" data-next="settings"><span class="ic" style="background:#E8F1FD;color:#1877F2">' + icon("fb") + '</span><span class="lab"><span class="a">Connect Facebook</span><span class="b">One tap to add your profile link</span></span><span class="chev">' + icon("chev") + "</span></button>") +
      '</div><p class="group-label">Preferences</p><div class="card group">' +
      '<button class="set-row" data-action="toggle-notify"><span class="ic" style="background:#FFF6E0;color:#8A5A00">' + icon("bell") + '</span><span class="lab"><span class="a">New member alerts</span><span class="b">A simple on/off for a later build</span></span><span class="toggle' + (state.notify ? " on" : "") + '" id="notifyToggle"></span></button>' +
      '</div><p class="group-label">How the circle works</p>' +
      '<div class="card group" style="padding:12px 14px"><p style="font-size:14px;font-weight:600;line-height:1.5;color:var(--text)">Only recommend members you have actually met or worked with, and say so in your comment. Weekly catch-ups are organised in person, not in this app.</p></div>' +
      '<p class="group-label">About</p><div class="card group">' +
      '<div class="set-row"><span class="lab"><span class="a">App name</span><span class="b">Rate Buddies</span></span></div>' +
      '<div class="set-row"><span class="lab"><span class="a">Version</span><span class="b">Rate Buddies v2.1.2 · 20 Nov 2026</span></span></div></div>' +
      '<button class="btn btn-ghost ink" data-go="welcome" style="margin-top:14px;color:var(--danger);border-color:#F3C4C4">Sign out</button>' +
      '<p class="settings-foot" style="padding-top:12px">Fictional demo data only.</p></div></section>';
  }


  function screenHTML(id) {
    switch (id) {
      case "welcome": return renderWelcome();
      case "signin": return renderSignIn();
      case "signup":
      case "signup-email":
      case "signup-phone":
        return renderSignUp();
      case "signup-name":
        return renderSignupName();
      case "create-profile":
      case "create-profile-connected":
      case "signup-business":
        return renderCreateProfile();
      case "complete-profile":
        return (window.TC158 && TC158.renderComplete) ? TC158.renderComplete() : renderPending();
      case "fb-consent":
        return renderWelcome();
      case "choose-areas":
      case "create-regions":
      case "create-regions-all":
        return renderChooseAreas();
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
    var signupStart = { signup: 1, "signup-email": 1, "signup-phone": 1, "signup-name": 1, "fb-consent": 1 };
    if (signupStart[id] && !state.draft) {
      state.draft = { first: "", last: "", business: "", trade: "", bio: "", phone: "", facebook: "", page: "", abn: "", email: "", regions: [], links: {}, profile: {} };
      state.stepRegions = [];
    }
    if (id === "create-profile" && !state.draft) {
      state.draft = { first: "", last: "", business: "", trade: "", bio: "", phone: "", facebook: "", page: "", links: (window.TCLinks ? TCLinks.empty() : {}), profile: (window.TCProfile ? TCProfile.empty() : {}), regions: [] };
      state.stepRegions = [];
    }
    if (id === "edit-profile") state.draft = draftFromMe();
    if (id === "create-regions" && !state.stepRegions) {
      state.stepRegions = ((state.draft && state.draft.regions) || []).slice();
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
    if (id === "choose-areas" || id === "create-regions" || id === "create-regions-all") {
      if (!state.areaPick) {
        var pref = state.screen === "edit-profile" ? "edit" : "create";
        var ret = pref === "edit" ? "edit-profile" : "create-profile";
        state.areaPick = { step: "state", stateId: "wa", kind: null, prefix: pref, returnTo: ret };
      }
      if (state.areaPick && state.areaPick.step === "kind") state.areaPick.step = "list";
      if (id === "create-regions") {
        state.areaPick.step = "list";
        state.areaPick.stateId = state.areaPick.stateId || "wa";
        state.areaPick.kind = null;
        if (!state.areaPick.open) state.areaPick.open = { metro: true, regional: false };
        state.areaPick.prefix = state.areaPick.prefix || "create";
      }
      if (id === "create-regions-all") {
        state.areaPick.step = "list";
        state.areaPick.stateId = state.areaPick.stateId || "wa";
        state.areaPick.kind = null;
        if (!state.areaPick.open) state.areaPick.open = { metro: true, regional: false };
        state.areaPick.prefix = "create";
      }
    }
    if (id === "my-regions" || id === "my-regions-all") {
      if (!state.areaPick || state.areaPick.prefix !== "me-regions") {
        state.areaPick = { step: "state", stateId: "wa", kind: null, prefix: "me-regions", returnTo: "me", open: { metro: true, regional: false } };
      }
      if (id === "my-regions-all") {
        state.areaPick.step = "list";
        state.areaPick.stateId = "wa";
        state.areaPick.kind = null;
        state.areaPick.open = { metro: true, regional: false };
      }
    }

    var keepScroll = (opts.keepScroll === true) || (opts.keepScroll !== false && id === state.screen);
    var prevScroll = screensEl && screensEl.querySelector(".screen.active .scroll, .scroll");
    var savedScroll = (keepScroll && prevScroll) ? prevScroll.scrollTop : 0;

    state.screen = id;
    screensEl.innerHTML = screenHTML(id);
    var sc = screensEl.querySelector(".screen");
    if (sc) sc.classList.add("active");
    if (keepScroll && savedScroll) {
      var nextScroll = screensEl.querySelector(".scroll");
      if (nextScroll) nextScroll.scrollTop = savedScroll;
    }

    var showTabs = TABBED.has(id);
    tabbar.classList.toggle("show", showTabs);
    updateTabs(id);
    statusBar.classList.toggle("light", DARK.has(id) || id === "welcome");
    var item = CHOOSER.find(function (c) { return c.id === id; });
    $("#deviceCaption").textContent = item ? item.title : "Rate Buddies";
    chooserList.querySelectorAll(".chooser-item").forEach(function (b) {
      b.classList.toggle("active", b.dataset.id === id);
    });
    setHash(id);
    bindScreen();
    if (id === "fb-consent") openFbSheet("create-profile");
    if (window.TC12 && TC12.afterGo) TC12.afterGo(id);
    if (window.TC20 && TC20.afterGo) TC20.afterGo(id);
  }

  
  function drawerIsOpen() {
    var d = document.getElementById("appDrawer");
    return !!(d && d.classList.contains("open"));
  }
  function updateTabs(id) {
    id = id || (state && state.screen) || "";
    var drawerOpen = false;
    var moreScreens = {
      "more": 1, "me": 1, "settings": 1, "edit-profile": 1, "my-regions": 1, "my-regions-all": 1,
      "subscription": 1, "invite": 1, "help": 1, "ai-assistant": 1, "ai-voice": 1,
      "rec-alerts": 1, "rec-compose": 1, "rec-alert": 1, "notifications": 1,
      "notif-settings": 1, "drawer": 1, "google-consent": 1, "tutorials": 1, "tutorial-play": 1
    };
    tabbar.querySelectorAll(".tab").forEach(function (el) {
      var tab = el.dataset.tab;
      var on = false;
      if (drawerOpen) {
        on = tab === "more";
      } else if (tab === "home") {
        on = id === "home";
      } else if (tab === "reviews") {
        on = id === "reviews" || id === "reviews-back" || id === "review-ideas";
      } else if (tab === "members") {
        on = id === "members" || id === "members-all" || id === "members-filter" || id === "members-search" || id === "member" || id === "promo-queue" || id === "fb-recommend" || id === "fb-recommend-open" || id === "fb-recommend-mine" || id === "fb-recommend-done";
      } else if (tab === "more") {
        on = !!moreScreens[id];
      }
      el.classList.toggle("active", on);
    });
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
  function tradeSheetListHTML(q, current) {
    q = String(q || "").toLowerCase().trim();
    var groups = businessGroups();
    var ico = function (name) {
      return (window.TC159 && TC159.tradeIcon) ? TC159.tradeIcon(name) : "";
    };
    function matches(it) {
      if (!q) return true;
      if (tradeTextScore(it.name, q)) return true;
      return (it.aliases || []).some(function (a) { return tradeTextScore(a, q) > 0; });
    }
    function opt(tr) {
      return '<button class="trade-opt' + (tr === current ? " on" : "") + '" data-trade-pick="' + escapeAttr(tr) + '"><span class="trade-opt-lab">' + ico(tr) + "<span>" + escapeText(tr) + "</span></span><span class=\"ck\">" + icon("check") + "</span></button>";
    }
    if (groups.length) {
      var html = "";
      var any = false;
      groups.forEach(function (g) {
        var items = (g.items || []).filter(matches);
        if (!items.length) return;
        any = true;
        html += '<div class="trade-group-lab">' + escapeText(g.name) + ' <span>' + items.length + "</span></div>";
        html += items.map(function (it) { return opt(it.name); }).join("");
      });
      return any ? html : '<div class="ac-empty">No types match “' + escapeText(q) + '”</div>';
    }
    var list = matchTrades(q);
    return list.length ? list.map(opt).join("") : '<div class="ac-empty">No types match “' + escapeText(q) + '”</div>';
  }
  function openTradeSheet() {
    closeSheet();
    var current = draftFromMe().trade;
    sheetEl = document.createElement("div");
    sheetEl.className = "overlay show";
    sheetEl.innerHTML = '<div class="sheet sheet-trades"><div class="sheet-handle"></div><h3>Choose your trade or business type</h3>' +
      '<div class="search" style="margin-bottom:12px">' + icon("search") + '<input id="sheetTradeSearch" type="search" placeholder="Choose your profession" autocomplete="off"></div>' +
      '<div id="sheetTradeList">' + tradeSheetListHTML("", current) + "</div></div>";
    var sheetSearch = sheetEl.querySelector("#sheetTradeSearch");
    if (sheetSearch) {
      sheetSearch.addEventListener("input", function (e) {
        var box = sheetEl.querySelector("#sheetTradeList");
        box.innerHTML = tradeSheetListHTML(e.target.value, current);
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
    if (!d.first) {
      if (state.onboarding && state.onboarding.fresh) { d.first = "Alex"; d.last = "Reid"; }
      else { d.first = "Jamie"; d.last = "Hale"; }
    }
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
      '<div class="consent-brand"><div class="consent-f">' + icon("fb") + '</div><div><h3>Continue with Facebook</h3><p>Rate Buddies is asking for access</p></div></div>' +
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
        state.stepRegions = [];
        state.draft = { first: m.first, last: m.last, business: m.business, trade: m.trade, bio: m.bio, phone: m.phone, facebook: "", page: m.page, regions: [] };
      }
      if (id === "create-profile-connected") {
        var m2 = me();
        state.fbConnected = true;
        state.stepRegions = [];
        state.draft = { first: m2.first, last: m2.last, business: m2.business, trade: m2.trade, bio: m2.bio, phone: m2.phone, facebook: demoFbLink(), page: m2.page, regions: [] };
      }
      if (id === "edit-profile" || id === "settings" || id === "me") {
        state.fbConnected = true;
        me().facebook = me().facebook || demoFbLink();
      }
      if (id === "choose-areas" || id === "create-regions") {
        state.stepRegions = [];
        if (!state.regionBackup) state.regionBackup = {};
        state.regionBackup.create = [];
        state.areaPick = { step: id === "create-regions" ? "list" : "state", stateId: "wa", kind: null, prefix: "create", returnTo: "create-profile", open: { metro: true, regional: false } };
        var m3 = me();
        state.draft = state.draft || { first: m3.first, last: m3.last, business: m3.business, trade: m3.trade, bio: m3.bio, phone: m3.phone, facebook: "", page: m3.page, regions: [] };
        state.draft.regions = [];
      }
      if (id === "create-regions-all") {
        if (!state.regionBackup) state.regionBackup = {};
        state.regionBackup.create = ["hills", "north"];
        state.stepRegions = allRegionIds();
        state.areaPick = { step: "list", stateId: "wa", kind: null, prefix: "create", returnTo: "create-profile", open: { metro: true, regional: false } };
      }
      if (id === "my-regions") {
        if (!state.regionBackup) state.regionBackup = {};
        if (!me().regions || !me().regions.length) me().regions = ["hills", "north"];
        state.areaPick = { step: "state", stateId: "wa", kind: null, prefix: "me-regions", returnTo: "me" };
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
      if (t === "more") {
        go("more");
        return;
      }
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
      if (dest === "create-regions" || dest === "choose-areas") {
        var formGo = goBtn.closest("form");
        if (formGo) captureDraft(formGo);
        openAreaWizard("create", "create-profile");
        return;
      }
      if (dest === "my-regions") {
        openAreaWizard("me-regions", "me");
        return;
      }
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
      var next = state.fbNext || "signup-name";
      if (next === "signin" || next === "welcome") next = "signup-name";
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

    var openAreas = e.target.closest("[data-action='open-areas']");
    if (openAreas) {
      var formA = openAreas.closest("form");
      if (formA) captureDraft(formA);
      var tinA = document.getElementById("tradeType");
      if (tinA) {
        var dA = draftFromMe();
        if (tinA.value.trim()) dA.trade = tinA.value.trim();
        state.draft = dA;
      }
      var prefixA = openAreas.getAttribute("data-prefix") || "create";
      var retA = openAreas.getAttribute("data-return") || (prefixA === "me-regions" ? "me" : (prefixA === "edit" ? "edit-profile" : "create-profile"));
      if (prefixA === "create") state.stepRegions = (state.stepRegions || (state.draft && state.draft.regions) || []).slice();
      openAreaWizard(prefixA, retA);
      return;
    }
    var areaState = e.target.closest("[data-area-state]");
    if (areaState) {
      ensureAreaPick().stateId = areaState.getAttribute("data-area-state");
      areaAdvanceFromState();
      go(wizardScreen());
      return;
    }
    var accBtn = e.target.closest("[data-area-acc]");
    if (accBtn) {
      var accKind = accBtn.getAttribute("data-area-acc");
      var pickA = ensureAreaPick();
      ensureAccOpen(pickA);
      pickA.open[accKind] = !isAccOpen(accKind);
      go(wizardScreen());
      return;
    }
    var areaKind = e.target.closest("[data-area-kind]");
    if (areaKind) {
      var pickK = ensureAreaPick();
      pickK.step = "list";
      ensureAccOpen(pickK);
      pickK.open[areaKind.getAttribute("data-area-kind")] = true;
      go(wizardScreen());
      return;
    }
    var areaStep = e.target.closest("[data-area-step]");
    if (areaStep) {
      ensureAreaPick().step = areaStep.getAttribute("data-area-step");
      go(wizardScreen());
      return;
    }
    if (e.target.closest("[data-action='area-back']")) {
      handleAreaBack();
      return;
    }
    if (e.target.closest("[data-action='area-next']")) {
      var pickN = ensureAreaPick();
      if (!pickN.stateId) pickN.stateId = "wa";
      areaAdvanceFromState();
      go(wizardScreen());
      return;
    }
    if (e.target.closest("[data-action='area-done']")) {
      handleAreaDone();
      return;
    }

    var joinAllBtn = e.target.closest("[data-action='join-all-metro']");
    if (joinAllBtn) {
      var prefixJ = joinAllBtn.getAttribute("data-prefix") || "edit";
      var formJ = e.target.closest("form");
      if (formJ) captureDraft(formJ);
      go(setPickedRegions(prefixJ, joinAllMetro(prefixJ, joinAllBtn.getAttribute("data-kind"))));
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
      var formC = e.target.closest("form") || document.querySelector("form[data-form='signup-business']");
      if (formC) captureDraft(formC);
      var tinC = document.getElementById("tradeType");
      if (tinC) {
        var exactC = TRADES.find(function (tr) { return tr.toLowerCase() === String(tinC.value || "").trim().toLowerCase(); });
        var dC = draftFromMe();
        if (exactC) dC.trade = exactC;
        else if (tinC.value.trim()) dC.trade = tinC.value.trim();
        state.draft = dC;
      }
      var d3 = draftFromMe();
      if (!(d3.business || "").trim()) { toast("Please add your business name."); return; }
      if (!(d3.trade || "").trim()) { toast("Please choose your trade or business type."); return; }
      if (!(state.stepRegions || []).length) { toast("Select at least one region."); return; }
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

    var methodBtn = e.target.closest("[data-action='signup-method']");
    if (methodBtn) {
      state.signupMethod = methodBtn.getAttribute("data-method") || "";
      state.otpSent = false;
      go(state.signupMethod === "email" ? "signup-email" : state.signupMethod === "phone" ? "signup-phone" : "signup");
      return;
    }
    if (e.target.closest("[data-action='send-otp']")) {
      var formO = e.target.closest("form") || document.querySelector("form[data-form='signup-phone']");
      if (formO) captureDraft(formO);
      state.otpSent = true;
      state.signupMethod = "phone";
      go("signup-phone");
      toast("Code sent (prototype): 482913");
      return;
    }
    if (e.target.closest("[data-action='simulate-approval']")) {
      state.onboarding = state.onboarding || {};
      state.onboarding.forceComplete = true;
      state.onboarding.skipped = false;
      state.onboarding.done = false;
      if (window.TC158 && TC158.onApproved) TC158.onApproved();
      go("complete-profile");
      toast("Approved. Next, finish a few profile details, or skip for now.");
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
      go("home");
      return;
    }
    if (type === "signup" || type === "signup-email") {
      captureDraft(form);
      var fdE = new FormData(form);
      var dE = draftFromMe();
      dE.email = String(fdE.get("email") || dE.email || "").trim();
      state.draft = dE;
      state.signupMethod = "email";
      go("signup-name");
      return;
    }
    if (type === "signup-phone") {
      captureDraft(form);
      state.signupMethod = "phone";
      go("signup-name");
      return;
    }
    if (type === "signup-name") {
      captureDraft(form);
      var fdN = new FormData(form);
      var dN = draftFromMe();
      dN.first = String(fdN.get("first") || "").trim() || dN.first;
      dN.last = String(fdN.get("last") || "").trim() || dN.last;
      if (!dN.first || !dN.last) { toast("Please add your first and last name."); return; }
      state.draft = dN;
      go("create-profile");
      return;
    }
    if (type === "create-profile" || type === "signup-business") {
      captureDraft(form);
      var tin = document.getElementById("tradeType");
      if (tin) {
        var exact = TRADES.find(function (tr) { return tr.toLowerCase() === String(tin.value || "").trim().toLowerCase(); });
        var dB = draftFromMe();
        if (exact) dB.trade = exact;
        else if (tin.value.trim()) dB.trade = tin.value.trim();
        state.draft = dB;
      }
      if (!state.draft.business) { toast("Please add your business name."); return; }
      if (!state.draft.trade) { toast("Please choose your trade or business type."); return; }
      if (!(state.stepRegions || []).length) { toast("Select at least one region."); return; }
      var dF = draftFromMe();
      dF.regions = state.stepRegions.slice();
      state.draft = dF;
      applyDraftToMe();
      go("pending");
      toast("Thanks. Your profile is waiting for approval.");
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
  if (start === "welcome" || start === "signin" || start === "signup" || start === "signup-email" || start === "signup-phone" || start === "fb-consent") {
    state.fbConnected = false;
  }
  if (start === "signup-email") state.signupMethod = "email";
  if (start === "signup-phone") { state.signupMethod = "phone"; state.otpSent = true; }
  if (start === "signup-name") {
    state.draft = state.draft || { first: "Alex", last: "Reid", business: "", trade: "", bio: "", phone: "", facebook: "", page: "", abn: "", email: "", regions: [] };
  }
  if (start === "complete-profile") {
    state.onboarding = { fresh: true, forceComplete: true, skipped: false, done: false, fill: {} };
  }
  if (start === "create-profile") {
    var mm = me();
    state.fbConnected = false;
    state.stepRegions = [];
    state.draft = { first: mm.first, last: mm.last, business: mm.business, trade: mm.trade, bio: mm.bio, phone: mm.phone, facebook: "", page: mm.page, regions: [] };
  }
  if (start === "create-profile-connected") {
    var mm2 = me();
    state.fbConnected = true;
    state.stepRegions = [];
    state.draft = { first: mm2.first, last: mm2.last, business: mm2.business, trade: mm2.trade, bio: mm2.bio, phone: mm2.phone, facebook: demoFbLink(), page: mm2.page, regions: [] };
  }
  if (start === "edit-profile" || start === "settings" || start === "me" || start === "reviews" || start === "chats" || start === "drawer" || start === "google-consent" || start === "subscription" || start === "invite" || start === "help") {
    state.fbConnected = true;
    state.googleConnected = true;
    me().facebook = me().facebook || demoFbLink();
  }
  if (start === "google-consent") state.googleConnected = false;
  if (start === "create-regions") {
    state.stepRegions = [];
    state.regionBackup = state.regionBackup || {};
    state.regionBackup.create = [];
  }
  if (start === "create-regions-all") {
    state.regionBackup = state.regionBackup || {};
    state.regionBackup.create = ["hills", "north"];
    state.stepRegions = allRegionIds();
  }
  if (start === "fb-recommend" || start === "fb-recommend-open" || start === "fb-recommend-mine" || start === "fb-recommend-done") {
    state.recFilter = start === "fb-recommend-done" ? "done" : "todo";
    state.recOpen = start === "fb-recommend-open" ? "r1" : (start === "fb-recommend-mine" ? "r2" : "");
    state.tipDismissed = true;
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
    fullName: fullName, me: me, regionName: regionName, formatRegionPill: formatRegionPill, toast: toast,
    closeSheet: closeSheet, draftFromMe: draftFromMe, demoFbLink: demoFbLink,
    captureDraft: captureDraft, fbConnectBlock: fbConnectBlock, regionPicker: regionPicker,
    allRegionIds: allRegionIds, isAllMetro: isAllMetro, selectedAreasCard: selectedAreasCard,
    areaWizardHTML: areaWizardHTML, openAreaWizard: openAreaWizard, areasSummaryHTML: areasSummaryHTML,
    auStates: auStates, renderChooseAreas: renderChooseAreas,
    buildChooser: buildChooser, paintSearchAc: paintSearchAc, updateTabs: updateTabs
  };
})();
