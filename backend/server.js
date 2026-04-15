import { config } from "dotenv";
import app from "./app.js";
import connectDatabase from "./db/database.js";
import connectCloudinary from "./config/cloudinary.js";
// handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log('Shutting down the server for handling uncaught exception')
    server.close(()=>{
        process.exit(1)
    })
})


// config
if (process.env.NODE_ENV !== "PRODUCTION"){
config({
    path:"config/.env"
})
}

// connect database

connectDatabase()

connectCloudinary()

// create server
const server=app.listen(process.env.PORT,()=>{
    console.log(`server on runing on http://localhost:${process.env.PORT}`)
})

// unhandled promise rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Shutting down the server for ${err.message}`)
    console.log(`Error: ${err.message}`);
    server.close(()=>{
        process.exit(1)
    })
})