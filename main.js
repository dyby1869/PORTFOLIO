// =============================================================================
//  DYLAN BYARS PORTFOLIO — main.js
//  All JavaScript for the site in one place.
//
//  SECTIONS:
//  1.  GLOBAL — GSAP Plugin Registration
//  2.  GLOBAL — Custom Shred Cursor
//  3.  GLOBAL — Navigation Inject (nav.html — single source of truth)
//  4.  GLOBAL — Shaka Animation
//  5.  GLOBAL — goToSlide (Storm slider onclick attributes)
//  6.  GLOBAL — Scroll Reveals (runs on all pages)
//  7.  HOME   — Hero Load Sequence
//  8.  HOME   — Hero Button Interaction (Fancy Button / Typed Text)
//  9.  HOME   — Scroll Animations (Cards, Recent Work, Projects & Ambitions)
//  10. ABOUT  — Hero Entrance Animation + Parallax + Read More Toggle
//  11. WORK PAGES — Hero Text Animation (shared: pockets + storm)
//  12. POCKETS  — Scroll Section Animations
//  13. POCKETS  — Flow Toggle (Old / New)
//  14. STORM  — Scroll Section Animations
//  15. STORM  — Back to Top Button
//  16. STORM  — Image Modal
//  17. STORM  — Sliders
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

document.addEventListener("contextmenu", () => {
  clearTimeout(holdTimeout);
  if (flipTween) {
    flipTween.kill();
    gsap.set(cursorImg, { rotation: 0 });
  }
  isHolding = false;
});

// After your existing mouseup listener, add:

// Stop spinning if the window/tab loses focus (e.g. DevTools opens)
window.addEventListener("blur", () => {
  clearTimeout(holdTimeout);
  if (flipTween) {
    flipTween.kill();
    gsap.set(cursorImg, { rotation: 0 });
  }
  isHolding = false;
});

// On non-home pages show the cursor + trail immediately (no load sequence delay)
document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("home")) {
    gsap.set("#shred-cursor", { opacity: 1 });
    trailEnabled = true;
  }
});


// =============================================================================
//  3. GLOBAL — Navigation Inject
// =============================================================================

