import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Step 1: Check API key
        const apiKey = process.env.GEMINI_API_KEY;
        console.log("API Key exists:", !!apiKey);
        console.log("API Key preview:", apiKey?.slice(0, 10) + "...");

        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is missing from .env.local" },
                { status: 500 }
            );
        }

        // Step 2: Parse request body
        const body = await req.json();
        const { question, products, employees } = body;
        console.log("Question received:", question);
        console.log("Products count:", products?.length);
        console.log("Employees count:", employees?.length);

        if (!question) {
            return NextResponse.json(
                { error: "Question is required" },
                { status: 400 }
            );
        }

        // Step 3: Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash" 
        });
        console.log("Gemini model initialized");

        // Step 4: Build context
        const context = `
You are a helpful assistant for a company management system.
You have access to the following company data:

${products?.length > 0 ? `
=== PRODUCTS (${products.length} total) ===
${products.map(p => 
    `- ID: ${p.productId} | Name: ${p.productName} | Price: $${p.productPrice} | Category ID: ${p.categoryId}`
).join('\n')}
` : 'No products data available.'}

${employees?.length > 0 ? `
=== EMPLOYEES (${employees.length} total) ===
${employees.map(e => 
    `- ID: ${e.employeeId} | Name: ${e.firstName} ${e.lastName} | Email: ${e.email} | Department: ${e.department} | Salary: $${e.salary}`
).join('\n')}
` : 'No employees data available.'}

Answer the user's question based on this data.
Be concise, helpful, and friendly.
`;

        // Step 5: Call Gemini
        console.log("Calling Gemini API...");
        const result = await model.generateContent([
            context,
            `User question: ${question}`
        ]);
        console.log("Gemini responded!");

        const response = result.response.text();

        return NextResponse.json({ 
            answer: response,
            question 
        });

    } catch (error) {
        // Log the FULL error
        console.error("=== GEMINI ERROR ===");
        console.error("Message:", error.message);
        console.error("Status:", error.status);
        console.error("Full error:", JSON.stringify(error, null, 2));
        console.error("===================");

        return NextResponse.json(
            { 
                error: "Failed to get AI response",
                details: error.message  // Send error details to frontend
            },
            { status: 500 }
        );
    }
}