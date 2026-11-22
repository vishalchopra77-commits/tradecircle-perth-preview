/* Rate Buddies v2.2.2 build 16 — QA sweep fixes (22 Nov 2026).
   Live (Supabase) only unless noted; Demo (offline) mode is left exactly as it was.
   #1  suspended / archived member: signed out + "Account suspended" screen (on sign-in and live)
   #7  Settings › Account › Change password, Delete my account (delete_my_account RPC: archive copy, then the login is removed)
   #9  incoming Facebook friend requests on Facebook › Circle with Confirm / Not now
   #10 Home "Recent activity" from your live notifications
   #17 Forgot password? (email link back to the site, then "Set a new password")
   #25 real "last seen" (member_presence heartbeat)
   #27 Connect Facebook / Google sheets replaced by "Paste your link"
   #32 job photos upload to Supabase Storage (covers/<your id>/gallery-*), saved in profiles.extras.gallery
   #39 Support thread updates live while open
   #41 tutorial progress read back from tutorial_watched
   #53 group chat welcome, #54 tapping Home again goes to the top, version label build 16 */
(function () {
  "use strict";
  var BUILD = "v2.2.2 (build 17)";
  var SITE_URL = "https://vishalchopra77-commits.github.io/tradecircle-perth-preview/";
  var SUPPORT_EMAIL = "ratebuddies@gmail.com";
  function T() { return window.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function rb() { return window.RB && !RB.isDemo() && RB.client ? RB : null; }
  function live() { return !!(window.RBLive && RBLive.isLive && RBLive.isLive()); }
  function db() { return RB.client; }
  function me() { return RB.profile; }
  function toast(m) { if (T().toast) T().toast(m); }
  function go(id, o) { if (T().go) T().go(id, o); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function active() { return document.querySelector(".screen.active"); }
  function scr() { var a = active(); return a ? a.getAttribute("data-screen") : ""; }
  function member(id) { return (T().MEMBERS || []).filter(function (m) { return m.id === id; })[0]; }
  function initials(m) { return (String((m && m.first) || "?").charAt(0) + String((m && m.last) || "").charAt(0)).toUpperCase(); }
  function host() { return document.getElementById("phone") || document.body; }

  /* ---------- small sheet (modal) ---------- */
  function closeSheet() { var o = document.getElementById("rb222iSheet"); if (o) o.remove(); }
  function openSheet(html, opts) {
    closeSheet();
    var o = document.createElement("div");
    o.id = "rb222iSheet"; o.className = "rb222i-back" + (opts && opts.full ? " full" : "");
    o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true");
    o.innerHTML = '<div class="rb222i-sheet">' + html + "</div>";
    host().appendChild(o);
    o.addEventListener("click", function (e) { if (e.target === o && !(opts && opts.locked)) closeSheet(); });
    var f = o.querySelector("input"); if (f) setTimeout(function () { try { f.focus(); } catch (e) {} }, 60);
    return o;
  }
  function errIn(o, msg) { var p = o.querySelector(".rb222i-err"); if (p) { p.textContent = msg || ""; p.hidden = !msg; } }
  function busy(btn, on, label) { if (!btn) return; btn.disabled = !!on; if (label) btn.textContent = label; }

  /* ================= #1 suspended ================= */
  var suspendedShown = false;
  function suspended(p) {
    if (suspendedShown) return; suspendedShown = true;
    var ex = (p && p.extras) || {}, why = (ex.suspension && ex.suspension.reason) || "";
    var archived = !!(p && p.archivedAt) && p.status !== "suspended";
    Promise.resolve().then(function () { return RB.logout(); }).catch(function () {}).then(function () {
      try { S().draft = {}; } catch (e) {}
      go("signin");
      var o = openSheet(
        '<div class="rb222i-ico warn" aria-hidden="true">!</div>' +
        "<h3>" + (archived ? "This account is closed" : "Your account is suspended") + "</h3>" +
        "<p>" + (archived ? "This Rate Buddies account is no longer active." : "An admin has paused your Rate Buddies account, so you can\u2019t use the app for now.") + "</p>" +
        (why ? '<p class="rb222i-reason"><b>Reason:</b> ' + esc(why) + "</p>" : "") +
        '<p>If you think this is a mistake, contact Rate Buddies at <a href="mailto:' + SUPPORT_EMAIL + '">' + SUPPORT_EMAIL + "</a>.</p>" +
        '<button type="button" class="btn btn-primary" data-rb222i="close">OK</button>', { full: true, locked: true });
      o.classList.add("rb222i-suspended");
      suspendedShown = false;
    });
  }
  setInterval(function () {
    var p = window.RB && RB.session && RB.profile;
    if (p && !RB.isDemo() && (p.status === "suspended" || p.archivedAt) && !document.querySelector(".rb222i-suspended")) suspended(p);
  }, 1500);
  /* a suspension made while the app is open: the profiles change (rb-app) reloads RB.profile; this is the backstop */
  setInterval(function () { if (window.RB && RB.session && RB.profile && !RB.isDemo() && document.visibilityState !== "hidden") RB.loadProfile().catch(function () {}); }, 30000);

  /* ================= #7 change password / delete account ================= */
  function pwSheet(recovery) {
    var o = openSheet(
      "<h3>" + (recovery ? "Set a new password" : "Change password") + "</h3>" +
      "<p>" + (recovery ? "Choose a new password for your Rate Buddies account." : "Use at least 8 characters.") + "</p>" +
      '<div class="field"><label for="rbPw1">New password</label><input id="rbPw1" type="password" autocomplete="new-password" minlength="8" placeholder="At least 8 characters"></div>' +
      '<div class="field"><label for="rbPw2">Type it again</label><input id="rbPw2" type="password" autocomplete="new-password" minlength="8" placeholder="Same password again"></div>' +
      '<p class="rb222i-err" role="alert" hidden></p>' +
      '<button type="button" class="btn btn-primary" data-rb222i="pw-save">Save new password</button>' +
      '<button type="button" class="btn btn-ghost ink" data-rb222i="close">Cancel</button>', { locked: !!recovery });
    o.dataset.recovery = recovery ? "1" : "";
  }
  async function pwSave(o, btn) {
    var a = o.querySelector("#rbPw1").value, b = o.querySelector("#rbPw2").value;
    if (a.length < 8) return errIn(o, "Use at least 8 characters.");
    if (a !== b) return errIn(o, "The two passwords don\u2019t match.");
    errIn(o, ""); busy(btn, true, "Saving\u2026");
    var r = await db().auth.updateUser({ password: a });
    if (r.error) { busy(btn, false, "Save new password"); return errIn(o, /different/i.test(r.error.message) ? "Choose a password you haven\u2019t used before." : r.error.message); }
    var rec = o.dataset.recovery === "1";
    closeSheet();
    toast("Password changed.");
    if (rec) { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} if (window.RBApp && RBApp.refresh) { await RBApp.refresh().catch(function () {}); } if (window.RBApp && RBApp.route) RBApp.route(); else go("home"); }
  }
  function delSheet() {
    openSheet(
      '<div class="rb222i-ico warn" aria-hidden="true">!</div>' +
      "<h3>Delete my account</h3>" +
      "<p>This removes your sign-in and takes your profile out of Rate Buddies. Other members won\u2019t see you any more. A copy is kept for the admin\u2019s records, as described in the privacy policy.</p>" +
      '<div class="field"><label for="rbDel">Type DELETE to confirm</label><input id="rbDel" autocomplete="off" autocapitalize="characters" placeholder="DELETE"></div>' +
      '<p class="rb222i-err" role="alert" hidden></p>' +
      '<button type="button" class="btn btn-danger" data-rb222i="del-go">Delete my account</button>' +
      '<button type="button" class="btn btn-ghost ink" data-rb222i="close">Keep my account</button>');
  }
  async function delGo(o, btn) {
    var v = String(o.querySelector("#rbDel").value || "").trim();
    if (v !== "DELETE") return errIn(o, "Type DELETE in capitals to confirm.");
    errIn(o, ""); busy(btn, true, "Deleting\u2026");
    var r = await db().rpc("delete_my_account", { confirm: "DELETE" });
    if (r.error) { busy(btn, false, "Delete my account"); return errIn(o, r.error.message || "Could not delete the account."); }
    try { await RB.logout(); } catch (e) {}
    closeSheet(); go("welcome");
    toast("Your account has been deleted.");
  }
  function settingsRows(sc) {
    var cards = sc.querySelectorAll(".card.group"); if (!cards.length || sc.querySelector(".rb222i-acct")) return;
    cards[0].insertAdjacentHTML("beforeend",
      '<button class="set-row rb222i-acct" type="button" data-rb222i="pw"><span class="ic" style="background:#EEF2F6;color:#14314C">' + KEY + '</span><span class="lab"><span class="a">Change password</span><span class="b">Choose a new sign-in password</span></span><span class="chev">\u203a</span></button>' +
      '<button class="set-row rb222i-acct rb222i-del" type="button" data-rb222i="del"><span class="ic" style="background:#FDECEC;color:#B42318">' + BIN + '</span><span class="lab"><span class="a">Delete my account</span><span class="b">Remove your sign-in and profile</span></span><span class="chev">\u203a</span></button>');
  }
  var KEY = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.3-9.3M16 7l3 3M14 9l2 2"/></svg>';
  var BIN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>';

  /* ================= #17 forgot password ================= */
  function forgotLink(sc) {
    if (sc.querySelector(".rb222i-forgot")) return;
    var pw = sc.querySelector('input[type="password"]'); if (!pw) return;
    var f = pw.closest(".field") || pw.parentElement;
    f.insertAdjacentHTML("afterend", '<p class="rb222i-forgot"><button type="button" class="link-btn" data-rb222i="forgot">Forgot password?</button></p>');
  }
  function forgotSheet() {
    var em = (document.querySelector('.screen.active input[type="email"], .screen.active input[name="email"]') || {}).value || "";
    openSheet("<h3>Reset your password</h3><p>Enter the email you sign in with. We\u2019ll email you a link to set a new password.</p>" +
      '<div class="field"><label for="rbFgEmail">Email</label><input id="rbFgEmail" type="email" autocomplete="email" placeholder="you@example.com" value="' + esc(em) + '"></div>' +
      '<p class="rb222i-err" role="alert" hidden></p>' +
      '<button type="button" class="btn btn-primary" data-rb222i="forgot-send">Email me a reset link</button>' +
      '<button type="button" class="btn btn-ghost ink" data-rb222i="close">Cancel</button>');
  }
  async function forgotSend(o, btn) {
    var em = String(o.querySelector("#rbFgEmail").value || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return errIn(o, "Enter the email you sign in with.");
    if (!window.supabase || !window.RBConfig) return errIn(o, "Not connected. Try again in a moment.");
    errIn(o, ""); busy(btn, true, "Sending\u2026");
    /* a link that also works when opened in the phone's browser: implicit flow (no code verifier on this device needed) */
    var c = window.__rb222iReset || (window.__rb222iReset = supabase.createClient(RBConfig.url, RBConfig.anonKey, { auth: { flowType: "implicit", persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: "rb-reset-tmp" } }));
    var r = await c.auth.resetPasswordForEmail(em, { redirectTo: SITE_URL });
    if (r.error) {
      busy(btn, false, "Email me a reset link");
      var msg = r.error.message || "";
      if (/seconds|rate limit|too many/i.test(msg)) return errIn(o, "A reset email was sent a moment ago. Please wait a minute and try again.");
      return errIn(o, "We couldn\u2019t send the email: " + msg);
    }
    o.querySelector(".rb222i-sheet").innerHTML = "<h3>Check your email</h3><p>If <b>" + esc(em) + "</b> has a Rate Buddies account, a reset link is on its way. Open it on this phone to set a new password.</p>" +
      '<button type="button" class="btn btn-primary" data-rb222i="close">OK</button>';
  }
  /* the reset link lands here with #access_token=…&type=recovery */
  var recoveryDone = false;
  function recoveryCheck() {
    if (recoveryDone || !window.RB || !RB.client) return;
    var h = window.__rbAuthHash || location.hash || "";
    if (!/type=recovery/.test(h) || !/access_token=/.test(h)) { recoveryDone = true; return; }
    recoveryDone = true;
    var q = new URLSearchParams(h.replace(/^#/, ""));
    RB.client.auth.setSession({ access_token: q.get("access_token"), refresh_token: q.get("refresh_token") || "" }).then(function (r) {
      if (r.error) { toast("This reset link has expired. Ask for a new one."); return; }
      try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
      RB.getSession().then(function () { return RB.loadProfile(); }).then(function () { return window.RBApp && RBApp.refresh ? RBApp.refresh() : null; }).catch(function () {}).then(function () { pwSheet(true); });
    });
  }
  setInterval(recoveryCheck, 300);

  /* ================= #27 paste-your-link (replaces the mock Connect sheets) ================= */
  function linkSheet(kind) {
    var p = me() || {}, fb = kind === "fb";
    var cur = fb ? (p.facebook || "") : (p.googleBusinessUrl || "");
    openSheet("<h3>" + (fb ? "Facebook profile link" : "Google Business Profile link") + "</h3>" +
      "<p>" + (fb ? "Paste the link to your personal Facebook profile. Members open it to send you a friend request." : "Paste the link to your Google Business Profile. Members open it to leave you a Google Review after a real job.") + "</p>" +
      '<div class="field"><label for="rbLinkIn">' + (fb ? "Facebook profile link" : "Google Business Profile link") + '</label><input id="rbLinkIn" inputmode="url" autocomplete="url" placeholder="' + (fb ? "https://www.facebook.com/yourname" : "https://g.page/yourbusiness") + '" value="' + esc(cur) + '"></div>' +
      '<p class="rb222i-help">' + (fb ? "On Facebook: open your profile, tap \u2026 then Copy link." : "On Google Maps: open your business, tap Share, then Copy link.") + "</p>" +
      '<p class="rb222i-err" role="alert" hidden></p>' +
      '<button type="button" class="btn btn-primary" data-rb222i="link-save" data-kind="' + kind + '">Save link</button>' +
      (cur ? '<button type="button" class="btn btn-ghost ink" data-rb222i="link-clear" data-kind="' + kind + '">Remove link</button>' : "") +
      '<button type="button" class="btn btn-ghost ink" data-rb222i="close">Cancel</button>');
  }
  async function linkSave(o, btn, clear) {
    var kind = btn.getAttribute("data-kind"), fb = kind === "fb";
    var v = clear ? "" : String(o.querySelector("#rbLinkIn").value || "").trim();
    if (v && !/^https?:\/\//i.test(v)) v = "https://" + v;
    if (v && fb && !/^https?:\/\/([a-z0-9-]+\.)*(facebook\.com|fb\.com|fb\.me)\//i.test(v)) return errIn(o, "This doesn\u2019t look like a Facebook profile link.");
    if (v && !fb && !/^https?:\/\/([a-z0-9-]+\.)*(google\.[a-z.]+|g\.page|goo\.gl|maps\.app\.goo\.gl)(\/|$)/i.test(v)) return errIn(o, "This doesn\u2019t look like a Google Business Profile link.");
    if (!clear && !v) return errIn(o, "Paste your link first.");
    busy(btn, true, "Saving\u2026");
    var patch = fb ? { facebook: v } : { google_business_url: v };
    var r = await db().from("profiles").update(patch).eq("id", me().id);
    if (r.error) { busy(btn, false, "Save link"); return errIn(o, r.error.message); }
    await RB.loadProfile().catch(function () {});
    var row = member(me().id);
    if (row) { row.links = row.links || {}; if (fb) { row.facebook = v; row.links.facebook = v; } else { row.links.google = v; row.googleLink = v; } }
    syncFlags(); closeSheet(); toast(v ? "Link saved." : "Link removed.");
    go(S().screen || "settings", { replace: true });
  }
  function syncFlags() {
    if (!live() || !me()) return;
    S().fbConnected = !!me().facebook;
    S().googleConnected = !!me().googleBusinessUrl;
  }
  function settingsLinks(sc) {
    sc.querySelectorAll(".set-row").forEach(function (r) {
      var a = r.querySelector(".a"), b = r.querySelector(".b"); if (!a || r.dataset.rb222iL) return;
      var t = a.textContent.trim();
      if (/^Connect Facebook$|^Facebook:? Connected$/.test(t)) { r.dataset.rb222iL = 1; r.removeAttribute("data-go"); r.setAttribute("data-action", "fb-connect"); a.textContent = me().facebook ? "Facebook profile link" : "Add your Facebook profile link"; if (b) b.textContent = me().facebook ? String(me().facebook).replace(/^https?:\/\/(www\.)?/, "") : "Not added \u00b7 members use it to send a friend request"; }
      if (/Google Business Profile/.test(t)) { r.dataset.rb222iL = 1; r.setAttribute("data-action", "google-connect"); a.textContent = me().googleBusinessUrl ? "Google Business Profile link" : "Add your Google Business Profile link"; if (b) b.textContent = me().googleBusinessUrl ? String(me().googleBusinessUrl).replace(/^https?:\/\/(www\.)?/, "") : "Not added \u00b7 members use it to leave you a review"; }
    });
  }

  /* ================= #9 incoming friend requests (Facebook › Circle) ================= */
  function incomingBlock(sc) {
    var inc = S()._relIn || {}, ids = Object.keys(inc).filter(function (id) { return member(id); });
    var old = sc.querySelector(".rb222i-fr"); var key = ids.join(",");
    if (old && old.dataset.key === key) return;
    if (old) old.remove();
    if (!ids.length) return;
    var html = '<section class="rb222i-fr" data-key="' + esc(key) + '" aria-label="Friend requests"><div class="rb222i-fr-h">Friend requests <span class="rb222i-n">' + ids.length + "</span></div>" +
      '<p class="rb222i-fr-sub">These members sent you a Facebook friend request. Confirm once you\u2019ve accepted it on Facebook.</p>' +
      ids.map(function (id) {
        var m = member(id);
        return '<div class="rb222i-fr-row"><button type="button" class="rb222i-fr-who" data-go="member" data-id="' + esc(id) + '"><span class="rb222i-av">' + esc(initials(m)) + '</span><span class="rb222i-fr-nm"><strong data-member-name="1">' + esc(((m.first || "") + " " + (m.last || "")).trim()) + "</strong><span>" + esc(m.trade || "") + "</span></span></button>" +
          '<div class="rb222i-fr-acts"><button type="button" class="btn btn-primary btn-sm" data-action="rb-fr-confirm" data-id="' + esc(id) + '">Confirm</button><button type="button" class="btn btn-ghost btn-sm" data-action="rb-fr-notnow" data-id="' + esc(id) + '">Not now</button></div></div>';
      }).join("") + "</section>";
    var scroll = sc.querySelector(".scroll"); if (!scroll) return;
    var anchor = scroll.querySelector(".rb-fb-stats") || scroll.firstElementChild;
    if (anchor && anchor.classList.contains("rb-fb-stats")) anchor.insertAdjacentHTML("afterend", html); else scroll.insertAdjacentHTML("afterbegin", html);
  }

  /* ================= #25 presence ================= */
  var presence = {}, lastBeat = 0, lastPres = 0;
  function beat(force) {
    if (!live() || document.visibilityState === "hidden") return;
    if (!force && Date.now() - lastBeat < 60000) return;
    lastBeat = Date.now();
    db().rpc("touch_presence").then(function () {}, function () {});
  }
  function loadPresence(force) {
    if (!live() || (!force && Date.now() - lastPres < 60000)) return;
    lastPres = Date.now();
    db().from("member_presence").select("member_id,last_seen_at").then(function (r) {
      if (r.error) return; var m = {}; (r.data || []).forEach(function (x) { m[x.member_id] = x.last_seen_at; }); presence = m;
    });
  }
  function seen(id) {
    var t = presence[id]; if (!t) return "";
    var mins = Math.floor((Date.now() - new Date(t).getTime()) / 60000);
    if (mins < 3) return "Online";
    if (mins < 60) return "Last seen " + mins + " min ago";
    if (mins < 24 * 60) { var h = Math.floor(mins / 60); return "Last seen " + h + " hour" + (h === 1 ? "" : "s") + " ago"; }
    var d = new Date(t);
    return "Last seen " + d.toLocaleDateString("en-AU", { timeZone: "Australia/Perth", day: "numeric", month: "short" });
  }
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") { beat(true); loadPresence(true); } });

  /* ================= #10 Home activity ================= */
  var TYPE = { swap_request: "review", review_done: "review", approved: "admin", friend_request: "admin", friend_added: "admin", support: "admin", feature: "admin", account: "admin" };
  var lastFeed = 0, feedKey = "";
  function whenLabel(iso) {
    try {
      var d = new Date(iso), f = function (x) { return new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Perth" }).format(x); };
      var t = d.toLocaleTimeString("en-AU", { timeZone: "Australia/Perth", hour: "numeric", minute: "2-digit" }).toLowerCase();
      if (f(d) === f(new Date())) return "Today " + t;
      if (f(d) === f(new Date(Date.now() - 86400000))) return "Yesterday " + t;
      return d.toLocaleDateString("en-AU", { timeZone: "Australia/Perth", weekday: "long" }) + " " + t;
    } catch (e) { return ""; }
  }
  function loadFeed(force) {
    if (!live() || (!force && Date.now() - lastFeed < 20000)) return;
    lastFeed = Date.now();
    db().from("notifications").select("id,title,kind,created_at").order("created_at", { ascending: false }).limit(6).then(function (r) {
      if (r.error) return;
      var list = (r.data || []).map(function (n) { return { type: TYPE[n.kind] || "alert", text: n.title, when: whenLabel(n.created_at) }; });
      S()._rbFeed = list;
      var k = (r.data || []).map(function (n) { return n.id; }).join(",");
      if (k !== feedKey) { feedKey = k; if (S().screen === "home" && !document.querySelector("#tc12Overlay.open, .sheet.open, #rb222iSheet")) go("home", { replace: true }); }
    });
  }

  /* ================= #39 support live ================= */
  var supSub = false, lastSup = 0;
  function supportLive(force) {
    if (!live()) return;
    if (!supSub) {
      supSub = true;
      RB.listen("support_messages", function () { supportLive(true); }, "member_id=eq." + me().id);
    }
    if (!force && Date.now() - lastSup < 15000) return;
    lastSup = Date.now();
    RB.listSupport(me().id).then(function (rows) {
      var prev = S()._supportLive || [];
      S()._supportLive = rows;
      if (S().screen === "support" && rows.length !== prev.length) {
        var inp = document.getElementById("supportInput"), keep = inp ? inp.value : "";
        go("support", { replace: true });
        var inp2 = document.getElementById("supportInput"); if (inp2 && keep) inp2.value = keep;
        var th = document.querySelector('.screen.active[data-screen="support"] .chat-thread, .screen.active[data-screen="support"] .scroll');
        if (th) th.scrollTop = th.scrollHeight;
      }
    }).catch(function () {});
  }

  /* ================= #41 tutorial progress from the database ================= */
  var tutLoadedFor = "";
  function loadTutorials() {
    if (!live() || tutLoadedFor === me().id || !window.TCTutorials) return;
    tutLoadedFor = me().id;
    db().from("tutorial_watched").select("video_id").eq("member_id", me().id).then(function (r) {
      if (r.error) return;
      var map = {}; (r.data || []).forEach(function (x) { map[x.video_id] = true; });
      try { localStorage.setItem("rb_tut_watched_v181", JSON.stringify(map)); } catch (e) {} /* tutorials-store.js WATCH_KEY */
      if (/^tutorial/.test(S().screen || "")) go(S().screen, { replace: true });
    });
  }

  /* ================= #32 gallery uploads ================= */
  function pickPhoto() {
    var inp = document.createElement("input");
    inp.type = "file"; inp.accept = "image/*"; inp.style.display = "none";
    inp.addEventListener("change", function () { var f = inp.files && inp.files[0]; inp.remove(); if (f) uploadPhoto(f); });
    document.body.appendChild(inp); inp.click();
  }
  async function shrink(file) {
    try {
      var url = URL.createObjectURL(file), img = new Image();
      await new Promise(function (ok, bad) { img.onload = ok; img.onerror = bad; img.src = url; });
      var max = 1600, w = img.naturalWidth, h = img.naturalHeight, k = Math.min(1, max / Math.max(w, h));
      var c = document.createElement("canvas"); c.width = Math.round(w * k); c.height = Math.round(h * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      return await new Promise(function (ok) { c.toBlob(function (b) { ok(b || file); }, "image/jpeg", 0.85); });
    } catch (e) { return file; }
  }
  async function saveGallery(list) {
    var fresh = await db().from("profiles").select("extras").eq("id", me().id).maybeSingle();
    var ex = Object.assign({}, (fresh.data && fresh.data.extras) || {}, { gallery: list });
    var r = await db().from("profiles").update({ extras: ex }).eq("id", me().id);
    if (r.error) throw r.error;
    await RB.loadProfile().catch(function () {});
    var row = member(me().id); if (row) { row.profile = row.profile || {}; row.profile.gallery = list; if (window.TCProfile && TCProfile.applyToMember) try { TCProfile.applyToMember(row, row.profile); } catch (e) {} }
  }
  function currentGallery() { return ((me() && me().extras && me().extras.gallery) || []).slice(); }
  async function uploadPhoto(file) {
    if (!/^image\//.test(file.type || "")) { toast("Choose a photo (JPG or PNG)."); return; }
    toast("Uploading photo\u2026");
    try {
      var blob = await shrink(file);
      var path = me().id + "/gallery-" + Date.now() + ".jpg";
      var up = await db().storage.from("covers").upload(path, blob, { contentType: "image/jpeg", upsert: false });
      if (up.error) throw up.error;
      var pu = db().storage.from("covers").getPublicUrl(path);
      var url = pu && pu.data && pu.data.publicUrl;
      var list = currentGallery();
      list.push({ id: "g" + Date.now(), title: "Job photo " + (list.length + 1), url: url, path: path });
      await saveGallery(list);
      toast("Photo added to your profile.");
      go("me", { replace: true });
    } catch (e) { toast("Photo not uploaded: " + ((e && e.message) || "error")); }
  }
  async function removePhoto(gid) {
    try {
      var gone = currentGallery().filter(function (g) { return g.id === gid; })[0];
      var list = currentGallery().filter(function (g) { return g.id !== gid; });
      await saveGallery(list);
      /* b16: also delete the file from Storage (needs the 015 delete policy) */
      if (gone && gone.path) { try { await db().storage.from("covers").remove([gone.path]); } catch (eS) {} }
      toast("Photo removed from your profile.");
      go("me", { replace: true });
    } catch (e) { toast("Not removed: " + ((e && e.message) || "error")); }
  }

  /* ================= #53 group chat welcome ================= */
  function groupWelcome(sc) {
    var th = sc.querySelector("#chatThread"); if (!th) return;
    var has = th.querySelector(".rb222i-gw");
    if (th.children.length - (has ? 1 : 0) > 0) { if (has) has.remove(); return; }
    if (has) return;
    var c = (window.TC12 && TC12.liveChats && (TC12.liveChats() || []).filter(function (x) { return x.id === S().chatId; })[0]) || {};
    var name = String(c.name || "your area").replace(/\s*(tradies|group chat|group)$/i, "");
    th.insertAdjacentHTML("beforeend", '<div class="rb222i-gw"><div class="rb222i-gw-wave" aria-hidden="true">\ud83d\udc4b</div><p class="rb222i-gw-t">Say hi to tradies in ' + esc(name) + "</p>" +
      '<p class="rb222i-gw-s">No messages yet. Start the conversation:</p><div class="rb222i-gw-chips">' +
      ["Hi all! \ud83d\udc4b", "Anyone need a hand this week?", "Happy to swap Google Reviews"].map(function (t) { return '<button type="button" class="rb222i-chip" data-rb222i="gw" data-text="' + esc(t) + '">' + esc(t) + "</button>"; }).join("") + "</div></div>");
  }


  /* ================= #49 New group (live) ================= */
  var grpPick = {};
  function grpCandidates() {
    var my = me() && me().id;
    return (T().MEMBERS || []).filter(function (m) {
      return m && m.id !== my && /^[0-9a-f-]{36}$/i.test(m.id) && m.role !== "admin" && (!m.status || m.status === "approved");
    }).sort(function (a, b) { return String(a.first + a.last).localeCompare(String(b.first + b.last)); });
  }
  function grpRows(q) {
    q = String(q || "").toLowerCase().trim();
    var list = grpCandidates().filter(function (m) { return !q || ((m.first || "") + " " + (m.last || "") + " " + (m.trade || "") + " " + (m.business || "")).toLowerCase().indexOf(q) >= 0; });
    if (!list.length) return '<p class="rb222i-help">No members match.</p>';
    return list.map(function (m) {
      var on = !!grpPick[m.id];
      return '<label class="rb222i-grp-row"><input type="checkbox" data-gid="' + esc(m.id) + '"' + (on ? " checked" : "") + '>' +
        '<span class="rb222i-grp-av" aria-hidden="true">' + esc(initials(m)) + '</span><span class="rb222i-grp-n"><b>' + esc(((m.first || "") + " " + (m.last || "")).trim()) + "</b><small>" + esc(m.trade || "") + "</small></span></label>";
    }).join("");
  }
  function grpCount(o) { var n = Object.keys(grpPick).length, c = o.querySelector(".rb222i-grp-count"); if (c) c.textContent = n ? n + " selected" : "Pick at least one member"; }
  function groupSheet() {
    grpPick = {};
    var o = openSheet('<h3>New group</h3><p>Name the group and pick the members to add. They\u2019ll get a notification.</p>' +
      '<div class="field"><label for="rb222iGrpName">Group name</label><input id="rb222iGrpName" maxlength="60" placeholder="e.g. Midland sparkies" autocomplete="off"></div>' +
      '<div class="field"><label for="rb222iGrpQ">Add members</label><input id="rb222iGrpQ" type="search" placeholder="Search by name or trade" autocomplete="off"></div>' +
      '<div class="rb222i-grp-list" role="group" aria-label="Members">' + grpRows("") + '</div><p class="rb222i-grp-count rb222i-help">Pick at least one member</p>' +
      '<p class="rb222i-err" role="alert" hidden></p><button type="button" class="btn btn-primary" data-rb222i="grp-create">Create group</button>' +
      '<button type="button" class="btn btn-ghost ink" data-rb222i="close">Cancel</button>');
    o.querySelector("#rb222iGrpQ").addEventListener("input", function (e) { o.querySelector(".rb222i-grp-list").innerHTML = grpRows(e.target.value); });
    o.addEventListener("change", function (e) { var id = e.target && e.target.getAttribute && e.target.getAttribute("data-gid"); if (!id) return; if (e.target.checked) grpPick[id] = 1; else delete grpPick[id]; grpCount(o); });
  }
  function grpCreate(o, btn) {
    var name = (o.querySelector("#rb222iGrpName").value || "").trim(), ids = Object.keys(grpPick);
    if (name.length < 2) { errIn(o, "Give the group a name."); return; }
    if (!ids.length) { errIn(o, "Pick at least one member."); return; }
    errIn(o, ""); busy(btn, true, "Creating\u2026");
    db().rpc("create_group_chat", { p_title: name, p_members: ids }).then(function (r) {
      if (r.error) throw r.error;
      var cid = r.data;
      return (window.RBLive && RBLive.syncChats ? RBLive.syncChats() : Promise.resolve()).then(function () {
        closeSheet(); S().chatId = cid; go("chat-group"); toast("Group created with " + (ids.length + 1) + " members.");
      });
    }).catch(function (e) { busy(btn, false, "Create group"); errIn(o, "Couldn\u2019t create the group: " + ((e && e.message) || "try again")); });
  }


  /* ================= #14 push notifications (FCM) =================
     Registers this phone's FCM token (public.register_device_token) when the build has Firebase config
     (window.RB_PUSH_READY, written by prepare-www.sh) and the push plugin is installed. Sending is done by the
     push-send Edge Function and stays off until the admin turns on push_enabled. */
  var pushStarted = false;
  function pushPlugin() { var c = window.Capacitor; if (!c || !c.isNativePlatform || !c.isNativePlatform() || !window.RB_PUSH_READY) return null; return (c.Plugins && c.Plugins.PushNotifications) || null; }
  async function pushInit() {
    if (pushStarted || !live()) return; var P = pushPlugin(); if (!P) return; pushStarted = true;
    try {
      try { await P.createChannel({ id: "rb_default", name: "Rate Buddies", description: "Messages, reviews and alerts", importance: 4, visibility: 1 }); } catch (e0) {}
      P.addListener("registration", function (t) {
        var ver = "2.2.2 (16)";
        db().rpc("register_device_token", { p_token: t.value, p_platform: "android", p_version: ver }).then(function () {});
      });
      P.addListener("registrationError", function () {});
      P.addListener("pushNotificationReceived", function () { try { if (window.RBLive) { RBLive.syncNotifs(); RBLive.syncChats(); } } catch (e1) {} });
      P.addListener("pushNotificationActionPerformed", function (a) {
        var d = (a && a.notification && a.notification.data) || {};
        if (d.kind === "chat" && d.conversation_id) { S().chatId = d.conversation_id; if (window.RBLive) RBLive.syncChats().then(function () { var c = (TC12.liveChats() || []).filter(function (x) { return x.id === d.conversation_id; })[0]; go(c && c.type === "group" ? "chat-group" : "chat-dm"); }); }
        else go("notifications");
      });
      var perm = await P.checkPermissions();
      if (perm.receive !== "granted") perm = await P.requestPermissions();
      if (perm.receive === "granted") await P.register();
    } catch (e) { pushStarted = false; }
  }
  /* notification toggles + quiet hours are saved to profiles.extras.notif so the server respects them */
  var notifTimer = null, notifLast = "";
  function syncNotifPrefs() {
    if (!live() || !me()) return;
    var n = {}; try { n = JSON.parse(localStorage.getItem("tc12_notif") || "{}") || {}; } catch (e) {}
    try { n.tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Australia/Perth"; } catch (e2) { n.tz = "Australia/Perth"; }
    var key = JSON.stringify(n); if (key === notifLast) return;
    clearTimeout(notifTimer);
    notifTimer = setTimeout(async function () {
      try {
        var fresh = await db().from("profiles").select("extras").eq("id", me().id).maybeSingle();
        var ex = Object.assign({}, (fresh.data && fresh.data.extras) || {}, { notif: n });
        var r = await db().from("profiles").update({ extras: ex }).eq("id", me().id);
        if (!r.error) { notifLast = key; if (RB.profile) RB.profile.extras = ex; }
      } catch (e3) {}
    }, 700);
  }
  document.addEventListener("click", function (e) { if (e.target && e.target.closest && e.target.closest('[data-action="tog-notif"]')) setTimeout(syncNotifPrefs, 50); });
  document.addEventListener("change", function (e) { if (e.target && e.target.matches && e.target.matches("[data-quiet]")) setTimeout(syncNotifPrefs, 50); });
  setInterval(function () { if (live()) { pushInit(); if (!notifLast) syncNotifPrefs(); } }, 4000);
  window.RB222iPush = { init: pushInit, syncPrefs: syncNotifPrefs };

  /* ================= clicks ================= */
  window.addEventListener("click", function (e) {
    var t = e.target; if (!t || !t.closest) return;
    var b = t.closest("[data-rb222i]");
    if (b) {
      var a = b.getAttribute("data-rb222i"), o = document.getElementById("rb222iSheet");
      e.preventDefault(); e.stopImmediatePropagation();
      if (a === "close") { closeSheet(); return; }
      if (a === "pw") { pwSheet(false); return; }
      if (a === "pw-save" && o) { pwSave(o, b); return; }
      if (a === "del") { delSheet(); return; }
      if (a === "del-go" && o) { delGo(o, b); return; }
      if (a === "forgot") { forgotSheet(); return; }
      if (a === "forgot-send" && o) { forgotSend(o, b); return; }
      if (a === "link-save" && o) { linkSave(o, b, false); return; }
      if (a === "link-clear" && o) { linkSave(o, b, true); return; }
      if (a === "grp-create" && o) { grpCreate(o, b); return; }
      if (a === "gw") { var ci = document.getElementById("chatInput"); if (ci) { ci.value = b.getAttribute("data-text"); ci.focus(); ci.dispatchEvent(new Event("input", { bubbles: true })); } return; }
      return;
    }
    if (!live()) return;
    var act = t.closest("[data-action]"), an = act && act.getAttribute("data-action");
    if (an === "fb-connect" || an === "google-connect" || an === "google-manage") {
      e.preventDefault(); e.stopImmediatePropagation();
      linkSheet(an === "fb-connect" ? "fb" : "g"); return;
    }
    if (an === "new-group") { e.preventDefault(); e.stopImmediatePropagation(); groupSheet(); return; }
    if (an === "gal-add") { e.preventDefault(); e.stopImmediatePropagation(); pickPhoto(); return; }
    if (an === "gal-remove") { e.preventDefault(); e.stopImmediatePropagation(); removePhoto(act.getAttribute("data-gid")); return; }
    /* #54: tapping the tab you're already on goes back to the top */
    var tab = t.closest("#tabbar .tab[data-tab]");
    if (tab && tab.getAttribute("data-tab") === S().screen) {
      setTimeout(function () { var s = document.querySelector(".screen.active .scroll"); if (s) s.scrollTo ? s.scrollTo({ top: 0, behavior: "smooth" }) : (s.scrollTop = 0); }, 30);
    }
  }, true);

  /* ================= demo-only controls hidden in the live app (Vishal approved, 22 Nov) =================
     #12 Simulate video ended, #13 demo invite link + share, #18 phone sign-up, #36 Demo sign-up row + prototype text in Settings,
     #37 Demo (offline) checkbox on sign-in, #48 Demo: simulate approval. The code stays; ?demo=1 shows them again. */
  function liveApp() {
    var forced = false; try { forced = /[?&]demo=1\b/.test(location.search); } catch (e) {}
    return !!(window.RB && RB.ready && RB.ready() && !RB.isDemo() && !forced);
  }
  var DEMO_SEL = '.rb222i-demo, .intro-proto, [data-action="intro-simulate"], [data-action="simulate-approval"], [data-action="signup-method"][data-method="phone"], .rb-demo-toggle, .more-demo-tile, [data-action="demo-signup"], .screen[data-screen="invite"] [data-action="copy-invite"], .screen[data-screen="invite"] [data-action="share-invite"], [data-nid="n-devi-d1"], [data-rec="d1"], .v211-req-card, .ov-req-count';
  function hideDemo(sc, id) {
    var on = liveApp();
    document.documentElement.classList.toggle("rb-live-app", on);
    document.body.classList.toggle("rb-live-app", on); /* some screens reset <html> classes */
    document.querySelectorAll(DEMO_SEL).forEach(function (el) {
      if (on) { if (!el.dataset.rb222iHid) { el.dataset.rb222iHid = el.style.display || "-"; el.style.setProperty("display", "none", "important"); } }
      else if (el.dataset.rb222iHid) { el.style.display = el.dataset.rb222iHid === "-" ? "" : el.dataset.rb222iHid; delete el.dataset.rb222iHid; }
    });
    if (!on) return;
    if (id === "signin" || id === "welcome") {
      sc.querySelectorAll(".hint").forEach(function (h) { if (/Demo \(offline\)/.test(h.textContent)) h.textContent = "Sign in with the email and password you used to join Rate Buddies."; });
    }
    if (id === "settings" || id === "more") {
      sc.querySelectorAll(".group-label").forEach(function (g) {
        if (/^prototype$/i.test(g.textContent.trim())) { g.classList.add("rb222i-demo"); var n = g.nextElementSibling; if (n && n.classList.contains("card")) n.classList.add("rb222i-demo"); }
      });
      sc.querySelectorAll(".settings-foot").forEach(function (f) { if (/fictional|demo|prototype/i.test(f.textContent)) f.classList.add("rb222i-demo"); });
      sc.querySelectorAll(".set-row").forEach(function (r) { if (/later build|Demo: new member/i.test(r.textContent)) r.classList.add("rb222i-demo"); });
    }
    if (id === "notif-settings") { /* #14 */
      sc.querySelectorAll(".scroll > .hint").forEach(function (h) { if (/prototype/i.test(h.textContent)) h.textContent = window.RB_PUSH_READY ? "Alerts come to this phone even when Rate Buddies is closed. Quiet hours use your phone\u2019s time zone. You can also turn alerts off in your phone\u2019s settings." : "These choices are saved to your account. Alerts appear in Rate Buddies; phone alerts arrive once push is switched on for your build."; });
    }
    if (id === "invite" && !sc.querySelector(".rb222i-invite")) {
      var inp = sc.querySelector('input[value*="ratebuddies.demo"]');
      if (inp) {
        var f = inp.closest(".field") || inp; f.classList.add("rb222i-demo");
        sc.insertAdjacentHTML("beforeend", "");
        f.insertAdjacentHTML("afterend", '<div class="banner info rb222i-invite">Invite links are coming soon. For now, ask them to download Rate Buddies and sign up with their email. You\u2019ll see them once the admin approves them.</div>');
      }
    }
  }

  /* ================= paint loop ================= */
  function versionLabels(sc) {
    sc.querySelectorAll(".v21-ver").forEach(function (v) { if (v.textContent.indexOf("build 17") < 0) v.textContent = "Rate Buddies " + BUILD; });
    sc.querySelectorAll(".set-row").forEach(function (r) {
      var a = r.querySelector(".a"), b = r.querySelector(".b");
      if (a && b && a.textContent.trim() === "Version" && b.textContent.indexOf("build 17") < 0) b.textContent = BUILD.replace(/^v/, "Version ");
    });
  }
  function paint() {
    var sc = active(); if (!sc) return;
    var id = scr();
    versionLabels(sc);
    hideDemo(sc, id);
    if (id === "signin" && rb()) forgotLink(sc);
    if (!live()) return;
    syncFlags();
    if (id === "settings") { settingsRows(sc); settingsLinks(sc); }
    if (id === "members") incomingBlock(sc);
    if (id === "chat-group") groupWelcome(sc);
    if (id === "chat-dm") { /* #25: refresh the header line once presence arrives */
      var sub = sc.querySelector(".app-header .ht div"), c = (window.TC12 && TC12.liveChats && (TC12.liveChats() || []).filter(function (x) { return x.id === S().chatId; })[0]);
      if (sub && c && c.memberId) { var s2 = seen(c.memberId); if (sub.textContent !== s2) { sub.textContent = s2; sub.hidden = !s2; } }
    }
  }
  function tick() {
    if (!live()) return;
    beat(false); loadPresence(false); loadFeed(false); loadTutorials();
    if (S().screen === "support" || supSub) supportLive(false);
  }
  /* sync flags before each render so Settings / My profile read the real links */
  function wrapGo() {
    var TC = T(); if (!TC.go || TC.go._rb222i) return;
    var orig = TC.go;
    var w = function () { try { syncFlags(); } catch (e) {} return orig.apply(this, arguments); };
    w._rb222i = true; Object.keys(orig).forEach(function (k) { w[k] = orig[k]; });
    TC.go = w;
  }
  setInterval(function () { wrapGo(); paint(); }, 300);
  setInterval(tick, 5000);
  setTimeout(tick, 1500);
  window.TC222i = { suspended: suspended, seen: seen, presence: function () { return presence; }, linkSheet: linkSheet, BUILD: BUILD };
})();
