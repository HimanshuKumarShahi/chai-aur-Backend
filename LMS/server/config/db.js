import mongoose from "mongoose";

function connectDB(){
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log(`Connected to DB.`); 
    }).catch(err=>{
        console.log(`DB ERROR: ${err}`);
        process.exit(1);
    })
}

export default connectDB;