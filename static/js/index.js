(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        initMissionSlider();
        initFloatingAdmissionAd();
    });

    function initMissionSlider() {
        const slider = document.querySelector(".js-emis-mission-slider");
        if (!slider) return;

        const slides = Array.from(slider.querySelectorAll(".emis-mission-slide"));
        const prevBtn = document.querySelector(".js-emis-mission-prev");
        const nextBtn = document.querySelector(".js-emis-mission-next");
        const dotsWrap = document.querySelector(".js-emis-mission-dots");

        if (!slides.length || !dotsWrap) return;

        let activeIndex = 0;
        let timer = null;
        const intervalTime = 5200;

        slides.forEach(function (_, index) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "emis-mission-dot";
            dot.setAttribute("aria-label", "Go to mission slide " + (index + 1));

            dot.addEventListener("click", function () {
                goToSlide(index);
                restartAutoPlay();
            });

            dotsWrap.appendChild(dot);
        });

        const dots = Array.from(dotsWrap.querySelectorAll(".emis-mission-dot"));

        function renderSlides() {
            slides.forEach(function (slide, index) {
                slide.classList.toggle("active", index === activeIndex);
            });

            dots.forEach(function (dot, index) {
                dot.classList.toggle("active", index === activeIndex);
            });
        }

        function goToSlide(index) {
            activeIndex = (index + slides.length) % slides.length;
            renderSlides();
        }

        function nextSlide() {
            goToSlide(activeIndex + 1);
        }

        function prevSlide() {
            goToSlide(activeIndex - 1);
        }

        function startAutoPlay() {
            stopAutoPlay();
            timer = window.setInterval(nextSlide, intervalTime);
        }

        function stopAutoPlay() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        function restartAutoPlay() {
            startAutoPlay();
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", function () {
                nextSlide();
                restartAutoPlay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", function () {
                prevSlide();
                restartAutoPlay();
            });
        }

        slider.addEventListener("mouseenter", stopAutoPlay);
        slider.addEventListener("mouseleave", startAutoPlay);

        renderSlides();
        startAutoPlay();
    }

    function initFloatingAdmissionAd() {
        const ad = document.querySelector(".js-emis-floating-ad");
        const closeBtn = document.querySelector(".js-emis-floating-ad-close");
        const title = document.querySelector(".js-emis-ad-title");
        const message = document.querySelector(".js-emis-ad-message");

        if (!ad || !title || !message) return;

        const ads = [
            {
                title: "Admissions Open",
                message: "Register your child for Nursery, Primary, Secondary or Tahfeez."
            },
            {
                title: "Visit EMIS",
                message: "Book a school visit and speak with our admissions team."
            },
            {
                title: "Tahfeez Programme",
                message: "Build a strong Qur’anic foundation with discipline and care."
            },
            {
                title: "School Portal",
                message: "Access EMIS online services through the school portal."
            }
        ];

        let index = 0;
        let isClosed = false;
        let cycleTimer = null;

        function isMobileWidth() {
            return window.matchMedia("(max-width: 767.98px)").matches;
        }

        function updateAdContent() {
            title.textContent = ads[index].title;
            message.textContent = ads[index].message;
            index = (index + 1) % ads.length;
        }

        function showAd() {
            if (isClosed) return;

            updateAdContent();
            ad.classList.add("show");

            window.setTimeout(function () {
                if (!isClosed) {
                    ad.classList.remove("show");
                }
            }, isMobileWidth() ? 6500 : 8500);
        }

        function startCycle() {
            window.setTimeout(showAd, isMobileWidth() ? 4500 : 3000);

            cycleTimer = window.setInterval(function () {
                showAd();
            }, isMobileWidth() ? 22000 : 17000);
        }

        if (closeBtn) {
            closeBtn.addEventListener("click", function () {
                isClosed = true;
                ad.classList.remove("show");

                if (cycleTimer) {
                    window.clearInterval(cycleTimer);
                }
            });
        }

        ad.addEventListener("click", function (event) {
            const target = event.target;

            if (target.closest(".emis-floating-ad-btn")) {
                ad.classList.remove("show");
            }
        });

        startCycle();
    }
})();