/* Rate Buddies v2.2.2 — Feature Board (vote on ideas, suggest your own).
   Live mode: public.feature_requests + public.feature_votes on the test database (vote_count kept by the
   feature_votes_sync_count trigger). Demo mode: a few fictional ideas only.
   Entry: More screen tile "Feature Board". Screens: feature-board, feature-new. */
(function (root) {
  "use strict";
  function T() { return root.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function live() { return !!(root.RB && RB.client && RB.session && !RB.isDemo() && RB.profile && RB.profile.status === "approved"); }
  function toast(t) { if (T().toast) T().toast(t); }
  function db() { return RB.client; }
  var BACK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
  var BULB = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"/></svg>';
  var UP = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  var CATS = [["reviews", "Google Reviews"], ["facebook", "Facebook"], ["members", "Members and Chat"], ["account", "Account and Profile"], ["notifications", "Notifications"], ["other", "Something Else"]];
  var STATUS = { under_review: "Under Review", planned: "Planned", in_progress: "In Progress", released: "Done", declined: "Declined", archived: "Archived" };
  function catLabel(c) { for (var i = 0; i < CATS.length; i++) if (CATS[i][0] === c) return CATS[i][1]; return "Something Else"; }

  var store = { rows: [], mine: {}, loaded: false, busy: false };
  var DEMO = [
    { id: "d1", title: "Show My Daily Review Limit on Home", body: "Put the daily limit of 3 on the Home dashboard so I can see how many I have left.", category: "reviews", status: "planned", vote_count: 18, author: "Sarah Nguyen", created_at: null },
    { id: "d2", title: "Holiday Away Mode", body: "Let me pause swap requests while I am on holiday.", category: "members", status: "in_progress", vote_count: 14, author: "Emma Brooks", created_at: null },
    { id: "d3", title: "Export My Google Review History", body: "A simple list of every Google Review I have given and received.", category: "reviews", status: "under_review", vote_count: 12, author: "Hannah Lewis", created_at: null }
  ];
  var demoVotes = {};

  async function load() {
    if (!live() || store.busy) return;
    store.busy = true;
    if (!store.listening) { store.listening = true; try { RB.listen("feature_requests", function () { load(); }); } catch (eL) {} }
    try {
      var r = await db().from("feature_requests").select("id,author_id,title,body,category,status,status_reason,vote_count,created_at").neq("status", "archived").order("vote_count", { ascending: false }).order("created_at", { ascending: false });
      var v = await db().from("feature_votes").select("request_id").eq("voter_id", RB.profile.id);
      if (r.error) { toast("Feature board not loaded: " + r.error.message); return; }
      var names = {};
      (T().MEMBERS || []).forEach(function (m) { names[m.id] = ((m.first || "") + " " + (m.last || "")).trim(); });
      store.rows = (r.data || []).map(function (x) { x.author = names[x.author_id] || "A member"; return x; });
      store.mine = {};
      (v.data || []).forEach(function (x) { store.mine[x.request_id] = true; });
      store.loaded = true; store.at = Date.now();
    } finally { store.busy = false; }
    if (/^feature-/.test(S().screen || "")) T().go(S().screen, { replace: true });
  }
  function rows() { return live() ? store.rows : DEMO; }
  function voted(id) { return live() ? !!store.mine[id] : !!demoVotes[id]; }
  function when(iso) { if (!iso) return ""; try { return new Date(iso).toLocaleDateString("en-AU", { timeZone: "Australia/Perth", day: "numeric", month: "short" }); } catch (e) { return ""; } }

  function header(title) {
    return '<div class="app-header"><button class="icon-btn rb-back" type="button" data-action="nav-back" aria-label="Back">' + BACK + '</button><div class="ht">' + title + '</div><span class="header-spacer"></span></div>';
  }
  function renderBoard() {
    if (live() && !store.busy && (!store.loaded || Date.now() - (store.at || 0) > 10000)) setTimeout(load, 0);
    var tab = S()._fbTab || "top";
    var list = rows().slice();
    if (tab === "new") list.sort(function (a, b) { return String(b.created_at || "").localeCompare(String(a.created_at || "")); });
    if (tab === "mine") list = list.filter(function (x) { return live() ? x.author_id === RB.profile.id : false; });
    var tabs = [["top", "Top"], ["new", "New"], ["mine", "My Ideas"]].map(function (t) {
      return '<button type="button" class="rb-fbd-tab' + (tab === t[0] ? " on" : "") + '" data-action="fbd-tab" data-tab="' + t[0] + '">' + t[1] + "</button>";
    }).join("");
    var body = list.length ? list.map(function (x) {
      var on = voted(x.id);
      return '<div class="card rb-fbd-row">' +
        '<button type="button" class="rb-fbd-vote' + (on ? " on" : "") + '" data-action="fbd-vote" data-id="' + esc(x.id) + '" aria-pressed="' + on + '" aria-label="' + (on ? "Remove my vote" : "Vote") + '">' + UP + "<span>" + (x.vote_count || 0) + "</span></button>" +
        '<div class="rb-fbd-main"><div class="rb-fbd-title">' + esc(x.title) + '</div>' +
        '<div class="rb-fbd-body">' + esc(x.body) + "</div>" +
        '<div class="rb-fbd-meta"><span class="pill">' + esc(catLabel(x.category)) + '</span><span class="pill rb-fbd-st st-' + esc(x.status) + '">' + esc(STATUS[x.status] || x.status) + "</span>" +
        "<span>" + esc(x.author || "") + (x.created_at ? " · " + esc(when(x.created_at)) : "") + "</span></div>" +
        (x.status_reason ? '<div class="rb-fbd-reason">' + esc(x.status_reason) + "</div>" : "") +
        "</div></div>";
    }).join("") : '<p class="hint" style="padding:16px">' + (tab === "mine" ? "You have not suggested an idea yet." : "No ideas yet. Be the first to suggest one.") + "</p>";
    return '<section class="screen has-header rb-fbd" data-screen="feature-board">' + header("Feature Board") +
      '<div class="scroll"><p class="hint" style="margin:4px 0 10px">Vote on ideas, or suggest one of your own. The Rate Buddies team builds the ones with enough votes.' + (live() ? "" : " (Demo: fictional ideas)") + "</p>" +
      '<button type="button" class="btn btn-primary" data-go="feature-new" style="width:100%;margin-bottom:12px">Suggest a Feature</button>' +
      '<div class="rb-fbd-tabs" role="tablist">' + tabs + "</div>" + body + "</div></section>";
  }
  function renderNew() {
    var d = S()._fbdDraft || { title: "", body: "", category: "reviews" };
    return '<section class="screen has-header rb-fbd" data-screen="feature-new">' + header("Suggest a Feature") +
      '<div class="scroll"><form data-form="feature-new" novalidate onsubmit="return false">' +
      '<p class="hint">Other members will see this and can vote. The Rate Buddies team reads every idea.</p>' +
      '<div class="field"><label>Title</label><input name="fbdTitle" maxlength="80" placeholder="Remind me when I am close to my daily limit" value="' + esc(d.title) + '"><p class="hint">8 to 80 characters. Be specific.</p></div>' +
      '<div class="field"><label>What are you trying to do?</label><textarea name="fbdBody" rows="5" maxlength="2000" placeholder="Where it gets stuck, and what result you want.">' + esc(d.body) + '</textarea><p class="hint">At least 20 characters.</p></div>' +
      '<div class="field"><label>Category</label><select name="fbdCat">' + CATS.map(function (c) { return '<option value="' + c[0] + '"' + (d.category === c[0] ? " selected" : "") + ">" + c[1] + "</option>"; }).join("") + "</select></div>" +
      '<button type="button" class="btn btn-primary" data-action="fbd-submit" style="width:100%">Submit Idea</button>' +
      '<p class="hint">New ideas start as Under Review.</p></form></div></section>';
  }

  async function submit() {
    var f = document.querySelector('form[data-form="feature-new"]'); if (!f) return;
    var title = f.fbdTitle.value.trim(), body = f.fbdBody.value.trim(), cat = f.fbdCat.value;
    S()._fbdDraft = { title: title, body: body, category: cat };
    if (title.length < 8 || title.length > 80) { toast("Title needs 8 to 80 characters."); return; }
    if (body.length < 20) { toast("Please add at least 20 characters about what you are trying to do."); return; }
    if (!live()) { DEMO.unshift({ id: "d" + Date.now(), title: title, body: body, category: cat, status: "under_review", vote_count: 0, author: "You", created_at: new Date().toISOString() }); }
    else {
      var r = await db().from("feature_requests").insert({ author_id: RB.profile.id, title: title, body: body, category: cat });
      if (r.error) { toast("Idea not sent: " + r.error.message); return; }
    }
    S()._fbdDraft = null; S()._fbTab = "new";
    toast("Thanks. Your idea is on the board.");
    T().go("feature-board");
    load();
  }
  async function vote(id) {
    if (!live()) { demoVotes[id] = !demoVotes[id]; DEMO.forEach(function (x) { if (x.id === id) x.vote_count += demoVotes[id] ? 1 : -1; }); T().go("feature-board", { replace: true }); return; }
    var r = store.mine[id]
      ? await db().from("feature_votes").delete().eq("request_id", id).eq("voter_id", RB.profile.id)   /* member takes back their own vote */
      : await db().from("feature_votes").insert({ request_id: id, voter_id: RB.profile.id });
    if (r.error) toast("Vote not saved: " + r.error.message);
    await load();
  }

  function wrap() {
    if (!root.TC12 || !TC12.render || TC12._rbFeatureBoard) return;
    var prev = TC12.render;
    TC12.render = function (id) {
      if (id === "feature-board") return renderBoard();
      if (id === "feature-new") return renderNew();
      return prev.apply(this, arguments);
    };
    TC12._rbFeatureBoard = 1;
  }
  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest && e.target.closest('[data-action^="fbd-"], [data-go="feature-board"]');
    if (!b) return;
    if (b.getAttribute("data-go") === "feature-board") { load(); return; }
    e.preventDefault(); e.stopImmediatePropagation();
    var a = b.getAttribute("data-action");
    if (a === "fbd-tab") { S()._fbTab = b.getAttribute("data-tab"); T().go("feature-board", { replace: true }); }
    if (a === "fbd-vote") vote(b.getAttribute("data-id"));
    if (a === "fbd-submit") submit();
  }, true);
  function moreTile() {
    var sc = document.querySelector('.screen.active[data-screen="more"]'); if (!sc || sc.dataset.rbFbd) return;
    var grids = sc.querySelectorAll(".v21-more-grid"); if (!grids.length) return;
    sc.dataset.rbFbd = 1;
    grids[grids.length - 1].insertAdjacentHTML("beforeend", '<button type="button" class="v21-more-tile" data-go="feature-board"><span class="v21-more-ico">' + BULB + "</span><span>Feature Board</span></button>");
  }
  function css() {
    if (document.getElementById("rb-fbd-css")) return;
    var st = document.createElement("style"); st.id = "rb-fbd-css";
    st.textContent = ".rb-fbd-tabs{display:flex;gap:6px;margin:0 0 10px}.rb-fbd-tab{flex:1;padding:8px;border-radius:10px;border:1px solid rgba(10,19,40,.15);background:#fff;font-weight:700}" +
      ".rb-fbd-tab.on{background:#0A1328;color:#fff}.rb-fbd-row{display:flex;gap:12px;padding:12px;margin-bottom:10px;align-items:flex-start}" +
      ".rb-fbd-vote{display:flex;flex-direction:column;align-items:center;gap:2px;min-width:48px;padding:8px 6px;border-radius:12px;border:1px solid rgba(10,19,40,.18);background:#fff;font-weight:800}" +
      ".rb-fbd-vote.on{background:#1A73E8;color:#fff;border-color:#1A73E8}.rb-fbd-main{flex:1;min-width:0}.rb-fbd-title{font-weight:800}.rb-fbd-body{font-size:14px;opacity:.85;margin:4px 0}" +
      ".rb-fbd-meta{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12px;opacity:.85}.rb-fbd-reason{font-size:13px;margin-top:6px;font-style:italic}";
    document.head.appendChild(st);
  }
  function tick() { wrap(); moreTile(); css(); }
  if (root.MutationObserver) new MutationObserver(function () { tick(); }).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tick); else tick();
  root.TCFeatureBoard = { load: load, render: renderBoard };
})(window);
