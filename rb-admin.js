/* Rate Buddies v1.9.0 — wire the web admin to Supabase. */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }

  function showError(msg) {
    var el = $("loginForm") && $("loginForm").querySelector(".rb-login-error");
    if (!el && $("loginForm")) {
      el = document.createElement("p");
      el.className = "rb-login-error";
      el.style.cssText = "color:#B42318;font-weight:700;font-size:13px;margin:8px 0 0";
      $("loginForm").appendChild(el);
    }
    if (el) el.textContent = msg || "";
  }

  function fmtWhen(iso) {
    if (!iso) return "";
    try {
      var d = new Date(iso);
      return d.toLocaleString("en-AU", { timeZone: "Australia/Perth", hour: "numeric", minute: "2-digit", day: "numeric", month: "short" });
    } catch (e) { return iso; }
  }

  async function hydrate() {
    if (!window.TCAdmin || !RB.session) return;
    var profiles = await RB.listProfiles();
    var pending = profiles.filter(function (p) { return p.status === "pending" || p.status === "rejected"; });
    var active = profiles.filter(function (p) { return p.role !== "admin"; });
    if (TCAdmin.requests) {
      TCAdmin.requests.splice(0, TCAdmin.requests.length);
      pending.forEach(function (p) {
        TCAdmin.requests.push({
          id: p.id,
          first: p.first,
          last: p.last,
          business: p.business,
          trade: p.trade,
          areas: p.areas,
          phone: p.phone,
          status: p.status === "rejected" ? "declined" : p.status,
          when: fmtWhen(p.created_at) || "Just now",
          bio: p.bio
        });
      });
    }
    if (TCAdmin.members) {
      TCAdmin.members.splice(0, TCAdmin.members.length);
      active.filter(function (p) { return p.status === "approved" || p.status === "pending" || p.status === "rejected"; }).forEach(function (p) {
        TCAdmin.members.push({
          id: p.id,
          name: p.name,
          business: p.business,
          trade: p.trade,
          areas: p.areas,
          status: p.status === "approved" ? "active" : p.status,
          joined: "",
          website: (p.links && p.links.website) || "",
          facebook: p.page || p.facebook || ""
        });
      });
    }
    var reqs = await RB.listRequests();
    window.__rbRequests = reqs;
    if (window.TCDeviCity && Array.isArray(TCDeviCity.CIRCLE)) {
      TCDeviCity.CIRCLE.splice(0, TCDeviCity.CIRCLE.length);
      profiles.filter(function (m) { return m.status === "approved"; }).forEach(function (m) {
        TCDeviCity.CIRCLE.push({
          id: m.id, first: m.first, last: m.last, business: m.business,
          trade: m.trade, regions: m.regions || [], city: m.city || "Perth", areas: m.areas
        });
      });
    }
    if (window.TC180Admin && Array.isArray(TC180Admin.inbox)) {
      TC180Admin.inbox.splice(0, TC180Admin.inbox.length);
      reqs.forEach(function (r) {
        TC180Admin.inbox.push({
          id: r.id,
          status: r.status,
          group: r.group_name,
          snippet: r.snippet || r.ask || "",
          keyword: "",
          trade: r.trade,
          place: r.suburb || r.city,
          city: r.city,
          featuredId: r.featured_member_id || "",
          confidence: r.confidence || 0,
          link: r.post_link,
          when: r.when_label || fmtWhen(r.created_at),
          ofCount: r.of_count,
          approvedAt: r.approved_at ? "Approved" : "",
          token: r.id
        });
      });
    }
    if (TCAdmin.paint) TCAdmin.paint();
  }

  function hookLogin() {
    var form = $("loginForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      if (window.RB && RB.isDemo()) return; /* existing handler shows the dashboard */
      e.preventDefault();
      e.stopImmediatePropagation();
      var fd = new FormData(form);
      var email = String(fd.get("email") || "").trim();
      var password = String(fd.get("password") || "");
      showError("");
      RB.login(email, password).then(function (p) {
        if (!p || p.role !== "admin") {
          RB.logout();
          showError("This login is not an admin account.");
          return;
        }
        $("loginView").classList.add("hidden");
        $("appView").classList.remove("hidden");
        return hydrate();
      }).catch(function (err) {
        showError((err && err.message) || "Could not sign in.");
      });
    }, true);
  }

  function hookActions() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest("[data-action]");
      if (!btn || !RB.session || RB.isDemo()) return;
      var a = btn.getAttribute("data-action");
      var id = btn.getAttribute("data-id");
      if (a === "approve" && id) {
        e.preventDefault();
        e.stopImmediatePropagation();
        RB.approveMember(id).then(hydrate).catch(function (err) { window.alert(err.message || "Could not approve."); });
      }
      if (a === "decline" && id) {
        e.preventDefault();
        e.stopImmediatePropagation();
        RB.rejectMember(id).then(hydrate).catch(function (err) { window.alert(err.message || "Could not decline."); });
      }
      if (a === "devi-approve" && id) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var featured = btn.getAttribute("data-featured") || null;
        var rec = (window.__rbRequests || []).filter(function (r) { return r.id === id; })[0];
        featured = featured || (rec && rec.featured_member_id);
        RB.approveRequest(id, featured).then(hydrate).catch(function (err) { window.alert(err.message || "Could not approve the request."); });
      }
      if (a === "devi-dismiss" && id) {
        e.preventDefault();
        e.stopImmediatePropagation();
        RB.dismissRequest(id).then(hydrate).catch(function (err) { window.alert(err.message || "Could not dismiss."); });
      }
      if (a === "devi-simulate") {
        /* create a pending request from the demo plumber post if possible */
      }
    }, true);

    document.addEventListener("change", function (e) {
      if (e.target && e.target.getAttribute("data-action") === "rb-demo") {
        RB.setDemo(e.target.checked);
      }
    });
  }

  function addDemoToggle() {
    var form = $("loginForm");
    if (!form || form.querySelector(".rb-demo-toggle")) return;
    var lab = document.createElement("label");
    lab.className = "rb-demo-toggle";
    lab.innerHTML = '<input type="checkbox" data-action="rb-demo"' + (RB.isDemo() ? " checked" : "") + "> Demo (offline)";
    form.appendChild(lab);
    var p = form.querySelector(".login-foot");
    if (p) p.innerHTML = 'Sign in with the admin test account. <a href="index.html">Back to the app</a>';
    var email = form.querySelector('input[name="email"]');
    var pw = form.querySelector('input[name="password"]');
    if (email && !RB.isDemo()) email.value = "";
    if (pw && !RB.isDemo()) pw.value = "";
    var mock = form.querySelector(".mock");
    if (mock && !RB.isDemo()) mock.textContent = "Test login — shared with the phone app";
    var sub = form.querySelector("p");
    if (sub && sub.textContent && sub.textContent.indexOf("mock") >= 0) {
      sub.textContent = "Approvals and requests here show up in the phone app.";
    }
  }

  function exposeAdminArrays() {
    if (!window.TCAdmin) return;
    /* admin.js keeps requests/members in closure; patch via a hook if exposed */
  }

  async function boot() {
    if (!window.RB) return;
    RB.init();
    addDemoToggle();
    hookLogin();
    hookActions();
    /* If the prototype already jumped the login (shot=), leave it. */
    if (location.search.match(/shot=/)) return;
    try {
      var sess = await RB.getSession();
      if (sess) {
        await RB.loadProfile();
        if (RB.profile && RB.profile.role === "admin") {
          $("loginView").classList.add("hidden");
          $("appView").classList.remove("hidden");
          await hydrate();
          RB.listen("profiles", function () { hydrate(); });
          RB.listen("recommendation_requests", function () { hydrate(); });
          RB.listen("rec_progress", function () { hydrate(); });
        }
      }
    } catch (err) {
      console.warn("RB admin boot", err);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 0);
  setTimeout(boot, 50);
})();
