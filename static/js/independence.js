(function () {
    "use strict";

    const sliderStage = document.getElementById("independenceStage");
    const indicatorWrap = document.getElementById("independenceIndicators");

    if (!sliderStage || !indicatorWrap) return;

    const slides = Array.from(sliderStage.querySelectorAll(".independence-slider-grid"));
    const indicators = Array.from(indicatorWrap.querySelectorAll("button"));

    if (!slides.length || !indicators.length) return;

    let currentIndex = 0;
    let autoPlay;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);

            const animatedCards = slide.querySelectorAll(".slide-in-right");
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
        autoPlay = window.setInterval(nextSlide, 4200);
    }

    function stopAutoPlay() {
        if (autoPlay) {
            window.clearInterval(autoPlay);
        }
    }

    indicators.forEach((button, index) => {
        button.addEventListener("click", function () {
            showSlide(index);
            startAutoPlay();
        });
    });

    sliderStage.addEventListener("mouseenter", stopAutoPlay);
    sliderStage.addEventListener("mouseleave", startAutoPlay);
    sliderStage.addEventListener("touchstart", stopAutoPlay, { passive: true });
    sliderStage.addEventListener("touchend", startAutoPlay, { passive: true });

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });

    showSlide(0);
    startAutoPlay();
})();