// Final build fix attempt: explicit dependency and relative paths
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { prompt, duration, interests, travelers } = await req.json();

        if (!process.env.OPENROUTER_API_KEY) {
            return NextResponse.json({
                success: false,
                message: "OpenRouter API Key is not configured."
            }, { status: 500 });
        }

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

        let aiRes;
        let errText = '';
        const maxRetries = 3;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://airporttaxis.lk", // Required for OpenRouter rankings
                    "X-Title": "Airport Taxi Tours AI Planner",
                },
                body: JSON.stringify({
                    model: "google/gemini-2.5-flash", // Using gemini 2.5 flash via OpenRouter
                    messages: [
                        { role: "user", content: fullPrompt }
                    ],
                    response_format: { type: "json_object" },
                    max_tokens: 3000,
                })
            });

            if (aiRes.ok) break;

            errText = await aiRes.text();
            
            if (aiRes.status === 429 && attempt < maxRetries) {
                let delayMs = 5000;
                try {
                    const errObj = JSON.parse(errText);
                    if (errObj.error?.metadata?.retry_after_seconds) {
                        delayMs = (errObj.error.metadata.retry_after_seconds + 1) * 1000;
                    }
                } catch (e) {}
                console.warn(`[AI Trip Planner] Rate limited (429). Retrying in ${delayMs / 1000}s (Attempt ${attempt}/${maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
                continue;
            }

            console.error("OpenRouter Error:", aiRes.status, errText);
            return NextResponse.json(
                { success: false, message: "Failed to generate itinerary via OpenRouter." },
                { status: 500 }
            );
        }

        const result = await aiRes.json();
        const text = result.choices?.[0]?.message?.content || "";

        // Clean up the response text in case AI adds markdown
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const itinerary = JSON.parse(cleanedText);
            return NextResponse.json({ success: true, data: itinerary });
        } catch (parseError) {
            console.error("JSON Parse Error:", cleanedText);
            return NextResponse.json({
                success: false,
                message: "Failed to parse AI response into JSON.",
                raw: cleanedText
            }, { status: 500 });
        }

    } catch (error) {
        console.error("AI Trip Planner Error:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Failed to generate itinerary."
        }, { status: 500 });
    }
}
