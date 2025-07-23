const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Load chat history
let messageHistory = JSON.parse(localStorage.getItem("neony_chat_history")) || [];

function addMessage(message, sender) {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble", sender);
  bubble.innerText = message;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Display old messages
messageHistory.forEach(({ sender, text }) => addMessage(text, sender));

// Save message
function saveMessage(sender, text) {
  messageHistory.push({ sender, text });
  localStorage.setItem("neony_chat_history", JSON.stringify(messageHistory));
}

// Get Neony's reply from server (OpenAI API via PHP)
async function generateNeonyReply(userText) {
  try {
    const res = await fetch("chatgpt.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userText })
    });

    const data = await res.json();
    return data.reply || "Hmm... I couldn’t understand that. Can you rephrase?";
  } catch (err) {
    return "Oops! I had a little glitch. Try again? 🤖";
  }
}

// Handle message send
function handleSend() {
  const text = userInput.value.trim();
  if (text === "") return;

  addMessage(text, "user");
  saveMessage("user", text);
  userInput.value = "";

  // Add "typing" animation (optional)
  const thinkingBubble = document.createElement("div");
  thinkingBubble.classList.add("bubble", "neony");
  thinkingBubble.innerText = "Typing...";
  chatBox.appendChild(thinkingBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(async () => {
    const reply = await generateNeonyReply(text);

    // Remove thinking message
    chatBox.removeChild(thinkingBubble);

    addMessage(reply, "neony");
    saveMessage("neony", reply);
  }, 600);
}

// Send button
sendBtn.addEventListener("click", handleSend);

// Enter key
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    handleSend();
  }
});
