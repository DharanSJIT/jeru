import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// We can just fetch the models using fetch
async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await res.json();
    console.log(data.models.map(m => m.name));
}

listModels();
