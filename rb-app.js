/* Rate Buddies v1.9.0 — wire the member app to Supabase. */
(function () {
  "use strict";
  function T() { return window.RateBuddies; }
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
        isMe: m.id === meId
      };
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
        hidden: v.hidden, archived: v.archived, sample: v.sample
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
    if (p.status === "pending") { go("pending"); return; }
    if (p.status === "rejected") { go("pending"); return; }
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
      await refresh();
      routeAfterLogin();
      toast("Signed in.");
    } catch (err) {
      toast((err && err.message) || "Could not sign in.");
    }
    return true;
  }

  async function onSignUp(draft, password) {
    if (RB.isDemo()) return false;
    try {
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
        toast("Check your email to confirm your account. For this test, accounts are already confirmed.");
      }
      if (T() && T().go) T().go("pending");
      toast("Thanks. Your profile is waiting for approval.");
    } catch (err) {
      toast((err && err.message) || "Could not create the account.");
    }
    return true;
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
        var pw = (form.querySelector('[name="password"]') && form.querySelector('[name="password"]').value) ||
          (window.__rbSignupPassword || "");
        if (!pw) {
          /* password was collected on the email step and stored */
        }
        var TC = T();
        var draft = TC && TC.state && TC.state.draft;
        if (draft && draft.email && pw) {
          e.preventDefault();
          e.stopImmediatePropagation();
          onSignUp(draft, pw);
        }
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
