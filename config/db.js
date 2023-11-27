import mongoose from "mongoose";
// getting-started.js


const ConnectDb = async ()=> {
    try{
  await mongoose.connect('mongodb+srv://devzamark:Ra7206651200@democluster.ckrcctd.mongodb.net/ecommerce');
    }
    catch(error){
        console.log('the erroe while conneting mongo db', error);
    }
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}