import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { imageUrl } = await req.json();

        if (!imageUrl) {
            return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
        }

        // Fetch the image data
        const imageResponse = await fetch(imageUrl);
        const arrayBuffer = await imageResponse.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = "Look at this product image. Provide a JSON response with: 'name' (a catchy product name), 'suggestedPrice' (a realistic dollar amount as a number), and 'category' (choose one: Food, Drink). Return ONLY the JSON.";
        
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const text = result.response.text();
        // Clean the response (Gemini sometimes adds ```json ... ```)
        const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
        
        return NextResponse.json(JSON.parse(cleanJson));

    } catch (error) {
        console.error("Vision Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}