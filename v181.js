/* Rate Buddies v1.8.2 — unique recommend texts, profile share, tutorials, intro video */
(function (root) {
  "use strict";
  function T() { return root.TradeCircle || {}; }
  function S() { return (T().state || (T().state = {})); }
  function C() { return root.TCDeviCity || null; }
  function Tut() { return root.TCTutorials || null; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }
  function toast(msg) { if (T().toast) T().toast(msg); }
  function facebookF(size, color) {
    size = size || 16;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="' + (color || "currentColor") + '" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg>';
  }
  function playIco(n) {
    n = n || 18;
    return '<svg viewBox="0 0 24 24" width="' + n + '" height="' + n + '" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72a1 1 0 001.5.86l11.02-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z"/></svg>';
  }
  function member(id) {
    var list = T().MEMBERS || [];
    var i;
    for (i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function meId() { var m = T().me && T().me(); return (m && m.id) || "jamie"; }
  function firstName(m) { return C() ? C().firstName(m) : ((m && m.first) || "them"); }
  function facebookOf(m) { return (m && (m.facebook || (m.links && m.links.facebook))) || ""; }
  function profileOf(m) { return (m && m.profileUrl) || ("https://ratebuddies.com/m/" + (m && m.id || "member")); }
  function recShareOf(m) {
    var s = (m && m.recShare) || {};
    return {
      phone: s.phone !== false,
      facebook: s.facebook !== false,
      website: s.website !== false,
      profile: s.profile !== false
    };
  }

  /* ---------- uniqueness ledger ---------- */
  function ledger(postId) {
    S()._recLedger = S()._recLedger || {};
    if (!S()._recLedger[postId]) S()._recLedger[postId] = { issued: [], byViewer: {} };
    return S()._recLedger[postId];
  }
  function preseedIssued(post, feat) {
    var L = ledger(post.id);
    if (L._seeded || !root.TCIdeas) return;
    L._seeded = true;
    var others = ["sarah", "tom", "mei", "emma", "noah"];
    var i, ideas;
    for (i = 0; i < others.length; i++) {
      ideas = TCIdeas.buildAlertIdeas({
        member: feat, viewerId: others[i], alertId: post.id,
        suburb: post.suburb || "Joondalup", used: L.issued, count: 3, round: i
      }) || [];
      L.issued = L.issued.concat(ideas);
      L.byViewer[others[i]] = ideas;
    }
  }
  function allocateStarters(post, feat, viewerId, fresh) {
    var L = ledger(post.id);
    preseedIssued(post, feat);
    if (!fresh && L.byViewer[viewerId] && L.byViewer[viewerId].length) return L.byViewer[viewerId];
    var used = L.issued.slice();
    var ideas = (root.TCIdeas && TCIdeas.buildAlertIdeas({
      member: feat, viewerId: viewerId, alertId: post.id,
      suburb: post.suburb || "Joondalup", used: used, count: 3, round: used.length
    })) || [];
    ideas.forEach(function (t) { if (L.issued.indexOf(t) === -1) L.issued.push(t); });
    L.byViewer[viewerId] = ideas;
    return ideas;
  }

  function recState(postId) {
    S()._recUI = S()._recUI || {};
    if (!S()._recUI[postId]) {
      S()._recUI[postId] = {
        pick: 0, own: "", chips: { name: true, business: true, phone: false, facebook: false, website: false, profile: false },
        copied: false, warned: false, copiedIdx: -1
      };
    }
    return S()._recUI[postId];
  }

  function applyChips(base, feat, chips, share) {
    var text = String(base || "");
    var first = firstName(feat);
    var name = ((feat.first || "") + " " + (feat.last || "")).trim();
    var biz = feat.business || "";
    var trade = String(feat.trade || "tradie").toLowerCase();
    if (!chips.name) {
      if (name) text = text.split(name).join("this " + trade);
      if (first) text = text.replace(new RegExp("\\b" + first.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "g"), "this " + trade);
    }
    if (!chips.business && biz) text = text.split(biz).join("them");
    text = text.replace(/\s+/g, " ").replace(/\s+\./g, ".").trim();
    var bits = [];
    if (chips.phone && share.phone && feat.phone) bits.push("Phone " + feat.phone);
    var links = [];
    if (chips.facebook && share.facebook && facebookOf(feat)) links.push("Facebook " + facebookOf(feat).replace(/^https?:\/\//, ""));
    else if (chips.profile && share.profile) links.push("Rate Buddies profile " + profileOf(feat).replace(/^https?:\/\//, ""));
    bits = bits.concat(links.slice(0, 1));
    return { text: text, bits: bits };
  }
  function finalText(post, feat, ui, starters) {
    var base = starters[ui.pick] || starters[0] || "";
    var applied = applyChips(base, feat, ui.chips, recShareOf(feat));
    var parts = [applied.text];
    var own = String(ui.own || "").trim();
    if (own) parts.push(own);
    if (applied.bits && applied.bits.length) parts.push(applied.bits.join(". ") + ".");
    return parts.join(" ").replace(/\s+/g, " ").trim();
  }

  function seedPosts() { if (root.TC180 && TC180.seedPosts) return TC180.seedPosts(); return (S()._fbPosts || []); }

  function deviCard(p) {
    var feat = member(p.forId) || member("michael") || { first: "Michael", last: "Shaw", business: "Shaw Plumbing", trade: "Plumber", phone: "0400 000 114", page: "https://www.facebook.com/shawplumbing.demo", profileUrl: "https://ratebuddies.com/m/michael-shaw", links: { website: "https://www.shawplumbing.example.au" }, recShare: { phone: true, facebook: true, website: true, profile: true }, color: "navy", id: "michael" };
    var first = firstName(feat);
    var st = p.status === "done" ? "done" : p.status === "expired" ? "expired" : "new";
    var stLab = st === "done" ? "Done" : st === "expired" ? "Expired" : "New";
    var of = typeof p.of === "number" ? p.of : 12;
    var pct = Math.round((p.vouched / Math.max(of, 1)) * 100);
    var ui = recState(p.id);
    var starters = allocateStarters(p, feat, meId(), false);
    var share = recShareOf(feat);
    var avHtml = (T().avatarHTML && feat) ? T().avatarHTML(feat, 44) : '<div class="av av-navy" style="width:44px;height:44px">MS</div>';
    var tradeIco = (root.TC159 && TC159.tradeIcon) ? TC159.tradeIcon(feat.trade) : "";

    var html = '<article class="rec-card is-devi is-v181' + (st === "done" ? " is-done" : "") + '" data-rec="' + p.id + '">' +
      '<div class="rec-top"><div class="rec-gmark"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg></div>' +
      '<div class="rec-group"><div class="g">' + esc(p.group) + '</div><div class="t">Matched by Devi · ' + esc(p.when) + "</div></div>" +
      '<span class="rec-devi-badge">Auto-matched</span></div>' +
      '<p class="rec-help">Let’s help ' + esc(first) + "!</p>" +
      '<p class="rec-ask">' + esc(p.ask) + "</p>" +
      '<div class="rec-who"><button type="button" class="mem-open rec-who-open" data-go="member" data-id="' + (feat.id || "") + '" aria-label="Open profile">' + avHtml +
      '<div class="meta"><div class="nm">' + esc(((feat.first || "") + " " + (feat.last || "")).trim()) + "</div>" +
      '<div class="biz">' + esc(feat.business || "") + "</div>" +
      '<div class="pills"><span class="pill t-pill">' + tradeIco + esc(feat.trade || "") + "</span>" +
      '<span class="pill r-pill">' + esc(p.city || "Perth") + "</span></div></div></button></div>" +
      '<div class="rec-progress"><div class="bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="lab">' + p.vouched + " of " + of + " " + esc(p.city || "Perth") + " members have already recommended " + esc(first) +
      (p.closes ? " · " + esc(p.closes) : "") + "</div></div>";

    if (st === "new") {
      var tones = ["Casual", "Professional", "Warm"];
      var i, on;
      html += '<div class="rec-steps">';
      html += '<div class="rec-step"><div class="rec-step-h"><span class="n">1</span> Pick a starter</div>' +
        '<p class="hint">These three are unique to you for this Facebook post. No one else will be given the same wording.</p>';
      for (i = 0; i < starters.length; i++) {
        on = ui.pick === i ? " on" : "";
        html += '<button type="button" class="rec-starter' + on + '" data-action="rec-pick" data-id="' + p.id + '" data-idx="' + i + '">' +
          '<div class="lab">Option ' + (i + 1) + " · " + tones[i % 3] + "</div><p>" + esc(starters[i]) + "</p></button>";
      }
      html += '<button type="button" class="btn btn-ghost ink" data-action="rec-more" data-id="' + p.id + '">More options</button></div>';

      html += '<div class="rec-step"><div class="rec-step-h"><span class="n">2</span> Add your own words</div>' +
        '<p class="hint">This is the most important step. A few words in your voice stop the comment looking copied.</p>' +
        "<ul class=\"rec-prompts\"><li>How do you know " + esc(first) + "?</li>" +
        "<li>What job did he do for you or someone you know?</li>" +
        "<li>One thing you liked</li></ul>" +
        '<div class="rec-quick">' +
        '<button type="button" data-action="rec-chip-own" data-id="' + p.id + '" data-text="I know ' + esc(first) + ' from a job we were both on. ">I know ' + esc(first) + " from a job</button>" +
        '<button type="button" data-action="rec-chip-own" data-id="' + p.id + '" data-text="He fixed a leak at my place last year. ">He fixed a leak at my place</button>' +
        '<button type="button" data-action="rec-chip-own" data-id="' + p.id + '" data-text="I have seen his work first-hand and he was punctual and tidy. ">Punctual and tidy</button>' +
        '<button type="button" data-action="rec-chip-own" data-id="' + p.id + '" data-text="I know ' + esc(first) + ' as a fellow local business. ">Fellow local business</button>' +
        "</div>" +
        '<textarea class="rec-own" data-action="rec-own" data-id="' + p.id + '" placeholder="Add a sentence or two in your own words…">' + esc(ui.own) + "</textarea>" +
        (String(ui.own || "").trim()
          ? '<div class="rec-touch">Personal touch added ✓</div>'
          : '<div class="rec-touch off">Add a few words so this does not look like a shared script.</div>') +
        "</div>";

      function chip(key, label, allowed, hasVal) {
        if (!hasVal) return "";
        if (!allowed) return '<button type="button" class="rec-chip" disabled title="Not shared by ' + esc(first) + '">' + esc(label) + " (not shared)</button>";
        return '<button type="button" class="rec-chip' + (ui.chips[key] ? " on" : "") + '" data-action="rec-chip" data-id="' + p.id + '" data-chip="' + key + '">' + esc(label) + "</button>";
      }
      html += '<div class="rec-step"><div class="rec-step-h"><span class="n">3</span> Add details</div>' +
        '<p class="hint">Name and business can stay in the comment. Phone numbers and links stay off unless you turn them on — and only one link at a time. Check the Facebook group’s rules before you include a link or a number.</p>' +
        '<div class="rec-chips">' +
        chip("name", "Name", true, true) +
        chip("business", "Business", true, true) +
        chip("phone", "Phone", share.phone, !!feat.phone) +
        chip("facebook", "Facebook profile", share.facebook, !!facebookOf(feat)) +
        chip("profile", "Rate Buddies profile", share.profile, true) +
        "</div></div>";

      var preview = finalText(p, feat, ui, starters);
      html += '<div class="rec-step"><div class="rec-step-h"><span class="n">4</span> Copy &amp; open the post</div>' +
        '<p class="hint">This is what will be copied. Tweak a word if you like, then paste it on Facebook yourself. The app never posts for you.</p>' +
        '<div class="rec-preview">' + esc(preview) + "</div>";
      if (ui.copied) html += '<div class="rec-copied-banner">Copied — now paste it on Facebook</div>';
      if (ui.warned && !String(ui.own || "").trim()) {
        html += '<div class="rec-warn">Add a few words of your own so it doesn’t look copied. Tap Copy again if you still want to use this as it is.</div>';
      }
      html += '<button type="button" class="btn btn-primary" data-action="rec-copy" data-id="' + p.id + '">Copy my recommendation</button>' +
        '<a class="btn btn-fb has-ico' + (ui.copied ? " is-prominent" : "") + '" href="' + esc(p.link) + '" target="_blank" rel="noopener noreferrer">' + facebookF(16, "#fff") + "<span>Open post on Facebook</span></a>" +
        '<button type="button" class="btn btn-primary btn-done" data-action="done-rec" data-id="' + p.id + '">I recommended ' + esc(first) + "</button></div></div>";
      html += '<div class="rec-tip">Make it yours: tweak a word or two before posting. Only recommend ' + esc(first) + " if you genuinely know his work. Comments look more natural if they don’t all land at once — take a moment today, rather than all posting together.</div>";
    } else if (st === "done") {
      html += '<a class="btn btn-fb has-ico" href="' + esc(p.link) + '" target="_blank" rel="noopener noreferrer">' + facebookF(16, "#fff") + "<span>Open post on Facebook</span></a>";
      html += '<div class="reviewed-tick" style="margin-top:8px">You’ve marked this as done — thanks for helping ' + esc(first) + ".</div>";
    }
    return html + "</article>";
  }

  function patchRecommend(html) {
    seedPosts();
    var posts = S()._fbPosts || [];
    posts.forEach(function (p) {
      if (p.source !== "devi") return;
      var re = new RegExp('<article class="rec-card[\\s\\S]*?data-rec="' + p.id + '"[\\s\\S]*?</article>');
      if (re.test(html)) html = html.replace(re, deviCard(p));
    });
    return html;
  }

  /* ---------- My profile: Recommendation details ---------- */
  function recShareSection(m) {
    if (!m) return "";
    if (!m.recShare) m.recShare = recShareOf(m);
    var s = recShareOf(m);
    function row(key, label, val) {
      if (!val) return "";
      return '<div class="rec-share-row"><div class="meta"><strong>' + esc(label) + "</strong><span>" + esc(val) + "</span></div>" +
        '<button type="button" class="toggle' + (s[key] ? " on" : "") + '" data-action="rec-share" data-chip="' + key + '" aria-pressed="' + (s[key] ? "true" : "false") + '"><i></i></button></div>';
    }
    return '<section class="rec-share" id="rec-share">' +
      "<h3>Recommendation details</h3>" +
      '<p class="hint">When another member recommends you, they can include only the details you allow. Name and business can always be mentioned. Phone numbers and links stay off unless they turn them on.</p>' +
      row("phone", "Phone number", m.phone || "") +
      row("facebook", "Facebook profile", facebookOf(m).replace(/^https?:\/\//, "")) +
      row("profile", "Rate Buddies profile", profileOf(m).replace(/^https?:\/\//, "")) +
      "</section>";
  }
  function patchMe(html) {
    if (!html || html.indexOf("Recommendation details") !== -1) return html;
    var m = T().me && T().me();
    var sec = recShareSection(m);
    var i = html.lastIndexOf("</section>");
    if (i !== -1) return html.slice(0, i) + sec + html.slice(i);
    return html + sec;
  }

  /* ---------- Tutorials (member) ---------- */
  function topbar(title, extra) {
    if (root.TC12 && TC12.topbar) return TC12.topbar(title, extra || '<span class="header-spacer"></span>');
    return '<div class="app-header"><button class="icon-btn" data-go="more" aria-label="Back">‹</button><div class="ht">' + esc(title) + "</div>" + (extra || '<span class="header-spacer"></span>') + "</div>";
  }
  function tutCard(v, opts) {
    opts = opts || {};
    var watched = Tut() && Tut().isWatched(v.id);
    var pin = opts.startHere ? '<div class="tut-watched" style="color:#1A5FD4">Start here</div>' : "";
    return '<button type="button" class="tut-card" data-action="tut-open" data-id="' + esc(v.id) + '">' +
      '<div class="tut-thumb">' + (v.thumb ? '<img src="' + esc(v.thumb) + '" alt="">' : "") +
      '<span class="play">' + playIco(28) + "</span>" +
      (v.duration ? '<span class="dur">' + esc(v.duration) + "</span>" : "") + "</div>" +
      '<div class="meta"><strong>' + esc(v.title) + "</strong><span>" + esc(v.description || "") + "</span>" +
      pin +
      (watched ? '<span class="tut-watched">Watched ✓</span>' : "") +
      (v.sample ? '<span class="tut-sample">Sample video — placeholder only</span>' : "") +
      "</div></button>";
  }
  function renderTutorials() {
    var d = Tut() ? Tut().load() : null;
    var html = '<section class="screen has-header" data-screen="tutorials">' +
      '<div class="app-header"><button class="icon-btn" data-go="more" aria-label="Back">‹</button><div class="ht">Video tutorials</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><p class="hint tut-intro">Short guides on how to use Rate Buddies. Start with the welcome video if you are new.</p>';
    if (d && d.intro) {
      html += '<div class="tut-sec"><h3>Start here</h3>' + tutCard(d.intro, { startHere: true }) + "</div>";
    }
    (Tut() ? Tut().visibleSections() : []).forEach(function (sec) {
      var vids = Tut().videosIn(sec.id);
      if (!vids.length) return;
      html += '<div class="tut-sec"><h3>' + esc(sec.title) + "</h3>" + vids.map(function (v) { return tutCard(v); }).join("") + "</div>";
    });
    return html + "</div></section>";
  }
  function renderPlayer() {
    var id = S()._tutOpen || (Tut() && Tut().load().intro && Tut().load().intro.id);
    var v = Tut() && Tut().videoById(id);
    if (!v) return renderTutorials();
    var playing = !!S()._tutPlaying;
    var html = '<section class="screen has-header" data-screen="tutorial-play">' +
      '<div class="app-header"><button class="icon-btn" data-go="tutorials" aria-label="Back">‹</button><div class="ht">' + esc(v.title) + '</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="tut-player">';
    if (playing && v.embed) {
      html += '<iframe src="' + esc(v.embed) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen title="' + esc(v.title) + '"></iframe>';
    } else {
      html += (v.thumb ? '<img src="' + esc(v.thumb) + '" alt="">' : "") +
        '<button type="button" class="play-big" data-action="tut-play" data-id="' + esc(v.id) + '" aria-label="Play">' + playIco(56) + "</button>";
    }
    html += "</div>" +
      (v.duration ? '<p class="hint" style="margin:0 0 8px">' + esc(v.duration) + (v.sample ? " · Sample video — placeholder only" : "") + "</p>" : "") +
      '<p class="tut-desc">' + esc(v.description || "") + "</p>" +
      (Tut() && Tut().isWatched(v.id) ? '<p class="tut-watched">Watched ✓</p>' : "") +
      "</div></section>";
    return html;
  }
  function patchMore(html) {
    if (!html || html.indexOf('data-go="help"') === -1) return html;
    if (html.indexOf('data-go="tutorials"') !== -1) return html;
    var tile = '<button type="button" class="apps-tile" data-go="tutorials"><span class="apps-ico navy">' + playIco(18) + "</span><span>Video tutorials</span></button>";
    html = html.replace('<button type="button" class="apps-tile" data-go="help">', tile + '<button type="button" class="apps-tile" data-go="help">');
    return html;
  }
  function patchHelp(html) {
    if (!html || html.indexOf('data-screen="help"') === -1) return html;
    if (html.indexOf("data-go=\"tutorials\"") !== -1) return html;
    var card = '<button type="button" class="card group" style="padding:14px;margin-bottom:10px;width:100%;text-align:left;border:0;display:block" data-go="tutorials"><p style="font-weight:800;margin-bottom:6px">Video tutorials</p><p style="font-size:14px;font-weight:600;line-height:1.5;color:var(--text)">Watch short guides on how to use the app, leave a Google Review, or recommend a buddy. Start with the welcome video.</p></button>';
    html = html.replace('<div class="card group"', card + '<div class="card group"');
    return html;
  }

  /* ---------- Mandatory intro ---------- */
  function introNeeded() {
    if (S()._forceIntro) return true;
    var tut = Tut();
    if (!tut) return false;
    var d = tut.load();
    if (!d.requireIntro || !d.intro) return false;
    /* A brand-new approved member (onboarding.forceComplete, intro not marked). */
    var o = S().onboarding;
    if (o && o.forceComplete && !tut.introWatched(meId()) && !S()._introDone) return true;
    if (S()._introGate && !tut.introWatched(meId()) && !S()._introDone) return true;
    return false;
  }
  function fmtLeft(sec) {
    sec = Math.max(0, Math.round(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }
  function introProgress() {
    S()._introProg = S()._introProg || { watched: 50, duration: 200, playing: false, unlocked: false };
    return S()._introProg;
  }
  function renderIntro() {
    var d = Tut() && Tut().load();
    var v = d && d.intro;
    if (!v) return '<section class="screen has-header" data-screen="intro-video"><div class="scroll"><p>No intro video is set.</p></div></section>';
    var p = introProgress();
    if (!p.duration) p.duration = v.durationSec || 200;
    var left = Math.max(0, p.duration - p.watched);
    var pct = Math.min(100, Math.round((p.watched / p.duration) * 100));
    var need = d.minWatchedPct || 90;
    var unlocked = p.unlocked || pct >= need;
    var playing = !!p.playing;
    var html = '<section class="screen has-header" data-screen="intro-video">' +
      '<div class="app-header"><span class="header-spacer"></span><div class="ht">Welcome</div><span class="header-spacer"></span></div>' +
      '<div class="scroll intro-lock">' +
      "<h2>Welcome to Rate Buddies — how to use the app</h2>" +
      '<p class="sub">Please watch this short introduction before you continue. It can’t be skipped. When it ends, you’ll see where to find more help in Video tutorials.</p>' +
      '<div class="tut-player">';
    if (playing && v.embed) {
      html += '<iframe id="introFrame" src="' + esc(v.embed) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen title="' + esc(v.title) + '"></iframe>';
    } else {
      html += (v.thumb ? '<img src="' + esc(v.thumb) + '" alt="">' : "") +
        '<button type="button" class="play-big" data-action="intro-play" aria-label="Play">' + playIco(56) + "</button>";
    }
    html += "</div>" +
      (v.sample ? '<p class="tut-sample">Sample video — placeholder only</p>' : "") +
      '<div class="intro-progress"><div class="bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="lab">' + (unlocked ? "You’ve watched enough to continue." : "You must watch this video — only takes 2 mins") + "</div></div>" +
      '<button type="button" class="btn btn-primary' + (unlocked ? "" : " is-locked") + '"' + (unlocked ? ' data-action="intro-finished"' : " disabled") + ">Continue</button>" +
      '<div class="intro-proto"><strong>Prototype only.</strong> In the live app, Continue stays locked until you have actually watched about ' + need + '% (seeking to the end does not count). Use this control to preview the finished screen: ' +
      '<button type="button" class="btn btn-ghost ink" style="margin-top:8px" data-action="intro-simulate">Simulate video ended</button></div>' +
      "</div></section>";
    return html;
  }
  function renderIntroDone() {
    return '<section class="screen has-header" data-screen="intro-done">' +
      '<div class="app-header"><span class="header-spacer"></span><div class="ht">You’re all set</div><span class="header-spacer"></span></div>' +
      '<div class="scroll intro-done"><div class="tick">✓</div>' +
      "<h2>You’re all set</h2>" +
      "<p>Thanks for watching. You now know what Rate Buddies is and how the circle works.</p>" +
      "<p>Need help later? Watch more in <strong>More → Video tutorials</strong>.</p>" +
      '<button type="button" class="btn btn-primary" data-action="intro-continue">Continue</button>' +
      '<button type="button" class="btn btn-ghost ink" data-action="intro-to-tutorials" style="margin-top:8px">Watch more tutorials</button>' +
      "</div></section>";
  }

  function wrapGo() {
    var TC = T();
    if (!TC.go || TC.go._tc181) return;
    var orig = TC.go;
    function wrapped(id, opts) {
      if (introNeeded()) {
        var allow = { "intro-video": 1, "intro-done": 1, welcome: 1, signin: 1, signup: 1, "signup-email": 1, "signup-phone": 1, "signup-name": 1, "create-profile": 1, pending: 1 };
        if (!allow[id]) id = "intro-video";
      }
      return orig.call(TC, id, opts);
    }
    wrapped._tc181 = true;
    TC.go = wrapped;
  }

  function wrapRender() {
    if (!root.TC12 || !TC12.render || TC12._v181) return;
    var prev = TC12.render;
    TC12.render = function (id) {
      if (id === "tutorials") return renderTutorials();
      if (id === "tutorial-play") return renderPlayer();
      if (id === "intro-video") return renderIntro();
      if (id === "intro-done") return renderIntroDone();
      var html = prev.apply(this, arguments);
      if (!html) return html;
      if (id && String(id).indexOf("fb-recommend") === 0) html = patchRecommend(html);
      if (id === "me") html = patchMe(html);
      if (id === "more") html = patchMore(html);
      if (id === "help") html = patchHelp(html);
      return html;
    };
    TC12._v181 = 1;
  }

  function hookAfterGo() {
    if (!root.TC12) root.TC12 = {};
    var prev = TC12.afterGo;
    TC12.afterGo = function (id) {
      if (typeof prev === "function") prev(id);
      if (id === "tutorial-play" && Tut()) {
        var vid = S()._tutOpen;
        if (vid) Tut().markWatched(vid);
      }
    };
  }

  function bindOwn(e) {
    if (e.target && e.target.getAttribute && e.target.getAttribute("data-action") === "rec-own") {
      var id = e.target.getAttribute("data-id");
      recState(id).own = e.target.value;
      var touch = e.target.parentNode && e.target.parentNode.querySelector(".rec-touch");
      if (touch) {
        if (String(e.target.value || "").trim()) {
          touch.className = "rec-touch";
          touch.textContent = "Personal touch added ✓";
        } else {
          touch.className = "rec-touch off";
          touch.textContent = "Add a few words so this does not look like a shared script.";
        }
      }
      /* live preview */
      var preview = document.querySelector(".rec-preview");
      var post = (S()._fbPosts || []).filter(function (x) { return x.id === id; })[0];
      var feat = post && (member(post.forId) || member("michael"));
      if (preview && post && feat) {
        var ui = recState(id);
        var starters = allocateStarters(post, feat, meId(), false);
        preview.textContent = finalText(post, feat, ui, starters);
      }
    }
  }

  document.addEventListener("input", bindOwn, true);

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-action]");
    if (!btn) return;
    var act = btn.getAttribute("data-action");
    var id = btn.getAttribute("data-id");
    var go = T().go;

    if (act === "rec-pick") {
      recState(id).pick = Number(btn.getAttribute("data-idx") || 0);
      if (go) go("fb-recommend-open");
      e.preventDefault(); return;
    }
    if (act === "rec-more") {
      var post = (S()._fbPosts || []).filter(function (x) { return x.id === id; })[0];
      var feat = post && (member(post.forId) || member("michael"));
      if (post && feat) allocateStarters(post, feat, meId(), true);
      recState(id).pick = 0;
      toast("New starters — still unique to you for this post.");
      if (go) go("fb-recommend-open");
      e.preventDefault(); return;
    }
    if (act === "rec-chip") {
      var key = btn.getAttribute("data-chip");
      var ui = recState(id);
      var links = { facebook: 1, website: 1, profile: 1 };
      if (links[key]) {
        var turnOn = !ui.chips[key];
        ui.chips.facebook = false; ui.chips.website = false; ui.chips.profile = false;
        ui.chips[key] = turnOn;
      } else {
        ui.chips[key] = !ui.chips[key];
      }
      if (go) go("fb-recommend-open");
      e.preventDefault(); return;
    }
    if (act === "rec-chip-own") {
      var add = btn.getAttribute("data-text") || "";
      var st = recState(id);
      if (st.own && st.own.indexOf(add.trim()) !== -1) { /* already */ }
      else st.own = (st.own ? String(st.own).replace(/\s*$/, " ") : "") + add;
      if (go) go("fb-recommend-open");
      e.preventDefault(); return;
    }
    if (act === "rec-copy") {
      var post2 = (S()._fbPosts || []).filter(function (x) { return x.id === id; })[0];
      var feat2 = post2 && (member(post2.forId) || member("michael"));
      var ui2 = recState(id);
      if (!String(ui2.own || "").trim() && !ui2.warned) {
        ui2.warned = true;
        if (go) go("fb-recommend-open");
        e.preventDefault(); return;
      }
      var starters2 = allocateStarters(post2, feat2, meId(), false);
      var text = finalText(post2, feat2, ui2, starters2);
      if (navigator.clipboard && text) navigator.clipboard.writeText(text).catch(function () {});
      ui2.copied = true;
      toast("Copied — now paste it on Facebook.");
      if (go) go("fb-recommend-open");
      e.preventDefault(); return;
    }
    if (act === "rec-share") {
      var me = T().me && T().me();
      if (!me) return;
      if (!me.recShare) me.recShare = recShareOf(me);
      var k = btn.getAttribute("data-chip");
      me.recShare[k] = !me.recShare[k];
      if (go) go("me");
      e.preventDefault(); return;
    }
    if (act === "tut-open") {
      S()._tutOpen = id;
      S()._tutPlaying = false;
      if (go) go("tutorial-play");
      e.preventDefault(); return;
    }
    if (act === "tut-play") {
      S()._tutOpen = id;
      S()._tutPlaying = true;
      if (Tut()) Tut().markWatched(id);
      if (go) go("tutorial-play");
      e.preventDefault(); return;
    }
    if (act === "intro-play") {
      introProgress().playing = true;
      if (go) go("intro-video");
      e.preventDefault(); return;
    }
    if (act === "intro-simulate") {
      var pr = introProgress();
      pr.watched = pr.duration; pr.unlocked = true; pr.playing = false;
      if (go) go("intro-video");
      e.preventDefault(); return;
    }
    if (act === "intro-finished") {
      if (Tut()) Tut().setIntroWatched(meId(), true);
      S()._introDone = true;
      S()._forceIntro = false;
      if (go) go("intro-done");
      e.preventDefault(); return;
    }
    if (act === "intro-continue") {
      S()._introDone = true;
      S()._forceIntro = false;
      if (Tut()) Tut().setIntroWatched(meId(), true);
      var o = S().onboarding;
      if (o && o.forceComplete && !o.skipped && !o.done) { if (go) go("complete-profile"); }
      else if (go) go("home");
      e.preventDefault(); return;
    }
    if (act === "intro-to-tutorials") {
      S()._introDone = true;
      S()._forceIntro = false;
      if (Tut()) Tut().setIntroWatched(meId(), true);
      if (go) go("tutorials");
      e.preventDefault(); return;
    }
  }, true);

  function wrapRenderMe() {
    if (!root.TC12 || !TC12.renderMe || TC12.renderMe._tc181) return;
    var prev = TC12.renderMe;
    TC12.renderMe = function () {
      return patchMe(prev.apply(this, arguments));
    };
    TC12.renderMe._tc181 = true;
  }
  function boot() {
    wrapRender();
    wrapRenderMe();
    wrapGo();
    hookAfterGo();
  }
  if (root.TC12) boot();
  else document.addEventListener("DOMContentLoaded", boot);
  setTimeout(boot, 0);

  root.TC181 = { deviCard: deviCard, recState: recState, allocateStarters: allocateStarters, introNeeded: introNeeded, introProgress: introProgress };
})(window);
