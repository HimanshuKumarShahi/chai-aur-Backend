import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Name is required for creating an Account."]
        },
        email:{
            type:String,
            required:[true,"Email is required for create user"],
            unique:[true,"Email already Exists"],
            trim:true,
            lowercase:true,
            match:[/^(?!\\.)(?!.*\\.\\.)([a-z0-9_+\\-\\.]*[a-z0-9_+\\-])@([a-z0-9][a-z0-9-]*\\.)+[a-z]{2,}$/ , "Invalid Email Address."]
        },
        password:{
            type:String,
            required:[true,"Password is required for creating an account"],
            minlength:[6,"Password must be 6 or character"],
            select:false
        }
    },{timestamps:true}
);

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password=await bcrypt.hash(this.password,12);
    next();
})

userSchema.methods.comparePassword=async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
}

const User=mongoose.model("User",userSchema);

export default User;