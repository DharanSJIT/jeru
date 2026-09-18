import mongoose from "mongoose";
import dotenv from "dotenv";
import { generateMatchesForUser } from "./services/recommendation.service.js";
import User from "./models/user.model.js";

dotenv.config();

async function testMatch() {
    await mongoose.connect(process.env.MONGODB_URL);
    
    // get a user and force gender to male
    const user = await User.findOne({});
    user.personal = { ...user.personal, gender: 'Male' };
    await user.save();
    
    console.log("User:", user.email, "Gender:", user.personal?.gender);
    const result = await generateMatchesForUser(user._id);
    console.log("Matches:", result.matches.length);
    console.log("Names:", result.matches.map(s => s.schemeName));
    mongoose.disconnect();
}
testMatch();
