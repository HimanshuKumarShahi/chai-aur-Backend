import express from 'express'

const app=express();

app.get('/',(req,res)=>{
    res.send("You are connected.")
})

app.listen(5000,()=>{
    console.log("Server is running.");
    
})