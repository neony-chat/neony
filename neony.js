// ✅ Firebase Config (replace if using your own)
const firebaseConfig = {
  databaseURL: "https://neony-chat-default-rtdb.firebaseio.com/"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const chatRef = db.ref("chats");

// ✅ Elements
const inputField = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");

// ✅ Send message
sendBtn.addEventListener("click", sendMessage);
inputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const message = inputField.value.trim();
  if (message === "") return;

  const timestamp = Date.now();
  const newMsg = {
    sender: "user",
    text: message,
    time: timestamp
  };

  // Save user message
  chatRef.push(newMsg);

  inputField.value = "";
}

// ✅ Auto scroll to bottom
function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ✅ Display message
function displayMessage(data) {
  const msg = data.val();
  const bubble = document.createElement("div");
  bubble.className = `message ${msg.sender}`;

  const textDiv = document.createElement("div");
  textDiv.className = `bubble ${msg.sender}`;
  textDiv.textContent = msg.text;

  const time = new Date(msg.time);
  const timestamp = document.createElement("div");
  timestamp.className = "timestamp";
  timestamp.textContent = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  bubble.appendChild(textDiv);
  bubble.appendChild(timestamp);

  chatBox.appendChild(bubble);
  scrollToBottom();

  // If user sends a message, reply as Neony
  if (msg.sender === "user") {
    setTimeout(() => {
      const reply = {
        sender: "neony",
        text: getNeonyReply(msg.text),
        time: Date.now()
      };
      chatRef.push(reply);
    }, 1000);
  }
}

// ✅ Auto response generator
function getNeonyReply(userMsg) {
  const lower = userMsg.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi")) return "Hey there! 😊";
  if (lower.includes("how are you")) return "I'm glowing as always. How about you?";
  if (lower.includes("bye")) return "Talk soon! 💜";
  return "I'm here, tell me more!";
}

// ✅ Load existing messages
chatRef.on("child_added", displayMessage);
