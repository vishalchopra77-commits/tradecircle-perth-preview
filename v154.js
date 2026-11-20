/* TradeCircle Perth — prototype v1.5.4 integration */
(function () {
  "use strict";

  function T() { return window.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function esc(s) { return T().escapeText ? T().escapeText(s) : String(s == null ? "" : s); }
  function esa(s) { return T().escapeAttr ? T().escapeAttr(s) : String(s == null ? "" : s).replace(/"/g, "&quot;"); }
  function ico(n) { return T().icon ? T().icon(n) : ""; }
  function av(m, n) { return T().avatarHTML(m, n); }
  function fn(m) { return T().fullName(m); }
  function toast(m) { if (T().toast) T().toast(m); }
  function go(id, mid) { T().go(id, mid); }
  function member(id) {
    return (T().MEMBERS || []).find(function (m) { return m.id === id; }) || T().me();
  }
  function meId() { return S().meId || (T().me && T().me() && T().me().id) || "jamie"; }
  function R() { return window.TCReviews || null; }
  function Ideas() { return window.TCIdeas || null; }
  function Links() { return window.TCLinks || null; }
  function Prof() { return window.TCProfile || null; }

  function svg(p, w) {
    w = w || 16;
    return '<svg viewBox="0 0 24 24" width="' + w + '" height="' + w + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + p + "</svg>";
  }
  var COPY_ICO = svg('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 012-2h10"/>');
  var CHECK_ICO = svg('<path d="M5 12l5 5L20 7"/>');
  function googleG(size, mono) {
    size = size || 18;
    if (mono) {
      return '<svg class="g-ico" viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09zM12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23zM5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84zM12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
    }
    return '<svg class="g-ico g-color" viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
  }
  var STAR_ICO = googleG(18);

  function copyFallback(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.setAttribute("aria-hidden", "true");
    ta.style.cssText = "position:fixed;top:0;left:0;width:2em;height:2em;padding:0;margin:0;border:0;outline:none;background:transparent;opacity:0.01;z-index:9999;";
    var parent = document.querySelector("#phone") || document.body;
    parent.appendChild(ta);
    ta.focus();
    if (navigator.userAgent.match(/ipad|iphone|ipod/i)) {
      var range = document.createRange();
      range.selectNodeContents(ta);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      ta.setSelectionRange(0, ta.value.length);
    } else {
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
    }
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
    parent.removeChild(ta);
    return ok;
  }
  function copyText(text) {
    text = String(text == null ? "" : text);
    if (!text) return false;
    if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        var p = navigator.clipboard.writeText(text);
        if (p && typeof p.then === "function") {
          p.catch(function () { copyFallback(text); });
          return true;
        }
        return true;
      } catch (err) {
        return copyFallback(text);
      }
    }
    return copyFallback(text);
  }
  function copyBtn(text, toastMsg) {
    return '<button type="button" class="copy-btn" data-action="copy-text" data-text="' + esa(text) + '" data-toast="' + esa(toastMsg || "Copied.") + '">' + COPY_ICO + "<span>Copy</span></button>";
  }
  function flashCopied(btn) {
    if (!btn) return;
    if (!btn.getAttribute("data-copy-label")) btn.setAttribute("data-copy-label", btn.innerHTML);
    if (!btn.style.minWidth) btn.style.minWidth = btn.offsetWidth + "px";
    btn.classList.add("copied");
    var span = btn.querySelector("span");
    if (span && btn.classList.contains("btn")) {
      span.textContent = "Copied \u2713";
      var icoEl = btn.querySelector("svg");
      if (icoEl) icoEl.outerHTML = CHECK_ICO;
    } else {
      btn.innerHTML = CHECK_ICO + "<span>Copied \u2713</span>";
    }
    clearTimeout(btn._copyT);
    btn._copyT = setTimeout(function () {
      btn.classList.remove("copied");
      btn.innerHTML = btn.getAttribute("data-copy-label");
      btn.style.minWidth = "";
    }, 1800);
  }

  var LS_USED = "tc154_used_ideas";
  var LS_ALERT = "tc154_used_alert_ideas";
  function loadJSON(key, fb) {
    try { var r = localStorage.getItem(key); if (r) return JSON.parse(r); } catch (e) {}
    return fb;
  }
  function saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function usedFor(bizId) { return (loadJSON(LS_USED, {})[bizId] || []).slice(); }
  function markUsed(bizId, texts) {
    var all = loadJSON(LS_USED, {});
    all[bizId] = all[bizId] || [];
    (Array.isArray(texts) ? texts : [texts]).forEach(function (t) {
      if (t && all[bizId].indexOf(t) === -1) all[bizId].push(t);
    });
    saveJSON(LS_USED, all);
  }
  function usedAlert(aid) { return (loadJSON(LS_ALERT, {})[aid] || []).slice(); }
  function markAlertUsed(aid, texts) {
    var all = loadJSON(LS_ALERT, {});
    all[aid] = all[aid] || [];
    (Array.isArray(texts) ? texts : [texts]).forEach(function (t) {
      if (t && all[aid].indexOf(t) === -1) all[aid].push(t);
    });
    saveJSON(LS_ALERT, all);
  }

  function ideaState() {
    var st = S();
    st.reviewFor = st.reviewFor || st.selectedMember || "jack";
    st.ideaJob = st.ideaJob || "";
    st.ideaSuburb = st.ideaSuburb || "";
    st.ideaMonth = st.ideaMonth || "";
    st.ideaLength = st.ideaLength || "medium";
    st.ideaTone = st.ideaTone || "casual";
    st.ideaFocus = st.ideaFocus && st.ideaFocus.length ? st.ideaFocus : ["seo", "service", "area"];
    st.reviewDraft = st.reviewDraft || "";
    st.pickedIdea = (typeof st.pickedIdea === "number") ? st.pickedIdea : -1;
    st.ideaRound = st.ideaRound || 0;
    return st;
  }

  function chip(label, on, attrs) {
    return '<button type="button" class="chip' + (on ? " active" : "") + '" ' + attrs + ">" + esc(label) + "</button>";
  }

  function gLink(m) {
    if (window.TC12 && false) {}
    var name = encodeURIComponent((m && m.business) || "Business");
    return "https://www.google.com/search?q=" + name + "+Perth+reviews";
  }

  function renderReviewIdeas() {
    var st = ideaState();
    var m = member(st.reviewFor);
    var engine = Ideas();
    var jobs = engine ? engine.jobsFor(m.trade) : ["the booked job"];
    var suburbs = (engine && engine.SUBURBS) || ["Midland", "Kwinana", "Joondalup"];
    var months = (engine && engine.MONTHS) || ["October", "November"];
    if (!st.ideaJob) st.ideaJob = jobs[1] || jobs[0];
    if (!st.ideaSuburb) st.ideaSuburb = (m.regions && m.regions[0] === "kwinana") ? "Kwinana" : (suburbs[0] || "Midland");
    if (!st.ideaMonth) st.ideaMonth = "October";
    var focuses = st.ideaFocus;
    var ideas = engine
      ? engine.buildReviewIdeas({
        member: m,
        viewerId: meId(),
        job: st.ideaJob,
        suburb: st.ideaSuburb,
        month: st.ideaMonth,
        length: st.ideaLength,
        tone: st.ideaTone,
        focuses: focuses,
        used: usedFor(m.id),
        round: st.ideaRound
      })
      : ["Write a short review in your own words."];
    st._ideas = ideas;
    var capped = R() && R().atLimit(m.id);
    var focusMeta = [
      ["seo", "Search-friendly"],
      ["service", "Service"],
      ["area", "Area"],
      ["staff", "Staff"],
      ["value", "Value"],
      ["timeliness", "Timeliness"],
      ["cleanliness", "Cleanliness"]
    ];
    function row(label, html) {
      return '<p class="group-label">' + label + '</p><div class="chips chips-tight">' + html + "</div>";
    }
    var cta = capped
      ? (R().bannerHTML(m.id) + R().lockedButton("Locked today"))
      : '<div class="idea-cta-row">' +
        '<button type="button" class="btn btn-ghost ink has-ico" data-action="copy-draft">' + COPY_ICO + "<span>Copy</span></button>" +
        '<a class="btn btn-primary has-ico" href="' + esa(gLink(m)) + '" target="_blank" rel="noopener noreferrer" data-action="copy-open" data-id="' + m.id + '">' + STAR_ICO + "<span>Copy and open Google</span></a>" +
        "</div>" +
        '<button type="button" class="btn btn-ghost ink has-ico" data-action="left-review" data-id="' + m.id + '" style="margin-top:8px">' + CHECK_ICO + "<span>Done, I left this review</span></button>" +
        '<p class="hint" style="text-align:center">Copy an idea, or write your own, then paste it into Google and change it before you post. Tap Done after you have posted it.</p>';

    return '<section class="screen has-header" data-screen="review-ideas">' +
      '<div class="app-header"><button class="icon-btn" data-go="reviews" aria-label="Back">' + ico("back") + '</button><div class="ht">Review ideas</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div style="display:flex;gap:10px;align-items:center;margin-bottom:10px">' + av(m, 48) +
      '<div><div style="font-weight:800">' + esc(fn(m)) + '</div><div class="hint" style="margin:0">' + esc(m.business) + " \u00b7 " + esc(m.trade) + "</div>" +
      (R() ? R().counterHTML(m.id) : "") + "</div></div>" +
      (capped ? R().bannerHTML(m.id, { remind: true }) : "") +
      '<div class="notice">Only review businesses you have actually used. These are ideas and sentence starters, not finished reviews. Write in your own words.</div>' +
      row("What job did they do?", jobs.slice(0, 8).map(function (j) {
        return chip(j.replace(/^an?\s+/i, ""), st.ideaJob === j, 'data-idea-job="' + esa(j) + '"');
      }).join("")) +
      row("Suburb", suburbs.map(function (j) {
        return chip(j, st.ideaSuburb === j, 'data-idea-sub="' + esa(j) + '"');
      }).join("")) +
      row("When", months.map(function (j) {
        return chip(j, st.ideaMonth === j, 'data-idea-mo="' + esa(j) + '"');
      }).join("")) +
      row("Length", ["short", "medium", "detailed"].map(function (j) {
        var lab = j === "short" ? "Short" : j === "detailed" ? "Detailed" : "Medium";
        return chip(lab, st.ideaLength === j, 'data-idea-len="' + j + '"');
      }).join("")) +
      row("Tone", ["casual", "professional", "warm"].map(function (j) {
        var lab = j.charAt(0).toUpperCase() + j.slice(1);
        return chip(lab, st.ideaTone === j, 'data-idea-tone="' + j + '"');
      }).join("")) +
      row("Focus on", focusMeta.map(function (j) {
        return chip(j[1], focuses.indexOf(j[0]) >= 0, 'data-idea-focus="' + j[0] + '"');
      }).join("")) +
      '<p class="hint" style="margin-top:0">Search-friendly mentions the trade, the job and the suburb in natural wording, the way local search likes — never keyword-stuffed.</p>' +
      '<p class="group-label">Ideas you can start from</p>' +
      ideas.map(function (t, i) {
        return '<div class="idea-card' + (st.pickedIdea === i ? " on" : "") + '" data-pick-idea="' + i + '" role="button" tabindex="0">' +
          '<p class="idea-text">' + esc(t) + "</p>" +
          copyBtn(t, "Copied, now paste it in Google") +
          "</div>";
      }).join("") +
      '<p class="idea-hint">These ideas are just for you. Other members will see different ones, so the same wording does not end up on Google twice. Please change a few words in your own voice before you post.</p>' +
      '<button type="button" class="link" data-action="refresh-ideas" style="margin:0 0 12px">Show different ideas</button>' +
      '<div class="field"><label>Write or edit your review</label><textarea id="reviewDraft" rows="4" placeholder="Use an idea as a starting point, then write it in your own words.">' + esc(st.reviewDraft) + "</textarea></div>" +
      cta +
      "</div></section>";
  }

  function enhanceCard(m, html) {
    if (!R()) return html;
    var extra = R().counterHTML(m.id);
    if (R().atLimit(m.id)) {
      extra += R().bannerHTML(m.id, { remind: true });
      html = html.replace(/<button type="button" class="slim-cta" data-action="review-back"[^>]*>[\s\S]*?<\/button>/,
        '<span class="locked-pill">Locked today</span>');
    }
    if (html.indexOf("member-main") >= 0 && html.indexOf("limit-banner") === -1) {
      var last = html.lastIndexOf("</div>");
      if (last !== -1) html = html.slice(0, last) + extra + html.slice(last);
    }
    return html;
  }

  function lockedOrReview(m, openHtml) {
    if (R() && R().atLimit(m.id)) return R().bannerHTML(m.id, { remind: true }) + R().counterHTML(m.id) + R().lockedButton("Locked today");
    return (R() ? R().counterHTML(m.id) : "") + openHtml;
  }

  function handle(e) {
    if (Prof()) {
      if (e.target.closest("[data-action='gal-close']") || e.target.id === "galleryViewer") {
        if (e.target.id === "galleryViewer" || e.target.closest("[data-action='gal-close']")) {
          Prof().closeViewer();
          return true;
        }
      }
      if (e.target.closest("[data-action='gal-prev']")) { Prof().step(-1); return true; }
      if (e.target.closest("[data-action='gal-next']")) { Prof().step(1); return true; }
      var rm = e.target.closest("[data-action='gal-remove']");
      if (rm) {
        e.preventDefault();
        e.stopPropagation();
        Prof().removePhoto(member(rm.getAttribute("data-id") || meId()), rm.getAttribute("data-gid"));
        toast("Photo removed in this prototype only.");
        go("me");
        return true;
      }
      var add = e.target.closest("[data-action='gal-add']");
      if (add) {
        Prof().addPhoto(member(add.getAttribute("data-id") || meId()));
        toast("Photo added in this prototype only.");
        go("me");
        return true;
      }
      var open = e.target.closest("[data-action='gal-open']");
      if (open) {
        Prof().openViewer(open.getAttribute("data-id"), open.getAttribute("data-index"));
        return true;
      }
    }
    var capBtn = e.target.closest("[data-action='open-ideas'], [data-action='review-back'], [data-action='copy-open']");
    if (capBtn && R()) {
      var capId = capBtn.getAttribute("data-id") || S().reviewFor;
      if (capId && R().atLimit(capId)) {
        e.preventDefault();
        toast("Daily limit reached: " + R().limit() + " of " + R().limit() + " Google reviews today. Opens tomorrow.");
        return true;
      }
    }
    var copyEl = e.target.closest("[data-action='copy-text'], [data-action='copy-draft'], [data-action='copy-idea'], [data-action='copy-invite']");
    if (copyEl) {
      e.preventDefault();
      e.stopPropagation();
      var action = copyEl.getAttribute("data-action");
      var text = "";
      var msg = copyEl.getAttribute("data-toast") || "Copied.";
      if (action === "copy-draft") {
        var ta = document.getElementById("reviewDraft");
        text = (ta && ta.value) || S().reviewDraft || "";
        if (!text) { toast("Write or pick an idea first."); return true; }
        msg = "Copied, now paste it in Google";
        if (S().reviewFor) markUsed(S().reviewFor, text);
      } else if (action === "copy-invite") {
        text = "https://ratebuddies.demo/join/hale-circle";
        msg = "Invite link copied.";
      } else {
        text = copyEl.getAttribute("data-text") || "";
        if (S().screen === "review-ideas" && S().reviewFor) markUsed(S().reviewFor, text);
        if (S().screen === "rec-alert" && S().alertId) markAlertUsed(S().alertId, text);
        if (!copyEl.getAttribute("data-toast") && S().screen === "review-ideas") msg = "Copied, now paste it in Google";
        if (!copyEl.getAttribute("data-toast") && S().screen === "rec-alert") msg = "Copied, now paste it on Facebook";
      }
      if (!text) { toast("Nothing to copy."); return true; }
      copyText(text);
      flashCopied(copyEl);
      toast(msg);
      return true;
    }
    if (e.target.closest("[data-pick-idea]") && e.target.closest("[data-action]")) return false;
    var len = e.target.closest("[data-idea-len]");
    if (len) { S().ideaLength = len.getAttribute("data-idea-len"); go("review-ideas"); return true; }
    var tone = e.target.closest("[data-idea-tone]");
    if (tone) { S().ideaTone = tone.getAttribute("data-idea-tone"); go("review-ideas"); return true; }
    var foc = e.target.closest("[data-idea-focus]");
    if (foc) {
      var idf = foc.getAttribute("data-idea-focus");
      var arr = (S().ideaFocus || ["seo", "service", "area"]).slice();
      var ix = arr.indexOf(idf);
      if (ix >= 0) arr.splice(ix, 1); else arr.push(idf);
      S().ideaFocus = arr;
      go("review-ideas");
      return true;
    }
    var refresh = e.target.closest("[data-action='refresh-ideas']");
    if (refresh) {
      var mid = S().reviewFor || "jack";
      markUsed(mid, S()._ideas || []);
      S().ideaRound = (S().ideaRound || 0) + 1;
      S().pickedIdea = -1;
      go("review-ideas");
      return true;
    }
    var left = e.target.closest("[data-action='left-review']");
    if (left) {
      var bid = left.getAttribute("data-id") || S().reviewFor;
      if (R()) {
        if (R().atLimit(bid)) { toast("Daily limit reached. Opens tomorrow."); return true; }
        R().record(bid, meId());
      }
      markUsed(bid, S().reviewDraft || (S()._ideas || [])[S().pickedIdea] || "");
      toast("Thanks. Marked as left today (" + (R() ? R().countFor(bid) + " of " + R().limit() : "") + ").");
      go("reviews");
      return true;
    }
    var remind = e.target.closest("[data-action='remind-review']");
    if (remind) {
      toast("Reminder set for tomorrow morning (prototype).");
      return true;
    }
    return false;
  }

  function enhanceHome() {
    if (!R()) return;
    var map = {};
    (T().MEMBERS || []).forEach(function (m) { map[fn(m)] = m.id; });
    document.querySelectorAll(".dash-attn").forEach(function (el) {
      if (el.parentNode && el.parentNode.classList.contains("dash-attn-wrap")) return;
      var name = (el.querySelector("strong") || {}).textContent || "";
      var id = map[name];
      var btn = el.querySelector(".dash-attn-btn");
      if (!id || !R().atLimit(id) || !btn || !/review/i.test(btn.textContent || "")) return;
      btn.outerHTML = '<button type="button" class="dash-attn-btn btn-locked" disabled>Locked today</button>';
      var wrap = document.createElement("div");
      wrap.className = "dash-attn-wrap";
      el.parentNode.insertBefore(wrap, el);
      wrap.appendChild(el);
      wrap.insertAdjacentHTML("beforeend", R().bannerHTML(id, { remind: true }));
    });
  }


  function injectProfileExtras(sc, m, mine) {
    if (!Prof() || !sc || !m || sc.querySelector(".profile-extras")) return;
    var html = Prof().viewHTML(m, { mine: !!mine });
    if (!html) return;
    var bio = sc.querySelector(".scroll > p.bio, .profile-hero + p.bio, p.bio");
    if (bio) {
      bio.insertAdjacentHTML("afterend", html);
      bio.remove();
    } else {
      var after = sc.querySelector(".limit-banner") || sc.querySelector(".review-back-banner") || sc.querySelector(".profile-hero");
      if (after) after.insertAdjacentHTML("afterend", html);
    }
  }

  function enhanceMe() {
    var screen = document.querySelector('.screen[data-screen="me"]');
    var me = T().me && T().me();
    if (!screen || !me) return;
    var sc = screen.querySelector(".info-rows");
    if (Links() && sc && !screen.querySelector(".link-row")) {
      var row = Links().iconRow(me);
      if (row) sc.insertAdjacentHTML("beforebegin", '<p class="group-label">Links</p>' + row);
    }
    injectProfileExtras(screen, me, true);
  }

  function enhanceMemberDom() {
    var sc = document.querySelector('.screen[data-screen="member"]');
    if (!sc) return;
    var m = member(S().selectedMember);
    if (!m) return;
    if (Links() && !sc.querySelector(".link-row")) {
      var stack = sc.querySelector(".action-stack");
      var row = Links().iconRow(m);
      if (row && stack) stack.insertAdjacentHTML("beforebegin", '<p class="group-label" style="text-align:center">Links</p>' + row);
    }
    injectProfileExtras(sc, m, false);
    if (!R()) return;
    var hero = sc.querySelector(".profile-hero");
    if (hero && !hero.querySelector(".rev-today")) hero.insertAdjacentHTML("beforeend", R().counterHTML(m.id));
    if (R().atLimit(m.id)) {
      if (!sc.querySelector(".limit-banner")) {
        var host = sc.querySelector(".review-back-banner") || sc.querySelector(".action-stack") || hero;
        if (host) host.insertAdjacentHTML("beforebegin", R().bannerHTML(m.id, { remind: true }));
      }
      sc.querySelectorAll("[data-action='open-ideas'], [data-action='review-back']").forEach(function (leave) {
        leave.outerHTML = R().lockedButton("Locked today");
      });
    }
  }

  function enhanceReviewsDom() {
    if (!R()) return;
    document.querySelectorAll(".req-card, .review-back-banner").forEach(function (card) {
      var btn = card.querySelector("[data-action='open-ideas'], [data-action='review-back']");
      if (!btn) return;
      var id = btn.getAttribute("data-id");
      if (!id) return;
      if (!card.querySelector(".rev-today")) btn.insertAdjacentHTML("beforebegin", R().counterHTML(id));
      if (R().atLimit(id) && !card.querySelector(".limit-banner")) {
        btn.insertAdjacentHTML("beforebegin", R().bannerHTML(id, { remind: true }));
        btn.outerHTML = R().lockedButton("Locked today");
      }
    });
  }

  function enhanceAlertDom() {
    var sc = document.querySelector('.screen[data-screen="rec-alert"]');
    if (!sc || !Ideas()) return;
    var list = sc.querySelectorAll(".idea-mini");
    if (!list.length) return;
    /* Rebuild comment ideas with unique unused set if still the seed three and we have an engine. */
  }

  function enhanceInviteDom() {
    var sc = document.querySelector('.screen[data-screen="invite"]');
    if (!sc) return;
    var field = sc.querySelector(".field");
    if (field && !field.querySelector(".copy-input")) {
      var inp = field.querySelector("input");
      if (inp) {
        var wrap = document.createElement("div");
        wrap.className = "copy-input";
        inp.parentNode.insertBefore(wrap, inp);
        wrap.appendChild(inp);
        wrap.insertAdjacentHTML("beforeend", copyBtn("https://ratebuddies.demo/join/hale-circle", "Invite link copied."));
      }
    }
  }

  function enhanceVoiceDom() {
    document.querySelectorAll(".voice-line.ai").forEach(function (el) {
      if (el.querySelector(".copy-btn")) return;
      var text = el.textContent.trim();
      if (!text) return;
      el.insertAdjacentHTML("beforeend", copyBtn(text, "Copied."));
    });
    if (!R() || !R().atLimit("jack")) return;
    /* If this mock is about leaving Jack a review, append a limit note when relevant. */
  }

  function enhanceAlertIdeasDom() {
    var sc = document.querySelector('.screen[data-screen="rec-alert"]');
    if (!sc) return;
    sc.querySelectorAll(".idea-mini .slim-cta, .idea-mini [data-action='copy-idea']").forEach(function (btn) {
      if (btn.classList.contains("copy-btn")) return;
      var text = btn.getAttribute("data-text") || "";
      btn.outerHTML = copyBtn(text, "Copied, now paste it on Facebook");
    });
  }

  function enhanceEditDom() {
    if (!Links()) return;
    var form = document.querySelector("form[data-form='create-profile'], form[data-form='edit-profile']");
    if (!form || form.querySelector("[data-link-id]")) return;
    var m = (form.getAttribute("data-form") === "edit-profile") ? (T().me && T().me()) : (S().draft || {});
    var links = Links().fromMember(m);
    if (S().draft && S().draft.links) links = Links().fromMember({ links: S().draft.links, page: S().draft.page });
    var html = Links().editFields(links);
    var pageField = null;
    form.querySelectorAll(".field").forEach(function (f) {
      var lab = f.querySelector("label");
      if (lab && /business page/i.test(lab.textContent)) pageField = f;
    });
    var wrap = document.createElement("div");
    wrap.innerHTML = html;
    if (pageField && pageField.parentNode) pageField.parentNode.insertBefore(wrap, pageField.nextSibling);
    else form.insertBefore(wrap, form.querySelector("[type='submit']") || null);
    Links().bindValidation(form);
    if (Prof() && !form.querySelector("[data-profile-edit]")) {
      var p = (S().draft && S().draft.profile) ? S().draft.profile : Prof().fromMember(m);
      var block = document.createElement("div");
      block.innerHTML = Prof().editFields(p);
      var submit = form.querySelector("[type='submit']");
      if (submit) form.insertBefore(block, submit);
      else form.appendChild(block);
      Prof().bindForm(form);
    }
  }

  function after(id) {
    if (id === "home") enhanceHome();
    if (id === "me") enhanceMe();
    if (id === "member") enhanceMemberDom();
    if (id === "reviews" || id === "reviews-back") enhanceReviewsDom();
    if (id === "invite") enhanceInviteDom();
    if (id === "ai-voice") enhanceVoiceDom();
    if (id === "rec-alert") enhanceAlertIdeasDom();
    if (id === "edit-profile" || id === "create-profile" || id === "create-profile-connected") enhanceEditDom();
    if (id === "members") {
      /* cards already enhanced via memberCard wrap */
    }
    var ta = document.getElementById("reviewDraft");
    if (ta && id === "review-ideas") {
      ta.addEventListener("input", function () { S().reviewDraft = ta.value; });
    }
  }

  function wrapCard(orig) {
    return function (m) {
      var html = orig(m);
      return enhanceCard(m, html);
    };
  }

  function aiLimitNote() {
    if (!R() || !R().atLimit("jack")) return;
    /* Patch upcoming AI log when asking to review Jack */
  }

  function install() {
    if (Prof() && T().MEMBERS) Prof().hydrate(T().MEMBERS);
    if (!window.TC12) return;
    var prevClick = TC12.handleClick;
    TC12.handleClick = function (e) {
      if (handle(e)) return true;
      return prevClick ? prevClick(e) : false;
    };
    var prevRender = TC12.render;
    TC12.render = function (id) {
      if (id === "review-ideas") return renderReviewIdeas();
      return prevRender ? prevRender(id) : null;
    };
    if (TC12.memberCard) TC12.memberCard = wrapCard(TC12.memberCard);
    var prevAfter = TC12.afterGo;
    TC12.afterGo = function (id) {
      if (prevAfter) prevAfter(id);
      after(id);
    };
    window.TC154 = {
      copyText: copyText,
      copyBtn: copyBtn,
      flashCopied: flashCopied,
      renderReviewIdeas: renderReviewIdeas,
      usedFor: usedFor,
      markUsed: markUsed
    };
  }

  install();
})();
