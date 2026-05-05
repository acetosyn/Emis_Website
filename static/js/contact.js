/************************************************************
 * EMIS Contact Page
 * Dynamic Call / WhatsApp Contact Selector
 ************************************************************/

document.addEventListener("DOMContentLoaded", function () {
    const triggers = document.querySelectorAll("[data-contact-trigger]");
    const backdrop = document.getElementById("contactChoiceBackdrop");
    const panel = document.getElementById("contactChoicePanel");
    const closeBtn = document.getElementById("contactChoiceClose");

    const badge = document.getElementById("contactChoiceBadge");
    const title = document.getElementById("contactChoiceTitle");
    const text = document.getElementById("contactChoiceText");
    const choiceItems = document.querySelectorAll(".contact-choice-item");

    if (!backdrop || !panel || !closeBtn || !badge || !title || !text) {
        return;
    }

    const contactContent = {
        call: {
            iconClass: "fa fa-phone-alt",
            badgeText: "Call Contact",
            title: "Who would you like to call?",
            text: "Select the appropriate school contact below to place a direct call.",
            linkType: "call"
        },
        whatsapp: {
            iconClass: "fab fa-whatsapp",
            badgeText: "WhatsApp Contact",
            title: "Who would you like to message?",
            text: "Select the appropriate school contact below to start a WhatsApp chat.",
            linkType: "whatsapp"
        }
    };

    function updateChoiceLinks(linkType) {
        choiceItems.forEach(function (item) {
            const callLink = item.getAttribute("data-call-link");
            const whatsappLink = item.getAttribute("data-whatsapp-link");

            if (linkType === "whatsapp") {
                if (whatsappLink) {
                    item.setAttribute("href", whatsappLink);
                    item.setAttribute("target", "_blank");
                    item.setAttribute("rel", "noopener noreferrer");
                }
            } else {
                if (callLink) {
                    item.setAttribute("href", callLink);
                    item.removeAttribute("target");
                    item.removeAttribute("rel");
                }
            }
        });
    }

    function openContactPanel(type) {
        const selectedType = contactContent[type] || contactContent.call;

        badge.innerHTML = `<i class="${selectedType.iconClass}"></i> ${selectedType.badgeText}`;
        title.textContent = selectedType.title;
        text.textContent = selectedType.text;

        updateChoiceLinks(selectedType.linkType);

        backdrop.classList.add("active");
        panel.classList.add("active");
        panel.setAttribute("aria-hidden", "false");
        document.body.classList.add("contact-choice-open");

        setTimeout(function () {
            closeBtn.focus();
        }, 250);
    }

    function closeContactPanel() {
        backdrop.classList.remove("active");
        panel.classList.remove("active");
        panel.setAttribute("aria-hidden", "true");
        document.body.classList.remove("contact-choice-open");
    }

    triggers.forEach(function (trigger) {
        trigger.addEventListener("click", function () {
            const type = trigger.getAttribute("data-contact-trigger");
            openContactPanel(type);
        });
    });

    closeBtn.addEventListener("click", closeContactPanel);
    backdrop.addEventListener("click", closeContactPanel);

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && panel.classList.contains("active")) {
            closeContactPanel();
        }
    });

    choiceItems.forEach(function (item) {
        item.addEventListener("click", function () {
            setTimeout(closeContactPanel, 300);
        });
    });
});