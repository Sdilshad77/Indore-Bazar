import { GoogleGenAI } from "@google/genai";
import Product from "../models/productModel.js";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Fallback chain — Gemini 2.5 can hit 503 "high demand", so we retry on other models
const MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-flash-latest",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryable = (err) => {
    const code = err?.status || err?.code || err?.statusCode;
    const msg = (err?.message || "").toLowerCase();
    return (
        code === 503 ||
        code === 429 ||
        code === 500 ||
        msg.includes("high demand") ||
        msg.includes("unavailable") ||
        msg.includes("quota") ||
        msg.includes("rate limit")
    );
};

export const getAnswer = async (req, res) => {
    try {

        // Check if question are coming

        const { question } = req.body

        if (!question) {
            res.status(409)
            throw new Error("Please Ask Valid Question")
        }

        // Check Available items and stock
        const allStock = await Product.find().populate("shop")


        // System Prompt
        let prompt = `You are a smart AI shop assistant that helps users find products from the data provided.
You will always receive an array of product objects (each containing name, description, category, price, stock, and shop details) also you can help with shops information like address.

🌐 LANGUAGE RULE (very important):
- ALWAYS respond in ENGLISH by default, no matter what.
- If the user greets you or says "hello"/"hi", respond with: "Hello! 👋 How can I help you shop today?"
- NEVER use words like "Namaste", "Kya", "Hai" or any Hindi/Hinglish words unless the user themselves wrote the message in Hindi — then and only then reply in Hindi.
- Keep all product answers in English.

Your task is to:

Understand the user's intent — this can be:
- A full sentence like "I want something sweet" or "I need a hoodie"
- A SHORT SINGLE WORD or phrase like "milk", "bread", "shoes" — treat these as PRODUCT SEARCH QUERIES and search the data for a matching product by name, category, or description.

⚠️ IMPORTANT: If the user sends just one word (e.g. "milk", "sugar", "bread"), treat it exactly as if they said "I want [that word]" and look for a matching product in the data. NEVER reply with "no item available" when a keyword matches any product name, category, or description in the data.

Search strictly within the given data for the most relevant product(s).

Respond in one short, natural sentence that feels like human conversation and you can add emojis also.

Always include:

The product name

The shop name

(Optional) a useful detail like price or category

✅ Response Format Examples

User: "I want to eat something sweet."
→ "You can order ice cream from Reshma Departmental Stores."

User: "Need a hoodie."
→ "You can buy a GenZ Style Hoodie from Reshma Departmental Stores for ₹1500."

User: "milk"
→ "You can order Amul Milk from Reshma Departmental Stores for ₹32. 🥛"

User: "bread"
→ "Fresh Bread is available at Sharma General Store for ₹25. 🍞"

User: "hello"
→ "Hello! 👋 How can I help you shop today?"

❌ If truly no match is found after thoroughly searching ALL product names, descriptions, and categories in the data:

Reply exactly:
"Currently no item available." || "We are working to add more products for you"

⚙️ Rules

Never generate or assume products that are not present in the provided data.

A single keyword input is ALWAYS a product search — match it against product name, category, and description before concluding nothing is available.

Don't list multiple items unless the user explicitly asks for options.

Keep tone friendly, simple, and concise (one-liner).

Use data fields naturally — don't repeat raw object keys or IDs.   

here are question : ${question}
here are stock details : ${allStock}`


        const response = await generateWithFallback(prompt);

        const text = Array.isArray(response.text)
            ? response.text.join("")
            : response.text;

        res.status(200).json({
            success: true,
            message: text
        })

    } catch (error) {
        console.error("ChatBot Error:", error.message)
        res.status(503)
        throw new Error("AI is a bit busy right now (Gemini is under high demand). Please try again in a minute! 🙏")
    }

}

const generateWithFallback = async (prompt) => {
    let lastError = null

    for (let i = 0; i < MODELS.length; i++) {
        const model = MODELS[i]
        try {
            const response = await ai.models.generateContent({
                model,
                contents: prompt,
            })
            if (response?.text) {
                return response
            }
            lastError = new Error(`${model} returned empty response`)
        } catch (err) {
            lastError = err
            console.error(`[ChatBot] Model "${model}" failed:`, err?.message || err)

            if (!isRetryable(err)) {
                throw err
            }
        }

        if (i < MODELS.length - 1) {
            await sleep(1500 * (i + 1))
        }
    }

    throw lastError || new Error("All AI models failed")
}


