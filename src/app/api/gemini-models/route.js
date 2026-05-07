import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is missing" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        
        // List all available models
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );
        
        const data = await response.json();
        
        // Filter only models that support generateContent
        const supportedModels = data.models
            ?.filter(m => m.supportedGenerationMethods?.includes("generateContent"))
            ?.map(m => ({
                name: m.name,
                displayName: m.displayName,
                description: m.description,
            }));

        return NextResponse.json({ 
            models: supportedModels,
            total: supportedModels?.length
        });

    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}