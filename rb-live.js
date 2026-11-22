/* Rate Buddies v2.2.2 — live data bridge (Supabase test project).
   Keeps the v2.2.2 screens exactly as they are: fills the same state/localStorage the
   screens already read (review status maps, swap requests, daily counts, availability,
   badge stats, own photo) from the database, and writes the screens' button actions
   back to the database. Does nothing in Demo (offline) mode or when signed out. */
(function () {
  "use strict";
  function T() { return window.TradeCircle; }
  function S() { return (T() && T().state) || {}; }
  function live() { return !!(window.RB && !RB.isDemo() && RB.session && RB.client && RB.profile && RB.profile.status === "approved"); }
  function db() { return RB.client; }
  function myId() { return RB.profile && RB.profile.id; }
  function toast(m) { if (T() && T().toast) T().toast(m); }
  function saveJ(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function loadJ(k, f) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : f; } catch (e) { return f; } }
  function perthToday() {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Perth", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  }
  function whenLabel(iso) {
    try {
      var d = new Date(iso), today = perthToday();
      var day = new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Perth", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
      var t = d.toLocaleTimeString("en-AU", { timeZone: "Australia/Perth", hour: "numeric", minute: "2-digit" }).toLowerCase();
      return (day === today ? "Today, " : day + ", ") + t;
    } catch (e) { return ""; }
  }
  function rerender() {
    var sc = S().screen;
    if (sc && T().go && !document.querySelector("#tc12Overlay.open, .sheet.open")) T().go(sc);
  }
  var syncing = false, lastSync = 0, swapsById = {}, rowsCache = { reviews: [], swaps: [] };

  /* Your Stats tiles per period (Perth calendar): requested = swap requests I sent,
     given = Google Reviews I marked done, swapped = swaps completed both ways. */
  function perthDay(d) { return new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Perth", year: "numeric", month: "2-digit", day: "2-digit" }).format(d); }
  function inPeriod(iso, period) {
    if (!iso) return false;
    var d = new Date(iso), now = new Date(), day = perthDay(d), today = perthDay(now);
    var y = new Date(now.getTime() - 86400000);
    var ageDays = (new Date(today + "T00:00:00+08:00") - new Date(day + "T00:00:00+08:00")) / 86400000;
    if (period === "today") return day === today;
    if (period === "yesterday") return day === perthDay(y);
    if (period === "week") return ageDays >= 0 && ageDays < 7;
    if (period === "fortnight") return ageDays >= 0 && ageDays < 14;
    if (period === "month") return day.slice(0, 7) === today.slice(0, 7);
    if (period === "lastmonth") { var lm = new Date(new Date(today.slice(0, 7) + "-01T00:00:00+08:00").getTime() - 86400000); return day.slice(0, 7) === perthDay(lm).slice(0, 7); }
    return true;
  }
  function periodStats(period) {
    var me = myId();
    if (!me) return null;
    return {
      requested: rowsCache.swaps.filter(function (s) { return s.requester_id === me && inPeriod(s.created_at, period); }).length,
      given: rowsCache.reviews.filter(function (r) { return r.from_member_id === me && r.status === "done" && inPeriod(r.done_at, period); }).length,
      swapped: rowsCache.swaps.filter(function (s) { return (s.requester_id === me || s.recipient_id === me) && s.status === "swapped" && inPeriod(s.updated_at || s.created_at, period); }).length
    };
  }

  /* ---------- read: database -> the maps the screens use ---------- */
  async function sync(reason) {
    if (!live() || syncing) return;
    syncing = true;
    try {
      var me = myId();
      var rv = await db().from("google_reviews").select("id,from_member_id,to_member_id,status,swap_id,done_at");
      var sw = await db().from("review_swaps").select("id,requester_id,recipient_id,mode,review_text,note,status,created_at,updated_at").order("created_at", { ascending: false });
      var pr = await db().from("profiles").select("id,available_for_swap,reviews_given_count,reviews_received_count,avatar_path");
      var st = S();
      var reviewed = {}, they = {}, pending = {};
      (rv.data || []).forEach(function (r) {
        if (r.status !== "done") return;
        if (r.from_member_id === me) reviewed[r.to_member_id] = true;
        if (r.to_member_id === me) they[r.from_member_id] = true;
      });
      swapsById = {};
      var incoming = [];
      (sw.data || []).forEach(function (s) {
        swapsById[s.id] = s;
        if (s.requester_id === me && (s.status === "pending" || s.status === "accepted")) pending[s.recipient_id] = true;
        if (s.recipient_id === me && s.status !== "cancelled") {
          incoming.push({
            id: s.requester_id, swapId: s.id, time: whenLabel(s.created_at),
            status: s.status === "pending" || s.status === "accepted" ? "new" : (s.status === "not_now" ? "declined" : "given"),
            mode: s.mode, review: s.review_text || "", note: s.note || ""
          });
        }
      });
      st._reviewed = reviewed; st._they = they; st._pendingReq = pending;
      rowsCache = { reviews: rv.data || [], swaps: sw.data || [] };
      saveJ("rb_swap_incoming", incoming);
      if (incoming.some(function (r) { return r.status === "new"; })) saveJ("rb_swap_incoming_seen", false);
      var avail = {}, stats = loadJ("tc_badge_stats", {}) || {};
      (pr.data || []).forEach(function (p) {
        avail[p.id] = p.available_for_swap !== false;
        var cur = stats[p.id] || {};
        stats[p.id] = { reviews: p.reviews_given_count || 0, vouches: cur.vouches || 0 };
        if (p.id === me && !p.avatar_path && RB.profile && RB.profile.extras && /^https:\/\//.test(RB.profile.extras.avatar_url || "")) st.photoData = RB.profile.extras.avatar_url; /* v2.2.2b: Facebook photo */
        if (p.id === me && p.avatar_path) {
          var u = db().storage.from("avatars").getPublicUrl(p.avatar_path);
          if (u && u.data && u.data.publicUrl) st.photoData = u.data.publicUrl + "?v=" + encodeURIComponent(p.avatar_path);
        }
      });
      saveJ("rb_member_avail", avail);
      saveJ("tc_badge_stats", stats);
      /* today's RECEIVED counts for the meter / Full today (server-side count) */
      var today = perthToday(), counts = {};
      var ids = (T().MEMBERS || []).map(function (m) { return m.id; });
      var res = await Promise.all(ids.map(function (id) { return db().rpc("reviews_received_today", { member: id }); }));
      ids.forEach(function (id, i) { counts[id] = { date: today, n: (res[i] && res[i].data) || 0, by: [] }; });
      saveJ("tc_review_daily_counts", counts);
      lastSync = Date.now();
      rerender();
    } catch (e) {
      console.warn("RB live sync", reason, e);
    } finally {
      syncing = false;
    }
  }

  function capMessage(err) {
    var m = String((err && err.message) || "");
    if (m.indexOf("Daily limit") >= 0 || (err && err.hint === "RB_DAILY_CAP")) return "Daily limit reached: this member has received 3 Google Reviews today. Try again tomorrow.";
    return m || "Could not save. Please try again.";
  }
  function openSwapWith(otherId) {
    var me = myId(), hit = null;
    Object.keys(swapsById).forEach(function (k) {
      var s = swapsById[k];
      if (hit || ["pending", "accepted", "recipient_done"].indexOf(s.status) < 0) return;
      if ((s.requester_id === me && s.recipient_id === otherId) || (s.recipient_id === me && s.requester_id === otherId)) hit = s;
    });
    return hit;
  }

  /* ---------- write: the screens' actions -> database ---------- */
  async function leaveReview(toId) {
    var sw = openSwapWith(toId);
    var row = { from_member_id: myId(), to_member_id: toId, status: "done" };
    if (sw) row.swap_id = sw.id;
    var r = await db().from("google_reviews").insert(row);
    if (r.error) { toast(capMessage(r.error)); }
    await sync("review");
  }
  async function swapNotNow(requesterId) {
    var sw = openSwapWith(requesterId);
    if (sw) await db().from("review_swaps").update({ status: "not_now" }).eq("id", sw.id);
    await sync("not-now");
  }
  async function sendSwap(toId, mode, review, note) {
    var row = { requester_id: myId(), recipient_id: toId, mode: mode === "own" ? "own" : "send",
      review_text: mode === "send" && review ? review : null, note: note || "" };
    if (row.mode === "send" && !row.review_text) row.mode = "own";
    var r = await db().from("review_swaps").insert(row);
    if (r.error) {
      toast(r.error.code === "23505" ? "You already have an open swap request with this member." : (r.error.message || "Could not send."));
    }
    await sync("swap-send");
  }
  async function remindMe(targetId) {
    var d = new Date(); d.setDate(d.getDate() + 1);
    var day = new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Perth", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
    await db().from("google_review_reminders").upsert({ member_id: myId(), target_member_id: targetId, remind_at: day + "T09:00:00+08:00", label: "Tomorrow, 9:00 AM" }, { onConflict: "member_id,target_member_id" });
  }

  /* ---------- profile save (edit profile + complete profile) ---------- */
  function lines(a) { return Array.isArray(a) ? a.filter(Boolean) : String(a || "").split(/[\n,]/).map(function (x) { return x.trim(); }).filter(Boolean); }
  /* saves run one at a time so a later save never merges stale extras over an earlier one */
  var saveChain = Promise.resolve(true);
  function saveProfile(src) {
    var run = saveChain.then(function () { return saveProfileNow(src); }, function () { return saveProfileNow(src); });
    saveChain = run.catch(function () { return false; });
    return run;
  }
  async function saveProfileNow(src) {
    var m = src || {};
    var p = m.profile || {};
    var links = m.links || {};
    var patch = {};
    function put(k, v) { if (v !== undefined && v !== null) patch[k] = v; }
    put("first_name", m.first); put("last_name", m.last); put("business", m.business); put("trade", m.trade);
    put("bio", m.bio); put("tagline", m.tagline);
    if (m.phone !== undefined) put("phone", m.phone);
    if (m.regions && m.regions.length) put("regions", m.regions);
    if (links.facebook !== undefined) put("facebook", links.facebook || m.facebook || "");
    if (links.google !== undefined) put("google_business_url", links.google || "");
    if (m.page !== undefined) put("page", m.page);
    var goal = p.goal != null ? p.goal : m.goal; if (goal != null) put("goal", goal);
    var spec = p.specialties != null ? p.specialties : m.specialties; if (spec != null) put("services", lines(spec)); /* b18: removing every service saves an empty list */
    var ideal = p.idealTrades || m.idealTrades; if (ideal) put("referral_partners", lines(ideal));
    if (p.licences) put("licences", lines(p.licences).join("\n"));
    if (p.years !== undefined && p.years !== "") { var y = parseInt(p.years, 10); if (!isNaN(y)) put("years_in_business", y); }
    /* v2.2.2: About, Ideal partner note, Service areas, Gallery, Goals and ABN live in profiles.extras */
    var fresh = await db().from("profiles").select("extras").eq("id", myId()).maybeSingle();
    var ex = Object.assign({}, (fresh && fresh.data && fresh.data.extras) || (RB.profile && RB.profile.extras) || {});
    function putX(k, v) { if (v !== undefined && v !== null) ex[k] = v; }
    putX("about", p.about); putX("idealNote", p.idealNote);
    if (p.serviceAreas) putX("serviceAreas", lines(p.serviceAreas));
    if (Array.isArray(p.gallery)) putX("gallery", p.gallery);
    if (Array.isArray(p.goals)) putX("goals", p.goals);
    putX("abn", m.abn);
    patch.extras = ex;
    var r = await db().from("profiles").update(patch).eq("id", myId());
    if (r.error) { toast("Saved on this phone, but not online: " + r.error.message); return false; }
    await RB.loadProfile();
    /* keep this phone's copy of me in step with what was saved (About, ideal note, areas, gallery, goals, ABN) */
    var meRow = (T().MEMBERS || []).filter(function (x) { return x.id === myId(); })[0];
    if (meRow) {
      meRow.profile = meRow.profile || {};
      ["about", "idealNote", "serviceAreas", "gallery", "goals"].forEach(function (k) { if (ex[k] !== undefined) meRow.profile[k] = ex[k]; });
      if (ex.abn !== undefined) meRow.abn = ex.abn;
    }
    return true;
  }
  async function uploadPhoto(dataUrl) {
    if (!dataUrl || dataUrl.indexOf("data:image") !== 0) return;
    var blob = await (await fetch(dataUrl)).blob();
    var ext = (blob.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
    var path = myId() + "/avatar-" + Date.now() + "." + ext;
    var up = await db().storage.from("avatars").upload(path, blob, { contentType: blob.type, upsert: true });
    if (up.error) { toast("Photo not uploaded: " + up.error.message); return; }
    await db().from("profiles").update({ avatar_path: path }).eq("id", myId());
  }

  /* ---------- hooks ---------- */
  var pendingSwap = null;
  document.addEventListener("click", function (e) {
    if (!live()) return;
    var el = e.target.closest && e.target.closest("[data-action]");
    if (!el) return;
    var a = el.getAttribute("data-action"), id = el.getAttribute("data-id");
    if (a === "rb-swq-send" && id) {
      /* read the sheet before the screen closes it */
      var ov = el.closest("#tc12Overlay") || document;
      var rv = ov.querySelector("[name=swapReview]"), nt = ov.querySelector("[name=swapNote]");
      pendingSwap = [id, S()._swapMode || "send", rv ? rv.value.trim() : "", nt ? nt.value.trim() : ""];
      setTimeout(function () { var x = pendingSwap; pendingSwap = null; if (x) sendSwap(x[0], x[1], x[2], x[3]); }, 0);
    }
    if (a === "swap-done" && id) setTimeout(function () { leaveReview(id); }, 0);
    if (a === "left-review" && id) setTimeout(function () { leaveReview(id); }, 0);
    if (a === "swap-not-now" && id) setTimeout(function () { swapNotNow(id); }, 0);
    if (a === "rb-remind-me" && id) setTimeout(function () { remindMe(id); }, 0);
    if (a === "gal-add" || a === "gal-remove") {
      /* gallery tiles change on My profile (outside the edit form): save the list to profiles.extras */
      setTimeout(async function () {
        var me = (T().MEMBERS || []).filter(function (m) { return m.id === S().meId; })[0];
        if (!me || !me.profile) return;
        var ex = Object.assign({}, (RB.profile && RB.profile.extras) || {}, { gallery: me.profile.gallery || [] });
        var r = await db().from("profiles").update({ extras: ex }).eq("id", myId());
        if (r.error) toast("Gallery not saved online: " + r.error.message); else await RB.loadProfile();
      }, 50);
    }
    if (a === "save-complete") {
      setTimeout(function () {
        var f = (S().onboarding && S().onboarding.fill) || {};
        /* complete-profile starts with empty boxes: a blank box means "not filled here", never "erase" */
        function nb(v) { if (Array.isArray(v)) return v.length ? v : undefined; return (v != null && String(v).trim()) ? v : undefined; }
        var lk = f.links || {}, links = {};
        if (nb(lk.facebook)) links.facebook = lk.facebook;
        if (nb(lk.google)) links.google = lk.google;
        saveProfile({ tagline: nb(f.tagline), bio: nb(f.bio), links: links, profile: { goal: nb(f.goal), specialties: nb(f.specialties), idealTrades: nb(f.idealTrades), about: nb(f.about), idealNote: nb(f.idealNote) } });
      }, 0);
    }
  }, true);
  document.addEventListener("submit", function (e) {
    if (!live()) return;
    var f = e.target;
    if (!f || !f.getAttribute || f.getAttribute("data-form") !== "edit-profile") return;
    setTimeout(async function () {
      var me = (T().MEMBERS || []).filter(function (m) { return m.id === S().meId; })[0];
      if (!me) return;
      var ok = await saveProfile(me);
      if (S().photoData && String(S().photoData).indexOf("data:image") === 0) await uploadPhoto(S().photoData);
      if (ok) await sync("profile");
    }, 0);
  }, true);


  /* ================= v2.2.2 live chat + notifications ================= */
  function isUuid(x) { return /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(String(x || "")); }
  function timeLabel(iso) {
    try {
      var d = new Date(iso), day = perthDay(d), today = perthDay(new Date());
      var t = d.toLocaleTimeString("en-AU", { timeZone: "Australia/Perth", hour: "numeric", minute: "2-digit" }).toLowerCase();
      if (day === today) return t;
      if (day === perthDay(new Date(Date.now() - 86400000))) return "Yesterday";
      return d.toLocaleDateString("en-AU", { timeZone: "Australia/Perth", day: "numeric", month: "short" });
    } catch (e) { return ""; }
  }
  var chatSyncing = false;
  async function syncChats() {
    if (!live() || chatSyncing || !window.TC12 || !TC12.setLiveChats) return;
    chatSyncing = true;
    try {
      var me = myId();
      var cv = await db().from("conversations").select("id,kind,title,created_by,dm_key,last_message_at,created_at").is("archived_at", null);
      var cm = await db().from("conversation_members").select("conversation_id,member_id,last_read_at,muted");
      var ids = (cv.data || []).map(function (c) { return c.id; });
      var msgs = ids.length ? await db().from("chat_messages").select("id,conversation_id,sender_id,body,created_at,hidden").in("conversation_id", ids).order("created_at", { ascending: true }).limit(1000) : { data: [] };
      var byConv = {};
      (msgs.data || []).forEach(function (m) { if (m.hidden) return; /* b16 QA #2: hidden by the admin */ (byConv[m.conversation_id] = byConv[m.conversation_id] || []).push(m); });
      var mem = {};
      (cm.data || []).forEach(function (r) { (mem[r.conversation_id] = mem[r.conversation_id] || []).push(r); });
      var list = (cv.data || []).map(function (c) {
        var ms = byConv[c.id] || [], members = mem[c.id] || [];
        var mine = members.filter(function (r) { return r.member_id === me; })[0] || {};
        var lastRead = mine.last_read_at ? new Date(mine.last_read_at).getTime() : 0;
        var unread = ms.filter(function (m) { return m.sender_id !== me && new Date(m.created_at).getTime() > lastRead; }).length;
        var last = ms[ms.length - 1];
        var other = members.filter(function (r) { return r.member_id !== me; })[0];
        var row = {
          id: c.id, live: true, type: c.kind === "group" ? "group" : "dm",
          pinned: false, muted: !!mine.muted, unread: unread,
          when: last ? timeLabel(last.created_at) : timeLabel(c.created_at),
          preview: last ? last.body : "", online: false,
          messages: ms.map(function (m) {
            return { id: m.id, from: m.sender_id === me ? "me" : m.sender_id, type: "text", text: m.body, time: timeLabel(m.created_at), ticks: m.sender_id === me ? "delivered" : undefined };
          })
        };
        if (row.type === "group") { row.name = c.title || "Group chat"; row.members = members.map(function (r) { return r.member_id; }); }
        else row.memberId = other ? other.member_id : (c.created_by === me ? "" : c.created_by);
        row._sort = last ? last.created_at : c.created_at;
        return row;
      });
      list.sort(function (a, b) { return String(b._sort).localeCompare(String(a._sort)); });
      /* keep a local, not-yet-sent DM the member just opened */
      var cur = S().chatId;
      if (cur && !isUuid(cur) && String(cur).indexOf("dm-") === 0) {
        var other2 = String(cur).slice(3);
        var hit = list.filter(function (c) { return c.type === "dm" && c.memberId === other2; })[0];
        if (hit) S().chatId = hit.id;
        else list.unshift({ id: cur, type: "dm", memberId: other2, pinned: false, muted: false, unread: 0, when: "Now", preview: "", online: false, messages: [] });
      }
      TC12.setLiveChats(list);
      await markRead();
      if (TC12.updateBadges) TC12.updateBadges();
      if (["chats", "chat-dm", "chat-group"].indexOf(S().screen) >= 0 || S().screen === "home") rerender();
    } catch (e) { console.warn("RB live chats", e); }
    finally { chatSyncing = false; }
  }
  var lastRead = {};
  async function markRead() {
    var sc = S().screen, cid = S().chatId;
    if ((sc !== "chat-dm" && sc !== "chat-group") || !isUuid(cid)) return;
    if (lastRead[cid] && Date.now() - lastRead[cid] < 3000) return;
    lastRead[cid] = Date.now();
    await db().from("conversation_members").update({ last_read_at: new Date().toISOString() }).eq("conversation_id", cid).eq("member_id", myId());
    var c = (TC12.liveChats() || []).filter(function (x) { return x.id === cid; })[0];
    if (c) c.unread = 0;
    if (TC12.updateBadges) TC12.updateBadges();
  }
  async function ensureDm(otherId) {
    var me = myId(), key = [me, otherId].sort().join(":");
    var f = await db().from("conversations").select("id").eq("dm_key", key).maybeSingle();
    if (f.data) return f.data.id;
    var ins = await db().from("conversations").insert({ kind: "dm", created_by: me, dm_key: key }).select("id").single();
    if (ins.error) throw ins.error;
    var cid = ins.data.id;
    var mm = await db().from("conversation_members").insert([{ conversation_id: cid, member_id: me, role: "owner" }, { conversation_id: cid, member_id: otherId, role: "member" }]);
    if (mm.error) throw mm.error;
    return cid;
  }
  async function sendChatLive(chatId, text) {
    try {
      var cid = chatId;
      if (!isUuid(cid)) {
        var c = (TC12.liveChats() || []).filter(function (x) { return x.id === chatId; })[0];
        var other = (c && c.memberId) || String(chatId).replace(/^dm-/, "");
        if (!isUuid(other)) { toast("This chat is a demo chat and is not sent online."); return; }
        cid = await ensureDm(other);
        S().chatId = cid;
      }
      var r = await db().from("chat_messages").insert({ conversation_id: cid, sender_id: myId(), body: text });
      if (r.error) toast("Message not sent: " + r.error.message);
    } catch (e) { toast("Message not sent: " + ((e && e.message) || "error")); }
    await syncChats();
  }

  var NOTIF_MAP = {
    swap_request: { type: "review", go: "incoming-swap" },
    review_done: { type: "review", go: "reviews" },
    approved: { type: "admin", go: "home" },
    /* v2.2.2 b16 QA #9/#33/#39/#45/#52: kinds written by the 010 triggers */
    friend_request: { type: "admin", go: "members" },
    friend_added: { type: "admin", go: "members" },
    support: { type: "admin", go: "support" },
    feature: { type: "admin", go: "feature-board" },
    account: { type: "admin", go: "notifications" },
    group_added: { type: "admin", go: "chats" }, /* b16 QA #49 */
    info: { type: "alert", go: "notifications" }
  };
  async function syncNotifs() {
    if (!live() || !window.TC12 || !TC12.setLiveNotifs) return;
    try {
      var r = await db().from("notifications").select("id,title,body,kind,payload,read,created_at").order("created_at", { ascending: false }).limit(50);
      if (r.error) return;
      var list = (r.data || []).map(function (n) {
        var m = NOTIF_MAP[n.kind] || NOTIF_MAP.info, p = n.payload || {};
        var row = { id: n.id, live: true, type: m.type, title: n.title, body: n.body, time: timeLabel(n.created_at), unread: !n.read, go: m.go };
        if (p.from && n.kind !== "review_done" && n.kind !== "friend_request" && n.kind !== "friend_added") row.who = p.from;
        return row;
      });
      TC12.setLiveNotifs(list);
      if (["notifications", "home", "reviews", "chats"].indexOf(S().screen) >= 0) rerender();
    } catch (e) { console.warn("RB live notifs", e); }
  }

  document.addEventListener("click", function (e) {
    if (!live()) return;
    var el = e.target.closest && e.target.closest("[data-action]");
    if (!el) return;
    var a = el.getAttribute("data-action");
    if (a === "send-chat") {
      var box = document.getElementById("chatInput");
      var text = box ? box.value.trim() : "", cid = S().chatId;
      if (text && cid) setTimeout(function () { sendChatLive(cid, text); }, 0);
    }
    if (a === "open-notif") {
      var nid = el.getAttribute("data-nid");
      if (isUuid(nid)) db().from("notifications").update({ read: true }).eq("id", nid).then(function () {});
    }
  }, true);
  document.addEventListener("keydown", function (e) {
    if (!live() || e.key !== "Enter" || !e.target || e.target.id !== "chatInput") return;
    var text = e.target.value.trim(), cid = S().chatId;
    if (text && cid) setTimeout(function () { sendChatLive(cid, text); }, 0);
  }, true);


  /* ================= v2.2.2 live Facebook friends ================= */
  var fbRows = [], ledgerSent = {};
  async function syncFriends() {
    if (!live() || !window.TC12 || !TC12.setLiveRel) return;
    try {
      var me = myId();
      var r = await db().from("facebook_friends").select("id,from_member_id,to_member_id,status,created_at,updated_at");
      if (r.error) return;
      fbRows = r.data || [];
      var map = {};
      fbRows.forEach(function (x) {
        var other = x.from_member_id === me ? x.to_member_id : x.from_member_id;
        if (x.status === "added") map[other] = "friends";
        else if (x.status === "requested" && x.from_member_id === me && map[other] !== "friends") map[other] = "pending";
      });
      /* v2.2.2 b16 QA #9: requests sent TO me, waiting for my Confirm / Not now */
      var incoming = {};
      fbRows.forEach(function (x) { if (x.status === "requested" && x.to_member_id === me && map[x.from_member_id] !== "friends") incoming[x.from_member_id] = x; });
      S()._relIn = incoming;
      TC12.setLiveRel(map);
      S()._rel = Object.assign({}, map);
      if (["members", "member", "home", "members-all"].indexOf(S().screen) >= 0) rerender();
    } catch (e) { console.warn("RB live friends", e); }
  }
  async function setFriend(other, status) {
    var me = myId();
    if (!isUuid(other) || other === me) return;
    var mine = fbRows.filter(function (x) { return x.from_member_id === me && x.to_member_id === other; })[0];
    var theirs = fbRows.filter(function (x) { return x.from_member_id === other && x.to_member_id === me; })[0];
    var res;
    /* v2.2.2 b16 QA #29: only the person who RECEIVED a request can confirm it (the DB enforces this too) */
    if (status === "requested" && theirs && theirs.status === "requested" && !mine) status = "added";
    if (status === "added" && !(theirs && theirs.status !== "dismissed" && !mine)) { toast("They need to confirm your request in their app. We'll let you know."); await syncFriends(); return; }
    if (status === "dismissed") res = theirs ? await db().from("facebook_friends").update({ status: "dismissed", updated_at: new Date().toISOString() }).eq("id", theirs.id) : { error: null };
    else if (status === "added" && theirs && !mine) res = await db().from("facebook_friends").update({ status: "added", updated_at: new Date().toISOString() }).eq("id", theirs.id);
    else if (mine) res = (mine.status === "added" && status === "requested") ? { error: null } : await db().from("facebook_friends").update({ status: status, updated_at: new Date().toISOString() }).eq("id", mine.id);
    else res = await db().from("facebook_friends").insert({ from_member_id: me, to_member_id: other, status: status });
    if (res && res.error) toast("Not saved online: " + res.error.message);
    await syncFriends();
  }
  document.addEventListener("click", function (e) {
    if (!live()) return;
    var el = e.target.closest && e.target.closest("[data-action]");
    if (!el) return;
    var a = el.getAttribute("data-action"), id = el.getAttribute("data-id");
    if (a === "mark-sent" && id) setTimeout(function () { setFriend(id, "requested"); }, 0);
    /* recommendation text the member copied: keep it in rec_text_ledger (own rows; admin can read all) */
    if (a === "rec-copy" && isUuid(id)) setTimeout(function () {
      var ui = (S()._recUI || {})[id], pv = document.querySelector(".rec-preview");
      var text = pv ? String(pv.textContent || "").trim() : "";
      if (!ui || !ui.copied || !text || ledgerSent[id + text]) return;
      ledgerSent[id + text] = 1;
      RB.addLedger(id, text).catch(function (err) { console.warn("RB ledger", err); });
    }, 120);
    if (a === "mark-friends" && id) setTimeout(function () { setFriend(id, "added"); }, 0);
    /* v2.2.2 b16 QA #9: incoming request buttons (v222i.js renders them) */
    if (a === "rb-fr-confirm" && id) setTimeout(function () { setFriend(id, "added").then(function () { toast("You're now Facebook friends."); }); }, 0);
    if (a === "rb-fr-notnow" && id) setTimeout(function () { setFriend(id, "dismissed"); }, 0);
  }, true);

  /* first sync after sign-in, then on changes + every 60s */
  var listening = false;
  setInterval(function () {
    if (!live()) return;
    if (!listening) {
      listening = true;
      RB.listen("review_swaps", function () { sync("rt-swaps"); });
      RB.listen("google_reviews", function () { sync("rt-reviews"); });
      RB.listen("chat_messages", function () { syncChats(); });
      RB.listen("conversation_members", function () { syncChats(); });
      RB.listen("notifications", function () { syncNotifs(); });
      RB.listen("facebook_friends", function () { syncFriends(); });
      /* recommendations after a fresh sign-in (rb-app only subscribes when it boots with a saved session);
         a filter keeps these channel names distinct from rb-app's */
      var recRefresh = function () { if (window.RBApp && RBApp.refresh) RBApp.refresh().then(rerender, function () {}); };
      RB.listen("recommendation_requests", recRefresh, "status=eq.approved");
      RB.listen("rec_progress", recRefresh, "member_id=neq.00000000-0000-0000-0000-000000000000");
      syncChats(); syncNotifs(); syncFriends();
    }
    if (Date.now() - lastSync > 60000) { sync("timer"); syncChats(); syncNotifs(); syncFriends(); }
    markRead();
  }, 1500);
  window.RBLive = { get fbRows() { return fbRows; }, inPeriod: inPeriod, setFriend: setFriend, syncFriends: syncFriends, syncChats: syncChats, syncNotifs: syncNotifs, sync: sync, saveProfile: saveProfile, periodStats: periodStats, isLive: live };
})();
