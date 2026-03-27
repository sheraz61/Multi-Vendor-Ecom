import mongoose from "mongoose";
import Shop from "../model/shop.js";
import User from "../model/user.js";

const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URL).then(async (data)=>{
        console.log(`MongoDB connected with server: ${data.connection.host}`)
        // Ensure unique indexes (e.g. Shop.email) are actually created in MongoDB.
        try {
            await Promise.all([Shop.syncIndexes(), User.syncIndexes()]);
        } catch (e) {
            console.log(`Index sync warning: ${e.message}`);
        }
    })
}


export default connectDatabase