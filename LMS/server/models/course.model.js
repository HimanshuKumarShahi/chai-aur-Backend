import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({

title:String,
description:String,
instructor:String,
image:String,
price:Number

},{timestamps:true})

export default mongoose.model("Course",courseSchema)