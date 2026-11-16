(function () {
  const TRADES = [
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
    { id: "signup", title: "Sign up", sub: "Create an account" },
    { id: "create-profile", title: "Create profile", sub: "Details, trade and Facebook links" },
    { id: "create-regions", title: "Choose regions", sub: "Multi-select Perth areas" },
    { id: "pending", title: "Pending approval", sub: "Optional / not decided yet", tbc: true },
    { id: "members", title: "Members — My areas", sub: "Default member list" },
    { id: "members-all", title: "Members — All Perth metro", sub: "Metro-wide filter" },
    { id: "members-filter", title: "Members — Trade filter", sub: "Plumbers only, as an example" },
    { id: "member", title: "Member profile", sub: "Facebook friend request CTA" },
    { id: "me", title: "My profile", sub: "How other members see you" },
    { id: "edit-profile", title: "Edit profile", sub: "Update details and regions" },
    { id: "settings", title: "Settings", sub: "Account, reminders, sign out" }
  ];

  const TABBED = new Set(["members", "members-all", "members-filter", "me", "settings"]);
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
    photoData: null
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
      bell: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>'
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
      return true;
    });
  }

  function memberCard(m) {
    return '<button class="card member-card" data-go="member" data-id="' + m.id + '">' +
      avatarHTML(m, 52) +
      '<div class="meta"><div class="nm">' + escapeText(fullName(m)) + '</div>' +
      '<div class="biz">' + escapeText(m.business) + '</div>' +
      '<div class="tags"><span class="pill t-pill">' + escapeText(m.trade) + "</span>" +
      m.regions.map(function (r) { return '<span class="pill r-pill">' + regionName(r) + "</span>"; }).join("") +
      '</div></div><span class="chev">' + icon("chev") + "</span></button>";
  }

  function regionPicker(selectedIds, prefix) {
    function block(list) {
      return '<div class="region-grid">' + list.map(function (r) {
        var on = selectedIds.indexOf(r.id) !== -1;
        return '<button type="button" class="region-chip' + (on ? " on" : "") + '" data-region="' + r.id + '" data-prefix="' + prefix + '">' +
          "<span><span class=\"n\">" + r.name + "</span>" + (r.suggested ? '<span class="sug">Suggested</span>' : "") + "</span>" +
          '<span class="tick">' + icon("check") + "</span></button>";
      }).join("") + "</div>";
    }
    var core = REGIONS.filter(function (r) { return !r.suggested; });
    var sug = REGIONS.filter(function (r) { return r.suggested; });
    return '<div class="region-sec"><h3>Perth regions</h3><p>The four areas already agreed.</p>' + block(core) + "</div>" +
      '<div class="region-sec"><h3>Suggested regions</h3><p>Extra areas for a fuller Perth metro map. These can be changed later.</p>' + block(sug) + "</div>";
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
    var n = parseName(fd.get("name"));
    var current = draftFromMe();
    state.draft = {
      first: n.first, last: n.last,
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


  function renderWelcome() {
    return '<section class="screen dark" id="screen-welcome" data-screen="welcome">' +
      '<div class="welcome-bg" aria-hidden="true"><div class="ring" style="width:280px;height:280px"></div><div class="ring" style="width:400px;height:400px"></div><div class="ring" style="width:520px;height:520px"></div></div>' +
      '<div class="welcome-inner"><div class="logo-mark">' + icon("logo") + '</div>' +
      '<div class="welcome-kicker">Perth tradies</div>' +
      '<h2>TradeCircle<br><span>Perth</span></h2>' +
      '<span class="name-badge placeholder-note">Placeholder name</span>' +
      '<p class="welcome-copy">Join your local areas, meet other trades, and send a Facebook friend request so you can recommend each other in the groups.</p>' +
      '<ul class="welcome-points">' +
      '<li><span class="ic">' + icon("check") + "</span> Make a profile with your trade and Facebook link.</li>" +
      '<li><span class="ic">' + icon("check") + "</span> Pick one or more Perth regions.</li>" +
      '<li><span class="ic">' + icon("check") + "</span> Weekly meet-ups stay offline — they are not in this app.</li>" +
      '</ul><div class="welcome-actions">' +
      '<button class="btn btn-primary" data-go="signup">Create account</button>' +
      '<button class="btn btn-ghost" data-go="signin">Sign in</button>' +
      '</div><p class="welcome-foot">Recommendations should only be for people you actually know.</p></div></section>';
  }

  function renderSignIn() {
    return '<section class="screen has-header" data-screen="signin">' +
      '<div class="app-header"><button class="icon-btn" data-go="welcome" aria-label="Back">' + icon("back") + '</button><div class="ht">Sign in</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="auth-hero"><h2>Welcome back</h2><p>Sign in to see members in your Perth areas.</p></div>' +
      '<form data-form="signin">' +
      '<div class="field"><label>Email</label><input type="email" name="email" placeholder="you@example.com" value="jamie@halepest.demo" autocomplete="username"></div>' +
      '<div class="field"><label>Password</label><input type="password" name="password" placeholder="••••••••" value="demopass" autocomplete="current-password"></div>' +
      '<button class="btn btn-primary" type="submit" style="margin-top:8px">Sign in</button></form>' +
      '<p class="hint" style="text-align:center;margin-top:14px">This is a prototype — tap Sign in to continue as Jamie Hale.</p>' +
      '<div class="auth-bottom">New here? <a class="link" data-go="signup" href="#signup">Create an account</a></div></div></section>';
  }

  function renderSignUp() {
    return '<section class="screen has-header" data-screen="signup">' +
      '<div class="app-header"><button class="icon-btn" data-go="welcome" aria-label="Back">' + icon("back") + '</button><div class="ht">Create account</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="auth-hero"><h2>Join the circle</h2><p>A short account, then your trade profile.</p></div>' +
      '<form data-form="signup">' +
      '<div class="field"><label>Full name</label><input name="name" placeholder="Your name" required></div>' +
      '<div class="field"><label>Email</label><input type="email" name="email" placeholder="you@example.com" required></div>' +
      '<div class="field"><label>Password</label><input type="password" name="password" placeholder="At least 8 characters" required></div>' +
      '<button class="btn btn-primary" type="submit" style="margin-top:8px">Continue</button></form>' +
      '<div class="auth-bottom">Already have an account? <a class="link" data-go="signin" href="#signin">Sign in</a></div></div></section>';
  }

  function renderCreateProfile() {
    var d = draftFromMe();
    var dummy = { first: d.first || "Add", last: d.last || "photo", color: "teal", isMe: true };
    return '<section class="screen has-header" data-screen="create-profile">' +
      '<div class="app-header"><button class="icon-btn" data-go="signup" aria-label="Back">' + icon("back") + '</button><div class="ht">Your profile</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="steps" aria-hidden="true"><span class="on"></span><span></span></div>' +
      '<div class="auth-hero"><h2>About your business</h2><p>Step 1 of 2. Other members will see this before they send a friend request.</p></div>' +
      '<form data-form="create-profile"><div class="photo-row">' +
      '<button type="button" class="photo-btn" data-photo="1" aria-label="Add photo">' + avatarHTML(dummy, 80) + '<span class="cam">' + icon("cam") + "</span></button>" +
      "<div><strong style=\"font-size:15px;font-weight:800\">Profile photo or logo</strong><p class=\"hint\">Optional. Initials are used if you skip this.</p></div></div>" +
      '<div class="field"><label>Full name</label><input name="name" placeholder="Jamie Hale" value="' + escapeAttr((d.first && d.last) ? (d.first + " " + d.last) : (d.first || "")) + '"></div>' +
      '<div class="field"><label>Business name</label><input name="business" placeholder="Hale Pest Control" value="' + escapeAttr(d.business || "") + '"></div>' +
      '<div class="field"><label>Trade</label><button type="button" class="picker-btn" data-open-trades="1"><span class="' + (d.trade ? "" : "ph") + '">' + (d.trade || "Choose your trade") + "</span>" + icon("chev") + "</button></div>" +
      '<div class="field"><label>Short bio</label><textarea name="bio" rows="3" placeholder="What you do and where you work">' + escapeText(d.bio || "") + "</textarea></div>" +
      '<div class="field"><label>Phone <span class="opt">(optional)</span></label><input name="phone" inputmode="tel" placeholder="0412 000 000" value="' + escapeAttr(d.phone || "") + '"></div>' +
      '<div class="field"><label>Facebook profile link</label><input name="facebook" inputmode="url" placeholder="https://www.facebook.com/your.profile" value="' + escapeAttr(d.facebook || "") + '"><p class="hint">This is the profile other members will open to send you a friend request.</p></div>' +
      '<div class="field"><label>Facebook business page <span class="opt">(optional)</span></label><input name="page" inputmode="url" placeholder="https://www.facebook.com/your.business" value="' + escapeAttr(d.page || "") + '"></div>' +
      '<button class="btn btn-primary" type="submit" style="margin-top:6px">Continue to regions</button></form></div></section>';
  }

  function renderCreateRegions() {
    var selected = state.stepRegions || [];
    var disabled = selected.length ? "" : ' disabled style="opacity:.45"';
    var count = selected.length ? (selected.length + " region" + (selected.length > 1 ? "s" : "") + " selected") : "Select at least one region";
    return '<section class="screen has-header" data-screen="create-regions">' +
      '<div class="app-header"><button class="icon-btn" data-go="create-profile" aria-label="Back">' + icon("back") + '</button><div class="ht">Your areas</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="steps" aria-hidden="true"><span class="on"></span><span class="on"></span></div>' +
      '<div class="auth-hero"><h2>Where do you work?</h2><p>Step 2 of 2. You can join more than one region, and change this later.</p></div>' +
      regionPicker(selected, "create") +
      '<p class="selected-count">' + count + "</p>" +
      '<button class="btn btn-primary" data-action="finish-create"' + disabled + ">Finish and see members</button>" +
      '<p class="hint" style="text-align:center;margin-top:12px">This prototype takes you straight in. Approvals, if added later, would use the optional pending screen.</p></div></section>';
  }

  function renderPending() {
    return '<section class="screen has-header" data-screen="pending">' +
      '<div class="app-header"><button class="icon-btn" data-go="create-regions" aria-label="Back">' + icon("back") + '</button><div class="ht">Account status</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="banner tbc">Optional screen — it has not been decided yet whether new members need approval before they appear in the list.</div>' +
      '<div class="pending-art"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg></div>' +
      '<div class="auth-hero" style="text-align:center"><h2>Pending approval</h2><p>Thanks, Jamie. Your profile would stay hidden until an admin gives the go-ahead. This step may not be used.</p></div>' +
      '<button class="btn btn-navy" data-go="members" style="margin-top:8px">Preview the members list anyway</button>' +
      '<button class="btn btn-ghost ink" data-go="edit-profile" style="margin-top:10px">Edit my profile while I wait</button></div></section>';
  }

  function renderMembers() {
    var list = filteredMembers();
    var used = {};
    MEMBERS.forEach(function (m) { if (!m.isMe) used[m.trade] = true; });
    var trades = ["All"].concat(TRADES.filter(function (t) { return used[t]; }));
    var countLabel = state.areaFilter === "mine"
      ? (list.length + " member" + (list.length === 1 ? "" : "s") + " in your areas")
      : (list.length + " member" + (list.length === 1 ? "" : "s") + " across Perth metro");
    return '<section class="screen has-tabs" data-screen="members"><div class="scroll">' +
      '<h1 class="large-title">Members</h1><p class="count-line">' + countLabel + "</p>" +
      '<div class="search">' + icon("search") + '<input id="memberSearch" type="search" placeholder="Search name, business or trade" value="' + escapeAttr(state.query) + '"></div>' +
      '<div style="height:12px"></div><div class="seg">' +
      '<button class="' + (state.areaFilter === "mine" ? "active" : "") + '" data-area="mine">My areas</button>' +
      '<button class="' + (state.areaFilter === "all" ? "active" : "") + '" data-area="all">All Perth metro</button>' +
      '</div><div style="height:12px"></div><div class="chips">' +
      trades.map(function (t) { return '<button class="chip' + (state.tradeFilter === t ? " active" : "") + '" data-trade="' + escapeAttr(t) + '">' + t + "</button>"; }).join("") +
      "</div>" +
      (state.tipDismissed ? '<div style="height:10px"></div>' : '<div class="banner info" style="margin:8px 0 14px" id="tipBanner">Open a profile to send a Facebook friend request. Weekly meet-ups stay offline. <button class="link" data-action="dismiss-tip" style="margin-left:6px">Got it</button></div>') +
      '<div id="memberList">' + (list.length ? list.map(memberCard).join("") : '<div class="empty"><h3>No members match</h3><p>Try All Perth metro, or clear the trade filter and search.</p></div>') +
      "</div></div></section>";
  }

  function renderMember(id) {
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
    var d = draftFromMe();
    var m = Object.assign({}, me(), d, { isMe: true });
    return '<section class="screen has-header" data-screen="edit-profile">' +
      '<div class="app-header"><button class="icon-btn" data-go="me" aria-label="Back">' + icon("back") + '</button><div class="ht">Edit profile</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><form data-form="edit-profile"><div class="photo-row">' +
      '<button type="button" class="photo-btn" data-photo="1" aria-label="Change photo">' + avatarHTML(m, 80) + '<span class="cam">' + icon("cam") + "</span></button>" +
      "<div><strong style=\"font-size:15px;font-weight:800\">Profile photo or logo</strong><p class=\"hint\">Tap to add a photo. Initials are used if you skip this.</p></div></div>" +
      '<div class="field"><label>Full name</label><input name="name" value="' + escapeAttr(fullName({ first: d.first, last: d.last })) + '"></div>' +
      '<div class="field"><label>Business name</label><input name="business" value="' + escapeAttr(d.business) + '"></div>' +
      '<div class="field"><label>Trade</label><button type="button" class="picker-btn" data-open-trades="1"><span>' + escapeText(d.trade) + "</span>" + icon("chev") + "</button></div>" +
      '<div class="field"><label>Short bio</label><textarea name="bio" rows="3">' + escapeText(d.bio) + "</textarea></div>" +
      '<div class="field"><label>Phone <span class="opt">(optional)</span></label><input name="phone" value="' + escapeAttr(d.phone || "") + '"></div>' +
      '<div class="field"><label>Facebook profile link</label><input name="facebook" inputmode="url" value="' + escapeAttr(d.facebook) + '"></div>' +
      '<div class="field"><label>Facebook business page <span class="opt">(optional)</span></label><input name="page" inputmode="url" value="' + escapeAttr(d.page || "") + '"></div>' +
      '<div class="group-label">Your regions</div>' + regionPicker(d.regions || [], "edit") +
      '<button class="btn btn-primary" type="submit" style="margin-top:8px">Save changes</button></form></div></section>';
  }

  function renderSettings() {
    var m = me();
    return '<section class="screen has-tabs has-header" data-screen="settings">' +
      '<div class="app-header"><span class="header-spacer"></span><div class="ht">Settings</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><p class="group-label">Account</p><div class="card group">' +
      '<button class="set-row" data-go="me"><span class="ic" style="background:#E7F8F1;color:#066B4C">' + icon("pin") + '</span><span class="lab"><span class="a">View my profile</span><span class="b">' + escapeText(fullName(m)) + " · " + escapeText(m.trade) + '</span></span><span class="chev">' + icon("chev") + "</span></button>" +
      '<button class="set-row" data-go="edit-profile"><span class="ic" style="background:#EEF2F6;color:#14314C">' + icon("pencil") + '</span><span class="lab"><span class="a">Edit profile and regions</span><span class="b">Name, trade, Facebook links, areas</span></span><span class="chev">' + icon("chev") + "</span></button>" +
      '</div><p class="group-label">Preferences</p><div class="card group">' +
      '<button class="set-row" data-action="toggle-notify"><span class="ic" style="background:#FFF6E0;color:#8A5A00">' + icon("bell") + '</span><span class="lab"><span class="a">New member alerts</span><span class="b">A simple on/off for a later build</span></span><span class="toggle' + (state.notify ? " on" : "") + '" id="notifyToggle"></span></button>' +
      '</div><p class="group-label">How the circle works</p>' +
      '<div class="card group" style="padding:14px 16px 16px"><p style="font-size:14px;font-weight:600;line-height:1.5;color:var(--text)">Only recommend members you have actually met or worked with, and say so in your comment. Weekly catch-ups are organised in person, not in this app.</p></div>' +
      '<p class="group-label">About</p><div class="card group">' +
      '<div class="set-row"><span class="lab"><span class="a">App name</span><span class="b">TradeCircle Perth — placeholder, not final</span></span></div>' +
      '<div class="set-row"><span class="lab"><span class="a">Version</span><span class="b">UI prototype v1 · 16 Nov 2026</span></span></div></div>' +
      '<button class="btn btn-ghost ink" data-go="welcome" style="margin-top:14px;color:var(--danger);border-color:#F3C4C4">Sign out</button>' +
      '<p class="settings-foot" style="padding-top:12px">Fictional demo data only.</p></div></section>';
  }


  function screenHTML(id) {
    switch (id) {
      case "welcome": return renderWelcome();
      case "signin": return renderSignIn();
      case "signup": return renderSignUp();
      case "create-profile": return renderCreateProfile();
      case "create-regions": return renderCreateRegions();
      case "pending": return renderPending();
      case "members":
      case "members-all":
      case "members-filter":
        return renderMembers();
      case "member": return renderMember(state.selectedMember);
      case "me": return renderMe();
      case "edit-profile": return renderEdit();
      case "settings": return renderSettings();
      default: return renderWelcome();
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

    state.screen = id;
    screensEl.innerHTML = screenHTML(id);
    var sc = screensEl.querySelector(".screen");
    if (sc) sc.classList.add("active");

    var showTabs = TABBED.has(id);
    tabbar.classList.toggle("show", showTabs);
    tabbar.querySelectorAll(".tab").forEach(function (t) {
      var tab = t.dataset.tab;
      var on = (tab === "members" && (id === "members" || id === "members-all" || id === "members-filter"))
        || (tab === "me" && id === "me")
        || (tab === "settings" && id === "settings");
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
  }

  function bindScreen() {
    var search = $("#memberSearch");
    if (search) {
      search.addEventListener("input", function (e) {
        state.query = e.target.value;
        var wrap = $("#memberList");
        var list = filteredMembers();
        wrap.innerHTML = list.length ? list.map(memberCard).join("") : '<div class="empty"><h3>No members match</h3><p>Try All Perth metro, or clear the trade filter and search.</p></div>';
        var cl = document.querySelector(".count-line");
        if (cl) {
          cl.textContent = state.areaFilter === "mine"
            ? (list.length + " member" + (list.length === 1 ? "" : "s") + " in your areas")
            : (list.length + " member" + (list.length === 1 ? "" : "s") + " across Perth metro");
        }
      });
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
      TRADES.map(function (t) {
        return '<button class="trade-opt' + (t === current ? " on" : "") + '" data-trade-pick="' + escapeAttr(t) + '"><span>' + t + '</span><span class="ck">' + icon("check") + "</span></button>";
      }).join("") + "</div>";
    $("#phone").appendChild(sheetEl);
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toastEl.classList.remove("show"); }, 2400);
  }

  function buildChooser() {
    chooserList.innerHTML = CHOOSER.map(function (c, i) {
      var num = String(i + 1).padStart(2, "0");
      return '<button class="chooser-item" data-id="' + c.id + '"><span class="chooser-num">' + num + "</span><span><div class=\"t\">" + c.title + '</div><div class="s">' + c.sub + "</div></span>" +
        (c.tbc ? '<span class="chooser-tag">TBC</span>' : "") + "</button>";
    }).join("");
  }

  document.addEventListener("click", function (e) {
    var chooserBtn = e.target.closest(".chooser-item");
    if (chooserBtn) {
      var id = chooserBtn.dataset.id;
      if (id === "members") { state.areaFilter = "mine"; state.tradeFilter = "All"; state.query = ""; }
      if (id === "members-all") { state.areaFilter = "all"; state.tradeFilter = "All"; state.query = ""; }
      if (id === "members-filter") { state.areaFilter = "all"; state.tradeFilter = "Plumber"; state.query = ""; }
      if (id === "member") state.selectedMember = "liam";
      if (id === "create-profile") {
        var m = me();
        state.draft = { first: m.first, last: m.last, business: m.business, trade: m.trade, bio: m.bio, phone: m.phone, facebook: m.facebook, page: m.page, regions: m.regions.slice() };
      }
      if (id === "create-regions") state.stepRegions = ["hills", "north"];
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

    var trade = e.target.closest("[data-trade]");
    if (trade && !trade.dataset.tradePick) {
      state.tradeFilter = trade.dataset.trade;
      go(state.areaFilter === "all" ? "members-all" : "members");
      return;
    }

    var goBtn = e.target.closest("[data-go]");
    if (goBtn) {
      e.preventDefault();
      var dest = goBtn.dataset.go;
      if (goBtn.dataset.id) state.selectedMember = goBtn.dataset.id;
      if (dest === "welcome") state.draft = null;
      go(dest);
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

    var region = e.target.closest("[data-region]");
    if (region) {
      var rid = region.dataset.region;
      if (region.dataset.prefix === "create") {
        var set = {};
        (state.stepRegions || []).forEach(function (x) { set[x] = true; });
        if (set[rid]) delete set[rid]; else set[rid] = true;
        state.stepRegions = Object.keys(set);
        go("create-regions");
      } else {
        var form2 = e.target.closest("form");
        if (form2) captureDraft(form2);
        var d2 = draftFromMe();
        var set2 = {};
        (d2.regions || []).forEach(function (x) { set2[x] = true; });
        if (set2[rid]) delete set2[rid]; else set2[rid] = true;
        d2.regions = Object.keys(set2);
        state.draft = d2;
        go("edit-profile");
      }
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
      go("members");
      toast("You’re in. Browse members in your areas.");
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
      var n = parseName(fd.get("name"));
      state.draft = { first: n.first, last: n.last, business: "", trade: "", bio: "", phone: "", facebook: "", page: "", regions: [] };
      state.stepRegions = [];
      go("create-profile");
      return;
    }
    if (type === "create-profile") {
      captureDraft(form);
      if (!state.draft.trade) { toast("Please choose your trade."); return; }
      if (!state.draft.facebook) { toast("Please add your Facebook profile link."); return; }
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
  if (start === "member") state.selectedMember = (route && route.memberId) || "liam";
  if (start === "create-profile") {
    var mm = me();
    state.draft = { first: mm.first, last: mm.last, business: mm.business, trade: mm.trade, bio: mm.bio, phone: mm.phone, facebook: mm.facebook, page: mm.page, regions: mm.regions.slice() };
  }
  if (start === "create-regions") state.stepRegions = ["hills", "north"];
  go(start);

  window.TradeCircle = { go: go, state: state, MEMBERS: MEMBERS, REGIONS: REGIONS, CHOOSER: CHOOSER, filteredMembers: filteredMembers };
})();
