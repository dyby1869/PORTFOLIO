// SHRED CURSOR
const cursor = document.getElementById("shred-cursor");
const cursorImg = cursor.querySelector("img");
const trailContainer = document.getElementById("trail-container");

let flipTween;
let holdTimeout;
let isHolding = false;
let trailEnabled = false; // ✅ added global toggle

// Move cursor & spawn trail
document.addEventListener("mousemove", (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: "power3.out"
  });

  if (!trailEnabled) return;

  const dot = document.createElement("div");
  dot.classList.add("trail-dot");
  trailContainer.appendChild(dot);

  dot.style.left = `${e.clientX}px`;
  dot.style.top = `${e.clientY}px`;

  gsap.to(dot, {
    duration: 0.6,
    opacity: 0,
    scale: 0.5,
    x: gsap.utils.random(-4, 4),
    y: gsap.utils.random(4, 12),
    ease: "power1.out",
    onComplete: () => dot.remove()
  });
});

// Hold or click to rotate
document.addEventListener("mousedown", () => {
  isHolding = false;
  holdTimeout = setTimeout(() => {
    isHolding = true;
    flipTween = gsap.to(cursorImg, {
      rotation: "+=360",
      duration: 0.8,
      ease: "none",
      repeat: -1
    });
  }, 150);
});

document.addEventListener("mouseup", () => {
  clearTimeout(holdTimeout);

  if (isHolding && flipTween) {
    flipTween.kill();
    gsap.set(cursorImg, { rotation: 0 });
  } else {
    gsap.fromTo(cursorImg, {
      rotation: 0
    }, {
      rotation: 360,
      duration: 1,
      ease: "power2.inOut"
    });
  }
});


// ✅ Ensure shred cursor is shown + trail enabled immediately on non-home pages
if (!document.body.classList.contains("home")) {
  gsap.set("#shred-cursor", { opacity: 1 });
  trailEnabled = true;
}


// Subtle shaka brah animation
gsap.to(".shaka", {
  rotate: 15,
  y: -2,
  duration: 0.3,
  ease: "sine.inOut",
  yoyo: true,
  repeat: -1,
  repeatDelay: 2.5,
  delay: 2,
  onRepeat: function () {
    const tl = gsap.timeline();
    tl.to(".shaka", {
      rotate: gsap.utils.random(10, 20),
      y: gsap.utils.random(-3, 0),
      duration: 0.25,
      ease: "sine.inOut"
    }).to(".shaka", {
      rotate: 0,
      y: 0,
      duration: 0.25,
      ease: "sine.inOut"
    });
  }
});


// mobile menu
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-link-container');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Toggle icon text
    if (navLinks.classList.contains('active')) {
      menuToggle.textContent = '✕'; // or '×' (U+00D7)
    } else {
      menuToggle.textContent = '☰';
    }
  });
}


