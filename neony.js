const chatBox = document.querySelector(".chat-box");
const input = document.querySelector("#user-input");
const sendBtn = document.querySelector("#send-btn");

let memory = JSON.parse(localStorage.getItem("neonyMemory")) || [];

function appendMessage(sender, text) {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble", sender);
  chatBox.appendChild(bubble);

  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      bubble.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(interval);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, 25);
}

function handleUserMessage() {
  const userInput = input.value.trim();
  if (!userInput) return;

  appendMessage("user", userInput);
  input.value = "";

  setTimeout(() => {
    const reply = getFakeResponse(userInput);
    appendMessage("neony", reply);

    memory.push({ you: userInput, neony: reply });
    localStorage.setItem("neonyMemory", JSON.stringify(memory));
  }, 600);
}

function getFakeResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes("hello")) return "Hey there! 😊";
  if (lower.includes("name")) return "I’m Neony — your AI companion!";
  if (lower.includes("how are you")) return "I’m glowing, thanks for asking!";
  return "Hmm... I’m still learning. Let’s figure it out together!";
}

// Event Listeners
sendBtn.addEventListener("click", handleUserMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleUserMessage();
  }
});

// Load previous memory
memory.forEach((m) => {
  appendMessage("user", m.you);
  appendMessage("neony", m.neony);
});
