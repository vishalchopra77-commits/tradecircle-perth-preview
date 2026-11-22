/* Rate Buddies v2.1.2 — Video tutorials Layout B2 (chips at top, compact lesson rows). */
(function (root) {
  "use strict";

  var CHIPS = [
    { id: "all", label: "All" },
    { id: "getting-started", label: "Getting started" },
    { id: "google-reviews", label: "Google Reviews" },
    { id: "facebook-recs", label: "Facebook" },
    { id: "your-profile", label: "Profile" }
  ];

  /* v2.2.0 (Vishal, 22 Nov): chips come from the admin Tutorial sections (TCTutorials).
     All first, then visible sections that have at least one visible video, sorted A-Z by title.
     CHIPS above is only the fallback when the store is missing. */
  function chipLabel(t) { return String(t || "").replace(/google reviews?/gi, function (m) { return /s$/i.test(m) ? "Google Reviews" : "Google Review"; }); }
  function chipList() {
    var tut = root.TCTutorials;
    if (!tut || !tut.visibleSections) return CHIPS;
    var secs = (tut.visibleSections() || []).filter(function (sec) { return (tut.videosIn(sec.id) || []).length > 0; });
    secs.sort(function (a, b) { return String(a.title || "").localeCompare(String(b.title || ""), "en", { sensitivity: "base" }); });
    return [{ id: "all", label: "All" }].concat(secs.map(function (sec) { return { id: sec.id, label: chipLabel(sec.title) }; }));
  }

  var BRAND_THUMBS = {
    "intro-1": "assets/tutorials/welcome.png",
    v1: "assets/tutorials/tour.png",
    v2: "assets/tutorials/reviews.png",
    v3: "assets/tutorials/facebook.png",
    v4: "assets/tutorials/profile.png",
    v5: "assets/tutorials/badges.png"
  };

  function T() { return root.TradeCircle || {}; }
  function S() { return T().state || {}; }
  function Tut() { return root.TCTutorials || null; }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function meId() { return (T().me && T().me() && T().me().id) || S().meId || "jamie"; }

  function isWatched(v) {
    if (!v) return false;
    if (Tut() && Tut().isWatched(v.id)) return true;
    if (v.id === (Tut() && Tut().load && Tut().load().intro && Tut().load().intro.id)) {
      return !!(Tut() && Tut().introWatched && Tut().introWatched(meId()));
    }
    return false;
  }

  function thumbOf(v) {
    if (!v) return "";
    if (v.sample && BRAND_THUMBS[v.id]) return BRAND_THUMBS[v.id];
    if (v.sample && /welcome to rate buddies/i.test(v.title || "")) return BRAND_THUMBS["intro-1"];
    return v.thumb || "";
  }

  function heroTitle(v) {
    var t = (v && v.title) || "Welcome to Rate Buddies";
    return t.replace(/\s+[—–-]\s+how to use the app\s*$/i, "").trim() || t;
  }
  function heroSub(v) {
    var t = (v && v.title) || "";
    if (/how to use the app/i.test(t)) return "How to use the app";
    var d = (v && v.description) || "";
    var cut = d.split(/[.!?]/)[0];
    return (cut || d).trim();
  }

  function allLessons() {
    var out = [];
    var tut = Tut();
    if (!tut) return out;
    var d = tut.load();
    if (d && d.intro) out.push(d.intro);
    (tut.visibleSections() || []).forEach(function (sec) {
      (tut.videosIn(sec.id) || []).forEach(function (v) { out.push(v); });
    });
    return out;
  }

  function chip() {
    var c = S()._tutChip || "all";
    if (c !== "all" && !chipList().some(function (x) { return x.id === c; })) c = "all";
    return c;
  }
  function query() { return window.RB_TUT_SEARCH ? String(S()._tutQuery || "").trim().toLowerCase() : ""; }
  function searching() { return !!S()._tutSearch; }

  function matchesQuery(v, q) {
    if (!q) return true;
    var hay = ((v.title || "") + " " + (v.description || "")).toLowerCase();
    return hay.indexOf(q) !== -1;
  }

  function visibleLessons() {
    var c = chip();
    var q = query();
    var tut = Tut();
    var list = [];
    if (!tut) return list;
    (tut.visibleSections() || []).forEach(function (sec) {
      if (c !== "all" && sec.id !== c) return;
      (tut.videosIn(sec.id) || []).forEach(function (v) {
        if (matchesQuery(v, q)) list.push(v);
      });
    });
    return list;
  }

  function showHero(intro) {
    if (!intro) return false;
    if (searching() && query() && !matchesQuery(intro, query())) return false;
    var c = chip();
    return c === "all" || c === "getting-started";
  }

  function backBtn() {
    return '<button class="icon-btn tut-round-btn" type="button" data-action="nav-back" aria-label="Back">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-8 7 8 7"/></svg>' +
      "</button>";
  }

  function playIco(size) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l12-6.5-12-6.5z"/></svg>';
  }

  function renderTutorials() {
    var d = Tut() ? Tut().load() : { intro: null, videos: [] };
    var intro = d && d.intro;
    var lessons = visibleLessons();
    var catalogue = allLessons();
    var watchedN = catalogue.filter(isWatched).length;
    var totalN = catalogue.length || 1;
    var left = Math.max(0, totalN - watchedN);
    var pct = Math.round((watchedN / totalN) * 100);
    var C = 2 * Math.PI * 23;
    var dash = (watchedN / totalN) * C;
    var q = S()._tutQuery || "";
    var c = chip();
    var searchOn = !!window.RB_TUT_SEARCH && searching();

    var chips = chipList().map(function (ch) {
      return '<button type="button" class="tut-chip' + (c === ch.id ? " is-on" : "") +
        '" role="tab" aria-selected="' + (c === ch.id ? "true" : "false") +
        '" data-action="tut-chip" data-chip="' + esc(ch.id) + '">' + esc(ch.label) + "</button>";
    }).join("");

    var html = '<section class="screen has-tabs has-header tut-b2' + (searchOn ? " is-searching" : "") +
      '" data-screen="tutorials">' +
      '<div class="app-header">' +
        '<div class="tut-header-row">' +
          backBtn() +
          '<div class="ht">Video tutorials</div>' +
          (!window.RB_TUT_SEARCH ? "" : /* v2.2.0: search icon removed (Vishal, 22 Nov); flag brings it back */
          '<button class="icon-btn tut-round-btn tut-search-btn" type="button" data-action="tut-search-toggle" aria-label="' +
            (searchOn ? "Close search" : "Search") + '">' +
            (searchOn
              ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
              : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.2-3.2"/></svg>') +
          "</button>") +
        "</div>" +
        (searchOn
          ? '<div class="tut-search-field"><input type="search" id="tutSearch" placeholder="Search tutorials" value="' + esc(q) + '" aria-label="Search tutorials"></div>'
          : '<div class="tut-chips-wrap"><div class="tut-chips" role="tablist" aria-label="Categories">' + chips +
            '</div><div class="tut-chips-fade" aria-hidden="true"></div></div>') +
      "</div>" +
      '<div class="scroll">' +
        '<section class="tut-progress" aria-label="Your progress">' +
          '<div class="tut-progress-copy">' +
            '<div class="tut-progress-kicker">Your progress</div>' +
            '<div class="tut-progress-title">' + watchedN + " of " + totalN + " watched</div>" +
            '<div class="tut-progress-bar" aria-hidden="true"><span style="width:' + pct + '%"></span></div>' +
            '<div class="tut-progress-sub">' + (left ? (left + " lesson" + (left === 1 ? "" : "s") + " left · keep going") : "All lessons watched") + "</div>" +
          "</div>" +
          '<div class="tut-ring" aria-hidden="true">' +
            '<svg viewBox="0 0 58 58"><circle cx="29" cy="29" r="23" fill="none" stroke="#E2E8F0" stroke-width="5"/>' +
            '<circle cx="29" cy="29" r="23" fill="none" stroke="#1A5FD4" stroke-width="5" stroke-linecap="round" stroke-dasharray="' +
            dash.toFixed(1) + " " + C.toFixed(1) + '"/></svg>' +
            '<div class="tut-ring-lab">' + watchedN + "/" + totalN + "</div>" +
          "</div>" +
        "</section>";

    if (showHero(intro)) {
      var introWatched = isWatched(intro);
      html += '<button class="tut-hero" type="button" data-action="tut-open" data-id="' + esc(intro.id) +
        '" aria-label="Play ' + esc(heroTitle(intro)) + '">' +
        (thumbOf(intro) ? '<img class="tut-hero-media" src="' + esc(thumbOf(intro)) + '" alt="">' : '<div class="tut-hero-media"></div>') +
        '<div class="tut-hero-fade"></div>' +
        '<span class="tut-tag tut-tag-must">Must watch</span>' +
        (intro.duration ? '<span class="tut-chip-dur">' + esc(intro.duration) + "</span>" : "") +
        '<span class="tut-hero-play" aria-hidden="true">' + playIco(22) + "</span>" +
        '<div class="tut-hero-meta">' +
          '<div class="tut-hero-kicker">Start here</div>' +
          '<div class="tut-hero-title">' + esc(heroTitle(intro)) + "</div>" +
          '<div class="tut-hero-sub">' + esc(heroSub(intro)) +
            (introWatched ? ' <span class="tut-watched-pill">Watched ✓</span>' : "") +
          "</div>" +
        "</div></button>";
    }

    html += '<div class="tut-list-label">Lessons</div>';
    if (!lessons.length) {
      html += '<p class="tut-empty">No tutorials match this filter.</p>';
    } else {
      lessons.forEach(function (v, i) {
        var n = String(i + 2).padStart(2, "0");
        var watched = isWatched(v);
        html += '<button class="tut-lesson" type="button" data-action="tut-open" data-id="' + esc(v.id) + '">' +
          '<div class="tut-lesson-thumb">' +
            (thumbOf(v) ? '<img src="' + esc(thumbOf(v)) + '" alt="">' : "") +
            '<span class="tut-idx">' + n + "</span>" +
          "</div>" +
          '<div class="tut-lesson-body">' +
            '<div class="tut-lesson-title">' + esc(v.title) + "</div>" +
            (v.description ? '<div class="tut-lesson-desc">' + esc(v.description) + "</div>" : "") +
            '<div class="tut-lesson-meta">' +
              (v.duration ? '<span class="tut-dur-inline">' + esc(v.duration) + "</span>" : "") +
              (watched ? '<span class="tut-watched-pill">Watched ✓</span>' : (v.isNew ? '<span class="tut-new-pill">New</span>' : "")) +
            "</div>" +
          "</div></button>";
      });
    }
    return html + "</div></section>";
  }

  function renderPlayer() {
    var id = S()._tutOpen || (Tut() && Tut().load().intro && Tut().load().intro.id);
    var v = Tut() && Tut().videoById(id);
    if (!v) return renderTutorials();
    var playing = !!S()._tutPlaying;
    var poster = thumbOf(v);
    var html = '<section class="screen has-tabs has-header" data-screen="tutorial-play">' +
      '<div class="app-header">' + backBtn() +
      '<div class="ht">' + esc(v.title) + '</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="tut-player">';
    if (playing && v.embed) {
      html += '<iframe src="' + esc(v.embed) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen title="' + esc(v.title) + '"></iframe>';
    } else {
      html += (poster ? '<img src="' + esc(poster) + '" alt="">' : "") +
        '<button type="button" class="play-big" data-action="tut-play" data-id="' + esc(v.id) + '" aria-label="Play">' + playIco(56) + "</button>";
    }
    html += "</div>" +
      (v.duration ? '<p class="hint" style="margin:0 0 8px">' + esc(v.duration) + "</p>" : "") +
      '<p class="tut-desc">' + esc(v.description || "") + "</p>" +
      (isWatched(v) ? '<p class="tut-watched">Watched ✓</p>' : "") +
      "</div></section>";
    return html;
  }

  function wrapRender() {
    if (!root.TC12 || !TC12.render || TC12._v212) return;
    var prev = TC12.render;
    TC12.render = function (id) {
      if (id === "tutorials") return renderTutorials();
      if (id === "tutorial-play") return renderPlayer();
      return prev.apply(this, arguments);
    };
    TC12._v212 = 1;
  }

  function bind() {
    document.addEventListener("click", function (e) {
      var btn = e.target && e.target.closest && e.target.closest("[data-action]");
      if (!btn) return;
      var act = btn.getAttribute("data-action");
      var go = T().go;
      if (act === "tut-chip") {
        S()._tutChip = btn.getAttribute("data-chip") || "all";
        if (go) go("tutorials", { replace: true });
        e.preventDefault();
      } else if (act === "tut-search-toggle") {
        S()._tutSearch = !S()._tutSearch;
        if (!S()._tutSearch) S()._tutQuery = "";
        if (go) go("tutorials", { replace: true });
        e.preventDefault();
      }
    }, true);
    document.addEventListener("input", function (e) {
      if (!e.target || e.target.id !== "tutSearch") return;
      S()._tutQuery = e.target.value || "";
      var sc = document.querySelector('.screen[data-screen="tutorials"] .scroll');
      var top = sc ? sc.scrollTop : 0;
      if (T().go) T().go("tutorials", { replace: true });
      setTimeout(function () {
        var input = document.getElementById("tutSearch");
        var sc2 = document.querySelector('.screen[data-screen="tutorials"] .scroll');
        if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
        if (sc2) sc2.scrollTop = top;
      }, 0);
    });
  }

  function install() {
    wrapRender();
    bind();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", wrapRender);
    }
    setTimeout(wrapRender, 0);
  }

  root.TC212 = {
    VERSION: "2.1.2",
    renderTutorials: renderTutorials,
    renderPlayer: renderPlayer
  };
  install();
})(typeof window !== "undefined" ? window : this);