document.addEventListener("DOMContentLoaded", () => {
  const isHome = document.body.classList.contains("home");

  fetch("nav.html")
    .then(res => res.text())
    .then(html => {
      const navBar = document.querySelector(".nav-bar");
      if (!navBar) return;
      navBar.outerHTML = html;

      // Re-init menu toggle after inject since the element was replaced
      const menuToggle = document.querySelector(".menu-toggle");
      const navLinks = document.querySelector(".nav-link-container");
      if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
          navLinks.classList.toggle("active");
          menuToggle.textContent = navLinks.classList.contains("active") ? "✕" : "☰";
        });
      }

      // On the home page the nav starts hidden (opacity:0 in CSS) and GSAP
      // fades it in during the hero sequence — but only if it exists in the DOM
      // when that timeline runs. Signal that the nav is ready.
      if (isHome) {
        document.dispatchEvent(new Event("nav:ready"));
      }
    })
    .catch(() => {
      const menuToggle = document.querySelector(".menu-toggle");
      const navLinks = document.querySelector(".nav-link-container");
      if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
          navLinks.classList.toggle("active");
          menuToggle.textContent = navLinks.classList.contains("active") ? "✕" : "☰";
        });
      }
      if (isHome) document.dispatchEvent(new Event("nav:ready"));
    });
});


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
    if (el.classList.contains("equinox-copy-2")) return;
    if (el.closest(".level-highlight")) return;
    if (el.classList.contains("vengeance-title")) return;
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
    if (el.classList.contains("spi-lab-copy")) return;
    if (el.closest(".level-highlight")) return;
    if (el.classList.contains("vengeance-title")) return;
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
  // Contributions section labels are stacked tight — handled separately in storm block
  gsap.utils.toArray(".section-label").forEach(el => {
    if (el.closest(".contributions-section")) return;
    gsap.from(el, {
      opacity: 0, y: 20, duration: 0.6, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none reverse" }
    });
  });

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

  // --- Reaction graph progress bars (shared across all product pages) ---
  document.querySelectorAll(".reaction-graph .progress-bar").forEach((bar) => {
    gsap.fromTo(
      bar.querySelectorAll(".active"),
      { opacity: 0, scaleX: 0, transformOrigin: "left center" },
      {
        opacity: 1, scaleX: 1, duration: 0.5, stagger: 0.1,
        scrollTrigger: { trigger: bar, start: "top 90%", end: "top 80%", scrub: true }
      }
    );
  });

  // --- Ball weight cards (shared across product pages) ---
  // Some .ui-card-containers are inside .scroll-content1 (horizontal scroller),
  // others sit directly in the flow. We handle both cases:
  // — If inside .scroll-content1, trigger on the scroller parent (has vertical position)
  // — If not, trigger on the container itself
  document.querySelectorAll(".ui-card-container").forEach((container) => {
    const cards = container.querySelectorAll(".ball-weight-card");
    if (!cards.length) return;
    const scroller = container.closest(".scroll-content1");
    const trigger = scroller || container;
    gsap.set(cards, { opacity: 0, y: 40 });
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: trigger,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
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

    // With this:
    tl.call(() => {
      const animateNav = () => {
        gsap.fromTo(".nav-bar", { opacity: 0, y: -20 }, {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out"
        });
      };
      // If nav is already injected, animate immediately; otherwise wait for it
      if (document.querySelector(".nav-bar header, header.nav-bar")) {
        animateNav();
      } else {
        document.addEventListener("nav:ready", animateNav, { once: true });
      }
    }, [], "-=0.6");

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
//  10. ABOUT — Hero Entrance Animation + Parallax + Read More Toggle
// =============================================================================

if (document.body.classList.contains("about")) {

  window.addEventListener("load", () => {

    // -------------------------------------------------------------------------
    // Entrance animation — photo rises up, text fades in, spans stagger in
    // -------------------------------------------------------------------------
    const heroImg = document.querySelector(".about-hero-image img");
    const heroCopy = document.querySelector(".about-hero-copy");
    const spans = document.querySelectorAll(".about-hero-copy h1 span");

    // Set initial states
    gsap.set(heroImg, { y: 120, opacity: 0 });
    gsap.set(heroCopy, { x: 60, opacity: 0 });
    gsap.set(spans, { opacity: 0, y: 20 });

    const tl = gsap.timeline({ delay: 0.3 });

    // Photo rises up
    tl.to(heroImg, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out"
    });

    // Text block slides in from right
    tl.to(heroCopy, {
      x: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    }, "-=0.7");

    // Colored spans pop in one by one
    tl.to(spans, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "back.out(1.4)",
      stagger: 0.15
    }, "-=0.5");


    // -------------------------------------------------------------------------
    // Parallax — photo moves slower than scroll, creating depth.
    // Uses fromTo with explicit y:0 start so it doesn't fight the entrance animation.
    // -------------------------------------------------------------------------
    gsap.fromTo(heroImg,
      { y: 0 },
      {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-hero-container",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      }
    );


    // -------------------------------------------------------------------------
    // Read More Toggle
    // -------------------------------------------------------------------------
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

    // -------------------------------------------------------------------------
    // Click-to-enlarge modal
    // -------------------------------------------------------------------------
    const aboutModal = document.createElement("div");
    aboutModal.classList.add("image-modal");
    document.body.appendChild(aboutModal);

    document.querySelectorAll(".clickable-img").forEach(img => {
      img.addEventListener("click", () => {
        const enlarged = document.createElement("img");
        enlarged.src = img.src;
        enlarged.alt = img.alt;
        aboutModal.innerHTML = "";
        aboutModal.appendChild(enlarged);
        aboutModal.classList.add("show");
        document.body.style.overflow = "hidden";
      });
    });

    aboutModal.addEventListener("click", () => {
      aboutModal.classList.remove("show");
      aboutModal.innerHTML = "";
      document.body.style.overflow = "";
    });

    ScrollTrigger.refresh();

  }); // end window load

} // end about block

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
        if (img.classList.contains("clickable-img--link")) return;
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

    // Contributions section labels — staggered off a single trigger since they're stacked tight
    gsap.from(".contributions-section .section-label", {
      opacity: 0, y: 20, duration: 0.6, ease: "power2.out", stagger: 0.3,
      scrollTrigger: {
        trigger: ".contributions-section",
        start: "top 60%",
        toggleActions: "play none none reverse"
      }
    });

  }); // end window load


  // ===========================================================================
  //  15. STORM — Back to Top Button
  //  Fixed floating button in bottom-right corner. Appears after scrolling
  //  600px and links back to #case-study-roadmap at the top of the page.
  // ===========================================================================

  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    ScrollTrigger.create({
      trigger: "#phase-research",
      start: "top 80%",
      onEnter: () => backToTop.classList.add("visible"),
      onLeaveBack: () => backToTop.classList.remove("visible")
    });
  }

  // ===========================================================================
  //  16. STORM — Image Modal (click to enlarge .clickable-img)
  // ===========================================================================

  const stormModal = document.createElement("div");
  stormModal.classList.add("image-modal");
  document.body.appendChild(stormModal);

  // Delegated listener so dynamically loaded images are also covered
  // Skips images with clickable-img--link class — those open a page via their anchor tag
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".clickable-img");
    if (!img) return;
    if (img.classList.contains("clickable-img--link")) return;

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
  //  17. STORM — Sliders
  //  Dot buttons use inline onclick="goToSlide(...)" — handled by section 5.
  // ===========================================================================

} // end storm block

