/* =====================================================================
   ATLAS CANARIAS — JavaScript compartido
   ===================================================================== */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Sombra del header al hacer scroll ---- */
  var header = document.querySelector(".header");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Menú móvil ---- */
  var burger = document.getElementById("burger");
  var movil = document.getElementById("movil");
  var cerrar = document.getElementById("cerrarMovil");
  if (burger && movil) {
    burger.addEventListener("click", function () {
      movil.classList.add("open");
      burger.setAttribute("aria-expanded", "true");
    });
  }
  function closeMovil() {
    if (movil) movil.classList.remove("open");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }
  if (cerrar) cerrar.addEventListener("click", closeMovil);
  if (movil) movil.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMovil); });

  /* ---- Aparición al hacer scroll ---- */
  var els = document.querySelectorAll(".reveal");
  if (els.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- Contadores ---- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    var cIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, target = +el.getAttribute("data-count");
        var suffix = el.getAttribute("data-suffix") || "";
        if (reduce) { el.textContent = target + suffix; cIO.unobserve(el); return; }
        var t0 = null, dur = 1500;
        (function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * ease) + suffix;
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
        cIO.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cIO.observe(el); });
  }

  /* ---- Monitor panel: onda + valores en vivo ---- */
  (function () {
    var mpList = [
      { el: document.getElementById("mpPres"),    bar: document.getElementById("mpPresBar"),    v: 8.2,  min: 7.5, max: 8.9, step: 0.07, dec: 1, scale: 8.9 - 7.5 },
      { el: document.getElementById("mpEfic"),    bar: document.getElementById("mpEficBar"),    v: 94,   min: 90,  max: 98,  step: 0.35, dec: 0, scale: 8 },
      { el: document.getElementById("mpCaudal"),  bar: document.getElementById("mpCaudalBar"),  v: 850,  min: 780, max: 920, step: 3.5,  dec: 0, scale: 140 }
    ];
    var tsEl  = document.getElementById("mpTs");
    var canvas = document.getElementById("mpWave");
    if (!tsEl && !canvas) return;

    function pad(n) { return ("0" + n).slice(-2); }
    function tick() {
      var d = new Date();
      if (tsEl) tsEl.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
      mpList.forEach(function (m) {
        if (!m.el) return;
        var delta = (Math.random() - 0.48) * m.step * 2;
        m.v = Math.max(m.min, Math.min(m.max, m.v + delta));
        m.el.textContent = m.v.toFixed(m.dec);
        if (m.bar) m.bar.style.width = (((m.v - m.min) / m.scale) * 100).toFixed(1) + "%";
      });
    }
    tick();
    setInterval(tick, 1600);

    if (!canvas || reduce) return;
    var ctx = canvas.getContext("2d");
    var phase = 0;
    function drawWave() {
      var w = canvas.offsetWidth || 260;
      if (canvas.width !== w) canvas.width = w;
      var h = 36;
      ctx.clearRect(0, 0, w, h);
      /* dot grid */
      ctx.fillStyle = "rgba(26,115,214,0.18)";
      for (var gx = 0; gx < w; gx += 18) for (var gy = 4; gy < h; gy += 9) ctx.fillRect(gx, gy, 1, 1);
      /* glow pass */
      ctx.save();
      ctx.beginPath();
      for (var x = 0; x <= w; x++) {
        var t = (x / w) * Math.PI * 4 + phase;
        var y = h / 2 + Math.sin(t) * h * 0.3 + Math.sin(t * 2.7 + 0.8) * h * 0.1;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(26,115,214,0.22)";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
      /* sharp line */
      ctx.save();
      ctx.beginPath();
      for (var x = 0; x <= w; x++) {
        var t = (x / w) * Math.PI * 4 + phase;
        var y = h / 2 + Math.sin(t) * h * 0.3 + Math.sin(t * 2.7 + 0.8) * h * 0.1;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "#1a73d6";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#5ab4ff";
      ctx.shadowBlur = 5;
      ctx.stroke();
      ctx.restore();
      /* trailing dot */
      var lt = Math.PI * 4 + phase;
      var ly = h / 2 + Math.sin(lt) * h * 0.3 + Math.sin(lt * 2.7 + 0.8) * h * 0.1;
      ctx.beginPath();
      ctx.arc(w, ly, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#7ef8e8";
      ctx.shadowColor = "#7ef8e8";
      ctx.shadowBlur = 7;
      ctx.fill();
      ctx.shadowBlur = 0;
      phase += 0.025;
      requestAnimationFrame(drawWave);
    }
    drawWave();
  })();

  /* ---- Telemetría ticker ---- */
  (function () {
    var inner = document.getElementById("tlInner");
    if (!inner) return;
    var segs = [
      { label: "TFE · COMPRESOR A1", items: [["Presión", "8.2 bar"], ["Eficiencia", "94%"], ["Temp", "42°C"]] },
      { label: "TFE · SECADOR AD200", items: [["Pto. rocío", "−40°C"], ["Caudal", "850 l/min"]] },
      { label: "LPA · COMPRESOR B2", items: [["Presión", "7.8 bar"], ["Eficiencia", "91%"], ["Temp", "39°C"]] },
      { label: "LPA · RED DISTRIB.",  items: [["Presión mín", "7.2 bar"], ["Fugas", "0"], ["Estado", "ÓPTIMO"]] },
      { label: "TFE · VACÍO V1",      items: [["Nivel vacío", "−0.85 bar"], ["Ciclos/h", "142"]] },
      { label: "LPA · GEN. N₂",       items: [["Pureza", "99.8%"], ["Flujo", "240 Nm³/h"]] }
    ];
    function buildSegs(arr) {
      var frag = document.createDocumentFragment();
      arr.forEach(function (s) {
        var seg = document.createElement("span");
        seg.className = "tl-seg";
        var lbl = document.createElement("span");
        lbl.className = "tl-seg-label";
        lbl.textContent = s.label;
        seg.appendChild(lbl);
        s.items.forEach(function (item, i) {
          seg.appendChild(document.createTextNode((i > 0 ? "  ·  " : "  ") + item[0] + " "));
          var v = document.createElement("span");
          v.className = item[1] === "ÓPTIMO" ? "tl-num-green" : "tl-num";
          v.textContent = item[1];
          seg.appendChild(v);
        });
        frag.appendChild(seg);
      });
      return frag;
    }
    inner.appendChild(buildSegs(segs));
    inner.appendChild(buildSegs(segs));
  })();

  /* ---- Monitor strip: gauges + valores en tiempo real ---- */
  (function () {
    var CIRC = 113.1, ARC = 84.8;
    function setGauge(id, pct) {
      var el = document.getElementById(id);
      if (!el) return;
      var d = pct * ARC;
      el.style.strokeDasharray = d.toFixed(1) + " " + (CIRC - d).toFixed(1);
    }
    var msData = [
      { valId: "msPres",   gaugeId: "msGPres",   v: 8.2,  min: 7.0, max: 9.5,  step: 0.06, dec: 1 },
      { valId: "msEfic",   gaugeId: "msGEfic",   v: 94,   min: 60,  max: 100,  step: 0.35, dec: 0 },
      { valId: "msCaudal", gaugeId: "msGCaudal", v: 850,  min: 600, max: 1100, step: 3.5,  dec: 0 },
      { valId: "msTemp",   gaugeId: "msGTemp",   v: 41,   min: 20,  max: 80,   step: 0.5,  dec: 0 }
    ];
    var msTsEl = document.getElementById("msTs");
    if (!msTsEl && !document.getElementById("msGPres")) return;
    function pad2(n) { return ("0" + n).slice(-2); }
    function msTick() {
      var d = new Date();
      if (msTsEl) msTsEl.textContent = pad2(d.getHours()) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds());
      msData.forEach(function (m) {
        var el = document.getElementById(m.valId);
        if (!el) return;
        m.v = Math.max(m.min, Math.min(m.max, m.v + (Math.random() - 0.48) * m.step * 2));
        el.textContent = m.v.toFixed(m.dec);
        setGauge(m.gaugeId, (m.v - m.min) / (m.max - m.min));
      });
      setGauge("msGEquipos", 1);
    }
    msTick();
    setInterval(msTick, 2000);
  })();

  /* ---- Formulario de contacto (demo, sin envío real) ---- */
  var form = document.getElementById("formContacto");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var aviso = document.getElementById("formAviso");
      var nombre = (document.getElementById("nombre") || {}).value || "";
      if (aviso) {
        aviso.textContent = "Gracias" + (nombre ? ", " + nombre.split(" ")[0] : "") +
          ". Hemos recibido tu solicitud (demo). Te responderemos en menos de 24 h laborables.";
        aviso.classList.add("visible");
      }
      form.reset();
    });
  }
})();
