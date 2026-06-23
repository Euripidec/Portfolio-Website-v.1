// ─── INTERSECTION OBSERVER (scroll-in animations) ───────────────────────────
// This watches every .hidden element and adds/removes the 'show' class
// as they scroll in and out of view
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});

// ─── BLOG DATA ───────────────────────────────────────────────────────────────
// When you write a new article, add it at the TOP of this array.
// The date controls the order — newest date shows first.
const BLOGS = [
  {
    title: "Queering the Map and the Power of Ordinary Ideas",
    description: "One of the most important queer sites on the web",
    image: "./images/qtm_sharing_image.BSL20I3q.jpg",
    url: "./blog-queering-the-map.html",
    date: "2026-06-22",
  },
  {
    title: "AI and Developers",
    description: "Is AI coming for my job?",
    image: "./images/AIvDevel.webp",
    url: "./blog-ai-and-developers.html",
    date: "2025-04-13",
  },
  {
    title: "The Indie Web",
    description: "Before the algorithm and before the platform",
    image: "./images/Indie Web.jpg",
    url: "./blog-indie-web.html",
    date: "2025-04-13",
  },
  {
    title: "Web Eras",
    description: "From Static Pages to Social Feeds",
    image: "./images/Web Eras.png",
    url: "./blog-web-eras.html",
    date: "2025-04-13",
  },
  {
    title: "The Legacy of Gainax",
    description: "Anime made through hardwork and guts!",
    image: "./images/GAINAX.webp",
    url: "./blog-gainax.html",
    date: "2025-04-13",
  },
];

const PREVIEW_COUNT = 4; // how many cards to show before "Show All"
let showingAll = false; // tracks if the user clicked "Show All"

function renderBlogs() {
  const container = document.querySelector(".blog .container");
  const btn = document.getElementById("show-all-btn");

  // Safety check — if the blog section doesn't exist on this page, stop here
  if (!container) return;

  // Sort by date, newest first.
  // [...BLOGS] makes a copy so we don't mutate the original array
  const sorted = [...BLOGS].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Decide how many to show based on whether the user clicked "Show All"
  const blogsToShow = showingAll ? sorted : sorted.slice(0, PREVIEW_COUNT);

  // Build all the card HTML as one big string, then inject it at once.
  // .map() loops over each blog object and returns a card string.
  // .join('') stitches them all together with no separator between cards.
  const html = blogsToShow
    .map((blog, index) => {
      // item-1, item-2, item-3, item-4 — cycles back after 4
      // This matches the class pattern your CSS already uses for card colours/styles
      const itemClass = `item-${(index % 4) + 1}`;

      return `
            <a href="${blog.url}">
                <div class="card ${itemClass} hidden">
                    <img src="${blog.image}" alt="${blog.title}" />
                    <div class="caption">
                        <span class="title">
                            <h3>${blog.title}</h3>
                        </span>
                        <p>${blog.description}</p>
                    </div>
                </div>
            </a>
        `;
    })
    .join("");

  // Inject all the cards into the page
  container.innerHTML = html;

  // IMPORTANT: The observer grabbed .hidden elements at page load,
  // but these cards didn't exist yet at that point.
  // So we manually tell the observer to watch each new card.
  container.querySelectorAll(".hidden").forEach((el) => observer.observe(el));


}



// ─── SLIDER ──────────────────────────────────────────────────────────────────
const slides = document.querySelectorAll(".slides .quote-card");
let slideIndex = 0;
let intervalId = null;

function initializeSlider() {
  if (slides.length === 0) return; // safety check — exit if no slides on page
  slides[slideIndex].classList.add("displaySlide");
  intervalId = setInterval(nextSlide, 5000);
}

function showSlide(index) {
  if (index >= slides.length) {
    slideIndex = 0;
  } else if (index < 0) {
    slideIndex = slides.length - 1;
  }
  slides.forEach((slide) => {
    slide.classList.remove("displaySlide");
  });
  slides[slideIndex].classList.add("displaySlide");
}

function prevSlide() {
  slideIndex--;
  showSlide(slideIndex);
  clearInterval(intervalId);
}

function nextSlide() {
  slideIndex++;
  showSlide(slideIndex);
}

// ─── ON PAGE LOAD ─────────────────────────────────────────────────────────────
// Everything inside here runs once the page HTML is fully ready
document.addEventListener("DOMContentLoaded", () => {
  // 1. Render the blog cards FIRST — they need to exist before step 2
  renderBlogs();

  // 2. Now grab ALL .hidden elements on the page, including the blog cards
  //    we just created in step 1, and tell the observer to watch them
  const hiddenElements = document.querySelectorAll(".hidden");
  hiddenElements.forEach((el) => observer.observe(el));

  // 3. Start the testimonial slider
  initializeSlider();
});

// ─── FAQ ACCORDION ────────────────────────────────────────────────────────────
const accordionHeaders = document.querySelectorAll(".accordion-header");
const accordionContents = document.querySelectorAll(".accordion-content");

accordionHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    const accordionItem = header.parentElement;
    const accordionContent = accordionItem.querySelector(".accordion-content");
    const accordionHeader = accordionItem.querySelector(".accordion-header");

    accordionContents.forEach((content) => {
      if (content !== accordionContent) {
        content.classList.remove("active");
        content.style.maxHeight = "0";
      }
    });

    accordionHeaders.forEach((header) => {
      if (header !== accordionHeader) {
        header.classList.remove("active");
      }
    });

    accordionContent.classList.toggle("active");
    header.classList.toggle("active");

    if (accordionContent.classList.contains("active")) {
      accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
    } else {
      accordionContent.style.maxHeight = "0";
    }
  });
});


const canvas = document.getElementById("sparkle-canvas");
const ctx = canvas.getContext("2d");

let particles = [];

// Match canvas sizing to window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const codeSymbols = [
  "λ",
  "✦",
  "{}",
  "</>",
  "01",
  "=>",
  "[]",
  "()",
  "∞",
  "⊕",
  "⊗"
];

// Particle Blueprints
class CodeParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.char =
      codeSymbols[Math.floor(Math.random() * codeSymbols.length)];

    this.size = Math.random() * 10 + 10;

    this.speedX = (Math.random() - 0.5) * 1.2;

    // float upward like magical code
    this.speedY = Math.random() * 2 + 1;

    this.opacity = 1;
    this.fadeSpeed = Math.random() * 0.015 + 0.01;

    this.rotation = (Math.random() - 0.5) * 0.3;
    this.angle = 0;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    this.angle += this.rotation;

    this.opacity -= this.fadeSpeed;
  }

  draw() {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.globalAlpha = this.opacity;

    ctx.fillStyle = "#ffffff";

    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(255,255,255,0.8)";

    ctx.font = `${this.size}px Orbitron`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(this.char, 0, 0);

    ctx.restore();
  }
}

// Track mouse moving across screen (No click required)
window.addEventListener("mousemove", (e) => {
  // Spawn 2 particles per mouse move increment for a dense but elegant trail
  if (Math.random() < 0.2)  {
    particles.push(new CodeParticle(e.clientX, e.clientY));
  }
});

// Animation engine loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    // Clean up invisible particles to prevent browser lagging
    if (particles[i].opacity <= 0) {
      particles.splice(i, 1);
      i--;
    }
  }
  requestAnimationFrame(animate);
}
animate();