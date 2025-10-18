import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {
    try {

        // console.log("Cookie -> ", req.cookies);

        const accessToken = req.cookies?.accessToken;
        const refreshToken = req.cookies?.refreshToken;

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No access token provided",
                forceLogout: true,
            });
        }

        // ✅ Verify access token
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded;
            return next();
        } catch (error) {
            // 🔁 Handle token expiration
            if (error.name === "TokenExpiredError") {
                if (!refreshToken) {
                    return res.status(401).json({
                        success: false,
                        message: "Session expired. Please log in again.",
                        forceLogout: true,
                    });
                }

                try {
                    const decodedRefresh = jwt.verify(
                        refreshToken,
                        process.env.REFRESH_TOKEN_SECRET
                    );

                    const user = await User.findById(decodedRefresh.id);
                    if (!user || user.refreshToken !== refreshToken) {
                        return res.status(403).json({
                            success: false,
                            message: "Invalid refresh token. Please log in again.",
                            forceLogout: true,
                        });
                    }

                    // ✅ Generate new access token
                    const newAccessToken = jwt.sign(
                        { id: user._id, email: user.email },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
                    );

                    user.accessToken = newAccessToken;
                    await user.save();

                    res.cookie("token", newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
                    });

                    req.user = { id: user._id, email: user.email };
                    return next();
                } catch (refreshError) {
                    console.error("Refresh token error:", refreshError.message);
                    return res.status(403).json({
                        success: false,
                        message: "Invalid or expired refresh token. Please log in again.",
                        forceLogout: true,
                    });
                }
            } else {
                return res.status(403).json({
                    success: false,
                    message: "Invalid token.",
                    forceLogout: true,
                });
            }
        }
    } catch (err) {
        console.error("Auth Middleware Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal server error in authentication middleware.",
            forceLogout: true,
        });
    }
};
