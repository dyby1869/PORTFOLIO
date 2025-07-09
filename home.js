//home load sequence
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

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

    // 🔥 Initialize portal-rays (hidden and scaled down)
    tl.set(".portal-rays", {
      opacity: 0,
      scaleY: 0.6
    });

    // 🔥 Animate portal-rays in (rays shoot upward)
    tl.to(".portal-rays", {
      opacity: 1,
      scaleY: 1,
      duration: 1.2,
      ease: "power2.out"
    }, "-=0.6"); // overlaps with portal-glow animation

    // 🔥 Portal-profile rise & fade in
    // 1. Y movement (starts immediately)
    tl.fromTo(".portal-profile", {
      y: 80
    }, {
      y: 0,
      duration: 1.2,
      ease: "power2.out"
    }, "-=1.1"); // or whatever offset you want

    // 2. Opacity fade-in (delayed, starts near the end of y movement)
    tl.fromTo(".portal-profile", {
      opacity: 0
    }, {
      opacity: 1,
      duration: 0.8,
      ease: "power1.out"
    }, "-=0.9"); // adjust to start just before it finishes rising

    // 🔥 Glow beam emission
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

    tl.fromTo(".nav-bar", {
      opacity: 0,
      y: -20
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.6");

    tl.fromTo(".btn-cta", {
      opacity: 0,
      y: 20
    }, {
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

    tl.call(() => { trailEnabled = true; }); // ✅ enable snow trail after everything


    // Animate individual beams to pulse like energy surges
    gsap.utils.toArray(".beam").forEach((beam, i) => {
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


document.addEventListener("DOMContentLoaded", () => {
  const fancyButton = document.getElementById("fancyButton");
  const heroText1 = document.querySelector(".hero-text");
  const heroText2 = document.getElementById("hero-text-2");

  fancyButton.addEventListener("click", () => {
    fancyButton.style.display = "none";

    heroText1.style.display = "none";
    heroText2.style.display = "block";
    heroText2.style.opacity = 1;

    setTimeout(() => {
      heroText2.style.display = "none";
      heroText2.style.opacity = 0;

      heroText1.style.display = "block";
      fancyButton.style.display = "inline-block";
    }, 5000);
  });
});


//service cards
window.addEventListener("load", () => {

  ScrollTrigger.refresh();

  const cards = document.querySelectorAll(".card");

  gsap.set(cards, { opacity: 0, y: 50 });

  gsap.to(cards, {
    scrollTrigger: {
      trigger: ".grid",
      start: "top 80%",
      end: "top 20%",
      scrub: true,

    },
    opacity: 1,
    y: 0,
    ease: "power2.out",
    stagger: 0.1
  });
});


//recent work
window.addEventListener("load", () => {
  if (document.getElementById("recent-work")) {
    gsap.from("#recent-work", {
      scrollTrigger: {
        trigger: "#recent-work",
        start: "top 65%",
        end: "top 20%",
        scrub: true,

      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out"
    });
  }
});


//projects & ambitions
window.addEventListener("load", () => {
  if (document.getElementById("projects-ambitions")) {
    gsap.from("#projects-ambitions", {
      scrollTrigger: {
        trigger: "#projects-ambitions",
        start: "top 65%",
        end: "top 20%",
        scrub: true,

      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out"
    });
  }
});


