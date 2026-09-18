import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Schemev2 from '../models/schemev2.model.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL || process.env.MONGODB_URI;
        if (!mongoUrl) {
            throw new Error("MONGODB_URL is not defined in .env");
        }
        await mongoose.connect(mongoUrl);
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        await connectDB();

        const jsonPath = path.join(process.cwd(), 'data', 'schemes.json');
        if (!fs.existsSync(jsonPath)) {
            console.error(`Schemes data file not found at ${jsonPath}`);
            process.exit(1);
        }

        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const dataset = JSON.parse(rawData);
        const schemes = dataset.records;

        let inserted = 0;
        let updated = 0;
        let skipped = 0;

        for (const scheme of schemes) {
            // Map JSON format to Schemev2 model format
            const mappedData = {
                schemeName: scheme.scheme_name,
                schemeShortTitle: scheme.short_name || scheme.scheme_name,
                state: scheme.state,
                level: scheme.level,
                tags: scheme.tags || [],
                schemeCategory: scheme.category ? [scheme.category] : [],
                detailedDescription_md: scheme.overview,
                eligibilityDescription_md: scheme.eligibility,
                benefits: [{ details: scheme.benefits }],
                documents_required: (scheme.documents || []).map(doc => ({ documentName: doc })),
                applicationProcess: scheme.apply ? [scheme.apply] : [],
                faqs: (scheme.faq || []).map(f => ({ question: f.question, answer: f.answer })),
                references: scheme.source?.department_portal ? [{ title: "Official Portal", url: scheme.source.department_portal }] : [],
                // We'll store the original ID in tags or metadata if needed, but here we just upsert based on name
            };

            // Use schemeName as the unique identifier for upsert
            const existing = await Schemev2.findOne({ schemeName: mappedData.schemeName });

            if (existing) {
                // If it exists, you can choose to update it or skip
                // We'll update it to keep it idempotent
                await Schemev2.updateOne({ _id: existing._id }, { $set: mappedData });
                updated++;
            } else {
                await Schemev2.create(mappedData);
                inserted++;
            }
        }

        console.log("Seeding completed successfully.");
        console.log(`Inserted: ${inserted}`);
        console.log(`Updated: ${updated}`);
        console.log(`Skipped: ${skipped}`);
        console.log(`Total processed: ${schemes.length}`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();
