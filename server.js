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
//test
app.get('/',(req,res)=>{
    res.send("This is running");
})

app.get('/login-test', (req, res) => {
    const { username, password } = req.query;
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    db.get(query, [], (err, row) => {
        if (row) {
            res.send("Login successful! Welcome, " + row.username);
        } else {
            res.send("Invalid credentials");
        }
    });
});

// Vulnerable XSS Endpoint
app.get('/greet', (req, res) => {
    const name = req.query.name;
    res.send(`<h1>Hello, ${name}</h1>`); // No sanitization
});
app.listen(PORT,()=>{
    console.log(`server is runnning`, PORT);
})

export default app;
