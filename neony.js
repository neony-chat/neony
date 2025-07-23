const chat = document.getElementById("chat");
const input = document.getElementById("input");

// Load chat history from localStorage
window.onload = () => {
  const history = JSON.parse(localStorage.getItem("chatHistory")) || [];
  history.forEach(({ sender, message }) => {
    addMessage(sender, message);
  });
};

function addMessage(sender, message, isTyping = false) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${sender}`;
  chat.appendChild(bubble);

  if (isTyping) {
    let i = 0;
    const interval = setInterval(() => {
      if (i < message.length) {
        bubble.textContent += message.charAt(i);
        chat.scrollTop = chat.scrollHeight;
        i++;
      } else {
        clearInterval(interval);
        saveMessage(sender, message);
      }
    }, 25);
  } else {
    bubble.textContent = message;
    saveMessage(sender, message);
  }

  chat.scrollTop = chat.scrollHeight;
}

function saveMessage(sender, message) {
  const history = JSON.parse(localStorage.getItem("chatHistory")) || [];
  history.push({ sender, message });
  localStorage.setItem("chatHistory", JSON.stringify(history));
}

function sendMessage() {
  const message = input.value.trim();
  if (message === "") return;

  addMessage("user", message);
  input.value = "";

  // Fake AI typing
  const reply = getBotReply(message);
  setTimeout(() => {
    addMessage("bot", reply, true);
  }, 600);
}

function getBotReply(message) {
  const lower = message.toLowerCase();

  if (lower.includes("hello") || lower.includes("hi")) {
    return "Hey there! How can I help you today?";
  } else if (lower.includes("who are you")) {
    return "I'm Neony — your AI companion, always learning!";
  } else if (lower.includes("bye")) {
    return "Goodbye! Come back soon! 👋";
  }

  return "I'm still learning! Soon I'll be able to chat with real intelligence.";
}

// Send on Enter key
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
