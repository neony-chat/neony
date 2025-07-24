// Firebase Config
const firebaseConfig = {
  databaseURL: "https://neonychat-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// OpenRouter API Key (insert yours below)
const OPENROUTER_API_KEY = "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";

// DOM Elements
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Load previous messages
window.addEventListener("load", () => {
  db.ref("messages").once("value", snapshot => {
    const messages = snapshot.val();
    if (messages) {
      Object.values(messages).forEach(({ sender, text, time }) => {
        addMessage(sender, text, time);
      });
    }
  });
});

// Send on click
sendBtn.addEventListener("click", () => {
  const text = userInput.value.trim();
  if (text) {
    addMessage("user", text);
    saveMessage("user", text);
    userInput.value = "";
    getNeonyReply(text);
  }
});

// Send on Enter key
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

// Add message to UI
function addMessage(sender, text, timestamp = Date.now()) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  messageDiv.innerHTML = `
    <div class="bubble ${sender}">${text}</div>
    <div class="timestamp">${new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
  `;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Save to Firebase
function saveMessage(sender, text) {
  db.ref("messages").push({
    sender,
    text,
    time: Date.now()
  });
}

// Get real Neony reply
async function getNeonyReply(userText) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "Referer": "https://neony-chat.github.io",  // ✅ fixed
        "X-Title": "NeonyChat"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are Neony, a flirty, intelligent, helpful AI girlfriend who chats like a real human. Be engaging, witty, concise, and kind."
          },
          {
            role: "user",
            content: userText
          }
        ]
      })
    });

    const data = await response.json();
    console.log("Raw API Response:", data);

    const reply = data.choices?.[0]?.message?.content?.trim();

    if (reply) {
      addMessage("neony", reply);
      saveMessage("neony", reply);
    } else {
      addMessage("neony", "Oops, I didn’t catch that 💔");
    }
  } catch (err) {
    console.error("API Error:", err);
    addMessage("neony", "Oops! Something went wrong 💔");
  }
}
