/**
 * DAEMON RETICLE CURSOR
 * DaemonSoftworks portfolio — euripidecarpio.neocities.org
 *
 * HOW TO USE:
 *   1. Upload this file to your Neocities alongside your HTML
 *   2. Add this ONE line just before </body> in every page:
 *
 *        <script src="cursor.js"></script>
 *
 *   That's it. No other changes to your HTML or CSS needed.
 *
 * WHAT IT DOES:
 *   - Replaces the system cursor with a red SVG reticle (crosshair + center square)
 *   - On links / buttons: reticle rotates 45° and grows (crosshair becomes an X)
 *   - On click: reticle shrinks for tactile feedback, snaps back on release
 *   - On touchscreens: does nothing (touch devices don't have a cursor)
 *   - Hides cleanly when the mouse leaves the browser window
 */

(function () {

  // ─── GUARD: skip on touch-only devices (phones / tablets) ─────────────────
  // "hover: none" means the device has no hover capability (i.e. no mouse).
  // This prevents the script from running on mobile where it would do nothing.
  if (window.matchMedia('(hover: none)').matches) return;


  // ─── INJECT CSS ────────────────────────────────────────────────────────────
  // We create a <style> tag from JS so this file is 100% self-contained.
  // You don't need to touch your stylesheet at all.

  const style = document.createElement('style');

  style.textContent = `

    /* Hide the browser's default cursor everywhere on the page.
       !important overrides any element-specific cursor rules (e.g. cursor: text
       on inputs, cursor: pointer on links — we handle those ourselves below). */
    * { cursor: none !important; }

    /* The cursor container div */
    #daemon-cursor {
      position: fixed;               /* always relative to the viewport, not the page */
      top: 0;
      left: 0;
      width: 24px;
      height: 24px;
      pointer-events: none;          /* CRITICAL: the cursor div must never block clicks */
      transform: translate(-50%, -50%);  /* center the SVG on the exact mouse tip */
      z-index: 99999;                /* always on top of every other element */

      color: #e01010;                /* the SVG uses "currentColor", so this controls
                                       the reticle color — change it here to restyle */
      opacity: 0;                    /* starts invisible; fades in on first mouse move */

      transition:
        transform 0.12s ease,        /* smooth scale + rotate animations */
        color     0.10s ease,
        opacity   0.20s ease;
    }

    /* Revealed once the mouse moves for the first time */
    #daemon-cursor.is-active {
      opacity: 1;
    }

    /* Hovering over a link or button:
       - rotates 45° → the crosshair arms become diagonal, forming an X
       - scales up to 1.5× for a "targeting" feel
       - color brightens slightly */
    #daemon-cursor.is-hovering {
      color: #ff3333;
      transform: translate(-50%, -50%) scale(1.5) rotate(45deg);
    }

    /* Clicking: cursor compresses so the click feels physical */
    #daemon-cursor.is-clicking {
      transform: translate(-50%, -50%) scale(0.75);
    }

  `;

  document.head.appendChild(style);


  // ─── BUILD THE CURSOR ELEMENT ──────────────────────────────────────────────
  // The SVG draws the reticle: four crosshair arms with a 6px gap in the middle,
  // plus a 4×4 hollow square centered in that gap.
  //
  // All strokes use stroke="currentColor" — they inherit the CSS `color`
  // property from #daemon-cursor, so color changes in CSS automatically
  // recolor the entire SVG without touching the markup.

  const cursor = document.createElement('div');
  cursor.id = 'daemon-cursor';

  cursor.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

      <!-- Horizontal arm — left half (0 → 9, leaving a 6px gap at center) -->
      <line x1="0"  y1="12" x2="9"  y2="12"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>

      <!-- Horizontal arm — right half (15 → 24) -->
      <line x1="15" y1="12" x2="24" y2="12"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>

      <!-- Vertical arm — top half (0 → 9) -->
      <line x1="12" y1="0"  x2="12" y2="9"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>

      <!-- Vertical arm — bottom half (15 → 24) -->
      <line x1="12" y1="15" x2="12" y2="24"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>

      <!-- Hollow scan square — 4×4, centered at (12,12), sits inside the gap -->
      <rect x="10" y="10" width="4" height="4"
            fill="none" stroke="currentColor" stroke-width="1"/>

    </svg>
  `;

  document.body.appendChild(cursor);


  // ─── TRACK MOUSE POSITION ──────────────────────────────────────────────────
  // mousemove fires continuously as the mouse moves.
  // e.clientX / e.clientY = position relative to the top-left of the viewport.
  // Because we use `position: fixed`, these coordinates are exactly what we need.

  document.addEventListener('mousemove', function (e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    cursor.classList.add('is-active');   // reveal on first move
  });


  // ─── HIDE WHEN THE MOUSE LEAVES THE BROWSER WINDOW ────────────────────────

  document.addEventListener('mouseleave', function () {
    cursor.classList.remove('is-active');
  });

  document.addEventListener('mouseenter', function () {
    cursor.classList.add('is-active');
  });


  // ─── HOVER EFFECT ON INTERACTIVE ELEMENTS ─────────────────────────────────
  // Instead of attaching events to every single <a> and <button>, we use
  // *event delegation*: listen on the document and check if the hovered
  // element matches our selector using .closest().
  // This also works for elements added to the page dynamically later.

  const clickables = 'a, button, [role="button"], input, label, select, textarea';

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(clickables)) {
      cursor.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(clickables)) {
      cursor.classList.remove('is-hovering');
    }
  });


  // ─── CLICK FEEDBACK ────────────────────────────────────────────────────────

  document.addEventListener('mousedown', function () {
    cursor.classList.add('is-clicking');
  });

  document.addEventListener('mouseup', function () {
    cursor.classList.remove('is-clicking');
  });


})();
// The outer (function(){ ... })() is an IIFE — Immediately Invoked Function Expression.
// It runs instantly but keeps all variables (cursor, style, clickables...) private,
// so nothing leaks into the global scope and conflicts with your other JS files.
