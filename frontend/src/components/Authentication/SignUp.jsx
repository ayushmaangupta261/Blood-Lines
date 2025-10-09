import React from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { signup } from '../../services/operations/authApi.js';
import { setLoading } from '../../redux/slices/userSlice.js';

const Signup = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();

    const onSubmit = async (data) => {
        const res = await dispatch(signup(data));
        return;
    };

    // Handle errors and show toast
    const onError = (errors) => {
        const firstError = Object.values(errors)[0]?.message;
        if (firstError) toast.error(firstError);
    };

    return (
        <>
            {/* Toast container */}
            <Toaster position="top-right" reverseOrder={false} />

            <form
                onSubmit={handleSubmit(onSubmit, onError)}
                className="w-full p-6 flex flex-col justify-center"
            >
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-start">
                    Sign Up
                </h2>

                {/* Name */}
                <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="px-4 py-2 border rounded-lg outline-none mb-3 focus:border-red-500 transition"
                    placeholder="Full Name"
                />

                {/* Email */}
                <input
                    type="email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                    })}
                    className="px-4 py-2 border rounded-lg outline-none mb-3 focus:border-red-500 transition"
                    placeholder="Email"
                />

                {/* Password */}
                <input
                    type="password"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Minimum 6 characters' },
                    })}
                    className="px-4 py-2 border rounded-lg outline-none mb-3 focus:border-red-500 transition"
                    placeholder="Password"
                />

                {/* Mobile Number */}
                <input
                    type="tel"
                    {...register('mobileNumber', {
                        required: 'Mobile number is required',
                        pattern: { value: /^[0-9]{10}$/, message: 'Enter 10 digit mobile number' },
                    })}
                    className="px-4 py-2 border rounded-lg outline-none mb-3 focus:border-red-500 transition"
                    placeholder="Mobile Number"
                />

                {/* Aadhar Number */}
                <input
                    type="text"
                    {...register('aadharNumber', {
                        required: 'Aadhar number is required',
                        pattern: { value: /^[0-9]{12}$/, message: 'Enter 12 digit Aadhar number' },
                    })}
                    className="px-4 py-2 border rounded-lg outline-none mb-4 focus:border-red-500 transition"
                    placeholder="Aadhar Number"
                />

                <button
                    type="submit"
                    className="w-full py-2 mt-3 rounded-lg bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold shadow-md hover:shadow-lg transition"
                >
                    Sign Up
                </button>
            </form>
        </>
    );
};

export default Signup;
