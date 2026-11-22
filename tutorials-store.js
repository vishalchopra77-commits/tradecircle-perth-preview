/* Rate Buddies v2.1.2 — shared video tutorial + intro store (fictional demo data). */
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


  var BRAND_THUMBS = {
    "intro-1": "assets/tutorials/welcome.png",
    v1: "assets/tutorials/tour.png",
    v2: "assets/tutorials/reviews.png",
    v3: "assets/tutorials/facebook.png",
    v4: "assets/tutorials/profile.png",
    v5: "assets/tutorials/badges.png"
  };
  function migrate(data) {
    if (!data) return data;
    function brand(v) {
      if (v && v.sample && BRAND_THUMBS[v.id]) v.thumb = BRAND_THUMBS[v.id];
      return v;
    }
    brand(data.intro);
    (data.videos || []).forEach(brand);
    var hasBadgesSec = (data.sections || []).some(function (s) { return s.id === "badges-queue"; });
    if (!hasBadgesSec) {
      data.sections = (data.sections || []).concat([{ id: "badges-queue", title: "Badges and the queue", order: 5, hidden: false }]);
    }
    var hasV5 = (data.videos || []).some(function (v) { return v.id === "v5"; });
    if (!hasV5) {
      data.videos = (data.videos || []).concat([{ id: "v5", sectionId: "badges-queue", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", provider: "youtube", videoId: "aqz-KE-bpKQ", thumb: "assets/tutorials/badges.png", embed: "https://www.youtube.com/embed/aqz-KE-bpKQ?rel=0&enablejsapi=1", title: "Badges, vouches and the Promotion queue", description: "How Google Reviews and Facebook vouches earn badges and move you up the queue.", duration: "3:40", durationSec: 220, order: 1, hidden: false, sample: true }]);
    }
    /* v2.2.2: two "how to find your link" videos for Complete / Edit profile (admin sets the URL) */
    if (!(data.videos || []).some(function (v) { return v.id === "v6"; })) data.videos = (data.videos || []).concat([{ id: "v6", sectionId: "your-profile", url: "", provider: "", videoId: "", thumb: "assets/tutorials/facebook.png", embed: "", title: "How to find your Facebook profile link", description: "Where to copy your personal Facebook profile link on your phone, to paste into Rate Buddies.", duration: "1:00", durationSec: 60, order: 2, hidden: false, sample: true, help: "facebook" }]);
    if (!(data.videos || []).some(function (v) { return v.id === "v7"; })) data.videos = (data.videos || []).concat([{ id: "v7", sectionId: "your-profile", url: "", provider: "", videoId: "", thumb: "assets/tutorials/reviews.png", embed: "", title: "How to find your Google Business Profile link", description: "Where to copy your Google Business Profile share link, to paste into Rate Buddies.", duration: "1:00", durationSec: 60, order: 3, hidden: false, sample: true, help: "google" }]);
    /* v2.2.2: AI assistant connect video (admin sets the URL) */
    if (!(data.sections || []).some(function (s) { return s.id === "ai-assistant"; })) data.sections = (data.sections || []).concat([{ id: "ai-assistant", title: "AI assistant", order: 6, hidden: false }]);
    if (!(data.videos || []).some(function (v) { return v.id === "v8"; })) data.videos = (data.videos || []).concat([{ id: "v8", sectionId: "ai-assistant", url: "", provider: "", videoId: "", thumb: "assets/tutorials/tour.png", embed: "", title: "Connect your AI assistant in 1 minute", description: "Get an API key from Grok, ChatGPT or Claude, paste it into Rate Buddies and tap Test connection.", duration: "1:00", durationSec: 60, order: 1, hidden: false, sample: true, help: "ai" }]);
    (data.videos || []).forEach(function (v) {
      if (v.id === "v2" && v.sample && v.isNew == null) v.isNew = true;
    });
    try { if (root.localStorage) localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
    return data;
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
        thumb: "assets/tutorials/welcome.png",
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
        { id: "your-profile", title: "Your profile", order: 4, hidden: false },
        { id: "badges-queue", title: "Badges and the queue", order: 5, hidden: false },
        { id: "ai-assistant", title: "AI assistant", order: 6, hidden: false }
      ],
      videos: [
        { id: "v1", sectionId: "getting-started", url: "https://www.youtube.com/watch?v=eRsGyueVLvQ", provider: "youtube", videoId: "eRsGyueVLvQ", thumb: "assets/tutorials/tour.png", embed: "https://www.youtube.com/embed/eRsGyueVLvQ?rel=0&enablejsapi=1", title: "A tour of Home, Reviews and Facebook", description: "Find your way around the app after you have watched the welcome video.", duration: "2:48", durationSec: 168, order: 1, hidden: false, sample: true },
        { id: "v2", sectionId: "google-reviews", url: "https://www.youtube.com/watch?v=jNQXAC9IVRw", provider: "youtube", videoId: "jNQXAC9IVRw", thumb: "assets/tutorials/reviews.png", embed: "https://www.youtube.com/embed/jNQXAC9IVRw?rel=0&enablejsapi=1", title: "How to leave a genuine Google Review", description: "Only after a real job, in your own words, and within the daily limit of three.", duration: "3:05", durationSec: 185, order: 1, hidden: false, sample: true, isNew: true },
        { id: "v3", sectionId: "facebook-recs", url: "https://vimeo.com/1084537", provider: "vimeo", videoId: "1084537", thumb: "assets/tutorials/facebook.png", embed: "https://player.vimeo.com/video/1084537?api=1", title: "How to recommend a buddy on Facebook", description: "Pick a starter, add a few of your own words, and only vouch for someone you genuinely know.", duration: "4:12", durationSec: 252, order: 1, hidden: false, sample: true },
        { id: "v4", sectionId: "your-profile", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", provider: "youtube", videoId: "aqz-KE-bpKQ", thumb: "assets/tutorials/profile.png", embed: "https://www.youtube.com/embed/aqz-KE-bpKQ?rel=0&enablejsapi=1", title: "Fill in your profile and recommendation details", description: "Choose which contact details other members may include when they recommend you.", duration: "2:10", durationSec: 130, order: 1, hidden: false, sample: true },
        { id: "v5", sectionId: "badges-queue", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", provider: "youtube", videoId: "aqz-KE-bpKQ", thumb: "assets/tutorials/badges.png", embed: "https://www.youtube.com/embed/aqz-KE-bpKQ?rel=0&enablejsapi=1", title: "Badges, vouches and the Promotion queue", description: "How Google Reviews and Facebook vouches earn badges and move you up the queue.", duration: "3:40", durationSec: 220, order: 1, hidden: false, sample: true },
        { id: "v6", sectionId: "your-profile", url: "", provider: "", videoId: "", thumb: "assets/tutorials/facebook.png", embed: "", title: "How to find your Facebook profile link", description: "Where to copy your personal Facebook profile link on your phone, to paste into Rate Buddies.", duration: "1:00", durationSec: 60, order: 2, hidden: false, sample: true, help: "facebook" },
        { id: "v7", sectionId: "your-profile", url: "", provider: "", videoId: "", thumb: "assets/tutorials/reviews.png", embed: "", title: "How to find your Google Business Profile link", description: "Where to copy your Google Business Profile share link, to paste into Rate Buddies.", duration: "1:00", durationSec: 60, order: 3, hidden: false, sample: true, help: "google" },
        { id: "v8", sectionId: "ai-assistant", url: "", provider: "", videoId: "", thumb: "assets/tutorials/tour.png", embed: "", title: "Connect your AI assistant in 1 minute", description: "Get an API key from Grok, ChatGPT or Claude, paste it into Rate Buddies and tap Test connection.", duration: "1:00", durationSec: 60, order: 1, hidden: false, sample: true, help: "ai" }
      ]
    };
  }

  function load() {
    try {
      var raw = root.localStorage && localStorage.getItem(KEY);
      if (raw) {
        var data = JSON.parse(raw);
        if (data && data.intro && data.sections) return migrate(data);
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

  /* v2.2.2: help video for a profile link field ("facebook" | "google"); null if missing or hidden */
  function helpVideo(kind) {
    var vs = load().videos || [];
    for (var i = 0; i < vs.length; i++) if (vs[i].help === kind && !vs[i].archived) return vs[i];
    return null;
  }
  root.TCTutorials = {
    helpVideo: helpVideo,
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
