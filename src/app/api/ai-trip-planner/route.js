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

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
                "X-Title": "Airport Taxi Tours AI Planner",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "google/gemini-2.5-flash", // Using gemini 2.5 flash via OpenRouter
                messages: [
                    { role: "user", content: fullPrompt }
                ],
                max_tokens: 2500
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.text();
            console.error("OpenRouter Error:", errorData);
            return NextResponse.json({
                success: false,
                message: "Failed to generate itinerary via OpenRouter."
            }, { status: response.status });
        }

        const result = await response.json();
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
