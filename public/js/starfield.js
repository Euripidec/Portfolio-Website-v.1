/**
 * TWINKLING STARFIELD BACKGROUND
 * DaemonSoftworks portfolio — euripidecarpio.neocities.org
 *
 * HOW TO USE:
 *   1. Upload this file to your Neocities alongside your HTML
 *   2. Add this ONE line in the <head> (or before </body>) of every page:
 *
 *        <script defer src="./js/starfield.js"></script>
 *
 *   That's it. No HTML or CSS changes needed — the canvas and its
 *   styling are created and injected by this script.
 *
 * WHAT IT DOES:
 *   - Draws a fixed, full-viewport canvas behind all page content
 *   - Scatters a field of small stars across it
 *   - Each star pulses its own opacity on a sine wave, so the whole
 *     field twinkles gently without ever fully going dark
 *   - Re-scatters the stars whenever the window is resized
 */

(function () {

  // ─── INJECT CSS ────────────────────────────────────────────────────────────
  const style = document.createElement('style');

  style.textContent = `
    #starfield-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;  /* never blocks clicks on real content */
      z-index: -1;           /* sits behind the page, in front of the body background */
    }
  `;

  document.head.appendChild(style);


  // ─── BUILD THE CANVAS ──────────────────────────────────────────────────────
  // Prepended so it's the first child of <body> — keeps it out of the way of
  // any markup that relies on :first-child / nth-child selectors elsewhere.

  const canvas = document.createElement('canvas');
  canvas.id = 'starfield-canvas';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');


  // ─── STAR FIELD ─────────────────────────────────────────────────────────────

  const STAR_COUNT = 160;
  let stars = [];

  function scatterStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.1 + 0.3,
        baseAlpha: Math.random() * 0.4 + 0.25,
        // how fast (rad/ms) and at what offset each star pulses —
        // randomized per-star so the field doesn't twinkle in unison
        twinkleSpeed: Math.random() * 0.0022 + 0.0006,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    scatterStars();
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();


  // ─── ANIMATION LOOP ─────────────────────────────────────────────────────────

  function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const star of stars) {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.phase);
      const alpha = Math.max(0, Math.min(1, star.baseAlpha + twinkle * 0.5));

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

})();
