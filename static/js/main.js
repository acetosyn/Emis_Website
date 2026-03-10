(function ($) {
    "use strict";

    /* ______________________________ HELPERS ______________________________ */
    const $window = $(window);
    const $document = $(document);
    const $body = $("body");

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

        if ($window.scrollTop() > 220) {
            $sticky.css("top", "0px");
            $sticky.addClass("navbar-scrolled");
        } else {
            $sticky.css("top", "-100px");
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

        if (window.matchMedia("(min-width: 992px)").matches) {
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
    if ($(".header-carousel").length) {
        $(".header-carousel").owlCarousel({
            items: 1,
            autoplay: true,
            autoplayTimeout: 6000,
            autoplayHoverPause: true,
            smartSpeed: 1200,
            animateOut: "fadeOut",
            loop: true,
            dots: false,
            nav: true,
            mouseDrag: true,
            touchDrag: true,
            pullDrag: false,
            navText: [
                '<i class="bi bi-chevron-left"></i>',
                '<i class="bi bi-chevron-right"></i>'
            ]
        });
    }

    /* ______________________________ TESTIMONIAL CAROUSEL ______________________________ */
    if ($(".testimonial-carousel").length) {
        $(".testimonial-carousel").owlCarousel({
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            smartSpeed: 1000,
            center: true,
            margin: 24,
            dots: true,
            loop: true,
            nav: false,
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

    /* ______________________________ ACTIVE NAV LINK BY PATH ______________________________ */
    function setActiveNavLink() {
        const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
        $(".navbar .nav-link").removeClass("active");

        $(".navbar .nav-link").each(function () {
            const href = $(this).attr("href");
            if (!href) return;

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

        if (isExpanded && window.innerWidth < 992) {
            const collapseInstance = bootstrap.Collapse.getInstance($navbarCollapse[0]) ||
                new bootstrap.Collapse($navbarCollapse[0], { toggle: false });
            collapseInstance.hide();
        }
    });

})(jQuery);