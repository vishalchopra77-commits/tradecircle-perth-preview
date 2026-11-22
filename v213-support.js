/* Rate Buddies v2.1.3 — Support desk chat + "Join Our Facebook Group" More tile.
   Live mode: RB.listSupport / RB.sendSupport (table support_messages, migration 20261121 — NOT applied yet, needs Vishal's OK).
   Demo mode: fictional messages only. */
(function (root) {
  "use strict";
  var FB_GROUP = "https://www.facebook.com/groups/1759241485177001";
  var TOPICS = ["Account", "Reviews", "Facebook", "Billing", "Report a problem"];
  function T() { return root.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function live() { return root.RB && RB.isDemo && !RB.isDemo() && RB.session && !(S() && S()._supportOff); }
  var BACK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
  var HEADSET = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14v-2a8 8 0 0116 0v2"/><rect x="3" y="13" width="4" height="7" rx="2"/><rect x="17" y="13" width="4" height="7" rx="2"/><path d="M19 20a3 3 0 01-3 3h-3"/></svg>';
  var CLIP = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5l-8.6 8.6a5 5 0 01-7.1-7.1l8.6-8.6a3.5 3.5 0 015 5l-8.6 8.6a2 2 0 01-2.8-2.8l7.9-7.9"/></svg>';
  var SEND = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>';
  var FBF = '<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg>';
  var BELL = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8A6 6 0 106 8c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21a2 2 0 004 0"/></svg>';

  function demoThread() {
    var st = S();
    if (!st._support) st._support = { msgs: [
      { me: false, body: "Hi Jamie, welcome to Rate Buddies Support. How can we help today?", when: "Yesterday 4:02 pm" },
      { me: true, topic: "Reviews", body: "My Google Review for Reeves Fencing is not showing on their card yet.", when: "Yesterday 4:05 pm" },
      { me: false, body: "Thanks for letting us know. Google can take up to 24 hours to publish a new review. If it is still missing tomorrow, reply here and we will check it for you.", when: "Yesterday 4:31 pm" }
    ] };
    return st._support.msgs;
  }
  function thread(empty) {
    if (empty) return [];
    if (live()) return (S()._supportLive || []).map(function (r) { return { me: !r.from_admin, body: r.body, topic: r.topic, when: new Date(r.created_at).toLocaleString("en-AU", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) }; });
    return demoThread();
  }
  function renderSupport(empty) {
    var msgs = thread(empty);
    var body = msgs.length
      ? msgs.map(function (m) { return '<div class="bub ' + (m.me ? "out" : "in") + ' rb-sup-bub">' + (m.topic ? '<span class="rb-sup-topic">' + esc(m.topic) + "</span>" : "") + esc(m.body) + '<div class="time">' + esc(m.when) + "</div></div>"; }).join("")
      : '<div class="rb-sup-empty"><div class="rb-sup-empty-ico">' + HEADSET + '</div><p class="rb-sup-empty-t">How can we help?</p><p class="rb-sup-empty-s">Pick a topic below or type your question. A real person from the Rate Buddies team will reply here.</p></div>';
    return '<section class="screen has-header chat-screen rb-support" data-screen="support">' +
      '<div class="app-header"><button class="icon-btn rb-back" type="button" data-action="nav-back" aria-label="Back">' + BACK + '</button><div class="ht">Support</div><span class="header-spacer"></span></div>' +
      '<div class="rb-sup-who"><span class="rb-sup-av">' + HEADSET + '</span><span class="rb-sup-meta"><strong>Rate Buddies Support</strong><span>Usually replies within a few hours</span></span></div>' +
      '<div class="chat-thread rb-sup-thread" id="supportThread">' + body + "</div>" +
      '<div class="quick-row rb-sup-topics" role="group" aria-label="Topics">' + TOPICS.map(function (t) { return '<button type="button" class="rb-sup-chip' + (S()._supTopic === t ? " on" : "") + '" data-action="sup-topic" data-topic="' + esc(t) + '">' + esc(t) + "</button>"; }).join("") + "</div>" +
      '<div class="chat-composer rb-sup-composer"><button class="plus" type="button" data-action="sup-attach" aria-label="Attach">' + CLIP + '</button><textarea id="supportInput" rows="1" placeholder="Message Support"></textarea><button class="send" type="button" data-action="sup-send" aria-label="Send">' + SEND + "</button></div>" +
      "</section>";
  }
  function wrap() {
    if (!root.TC12 || !TC12.render || TC12._rbSupport) return;
    var prev = TC12.render;
    TC12.render = function (id) {
      if (id === "support") return renderSupport(false);
      if (id === "support-empty") return renderSupport(true).replace('data-screen="support"', 'data-screen="support-empty"');
      return prev.apply(this, arguments);
    };
    TC12._rbSupport = 1;
  }
  function refreshLive() {
    if (!live()) return;
    RB.listSupport(RB.session.user.id).then(function (rows) { S()._supportLive = rows; if (S().screen === "support") T().go("support", { replace: true }); })
      .catch(function () { /* table not created yet (migration not applied): fall back to the demo thread */ S()._supportOff = true; if (S().screen === "support") T().go("support", { replace: true }); });
  }
  function toast(t) { if (T().toast) T().toast(t); }
  root.addEventListener("click", function (e) {
    var b = e.target && e.target.closest && e.target.closest('[data-action^="sup-"], [data-go="support"], .rb-fb-group');
    if (!b) return;
    if (b.classList.contains("rb-fb-group")) return; /* real link: opens outside the app */
    var act = b.getAttribute("data-action");
    if (b.getAttribute("data-go") === "support") { refreshLive(); return; }
    e.preventDefault(); e.stopImmediatePropagation();
    if (act === "sup-topic") { S()._supTopic = S()._supTopic === b.dataset.topic ? null : b.dataset.topic; document.querySelectorAll(".screen.active .rb-sup-chip").forEach(function (c) { c.classList.toggle("on", c.dataset.topic === S()._supTopic); }); var ta = document.getElementById("supportInput"); if (ta) ta.focus(); return; }
    if (act === "sup-attach") { toast("Attach a screenshot or photo (prototype)."); return; }
    if (act === "sup-send") {
      var inp = document.getElementById("supportInput"); var txt = inp ? inp.value.trim() : ""; if (!txt) { toast("Type a message first."); return; }
      var topic = S()._supTopic || null;
      if (live()) { RB.sendSupport(txt, topic).then(refreshLive).catch(function () { S()._supportOff = true; toast("Support chat is not switched on yet. Please try again later."); }); }
      else { demoThread().push({ me: true, topic: topic, body: txt, when: "Just now" }); S()._supTopic = null; T().go(S().screen === "support-empty" ? "support-empty" : "support", { replace: true }); }
      return;
    }
  }, true);
  function moreTiles() {
    var sc = document.querySelector('.screen.active[data-screen="more"]'); if (!sc || sc.dataset.rbSup) return;
    var grids = sc.querySelectorAll(".v21-more-grid"); if (grids.length < 2) return;
    sc.dataset.rbSup = 1;
    grids[0].insertAdjacentHTML("beforeend", '<a class="v21-more-tile rb-fb-group" href="' + FB_GROUP + '" target="_blank" rel="noopener noreferrer"><span class="v21-more-ico fb">' + FBF + "</span><span>Join Our Facebook Group</span></a>");
    var help = grids[1].querySelector('[data-go="help"]');
    var sup = '<button type="button" class="v21-more-tile" data-go="support"><span class="v21-more-ico">' + HEADSET + "</span><span>Support</span></button>";
    var notif = '<button type="button" class="v21-more-tile" data-go="notif-settings"><span class="v21-more-ico">' + BELL + "</span><span>Notification settings</span></button>";
    if (help) help.insertAdjacentHTML("afterend", sup); else grids[1].insertAdjacentHTML("beforeend", sup);
    if (!grids[1].querySelector('[data-go="notif-settings"]')) grids[1].insertAdjacentHTML("beforeend", notif);
  }
  function helpLink() {
    var sc = document.querySelector('.screen.active[data-screen="help"]'); if (!sc || sc.dataset.rbSup) return;
    var scr = sc.querySelector(".scroll"); if (!scr) return; sc.dataset.rbSup = 1;
    scr.insertAdjacentHTML("afterbegin", '<button type="button" class="card rb-help-support" data-go="support"><span class="rb-sup-av">' + HEADSET + '</span><span class="rb-sup-meta"><strong>Chat with Support</strong><span>Ask the Rate Buddies team anything</span></span></button>');
  }
  function external(e) {
    var a = e.target && e.target.closest && e.target.closest("a.rb-fb-group"); if (!a) return;
    /* Capacitor: hand the link to the system (Facebook app or browser), never the in-app webview */
    var cap = root.Capacitor;
    if (cap && cap.isNativePlatform && cap.isNativePlatform()) {
      e.preventDefault();
      if (root.RBOpen && RBOpen.open) { RBOpen.open(a.href); return; } /* b18: Facebook group in the Facebook app */
      /* Capacitor's Android bridge sends navigations to other hosts to the system (ACTION_VIEW: Facebook app or browser) */
      if (cap.Plugins && cap.Plugins.AppLauncher) { cap.Plugins.AppLauncher.openUrl({ url: a.href }).catch(function () { root.location.href = a.href; }); }
      else root.location.href = a.href;
    }
  }
  document.addEventListener("click", external, true);
  function tick() { wrap(); moreTiles(); helpLink(); }
  if (root.MutationObserver) new MutationObserver(function () { tick(); }).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tick); else tick();
  root.TCSupport = { render: renderSupport, FB_GROUP: FB_GROUP };
})(window);
