/* Rate Buddies v2.2.2 — web admin <-> live test database: video tutorials manager.
   Loads sections, videos and the intro from Supabase and writes the admin's changes back.
   Nothing is ever deleted: hide / archive are flags; a video missing locally is left alone in the database.
   Project URL + key come only from rb-config.js (via rb-backend.js). */
(function () {
  "use strict";
  function live() { return !!(window.RB && RB.client && RB.session && RB.isAdmin && !RB.isDemo()); }
  function Tut() { return window.TCTutorials; }
  var origSave = null, pulling = false, snap = { s: {}, v: {}, intro: "", prev: {} }, pushTimer = null;

  function vRow(v) {
    return { id: v.id, section_id: v.sectionId, url: v.url || "", provider: v.provider || null, video_id: v.videoId || null,
      thumb: v.thumb || null, embed: v.embed || null, title: v.title || "", description: v.description || "",
      duration: v.duration || "", sort_order: Number(v.order) || 0, hidden: !!v.hidden, archived: !!v.archived,
      sample: !!v.sample, help_key: v.help || null };
  }
  function sRow(s) { return { id: s.id, title: s.title || s.id, sort_order: Number(s.order) || 0, hidden: !!s.hidden }; }
  function introRow(d) {
    var i = d.intro || {};
    return { id: 1, url: i.url || null, provider: i.provider || null, video_id: i.videoId || null, thumb: i.thumb || null,
      embed: i.embed || null, title: i.title || null, description: i.description || "", duration: i.duration || "",
      duration_sec: Number(i.durationSec) || 200, require_intro: d.requireIntro !== false,
      min_watched_pct: Number(d.minWatchedPct) || 90, sample: !!i.sample };
  }
  function prevRow(p) {
    return { id: p.id || ("intro-" + (p.videoId || Date.now())), url: p.url || null, provider: p.provider || null,
      video_id: p.videoId || null, thumb: p.thumb || null, title: p.title || null,
      archived_at: p.archivedAt || "", sample: !!p.sample };
  }

  async function pull() {
    if (!live() || !Tut()) return;
    var pack = await RB.listTutorials();
    var d = Tut().load();
    /* First run on an empty project: upload the built-in tutorial list (admin permissions), never wipe it locally */
    if (!(pack.sections || []).length && !(pack.videos || []).length && !window.__rbAdminFirstSeed) {
      snap = { s: {}, v: {}, intro: pack.intro ? JSON.stringify(introRow(d)) : "", prev: {} };
      await push(d);
      window.__rbAdminFirstSeed = window.__rbAdminLastPush;
      return pull();
    }
    d.sections = (pack.sections || []).map(function (s) { return { id: s.id, title: s.title, order: s.sort_order, hidden: s.hidden }; });
    d.videos = (pack.videos || []).map(function (v) {
      return { id: v.id, sectionId: v.section_id, url: v.url, provider: v.provider, videoId: v.video_id, thumb: v.thumb,
        embed: v.embed, title: v.title, description: v.description, duration: v.duration, order: v.sort_order,
        hidden: v.hidden, archived: v.archived, sample: v.sample, help: v.help_key || undefined };
    });
    if (pack.intro) {
      var i = pack.intro;
      d.intro = { id: "intro-db", url: i.url, provider: i.provider, videoId: i.video_id, thumb: i.thumb, embed: i.embed,
        title: i.title, description: i.description, duration: i.duration, durationSec: i.duration_sec, sample: i.sample };
      d.requireIntro = i.require_intro; d.minWatchedPct = i.min_watched_pct;
    }
    d.previousIntros = (pack.previousIntros || []).map(function (p) {
      return { id: p.id, url: p.url, provider: p.provider, videoId: p.video_id, thumb: p.thumb, title: p.title, archivedAt: p.archived_at, sample: p.sample };
    });
    pulling = true;
    try { origSave(d); } finally { pulling = false; }
    remember(d);
    if (window.TCAdmin && TCAdmin.paint) TCAdmin.paint();
  }
  function remember(d) {
    snap = { s: {}, v: {}, intro: JSON.stringify(introRow(d)), prev: {} };
    (d.sections || []).forEach(function (s) { snap.s[s.id] = JSON.stringify(sRow(s)); });
    (d.videos || []).forEach(function (v) { snap.v[v.id] = JSON.stringify(vRow(v)); });
    (d.previousIntros || []).forEach(function (p) { snap.prev[prevRow(p).id] = 1; });
  }

  async function push(d) {
    if (!live()) return;
    var c = RB.client, errs = [];
    var secs = (d.sections || []).map(sRow).filter(function (r) { return snap.s[r.id] !== JSON.stringify(r); });
    var vids = (d.videos || []).map(vRow).filter(function (r) { return snap.v[r.id] !== JSON.stringify(r); });
    if (secs.length) { var a = await c.from("tutorial_sections").upsert(secs); if (a.error) errs.push(a.error.message); }
    if (vids.length) { var b = await c.from("tutorial_videos").upsert(vids); if (b.error) errs.push(b.error.message); }
    var ir = introRow(d);
    if (JSON.stringify(ir) !== snap.intro) { var e = await c.from("intro_settings").upsert(ir); if (e.error) errs.push(e.error.message); }
    var prevs = (d.previousIntros || []).map(prevRow).filter(function (r) { return !snap.prev[r.id]; });
    if (prevs.length) { var f = await c.from("previous_intros").upsert(prevs); if (f.error) errs.push(f.error.message); }
    if (errs.length) window.alert("Saved here, but not online: " + errs.join("; "));
    else remember(d);
    window.__rbAdminLastPush = { sections: secs.length, videos: vids.length, intro: JSON.stringify(ir) !== snap.intro, previous: prevs.length, errors: errs, at: Date.now() };
  }

  function wrap() {
    if (!Tut() || origSave) return;
    origSave = Tut().save;
    Tut().save = function (d) {
      var out = origSave(d);
      if (!pulling && live()) {
        clearTimeout(pushTimer);
        pushTimer = setTimeout(function () { push(Tut().load()).catch(function (e) { window.alert("Not saved online: " + (e.message || e)); }); }, 150);
      }
      return out;
    };
  }

  wrap();
  var tries = 0, timer = setInterval(function () {
    tries++;
    if (live()) { clearInterval(timer); pull().catch(function (e) { console.warn("RB admin tutorials", e); }); }
    if (tries > 240) clearInterval(timer);
  }, 500);
  window.RBAdminLive = { pull: pull, push: function () { return push(Tut().load()); } };
})();
