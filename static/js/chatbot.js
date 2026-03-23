document.addEventListener("DOMContentLoaded", function () {
    const chatToggle = document.getElementById("emisChatToggle");
    const chatPanel = document.getElementById("emisChatPanel");
    const chatClose = document.getElementById("emisChatClose");
    const chatMinimize = document.getElementById("emisChatMinimize");
    const chatForm = document.getElementById("emisChatForm");
    const chatInput = document.getElementById("emisChatInput");
    const chatSend = document.getElementById("emisChatSend");

    if (!chatToggle || !chatPanel) {
        return;
    }

    function openChat() {
        chatPanel.classList.add("is-open");
        chatPanel.setAttribute("aria-hidden", "false");
        chatPanel.setAttribute("data-state", "open");
        document.body.classList.add("chatbot-open");

        window.setTimeout(function () {
            if (chatInput) {
                chatInput.focus();
            }
        }, 180);
    }

    function closeChat() {
        chatPanel.classList.remove("is-open");
        chatPanel.setAttribute("aria-hidden", "true");
        chatPanel.setAttribute("data-state", "closed");
        document.body.classList.remove("chatbot-open");
    }

    function updateSendState() {
        if (!chatInput || !chatSend) {
            return;
        }

        const hasText = chatInput.value.trim().length > 0;
        chatSend.classList.toggle("is-active", hasText);
    }

    function autoResizeTextarea() {
        if (!chatInput) {
            return;
        }

        chatInput.style.height = "auto";
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";
    }

    chatToggle.addEventListener("click", function () {
        const isOpen = chatPanel.classList.contains("is-open");

        if (isOpen) {
            closeChat();
        } else {
            openChat();
        }
    });

    if (chatClose) {
        chatClose.addEventListener("click", closeChat);
    }

    if (chatMinimize) {
        chatMinimize.addEventListener("click", closeChat);
    }

    if (chatInput) {
        chatInput.addEventListener("input", function () {
            autoResizeTextarea();
            updateSendState();
        });

        chatInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
            }
        });
    }

    if (chatForm) {
        chatForm.addEventListener("submit", function (event) {
            event.preventDefault();
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && chatPanel.classList.contains("is-open")) {
            closeChat();
        }
    });

    updateSendState();
    autoResizeTextarea();
});