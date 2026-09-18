import mongoose from "mongoose";
import dotenv from "dotenv";
import Schemev2 from "./models/schemev2.model.js";

dotenv.config();

async function seedPerfectSchemes() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        
        const perfectSchemes = [
            {
                schemeName: "BC/MBC Post Matric Scholarship Scheme",
                schemeShortTitle: "Post Matric Scholarship",
                tags: ["education", "scholarship", "bc", "student", "btech", "engineering"],
                level: "State",
                state: "Tamil Nadu",
                schemeCategory: ["Education & Scholarships"],
                detailedDescription_md: "This scheme provides financial assistance to BC/MBC/DNC students studying in post-matriculation or post-secondary courses (like B.Tech, Engineering, UG, PG) to enable them to complete their education.",
                eligibilityDescription_md: "1. Must belong to BC/MBC/DNC community in Tamil Nadu.\n2. Must be pursuing post-matric courses like Undergraduate (B.Tech).\n3. Parental annual income should not exceed ₹2,50,000.",
                benefits: [
                    { details: "Maintenance allowance and reimbursement of compulsory non-refundable fees." },
                    { details: "Direct Bank Transfer (DBT) of the scholarship amount to the student's account." }
                ],
                documents_required: [
                    { documentName: "Aadhaar Card" },
                    { documentName: "Community Certificate (BC/MBC/DNC)" },
                    { documentName: "Income Certificate (Annual income below ₹2,50,000)" },
                    { documentName: "Previous Year Marksheet" },
                    { documentName: "Bank Passbook" },
                    { documentName: "Fee Receipt from the Institution" }
                ],
                applicationProcess: [
                    {
                        mode: "Online Application",
                        process: [
                            { details: "Register on the Tamil Nadu state scholarship portal." },
                            { details: "Fill out the Post Matric Scholarship application form." },
                            { details: "Upload scanned copies of all required documents." },
                            { details: "Submit the form and track the status online." }
                        ]
                    }
                ],
                faqs: [
                    { question: "Is this for Engineering students?", answer: "Yes, undergraduate engineering (B.Tech) students belonging to BC/MBC are eligible." }
                ]
            },
            {
                schemeName: "Chief Minister's Uzhavar Pathukappu Thittam (Farmer Protection Scheme)",
                schemeShortTitle: "Uzhavar Pathukappu Thittam",
                tags: ["agriculture", "farmer", "welfare", "rural"],
                level: "State",
                state: "Tamil Nadu",
                schemeCategory: ["Agriculture & Farmer Welfare"],
                detailedDescription_md: "A comprehensive welfare scheme for farmers, providing assistance for education, marriage, old age pension, and accident relief to small and marginal farmers and their dependents.",
                eligibilityDescription_md: "Must be a small or marginal farmer owning agricultural land in Tamil Nadu. The family members and dependents are also eligible for various grants.",
                benefits: [
                    { details: "Educational assistance for children." },
                    { details: "Marriage assistance and pension benefits." },
                    { details: "Accident relief and natural death assistance." }
                ],
                documents_required: [
                    { documentName: "Aadhaar Card" },
                    { documentName: "Chitta / Patta (Land Ownership Proof)" },
                    { documentName: "Farmer Identity Card" },
                    { documentName: "Ration Card" },
                    { documentName: "Bank Passbook" }
                ],
                applicationProcess: [
                    {
                        mode: "Offline Application",
                        process: [
                            { details: "Visit the local Taluk or Village Administrative Officer (VAO)." },
                            { details: "Obtain the Uzhavar Pathukappu Thittam registration form." },
                            { details: "Submit the filled form along with land documents and Aadhaar." },
                            { details: "The VAO will verify the land ownership and issue the Farmer ID." }
                        ]
                    }
                ],
                faqs: [
                    { question: "Are small farmers eligible?", answer: "Yes, small and marginal farmers with land ownership are eligible." }
                ]
            }
        ];

        for (const scheme of perfectSchemes) {
            const updatedScheme = await Schemev2.findOneAndUpdate(
                { schemeName: scheme.schemeName },
                { $set: scheme },
                { upsert: true, new: true }
            );
            console.log(`Seeded/Updated: ${scheme.schemeName}`);
        }
        
        console.log("Seeding complete.");
    } catch (err) {
        console.error("Seeding failed:", err);
    } finally {
        mongoose.disconnect();
    }
}

seedPerfectSchemes();
