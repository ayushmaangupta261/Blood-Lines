import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        mobileNumber: {
            type: String,
            unique: true,
            minlength: 10,
            maxlength: 10,
        },
        aadharNumber: {
            type: String,
        },
        address: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profile: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        accessToken: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true, // automatically creates createdAt and updatedAt
    }
);

// Pre-save hook to hash password
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to generate JWT tokens
UserSchema.methods.generateTokens = function () {
    const accessToken = jwt.sign(
        { id: this._id, email: this.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // 5 days expiry
    );

    const refreshToken = jwt.sign(
        { id: this._id, email: this.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // 10 days expiry
    );

    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    return { accessToken, refreshToken };
};


// Method to compare password during login
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model("User", UserSchema);
export default User;
