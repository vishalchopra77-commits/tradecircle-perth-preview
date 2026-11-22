/* TradeCircle Perth — profile links v2.1.1 — Facebook personal + Google Business only */
(function (root) {
  "use strict";

  function svg(p, w) {
    w = w || 18;
    return '<svg viewBox="0 0 24 24" width="' + w + '" height="' + w + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  }

  var GICO = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
  var FICO = '<svg viewBox="0 0 24 24" width="18" height="18" fill="#fff" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v7h4v-7h3.2L17 11h-4V9c0-.6.4-1 1-1z"/></svg>';
  var PLATFORMS = [
    { id: "facebook", label: "Facebook personal profile link", placeholder: "facebook.com/yourname", host: /facebook\.com/i, color: "#1877F2", icon: FICO, well: "fb" },
    { id: "google", label: "Google Business Profile link", placeholder: "https://g.page/yourbusiness", host: /google\.com|maps\.app\.goo\.gl|g\.page|goo\.gl/i, color: "#1A73E8", icon: GICO, well: "g" }
  ];

  function emptyLinks() {
    var o = {};
    PLATFORMS.forEach(function (p) { o[p.id] = ""; });
    return o;
  }
  function normalize(raw) {
    var s = String(raw || "").trim();
    if (!s) return "";
    if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) s = "https://" + s;
    return s;
  }
  function isValid(raw, platform) {
    var s = String(raw || "").trim();
    if (!s) return { ok: true, value: "" };
    var url = normalize(s);
    if (/\s/.test(url)) return { ok: false, value: url, msg: "Remove the spaces from this link." };
    var okShape = /^https?:\/\/[^\s/]+\.[^\s]+/i.test(url);
    if (!okShape) return { ok: false, value: url, msg: "Enter a full web address, starting with https://" };
    if (platform && platform.host && !platform.host.test(url)) {
      return { ok: false, value: url, msg: "This does not look like a " + platform.label + " link." };
    }
    return { ok: true, value: url };
  }
  function fromMember(m) {
    var links = emptyLinks();
    if (!m) return links;
    var src = m.links || {};
    PLATFORMS.forEach(function (p) { links[p.id] = src[p.id] || ""; });
    if (m.facebook) links.facebook = m.facebook;
    if (!links.google && (m.googleLink || m.google)) links.google = m.googleLink || m.google;
    return links;
  }
  function applyToMember(m, links) {
    if (!m) return;
    m.links = fromMember({ links: links });
    if (m.links.facebook) m.facebook = m.links.facebook;
  }
  function filled(m) {
    var links = fromMember(m);
    return PLATFORMS.filter(function (p) { return !!links[p.id]; }).map(function (p) {
      return { platform: p, url: links[p.id] };
    });
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }
  function iconRow(m) {
    var items = filled(m);
    if (!items.length) return "";
    return '<div class="link-row" aria-label="Links">' + items.map(function (it) {
      var p = it.platform;
      var style = p.well === "g" ? "background:#fff;border:1px solid #E8EDF5" : ("background:" + p.color);
      return '<a class="link-ico" href="' + esc(normalize(it.url)) + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(p.label) + '" title="' + esc(p.label) + '" style="' + style + '">' + p.icon + "</a>";
    }).join("") + "</div>";
  }
  function editFields(links) {
    links = links || emptyLinks();
    return '<p class="group-label">Social profile links <span class="opt">(optional)</span></p><p class="hint" style="margin-top:0">Add your Facebook personal profile and Google Business Profile. Only the ones you fill in will show on your profile.</p>' +
      PLATFORMS.map(function (p) {
        var well = p.well ? ' ' + p.well : "";
        var bg = p.well === "g" ? "" : ' style="background:' + p.color + '"';
        return '<div class="field link-field"><label><span class="link-field-ico' + well + '"' + bg + '>' + p.icon + "</span>" + esc(p.label) + '</label>' +
          '<input name="link-' + p.id + '" inputmode="url" type="url" placeholder="' + esc(p.placeholder) + '" value="' + esc(links[p.id] || "") + '" data-link-id="' + p.id + '" autocomplete="off">' +
          '<p class="link-error" hidden></p>' +
          /* v2.2.2: help line under each link box (Vishal); video is set in the admin Tutorial sections */
          '<p class="rb-link-help"><span>Not sure where to find it?</span> <button type="button" class="rb-link-help-btn" data-action="rb-link-help" data-help="' + p.id + '" aria-label="Watch how to find your ' + esc(p.label) + ' (1 minute)">\u25B6\u00a0Watch how (1\u00a0min)</button></p></div>';
      }).join("");
  }
  function collect(form, current) {
    var out = fromMember({ links: current });
    if (!form) return out;
    PLATFORMS.forEach(function (p) {
      var el = form.querySelector('[name="link-' + p.id + '"]') || form.querySelector('[data-link-id="' + p.id + '"]');
      var raw = el ? el.value : (out[p.id] || "");
      var v = isValid(raw, p);
      out[p.id] = v.ok ? v.value : normalize(raw);
    });
    return out;
  }
  function bindValidation(rootEl) {
    if (!rootEl) return;
    rootEl.querySelectorAll("[data-link-id]").forEach(function (inp) {
      function check() {
        var id = inp.getAttribute("data-link-id");
        var p = PLATFORMS.filter(function (x) { return x.id === id; })[0];
        var v = isValid(inp.value, p);
        var err = inp.parentNode.querySelector(".link-error");
        if (!err) return v.ok;
        if (!inp.value.trim() || v.ok) { err.hidden = true; inp.classList.remove("invalid"); return true; }
        err.hidden = false;
        err.textContent = v.msg;
        inp.classList.add("invalid");
        return false;
      }
      inp.addEventListener("blur", check);
      inp.addEventListener("change", check);
    });
  }

  root.TCLinks = {
    PLATFORMS: PLATFORMS,
    empty: emptyLinks,
    normalize: normalize,
    isValid: isValid,
    fromMember: fromMember,
    applyToMember: applyToMember,
    filled: filled,
    iconRow: iconRow,
    editFields: editFields,
    collect: collect,
    bindValidation: bindValidation
  };
})(typeof window !== "undefined" ? window : global);
