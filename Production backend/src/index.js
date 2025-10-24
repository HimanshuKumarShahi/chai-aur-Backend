    import express from "express"
    import dotenv from "dotenv"
    import connectDB from "./db/index.js";
    
    dotenv.config({
        path:'./env'
    })
    const app=express();

 app.on("error",(error)=>{
    console.log(("Error",error));
    throw error
   })

connectDB().then(()=>{
    app.listen(process.env.PORT || 8000,()=>{`⁕ server is Running at port: ${process.env.PORT}`})
    
})
.catch((err)=>{
    console.log("MONGO DB connection failed!!",err);
})
    




/*
    import express from "express"
const app=express()

(async()=>{try{
   await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
   app.on("error",(error)=>{
    console.log(("Error",error));
    throw error
   })

   app.listen(process.env.PORT,()=>{
    console.log(`App is listening on port ${process.env.PORT}`);
    
   })
} catch(error){
    console.error("error:",error);
    throw error 
}
})()
*/