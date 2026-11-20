/* Rate Buddies v2.1.1 — member profile actions, badges, promotion queue, vouch confirm */
(function (root) {
  "use strict";

  var LS_TIERS = "tc_badge_tiers";
  var LS_STATS = "tc_badge_stats";
  var LS_VOUCHES = "tc_vouches";

  var DEFAULT_TIERS = [
    { id: "bronze", label: "Bronze", min: 5, color: "#B87333" },
    { id: "silver", label: "Silver", min: 12, color: "#6B7787" },
    { id: "gold", label: "Gold", min: 25, color: "#C9A227" },
    { id: "platinum", label: "Platinum", min: 50, color: "#4F6D8C" }
  ];

  /* Fictional demo totals: Google Reviews given + confirmed Facebook vouches. */
  var DEFAULT_STATS = {
    jamie: { reviews: 8, vouches: 4 },
    sarah: { reviews: 18, vouches: 10 },
    tom: { reviews: 22, vouches: 9 },
    priya: { reviews: 16, vouches: 10 },
    liam: { reviews: 6, vouches: 2 },
    chris: { reviews: 5, vouches: 1 },
    emma: { reviews: 4, vouches: 0 },
    jack: { reviews: 3, vouches: 1 },
    mei: { reviews: 2, vouches: 1 },
    noah: { reviews: 7, vouches: 2 },
    michael: { reviews: 11, vouches: 5 },
    hannah: { reviews: 1, vouches: 0 },
    marcus: { reviews: 3, vouches: 0 },
    daniel: { reviews: 2, vouches: 0 }
  };

  var DEFAULT_VOUCHES = [
    { id: "v1", from: "jamie", to: "sarah", trade: "Carpenter", when: "12 Nov", status: "confirmed", post: "https://www.facebook.com/groups/ratebuddies.perth.demo/posts/840120261211" },
    { id: "v2", from: "jamie", to: "michael", trade: "Plumber", when: "8 Nov", status: "confirmed", post: "https://www.facebook.com/groups/ratebuddies.perth.demo/posts/840120260808" },
    { id: "v3", from: "jamie", to: "liam", trade: "Plumber", when: "Today", status: "pending", post: "https://www.facebook.com/groups/ratebuddies.perth.demo/posts/840120261120" },
    { id: "v4", from: "tom", to: "jamie", trade: "Pest Control", when: "Yesterday", status: "pending", post: "https://www.facebook.com/groups/perth.homeowners.demo/posts/10112026" },
    { id: "v5", from: "mei", to: "jamie", trade: "Pest Control", when: "Mon", status: "pending", post: "https://www.facebook.com/groups/perth.homeowners.demo/posts/10111826" },
    { id: "v6", from: "sarah", to: "jamie", trade: "Pest Control", when: "5 Nov", status: "confirmed", post: "https://www.facebook.com/groups/ratebuddies.perth.demo/posts/840120260505" },
    { id: "v7", from: "sarah", to: "michael", trade: "Plumber", when: "Today", status: "confirmed", requestId: "d1", biz: "Shaw Plumbing", post: "https://www.facebook.com/groups/joondalup.community.noticeboard.demo/posts/662018?comment_id=801" },
    { id: "v8", from: "tom", to: "michael", trade: "Plumber", when: "Today", status: "confirmed", requestId: "d1", biz: "Shaw Plumbing", post: "https://www.facebook.com/groups/joondalup.community.noticeboard.demo/posts/662018?comment_id=814" },
    { id: "v9", from: "priya", to: "michael", trade: "Plumber", when: "12 min ago", status: "pending", requestId: "d1", biz: "Shaw Plumbing", post: "https://www.facebook.com/groups/joondalup.community.noticeboard.demo/posts/662018?comment_id=822" }
  ];

  function T() { return root.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }
  function esa(s) { return esc(s); }
  function fn(m) {
    if (!m) return "Member";
    if (T().fullName) return T().fullName(m);
    return ((m.first || "") + " " + (m.last || "")).trim() || "Member";
  }
  function member(id) {
    return (T().MEMBERS || []).filter(function (m) { return m.id === id; })[0] || null;
  }
  function me() { return (T().me && T().me()) || member("jamie") || {}; }
  function av(m, size) {
    if (root.TC21 && TC21.avatar) return TC21.avatar(m, size);
    if (T().avatarHTML) return T().avatarHTML(m, size);
    return '<div class="avatar" style="width:' + size + "px;height:" + size + 'px"></div>';
  }
  function toast(msg) { if (T().toast) T().toast(msg); }
  function go(id, opts) { if (T().go) T().go(id, opts || {}); }

  function icoBack() {
    if (T().icon) return T().icon("back");
    return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function icoFb() {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg>';
  }
  function icoThumb() {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.3l.9-4.6.1-.6c0-.4-.2-.8-.4-1.1L13.2 1 7.6 6.6C7.2 7 7 7.5 7 8v10c0 1.1.9 2 2 2h8c.8 0 1.5-.5 1.8-1.2l2.9-6.8c.2-.3.3-.6.3-1z"/></svg>';
  }

  function loadJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var v = JSON.parse(raw);
      return v || fallback;
    } catch (e) { return fallback; }
  }
  function saveJson(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function tiers() {
    var t = loadJson(LS_TIERS, null);
    if (Array.isArray(t) && t.length) {
      return t.map(function (x, i) {
        var d = DEFAULT_TIERS[i] || DEFAULT_TIERS[DEFAULT_TIERS.length - 1];
        return {
          id: x.id || d.id,
          label: x.label || d.label,
          min: Math.max(0, Number(x.min) || d.min),
          color: x.color || d.color
        };
      }).sort(function (a, b) { return a.min - b.min; });
    }
    return DEFAULT_TIERS.slice();
  }

  function statsMap() {
    var over = loadJson(LS_STATS, null) || {};
    var out = {};
    Object.keys(DEFAULT_STATS).forEach(function (id) {
      out[id] = Object.assign({}, DEFAULT_STATS[id], over[id] || {});
    });
    Object.keys(over).forEach(function (id) {
      if (!out[id]) out[id] = Object.assign({ reviews: 0, vouches: 0 }, over[id]);
    });
    return out;
  }

  function isFbPostUrl(raw) {
    var s = String(raw || "").trim();
    if (!s) return { ok: false, msg: "Paste the Facebook post or comment link." };
    var url;
    try { url = new URL(s); } catch (err) {
      try { url = new URL("https://" + s); } catch (err2) {
        return { ok: false, msg: "Enter a full Facebook link, starting with https://." };
      }
    }
    if (!/^https?:$/i.test(url.protocol)) return { ok: false, msg: "Enter a Facebook link." };
    var host = String(url.hostname || "").replace(/^www\./i, "");
    if (!/(^|\.)(facebook\.com|fb\.com)$/i.test(host) && !/^(facebook\.com|fb\.com)$/i.test(host)) {
      return { ok: false, msg: "The link must be a facebook.com or fb.com address." };
    }
    return { ok: true, value: url.href };
  }

  function viewPostBtn(v) {
    var checked = isFbPostUrl(v && v.post);
    if (!checked.ok) return "";
    return '<a class="btn btn-ghost ink has-ico v211-view-post" href="' + esc(checked.value) + '" target="_blank" rel="noopener noreferrer">' +
      icoFb() + "<span>View post</span></a>";
  }

  function vouches() {
    var list = loadJson(LS_VOUCHES, null);
    if (!Array.isArray(list) || !list.length) {
      list = DEFAULT_VOUCHES.map(function (v) { return Object.assign({}, v); });
      saveJson(LS_VOUCHES, list);
      return list;
    }
    var byId = {};
    DEFAULT_VOUCHES.forEach(function (v) { byId[v.id] = v; });
    var changed = false;
    list.forEach(function (v) {
      if (!v.post && byId[v.id] && byId[v.id].post) { v.post = byId[v.id].post; changed = true; }
    });
    if (changed) saveJson(LS_VOUCHES, list);
    return list;
  }
  function setVouches(list) { saveJson(LS_VOUCHES, list); }

  function confirmedVouchesFor(fromId) {
    return vouches().filter(function (v) { return v.from === fromId && v.status === "confirmed"; }).length;
  }

  function scoreOf(id) {
    var st = statsMap()[id] || { reviews: 0, vouches: 0 };
    /* Live confirmed vouches win over the seed vouch count when we have rows for this member. */
    var live = confirmedVouchesFor(id);
    var seed = Number(st.vouches) || 0;
    var vouchesN = Math.max(seed, live);
    var reviewsN = Number(st.reviews) || 0;
    /* If this is the signed-in member and they confirm/leave vouches, keep reviews from stats. */
    return { reviews: reviewsN, vouches: vouchesN, total: reviewsN + vouchesN };
  }

  function badgeOf(id) {
    var total = scoreOf(id).total;
    var list = tiers();
    var current = null;
    list.forEach(function (t) { if (total >= t.min) current = t; });
    var next = null;
    for (var i = 0; i < list.length; i++) {
      if (!current || list[i].min > current.min) { next = list[i]; break; }
    }
    if (!next && current && total >= current.min) {
      var idx = list.indexOf(current);
      if (idx >= 0 && list[idx + 1]) next = list[idx + 1];
    }
    return { current: current, next: next, score: scoreOf(id) };
  }

  function badgeChip(id, size) {
    var b = badgeOf(id);
    if (!b.current) {
      return '<span class="v211-badge is-none" title="Not yet at Bronze">Getting started</span>';
    }
    var sz = size === "lg" ? " lg" : "";
    return '<span class="v211-badge' + sz + '" style="--badge:' + b.current.color + '">' +
      '<i class="v211-medal" aria-hidden="true"></i>' + esc(b.current.label) + "</span>";
  }

  function facebookUrl(m) {
    if (!m) return "";
    return m.facebook || (m.links && m.links.facebook) || "";
  }

  function googleUrl(m) {
    if (!m) return "";
    return (m.links && m.links.google) || m.googleLink || m.google || "";
  }

  function syncQueue() {
    var eligible = (T().MEMBERS || []).filter(function (m) {
      return !m.isMe && badgeOf(m.id).current;
    });
    var meM = me();
    if (meM && meM.id && badgeOf(meM.id).current) eligible.push(meM);
    /* unique */
    var seen = {};
    eligible = eligible.filter(function (m) {
      if (seen[m.id]) return false;
      seen[m.id] = true;
      return true;
    });
    var rank = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
    eligible.sort(function (a, b) {
      var ba = badgeOf(a.id), bb = badgeOf(b.id);
      var ra = (ba.current && rank[ba.current.id]) || 0;
      var rb = (bb.current && rank[bb.current.id]) || 0;
      if (rb !== ra) return rb - ra;
      return bb.score.total - ba.score.total;
    });
    S()._queue = eligible.map(function (m, i) {
      return { id: "q-" + m.id, memberId: m.id, when: "", paid: false, mine: m.id === (meM && meM.id), place: i + 1 };
    });
    return S()._queue;
  }

  function myPlace() {
    var q = syncQueue();
    var mine = 0;
    var meId = (me() && me().id) || "jamie";
    q.forEach(function (row, i) { if (row.memberId === meId) mine = i + 1; });
    return { q: q, mine: mine, total: q.length };
  }

  function progressHTML(id, opts) {
    opts = opts || {};
    var b = badgeOf(id);
    var sc = b.score;
    var label = b.current ? b.current.label : "No badge yet";
    var next = b.next;
    /* Fill is total / next-tier target (e.g. 12 of 25 = 48%), not from the current floor,
       which would show an empty bar the moment someone reaches Silver. */
    var remain = next ? Math.max(0, next.min - sc.total) : 0;
    var pct = next ? Math.max(0, Math.min(100, Math.round((sc.total / Math.max(1, next.min)) * 100))) : 100;
    var sub = next
      ? (sc.total + " of " + next.min + " toward " + next.label + " · " + remain + " more to go")
      : ("You’ve reached " + label + " · " + sc.total + " in total");
    return '<div class="v211-progress' + (opts.compact ? " compact" : "") + '">' +
      (opts.title ? '<div class="v211-progress-h">' + opts.title + "</div>" : "") +
      '<div class="v211-progress-row">' + badgeChip(id, opts.lg ? "lg" : "") +
      '<div class="v211-progress-meta"><strong>' + (next ? ("Next: " + esc(next.label)) : esc(label)) + "</strong><span>" + esc(sub) + "</span></div></div>" +
      '<div class="v211-bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="v211-counts"><span>' + sc.reviews + " Google Reviews given</span><span>" + sc.vouches + " confirmed vouches</span></div></div>";
  }

  function renderQueue() {
    var p = myPlace();
    var b = badgeOf((me() && me().id) || "jamie");
    var canJoin = !!b.current;
    var head = canJoin && p.mine
      ? '<div class="queue-pos"><span class="n">' + p.mine + '</span><span class="hint" style="margin:0">of ' + p.total + " · your " + esc(b.current.label) + " badge holds this place</span></div>"
      : (canJoin
        ? '<p class="hint">You have a ' + esc(b.current.label) + " badge, so you can join the Promotion queue.</p>"
        : '<p class="hint">Earn a Bronze badge (5 Google Reviews given or confirmed Facebook vouches, in any mix) to join the queue.</p>');
    var cta = canJoin && p.mine
      ? '<button class="btn btn-ghost ink" type="button" data-action="leave-queue">Leave the queue</button>'
      : (canJoin
        ? '<button class="btn btn-primary" type="button" data-action="join-queue">Join the queue</button>'
        : '<button class="btn btn-primary" type="button" data-go="my-vouches">See how to earn a badge</button>');
    var meId = (me() && me().id) || "jamie";
    var placeLab = (canJoin && p.mine) ? ("Your place #" + p.mine) : (canJoin ? "Join the queue" : "Earn a badge");
    var seg = '<div class="fb-seg-bar" role="tablist" aria-label="Facebook sections"><div class="fb-seg fb-seg-3">' +
      '<button type="button" role="tab" class="fb-seg-btn" data-go="members" aria-selected="false"><span class="fb-seg-lab">Circle</span></button>' +
      '<button type="button" role="tab" class="fb-seg-btn" data-go="fb-recommend" aria-selected="false"><span class="fb-seg-lab">Recommend</span></button>' +
      '<button type="button" role="tab" class="fb-seg-btn active" data-go="promo-queue" aria-selected="true"><span class="fb-seg-lab">Queue</span><span class="fb-seg-place">' + esc(placeLab) + "</span></button>" +
      "</div></div>";
    var html = '<section class="screen has-tabs has-header has-fb-seg" data-screen="promo-queue">' +
      '<div class="app-header"><span class="header-spacer"></span><div class="ht">Facebook</div><span class="header-spacer"></span></div>' +
      seg +
      '<div class="scroll v211-queue">' +
      '<div class="auth-hero"><h2>Facebook Promotion queue</h2>' +
      "<p>You earn a place by giving Google Reviews and leaving Facebook vouches that the other member confirms. A badge is your ticket in. Higher badges move closer to the front.</p></div>" +
      '<div class="queue-card v211-card">' +
      '<div class="areas-card-h">Your badge</div>' +
      progressHTML((me() && me().id) || "jamie") +
      '<div class="v211-links">' +
      '<button type="button" class="btn btn-ghost ink" data-go="my-vouches">My vouches</button>' +
      '<button type="button" class="btn btn-ghost ink" data-go="vouch-received">Vouches received</button></div></div>' +
      '<div class="queue-card v211-card"><div class="areas-card-h">Your place</div>' + head + cta + "</div>" +
      '<p class="group-label">Current queue</p>' +
      p.q.map(function (row, i) {
        var m = member(row.memberId);
        if (!m) return "";
        var bd = badgeOf(m.id);
        var you = row.memberId === ((me() && me().id) || "jamie") ? ' <span class="you-badge">You</span>' : "";
        return '<div class="queue-card v211-qrow">' +
          '<div class="v211-place">' + (i + 1) + "</div>" +
          '<button type="button" class="mem-open v211-qwho" data-go="member" data-id="' + m.id + '">' +
          av(m, 40) +
          "<div class=\"meta\"><div class=\"n\">" + esc(fn(m)) + you + "</div>" +
          '<div class="s">' + esc(m.business) + " · " + esc((bd.current && bd.current.label) || "No badge") +
          " · " + bd.score.total + " pts</div></div></button></div>";
      }).join("") +
      '<p class="hint" style="text-align:center">Paid queue jumps are not part of this build. Only confirmed vouches and Google Reviews given count.</p>' +
      "</div></section>";
    if (root.TC15 && typeof root.TC15 !== "undefined") { /* no-op */ }
    /* Keep the Facebook segment if the older wrapper exists after paint. */
    return html;
  }

  function wrapQueueWithSeg(html) {
    /* afterGo will ask v15 to add the Facebook Circle / Recommend / Queue tabs if present. */
    return html;
  }

  function statusLabel(st) {
    if (st === "confirmed") return "Confirmed";
    if (st === "rejected" || st === "not-found") return "Not found";
    return "Pending";
  }
  function icoClock() {
    return '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2" stroke-linecap="round"/></svg>';
  }
  function statusPill(st) {
    st = st || "pending";
    var ico = st === "pending" ? icoClock() : "";
    return '<span class="v211-st ' + st + '">' + ico + statusLabel(st) + "</span>";
  }
  function viewCommentBtn(v) {
    var html = viewPostBtn(v);
    return html ? html.replace(">View post<", ">View comment<") : "";
  }

  function renderMyVouches() {
    var meId = (me() && me().id) || "jamie";
    var list = vouches().filter(function (v) { return v.from === meId; });
    var html = '<section class="screen has-header" data-screen="my-vouches">' +
      '<div class="app-header"><button class="icon-btn" data-go="promo-queue" aria-label="Back">' +
      icoBack() + '</button><div class="ht">My vouches</div><span class="header-spacer"></span></div>' +
      '<div class="scroll v211-vouches">' +
      progressHTML(meId, { title: "Progress to the next badge" }) +
      '<p class="hint">A vouch counts once the member you left it for taps Accept. Pending vouches do not add to your badge yet.</p>';
    function myRow(v) {
      var m = member(v.to);
      if (!m) return "";
      var st = v.status || "pending";
      var thumb = st === "confirmed" ? '<span class="v211-thumb" title="Confirmed">' + icoThumb() + "</span>" : "";
      return '<div class="v211-vrow is-' + st + '">' +
        '<button type="button" class="mem-open v211-qwho" data-go="member" data-id="' + m.id + '">' +
        av(m, 44) +
        '<div class="meta"><div class="n">' + esc(fn(m)) + thumb + "</div>" +
        '<div class="s">' + esc(v.trade || m.trade) + " · " + esc(v.when) + "</div></div></button>" +
        statusPill(st) + viewPostBtn(v) + "</div>";
    }
    var confirmed = list.filter(function (v) { return v.status === "confirmed"; });
    var pending = list.filter(function (v) { return (v.status || "pending") === "pending"; });
    if (!list.length) html += '<p class="ov-empty">You have not left a Facebook vouch yet.</p>';
    if (confirmed.length) {
      html += '<p class="group-label">Confirmed</p>' + confirmed.map(myRow).join("");
    }
    if (pending.length) {
      html += '<p class="group-label">Pending</p>' + pending.map(myRow).join("");
    }
    html += '<button type="button" class="btn btn-ghost ink" data-go="leave-vouch" style="margin-top:12px">Leave a Facebook vouch</button>' +
      "</div></section>";
    return html;
  }

  function renderVouchReceived() {
    var meId = (me() && me().id) || "jamie";
    var list = vouches().filter(function (v) { return v.to === meId; });
    var pending = list.filter(function (v) { return v.status === "pending"; });
    var others = list.filter(function (v) { return v.status !== "pending"; });
    var html = '<section class="screen has-header" data-screen="vouch-received">' +
      '<div class="app-header"><button class="icon-btn" data-go="promo-queue" aria-label="Back">' +
      icoBack() + '</button><div class="ht">Vouch received?</div><span class="header-spacer"></span></div>' +
      '<div class="scroll v211-vouches">' +
      "<p class=\"hint\">When someone leaves a Facebook vouch for you, tap View post to check it, then Accept if it is genuine and you know their work. “Not found” means you could not see the vouch.</p>" +
      '<p class="group-label">Waiting for you</p>';
    if (!pending.length) html += '<p class="ov-empty">No vouches waiting.</p>';
    pending.forEach(function (v) {
      var m = member(v.from);
      if (!m) return;
      html += '<div class="v211-vrow is-pending v211-confirm">' +
        '<button type="button" class="mem-open v211-qwho" data-go="member" data-id="' + m.id + '">' +
        av(m, 44) +
        '<div class="meta"><div class="n">' + esc(fn(m)) + "</div>" +
        '<div class="s">Left a Facebook vouch for you · ' + esc(v.when) + "</div></div></button>" +
        viewPostBtn(v) +
        '<div class="v211-confirm-acts">' +
        '<button type="button" class="btn btn-primary v211-accept" data-action="vouch-accept" data-id="' + v.id + '">Accept</button>' +
        '<button type="button" class="btn btn-ghost ink" data-action="vouch-reject" data-id="' + v.id + '">Not found</button>' +
        "</div></div>";
    });
    if (others.length) {
      html += '<p class="group-label">Confirmed</p>';
      others.forEach(function (v) {
        var m = member(v.from);
        if (!m) return;
        var st = v.status === "confirmed" ? "confirmed" : "not-found";
        var thumb = st === "confirmed" ? '<span class="v211-thumb">' + icoThumb() + "</span>" : "";
        html += '<div class="v211-vrow is-' + st + '">' +
          '<button type="button" class="mem-open v211-qwho" data-go="member" data-id="' + m.id + '">' +
          av(m, 44) +
          '<div class="meta"><div class="n">' + esc(fn(m)) + thumb + "</div>" +
          '<div class="s">Vouch for you · ' + esc(v.when) + "</div></div></button>" +
          statusPill(st) + viewPostBtn(v) + "</div>";
      });
    }
    html += "</div></section>";
    return html;
  }

  function renderLeaveVouch() {
    var meId = (me() && me().id) || "jamie";
    var others = (T().MEMBERS || []).filter(function (m) { return m && m.id !== meId && !m.isMe; });
    var opts = others.map(function (m) {
      return '<option value="' + esc(m.id) + '">' + esc(fn(m)) + " · " + esc(m.trade || "") + "</option>";
    }).join("");
    return '<section class="screen has-header" data-screen="leave-vouch">' +
      '<div class="app-header"><button class="icon-btn" data-go="my-vouches" aria-label="Back">' +
      icoBack() + '</button><div class="ht">Leave a vouch</div><span class="header-spacer"></span></div>' +
      '<div class="scroll v211-vouches">' +
      "<p class=\"hint\">Paste the Facebook post or comment link so the member can tap View post and check it before they Accept. Only a facebook.com or fb.com link is accepted.</p>" +
      '<form data-form="leave-vouch">' +
      '<div class="field"><label>Who did you vouch for?</label>' +
      '<select name="vouchTo" required><option value="">Choose a member</option>' + opts + "</select></div>" +
      '<div class="field"><label>Facebook post or comment link</label>' +
      '<input name="vouchPost" inputmode="url" type="url" required autocomplete="off" placeholder="https://www.facebook.com/groups/…/posts/…">' +
      '<p class="link-error" data-vouch-post-err hidden></p></div>' +
      '<button type="submit" class="btn btn-primary" data-action="vouch-submit">Save vouch</button>' +
      "</form></div></section>";
  }

  function submitLeaveVouch(form) {
    if (!form) return false;
    var to = (form.querySelector("[name='vouchTo']") || {}).value || "";
    var raw = (form.querySelector("[name='vouchPost']") || {}).value || "";
    var err = form.querySelector("[data-vouch-post-err]");
    var m = member(to);
    var checked = isFbPostUrl(raw);
    if (err) { err.hidden = checked.ok; err.textContent = checked.ok ? "" : checked.msg; }
    var inp = form.querySelector("[name='vouchPost']");
    if (inp) inp.classList.toggle("invalid", !checked.ok);
    if (!m) { toast("Choose the member you vouched for."); return true; }
    if (!checked.ok) { toast(checked.msg); return true; }
    var list = vouches();
    list.unshift({
      id: "v-" + Date.now(),
      from: (me() && me().id) || "jamie",
      to: m.id,
      trade: m.trade || "",
      when: "Just now",
      status: "pending",
      post: checked.value
    });
    setVouches(list);
    toast("Vouch saved as pending. It counts once they Accept.");
    go("my-vouches");
    return true;
  }

  function setVouchStatus(id, status) {
    var list = vouches();
    list.forEach(function (v) { if (v.id === id) v.status = status; });
    setVouches(list);
    syncQueue();
  }

  function capitaliseReviewLabels(rootEl) {
    if (!rootEl) return;
    rootEl.querySelectorAll("a, button, span, h2, h3, p, .ht, .lab, .a, .b").forEach(function (el) {
      if (el.closest("script") || el.closest("style")) return;
      var kids = el.childNodes;
      for (var i = 0; i < kids.length; i++) {
        if (kids[i].nodeType === 3 && /Google review/i.test(kids[i].textContent)) {
          kids[i].textContent = kids[i].textContent.replace(/Google review/gi, "Google Review");
        }
      }
    });
  }

  function enhanceRecommendFeed() {
    var sc = document.querySelector('.screen[data-screen="fb-recommend"], .screen[data-screen="fb-recommend-open"]');
    if (!sc) return;
    var scroll = sc.querySelector(".scroll");
    if (scroll && !scroll.querySelector("[data-go='recommend-request']")) {
      var req = recRequest("d1");
      var n = vouches().filter(function (v) { return v.requestId === req.id; }).length;
      var card = '<button type="button" class="card v211-req-card" data-go="recommend-request" style="width:100%;text-align:left;margin:0 0 12px;padding:14px">' +
        '<div style="font-weight:800;letter-spacing:-0.03em;margin:0 0 4px">' + esc(req.title) + "</div>" +
        '<div class="hint" style="margin:0">' + esc(req.group) + " · " + n + " of " + req.need + " vouched</div></button>";
      scroll.insertAdjacentHTML("afterbegin", card);
    }
  }

  function enhanceMember() {
    var sc = document.querySelector('.screen[data-screen="member"]');
    if (!sc) return;
    var m = member(S().selectedMember);
    if (!m) return;
    enhanceProfileHeader(sc, false);
    capitaliseReviewLabels(sc);
    /* Personal Facebook only — drop a leftover website globe if one appears. */
    sc.querySelectorAll(".link-row a.link-ico").forEach(function (a) {
      var lab = (a.getAttribute("aria-label") || a.getAttribute("title") || "").toLowerCase();
      var href = a.getAttribute("href") || "";
      if (/website|instagram|linkedin|tiktok|youtube|other/.test(lab) || /instagram|linkedin|tiktok|youtube/.test(href)) a.remove();
      if (/facebook/.test(lab) || /facebook\.com/.test(href)) {
        var url = facebookUrl(m);
        if (url) a.setAttribute("href", url);
        a.setAttribute("aria-label", "Facebook personal profile");
        a.setAttribute("title", "Facebook personal profile");
      }
    });
    var hero = sc.querySelector(".profile-hero");
    if (hero && !hero.querySelector(".v211-badge")) {
      var tags = hero.querySelector(".tags") || hero;
      tags.insertAdjacentHTML("afterend", '<div class="v211-hero-badge">' + badgeChip(m.id, "lg") + "</div>");
    }
    var scroll = sc.querySelector(".scroll");
    if (!scroll) return;
    var stack = sc.querySelector(".action-stack");
    if (!stack) return;
    /* Rename leftover business-page CTA if any, or add View Facebook profile. */
    sc.querySelectorAll(".action-stack a, .action-stack button").forEach(function (el) {
      if (/View business page/i.test(el.textContent || "")) {
        el.childNodes.forEach(function (n) {
          if (n.nodeType === 3) n.textContent = n.textContent.replace(/View business page/ig, "View Facebook profile");
        });
        var url = facebookUrl(m);
        if (url && el.tagName === "A") el.setAttribute("href", url);
      }
    });
    if (!stack.querySelector("[data-v211-fb]")) {
      var url = facebookUrl(m);
      if (url) {
        stack.insertAdjacentHTML("beforeend",
          '<a class="btn btn-ghost ink has-ico" data-v211-fb="1" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
          icoFb() + "<span>View Facebook profile</span></a>");
      }
    }
    /* Preferred order: Leave, Ask, Message, friend status, links, View Facebook profile. */
    var leaveBtn = stack.querySelector("[data-action='open-ideas'], [data-action='review-back'], a.btn-primary");
    var askBtn = stack.querySelector("[data-action='ask-review']");
    var msgBtn = stack.querySelector("[data-action='open-chat']");
    var fbBtn = stack.querySelector("[data-v211-fb]");
    var friendBtn = stack.querySelector(".friend-btn, [data-action='open-fb'], [data-action='mark-friends'], [data-action='mark-sent']");
    [leaveBtn, askBtn, msgBtn, friendBtn, fbBtn].forEach(function (el) { if (el) stack.appendChild(el); });

    /* Move links + actions to just under the hero (and review counter, if present). */
    var pack = sc.querySelector(".v211-actions");
    if (!pack) {
      pack = document.createElement("div");
      pack.className = "v211-actions";
      var anchor = hero.querySelector(".rev-today") ? hero : hero;
      anchor.insertAdjacentElement("afterend", pack);
    }
    var linkLab = null;
    sc.querySelectorAll(".group-label").forEach(function (lab) {
      if (/^links$/i.test((lab.textContent || "").trim())) linkLab = lab;
    });
    var row = sc.querySelector(".link-row");
    if (stack && pack) pack.appendChild(stack);
    if (linkLab && pack) pack.appendChild(linkLab);
    if (row && pack) pack.appendChild(row);
    if (fbBtn && pack) pack.appendChild(fbBtn);
    /* Tidy leftover wording on primary buttons */
    stack.querySelectorAll("span, button, a").forEach(function (el) {
      if (el.childElementCount === 0 && /Leave a Google review/i.test(el.textContent)) el.textContent = el.textContent.replace(/review/i, "Review");
      if (el.childElementCount === 0 && /Ask for a Google review/i.test(el.textContent)) el.textContent = el.textContent.replace(/review/i, "Review");
    });
  }

  function enhanceMe() {
    var sc = document.querySelector('.screen[data-screen="me"]');
    if (!sc) return;
    var m = me();
    capitaliseReviewLabels(sc);
    enhanceProfileHeader(sc, true);
    var scrollEl = sc.querySelector(".scroll");
    /* v181 can append #rec-share as a sibling of .scroll, which covers the badge card. Keep it in the scroll, at the end. */
    var recShare = sc.querySelector("#rec-share, .rec-share");
    if (recShare && scrollEl && recShare.parentNode !== scrollEl) scrollEl.appendChild(recShare);
    if (scrollEl && !sc.getAttribute("data-v211-me")) scrollEl.scrollTop = 0;
    var hero = sc.querySelector(".profile-hero");
    if (hero && !hero.querySelector(".v211-badge")) {
      var tags = hero.querySelector(".tags") || hero;
      tags.insertAdjacentHTML("afterend", '<div class="v211-hero-badge">' + badgeChip(m.id, "lg") + "</div>");
    }
    if (hero && !sc.querySelector(".v211-mine")) {
      var pendingIn = vouches().filter(function (v) { return v.to === m.id && v.status === "pending"; }).length;
      var card = '<div class="v211-card v211-mine">' +
        progressHTML(m.id, { title: "My badges", lg: true }) +
        '<div class="v211-links">' +
        '<button type="button" class="btn btn-ghost ink" data-go="my-vouches">My vouches</button>' +
        '<button type="button" class="btn btn-ghost ink" data-go="vouch-received">Vouches received' +
        (pendingIn ? ' <span class="v211-dot">' + pendingIn + "</span>" : "") + "</button>" +
        '<button type="button" class="btn btn-ghost ink" data-go="promo-queue">Promotion queue</button></div></div>';
      hero.insertAdjacentHTML("afterend", card);
      sc.setAttribute("data-v211-me", "1");
      if (scrollEl) scrollEl.scrollTop = 0;
    }
    sc.querySelectorAll(".link-row a.link-ico").forEach(function (a) {
      var lab = (a.getAttribute("aria-label") || a.getAttribute("title") || "").toLowerCase();
      var href = a.getAttribute("href") || "";
      if (/website|instagram|linkedin|tiktok|youtube|other/.test(lab) || /instagram|linkedin|tiktok|youtube/.test(href)) a.remove();
      if (/facebook/.test(lab) || /facebook\.com/.test(href)) {
        var url = facebookUrl(m);
        if (url) a.setAttribute("href", url);
        a.setAttribute("aria-label", "Facebook personal profile");
        a.setAttribute("title", "Facebook personal profile");
      }
    });
  }

  function enhanceCards() {
    document.querySelectorAll(".member-card .nm, .v21-mrow .n, .v211-qwho .n").forEach(function (nm) {
      if (nm.querySelector(".v211-badge")) return;
      var host = nm.closest("[data-id], [data-go='member'], .member-card, .v21-mrow");
      var btn = (host && host.querySelector("[data-id]")) || nm.closest("[data-id]");
      var id = btn && btn.getAttribute("data-id");
      if (!id && host && host.getAttribute("data-id")) id = host.getAttribute("data-id");
      if (!id) {
        var open = (host && host.querySelector("[data-go='member']")) || nm.closest("[data-go='member']");
        if (open) id = open.getAttribute("data-id");
      }
      if (!id) return;
      if (!badgeOf(id).current) return;
      nm.insertAdjacentHTML("beforeend", " " + badgeChip(id));
    });
  }

  function withFbSeg(html) {
    /* Re-apply v15 Facebook segment after we replace the queue body, if the helper is on the page after go. */
    return html;
  }

  function afterGo(id) {
    if (id === "member") enhanceMember();
    if (id === "me") enhanceMe();
    if (id === "pending") enhancePending();
    if (id === "fb-recommend" || id === "fb-recommend-open") enhanceRecommendFeed();
    if (id === "members" || id === "members-all" || id === "members-filter" || id === "members-search" || id === "promo-queue" || id === "reviews") enhanceCards();
    if (id === "promo-queue") {
      /* If v15 already wrapped with Facebook tabs, we still painted our queue via render hook. */
      capitaliseReviewLabels(document.querySelector(".screen.active"));
    }
  }

  function handle(e) {
    var el = e.target.closest("[data-action]");
    if (!el) return false;
    var action = el.getAttribute("data-action");
    var id = el.getAttribute("data-id");
    if (action === "vouch-submit") {
      return submitLeaveVouch(el.closest("form") || document.querySelector("form[data-form='leave-vouch']"));
    }
    if (action === "vouch-accept") {
      setVouchStatus(id, "confirmed");
      toast("Vouch accepted. They’ll see a thumbs-up on their list.");
      go("vouch-received");
      return true;
    }
    if (action === "vouch-reject") {
      setVouchStatus(id, "not-found");
      toast("Marked as not found. This vouch will not count.");
      go("vouch-received");
      return true;
    }
    if (action === "swap-leave") {
      var mLeave = member(id);
      var url = gLinkOf(mLeave);
      if (url) try { window.open(url, "_blank", "noopener"); } catch (eL) {}
      openSwapDoneSheet(id);
      return true;
    }
    if (action === "swap-done") {
      setSwapStatus(id, "given");
      bumpReviews((me() && me().id) || "jamie", 1);
      closeSwapSheet();
      toast("Marked as Given. It adds to your Google Reviews given.");
      go("incoming-swap");
      return true;
    }
    if (action === "swap-not-now") {
      setSwapStatus(id, "declined");
      go("incoming-swap");
      return true;
    }
    if (action === "swap-not-yet") {
      closeSwapSheet();
      return true;
    }
    if (action === "open-rec-request") {
      S()._requestId = el.getAttribute("data-rid") || "d1";
      go("recommend-request");
      return true;
    }
    if (action === "i-vouched") {
      openIVouchedSheet(el.getAttribute("data-rid") || "d1");
      return true;
    }
    if (action === "play-intro") {
      var introId = null;
      try {
        if (root.TCTutorials && TCTutorials.load && TCTutorials.load().intro) introId = TCTutorials.load().intro.id;
      } catch (eP) {}
      S()._tutOpen = introId || (S()._tutOpen);
      if (T().go) T().go("tutorial-play");
      return true;
    }
    if (action === "join-queue") {
      var b = badgeOf((me() && me().id) || "jamie");
      if (!b.current) {
        toast("Earn a Bronze badge first, by giving Google Reviews and confirmed Facebook vouches.");
        return true;
      }
      return false; /* let v15 join if already eligible */
    }
    return false;
  }


  /* ---------- v2.1.1 batch: counts, profile header, incoming swap, pending video, recommend request ---------- */
  function bumpReviews(id, n) {
    var map = loadJson(LS_STATS, {}) || {};
    var cur = statsMap()[id] || { reviews: 0, vouches: 0 };
    map[id] = { reviews: Math.max(0, (Number(cur.reviews) || 0) + (n || 1)), vouches: cur.vouches };
    saveJson(LS_STATS, map);
    return map[id];
  }

  function specialtyLine(m) {
    if (!m) return "";
    var bio = String(m.bio || "").trim();
    if (!bio) return "";
    var cut = bio.split(/\s+across\s+|\s+in the\s+|\s+throughout\s+|\s+around\s+/i)[0];
    return cut.replace(/\.$/, "").trim();
  }
  function icoPencil() {
    return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 20h4l10-10-4-4L4 16v4zM14 6l4 4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function icoPlay(size) {
    size = size || 48;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="rgba(0,0,0,.35)"></circle><path d="M10 8.5v7L17 12z" fill="#fff"/></svg>';
  }
  function googleGSmall(n) {
    n = n || 14;
    return '<svg width="' + n + '" height="' + n + '" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.6 7.1l.1.1 6.3 5.3C36.5 41.3 44 36 44 24c0-1.3-.1-2.7-.4-3.9z"/></svg>';
  }
  function gLinkOf(m) {
    if (!m) return "";
    if (window.TCLinks && TCLinks.fromMember) {
      try {
        var L = TCLinks.fromMember(m);
        if (L && L.google) return L.google;
      } catch (e) {}
    }
    if (m.googleLink || m.google) return m.googleLink || m.google;
    return "https://search.google.com/local/writereview?placeid=demo-" + m.id;
  }
  function regionNameOf(m) {
    var ids = (m && m.regions) || [];
    if (!ids.length) return "Perth";
    if (T().regionName) return T().regionName(ids[0]);
    var names = { hills: "Hills", north: "North", south: "South", east: "East", central: "Central", fremantle: "Fremantle", rockingham: "Rockingham", joondalup: "Joondalup" };
    return names[ids[0]] || ids[0];
  }

  var LS_SWAP = "rb_swap_incoming";
  var LS_SWAP_SEEN = "rb_swap_incoming_seen";
  var DEFAULT_SWAPS = [
    { id: "jack", time: "Today, 7:12 am", status: "new" },
    { id: "tom", time: "Today, 8:04 am", status: "new" },
    { id: "sarah", time: "Today, 9:20 am", status: "new" },
    { id: "priya", time: "Yesterday, 4:40 pm", status: "new" },
    { id: "mei", time: "Yesterday, 2:15 pm", status: "new" }
  ];
  function swapList() {
    var list = loadJson(LS_SWAP, null);
    if (!Array.isArray(list) || !list.length) {
      list = DEFAULT_SWAPS.map(function (r) { return Object.assign({}, r); });
      saveJson(LS_SWAP, list);
    }
    return list;
  }
  function saveSwapList(list) { saveJson(LS_SWAP, list); }
  function incomingNewCount() {
    if (loadJson(LS_SWAP_SEEN, false)) return 0;
    return swapList().filter(function (r) { return (r.status || "new") === "new"; }).length;
  }
  function markSwapsSeen() { saveJson(LS_SWAP_SEEN, true); }
  function setSwapStatus(id, status) {
    var list = swapList();
    list.forEach(function (r) { if (r.id === id) r.status = status; });
    saveSwapList(list);
  }
  function atCap(id) {
    return root.TCReviews && TCReviews.atLimit && TCReviews.atLimit(id);
  }
  function renderIncomingSwap() {
    markSwapsSeen();
    var html = '<section class="screen has-header" data-screen="incoming-swap">' +
      '<div class="app-header"><button class="icon-btn" data-action="nav-back" aria-label="Back">' + icoBack() +
      '</button><div class="ht">Incoming swap requests</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><p class="hint">Members who asked you to swap a Google Review. Leave one in your own words after a real job, then tap Done.</p>';
    swapList().forEach(function (r) {
      var m = member(r.id);
      if (!m) return;
      var st = r.status || "new";
      var full = atCap(m.id);
      var stateHtml = "";
      var acts = "";
      if (st === "given") {
        stateHtml = '<span class="v211-st given">Given ✓</span>';
      } else if (st === "declined") {
        stateHtml = '<span class="v211-st declined">Declined</span>';
      } else if (full) {
        stateHtml = '<span class="v211-st full">Full today · Remind me</span>';
        acts = '<div class="v211-swap-acts">' +
          '<button type="button" class="btn btn-ghost ink" data-action="rb-remind-me" data-id="' + m.id + '">Remind me</button>' +
          '<button type="button" class="btn btn-ghost ink" data-action="open-chat" data-id="' + m.id + '">Message</button></div>';
      } else {
        stateHtml = '<span class="v211-st pending">' + icoClock() + " New</span>";
        acts = '<div class="v211-swap-acts">' +
          '<button type="button" class="btn btn-primary has-ico" data-action="swap-leave" data-id="' + m.id + '">' + googleGSmall(14) + "<span>Leave Google Review</span></button>" +
          '<button type="button" class="btn btn-ghost ink" data-action="open-chat" data-id="' + m.id + '">Message</button>' +
          '<button type="button" class="btn btn-ghost ink" data-action="swap-not-now" data-id="' + m.id + '">Not now</button></div>';
      }
      html += '<div class="v211-swap-row">' +
        '<button type="button" class="who" data-go="member" data-id="' + m.id + '">' + av(m, 48) +
        '<div class="meta"><div class="n">' + esc(fn(m)) + "</div>" +
        '<div class="s">' + esc(m.business) + " · " + esc(m.trade) + "</div>" +
        '<div class="s">' + esc(regionNameOf(m)) + " · " + esc(r.time) + "</div></div></button>" +
        stateHtml + acts + "</div>";
    });
    html += "</div></section>";
    return html;
  }
  function openSwapDoneSheet(id) {
    var sc = document.querySelector(".screen.active") || document.querySelector(".screen[data-screen='incoming-swap']");
    if (!sc) return;
    var existing = sc.querySelector(".v211-sheet");
    if (existing) existing.remove();
    var sheet = document.createElement("div");
    sheet.className = "v211-sheet";
    sheet.innerHTML = '<div class="v211-sheet-card">' +
      "<h3>Have you left the Google Review?</h3>" +
      "<p>Only tap Done if you wrote the review yourself, after a real job.</p>" +
      '<button type="button" class="btn btn-primary" data-action="swap-done" data-id="' + esc(id) + '">Done</button>' +
      '<button type="button" class="btn btn-ghost ink" data-action="swap-not-yet">Not yet</button></div>';
    sc.appendChild(sheet);
    S()._swapPending = id;
  }
  function closeSwapSheet() {
    document.querySelectorAll(".v211-sheet").forEach(function (el) { el.remove(); });
  }

  var DEFAULT_REQUESTS = [
    {
      id: "d1",
      title: "Can anyone recommend a plumber?",
      group: "Joondalup Community Noticeboard",
      askedBy: "A group member",
      when: "Today, 11:20 am",
      post: "https://www.facebook.com/groups/joondalup.community.noticeboard.demo/posts/662018",
      trade: "Plumber",
      forId: "michael",
      need: 8,
      place: "Mullaloo"
    }
  ];
  function recRequests() { return DEFAULT_REQUESTS; }
  function recRequest(id) {
    return recRequests().filter(function (r) { return r.id === (id || (S()._requestId || "d1")); })[0] || recRequests()[0];
  }
  function renderRecommendRequest() {
    var req = recRequest(S()._requestId);
    var vouched = vouches().filter(function (v) { return v.requestId === req.id; });
    var html = '<section class="screen has-header" data-screen="recommend-request">' +
      '<div class="app-header"><button class="icon-btn" data-action="nav-back" aria-label="Back">' + icoBack() +
      '</button><div class="ht">Recommend request</div><span class="header-spacer"></span></div>' +
      '<div class="scroll v211-req"><div class="req-head">' +
      "<h2>" + esc(req.title) + "</h2>" +
      '<div class="req-meta">' + esc(req.group) + " · " + esc(req.askedBy) + " · " + esc(req.when) +
      (req.place ? " · " + esc(req.place) : "") + "</div></div>" +
      '<a class="btn btn-ghost ink has-ico v211-view-post" href="' + esc(req.post) + '" target="_blank" rel="noopener noreferrer">' +
      icoFb() + "<span>View post</span></a>" +
      '<p class="group-label">Members who vouched · ' + vouched.length + " of " + req.need + "</p>";
    vouched.forEach(function (v) {
      var m = member(v.from);
      if (!m) return;
      var st = v.status || "pending";
      var thumb = st === "confirmed" ? '<span class="v211-thumb" title="Confirmed">' + icoThumb() + "</span>" : "";
      html += '<div class="v211-swap-row">' +
        '<button type="button" class="who" data-go="member" data-id="' + m.id + '">' + av(m, 44) +
        '<div class="meta"><div class="n">' + esc(fn(m)) + thumb + "</div>" +
        '<div class="s">' + esc(m.business) + " · " + esc(m.trade) + "</div></div></button>" +
        statusPill(st) + viewCommentBtn(v) + "</div>";
    });
    html += '<button type="button" class="btn btn-primary v211-ivu" data-action="i-vouched" data-rid="' + esc(req.id) + '">I vouched</button>';
    html += "</div></section>";
    return html;
  }
  function openIVouchedSheet(rid) {
    var sc = document.querySelector(".screen.active") || document.querySelector("[data-screen='recommend-request']");
    if (!sc) return;
    var existing = sc.querySelector(".v211-sheet");
    if (existing) existing.remove();
    var sheet = document.createElement("div");
    sheet.className = "v211-sheet";
    sheet.innerHTML = '<form class="v211-sheet-card" data-form="i-vouched" data-rid="' + esc(rid || "d1") + '">' +
      "<h3>I vouched</h3>" +
      "<p>Paste the Facebook comment link so the member can check it.</p>" +
      '<div class="field"><label>Facebook comment link</label><input name="comment" inputmode="url" placeholder="https://www.facebook.com/..." required></div>' +
      '<button type="submit" class="btn btn-primary">Add my vouch</button>' +
      '<button type="button" class="btn btn-ghost ink" data-action="swap-not-yet">Cancel</button></form>';
    sc.appendChild(sheet);
  }
  function submitIVouched(form) {
    var rid = form.getAttribute("data-rid") || "d1";
    var req = recRequest(rid);
    var input = form.querySelector("input[name='comment']");
    var checked = isFbPostUrl(input && input.value);
    if (!checked.ok) { toast(checked.msg); return false; }
    var list = vouches();
    list.push({
      id: "v-live-" + Date.now(),
      from: (me() && me().id) || "jamie",
      to: req.forId,
      trade: req.trade,
      when: "Today",
      status: "pending",
      requestId: req.id,
      biz: (member(req.forId) || {}).business,
      post: checked.value
    });
    setVouches(list);
    closeSwapSheet();
    toast("Added as Pending. It counts once they tap Accept.");
    go("recommend-request");
    return true;
  }

  function enhancePending() {
    var sc = document.querySelector('.screen[data-screen="pending"]');
    if (!sc || sc.querySelector(".v211-intro-video")) return;
    var scroll = sc.querySelector(".scroll");
    var hero = sc.querySelector(".auth-hero");
    var anchor = hero || scroll;
    if (!anchor) return;
    var intro = null;
    try {
      if (root.TCTutorials && TCTutorials.load) intro = (TCTutorials.load().intro) || null;
    } catch (e) {}
    var thumb = (intro && intro.thumb) ? intro.thumb : "";
    var card = '<div class="v211-intro-video"><div class="lab">Watch: what Rate Buddies is about</div>' +
      '<button type="button" class="v211-video-card" data-action="play-intro">' +
      '<div class="thumb">' + (thumb ? '<img src="' + esc(thumb) + '" alt="">' : "") +
      '<span class="play">' + icoPlay(56) + "</span></div>" +
      '<div class="cap">What the app does, how vouches and badges work, and the Facebook Promotion queue. This plays the Introduction video set in the admin.</div>' +
      "</button></div>";
    if (hero) hero.insertAdjacentHTML("afterend", card);
    else scroll.insertAdjacentHTML("afterbegin", card);
  }

  function enhanceProfileHeader(sc, mine) {
    if (!sc) return;
    var m = mine ? me() : member(S().selectedMember);
    if (!m) return;
    var head = sc.querySelector(".app-header");
    if (head) {
      var edit = head.querySelector(".header-link, [data-go='edit-profile']");
      if (edit) edit.remove();
      if (!mine) {
        var title = head.querySelector(".ht");
        if (title) title.style.display = "none";
      }
    }
    var hero = sc.querySelector(".profile-hero");
    if (!hero) return;
    var biz = hero.querySelector(".biz");
    if (biz && !hero.querySelector(".v211-specialty")) {
      var line = specialtyLine(m);
      if (line) biz.insertAdjacentHTML("afterend", '<div class="v211-specialty">' + esc(line) + "</div>");
    }
    if (mine && !hero.querySelector(".v211-edit-pill")) {
      var after = hero.querySelector(".v211-hero-badge") || hero.querySelector(".g-badge") || hero.querySelector(".tags") || hero;
      after.insertAdjacentHTML("afterend",
        '<button type="button" class="v211-edit-pill" data-go="edit-profile">' + icoPencil() + "<span>Edit profile</span></button>");
    }
  }


  function install() {
    syncQueue();
    if (root.TC12 && TC12.render) {
      var prev = TC12.render;
      TC12.render = function (id) {
        if (id === "promo-queue") return renderQueue();
        if (id === "my-vouches") return renderMyVouches();
        if (id === "vouch-received" || id === "vouch-inbox") return renderVouchReceived();
        if (id === "leave-vouch") return renderLeaveVouch();
        if (id === "incoming-swap" || id === "incoming-swap-requests") return renderIncomingSwap();
        if (id === "recommend-request") return renderRecommendRequest();
        return prev(id);
      };
    }
    document.addEventListener("click", function (e) {
      if (handle(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
    document.addEventListener("submit", function (e) {
      var form = e.target && e.target.closest && e.target.closest("form[data-form='leave-vouch'], form[data-form='i-vouched']");
      if (!form) return;
      e.preventDefault();
      if (form.getAttribute("data-form") === "i-vouched") submitIVouched(form);
      else submitLeaveVouch(form);
    }, true);
    function hookAfter(holder, key) {
      if (!holder) return false;
      var prevA = holder[key];
      holder[key] = function (id) {
        if (typeof prevA === "function") prevA(id);
        afterGo(id);
      };
      return true;
    }
    if (root.TC21 && hookAfter(root.TC21, "afterGo")) {
      /* Also wrap whatever TC20/TC12 currently points at, in case v21 already forwarded. */
    }
    if (root.TC20) hookAfter(root.TC20, "afterGo");
    else if (root.TC12) hookAfter(root.TC12, "afterGo");
    /* If a screen is already up, enhance it. */
    var cur = S().screen;
    if (cur) afterGo(cur);
  }

  root.TC211 = {
    VERSION: "2.1.1",
    DEFAULT_TIERS: DEFAULT_TIERS,
    tiers: tiers,
    badgeOf: badgeOf,
    scoreOf: scoreOf,
    badgeChip: badgeChip,
    progressHTML: progressHTML,
    vouches: vouches,
    setVouchStatus: setVouchStatus,
    syncQueue: syncQueue,
    myPlace: myPlace,
    renderQueue: renderQueue,
    renderMyVouches: renderMyVouches,
    renderVouchReceived: renderVouchReceived,
    renderIncomingSwap: renderIncomingSwap,
    renderRecommendRequest: renderRecommendRequest,
    bumpReviews: bumpReviews,
    incomingNewCount: incomingNewCount,
    afterGo: afterGo,
    LS_TIERS: LS_TIERS
  };
  install();
})(typeof window !== "undefined" ? window : this);
