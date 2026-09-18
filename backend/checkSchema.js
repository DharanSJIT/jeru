import mongoose from "mongoose";
import dotenv from "dotenv";
import Schemev2 from "./models/schemev2.model.js";

dotenv.config();

async function checkSchema() {
    await mongoose.connect(process.env.MONGODB_URL);
    const scheme = await Schemev2.findOne({ schemeName: "Pudhumai Penn Scheme" });
    if (scheme) {
        console.log("Benefits:");
        console.dir(scheme.benefits, { depth: null });
        console.log("Documents:");
        console.dir(scheme.documents_required, { depth: null });
    }
    mongoose.disconnect();
}
checkSchema();
