import { GoogleGenerativeAI } from "@google/generative-ai";
import { MilvusClient } from "@zilliz/milvus2-sdk-node";
import Schemev2 from "../models/schemev2.model.js";
import User from "../models/user.model.js";
import { sendEmail } from "./email.service.js";

export const generateMatchesForUser = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        let matchedSchemes = [];
        
        // STAGE 1: Hard Filtering
        // Example: Only match schemes in the user's state or national level
        const hardFilteredSchemes = await Schemev2.find({
            $or: [
                { state: user.state },
                { level: "National" }
            ]
        });

        // STAGE 2: Semantic Matching with Milvus
        const hasMilvus = process.env.MILVUS_URI && process.env.GEMINI_API_KEY;
        
        if (hasMilvus) {
            try {
                const client = new MilvusClient({
                    address: process.env.MILVUS_URI,
                    token: process.env.MILVUS_TOKEN,
                });
                
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
                
                const userProfileText = `
                I am a ${user.age} year old ${user.gender} from ${user.district}, ${user.state}.
                Education: ${user.educationLevel} with ${user.previousPercentage}% marks.
                Income: ₹${user.familyIncome}, Category: ${user.incomeGroup}.
                Minority: ${user.isMinority}, First Gen Graduate: ${user.isFirstGenerationGraduate},
                Single Girl Child: ${user.isSingleGirlChild}, PwD: ${user.isDifferentlyAbled}.
                `;

                const result = await embedModel.embedContent(userProfileText);
                const userVector = result.embedding.values;

                const searchResponse = await client.search({
                    collection_name: "tamil_nadu_schemes",
                    vector: userVector,
                    limit: 5,
                    output_fields: ["schemeId"],
                });

                const schemeIds = searchResponse.results.map(r => r.schemeId);
                matchedSchemes = await Schemev2.find({ _id: { $in: schemeIds } });

            } catch (error) {
                console.error("Vector Search Failed, falling back to basic matching:", error);
                // Fallback to basic slice
                matchedSchemes = hardFilteredSchemes.slice(0, 5);
            }
        } else {
            // Mock matching if APIs not configured
            matchedSchemes = hardFilteredSchemes.slice(0, 5);
        }

        // STAGE 3: Gemini AI Explanation & Roadmap
        let roadmap = "Your personalized roadmap is being generated...";
        if (process.env.GEMINI_API_KEY) {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                
                const prompt = `
                You are an expert Government Scheme Advisor.
                Analyze the following user profile and the matched schemes.
                Provide a structured "Roadmap" explaining why they qualify and what steps they should take.
                
                User Profile:
                Age: ${user.age}, Gender: ${user.gender}, State: ${user.state}, Income: ${user.familyIncome}
                
                Matched Schemes:
                ${matchedSchemes.map(s => `- ${s.schemeName}`).join('\n')}
                
                Return a short 3-step action plan for them to apply. Keep it encouraging and clear.
                `;
                
                const response = await model.generateContent(prompt);
                roadmap = response.response.text();
            } catch (error) {
                console.error("Gemini Roadmap generation failed:", error);
                roadmap = "Matches found based on your profile! Check the individual scheme pages for application details.";
            }
        }

        // Send Email Notification
        if (user.email && process.env.EMAIL_USER) {
            const schemeListText = matchedSchemes.map(s => `• ${s.schemeName}`).join('\n');
            await sendEmail(
                user.email,
                "🎉 You have new eligible government schemes!",
                `Hello ${user.name},\n\nGreat news! We found ${matchedSchemes.length} schemes you are eligible for:\n\n${schemeListText}\n\nLog in to your dashboard to view your personalized roadmap and apply!\n\nBest,\nTamil Nadu Scheme Seeker Team`
            );
        }

        return {
            success: true,
            matches: matchedSchemes,
            roadmap: roadmap
        };

    } catch (error) {
        console.error("Recommendation Engine Error:", error);
        throw error;
    }
};

export const generateRecommendations = async (userId, options) => {
    const result = await generateMatchesForUser(userId);
    // Wrap it in a paginated structure if expected
    return {
        docs: result.matches,
        totalDocs: result.matches.length,
        limit: options?.limit || 10,
        page: options?.page || 1,
        totalPages: 1
    };
};
