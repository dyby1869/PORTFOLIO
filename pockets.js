window.addEventListener("load", () => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.refresh();


    const introText = document.querySelector(".project-intro-text");

    // Start hidden
    gsap.set(introText, { opacity: 0, color: "#ffffff" });

    // Fade in on scroll
    gsap.to(introText, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
            trigger: introText,
            start: "top 65%",
            toggleActions: "play none none reverse"
            // markers: true
        }
    });

    // Then change color on scroll (scrubbed)
    gsap.to(introText, {
        color: "#FFE77C",
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: introText,
            start: "top 55%",
            end: "top 25%",
            scrub: true
            // markers: true
        }
    });

    // === Problem Section Animation ===
    const tlProblem = gsap.timeline({
        scrollTrigger: {
            trigger: ".problem-section",
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
    });

    tlProblem.from(".problem-stat", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out"
    }).from(".problem-desc", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.4").from(".problem-item", {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.5,
        ease: "power2.out"
    }, "-=0.4").from(".problem-effect", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.2");

    // === Research Section Animation ===
    const tlResearch = gsap.timeline({
        scrollTrigger: {
            trigger: ".research-process",
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
    });

    tlResearch.from(".research-process .section-heading", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out"
    }).from(".research-process p", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.4").from(".research-item", {
        opacity: 0,
        x: -40,
        duration: 0.5,
        stagger: 0.15,
        ease: "power2.out"
    }, "-=0.3").from(".research-link", {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: "power2.out"
    }, "-=0.3");


    // Set initial hidden state
    gsap.set(".grid .card", { opacity: 0, y: 40 });

    // Animate in on scroll
    gsap.to(".grid .card", {
        scrollTrigger: {
            trigger: ".grid",
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.15
    });

    //persona
    const insightTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".persona-section",
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
    });

    insightTimeline
        .from(".insight-heading", {
            opacity: 0,
            y: 40,
            duration: 0.6,
            ease: "power2.out"
        })
        .from([".insight-body", ".insight-quote"], {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.2,
            ease: "power2.out"
        }, "-=0.4")
        .from(".persona-copy", {
            opacity: 0,

            duration: 0.6,
            ease: "power2.out"
        }, "-=0.3")
        .from(".persona-img img", {
            opacity: 0,

            duration: 0.6,
            ease: "power2.out"
        }, "-=0.5");


    // Create modal element dynamically
    const modal = document.createElement("div");
    modal.classList.add("image-modal");
    document.body.appendChild(modal);

    // Add click-to-enlarge functionality
    document.querySelectorAll(".clickable-img").forEach(img => {
        img.addEventListener("click", () => {
            const enlarged = document.createElement("img");
            enlarged.src = img.src;
            enlarged.alt = img.alt;
            modal.innerHTML = ""; // Clear previous content
            modal.appendChild(enlarged);
            modal.classList.add("show");
            document.body.style.overflow = "hidden";
        });
    });

    // Close modal on click
    modal.addEventListener("click", () => {
        modal.classList.remove("show");
        modal.innerHTML = "";
        document.body.style.overflow = "";
    });



    // === Strategy Section Animation ===
    const tlStrategy = gsap.timeline({
        scrollTrigger: {
            trigger: ".strategy-section",
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
    });

    tlStrategy.from(".strategy-heading", {
        opacity: 0,
        y: 40,
        duration: 0.6,
        ease: "power2.out"
    }).from(".strategy-body", {
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=0.4").from(".strategy-quote", {
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: "power2.out"
    }, "-=0.4");

    // Ensure initial state is set so the animation will actually run
    gsap.set(".hmw-cards .card", { opacity: 0, y: 30 });

    const tlSynthesis = gsap.timeline({
        scrollTrigger: {
            trigger: ".synthesis-section",
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
    });

    tlSynthesis
        .from(".synthesis-section .section-heading", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out"
        })
        .from(".synthesis-section p", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.2,
            ease: "power2.out"
        }, "-=0.4")
        .from(".synthesis-section blockquote", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.3")
        .to(".hmw-cards .card", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out"
        }, "-=0.2");


    //designing the experience
    const tlVision = gsap.timeline({
        scrollTrigger: {
            trigger: ".experience-vision",
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
    });

    tlVision
        .from(".experience-vision .section-heading", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out"
        })
        .from(".experience-vision h4", {
            opacity: 0,
            y: 30,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.4")
        .from(".experience-vision .vision-body", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.3")
        .from(".experience-vision .vision-list li", {
            opacity: 0,
            x: -30,
            stagger: 0.15,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.4");


    // === Ideation Section Animation ===
    const tlIdeation = gsap.timeline({
        scrollTrigger: {
            trigger: ".ideation-section",
            start: "top 75%",
            toggleActions: "play none none reverse",
            markers: true
        }
    });

    tlIdeation
        .from(".ideation-section .section-heading", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out"
        })
        .from(".ideation-section p", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.4")
        .from(".ideation-section img", {
            opacity: 0,
            y: 40,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.3");



    //mvp
    const tlMVP = gsap.timeline({
        scrollTrigger: {
            trigger: ".mvp-section",
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    tlMVP.from(".mvp-section .section-heading", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out"
    })
        .from(".mvp-section p", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.4")
        .from(".mvp-img-block", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out"
        }, "-=0.3");



    // how it works
    const tlHowItWorks = gsap.timeline({
        scrollTrigger: {
            trigger: ".how-it-works",
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    tlHowItWorks
        .from(".how-it-works .section-heading", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out"
        })
        .from(".how-it-works p", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.4")
        .from(".how-it-works img", {
            opacity: 0,
            y: 40,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.3");

    //red routes
    const tlRedRoutes = gsap.timeline({
        scrollTrigger: {
            trigger: ".red-routes",
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    tlRedRoutes
        .from(".red-routes .section-heading", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out"
        })
        .from(".red-routes p", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.4")
        .from(".red-routes .toggle-buttons", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.3")
        .from(".red-routes .flow-gallery img", {
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.4");







    // === Paper Prototype Combined Layout ===
    const tlPaperCompact = gsap.timeline({
        scrollTrigger: {
            trigger: ".paper-prototype-section",
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
    });

    tlPaperCompact
        .from(".paper-prototype-section .section-heading", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out"
        })
        .from(".paper-copy blockquote", {
            opacity: 0,
            x: -40,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.3")
        .from(".paper-copy p", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.3")
        .from(".prototype-link", {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: "power2.out"
        }, "-=0.3")
        .from(".paper-video-wrapper", {
            opacity: 0,
            y: 40,
            scale: 0.98,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.4");


    // === Wireflows Section Animation ===
    const tlWireflows = gsap.timeline({
        scrollTrigger: {
            trigger: ".wireflows-section",
            start: "top 75%",
            toggleActions: "play none none reverse",
            markers: true
        }
    });

    tlWireflows
        .from(".wireflows-section .section-heading", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out"
        })
        .from(".wireflows-section > p", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.4")
        .from(".wireflows-section .full-width-img", {
            opacity: 0,
            scale: 0.97,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.3")
        .from(".core-flow-text", {
            opacity: 0,
            x: -30,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.3")

        .from(".wireflows-section h4:nth-of-type(2)", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.3")
        .from(".wireflows-section p:nth-of-type(2)", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.4")
        .from(".slider-container .slide", {
            opacity: 0,
            y: 20,
            stagger: 0.2,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.3")
        .from(".slider-dots .dot", {
            opacity: 0,
            scale: 0.8,
            stagger: 0.1,
            duration: 0.3,
            ease: "back.out(1.7)"
        }, "-=0.4");



    // === Edge Case Section Animation ===
    const tlEdgeCases = gsap.timeline({
        scrollTrigger: {
            trigger: ".edge-case-section",
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    tlEdgeCases
        .from(".edge-case-section .section-heading", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out"
        })
        .from(".edge-case-section p", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.4")
        .from(".edge-case-grid .edge-case-item", {
            opacity: 0,
            y: 40,
            stagger: 0.2,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.3");

    //testing
    const tlTesting = gsap.timeline({
        scrollTrigger: {
            trigger: ".testing-section",
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
    });

    tlTesting
        .from(".testing-section .section-heading", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out"
        })
        .from(".testing-section p", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.3")
        .from(".test-links a", {
            opacity: 0,
            y: 20,
            stagger: 0.15,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.4")
        .from(".test-text-block li", {
            opacity: 0,
            x: -30,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.3")
        .from(".test-img-block img", {
            opacity: 0,
            y: 30,
            scale: 0.98,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.4");


    // === Final Design Section Animation ===
    const tlFinalDesign = gsap.timeline({
        scrollTrigger: {
            trigger: ".final-design-section",
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    tlFinalDesign
        .from(".final-design-section .section-heading", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out"
        })
        .from(".final-design-section > p", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.4")
        .from(".final-hero-img", {
            opacity: 0,
            scale: 0.96,
            y: 30,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.3")
        .from(".final-screens-grid .final-screen-img", {
            opacity: 0,
            y: 20,
            duration: 0.4,
            stagger: 0.15,
            ease: "power2.out"
        }, "-=0.2")
        .from(".figma-embed", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.3")
        .from(".next-steps", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out"
        }, "-=0.3");






});


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


document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".slider-track");
    const dots = document.querySelectorAll(".slider-dots .dot");
    let currentSlide = 0;

    function goToSlide(index) {
        const offset = index * -100;
        track.style.transform = `translateX(${offset}%)`;
        dots.forEach(dot => dot.classList.remove("active"));
        dots[index].classList.add("active");
        currentSlide = index;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => goToSlide(index));
    });

    // Optional: auto-scroll
    // setInterval(() => {
    //   const next = (currentSlide + 1) % dots.length;
    //   goToSlide(next);
    // }, 5000);
});

//hi fi toggle to show more flows
document.getElementById("toggle-hifi").addEventListener("click", () => {
    const extra = document.getElementById("hi-fi-extra");
    const btn = document.getElementById("toggle-hifi");
    const isVisible = extra.style.display === "block";
    extra.style.display = isVisible ? "none" : "block";
    btn.textContent = isVisible ? "View More Screens" : "Hide Screens";
});


//pocket fall
document.addEventListener("DOMContentLoaded", () => {
    const pocketContainer = document.querySelector(".pockets");

    // List of pocket icon filenames
    const pocketIcons = [
        "Cellphone.png",
        "Electric.png",
        "Food.png",
        "Gas.png",
        "Going Out.png",
        "Groceries.png",
        "Rent.png",
        "Shopping.png",
        "Vacation.png",
        "Work.png"
    ];

    // Generate a single pocket element
    function createPocket() {
        const img = document.createElement("img");
        img.src = `assets/pockets/icons/${pocketIcons[Math.floor(Math.random() * pocketIcons.length)]}`;
        img.classList.add("pocket-icon");
        img.style.left = `${Math.random() * 100}%`;
        img.style.top = `-${Math.random() * 100 + 64}px`; // start off-screen

        pocketContainer.appendChild(img);

        animatePocket(img);
    }

    // Animate a pocket down the screen
    function animatePocket(pocket) {
        const duration = 15 + Math.random() * 10;

        gsap.to(pocket, {
            y: window.innerHeight + 100,
            duration: duration,
            ease: "linear",
            onComplete: () => {
                // reset and reanimate
                gsap.set(pocket, {
                    y: 0,
                    x: 0,
                    top: `-${Math.random() * 100 + 64}px`,
                    left: `${Math.random() * 100}%`
                });
                animatePocket(pocket);
            }
        });
    }

    // Generate initial pockets
    for (let i = 0; i < 8; i++) {
        createPocket();
    }
});