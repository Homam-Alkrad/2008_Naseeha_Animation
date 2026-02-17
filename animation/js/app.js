/* ═══════════════════════════════════════════
   Ramadan Greeting — Application Entry Point
   Messages, initialization, and coordination.
   ═══════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── Rotating title phrases ── */
  var titles = [
    "أبدعت",
    "تجاوزت المألوف",
    "بلغت القمة",
    "حققت المستحيل",
    "أدهشت العقول",
    "صنعت الفارق",
    "رسمت الإبداع",
    "تخطيت التوقعات",
    "نسجت التميز",
    "أتقنت الصنعة",
    "سطرت النجاح",
    "جسّدت الإتقان",
    "لامست السحاب"
  ];

  /* ── Congratulatory messages (masculine form) ── */
  var messages = [
    [
      "مش غريب عليك هاد التألق.",
      "كنت بتطمح للقمة، وهلا إنت صرت القمة نفسها.",
      "العلامة الكاملة مو بس رقم، هي مكافأة لتعبك وسهرك وإصرارك اللي ما بيلين.",
      "كمل طريقك، إحنا دايمًا بضهرك وفخورين فيك وبكل خطوة بتعملها."
    ],
    [
      "في ناس بتمر على النجاح مرور الكرام.",
      "وفي ناس متلك، بتترك بصمة بكل مكان بتدخله.",
      "مبروك العلامة الكاملة اللي بتشبه طموحك الصافي.",
      "خليك دايمًا واثق إنك بتستحق الأفضل، لأنك ببساطة مبدع."
    ],
    [
      "مين اللي سرق الأضواء وأخد العلامة الكاملة؟",
      "أكيد الشخص اللي ما بنقدر نلحق على ذكائه وسرعته.",
      "ألف مبروك يا بطل، هيك الشغل وإلا بلاش.",
      "هلا صار وقت نحتفل فيك وبإنجازك اللي بيرفع الراس."
    ],
    [
      "أبدعت فأبهرت.",
      "مو بس وصلت للهدف، إنت تجاوزته بمراحل.",
      "العلامة الكاملة لايقة عليك وعلى اجتهادك.",
      "مبروك من القلب، ومن نجاح لنجاح أكبر إن شاء الله."
    ],
    [
      "كل الكلمات بتعجز توصف فرحتنا فيك اليوم.",
      "إنت مثال حي للنجاح اللي بيجي من تعب وشغف.",
      "شكرًا لأنك رفعت راسنا، وشكرًا لأنك دايمًا بتثبت إنك الأفضل.",
      "من القلب: إنجازك يستحق كل تقدير."
    ],
    [
      "هالنتيجة مو صدفة أبدًا.",
      "هي نتيجة ليالي سهر ومثابرة وعزيمة ما بتنكسر.",
      "اليوم العالم كله لازم يعرف إنك إنسان استثنائي.",
      "مبروك العلامة الكاملة، وإن شاء الله هاي بس البداية."
    ],
    [
      "كم مرة حسّيت بالتعب وكمّلت؟",
      "كم مرة فكّرت تستسلم بس رفضت؟ هاي النتيجة هي الجواب.",
      "مبروك من كل قلوبنا — علامة كاملة تستحقها بجدارة.",
      "الله يوفقك ويحفظك ويعطيك فوق ما تتمنى."
    ],
    [
      "الكل بيحكي عن النجاح، بس إنت بتعيشه.",
      "علامة كاملة من شخص كامل الطموح والإرادة.",
      "ما في كلام بيوفّيك حقك، بس مبروك من أعماق القلب.",
      "ضليت تشتغل بصمت، وهلا النتيجة بتحكي بصوت عالي."
    ],
    [
      "إنت ما بتعرف كلمة مستحيل.",
      "كل مرة بتثبت إنك فوق التوقعات بمراحل.",
      "العلامة الكاملة شهادة على إنك بطل حقيقي.",
      "كمل يا غالي، السما هي الحد بس إذا إنت سمحت."
    ],
    [
      "لما بنسمع عن التفوق، بنتذكرك إنت أول شي.",
      "مبروك — إنجازك فخر لكل اللي بيعرفوك.",
      "هاي العلامة مو بس رقم، هي عنوان لشخصيتك القوية.",
      "ربنا يكمل عليك ويزيدك من فضله."
    ]
  ];

  function setRandomTitle() {
    var titleEl = document.getElementById("cardTitle");
    if (!titleEl) return;
    var chosen = titles[Math.floor(Math.random() * titles.length)];
    titleEl.textContent = chosen;
  }

  function setRandomMessage() {
    var sel = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById("line1").textContent = sel[0];
    document.getElementById("line2").textContent = sel[1];
    document.getElementById("line3").textContent = sel[2];
    document.getElementById("line4").textContent = sel[3];
  }

  /* ── Initialize everything ── */
  function init() {
    setRandomTitle();
    setRandomMessage();

    // Time-based theme
    if (window.TimeTheme) {
      window.TimeTheme.init();
    }

    // Lanterns
    if (window.createLanterns) {
      window.createLanterns();
    }

    // Particles
    var canvas = document.getElementById("particle-layer");
    if (canvas && window.AmbientParticles) {
      new window.AmbientParticles(canvas);
    }
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
