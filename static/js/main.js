(function ($) {
    "use strict";

    /* ______________________________ HELPERS ______________________________ */
    const $window = $(window);

    /* ______________________________ SPINNER ______________________________ */
    function hideSpinner() {
        window.setTimeout(function () {
            const $spinner = $("#spinner");
            if ($spinner.length) {
                $spinner.removeClass("show");
            }
        }, 150);
    }

    hideSpinner();
    $window.on("load", hideSpinner);

    /* ______________________________ WOW INIT ______________________________ */
    if (typeof WOW !== "undefined") {
        new WOW().init();
    }

    /* ______________________________ STICKY NAVBAR ______________________________ */
    function handleStickyNavbar() {
        const $sticky = $(".sticky-top");
        if (!$sticky.length) return;

        if ($window.scrollTop() > 120) {
            $sticky.css("top", "0px");
            $sticky.addClass("navbar-scrolled");
        } else {
            $sticky.css("top", "0px");
            $sticky.removeClass("navbar-scrolled");
        }
    }

    handleStickyNavbar();
    $window.on("scroll", handleStickyNavbar);

    /* ______________________________ DESKTOP DROPDOWN HOVER ______________________________ */
    function initDropdownHover() {
        const $dropdown = $(".dropdown");
        const $dropdownToggle = $(".dropdown-toggle");
        const $dropdownMenu = $(".dropdown-menu");
        const showClass = "show";

        $dropdown.off("mouseenter mouseleave");

        if (window.matchMedia("(min-width: 1200px)").matches) {
            $dropdown.on("mouseenter", function () {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            });

            $dropdown.on("mouseleave", function () {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            });
        } else {
            $dropdown.removeClass(showClass);
            $dropdown.find($dropdownToggle).attr("aria-expanded", "false");
            $dropdown.find($dropdownMenu).removeClass(showClass);
        }
    }

    initDropdownHover();
    $window.on("load resize", initDropdownHover);

    /* ______________________________ BACK TO TOP ______________________________ */
    function handleBackToTop() {
        const $backToTop = $(".back-to-top");
        if (!$backToTop.length) return;

        if ($window.scrollTop() > 300) {
            $backToTop.stop(true, true).fadeIn("slow");
        } else {
            $backToTop.stop(true, true).fadeOut("slow");
        }
    }

    handleBackToTop();
    $window.on("scroll", handleBackToTop);

    $(".back-to-top").on("click", function (e) {
        e.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, 1200, "easeInOutExpo");
    });

    /* ______________________________ HEADER CAROUSEL ______________________________ */
    function initHeaderCarousel() {
        const $headerCarousel = $(".header-carousel");
        if (!$headerCarousel.length) return;

        if ($headerCarousel.hasClass("owl-loaded")) {
            $headerCarousel.trigger("destroy.owl.carousel");
            $headerCarousel.removeClass("owl-loaded");
            $headerCarousel.find(".owl-stage-outer").children().unwrap();
        }

        $headerCarousel.owlCarousel({
            items: 1,
            loop: true,
            nav: true,
            dots: true,
            autoplay: true,
            autoplayTimeout: 4500,
            autoplayHoverPause: false,
            smartSpeed: 1000,
            fluidSpeed: 1000,
            autoplaySpeed: 1000,
            navSpeed: 1000,
            dragEndSpeed: 1000,
            mouseDrag: true,
            touchDrag: true,
            pullDrag: true,
            rewind: false,
            animateOut: "fadeOut",
            animateIn: "fadeIn",
            navText: [
                '<i class="bi bi-chevron-left"></i>',
                '<i class="bi bi-chevron-right"></i>'
            ]
        });

        $headerCarousel.trigger("play.owl.autoplay", [4500]);
    }

    initHeaderCarousel();

    /* ______________________________ TESTIMONIAL CAROUSEL ______________________________ */
    function initTestimonialCarousel() {
        const $testimonialCarousel = $(".testimonial-carousel");
        if (!$testimonialCarousel.length) return;

        if ($testimonialCarousel.hasClass("owl-loaded")) {
            $testimonialCarousel.trigger("destroy.owl.carousel");
            $testimonialCarousel.removeClass("owl-loaded");
            $testimonialCarousel.find(".owl-stage-outer").children().unwrap();
        }

        $testimonialCarousel.owlCarousel({
            loop: true,
            margin: 24,
            nav: false,
            dots: true,
            center: true,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            smartSpeed: 1000,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                992: {
                    items: 3
                }
            }
        });
    }

    initTestimonialCarousel();

    /* ______________________________ ANNOUNCEMENT MARQUEE SUPPORT ______________________________ */
    function initAnnouncementMarquee() {
        const marquee = document.querySelector(".announcement-marquee-wrap marquee");
        if (!marquee) return;

        marquee.setAttribute("scrollamount", "6");
        marquee.setAttribute("behavior", "scroll");
        marquee.setAttribute("direction", "left");

        marquee.stop && marquee.stop();

        setTimeout(function () {
            marquee.start && marquee.start();
        }, 100);
    }

    initAnnouncementMarquee();
    $window.on("load", initAnnouncementMarquee);

    /* ______________________________ ACTIVE NAV LINK BY PATH ______________________________ */
    function setActiveNavLink() {
        const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
        $(".navbar .nav-link").removeClass("active");

        $(".navbar .nav-link").each(function () {
            const href = $(this).attr("href");
            if (!href || href === "#") return;

            const link = document.createElement("a");
            link.href = href;

            const linkPath = link.pathname.replace(/\/+$/, "") || "/";

            if (linkPath === currentPath) {
                $(this).addClass("active");
            }
        });
    }

    setActiveNavLink();

    /* ______________________________ CLOSE MOBILE NAV ON LINK CLICK ______________________________ */
    $(".navbar-collapse .nav-link").on("click", function () {
        const $navbarCollapse = $(".navbar-collapse");
        const isExpanded = $navbarCollapse.hasClass("show");

        if (isExpanded && window.innerWidth < 1200) {
            const collapseInstance = bootstrap.Collapse.getInstance($navbarCollapse[0]) ||
                new bootstrap.Collapse($navbarCollapse[0], { toggle: false });
            collapseInstance.hide();
        }
    });

    /* ______________________________ REINIT ON RESIZE ______________________________ */
    let resizeTimer;

    $window.on("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            initDropdownHover();
        }, 250);
    });

})(jQuery);