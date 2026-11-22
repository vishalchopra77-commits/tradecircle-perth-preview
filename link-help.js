/* Rate Buddies v2.2.2 — "Not sure where to find it? ▶ Watch how (1 min)" under the profile link boxes.
   Plays the admin-set tutorial video (TCTutorials.helpVideo) in a sheet; friendly "Video coming soon" if none is set. */
(function (root) {
  "use strict";
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function close() { var o = document.getElementById("rb-lh-sheet"); if (o) o.remove(); }
  function open(kind) {
    close();
    var T = root.TCTutorials, v = T && T.helpVideo ? T.helpVideo(kind) : null;
    var title = v ? v.title : (kind === "google" ? "How to find your Google Business Profile link" : "How to find your Facebook profile link");
    var hasVid = !!(v && !v.hidden && v.embed);
    var body = hasVid
      ? '<div class="rb-lh-frame"><iframe src="' + esc(v.embed + (v.embed.indexOf("?") > -1 ? "&" : "?") + "autoplay=1") + '" title="' + esc(title) + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>'
      : '<div class="rb-lh-soon"><img src="' + esc((v && v.thumb) || "assets/tutorials/profile.png") + '" alt=""><div class="rb-lh-soon-txt"><b>Video coming soon</b><span>We are recording this 1-minute how-to. For now, open your ' + (kind === "google" ? "Google Business Profile, tap Share and copy the link" : "Facebook profile, tap ··· then Copy profile link") + ', and paste it here.</span></div></div>';
    var host = document.getElementById("phone") || document.body;
    host.insertAdjacentHTML("beforeend", '<div id="rb-lh-sheet" class="rb-lh-sheet" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><div class="rb-lh-card"><div class="rb-lh-head"><span>' + esc(title) + '</span><button type="button" class="rb-lh-x" aria-label="Close">\u00d7</button></div>' + body + '<p class="rb-lh-note">Rate Buddies v2.2.2 · video set by the admin in Tutorial sections</p></div></div>');
    try { if (hasVid && T.markWatched) T.markWatched(v.id); } catch (e) {}
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-action='rb-link-help']");
    if (b) { e.preventDefault(); e.stopPropagation(); open(b.getAttribute("data-help")); return; }
    if (e.target.closest && (e.target.closest(".rb-lh-x") || e.target.id === "rb-lh-sheet")) close();
  }, true);
  root.RBLinkHelp = { open: open, close: close };
})(window);
