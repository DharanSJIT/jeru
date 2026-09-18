import mongoose from "mongoose";
import dotenv from "dotenv";
import Schemev2 from "./models/schemev2.model.js";

dotenv.config();

async function seedCentralSchemes() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        
        const centralSchemes = [
            {
                schemeName: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
                schemeShortTitle: "PM Jan Dhan Yojana",
                tags: ["financial", "banking", "central"],
                level: "Central",
                schemeCategory: ["Financial Inclusion"],
                detailedDescription_md: "A National Mission for Financial Inclusion to ensure access to financial services, namely, Banking/ Savings & Deposit Accounts, Remittance, Credit, Insurance, Pension in an affordable manner.",
                eligibilityDescription_md: "Any Indian citizen who does not have any other bank account can open a Jan Dhan account.",
                benefits: [
                    { details: "No minimum balance required." },
                    { details: "Accident Insurance Cover of ₹2 lakh." }
                ],
                faqs: [
                    { question: "Is there any minimum balance requirement?", answer: "No minimum balance is required." }
                ]
            },
            {
                schemeName: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)",
                schemeShortTitle: "Ayushman Bharat",
                tags: ["health", "insurance", "central"],
                level: "Central",
                schemeCategory: ["Health & Wellness"],
                detailedDescription_md: "A flagship scheme of Government of India to provide a health cover of ₹5 lakhs per family per year for secondary and tertiary care hospitalization.",
                eligibilityDescription_md: "Families belonging to poor and vulnerable populations based on SECC 2011 database.",
                benefits: [
                    { details: "Health cover of ₹5 lakh per family per year." },
                    { details: "Cashless and paperless access to services." }
                ],
                faqs: [
                    { question: "How much is the health cover?", answer: "₹5 lakh per family per year." }
                ]
            }
        ];

        for (const scheme of centralSchemes) {
            const exists = await Schemev2.findOne({ schemeName: scheme.schemeName });
            if (!exists) {
                await Schemev2.create(scheme);
                console.log(`Seeded: ${scheme.schemeName}`);
            } else {
                console.log(`Already exists: ${scheme.schemeName}`);
            }
        }
        
        console.log("Seeding complete.");
    } catch (err) {
        console.error("Seeding failed:", err);
    } finally {
        mongoose.disconnect();
    }
}

seedCentralSchemes();
