(function () {
    "use strict";

    const sliderStage = document.getElementById("walimahStage");
    const indicatorWrap = document.getElementById("walimahIndicators");

    const revealItems = document.querySelectorAll(
        ".walimah-mosaic-card, .walimah-reflection-card, .walimah-closing-item, .walimah-mini-quote, .walimah-hero-quote"
    );

    if (revealItems.length) {
        revealItems.forEach((item) => item.classList.add("walimah-reveal"));
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

    function setupWalimahSlider() {
        if (!sliderStage || !indicatorWrap) return;

        const slides = Array.from(sliderStage.querySelectorAll(".walimah-slide-grid"));
        const indicators = Array.from(indicatorWrap.querySelectorAll("button"));

        if (!slides.length || !indicators.length) return;

        let currentIndex = 0;
        let autoPlay = null;
        const autoPlayDelay = 5000;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle("active", i === index);

                const animatedCards = slide.querySelectorAll(".slide-in-soft");
                animatedCards.forEach((card) => {
                    if (i === index) {
                        card.style.animation = "none";
                        void card.offsetWidth;
                        card.style.animation = "";
                    }
                });
            });

            indicators.forEach((indicator, i) => {
                indicator.classList.toggle("active", i === index);
            });

            currentIndex = index;
        }

        function nextSlide() {
            const nextIndex = (currentIndex + 1) % slides.length;
            showSlide(nextIndex);
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlay = window.setInterval(nextSlide, autoPlayDelay);
        }

        function stopAutoPlay() {
            if (autoPlay) {
                window.clearInterval(autoPlay);
                autoPlay = null;
            }
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener("click", function () {
                showSlide(index);
                startAutoPlay();
            });
        });

        sliderStage.addEventListener("mouseenter", stopAutoPlay);
        sliderStage.addEventListener("mouseleave", startAutoPlay);

        sliderStage.addEventListener("touchstart", stopAutoPlay, { passive: true });
        sliderStage.addEventListener("touchend", startAutoPlay, { passive: true });

        let touchStartX = 0;
        let touchEndX = 0;

        sliderStage.addEventListener("touchstart", function (event) {
            touchStartX = event.changedTouches[0].clientX;
        }, { passive: true });

        sliderStage.addEventListener("touchend", function (event) {
            touchEndX = event.changedTouches[0].clientX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) < 40) return;

            if (swipeDistance < 0) {
                showSlide((currentIndex + 1) % slides.length);
            } else {
                showSlide((currentIndex - 1 + slides.length) % slides.length);
            }

            startAutoPlay();
        }

        document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
                stopAutoPlay();
            } else {
                startAutoPlay();
            }
        });

        showSlide(0);
        startAutoPlay();
    }

    function parallaxHeroBadges() {
        const hero = document.querySelector(".walimah-hero");
        const badges = document.querySelectorAll(".walimah-hero-badge");

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

    function addKeyboardSliderSupport() {
        if (!sliderStage || !indicatorWrap) return;

        const slides = Array.from(sliderStage.querySelectorAll(".walimah-slide-grid"));
        const indicators = Array.from(indicatorWrap.querySelectorAll("button"));

        if (!slides.length || !indicators.length) return;

        function getCurrentIndex() {
            return slides.findIndex((slide) => slide.classList.contains("active"));
        }

        document.addEventListener("keydown", function (event) {
            const currentIndex = getCurrentIndex();
            if (currentIndex < 0) return;

            if (event.key === "ArrowRight") {
                indicators[(currentIndex + 1) % slides.length].click();
            }

            if (event.key === "ArrowLeft") {
                indicators[(currentIndex - 1 + slides.length) % slides.length].click();
            }
        });
    }

    function addGentleTiltEffect() {
        const cards = document.querySelectorAll(
            ".walimah-mosaic-card, .walimah-reflection-card"
        );

        if (!cards.length || window.innerWidth < 992) return;

        cards.forEach((card) => {
            card.addEventListener("mousemove", function (event) {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const rotateY = ((x / rect.width) - 0.5) * 6;
                const rotateX = ((y / rect.height) - 0.5) * -6;

                card.style.transform =
                    "perspective(1000px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-6px)";
            });

            card.addEventListener("mouseleave", function () {
                card.style.transform = "";
            });
        });
    }

    setupScrollReveal();
    setupWalimahSlider();
    parallaxHeroBadges();
    addKeyboardSliderSupport();
    addGentleTiltEffect();
})();