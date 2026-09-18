import { MilvusClient } from "@zilliz/milvus2-sdk-node";
import dotenv from "dotenv";

dotenv.config();

async function checkMilvus() {
    const client = new MilvusClient({
        address: process.env.MILVUS_URI,
        token: process.env.MILVUS_TOKEN,
    });
    
    // Just fetch some data to see what is there
    const res = await client.query({
        collection_name: "tamil_nadu_schemes",
        expr: "id >= 0",
        output_fields: ["schemeId"],
        limit: 5
    });
    
    console.log("Milvus query:", JSON.stringify(res, null, 2));
}

checkMilvus();
