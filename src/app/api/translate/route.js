import { NextResponse } from "next/server";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

const MODELS = {
    es: "Helsinki-NLP/opus-mt-en-es",
    fr: "Helsinki-NLP/opus-mt-en-fr",
    de: "Helsinki-NLP/opus-mt-en-de",
    zh: "Helsinki-NLP/opus-mt-en-zh",
    ar: "Helsinki-NLP/opus-mt-en-ar",
    ja: "Helsinki-NLP/opus-mt-en-jap",
    ko: "Helsinki-NLP/opus-mt-en-ko",
    pt: "Helsinki-NLP/opus-mt-en-pt",
};

export async function POST(req) {
    try {
        // Step 1: Check API key
        console.log("HF Key exists:", !!HF_API_KEY);
        console.log("HF Key preview:", HF_API_KEY?.slice(0, 10) + "...");

        if (!HF_API_KEY) {
            return NextResponse.json(
                { error: "HUGGINGFACE_API_KEY is missing from .env.local" },
                { status: 500 }
            );
        }

        // Step 2: Parse body
        const body = await req.json();
        const { text, targetLanguage } = body;
        console.log("Translating:", text, "→", targetLanguage);

        if (!text || !targetLanguage) {
            return NextResponse.json(
                { error: "text and targetLanguage are required" },
                { status: 400 }
            );
        }

        const model = MODELS[targetLanguage];
        if (!model) {
            return NextResponse.json(
                { error: `Language "${targetLanguage}" is not supported` },
                { status: 400 }
            );
        }

        // Step 3: Call Hugging Face
        console.log("Calling HF model:", model);
        const response = await fetch(
            `https://router.huggingface.co/hf-inference/models/${model}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputs: text }),
            }
        );

        console.log("HF Status:", response.status);
        console.log("HF Content-Type:", response.headers.get("content-type"));

        // Step 4: Safely parse response
        const contentType = response.headers.get("content-type");

        // Check if response is JSON before parsing
        if (!contentType || !contentType.includes("application/json")) {
            const rawText = await response.text();
            console.error("HF returned non-JSON:", rawText.slice(0, 200));
            return NextResponse.json(
                { error: `Hugging Face returned unexpected response: ${response.status}` },
                { status: 500 }
            );
        }

        const data = await response.json();
        console.log("HF Response:", data);

        // Step 5: Handle model loading
        if (data.error?.includes("loading")) {
            return NextResponse.json(
                {
                    error: "Model is loading, please try again in 20 seconds",
                    loading: true,
                },
                { status: 503 }
            );
        }

        // Step 6: Handle other errors
        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || "Translation failed" },
                { status: response.status }
            );
        }

        // Step 7: Extract translation
        const translated = data[0]?.translation_text;
        if (!translated) {
            return NextResponse.json(
                { error: "No translation returned from model" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            original: text,
            translated,
            targetLanguage,
        });

    } catch (error) {
        console.error("=== TRANSLATE ERROR ===");
        console.error("Message:", error.message);
        console.error("======================");
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}