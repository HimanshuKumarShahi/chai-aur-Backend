import mongoose from 'mongoose'

const connectDB=async ()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log(`👍🏼  Server is Connected to DB.`);
    })
    .catch(err=>{
        console.log(`✖️  Error  connecting to DB`);
        process.exit(1);
    })
};

export default connectDB;