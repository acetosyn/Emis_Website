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

    if (!chatToggle || !chatPanel || !chatMessages || !chatInput) {
        return;
    }

    const BOT_AVATAR = "/static/images/hijab.png";
    const USER_AVATAR = "/static/images/student.png";
    const FALLBACK_AVATAR = "/static/images/emis3.png";
    const STORAGE_KEY = "emis_chat_history_v1";

    // Increase this for slower typing
    const TYPEWRITER_SPEED = 38;
    const TYPEWRITER_PUNCTUATION_DELAY = 90;
    const TYPEWRITER_SPACE_DELAY = 8;

    let isRequestInProgress = false;
    let chatHistory = loadChatHistory();

    function loadChatHistory() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return [];
            }

            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    function saveChatHistory() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
        } catch (error) {
            // Ignore storage errors silently
        }
    }

    function openChat() {
        chatPanel.classList.add("is-open");
        chatPanel.setAttribute("aria-hidden", "false");
        chatPanel.setAttribute("data-state", "open");
        document.body.classList.add("chatbot-open");

        window.setTimeout(function () {
            chatInput.focus();
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
        if (!chatSend || !chatInput) {
            return;
        }

        const hasText = chatInput.value.trim().length > 0;
        chatSend.classList.toggle("is-active", hasText && !isRequestInProgress);
        chatSend.disabled = !hasText || isRequestInProgress;
    }

    function autoResizeTextarea() {
        chatInput.style.height = "auto";
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";
    }

    function resetTextarea() {
        chatInput.value = "";
        chatInput.style.height = "auto";
        updateSendState();
    }

    function scrollToBottom() {
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
            this.src = FALLBACK_AVATAR;
        };
        return img;
    }

    function createBubbleWrap(message, timeText, isHTML) {
        const bubbleWrap = document.createElement("div");
        bubbleWrap.className = "emis-chat-bubble-wrap";

        const bubble = document.createElement("div");
        bubble.className = "emis-chat-bubble";

        if (isHTML) {
            bubble.innerHTML = message;
        } else {
            bubble.textContent = message;
        }

        const time = document.createElement("div");
        time.className = "emis-chat-time";
        time.textContent = timeText || getCurrentTime();

        bubbleWrap.appendChild(bubble);
        bubbleWrap.appendChild(time);

        return bubbleWrap;
    }

    function createBotMessageElements(options) {
        options = options || {};

        const messageRow = document.createElement("div");
        messageRow.className = "emis-chat-message emis-chat-message-bot";

        const avatar = createAvatar(BOT_AVATAR, "EMIS Bot Avatar");
        const bubbleWrap = document.createElement("div");
        bubbleWrap.className = "emis-chat-bubble-wrap";

        const bubble = document.createElement("div");
        bubble.className = "emis-chat-bubble";

        const time = document.createElement("div");
        time.className = "emis-chat-time";
        time.textContent = options.timeText || "Just now";

        bubbleWrap.appendChild(bubble);
        bubbleWrap.appendChild(time);

        messageRow.appendChild(avatar);
        messageRow.appendChild(bubbleWrap);

        chatMessages.appendChild(messageRow);
        scrollToBottom();

        return {
            row: messageRow,
            bubbleWrap: bubbleWrap,
            bubble: bubble,
            time: time
        };
    }

    function appendBotMessage(message, options) {
        options = options || {};

        const elements = createBotMessageElements({
            timeText: options.timeText || "Just now"
        });

        if (options.isHTML) {
            elements.bubble.innerHTML = message;
        } else {
            elements.bubble.textContent = message;
        }

        scrollToBottom();
        return elements;
    }

    function appendUserMessage(message, options) {
        options = options || {};

        const messageRow = document.createElement("div");
        messageRow.className = "emis-chat-message emis-chat-message-user";

        const bubbleWrap = createBubbleWrap(
            message,
            options.timeText || "Just now",
            false
        );
        const avatar = createAvatar(USER_AVATAR, "User Avatar");

        messageRow.appendChild(bubbleWrap);
        messageRow.appendChild(avatar);

        chatMessages.appendChild(messageRow);
        scrollToBottom();
    }

    function appendTypingIndicator() {
        const existing = document.getElementById("emisTypingIndicator");
        if (existing) {
            existing.remove();
        }

        const typingRow = document.createElement("div");
        typingRow.className = "emis-chat-message emis-chat-message-bot";
        typingRow.id = "emisTypingIndicator";

        const avatar = createAvatar(BOT_AVATAR, "EMIS Bot Avatar");

        const bubbleWrap = document.createElement("div");
        bubbleWrap.className = "emis-chat-bubble-wrap";

        const bubble = document.createElement("div");
        bubble.className = "emis-chat-bubble emis-chat-bubble-typing";
        bubble.innerHTML = "<span>Typing</span><span class='emis-dot'>.</span><span class='emis-dot'>.</span><span class='emis-dot'>.</span>";

        const time = document.createElement("div");
        time.className = "emis-chat-time";
        time.textContent = "Just now";

        bubbleWrap.appendChild(bubble);
        bubbleWrap.appendChild(time);

        typingRow.appendChild(avatar);
        typingRow.appendChild(bubbleWrap);

        chatMessages.appendChild(typingRow);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingRow = document.getElementById("emisTypingIndicator");
        if (typingRow) {
            typingRow.remove();
        }
    }

    function setLoadingState(loading) {
        isRequestInProgress = loading;

        if (chatSend) {
            chatSend.disabled = loading || !chatInput.value.trim();
        }

        if (loading) {
            chatInput.setAttribute("aria-busy", "true");
        } else {
            chatInput.removeAttribute("aria-busy");
        }

        updateSendState();
    }

    function escapeHTML(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    function formatReplyHTML(text) {
        if (!text) {
            return "Sorry, I couldn’t process that request right now 😊";
        }

        return escapeHTML(text).replace(/\n/g, "<br>");
    }

    function buildRequestHistory() {
        return chatHistory.slice(-8);
    }

    async function sendMessageToBackend(message) {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message,
                history: buildRequestHistory()
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.reply || "Unable to reach chatbot backend.");
        }

        return data;
    }

    function delay(ms) {
        return new Promise(function (resolve) {
            window.setTimeout(resolve, ms);
        });
    }

    function getCharacterDelay(char) {
        if (char === " ") {
            return TYPEWRITER_SPACE_DELAY;
        }

        if (char === "." || char === "," || char === "!" || char === "?" || char === ":" || char === ";") {
            return TYPEWRITER_PUNCTUATION_DELAY;
        }

        return TYPEWRITER_SPEED;
    }

    async function typeWriterBotMessage(text, options) {
        options = options || {};

        const elements = createBotMessageElements({
            timeText: options.timeText || "Just now"
        });

        const lines = String(text || "").split("\n");

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            if (lineIndex > 0) {
                elements.bubble.appendChild(document.createElement("br"));
                scrollToBottom();
                await delay(60);
            }

            const textNode = document.createTextNode("");
            elements.bubble.appendChild(textNode);

            const line = lines[lineIndex];

            for (let i = 0; i < line.length; i++) {
                textNode.textContent += line[i];
                scrollToBottom();
                await delay(getCharacterDelay(line[i]));
            }
        }

        return elements;
    }

    async function handleSendMessage() {
        const message = chatInput.value.trim();

        if (!message || isRequestInProgress) {
            updateSendState();
            return;
        }

        appendUserMessage(message);
        chatHistory.push({
            role: "user",
            content: message
        });
        saveChatHistory();

        resetTextarea();
        setLoadingState(true);
        appendTypingIndicator();

        try {
            const data = await sendMessageToBackend(message);
            removeTypingIndicator();

            const botReply = data.reply || "Sorry, I could not get a response right now 😊";

            await typeWriterBotMessage(botReply, {
                timeText: "Just now"
            });

            chatHistory.push({
                role: "assistant",
                content: botReply
            });
            saveChatHistory();
        } catch (error) {
            removeTypingIndicator();

            const fallbackText =
                "Sorry, the EMIS assistant is having trouble right now 😊\n\n" +
                "Please contact us directly:\n" +
                "📞 08054464613\n" +
                "📞 08172022402\n" +
                "📧 adetomi.epitomeschools@gmail.com";

            await typeWriterBotMessage(fallbackText, {
                timeText: "Just now"
            });

            chatHistory.push({
                role: "assistant",
                content: fallbackText
            });
            saveChatHistory();
        } finally {
            setLoadingState(false);
        }
    }

    function showFeatureNotice(featureName) {
        appendBotMessage(featureName + " feature will be available soon 😊");
    }

    function renderStoredMessages() {
        if (!chatHistory.length) {
            return;
        }

        chatMessages.innerHTML = "";

        chatHistory.forEach(function (item) {
            if (item.role === "user") {
                appendUserMessage(item.content, {
                    timeText: getCurrentTime()
                });
            } else if (item.role === "assistant") {
                appendBotMessage(formatReplyHTML(item.content), {
                    isHTML: true,
                    timeText: getCurrentTime()
                });
            }
        });
    }

    function addWelcomeMessageIfEmpty() {
        if (chatHistory.length > 0) {
            return;
        }

        const welcomeText =
            "Assalamu alaikum 😊\n\n" +
            "Welcome to EMIS Assistant. I can help you with:\n" +
            "📚 Programs and classes\n" +
            "📝 Admission and registration enquiries\n" +
            "🕌 Tahfeez and Islamiyyah\n" +
            "🕒 School hours\n" +
            "📍 Location and contact details\n\n" +
            "How may I help you today?";

        appendBotMessage(formatReplyHTML(welcomeText), {
            isHTML: true,
            timeText: "Just now"
        });

        chatHistory.push({
            role: "assistant",
            content: welcomeText
        });
        saveChatHistory();
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
            chatInput.value += " 😊";
            autoResizeTextarea();
            updateSendState();
            chatInput.focus();
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

    renderStoredMessages();
    addWelcomeMessageIfEmpty();
    updateSendState();
    autoResizeTextarea();
    scrollToBottom();
});