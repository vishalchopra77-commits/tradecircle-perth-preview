/* Rate Buddies v2.2.2 build 16 — QA #47: the AI assistant and Voice screens work in the live app.
   1. Everyday questions (friend requests, Google reviews, messages, queue place, alerts, "open …", reminders) are
      answered on the phone from the member's own live data. No AI key is needed for these.
   2. Other questions go to an AI: the member's own key (Connect Grok / ChatGPT / Claude: tested for real, kept only
      on this phone), otherwise the ai-assist Edge Function (an admin key). With neither, the answer says
      "Needs an AI key".
   3. Voice: speech-to-text where the phone's web view supports it (otherwise the keyboard mic), answers read aloud
      with the phone's speech engine unless the admin turned voice off.
   Demo mode keeps the old mock screens. */
(function (root) {
  "use strict";
  function T() { return root.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function live() { return !!(root.RBLive && RBLive.isLive && RBLive.isLive()); }
  function db() { return RB.client; }
  function myId() { return RB.profile && RB.profile.id; }
  function go(id) { if (T().go) T().go(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function members() { return (T().MEMBERS || []).filter(function (m) { return m && m.id !== myId() && /^[0-9a-f-]{36}$/i.test(m.id); }); }
  function mem(id) { return (T().MEMBERS || []).filter(function (m) { return m.id === id; })[0]; }
  function nm(m) { return m ? ((m.first || "") + " " + (m.last || "")).trim() || "A member" : "A member"; }
  function list(a) { return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }

  var KEY_LS = "rb_ai_key_v1"; /* {provider, key} on this phone only */
  var P = {
    grok: { name: "Grok", re: /^xai-[A-Za-z0-9_-]{20,}$/ },
    chatgpt: { name: "ChatGPT", re: /^sk-[A-Za-z0-9_-]{20,}$/ },
    claude: { name: "Claude", re: /^sk-ant-[A-Za-z0-9_-]{20,}$/ }
  };
  function ownKey() { try { return JSON.parse(localStorage.getItem(KEY_LS) || "null"); } catch (e) { return null; } }
  var SYSTEM = "You are the Rate Buddies assistant inside a members-only app for Australian tradies who swap genuine Google reviews and Facebook recommendations. Answer in plain Australian English in 1 to 3 short sentences that can be read aloud while driving. Never write a review for the member and never claim to send friend requests.";

  async function callProvider(pid, key, msg) {
    var r, j;
    if (pid === "claude") {
      r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true", "content-type": "application/json" },
        body: JSON.stringify({ model: "claude-3-5-haiku-latest", max_tokens: 300, system: SYSTEM, messages: [{ role: "user", content: msg }] }) });
      j = await r.json().catch(function () { return {}; });
      if (!r.ok) throw new Error((j.error && j.error.message) || ("HTTP " + r.status));
      return (j.content || []).map(function (c) { return c.text || ""; }).join("").trim();
    }
    var url = pid === "grok" ? "https://api.x.ai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
    r = await fetch(url, { method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({ model: pid === "grok" ? "grok-3-mini" : "gpt-4o-mini", max_tokens: 300, messages: [{ role: "system", content: SYSTEM }, { role: "user", content: msg }] }) });
    j = await r.json().catch(function () { return {}; });
    if (!r.ok) throw new Error((j.error && (j.error.message || j.error)) || ("HTTP " + r.status));
    return String((j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || "").trim();
  }
  async function askAI(msg) {
    var k = ownKey();
    if (k && P[k.provider] && k.key) {
      try { return { text: await callProvider(k.provider, k.key, msg), via: P[k.provider].name }; }
      catch (e) { return { text: P[k.provider].name + " didn\u2019t answer: " + (e.message || "error") + ". Check your key in Connect your assistant.", err: true }; }
    }
    try {
      var r = await db().functions.invoke("ai-assist", { body: { message: msg, provider: (RBAIConnect && RBAIConnect.link() && RBAIConnect.link().provider) || "grok" } });
      var d = r.data || {};
      if (d.reply) return { text: d.reply, via: d.provider };
      if (d.needs_key) return { text: "Needs an AI key. I can answer questions about your requests, reviews, messages, queue and alerts. For other questions, connect Grok, ChatGPT or Claude with your own key below.", needsKey: true };
      return { text: d.error || "The assistant couldn\u2019t answer. Try again.", err: true };
    } catch (e2) { return { text: "Needs an AI key. Connect your own assistant below to ask other questions.", needsKey: true }; }
  }

  /* ---------- everyday questions from live data ---------- */
  var NAV = [[/chat|message/, "chats"], [/review/, "reviews"], [/setting/, "settings"], [/notification/, "notifications"], [/queue|promotion/, "fb-recommend"],
    [/alert/, "rec-alerts"], [/tutorial|video/, "tutorials"], [/support|help/, "support"], [/my profile|profile/, "me"], [/member|tradie/, "members"], [/home/, "home"]];
  async function local(q) {
    var s = q.toLowerCase().replace(/[\u2019']/g, "'");
    var m;
    if (/friend request|friend req|wants? to be (my )?friend/.test(s)) {
      var inc = Object.keys(S()._relIn || {}).map(mem).filter(Boolean);
      if (!inc.length) return { text: "No new Facebook friend requests right now." };
      return { text: list(inc.map(nm)) + (inc.length === 1 ? " wants" : " want") + " to be Facebook friends. I\u2019ll open Facebook › Circle so you can confirm. You tap the button yourself.", go: "fb-recommend" };
    }
    if (/who (left|gave|wrote)|review(ed)? me|my (google )?reviews|any reviews/.test(s)) {
      var r = await db().from("google_reviews").select("from_member_id,done_at").eq("to_member_id", myId()).eq("status", "done").order("done_at", { ascending: false }).limit(5);
      var sw = await db().from("review_swaps").select("id").eq("recipient_id", myId()).eq("status", "pending");
      var who = (r.data || []).map(function (x) { return nm(mem(x.from_member_id)); });
      var t = who.length ? "Your latest Google reviews came from " + list(who) + "." : "No Google reviews from the circle yet.";
      var n = (sw.data || []).length; if (n) t += " " + n + " member" + (n > 1 ? "s have" : " has") + " asked you for a review swap.";
      return { text: t, go: "reviews" };
    }
    if (/(read|any|latest|new|unread).*(message|chat)|message/.test(s) && !/^open/.test(s)) {
      var chats = (root.TC12 && TC12.liveChats && TC12.liveChats()) || [];
      var un = chats.filter(function (c) { return c.unread > 0; });
      if (!un.length) return { text: "No unread messages." };
      return { text: un.slice(0, 3).map(function (c) { var last = c.messages && c.messages[c.messages.length - 1]; var from = c.type === "group" ? (c.name || "Group") : nm(mem(c.memberId)); return from + ": " + (last ? last.text : c.preview); }).join(". ") + ".", go: "chats" };
    }
    if (/queue|where am i|my turn|promotion/.test(s)) {
      var qq = await db().from("facebook_queue").select("member_id,place,status,scheduled_for").eq("status", "waiting").order("place", { ascending: true });
      var rows = qq.data || [], i = rows.findIndex(function (x) { return x.member_id === myId(); });
      if (i < 0) return { text: "You\u2019re not in the Facebook promotion queue. Open Facebook › Queue to join.", go: "fb-recommend" };
      return { text: "You\u2019re number " + (i + 1) + " of " + rows.length + " in the Facebook promotion queue" + (rows[i].scheduled_for ? ", booked for " + new Date(rows[i].scheduled_for).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" }) : "") + "." };
    }
    if (/alert|recommendation/.test(s)) {
      var since = new Date(Date.now() - 7 * 864e5).toISOString();
      var ra = await db().from("recommendation_requests").select("trade,suburb,created_at").eq("status", "approved").gte("created_at", since).order("created_at", { ascending: false });
      var al = ra.data || [];
      if (!al.length) return { text: "No recommendation alerts this week." };
      return { text: al.length + " recommendation alert" + (al.length > 1 ? "s" : "") + " this week. The latest asks for " + (al[0].trade || "a tradie") + (al[0].suburb ? " in " + al[0].suburb : "") + ".", go: "rec-alerts" };
    }
    if ((m = s.match(/remind me (?:to )?(.+?)(?: (tomorrow|tonight|in an hour))?$/))) {
      var what = m[1].replace(/\b(tomorrow|tonight)\b/g, "").trim(), when = new Date();
      if (m[2] === "tonight") when.setHours(19, 0, 0, 0); else if (m[2] === "in an hour") when = new Date(Date.now() + 36e5); else { when.setDate(when.getDate() + 1); when.setHours(8, 0, 0, 0); }
      var c = root.Capacitor, LN = c && c.isNativePlatform && c.isNativePlatform() && c.Plugins && c.Plugins.LocalNotifications;
      if (!LN) return { text: "Reminders work in the Rate Buddies phone app. Open it on your phone and ask again." };
      try {
        var pr = await LN.checkPermissions(); if (pr.display !== "granted") pr = await LN.requestPermissions();
        if (pr.display !== "granted") return { text: "Allow notifications for Rate Buddies first, then ask again." };
        await LN.schedule({ notifications: [{ id: Math.floor(Date.now() / 1000) % 2147483647, title: "Rate Buddies reminder", body: what.charAt(0).toUpperCase() + what.slice(1), schedule: { at: when } }] });
        return { text: "Done. I\u2019ll remind you to " + what + " " + (m[2] || "tomorrow at 8 am") + "." };
      } catch (e) { return { text: "I couldn\u2019t set that reminder: " + (e.message || "error") + "." }; }
    }
    if ((m = s.match(/^(?:open|show)(?: me)? (\w+)'?s? (facebook|profile|page|card)/)) && !/^(my|the|a)$/.test(m[1])) {
      var hit = members().filter(function (x) { return String(x.first || "").toLowerCase() === m[1] || nm(x).toLowerCase().indexOf(m[1]) === 0; })[0];
      if (!hit) return { text: "I couldn\u2019t find a member called " + m[1] + "." };
      S().selectedMember = hit.id;
      if (m[2] === "facebook" && hit.facebook) return { text: "Opening " + nm(hit) + "\u2019s Facebook profile. Tap Add friend yourself if you want to.", url: hit.facebook };
      return { text: "Opening " + nm(hit) + "\u2019s member card.", go: "member" };
    }
    if (/^(open|go to|show)\b/.test(s)) {
      for (var k = 0; k < NAV.length; k++) if (NAV[k][0].test(s)) return { text: "Opening " + s.replace(/^(open|go to|show)( me)?( my)?\s*/, "") + ".", go: NAV[k][1] };
    }
    if (/^(help|what can you do)/.test(s)) return { text: "Ask me: any new friend requests, who left me a Google review, read my messages, where am I in the queue, any recommendation alerts, open Sam's profile, or remind me to call Jack tomorrow." };
    return null;
  }

  /* ---------- talking ---------- */
  var voiceOn = true;
  function speak(t) {
    if (!voiceOn || !root.speechSynthesis || !t) return;
    try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(t); u.lang = "en-AU"; u.rate = 1; speechSynthesis.speak(u); } catch (e) {}
  }
  function logPush(who, text) { var L = S()._aiLiveLog = S()._aiLiveLog || []; L.push({ who: who, text: text }); if (L.length > 30) L.splice(0, L.length - 30); }
  var busy = false;
  async function ask(q) {
    q = String(q || "").trim(); if (!q || busy) return;
    busy = true; logPush("you", q); paint(true);
    var a = null;
    try { a = await local(q); } catch (e) { a = { text: "I couldn\u2019t read that from your account just now. Try again." }; }
    if (!a) a = await askAI(q);
    busy = false;
    logPush("ai", a.text); paint(true); speak(a.text);
    if (a.url) { try { root.open(a.url, "_blank", "noopener"); } catch (e3) {} }
    if (a.go) setTimeout(function () { var sc = document.querySelector(".screen.active"); var on = sc && /ai-/.test(sc.getAttribute("data-screen") || ""); if (on) addGoBtn(a.go); }, 50);
  }
  function addGoBtn(id) {
    var box = document.querySelector(".screen.active .rb-ail-log"); if (!box) return;
    var labels = { chats: "Open Chats", reviews: "Open Reviews", "fb-recommend": "Open Facebook", "rec-alerts": "Open Alerts", member: "Open member card", me: "Open my profile" };
    box.insertAdjacentHTML("beforeend", '<button type="button" class="btn btn-ghost ink rb-ail-go" data-go="' + esc(id) + '">' + esc(labels[id] || "Open") + "</button>");
  }

  /* ---------- speech to text ---------- */
  var REC = root.SpeechRecognition || root.webkitSpeechRecognition, rec = null;
  function listen() {
    var inp = document.querySelector(".screen.active .rb-ail-in");
    if (!REC) { if (inp) inp.focus(); return; }
    try {
      if (rec) { rec.abort(); rec = null; }
      rec = new REC(); rec.lang = "en-AU"; rec.interimResults = false; rec.maxAlternatives = 1;
      var mic = document.querySelector(".screen.active .ai-mic"); if (mic) mic.classList.add("rb-ail-on");
      rec.onresult = function (ev) { var t = ev.results[0][0].transcript; ask(t); };
      rec.onerror = function () { if (inp) inp.focus(); };
      rec.onend = function () { var m2 = document.querySelector(".screen.active .ai-mic"); if (m2) m2.classList.remove("rb-ail-on"); rec = null; };
      rec.start();
    } catch (e) { if (inp) inp.focus(); }
  }

  /* ---------- screens ---------- */
  var CHIPS = { updates: "Any new friend requests?", reviews: "Who left me a Google review?", "open-liam": "Open my profile", messages: "Read my latest messages",
    queue: "Where am I in the promotion queue?", alerts: "Any recommendation alerts?", remind: "Remind me to check my reviews tomorrow" };
  function askBox(ph) {
    return '<div class="rb-ail-ask"><input class="rb-ail-in" type="text" enterkeyhint="send" autocomplete="off" placeholder="' + esc(ph) + '" aria-label="Ask the assistant">' +
      '<button type="button" class="btn btn-primary rb-ail-send" data-ail="send">Ask</button></div>';
  }
  function logHtml() {
    var L = S()._aiLiveLog || [];
    return L.map(function (l) { return '<div class="voice-line ' + (l.who === "you" ? "you" : "ai") + '">' + esc(l.text) + "</div>"; }).join("") + (busy ? '<div class="voice-line ai rb-ail-wait">Thinking\u2026</div>' : "");
  }
  function paint(force) {
    if (!live()) return;
    var sc = document.querySelector(".screen.active"); if (!sc) return;
    var id = sc.getAttribute("data-screen");
    if (id === "ai-assistant") {
      if (!sc.dataset.ailDone || force) {
        sc.dataset.ailDone = 1;
        var hero = sc.querySelector(".scroll .auth-hero p");
        if (hero) hero.textContent = "Ask about your friend requests, reviews, messages, queue and alerts. Answers come from your Rate Buddies account. For other questions, connect your own Grok, ChatGPT or Claude key.";
        var other = sc.querySelector('.connect-card[data-provider="other"]'); if (other) other.style.setProperty("display", "none", "important");
        sc.querySelectorAll(".cmd-chip[data-cmd]").forEach(function (c) { var t = CHIPS[c.getAttribute("data-cmd")]; if (t) c.textContent = "\u201c" + t + "\u201d"; });
        sc.querySelectorAll(".hint").forEach(function (h) { if (/Tap the mic, then say/.test(h.textContent)) h.textContent = REC ? "Tap the mic and speak, or type a question." : "Tap the mic to open Voice, or type a question below."; });
        var lbl = [].filter.call(sc.querySelectorAll(".group-label"), function (g) { return /voice command/i.test(g.textContent); })[0];
        if (lbl) lbl.textContent = "Ask a question";
        var mic = sc.querySelector(".ai-mic");
        if (mic && !sc.querySelector(".rb-ail-ask")) mic.insertAdjacentHTML("beforebegin", askBox("e.g. Any new friend requests?") + '<div class="voice-log rb-ail-log" aria-live="polite"></div>');
      }
      var on = sc.querySelector(".rb-ai-on");
      if (on && !on.querySelector(".rb-ail-rm") && ownKey()) on.insertAdjacentHTML("beforeend", '<button type="button" class="rb-ai-chg rb-ail-rm" data-ail="rm">Remove</button>');
      var lg = sc.querySelector(".rb-ail-log"); if (lg && (force || !lg.dataset.n)) { lg.innerHTML = logHtml(); lg.dataset.n = 1; }
    }
    if (id === "ai-voice") {
      sc.querySelectorAll('[data-action="ai-open-fb"], [data-go="member"][data-id="liam"]').forEach(function (b) { if (b.style.getPropertyPriority("display") !== "important") b.style.setProperty("display", "none", "important"); });
      if (!sc.dataset.ailDone || force) {
        sc.dataset.ailDone = 1;
        var h2 = sc.querySelector(".auth-hero h2"), p = sc.querySelector(".auth-hero p");
        if (h2) h2.textContent = "Voice";
        if (p) p.textContent = REC ? "Tap the mic and ask. Answers are read aloud." : "Type your question, or use your keyboard\u2019s mic. Answers are read aloud.";
        sc.querySelectorAll('[data-action="ai-open-fb"], [data-go="member"][data-id="liam"]').forEach(function (b) { b.style.setProperty("display", "none", "important"); });
        sc.querySelectorAll(".hint").forEach(function (h) { if (/You tap Add friend yourself/.test(h.textContent)) h.style.setProperty("display", "none", "important"); });
        var m3 = sc.querySelector(".ai-mic"); if (m3) { m3.setAttribute("aria-label", "Speak a question"); }
        var log = sc.querySelector(".voice-log"); if (log) log.classList.add("rb-ail-log");
        if (m3 && !sc.querySelector(".rb-ail-ask")) m3.insertAdjacentHTML("afterend", askBox("Type a question"));
      }
      var lg2 = sc.querySelector(".rb-ail-log"); if (lg2 && (force || !lg2.dataset.n)) { lg2.innerHTML = logHtml() || '<p class="hint" style="text-align:center">Try \u201cAny new friend requests?\u201d</p>'; lg2.dataset.n = 1; }
    }
  }
  setInterval(function () { paint(false); }, 400);

  /* ---------- clicks (window capture: before the mock handlers) ---------- */
  root.addEventListener("click", function (e) {
    if (!live()) return;
    var t = e.target; if (!t || !t.closest) return;
    var b = t.closest('button[data-ail], [data-action="ai-cmd"], [data-action="ai-next"], [data-action="rb-ai-test"]'); if (!b) return;
    var a = b.getAttribute("data-ail") || b.getAttribute("data-action");
    if (a === "rb-ai-test") { e.preventDefault(); e.stopImmediatePropagation(); testKey(b); return; }
    e.preventDefault(); e.stopImmediatePropagation();
    if (a === "rm") { try { localStorage.removeItem(KEY_LS); } catch (x) {} if (root.RBAIConnect) { RBAIConnect.setLink(null); } S().aiProvider = ""; go("ai-assistant"); setTimeout(function () { if (root.RBAIConnect) RBAIConnect.banner(); paint(true); }, 60); if (T().toast) T().toast("Removed. Your key is gone from this phone."); return; }
    if (a === "send") { var inp = b.parentNode.querySelector(".rb-ail-in"); var v = inp.value; inp.value = ""; ask(v); return; }
    if (a === "ai-cmd") { var q = CHIPS[b.getAttribute("data-cmd")] || b.textContent.replace(/[\u201c\u201d]/g, ""); ask(q); return; }
    if (a === "ai-next") { listen(); return; }
  }, true);
  root.addEventListener("keydown", function (e) {
    if (!live() || e.key !== "Enter" || !e.target || !e.target.classList || !e.target.classList.contains("rb-ail-in")) return;
    e.preventDefault(); var v = e.target.value; e.target.value = ""; ask(v);
  }, true);

  /* ---------- Connect your assistant: a real test, key kept on this phone ---------- */
  async function testKey(btn) {
    var sheet = btn.closest(".rb-ai-card"), pid = sheet.getAttribute("data-provider"), p = P[pid], inp = sheet.querySelector("input"), msg = sheet.querySelector(".rb-ai-msg");
    var key = String(inp.value || "").trim();
    if (!p) return;
    if (!p.re.test(key)) { msg.className = "rb-ai-msg bad"; msg.textContent = "That doesn\u2019t look like a " + p.name + " key. Copy it again and paste."; return; }
    btn.disabled = true; msg.className = "rb-ai-msg"; msg.textContent = "Testing\u2026";
    try {
      await callProvider(pid, key, "Reply with the single word OK.");
      localStorage.setItem(KEY_LS, JSON.stringify({ provider: pid, key: key }));
      var when = new Date().toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", timeZone: "Australia/Perth" });
      if (root.RBAIConnect) { RBAIConnect.setLink({ provider: pid, last4: key.slice(-4), when: when }); RBAIConnect.close(); }
      S().aiProvider = pid; inp.value = ""; key = "";
      go("ai-assistant"); setTimeout(function () { if (root.RBAIConnect) RBAIConnect.banner(); }, 60);
      if (T().toast) T().toast(p.name + " connected. Your key stays on this phone.");
    } catch (e) {
      btn.disabled = false; msg.className = "rb-ai-msg bad"; msg.textContent = p.name + " said: " + ((e && e.message) || "the key didn\u2019t work") + ". Check the key and your credit, then try again.";
    }
  }

  /* the admin can switch spoken answers off (app_settings.ai_voice) */
  setTimeout(function load() {
    if (!live()) return setTimeout(load, 3000);
    db().from("app_settings").select("value").eq("key", "ai_voice").maybeSingle().then(function (r) { if (r.data && r.data.value === false) voiceOn = false; });
  }, 1500);
  root.RBAILive = { ask: ask, local: local, askAI: askAI };
})(window);