// =============================================================================
//  18. LEVEL — Scroll Animations
//  Consolidated from inline scripts in level-web-page.html
// =============================================================================

if (document.body.classList.contains("level")) {

  // DrawSVG: Lab Series SVG paths
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof DrawSVGPlugin !== "undefined") {
      gsap.registerPlugin(DrawSVGPlugin);
      gsap.fromTo(
        ".lab-series-svg path",
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 2, ease: "power2.inOut", stagger: 0.2 }
      );
    }
  });

  // Button pop-in after 1s
  window.addEventListener("load", () => {
    setTimeout(() => {
      gsap.fromTo(
        ".button-pop",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
      );
    }, 1000);
  });

  // Bowling ball scrub on scroll
  document.addEventListener("DOMContentLoaded", () => {
    gsap.fromTo(".level-bowling-ball-1",
      { scale: 0.8, opacity: 0, rotation: -15 },
      {
        scale: 1, opacity: 1, rotation: 0, duration: 2, ease: "power2.out",
        scrollTrigger: {
          trigger: ".level-text-container",
          start: "top 40%", end: "bottom 30%", scrub: true
        }
      }
    );
  });

  // SPI Lab copy — responsive scrub
  window.addEventListener("load", () => {
    const mm = gsap.matchMedia();

    mm.add("(max-width: 425px)", () => {
      gsap.from(".spi-lab-copy", {
        y: 30, opacity: 0, stagger: 0.1, duration: 1, ease: "power2.out",
        scrollTrigger: { trigger: ".level-text-container", start: "top 30%", end: "bottom 30%", scrub: true }
      });
    });
    mm.add("(min-width: 426px) and (max-width: 768px)", () => {
      gsap.from(".spi-lab-copy", {
        y: 50, opacity: 0, stagger: 0.15, duration: 1, ease: "power2.out",
        scrollTrigger: { trigger: ".level-text-container", start: "top 30%", end: "bottom 20%", scrub: true }
      });
    });
    mm.add("(min-width: 769px) and (max-width: 1024px)", () => {
      gsap.from(".spi-lab-copy", {
        y: 50, opacity: 0, stagger: 0.15, duration: 1, ease: "power2.out",
        scrollTrigger: { trigger: ".level-text-container", start: "top 40%", end: "bottom 20%", scrub: true }
      });
    });
    mm.add("(min-width: 1025px)", () => {
      gsap.from(".spi-lab-copy", {
        y: 80, opacity: 0, stagger: 0.2, duration: 1.5, ease: "power2.out",
        scrollTrigger: { trigger: ".level-text-container", start: "top 60%", end: "bottom 20%", scrub: true }
      });
    });

    // Highlight section — h1 from left, h2 from right
    gsap.from(".level-highlight h1", {
      x: -50, opacity: 0, stagger: 0.3, duration: 1, ease: "power2.out",
      scrollTrigger: { trigger: ".level-highlight", start: "top 75%", end: "bottom 30%", toggleActions: "play none none reverse" }
    });
    gsap.from(".level-highlight h2", {
      x: 50, opacity: 0, stagger: 0.3, duration: 1, ease: "power2.out",
      scrollTrigger: { trigger: ".level-highlight", start: "top 75%", end: "bottom 30%", toggleActions: "play none none reverse" }
    });

    // Intro copy slides in from sides, ball fades up
    gsap.from(".level-copy-1", {
      x: -100, opacity: 0, duration: 1, ease: "power2.out",
      scrollTrigger: { trigger: ".level-intro", start: "top 70%", end: "bottom 30%", toggleActions: "play none none reverse" }
    });
    gsap.from(".level-copy-2", {
      x: 100, opacity: 0, duration: 1, ease: "power2.out",
      scrollTrigger: { trigger: ".level-intro", start: "top 70%", end: "bottom 30%", toggleActions: "play none none reverse" }
    });
    gsap.from(".level-bowling-ball-3 img", {
      scale: 0.8, opacity: 0, duration: 1.2, ease: "power2.out",
      scrollTrigger: { trigger: ".level-intro", start: "top 70%", end: "bottom 30%", toggleActions: "play none none reverse" }
    });

    // Ball 4 spins in from right
    gsap.from(".level-bowling-ball-4 img", {
      x: 300, rotation: 360, opacity: 0, duration: 1.5, ease: "power2.out",
      scrollTrigger: { trigger: ".level-cover", start: "top 70%", end: "bottom 20%", toggleActions: "play none none reverse" }
    });

    // Weightblock drops in from above
    gsap.from(".level-block", {
      y: -600, opacity: 0, duration: 1, ease: "power2.out",
      scrollTrigger: { trigger: ".level-weightblock-animation", start: "top 70%", end: "top 20%", scrub: true }
    });

    // Equalizer AI element
    gsap.from(".equalizer-ai", {
      y: -600, opacity: 0, duration: 1, ease: "power2.out",
      scrollTrigger: { trigger: ".equalizer-powered-by-ai", start: "top 70%", end: "top 20%", scrub: true }
    });

    // Tech spec cards
    gsap.from(".level-tech-specs .card", {
      y: 50, opacity: 0, duration: 0.5, stagger: 0.2, ease: "power2.out",
      scrollTrigger: { trigger: ".level-tech-specs", start: "top 75%", end: "bottom 25%", toggleActions: "play none none reverse" }
    });

  });

} // end level block


