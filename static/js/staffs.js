document.addEventListener("DOMContentLoaded", function () {
    const staffCards = document.querySelectorAll(".staff-card");
    const leadCards = document.querySelectorAll(".lead-card");
    const familyTree = document.querySelector(".staff-family-tree");

    const revealTargets = document.querySelectorAll(
        ".staff-hero-header, .staff-family-tree, .lead-card, .staff-section-intro, .staff-card"
    );

    revealTargets.forEach((item) => {
        item.classList.add("staff-reveal");
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.14,
            rootMargin: "0px 0px -45px 0px"
        }
    );

    revealTargets.forEach((item) => revealObserver.observe(item));

    function sequenceAnimate(elements, delayStep = 80, startDelay = 0) {
        elements.forEach((element, index) => {
            element.style.transitionDelay = `${startDelay + index * delayStep}ms`;
        });
    }

    sequenceAnimate(leadCards, 110, 100);
    sequenceAnimate(staffCards, 65, 160);

    function addTiltEffect(cards, lift = 7, rotate = 3) {
        cards.forEach((card) => {
            card.addEventListener("mousemove", function (e) {
                if (window.innerWidth <= 991) return;

                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -rotate;
                const rotateY = ((x - centerX) / centerX) * rotate;

                card.style.transform = `translateY(-${lift}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener("mouseleave", function () {
                card.style.transform = "";
            });
        });
    }

    addTiltEffect(staffCards, 7, 2.8);
    addTiltEffect(leadCards, 7, 2.2);

    leadCards.forEach((card) => {
        card.addEventListener("mouseenter", function () {
            if (window.innerWidth <= 991) return;

            leadCards.forEach((otherCard) => {
                if (otherCard !== card) {
                    otherCard.style.opacity = "0.82";
                    otherCard.style.filter = "saturate(0.92)";
                }
            });
        });

        card.addEventListener("mouseleave", function () {
            leadCards.forEach((otherCard) => {
                otherCard.style.opacity = "";
                otherCard.style.filter = "";
            });
        });
    });

    const parallaxImages = document.querySelectorAll(
        ".staff-card-image-wrap img, .lead-image img"
    );

    let ticking = false;

    function handleScrollEffects() {
        if (window.innerWidth <= 991) {
            ticking = false;
            return;
        }

        parallaxImages.forEach((img) => {
            const parent = img.closest(".staff-card, .lead-card");
            if (!parent) return;

            const rect = parent.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;

            if (inView) {
                const move = rect.top * -0.012;
                img.style.transform = `scale(1.035) translateY(${move}px)`;
            }
        });

        if (familyTree) {
            const rect = familyTree.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;

            if (inView) {
                const glowMove = Math.max(Math.min(rect.top * -0.01, 10), -10);
                familyTree.style.setProperty("--tree-float", `${glowMove}px`);
            }
        }

        ticking = false;
    }

    function requestScrollEffects() {
        if (!ticking) {
            window.requestAnimationFrame(handleScrollEffects);
            ticking = true;
        }
    }

    window.addEventListener("scroll", requestScrollEffects, { passive: true });

    window.addEventListener("resize", function () {
        if (window.innerWidth <= 991) {
            resetMotion();
        }
    });

    function resetMotion() {
        staffCards.forEach((card) => {
            card.style.transform = "";
        });

        leadCards.forEach((card) => {
            card.style.transform = "";
            card.style.opacity = "";
            card.style.filter = "";
        });

        parallaxImages.forEach((img) => {
            img.style.transform = "";
        });

        if (familyTree) {
            familyTree.style.removeProperty("--tree-float");
        }
    }

    const lugbeCards = document.querySelectorAll(".staff-card-lugbe");

    lugbeCards.forEach((card) => {
        card.addEventListener("mouseenter", function () {
            card.classList.add("lugbe-active");
        });

        card.addEventListener("mouseleave", function () {
            card.classList.remove("lugbe-active");
        });
    });

    handleScrollEffects();
});