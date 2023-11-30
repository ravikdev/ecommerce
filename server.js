import express from 'express';
import dotenv from 'dotenv';
import ConnectDb from './config/db';
const app = express();

//Config Environment
dotenv.config()

const PORT = process.env.PORT

//data base config
ConnectDb();

app.get('/',(req,res)=>{
    res.send("This is running");
})

app.listen(PORT,()=>{
    console.log(`server is runnning`, PORT);
})

