/* Rate Buddies v1.8.0 — Devi automation (admin, prototype, fictional data) */
(function () {
  "use strict";

  function esc(s) {
    if (window.TCAdmin && TCAdmin.esc) return TCAdmin.esc(s);
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }
  function facebookF(size, color) {
    if (window.TCAdmin && TCAdmin.facebookF) return TCAdmin.facebookF(size, color);
    size = size || 16;
    return '<svg class="f-ico" viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="' + (color || "currentColor") + '" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg>';
  }
  function panel(title, sub, extra, body) {
    if (window.TCAdmin && TCAdmin.panel) return TCAdmin.panel(title, sub, extra, body);
    return '<section class="panel"><div class="panel-h"><div><h2>' + title + "</h2>" + (sub ? '<p class="panel-sub">' + sub + "</p>" : "") + "</div>" + (extra || "") + "</div>" + body + "</section>";
  }
  function badge(status) {
    if (window.TCAdmin && TCAdmin.badge) return TCAdmin.badge(status);
    return '<span class="badge b-info">' + esc(status) + "</span>";
  }
  function C() { return window.TCDeviCity || null; }
  function cityOf(place) { return C() ? C().cityForPlace(place).city : place; }
  function firstName(m) { return C() ? C().firstName(m) : (m.first || "them"); }
  function fullName(m) { return C() ? C().fullName(m) : (m.name || ""); }
  function plural(trade) { return C() ? C().tradePlural(trade) : (trade || "") + "s"; }
  function stats(item) {
    if (!C()) return { cityCount: 0, alertCount: 0, sameTradeCount: 0, featured: item.featured, candidates: [] };
    return C().summary(item.city, item.trade, item.featuredId);
  }
  function initials(m) {
    var n = fullName(m);
    return n.split(/\s+/).filter(Boolean).slice(0, 2).map(function (p) { return p[0]; }).join("").toUpperCase();
  }

  var KEYWORDS = [
    { trade: "Plumber", phrases: ["recommend a plumber", "anyone know a good plumber", "looking for a plumber", "burst pipe", "blocked drain"] },
    { trade: "Electrician", phrases: ["recommend an electrician", "anyone know a good electrician", "need an electrician", "switchboard"] },
    { trade: "Pest Control", phrases: ["recommend a pest controller", "termite inspection", "anyone for pest control"] },
    { trade: "Hairdresser", phrases: ["looking for a hairdresser", "recommend a hairdresser", "anyone know a good salon"] },
    { trade: "Barber", phrases: ["recommend a barber", "good barber near me"] },
    { trade: "Carpenter", phrases: ["recommend a carpenter", "deck repair", "anyone know a good chippie"] }
  ];

  function defaultInbox() {
    return [
      {
        id: "d1", status: "pending",
        group: "Joondalup Community Noticeboard",
        snippet: "Can anyone recommend a plumber in Joondalup? Burst pipe under the kitchen and I need someone today.",
        keyword: "recommend a plumber",
        trade: "Plumber",
        place: "Joondalup",
        city: "Perth",
        featuredId: "michael",
        confidence: 92,
        link: "https://www.facebook.com/groups/joondalup.community.noticeboard.demo/posts/662018",
        when: "Today 7:58 am",
        token: "demo-d1-approve"
      },
      {
        id: "d2", status: "pending",
        group: "Hills Mums & Dads",
        snippet: "Need a reliable pest controller in Midland for termites — any recommendations?",
        keyword: "recommend a pest controller",
        trade: "Pest Control",
        place: "Midland",
        city: "Perth",
        featuredId: "jamie",
        confidence: 90,
        link: "https://www.facebook.com/groups/hills.mums.dads.demo/posts/771204",
        when: "Today 7:40 am",
        token: "demo-d2-approve"
      },
      {
        id: "d3", status: "pending",
        group: "Perth Community Tips (demo)",
        snippet: "Anyone know someone good around Perth?? Need help with my house this week.",
        keyword: "someone good",
        trade: "Handyman",
        place: "Perth",
        city: "Perth",
        featuredId: "hannah",
        confidence: 41,
        low: true,
        link: "https://www.facebook.com/groups/perth.community.tips.demo/posts/220441",
        when: "Today 7:21 am",
        token: "demo-d3-approve"
      },
      {
        id: "d4", status: "pending",
        group: "Broome Buy Swap Sell (demo)",
        snippet: "Looking for a hairdresser in Broome who can do a colour and cut next week.",
        keyword: "looking for a hairdresser",
        trade: "Hairdresser",
        place: "Broome",
        city: "Broome",
        featuredId: "",
        none: true,
        confidence: 86,
        link: "https://www.facebook.com/groups/broome.buyswap.demo/posts/104882",
        when: "Yesterday 6:14 pm",
        token: "demo-d4-approve"
      },
      {
        id: "d5", status: "approved",
        group: "Fremantle Community Noticeboard",
        snippet: "Need an air-con technician in Fremantle before the weekend.",
        keyword: "air-con technician",
        trade: "Air Conditioning",
        place: "Fremantle",
        city: "Perth",
        featuredId: "emma",
        confidence: 84,
        link: "https://www.facebook.com/groups/fremantle.community.demo/posts/908441",
        when: "Yesterday 4:02 pm",
        approvedAt: "Yesterday 4:05 pm",
        token: "demo-d5-approve"
      }
    ];
  }

  var settings = {
    connected: true,
    lastAlert: "Today 7:58 am",
    webhook: "https://api.ratebuddies.com/hooks/devi/rb_demo_8f3c21",
    autoPublish: false,
    minConfidence: 70,
    channels: { grok: true, email: false, sms: false, push: true }
  };
  var inbox = defaultInbox();
  var editing = null;
  var flash = "";
  var simN = 0;

  function pendingCount() {
    return inbox.filter(function (x) { return x.status === "pending"; }).length;
  }
  function confBadge(n) {
    var cls = n >= 80 ? "conf-hi" : n >= 60 ? "conf-mid" : "conf-lo";
    var lab = n >= 80 ? "High" : n >= 60 ? "Medium" : "Low";
    return '<span class="conf ' + cls + '">' + n + "% · " + lab + "</span>";
  }
  function grokBlurb(item) {
    var s = stats(item);
    var feat = s.featured;
    if (!feat) {
      return "New recommendation request: " + item.trade + " wanted in " + item.city +
        " (" + item.place + " post), from " + item.group + ", " + item.confidence +
        "% match. There is no " + item.trade.toLowerCase() + " in " + item.city + " to recommend, so this can’t be approved.";
    }
    return "New recommendation request: " + item.trade + " wanted in " + item.city +
      " (" + item.place + " post), from " + item.group + ", " + item.confidence +
      "% match, " + s.alertCount + " " + item.city + " members will be alerted to recommend " +
      firstName(feat) + " (" + item.trade + ").";
  }

  function renderConnection() {
    var ch = settings.channels;
    function opt(key, title, sub) {
      return '<button type="button" class="channel-opt' + (ch[key] ? " on" : "") + '" data-action="devi-channel" data-id="' + key + '">' +
        '<span class="tick" aria-hidden="true">' + (ch[key] ? "✓" : "") + "</span>" +
        "<strong>" + title + "</strong><span>" + sub + "</span></button>";
    }
    var plumber = inbox[0];
    var status = panel("Connection", "Devi watches Facebook groups you belong to and sends each match here.", "",
      '<div class="devi-status">' +
      '<div class="pulse" aria-hidden="true">' + facebookF(20, "#fff") + "</div>" +
      "<div><h3>Connected to Devi</h3>" +
      '<p>Last alert received <span class="ok">' + esc(settings.lastAlert) + "</span> · prototype only, no live webhook yet</p></div></div>" +
      '<div class="field" style="margin-top:16px"><label>Webhook URL to paste into Devi</label>' +
      '<div class="devi-webhook"><input id="deviWebhook" type="text" readonly value="' + esc(settings.webhook) + '">' +
      '<button class="btn btn-ghost" type="button" data-action="devi-copy-hook">Copy</button></div>' +
      '<p class="devi-note">Available once the backend is live. This is a placeholder address so you can see where it will go. Devi will post only the post link, group name, a short snippet, the keyword and the time.</p></div>'
    );

    var keys = panel("Keyword suggestions", "Start with phrases people actually type when they want a recommendation. Add these in Devi for each trade you care about.", "",
      KEYWORDS.map(function (k) {
        return '<div class="kw-block"><h4>' + esc(k.trade) + "</h4><div class=\"chips\">" +
          k.phrases.map(function (p) { return '<span class="chip">“' + esc(p) + "”</span>"; }).join("") +
          "</div></div>";
      }).join("")
    );

    var channels = panel("Approval channel", "When Devi finds a match, an AI agent (Grok Bot, or any agent you connect) messages you. You tap Approve. Everything after that is automatic.", "",
      '<p class="panel-sub" style="margin:0 0 10px">Notify me via</p>' +
      '<div class="channel-grid">' +
      opt("grok", "Grok Bot", "A chat card with Approve, Edit and Dismiss") +
      opt("email", "Email", "One-tap approve link in your inbox") +
      opt("sms", "SMS", "Short text with an approve link") +
      opt("push", "Push", "Phone alert that opens the approve card") +
      "</div>" +
      '<p class="devi-note">Each match includes a signed one-tap link, for example <span class="approve-link">https://api.ratebuddies.com/hooks/approve/d1?token=demo-signed-token</span>. Grok Bot can receive these through a routine webhook trigger.</p>' +
      '<div class="agent-preview" style="margin-top:14px">' +
      '<div class="from">Preview · Grok Bot</div>' +
      '<div class="bubble"><p>' + esc(grokBlurb(plumber)) + "</p>" +
      '<div class="btns"><span class="ap-approve">Approve</span><span class="ap-edit">Edit</span><span class="ap-dismiss">Dismiss</span></div></div></div>'
    );

    var rules = panel("Match rules", "A post is mapped to a city, not to a suburb or region. Joondalup, Midland and Fremantle all count as Perth.",
      "",
      '<p class="panel-sub" style="margin:0 0 8px">When a match arrives</p>' +
      '<div class="mode-row">' +
      '<button type="button" class="mode-pill' + (!settings.autoPublish ? " on" : "") + '" data-action="devi-mode" data-id="review">Review first <span class="hint">default</span></button>' +
      '<button type="button" class="mode-pill' + (settings.autoPublish ? " on" : "") + '" data-action="devi-mode" data-id="auto">Auto-publish high-confidence matches</button>' +
      "</div>" +
      '<p class="devi-note" style="margin:0 0 12px">Every Rate Buddies member in that city is alerted, so anyone who knows the featured member can recommend them. Same-trade members are never alerted (conflict of interest) — a plumber request is not sent to other plumbers. If no member of that trade lives in the city, the request cannot be approved, because there is no one to help.</p>' +
      '<p class="panel-sub" style="margin:12px 0 8px">Minimum confidence to accept a match</p>' +
      '<div class="conf-row"><input id="deviMinConf" type="range" min="40" max="95" step="1" value="' + settings.minConfidence + '">' +
      '<span class="conf-val" id="deviMinConfVal">' + settings.minConfidence + "%</span></div>" +
      '<p class="devi-note">Matches below this score still appear in Incoming requests, marked as low confidence, so you can decide.</p>'
    );

    var actions = '<div class="devi-top-actions">' +
      '<button class="btn btn-primary" type="button" data-action="devi-simulate">Simulate Devi alert</button>' +
      '<button class="btn btn-ghost" type="button" data-page="devi-inbox">Open incoming requests' +
      (pendingCount() ? " (" + pendingCount() + ")" : "") + "</button></div>";

    return (flash ? '<div class="devi-toast">' + esc(flash) + "</div>" : "") + actions +
      '<div class="devi-grid two">' + status + channels + "</div>" +
      '<div class="devi-grid two" style="margin-top:16px">' + rules + keys + "</div>";
  }

  function renderInbox() {
    var pending = inbox.filter(function (x) { return x.status === "pending"; });
    var done = inbox.filter(function (x) { return x.status !== "pending"; });
    var tools = '<div class="devi-toolbar">' +
      '<button class="btn btn-primary btn-sm" type="button" data-action="devi-simulate">Simulate Devi alert</button>' +
      '<button class="btn btn-ghost btn-sm" type="button" data-page="devi">Devi settings</button>' +
      '<span class="panel-sub" style="margin:0">' + pending.length + " waiting for your approval</span></div>";

    function card(item) {
      var s = stats(item);
      var feat = s.featured;
      var canApprove = !!(feat && s.alertCount >= 0 && feat);
      var cls = "devi-card";
      if (item.status === "approved") cls += " is-approved";
      if (item.status === "dismissed") cls += " is-dismissed";
      if (item.low) cls += " is-low";
      if (!feat) cls += " is-none";
      var stLab = item.status === "pending" ? badge("pending") : item.status === "approved" ? badge("approved") : badge("declined");
      var memberLine;
      if (!feat) {
        memberLine = '<span class="pill">No ' + esc(item.trade) + " in " + esc(item.city) + " to recommend</span>";
      } else {
        memberLine = '<span class="pill">' + s.alertCount + " " + esc(item.city) + " members will be alerted · " +
          esc(plural(item.trade)) + " excluded</span>";
      }
      var featuredHtml = "";
      if (feat) {
        var change = "";
        if (item.status === "pending" && s.candidates && s.candidates.length > 1) {
          change = '<select data-action="devi-feature" data-id="' + item.id + '" style="margin-left:auto;font:inherit;font-weight:700;border:1.5px solid var(--line,#D5DDE6);border-radius:10px;padding:6px 8px;background:#fff">' +
            s.candidates.map(function (m) {
              return '<option value="' + m.id + '"' + (m.id === feat.id ? " selected" : "") + ">" + esc(fullName(m)) + "</option>";
            }).join("") + "</select>";
        } else if (item.status === "pending" && s.candidates && s.candidates.length === 1) {
          change = '<span class="devi-note" style="margin:0 0 0 auto">Only one ' + esc(item.trade.toLowerCase()) + " in " + esc(item.city) + "</span>";
        }
        featuredHtml = '<div class="devi-featured"><div class="av av-navy" style="width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(180deg,#2E86F0,#1658C7);color:#fff;font-weight:800;font-size:12px">' +
          esc(initials(feat)) + '</div><div class="feat-meta"><strong>Featured: ' + esc(fullName(feat)) + "</strong><span>" +
          esc(feat.business) + " · Let’s help " + esc(firstName(feat)) + "</span></div>" + change + "</div>";
        if (item.featuredId === "jamie" || feat.id === "jamie") {
          featuredHtml += '<p class="devi-note" style="margin:-4px 0 12px">Jamie Hale (Pest Control) is featured, so this alert is not sent to Jamie or any other pest controller.</p>';
        }
      }
      var actions = "";
      if (item.status === "pending") {
        var disable = !feat ? " disabled title=\"No member of this trade in this city\"" : "";
        actions = '<div class="devi-actions">' +
          '<button class="btn btn-primary" type="button" data-action="devi-approve" data-id="' + item.id + '"' + disable + ">Approve &amp; alert</button>" +
          '<button class="btn btn-ghost" type="button" data-action="devi-edit" data-id="' + item.id + '">Edit trade or city</button>' +
          '<button class="btn btn-ghost" type="button" data-action="devi-dismiss" data-id="' + item.id + '">Dismiss</button></div>' +
          '<div class="approve-link">Approve link · https://api.ratebuddies.com/hooks/approve/' + esc(item.id) + "?token=" + esc(item.token) + "</div>";
      } else if (item.status === "approved") {
        actions = '<p class="devi-note" style="margin:0">Approved' + (item.approvedAt ? " · " + esc(item.approvedAt) : "") +
          ". Published to the Recommend feed. " + s.alertCount + " " + esc(item.city) + " members were asked to recommend " +
          (feat ? esc(firstName(feat)) : "the featured member") + ". (Prototype only.)</p>";
      } else {
        actions = '<p class="devi-note" style="margin:0">Dismissed. Members were not notified.</p>';
      }
      var edit = "";
      if (editing === item.id) {
        edit = '<div class="devi-edit">' +
          '<div class="field"><label>Trade wanted</label><input id="editTrade" type="text" value="' + esc(item.trade) + '"></div>' +
          '<div class="field"><label>City</label><input id="editCity" type="text" value="' + esc(item.city) + '"></div>' +
          '<button class="btn btn-primary btn-sm" type="button" data-action="devi-save-edit" data-id="' + item.id + '">Save</button></div>';
      }
      return '<article class="' + cls + '"><div class="devi-card-top"><div>' +
        '<div class="group">' + facebookF(14, "#1877F2") + " " + esc(item.group) + "</div>" +
        '<div class="when">' + esc(item.when) + " · keyword “" + esc(item.keyword) + "”</div></div>" + stLab + "</div>" +
        '<p class="snippet">“' + esc(item.snippet) + '”</p>' +
        '<div class="devi-meta"><span class="pill trade">' + esc(item.trade) + " wanted</span>" +
        '<span class="pill">' + esc(item.city) + "</span>" +
        confBadge(item.confidence) + memberLine + "</div>" +
        '<p class="devi-place">Post mentions ' + esc(item.place) + "</p>" +
        featuredHtml + actions + edit + "</article>";
    }

    return (flash ? '<div class="devi-toast">' + esc(flash) + "</div>" : "") + tools +
      panel("Waiting for you", "Tap Approve and the request is published automatically. Members in that city (except the same trade) are asked to recommend the featured member. You do not need any further admin steps.", "",
        pending.length ? pending.map(card).join("") : '<p class="panel-sub">Nothing waiting. Use Simulate Devi alert to try a new match.</p>') +
      (done.length ? '<div style="height:16px"></div>' + panel("Already handled", "", "", done.map(card).join("")) : "");
  }

  function approve(id) {
    var item = inbox.filter(function (x) { return x.id === id; })[0];
    if (!item) return "Could not find that match.";
    var s = stats(item);
    if (!s.featured) return "There is no " + item.trade.toLowerCase() + " in " + item.city + " to recommend, so this can’t be approved.";
    item.status = "approved";
    item.approvedAt = "Just now";
    return "Approved. The request is in the Recommend feed. " + s.alertCount + " " + item.city +
      " members have been asked to recommend " + firstName(s.featured) + ". " +
      (s.sameTradeCount ? (s.sameTradeCount + " " + plural(item.trade) + " were not alerted.") : "");
  }

  function pageHTML(page) {
    if (page === "devi") return renderConnection();
    if (page === "devi-inbox") return renderInbox();
    return null;
  }

  function handle(a, id, btn, e) {
    if (a === "devi-copy-hook") {
      var inp = document.getElementById("deviWebhook");
      if (inp) {
        inp.select();
        try { navigator.clipboard.writeText(inp.value); } catch (err) {}
      }
      flash = "Placeholder webhook copied. It will work once the backend is live.";
      return true;
    }
    if (a === "devi-channel") {
      settings.channels[id] = !settings.channels[id];
      if (!settings.channels.grok && !settings.channels.email && !settings.channels.sms && !settings.channels.push) {
        settings.channels.grok = true;
        flash = "At least one approval channel has to stay on. Grok Bot is selected.";
      } else {
        flash = "";
      }
      return true;
    }
    if (a === "devi-mode") {
      settings.autoPublish = id === "auto";
      flash = settings.autoPublish
        ? "High-confidence matches will publish on their own. You can still review the rest in Incoming requests."
        : "Review first is on. You’ll get an Approve card for each match.";
      return true;
    }
    if (a === "devi-approve") {
      flash = approve(id);
      editing = null;
      return true;
    }
    if (a === "devi-dismiss") {
      inbox.forEach(function (x) { if (x.id === id) x.status = "dismissed"; });
      flash = "Dismissed. Members were not notified.";
      editing = null;
      return true;
    }
    if (a === "devi-edit") {
      editing = editing === id ? null : id;
      flash = "";
      return true;
    }
    if (a === "devi-save-edit") {
      var item = inbox.filter(function (x) { return x.id === id; })[0];
      var trade = document.getElementById("editTrade");
      var city = document.getElementById("editCity");
      if (item && trade && city) {
        item.trade = trade.value.trim() || item.trade;
        item.city = city.value.trim() || item.city;
        item.low = false;
        var s = stats(item);
        item.featuredId = s.featured ? s.featured.id : "";
      }
      editing = null;
      flash = "Trade and city updated. You can Approve & alert when you’re happy.";
      return true;
    }
    if (a === "devi-feature") {
      var it = inbox.filter(function (x) { return x.id === id; })[0];
      var val = btn && btn.value;
      if (it && val && it.featuredId !== val) {
        it.featuredId = val;
        var picked = stats(it).featured;
        flash = "Featured member set to " + (picked ? fullName(picked) : val) + ". Members will be asked to recommend " + (picked ? firstName(picked) : "them") + ".";
      }
      return true;
    }
    if (a === "devi-simulate") {
      simN += 1;
      var clone = {
        id: "d-sim-" + simN,
        status: "pending",
        group: "Stirling Community Board (demo)",
        snippet: "Does anyone have a locksmith they trust in Osborne Park? Locked out this afternoon.",
        keyword: "locksmith",
        trade: "Locksmith",
        place: "Osborne Park",
        city: cityOf("Osborne Park") || "Perth",
        featuredId: "chris",
        confidence: 88,
        link: "https://www.facebook.com/groups/stirling.community.demo/posts/551902",
        when: "Just now",
        token: "demo-sim-" + simN
      };
      var s2 = stats(clone);
      var auto = settings.autoPublish && clone.confidence >= settings.minConfidence && s2.featured;
      if (auto) {
        clone.status = "approved";
        clone.approvedAt = "Just now";
        flash = "Simulated Devi alert auto-published. " + s2.alertCount + " " + clone.city +
          " members were asked to recommend " + firstName(s2.featured) + ".";
      } else {
        var via = [];
        if (settings.channels.grok) via.push("Grok Bot");
        if (settings.channels.email) via.push("email");
        if (settings.channels.sms) via.push("SMS");
        if (settings.channels.push) via.push("push");
        flash = "Simulated Devi alert received. An Approve card was sent via " + via.join(", ") +
          " to recommend " + (s2.featured ? firstName(s2.featured) : "the featured member") +
          ". Nothing is published until you approve.";
      }
      inbox.unshift(clone);
      settings.lastAlert = "Just now";
      return true;
    }
    return false;
  }

  function attach() {
    document.addEventListener("input", function (e) {
      if (e.target && e.target.id === "deviMinConf") {
        settings.minConfidence = Number(e.target.value) || 70;
        var lab = document.getElementById("deviMinConfVal");
        if (lab) lab.textContent = settings.minConfidence + "%";
      }
    });
    document.addEventListener("change", function (e) {
      var el = e.target.closest("[data-action='devi-feature']");
      if (!el) return;
      if (window.TC180Admin && TC180Admin.handle) {
        if (TC180Admin.handle("devi-feature", el.getAttribute("data-id"), el, e)) {
          if (window.TCAdmin && TCAdmin.paint) TCAdmin.paint();
        }
      }
    });
  }

  window.TC180Admin = {
    pageHTML: pageHTML,
    handle: handle,
    pendingCount: pendingCount,
    attach: attach,
    settings: settings,
    inbox: inbox,
    grokBlurb: grokBlurb
  };
})();
