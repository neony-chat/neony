const OPENAI_API_KEY = "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";

const chatContainer = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendBtn");

function appendMessage(sender, message) {
  const messageElem = document.createElement("div");
  messageElem.className = sender === "user" ? "user-msg" : "neony-msg";
  messageElem.innerHTML = `<p><strong>${sender === "user" ? "You" : "Neony"}:</strong> ${message}</p>`;
  chatContainer.appendChild(messageElem);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";

  // Show typing effect
  const typingElem = document.createElement("div");
  typingElem.className = "neony-msg";
  typingElem.id = "typing";
  typingElem.innerHTML = `<p><strong>Neony:</strong> <em>Typing...</em></p>`;
  chatContainer.appendChild(typingElem);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I’m not sure how to respond.";

    document.getElementById("typing").remove();
    appendMessage("neony", reply);
  } catch (err) {
    document.getElementById("typing").remove();
    appendMessage("neony", "Oops! Something went wrong. Try again later.");
    console.error(err);
  }
}

// Trigger by button
sendButton.addEventListener("click", sendMessage);

// Trigger by Enter key
userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
