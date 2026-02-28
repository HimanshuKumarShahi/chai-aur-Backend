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
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        isVerified: {
            type: Boolean,
            default: false
        },

        verificationToken: String,
        verificationTokenExpire: Date,
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

userSchema.methods.generateVerificationToken = function () {
    const token = crypto.randomBytes(32).toString("hex");

    this.verificationToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    this.verificationTokenExpire = Date.now() + 10 * 60 * 1000; 

    return token;
};

const User = mongoose.model("User", userSchema);

export default User;