/* Rate Buddies v1.8.2 — Video tutorials admin (intro is the first pinned section). */
(function () {
  "use strict";
  function esc(s) {
    if (window.TCAdmin && TCAdmin.esc) return TCAdmin.esc(s);
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }
  function panel(title, sub, extra, body) {
    if (window.TCAdmin && TCAdmin.panel) return TCAdmin.panel(title, sub, extra, body);
    return '<section class="panel"><div class="panel-h"><div><h2>' + title + "</h2>" + (sub ? '<p class="panel-sub">' + sub + "</p>" : "") + "</div>" + (extra || "") + "</div>" + body + "</section>";
  }
  function Tut() { return window.TCTutorials; }
  function data() { return Tut().load(); }
  var flash = "";
  var editingVideo = null;
  var formDraft = { url: "", title: "", description: "", sectionId: "getting-started", duration: "" };
  var introDraft = null;

  function membersList() {
    var circle = (window.TCDeviCity && TCDeviCity.CIRCLE) || [];
    if (circle.length) return circle;
    return (window.TCAdmin && TCAdmin.members) || [];
  }
  function watchedMap() { return Tut().loadIntroWatched(); }

  function parseOrNull(url) { return Tut().parseVideoUrl(url); }

  function thumb(src) {
    return src ? '<img src="' + esc(src) + '" alt="" width="160" height="90" style="width:160px;height:90px;object-fit:cover;border-radius:10px;background:#0A1328">' : '<div style="width:160px;height:90px;border-radius:10px;background:#0A1328"></div>';
  }

  function introPanel() {
    var d = data();
    var v = d.intro || {};
    var draft = introDraft || { url: v.url || "", title: v.title || "", description: v.description || "", duration: v.duration || "" };
    var parsed = parseOrNull(draft.url) || v;
    var map = watchedMap();
    var list = membersList();
    var yes = 0, no = 0, i, mid, rows = "";
    for (i = 0; i < list.length; i++) {
      mid = list[i].id;
      var name = list[i].first ? (list[i].first + " " + (list[i].last || "")) : (list[i].name || mid);
      var ok = !!map[mid];
      if (ok) yes++; else no++;
      rows += "<tr><td>" + esc(name) + "</td><td>" + esc(list[i].trade || "") + "</td><td>" + (ok ? "Intro watched ✓" : "Intro watched ✗") + "</td></tr>";
    }
    var prev = (d.previousIntros || []).map(function (p) {
      return '<div class="tut-row is-hidden">' + (p.thumb ? '<img src="' + esc(p.thumb) + '" alt="">' : "") +
        '<div class="meta"><strong>' + esc(p.title) + "</strong><span class=\"devi-note\" style=\"display:block\">Archived " + esc(p.archivedAt || "") + " · " + esc(p.provider || "") + (p.sample ? " · sample" : "") + "</span></div></div>";
    }).join("");

    return '<div class="intro-sec-admin" id="intro-section">' +
      '<div class="pin">Pinned first · can’t be reordered or hidden</div>' +
      "<h2 style=\"margin:0 0 4px\">Introduction video</h2>" +
      '<p class="panel-sub">The first thing a new member sees after their profile is approved. They can’t skip it. When it ends, they are pointed to More → Video tutorials, then to Complete your profile.</p>' +
      '<div class="tut-url-preview">' + thumb(parsed.thumb || v.thumb) +
      "<div><strong>" + esc(v.title || "No intro set") + "</strong>" +
      (v.sample ? '<div class="tut-sample">Sample video — placeholder only</div>' : "") +
      '<div class="panel-sub">' + esc((v.provider || "") + (v.duration ? " · " + v.duration : "")) + "</div></div></div>" +
      '<div class="field"><label>YouTube or Vimeo URL</label><input id="introUrl" type="url" value="' + esc(draft.url) + '" placeholder="https://www.youtube.com/watch?v=…"></div>' +
      '<div class="field"><label>Title</label><input id="introTitle" type="text" value="' + esc(draft.title) + '"></div>' +
      '<div class="field"><label>Description</label><textarea id="introDesc" rows="2">' + esc(draft.description) + "</textarea></div>" +
      '<p class="devi-note">Replacing the intro archives the current one under Previous intro videos. Nothing is deleted.</p>' +
      '<button class="btn btn-primary" type="button" data-action="tut-save-intro">Save intro video</button>' +
      '<div class="setting-row" style="margin-top:16px"><div><strong>Required for new members (can’t skip)</strong><div class="panel-sub">On by default. Continue stays locked until they have watched about the minimum below. Seeking to the end does not count.</div></div>' +
      '<button class="toggle' + (d.requireIntro ? " on" : "") + '" type="button" data-action="tut-toggle-require" aria-pressed="' + (d.requireIntro ? "true" : "false") + '"><i></i></button></div>' +
      '<div class="field" style="margin-top:10px"><label>Minimum watched</label>' +
      '<div class="conf-row"><input id="introMinPct" type="range" min="70" max="100" step="1" value="' + (d.minWatchedPct || 90) + '">' +
      '<span class="conf-val" id="introMinPctVal">' + (d.minWatchedPct || 90) + "%</span></div></div>" +
      "<h3 style=\"margin:18px 0 6px;font-size:15px\">Intro watched</h3>" +
      '<p class="panel-sub">' + yes + " of " + list.length + " members have watched the intro · " + no + " have not</p>" +
      '<div style="overflow:auto"><table><thead><tr><th>Member</th><th>Trade</th><th>Intro</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
      (prev ? '<div class="tut-prev"><h4>Previous intro videos</h4>' + prev + "</div>" : "") +
      "</div>";
  }

  function sectionsPanel() {
    var d = data();
    var secs = d.sections.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    var body = secs.map(function (s, idx) {
      var vids = d.videos.filter(function (v) { return v.sectionId === s.id && !v.archived; })
        .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
      var hidden = s.hidden ? " is-hidden" : "";
      var rows = vids.map(function (v) {
        return '<div class="tut-row' + (v.hidden ? " is-hidden" : "") + '">' + (v.thumb ? '<img src="' + esc(v.thumb) + '" alt="">' : "") +
          '<div class="meta"><strong>' + esc(v.title) + "</strong><span class=\"devi-note\" style=\"display:block\">" + esc(v.provider || "") + (v.duration ? " · " + esc(v.duration) : "") + (v.sample ? " · sample" : "") + (v.hidden ? " · hidden" : "") + "</span></div>" +
          '<div class="row-actions">' +
          '<button class="btn btn-ghost btn-sm" type="button" data-action="tut-edit-video" data-id="' + v.id + '">Edit</button>' +
          '<button class="btn btn-ghost btn-sm" type="button" data-action="tut-hide-video" data-id="' + v.id + '">' + (v.hidden ? "Show" : "Hide") + "</button></div></div>";
      }).join("") || '<p class="panel-sub">No videos in this section yet.</p>';
      return '<div class="tut-admin-sec' + hidden + '"><div class="sec-h"><h3>' + esc(s.title) + (s.hidden ? " · hidden" : "") + "</h3>" +
        (idx > 0 ? '<button class="btn btn-ghost btn-sm" type="button" data-action="tut-sec-up" data-id="' + s.id + '">Up</button>' : "") +
        (idx < secs.length - 1 ? '<button class="btn btn-ghost btn-sm" type="button" data-action="tut-sec-down" data-id="' + s.id + '">Down</button>' : "") +
        '<button class="btn btn-ghost btn-sm" type="button" data-action="tut-sec-rename" data-id="' + s.id + '">Rename</button>' +
        '<button class="btn btn-ghost btn-sm" type="button" data-action="tut-sec-hide" data-id="' + s.id + '">' + (s.hidden ? "Show section" : "Hide section") + "</button></div>" + rows + "</div>";
    }).join("");
    return panel("Tutorial sections", "Create sections such as Getting started or Leaving Google Reviews. The app shows them as category buttons: All first, then A–Z by name. Hidden sections and sections with no visible videos are left out. Hide a section or video instead of deleting it.",
      '<button class="btn btn-primary btn-sm" type="button" data-action="tut-add-section">Add a section</button>',
      body);
  }

  function addForm() {
    var d = data();
    var parsed = parseOrNull(formDraft.url);
    var editing = editingVideo ? d.videos.filter(function (v) { return v.id === editingVideo; })[0] : null;
    if (editing && !formDraft._loaded) {
      formDraft = { url: editing.url, title: editing.title, description: editing.description, sectionId: editing.sectionId, duration: editing.duration || "", _loaded: true };
      parsed = parseOrNull(formDraft.url);
    }
    var opts = d.sections.map(function (s) {
      return '<option value="' + s.id + '"' + (formDraft.sectionId === s.id ? " selected" : "") + ">" + esc(s.title) + "</option>";
    }).join("");
    return panel(editing ? "Edit video" : "Add a video", "Paste a YouTube or Vimeo link. The provider and thumbnail are detected automatically.", "",
      '<div class="field"><label>YouTube or Vimeo URL</label><input id="tutUrl" type="url" value="' + esc(formDraft.url) + '" placeholder="https://www.youtube.com/watch?v=… or https://vimeo.com/…"></div>' +
      (parsed ? '<div class="tut-url-preview">' + thumb(parsed.thumb) + "<div><strong>" + esc(parsed.provider === "youtube" ? "YouTube" : "Vimeo") + " detected</strong><div class=\"panel-sub\">Thumbnail preview</div></div></div>" :
        (formDraft.url ? '<p class="devi-note">That doesn’t look like a YouTube or Vimeo link yet.</p>' : "")) +
      '<div class="field"><label>Title</label><input id="tutTitle" type="text" value="' + esc(formDraft.title) + '"></div>' +
      '<div class="field"><label>Short description</label><textarea id="tutDesc" rows="2">' + esc(formDraft.description) + "</textarea></div>" +
      '<div class="field"><label>Section</label><select id="tutSection">' + opts + "</select></div>" +
      '<div class="field"><label>Duration <span class="opt">(optional)</span></label><input id="tutDur" type="text" placeholder="e.g. 3:05" value="' + esc(formDraft.duration) + '"></div>' +
      '<button class="btn btn-primary" type="button" data-action="tut-save-video">' + (editing ? "Save video" : "Add video") + "</button>" +
      (editing ? ' <button class="btn btn-ghost" type="button" data-action="tut-cancel-edit">Cancel</button>' : ""));
  }

  function pageHTML(page) {
    if (page !== "tutorials") return null;
    return (flash ? '<div class="devi-toast">' + esc(flash) + "</div>" : "") +
      '<div class="devi-toolbar"><span class="panel-sub" style="margin:0">Fictional sample videos, clearly marked. Hide or archive — nothing is deleted.</span></div>' +
      introPanel() +
      '<div class="devi-grid two" style="margin-top:8px">' + sectionsPanel() + addForm() + "</div>";
  }

  function grabForm() {
    var url = document.getElementById("tutUrl");
    var title = document.getElementById("tutTitle");
    var desc = document.getElementById("tutDesc");
    var sec = document.getElementById("tutSection");
    var dur = document.getElementById("tutDur");
    if (url) formDraft.url = url.value;
    if (title) formDraft.title = title.value;
    if (desc) formDraft.description = desc.value;
    if (sec) formDraft.sectionId = sec.value;
    if (dur) formDraft.duration = dur.value;
  }
  function grabIntro() {
    introDraft = {
      url: (document.getElementById("introUrl") || {}).value || "",
      title: (document.getElementById("introTitle") || {}).value || "",
      description: (document.getElementById("introDesc") || {}).value || "",
      duration: (document.getElementById("introDuration") || {}).value || ((document.getElementById("introTitle") && data().intro && data().intro.duration) || "")
    };
  }

  function handle(a, id, btn) {
    if (a.indexOf("tut-") !== 0) return false;
    var d = data();
    if (a === "tut-toggle-require") {
      d.requireIntro = !d.requireIntro;
      Tut().save(d);
      flash = d.requireIntro ? "New members must watch the intro before they can continue." : "The intro is optional for new members.";
      return true;
    }
    if (a === "tut-save-intro") {
      grabIntro();
      var res = Tut().setIntroFromUrl({
        url: introDraft.url,
        title: introDraft.title,
        description: introDraft.description,
        duration: introDraft.duration || (d.intro && d.intro.duration),
        durationSec: d.intro && d.intro.durationSec,
        sample: /youtube\.com\/watch\?v=(aqz-KE-bpKQ|eRsGyueVLvQ|jNQXAC9IVRw)|vimeo\.com\/1084537/.test(introDraft.url)
      });
      flash = res.error || "Intro video saved. If you replaced it, the old one is under Previous intro videos.";
      introDraft = null;
      return true;
    }
    if (a === "tut-add-section") {
      var name = (typeof window.prompt === "function" && window.prompt("Section name, for example Getting started", "New section")) || "";
      name = String(name || "").trim();
      if (!name) { flash = "Section not added."; return true; }
      var nid = "sec-" + Date.now();
      d.sections.push({ id: nid, title: name, order: d.sections.length + 1, hidden: false });
      Tut().save(d);
      flash = "Section “" + name + "” added.";
      return true;
    }
    if (a === "tut-sec-rename") {
      var sec = d.sections.filter(function (s) { return s.id === id; })[0];
      if (!sec) return true;
      var nn = (typeof window.prompt === "function" && window.prompt("Rename section", sec.title)) || sec.title;
      nn = String(nn || "").trim();
      if (nn) { sec.title = nn; Tut().save(d); flash = "Section renamed."; }
      return true;
    }
    if (a === "tut-sec-hide") {
      d.sections.forEach(function (s) { if (s.id === id) s.hidden = !s.hidden; });
      Tut().save(d);
      flash = "Section visibility updated. It was not deleted.";
      return true;
    }
    if (a === "tut-sec-up" || a === "tut-sec-down") {
      var list = d.sections.slice().sort(function (x, y) { return (x.order || 0) - (y.order || 0); });
      var at = -1, j;
      for (j = 0; j < list.length; j++) if (list[j].id === id) at = j;
      var swap = a === "tut-sec-up" ? at - 1 : at + 1;
      if (at >= 0 && swap >= 0 && swap < list.length) {
        var tmp = list[at].order; list[at].order = list[swap].order; list[swap].order = tmp;
        Tut().save(d);
      }
      flash = "Section order updated. The Introduction video section stays first.";
      return true;
    }
    if (a === "tut-hide-video") {
      d.videos.forEach(function (v) { if (v.id === id) v.hidden = !v.hidden; });
      Tut().save(d);
      flash = "Video visibility updated. It was not deleted.";
      return true;
    }
    if (a === "tut-edit-video") {
      editingVideo = id;
      formDraft = { url: "", title: "", description: "", sectionId: "getting-started", duration: "", _loaded: false };
      flash = "";
      return true;
    }
    if (a === "tut-cancel-edit") {
      editingVideo = null;
      formDraft = { url: "", title: "", description: "", sectionId: "getting-started", duration: "" };
      flash = "";
      return true;
    }
    if (a === "tut-save-video") {
      grabForm();
      var p = parseOrNull(formDraft.url);
      if (!p) { flash = "Paste a YouTube or Vimeo link."; return true; }
      if (!formDraft.title.trim()) { flash = "Add a title."; return true; }
      if (editingVideo) {
        d.videos.forEach(function (v) {
          if (v.id === editingVideo) {
            v.url = p.url; v.provider = p.provider; v.videoId = p.videoId; v.thumb = p.thumb; v.embed = p.embed;
            v.title = formDraft.title.trim(); v.description = formDraft.description; v.sectionId = formDraft.sectionId;
            v.duration = formDraft.duration;
          }
        });
        flash = "Video updated.";
      } else {
        d.videos.push({
          id: "v-" + Date.now(), sectionId: formDraft.sectionId, url: p.url, provider: p.provider, videoId: p.videoId,
          thumb: p.thumb, embed: p.embed, title: formDraft.title.trim(), description: formDraft.description,
          duration: formDraft.duration, order: d.videos.length + 1, hidden: false, sample: false
        });
        flash = "Video added.";
      }
      Tut().save(d);
      editingVideo = null;
      formDraft = { url: "", title: "", description: "", sectionId: formDraft.sectionId, duration: "" };
      return true;
    }
    return false;
  }

  function attach() {
    document.addEventListener("input", function (e) {
      if (e.target && e.target.id === "introMinPct") {
        var d = data();
        d.minWatchedPct = Number(e.target.value) || 90;
        Tut().save(d);
        var lab = document.getElementById("introMinPctVal");
        if (lab) lab.textContent = d.minWatchedPct + "%";
      }
      if (e.target && e.target.id === "tutUrl") {
        grabForm();
        if (window.TCAdmin && TCAdmin.paint) TCAdmin.paint();
      }
      if (e.target && e.target.id === "introUrl") {
        /* live thumb: store draft only, paint if needed */
        grabIntro();
      }
    });
  }

  window.TC181Admin = { pageHTML: pageHTML, handle: handle, attach: attach, flash: function () { return flash; } };
})();
