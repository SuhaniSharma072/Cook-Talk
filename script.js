
const chatBody = document.querySelector("#chatbotBody");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#sendBtn");

const API_KEY = "AIzaSyAwtlJe-eFht3SgeXsl58oqJJDfA2kbJIs";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const userData = { message: null };

const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add(...classes);
  div.innerHTML = content;
  return div;
}

const generateBotResponse = async (incomingMessageDiv) => {
  const messageText = incomingMessageDiv.querySelector(".messagetext");

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
body: JSON.stringify({
  contents: [
    { parts: [{ text: `You are a  cooking assistant. Only answer questions about recipes, ingredients, cooking, or food. If the user asks something unrelated, respond with "I can only answer food and recipe questions." User asks: "${userData.message}"` }] }
  ]
})

  }

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    const apiResponseText = data.candidates[0].content.parts[0].text.trim();
    messageText.innerText = apiResponseText;
    chatBody.scrollTop = chatBody.scrollHeight; 
  } catch (error) {
    messageText.innerText = "error.";
    console.error(error);
  }
}

const handleOutgoingMessage = (e) => {
  e.preventDefault();

  userData.message = messageInput.value.trim();
  if (!userData.message) return;

  const messageContent = `<div class="messagetext"></div>`;
  const outgoingMessageDiv = createMessageElement(messageContent, "usermessage");
  outgoingMessageDiv.querySelector(".messagetext").textContent = userData.message;
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;

  messageInput.value = "";

  setTimeout(() => {
    const incomingMessageDiv = createMessageElement(`<div class="messagetext">...</div>`, "botmessage");
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    generateBotResponse(incomingMessageDiv);
  }, 600);
}
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && messageInput.value.trim()) {
    e.preventDefault();
    handleOutgoingMessage(e);
  }
});
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
