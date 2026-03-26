(function () {
    "use strict";

    const revealItems = document.querySelectorAll(
        ".founder-side-card, .founder-value-card, .founder-legacy-image, .founder-closing-item, .founder-hero-quote"
    );

    if (revealItems.length) {
        revealItems.forEach((item) => item.classList.add("founder-reveal"));
    }

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

    function parallaxHeroBadges() {
        const hero = document.querySelector(".founder-hero");
        const badges = document.querySelectorAll(".founder-hero-badge");

        if (!hero || !badges.length || window.innerWidth < 992) return;

        window.addEventListener("mousemove", function (event) {
            const rect = hero.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const moveX = (x / rect.width - 0.5) * 10;
            const moveY = (y / rect.height - 0.5) * 10;

            badges.forEach((badge, index) => {
                const strength = index === 0 ? 1 : 1.3;
                badge.style.transform =
                    "translate(" + (moveX * strength) + "px, " + (moveY * strength) + "px)";
            });
        });

        hero.addEventListener("mouseleave", function () {
            badges.forEach((badge) => {
                badge.style.transform = "";
            });
        });
    }

    function addGentleTiltEffect() {
        const cards = document.querySelectorAll(
            ".founder-side-card, .founder-value-card, .founder-legacy-image"
        );

        if (!cards.length || window.innerWidth < 992) return;

        cards.forEach((card) => {
            card.addEventListener("mousemove", function (event) {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const rotateY = ((x / rect.width) - 0.5) * 5;
                const rotateX = ((y / rect.height) - 0.5) * -5;

                card.style.transform =
                    "perspective(1000px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-6px)";
            });

            card.addEventListener("mouseleave", function () {
                card.style.transform = "";
            });
        });
    }

    setupScrollReveal();
    parallaxHeroBadges();
    addGentleTiltEffect();
})();