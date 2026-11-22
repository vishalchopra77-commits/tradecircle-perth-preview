/* Rate Buddies v2.2.2b — web admin live bridge, part 2.
   Fills the remaining admin pages from the Supabase test project, in place, without changing the layout:
   Dashboard (KPIs, weekly charts, recent activity), bell, Members (suspend / reactivate, save links),
   Promotion queue (move up / remove = archive), Reports (resolve), Chat moderation, Support inbox,
   Recommendation alerts, Facebook recommendations (post + list), Trades (add), Regions (add),
   Settings (switches, daily Google Review cap, badge levels), AI switches, Broadcast (real notifications),
   Subscriptions counts, Audit log, and a new Feature ideas page (status changes). Nothing is deleted:
   "Remove" archives. Does nothing in Demo (offline) mode. */
(function (root) {
  "use strict";
  function A() { return root.TCAdmin || {}; }
  function live() { return !!(root.RB && !RB.isDemo() && RB.session && RB.isAdmin && RB.client); }
  function db() { return RB.client; }
  function esc(s) { return A().esc ? A().esc(s) : String(s == null ? "" : s); }
  function fill(arr, items) { if (!arr) return; arr.splice(0, arr.length); items.forEach(function (x) { arr.push(x); }); }
  function when(iso) { if (!iso) return ""; try { return new Date(iso).toLocaleString("en-AU", { timeZone: "Australia/Perth", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }); } catch (e) { return ""; } }
  function day(iso) { try { return new Date(iso).toLocaleDateString("en-AU", { timeZone: "Australia/Perth", day: "numeric", month: "short" }); } catch (e) { return ""; } }
  function repaint() { if (A().paint) A().paint(); }
  var names = {}, trades = {}, cache = { settings: {}, queueIds: {}, features: [], support: [] };
  function nameOf(id) { return names[id] || "A member"; }
  /* v2.2.2 b16: DM -> the other member (name + trade); group -> the group / region name */
  function toOf(convId, senderId) {
    if ((cache.convKind || {})[convId] === "group") return { name: (cache.convName || {})[convId] || "Group chat", sub: "Group chat" };
    var others = ((cache.convMem || {})[convId] || []).filter(function (x) { return x !== senderId; });
    if (!others.length) return { name: "", sub: "" };
    return { name: nameOf(others[0]), sub: trades[others[0]] || "" };
  }

  async function audit(action, target) {
    try { await db().from("admin_audit").insert({ admin_id: RB.session.user.id, action: String(action).slice(0, 300), target: target || "" }); } catch (e) {}
  }

  /* ---------- after rb-admin.js loaded profiles + requests ---------- */
  async function afterHydrate(profiles, reqs) {
    if (!live()) return;
    names = {}; trades = {};
    (profiles || []).forEach(function (p) { names[p.id] = p.name || ((p.first || "") + " " + (p.last || "")).trim(); trades[p.id] = p.trade || ""; });
    var res = await Promise.all([
      db().from("facebook_queue").select("id,member_id,place,status,created_at,scheduled_for").in("status", ["waiting", "scheduled"]).order("place"),
      db().from("member_reports").select("id,reporter_id,target_member_id,conversation_id,about,reason,status,created_at").order("created_at", { ascending: false }).limit(100),
      db().from("admin_audit").select("admin_id,action,target,created_at").order("created_at", { ascending: false }).limit(100),
      db().from("chat_messages").select("id,conversation_id,sender_id,body,created_at,hidden").order("created_at", { ascending: false }).limit(50),
      db().from("conversations").select("id,kind,title"),
      db().from("rec_progress").select("request_id,member_id"),
      db().from("app_settings").select("key,value"),
      db().from("notifications").select("title,body,kind,created_at,member_id").order("created_at", { ascending: false }).limit(12),
      db().from("support_messages").select("id,member_id,from_admin,topic,body,read_by_admin,created_at").order("created_at", { ascending: true }),
      db().from("conversation_members").select("conversation_id,member_id")
    ]);
    var cmembers = (res[9] && res[9].data) || []; /* v2.2.2 b16: who each message was sent TO */
    var q = res[0].data || [], reps = res[1].data || [], aud = res[2].data || [], msgs = res[3].data || [], convs = res[4].data || [], prog = res[5].data || [], sets = res[6].data || [], notes = res[7].data || [], sup = res[8].data || [];
    reqs = reqs || root.__rbRequests || [];
    /* promotion queue */
    cache.queueIds = {};
    fill(A().queue, q.map(function (r, i) { cache.queueIds[String(i + 1)] = r.id; return { pos: i + 1, name: nameOf(r.member_id), plan: "Free turn", when: r.scheduled_for ? day(r.scheduled_for) : "Joined " + day(r.created_at), paid: false, id: r.id }; }));
    /* reports */
    fill(A().flags, reps.filter(function (r) { return r.status === "open"; }).map(function (r) { return { id: r.id, who: nameOf(r.reporter_id), about: r.about + (r.target_member_id ? " · " + nameOf(r.target_member_id) : ""), reason: r.reason, status: "open", when: when(r.created_at) }; }));
    /* audit */
    fill(A().audit, aud.map(function (a) { return { at: when(a.created_at), who: a.admin_id === RB.session.user.id ? "You" : nameOf(a.admin_id), action: a.action + (a.target ? " — " + a.target : "") }; }));
    /* chat moderation */
    var convName = {}, convKind = {}, convMem = {}; convs.forEach(function (c) { convName[c.id] = c.kind === "group" ? (c.title || "Group chat") : "Direct message"; convKind[c.id] = c.kind; });
    cmembers.forEach(function (r) { (convMem[r.conversation_id] = convMem[r.conversation_id] || []).push(r.member_id); });
    cache.convMem = convMem; cache.convName = convName; cache.convKind = convKind;
    /* v2.2.2 b16 QA #2: moderation needs the ids; Flag = Reported when an open member report points at this conversation */
    var reportedConv = {}; reps.forEach(function (r) { if (r.status === "open" && r.conversation_id) reportedConv[r.conversation_id] = true; });
    var statusOf = {}; (profiles || []).forEach(function (p) { statusOf[p.id] = p.status; });
    fill(A().chats, msgs.map(function (m) { var t = toOf(m.conversation_id, m.sender_id); return { id: m.id, convId: m.conversation_id, senderId: m.sender_id, hidden: !!m.hidden, senderActive: statusOf[m.sender_id] === "approved" && !(profiles || []).some(function (p) { return p.id === m.sender_id && p.role === "admin"; }), room: convName[m.conversation_id] || "Chat", from: nameOf(m.sender_id), to: t.name, toSub: t.sub, text: m.body, flag: m.hidden ? "Hidden" : (reportedConv[m.conversation_id] ? "Reported" : "None"), when: when(m.created_at) }; }));
    /* alerts + Facebook recommendations from recommendation_requests */
    var helped = {}; prog.forEach(function (p) { helped[p.request_id] = (helped[p.request_id] || 0) + 1; });
    var approved = reqs.filter(function (r) { return r.status === "approved"; });
    fill(A().alerts, reqs.filter(function (r) { return r.status !== "dismissed"; }).map(function (r) {
      return { id: r.id, trade: r.trade || "", by: r.created_by ? nameOf(r.created_by) : (r.source === "devi" ? "Devi" : "Admin"), status: r.status === "approved" ? ((helped[r.id] || 0) >= (r.of_count || 1) ? "Handled" : "Open") : "Waiting", comments: helped[r.id] || 0, when: when(r.created_at), post: (r.group_name ? r.group_name + " — " : "") + (r.ask || r.snippet || "") };
    }));
    fill(A().fbPosts, approved.map(function (r) {
      return { id: r.id, group: r.group_name || "", ask: r.ask || r.snippet || "", member: nameOf(r.featured_member_id), trade: r.trade || "", link: r.post_link || "", when: when(r.approved_at || r.created_at), vouched: helped[r.id] || 0, of: Math.max(1, r.of_count || 1), status: (helped[r.id] || 0) >= (r.of_count || 1) ? "Done" : "Open", notified: true };
    }));
    /* charts: last 6 weeks */
    var now = Date.now(), wk = 7 * 864e5, labels = [], mv = [0, 0, 0, 0, 0, 0], av = [0, 0, 0, 0, 0, 0];
    for (var i = 5; i >= 0; i--) labels.push(day(new Date(now - i * wk - 6 * 864e5)));
    function bucket(iso) { var d = (now - new Date(iso).getTime()) / wk; return d < 0 || d >= 6 ? -1 : 5 - Math.floor(d); }
    (profiles || []).forEach(function (p) { if (p.role !== "admin" && p.created_at) { var b = bucket(p.created_at); if (b >= 0) mv[b]++; } });
    approved.forEach(function (r) { var b = bucket(r.approved_at || r.created_at); if (b >= 0) av[b]++; });
    var mw = A().memberWeeks, aw = A().alertWeeks;
    if (mw) { fill(mw.labels, labels); fill(mw.values, mv); }
    if (aw) { fill(aw.labels, labels); fill(aw.values, av); }
    var pendingWeek = (profiles || []).filter(function (p) { return p.status === "pending" && now - new Date(p.created_at).getTime() < wk; }).length;
    var joinedMonth = (profiles || []).filter(function (p) { return p.status === "approved" && p.role !== "admin" && now - new Date(p.approved_at || p.created_at).getTime() < 30 * 864e5; }).length;
    root.__rbKpi = { alertsWeek: av[5], alertsTrend: (av[5] - av[4] >= 0 ? "+" : "") + (av[5] - av[4]) + " vs last week", pendingTrend: "+" + pendingWeek + " this week", membersTrend: "+" + joinedMonth + " this month", queueTrend: q.length ? "Next: " + nameOf(q[0].member_id) : "No one waiting" };
    /* recent activity + bell */
    var act = [];
    (profiles || []).filter(function (p) { return p.status === "pending"; }).slice(0, 3).forEach(function (p) { act.push({ type: "member", text: (p.name || "A member") + " applied to join.", at: when(p.created_at), t: p.created_at, go: "requests" }); });
    aud.slice(0, 4).forEach(function (a) { act.push({ type: "admin", text: a.action + (a.target ? " — " + a.target : ""), at: when(a.created_at), t: a.created_at, go: "audit" }); });
    notes.slice(0, 4).forEach(function (n) { act.push({ type: n.kind === "swap_request" ? "review" : n.kind === "approved" ? "admin" : "alert", text: n.title + " → " + nameOf(n.member_id), at: when(n.created_at), t: n.created_at, go: "dashboard" }); });
    reqs.filter(function (r) { return r.status === "pending"; }).slice(0, 3).forEach(function (r) { act.push({ type: "alert", text: "Recommendation request waiting: " + (r.trade || "") + (r.created_by ? " (from " + nameOf(r.created_by) + ")" : ""), at: when(r.created_at), t: r.created_at, go: "devi-inbox" }); });
    reps.filter(function (r) { return r.status === "open"; }).slice(0, 2).forEach(function (r) { act.push({ type: "limit", text: nameOf(r.reporter_id) + " reported " + r.about.toLowerCase(), at: when(r.created_at), t: r.created_at, go: "reports" }); });
    act.sort(function (a, b) { return String(b.t).localeCompare(String(a.t)); });
    fill(A().activity, act.slice(0, 8));
    root.__rbAdminNotifs = act.slice(0, 6).map(function (a) { return [a.text, a.at, a.go]; });
    /* settings */
    cache.settings = {}; sets.forEach(function (s) { cache.settings[s.key] = s.value; });
    if (typeof cache.settings.review_daily_cap === "number") try { localStorage.setItem("tc_review_daily_limit", JSON.stringify(cache.settings.review_daily_cap)); } catch (e) {}
    if (Array.isArray(cache.settings.badge_tiers)) try { localStorage.setItem("tc_badge_tiers", JSON.stringify(cache.settings.badge_tiers)); } catch (e) {}
    /* support inbox */
    var byMem = {};
    sup.forEach(function (m) { (byMem[m.member_id] = byMem[m.member_id] || []).push(m); });
    cache.support = Object.keys(byMem).map(function (mid) {
      var list = byMem[mid], last = list[list.length - 1];
      return { memberId: mid, member: nameOf(mid), trade: trades[mid] || "", topic: (list.filter(function (x) { return x.topic; }).pop() || {}).topic || "General", last: last.body, when: when(last.created_at), open: !last.from_admin, unreadIds: list.filter(function (x) { return !x.from_admin && !x.read_by_admin; }).map(function (x) { return x.id; }), thread: list, t: last.created_at };
    }).sort(function (a, b) { return String(b.t).localeCompare(String(a.t)); });
    root.__rbSupportRows = cache.support.length ? cache.support : [{ member: "No messages yet", trade: "", topic: "Support", last: "When a member writes to Support in the app, it shows here.", when: "", open: false }];
    var sel = root.__rbSupportSel || 0;
    root.__rbSupportMember = (cache.support[sel] || {}).memberId || null;
    /* feature ideas */
    var fr = await db().from("feature_requests").select("id,author_id,title,body,category,status,status_reason,vote_count,created_at").order("vote_count", { ascending: false }).order("created_at", { ascending: false });
    cache.features = fr.data || [];
  }

  /* ---------- feature ideas page (new admin page, added to the menu) ---------- */
  var STATUSES = [["under_review", "Under review"], ["planned", "Planned"], ["in_progress", "In progress"], ["released", "Released"], ["declined", "Declined"], ["archived", "Archived"]];
  function featuresHTML() {
    var panel = A().panel;
    var rows = cache.features;
    var body = rows.length ? '<table><thead><tr><th>Idea</th><th>By</th><th>Votes</th><th>Status</th><th>Note to members</th><th></th></tr></thead><tbody>' + rows.map(function (f) {
      return '<tr><td data-label="Idea"><strong>' + esc(f.title) + '</strong><div class="panel-sub">' + esc(f.body) + '</div></td><td data-label="By">' + esc(nameOf(f.author_id)) + '</td><td data-label="Votes">' + (f.vote_count || 0) +
        '</td><td data-label="Status"><select data-feat-status="' + f.id + '">' + STATUSES.map(function (s) { return '<option value="' + s[0] + '"' + (s[0] === f.status ? " selected" : "") + ">" + s[1] + "</option>"; }).join("") + "</select></td>" +
        '<td data-label="Note"><input data-feat-reason="' + f.id + '" value="' + esc(f.status_reason || "") + '" maxlength="280" placeholder="Optional, shown to members"></td>' +
        '<td data-label=""><button class="btn btn-primary btn-sm" type="button" data-action="feat-save" data-id="' + f.id + '">Save</button></td></tr>';
    }).join("") + "</tbody></table>" : (A().empty ? A().empty("No ideas yet", "Ideas members suggest on the Feature Board show here.") : "No ideas yet");
    return panel ? panel("Feature ideas", rows.length + " ideas from members · change the status and members see it on the Feature Board", "", body) : body;
  }
  function addFeaturePage() {
    var nav = document.getElementById("nav");
    if (nav && !nav.querySelector('[data-page="features"]')) {
      var ref = nav.querySelector('[data-page="tutorials"]');
      var b = document.createElement("button");
      b.className = ref ? ref.className.replace(/\bactive\b/, "") : "nav-item"; b.setAttribute("data-page", "features"); b.type = "button";
      b.innerHTML = (A().I && A().I.ai ? A().I.ai : "") + "<span>Feature ideas</span>";
      if (ref && ref.parentNode) ref.parentNode.insertBefore(b, ref.nextSibling); else nav.appendChild(b);
    }
  }

  /* ---------- page text when live (keeps layout, drops "fictional" wording) ---------- */
  var LIVE_TEXT = [
    ["A sample of recent conversations. This is fictional.", "The 50 newest chat messages (live)."],
    ["A record of admin and system actions. Fictional.", "Admin actions saved in the database (live)."],
    ["This is a mock. Nothing is sent to real phones.", "Sends a real in-app notification to every approved member (live)."],
    ["Send mock broadcast", "Send broadcast"],
    ["Prototype only — changes stay in this browser session.", "Saved to the database (live). The app reads these settings."],
    ["Fictional counts only", "Live member counts. Billing is not switched on in the test app."],
    ["Posts the circle was asked to comment on", "Live requests: Waiting = needs your approval in Incoming requests"],
    ["Save links (prototype)", "Save links"]
  ];
  function liveText() {
    if (!live()) return;
    var pg = document.getElementById("page"); if (!pg) return;
    var w = document.createTreeWalker(pg, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) LIVE_TEXT.forEach(function (p) { if (n.nodeValue.indexOf(p[0]) >= 0) n.nodeValue = n.nodeValue.replace(p[0], p[1]); });
    pg.querySelectorAll(".panel-sub").forEach(function (el) {
      if (/fictional demo threads/.test(el.textContent)) el.textContent = el.textContent.replace("fictional demo threads", "live");
      if (/completion is fictional/.test(el.textContent)) el.textContent = el.textContent.replace("completion is fictional", "live");
    });
    if (A().page && A().page() === "features") {
      var host = document.getElementById("page");
      if (host && !host.querySelector("[data-feat-status]") && !host.getAttribute("data-feat")) { host.setAttribute("data-feat", "1"); host.innerHTML = featuresHTML(); host.removeAttribute("data-feat"); }
      var t = document.getElementById("pageTitle"); if (t) t.textContent = "Feature ideas";
    }
    if (A().page && A().page() === "settings") applySettingsUi();
    if (A().page && A().page() === "ai") applyAiUi();
    if (A().page && A().page() === "plans") applyPlansUi();
    addFeaturePage();
  }
  var SET_KEYS = ["approval_required", "rec_alerts_push", "paid_queue_jumps"];
  function applySettingsUi() {
    var tg = document.querySelectorAll("#page .setting-row .toggle");
    SET_KEYS.forEach(function (k, i) { var b = tg[i]; if (!b) return; b.setAttribute("data-setting", k); var v = cache.settings[k]; if (typeof v === "boolean") { b.classList.toggle("on", v); b.setAttribute("aria-pressed", v ? "true" : "false"); } });
    var cap = document.getElementById("reviewCap"); if (cap && typeof cache.settings.review_daily_cap === "number" && document.activeElement !== cap) cap.value = cache.settings.review_daily_cap;
  }
  var AI_KEYS = ["ai_allow_grok", "ai_allow_chatgpt", "ai_allow_claude", "ai_voice"];
  function applyAiUi() {
    document.querySelectorAll("#page .setting-row .toggle").forEach(function (b, i) { var k = AI_KEYS[i]; if (!k) return; b.setAttribute("data-setting", k); var v = cache.settings[k]; if (typeof v === "boolean") { b.classList.toggle("on", v); b.setAttribute("aria-pressed", v ? "true" : "false"); } });
  }
  function applyPlansUi() {
    var cells = document.querySelectorAll('#page td[data-label="Members"]');
    var approved = (A().members || []).filter(function (m) { return m.status === "active"; }).length;
    if (cells[0]) cells[0].textContent = String(approved);
    if (cells[1]) cells[1].textContent = "0";
  }
  async function saveSetting(key, value, label) {
    var r = await db().from("app_settings").upsert({ key: key, value: value, updated_at: new Date().toISOString() });
    if (r.error) { root.alert("Not saved: " + r.error.message); return; }
    cache.settings[key] = value;
    audit(label || ("Changed setting " + key), String(JSON.stringify(value)));
  }

  /* ---------- actions ---------- */
  document.addEventListener("click", function (e) {
    if (!live()) return;
    var sup = e.target.closest && e.target.closest("[data-sup-sel]");
    if (sup) { var row = cache.support[+sup.getAttribute("data-sup-sel")]; root.__rbSupportMember = row ? row.memberId : null; if (row && row.unreadIds.length) db().from("support_messages").update({ read_by_admin: true }).in("id", row.unreadIds).then(function () {}); return; }
    var btn = e.target.closest && e.target.closest("[data-action]");
    if (!btn) return;
    var a = btn.getAttribute("data-action"), id = btn.getAttribute("data-id");
    function stop() { e.preventDefault(); e.stopImmediatePropagation(); }
    /* v2.2.2 b16 QA #43: Approve / Decline are audited by the database (admin_set_member_status_v2) with the member's name */
    if (id && (a === "devi-approve" || a === "devi-dismiss")) { audit(a === "devi-approve" ? "Approved a recommendation request" : "Dismissed a recommendation request", ""); }
    if (a === "suspend" && id) {
      stop();
      var m = (A().members || []).filter(function (x) { return x.id === id; })[0];
      var to = m && m.status === "active" ? "suspended" : "approved";
      /* v2.2.2 b16 QA #45: confirm, ask for a reason, tell the member; the database writes the audit line */
      var reason = null;
      if (to === "suspended") {
        reason = root.prompt("Suspend " + nameOf(id) + "?\n\nThey are signed out and can't use Rate Buddies until you reactivate them. They will see the reason you type here.\n\nReason:", "");
        if (reason === null) return;
        if (!String(reason).trim()) { root.alert("Please type a short reason. The member sees it."); return; }
      } else if (!root.confirm("Reactivate " + nameOf(id) + "? They can sign in and use Rate Buddies again.")) return;
      db().rpc("admin_set_member_status_v2", { target: id, new_status: to, reason: reason ? String(reason).trim().slice(0, 280) : null }).then(function (r) {
        if (r.error) return root.alert(r.error.message);
        refresh();
      });
      return;
    }
    if (a === "save-mem" && id) {
      stop();
      var patch = {};
      document.querySelectorAll("[data-link]").forEach(function (inp) { var k = inp.getAttribute("data-link"); if (k === "facebook") patch.facebook = inp.value.trim(); if (k === "google") patch.google_business_url = inp.value.trim(); });
      db().from("profiles").update(patch).eq("id", id).then(function (r) { if (r.error) return root.alert(r.error.message); audit("Updated profile links", nameOf(id)); root.alert("Links saved."); refresh(); });
      return;
    }
    if ((a === "move-up" || a === "remove-q") && cache.queueIds[id]) {
      stop();
      var qid = cache.queueIds[id], pos = +id;
      if (a === "remove-q") {
        db().from("facebook_queue").update({ status: "archived" }).eq("id", qid).then(function (r) { if (r.error) return root.alert(r.error.message); audit("Took a member out of the promotion queue (archived)", (A().queue[pos - 1] || {}).name || ""); refresh(); });
      } else if (pos > 1) {
        var above = cache.queueIds[String(pos - 1)];
        Promise.all([db().from("facebook_queue").select("id,place").in("id", [qid, above])]).then(function (rs) {
          var d = rs[0].data || [], pa = (d.filter(function (x) { return x.id === qid; })[0] || {}).place, pb = (d.filter(function (x) { return x.id === above; })[0] || {}).place;
          return Promise.all([db().from("facebook_queue").update({ place: pb }).eq("id", qid), db().from("facebook_queue").update({ place: pa }).eq("id", above)]);
        }).then(function () { audit("Moved a member up the promotion queue", (A().queue[pos - 1] || {}).name || ""); refresh(); });
      }
      return;
    }
    if (a === "resolve" && id) {
      stop();
      db().from("member_reports").update({ status: "resolved", resolved_by: RB.session.user.id, resolved_at: new Date().toISOString() }).eq("id", id).then(function (r) { if (r.error) return root.alert(r.error.message); audit("Resolved a report", ""); refresh(); });
      return;
    }
    if (a === "broadcast") {
      stop();
      var title = (document.getElementById("bcTitle") || {}).value || "", body = (document.getElementById("bcBody") || {}).value || "";
      if (!title.trim()) return root.alert("Add a title first.");
      var ids = (root.__rbProfiles || []).filter(function (p) { return p.status === "approved" && p.role !== "admin"; }).map(function (p) { return p.id; });
      if (!ids.length) return root.alert("No approved members yet.");
      db().from("notifications").insert(ids.map(function (mid) { return { member_id: mid, title: title.trim(), body: body.trim(), kind: "broadcast", payload: { from: "admin" } }; })).then(function (r) {
        if (r.error) return root.alert("Not sent: " + r.error.message);
        audit("Sent a broadcast to " + ids.length + " members", title.trim()); root.alert("Sent to " + ids.length + " members. It shows in their bell now.");
        refresh();
      });
      return;
    }
    if (a === "add-trade") {
      stop();
      var tname = root.prompt("Trade or business type to add");
      if (!tname || !tname.trim()) return;
      var slug = tname.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      db().from("business_types").upsert({ slug: slug, name: tname.trim(), category: "Added by admin" }).then(function (r) {
        if (r.error) return root.alert(r.error.message);
        if (A().trades) A().trades.unshift(tname.trim());
        audit("Added a business type", tname.trim()); repaint();
      });
      return;
    }
    if (a === "add-region") {
      stop();
      var rname = root.prompt("Region name to add");
      if (!rname || !rname.trim()) return;
      var list = (Array.isArray(cache.settings.custom_regions) ? cache.settings.custom_regions : []).concat([rname.trim()]);
      saveSetting("custom_regions", list, "Added a region").then(function () { if (A().regions && A().regions.indexOf(rname.trim()) < 0) A().regions.push(rname.trim()); repaint(); });
      return;
    }
    if (a === "toggle" && btn.getAttribute("data-setting")) {
      stop();
      var on = !btn.classList.contains("on");
      btn.classList.toggle("on", on); btn.setAttribute("aria-pressed", on ? "true" : "false");
      saveSetting(btn.getAttribute("data-setting"), on, "Turned " + (on ? "on" : "off") + " " + btn.getAttribute("data-setting").replace(/_/g, " "));
      return;
    }
    if (a === "feat-save" && id) {
      stop();
      var st = (document.querySelector('[data-feat-status="' + id + '"]') || {}).value, why = (document.querySelector('[data-feat-reason="' + id + '"]') || {}).value || "";
      db().from("feature_requests").update({ status: st, status_reason: why.slice(0, 280), updated_at: new Date().toISOString() }).eq("id", id).then(function (r) {
        if (r.error) return root.alert(r.error.message);
        audit("Set a feature idea to " + st, (cache.features.filter(function (f) { return f.id === id; })[0] || {}).title || ""); refresh();
      });
      return;
    }
  }, true);
  document.addEventListener("change", function (e) {
    if (!live()) return;
    var t = e.target;
    if (t && t.id === "reviewCap") { e.stopImmediatePropagation(); var n = Math.max(1, Math.min(20, Number(t.value) || 3)); var nowC = Date.now(); if (root.__rbCapLast && root.__rbCapLast.n === n && nowC - root.__rbCapLast.t < 8000) return; root.__rbCapLast = { n: n, t: nowC }; saveSetting("review_daily_cap", n, "Set daily Google Review cap to " + n); }
    if (t && t.classList && t.classList.contains("badge-tier")) {
      setTimeout(function () { var v = null; try { v = JSON.parse(localStorage.getItem("tc_badge_tiers")); } catch (eB) {} if (Array.isArray(v)) saveSetting("badge_tiers", v, "Updated badge levels"); }, 0);
    }
  }, true);
  document.addEventListener("submit", function (e) {
    if (!live()) return;
    var f = e.target;
    if (!f || f.id !== "fbPostForm") return;
    e.preventDefault(); e.stopImmediatePropagation();
    var fd = new FormData(f), mem = fd.getAll("mem");
    var link = String(fd.get("link") || "").trim(), group = String(fd.get("group") || ""), note = String(fd.get("note") || "").trim();
    if (!/^https?:\/\/(www\.|m\.)?facebook\.com\//i.test(link)) return root.alert("Paste the Facebook post link first.");
    if (!mem.length) return root.alert("Choose the member the circle should recommend.");
    var mid = mem[0], trade = trades[mid] || "";
    RB.createRequest({ post_link: link, group_name: group, snippet: note || ("Someone is asking for a " + trade + "."), ask: note || ("Someone is asking for a " + trade + "."), trade: trade, city: "Perth", featured_member_id: mid, status: "pending", source: "admin", when_label: "Just now" })
      .then(function (row) { return RB.approveRequest(row.id, mid); })
      .then(function () { audit("Posted a Facebook recommendation request", nameOf(mid)); f.reset(); root.alert("Posted. Members see it under Facebook › Recommend now."); refresh(); })
      .catch(function (err) { root.alert(err.message || "Could not post."); });
  }, true);

  /* ---------- refresh + realtime ---------- */
  var busy = false;
  async function refresh() {
    if (busy || !live()) return; busy = true;
    try {
      var profiles = await RB.listProfiles(); var reqs = await RB.listRequests();
      root.__rbRequests = reqs; root.__rbProfiles = profiles;
      await afterHydrate(profiles, reqs);
    } catch (e) { console.warn("RB admin live2 refresh", e); }
    finally { busy = false; }
    repaint();
  }
  var started = false;
  function start() {
    if (started || !live()) return; started = true;
    ["facebook_queue", "member_reports", "chat_messages", "support_messages", "feature_requests", "app_settings", "notifications", "facebook_vouches"].forEach(function (t) {
      try { db().channel("rb2a-" + t).on("postgres_changes", { event: "*", schema: "public", table: t }, function () { clearTimeout(start._t); start._t = setTimeout(refresh, 400); }).subscribe(); } catch (e) {}
    });
    refresh();
  }
  setInterval(start, 1500);
  var mo = new MutationObserver(function () { mo.disconnect(); try { liveText(); } finally { var pg = document.getElementById("page"), nav = document.getElementById("nav"); if (pg) mo.observe(pg, { childList: true, subtree: true }); if (nav) mo.observe(nav, { childList: true }); } });
  function observe() { var pg = document.getElementById("page"), nav = document.getElementById("nav"); if (pg) mo.observe(pg, { childList: true, subtree: true }); if (nav) mo.observe(nav, { childList: true }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", observe); else observe();
  /* ---------- v2.2.2 b16: Chat moderation → Conversations (admin-only RPC + read-only thread, load older) ---------- */
  var PAGE = 30;
  function CV() { return root.__rbAdminConv || (root.__rbAdminConv = { tab: "messages", q: "", list: null, sel: null, msgs: [], more: false }); }
  async function loadConvs() {
    if (!live()) return;
    var cv = CV(), q = cv.q || "";
    var r = await db().rpc("admin_conversations", { q: q || null });
    if (r.error) { console.warn("admin_conversations", r.error); return; }
    if ((CV().q || "") !== q) return; /* a newer search is on its way */
    cv.list = (r.data || []).map(function (c) {
      var people = (c.participants || []).map(function (p) { names[p.id] = names[p.id] || p.name; trades[p.id] = trades[p.id] || p.trade; return { id: p.id, name: p.name || "A member", trade: p.trade || "" }; });
      return { id: c.id, kind: c.kind === "group" ? "group" : "dm", title: c.title || "", people: people, last: c.last_body || "", lastWho: c.last_sender ? nameOf(c.last_sender) : "", when: when(c.last_at), n: Number(c.msg_count) || 0 };
    });
    repaintKeepSearch();
  }
  async function loadThread(id, older) {
    var cv = CV();
    if (!older) { cv.sel = id; cv.msgs = []; cv.more = false; cv._raw = []; }
    var conv = (cv.list || []).filter(function (c) { return c.id === id; })[0];
    if (!live() || !conv) { repaintKeepSearch(); return; }
    var qy = db().from("chat_messages").select("id,sender_id,body,created_at,hidden").eq("conversation_id", id).order("created_at", { ascending: false }).limit(PAGE);
    if (older && cv._raw.length) qy = qy.lt("created_at", cv._raw[0].created_at);
    var r = await qy;
    if (r.error) { console.warn("thread", r.error); return; }
    if (CV().sel !== id) return;
    var rows = (r.data || []).slice().reverse();
    cv._raw = rows.concat(cv._raw || []);
    cv.more = (r.data || []).length === PAGE;
    cv.msgs = cv._raw.map(function (m) {
      var to = conv.kind === "group" ? (conv.title || "Group chat") : (conv.people.filter(function (p) { return p.id !== m.sender_id; })[0] || {}).name || "";
      return { from: nameOf(m.sender_id), to: to, text: m.body, when: when(m.created_at), hidden: !!m.hidden };
    });
    repaintKeepSearch();
  }
  function repaintKeepSearch() {
    var inp = document.getElementById("cmSearch"), had = inp && document.activeElement === inp, pos = had ? inp.selectionStart : 0;
    repaint();
    if (had) { var n2 = document.getElementById("cmSearch"); if (n2) { n2.focus(); try { n2.setSelectionRange(pos, pos); } catch (e) {} } }
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-cm-tab], [data-cm-conv], [data-cm-older]"); if (!t) return;
    e.preventDefault();
    var cv = CV();
    if (t.hasAttribute("data-cm-tab")) { cv.tab = t.getAttribute("data-cm-tab"); repaint(); if (cv.tab === "conversations") loadConvs(); return; }
    if (t.hasAttribute("data-cm-conv")) { cv.sel = t.getAttribute("data-cm-conv"); if (live()) loadThread(cv.sel, false); else repaint(); return; }
    if (t.hasAttribute("data-cm-older") && cv.sel) loadThread(cv.sel, true);
  });
  var cmTimer = null;
  document.addEventListener("input", function (e) {
    if (!e.target || e.target.id !== "cmSearch") return;
    var cv = CV(); cv.q = e.target.value || "";
    clearTimeout(cmTimer);
    cmTimer = setTimeout(function () { if (live()) loadConvs(); else repaintKeepSearch(); }, 300);
  });

  root.RBAdminLive2 = { afterHydrate: afterHydrate, refresh: refresh, featuresHTML: featuresHTML, loadConvs: loadConvs, loadThread: loadThread };
})(window);
