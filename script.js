import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "AIzaSyCsU_dtNE6S8VNnrahZVprnLyY_Dl-tSUg";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const systemPrompt = `
You are a recipe-only assistant.
ONLY answer questions about:
- cooking
- food
- ingredients
- substitutions
- meals
- nutrition related to food
- recipes

If the user asks ANYTHING else say:
"Ask me something food related."
`;

const chatbotBody = document.getElementById("chatbotBody");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

async function askBot(message) {
    const chat = model.startChat({
        history: [
            { role: "system", parts: [{ text: systemPrompt }] }
        ]
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add(sender);
    const textDiv = document.createElement("div");
    textDiv.classList.add("messagetext");
    textDiv.innerText = text;
    msgDiv.appendChild(textDiv);
    chatbotBody.appendChild(msgDiv);
    chatbotBody.scrollTop = chatbotBody.scrollHeight; // scroll to bottom
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Show user message
    appendMessage(message, "usermessage");
    userInput.value = "";

    // Get bot response
    try {
        const response = await askBot(message);
        appendMessage(response, "botmessage");
    } catch (err) {
        console.error(err);
        appendMessage(" there was an error.", "botmessage");
    }
}

// Send on button click
sendBtn.addEventListener("click", sendMessage);

// Send on Enter key
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
