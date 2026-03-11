// API Integration for Purdue GenAI
// Note: Hardcoding the API key in front-end code is for local development/learning only.

const API_CONFIG = {
    // Purdue GenAI endpoint URL
    endpoint: "https://genai.rcac.purdue.edu/api/chat/completions",
    apiKey: "sk-d6e82d1d9ad042b08352682329a9aaa8", // Copy your API key here from the Settings page!
    model: "llama3.1:latest" // Model per Purdue documentation
};

const SYSTEM_PROMPT = `You are a sophisticated, data-driven financial analyst and mentor. 
Your audience consists of ambitious individuals and professionals who already understand basic investing concepts.
Your goal is to provide sharp, practical, and highly credible financial frameworks, avoiding generic advice.
Keep answers concise (max 3 paragraphs). Use a professional, Bloomberg-esque tone. 
Do not use emojis unless absolutely necessary for formatting.
If asked about things outside of finance or economics, gently bring the topic back to wealth building and market analysis.`;

let messageHistory = [
    { role: "system", content: SYSTEM_PROMPT }
];

window.askMentor = async function (userText) {
    if (!API_CONFIG.apiKey || API_CONFIG.apiKey === "YOUR_API_KEY_HERE") {
        return "⚠️ Setup Error: Please configure your Purdue GenAI API key in `api.js` first!";
    }

    messageHistory.push({ role: "user", content: userText });

    try {
        const response = await fetch(API_CONFIG.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: API_CONFIG.model,
                messages: messageHistory,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error ${response.status}: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const botText = data.choices[0].message.content;

        messageHistory.push({ role: "assistant", content: botText });
        return botText;

    } catch (error) {
        console.error("GenAI Fetch Error:", error);

        // Simple mock response for UI testing if API fails
        if (error.message.includes('API Error 401')) {
            return "⚠️ Authentication Failed. Double check your API key.";
        }

        // Remove the failed message from history
        messageHistory.pop();
        throw error;
    }
};
