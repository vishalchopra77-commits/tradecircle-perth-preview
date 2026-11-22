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
      TC.MEMBERS.push(row);
    });
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
    applyMembers(list.filter(function (m) { return m.status === "approved" || m.id === (RB.profile && RB.profile.id); }));
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
    if (p.status === "pending" || p.status === "rejected") {
      fillDraftFromProfile();
      go("pending");
      if (p.status === "pending") watchApproval();
      return;
    }
    if (!p.intro_watched) {
      if (T().state) T().state._forceIntro = true;
      go("intro-video");
      return;
    }
    go("home");
  }

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
      toast((err && err.message) || "Could not create the account.");
    } finally {
      signingUp = false;
    }
    return true;
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
  window.RBApp = { checkApproval: checkApproval, watchApproval: watchApproval, refresh: function () { return refresh(); } };

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
        if (p) window.__rbSignupPassword = p.value;
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

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 0);
  setTimeout(boot, 50);
})();
