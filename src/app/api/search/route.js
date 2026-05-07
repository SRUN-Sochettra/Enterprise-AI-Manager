import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { query, products, employees } = await req.json();

        if (!query) {
            return NextResponse.json(
                { error: "Query is required" },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const prompt = `
You are a smart search engine for a company management system.

PRODUCTS DATA:
${JSON.stringify(products)}

EMPLOYEES DATA:
${JSON.stringify(employees)}

User search query: "${query}"

Based on the query, return a JSON object with this EXACT structure:
{
  "interpretation": "brief explanation of what you searched for",
  "products": [array of matching product objects from the data, empty array if none match],
  "employees": [array of matching employee objects from the data, empty array if none match]
}

Rules:
- Only return items that actually exist in the data
- Match based on the user's intent (price ranges, departments, names, etc.)
- If query is about products only, return empty employees array
- If query is about employees only, return empty products array
- Return ONLY valid JSON, no extra text
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return NextResponse.json(JSON.parse(clean));

    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}