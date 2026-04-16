document.addEventListener("DOMContentLoaded", function () {
    const staffCards = document.querySelectorAll(".staff-card");
    const heroCards = document.querySelectorAll(".staff-hero-highlight-card");
    const revealTargets = document.querySelectorAll(
        ".staff-card, .staff-hero-highlight-card, .staff-hero-copy"
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
            threshold: 0.16,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealTargets.forEach((item) => revealObserver.observe(item));

    const sequenceAnimate = (elements, delayStep = 90, startDelay = 0) => {
        elements.forEach((element, index) => {
            element.style.transitionDelay = `${startDelay + (index * delayStep)}ms`;
        });
    };

    sequenceAnimate(heroCards, 120, 80);
    sequenceAnimate(staffCards, 70, 120);

    staffCards.forEach((card) => {
        card.addEventListener("mousemove", function (e) {
            if (window.innerWidth <= 991) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener("mouseleave", function () {
            card.style.transform = "";
        });
    });

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

    const parallaxImages = document.querySelectorAll(
        ".staff-card-image-wrap img, .staff-hero-highlight-image img"
    );

    let ticking = false;

    const handleScrollEffects = () => {
        if (window.innerWidth <= 991) {
            ticking = false;
            return;
        }

        parallaxImages.forEach((img) => {
            const parent = img.closest(".staff-card, .staff-hero-highlight-card");
            if (!parent) return;

            const rect = parent.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;

            if (inView) {
                const move = rect.top * -0.016;
                img.style.transform = `scale(1.04) translateY(${move}px)`;
            }
        });

        const edaCard = document.querySelector(".card-eda");
        const edoCard = document.querySelector(".card-edo");

        if (edaCard && edoCard) {
            const scrollY = window.scrollY;
            const edoOffset = Math.min(scrollY * 0.015, 8);
            const edaOffset = Math.min(scrollY * 0.01, 6);

            edaCard.style.transform = `translateY(${edaOffset}px)`;
            edoCard.style.transform = `translateY(${edoOffset}px)`;
        }

        ticking = false;
    };

    const requestScrollEffects = () => {
        if (!ticking) {
            window.requestAnimationFrame(handleScrollEffects);
            ticking = true;
        }
    };

    window.addEventListener("scroll", requestScrollEffects, { passive: true });

    window.addEventListener("resize", function () {
        if (window.innerWidth <= 991) {
            staffCards.forEach((card) => {
                card.style.transform = "";
            });

            heroCards.forEach((card) => {
                card.style.opacity = "";
                card.style.transform = "";
            });

            parallaxImages.forEach((img) => {
                img.style.transform = "";
            });
        }
    });

    handleScrollEffects();
});