import "dotenv/config";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config(); console.log("SECRET LOADED IN APP: ", process.env.ACCESS_TOKEN_SECRET ? "YES" : "NO");



connectDB()
.then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})
.catch(
    (error) => console.error("Error connecting to MongoDB", error)
)