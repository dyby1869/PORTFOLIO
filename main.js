// =============================================================================
//  DYLAN BYARS PORTFOLIO — main.js
//  All JavaScript for the site in one place.
//
//  SECTIONS:
//  1.  GLOBAL — GSAP Plugin Registration
//  2.  GLOBAL — Custom Shred Cursor
//  3.  GLOBAL — Mobile Navigation Menu
//  4.  GLOBAL — Shaka Animation
//  5.  GLOBAL — goToSlide (Storm slider onclick attributes)
//  6.  GLOBAL — Scroll Reveals (runs on all pages)
//  7.  HOME   — Hero Load Sequence
//  8.  HOME   — Hero Button Interaction (Fancy Button / Typed Text)
//  9.  HOME   — Scroll Animations (Cards, Recent Work, Projects & Ambitions)
//  10. ABOUT  — Card Scroll Animations + Read More Toggle
//  11. WORK PAGES — Hero Text Animation (shared: pockets + storm)
//  12. POCKETS  — Scroll Section Animations
//  13. POCKETS  — Flow Toggle (Old / New)
//  14. STORM  — Scroll Section Animations
//  15. STORM  — Image Modal
//  16. STORM  — Sliders
// =============================================================================


// =============================================================================
//  1. GLOBAL — GSAP Plugin Registration
// =============================================================================

gsap.registerPlugin(ScrollTrigger);
if (document.body.classList.contains("home")) {
  gsap.registerPlugin(MotionPathPlugin);
}


// =============================================================================
//  2. GLOBAL — Custom Shred Cursor
// =============================================================================

const cursor = document.getElementById("shred-cursor");
const cursorImg = cursor.querySelector("img");
const trailContainer = document.getElementById("trail-container");

let flipTween;
let holdTimeout;
let isHolding = false;
let trailEnabled = false;

// Move cursor & spawn trail dots
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

// Hold to spin continuously; click to do a single flip
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
    gsap.fromTo(cursorImg, { rotation: 0 }, {
      rotation: 360,
      duration: 1,
      ease: "power2.inOut"
    });
  }
});

// On non-home pages show the cursor + trail immediately (no load sequence delay)
document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("home")) {
    gsap.set("#shred-cursor", { opacity: 1 });
    trailEnabled = true;
  }
});


// =============================================================================
//  3. GLOBAL — Mobile Navigation Menu
// =============================================================================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-link-container");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuToggle.textContent = navLinks.classList.contains("active") ? "✕" : "☰";
  });
}


// =============================================================================
//  4. GLOBAL — Shaka Emoji Animation
// =============================================================================

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


// =============================================================================
//  5. GLOBAL — goToSlide (Storm sliders use inline onclick attributes)
//  Must be global so onclick="goToSlide(...)" in the HTML can reach it.
// =============================================================================

function goToSlide(trackId, dotsId, index) {
  const track = document.getElementById(trackId);
  const dots = document.querySelectorAll(`#${dotsId} .dot`);
  track.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach(d => d.classList.remove("active"));
  dots[index].classList.add("active");
}


// =============================================================================
//  6. GLOBAL — Scroll Reveals
//  Consistent fade/slide-in animations across all pages.
//  Skips home hero (portal animation handles that separately).
//  Each selector animates independently as it enters the viewport.
// =============================================================================