// =============================================================================
//  19. EMBER COVE — Scroll Animations
//  Consolidated from inline scripts in Ember-Cove.html
// =============================================================================

if (document.body.classList.contains("ember-cove")) {

  window.addEventListener("load", () => {
    const paths = gsap.utils.toArray("#headlineSVG path");

    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.stroke = "#fff";
      path.style.strokeWidth = 1;
      path.style.fill = "#fff";
      path.style.fillOpacity = 0;
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    });

    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".cove-ember-headline",
        start: "top 80%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(paths, { fillOpacity: 1, duration: 1, delay: 0.3, ease: "power1.inOut" });
        },
        onLeaveBack: () => {
          gsap.to(paths, { fillOpacity: 0, duration: 0.5, ease: "power1.out" });
        }
      }
    });

    gsap.set("#subheadSVG", { autoAlpha: 0, y: 50 });
    gsap.to("#subheadSVG", {
      autoAlpha: 1, y: 0, duration: 1, ease: "power2.out",
      scrollTrigger: { trigger: ".cove-ember-headline", start: "top 80%", toggleActions: "play none none reverse" }
    });
  });

} // end ember-cove block


// =============================================================================
//  20. TRIPLE THREAT — Scroll Animations
//  Consolidated from inline scripts in triple-threat.html
// =============================================================================

