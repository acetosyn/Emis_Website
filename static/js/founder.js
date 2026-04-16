(function () {
    "use strict";

    const founderCards = document.querySelectorAll(
        ".founder-copy-card, .founder-image-card, .founder-value-card, .founder-legacy-image-card, .founder-closing-item"
    );

    const heroCards = document.querySelectorAll(
        ".founder-hero-highlight-card, .founder-hero-side-card"
    );

    const revealItems = document.querySelectorAll(
        ".founder-hero-copy, .founder-hero-highlight-card, .founder-hero-side-card, .founder-copy-card, .founder-image-card, .founder-value-card, .founder-legacy-image-card, .founder-closing-item, .founder-section-intro"
    );

    revealItems.forEach((item) => item.classList.add("founder-reveal"));

    function setupScrollReveal() {
        if (!("IntersectionObserver" in window) || !revealItems.length) {
            revealItems.forEach((item) => item.classList.add("in-view"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        obs.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.14,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealItems.forEach((item) => observer.observe(item));
    }

    function setRevealSequence() {
        const valueCards = document.querySelectorAll(".founder-value-card");
        const closingItems = document.querySelectorAll(".founder-closing-item");

        heroCards.forEach((card, index) => {
            card.style.transitionDelay = `${80 + (index * 120)}ms`;
        });

        founderCards.forEach((card, index) => {
            card.style.transitionDelay = `${100 + (index * 70)}ms`;
        });

        valueCards.forEach((card, index) => {
            card.style.transitionDelay = `${90 + (index * 90)}ms`;
        });

        closingItems.forEach((item, index) => {
            item.style.transitionDelay = `${100 + (index * 70)}ms`;
        });
    }

    function addGentleTiltEffect() {
        if (window.innerWidth < 992) return;

        founderCards.forEach((card) => {
            card.addEventListener("mousemove", function (event) {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const rotateY = ((x / rect.width) - 0.5) * 5;
                const rotateX = ((y / rect.height) - 0.5) * -5;

                card.style.transform =
                    `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener("mouseleave", function () {
                card.style.transform = "";
            });
        });
    }

    function heroHoverFocus() {
        if (!heroCards.length) return;

        heroCards.forEach((card) => {
            card.addEventListener("mouseenter", function () {
                if (window.innerWidth <= 991) return;

                heroCards.forEach((otherCard) => {
                    if (otherCard !== card) {
                        otherCard.style.opacity = "0.9";
                        otherCard.style.transform = "scale(0.985)";
                    }
                });
            });

            card.addEventListener("mouseleave", function () {
                heroCards.forEach((otherCard) => {
                    otherCard.style.opacity = "";
                    otherCard.style.transform = "";
                });
            });
        });
    }

    function addParallaxToImages() {
        const images = document.querySelectorAll(
            ".founder-hero-highlight-image img, .founder-image-card img, .founder-legacy-image-card img"
        );

        if (!images.length) return;

        let ticking = false;

        function handleScrollEffects() {
            if (window.innerWidth <= 991) {
                ticking = false;
                return;
            }

            images.forEach((img) => {
                const parent = img.closest(
                    ".founder-hero-highlight-card, .founder-image-card, .founder-legacy-image-card"
                );

                if (!parent) return;

                const rect = parent.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;

                if (inView) {
                    const move = rect.top * -0.016;
                    img.style.transform = `scale(1.04) translateY(${move}px)`;
                }
            });

            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                window.requestAnimationFrame(handleScrollEffects);
                ticking = true;
            }
        }

        window.addEventListener("scroll", requestTick, { passive: true });
        handleScrollEffects();

        window.addEventListener("resize", function () {
            if (window.innerWidth <= 991) {
                images.forEach((img) => {
                    img.style.transform = "";
                });
            }
        });
    }

    setupScrollReveal();
    setRevealSequence();
    addGentleTiltEffect();
    heroHoverFocus();
    addParallaxToImages();
})();