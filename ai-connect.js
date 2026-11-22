/* Rate Buddies v2.2.2 — Connect your own AI (Grok / ChatGPT / Claude) with your own API key.
   Fewest taps: pick provider -> open its API-key page -> paste -> Test connection.
   PROTOTYPE: the key is never sent anywhere and is not stored; only provider + last 4 characters are kept on this phone.
   In the real build the key goes into the phone's secure storage (Android Keystore / iOS Keychain), never the repo. */
(function (root) {
  "use strict";
  function S() { return (root.TradeCircle && TradeCircle.state) || {}; }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  var P = {
    grok: { name: "Grok", co: "xAI", color: "#0B1F33", letter: "G", url: "https://console.x.ai/", page: "xAI API keys page", re: /^xai-[A-Za-z0-9_-]{20,}$/, ex: "xai-…", cost: "Pay as you go with xAI credits (separate from X Premium / SuperGrok)." },
    chatgpt: { name: "ChatGPT", co: "OpenAI", color: "#10A37F", letter: "C", url: "https://platform.openai.com/api-keys", page: "OpenAI API keys page", re: /^sk-[A-Za-z0-9_-]{20,}$/, ex: "sk-…", cost: "Pay as you go on the OpenAI API (separate from ChatGPT Plus)." },
    claude: { name: "Claude", co: "Anthropic", color: "#D97757", letter: "C", url: "https://console.anthropic.com/settings/keys", page: "Claude Console API keys page", re: /^sk-ant-[A-Za-z0-9_-]{20,}$/, ex: "sk-ant-…", cost: "Pay as you go in the Claude Console (separate from Claude Pro)." }
  };
  var LS = "rb_ai_link";
  function link() { try { return JSON.parse(localStorage.getItem(LS) || "null"); } catch (e) { return null; } }
  function setLink(v) { try { if (v) localStorage.setItem(LS, JSON.stringify(v)); else localStorage.removeItem(LS); } catch (e) {} }
  function close() { var o = document.getElementById("rb-ai-sheet"); if (o) o.remove(); }
  function open(pid) {
    close();
    var p = P[pid]; if (!p) return;
    var html = '<div id="rb-ai-sheet" class="rb-ai-sheet" role="dialog" aria-modal="true" aria-label="Connect ' + p.name + '"><div class="rb-ai-card" data-provider="' + pid + '">' +
      '<div class="rb-ai-head"><span class="rb-ai-mark" style="background:' + p.color + '">' + p.letter + '</span><b>Connect ' + p.name + '</b><button type="button" class="rb-ai-x" aria-label="Close">\u00d7</button></div>' +
      '<ol class="rb-ai-steps">' +
      '<li><span class="rb-ai-n">1</span><div><b>Get your key</b><a class="btn btn-ghost ink rb-ai-open" href="' + p.url + '" target="_blank" rel="noopener noreferrer">Open the ' + p.page + ' \u2197</a><small>Sign in, tap Create key, then copy it.</small></div></li>' +
      '<li><span class="rb-ai-n">2</span><div><b>Paste it here</b><div class="rb-ai-paste"><input type="password" autocomplete="off" spellcheck="false" placeholder="' + p.ex + '" aria-label="' + p.name + ' API key"><button type="button" class="rb-ai-pastebtn" data-action="rb-ai-paste">Paste</button></div></div></li>' +
      '<li><span class="rb-ai-n">3</span><div><b>Test it</b><button type="button" class="btn btn-primary rb-ai-test" data-action="rb-ai-test">Test connection</button><div class="rb-ai-msg" aria-live="polite"></div></div></li>' +
      "</ol>" +
      '<button type="button" class="rb-ai-video" data-action="rb-ai-video">Don\u2019t know how? <span>\u25B6 Watch the video (1 min)</span></button>' +
      '<p class="rb-ai-fine">Your key stays on this phone in secure storage. Rate Buddies never sees it. ' + esc(p.cost) + " You can remove it any time.</p>" +
      '<p class="rb-ai-ver">Rate Buddies v2.2.2</p>' +
      "</div></div>";
    (document.getElementById("phone") || document.body).insertAdjacentHTML("beforeend", html);
  }
  function banner() {
    var sc = document.querySelector('.screen.active[data-screen="ai-assistant"]'); if (!sc) return;
    var L = link(), old = sc.querySelector(".rb-ai-on"); if (old) old.remove();
    if (!L || !P[L.provider]) {
      sc.querySelectorAll('.connect-card[data-provider]').forEach(function (c) { var t = c.querySelector(".mock-tag"); if (t && P[c.getAttribute("data-provider")]) { t.textContent = "Connect"; c.classList.remove("on"); } });
      return;
    }
    var p = P[L.provider];
    var hero = sc.querySelector(".scroll .auth-hero");
    var b = '<div class="rb-ai-on"><span class="rb-ai-mark" style="background:' + p.color + '">' + p.letter + '</span><div class="rb-ai-on-t"><b>' + p.name + ' connected \u2713</b><span>Key ending \u2022\u2022\u2022\u2022' + esc(L.last4) + " \u00b7 tested " + esc(L.when) + '</span></div><button type="button" class="rb-ai-chg" data-action="rb-ai-change" data-provider="' + L.provider + '">Change</button></div>';
    if (hero) hero.insertAdjacentHTML("afterend", b);
    sc.querySelectorAll('.connect-card[data-provider]').forEach(function (c) {
      var t = c.querySelector(".mock-tag"); if (!t) return;
      var id = c.getAttribute("data-provider");
      if (P[id]) { t.textContent = id === L.provider ? "Connected" : "Connect"; c.classList.toggle("on", id === L.provider); }
    });
  }
  document.addEventListener("click", function (e) {
    var t = e.target;
    var card = t.closest && t.closest('[data-action="ai-connect"], [data-action="rb-ai-change"]');
    if (card && P[card.getAttribute("data-provider")]) { e.preventDefault(); e.stopPropagation(); open(card.getAttribute("data-provider")); return; }
    if (t.closest && (t.closest(".rb-ai-x") || t.id === "rb-ai-sheet")) { close(); return; }
    var a = t.closest && t.closest('[data-action^="rb-ai-"]'); if (!a) return;
    var sheet = a.closest(".rb-ai-card"), act = a.getAttribute("data-action");
    if (act === "rb-ai-video") {
      e.preventDefault(); e.stopPropagation(); close();
      S()._tutChip = "ai-assistant";
      if (root.TradeCircle && TradeCircle.go) TradeCircle.go("tutorials");
      return;
    }
    if (act === "rb-ai-paste") {
      e.preventDefault(); e.stopPropagation();
      var inp0 = sheet.querySelector("input");
      try { navigator.clipboard.readText().then(function (v) { inp0.value = (v || "").trim(); }, function () { inp0.focus(); }); } catch (e2) { inp0.focus(); }
      return;
    }
    if (act === "rb-ai-test") {
      e.preventDefault(); e.stopPropagation();
      var pid = sheet.getAttribute("data-provider"), p = P[pid], inp = sheet.querySelector("input"), msg = sheet.querySelector(".rb-ai-msg");
      var key = String(inp.value || "").trim();
      if (!p.re.test(key)) { msg.className = "rb-ai-msg bad"; msg.textContent = "That doesn\u2019t look like a " + p.name + " key (it starts with " + p.ex.replace("\u2026", "") + "). Copy it again and paste."; return; }
      /* Prototype: no network call. Real build: one tiny test request to the provider, straight from the phone. */
      var when = new Date().toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", timeZone: "Australia/Perth" });
      setLink({ provider: pid, last4: key.slice(-4), when: when });
      S().aiProvider = pid;
      inp.value = ""; key = "";
      close();
      if (root.TradeCircle && TradeCircle.go) TradeCircle.go("ai-assistant");
      setTimeout(banner, 60);
      return;
    }
  }, true);
  if (root.TradeCircle && TradeCircle.go && !TradeCircle.go.__rbAi) {
    var g0 = TradeCircle.go;
    TradeCircle.go = function () { var r = g0.apply(this, arguments); setTimeout(banner, 30); setTimeout(banner, 400); return r; };
    TradeCircle.go.__rbAi = true;
  }
  root.RBAIConnect = { open: open, close: close, banner: banner, link: link, setLink: setLink };
})(window);
document.addEventListener("DOMContentLoaded", function () { setTimeout(function () { window.RBAIConnect && RBAIConnect.banner(); }, 300); setTimeout(function () { window.RBAIConnect && RBAIConnect.banner(); }, 1200); });
