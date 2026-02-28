// Final build fix attempt: explicit dependency and relative paths
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req) {
    try {
        const { prompt, duration, interests, travelers } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                success: false,
                message: "Gemini API Key is not configured."
            }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
                "destinations": ["Location 1", "Location 2", ...]
            }

            Only return the JSON object. Do not include any markdown formatting like \`\`\`json.
        `;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // Clean up the response text in case Gemini adds markdown
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
