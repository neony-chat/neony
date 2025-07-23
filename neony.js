// Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCbe0rwBF18efdaOiVT4xAwdEm3DkPgeJI",
  authDomain: "neony-chat.firebaseapp.com",
  databaseURL: "https://neony-chat-default-rtdb.firebaseio.com",
  projectId: "neony-chat",
  storageBucket: "neony-chat.appspot.com",
  messagingSenderId: "1036357030418",
  appId: "1:1036357030418:web:498372ed01cc1f53d8becb",
  measurementId: "G-5GZJ4EJDKT"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const chatRef = ref(db, "neony/messages");

const chatContainer = document.getElementById("chat-box");
const inputField = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Scroll to bottom
function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Add message to UI
function appendMessage(sender, text, timestamp) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender === "user" ? "user" : "neony");
  msg.innerHTML = `
    <div class="bubble">${text}</div>
    <div class="timestamp">${new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
  `;
  chatContainer.appendChild(msg);
  scrollToBottom();
}

// Send message to Firebase
function sendMessage(text) {
  const message = {
    sender: "user",
    text: text,
    timestamp: Date.now()
  };
  push(chatRef, message);

  // Fake Neony reply
  setTimeout(() => {
    const reply = {
      sender: "neony",
      text: getNeonyReply(text),
      timestamp: Date.now()
    };
    push(chatRef, reply);
  }, 1000);
}

// Fake AI logic
function getNeonyReply(userText) {
  const replies = [
    "Hmm... that’s interesting! Tell me more.",
    "I’m still learning. Let’s figure it out together!",
    "Why do you think that?",
    "That’s a cool thought!",
    "Can you explain it more?"
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

// Send button
sendBtn.onclick = () => {
  const text = inputField.value.trim();
  if (text) {
    sendMessage(text);
    inputField.value = "";
  }
};

// Enter key triggers send
inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

// Load messages
onChildAdded(chatRef, (data) => {
  const { sender, text, timestamp } = data.val();
  appendMessage(sender, text, timestamp);
});
