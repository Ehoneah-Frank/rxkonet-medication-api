import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const dbConnection = async () =>{
    try {
       if(!process.env.MONGO_URI) {
        throw new Error ("MONGO_URI is not defined in the environment variables")
       }
       await mongoose.connect(process.env.MONGO_URI);
       console.log("Database connected Successfully");

    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

export default dbConnection;