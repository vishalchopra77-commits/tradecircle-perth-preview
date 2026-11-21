/* Rate Buddies v2.1.3 — admin: distinct sidebar icons, short mobile search placeholder, version label. */
(function () {
  "use strict";
  var I = {
    "Recommendation alerts": '<path d="M3 11v2a1 1 0 001 1h3l5 4V6L7 10H4a1 1 0 00-1 1z"/><path d="M16 9a3 3 0 010 6"/>',
    "Facebook recommendations": '<path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3l1-4h-4V9c0-.6.4-1 1-1z"/>',
    "Incoming requests": '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13l3.5 7v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6z"/>',
    "Video tutorials": '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/>',
    "AI integrations": '<path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>'
  };
  function fix() {
    document.querySelectorAll(".nav-btn, .bnav").forEach(function (b) {
      var lab = (b.innerText || "").split("\n")[0].trim(), s = b.querySelector("svg");
      if (I[lab] && s && !s.dataset.rb) { s.innerHTML = I[lab]; s.dataset.rb = 1; }
      if (lab === "Facebook recommendations") b.setAttribute("title", lab);
    });
    var g = document.getElementById("globalSearch");
    if (g) g.placeholder = window.innerWidth < 700 ? "Search…" : "Search members, trades, requests…";
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) if (/v2\.1\.2\b/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/v2\.1\.2\b/g, "v2.1.3");
    w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while ((n = w.nextNode())) if (/promo queue/i.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/the promo queue/g, "the Promotion queue").replace(/Promo queue/g, "Promotion queue");
    document.querySelectorAll("*").forEach(function (e) { if (e.childNodes.length && !e.closest("svg")) { var t = e.firstChild; if (t && t.nodeType === 3 && /\bGoogle review(s?)\b/.test(t.nodeValue)) t.nodeValue = t.nodeValue.replace(/\bGoogle review(s?)\b/g, "Google Review$1"); } });
  }
  var busy = false;
  new MutationObserver(function () { if (busy) return; busy = true; setTimeout(function () { fix(); busy = false; }, 30); }).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("resize", fix);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fix); else fix();
})();
/* v2.1.3: Support inbox interactions (demo) */
(function () {
  "use strict";
  document.addEventListener("click", function (e) {
    var r = e.target.closest && e.target.closest("[data-sup-sel]"); if (!r) return;
    window.__rbSupportSel = +r.getAttribute("data-sup-sel");
    var b = document.querySelector('.nav-btn[data-page="support"]'); if (b) b.click();
  });
  document.addEventListener("submit", function (e) {
    var f = e.target.closest && e.target.closest("[data-sup-reply]"); if (!f) return; e.preventDefault();
    var t = f.querySelector("textarea"); if (!t || !t.value.trim()) return;
    var th = f.closest(".panel").querySelector(".sup-thread");
    if (window.RB && !RB.isDemo() && RB.session && RB.sendSupport && window.__rbSupportMember) { RB.sendSupport(t.value.trim(), null, window.__rbSupportMember).catch(function (err) { alert("Support chat is not switched on yet (the support table has not been created)."); }); }
    th.insertAdjacentHTML("beforeend", '<div class="sup-msg out"></div>'); th.lastChild.textContent = t.value.trim(); t.value = "";
  });
  var css = document.createElement("style");
  css.textContent = ".sup-list{display:flex;flex-direction:column;gap:8px}.sup-row{display:grid;grid-template-columns:1fr;gap:4px;text-align:left;padding:12px;border:1px solid #E8EDF5;border-radius:14px;background:#fff;cursor:pointer}.sup-row.active{border-color:#2563EB;box-shadow:0 0 0 2px rgba(37,99,235,.12)}.sup-row-m{font-size:13px;color:#334155}.sup-row-w{font-size:12px;color:#475569}.sup-thread{display:flex;flex-direction:column;gap:8px;margin:8px 0 12px}.sup-msg{max-width:85%;padding:10px 12px;border-radius:14px;font-size:14px;line-height:1.45}.sup-msg span{display:block;font-size:12px;color:#475569;margin-top:4px}.sup-msg.in{background:#F1F5F9;color:#0F172A}.sup-msg.out{align-self:flex-end;background:#2563EB;color:#fff}.sup-reply textarea{width:100%;box-sizing:border-box;border:1px solid #D7DEEA;border-radius:12px;padding:10px;font:inherit}.sup-reply-a .btn{white-space:nowrap;flex:0 0 auto}.sup-reply-a{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:8px}";
  document.head.appendChild(css);
})();
