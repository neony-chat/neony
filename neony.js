// Firebase Config
const firebaseConfig = {
  databaseURL: "https://neonychat-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

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

// Get real Neony reply securely
async function getNeonyReply(userText) {
  try {
    const response = await fetch("chatgpt.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user: userText })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (reply) {
      addMessage("neony", reply);
      saveMessage("neony", reply);
    } else {
      addMessage("neony", "Oops, I didn’t catch that 💔");
    }
  } catch (err) {
    console.error("Chat Error:", err);
    addMessage("neony", "Oops! Something went wrong 💔");
  }
}
