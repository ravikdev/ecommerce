import express from 'express';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
// import newrelic from newrelic;


const app = express();
dotenv.config()//Calling config function

//configure env
dotenv.config();

//databse config
connectDB();

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//route
app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT

app.get('/',(req,res)=>{
    res.send("This is running");
})

app.listen(PORT,()=>{
    console.log(`server is runnning`, PORT);
})

