/* Rate Buddies v1.8.2 — shared video tutorial + intro store (fictional demo data). */
(function (root) {
  "use strict";
  var KEY = "rb_tutorials_v181";
  var WATCH_KEY = "rb_tut_watched_v181";
  var INTRO_KEY = "rb_intro_watched_v181";

  function parseVideoUrl(url) {
    var u = String(url || "").trim();
    if (!u) return null;
    var yt = u.match(/(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
    if (yt) {
      return {
        provider: "youtube",
        videoId: yt[1],
        thumb: "https://img.youtube.com/vi/" + yt[1] + "/hqdefault.jpg",
        embed: "https://www.youtube.com/embed/" + yt[1] + "?rel=0&enablejsapi=1&playsinline=1",
        url: "https://www.youtube.com/watch?v=" + yt[1]
      };
    }
    var vim = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (vim) {
      return {
        provider: "vimeo",
        videoId: vim[1],
        thumb: "https://vumbnail.com/" + vim[1] + ".jpg",
        embed: "https://player.vimeo.com/video/" + vim[1] + "?api=1",
        url: "https://vimeo.com/" + vim[1]
      };
    }
    return null;
  }

  function seed() {
    return {
      requireIntro: true,
      minWatchedPct: 90,
      intro: {
        id: "intro-1",
        url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
        provider: "youtube",
        videoId: "aqz-KE-bpKQ",
        thumb: "https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg",
        embed: "https://www.youtube.com/embed/aqz-KE-bpKQ?rel=0&enablejsapi=1&playsinline=1",
        title: "Welcome to Rate Buddies — how to use the app",
        description: "A short welcome that explains what Rate Buddies is, how recommendations and Google Reviews work, and where to find more help.",
        duration: "3:20",
        durationSec: 200,
        sample: true
      },
      previousIntros: [
        {
          id: "intro-0",
          url: "https://vimeo.com/1084537",
          provider: "vimeo",
          videoId: "1084537",
          thumb: "https://vumbnail.com/1084537.jpg",
          title: "Welcome (earlier draft)",
          description: "Previous intro — archived when the current welcome video was set. Sample only.",
          duration: "4:01",
          archivedAt: "12 Nov 2026",
          sample: true
        }
      ],
      sections: [
        { id: "getting-started", title: "Getting started", order: 1, hidden: false },
        { id: "google-reviews", title: "Leaving Google Reviews", order: 2, hidden: false },
        { id: "facebook-recs", title: "Facebook recommendations", order: 3, hidden: false },
        { id: "your-profile", title: "Your profile", order: 4, hidden: false }
      ],
      videos: [
        { id: "v1", sectionId: "getting-started", url: "https://www.youtube.com/watch?v=eRsGyueVLvQ", provider: "youtube", videoId: "eRsGyueVLvQ", thumb: "https://img.youtube.com/vi/eRsGyueVLvQ/hqdefault.jpg", embed: "https://www.youtube.com/embed/eRsGyueVLvQ?rel=0&enablejsapi=1", title: "A tour of Home, Reviews and Facebook", description: "Find your way around the app after you have watched the welcome video.", duration: "2:48", durationSec: 168, order: 1, hidden: false, sample: true },
        { id: "v2", sectionId: "google-reviews", url: "https://www.youtube.com/watch?v=jNQXAC9IVRw", provider: "youtube", videoId: "jNQXAC9IVRw", thumb: "https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg", embed: "https://www.youtube.com/embed/jNQXAC9IVRw?rel=0&enablejsapi=1", title: "How to leave a genuine Google Review", description: "Only after a real job, in your own words, and within the daily limit of three.", duration: "3:05", durationSec: 185, order: 1, hidden: false, sample: true },
        { id: "v3", sectionId: "facebook-recs", url: "https://vimeo.com/1084537", provider: "vimeo", videoId: "1084537", thumb: "https://vumbnail.com/1084537.jpg", embed: "https://player.vimeo.com/video/1084537?api=1", title: "How to recommend a buddy on Facebook", description: "Pick a starter, add a few of your own words, and only vouch for someone you genuinely know.", duration: "4:12", durationSec: 252, order: 1, hidden: false, sample: true },
        { id: "v4", sectionId: "your-profile", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", provider: "youtube", videoId: "aqz-KE-bpKQ", thumb: "https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg", embed: "https://www.youtube.com/embed/aqz-KE-bpKQ?rel=0&enablejsapi=1", title: "Fill in your profile and recommendation details", description: "Choose which contact details other members may include when they recommend you.", duration: "2:10", durationSec: 130, order: 1, hidden: false, sample: true }
      ]
    };
  }

  function load() {
    try {
      var raw = root.localStorage && localStorage.getItem(KEY);
      if (raw) {
        var data = JSON.parse(raw);
        if (data && data.intro && data.sections) return data;
      }
    } catch (e) {}
    var s = seed();
    save(s);
    return s;
  }
  function save(data) {
    try { if (root.localStorage) localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
    return data;
  }
  function data() { return load(); }

  function visibleSections() {
    return load().sections.filter(function (s) { return !s.hidden && !s.archived; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
  }
  function videosIn(sectionId) {
    return load().videos.filter(function (v) { return v.sectionId === sectionId && !v.hidden && !v.archived; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
  }
  function videoById(id) {
    var d = load();
    if (d.intro && d.intro.id === id) return d.intro;
    var i;
    for (i = 0; i < d.videos.length; i++) if (d.videos[i].id === id) return d.videos[i];
    for (i = 0; i < (d.previousIntros || []).length; i++) if (d.previousIntros[i].id === id) return d.previousIntros[i];
    return null;
  }

  function loadWatched() {
    try { return JSON.parse((root.localStorage && localStorage.getItem(WATCH_KEY)) || "{}") || {}; } catch (e) { return {}; }
  }
  function saveWatched(map) {
    try { if (root.localStorage) localStorage.setItem(WATCH_KEY, JSON.stringify(map)); } catch (e) {}
  }
  function markWatched(id) {
    var w = loadWatched();
    w[id] = true;
    saveWatched(w);
  }
  function isWatched(id) { return !!loadWatched()[id]; }

  /* Intro watched is stored per member id. Existing demo members are pre-marked as watched
     so the usual preview opens on Home. A fresh approved sign-up is not marked. */
  function defaultIntroWatched() {
    return { jamie: true, sarah: true, liam: true, priya: true, jack: true, mei: true, daniel: true, emma: true, marcus: true, tom: true, hannah: true, chris: true, noah: true, michael: true };
  }
  function loadIntroWatched() {
    try {
      var raw = root.localStorage && localStorage.getItem(INTRO_KEY);
      if (raw) return JSON.parse(raw) || defaultIntroWatched();
    } catch (e) {}
    var d = defaultIntroWatched();
    saveIntroWatched(d);
    return d;
  }
  function saveIntroWatched(map) {
    try { if (root.localStorage) localStorage.setItem(INTRO_KEY, JSON.stringify(map)); } catch (e) {}
  }
  function introWatched(memberId) { return !!loadIntroWatched()[memberId]; }
  function setIntroWatched(memberId, val) {
    var m = loadIntroWatched();
    m[memberId] = !!val;
    saveIntroWatched(m);
  }

  function setIntroFromUrl(fields) {
    var d = load();
    var parsed = parseVideoUrl(fields.url);
    if (!parsed) return { error: "Paste a YouTube or Vimeo link." };
    if (d.intro && d.intro.videoId && d.intro.videoId !== parsed.videoId) {
      var old = Object.assign({}, d.intro, { archivedAt: "Just now" });
      d.previousIntros = d.previousIntros || [];
      d.previousIntros.unshift(old);
    }
    d.intro = Object.assign({}, d.intro || {}, parsed, {
      id: "intro-" + Date.now(),
      title: fields.title || "Welcome to Rate Buddies — how to use the app",
      description: fields.description || "",
      duration: fields.duration || d.intro && d.intro.duration || "",
      durationSec: fields.durationSec || d.intro && d.intro.durationSec || 0,
      sample: !!fields.sample
    });
    save(d);
    return { ok: true, data: d };
  }

  root.TCTutorials = {
    KEY: KEY,
    parseVideoUrl: parseVideoUrl,
    seed: seed,
    load: load,
    save: save,
    data: data,
    visibleSections: visibleSections,
    videosIn: videosIn,
    videoById: videoById,
    markWatched: markWatched,
    isWatched: isWatched,
    introWatched: introWatched,
    setIntroWatched: setIntroWatched,
    loadIntroWatched: loadIntroWatched,
    setIntroFromUrl: setIntroFromUrl,
    reset: function () { save(seed()); saveWatched({}); saveIntroWatched(defaultIntroWatched()); }
  };
})(window);
