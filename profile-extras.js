/* TradeCircle Perth — richer profile sections (v1.5.4) */
(function (root) {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function esa(s) { return esc(s); }

  var SUBURBS = ["Midland", "Mundaring", "Ellenbrook", "Joondalup", "Wanneroo", "Kwinana", "Rockingham", "Fremantle", "Armadale", "Cannington", "Morley", "Scarborough", "Subiaco", "Perth"];
  var TRADE_CHIPS = ["Pest Control", "Carpenter", "Builder", "Electrician", "Plumber", "Painter", "Landscaper", "Roofer", "Fencer", "Tiler", "Air Conditioning", "Handyman"];
  var TONES = {
    teal: "linear-gradient(160deg,#14C38A 0%,#0B1F33 100%)",
    amber: "linear-gradient(160deg,#FFD56A 0%,#C06A00 100%)",
    navy: "linear-gradient(160deg,#3D6A96 0%,#0B1F33 100%)",
    coral: "linear-gradient(160deg,#F08A6B 0%,#8A2F2A 100%)",
    moss: "linear-gradient(160deg,#8FBF4A 0%,#2A4A18 100%)",
    violet: "linear-gradient(160deg,#9B7BE8 0%,#3A2868 100%)",
    rust: "linear-gradient(160deg,#E08A4A 0%,#6A2E12 100%)",
    sky: "linear-gradient(160deg,#6EC4F0 0%,#1C4B73 100%)"
  };
  var ICONS = {
    bug: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="5"/><path d="M12 8V5M8 6l1.5 2M16 6l-1.5 2M7 13H4M20 13h-3M8 17l-2 3M16 17l2 3"/></svg>',
    house: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5L12 4l9 7.5"/><path d="M6 10.5V20h12V10.5"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3L6 14h6l-1 7 8-12h-6l0-6z"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c8-1 14-8 14-16-8 0-15 6-16 14 3-1 6-1 8 0"/><path d="M8 16c2-3 5-6 9-8"/></svg>',
    fence: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V8l2-3 2 3v12M10 20V8l2-3 2 3v12M16 20V8l2-3 2 3v12M3 12h18"/></svg>',
    paint: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4l6 6-8 8H6v-6l8-8z"/><path d="M12 6l6 6"/><path d="M6 20h4"/></svg>',
    wrench: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 015 5.1L14 17l-4-4 5.6-5.6z"/><path d="M8 14l-4 4 2 2 4-4"/></svg>',
    drop: '<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 7 6 11a6 6 0 11-12 0c0-4 6-11 6-11z"/></svg>'
  };

  function empty() {
    return { years: "", serviceAreas: [], specialties: [], licences: [], gallery: [], idealTrades: [], idealNote: "", goals: [] };
  }

  function list(v) {
    if (Array.isArray(v)) return v.map(function (s) { return String(s || "").trim(); }).filter(Boolean);
    if (v == null || v === "") return [];
    return String(v).split(/[\n,]/).map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function normalize(p) {
    p = p || {};
    var out = empty();
    out.years = p.years === 0 || p.years ? String(p.years) : "";
    out.serviceAreas = list(p.serviceAreas);
    out.specialties = list(p.specialties);
    out.licences = list(p.licences);
    out.idealTrades = list(p.idealTrades);
    out.idealNote = p.idealNote || "";
    out.gallery = Array.isArray(p.gallery) ? p.gallery.map(function (g, i) {
      return { id: g.id || ("g" + (i + 1)), title: g.title || ("Job photo " + (i + 1)), tone: g.tone || "teal", icon: g.icon || "house" };
    }) : [];
    out.goals = Array.isArray(p.goals) ? p.goals.map(function (g, i) {
      return { id: g.id || ("goal" + (i + 1)), label: g.label || "", current: Number(g.current) || 0, target: Number(g.target) || 0 };
    }).filter(function (g) { return g.label; }) : [];
    return out;
  }

  function tile(title, tone, icon) { return { id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), title: title, tone: tone, icon: icon }; }
  function goal(label, current, target) { return { id: label.slice(0, 12).replace(/\s+/g, "-").toLowerCase(), label: label, current: current, target: target }; }

  var SEEDS = {
    jamie: {
      years: 14,
      serviceAreas: ["Midland", "Mundaring", "Ellenbrook", "Joondalup", "Wanneroo"],
      specialties: ["Termite inspections", "Pre-purchase inspections", "General pest", "Commercial"],
      licences: ["Pest management technician licence (WA)"],
      gallery: [tile("Termite inspection", "teal", "bug"), tile("Treatment around the home", "moss", "house"), tile("Pre-purchase report", "navy", "wrench"), tile("Garden treatment", "amber", "leaf")],
      idealTrades: ["Carpenter", "Builder", "Electrician"],
      idealNote: "I work well with carpenters and builders when a renovation needs a termite inspection first.",
      goals: [goal("Leave 8 genuine Google reviews this quarter", 5, 8), goal("Meet 6 new tradies in the Hills", 4, 6), goal("Comment on 4 recommendation alerts this month", 2, 4)]
    },
    sarah: {
      years: 9,
      serviceAreas: ["Joondalup", "Wanneroo", "Scarborough", "Perth"],
      specialties: ["Kitchens", "Decks", "Home renovations", "Custom joinery"],
      licences: ["Registered builder (restricted)"],
      gallery: [tile("Kitchen joinery", "coral", "house"), tile("New deck", "amber", "leaf"), tile("Renovation framing", "navy", "wrench")],
      idealTrades: ["Electrician", "Plumber", "Painter", "Tiler"],
      idealNote: "I often need a sparky, a plumber and a tiler on the same kitchen or bathroom job.",
      goals: [goal("Refer 5 trusted trades this quarter", 3, 5), goal("Get 10 Google reviews from real jobs", 6, 10)]
    },
    jack: {
      years: 11,
      serviceAreas: ["Kwinana", "Rockingham", "Safety Bay"],
      specialties: ["Safety switch upgrades", "Rewires", "Solar-ready boards", "Lighting"],
      licences: ["Electrical contractor licence (WA)", "Working at heights"],
      gallery: [tile("Switchboard upgrade", "amber", "bolt"), tile("New lighting", "navy", "house"), tile("Site fit-off", "teal", "wrench")],
      idealTrades: ["Builder", "Air Conditioning", "Carpenter"],
      idealNote: "Happy to team up with builders and air-con techs on new homes and upgrades.",
      goals: [goal("Finish 6 safety-switch jobs this month", 6, 6), goal("Meet 4 new builders in Kwinana", 1, 4)]
    },
    tom: {
      years: 8,
      serviceAreas: ["Mundaring", "Armadale", "Midland"],
      specialties: ["Colorbond fences", "Timber fences", "Gates", "Retaining"],
      licences: [],
      gallery: [tile("Colorbond fence", "olive", "fence"), tile("Timber gate", "amber", "fence"), tile("Boundary fence", "moss", "house")],
      idealTrades: ["Landscaper", "Builder", "Carpenter"],
      idealNote: "Landscapers and builders often call me in when a new yard or home needs a fence and gate.",
      goals: [goal("Share 3 Facebook recommendations this month", 1, 3)]
    },
    liam: {
      years: 16,
      serviceAreas: ["Fremantle", "Cannington", "Perth"],
      specialties: ["Bathroom fit-outs", "Hot water", "Blocked drains"],
      licences: ["Plumbing and gas fitting licence (WA)"],
      gallery: [tile("Bathroom rough-in", "navy", "drop"), tile("Hot water install", "sky", "wrench")],
      idealTrades: ["Tiler", "Electrician", "Carpenter"],
      idealNote: "Bathroom jobs go smoothly when I can call a tiler and a sparky I already know.",
      goals: [goal("Get 6 Google reviews this quarter", 2, 6)]
    },
    priya: {
      years: 7,
      serviceAreas: ["Morley", "Midland", "Perth"],
      specialties: ["Interior painting", "Exteriors", "Colour consults"],
      licences: [],
      gallery: [tile("Interior repaint", "violet", "paint"), tile("Exterior trim", "coral", "house")],
      idealTrades: ["Carpenter", "Plasterer"],
      idealNote: "I like to follow a carpenter or plasterer so the paint goes on a tidy surface.",
      goals: [goal("Meet 5 new renovators this quarter", 2, 5)]
    },
    mei: {
      years: 10,
      serviceAreas: ["Mundaring", "Ellenbrook", "Midland"],
      specialties: ["Garden design", "Paving", "Retaining walls"],
      licences: [],
      gallery: [tile("Paving and garden", "moss", "leaf"), tile("Retaining wall", "teal", "house")],
      idealTrades: ["Fencer", "Carpenter", "Electrician"],
      idealNote: "A fence builder and a carpenter on the same site makes a garden job finish cleanly.",
      goals: [goal("Do 4 jobs with another circle member", 2, 4)]
    },
    emma: {
      years: 6,
      serviceAreas: ["Joondalup", "Perth", "Subiaco"],
      specialties: ["Split-system installs", "Servicing", "Office fit-outs"],
      licences: ["Refrigerant handling licence"],
      gallery: [tile("Split-system install", "sky", "house")],
      idealTrades: ["Electrician", "Builder"],
      idealNote: "I need a licensed electrician on most install days.",
      goals: [goal("Leave 5 genuine reviews this quarter", 1, 5)]
    }
  };

  function seedFor(m) {
    if (!m) return empty();
    return normalize(SEEDS[m.id] || {});
  }

  function fromMember(m) {
    if (!m) return empty();
    if (m.profile && (m.profile.years || (m.profile.gallery && m.profile.gallery.length) || (m.profile.specialties && m.profile.specialties.length))) {
      return normalize(m.profile);
    }
    return seedFor(m);
  }

  function applyToMember(m, p) {
    if (!m) return;
    m.profile = normalize(p);
  }

  function hydrate(list) {
    (list || []).forEach(function (m) {
      if (!m.profile) m.profile = seedFor(m);
      else m.profile = normalize(Object.assign(seedFor(m), m.profile));
    });
  }

  function chips(arr, cls) {
    return (arr || []).map(function (t) {
      return '<span class="pill ' + (cls || "t-pill") + '">' + esc(t) + "</span>";
    }).join("");
  }

  function galleryTile(item, i, mid, mine) {
    var bg = TONES[item.tone] || TONES.teal;
    var ico = ICONS[item.icon] || ICONS.house;
    var remove = mine
      ? '<button type="button" class="gal-remove" data-action="gal-remove" data-id="' + esa(mid) + '" data-gid="' + esa(item.id) + '" aria-label="Remove photo">×</button>'
      : "";
    return '<div class="gal-cell"><button type="button" class="gal-tile" data-action="gal-open" data-id="' + esa(mid) + '" data-index="' + i + '" style="background:' + bg + '">' +
      '<span class="gal-ico" aria-hidden="true">' + ico + "</span>" +
      '<span class="gal-cap">' + esc(item.title) + "</span></button>" + remove + "</div>";
  }

  function viewHTML(m, opts) {
    opts = opts || {};
    var p = fromMember(m);
    var mine = !!opts.mine;
    var mid = (m && m.id) || "";
    var parts = [];

    var aboutBits = [];
    if (m && m.bio) aboutBits.push('<p class="bio" style="margin:0">' + esc(m.bio) + "</p>");
    if (p.years) aboutBits.push('<div class="profile-stat"><span class="k">Years in business</span><span class="v">' + esc(p.years) + " years</span></div>");
    if (p.serviceAreas.length) aboutBits.push('<div class="profile-stat"><span class="k">Service areas</span><div class="tags" style="margin-top:6px">' + chips(p.serviceAreas, "r-pill") + "</div></div>");
    if (aboutBits.length) {
      parts.push('<section class="profile-block"><h3 class="profile-h">About my business</h3>' + aboutBits.join("") + "</section>");
    }

    var exp = [];
    if (p.specialties.length) exp.push('<div class="tags">' + chips(p.specialties, "t-pill") + "</div>");
    if (p.licences.length) {
      exp.push('<p class="profile-stat k" style="margin:10px 0 4px">Licences</p><ul class="licence-list">' + p.licences.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>");
    }
    if (exp.length) parts.push('<section class="profile-block"><h3 class="profile-h">Expertise</h3>' + exp.join("") + "</section>");

    if (p.gallery.length || mine) {
      var add = mine
        ? '<div class="gal-cell"><button type="button" class="gal-tile gal-add" data-action="gal-add" data-id="' + esa(mid) + '"><span class="gal-ico" aria-hidden="true">+</span><span class="gal-cap">Add photo</span></button></div>'
        : "";
      var emptyGal = !p.gallery.length ? '<p class="hint" style="margin:0 0 8px">No job photos yet. Add a few so other members can see the kind of work you do. These are placeholders in the prototype.</p>' : "";
      parts.push('<section class="profile-block"><h3 class="profile-h">Image gallery</h3>' + emptyGal +
        '<div class="gal-grid">' + p.gallery.map(function (g, i) { return galleryTile(g, i, mid, mine); }).join("") + add + "</div>" +
        (mine ? '<p class="hint">Photos are placeholders in this prototype. Tap a tile to view it full screen. Add or remove is a mock only.</p>' : "") +
        "</section>");
    }

    if (p.idealTrades.length || p.idealNote) {
      parts.push('<section class="profile-block"><h3 class="profile-h">My ideal referral partner</h3>' +
        (p.idealTrades.length ? '<div class="tags">' + chips(p.idealTrades, "t-pill") + "</div>" : "") +
        (p.idealNote ? '<p class="ideal-note">' + esc(p.idealNote) + "</p>" : "") +
        "</section>");
    }

    if (p.goals.length) {
      var rows = p.goals.map(function (g) {
        var pct = g.target ? Math.max(0, Math.min(100, Math.round((g.current / g.target) * 100))) : 0;
        var done = g.target && g.current >= g.target;
        return '<div class="goal-row' + (done ? " done" : "") + '"><div class="goal-top"><span>' + esc(g.label) + "</span><strong>" + g.current + " of " + g.target + "</strong></div>" +
          '<div class="goal-bar" role="progressbar" aria-valuenow="' + g.current + '" aria-valuemin="0" aria-valuemax="' + g.target + '"><i style="width:' + pct + '%"></i></div></div>';
      }).join("");
      parts.push('<section class="profile-block"><h3 class="profile-h">My goals</h3>' + rows + "</section>");
    }

    if (!parts.length) return "";
    return '<div class="profile-extras">' + parts.join("") + "</div>";
  }

  function chipToggle(name, value, on) {
    return '<button type="button" class="chip' + (on ? " active" : "") + '" data-profile-chip="' + esa(name) + '" data-value="' + esa(value) + '">' + esc(value) + "</button>";
  }

  function editFields(p) {
    p = normalize(p);
    function csv(arr) { return (arr || []).join(", "); }
    var goalRows = (p.goals.length ? p.goals : [{ label: "", current: "", target: "" }]).map(function (g, i) {
      return '<div class="goal-edit field" data-goal-row>' +
        '<input data-goal="label" placeholder="Goal, e.g. Meet 5 new tradies" value="' + esa(g.label || "") + '">' +
        '<div class="goal-nums"><input data-goal="current" inputmode="numeric" placeholder="Now" value="' + esa(g.current === 0 || g.current ? g.current : "") + '">' +
        '<span>of</span>' +
        '<input data-goal="target" inputmode="numeric" placeholder="Target" value="' + esa(g.target || "") + '"></div></div>';
    }).join("");
    return '<div class="profile-edit" data-profile-edit="1">' +
      '<p class="group-label">About my business <span class="opt">(optional)</span></p>' +
      '<div class="field"><label>Years in business</label><input name="profileYears" inputmode="numeric" placeholder="e.g. 10" value="' + esa(p.years) + '"></div>' +
      '<div class="field"><label>Service areas</label><input name="profileAreas" placeholder="Suburbs, separated by commas" value="' + esa(csv(p.serviceAreas)) + '">' +
      '<div class="chips chips-tight" style="margin-top:8px">' + SUBURBS.map(function (s) { return chipToggle("serviceAreas", s, p.serviceAreas.indexOf(s) !== -1); }).join("") + "</div></div>" +
      '<p class="group-label">Expertise <span class="opt">(optional)</span></p>' +
      '<div class="field"><label>Specialties</label><input name="profileSpecialties" placeholder="e.g. Termite inspections, Decks" value="' + esa(csv(p.specialties)) + '"></div>' +
      '<div class="field"><label>Licences</label><textarea name="profileLicences" rows="2" placeholder="One licence per line">' + esc(p.licences.join("\n")) + "</textarea></div>" +
      '<p class="group-label">My ideal referral partner <span class="opt">(optional)</span></p>' +
      '<div class="chips chips-tight">' + TRADE_CHIPS.map(function (s) { return chipToggle("idealTrades", s, p.idealTrades.indexOf(s) !== -1); }).join("") + "</div>" +
      '<input type="hidden" name="profileIdealTrades" value="' + esa(csv(p.idealTrades)) + '">' +
      '<div class="field" style="margin-top:8px"><label>A short sentence</label><textarea name="profileIdealNote" rows="2" placeholder="Who you like to work with, and why">' + esc(p.idealNote) + "</textarea></div>" +
      '<p class="group-label">My goals <span class="opt">(optional)</span></p>' +
      '<div data-goal-list>' + goalRows + "</div>" +
      '<button type="button" class="btn btn-ghost ink" data-action="add-goal" style="margin:4px 0 12px">Add a goal</button>' +
      '<p class="hint">Job photos can be added or removed on My profile. These fields are optional and you can leave them blank.</p>' +
      "</div>";
  }

  function collect(form, current) {
    var p = normalize(current);
    if (!form) return p;
    var years = form.querySelector("[name='profileYears']");
    var areas = form.querySelector("[name='profileAreas']");
    var spec = form.querySelector("[name='profileSpecialties']");
    var lic = form.querySelector("[name='profileLicences']");
    var note = form.querySelector("[name='profileIdealNote']");
    var idealHid = form.querySelector("[name='profileIdealTrades']");
    if (years) p.years = String(years.value || "").trim();
    if (areas) p.serviceAreas = list(areas.value);
    if (spec) p.specialties = list(spec.value);
    if (lic) p.licences = list(lic.value);
    if (note) p.idealNote = String(note.value || "").trim();
    if (idealHid) p.idealTrades = list(idealHid.value);
    var goals = [];
    form.querySelectorAll("[data-goal-row]").forEach(function (row) {
      var label = (row.querySelector("[data-goal='label']") || {}).value || "";
      if (!String(label).trim()) return;
      goals.push({
        label: String(label).trim(),
        current: Number((row.querySelector("[data-goal='current']") || {}).value) || 0,
        target: Number((row.querySelector("[data-goal='target']") || {}).value) || 0
      });
    });
    if (form.querySelector("[data-goal-row]")) p.goals = goals;
    return p;
  }

  function syncChipInput(form, name, hiddenName, joinedInto) {
    var selected = [];
    form.querySelectorAll('[data-profile-chip="' + name + '"].active').forEach(function (b) {
      selected.push(b.getAttribute("data-value"));
    });
    var hid = form.querySelector("[name='" + (hiddenName || "") + "']");
    if (hid) hid.value = selected.join(", ");
    var inp = form.querySelector("[name='" + (joinedInto || "") + "']");
    if (inp && name === "serviceAreas") {
      var typed = list(inp.value);
      selected.forEach(function (s) { if (typed.indexOf(s) === -1) typed.push(s); });
      /* also drop unchecked suburbs that were only from chips */
      inp.value = typed.filter(function (s) {
        if (SUBURBS.indexOf(s) === -1) return true;
        return selected.indexOf(s) !== -1;
      }).join(", ");
    }
  }

  function bindForm(form) {
    if (!form || form.getAttribute("data-profile-bound") === "1") return;
    form.setAttribute("data-profile-bound", "1");
    form.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-profile-chip]");
      if (chip) {
        e.preventDefault();
        chip.classList.toggle("active");
        var name = chip.getAttribute("data-profile-chip");
        if (name === "serviceAreas") syncChipInput(form, name, "", "profileAreas");
        if (name === "idealTrades") syncChipInput(form, name, "profileIdealTrades", "");
      }
      if (e.target.closest("[data-action='add-goal']")) {
        e.preventDefault();
        var listEl = form.querySelector("[data-goal-list]");
        if (listEl) listEl.insertAdjacentHTML("beforeend",
          '<div class="goal-edit field" data-goal-row><input data-goal="label" placeholder="Goal, e.g. Meet 5 new tradies" value="">' +
          '<div class="goal-nums"><input data-goal="current" inputmode="numeric" placeholder="Now" value=""><span>of</span>' +
          '<input data-goal="target" inputmode="numeric" placeholder="Target" value=""></div></div>');
      }
    });
  }

  var viewer = { open: false, mid: "", index: 0, items: [] };

  function closeViewer() {
    var el = document.getElementById("galleryViewer");
    if (el) el.remove();
    viewer.open = false;
  }

  function renderViewer() {
    var el = document.getElementById("galleryViewer");
    if (!el || !viewer.items.length) return;
    var i = viewer.index;
    var item = viewer.items[i];
    var bg = TONES[item.tone] || TONES.teal;
    var ico = ICONS[item.icon] || ICONS.house;
    el.querySelector(".gal-view-stage").style.background = bg;
    el.querySelector(".gal-view-ico").innerHTML = ico;
    el.querySelector(".gal-view-title").textContent = item.title;
    el.querySelector(".gal-view-count").textContent = (i + 1) + " of " + viewer.items.length;
    el.querySelector("[data-action='gal-prev']").disabled = viewer.items.length < 2;
    el.querySelector("[data-action='gal-next']").disabled = viewer.items.length < 2;
  }

  function openViewer(mid, index) {
    var m = null;
    try { m = (window.TradeCircle && TradeCircle.MEMBERS || []).filter(function (x) { return x.id === mid; })[0]; } catch (e) {}
    var items = fromMember(m).gallery;
    if (!items.length) return;
    viewer.mid = mid;
    viewer.items = items;
    viewer.index = Math.max(0, Math.min(items.length - 1, Number(index) || 0));
    viewer.open = true;
    closeViewer();
    viewer.open = true;
    var host = document.getElementById("phone") || document.body;
    var wrap = document.createElement("div");
    wrap.id = "galleryViewer";
    wrap.className = "gal-viewer";
    wrap.innerHTML = '<div class="gal-view-panel">' +
      '<button type="button" class="gal-view-close" data-action="gal-close" aria-label="Close">Close</button>' +
      '<div class="gal-view-stage"><span class="gal-view-ico" aria-hidden="true"></span></div>' +
      '<div class="gal-view-meta"><div class="gal-view-title"></div><div class="gal-view-count"></div></div>' +
      '<div class="gal-view-nav"><button type="button" data-action="gal-prev">Previous</button>' +
      '<button type="button" data-action="gal-next">Next</button></div></div>';
    host.appendChild(wrap);
    renderViewer();
    var startX = 0, startY = 0, tracking = false;
    var stage = wrap.querySelector(".gal-view-stage");
    function onStart(ev) {
      var t = ev.touches ? ev.touches[0] : ev;
      startX = t.clientX; startY = t.clientY; tracking = true;
    }
    function onEnd(ev) {
      if (!tracking) return;
      tracking = false;
      var t = ev.changedTouches ? ev.changedTouches[0] : ev;
      var dx = t.clientX - startX, dy = t.clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) step(1); else step(-1);
      }
    }
    stage.addEventListener("touchstart", onStart, { passive: true });
    stage.addEventListener("touchend", onEnd);
    stage.addEventListener("pointerdown", onStart);
    stage.addEventListener("pointerup", onEnd);
  }

  function step(dir) {
    if (!viewer.items.length) return;
    viewer.index = (viewer.index + dir + viewer.items.length) % viewer.items.length;
    renderViewer();
  }

  var ADD_POOL = [
    tile("On-site work", "navy", "wrench"),
    tile("Finished job", "teal", "house"),
    tile("Before and after", "amber", "paint"),
    tile("Detail shot", "moss", "leaf"),
    tile("Workshop", "coral", "wrench")
  ];

  function addPhoto(m) {
    if (!m) return;
    var p = fromMember(m);
    var used = p.gallery.map(function (g) { return g.title; });
    var next = ADD_POOL.filter(function (t) { return used.indexOf(t.title) === -1; })[0] || tile("Job photo " + (p.gallery.length + 1), "sky", "house");
    next = { id: "g" + Date.now(), title: next.title, tone: next.tone, icon: next.icon };
    p.gallery.push(next);
    applyToMember(m, p);
  }

  function removePhoto(m, gid) {
    if (!m) return;
    var p = fromMember(m);
    p.gallery = p.gallery.filter(function (g) { return g.id !== gid; });
    applyToMember(m, p);
  }

  function adminHTML(m) {
    return viewHTML(m, { mine: false });
  }

  root.TCProfile = {
    empty: empty,
    normalize: normalize,
    fromMember: fromMember,
    applyToMember: applyToMember,
    hydrate: hydrate,
    seedFor: seedFor,
    viewHTML: viewHTML,
    editFields: editFields,
    collect: collect,
    bindForm: bindForm,
    openViewer: openViewer,
    closeViewer: closeViewer,
    step: step,
    addPhoto: addPhoto,
    removePhoto: removePhoto,
    adminHTML: adminHTML,
    SUBURBS: SUBURBS
  };
})(typeof window !== "undefined" ? window : global);
