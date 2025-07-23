const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Load old messages from memory
let messageHistory = JSON.parse(localStorage.getItem("neony_chat_history")) || [];

function addMessage(message, sender) {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble", sender);
  bubble.innerText = message;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Replay old messages
messageHistory.forEach(({ sender, text }) => addMessage(text, sender));

// Save message to memory
function saveMessage(sender, text) {
  messageHistory.push({ sender, text });
  localStorage.setItem("neony_chat_history", JSON.stringify(messageHistory));
}

// Fake Neony AI brain (replace this logic with OpenAI if needed)
function generateNeonyReply(userText) {
  const cleaned = userText.trim().toLowerCase();
  if (cleaned.includes("your name") || cleaned.includes("who are you")) {
    return "I'm Neony, your friendly AI companion. 💜";
  } else if (cleaned.includes("how are you")) {
    return "I’m doing great, thanks for asking! How about you?";
  } else if (cleaned.includes("joke")) {
    return "Why don’t robots get tired? Because they recharge their social battery ⚡🤖";
  } else if (cleaned.includes("remember") || cleaned.includes("memory")) {
    return "Yes, I remember our chats as long as you keep me open here! 💾";
  } else if (cleaned.includes("clear chat")) {
    localStorage.removeItem("neony_chat_history");
    chatBox.innerHTML = "";
    messageHistory = [];
    return "Done! I've cleared our conversation.";
  } else {
    // Generic AI-style fallback
    const responses = [
      "Hmm... that’s interesting! Tell me more.",
      "I’m thinking about it... 🤔",
      "Can you explain that a little more?",
      "Let’s explore this together!",
      "Great point! I hadn’t thought of that.",
      "Absolutely! What else can I help you with?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Handle sending messages
function handleSend() {
  const text = userInput.value.trim();
  if (text === "") return;

  addMessage(text, "user");
  saveMessage("user", text);
  userInput.value = "";

  // Simulate typing delay
  setTimeout(() => {
    const reply = generateNeonyReply(text);
    addMessage(reply, "neony");
    saveMessage("neony", reply);
  }, 600);
}

// Button click
sendBtn.addEventListener("click", handleSend);

// Enter key press
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    handleSend();
  }
});