window.addEventListener("load", () => {
  ScrollTrigger.refresh();

  const isHome = document.body.classList.contains("home");

  // Helper — creates a standard scroll reveal for any set of elements
  function reveal(selector, vars = {}, triggerEl = null) {
    const els = gsap.utils.toArray(selector);
    if (!els.length) return;

    const defaults = {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: "power2.out"
    };

    els.forEach(el => {
      gsap.from(el, {
        ...defaults,
        ...vars,
        scrollTrigger: {
          trigger: triggerEl || el,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    });
  }

  // Helper — stagger reveal for a group of children
  function revealGroup(parentSelector, childSelector, vars = {}) {
    const parents = gsap.utils.toArray(parentSelector);
    if (!parents.length) return;

    parents.forEach(parent => {
      const children = parent.querySelectorAll(childSelector);
      if (!children.length) return;

      gsap.from(children, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.12,
        ...vars,
        scrollTrigger: {
          trigger: parent,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
    });
  }

  // --- H2 headings (skip home hero h2) ---
  gsap.utils.toArray("h2").forEach(el => {
    // Skip home hero text — that's handled by the portal sequence
    if (isHome && el.closest(".hero-container")) return;
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // --- H3 headings (skip home hero) ---
  gsap.utils.toArray("h3").forEach(el => {
    if (isHome && el.closest(".hero-container")) return;
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // --- Section labels (work pages) ---
  reveal(".section-label", { y: 20, duration: 0.6 });

  // --- Blockquotes ---
  reveal("blockquote", { y: 25, duration: 0.7 });

  // --- Label callouts (storm) ---
  reveal(".label-callout", { x: -20, y: 0, duration: 0.6 });

  // --- Group titles (home services section) ---
  reveal(".group-title", { y: 20, duration: 0.5 });

  // --- Numbered list items — stagger per list ---
  revealGroup(".numbered-list", ".numbered-list__item", { x: -20, y: 0, stagger: 0.1 });

  // --- Content tables ---
  reveal(".content-table", { y: 30, duration: 0.7 });

  // --- Clickable images — stagger per grid/container ---
  gsap.utils.toArray(".clickable-img").forEach((img, i) => {
    gsap.from(img, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power2.out",
      delay: (i % 4) * 0.1, // natural stagger within rows of up to 4
      scrollTrigger: {
        trigger: img,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // --- Work hero text (pockets + storm big title) ---
  reveal(".work-hero-text", { y: 40, duration: 0.9 });

  // --- Cards — every .grid on every page, each grid independently ---
  gsap.utils.toArray(".grid").forEach(grid => {
    const cards = grid.querySelectorAll(".card");
    if (!cards.length) return;
    gsap.set(cards, { opacity: 0, y: 40 });
    gsap.to(cards, {
      scrollTrigger: { trigger: grid, start: "top 80%", toggleActions: "play none none reverse" },
      opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.12
    });
  });

});


// =============================================================================
//  7. HOME — Hero Load Sequence
// =============================================================================

if (document.body.classList.contains("home")) {

  window.addEventListener("load", () => {
    const tl = gsap.timeline();

    tl.to(".portal", {
      scaleY: 1,
      opacity: 1,
      filter: "blur(5px)",
      duration: 1,
      ease: "power2.out"
    });

    tl.to(".portal", {
      scaleX: 1,
      filter: "blur(0px)",
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.4");

    tl.set(".portal-rays", { opacity: 0, scaleY: 0.6 });

    tl.to(".portal-rays", {
      opacity: 1,
      scaleY: 1,
      duration: 1.2,
      ease: "power2.out"
    }, "-=0.6");

    // Profile rises up
    tl.fromTo(".portal-profile", { y: 80 }, {
      y: 0,
      duration: 1.2,
      ease: "power2.out"
    }, "-=1.1");

    tl.fromTo(".portal-profile", { opacity: 0 }, {
      opacity: 1,
      duration: 0.8,
      ease: "power1.out"
    }, "-=0.9");

    // Glow beam
    tl.to(".portal-glow", {
      opacity: 1,
      scaleY: 1.3,
      filter: "blur(10px)",
      duration: 1,
      ease: "power1.out"
    }, "-=0.9");

    tl.fromTo(".hero-content", {
      y: -100,
      scale: 0.8,
      opacity: 0
    }, {
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out"
    }, "-=0.2");

    tl.to("#shred-cursor", {
      opacity: 1,
      duration: 0.3,
      ease: "power1.out"
    });

    tl.fromTo(".nav-bar", { opacity: 0, y: -20 }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.6");

    tl.fromTo(".btn-cta", { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "+=1.8");

    tl.to("#fancyButton", {
      scale: 1.1,
      yoyo: true,
      repeat: 3,
      duration: 0.3,
      ease: "power1.inOut"
    });

    // Enable snow trail after intro sequence finishes
    tl.call(() => { trailEnabled = true; });

    // Individual beam pulses (energy surge effect)
    gsap.utils.toArray(".beam").forEach((beam) => {
      gsap.to(beam, {
        opacity: () => gsap.utils.random(0.2, 1),
        duration: () => gsap.utils.random(0.4, 1),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: gsap.utils.random(0, 1)
      });
    });

  });

}


// =============================================================================
//  8. HOME — Hero Button Interaction (Fancy Button / Typed Text)
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {
  const fancyButton = document.getElementById("fancyButton");
  if (!fancyButton) return;

  const heroText1 = document.getElementById("heroText1");
  const heroText2 = document.getElementById("heroText2");
  const typedText = document.getElementById("typedText");
  const portalProfile = document.querySelector(".portal-profile");
  const portalGlow = document.querySelector(".portal-glow");
  const bgShift = document.querySelector(".bg-shift");

  fancyButton.addEventListener("click", () => {
    gsap.to(heroText1, { opacity: 0, duration: 0.6, onComplete: () => heroText1.style.display = "none" });
    gsap.to(fancyButton, { opacity: 0, duration: 0.6, onComplete: () => fancyButton.style.display = "none" });

    const tl = gsap.timeline();

    tl.to(portalGlow, {
      scaleY: 1.4,
      opacity: 1,
      filter: "blur(15px)",
      duration: 0.8,
      ease: "power2.inOut"
    });

    tl.to(portalProfile, { y: -20, duration: 0.8, ease: "power2.inOut" }, "<");
    tl.to(bgShift, { opacity: 1, duration: 1.2, ease: "power1.inOut" }, "<");
    tl.set(heroText2, { display: "block" });
    tl.to(heroText2, { opacity: 1, duration: 0.6 }, "-=0.4");

    tl.call(() => {
      const message = "I bring ideas to life through motion, detail, and interaction.";
      typedText.textContent = "";
      let i = 0;

      const typeInterval = setInterval(() => {
        typedText.textContent += message[i];
        i++;

        if (i === message.length) {
          clearInterval(typeInterval);

          gsap.to(portalGlow, {
            scaleY: 1.6,
            opacity: 1,
            duration: 0.6,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
          });

          gsap.to(portalProfile, {
            y: -25,
            duration: 0.6,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut"
          });

          const seeWork = document.createElement("a");
          seeWork.textContent = "See My Work →";
          seeWork.href = "#recent-work";
          seeWork.classList.add("button", "btn-cta", "see-work");
          gsap.set(seeWork, { opacity: 0, y: 20, scale: 0.92 });
          heroText2.insertAdjacentElement("afterend", seeWork);
          gsap.to(seeWork, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            delay: 0.4,
            ease: "power3.out"
          });
        }
      }, 35);
    });
  });
});


// =============================================================================
//  9. HOME — Scroll Animations (Cards, Recent Work, Projects & Ambitions)
// =============================================================================

window.addEventListener("load", () => {
  if (!document.body.classList.contains("home")) return;

  ScrollTrigger.refresh();

  // Recent Work section
  if (document.getElementById("recent-work")) {
    gsap.from("#recent-work", {
      scrollTrigger: {
        trigger: "#recent-work",
        start: "top 65%",
        end: "top 20%",
        scrub: true
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out"
    });
  }

  // Projects & Ambitions section
  if (document.getElementById("projects-ambitions")) {
    gsap.from("#projects-ambitions", {
      scrollTrigger: {
        trigger: "#projects-ambitions",
        start: "top 65%",
        end: "top 20%",
        scrub: true
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out"
    });
  }
});


// =============================================================================
//  10. ABOUT — Card Scroll Animations + Read More Toggle
// =============================================================================

if (document.body.classList.contains("about")) {

  window.addEventListener("load", () => {
    const toggleBtn = document.getElementById("about-toggle");
    const extraContent = document.getElementById("about-extra");

    if (toggleBtn && extraContent) {
      toggleBtn.addEventListener("click", () => {
        const isVisible = extraContent.style.display === "block";
        extraContent.style.display = isVisible ? "none" : "block";
        toggleBtn.textContent = isVisible ? "Continue Reading" : "Show Less";
        ScrollTrigger.refresh();
      });
    }

    ScrollTrigger.refresh();
  });

}


// =============================================================================
//  11. WORK PAGES — Hero Text Animation
//  Shared between pockets + storm via .page-headline / .page-headline-section
//  Fades in on scroll, then shifts to brand yellow as you continue scrolling.
// =============================================================================

function initWorkHeroText(selector, triggerSelector) {
  const el = document.querySelector(selector);
  if (!el) return;

  gsap.set(el, { opacity: 0, color: "#ffffff" });

  // Fade in
  gsap.to(el, {
    opacity: 1,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: triggerSelector,
      start: "top 65%",
      toggleActions: "play none none reverse"
    }
  });

  // Color shift to brand yellow
  gsap.to(el, {
    color: "#FFE77C",
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: triggerSelector,
      start: "top 55%",
      end: "top 25%",
      scrub: true
    }
  });
}

window.addEventListener("load", () => {
  initWorkHeroText(".page-headline", ".page-headline-section");
});


// =============================================================================
//  12. POCKETS — Scroll Section Animations
// =============================================================================

if (document.body.classList.contains("pockets")) {

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();

    // Click-to-enlarge image modal
    const modal = document.createElement("div");
    modal.classList.add("image-modal");
    document.body.appendChild(modal);

    document.querySelectorAll(".clickable-img").forEach(img => {
      img.addEventListener("click", () => {
        const enlarged = document.createElement("img");
        enlarged.src = img.src;
        enlarged.alt = img.alt;
        modal.innerHTML = "";
        modal.appendChild(enlarged);
        modal.classList.add("show");
        document.body.style.overflow = "hidden";
      });
    });

    modal.addEventListener("click", () => {
      modal.classList.remove("show");
      modal.innerHTML = "";
      document.body.style.overflow = "";
    });

    // Red routes section
    const tlRedRoutes = gsap.timeline({
      scrollTrigger: { trigger: ".red-routes", start: "top 75%", toggleActions: "play none none reverse" }
    });
    tlRedRoutes
      .from(".red-routes .section-label", { opacity: 0, y: 30, duration: 0.6, ease: "power2.out" })
      .from(".red-routes p", { opacity: 0, y: 20, duration: 0.5, ease: "power2.out" }, "-=0.4")
      .from(".red-routes .toggle-buttons", { opacity: 0, y: 20, duration: 0.5, ease: "power2.out" }, "-=0.3")
      .from(".red-routes .flow-gallery img", { opacity: 0, y: 30, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.4");

  }); // end window load


  // ===========================================================================
  //  13. POCKETS — Flow Toggle (Old / New wireflows)
  // ===========================================================================

  window.addEventListener("load", () => {
    const toggleOldBtn = document.getElementById("toggle-old");
    const toggleNewBtn = document.getElementById("toggle-new");
    const oldFlows = document.getElementById("old-flows");
    const newFlows = document.getElementById("new-flows");

    if (toggleOldBtn && toggleNewBtn && oldFlows && newFlows) {
      toggleOldBtn.addEventListener("click", () => {
        oldFlows.style.display = "grid";
        newFlows.style.display = "none";
        toggleOldBtn.classList.add("active");
        toggleNewBtn.classList.remove("active");
      });

      toggleNewBtn.addEventListener("click", () => {
        oldFlows.style.display = "none";
        newFlows.style.display = "grid";
        toggleNewBtn.classList.add("active");
        toggleOldBtn.classList.remove("active");
      });
    }
  });

} // end pockets block


// =============================================================================
//  14. STORM — Scroll Section Animations
// =============================================================================

if (document.body.classList.contains("storm")) {

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();

    // Transformation text slide in from sides
    gsap.from(".transformation-text-left", {
      x: -100, opacity: 0, duration: 0.8, ease: "power2.out",
      scrollTrigger: { trigger: ".transformation-text-left", start: "top 60%", toggleActions: "play none none reverse" }
    });

    gsap.from(".transformation-text-right", {
      x: 100, opacity: 0, duration: 0.8, ease: "power2.out",
      scrollTrigger: { trigger: ".transformation-text-right", start: "top 60%", toggleActions: "play none none reverse" }
    });

    // Strategy cards
    gsap.set("#VisionStrategyGoals .card", { opacity: 0, y: 50 });
    gsap.to("#VisionStrategyGoals .card", {
      scrollTrigger: {
        trigger: "#VisionStrategyGoals",
        start: "top 60%",
        toggleActions: "play none none reverse"
      },
      opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.15
    });

  }); // end window load


  // ===========================================================================
  //  15. STORM — Image Modal (click to enlarge .clickable-img)
  // ===========================================================================

  const stormModal = document.createElement("div");
  stormModal.classList.add("image-modal");
  document.body.appendChild(stormModal);

  // Delegated listener so dynamically loaded images are also covered
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".clickable-img");
    if (!img) return;

    const enlarged = document.createElement("img");
    enlarged.src = img.src;
    enlarged.alt = img.alt;
    stormModal.innerHTML = "";
    stormModal.appendChild(enlarged);
    stormModal.classList.add("show");
    document.body.style.overflow = "hidden";
  });

  stormModal.addEventListener("click", () => {
    stormModal.classList.remove("show");
    stormModal.innerHTML = "";
    document.body.style.overflow = "";
  });


  // ===========================================================================
  //  16. STORM — Sliders
  //  Dot buttons use inline onclick="goToSlide(...)" — handled by section 5.
  // ===========================================================================

} // end storm block