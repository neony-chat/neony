// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCbe0rwBF18efdaOiVT4xAwdEm3DkPgeJI",
  authDomain: "neony-chat.firebaseapp.com",
  databaseURL: "https://neony-chat-default-rtdb.firebaseio.com",
  projectId: "neony-chat",
  storageBucket: "neony-chat.firebasestorage.app",
  messagingSenderId: "1036357030418",
  appId: "1:1036357030418:web:498372ed01cc1f53d8becb",
  measurementId: "G-5GZJ4EJDKT"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const chatRef = db.ref("neony/messages");

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(text, sender) {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble", sender);
  bubble.innerText = text;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function saveMessage(sender, text) {
  chatRef.push({ sender, text });
}

function generateNeonyReply(userText) {
  const cleaned = userText.trim().toLowerCase();
  if (cleaned.includes("your name") || cleaned.includes("who are you")) {
    return "I'm Neony, your friendly AI companion. 💜";
  } else if (cleaned.includes("how are you")) {
    return "I’m doing great, thanks for asking! How about you?";
  } else if (cleaned.includes("joke")) {
    return "Why don’t robots get tired? Because they recharge their social battery ⚡🤖";
  } else if (cleaned.includes("remember") || cleaned.includes("memory")) {
    return "Yes, I remember everything from the cloud now! ☁️🧠";
  } else if (cleaned.includes("clear chat")) {
    chatRef.remove();
    chatBox.innerHTML = "";
    return "Chat history cleared from cloud and memory!";
  } else {
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

function handleSend() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  saveMessage("user", text);
  userInput.value = "";

  setTimeout(() => {
    const reply = generateNeonyReply(text);
    addMessage(reply, "neony");
    saveMessage("neony", reply);
  }, 600);
}

// Load history from Firebase on start
chatRef.on("child_added", (snapshot) => {
  const { sender, text } = snapshot.val();
  addMessage(text, sender);
});

sendBtn.addEventListener("click", handleSend);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSend();
});
