import mongoose from 'mongoose'

const ConnectDB=()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log(`👍🏼  MongoDB Connected.`); 
    }).catch((err)=>{
        console.log(`❌ MongoDB Connection Failde. ${err.message}`);
        process.exit(1);
    });
}

export default ConnectDB;