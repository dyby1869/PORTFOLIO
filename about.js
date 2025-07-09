window.addEventListener("load", () => {
  const cards = document.querySelectorAll(".card");

  gsap.set(cards, { opacity: 0, y: 50 });

  gsap.to(cards, {
    scrollTrigger: {
      trigger: ".my-values",
      start: "top 65%",
      end: "top 20%",
      toggleActions: "play none none reverse",
      markers: true,
    },
    opacity: 1,
    y: 0,
    ease: "power2.out",
    stagger: 0.1,
  });

  // ✅ Merge about toggle + refresh here
  const toggleBtn = document.getElementById("about-toggle");
  const extraContent = document.getElementById("about-extra");

  toggleBtn.addEventListener("click", () => {
    const isVisible = extraContent.style.display === "block";
    extraContent.style.display = isVisible ? "none" : "block";
    toggleBtn.textContent = isVisible ? "Continue Reading" : "Show Less";

    ScrollTrigger.refresh(); // ✅ this ensures .my-values adjusts after toggle
  });

  ScrollTrigger.refresh(); // initial
});
