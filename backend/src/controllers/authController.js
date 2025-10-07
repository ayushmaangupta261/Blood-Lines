import User from "../models/userModel.js";
import { encryptAadhaar, decryptAadhaar, maskAadhaar } from "../utils/encryption/aadharEncryption.js";


// code for user signup
export const signup = async (req, res) => {
    try {
        const { name, email, password, mobileNumber, aadharNumber } = req.body;

        // Basic field validation
        if (!name || !email || !password || !mobileNumber || !aadharNumber) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate Aadhaar number
        if (!/^\d{12}$/.test(aadharNumber)) {
            return res.status(400).json({ message: "Aadhaar number must be exactly 12 digits." });
        }

        // Validate mobile number
        if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
            return res.status(400).json({ message: "Please enter a valid 10-digit mobile number." });
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        // Encrypt Aadhaar number
        const encryptedAadhaar = encryptAadhaar(aadharNumber);

        // Create new user
        const user = new User({
            name,
            email,
            password,
            mobileNumber,
            aadharNumber: JSON.stringify(encryptedAadhaar),
        });

        // Generate JWT tokens
        const tokens = user.generateTokens();
        await user.save();

        // Prepare response
        const userData = user.toObject();
        delete userData.password;
        delete userData.accessToken;
        delete userData.refreshToken;

        // Mask Aadhaar for display
        userData.aadharNumber = maskAadhaar(
            decryptAadhaar(JSON.parse(user.aadharNumber), 8)
        );

        // Send tokens in cookies
        res
            .cookie("accessToken", tokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
            })
            .cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
            })
            .status(201)
            .json({
                message: "User registered successfully",
                user: userData,
            });

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json(
            { message: "Server error" }
        );
    }
};




// code for user login
export const login = async (req, res) => {
    try {

        const { email, password, mobileNumber } = req.body;

        if ((!email && !mobileNumber) || !password) {
            return res.status(400).json({ message: "Email or Mobile Number and Password are required." });
        }

        // Validate mobile number
        if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
            return res.status(400).json({ message: "Please enter a valid 10-digit mobile number." });
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }


        const user = await User.findOne({ $or: [{ email }, { mobileNumber }] });

        if (!user) {
            return res.status(400).json(
                {
                    message: "User not found."
                }
            );
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json(
                {
                    message: "Password is incorrect."
                }
            );
        }

        // Generate new tokens
        const tokens = user.generateTokens();
        await user.save();

        // Prepare response
        const userData = user.toObject();
        delete userData.password;
        delete userData.accessToken;
        delete userData.refreshToken;

        // Mask Aadhaar for display
        userData.aadharNumber = maskAadhaar(
            decryptAadhaar(JSON.parse(user.aadharNumber), 8)
        );

        // Send tokens in cookies
        res
            .cookie("accessToken", tokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days  
            })
            .cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days  
            })
            .status(200)
            .json({
                message: "Login successful",
                user: userData,
            });


    } catch (error) {
        console.log("Error during login:", error);
        res.status(500).json({ message: "Server error" });
    }
}

