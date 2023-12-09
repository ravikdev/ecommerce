import mongoose from "mongoose";
// getting-started.js

const connectDb = async () => {
    try{
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(
        `Conneted To Mongodb Databse ${conn.connection.host}`
      );
    }
    catch(error){
        console.log('the erroe while conneting mongo db', error);
    }
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

export default connectDb;