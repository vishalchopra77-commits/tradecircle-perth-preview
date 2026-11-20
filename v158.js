/* TradeCircle Perth v1.5.8 — complete-profile, demo signup, finish-profile card */
(function (root) {
  "use strict";

  var SPEC_CHIPS = ["Pest Control", "Termite inspections", "General pests", "Rodent control", "Commercial", "Residential", "Emergency call-outs", "Pre-purchase inspections"];
  var IDEAL_CHIPS = ["Plumber", "Electrician", "Builder", "Carpenter", "Roofer", "Painter", "Landscaper", "Air conditioning", "Tiler", "Handyman"];

  function T() { return root.TradeCircle || {}; }
  function state() { return T().state || {}; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }
  function toast(msg) { if (T().toast) T().toast(msg); }
  function go(id) { if (T().go) T().go(id); }

  function ensureOnboarding() {
    var s = state();
    if (!s.onboarding) s.onboarding = { fresh: false, forceComplete: false, skipped: false, done: false, fill: {} };
    if (!s.onboarding.fill) s.onboarding.fill = {};
    return s.onboarding;
  }

  function fillOf() {
    var o = ensureOnboarding();
    var f = o.fill || {};
    if (!f.links) f.links = (root.TCLinks && TCLinks.empty) ? TCLinks.empty() : {};
    if (!f.specialties) f.specialties = [];
    if (!f.idealTrades) f.idealTrades = [];
    o.fill = f;
    return f;
  }

  function list(v) {
    if (Array.isArray(v)) return v.filter(Boolean);
    return String(v || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean);
  }

  function completeness(fill) {
    fill = fill || fillOf();
    var links = fill.links || {};
    var hasLink = Object.keys(links).some(function (k) {
      return k !== "other" && String(links[k] || "").trim();
    });
    var bins = [
      hasLink,
      !!(fill.bio || "").trim(),
      !!(fill.tagline || "").trim(),
      !!(fill.goal || "").trim(),
      !!(fill.about || "").trim(),
      list(fill.specialties).length > 0,
      list(fill.idealTrades).length > 0 || !!(fill.idealNote || "").trim()
    ];
    var n = bins.filter(Boolean).length;
    return { n: n, total: 7, pct: Math.round((n / 7) * 100) };
  }

  function shouldShowFinish() {
    var o = state().onboarding;
    if (!o || o.forceComplete) return false;
    if (o.skipped) return true;
    if (o.done && completeness(o.fill).pct >= 100) return false;
    if (o.done || o.fresh) return completeness(o.fill).pct < 100;
    return false;
  }

  function platforms() {
    var all = (root.TCLinks && TCLinks.PLATFORMS) ? TCLinks.PLATFORMS : [];
    return all.filter(function (p) { return p.id !== "other"; });
  }

  function linkFields(links) {
    links = links || {};
    return '<p class="group-label">Social profile links <span class="opt">(optional)</span></p>' +
      '<p class="hint" style="margin-top:0">Add a website or social page. Only the ones you fill in will show on your profile.</p>' +
      platforms().map(function (p) {
        return '<div class="field link-field"><label><span class="link-field-ico" style="background:' + p.color + '">' + p.icon + "</span>" + esc(p.label) + "</label>" +
          '<input name="link-' + p.id + '" inputmode="url" type="url" placeholder="' + esc(p.placeholder) + '" value="' + esc(links[p.id] || "") + '" data-link-id="' + p.id + '" autocomplete="off">' +
          '<p class="link-error" hidden></p></div>';
      }).join("");
  }

  function counted(label, name, value, max, rows, hint) {
    value = value || "";
    return '<div class="field"><label>' + esc(label) + ' <span class="cp-count" data-count-for="' + name + '">' + String(value).length + " / " + max + "</span></label>" +
      (rows && rows > 1
        ? '<textarea name="' + name + '" rows="' + rows + '" maxlength="' + (max + 40) + '" data-max="' + max + '">' + esc(value) + "</textarea>"
        : '<input name="' + name + '" value="' + esc(value) + '" maxlength="' + (max + 20) + '" data-max="' + max + '">') +
      (hint ? '<p class="hint">' + hint + "</p>" : "") +
      "</div>";
  }

  function chips(name, hiddenName, options, selected) {
    selected = selected || [];
    return '<div class="chip-row">' + options.map(function (c) {
      var on = selected.indexOf(c) !== -1;
      return '<button type="button" class="chip' + (on ? " active" : "") + '" data-profile-chip="' + name + '">' + esc(c) + "</button>";
    }).join("") + "</div>" +
      '<input type="hidden" name="' + hiddenName + '" value="' + esc(selected.join(", ")) + '">';
  }

  function renderComplete() {
    var fill = fillOf();
    var c = completeness(fill);
    var specs = list(fill.specialties);
    var ideals = list(fill.idealTrades);
    return '<section class="screen has-header" data-screen="complete-profile">' +
      '<div class="app-header"><span class="header-spacer"></span><div class="ht">Complete your profile</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="cp-hero"><h2>Tell members a bit about you</h2>' +
      '<p>Your account is approved. Add a short profile now, or skip and finish it later. You can always edit this later.</p></div>' +
      '<div class="cp-progress" data-cp-progress><div class="bar"><i style="width:' + c.pct + '%"></i></div>' +
      '<div class="lab">' + c.pct + "% complete · " + c.n + " of " + c.total + " sections</div></div>" +
      '<form data-form="complete-profile">' +
      linkFields(fill.links) +
      counted("A short sentence", "tagline", fill.tagline, 80, 1, "A one-line headline that sits at the top of your profile.") +
      counted("Short bio", "bio", fill.bio, 280, 3, "A few sentences about who you are.") +
      counted("My goal", "profileGoal", fill.goal, 140, 2, "What you hope to get from the circle.") +
      counted("About my business", "profileAbout", fill.about, 400, 4, "") +
      '<p class="group-label">Expertise</p><p class="hint" style="margin-top:0">Pick the work you are known for.</p>' +
      chips("specialties", "profileSpecialties", SPEC_CHIPS, specs) +
      '<p class="group-label">My ideal referral partner</p><p class="hint" style="margin-top:0">Who would you most like to swap work with?</p>' +
      chips("idealTrades", "profileIdealTrades", IDEAL_CHIPS, ideals) +
      counted("A short note", "profileIdealNote", fill.idealNote, 160, 2, "Optional. One sentence is enough.") +
      "</form></div>" +
      '<div class="cp-sticky">' +
      '<button type="button" class="btn btn-ghost ink" data-action="skip-complete">Skip for now</button>' +
      '<button type="button" class="btn btn-primary" data-action="save-complete">Save</button>' +
      "</div></section>";
  }

  function collectFill(form) {
    var fill = fillOf();
    if (!form) return fill;
    if (root.TCLinks && TCLinks.collect) fill.links = TCLinks.collect(form, fill.links);
    fill.tagline = (form.querySelector("[name='tagline']") || {}).value || "";
    fill.bio = (form.querySelector("[name='bio']") || {}).value || "";
    fill.goal = (form.querySelector("[name='profileGoal']") || {}).value || "";
    fill.about = (form.querySelector("[name='profileAbout']") || {}).value || "";
    fill.specialties = list((form.querySelector("[name='profileSpecialties']") || {}).value);
    fill.idealTrades = list((form.querySelector("[name='profileIdealTrades']") || {}).value);
    fill.idealNote = (form.querySelector("[name='profileIdealNote']") || {}).value || "";
    ["tagline", "bio", "goal", "about", "idealNote"].forEach(function (k) {
      fill[k] = String(fill[k] || "").trim();
    });
    return fill;
  }

  function linksOk(form) {
    if (!form || !root.TCLinks) return true;
    var ok = true;
    form.querySelectorAll("[data-link-id]").forEach(function (inp) {
      var id = inp.getAttribute("data-link-id");
      var p = platforms().filter(function (x) { return x.id === id; })[0];
      var v = TCLinks.isValid(inp.value, p);
      var err = inp.parentNode.querySelector(".link-error");
      if (!inp.value.trim() || v.ok) {
        if (err) err.hidden = true;
        inp.classList.remove("invalid");
      } else {
        ok = false;
        if (err) { err.hidden = false; err.textContent = v.msg; }
        inp.classList.add("invalid");
      }
    });
    return ok;
  }

  function refreshProgress(form) {
    var wrap = document.querySelector("[data-cp-progress]");
    if (!wrap) return;
    var fill = collectFill(form);
    var c = completeness(fill);
    var bar = wrap.querySelector(".bar > i");
    var lab = wrap.querySelector(".lab");
    if (bar) bar.style.width = c.pct + "%";
    if (lab) lab.textContent = c.pct + "% complete · " + c.n + " of " + c.total + " sections";
  }

  function bindComplete(rootEl) {
    var form = rootEl.querySelector("form[data-form='complete-profile']");
    if (!form) return;
    if (root.TCProfile && TCProfile.bindForm) TCProfile.bindForm(form);
    if (root.TCLinks && TCLinks.bindValidation) TCLinks.bindValidation(form);
    form.addEventListener("input", function (e) {
      var el = e.target;
      var max = el.getAttribute && el.getAttribute("data-max");
      if (max) {
        var lab = form.querySelector('[data-count-for="' + el.getAttribute("name") + '"]');
        var n = String(el.value || "").length;
        if (lab) {
          lab.textContent = n + " / " + max;
          lab.classList.toggle("over", n > Number(max));
        }
      }
      refreshProgress(form);
    });
    form.addEventListener("click", function () { setTimeout(function () { refreshProgress(form); }, 0); });
  }

  function saveComplete() {
    var form = document.querySelector("form[data-form='complete-profile']");
    if (form && !linksOk(form)) {
      toast("Check the highlighted links, or leave them blank.");
      return;
    }
    var o = ensureOnboarding();
    o.fill = collectFill(form);
    o.done = true;
    o.skipped = completeness(o.fill).pct < 100 ? o.skipped : false;
    if (completeness(o.fill).pct >= 100) o.skipped = false;
    o.forceComplete = false;
    toast(completeness(o.fill).pct >= 100 ? "Profile saved." : "Saved. You can finish the rest later.");
    go("home");
  }

  function skipComplete() {
    var form = document.querySelector("form[data-form='complete-profile']");
    var o = ensureOnboarding();
    if (form) o.fill = collectFill(form);
    o.skipped = true;
    o.forceComplete = false;
    o.done = false;
    toast("No problem — you can finish this later.");
    go("home");
  }

  function startDemoSignup() {
    var s = state();
    s.onboarding = { fresh: true, forceComplete: false, skipped: false, done: false, fill: {} };
    s.signupMethod = "";
    s.otpSent = false;
    s.fbConnected = false;
    s.draft = { first: "", last: "", business: "", trade: "", regions: [], phone: "", abn: "", email: "", facebook: "", tagline: "" };
    s.pendingNote = "";
    toast("Demo: starting a new member sign-up.");
    go("signup");
  }

  function onApproved() {
    var o = ensureOnboarding();
    o.forceComplete = true;
    o.skipped = false;
    o.done = false;
    if (!o.fill) o.fill = {};
  }

  function finishCard() {
    var c = completeness(fillOf());
    var r = 22, circ = 2 * Math.PI * r;
    var dash = circ * (c.pct / 100);
    return '<div class="finish-card" data-finish-card="1">' +
      '<svg class="ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="' + r + '" fill="none" stroke="#E4EAF0" stroke-width="4"/>' +
      '<circle cx="24" cy="24" r="' + r + '" fill="none" stroke="#1A5FD4" stroke-width="4" stroke-linecap="round" transform="rotate(-90 24 24)" stroke-dasharray="' + dash + " " + circ + '"/>' +
      '<text x="24" y="28" text-anchor="middle" font-size="11" font-weight="800" fill="#0D3F9C">' + c.pct + "%</text></svg>" +
      "<div style=\"flex:1;min-width:0\"><h3>Finish your profile</h3>" +
      "<p>" + c.pct + "% complete. Add a short bio, your goal and social links so other members can get to know you.</p>" +
      '<button type="button" class="btn btn-primary" data-go="complete-profile">Continue</button></div></div>';
  }

  function injectFinish(id) {
    if (!shouldShowFinish()) return;
    if (document.querySelector("[data-finish-card]")) return;
    var scroll = document.querySelector(".screen.active .scroll") || document.querySelector(".screen .scroll");
    if (!scroll) return;
    var wrap = document.createElement("div");
    wrap.innerHTML = finishCard();
    var card = wrap.firstChild;
    if (id === "home") {
      var hello = scroll.querySelector(".dash-hello, .home-hello, .greeting");
      if (hello && hello.parentNode) hello.parentNode.insertBefore(card, hello.nextSibling);
      else scroll.insertBefore(card, scroll.firstChild);
    } else if (id === "me") {
      var hero = scroll.querySelector(".profile-hero");
      if (hero && hero.parentNode) hero.parentNode.insertBefore(card, hero.nextSibling);
      else scroll.insertBefore(card, scroll.firstChild);
    }
  }

  function injectSettings() {
    var screen = document.querySelector(".screen[data-screen='settings'] .scroll, .screen.active .scroll");
    if (!screen || screen.querySelector("[data-action='demo-signup']")) return;
    var html = '<p class="group-label">Prototype</p><div class="card group">' +
      '<button class="set-row demo-signup" type="button" data-action="demo-signup"><span class="ic">+</span><span class="lab"><span class="a">Demo: new member sign-up</span><span class="b">Walk through the basic sign-up, approval and complete-profile steps</span></span><span class="chev">›</span></button></div>';
    var signout = screen.querySelector("button[data-go='welcome']");
    if (signout) signout.insertAdjacentHTML("beforebegin", html);
    else {
      var foot = screen.querySelector(".settings-foot");
      if (foot) foot.insertAdjacentHTML("beforebegin", html);
      else screen.insertAdjacentHTML("beforeend", html);
    }
  }

  function injectDrawer() {
    var nav = document.querySelector(".drawer-nav");
    if (!nav || nav.querySelector("[data-action='demo-signup']")) return;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "drawer-item";
    b.setAttribute("data-action", "demo-signup");
    b.innerHTML = "<span class=\"ic\">+</span><span>Demo: new member sign-up</span>";
    var settings = nav.querySelector('[data-go="settings"]');
    nav.insertBefore(b, settings || null);
  }

  function injectMore() {
    if (document.querySelector("[data-action='demo-signup']")) return;
    var scroll = document.querySelector(".screen[data-screen='more'] .scroll");
    if (!scroll) return;
    var sec = document.createElement("div");
    sec.className = "apps-section";
    sec.innerHTML = '<h3>Prototype</h3><div class="apps-grid">' +
      '<button type="button" class="apps-tile more-demo-tile" data-action="demo-signup"><span class="apps-ico steel">+</span><span>Demo sign-up</span></button></div>';
    scroll.appendChild(sec);
  }

  function wrapGo() {
    var TC = T();
    if (!TC.go || TC.go._tc158) return;
    var orig = TC.go;
    function wrapped(id, opts) {
      var o = state().onboarding;
      if (o && o.forceComplete && !o.skipped && !o.done) {
        if (id === "home" || id === "me" || id === "members" || id === "reviews" || id === "more") id = "complete-profile";
      }
      return orig.call(TC, id, opts);
    }
    wrapped._tc158 = true;
    TC.go = wrapped;
  }

  function hookAfterGo() {
    if (!root.TC12) root.TC12 = {};
    var prev = TC12.afterGo;
    TC12.afterGo = function (id) {
      if (typeof prev === "function") prev(id);
      if (id === "complete-profile") bindComplete(document);
      if (id === "settings") injectSettings();
      if (id === "more") injectMore();
      if (id === "home" || id === "me") injectFinish(id);
      injectDrawer();
    };
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-action='demo-signup']")) {
      e.preventDefault();
      startDemoSignup();
      return;
    }
    if (e.target.closest("[data-action='skip-complete']")) {
      e.preventDefault();
      skipComplete();
      return;
    }
    if (e.target.closest("[data-action='save-complete']")) {
      e.preventDefault();
      saveComplete();
    }
  });

  wrapGo();
  hookAfterGo();
  root.TC158 = {
    renderComplete: renderComplete,
    startDemoSignup: startDemoSignup,
    onApproved: onApproved,
    completeness: completeness,
    shouldShowFinish: shouldShowFinish,
    fillOf: fillOf
  };
  if (T().state && T().state.screen && T().go) T().go(T().state.screen);
})(window);
