// DCS Verify — Badge Network  [build spec 2.3]
// A drop-in "Verified by DCS" badge any website embeds with one script tag:
//   <script src="https://verify.dcslabs.ai/badge.js"
//           data-cid="b...." data-theme="light"></script>
// It renders a badge, fetches live status from the public verify API, and on
// click opens the full verify page. NO framework, NO DCS account, works on any
// site. This is the distribution layer — the SSL-padlock model.
//
// Trust note: the badge calls the PUBLIC verify endpoint and links to the verify
// page where raw materials (CID, pubkey, Basescan) are exposed — so a skeptic
// can confirm without trusting the badge itself.

(function () {
  "use strict";

  var API = "https://api.dcslabs.ai/v1";
  var VERIFY_PAGE = "https://dcslabs.ai/verify";

  // Find the <script> tag that loaded us (to read data-* attributes).
  var thisScript =
    document.currentScript ||
    (function () {
      var s = document.getElementsByTagName("script");
      return s[s.length - 1];
    })();

  var cid = thisScript.getAttribute("data-cid");
  var theme = thisScript.getAttribute("data-theme") || "light";
  var mountId = thisScript.getAttribute("data-mount"); // optional target element

  var STATES = {
    valid: { label: "Verified by DCS", color: "#1d9e75", icon: "check" },
    expired: { label: "Expired", color: "#ba7517", icon: "clock" },
    suspended: { label: "Suspended", color: "#ba7517", icon: "pause" },
    revoked: { label: "Revoked", color: "#a32d2d", icon: "x" },
    renewed: { label: "Renewed — see latest", color: "#185fa5", icon: "refresh" },
    unknown: { label: "Verify", color: "#5f5e5a", icon: "shield" },
    error: { label: "Verification unavailable", color: "#5f5e5a", icon: "shield" },
  };

  function icon(name, color) {
    // tiny inline SVG, no external deps
    var paths = {
      check: '<path d="M5 10l3 3 7-7" stroke="' + color + '" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
      x: '<path d="M6 6l8 8M14 6l-8 8" stroke="' + color + '" stroke-width="2" stroke-linecap="round"/>',
      clock: '<circle cx="10" cy="10" r="7" stroke="' + color + '" stroke-width="1.6" fill="none"/><path d="M10 6v4l3 2" stroke="' + color + '" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
      pause: '<path d="M8 6v8M12 6v8" stroke="' + color + '" stroke-width="2" stroke-linecap="round"/>',
      refresh: '<path d="M4 10a6 6 0 1 1 2 4.5M4 14v-3h3" stroke="' + color + '" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
      shield: '<path d="M10 3l6 2v4c0 4-3 7-6 8-3-1-6-4-6-8V5z" stroke="' + color + '" stroke-width="1.4" fill="none"/>',
    };
    return (
      '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" style="flex:0 0 auto">' +
      (paths[name] || paths.shield) +
      "</svg>"
    );
  }

  function render(state) {
    var s = STATES[state] || STATES.unknown;
    var dark = theme === "dark";
    var bg = dark ? "#1a1a1a" : "#ffffff";
    var fg = dark ? "#e8e8e8" : "#1c2435";
    var border = dark ? "#333" : "#e4e9f2";

    var el = document.createElement("a");
    el.href = VERIFY_PAGE + "/" + encodeURIComponent(cid || "");
    el.target = "_blank";
    el.rel = "noopener noreferrer";
    el.setAttribute("aria-label", s.label + " — open verification");
    el.style.cssText =
      "display:inline-flex;align-items:center;gap:8px;padding:6px 12px;" +
      "border:1px solid " + border + ";border-radius:8px;background:" + bg + ";" +
      "color:" + fg + ";font:500 13px/1 -apple-system,Segoe UI,Roboto,sans-serif;" +
      "text-decoration:none;cursor:pointer;transition:box-shadow .15s";
    el.onmouseenter = function () { el.style.boxShadow = "0 1px 6px rgba(0,0,0,.12)"; };
    el.onmouseleave = function () { el.style.boxShadow = "none"; };

    el.innerHTML =
      icon(s.icon, s.color) +
      '<span style="white-space:nowrap">' + s.label + "</span>" +
      '<span style="font-size:11px;color:' + (dark ? "#888" : "#9c9a92") + '">DCS Verify</span>';

    return el;
  }

  function mount(node) {
    if (mountId) {
      var target = document.getElementById(mountId);
      if (target) { target.innerHTML = ""; target.appendChild(node); return; }
    }
    // default: insert right after our own <script> tag
    thisScript.parentNode.insertBefore(node, thisScript.nextSibling);
  }

  function boot() {
    if (!cid) {
      mount(render("error"));
      return;
    }
    // optimistic placeholder while we fetch
    var placeholder = render("unknown");
    mount(placeholder);

    fetch(API + "/status/cid/" + encodeURIComponent(cid))
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (data) {
        var state = data && data.validity_status ? data.validity_status : "unknown";
        var fresh = render(state);
        placeholder.parentNode.replaceChild(fresh, placeholder);
      })
      .catch(function () {
        var fresh = render("error");
        placeholder.parentNode.replaceChild(fresh, placeholder);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
