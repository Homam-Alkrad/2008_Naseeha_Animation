/* ═══════════════════════════════════════════
   SVG Lantern Generator
   Creates detailed Arabic lanterns with
   lattice patterns, inner glow, and flame.
   ═══════════════════════════════════════════ */

window.createLanterns = (function () {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";

  const POSITIONS = [
    { left: "5%",   top: "-2%",  swing: "5.6s", delay: "0s",    hue: 42 },
    { left: "14%",  top: "1%",   swing: "4.9s", delay: "0.5s",  hue: 38 },
    { left: "28%",  top: "-1%",  swing: "5.3s", delay: "1.1s",  hue: 44 },
    { left: "74%",  top: "0%",   swing: "5.7s", delay: "0.3s",  hue: 40 },
    { left: "87%",  top: "2%",   swing: "4.7s", delay: "0.8s",  hue: 36 },
    { left: "96%",  top: "1%",   swing: "5.1s", delay: "1.4s",  hue: 45 }
  ];

  function buildLanternSVG(hue, idx) {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "lantern-svg");
    svg.setAttribute("viewBox", "0 0 60 105");
    svg.setAttribute("fill", "none");

    const id = "l" + idx;
    svg.innerHTML =
      '<defs>' +
        '<linearGradient id="' + id + 'body" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="hsl(' + hue + ',78%,58%)" stop-opacity="0.88"/>' +
          '<stop offset="100%" stop-color="hsl(' + hue + ',68%,32%)" stop-opacity="0.78"/>' +
        '</linearGradient>' +
        '<radialGradient id="' + id + 'glow" cx="50%" cy="48%" r="50%">' +
          '<stop offset="0%" stop-color="hsl(' + hue + ',88%,74%)" stop-opacity="0.65"/>' +
          '<stop offset="100%" stop-color="hsl(' + hue + ',78%,50%)" stop-opacity="0"/>' +
        '</radialGradient>' +
      '</defs>' +

      /* Hook */
      '<path d="M30 0 L30 3" stroke="hsl(' + hue + ',48%,48%)" stroke-width="1.5" stroke-linecap="round"/>' +

      /* Top cap */
      '<rect x="21" y="3" width="18" height="6" rx="2" fill="hsl(' + hue + ',55%,38%)"/>' +
      '<rect x="17" y="9" width="26" height="8" rx="3.5" fill="hsl(' + hue + ',58%,42%)"/>' +

      /* Body */
      '<path d="M17 17 Q12 34 12 52 Q12 78 21 90 L39 90 Q48 78 48 52 Q48 34 43 17 Z" ' +
        'fill="url(#' + id + 'body)" stroke="hsl(' + hue + ',68%,50%)" stroke-width="0.7"/>' +

      /* Lattice pattern */
      '<line x1="30" y1="19" x2="30" y2="88" stroke="hsl(' + hue + ',58%,54%)" stroke-width="0.5" opacity="0.45"/>' +
      '<line x1="21" y1="19" x2="19" y2="88" stroke="hsl(' + hue + ',58%,54%)" stroke-width="0.4" opacity="0.3"/>' +
      '<line x1="39" y1="19" x2="41" y2="88" stroke="hsl(' + hue + ',58%,54%)" stroke-width="0.4" opacity="0.3"/>' +
      '<path d="M12 36 Q30 28 48 36" fill="none" stroke="hsl(' + hue + ',58%,54%)" stroke-width="0.4" opacity="0.3"/>' +
      '<path d="M12 52 Q30 44 48 52" fill="none" stroke="hsl(' + hue + ',58%,54%)" stroke-width="0.4" opacity="0.3"/>' +
      '<path d="M14 68 Q30 60 46 68" fill="none" stroke="hsl(' + hue + ',58%,54%)" stroke-width="0.4" opacity="0.3"/>' +

      /* Diamond lattice */
      '<path d="M21 36 L30 52 L39 36" fill="none" stroke="hsl(' + hue + ',55%,52%)" stroke-width="0.35" opacity="0.25"/>' +
      '<path d="M19 52 L30 68 L41 52" fill="none" stroke="hsl(' + hue + ',55%,52%)" stroke-width="0.35" opacity="0.25"/>' +

      /* Inner glow */
      '<ellipse class="lantern-inner-glow" cx="30" cy="50" rx="13" ry="24" fill="url(#' + id + 'glow)"/>' +

      /* Flame */
      '<ellipse class="lantern-flame" cx="30" cy="48" rx="4.5" ry="8" fill="hsl(' + hue + ',94%,82%)" opacity="0.82"/>' +
      '<ellipse class="lantern-flame" cx="30" cy="50" rx="2.5" ry="5" fill="hsl(' + (hue + 5) + ',98%,92%)" opacity="0.6" style="animation-delay:.15s"/>' +

      /* Bottom cap + tassel */
      '<rect x="23" y="90" width="14" height="5" rx="2" fill="hsl(' + hue + ',55%,38%)"/>' +
      '<line x1="30" y1="95" x2="30" y2="103" stroke="hsl(' + hue + ',55%,44%)" stroke-width="1.2" stroke-linecap="round"/>' +
      '<circle cx="30" cy="104" r="1.5" fill="hsl(' + hue + ',55%,44%)"/>';

    return svg;
  }

  function create() {
    const layer = document.getElementById("lantern-layer");
    if (!layer) return;

    POSITIONS.forEach(function (p, idx) {
      var wrap = document.createElement("div");
      wrap.className = "lantern-wrap";
      wrap.style.left = p.left;
      wrap.style.top  = p.top;
      wrap.style.setProperty("--swing", p.swing);
      wrap.style.animationDelay = p.delay;

      var str = document.createElement("div");
      str.className = "lantern-string";
      wrap.appendChild(str);

      wrap.appendChild(buildLanternSVG(p.hue, idx));
      layer.appendChild(wrap);
    });
  }

  return create;
})();
