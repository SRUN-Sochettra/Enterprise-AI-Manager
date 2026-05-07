import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    try {
        const { products, employees } = await req.json();

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const prompt = `
You are a business analyst. Analyze this company data and return a JSON object.

PRODUCTS (${products.length} total):
${products.map(p => `- ${p.productName}: $${p.productPrice}`).join('\n')}

EMPLOYEES (${employees.length} total):
${employees.map(e => `- ${e.firstName} ${e.lastName} | ${e.department} | $${e.salary}`).join('\n')}

Return ONLY a valid JSON object with this exact structure:
{
  "summary": "2-3 sentence executive summary of the business",
  "highlights": [
    "insight 1",
    "insight 2", 
    "insight 3",
    "insight 4"
  ],
  "recommendations": [
    "recommendation 1",
    "recommendation 2",
    "recommendation 3"
  ],
  "stats": {
    "totalProducts": number,
    "totalEmployees": number,
    "avgProductPrice": number,
    "avgSalary": number,
    "mostExpensiveProduct": "product name",
    "highestPaidEmployee": "full name",
    "topDepartment": "department name"
  }
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return NextResponse.json(JSON.parse(clean));

    } catch (error) {
        console.error("Dashboard error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}