if (document.body.classList.contains("triple-threat")) {

  window.addEventListener("load", () => {

    // Hero SVG paths pop in on load
    gsap.from(".dual-threat-text-header svg path", {
      duration: 1, opacity: 0, scale: 0.8, stagger: 0.05, ease: "power2.out"
    });
    gsap.from(".dual-threat-destruction svg path", {
      duration: 1.2, opacity: 0, scale: 0.8, stagger: 0.05, ease: "power2.out", delay: 0.5
    });

    // Scroll arrow bounce
    gsap.to(".scroll-arrow", {
      y: -10, duration: 0.6, repeat: -1, yoyo: true, ease: "power1.inOut"
    });

    // Scroll-to-continue reveal
    gsap.set(".roto-scroll-to-continue", { display: "none" });
    gsap.to(".roto-scroll-to-continue", { display: "block", delay: 1 });

    // Stripes slide in from sides
    gsap.from(".stripe1", {
      xPercent: -100, ease: "none",
      scrollTrigger: { trigger: ".dominate-section", start: "top 80%", end: "top 50%", toggleActions: "play none none reverse" }
    });
    gsap.from(".stripe2", {
      xPercent: 100, ease: "none",
      scrollTrigger: { trigger: ".dominate-section", start: "top 80%", end: "top 50%", toggleActions: "play none none reverse" }
    });

    // Ball intro fades
    gsap.from(".threat-ball-intro h3", {
      opacity: 0, y: 50, duration: 1, ease: "power2.out",
      scrollTrigger: { trigger: ".threat-ball-intro", start: "top 80%", toggleActions: "play none none reverse" }
    });
    gsap.from([".rockstar", ".hyperdrive"], {
      opacity: 0, y: 50, duration: 1, ease: "power2.out",
      scrollTrigger: { trigger: ".threat-ball-intro", start: "top 80%", toggleActions: "play none none reverse" }
    });

    // Reaction graphs
    gsap.from(".reaction-graph-container", {
      opacity: 0, y: 50, duration: 1, ease: "power2.out",
      scrollTrigger: { trigger: ".storm-button-container-6", start: "top 80%", toggleActions: "play none none reverse" }
    });

    // Video compare section
    gsap.from([".dual-threat-video-compare h3", ".dual-threat-video-compare h1", ".rg-smile"], {
      opacity: 0, y: 50, duration: 1.2, ease: "power2.out", stagger: 0.2,
      scrollTrigger: { trigger: ".dual-threat-video-compare", start: "top 75%", toggleActions: "play none none reverse" }
    });

    // Compare meter
    gsap.from(".compare-meter-section h1", {
      opacity: 0, y: 50, duration: 1, ease: "power2.out",
      scrollTrigger: { trigger: ".compare-meter-section", start: "top 75%", toggleActions: "play none none reverse" }
    });
    gsap.from(".meter-oil-level img", {
      opacity: 0, y: 50, duration: 1, stagger: 0.2, ease: "power2.out",
      scrollTrigger: { trigger: ".compare-meter-section", start: "top 75%", toggleActions: "play none none reverse" }
    });
    gsap.from(".compare-meter-section svg", {
      opacity: 0, scale: 0.8, rotate: 5, duration: 1.5, ease: "power2.out",
      scrollTrigger: { trigger: ".compare-meter-section", start: "top 75%", toggleActions: "play none none reverse" }
    });

    // Apparel section
    gsap.from(".look-svg", {
      opacity: 0, scale: 0.8, duration: 1.5, ease: "power2.out",
      scrollTrigger: { trigger: ".dual-threat-style", start: "top 75%", toggleActions: "play none none reverse" }
    });
    gsap.from(".title-with-button-container", {
      opacity: 0, y: 50, duration: 1, ease: "power2.out",
      scrollTrigger: { trigger: ".dual-threat-style", start: "top 75%", toggleActions: "play none none reverse" }
    });
    gsap.from(".rg-dual-threat-apparel img", {
      opacity: 0, y: 50, duration: 1, stagger: 0.2, ease: "power2.out",
      scrollTrigger: { trigger: ".dual-threat-style", start: "top 75%", toggleActions: "play none none reverse" }
    });

  });

} // end triple-threat block


// =============================================================================
//  21. EQUINOX — Scroll Animations
//  Consolidated from inline scripts in equinox-web-page.html
// =============================================================================

