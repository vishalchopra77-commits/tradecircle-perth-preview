/* Rate Buddies v1.9.0 — wire the member app to Supabase.
   v2.2.2 live: sign-up runs after the app's own checks land on Awaiting approval;
   the pending screen watches for approval (realtime + 20s check) and then moves on
   exactly like "Demo: simulate approval" (which stays in place). */
(function () {
  "use strict";
  function T() { return window.TradeCircle; }
  function toast(m) { if (T() && T().toast) T().toast(m); }
  function isNative() {
    try { return !!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform()); }
    catch (e) { return false; }
  }
  function isPreviewStudio() {
    if (isNative()) return false;
    if (/[?&]shot=/.test(location.search) || location.search.indexOf("mode=shot") >= 0) return false;
    return !!(document.querySelector(".chooser") && window.innerWidth > 480);
  }
  function isDesignShot() {
    var shot = "";
    try { shot = new URLSearchParams(location.search).get("shot") || ""; } catch (e) {}
    return !!(shot && shot !== "welcome");
  }

  function demoToggleHtml(where) {
    var on = window.RB && RB.isDemo();
    return '<label class="rb-demo-toggle"><input type="checkbox" data-action="rb-demo" ' +
      (on ? "checked" : "") + '> Demo (offline)</label>';
  }

  function applyMembers(list) {
    var TC = T();
    if (!TC || !TC.MEMBERS) return;
    var meId = RB.profile && RB.profile.id;
    TC.MEMBERS.splice(0, TC.MEMBERS.length);
    list.forEach(function (m) {
      /* b19: my own row comes from RB.profile (it has my private phone + email and the latest save);
         the members list leaves phone/email out, so Edit profile showed them blank and Save wiped them */
      if (m.id === meId && RB.profile) m = Object.assign({}, m, RB.profile);
      TC.MEMBERS.push(buildRow(m, meId));
    });
    finishApply(TC, list, meId);
  }
  function buildRow(m, meId) {
      var row = {
        id: m.id,
        first: m.first,
        last: m.last,
        business: m.business,
        trade: m.trade,
        regions: m.regions || [],
        bio: m.bio || "",
        phone: m.phone || "",
        facebook: m.facebook || "",
        page: m.page || "",
        links: m.links || {},
        profileUrl: m.profileUrl || "",
        recShare: m.recShare,
        color: m.color || "navy",
        isMe: m.id === meId,
        role: m.role || "member", /* v2.2.2 b16 QA #35/#40: lists and the name decorator leave admins out */
        status: m.status,
        /* v2.2.2 live: fields the profile + Reviews screens read */
        email: m.email || "",
        tagline: m.tagline || "",
        city: m.city || "Perth",
        availableForSwap: m.availableForSwap !== false,
        photo: ""
      };
      if (m.avatarPath && RB.client) {
        try { var pu = RB.client.storage.from("avatars").getPublicUrl(m.avatarPath); row.photo = (pu && pu.data && pu.data.publicUrl) || ""; } catch (eP) {}
      }
      if (!row.photo && m.extras && /^https:\/\//.test(m.extras.avatar_url || "")) row.photo = m.extras.avatar_url; /* v2.2.2b: Facebook photo */
      row.links = { facebook: m.facebook || "", google: m.googleBusinessUrl || "", website: (m.links && m.links.website) || "" };
      row.profile = {
        years: m.years != null ? String(m.years) : "",
        goal: m.goal || "",
        specialties: m.services || [],
        licences: m.licences ? String(m.licences).split("\n").filter(Boolean) : [],
        idealTrades: m.referralPartners || [],
        /* v2.2.2 live: rich fields kept in profiles.extras (migration 005) */
        about: (m.extras && m.extras.about) || "",
        idealNote: (m.extras && m.extras.idealNote) || "",
        serviceAreas: (m.extras && m.extras.serviceAreas) || [],
        gallery: (m.extras && m.extras.gallery) || [],
        goals: (m.extras && m.extras.goals) || []
      };
      row.abn = (m.extras && m.extras.abn) || "";
      return row;
  }
  /* b19: rebuild my own row from RB.profile right after a profile save, so Edit profile never shows stale/blank values */
  function refreshMe() {
    var TC = T(); if (!TC || !TC.MEMBERS || !RB.profile) return false;
    var meId = RB.profile.id, cur = TC.MEMBERS.filter(function (x) { return x.id === meId; })[0];
    var fresh = buildRow(Object.assign({}, cur ? {} : {}, RB.profile), meId);
    if (cur) { if (!fresh.photo && cur.photo) fresh.photo = cur.photo; Object.assign(cur, fresh); }
    else TC.MEMBERS.push(fresh);
    return true;
  }
  function finishApply(TC, list, meId) {
    if (TC.state) TC.state.meId = meId;
    if (window.TCDeviCity && Array.isArray(TCDeviCity.CIRCLE)) {
      TCDeviCity.CIRCLE.splice(0, TCDeviCity.CIRCLE.length);
      list.forEach(function (m) {
        if (m.status && m.status !== "approved" && m.id !== meId) return;
        TCDeviCity.CIRCLE.push({
          id: m.id, first: m.first, last: m.last, business: m.business,
          trade: m.trade, regions: m.regions || [], city: m.city || "Perth", areas: m.areas
        });
      });
    }
  }

  function applyRequests(rows, progress) {
    var TC = T();
    if (!TC || !TC.state) return;
    var byReq = {};
    (progress || []).forEach(function (p) {
      byReq[p.request_id] = byReq[p.request_id] || [];
      byReq[p.request_id].push(p.member_id);
    });
    TC.state._fbPosts = (rows || []).filter(function (r) { return r.status === "approved"; }).map(function (r) {
      var vouched = (byReq[r.id] || []).length;
      return {
        id: r.id,
        source: r.source || "devi",
        group: r.group_name,
        link: r.post_link,
        ask: r.ask || r.snippet,
        when: r.when_label || "",
        closes: r.closes_label || "",
        trade: r.trade,
        city: r.city,
        suburb: r.suburb,
        forId: r.featured_member_id,
        vouched: vouched,
        of: r.of_count || vouched,
        status: (byReq[r.id] || []).indexOf(RB.profile && RB.profile.id) >= 0 ? "done" : "new"
      };
    });
    TC.state._deviSeeded = true;
  }

  function applyTutorials(pack) {
    if (!window.TCTutorials || !pack) return;
    var data = TCTutorials.load();
    data.sections = (pack.sections || []).map(function (s) {
      return { id: s.id, title: s.title, order: s.sort_order, hidden: s.hidden };
    });
    data.videos = (pack.videos || []).map(function (v) {
      return {
        id: v.id, sectionId: v.section_id, url: v.url, provider: v.provider,
        videoId: v.video_id, thumb: v.thumb, embed: v.embed, title: v.title,
        description: v.description, duration: v.duration, order: v.sort_order,
        hidden: v.hidden, archived: v.archived, sample: v.sample,
        help: v.help_key || undefined
      };
    });
    if (pack.intro) {
      data.intro = {
        id: "intro-1",
        url: pack.intro.url, provider: pack.intro.provider, videoId: pack.intro.video_id,
        thumb: pack.intro.thumb, embed: pack.intro.embed, title: pack.intro.title,
        description: pack.intro.description, duration: pack.intro.duration,
        durationSec: pack.intro.duration_sec, sample: pack.intro.sample
      };
      data.requireIntro = pack.intro.require_intro;
      data.minWatchedPct = pack.intro.min_watched_pct;
    }
    data.previousIntros = pack.previousIntros || [];
    TCTutorials.save(data);
    if (RB.profile) {
      var map = TCTutorials.loadIntroWatched();
      map[RB.profile.id] = !!RB.profile.intro_watched;
      if (TCTutorials.saveIntroWatched) TCTutorials.saveIntroWatched(map);
      else try { localStorage.setItem("rb_intro_watched_v181", JSON.stringify(map)); } catch (e) {}
    }
  }

  async function refresh() {
    if (!RB.session || RB.isDemo()) return;
    var list = await RB.listProfiles();
    applyMembers(list.filter(function (m) { return (m.status === "approved" && !m.archivedAt) || m.id === (RB.profile && RB.profile.id); }));
    var reqs = await RB.listRequests();
    var prog = await RB.listProgress();
    applyRequests(reqs, prog);
    try { applyTutorials(await RB.listTutorials()); } catch (e) {}
    await RB.loadProfile();
  }

  function routeAfterLogin() {
    var p = RB.profile;
    var go = T() && T().go;
    if (!go) return;
    if (!p) { go("signin"); return; }
    if (p.status === "suspended" || p.archivedAt) { /* v2.2.2 b16 QA #1: suspended members are signed out and told why */
      if (window.TC222i && TC222i.suspended) TC222i.suspended(p);
      else { try { RB.logout(); } catch (e) {} go("signin"); }
      return;
    }
    if (p.status === "pending" || p.status === "rejected") {
      fillDraftFromProfile();
      go("pending");
      if (p.status === "pending") watchApproval();
      return;
    }
    /* v2.2.2 b16 QA #15: "Complete your profile" is remembered in profiles.extras.profile_step (done / skipped),
       so a member approved while the app was closed still gets the step after the intro. */
    var ex = p.extras || {};
    var stepDone = !!ex.profile_step || !!(p.tagline || ex.about || p.goal || (p.services && p.services.length));
    if (!stepDone && T().state) {
      var st = T().state; st.onboarding = st.onboarding || { fill: {} };
      st.onboarding.fresh = true; st.onboarding.forceComplete = true; st.onboarding.skipped = false; st.onboarding.done = false;
      st.onboarding.fill = st.onboarding.fill || {};
    }
    if (!p.intro_watched) {
      if (T().state) T().state._forceIntro = true;
      go("intro-video");
      return;
    }
    if (!stepDone) { go("complete-profile"); return; }
    go("home");
  }
  async function saveProfileStep(val) {
    try {
      if (!RB.session || RB.isDemo() || !RB.profile) return;
      var fresh = await RB.client.from("profiles").select("extras").eq("id", RB.profile.id).maybeSingle();
      var ex = Object.assign({}, (fresh.data && fresh.data.extras) || {}, { profile_step: val });
      await RB.client.from("profiles").update({ extras: ex }).eq("id", RB.profile.id);
      if (RB.profile.extras) RB.profile.extras.profile_step = val;
    } catch (e) { console.warn("RB profile step", e); }
  }
  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest && e.target.closest("[data-action='skip-complete'], [data-action='save-complete']");
    if (!b) return;
    var val = b.getAttribute("data-action") === "skip-complete" ? "skipped" : "done";
    if (!RB.session || RB.isDemo()) return;
    setTimeout(function () { if (T() && T().state) T().state.draft = null; }, 0); /* the complete-profile step left an empty draft (no areas) behind for Edit profile */
    setTimeout(function () { saveProfileStep(val); }, 2000); /* after rb-live's own save-complete write of extras */
  }, true);

  async function onSignIn(form) {
    var fd = new FormData(form);
    var email = String(fd.get("email") || "").trim();
    var password = String(fd.get("password") || "");
    if (RB.isDemo()) return false;
    try {
      await RB.login(email, password);
      try { await applySavedSignupPatch(); } catch (e) {}
      await refresh();
      routeAfterLogin();
      toast("Signed in.");
    } catch (err) {
      toast((err && err.message) || "Could not sign in.");
    }
    return true;
  }

  var signingUp = false;
  var PATCH_KEY = "rb_signup_patch";
  async function onSignUp(draft, password) {
    if (RB.isDemo() || signingUp) return false;
    signingUp = true;
    try {
      try { localStorage.setItem(PATCH_KEY, JSON.stringify({ email: draft.email, regions: draft.regions || [], phone: draft.phone || "", abn: draft.abn || "" })); } catch (e) {}
      var res = await RB.signup({
        email: draft.email,
        password: password,
        first: draft.first,
        last: draft.last,
        business: draft.business,
        trade: draft.trade,
        phone: draft.phone,
        regions: draft.regions || []
      });
      if (T() && T().state) T().state._rbSignupError = "";
      if (res.needsConfirm) {
        toast("Account created. Check your email and tap the link to confirm, then sign in.");
      } else {
        try { localStorage.removeItem(PATCH_KEY); } catch (e) {}
        /* v2.2.2: ABN lives in profiles.extras */
        if (draft.abn && RB.session && RB.client) {
          try { await RB.client.from("profiles").update({ extras: { abn: String(draft.abn).trim() } }).eq("id", RB.session.user.id); } catch (eA) {}
        }
        toast("Thanks. Your profile is waiting for approval.");
        watchApproval();
      }
      window.__rbSignupPassword = "";
    } catch (err) {
      /* v2.2.2b: never leave a failed sign-up looking like "Awaiting approval" */
      var msg = (err && err.message) || "Could not create the account.";
      if (/at least 6 characters/i.test(msg)) msg = "Your password is too short. Use at least 8 characters.";
      if (T() && T().state) T().state._rbSignupError = msg;
      window.__rbSignupPassword = "";
      toast("Your account was not created: " + msg);
    } finally {
      signingUp = false;
      if (onScreen("pending") && T().go) T().go("pending", { replace: true });
    }
    return true;
  }
  /* v2.2.2b: phone / Facebook sign-up routes (prototype screens) still need an email + password for the live account */
  function finishCardHtml() {
    var st = (T() && T().state) || {}, d = st.draft || {};
    if (RB.isDemo() || isPreviewStudio() || isDesignShot()) return "";
    if (RB.session) return '<div class="rb-finish ok" role="status"><strong>Account created.</strong> Your profile is with the admin now. This screen moves on by itself when you are approved.</div>';
    if (signingUp) return '<div class="rb-finish" role="status"><strong>Creating your account…</strong></div>';
    var err = st._rbSignupError ? '<p class="rb-finish-err" role="alert">Your account was not created: ' + esc(st._rbSignupError) + "</p>" : "";
    var lead = st._rbSignupError ? "Fix it below and tap Create my account." : "One more step: add the email and password you will sign in with.";
    return '<form class="rb-finish' + (st._rbSignupError ? " bad" : "") + '" data-form="rb-finish-account">' + err +
      '<p class="rb-finish-lead">' + lead + "</p>" +
      '<div class="field"><label>Email</label><input type="email" name="email" required autocomplete="email" value="' + esc(d.email || "") + '" placeholder="you@example.com"></div>' +
      '<div class="field"><label>Password</label><input type="password" name="password" required minlength="8" autocomplete="new-password" placeholder="At least 8 characters"></div>' +
      '<button class="btn btn-primary" type="submit">Create my account</button></form>';
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function finishCss() {
    if (document.getElementById("rb-finish-css")) return;
    var st = document.createElement("style"); st.id = "rb-finish-css";
    st.textContent = ".rb-finish{margin:0 0 14px;padding:14px;border:1px solid #D7DEEA;border-radius:16px;background:#fff;color:#0F172A;font-size:15px;line-height:1.45}.rb-finish.ok{border-color:#16A34A;background:#F0FDF4}.rb-finish.bad{border-color:#DC2626;background:#FEF2F2}.rb-finish-err{margin:0 0 6px;color:#991B1B;font-weight:600}.rb-finish-lead{margin:0 0 10px;color:#1E293B}.rb-finish .btn{margin-top:8px;width:100%}";
    document.head.appendChild(st);
  }

  /* After the first real sign-in, apply sign-up details that could not be saved
     before the email was confirmed (regions, phone). */
  async function applySavedSignupPatch() {
    var raw = null;
    try { raw = JSON.parse(localStorage.getItem(PATCH_KEY) || "null"); } catch (e) {}
    if (!raw || !RB.session || !RB.client) return;
    if (String(raw.email || "").toLowerCase() !== String(RB.session.user.email || "").toLowerCase()) return;
    var patch = {};
    if (raw.regions && raw.regions.length) patch.regions = raw.regions;
    if (raw.phone) patch.phone = raw.phone;
    if (raw.abn) patch.extras = Object.assign({}, (RB.profile && RB.profile.extras) || {}, { abn: raw.abn });
    if (Object.keys(patch).length) {
      var r = await RB.client.from("profiles").update(patch).eq("id", RB.session.user.id);
      if (r.error) return;
    }
    try { localStorage.removeItem(PATCH_KEY); } catch (e) {}
  }

  /* Pending members: move on as soon as an admin approves (realtime, plus a 20s check). */
  var approvalTimer = null, approvalListening = false;
  function onScreen(id) { return !!(T() && T().state && T().state.screen === id); }
  function fillDraftFromProfile() {
    var p = RB.profile, TC = T();
    if (!p || !TC || !TC.state) return;
    var d = TC.state.draft || {};
    if (!d.first) d.first = p.first; if (!d.last) d.last = p.last;
    if (!d.business) d.business = p.business; if (!d.trade) d.trade = p.trade;
    TC.state.draft = d;
  }
  function moveOnApproved() {
    var TC = T();
    if (!TC || !TC.state) return;
    var st = TC.state;
    st.onboarding = st.onboarding || {};
    st.onboarding.forceComplete = true;
    st.onboarding.skipped = false;
    st.onboarding.done = false;
    if (window.TC158 && TC158.onApproved) TC158.onApproved();
    /* b19: approved while waiting on the Pending screen: the intro video must still come first (it was skipped until an app restart) */
    if (RB.profile && !RB.profile.intro_watched) {
      st._forceIntro = true;
      if (TC.go) TC.go("intro-video");
      toast("You're approved. Please watch the short intro first.");
      return;
    }
    if (TC.go) TC.go("complete-profile");
    toast("You're approved. Next, finish a few profile details, or skip for now.");
  }
  async function checkApproval() {
    if (RB.isDemo() || !RB.session) return;
    var before = RB.profile && RB.profile.status;
    try { await RB.loadProfile(); } catch (e) { return; }
    var now = RB.profile && RB.profile.status;
    if (now === "approved") {
      if (approvalTimer) { clearInterval(approvalTimer); approvalTimer = null; }
      if (before !== "approved" || onScreen("pending")) {
        try { await refresh(); } catch (e) {}
        if (onScreen("pending")) moveOnApproved();
      }
    }
  }
  function watchApproval() {
    if (RB.isDemo() || !RB.session) return;
    if (!approvalListening && RB.profile) {
      approvalListening = true;
      RB.listen("profiles", function () { checkApproval(); }, "id=eq." + RB.profile.id);
      RB.listen("notifications", function () { checkApproval(); }, "member_id=eq." + RB.profile.id);
    }
    if (!approvalTimer) approvalTimer = setInterval(checkApproval, 20000);
  }
  window.RBApp = { refreshMe: refreshMe, checkApproval: checkApproval, watchApproval: watchApproval, refresh: function () { return refresh(); }, route: function () { return routeAfterLogin(); } };

  /* Run sign-up only once the app's own checks have passed and it shows Awaiting approval. */
  function afterCreateStep() {
    setTimeout(function () {
      if (RB.isDemo() || RB.session || !onScreen("pending")) return;
      var TC = T();
      var draft = TC && TC.state && TC.state.draft;
      var pw = window.__rbSignupPassword || "";
      if (draft && draft.email && pw) onSignUp(draft, pw);
    }, 0);
  }

  function hookForms() {
    document.addEventListener("submit", function (e) {
      var form = e.target;
      if (!form || !form.getAttribute) return;
      var type = form.getAttribute("data-form");
      if (type === "signin" && !RB.isDemo()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        onSignIn(form);
      }
      if ((type === "create-profile" || type === "signup-business") && !RB.isDemo()) {
        /* let the app validate + navigate first; sign up only if it reached Awaiting approval */
        afterCreateStep();
      }
      if (type === "signup" || type === "signup-email") {
        var p = form.querySelector('[name="password"]');
        if (p && !RB.isDemo() && String(p.value || "").length < 8) {
          e.preventDefault(); e.stopImmediatePropagation();
          p.classList.add("invalid");
          toast("Use at least 8 characters for your password.");
          try { p.focus(); } catch (eF) {}
          return;
        }
        if (p) window.__rbSignupPassword = p.value;
        if (T() && T().state) T().state._rbSignupError = "";
      }
      if (type === "rb-finish-account") {
        e.preventDefault(); e.stopImmediatePropagation();
        var em = String((form.querySelector('[name="email"]') || {}).value || "").trim();
        var pw2 = String((form.querySelector('[name="password"]') || {}).value || "");
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { toast("Enter a valid email."); return; }
        if (pw2.length < 8) { toast("Use at least 8 characters for your password."); return; }
        var TCf = T(), dr = (TCf && TCf.state && TCf.state.draft) || {};
        dr.email = em; if (TCf && TCf.state) { TCf.state.draft = dr; TCf.state._rbSignupError = ""; }
        window.__rbSignupPassword = pw2;
        onSignUp(dr, pw2);
        if (TCf && TCf.go) TCf.go("pending", { replace: true });
      }
    }, true);

    document.addEventListener("change", function (e) {
      if (e.target && e.target.getAttribute("data-action") === "rb-demo") {
        RB.setDemo(e.target.checked);
        toast(e.target.checked ? "Demo (offline) on. The app uses local sample data." : "Live mode. Sign in to use the shared test data.");
      }
    });

    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest("[data-action]");
      if (btn && btn.getAttribute("data-action") === "simulate-approval" && !RB.isDemo() && RB.session && RB.profile && RB.profile.status !== "approved") {
        e.preventDefault(); e.stopImmediatePropagation();
        toast("Live test: approve this account in the web admin. This screen moves on by itself.");
        return;
      }
      if (btn && btn.getAttribute("data-action") === "finish-create" && !RB.isDemo() && !RB.session) {
        afterCreateStep();
        return;
      }
      if (!btn || RB.isDemo() || !RB.session) return;
      var act = btn.getAttribute("data-action");
      var id = btn.getAttribute("data-id");
      if (act === "done-rec" && id) {
        RB.markRecommended(id).then(function () { return refresh(); }).catch(function (err) { toast(err.message || "Could not save."); });
      }
      if (act === "intro-finished" || act === "intro-continue" || act === "intro-to-tutorials") {
        RB.markIntroWatched().catch(function () {});
      }
    }, true);
  }

  function patchAuthScreens() {
    if (!window.TC12 || !TC12.render || TC12._rbDemoPatch) return;
    var prev = TC12.render;
    TC12.render = function (id) {
      var html = prev.apply(this, arguments);
      if (!html) return html;
      if (id === "signin" || id === "welcome") {
        if (html.indexOf("rb-demo-toggle") === -1) {
          html = html.replace("</form>", "</form>" + demoToggleHtml());
          if (id === "welcome" && html.indexOf("rb-demo-toggle") === -1) {
            html = html.replace("Sign in</span></button>", "Sign in</span></button>" + demoToggleHtml());
          }
        }
        html = html.replace('value="jamie@halepest.demo"', 'value=""');
        html = html.replace('value="demopass"', 'value=""');
        html = html.replace("This is a prototype — tap Sign in to continue as Jamie Hale.",
          "Sign in with your Rate Buddies test account. Turn on Demo (offline) to browse the old sample screens.");
      }
      return html;
    };
    TC12._rbDemoPatch = 1;
  }

  async function boot() {
    if (!window.RB) return;
    RB.init();
    hookForms();
    patchAuthScreens();
    if (RB.isDemo()) return;
    try {
      var sess = await RB.getSession();
      if (sess) {
        await RB.loadProfile();
        await refresh();
        RB.listen("profiles", function () { refresh(); });
        RB.listen("recommendation_requests", function () { refresh(); });
        RB.listen("rec_progress", function () { refresh(); });
        RB.listen("notifications", function () { refresh(); });
        if (!isPreviewStudio()) routeAfterLogin();
      } else if (!isPreviewStudio() && !isDesignShot()) {
        if (T() && T().go && T().state && T().state.screen && T().state.screen !== "welcome" && T().state.screen !== "signin" && T().state.screen !== "signup") {
          T().go("welcome");
        }
      }
    } catch (err) {
      console.warn("RB boot", err);
    }
  }

  /* v2.2.2b: account status card on Awaiting approval (inserted into whatever renders that screen) */
  var lastCard = "";
  setInterval(function () {
    var sc = document.querySelector('[data-screen="pending"]');
    if (!sc || !onScreen("pending")) { lastCard = ""; return; }
    var html = finishCardHtml(), host = sc.querySelector(".scroll") || sc, cur = host.querySelector(".rb-finish");
    if (cur && document.activeElement && cur.contains(document.activeElement)) return; /* member is typing */
    if (html === lastCard && cur) return;
    lastCard = html;
    if (cur) cur.remove();
    if (!html) return;
    finishCss();
    host.insertAdjacentHTML("afterbegin", html);
  }, 400);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 0);
  setTimeout(boot, 50);
})();
