// ✅ neony.js - Final Version (linked to InfinityFree backend)
function appendMessage(content, sender) {
  const chatBox = document.getElementById('chat-box');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;

  const bubble = document.createElement('div');
  bubble.className = `bubble ${sender}`;
  bubble.textContent = content;

  const timestamp = document.createElement('div');
  timestamp.className = 'timestamp';
  timestamp.textContent = new Date().toLocaleTimeString();

  messageDiv.appendChild(bubble);
  messageDiv.appendChild(timestamp);
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function handleSend() {
  const input = document.getElementById('user-input');
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, 'user');
  input.value = '';

  fetch('https://neonychat.free.nf/chatgpt.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userMessage })
  })
    .then(res => res.json())
    .then(data => {
      const reply = data.choices?.[0]?.message?.content || "Neony didn’t understand.";
      appendMessage(reply, 'neony');
    })
    .catch(err => {
      appendMessage("Oops! Something went wrong.", 'neony');
      console.error(err);
    });
}