if (document.body.classList.contains("equinox")) {

  window.addEventListener("load", () => {
    // Hero image + SVG entrance
    gsap.from(".container-30 img", { duration: 1, opacity: 0, y: -50, ease: "power2.out" });
    gsap.from(".container-70 svg", { duration: 1.5, opacity: 0, scale: 0.5, ease: "elastic.out(1, 0.5)", delay: 0.5 });

    // Horizontal scroll hero text — responsive
    const mm = gsap.matchMedia();

    mm.add("(min-width:769px) and (max-width:1024px) and (max-height:1179px)", () => {
      gsap.to(".hero-text", {
        xPercent: -100, ease: "none",
        scrollTrigger: {
          trigger: ".equinox-hero-container", start: "top top",
          end: () => "+=" + (document.querySelector(".hero-text")?.offsetWidth || 0),
          pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true
        }
      });
    });
    mm.add("(min-width:1025px) and (max-width:1440px)", () => {
      gsap.to(".hero-text", {
        xPercent: -100, ease: "none",
        scrollTrigger: {
          trigger: ".equinox-hero-container", start: "top top",
          end: () => "+=" + (document.querySelector(".hero-text")?.offsetWidth || 0),
          pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true
        }
      });
    });
    mm.add("(min-width:1441px)", () => {
      gsap.to(".hero-text", {
        xPercent: -100, ease: "none",
        scrollTrigger: {
          trigger: ".equinox-hero-container", start: "top top",
          end: () => "+=" + (document.querySelector(".hero-text")?.offsetWidth || 0),
          pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true
        }
      });
    });
    mm.add("(max-width:768px)", () => {
      gsap.to(".hero-text", {
        xPercent: -100, ease: "none",
        scrollTrigger: {
          trigger: ".equinox-hero-container", start: "top top",
          end: () => "+=" + (document.querySelector(".hero-text")?.offsetWidth || 0),
          pin: true, scrub: true, anticipatePin: 1, invalidateOnRefresh: true
        }
      });
    });

    // DrawSVG logo reveal (only if plugin available)
    if (typeof DrawSVGPlugin !== "undefined") {
      gsap.registerPlugin(DrawSVGPlugin);
      gsap.timeline({
        scrollTrigger: { trigger: ".trigger1", start: "top 70%", end: "top 50%", scrub: 3 }
      })
        .fromTo(".equinox-logo path", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1, ease: "power2.out" }, 0)
        .fromTo(".equinox-logo", { scale: 3 }, { scale: 1, duration: 3, ease: "power2.out" }, 0);
    }

    // Logo fades out as ball fades in, ball drops down
    gsap.fromTo(".equinox-logo svg",
      { opacity: 1 },
      {
        opacity: 0, duration: 3, ease: "power2.out",
        scrollTrigger: { trigger: ".trigger1", start: "top 50%", end: "top 15%", scrub: 3 }
      }
    );
    gsap.fromTo(".equinox-ball img",
      { opacity: 0 },
      {
        opacity: 1, duration: 3, ease: "power2.out",
        scrollTrigger: { trigger: ".trigger1", start: "top 50%", end: "top 15%", scrub: 3 }
      }
    );
    gsap.to(".equinox-ball", {
      y: 250, duration: 2, ease: "power2.out",
      scrollTrigger: { trigger: ".trigger1", start: "top 50%", end: "top 15%", scrub: 3 }
    });

    // Hero statement — each word slams in from below with a stagger
    const heroWords = document.querySelectorAll(".equinox-hero-statement");
    if (heroWords.length) {
      gsap.from(heroWords, {
        opacity: 0, y: 80, rotationX: -45, duration: 0.7, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: heroWords[0], start: "top 65%", toggleActions: "play none none reverse" }
      });
    }

    // equinox copy — slide in from sides on scroll
    gsap.from(".equinox-copy-1", {
      opacity: 0, x: -100, duration: 1, ease: "power2.out",
      scrollTrigger: { trigger: ".equinox-copy-1", start: "top 80%", toggleActions: "play none none reverse" }
    });
    gsap.from(".equinox-copy-2", {
      opacity: 0, x: 100, duration: 1, ease: "power2.out",
      scrollTrigger: { trigger: ".equinox-copy-2", start: "top 80%", toggleActions: "play none none reverse" }
    });

    // Delay refresh until after loading screen clears and body overflow is restored
    setTimeout(() => ScrollTrigger.refresh(), 300);
  });

  window.addEventListener("resize", () => ScrollTrigger.refresh());

} // end equinox block


// =============================================================================
//  22. VENGEANCE — Scroll Animations
//  Consolidated from inline scripts in vengeance.html
// =============================================================================

