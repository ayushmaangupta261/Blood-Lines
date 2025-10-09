import { apiConnector } from "../apiconnector.js";
import { authEndpoints } from "../apiEndpoints/authEndpoints.js";
import { setUser, setLoading } from "../../redux/slices/userSlice.js";
import toast from "react-hot-toast";

const { SignUp_Url, LogIn_Url } = authEndpoints;


export const signup = (data) => async (dispatch) => {

    try {
        dispatch(setLoading(true));
        const { name, email, mobileNumber, password, aadharNumber } = data;


        if (!name || !email || !mobileNumber || !password || !aadharNumber) {
            toast.error("Please provide all details");
            return;
        }


        const signUpResponse = await apiConnector("POST", SignUp_Url, {
            name,
            email,
            mobileNumber,
            password,
            aadharNumber,
        });

        console.log("Signup response ->", signUpResponse);


        if (signUpResponse?.data?.user) {
            dispatch(setUser(signUpResponse.data.user));
            toast.success("Signup successful!");
        } else {
            toast.error(signUpResponse?.data?.message || "Signup failed");
        }
    } catch (error) {
        console.error("Signup API error ->", error);
        toast.error(error.response?.data?.message || "Signup failed");
        dispatch(setLoading(false));
        return;
    }
};



export const login = (data) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { email, password, mobileNumber } = data;

        if (!password || !email || !mobileNumber) {
            toast.error("Please provide all details")
        }

        const loginResponse = await apiConnector("POST", LogIn_Url,
            {
                email,
                mobileNumber,
                password
            }
        )

        console.log("Login response -> ", loginResponse)

        if (loginResponse?.data?.user) {
            dispatch(setUser(loginResponse.data.user));
            toast.success("LogIn successful!");
        } else {
            toast.error(loginResponse?.data?.message || "LogIn failed");
        }
    } catch (error) {
        console.error("Signup API error ->", error);
        toast.error(error.response?.data?.message || "LogIn failed");
        dispatch(setLoading(false));
        return;
    }
}