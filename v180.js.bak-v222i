/* Rate Buddies v1.8.0 — Devi automatic recommendation requests (member app, fictional) */
(function (root) {
  "use strict";
  function T() { return root.TradeCircle || {}; }
  function S() { return (T().state || (T().state = {})); }
  function C() { return root.TCDeviCity || null; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }
  function facebookF(size, color) {
    size = size || 16;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="' + (color || "currentColor") + '" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg>';
  }
  function member(id) {
    var list = T().MEMBERS || (C() && C().CIRCLE) || [];
    var i;
    for (i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function firstName(m) {
    if (C()) return C().firstName(m);
    return (m && m.first) || "them";
  }
  function featuredOf(p) {
    if (p.forId) return member(p.forId);
    if (C()) return C().pickFeatured(p.city || "Perth", p.trade, null, ["michael"]);
    return member("michael");
  }
  function alertCount(p) {
    if (typeof p.of === "number" && p.of) return p.of;
    if (C()) return C().summary(p.city || "Perth", p.trade).alertCount;
    return 12;
  }

  function seedPosts() {
    var s = S();
    if (!s._fbPosts && root.TC159 && TC159.posts) TC159.posts();
    if (!s._fbPosts) s._fbPosts = [];
    if (s._deviSeeded) return s._fbPosts;
    s._deviSeeded = true;
    var exists = s._fbPosts.some(function (p) { return p.id === "d1"; });
    if (!exists) {
      s._fbPosts.unshift({
        id: "d1",
        source: "devi",
        status: "new",
        group: "Joondalup Community Noticeboard",
        ask: "Can anyone recommend a plumber in Joondalup? Burst pipe under the kitchen and I need someone today.",
        trade: "Plumber",
        city: "Perth",
        region: "Perth",
        suburb: "Joondalup",
        link: "https://www.facebook.com/groups/joondalup.community.noticeboard.demo/posts/662018",
        when: "12 minutes ago",
        vouched: 2,
        of: 12,
        closes: "18 hours left",
        confidence: 92,
        forId: "michael",
        idea: ""
      });
    }
    return s._fbPosts;
  }

  function areaCount() {
    seedPosts();
    return (S()._fbPosts || []).filter(function (p) { return p.source === "devi" && p.status === "new"; }).length;
  }

  function av(m, n) {
    if (T().avatarHTML && m) return T().avatarHTML(m, n);
    var ini = ((m && m.first) || "?").charAt(0) + ((m && m.last) || "").charAt(0);
    return '<div class="av av-navy" style="width:' + n + "px;height:" + n + 'px">' + esc(ini) + "</div>";
  }
  function tradeIco(trade) {
    return (root.TC159 && TC159.tradeIcon) ? TC159.tradeIcon(trade) : "";
  }

  function deviCard(p, open) {
    var feat = featuredOf(p);
    var first = feat ? firstName(feat) : "them";
    var st = p.status === "done" ? "done" : p.status === "expired" ? "expired" : "new";
    var stLab = st === "done" ? "Done" : st === "expired" ? "Expired" : "New";
    var of = alertCount(p);
    var pct = Math.round((p.vouched / Math.max(of, 1)) * 100);
    var html = '<article class="rec-card is-devi' + (st === "done" ? " is-done" : "") + '" data-rec="' + p.id + '">' +
      '<div class="rec-top"><div class="rec-gmark"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg></div>' +
      '<div class="rec-group"><div class="g">' + esc(p.group) + '</div><div class="t">Matched by Devi · ' + esc(p.when) + "</div></div>" +
      '<span class="rec-devi-badge">Auto-matched</span></div>' +
      '<p class="rec-help">Let’s help ' + esc(first) + "!</p>" +
      '<p class="rec-ask">' + esc(p.ask) + "</p>";
    if (feat) {
      html += '<div class="rec-who">' + av(feat, 44) +
        '<div class="meta"><div class="nm">' + esc(feat.first + (feat.last ? " " + feat.last : "")) + "</div>" +
        '<div class="biz">' + esc(feat.business || "") + "</div>" +
        '<div class="pills"><span class="pill t-pill">' + tradeIco(feat.trade) + esc(feat.trade) + "</span>" +
        '<span class="pill r-pill">' + esc(p.city || "Perth") + "</span></div></div></div>";
    }
    html += '<div class="rec-progress"><div class="bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="lab">' + p.vouched + " of " + of + " " + esc(p.city || "Perth") + " members have already recommended " + esc(first) +
      (p.closes ? " · " + esc(p.closes) : "") + "</div></div>" +
      '<a class="btn btn-fb has-ico" href="' + esc(p.link) + '" target="_blank" rel="noopener noreferrer">' + facebookF(16, "#fff") + "<span>Open post on Facebook</span></a>";
    if (st === "new") {
      html += '<button type="button" class="btn btn-primary btn-done" data-action="done-rec" data-id="' + p.id + '">I recommended ' + esc(first) + "</button>";
    } else if (st === "done") {
      html += '<div class="reviewed-tick" style="margin-top:8px">You’ve marked this as done — thanks for helping ' + esc(first) + ".</div>";
    }
    html += '<div class="rec-tip">Only recommend ' + esc(first) + " if you genuinely know his work, and say so in your own words. Do not copy a script, and do not vouch just because the app asked you to.</div>";
    return html + "</article>";
  }

  function patchRecommend(html, id) {
    seedPosts();
    var s = S();
    var openId = s.recOpen || (id === "fb-recommend-open" ? "d1" : "");
    if (id === "fb-recommend-open") s.recOpen = "d1";
    (s._fbPosts || []).forEach(function (p) {
      if (p.source !== "devi") return;
      var re = new RegExp('<article class="rec-card[\\s\\S]*?data-rec="' + p.id + '"[\\s\\S]*?</article>');
      var open = openId === p.id || id === "fb-recommend-open";
      if (re.test(html)) html = html.replace(re, deviCard(p, open));
    });
    var d1 = (s._fbPosts || []).filter(function (p) { return p.id === "d1" && p.status === "new"; })[0];
    var filter = s.recFilter || (id === "fb-recommend-done" ? "done" : "todo");
    if (d1 && filter !== "done" && html.indexOf('data-rec="d1"') === -1) {
      html = html.replace(/<\/div>(\s*<article class="rec-card)/, "</div>" + deviCard(d1, true) + "$1");
    }
    var todoN = (s._fbPosts || []).filter(function (p) { return p.status === "new" && p.forId !== "jamie"; }).length;
    html = html.replace(/(data-filter="todo">To do<span class="n">)\d+/, "$1" + todoN);
    return html;
  }

  function notifRow() {
    return '<button type="button" class="notif-row unread" data-action="open-devi-rec" data-nid="n-devi-d1">' +
      (root.notifTile ? root.notifTile("queue", 16) : '<div class="notif-ico" style="background:#E8F1FD;color:#1877F2">' + facebookF(16, "#1877F2") + "</div>") +
      '<div style="flex:1;min-width:0"><div class="ttl">Facebook recommendation alert for “Plumber” — Let’s help Michael!</div>' +
      '<div class="bd">Open the post on Facebook only if you genuinely know his work.</div>' +
      '<div class="tm">Just now</div></div></button>';
  }

  function patchHome(html) {
    var n = areaCount();
    if (!n) return html;
    var block = '<button type="button" class="ov-req-count" data-go="fb-recommend">' +
      '<span class="n">' + n + "</span>" +
      "<div><strong>Requests in your city</strong><span>" +
      "Let’s help Michael — plumber wanted in Perth" +
      "</span></div></button>";
    if (html.indexOf("ov-req-count") !== -1) return html;
    if (html.indexOf("ov-card ov-facebook") !== -1) {
      html = html.replace(
        /(<section class="ov-card ov-facebook">[\s\S]*?)(<div class="ov-note-line">)/,
        "$1" + block + "$2"
      );
    }
    return html;
  }

  function patchNotifications(html) {
    if (!html || html.indexOf("notif-row") === -1) return html;
    if (html.indexOf("n-devi-d1") !== -1) return html;
    html = html.replace('<div class="scroll" style="padding-left:0;padding-right:0">',
      '<div class="scroll" style="padding-left:0;padding-right:0">' + notifRow());
    return html;
  }

  function wrap() {
    if (root.TC12 && TC12.render && !TC12._v180) {
      var prev = TC12.render;
      TC12.render = function (id) {
        seedPosts();
        var html = prev.apply(this, arguments);
        if (!html) return html;
        if (id === "home") html = patchHome(html);
        if (id === "notifications") html = patchNotifications(html);
        if (id && String(id).indexOf("fb-recommend") === 0) html = patchRecommend(html, id);
        return html;
      };
      TC12._v180 = 1;
    }
    if (root.TC159 && TC159.pendingCount && !TC159._v180pend) {
      var prevP = TC159.pendingCount;
      TC159.pendingCount = function () {
        seedPosts();
        return prevP();
      };
      TC159._v180pend = 1;
    }
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-action='open-devi-rec']");
    if (!btn) return;
    e.preventDefault();
    S().recFilter = "todo";
    S().recOpen = "d1";
    if (T().go) T().go("fb-recommend-open");
  }, true);

  function boot() { wrap(); }
  if (root.TC12) boot();
  else document.addEventListener("DOMContentLoaded", boot);
  setTimeout(boot, 0);

  root.TC180 = { areaCount: areaCount, seedPosts: seedPosts, deviCard: deviCard };
})(window);