if (document.body.classList.contains("vengeance")) {

  window.addEventListener("load", () => {

    // BW ball fade in on load
    const bwBall = document.querySelector(".vengeance-bw-ball");
    if (bwBall) {
      bwBall.style.opacity = "0";
      gsap.to(".vengeance-bw-ball", { opacity: 1, duration: 2, ease: "power2.out", delay: 0.3 });
    }

    // Hero info — paragraph fades in, button pops in (h1 handled by vengeance-title loop)
    gsap.from(".vengeance-hero-info p", {
      opacity: 0, y: 30, duration: 0.8, ease: "power2.out", delay: 0.2,
      scrollTrigger: { trigger: ".vengeance-hero-info", start: "top 80%", toggleActions: "play none none reverse" }
    });
    gsap.from(".vengeance-hero-info .storm-button-container-3", {
      opacity: 0, y: 20, duration: 0.6, ease: "power2.out", delay: 0.4,
      scrollTrigger: { trigger: ".vengeance-hero-info", start: "top 80%", toggleActions: "play none none reverse" }
    });

    // Half ball — slides in from the right
    gsap.from(".vengeance-half-ball img", {
      opacity: 0, x: -100, duration: 1.2, ease: "power3.out",
      scrollTrigger: { trigger: ".vengeance-half-ball", start: "top 50%", toggleActions: "play none none reverse" }
    });

    // Vengeance title headings (h1, h2, h3 all share .vengeance-title)
    gsap.utils.toArray(".vengeance-title").forEach(el => {
      gsap.from(el, {
        opacity: 0, y: 40, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
      });
    });

    // Tech compare cards — stagger up
    gsap.from(".vengeance-tech-card", {
      opacity: 0, y: 60, duration: 0.7, ease: "power2.out", stagger: 0.1,
      scrollTrigger: { trigger: ".vengeance-tech-specs-compare", start: "top 85%", toggleActions: "play none none reverse" }
    });


    // Nav cards — stagger up
    gsap.from(".card-wrapper", {
      opacity: 0, y: 50, duration: 0.7, ease: "power2.out", stagger: 0.15,
      scrollTrigger: { trigger: ".card-wrapper", start: "top 85%", toggleActions: "play none none reverse" }
    });

  });

} // end vengeance block


// =============================================================================
//  23. ION MAX — Loading Screen
//  Non-GSAP but consolidated here for completeness
// =============================================================================

if (document.body.classList.contains("ion-max")) {

  document.body.style.overflow = "hidden";

  window.addEventListener("load", () => {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) loadingScreen.style.display = "none";
    document.body.style.overflow = "auto";

    // -------------------------------------------------------------------------
    // Hero headline — lines stagger in from the left after page loads
    // -------------------------------------------------------------------------
    gsap.from(".ion-max-headline h1", {
      x: -80,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.2,
      delay: 0.4
    });

    // -------------------------------------------------------------------------
    // Tech spec cards — stagger up from below on scroll
    // Global section 6 animates .grid .card, but these cards sit inside
    // .ui-card-container (not .grid), so we handle them here directly.
    // -------------------------------------------------------------------------
    const specCards = gsap.utils.toArray(".ion-max-tech-specs-container .card");
    gsap.set(specCards, { opacity: 0, y: 40, scale: 0.95 });
    gsap.to(specCards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: ".ion-max-tech-specs-container .ui-card-container",
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    // -------------------------------------------------------------------------
    // 50% stat — count up from 0 to 50 as it enters the viewport.
    // Using gsap.set to establish initial state prevents the global h2 reveal
    // in section 6 from double-animating .max-hero-title h2.
    // -------------------------------------------------------------------------
    const statEl = document.querySelector(".ionmax-text");
    const statH2 = document.querySelector(".max-hero-title h2");

    if (statEl && statEl.textContent.trim() === "50%") {
      const obj = { val: 0 };

      // Lock h2 initial state before section 6 can touch it
      if (statH2) gsap.set(statH2, { opacity: 0, x: 40 });

      gsap.to(obj, {
        val: 50,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: statEl,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        onUpdate: () => {
          statEl.textContent = Math.round(obj.val) + "%";
        }
      });

      if (statH2) {
        gsap.to(statH2, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statEl,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });
      }
    }

  });

} // end ion-max block