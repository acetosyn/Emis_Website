document.addEventListener("DOMContentLoaded", function () {
    const chatToggle = document.getElementById("emisChatToggle");
    const chatPanel = document.getElementById("emisChatPanel");
    const chatClose = document.getElementById("emisChatClose");
    const chatMinimize = document.getElementById("emisChatMinimize");
    const chatMore = document.getElementById("emisChatMore");

    const chatForm = document.getElementById("emisChatForm");
    const chatInput = document.getElementById("emisChatInput");
    const chatSend = document.getElementById("emisChatSend");
    const chatMessages = document.getElementById("emisChatMessages");

    const chatAttach = document.getElementById("emisChatAttach");
    const chatEmoji = document.getElementById("emisChatEmoji");
    const chatGif = document.getElementById("emisChatGif");
    const chatMic = document.getElementById("emisChatMic");

    if (!chatToggle || !chatPanel) {
        return;
    }

    const BOT_AVATAR = "static/images/hijab.png";
    const USER_AVATAR = "static/images/student.png";

    function openChat() {
        chatPanel.classList.add("is-open");
        chatPanel.setAttribute("aria-hidden", "false");
        chatPanel.setAttribute("data-state", "open");
        document.body.classList.add("chatbot-open");

        window.setTimeout(function () {
            if (chatInput) {
                chatInput.focus();
            }
            scrollToBottom();
        }, 180);
    }

    function closeChat() {
        chatPanel.classList.remove("is-open");
        chatPanel.setAttribute("aria-hidden", "true");
        chatPanel.setAttribute("data-state", "closed");
        document.body.classList.remove("chatbot-open");
    }

    function toggleChat() {
        if (chatPanel.classList.contains("is-open")) {
            closeChat();
        } else {
            openChat();
        }
    }

    function updateSendState() {
        if (!chatInput || !chatSend) {
            return;
        }

        const hasText = chatInput.value.trim().length > 0;
        chatSend.classList.toggle("is-active", hasText);
        chatSend.disabled = !hasText;
    }

    function autoResizeTextarea() {
        if (!chatInput) {
            return;
        }

        chatInput.style.height = "auto";
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";
    }

    function resetTextarea() {
        if (!chatInput) {
            return;
        }

        chatInput.value = "";
        chatInput.style.height = "auto";
        updateSendState();
    }

    function scrollToBottom() {
        if (!chatMessages) {
            return;
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });
    }

    function createAvatar(src, alt) {
        const img = document.createElement("img");
        img.src = src;
        img.alt = alt;
        img.className = "emis-chat-avatar";
        img.onerror = function () {
            this.src = "static/images/emis3.png";
        };
        return img;
    }

    function createBubbleWrap(message, timeText) {
        const bubbleWrap = document.createElement("div");
        bubbleWrap.className = "emis-chat-bubble-wrap";

        const bubble = document.createElement("div");
        bubble.className = "emis-chat-bubble";
        bubble.textContent = message;

        const time = document.createElement("div");
        time.className = "emis-chat-time";
        time.textContent = timeText || getCurrentTime();

        bubbleWrap.appendChild(bubble);
        bubbleWrap.appendChild(time);

        return bubbleWrap;
    }

    function appendBotMessage(message) {
        if (!chatMessages) {
            return;
        }

        const messageRow = document.createElement("div");
        messageRow.className = "emis-chat-message emis-chat-message-bot";

        const avatar = createAvatar(BOT_AVATAR, "Bot Avatar");
        const bubbleWrap = createBubbleWrap(message, "Just now");

        messageRow.appendChild(avatar);
        messageRow.appendChild(bubbleWrap);

        chatMessages.appendChild(messageRow);
        scrollToBottom();
    }

    function appendUserMessage(message) {
        if (!chatMessages) {
            return;
        }

        const messageRow = document.createElement("div");
        messageRow.className = "emis-chat-message emis-chat-message-user";

        const bubbleWrap = createBubbleWrap(message, "Just now");
        const avatar = createAvatar(USER_AVATAR, "User Avatar");

        messageRow.appendChild(bubbleWrap);
        messageRow.appendChild(avatar);

        chatMessages.appendChild(messageRow);
        scrollToBottom();
    }

    function showTemporaryBotReply(message) {
        window.setTimeout(function () {
            appendBotMessage(message);
        }, 500);
    }

    function handleSendMessage() {
        if (!chatInput) {
            return;
        }

        const message = chatInput.value.trim();

        if (!message) {
            updateSendState();
            return;
        }

        appendUserMessage(message);
        resetTextarea();

        showTemporaryBotReply("Thanks for your message. EMIS chatbot backend will be connected soon.");
    }

    function showFeatureNotice(featureName) {
        appendBotMessage(featureName + " feature will be connected soon.");
    }

    chatToggle.addEventListener("click", toggleChat);

    if (chatClose) {
        chatClose.addEventListener("click", function () {
            closeChat();
        });
    }

    if (chatMinimize) {
        chatMinimize.addEventListener("click", function () {
            closeChat();
        });
    }

    if (chatMore) {
        chatMore.addEventListener("click", function () {
            showFeatureNotice("More options");
        });
    }

    if (chatInput) {
        chatInput.addEventListener("input", function () {
            autoResizeTextarea();
            updateSendState();
        });

        chatInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage();
            }
        });

        chatInput.addEventListener("focus", function () {
            if (!chatPanel.classList.contains("is-open")) {
                openChat();
            }
        });
    }

    if (chatForm) {
        chatForm.addEventListener("submit", function (event) {
            event.preventDefault();
            handleSendMessage();
        });
    }

    if (chatSend) {
        chatSend.addEventListener("click", function (event) {
            event.preventDefault();
            handleSendMessage();
        });
    }

    if (chatAttach) {
        chatAttach.addEventListener("click", function () {
            showFeatureNotice("Attachment");
        });
    }

    if (chatEmoji) {
        chatEmoji.addEventListener("click", function () {
            if (chatInput) {
                chatInput.value += "😊";
                autoResizeTextarea();
                updateSendState();
                chatInput.focus();
            }
        });
    }

    if (chatGif) {
        chatGif.addEventListener("click", function () {
            showFeatureNotice("GIF");
        });
    }

    if (chatMic) {
        chatMic.addEventListener("click", function () {
            showFeatureNotice("Voice input");
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && chatPanel.classList.contains("is-open")) {
            closeChat();
        }
    });

    document.addEventListener("click", function (event) {
        const clickedInsidePanel = chatPanel.contains(event.target);
        const clickedToggle = chatToggle.contains(event.target);

        if (
            chatPanel.classList.contains("is-open") &&
            !clickedInsidePanel &&
            !clickedToggle
        ) {
            closeChat();
        }
    });

    updateSendState();
    autoResizeTextarea();
    scrollToBottom();
});