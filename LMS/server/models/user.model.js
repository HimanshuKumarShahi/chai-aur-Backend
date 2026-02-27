import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required for create user"],
            unique: [true, "Email already Exists"],
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
        },
        name: {
            type: String,
            required: [true, "Name is required for creating an Account."]
        },
        password: {
            type: String,
            required: [true, "Password is required for creating an account"],
            minlength: [6, "Password must be contain 6 or more character"],
            select: false
        },
    }, { timestamps: true }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return
    }
    this.password = await bcrypt.hash(this.password, 12);
    
})

userSchema.methods.comparePassword = async function (Password) {
    return await bcrypt.compare(Password, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;