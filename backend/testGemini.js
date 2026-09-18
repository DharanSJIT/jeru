import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
    try {
        console.log("Testing text generation with gemini-flash-latest...");
        const textModel = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const textResult = await textModel.generateContent("Hello, just reply 'OK' if you can read this.");
        console.log("Text generation SUCCESS:", textResult.response.text());

        console.log("Testing embeddings with gemini-embedding-2...");
        const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
        const embedResult = await embedModel.embedContent("Hello, world!");
        console.log("Embedding SUCCESS, vector length:", embedResult.embedding.values.length);
        
    } catch (err) {
        console.error("Gemini Test FAILED:", err.message);
    }
}

testGemini();
