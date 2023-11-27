import express from 'express';
import dotenv from 'dotenv';
const app = express();
dotenv.config()//Calling config function

const PORT = process.env.PORT

app.get('/',(req,res)=>{
    res.send("This is running");
})

app.listen(PORT,()=>{
    console.log(`server is runnning`, PORT);
})

