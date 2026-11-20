/* Rate Buddies v2.0 — welcome carousel, native chrome, afterGo hook. */
(function (root) {
  "use strict";

  function markNative() {
    try {
      if (root.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform()) {
        document.documentElement.classList.add("is-native");
      }
    } catch (e) {}
    if (window.innerWidth <= 480) document.documentElement.classList.add("is-compact");
  }

  function track() { return document.getElementById("welcomeTrack"); }
  function slides() { return document.querySelectorAll("#welcomeTrack .w20-slide"); }
  function currentIndex() {
    var t = track();
    if (!t) return 0;
    var w = t.clientWidth || 1;
    return Math.round(t.scrollLeft / w);
  }
  function showActions(on) {
    var next = document.querySelector(".w20-next");
    var actions = document.getElementById("welcomeActions");
    var skip = document.querySelector(".w20-skip");
    var root = document.querySelector(".welcome-v20");
    if (next) next.hidden = !!on;
    if (actions) actions.hidden = !on;
    if (skip) skip.hidden = !!on;
    if (root) root.classList.toggle("is-end", !!on);
  }
  function paintDots(i) {
    document.querySelectorAll("#welcomeDots button").forEach(function (b, n) {
      b.classList.toggle("on", n === i);
    });
    showActions(i >= slides().length - 1);
  }
  function goTo(i) {
    var t = track();
    var list = slides();
    if (!t || !list.length) return;
    i = Math.max(0, Math.min(list.length - 1, i));
    t.scrollTo({ left: i * t.clientWidth, behavior: "smooth" });
    paintDots(i);
  }
  function bindCarousel() {
    var t = track();
    if (!t || t._v20) return;
    t._v20 = true;
    t.addEventListener("scroll", function () { paintDots(currentIndex()); }, { passive: true });
    paintDots(currentIndex());
  }

  function afterGo(id) {
    if (id === "welcome") bindCarousel();
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("[data-action]");
    if (!btn) return;
    var a = btn.getAttribute("data-action");
    if (a === "welcome-next") {
      var i = currentIndex();
      if (i >= slides().length - 1) showActions(true);
      else goTo(i + 1);
      e.preventDefault();
    }
    if (a === "welcome-skip") {
      goTo(slides().length - 1);
      showActions(true);
      e.preventDefault();
    }
    if (a === "welcome-dot") {
      goTo(Number(btn.getAttribute("data-index") || 0));
      e.preventDefault();
    }
  });

  markNative();
  if (document.readyState !== "loading") bindCarousel();
  else document.addEventListener("DOMContentLoaded", bindCarousel);

  root.TC20 = { afterGo: afterGo, goTo: goTo, bindCarousel: bindCarousel };
})(window);
