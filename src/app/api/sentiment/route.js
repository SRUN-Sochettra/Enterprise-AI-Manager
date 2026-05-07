import { NextResponse } from "next/server";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL = "distilbert/distilbert-base-uncased-finetuned-sst-2-english";

export async function POST(req) {
    try {
        console.log("HF Key exists:", !!HF_API_KEY);

        if (!HF_API_KEY) {
            return NextResponse.json(
                { error: "HUGGINGFACE_API_KEY is missing" },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { text } = body;
        console.log("Analyzing sentiment for:", text);

        if (!text) {
            return NextResponse.json(
                { error: "text is required" },
                { status: 400 }
            );
        }

        const response = await fetch(
            `https://router.huggingface.co/hf-inference/models/${MODEL}`,
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

        // Safely parse response
        const contentType = response.headers.get("content-type");
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

        // Handle model loading
        if (data.error?.includes("loading")) {
            return NextResponse.json(
                {
                    error: "Model is loading, please try again in 20 seconds",
                    loading: true,
                },
                { status: 503 }
            );
        }

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || "Sentiment analysis failed" },
                { status: response.status }
            );
        }

        // HF returns array of arrays [[{label, score}, {label, score}]]
        const results = data[0];
        
        // Sort by score to get highest confidence first
        const sorted = results.sort((a, b) => b.score - a.score);
        const top = sorted[0];

        return NextResponse.json({
            sentiment: top.label,        // "POSITIVE" or "NEGATIVE"
            score: top.score,            // 0.0 - 1.0
            confidence: Math.round(top.score * 100), // percentage
            all: sorted,                 // all results
        });

    } catch (error) {
        console.error("=== SENTIMENT ERROR ===");
        console.error("Message:", error.message);
        console.error("======================");
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}