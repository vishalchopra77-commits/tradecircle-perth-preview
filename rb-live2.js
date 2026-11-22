/* Rate Buddies v2.2.2b — live data bridge, part 2 (Supabase test project).
   Wires the remaining member screens to the database without changing how they look:
   My areas, promotion queue (join / leave), recommendation alerts (send / I commented),
   notification settings, chat mute + block/report, region group chats, Facebook vouches,
   the admin's daily Google Review cap and badge levels, and live refresh for the promotion
   queue, vouches, settings and group chats. Does nothing in Demo (offline) mode or when signed out. */
(function (root) {
  "use strict";
  function T() { return root.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function live() { return !!(root.RB && !RB.isDemo() && RB.session && RB.client && RB.profile && RB.profile.status === "approved"); }
  function db() { return RB.client; }
  function myId() { return RB.profile && RB.profile.id; }
  function toast(m) { if (T().toast) T().toast(m); }
  function isUuid(x) { return /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(String(x || "")); }
  function loadJ(k, f) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : f; } catch (e) { return f; } }
  function saveJ(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function rerender(ids) { var s = S().screen; if (s && (!ids || ids.indexOf(s) >= 0) && T().go) T().go(s, { replace: true }); }
  function day(iso) { try { return new Date(iso).toLocaleDateString("en-AU", { timeZone: "Australia/Perth", day: "numeric", month: "short" }); } catch (e) { return ""; } }

  var store = { queue: null, alerts: null, vouchesLoaded: false };
  root.RB_LIVE_VOUCHES = false;

  /* ---------- settings set by the admin (cap, badge levels) ---------- */
  async function syncSettings() {
    if (!live()) return;
    var r = await db().from("app_settings").select("key,value");
    (r.data || []).forEach(function (row) {
      if (row.key === "review_daily_cap" && typeof row.value === "number") saveJ("tc_review_daily_limit", row.value);
      if (row.key === "badge_tiers" && Array.isArray(row.value) && row.value.length) saveJ("tc_badge_tiers", row.value);
    });
  }

  /* ---------- promotion queue ---------- */
  async function syncQueue() {
    if (!live()) return;
    var r = await db().from("facebook_queue").select("id,member_id,place,status,scheduled_for,created_at").in("status", ["waiting", "scheduled"]).order("place", { ascending: true });
    if (r.error) return;
    var me = myId();
    store.queue = (r.data || []).map(function (q, i) {
      return { id: q.id, memberId: q.member_id, when: q.scheduled_for ? day(q.scheduled_for) : (i === 0 ? "Next" : ""), paid: false, mine: q.member_id === me, place: i + 1, live: true };
    });
    S()._queue = store.queue.slice();
    rerender(["promo-queue", "home"]);
  }
  root.RBLiveQueue = { rows: function () { return live() && store.queue ? store.queue.slice() : null; } };
  async function joinQueue() {
    var r = await db().from("facebook_queue").insert({ member_id: myId(), status: "waiting" });
    if (r.error && r.error.code !== "23505") { toast("Could not join the queue: " + r.error.message); return; }
    toast("You’re in the promotion queue. The admin sees you now.");
    await syncQueue();
  }
  async function leaveQueue() {
    var r = await db().from("facebook_queue").update({ status: "archived" }).eq("member_id", myId()).eq("status", "waiting");
    if (r.error) { toast("Could not leave the queue: " + r.error.message); return; }
    await syncQueue();
  }

  /* ---------- recommendation alerts ---------- */
  var IDEAS = ["I have used this business and would recommend getting in touch.", "Happy to recommend from a job I actually saw in Perth."];
  async function syncAlerts() {
    if (!live()) return;
    var me = myId();
    var r = await db().from("recommendation_requests").select("id,post_link,trade,ask,snippet,status,created_by,featured_member_id,created_at").in("status", ["approved", "pending"]).order("created_at", { ascending: false }).limit(50);
    if (r.error) return;
    var rows = r.data || [], ids = rows.map(function (x) { return x.id; });
    var pr = ids.length ? await db().from("rec_progress").select("request_id,member_id").in("request_id", ids) : { data: [] };
    var helped = {};
    (pr.data || []).forEach(function (p) { (helped[p.request_id] = helped[p.request_id] || []).push(p.member_id); });
    store.alerts = rows.filter(function (x) { return x.status === "approved" || x.created_by === me; }).map(function (x) {
      var h = helped[x.id] || [];
      return { id: x.id, live: true, link: x.post_link || "", trade: x.trade || "", by: x.created_by || x.featured_member_id || "",
        ask: x.ask || x.snippet || "", status: x.status === "pending" ? "open" : (h.indexOf(me) >= 0 ? "handled" : "open"),
        pending: x.status === "pending", helped: h, ideas: IDEAS.slice() };
    });
    S()._alerts = store.alerts.slice();
    rerender(["rec-alerts", "rec-alert"]);
  }
  async function sendAlert(link, trade) {
    var ask = "Someone in a Facebook group is asking for a " + (trade || "tradie") + ".";
    var row = { post_link: link || "", trade: trade || "", ask: ask, snippet: ask, status: "pending", source: "member", created_by: myId(),
      city: (RB.profile && RB.profile.city) || "Perth", when_label: "Just now", group_name: "Sent by a member" };
    var r = await db().from("recommendation_requests").insert(row).select("id").single();
    if (r.error) { toast("Alert not sent: " + r.error.message); return; }
    toast("Alert sent to the admin. Once approved, the circle sees it.");
    await syncAlerts();
    S().alertId = r.data.id;
    rerender(["rec-alert", "rec-alerts"]);
  }

  /* ---------- notification settings (saved on the profile) ---------- */
  async function saveNotifSettings() {
    var n = loadJ("tc12_notif", null); if (!n) return;
    var ex = Object.assign({}, (RB.profile && RB.profile.extras) || {});
    var cur = await db().from("profiles").select("extras").eq("id", myId()).single();
    if (cur.data && cur.data.extras) ex = cur.data.extras;
    ex.notif = n;
    var r = await db().from("profiles").update({ extras: ex }).eq("id", myId());
    if (r.error) toast("Notification settings not saved: " + r.error.message);
    else if (RB.profile) RB.profile.extras = ex;
  }
  function restoreNotifSettings() {
    var ex = RB.profile && RB.profile.extras;
    if (ex && ex.notif && typeof ex.notif === "object") saveJ("tc12_notif", ex.notif);
  }

  /* ---------- my areas ---------- */
  async function saveRegions() {
    var me = T().me ? T().me() : null;
    var regs = (S().stepRegions && S().stepRegions.length ? S().stepRegions : (me && me.regions)) || [];
    if (!regs.length) return;
    var r = await db().from("profiles").update({ regions: regs }).eq("id", myId());
    if (r.error) { toast("Areas not saved: " + r.error.message); return; }
    if (RB.profile) RB.profile.regions = regs;
    try { await db().rpc("join_region_groups"); } catch (e) {}
    if (root.RBLive && RBLive.syncChats) RBLive.syncChats();
  }

  /* ---------- chats: mute, block/report, region groups ---------- */
  async function setMute(chatId) {
    var c = (root.TC12 && TC12.liveChats ? TC12.liveChats() : []).filter(function (x) { return x.id === chatId; })[0];
    var muted = c ? !!c.muted : true;
    await db().from("conversation_members").update({ muted: muted }).eq("conversation_id", chatId).eq("member_id", myId());
  }
  async function reportChat(chatId) {
    var c = (root.TC12 && TC12.liveChats ? TC12.liveChats() : []).filter(function (x) { return x.id === chatId; })[0] || {};
    var reason = root.prompt ? root.prompt("Report this " + (c.type === "group" ? "group chat" : "member") + " to the Rate Buddies admin. What happened?", "") : "";
    if (reason === null) return;
    var r = await db().from("member_reports").insert({ reporter_id: myId(), target_member_id: c.type === "dm" && isUuid(c.memberId) ? c.memberId : null,
      conversation_id: chatId, about: c.type === "group" ? "A group chat message" : "A member in chat", reason: String(reason || "No reason given").slice(0, 500) });
    toast(r.error ? "Report not sent: " + r.error.message : "Reported. The admin will review it.");
  }
  async function joinGroups() { try { await db().rpc("join_region_groups"); } catch (e) {} }

  /* ---------- Facebook vouches ---------- */
  async function syncVouches() {
    if (!live()) return;
    var r = await db().from("facebook_vouches").select("id,from_member_id,to_member_id,request_id,post_url,trade,status,created_at").order("created_at", { ascending: false }).limit(500);
    if (r.error) return;
    root.RB_LIVE_VOUCHES = true;
    var local = (loadJ("tc_vouches", []) || []).filter(function (v) { return !isUuid(v.id) && v.from === myId() && v._pushing; });
    saveJ("tc_vouches", local.concat((r.data || []).map(function (v) {
      return { id: v.id, from: v.from_member_id, to: v.to_member_id, trade: v.trade, when: day(v.created_at), status: v.status, post: v.post_url, requestId: v.request_id || undefined };
    })));
    store.vouchesLoaded = true;
    rerender(["vouch-received", "vouches", "me", "member", "home"]);
  }
  async function pushNewVouches() {
    var me = myId(), list = loadJ("tc_vouches", []) || [];
    var fresh = list.filter(function (v) { return !isUuid(v.id) && (v.from === me || v.from === "jamie") && v.to && isUuid(v.to); });
    for (var i = 0; i < fresh.length; i++) {
      var v = fresh[i];
      var row = { from_member_id: me, to_member_id: v.to, post_url: v.post || v.comment || "", trade: v.trade || "", status: "pending" };
      if (isUuid(v.requestId)) row.request_id = v.requestId;
      var r = await db().from("facebook_vouches").insert(row);
      if (r.error) toast("Vouch not saved: " + r.error.message);
    }
    if (fresh.length) await syncVouches();
  }
  async function setVouch(id, status) {
    var r = await db().from("facebook_vouches").update({ status: status, updated_at: new Date().toISOString() }).eq("id", id);
    if (r.error) toast("Vouch not updated: " + r.error.message);
    await syncVouches();
  }

  /* ---------- actions (capture phase where the prototype would only toast) ---------- */
  document.addEventListener("click", function (e) {
    if (!live()) return;
    var el = e.target.closest && e.target.closest("[data-action]");
    if (!el) return;
    var a = el.getAttribute("data-action"), id = el.getAttribute("data-id");
    if (a === "block-chat" && isUuid(S().chatId)) {
      e.preventDefault(); e.stopImmediatePropagation();
      var sh = document.querySelector(".sheet-backdrop, .mine-sheet, .chat-more"); if (sh && sh.remove && sh.classList.contains("chat-more")) sh.remove();
      reportChat(S().chatId);
      return;
    }
    if (a === "send-alert") {
      e.preventDefault(); e.stopImmediatePropagation();
      var linkEl = document.getElementById("recLink"), tradeEl = document.getElementById("tradeType");
      sendAlert(linkEl && linkEl.value.trim(), (tradeEl && tradeEl.value.trim()) || "");
      return;
    }
    if (a === "alert-done" && isUuid(id)) {
      e.preventDefault(); e.stopImmediatePropagation();
      RB.markRecommended(id).then(function () { toast("Thanks. Marked as commented."); return syncAlerts(); }).catch(function (err) { toast(err.message || "Not saved."); });
      return;
    }
    if (a === "join-queue") {
      /* the badge rule (v211) still decides: without a badge, let its message show */
      if (root.TC211 && TC211.badgeOf && !TC211.badgeOf(myId()).current) return;
      e.preventDefault(); e.stopImmediatePropagation();
      joinQueue();
      return;
    }
    if (a === "leave-queue") { e.preventDefault(); e.stopImmediatePropagation(); leaveQueue().then(function () { toast("You’ve left the queue."); }); return; }
    if (a === "vouch-accept" && isUuid(id)) { setTimeout(function () { setVouch(id, "confirmed"); }, 0); return; }
    if (a === "vouch-reject" && isUuid(id)) { setTimeout(function () { setVouch(id, "not-found"); }, 0); return; }
    if (a === "vouch-submit") { setTimeout(pushNewVouches, 50); return; }
    if (a === "tog-notif") { setTimeout(saveNotifSettings, 0); return; }
    if (a === "save-regions") { setTimeout(saveRegions, 0); return; }
    if (a === "mute-chat" && isUuid(S().chatId)) { var cid = S().chatId; setTimeout(function () { setMute(cid); }, 0); return; }
  }, true);
  document.addEventListener("submit", function (e) {
    if (!live()) return;
    var f = e.target;
    if (f && f.getAttribute && (f.getAttribute("data-form") === "i-vouched" || f.getAttribute("data-form") === "leave-vouch")) setTimeout(pushNewVouches, 50);
  }, true);

  /* ---------- sync + realtime ---------- */
  var listening = false, booted = false;
  function listen(table, cb) {
    try { db().channel("rb2-" + table).on("postgres_changes", { event: "*", schema: "public", table: table }, cb).subscribe(); } catch (e) {}
  }
  async function syncAll() {
    if (!live()) return;
    try {
      restoreNotifSettings();
      await Promise.all([syncSettings(), syncQueue(), syncAlerts(), syncVouches(), joinGroups()]);
      if (root.RBLive && RBLive.syncChats) RBLive.syncChats();
    } catch (e) { if (root.console) console.warn("RB live2", e); }
    if (!listening) {
      listening = true;
      listen("facebook_queue", syncQueue);
      listen("facebook_vouches", syncVouches);
      listen("app_settings", syncSettings);
      listen("conversations", function () { if (root.RBLive && RBLive.syncChats) RBLive.syncChats(); });
      listen("recommendation_requests", syncAlerts);
    }
  }
  setInterval(function () {
    if (live() && !booted) { booted = true; syncAll(); }
    if (!live()) booted = false;
  }, 1500);
  setInterval(function () { if (live()) syncAll(); }, 60000);
  root.RBLive2 = { syncAll: syncAll, syncQueue: syncQueue, syncAlerts: syncAlerts, syncVouches: syncVouches };
})(window);
