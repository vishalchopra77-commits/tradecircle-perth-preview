/* Rate Buddies v2.1 — turn every remaining old top bar into the large design header.
   Tab screens: small label + big title + round chat/bell buttons.
   Sub-pages: round back button + big title (+ their own right-hand buttons). */
(function () {
  "use strict";

  var KICKER = {
    "fb-recommend": ["Recommendations", "Facebook"],
    "fb-recommend-open": ["Recommendations", "Facebook"],
    "fb-recommend-mine": ["Recommendations", "Facebook"],
    "fb-recommend-done": ["Recommendations", "Facebook"],
    "members": ["Circle", "Facebook"],
    "chats": ["", "Chats"],
    "notifications": ["", "Notifications"]
  };
  var SKIP = { home: 1, reviews: 1, "reviews-back": 1, "promo-queue": 1, more: 1, drawer: 1, welcome: 1 };

  var BACK_TO = { chats: "home", notifications: "home" };

  function transform(id) {
    if (SKIP[id]) return;
    var screen = document.querySelector("#screens .screen");
    var bar = screen && screen.querySelector(".app-header");
    if (!screen || !bar) return;

    var titleEl = bar.querySelector(".ht");
    var title = titleEl ? titleEl.textContent.trim() : "";
    var k = KICKER[id] || ["", title];
    var left = bar.querySelector(".header-left") || bar;
    var first = left.querySelector("button, a");
    var isMenu = first && first.getAttribute("data-action") === "open-drawer";
    var right = [];
    bar.querySelectorAll(".header-right > button, .header-right > a").forEach(function (b) { right.push(b); });
    if (!bar.querySelector(".header-right")) {
      Array.prototype.forEach.call(bar.children, function (c) {
        if (c !== first && c !== titleEl && (c.tagName === "BUTTON" || c.tagName === "A")) right.push(c);
      });
    }

    var head = document.createElement("header");
    head.className = "h21-head h21-top";
    if (first && isMenu && BACK_TO[id]) {
      first.removeAttribute("data-action");
      first.setAttribute("data-go", BACK_TO[id]);
      isMenu = false;
    }
    if (first && !isMenu) {
      first.className = "h21-round";
      first.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 19l-7-7 7-7"/></svg>';
      first.setAttribute("aria-label", "Back");
      head.appendChild(first);
    }
    var hello = document.createElement("div");
    hello.className = "h21-hello";
    hello.innerHTML = (k[0] ? '<div class="h21-date"></div>' : "") + "<h1></h1>";
    if (k[0]) hello.firstChild.textContent = k[0];
    hello.querySelector("h1").textContent = k[1] || title;
    head.appendChild(hello);
    right.forEach(function (b) {
      if (b.getAttribute("data-go") === id) return;
      b.classList.remove("icon-btn");
      b.classList.add("h21-round");
      var dot = b.querySelector(".bell-dot");
      if (dot) { dot.className = "h21-badge"; if (!dot.textContent.trim()) dot.hidden = true; }
      head.appendChild(b);
    });

    var scroll = screen.querySelector(".scroll");
    var seg = screen.querySelector(".fb-seg-bar");
    bar.parentNode.removeChild(bar);
    if (scroll) {
      if (seg && seg.parentNode !== scroll) scroll.insertBefore(seg, scroll.firstChild);
      scroll.insertBefore(head, scroll.firstChild);
    } else {
      screen.insertBefore(head, screen.firstChild);
    }
    screen.classList.remove("has-header");
    screen.classList.add("h21", "h21-sub");
  }

  /* Cards get a coloured left edge that matches the member's trade colour. */
  var CARD_SEL = ".h21-card, .member-card, .rec-card, .req-card, .fb-card, .chat-card";
  function accent() {
    document.querySelectorAll("#screens " + CARD_SEL.split(", ").join(", #screens ")).forEach(function (c) {
      if (c.classList.contains("h21-me") || c.querySelector(".h21-grid")) return;
      var a = c.querySelector(".avatar-trade[data-acc]");
      var col = a ? a.getAttribute("data-acc") : (c.querySelector(".h21-ico, .fb-ico") ? "#1877F2" : "");
      c.classList.add("rb-acc");
      if (col) c.style.setProperty("--acc", col);
    });
  }
  window.RBAccent = accent;
  function watch() {
    var host = document.getElementById("screens");
    if (!host || host._rbAcc) return;
    host._rbAcc = true;
    var t;
    new MutationObserver(function () { clearTimeout(t); t = setTimeout(function () { try { accent(); } catch (e) {} }, 0); })
      .observe(host, { childList: true, subtree: true });
    try { accent(); } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", watch); else watch();

  function install() {
    if (!window.TC20 || TC20._v21) return;
    TC20._v21 = true;
    var prev = TC20.afterGo;
    TC20.afterGo = function (id) {
      if (prev) prev.apply(this, arguments);
      try { transform(id); } catch (e) {}
      try { accent(); } catch (e) {}
    };
    var st = window.RateBuddies && RateBuddies.state;
    if (st && st.screen) {
      /* Screens from later scripts (e.g. Facebook Recommend) may not have existed on the first draw. */
      var shown = document.querySelector("#screens .screen");
      var shownId = shown && shown.getAttribute("data-screen");
      if (shownId !== st.screen && RateBuddies.go && st.screen !== "member") {
        try { RateBuddies.go(st.screen); } catch (e) {}
      } else {
        try { transform(st.screen); } catch (e) {}
      }
    }
  }
  if (window.TC20) install();
  else document.addEventListener("DOMContentLoaded", install);
})();
