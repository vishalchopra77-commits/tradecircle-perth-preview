/* Rate Buddies v1.9.0 — wire the web admin to Supabase.
   v2.2.2 live: admin access is checked through the admins table (is_admin RPC),
   not profiles.role; pending list gets phone/email from admin_member_contacts. */
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
          email: p.email,
          status: p.status === "rejected" ? "declined" : p.status,
          when: fmtWhen(p.created_at) || "Just now",
          bio: p.bio
        });
      });
    }
    if (TCAdmin.members) {
      TCAdmin.members.splice(0, TCAdmin.members.length);
      active.filter(function (p) { return p.status === "approved" || p.status === "pending" || p.status === "rejected" || p.status === "suspended"; }).forEach(function (p) {
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
    var demoBypass = false;
    form.addEventListener("submit", function (e) {
      if (demoBypass) { demoBypass = false; return; } /* explicit Demo choice: the prototype handler shows sample data */
      var fd = new FormData(form);
      var email = String(fd.get("email") || "").trim();
      var password = String(fd.get("password") || "");
      var wantedDemo = !!(window.RB && RB.isDemo());
      if (wantedDemo && (!email || !password)) return; /* Demo with no login typed: sample data, as before */
      e.preventDefault();
      e.stopImmediatePropagation();
      showError("");
      /* v2.2.2e: a real login always wins over the Demo tick */
      RB.login(email, password).then(function (p) {
        if (!p || !RB.isAdmin) {
          RB.logout();
          if (wantedDemo) { demoBypass = true; form.requestSubmit ? form.requestSubmit() : form.submit(); return; }
          showError("This login is not an admin account.");
          return;
        }
        if (RB.isDemo()) {
          RB.setDemo(false);
          var box = form.querySelector('[data-action="rb-demo"]'); if (box) box.checked = false;
          var ban = document.getElementById("rbDemoBanner"); if (ban) ban.remove();
        }
        $("loginView").classList.add("hidden");
        $("appView").classList.remove("hidden");
        return hydrate().then(startLive);
      }).catch(function (err) {
        if (wantedDemo) { demoBypass = true; form.requestSubmit ? form.requestSubmit() : form.submit(); return; }
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
    lab.innerHTML = '<input type="checkbox" data-action="rb-demo" autocomplete="off"> Demo (offline)';
    form.appendChild(lab);
    /* v2.2.2e: always unticked on load (also after the browser restores form fields or the back/forward cache) */
    var clearDemo = function () { var b = lab.querySelector("input"); if (b) b.checked = false; RB.setDemo(false); };
    window.addEventListener("pageshow", clearDemo);
    setTimeout(clearDemo, 0);
    var p = form.querySelector(".login-foot");
    if (p) p.innerHTML = 'Sign in with the admin test account. <a href="index.html">Back to the app</a><br><span style="color:#334155;font-size:12px">Web admin v2.2.2 (build 15)</span>';
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

  /* v2.2.2d: live updates after BOTH a fresh sign-in and a page refresh (before, a fresh sign-in never
     subscribed, so new phone sign-ups only appeared after a reload). Plus a 20 s safety refresh. */
  var liveOn = false, hydrating = false, hydrateAgain = false;
  function softHydrate() {
    if (hydrating) { hydrateAgain = true; return; }
    hydrating = true;
    Promise.resolve(hydrate()).catch(function (e) { console.warn("RB admin refresh", e); }).then(function () {
      hydrating = false; if (hydrateAgain) { hydrateAgain = false; softHydrate(); }
    });
  }
  function startLive() {
    if (liveOn || !RB.session || RB.isDemo()) return;
    liveOn = true;
    var t = null, kick = function () { clearTimeout(t); t = setTimeout(softHydrate, 300); };
    ["profiles", "recommendation_requests", "rec_progress"].forEach(function (tbl) {
      try {
        RB.client.channel("rb-admin-" + tbl + "-" + Date.now()).on("postgres_changes", { event: "*", schema: "public", table: tbl }, kick).subscribe();
      } catch (e) { console.warn("RB admin listen", tbl, e); }
    });
    setInterval(function () { if (RB.session && !RB.isDemo() && document.visibilityState === "visible") softHydrate(); }, 20000);
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible" && RB.session) softHydrate(); });
  }
  function watchAuth() {
    if (watchAuth.done || !RB.client) return; watchAuth.done = true;
    RB.client.auth.onAuthStateChange(function (event, s) {
      if (event === "SIGNED_OUT" && !RB.isDemo()) { liveOn = false; }
      if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && s && !RB.isDemo() && liveOn) softHydrate();
    });
  }
  function demoBanner() {
    var old = document.getElementById("rbDemoBanner");
    if (!RB.isDemo()) { if (old) old.remove(); return; }
    if (old) return;
    var app = $("appView"); if (!app) return;
    var d = document.createElement("div"); d.id = "rbDemoBanner";
    d.setAttribute("style", "position:sticky;top:0;z-index:50;background:#fff4d6;color:#4a3400;border-bottom:1px solid #e9cf86;padding:10px 14px;font-weight:700;font-size:14px");
    d.textContent = "Demo (offline): sample members only. Real phone sign-ups are not shown. To see them, sign out, untick Demo (offline) and sign in with your admin email.";
    app.insertBefore(d, app.firstChild);
  }

  /* v2.2.2f: "Delete member" (admin only). Archives the profile + email first (public.deleted_members_archive),
     writes the audit log, then removes the login so the same email can sign up again. Done server-side by the
     Edge Function admin-delete-member; admins and your own account can never be deleted. */
  var UUIDRE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  var DEL_ICON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/></svg>';
  function delBtn(id) {
    return '<button type="button" class="btn btn-sm rb-del-member" data-action="rb-del-member" data-id="' + id + '" style="background:#b91c1c;color:#fff;border-color:#b91c1c">' + DEL_ICON + "<span>Delete member</span></button>";
  }
  function addDeleteButtons() {
    if (!RB.session || RB.isDemo()) return;
    document.querySelectorAll('[data-action="decline"][data-id], [data-action="save-mem"][data-id]').forEach(function (b) {
      var id = b.getAttribute("data-id");
      if (!UUIDRE.test(id || "")) return;
      var box = b.parentNode; if (!box || box.querySelector('[data-action="rb-del-member"][data-id="' + id + '"]')) return;
      b.insertAdjacentHTML("afterend", (b.getAttribute("data-action") === "save-mem" ? '<div style="margin-top:12px">' + delBtn(id) + "</div>" : delBtn(id)));
    });
  }
  function adminToast(msg, bad) {
    var t = document.createElement("div");
    t.setAttribute("role", "status");
    t.setAttribute("style", "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;max-width:90vw;padding:12px 16px;border-radius:12px;font-weight:700;font-size:15px;box-shadow:0 8px 24px rgba(0,0,0,.25);" + (bad ? "background:#7f1d1d;color:#fff" : "background:#0f172a;color:#fff"));
    t.textContent = msg; document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 4500);
  }
  function memberInfo(id) {
    var p = (window.__rbProfiles || []).filter(function (x) { return x.id === id; })[0] || {};
    var r = ((window.TCAdmin && TCAdmin.requests) || []).filter(function (x) { return x.id === id; })[0] || {};
    var m = ((window.TCAdmin && TCAdmin.members) || []).filter(function (x) { return x.id === id; })[0] || {};
    var name = p.name || [p.first, p.last].filter(Boolean).join(" ") || [r.first, r.last].filter(Boolean).join(" ") || m.name || "this member";
    return { name: name, email: p.email || r.email || "", business: p.business || r.business || m.business || "" };
  }
  async function deleteMember(id) {
    var info = memberInfo(id);
    var ok = window.confirm("Delete member?\n\n" + info.name + (info.business ? " · " + info.business : "") + "\n" + (info.email || "(no email on file)") +
      "\n\nThis can't be undone in the app. Their login is removed so the email can sign up again. A copy is kept in the archive.");
    if (!ok) return;
    try {
      var tok = RB.session && RB.session.access_token;
      var cfg = window.RBConfig || {};
      var res = await fetch(cfg.url + "/functions/v1/admin-delete-member", {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: cfg.anonKey, Authorization: "Bearer " + tok },
        body: JSON.stringify({ member_id: id })
      });
      var j = await res.json().catch(function () { return {}; });
      if (!res.ok || !j.ok) throw new Error(j.error || ("error " + res.status));
      adminToast("Deleted " + (j.name || info.name) + ". A copy is kept in the archive.");
      if (window.TCAdmin && TCAdmin.page && TCAdmin.page() === "member-detail" && TCAdmin.go) TCAdmin.go("members");
      softHydrate();
      if (window.RBAdminLive2 && RBAdminLive2.refresh) try { RBAdminLive2.refresh(); } catch (e2) {}
    } catch (err) {
      adminToast("Could not delete: " + ((err && err.message) || err), true);
    }
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest('[data-action="rb-del-member"]');
    if (!b) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (!RB.session || RB.isDemo()) return;
    deleteMember(b.getAttribute("data-id"));
  }, true);
  setInterval(addDeleteButtons, 600);

  async function boot() {
    if (!window.RB || boot.done) return;
    boot.done = true;
    RB.init();
    addDemoToggle();
    hookLogin();
    hookActions();
    watchAuth();
    setInterval(demoBanner, 1000);
    /* If the prototype already jumped the login (shot=), leave it. */
    if (location.search.match(/shot=/)) return;
    try {
      var sess = await RB.getSession();
      if (sess) {
        await RB.loadProfile();
        if (RB.profile && RB.isAdmin) {
          $("loginView").classList.add("hidden");
          $("appView").classList.remove("hidden");
          await hydrate();
          startLive();
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
