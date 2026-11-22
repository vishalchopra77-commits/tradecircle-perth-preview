/* Rate Buddies v1.9.0 — Supabase client wrapper (anon key only).
   v2.2.2 live: profiles columns listed explicitly (email/phone are private since
   migration rb_live_002); contact details come from the member_contact RPCs;
   admin check uses the admins table via is_admin(). */
(function (root) {
  "use strict";
  var DEMO_KEY = "rb_demo_offline";
  var client = null;
  var session = null;
  var profile = null;
  var subs = [];
  var adminFlag = false;
  /* Every profiles column members may read. email + phone are NOT here on purpose. */
  var PROFILE_COLS = "id,first_name,last_name,business,trade,state,city,regions,status,role,intro_watched," +
    "rec_share,facebook,page,website,profile_url,bio,color,created_at,updated_at,approved_at,approved_by," +
    "trade_slug,suburb,tagline,goal,services,referral_partners,google_business_url,years_in_business,licences," +
    "avatar_path,cover_path,available_for_swap,swap_paused_on,reviews_received_count,reviews_given_count,archived_at,extras";

  function cfg() { return root.RBConfig || {}; }
  function ready() { return !!(client && cfg().url && cfg().anonKey); }
  function isDemo() {
    try { return localStorage.getItem(DEMO_KEY) === "1"; } catch (e) { return false; }
  }
  function setDemo(on) {
    try {
      if (on) localStorage.setItem(DEMO_KEY, "1");
      else localStorage.removeItem(DEMO_KEY);
    } catch (e) {}
  }
  function toast(msg) {
    if (root.TradeCircle && TradeCircle.toast) TradeCircle.toast(msg);
    else if (root.TCAdmin) { /* admin may not have toast */ }
  }

  function init() {
    if (client) return client;
    if (!root.supabase || !cfg().url || !cfg().anonKey) return null;
    client = root.supabase.createClient(cfg().url, cfg().anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" } /* v2.2.2b: PKCE so Facebook sign-in can return to the app with a code */
    });
    client.auth.onAuthStateChange(function (_evt, sess) {
      session = sess || null;
    });
    return client;
  }

  function profileFromRow(row) {
    if (!row) return null;
    var slug = (row.profile_url || "").split("/").pop() || row.id;
    return {
      id: row.id,
      slug: slug,
      first: row.first_name,
      last: row.last_name,
      name: ((row.first_name || "") + " " + (row.last_name || "")).trim(),
      business: row.business,
      trade: row.trade,
      regions: row.regions || [],
      areas: (row.regions || []).join(", "),
      state: row.state,
      city: row.city,
      status: row.status,
      role: row.role,
      intro_watched: !!row.intro_watched,
      recShare: row.rec_share || { phone: true, facebook: true, website: true, profile: true },
      phone: row.phone || "",
      facebook: row.facebook || "",
      page: row.page || "",
      links: { website: row.website || "", facebook: row.page || row.facebook || "" },
      profileUrl: row.profile_url || "",
      bio: row.bio || "",
      color: row.color || "navy",
      email: row.email || "",
      suburb: row.suburb || "",
      tagline: row.tagline || "",
      goal: row.goal || "",
      services: row.services || [],
      referralPartners: row.referral_partners || [],
      googleBusinessUrl: row.google_business_url || "",
      availableForSwap: row.available_for_swap !== false,
      reviewsReceived: row.reviews_received_count || 0,
      reviewsGiven: row.reviews_given_count || 0,
      years: row.years_in_business,
      licences: row.licences || "",
      avatarPath: row.avatar_path || "",
      extras: row.extras || {},
      archivedAt: row.archived_at || null,
      created_at: row.created_at,
      isMe: !!(session && session.user && session.user.id === row.id)
    };
  }

  async function getSession() {
    if (!init()) return null;
    var res = await client.auth.getSession();
    session = (res.data && res.data.session) || null;
    return session;
  }

  async function loadProfile() {
    if (!init() || !session) { profile = null; return null; }
    var res = await client.from("profiles").select(PROFILE_COLS).eq("id", session.user.id).maybeSingle();
    if (res.error) throw res.error;
    var row = res.data;
    if (row) {
      /* own email + phone through the owner/admin-only RPC */
      try {
        var c = await client.rpc("member_contact", { target: session.user.id });
        var cr = c.data && c.data[0];
        if (cr) { row.email = cr.email; row.phone = cr.phone; }
      } catch (e) {}
      if (!row.email && session.user.email) row.email = session.user.email;
    }
    profile = profileFromRow(row);
    try { adminFlag = await checkAdmin(); } catch (e) { adminFlag = false; }
    if (profile) profile.isAdmin = adminFlag;
    return profile;
  }

  async function checkAdmin() {
    if (!init() || !session) return false;
    var res = await client.rpc("is_admin");
    if (res.error) throw res.error;
    return res.data === true;
  }

  async function login(email, password) {
    if (!init()) throw new Error("Not connected");
    var res = await client.auth.signInWithPassword({ email: email, password: password });
    if (res.error) throw res.error;
    session = res.data.session;
    await loadProfile();
    return profile;
  }

  async function signup(fields) {
    if (!init()) throw new Error("Not connected");
    var res = await client.auth.signUp({
      email: fields.email,
      password: fields.password,
      options: {
        data: {
          first_name: fields.first || "",
          last_name: fields.last || "",
          business: fields.business || "",
          trade: fields.trade || "",
          phone: fields.phone || ""
        }
      }
    });
    if (res.error) throw res.error;
    session = res.data.session;
    if (session) {
      await loadProfile();
      var patch = {
        first_name: fields.first || "",
        last_name: fields.last || "",
        business: fields.business || "",
        trade: fields.trade || "",
        phone: fields.phone || "",
        regions: fields.regions || [],
        city: fields.city || "Perth",
        state: fields.state || "wa"
      };
      var upd = await client.from("profiles").update(patch).eq("id", session.user.id);
      if (upd.error) throw upd.error;
      await loadProfile();
    }
    return { session: session, profile: profile, needsConfirm: !session };
  }

  async function logout() {
    if (!init()) return;
    /* v2.2.2d: sign out this device only (a global sign-out also logged the same person out on their phone) */
    await client.auth.signOut({ scope: "local" });
    session = null;
    profile = null;
    adminFlag = false;
    subs.forEach(function (s) { try { s.unsubscribe(); } catch (e) {} });
    subs = [];
  }

  async function listProfiles() {
    var res = await client.from("profiles").select(PROFILE_COLS).order("first_name");
    if (res.error) throw res.error;
    var rows = res.data || [];
    if (adminFlag) {
      /* admins also get every member's email + phone (admin-only RPC) */
      var c = await client.rpc("admin_member_contacts");
      if (!c.error && c.data) {
        var byId = {};
        c.data.forEach(function (x) { byId[x.member_id] = x; });
        rows.forEach(function (r) { var x = byId[r.id]; if (x) { r.email = x.email; r.phone = x.phone; } });
      }
    }
    return rows.map(profileFromRow);
  }

  async function listRequests() {
    var res = await client.from("recommendation_requests").select("*").order("created_at", { ascending: false });
    if (res.error) throw res.error;
    return res.data || [];
  }

  async function listProgress(requestId) {
    var q = client.from("rec_progress").select("*");
    if (requestId) q = q.eq("request_id", requestId);
    var res = await q;
    if (res.error) throw res.error;
    return res.data || [];
  }

  async function listNotifications() {
    var res = await client.from("notifications").select("*").order("created_at", { ascending: false }).limit(50);
    if (res.error) throw res.error;
    return res.data || [];
  }

  async function listTutorials() {
    var secs = await client.from("tutorial_sections").select("*").order("sort_order");
    var vids = await client.from("tutorial_videos").select("*").order("sort_order");
    var intro = await client.from("intro_settings").select("*").eq("id", 1).maybeSingle();
    var prev = await client.from("previous_intros").select("*");
    if (secs.error) throw secs.error;
    if (vids.error) throw vids.error;
    return {
      sections: secs.data || [],
      videos: vids.data || [],
      intro: intro.data || null,
      previousIntros: (prev.data || [])
    };
  }

  async function approveMember(id) {
    var res = await client.rpc("admin_set_member_status", { target: id, new_status: "approved" });
    if (res.error) throw res.error;
    return res.data;
  }
  async function rejectMember(id) {
    var res = await client.rpc("admin_set_member_status", { target: id, new_status: "rejected" });
    if (res.error) throw res.error;
    return res.data;
  }
  async function approveRequest(id, featuredId) {
    var res = await client.rpc("admin_approve_request", { req: id, featured: featuredId || null });
    if (res.error) throw res.error;
    return res.data;
  }
  async function dismissRequest(id) {
    var res = await client.rpc("admin_dismiss_request", { req: id });
    if (res.error) throw res.error;
    return res.data;
  }
  async function createRequest(fields) {
    var res = await client.from("recommendation_requests").insert(fields).select().single();
    if (res.error) throw res.error;
    return res.data;
  }
  async function markRecommended(requestId) {
    var res = await client.from("rec_progress").insert({ request_id: requestId, member_id: session.user.id });
    if (res.error && String(res.error.message || "").indexOf("duplicate") === -1
        && res.error.code !== "23505") throw res.error;
    return true;
  }
  async function markIntroWatched() {
    var res = await client.from("profiles").update({ intro_watched: true }).eq("id", session.user.id);
    if (res.error) throw res.error;
    if (profile) profile.intro_watched = true;
  }
  async function addLedger(requestId, text) {
    var res = await client.from("rec_text_ledger").insert({
      request_id: requestId, viewer_id: session.user.id, issued_text: text
    });
    if (res.error && res.error.code !== "23505") throw res.error;
  }
  async function markVideoWatched(videoId) {
    var res = await client.from("tutorial_watched").insert({ member_id: session.user.id, video_id: videoId });
    if (res.error && res.error.code !== "23505") throw res.error;
  }

  function listen(table, cb, filter) {
    if (!init()) return;
    var opts = { event: "*", schema: "public", table: table };
    if (filter) opts.filter = filter;
    var ch = client.channel("rb-" + table + (filter ? "-" + filter : ""))
      .on("postgres_changes", opts, cb)
      .subscribe();
    subs.push(ch);
  }

  /* v2.1.3: support desk thread (table from migration 20261121_v213_support_messages.sql — not applied yet) */
  async function listSupport(memberId) {
    var q = client.from("support_messages").select("*").order("created_at", { ascending: true });
    if (memberId) q = q.eq("member_id", memberId);
    var res = await q;
    if (res.error) throw res.error;
    return res.data || [];
  }
  async function sendSupport(body, topic, memberId) {
    var asAdmin = !!memberId;
    var row = asAdmin
      ? { member_id: memberId, from_admin: true, admin_id: session.user.id, body: body, topic: topic || null }
      : { member_id: session.user.id, from_admin: false, body: body, topic: topic || null };
    var res = await client.from("support_messages").insert(row).select().single();
    if (res.error) throw res.error;
    return res.data;
  }

  root.RB = {
    init: init, isDemo: isDemo, setDemo: setDemo, ready: ready,
    getSession: getSession, loadProfile: loadProfile,
    login: login, signup: signup, logout: logout, checkAdmin: checkAdmin,
    get isAdmin() { return adminFlag; },
    listProfiles: listProfiles, listRequests: listRequests, listProgress: listProgress,
    listNotifications: listNotifications, listTutorials: listTutorials,
    approveMember: approveMember, rejectMember: rejectMember,
    approveRequest: approveRequest, dismissRequest: dismissRequest, createRequest: createRequest,
    markRecommended: markRecommended, markIntroWatched: markIntroWatched,
    addLedger: addLedger, markVideoWatched: markVideoWatched,
    listSupport: listSupport, sendSupport: sendSupport,
    listen: listen, profileFromRow: profileFromRow,
    get session() { return session; },
    get profile() { return profile; },
    get client() { return client; }
  };
})(window);
