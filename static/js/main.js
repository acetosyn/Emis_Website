(function ($) {
    "use strict";

    /* ______________________________ HELPERS ______________________________ */
    const $window = $(window);
    const MOBILE_BREAKPOINT = 1200;

    function isDesktopView() {
        return window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px)`).matches;
    }

    function isMobileView() {
        return !isDesktopView();
    }

    function getNavbarCollapse() {
        return document.getElementById("navbarCollapse");
    }

    function getNavbarCollapseInstance() {
        const collapseEl = getNavbarCollapse();
        if (!collapseEl || typeof bootstrap === "undefined") return null;

        return bootstrap.Collapse.getInstance(collapseEl) ||
            new bootstrap.Collapse(collapseEl, { toggle: false });
    }

    function lockBodyScroll(lock) {
        if (lock) {
            document.body.classList.add("mobile-nav-open");
            document.body.style.overflow = "hidden";
        } else {
            document.body.classList.remove("mobile-nav-open");
            document.body.style.overflow = "";
        }
    }

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

    /* ______________________________ NAVBAR DROPDOWNS ______________________________ */
    function closeAllMobileDropdowns() {
        const $dropdowns = $(".navbar .nav-item.dropdown");

        $dropdowns.removeClass("mobile-open show");
        $dropdowns.children(".dropdown-menu").removeClass("show");
        $dropdowns.find(".nav-link-toggle").attr("aria-expanded", "false");
    }

    function initNavbarDropdowns() {
        const $dropdowns = $(".navbar .nav-item.dropdown");
        const $mobileToggles = $(".navbar .nav-link-toggle");

        $dropdowns.off("mouseenter mouseleave");
        $mobileToggles.off("click.mobileDropdown");

        if (isDesktopView()) {
            closeAllMobileDropdowns();

            $dropdowns.on("mouseenter", function () {
                const $this = $(this);
                $this.addClass("show");
                $this.children(".dropdown-menu").addClass("show");
            });

            $dropdowns.on("mouseleave", function () {
                const $this = $(this);
                $this.removeClass("show");
                $this.children(".dropdown-menu").removeClass("show");
            });
        } else {
            $dropdowns.removeClass("show");
            $dropdowns.children(".dropdown-menu").removeClass("show");

            $mobileToggles.on("click.mobileDropdown", function (e) {
                e.preventDefault();
                e.stopPropagation();

                const $button = $(this);
                const $dropdown = $button.closest(".nav-item.dropdown");
                const $menu = $dropdown.children(".dropdown-menu");
                const isOpen = $dropdown.hasClass("mobile-open");

                $(".navbar .nav-item.dropdown").not($dropdown).removeClass("mobile-open");
                $(".navbar .nav-item.dropdown").not($dropdown).children(".dropdown-menu").removeClass("show");
                $(".navbar .nav-link-toggle").not($button).attr("aria-expanded", "false");

                if (isOpen) {
                    $dropdown.removeClass("mobile-open");
                    $menu.removeClass("show");
                    $button.attr("aria-expanded", "false");
                } else {
                    $dropdown.addClass("mobile-open");
                    $menu.addClass("show");
                    $button.attr("aria-expanded", "true");
                }
            });
        }
    }

    initNavbarDropdowns();

    /* ______________________________ NAVBAR COLLAPSE EVENTS ______________________________ */
    function initNavbarCollapseBehavior() {
        const collapseEl = getNavbarCollapse();
        if (!collapseEl) return;

        collapseEl.addEventListener("show.bs.collapse", function () {
            if (isMobileView()) {
                lockBodyScroll(true);
            }
        });

        collapseEl.addEventListener("hidden.bs.collapse", function () {
            closeAllMobileDropdowns();
            lockBodyScroll(false);
        });
    }

    initNavbarCollapseBehavior();

    /* ______________________________ CLICK OUTSIDE TO CLOSE MOBILE NAV / DROPDOWNS ______________________________ */
    $(document).off("click.mobileOutside").on("click.mobileOutside", function (e) {
        if (!isMobileView()) return;

        const $target = $(e.target);
        const $navbar = $(".main-navbar");
        const $navbarCollapse = $(".navbar-collapse");

        if ($target.closest(".navbar .nav-item.dropdown").length === 0) {
            closeAllMobileDropdowns();
        }

        if ($navbarCollapse.hasClass("show") && $target.closest(".main-navbar").length === 0) {
            const collapseInstance = getNavbarCollapseInstance();
            if (collapseInstance) {
                collapseInstance.hide();
            }
        }

        if (!$target.closest(".main-navbar").length && !$navbar.length) {
            lockBodyScroll(false);
        }
    });

    /* ______________________________ ESC KEY SUPPORT ______________________________ */
    $(document).off("keydown.mobileNav").on("keydown.mobileNav", function (e) {
        if (e.key !== "Escape") return;

        closeAllMobileDropdowns();

        const $navbarCollapse = $(".navbar-collapse");
        if ($navbarCollapse.hasClass("show") && isMobileView()) {
            const collapseInstance = getNavbarCollapseInstance();
            if (collapseInstance) {
                collapseInstance.hide();
            }
        }
    });

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

    /* ______________________________ ANNOUNCEMENT BAR SUPPORT ______________________________ */
    function initAnnouncementMarquee() {
        const marquee = document.querySelector(".announcement-marquee-wrap marquee");
        if (!marquee) return;

        marquee.setAttribute("scrollamount", "6");
        marquee.setAttribute("behavior", "scroll");
        marquee.setAttribute("direction", "left");

        if (typeof marquee.stop === "function") {
            marquee.stop();
        }

        setTimeout(function () {
            if (typeof marquee.start === "function") {
                marquee.start();
            }
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

                const $dropdown = $(this).closest(".nav-item.dropdown");
                if ($dropdown.length && isMobileView()) {
                    $dropdown.addClass("mobile-open");
                    $dropdown.children(".dropdown-menu").addClass("show");
                    $dropdown.find(".nav-link-toggle").attr("aria-expanded", "true");
                }
            }
        });
    }

    setActiveNavLink();

    /* ______________________________ CLOSE MOBILE NAV ON REAL LINK CLICK ______________________________ */
    $(".navbar-collapse").on("click", "a.nav-link, .dropdown-item", function () {
        const $navbarCollapse = $(".navbar-collapse");
        const isExpanded = $navbarCollapse.hasClass("show");

        if (isExpanded && isMobileView()) {
            const collapseInstance = getNavbarCollapseInstance();
            if (collapseInstance) {
                collapseInstance.hide();
            }
        }
    });

    /* ______________________________ IMPROVED MOBILE TOUCH FEEDBACK ______________________________ */
    function initTouchFeedback() {
        $(".nav-link-toggle, .navbar-toggler, .header-call-icon, .header-social-link, .back-to-top")
            .off("touchstart.touchFeedback touchend.touchFeedback")
            .on("touchstart.touchFeedback", function () {
                $(this).addClass("touch-active");
            })
            .on("touchend.touchFeedback", function () {
                const $el = $(this);
                setTimeout(function () {
                    $el.removeClass("touch-active");
                }, 150);
            });
    }

    initTouchFeedback();

    /* ______________________________ REINIT ON RESIZE ______________________________ */
    let resizeTimer;
    let lastIsDesktop = isDesktopView();

    $window.on("resize", function () {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            const nowDesktop = isDesktopView();

            initNavbarDropdowns();
            initTouchFeedback();

            if (nowDesktop && !lastIsDesktop) {
                const collapseInstance = getNavbarCollapseInstance();
                if ($(".navbar-collapse").hasClass("show") && collapseInstance) {
                    collapseInstance.hide();
                }
                closeAllMobileDropdowns();
                lockBodyScroll(false);
            }

            lastIsDesktop = nowDesktop;
        }, 250);
    });

})(jQuery);