// neony.js — FINAL WORKING VERSION

// Firebase Initialization
const firebaseConfig = {
  databaseURL: "https://neonychat-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// OpenRouter API Key
const OPENROUTER_API_KEY = "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";

// DOM Elements
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Load old messages from Firebase
window.addEventListener("load", () => {
  db.ref("messages").once("value", snapshot => {
    const msgs = snapshot.val();
    if (msgs) {
      Object.values(msgs).forEach(({ sender, text }) => {
        addMessage(sender, text);
      });
    }
  });
});

// Send message on click
sendBtn.addEventListener("click", () => {
  const text = userInput.value.trim();
  if (text) {
    addMessage("user", text);
    saveMessage("user", text);
    userInput.value = "";
    getNeonyReply(text);
  }
});

// Send message on Enter key
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

// Add message to chat window
function addMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  msgDiv.innerHTML = `
    <div class="bubble ${sender}">${text}</div>
    <div class="timestamp">${new Date().toLocaleTimeString()}</div>
  `;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Save message to Firebase
function saveMessage(sender, text) {
  db.ref("messages").push({ sender, text, time: Date.now() });
}

// Get reply from Neony via OpenRouter API
async function getNeonyReply(userMsg) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are Neony, a flirty, intelligent, helpful AI girl who chats naturally like a human girlfriend. Keep responses engaging, real, witty, and concise."
          },
          {
            role: "user",
            content: userMsg
          }
        ]
      })
    });

    const data = await response.json();
    console.log("Raw API Response:", data);

    const neonyReply = data.choices?.[0]?.message?.content || "Sorry, I didn’t catch that.";
    addMessage("neony", neonyReply);
    saveMessage("neony", neonyReply);

  } catch (err) {
    console.error("API Error:", err);
    addMessage("neony", "Oops! Something went wrong 💔");
  }
}
