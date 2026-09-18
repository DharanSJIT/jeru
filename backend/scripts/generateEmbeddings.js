import { GoogleGenerativeAI } from "@google/generative-ai";
import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Schemev2 from "../models/schemev2.model.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL || process.env.MONGODB_URI;
        await mongoose.connect(mongoUrl);
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
};

const setupMilvusAndEmbeddings = async () => {
    try {
        if (!process.env.MILVUS_URI || !process.env.GEMINI_API_KEY) {
            console.error("Missing MILVUS_URI or GEMINI_API_KEY in .env");
            process.exit(1);
        }

        await connectDB();

        console.log("Connecting to Milvus...");
        const client = new MilvusClient({
            address: process.env.MILVUS_URI,
            token: process.env.MILVUS_TOKEN,
        });

        const collectionName = "tamil_nadu_schemes";

        // Check if collection exists
        const hasCollection = await client.hasCollection({ collection_name: collectionName });
        if (!hasCollection.value) {
            console.log("Creating Milvus collection...");
            await client.createCollection({
                collection_name: collectionName,
                fields: [
                    { name: "id", data_type: DataType.Int64, is_primary_key: true, autoID: true },
                    { name: "schemeId", data_type: DataType.VarChar, max_length: 200 },
                    { name: "vector", data_type: DataType.FloatVector, dim: 768 }, // embedding-001 is 768 dim
                ],
            });
            console.log("Collection created.");
        } else {
            console.log("Milvus collection already exists.");
        }

        console.log("Initializing Gemini Embedding Model...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });

        const schemes = await Schemev2.find({});
        console.log(`Found ${schemes.length} schemes in MongoDB. Generating embeddings...`);

        for (const scheme of schemes) {
            const textToEmbed = `
Scheme Name: ${scheme.schemeName}
Description: ${scheme.detailedDescription_md}
Eligibility: ${scheme.eligibilityDescription_md}
State: ${scheme.state}
Level: ${scheme.level}
Category: ${scheme.schemeCategory.join(", ")}
`.trim();

            try {
                const result = await embedModel.embedContent(textToEmbed);
                const embedding = result.embedding.values;

                await client.insert({
                    collection_name: collectionName,
                    fields_data: [
                        {
                            schemeId: scheme._id.toString(),
                            vector: embedding,
                        }
                    ]
                });

                console.log(`Successfully embedded: ${scheme.schemeName}`);
            } catch (err) {
                console.error(`Failed to embed scheme ${scheme.schemeName}`, err.message);
            }
            
            // Sleep slightly to avoid hitting Gemini rate limits
            await new Promise((r) => setTimeout(r, 1000));
        }

        console.log("Flushing data to Milvus...");
        await client.flush({ collection_names: [collectionName] });

        console.log("Creating Index...");
        await client.createIndex({
            collection_name: collectionName,
            field_name: "vector",
            extra_params: {
                index_type: "IVF_FLAT",
                metric_type: "COSINE",
                params: JSON.stringify({ nlist: 1024 }),
            },
        });
        
        console.log("Loading collection...");
        await client.loadCollection({ collection_name: collectionName });

        console.log("Embedding and Milvus ingestion complete!");
        process.exit(0);

    } catch (error) {
        console.error("Embedding generation failed:", error);
        process.exit(1);
    }
};

setupMilvusAndEmbeddings();
