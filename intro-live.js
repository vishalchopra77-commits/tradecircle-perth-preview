/* v2.2.2 build 17 — Welcome intro video fix (Vishal: video stopped after a few seconds, Continue never unlocked).
   1. The intro screen is re-rendered by live syncs (rb-live rerender -> TC.go(current screen)), which rebuilt the
      <iframe> and reset the video. While the intro iframe is up, a repeat go("intro-video") now only refreshes the
      progress bar in place, so the player is never rebuilt.
   2. Real watch tracking with the YouTube IFrame API: only time actually played counts (seeking ahead does not),
      measured against the video's REAL length from the player (not the admin's duration_sec, which can be wrong).
   3. Fallback when the player API can't report in the WebView: unlock after duration_sec of elapsed play time
      while the screen is open and visible.
   The requirement, the text "You must watch this video — only takes 2 mins" and every button stay. */
(function () {
  "use strict";
  var root = window;
  function T() { return root.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function Tut() { return root.TCTutorials; }
  function intro() { var d = Tut() && Tut().load(); return { v: d && d.intro, need: (d && d.minWatchedPct) || 90 }; }
  function prog() {
    var s = S();
    s._introProg = s._introProg || { watched: 0, duration: 200, playing: false, unlocked: false };
    return s._introProg;
  }
  function liveNow() { return !!(root.RBLive && RBLive.isLive && RBLive.isLive()) || !!(root.RB && RB.session && !(RB.isDemo && RB.isDemo())); }
  /* the old prototype started the bar at a fake 50s; a real member starts at 0 */
  var zeroed = false;
  function zeroForLive() { if (!zeroed && liveNow()) { zeroed = true; var p = prog(); if (!p.unlocked && !p._real) { p.watched = 0; p._real = true; } } }

  /* ---------- 1. never rebuild the player ---------- */
  function wrapGo() {
    var TC = T();
    if (!TC.go || TC.go._rbIntro17) return;
    var orig = TC.go;
    function wrapped(id, opts) {
      if (id === "intro-video" && S().screen === "intro-video" && document.getElementById("introFrame") && prog().playing && !(opts && opts.rebuild)) {
        paint();
        return;
      }
      return orig.apply(TC, arguments);
    }
    Object.keys(orig).forEach(function (k) { wrapped[k] = orig[k]; });
    wrapped._rbIntro17 = true;
    TC.go = wrapped;
  }

  /* ---------- 2. YouTube IFrame API tracking ---------- */
  var ytLoading = false, player = null, playerFrame = null, apiSeen = false, lastT = null, lastTick = 0;
  var playStart = 0, elapsed = 0, lastWall = 0;
  function loadYT() {
    if (root.YT && YT.Player) return true;
    if (!ytLoading) {
      ytLoading = true;
      var s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; s.async = true;
      document.head.appendChild(s);
    }
    return false;
  }
  function fixEmbed(fr) {
    /* enablejsapi + origin so the API can talk to the WebView page; autoplay because the member already tapped Play */
    if (fr.dataset.rb17) return;
    fr.dataset.rb17 = "1";
    try {
      var u = new URL(fr.getAttribute("src"), location.href);
      if (/youtube(-nocookie)?\.com$/.test(u.hostname.replace(/^www\./, "")) || /youtube/.test(u.hostname)) {
        u.searchParams.set("enablejsapi", "1");
        u.searchParams.set("playsinline", "1");
        u.searchParams.set("autoplay", "1");
        u.searchParams.set("rel", "0");
        if (/^https?:/.test(location.origin)) u.searchParams.set("origin", location.origin);
        fr.setAttribute("src", u.toString());
      }
    } catch (e) {}
    fr.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
  }
  function attach() {
    var fr = document.getElementById("introFrame");
    if (!fr) { player = null; playerFrame = null; return; }
    fixEmbed(fr);
    if (!playStart) { playStart = Date.now(); lastWall = Date.now(); }
    if (playerFrame === fr) return;
    if (!loadYT()) return;
    playerFrame = fr;
    try {
      player = new YT.Player(fr, {
        events: {
          onReady: function () { apiSeen = true; try { player.playVideo(); } catch (e) {} },
          onStateChange: function (ev) { apiSeen = true; if (ev.data === 0) tick(true); }
        }
      });
    } catch (e) { player = null; }
  }
  function tick(ended) {
    var p = prog(), i = intro();
    if (!i.v || S().screen !== "intro-video" || !p.playing) { lastT = null; lastWall = Date.now(); return; }
    attach();
    var now = Date.now();
    /* fallback clock: elapsed time while the intro is open, playing and visible */
    if (document.visibilityState !== "hidden") elapsed += Math.min(2000, now - (lastWall || now)) / 1000;
    lastWall = now;
    var st = -1, t = null, d = 0;
    try { if (player && player.getPlayerState) { st = player.getPlayerState(); t = player.getCurrentTime(); d = player.getDuration(); } } catch (e) {}
    if (typeof st === "number" && st >= 0) apiSeen = true;
    if (d > 0) p.duration = d, p._realDur = true;
    if (apiSeen && t != null) {
      if (lastT != null && (st === 1 || ended)) {
        var dt = t - lastT;
        if (dt > 0 && dt <= 3) p.watched = Math.min(p.duration, p.watched + dt); /* a jump forward (seek) does not count */
      }
      lastT = t;
    } else if (!apiSeen && playStart && now - playStart > 8000) {
      /* the player API never answered: count elapsed play time against duration_sec */
      var dur = i.v.durationSec || p.duration || 200;
      p.duration = dur; p._fallback = true;
      p.watched = Math.min(dur, elapsed);
    }
    var pct = p.duration ? (p.watched / p.duration) * 100 : 0;
    if (!p.unlocked && (pct >= i.need || (p._fallback && elapsed >= (i.v.durationSec || p.duration)))) p.unlocked = true;
    paint();
  }

  /* ---------- in-place progress (no re-render) ---------- */
  function paint() {
    var sc = document.querySelector('[data-screen="intro-video"]');
    if (!sc) return;
    var p = prog(), i = intro();
    var pct = p.duration ? Math.min(100, Math.round((p.watched / p.duration) * 100)) : 0;
    var unlocked = p.unlocked || pct >= i.need;
    if (unlocked) p.unlocked = true;
    var bar = sc.querySelector(".intro-progress .bar i"); if (bar) bar.style.width = (unlocked ? Math.max(pct, i.need) : pct) + "%";
    var lab = sc.querySelector(".intro-progress .lab");
    var want = unlocked ? "You’ve watched enough to continue." : "You must watch this video — only takes 2 mins";
    if (lab && lab.textContent !== want) lab.textContent = want;
    var btn = sc.querySelector(".intro-lock > .btn-primary, .intro-lock .btn.btn-primary");
    if (btn && unlocked && btn.disabled) {
      btn.disabled = false; btn.classList.remove("is-locked"); btn.setAttribute("data-action", "intro-finished");
    }
    sc.setAttribute("data-rb-intro", (p._fallback ? "timer" : apiSeen ? "api" : "wait") + ":" + Math.round(p.watched) + "/" + Math.round(p.duration));
  }

  /* reset the tracker whenever the member taps Play again (fresh iframe) */
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest('[data-action="intro-play"]');
    if (b) { zeroForLive(); playStart = Date.now(); lastWall = Date.now(); lastT = null; playerFrame = null; }
  }, true);

  setInterval(function () { wrapGo(); zeroForLive(); }, 300);
  setInterval(function () { tick(false); }, 1000);
  root.RBIntro17 = { state: function () { var p = prog(); var t = null, st = null; try { if (player && player.getCurrentTime) { t = player.getCurrentTime(); st = player.getPlayerState(); } } catch (e) {} return { watched: p.watched, duration: p.duration, unlocked: !!p.unlocked, api: apiSeen, fallback: !!p._fallback, elapsed: elapsed, t: t, st: st }; } };
})();
