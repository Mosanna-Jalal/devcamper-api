const mongoose = require('mongoose');
const colors=require('colors');


const connectDB=async ()=>{
  const conn=  await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    console.log(`mongoDB connected: ${conn.connection.host}`.cyan.italic);
}

module.exports=connectDB;