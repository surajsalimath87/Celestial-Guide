import { generateSystemPrompt } from './prompts';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function fetchTacticalForecast(date, apiKey) {
    const finalApiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;

    const systemPrompt = generateSystemPrompt();
    const userMessage = `Current Date for Analysis: ${date}. Provide the tactical briefing for this specific date based on planetary transits relative to the subject's natal chart. Respond ONLY with JSON.`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${finalApiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: systemPrompt + "\n\n" + userMessage }]
                    }
                ],
                generationConfig: {
                    temperature: 0.3,
                    topP: 0.8,
                    topK: 40,
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Tactical link failure.");
        }

        const data = await response.json();
        let text = data.candidates[0].content.parts[0].text;

        // Cleanup if LLM wrapped in markdown
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(text);
    } catch (err) {
        console.error("ATIU_LINK_ERROR:", err);
        throw err;
    }
}
