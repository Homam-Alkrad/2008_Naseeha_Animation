/* ═══════════════════════════════════════════
   Enhanced Particle System
   Gold dust with depth/wobble/bokeh +
   Firefly system near ground level.
   Reads --particle-hue from CSS for theming.
   ═══════════════════════════════════════════ */

window.AmbientParticles = (function () {
  "use strict";

  class AmbientParticles {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.particles = [];
      this.fireflies = [];
      this.lastTime = performance.now();
      this.hue = 42;

      this.resize();
      this.seed();

      window.addEventListener("resize", () => this.resize());
      requestAnimationFrame(t => this.animate(t));
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = window.innerWidth;
      this.h = window.innerHeight;
      this.canvas.width  = this.w * dpr;
      this.canvas.height = this.h * dpr;
      this.canvas.style.width  = this.w + "px";
      this.canvas.style.height = this.h + "px";
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    seed() {
      const dustCount = Math.max(65, Math.floor(this.w / 14));
      for (let i = 0; i < dustCount; i++) {
        this.particles.push(this._makeDust(true));
      }
      const ffCount = Math.max(6, Math.floor(this.w / 120));
      for (let i = 0; i < ffCount; i++) {
        this.fireflies.push(this._makeFirefly());
      }
    }

    _makeDust(init) {
      const depth = Math.random();
      return {
        x: Math.random() * this.w,
        y: init ? Math.random() * this.h : this.h + 12,
        r: (1 - depth * 0.55) * (Math.random() * 2.2 + 0.5),
        vy: (1 - depth * 0.45) * (Math.random() * 0.38 + 0.07),
        vx: (Math.random() - 0.5) * 0.22,
        a: (1 - depth * 0.4) * (Math.random() * 0.42 + 0.18),
        phase: Math.random() * Math.PI * 2,
        wobble: Math.random() * 0.009 + 0.003,
        depth: depth
      };
    }

    _makeFirefly() {
      return {
        x: Math.random() * this.w,
        y: this.h * 0.52 + Math.random() * this.h * 0.38,
        r: Math.random() * 2.8 + 1.4,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.32,
        a: 0,
        ta: Math.random() * 0.65 + 0.3,
        fs: Math.random() * 0.009 + 0.003,
        fd: 1,
        hOff: Math.random() * 18 - 4,
        life: 0,
        max: 220 + Math.random() * 420
      };
    }

    _readHue() {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--particle-hue");
      this.hue = parseInt(v, 10) || 42;
    }

    animate(now) {
      const dt = Math.min((now - this.lastTime) / 16.67, 3);
      this.lastTime = now;

      if (Math.random() < 0.01) this._readHue();

      this.ctx.clearRect(0, 0, this.w, this.h);
      const h = this.hue;

      // Gold dust
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.y -= p.vy * dt;
        p.phase += p.wobble * dt;
        p.x += p.vx * dt + Math.sin(p.phase) * 0.16;

        if (p.y < -12 || p.x < -22 || p.x > this.w + 22) {
          this.particles[i] = this._makeDust(false);
          continue;
        }

        const flicker = 0.82 + 0.18 * Math.sin(p.phase * 3.2);
        const a = p.a * flicker;

        // Bokeh glow for larger particles
        if (p.r > 1.4) {
          const g = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
          g.addColorStop(0, "hsla(" + h + ",78%,72%," + (a * 0.55) + ")");
          g.addColorStop(0.5, "hsla(" + h + ",75%,65%," + (a * 0.15) + ")");
          g.addColorStop(1, "hsla(" + h + ",70%,60%,0)");
          this.ctx.beginPath();
          this.ctx.fillStyle = g;
          this.ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          this.ctx.fill();
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = "hsla(" + h + ",85%,82%," + a + ")";
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Fireflies
      for (let i = 0; i < this.fireflies.length; i++) {
        const f = this.fireflies[i];
        f.life += dt;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        f.a += f.fd * f.fs * dt;

        if (f.a >= f.ta) { f.a = f.ta; f.fd = -1; }
        if (f.a <= 0) f.a = 0;

        if (f.life > f.max || f.x < -24 || f.x > this.w + 24 || f.y < 0 || f.y > this.h + 24) {
          this.fireflies[i] = this._makeFirefly();
          continue;
        }

        if (f.a < 0.04) continue;
        const fh = h + f.hOff;

        const g = this.ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 4.5);
        g.addColorStop(0, "hsla(" + fh + ",88%,74%," + (f.a * 0.55) + ")");
        g.addColorStop(0.4, "hsla(" + fh + ",82%,62%," + (f.a * 0.18) + ")");
        g.addColorStop(1, "hsla(" + fh + ",78%,55%,0)");
        this.ctx.beginPath();
        this.ctx.fillStyle = g;
        this.ctx.arc(f.x, f.y, f.r * 4.5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.fillStyle = "hsla(" + fh + ",92%,86%," + f.a + ")";
        this.ctx.arc(f.x, f.y, f.r * 0.55, 0, Math.PI * 2);
        this.ctx.fill();
      }

      requestAnimationFrame(t => this.animate(t));
    }
  }

  return AmbientParticles;
})();
