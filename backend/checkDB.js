import mongoose from "mongoose";
import dotenv from "dotenv";
import Schemev2 from "./models/schemev2.model.js";

dotenv.config();

async function checkDB() {
    await mongoose.connect(process.env.MONGODB_URL);
    const count = await Schemev2.countDocuments();
    console.log("Total schemes in DB:", count);
    const sample = await Schemev2.find().limit(2);
    console.log("Sample schemes:", JSON.stringify(sample, null, 2));
    mongoose.disconnect();
}
checkDB();
