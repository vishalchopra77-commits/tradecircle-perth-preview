/* TradeCircle Perth — super admin prototype v1.5 */
(function () {
  "use strict";
  var trades = (window.TC_TRADES || []).slice();
  var requests = [
    { id: "p1", first: "Nina", last: "Kaur", business: "Kaur Tiling", trade: "Tiler", areas: "South, Fremantle", phone: "0412 000 201", status: "pending", when: "Today 8:10 am", bio: "Bathroom and floor tiling across the southern suburbs." },
    { id: "p2", first: "Owen", last: "Wright", business: "Wright Roofing Co", trade: "Roofer", areas: "Hills, North", phone: "0412 000 202", status: "pending", when: "Today 7:44 am", bio: "Roof repairs and restorations. Family-run." },
    { id: "p3", first: "Ayla", last: "Santos", business: "Santos Cleaning", trade: "End of Lease Cleaner", areas: "Central / CBD", phone: "0412 000 203", status: "pending", when: "Yesterday", bio: "End-of-lease and after-builders cleans." }
  ];
  var members = [
    { id: "jamie", name: "Jamie Hale", business: "Hale Pest Control", trade: "Pest Control", areas: "Hills, North", status: "active" },
    { id: "sarah", name: "Sarah Nguyen", business: "Nguyen Carpentry", trade: "Carpenter", areas: "North, Joondalup", status: "active" },
    { id: "liam", name: "Liam O’Connor", business: "O’Connor Plumbing", trade: "Plumber", areas: "South, Fremantle", status: "active" },
    { id: "priya", name: "Priya Sharma", business: "Sharma Painting Co", trade: "Painter", areas: "Hills, East", status: "active" },
    { id: "mei", name: "Mei Chen", business: "West Coast Gardens", trade: "Landscaper", areas: "Hills, East", status: "active" },
    { id: "marcus", name: "Marcus Adeyemi", business: "Adeyemi Electrical", trade: "Electrician", areas: "Kwinana, South", status: "suspended" }
  ];
  var regions = ["Hills", "Kwinana", "North", "South", "East", "Central / CBD", "Fremantle", "Rockingham", "Joondalup", "Armadale"];
  var queue = [
    { pos: 1, name: "Priya Sharma", plan: "Free turn" },
    { pos: 2, name: "Tom Reeves", plan: "Free turn" },
    { pos: 3, name: "Mei Chen", plan: "Free turn" },
    { pos: 4, name: "Jamie Hale", plan: "Free turn" },
    { pos: 5, name: "Hannah Lewis", plan: "Free turn" }
  ];
  var flags = [
    { id: "f1", who: "Anonymous", about: "A group chat message", reason: "Off-topic promotion", status: "open" },
    { id: "f2", who: "Sarah Nguyen", about: "Member profile", reason: "Wrong trade listed", status: "open" }
  ];
  var audit = [
    { at: "Today 9:12 am", who: "Vishal (you)", action: "Signed in to admin (demo)" },
    { at: "Yesterday", who: "Vishal (you)", action: "Approved Emma Brooks" },
    { at: "Mon", who: "System", action: "Jamie Hale requested a promotion turn" }
  ];
  var page = "dashboard";
  var q = "";

  var NAV = [
    ["dashboard", "Dashboard"],
    ["requests", "New profile requests"],
    ["members", "Members"],
    ["regions", "Regions"],
    ["trades", "Trades"],
    ["alerts", "Recommendation alerts"],
    ["queue", "Promotion queue"],
    ["reports", "Reports"],
    ["chats", "Chat moderation"],
    ["plans", "Subscriptions"],
    ["ai", "AI integrations"],
    ["broadcast", "Broadcast"],
    ["settings", "Settings"],
    ["audit", "Audit log"]
  ];

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

  function renderNav() {
    $("nav").innerHTML = NAV.map(function (it) {
      return '<button type="button" class="nav-btn' + (page === it[0] ? " active" : "") + '" data-page="' + it[0] + '">' + it[1] + "</button>";
    }).join("") + '<button type="button" class="nav-btn" data-page="out">Sign out</button>';
  }

  function kpis() {
    var pending = requests.filter(function (r) { return r.status === "pending"; }).length;
    return '<div class="kpis">' +
      kpi(pending, "Profiles waiting") +
      kpi(members.filter(function (m) { return m.status === "active"; }).length, "Active members") +
      kpi(queue.length, "In the promo queue") +
      kpi(flags.filter(function (f) { return f.status === "open"; }).length, "Open reports") +
      "</div>";
  }
  function kpi(n, l) { return '<div class="kpi"><div class="n">' + n + '</div><div class="l">' + l + "</div></div>"; }

  function pageHTML() {
    if (page === "dashboard") {
      return kpis() +
        '<div class="panel"><h2>Needs your attention</h2><p>There are ' +
        requests.filter(function (r) { return r.status === "pending"; }).length +
        " new profile requests to approve or decline. Open <strong>New profile requests</strong> to review them.</p></div>" +
        '<div class="panel"><h2>Today (fictional)</h2><p>2 recommendation alerts sent. 1 review-back completed. No payments collected — all prices are still “to be set”.</p></div>';
    }
    if (page === "requests") {
      return '<div class="panel"><h2>New profile requests</h2>' +
        requests.map(function (r) {
          return '<div style="border:1px solid var(--line);border-radius:14px;padding:12px;margin-bottom:10px">' +
            "<strong>" + esc(r.first) + " " + esc(r.last) + "</strong> · " + esc(r.business) +
            ' <span class="badge ' + (r.status === "pending" ? "b-wait" : r.status === "approved" ? "b-ok" : "b-no") + '">' + r.status + "</span>" +
            "<div style='color:var(--muted);font-size:13px;font-weight:650;margin:6px 0'>" + esc(r.trade) + " · " + esc(r.areas) + " · " + esc(r.when) + "<br>" + esc(r.bio) + "<br>Phone (fictional): " + esc(r.phone) + "</div>" +
            (r.status === "pending" ? '<div class="row-actions"><button class="btn btn-primary btn-sm" data-act="approve" data-id="' + r.id + '">Approve</button>' +
              '<button class="btn btn-danger btn-sm" data-act="decline" data-id="' + r.id + '">Decline</button></div>' : "") +
            "</div>";
        }).join("") + "</div>";
    }
    if (page === "members") {
      var list = members.filter(function (m) {
        return !q || (m.name + m.business + m.trade).toLowerCase().indexOf(q) !== -1;
      });
      return '<div class="panel"><h2>Members</h2><div class="search"><input id="memSearch" placeholder="Search name, business or trade" value="' + esc(q) + '"></div>' +
        "<table><thead><tr><th>Name</th><th>Business</th><th>Trade</th><th>Areas</th><th>Status</th><th></th></tr></thead><tbody>" +
        list.map(function (m) {
          return "<tr><td data-label=Name>" + esc(m.name) + "</td><td data-label=Business>" + esc(m.business) + "</td><td data-label=Trade>" + esc(m.trade) +
            "</td><td data-label=Areas>" + esc(m.areas) + '</td><td data-label=Status><span class="badge ' + (m.status === "active" ? "b-ok" : "b-no") + '">' + m.status + "</span></td>" +
            '<td data-label=Actions class="row-actions"><button class="btn btn-ghost btn-sm" data-act="edit-mem" data-id="' + m.id + '">Edit</button>' +
            '<button class="btn btn-danger btn-sm" data-act="suspend" data-id="' + m.id + '">' + (m.status === "active" ? "Suspend" : "Reactivate") + "</button></td></tr>";
        }).join("") + "</tbody></table></div>";
    }
    if (page === "regions") {
      return '<div class="panel"><h2>Perth regions</h2><p>Members can join more than one, or all of Perth metro.</p><ul>' +
        regions.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul></div>";
    }
    if (page === "trades") {
      var shown = trades.filter(function (t) { return !q || t.toLowerCase().indexOf(q) !== -1; });
      return '<div class="panel"><h2>Trades (' + trades.length + ")</h2><p>Sourced from Australian directories — see TRADES-SOURCES.md. Search and remove in this prototype only.</p>" +
        '<div class="search"><input id="memSearch" placeholder="Search trades" value="' + esc(q) + '"><button class="btn btn-navy btn-sm" type="button" data-act="add-trade">Add a trade</button></div>' +
        "<p>" + shown.map(function (t) { return '<span class="badge b-ok" style="margin:0 6px 6px 0">' + esc(t) + "</span>"; }).join("") + "</p></div>";
    }
    if (page === "alerts") {
      return '<div class="panel"><h2>Recommendation alerts log</h2><table><thead><tr><th>When</th><th>Trade</th><th>Posted by</th><th>Status</th><th>Helped</th></tr></thead><tbody>' +
        "<tr><td data-label=When>Today 8:16 am</td><td data-label=Trade>Pest Control</td><td data-label=From>Jamie Hale</td><td data-label=Status>Open</td><td data-label=Helped>Sarah, Mei</td></tr>" +
        "<tr><td data-label=When>Yesterday</td><td data-label=Trade>Plumber</td><td data-label=From>Emma Brooks</td><td data-label=Status>Handled</td><td data-label=Helped>Liam, Chris</td></tr>" +
        "</tbody></table></div>";
    }
    if (page === "queue") {
      return '<div class="panel"><h2>Promotion queue</h2><p>Ordinary turns are free. “Jump the queue” is later, with the price still to be set. No payments are collected here.</p><table><thead><tr><th>#</th><th>Member</th><th>Type</th><th></th></tr></thead><tbody>' +
        queue.map(function (r) {
          return "<tr><td data-label=#>" + r.pos + "</td><td data-label=Member>" + esc(r.name) + "</td><td data-label=Type>" + esc(r.plan) +
            '</td><td data-label=Actions class="row-actions"><button class="btn btn-ghost btn-sm" data-act="move-up">Move up</button><button class="btn btn-danger btn-sm" data-act="remove-q">Remove</button></td></tr>';
        }).join("") + "</tbody></table></div>";
    }
    if (page === "reports") {
      return '<div class="panel"><h2>Reports and flagged content</h2>' + flags.map(function (f) {
        return '<div style="border:1px solid var(--line);border-radius:14px;padding:12px;margin-bottom:10px"><strong>' + esc(f.reason) + "</strong> — " + esc(f.about) +
          " <div style='color:var(--muted);font-size:13px'>From " + esc(f.who) + '</div><div class="row-actions" style="margin-top:8px"><button class="btn btn-primary btn-sm" data-act="resolve" data-id="' + f.id + '">Mark resolved</button></div></div>';
      }).join("") + "</div>";
    }
    if (page === "chats") {
      return '<div class="panel"><h2>Chat moderation</h2><p>This is a prototype view of recent conversations (fictional).</p><ul><li>Hills tradies — 2 unread, last message about a Mundaring job.</li><li>Jamie Hale and Sarah Nguyen — kitchen photo shared.</li><li>No blocked members at the moment.</li></ul></div>';
    }
    if (page === "plans") {
      return '<div class="panel"><h2>Subscriptions and plans</h2><p>The app is free for now. A Pro plan can be added later.</p><p><strong>Free</strong> — current, everything included.</p><p><strong>Pro (coming later)</strong> — <span class="badge b-wait">Price to be set</span></p><p><strong>Jump the queue</strong> — <span class="badge b-wait">Price to be set</span>. In the real product, in-app payments would go through Apple and Google. A web payment could use Stripe.</p></div>';
    }
    if (page === "ai") {
      return '<div class="panel"><h2>AI integrations</h2><p>Members connect their own Grok, ChatGPT, Claude or other assistant. This dashboard would later show usage and connection errors. Nothing is connected in this prototype.</p><ul><li>Voice commands may open Facebook or Google pages, but must never send a friend request or post a review.</li><li>All connections should be clearly labelled as the member’s own account.</li></ul></div>';
    }
    if (page === "broadcast") {
      return '<div class="panel"><h2>Broadcast notification</h2><div class="field"><label>Title</label><input placeholder="For example: Weekend meet-up reminder"></div><div class="field"><label>Message</label><textarea rows="3" placeholder="Write a short update for all members"></textarea></div><button class="btn btn-navy btn-sm" data-act="broadcast" type="button">Send mock broadcast</button><p style="color:var(--muted);font-size:13px">Prototype only — no real push is sent.</p></div>';
    }
    if (page === "settings") {
      return '<div class="panel"><h2>Settings</h2><p>App name: TradeCircle Perth (placeholder).</p><p>New members must be approved: <strong>Yes</strong>.</p><p>Weekly meet-ups stay offline.</p><p>Review helper stays ideas-only.</p></div>';
    }
    if (page === "audit") {
      return '<div class="panel"><h2>Audit log</h2><table><thead><tr><th>When</th><th>Who</th><th>Action</th></tr></thead><tbody>' +
        audit.map(function (a) { return "<tr><td data-label=When>" + esc(a.at) + "</td><td data-label=Who>" + esc(a.who) + "</td><td data-label=Action>" + esc(a.action) + "</td></tr>"; }).join("") +
        "</tbody></table></div>";
    }
    return "";
  }

  function paint() {
    var titles = {};
    NAV.forEach(function (it) { titles[it[0]] = it[1]; });
    $("pageTitle").textContent = titles[page] || "Dashboard";
    renderNav();
    $("page").innerHTML = pageHTML();
    closeMenu();
  }

  function openMenu() { $("side").classList.add("open"); $("backdrop").classList.remove("hidden"); }
  function closeMenu() { $("side").classList.remove("open"); $("backdrop").classList.add("hidden"); }

  $("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    $("loginView").classList.add("hidden");
    $("appView").classList.remove("hidden");
    paint();
  });
  $("menuBtn").addEventListener("click", openMenu);
  $("backdrop").addEventListener("click", closeMenu);
  document.addEventListener("click", function (e) {
    var nav = e.target.closest("[data-page]");
    if (nav) {
      var next = nav.getAttribute("data-page");
      if (next === "out") {
        $("appView").classList.add("hidden");
        $("loginView").classList.remove("hidden");
        return;
      }
      page = next; q = ""; paint();
      return;
    }
    var act = e.target.closest("[data-act]");
    if (!act) return;
    var a = act.getAttribute("data-act");
    var id = act.getAttribute("data-id");
    if (a === "approve" || a === "decline") {
      requests.forEach(function (r) { if (r.id === id) r.status = a === "approve" ? "approved" : "declined"; });
      audit.unshift({ at: "Just now", who: "Vishal (you)", action: (a === "approve" ? "Approved" : "Declined") + " a profile request" });
      paint();
    }
    if (a === "suspend") {
      members.forEach(function (m) { if (m.id === id) m.status = m.status === "active" ? "suspended" : "active"; });
      paint();
    }
    if (a === "edit-mem") { alert("In a real build this would open an edit form. This is a prototype."); }
    if (a === "add-trade") {
      var name = prompt("Trade name to add (prototype only)");
      if (name && name.trim()) { trades.unshift(name.trim()); paint(); }
    }
    if (a === "resolve") { flags = flags.filter(function (f) { return f.id !== id; }); paint(); }
    if (a === "broadcast") { audit.unshift({ at: "Just now", who: "Vishal (you)", action: "Sent a mock broadcast" }); alert("Mock broadcast queued. No real notification was sent."); }
    if (a === "move-up" || a === "remove-q") { alert("Queue change saved in this prototype only."); }
  });
  document.addEventListener("input", function (e) {
    if (e.target.id === "memSearch") { q = e.target.value; paint(); var again = $("memSearch"); if (again) { again.value = q; again.focus(); again.setSelectionRange(q.length, q.length); } }
  });

  if (/[?&]shot=/.test(location.search) || location.hash === "#app") {
    $("loginView").classList.add("hidden");
    $("appView").classList.remove("hidden");
    var m = location.search.match(/shot=([a-z-]+)/);
    if (m && m[1] && m[1] !== "login") page = m[1];
    if (location.hash.replace("#", "") && location.hash !== "#app") page = location.hash.replace("#", "");
    paint();
  }
})();
