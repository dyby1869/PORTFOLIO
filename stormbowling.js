//hero text
window.addEventListener("load", () => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.refresh();

    const text = document.querySelector(".storm-hero-text");

    // Start hidden
    gsap.set(text, { opacity: 0, color: "#ffffff" });

    // Fade in first (independent)
    gsap.to(text, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".storm-hero",
            start: "top 55%",
            toggleActions: "play none none reverse",
            //////////markers: true
        }
    });

    // Then change color on scroll (scrubbed)
    gsap.to(text, {
        color: "#FFE77C",
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".storm-hero",
            start: "top 45%",
            end: "top 20%",
            scrub: true,
            //////////markers: true
        }
    });


    // Left text animation
    gsap.from(".transformation-text-left", {
        x: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".transformation-text-left",
            start: "top 60%",
            toggleActions: "play none none reverse",
            ////////markers: true
        }
    });

    // Right text animation
    gsap.from(".transformation-text-right", {
        x: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".transformation-text-right",
            start: "top 60%",
            toggleActions: "play none none reverse",
            ////////markers: true
        }
    });

    // Animate strategy cards in with stagger
    gsap.set(".card--strategy", { opacity: 0, y: 50 });

    gsap.to(".card--strategy", {
        scrollTrigger: {
            trigger: "#VisionStrategyGoals",
            start: "top 60%",
            toggleActions: "play none none reverse",
            ////////markers: true
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.15
    });

    // Animate the headline
    gsap.set(".work-phases", { opacity: 0, scale: 0.95 });

    gsap.to(".work-phases", {
        scrollTrigger: {
            trigger: ".work-phases",
            start: "top 60%",
            toggleActions: "play none none reverse",
            ////////markers: true
        },
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
    });

    // Animate the phase cards
    gsap.set(".card--action", { opacity: 0, y: 60 });

    gsap.to(".card--action", {
        scrollTrigger: {
            trigger: ".work-phases", // or use the grid below it
            start: "top 50%",
            toggleActions: "play none none reverse",
            ////////markers: true
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.15
    });


    // Set initial states
    gsap.set(".section-title", { opacity: 0, y: 40 });
    gsap.set(".section-subtitle", { opacity: 0, y: 40 });
    gsap.set("#WhatIBuilt .card", { opacity: 0, scale: 0.95, y: 30 });

    // Animate the headline & subtitle
    gsap.to(".section-title", {
        scrollTrigger: {
            trigger: "#WhatIBuilt",
            start: "top 65%",
            toggleActions: "play none none reverse",
            //////markers: true
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
    });

    gsap.to(".section-subtitle", {
        scrollTrigger: {
            trigger: "#WhatIBuilt",
            start: "top 60%",
            toggleActions: "play none none reverse",
            //////////markers: true
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.1
    });

    // Animate the grid cards with zoom-in stagger
    gsap.to("#WhatIBuilt .card", {
        scrollTrigger: {
            trigger: "#WhatIBuilt .grid",
            start: "top 60%",
            end: "top 30%",
            scrub: true,
            ////////markers: true
        },
        opacity: 1,
        scale: 1,
        y: 0,
        ease: "power2.out",
        stagger: 0.1
    });




});




