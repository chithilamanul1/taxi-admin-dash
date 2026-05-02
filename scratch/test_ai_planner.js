const fetch = require('node-fetch'); // We can use native fetch in newer node or if available, otherwise we use standard https.

async function test() {
    require('dotenv').config();
    const prompt = "10 days in Sri Lanka focusing on beaches and culture";
    const duration = 10;
    const travelers = 2;
    const interests = "beaches, culture";

    const fullPrompt = `
        Plan a detailed Sri Lankan tour itinerary based on the following:
        - Goal/Input: ${prompt}
        - Duration: ${duration} days
        - Interests: ${interests}
        - Travelers: ${travelers}

        The response must be in JSON format with the following structure:
        {
            "title": "Itinerary Title",
            "description": "Short overview",
            "days": [
                {
                    "day": 1,
                    "title": "Day Title",
                    "location": "Primary Location Name",
                    "activities": ["Activity 1", "Activity 2"],
                    "description": "Detailed description for the day"
                }
            ],
            "destinations": ["Location 1", "Location 2"]
        }

        Only return the JSON object. Do not include any markdown formatting like \`\`\`json.
    `;

    try {
        console.log("Sending request to OpenRouter...");
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Airport Taxi Tours AI Planner",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "google/gemini-2.5-flash", 
                messages: [
                    { role: "user", content: fullPrompt }
                ]
            })
        });

        if (!response.ok) {
            console.error("Error:", response.status, await response.text());
            return;
        }

        const result = await response.json();
        const text = result.choices?.[0]?.message?.content || "";
        console.log("RAW RESPONSE:");
        console.log(text);

        const cleanedText = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
        const itinerary = JSON.parse(cleanedText);
        console.log("\nPARSED JSON:");
        console.log(JSON.stringify(itinerary, null, 2));
    } catch (e) {
        console.error(e);
    }
}
test();
