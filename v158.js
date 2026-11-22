/* TradeCircle Perth v2.1.1 — complete-profile, demo signup, finish-profile card */
(function (root) {
  "use strict";

  var SPEC_CHIPS = ["Pest Control", "Termite inspections", "General pests", "Rodent control", "Commercial", "Residential", "Emergency call-outs", "Pre-purchase inspections"];
  var IDEAL_CHIPS = ["Plumber", "Electrician", "Builder", "Carpenter", "Roofer", "Painter", "Landscaper", "Air conditioning", "Tiler", "Handyman"];

  function T() { return root.TradeCircle || {}; }
  function state() { return T().state || {}; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }
  function toast(msg) { if (T().toast) T().toast(msg); }
  function go(id) { if (T().go) T().go(id); }

  function ensureOnboarding() {
    var s = state();
    if (!s.onboarding) s.onboarding = { fresh: false, forceComplete: false, skipped: false, done: false, fill: {} };
    if (!s.onboarding.fill) s.onboarding.fill = {};
    return s.onboarding;
  }

  function fillOf() {
    var o = ensureOnboarding();
    var f = o.fill || {};
    if (!f.links) f.links = (root.TCLinks && TCLinks.empty) ? TCLinks.empty() : {};
    if (!f.specialties) f.specialties = [];
    if (!f.idealTrades) f.idealTrades = [];
    o.fill = f;
    return f;
  }

  function list(v) {
    if (Array.isArray(v)) return v.filter(Boolean);
    return String(v || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean);
  }

  function completeness(fill) {
    fill = fill || fillOf();
    var links = fill.links || {};
    var hasLink = ["facebook", "google"].some(function (k) {
      return String(links[k] || "").trim();
    });
    var bins = [
      hasLink,
      !!(fill.bio || "").trim(),
      !!(fill.tagline || "").trim(),
      !!(fill.goal || "").trim(),
      !!(fill.about || "").trim(),
      list(fill.specialties).length > 0,
      list(fill.idealTrades).length > 0 || !!(fill.idealNote || "").trim()
    ];
    var n = bins.filter(Boolean).length;
    return { n: n, total: 7, pct: Math.round((n / 7) * 100) };
  }

  function shouldShowFinish() {
    var o = state().onboarding;
    if (!o || o.forceComplete) return false;
    if (o.skipped) return true;
    if (o.done && completeness(o.fill).pct >= 100) return false;
    if (o.done || o.fresh) return completeness(o.fill).pct < 100;
    return false;
  }

  function platforms() {
    var all = (root.TCLinks && TCLinks.PLATFORMS) ? TCLinks.PLATFORMS : [];
    return all.filter(function (p) { return p.id !== "other"; });
  }

  function linkFields(links) {
    if (root.TCLinks && TCLinks.editFields) return TCLinks.editFields(links || {});
    links = links || {};
    return '<p class="group-label">Social profile links <span class="opt">(optional)</span></p>' +
      '<p class="hint" style="margin-top:0">Add your Facebook personal profile and Google Business Profile. Only the ones you fill in will show on your profile.</p>' +
      platforms().map(function (p) {
        var well = p.well ? " " + p.well : "";
        var bg = p.well === "g" ? "" : ' style="background:' + p.color + '"';
        return '<div class="field link-field"><label><span class="link-field-ico' + well + '"' + bg + '>' + p.icon + "</span>" + esc(p.label) + "</label>" +
          '<input name="link-' + p.id + '" inputmode="url" type="url" placeholder="' + esc(p.placeholder) + '" value="' + esc(links[p.id] || "") + '" data-link-id="' + p.id + '" autocomplete="off">' +
          '<p class="link-error" hidden></p></div>';
      }).join("");
  }

  function counted(label, name, value, max, rows, hint, ph) {
    value = value || "";
    var phA = ph ? ' placeholder="' + esc(ph) + '"' : ""; /* v2.2.2: example text, disappears as they type */
    return '<div class="field"><label>' + esc(label) + ' <span class="cp-count" data-count-for="' + name + '">' + String(value).length + " / " + max + "</span></label>" +
      (rows && rows > 1
        ? '<textarea name="' + name + '" rows="' + rows + '" maxlength="' + (max + 40) + '" data-max="' + max + '"' + phA + ">" + esc(value) + "</textarea>"
        : '<input name="' + name + '" value="' + esc(value) + '" maxlength="' + (max + 20) + '" data-max="' + max + '"' + phA + ">") +
      (hint ? '<p class="hint">' + hint + "</p>" : "") +
      "</div>";
  }

  function chips(name, hiddenName, options, selected) {
    selected = selected || [];
    return '<div class="chip-row">' + options.map(function (c) {
      var on = selected.indexOf(c) !== -1;
      return '<button type="button" class="chip' + (on ? " active" : "") + '" data-profile-chip="' + name + '">' + esc(c) + "</button>";
    }).join("") + "</div>" +
      '<input type="hidden" name="' + hiddenName + '" value="' + esc(selected.join(", ")) + '">';
  }


  function exPh(name, fallback) { try { return (root.RBPlaceholders && RBPlaceholders.ex(name)) || fallback; } catch (e) { return fallback; } }
  /* repaint the suggestion chips as soon as the trade changes (trade box or saved profile) */
  var lastTradeSeen = null;
  setInterval(function () {
    var t = meTrade(); if (t === lastTradeSeen) return; lastTradeSeen = t;
    document.querySelectorAll('[data-cp-pick-bound="1"]').forEach(function (f) {
      ["specialties", "idealTrades"].forEach(function (k) { if (f.querySelector('[data-cp-search="' + k + '"]')) { paintQuick(f, k); } });
    });
  }, 400);
  function meTrade() {
    var s = state();
    var me = (T().MEMBERS || []).filter(function (m) { return m.id === (s.meId || T().meId); })[0];
    var draft = (s.signup && s.signup.draft) || {};
    /* v2.2.2 b18: follow the trade box on screen first, then the live profile; no trade = general suggestions (never Pest Control) */
    var sc = document.querySelector(".screen.active"), box = sc && sc.querySelector("#tradeType");
    var typed = box && String(box.value || "").trim();
    if (typed) return typed;
    if (root.RB && RB.profile && RB.profile.trade) return RB.profile.trade;
    return (me && me.trade) || draft.trade || "";
  }

  function tradeKey(trade) {
    var t = String(trade || "").toLowerCase();
    if (/pest|termite|fumigat/.test(t)) return "pest";
    if (/carpent|joiner|cabinet/.test(t)) return "carpenter";
    if (/electr/.test(t)) return "electrician";
    if (/plumb/.test(t)) return "plumber";
    if (/paint/.test(t)) return "painter";
    if (/landscap|garden/.test(t)) return "landscaper";
    if (/fenc/.test(t)) return "fencer";
    if (/air.?cond|hvac|split.?system/.test(t)) return "hvac";
    if (/roof/.test(t)) return "roofer";
    if (/tiler|tiling/.test(t)) return "tiler";
    if (/handy/.test(t)) return "handyman";
    if (/build/.test(t)) return "builder";
    if (/lock/.test(t)) return "locksmith";
    if (/barber|hair/.test(t)) return "barber";
    if (/real.?estate|property.?manag/.test(t)) return "realestate";
    if (/plaster/.test(t)) return "plasterer";
    return "generic";
  }

  var SERVICE_MAP = {
    pest: ["Termite inspections", "Pre-purchase inspections", "General pests", "Rodent control", "Cockroach treatments", "Spider control", "Bee and wasp removal", "Termite barriers", "Commercial pest", "Residential pest", "Emergency call-outs", "Ant control", "Possum and wildlife", "Bed bug treatments"],
    carpenter: ["Kitchens", "Decks", "Home renovations", "Custom joinery", "Doors and windows", "Framing", "Built-in robes", "Stairs", "Pergolas", "Repairs"],
    electrician: ["Safety switch upgrades", "Rewires", "Solar-ready boards", "Lighting", "Switchboards", "Data cabling", "Smoke alarms", "EV chargers", "Fault finding", "New builds"],
    plumber: ["Bathroom fit-outs", "Hot water", "Blocked drains", "Gas fitting", "Leak repairs", "New installations", "Renovations", "Emergency call-outs", "Backflow", "Rainwater"],
    painter: ["Interior painting", "Exteriors", "Colour consults", "Wallpaper", "Decks and fences", "Commercial painting", "New builds", "Restorations"],
    landscaper: ["Garden design", "Paving", "Retaining walls", "Turf", "Irrigation", "Soft landscaping", "Decks and pergolas", "Garden maintenance"],
    fencer: ["Colorbond fences", "Timber fences", "Gates", "Retaining", "Pool fencing", "Repairs", "Automatic gates"],
    hvac: ["Split-system installs", "Servicing", "Office fit-outs", "Ducted systems", "Repairs", "New installs", "Maintenance plans"],
    roofer: ["Re-roofs", "Roof repairs", "Gutters", "Skylights", "Insulation", "Leak repairs", "Colorbond roofs", "Tile roofs"],
    tiler: ["Bathroom tiling", "Kitchen splashbacks", "Floor tiling", "Waterproofing", "Renovations", "Outdoor tiling"],
    handyman: ["General repairs", "Assembly", "Odd jobs", "Maintenance", "Small installs", "Furniture assembly"],
    builder: ["New homes", "Renovations", "Extensions", "Knockdowns", "Project management", "Commercial builds"],
    locksmith: ["Lock changes", "Emergency call-outs", "Safes", "Master key systems", "Car locks", "Access control"],
    barber: ["Men's cuts", "Beard trims", "Fades", "Hot towel shaves", "Kids' cuts", "Colour"],
    realestate: ["Sales", "Property management", "Rentals", "Appraisals", "Buyer advocacy"],
    plasterer: ["Cornice", "Gyprock", "Patching", "Ceilings", "Renovations"],
    generic: ["General services", "Commercial work", "Residential work", "Maintenance", "New installs", "Emergency call-outs", "Repairs", "Consultations"]
  };

  var PARTNER_MAP = {
    pest: ["Builder", "Carpenter", "Real Estate Agent", "Property Manager"],
    carpenter: ["Electrician", "Plumber", "Painter", "Tiler"],
    electrician: ["Builder", "Air Conditioning", "Carpenter", "Plumber"],
    plumber: ["Tiler", "Electrician", "Carpenter", "Builder"],
    painter: ["Carpenter", "Plasterer", "Builder", "Interior Designer"],
    landscaper: ["Fencer", "Carpenter", "Electrician", "Irrigation Technician"],
    fencer: ["Landscaper", "Builder", "Carpenter", "Pool Builder"],
    hvac: ["Electrician", "Builder", "Plumber", "Carpenter"],
    roofer: ["Builder", "Gutter Installer", "Electrician", "Carpenter"],
    tiler: ["Plumber", "Waterproofing", "Builder", "Carpenter"],
    handyman: ["Plumber", "Electrician", "Carpenter", "Painter"],
    builder: ["Electrician", "Plumber", "Carpenter", "Painter"],
    generic: ["Plumber", "Electrician", "Carpenter", "Builder"]
  };

  /* v2.2.2: tailored lists for all 456 business types (trade-suggest.js); the 16 maps above stay as they were */
  function tsInfo(trade) {
    return (root.RBTradeSuggest && root.RBTradeSuggest.forTrade) ? root.RBTradeSuggest.forTrade(trade) : null;
  }
  function keyFits(key, info) {
    if (key === "generic") return false;
    if (!info) return true;
    if (key === "realestate") return info.group === "property";
    if (key === "barber") return info.group === "beauty";
    return ["building", "home", "outdoor", "cleaning"].indexOf(info.group) !== -1;
  }

  function servicesForTrade(trade) {
    var key = tradeKey(trade);
    var info = tsInfo(trade);
    var listA;
    if (info && root.RBTradeSuggest.overrides[info.name] && root.RBTradeSuggest.overrides[info.name].s) listA = info.services.slice();
    else if (keyFits(key, info)) listA = (SERVICE_MAP[key] || SERVICE_MAP.generic).slice();
    else if (info) listA = info.services.slice();
    else listA = SERVICE_MAP.generic.slice();
    if (info && !keyFits(key, info)) return listA;
    if (key !== "generic") {
      SERVICE_MAP.generic.forEach(function (s) { if (listA.indexOf(s) === -1) listA.push(s); });
    }
    return listA;
  }

  function allTrades() {
    var src = root.TC_TRADES;
    if (Array.isArray(src) && src.length) return src.slice();
    return ["Plumber", "Electrician", "Builder", "Carpenter", "Roofer", "Painter", "Landscaper", "Air Conditioning", "Tiler", "Handyman"];
  }

  function popularPartners(trade) {
    /* v2.2.2: full 8-12 partner list; the picker shows 4 at a time and refills as partners are added (like Services) */
    var key = tradeKey(trade);
    var info = tsInfo(trade);
    var pref = [];
    if (keyFits(key, info) && PARTNER_MAP[key]) pref = PARTNER_MAP[key].map(function (n) { return n === "Gutter Installer" ? "Guttering" : n; });
    if (info) info.partners.forEach(function (n) { if (pref.indexOf(n) === -1 && n !== info.name) pref.push(n); });
    if (!pref.length) pref = PARTNER_MAP.generic.slice();
    return pref.slice(0, 12);
  }

  function searchIco() {
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1E293B" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5" stroke-linecap="round"/></svg>';
  }

  function matchSuggest(q, options, selected, allowCustom, limit) {
    q = String(q || "").trim().toLowerCase();
    selected = selected || [];
    limit = limit || 8;
    var out = [];
    options.forEach(function (opt) {
      if (selected.indexOf(opt) !== -1) return;
      if (!q || opt.toLowerCase().indexOf(q) !== -1) out.push({ value: opt, custom: false });
    });
    if (q && allowCustom) {
      var exact = options.some(function (o) { return o.toLowerCase() === q; }) ||
        selected.some(function (o) { return String(o).toLowerCase() === q; });
      if (!exact && q.length >= 2) {
        var pretty = q.replace(/\s+/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
        out.unshift({ value: pretty, custom: true });
      }
    }
    return out.slice(0, limit);
  }

  function pickerHTML(kind, hiddenName, selected, placeholder) {
    selected = selected || [];
    return '<div class="cp-search" data-cp-search="' + kind + '">' +
      '<div class="search-wrap">' +
      '<div class="search">' + searchIco() + '<input type="search" data-cp-q="' + kind + '" placeholder="' + esc(placeholder) + '" autocomplete="off"></div>' +
      '<div class="ac-drop" data-cp-ac="' + kind + '" hidden></div></div>' +
      '<div class="cp-picked" data-cp-picked="' + kind + '"></div>' +
      '<div class="cp-quick" data-cp-quick="' + kind + '"></div>' +
      /* v2.2.2 build 18 (Vishal): add several of your own services: Add button, Enter, or commas */
      (kind === "specialties" ? '<div class="cp-custom" data-cp-custom-row="' + kind + '"><label class="cp-custom-lab" for="cpCustom-' + kind + '">Add your own services</label>' +
        '<div class="cp-custom-in"><input type="text" id="cpCustom-' + kind + '" data-cp-custom="' + kind + '" placeholder="e.g. After-hours work, Free quotes" autocomplete="off" enterkeyhint="done">' +
        '<button type="button" class="btn cp-custom-add" data-cp-custom-add="' + kind + '">Add</button></div>' +
        '<p class="hint cp-custom-hint">Add as many as you like. Separate several with commas.</p></div>' : "") +
      '<input type="hidden" name="' + hiddenName + '" value="' + esc(selected.join(", ")) + '">' +
      "</div>";
  }

  function readSelected(form, kind) {
    var hid = hiddenOf(form, kind);
    return hid ? list(hid.value) : [];
  }

  function hiddenOf(form, kind) {
    if (!form) return null;
    if (kind === "specialties") return form.querySelector("[name='profileSpecialties']");
    if (kind === "idealTrades") return form.querySelector("[name='profileIdealTrades']");
    return form.querySelector("[data-cp-search='" + kind + "'] input[type='hidden']");
  }

  function optionsFor(kind) {
    if (kind === "specialties") return servicesForTrade(meTrade());
    return allTrades();
  }

  function popularFor(kind, selected) {
    selected = selected || [];
    var src = kind === "specialties" ? servicesForTrade(meTrade()) : popularPartners(meTrade());
    return src.filter(function (s) { return selected.indexOf(s) === -1; }).slice(0, 4);
  }

  function paintPicked(form, kind) {
    var wrap = form.querySelector('[data-cp-picked="' + kind + '"]');
    var hid = hiddenOf(form, kind);
    if (!wrap || !hid) return;
    var selected = list(hid.value);
    wrap.innerHTML = selected.map(function (s) {
      return '<span class="chip cp-sel">' + esc(s) +
        '<button type="button" class="cp-x" data-cp-remove="' + kind + '" data-value="' + esc(s) + '" aria-label="Remove ' + esc(s) + '">✕</button></span>';
    }).join("");
  }

  function paintQuick(form, kind) {
    var wrap = form.querySelector('[data-cp-quick="' + kind + '"]');
    var inp = form.querySelector('[data-cp-q="' + kind + '"]');
    if (!wrap) return;
    var q = inp ? String(inp.value || "").trim() : "";
    var selected = readSelected(form, kind);
    if (q) { wrap.innerHTML = ""; return; }
    var gone = (form._cpDismiss && form._cpDismiss[kind]) || [];
    if (kind === "specialties") {
      var src = servicesForTrade(meTrade());
      var lowSel = selected.map(function (x) { return x.toLowerCase(); });
      var pops = src.filter(function (s) { return lowSel.indexOf(s.toLowerCase()) === -1 && gone.indexOf(s) === -1; }).slice(0, 4);
      wrap.innerHTML = pops.map(function (s) {
        return '<span class="chip cp-pop cp-sug"><button type="button" class="cp-sug-add" data-cp-add="' + kind + '" data-value="' + esc(s) + '">+ ' + esc(s) + "</button>" +
          '<button type="button" class="cp-x" data-cp-dismiss="' + kind + '" data-value="' + esc(s) + '" aria-label="Hide suggestion ' + esc(s) + '">✕</button></span>';
      }).join("");
      return;
    }
    var pops = popularFor(kind, selected);
    wrap.innerHTML = pops.map(function (s) {
      return '<button type="button" class="chip cp-pop" data-cp-add="' + kind + '" data-value="' + esc(s) + '">+ ' + esc(s) + "</button>";
    }).join("");
  }

  function paintAc(form, kind, force) {
    var box = form.querySelector('[data-cp-ac="' + kind + '"]');
    var inp = form.querySelector('[data-cp-q="' + kind + '"]');
    if (!box || !inp) return;
    var q = String(inp.value || "");
    if (!force && !q && document.activeElement !== inp) { box.hidden = true; box.innerHTML = ""; return; }
    var allowCustom = kind === "specialties" || kind === "idealTrades";
    var items = matchSuggest(q, optionsFor(kind), readSelected(form, kind), allowCustom, 8);
    if (!items.length) {
      box.innerHTML = '<div class="ac-item ac-empty">No matches. Type to add your own.</div>';
      box.hidden = false;
      return;
    }
    box.innerHTML = items.map(function (it) {
      var lab = it.custom ? 'Add “' + esc(it.value) + '”' : esc(it.value);
      return '<button type="button" class="ac-item' + (it.custom ? " ac-custom" : "") + '" data-cp-add="' + kind + '" data-value="' + esc(it.value) + '"><span>' + lab + "</span></button>";
    }).join("");
    box.hidden = false;
  }

  function setSelected(form, kind, selected) {
    var hid = hiddenOf(form, kind);
    if (hid) hid.value = selected.join(", ");
    paintPicked(form, kind);
    paintQuick(form, kind);
    paintAc(form, kind, document.activeElement === form.querySelector('[data-cp-q="' + kind + '"]'));
    if (typeof refreshProgress === "function") refreshProgress(form);
  }

  function addValue(form, kind, value) {
    var parts = String(value || "").split(",").map(function (x) { return x.replace(/\s+/g, " ").trim().slice(0, 60); }).filter(Boolean);
    if (!parts.length) return 0;
    var selected = readSelected(form, kind), added = 0;
    parts.forEach(function (v) {
      var low = selected.map(function (x) { return x.toLowerCase(); });
      if (low.indexOf(v.toLowerCase()) === -1) { selected.push(v); added++; }
    });
    var inp = form.querySelector('[data-cp-q="' + kind + '"]');
    if (inp) inp.value = "";
    setSelected(form, kind, selected);
    var box = form.querySelector('[data-cp-ac="' + kind + '"]');
    if (box) { box.hidden = true; box.innerHTML = ""; }
    return added;
  }
  function addCustom(form, kind) {
    var inp = form.querySelector('[data-cp-custom="' + kind + '"]');
    if (!inp) return;
    var raw = String(inp.value || "");
    if (!raw.trim()) { inp.focus(); return; }
    var before = readSelected(form, kind).length;
    addValue(form, kind, raw);
    var n = readSelected(form, kind).length - before;
    inp.value = "";
    if (!n) toast("Already in your services.");
  }

  function removeValue(form, kind, value) {
    var selected = readSelected(form, kind).filter(function (s) { return s !== value; });
    setSelected(form, kind, selected);
  }

  function bindSearchPickers(form) {
    if (!form || form.getAttribute("data-cp-pick-bound") === "1") return;
    if (!form.querySelector("[data-cp-search]")) return;
    form.setAttribute("data-cp-pick-bound", "1");
    ["specialties", "idealTrades"].forEach(function (kind) {
      if (form.querySelector('[data-cp-search="' + kind + '"]')) {
        paintPicked(form, kind);
        paintQuick(form, kind);
      }
    });
    form.addEventListener("input", function (e) {
      var inp = e.target.closest("[data-cp-q]");
      if (!inp) return;
      paintAc(form, inp.getAttribute("data-cp-q"), true);
      paintQuick(form, inp.getAttribute("data-cp-q"));
    });
    form.addEventListener("focusin", function (e) {
      var inp = e.target.closest("[data-cp-q]");
      if (!inp) return;
      paintAc(form, inp.getAttribute("data-cp-q"), true);
    });
    form.addEventListener("keydown", function (e) {
      var ci = e.target.closest && e.target.closest("[data-cp-custom]");
      if (ci) {
        if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addCustom(form, ci.getAttribute("data-cp-custom")); }
        return;
      }
      var inp = e.target.closest("[data-cp-q]");
      if (!inp) return;
      var kind = inp.getAttribute("data-cp-q");
      if (e.key === "Enter") {
        e.preventDefault();
        var first = form.querySelector('[data-cp-ac="' + kind + '"] [data-cp-add]');
        if (first) addValue(form, kind, first.getAttribute("data-value"));
        else if (String(inp.value || "").trim().length >= 2) addValue(form, kind, inp.value);
      } else if (e.key === "Escape") {
        var box = form.querySelector('[data-cp-ac="' + kind + '"]');
        if (box) box.hidden = true;
      }
    });
    form.addEventListener("paste", function (e) {
      var ci = e.target.closest && e.target.closest("[data-cp-custom]");
      if (!ci) return;
      var t = (e.clipboardData || root.clipboardData) && (e.clipboardData || root.clipboardData).getData("text");
      if (t && /[,\n]/.test(t)) { e.preventDefault(); ci.value = (ci.value ? ci.value + "," : "") + t.replace(/\n+/g, ","); addCustom(form, ci.getAttribute("data-cp-custom")); }
    });
    form.addEventListener("click", function (e) {
      var ca = e.target.closest("[data-cp-custom-add]");
      if (ca && form.contains(ca)) { e.preventDefault(); addCustom(form, ca.getAttribute("data-cp-custom-add")); return; }
      var dm = e.target.closest("[data-cp-dismiss]");
      if (dm && form.contains(dm)) {
        e.preventDefault();
        var k = dm.getAttribute("data-cp-dismiss");
        form._cpDismiss = form._cpDismiss || {}; (form._cpDismiss[k] = form._cpDismiss[k] || []).push(dm.getAttribute("data-value"));
        paintQuick(form, k);
        return;
      }
      var add = e.target.closest("[data-cp-add]");
      if (add && form.contains(add)) {
        e.preventDefault();
        addValue(form, add.getAttribute("data-cp-add"), add.getAttribute("data-value"));
        return;
      }
      var rm = e.target.closest("[data-cp-remove]");
      if (rm && form.contains(rm)) {
        e.preventDefault();
        removeValue(form, rm.getAttribute("data-cp-remove"), rm.getAttribute("data-value"));
      }
    });
    document.addEventListener("click", function (e) {
      if (form.contains(e.target) && e.target.closest("[data-cp-search]")) return;
      form.querySelectorAll("[data-cp-ac]").forEach(function (box) { box.hidden = true; });
    });
  }

  function renderComplete() {
    var fill = fillOf();
    var c = completeness(fill);
    var specs = list(fill.specialties);
    var ideals = list(fill.idealTrades);
    return '<section class="screen has-header" data-screen="complete-profile">' +
      '<div class="app-header"><span class="header-spacer"></span><div class="ht">Complete your profile</div><span class="header-spacer"></span></div>' +
      '<div class="scroll"><div class="cp-hero"><h2>Tell members a bit about you</h2>' +
      '<p>Your account is approved. Add a short profile now, or skip and finish it later. You can always edit this later.</p></div>' +
      '<div class="cp-progress" data-cp-progress><div class="bar"><i style="width:' + c.pct + '%"></i></div>' +
      '<div class="lab">' + c.pct + "% complete · " + c.n + " of " + c.total + " sections</div></div>" +
      '<form data-form="complete-profile">' +
      linkFields(fill.links) +
      counted("A short sentence", "tagline", fill.tagline, 80, 2, "A one-line headline that sits at the top of your profile.", exPh("tagline", "e.g. Trusted local business serving Perth since 2012")) +
      counted("Short bio", "bio", fill.bio, 280, 4, "A few sentences about who you are.", exPh("bio", "e.g. I\u2019m Sam, based in Joondalup. I\u2019m on time, I explain everything clearly and I treat every customer like a neighbour.")) +
      counted("My goal", "profileGoal", fill.goal, 140, 2, "What you hope to get from the circle.", "e.g. Get 20 genuine Google Reviews and meet tradies I can refer work to.") +
      counted("About my business", "profileAbout", fill.about, 400, 4, "") +
      '<p class="group-label">Expertise</p><p class="hint" style="margin-top:0">Search and add the work you are known for. You can also type your own.</p>' +
      pickerHTML("specialties", "profileSpecialties", specs, "Search services") +
      '<p class="group-label">My ideal referral partner</p><p class="hint" style="margin-top:0">Search from 456 business types, or type your own.</p>' +
      pickerHTML("idealTrades", "profileIdealTrades", ideals, "Search business types") +
      counted("A short note", "profileIdealNote", fill.idealNote, 160, 2, "Optional. One sentence is enough.") +
      "</form></div>" +
      '<div class="cp-sticky">' +
      '<button type="button" class="btn btn-ghost ink" data-action="skip-complete">Skip for now</button>' +
      '<button type="button" class="btn btn-primary" data-action="save-complete">Save</button>' +
      "</div></section>";
  }

  function collectFill(form) {
    var fill = fillOf();
    if (!form) return fill;
    if (root.TCLinks && TCLinks.collect) fill.links = TCLinks.collect(form, fill.links);
    fill.tagline = (form.querySelector("[name='tagline']") || {}).value || "";
    fill.bio = (form.querySelector("[name='bio']") || {}).value || "";
    fill.goal = (form.querySelector("[name='profileGoal']") || {}).value || "";
    fill.about = (form.querySelector("[name='profileAbout']") || {}).value || "";
    fill.specialties = list((form.querySelector("[name='profileSpecialties']") || {}).value);
    fill.idealTrades = list((form.querySelector("[name='profileIdealTrades']") || {}).value);
    fill.idealNote = (form.querySelector("[name='profileIdealNote']") || {}).value || "";
    ["tagline", "bio", "goal", "about", "idealNote"].forEach(function (k) {
      fill[k] = String(fill[k] || "").trim();
    });
    return fill;
  }

  function linksOk(form) {
    if (!form || !root.TCLinks) return true;
    var ok = true;
    form.querySelectorAll("[data-link-id]").forEach(function (inp) {
      var id = inp.getAttribute("data-link-id");
      var p = platforms().filter(function (x) { return x.id === id; })[0];
      var v = TCLinks.isValid(inp.value, p);
      var err = inp.parentNode.querySelector(".link-error");
      if (!inp.value.trim() || v.ok) {
        if (err) err.hidden = true;
        inp.classList.remove("invalid");
      } else {
        ok = false;
        if (err) { err.hidden = false; err.textContent = v.msg; }
        inp.classList.add("invalid");
      }
    });
    return ok;
  }

  function refreshProgress(form) {
    var wrap = document.querySelector("[data-cp-progress]");
    if (!wrap) return;
    var fill = collectFill(form);
    var c = completeness(fill);
    var bar = wrap.querySelector(".bar > i");
    var lab = wrap.querySelector(".lab");
    if (bar) bar.style.width = c.pct + "%";
    if (lab) lab.textContent = c.pct + "% complete · " + c.n + " of " + c.total + " sections";
  }

  function bindComplete(rootEl) {
    var form = rootEl.querySelector("form[data-form='complete-profile']");
    if (!form) return;
    if (root.TCProfile && TCProfile.bindForm) TCProfile.bindForm(form);
    if (root.TCLinks && TCLinks.bindValidation) TCLinks.bindValidation(form);
    bindSearchPickers(form);
    form.addEventListener("input", function (e) {
      var el = e.target;
      var max = el.getAttribute && el.getAttribute("data-max");
      if (max) {
        var lab = form.querySelector('[data-count-for="' + el.getAttribute("name") + '"]');
        var n = String(el.value || "").length;
        if (lab) {
          lab.textContent = n + " / " + max;
          lab.classList.toggle("over", n > Number(max));
        }
      }
      refreshProgress(form);
    });
    form.addEventListener("click", function () { setTimeout(function () { refreshProgress(form); }, 0); });
  }

  function saveComplete() {
    var form = document.querySelector("form[data-form='complete-profile']");
    if (form && !linksOk(form)) {
      toast("Check the highlighted links, or leave them blank.");
      return;
    }
    var o = ensureOnboarding();
    o.fill = collectFill(form);
    o.done = true;
    o.skipped = completeness(o.fill).pct < 100 ? o.skipped : false;
    if (completeness(o.fill).pct >= 100) o.skipped = false;
    o.forceComplete = false;
    toast(completeness(o.fill).pct >= 100 ? "Profile saved." : "Saved. You can finish the rest later.");
    go("home");
  }

  function skipComplete() {
    var form = document.querySelector("form[data-form='complete-profile']");
    var o = ensureOnboarding();
    if (form) o.fill = collectFill(form);
    o.skipped = true;
    o.forceComplete = false;
    o.done = false;
    toast("No problem — you can finish this later.");
    go("home");
  }

  function startDemoSignup() {
    var s = state();
    s.onboarding = { fresh: true, forceComplete: false, skipped: false, done: false, fill: {} };
    s.signupMethod = "";
    s.otpSent = false;
    s.fbConnected = false;
    s.draft = { first: "", last: "", business: "", trade: "", regions: [], phone: "", abn: "", email: "", facebook: "", tagline: "" };
    s.pendingNote = "";
    toast("Demo: starting a new member sign-up.");
    go("signup");
  }

  function onApproved() {
    var o = ensureOnboarding();
    o.forceComplete = true;
    o.skipped = false;
    o.done = false;
    if (!o.fill) o.fill = {};
  }

  function finishCard() {
    var c = completeness(fillOf());
    var r = 22, circ = 2 * Math.PI * r;
    var dash = circ * (c.pct / 100);
    return '<div class="finish-card" data-finish-card="1">' +
      '<svg class="ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="' + r + '" fill="none" stroke="#E4EAF0" stroke-width="4"/>' +
      '<circle cx="24" cy="24" r="' + r + '" fill="none" stroke="#1A5FD4" stroke-width="4" stroke-linecap="round" transform="rotate(-90 24 24)" stroke-dasharray="' + dash + " " + circ + '"/>' +
      '<text x="24" y="28" text-anchor="middle" font-size="11" font-weight="800" fill="#0D3F9C">' + c.pct + "%</text></svg>" +
      "<div style=\"flex:1;min-width:0\"><h3>Finish your profile</h3>" +
      "<p>" + c.pct + "% complete. Add a short bio, your goal and social links so other members can get to know you.</p>" +
      '<button type="button" class="btn btn-primary" data-go="complete-profile">Continue</button></div></div>';
  }

  function injectFinish(id) {
    if (!shouldShowFinish()) return;
    if (document.querySelector("[data-finish-card]")) return;
    var scroll = document.querySelector(".screen.active .scroll") || document.querySelector(".screen .scroll");
    if (!scroll) return;
    var wrap = document.createElement("div");
    wrap.innerHTML = finishCard();
    var card = wrap.firstChild;
    if (id === "home") {
      var hello = scroll.querySelector(".dash-hello, .home-hello, .greeting");
      if (hello && hello.parentNode) hello.parentNode.insertBefore(card, hello.nextSibling);
      else scroll.insertBefore(card, scroll.firstChild);
    } else if (id === "me") {
      var hero = scroll.querySelector(".profile-hero");
      if (hero && hero.parentNode) hero.parentNode.insertBefore(card, hero.nextSibling);
      else scroll.insertBefore(card, scroll.firstChild);
    }
  }

  function injectSettings() {
    var screen = document.querySelector(".screen[data-screen='settings'] .scroll, .screen.active .scroll");
    if (!screen || screen.querySelector("[data-action='demo-signup']")) return;
    var html = '<p class="group-label">Prototype</p><div class="card group">' +
      '<button class="set-row demo-signup" type="button" data-action="demo-signup"><span class="ic">+</span><span class="lab"><span class="a">Demo: new member sign-up</span><span class="b">Walk through the basic sign-up, approval and complete-profile steps</span></span><span class="chev">›</span></button></div>';
    var signout = screen.querySelector("button[data-go='welcome']");
    if (signout) signout.insertAdjacentHTML("beforebegin", html);
    else {
      var foot = screen.querySelector(".settings-foot");
      if (foot) foot.insertAdjacentHTML("beforebegin", html);
      else screen.insertAdjacentHTML("beforeend", html);
    }
  }

  function injectDrawer() {
    var nav = document.querySelector(".drawer-nav");
    if (!nav || nav.querySelector("[data-action='demo-signup']")) return;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "drawer-item";
    b.setAttribute("data-action", "demo-signup");
    b.innerHTML = "<span class=\"ic\">+</span><span>Demo: new member sign-up</span>";
    var settings = nav.querySelector('[data-go="settings"]');
    nav.insertBefore(b, settings || null);
  }

  function injectMore() {
    if (document.querySelector("[data-more='v21'], .v21-more")) return;
    if (document.querySelector("[data-action='demo-signup']")) return;
    var scroll = document.querySelector(".screen[data-screen='more'] .scroll");
    if (!scroll) return;
    var sec = document.createElement("div");
    sec.className = "apps-section";
    sec.innerHTML = '<h3>Prototype</h3><div class="apps-grid">' +
      '<button type="button" class="apps-tile more-demo-tile" data-action="demo-signup"><span class="apps-ico steel">+</span><span>Demo sign-up</span></button></div>';
    scroll.appendChild(sec);
  }

  function wrapGo() {
    var TC = T();
    if (!TC.go || TC.go._tc158) return;
    var orig = TC.go;
    function wrapped(id, opts) {
      var o = state().onboarding;
      if (o && o.forceComplete && !o.skipped && !o.done) {
        if (id === "home" || id === "me" || id === "members" || id === "reviews" || id === "more") id = "complete-profile";
      }
      return orig.call(TC, id, opts);
    }
    wrapped._tc158 = true;
    TC.go = wrapped;
  }

  function hookAfterGo() {
    if (!root.TC12) root.TC12 = {};
    var prev = TC12.afterGo;
    TC12.afterGo = function (id) {
      if (typeof prev === "function") prev(id);
      if (id === "complete-profile") bindComplete(document);
      if (id === "edit-profile" || id === "create-profile" || id === "create-profile-connected") {
        var ef = document.querySelector("form[data-form='edit-profile'], form[data-form='create-profile']");
        if (ef) bindSearchPickers(ef);
      }
      if (id === "settings") injectSettings();
      if (id === "more") injectMore();
      if (id === "home" || id === "me") injectFinish(id);
      injectDrawer();
    };
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-action='demo-signup']")) {
      e.preventDefault();
      startDemoSignup();
      return;
    }
    if (e.target.closest("[data-action='skip-complete']")) {
      e.preventDefault();
      skipComplete();
      return;
    }
    if (e.target.closest("[data-action='save-complete']")) {
      e.preventDefault();
      saveComplete();
    }
  });

  wrapGo();
  hookAfterGo();
  root.TC158 = {
    renderComplete: renderComplete,
    startDemoSignup: startDemoSignup,
    onApproved: onApproved,
    completeness: completeness,
    shouldShowFinish: shouldShowFinish,
    fillOf: fillOf,
    pickerHTML: pickerHTML,
    bindSearchPickers: bindSearchPickers,
    servicesForTrade: servicesForTrade,
    repaintPickers: function (form) { if (!form) return; ["specialties", "idealTrades"].forEach(function (k) { if (form.querySelector('[data-cp-search="' + k + '"]')) { paintPicked(form, k); paintQuick(form, k); } }); },
    popularPartners: popularPartners,
    tradeKey: tradeKey
  };
  /* v2.2.2: grow example-text boxes so the whole placeholder shows at any text size (gone once typing starts) */
  function fitPlaceholders() {
    var els = document.querySelectorAll(".screen.active textarea[placeholder]");
    Array.prototype.forEach.call(els, function (e) {
      if (e.value) return;
      e.style.removeProperty("min-height");
      e.value = e.placeholder;
      var need = e.scrollHeight;
      e.value = "";
      if (need > e.clientHeight + 1) {
        var cs = getComputedStyle(e);
        var extra = cs.boxSizing === "border-box" ? (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0) : -((parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0));
        e.style.setProperty("min-height", Math.ceil(need + extra + 2) + "px", "important");
      }
    });
  }
  var fpT = null;
  function queueFitPh() { clearTimeout(fpT); fpT = setTimeout(fitPlaceholders, 60); }
  root.TC158.fitPlaceholders = fitPlaceholders;
  if (T().go && !T().go.__rbFitPh) {
    var go0 = T().go;
    T().go = function () { var r = go0.apply(this, arguments); queueFitPh(); setTimeout(fitPlaceholders, 700); return r; };
    T().go.__rbFitPh = true;
  }
  root.addEventListener("resize", queueFitPh);
  document.addEventListener("input", function (e) { if (e.target && e.target.matches && e.target.matches("textarea[placeholder]") && !e.target.value) queueFitPh(); }, true);
  document.addEventListener("DOMContentLoaded", function () { setTimeout(fitPlaceholders, 400); setTimeout(fitPlaceholders, 1500); });
  if (T().state && T().state.screen && T().go) T().go(T().state.screen);
})(window);
