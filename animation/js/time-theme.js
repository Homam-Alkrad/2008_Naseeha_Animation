/* ═══════════════════════════════════════════
   Time-Based Theme Engine
   Detects local time and smoothly transitions
   sky, ground, elements, and atmosphere.
   ═══════════════════════════════════════════ */

window.TimeTheme = (function () {
  "use strict";

  /* ── Color keyframes at specific hours ── */
  const KEYFRAMES = [
    { // 0 — Midnight / deep night
      hour: 0,
      sky:    [[2,11,26],  [9,28,58],   [11,26,48]],
      ground: [[16,34,58], [6,14,28]],
      moon: 1.0,  sun: 0,  stars: 1.0,  birds: 0,
      mosqueLights: 0.8,  lanternGlow: 1.0,  decorLights: 1.0,
      cloudRgb: [26,48,80],  cloudAlpha: 0.16,
      mosqueRgb: [7,14,30],
      treeRgb: [4,10,20],
      birdRgb: [26,42,64],
      skyShadow: [10,30,61],
      horizonRgb: [22,45,79],  horizonAlpha: 0.22,
      particleHue: 42,
      cannonInterval: 8,
      period: "night"
    },
    { // 4 — Fajr / pre-dawn
      hour: 4,
      sky:    [[8,18,40],  [18,42,75],  [38,62,88]],
      ground: [[22,40,60], [12,22,38]],
      moon: 0.5,  sun: 0,  stars: 0.35,  birds: 0,
      mosqueLights: 0.5,  lanternGlow: 0.65,  decorLights: 0.6,
      cloudRgb: [42,58,80],  cloudAlpha: 0.14,
      mosqueRgb: [10,18,36],
      treeRgb: [6,14,26],
      birdRgb: [30,48,70],
      skyShadow: [14,35,68],
      horizonRgb: [50,70,95],  horizonAlpha: 0.25,
      particleHue: 42,
      cannonInterval: 14,
      period: "fajr"
    },
    { // 5.5 — Sunrise
      hour: 5.5,
      sky:    [[28,48,90],  [85,108,148], [190,140,95]],
      ground: [[48,58,68],  [30,38,48]],
      moon: 0.04,  sun: 0.85,  stars: 0.02,  birds: 0.3,
      mosqueLights: 0.12,  lanternGlow: 0.18,  decorLights: 0.2,
      cloudRgb: [210,160,130],  cloudAlpha: 0.18,
      mosqueRgb: [18,26,44],
      treeRgb: [12,20,32],
      birdRgb: [50,60,75],
      skyShadow: [55,70,100],
      horizonRgb: [220,155,85],  horizonAlpha: 0.35,
      particleHue: 35,
      cannonInterval: 20,
      period: "sunrise"
    },
    { // 7.5 — Morning
      hour: 7.5,
      sky:    [[55,118,195], [95,168,235], [148,208,252]],
      ground: [[58,72,88],   [42,54,66]],
      moon: 0,  sun: 1,  stars: 0,  birds: 0.7,
      mosqueLights: 0.06,  lanternGlow: 0.1,  decorLights: 0.12,
      cloudRgb: [205,215,230],  cloudAlpha: 0.2,
      mosqueRgb: [22,34,55],
      treeRgb: [15,25,38],
      birdRgb: [40,55,72],
      skyShadow: [80,130,180],
      horizonRgb: [180,215,245],  horizonAlpha: 0.2,
      particleHue: 45,
      cannonInterval: 30,
      period: "morning"
    },
    { // 12 — Noon
      hour: 12,
      sky:    [[50,110,188], [88,158,228], [142,198,248]],
      ground: [[60,74,90],   [44,56,68]],
      moon: 0,  sun: 1,  stars: 0,  birds: 0.6,
      mosqueLights: 0.05,  lanternGlow: 0.08,  decorLights: 0.1,
      cloudRgb: [198,208,222],  cloudAlpha: 0.22,
      mosqueRgb: [24,36,58],
      treeRgb: [16,26,40],
      birdRgb: [38,52,68],
      skyShadow: [75,125,175],
      horizonRgb: [170,205,240],  horizonAlpha: 0.18,
      particleHue: 44,
      cannonInterval: 30,
      period: "noon"
    },
    { // 15 — Asr / afternoon
      hour: 15,
      sky:    [[58,108,178], [105,160,220], [172,200,230]],
      ground: [[62,72,82],   [46,55,65]],
      moon: 0,  sun: 0.95,  stars: 0,  birds: 0.45,
      mosqueLights: 0.08,  lanternGlow: 0.1,  decorLights: 0.12,
      cloudRgb: [195,200,215],  cloudAlpha: 0.2,
      mosqueRgb: [22,34,55],
      treeRgb: [15,25,38],
      birdRgb: [42,58,75],
      skyShadow: [72,120,170],
      horizonRgb: [195,200,215],  horizonAlpha: 0.2,
      particleHue: 40,
      cannonInterval: 20,
      period: "asr"
    },
    { // 16.75 — Maghrib / sunset (iftar!)
      hour: 16.75,
      sky:    [[22,16,44],  [138,52,58],  [225,115,52]],
      ground: [[48,40,44],  [24,22,30]],
      moon: 0.22,  sun: 0.5,  stars: 0.08,  birds: 0.12,
      mosqueLights: 0.52,  lanternGlow: 0.6,  decorLights: 0.75,
      cloudRgb: [170,85,65],  cloudAlpha: 0.25,
      mosqueRgb: [14,16,30],
      treeRgb: [8,12,22],
      birdRgb: [60,40,35],
      skyShadow: [38,25,50],
      horizonRgb: [240,155,55],  horizonAlpha: 0.45,
      particleHue: 24,
      cannonInterval: 5,
      period: "maghrib"
    },
    { // 18.5 — Isha / evening
      hour: 18.5,
      sky:    [[6,14,34],   [16,32,60],   [22,38,62]],
      ground: [[22,36,56],  [10,20,34]],
      moon: 0.85,  sun: 0,  stars: 0.78,  birds: 0,
      mosqueLights: 0.7,  lanternGlow: 0.85,  decorLights: 0.9,
      cloudRgb: [30,48,74],  cloudAlpha: 0.15,
      mosqueRgb: [8,16,30],
      treeRgb: [5,12,22],
      birdRgb: [28,44,66],
      skyShadow: [12,28,55],
      horizonRgb: [28,42,65],  horizonAlpha: 0.22,
      particleHue: 42,
      cannonInterval: 10,
      period: "isha"
    },
    { // 22 — Night (same as midnight, for wrap)
      hour: 22,
      sky:    [[2,11,26],  [9,28,58],   [11,26,48]],
      ground: [[16,34,58], [6,14,28]],
      moon: 1.0,  sun: 0,  stars: 1.0,  birds: 0,
      mosqueLights: 0.8,  lanternGlow: 1.0,  decorLights: 1.0,
      cloudRgb: [26,48,80],  cloudAlpha: 0.16,
      mosqueRgb: [7,14,30],
      treeRgb: [4,10,20],
      birdRgb: [26,42,64],
      skyShadow: [10,30,61],
      horizonRgb: [22,45,79],  horizonAlpha: 0.22,
      particleHue: 42,
      cannonInterval: 8,
      period: "night"
    }
  ];

  /* ── Utility: linear interpolation ── */
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpRgb(a, b, t) { return a.map((v, i) => Math.round(lerp(v, b[i], t))); }
  function rgb(c) { return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")"; }

  /* ── Get interpolated theme for a given decimal hour ── */
  function getThemeAt(hour) {
    let prev = KEYFRAMES[KEYFRAMES.length - 1];
    let next = KEYFRAMES[0];

    for (let i = 0; i < KEYFRAMES.length - 1; i++) {
      if (hour >= KEYFRAMES[i].hour && hour < KEYFRAMES[i + 1].hour) {
        prev = KEYFRAMES[i];
        next = KEYFRAMES[i + 1];
        break;
      }
    }

    const range = next.hour - prev.hour || 1;
    const t = Math.max(0, Math.min(1, (hour - prev.hour) / range));

    return {
      sky: [
        lerpRgb(prev.sky[0], next.sky[0], t),
        lerpRgb(prev.sky[1], next.sky[1], t),
        lerpRgb(prev.sky[2], next.sky[2], t)
      ],
      ground: [
        lerpRgb(prev.ground[0], next.ground[0], t),
        lerpRgb(prev.ground[1], next.ground[1], t)
      ],
      moon:           lerp(prev.moon, next.moon, t),
      sun:            lerp(prev.sun, next.sun, t),
      stars:          lerp(prev.stars, next.stars, t),
      birds:          lerp(prev.birds, next.birds, t),
      mosqueLights:   lerp(prev.mosqueLights, next.mosqueLights, t),
      lanternGlow:    lerp(prev.lanternGlow, next.lanternGlow, t),
      decorLights:    lerp(prev.decorLights, next.decorLights, t),
      cloudRgb:       lerpRgb(prev.cloudRgb, next.cloudRgb, t),
      cloudAlpha:     lerp(prev.cloudAlpha, next.cloudAlpha, t),
      mosqueRgb:      lerpRgb(prev.mosqueRgb, next.mosqueRgb, t),
      treeRgb:        lerpRgb(prev.treeRgb, next.treeRgb, t),
      birdRgb:        lerpRgb(prev.birdRgb, next.birdRgb, t),
      skyShadow:      lerpRgb(prev.skyShadow, next.skyShadow, t),
      horizonRgb:     lerpRgb(prev.horizonRgb, next.horizonRgb, t),
      horizonAlpha:   lerp(prev.horizonAlpha, next.horizonAlpha, t),
      particleHue:    Math.round(lerp(prev.particleHue, next.particleHue, t)),
      cannonInterval: lerp(prev.cannonInterval, next.cannonInterval, t),
      period:         t < 0.5 ? prev.period : next.period
    };
  }

  /* ── Sun position along an arc ── */
  function getSunPosition(hour) {
    const RISE = 5.5, SET = 18.5;
    if (hour < RISE || hour > SET) return { x: 800, y: 700 };
    const progress = (hour - RISE) / (SET - RISE);
    return {
      x: 180 + progress * 1240,
      y: 560 - Math.sin(progress * Math.PI) * 460
    };
  }

  /* ── Apply theme to DOM ── */
  function apply(theme, hour) {
    const root = document.documentElement.style;
    const $ = (id) => document.getElementById(id);

    // SVG gradient stops
    const skyStops = [
      $("sky-stop-0"), $("sky-stop-1"), $("sky-stop-2")
    ];
    const groundStops = [$("ground-stop-0"), $("ground-stop-1")];

    if (skyStops[0]) skyStops[0].setAttribute("stop-color", rgb(theme.sky[0]));
    if (skyStops[1]) skyStops[1].setAttribute("stop-color", rgb(theme.sky[1]));
    if (skyStops[2]) skyStops[2].setAttribute("stop-color", rgb(theme.sky[2]));
    if (groundStops[0]) groundStops[0].setAttribute("stop-color", rgb(theme.ground[0]));
    if (groundStops[1]) groundStops[1].setAttribute("stop-color", rgb(theme.ground[1]));

    // Horizon glow
    const hgs = $("horizon-glow-stop");
    if (hgs) {
      hgs.setAttribute("stop-color", rgb(theme.horizonRgb));
      hgs.setAttribute("stop-opacity", theme.horizonAlpha.toFixed(2));
    }

    // Element opacities
    const setOpacity = (id, val) => {
      const el = $(id);
      if (el) el.setAttribute("opacity", val.toFixed(3));
    };
    setOpacity("moon-group", theme.moon);
    setOpacity("sun-group", theme.sun);
    setOpacity("stars-far", theme.stars * 0.6);
    setOpacity("stars-mid", theme.stars);
    setOpacity("stars-near", theme.stars);
    setOpacity("shooting-stars", theme.stars);
    setOpacity("birds", theme.birds);
    setOpacity("mosque-lights", theme.mosqueLights);
    setOpacity("decor-lights", theme.decorLights);

    // Atmospheric elements (nebula, milky way)
    setOpacity("milky-way", theme.stars * 0.07);
    setOpacity("nebula-1", theme.stars * 0.05);
    setOpacity("nebula-2", theme.stars * 0.06);

    // Sun position
    const sunPos = getSunPosition(hour);
    const sunEls = ["sun-core", "sun-glow", "sun-halo"];
    sunEls.forEach(id => {
      const el = $(id);
      if (el) {
        el.setAttribute("cx", sunPos.x.toFixed(1));
        el.setAttribute("cy", sunPos.y.toFixed(1));
      }
    });
    const sunRays = $("sun-rays");
    if (sunRays) {
      sunRays.style.transformOrigin = sunPos.x + "px " + sunPos.y + "px";
      const lines = sunRays.querySelectorAll("line");
      const offsets = [
        [0,-80,0,-60], [0,60,0,80], [-80,0,-60,0], [60,0,80,0],
        [-56,-56,-42,-42], [42,42,56,56], [-56,56,-42,42], [42,-42,56,-56]
      ];
      lines.forEach((line, i) => {
        if (!offsets[i]) return;
        line.setAttribute("x1", sunPos.x + offsets[i][0]);
        line.setAttribute("y1", sunPos.y + offsets[i][1]);
        line.setAttribute("x2", sunPos.x + offsets[i][2]);
        line.setAttribute("y2", sunPos.y + offsets[i][3]);
      });
    }

    // CSS custom properties
    root.setProperty("--sky-shadow", rgb(theme.skyShadow));
    root.setProperty("--mosque-color", rgb(theme.mosqueRgb));
    root.setProperty("--tree-color", rgb(theme.treeRgb));
    root.setProperty("--bird-color", rgb(theme.birdRgb));
    root.setProperty("--cloud-color", rgb(theme.cloudRgb));
    root.setProperty("--cloud-fill",
      "rgba(" + theme.cloudRgb.join(",") + "," + theme.cloudAlpha.toFixed(2) + ")");
    root.setProperty("--particle-hue", theme.particleHue);
    root.setProperty("--lantern-glow", theme.lanternGlow.toFixed(2));
    root.setProperty("--cannon-interval", theme.cannonInterval.toFixed(1) + "s");

    // Card adjustments based on time
    const isDay = theme.sun > 0.5;
    if (isDay) {
      root.setProperty("--card-bg", "rgba(10,20,40,0.82)");
      root.setProperty("--card-border", "rgba(232,183,48,0.3)");
      root.setProperty("--card-glow", "rgba(232,183,48,0.06)");
    } else if (theme.period === "maghrib") {
      root.setProperty("--card-bg", "rgba(20,12,30,0.8)");
      root.setProperty("--card-border", "rgba(240,160,50,0.4)");
      root.setProperty("--card-glow", "rgba(240,160,50,0.12)");
    } else {
      root.setProperty("--card-bg", "rgba(6,16,36,0.78)");
      root.setProperty("--card-border", "rgba(232,183,48,0.35)");
      root.setProperty("--card-glow", "rgba(232,183,48,0.08)");
    }

    // Scene fade overlay adjustments
    const sf = $("scene-fade");
    if (sf) {
      const bottomAlpha = isDay ? 0.6 : 0.9;
      const topAlpha = isDay ? 0.06 : 0.12;
      sf.style.background = [
        "linear-gradient(to top, rgba(2,8,18," + bottomAlpha + ") 0%, rgba(2,8,18," + topAlpha + ") 26%, transparent 58%)",
        "radial-gradient(circle at 50% 48%, transparent 0%, rgba(2,8,18," + (isDay ? 0.12 : 0.28) + ") 100%)"
      ].join(",");
    }

    // Body background
    document.body.style.background = rgb(theme.sky[0]);
  }

  /* ── Time-aware greeting ── */
  function getTimeGreeting(period) {
    const greetings = {
  night:   "تقبل الله صيامكم وقيامكم ✨",
  fajr:    "سحور مبارك — قوّة ليومك 🌙",
  sunrise: "أشرقت شمس يوم جديد من رمضان 🕌",
  morning: "صباح مبارك — يوم مليء بالخير ✨",
  noon:    "اللهم أعنّا على الصيام 🌙",
  asr:     "رمضان مبارك — تقبل الله طاعاتكم 🕌",
  maghrib: "صومًا مقبولاً — إفطاراً شهياً 🌙",
  isha:    "ليلة مباركة من ليالي رمضان ✨"
};
    return greetings[period] || "مبارك عليك الإنجاز";
  }

  /* ── Public API ── */
  let currentPeriod = "";

  function update() {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;
    const theme = getThemeAt(hour);
    apply(theme, hour);

    // Update greeting if period changed
    if (theme.period !== currentPeriod) {
      currentPeriod = theme.period;
      const el = document.getElementById("timeGreeting");
      if (el) el.textContent = getTimeGreeting(currentPeriod);
    }

    return theme;
  }

  function init() {
    const theme = update();
    setInterval(update, 60000);
    return theme;
  }

  return { init, update, getThemeAt, getSunPosition };
})();

