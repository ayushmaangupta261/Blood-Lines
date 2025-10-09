import React from 'react';
import { useForm } from 'react-hook-form';

const LogIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Login Data:', data);
  };

  // Helper function for placeholders
  const getPlaceholder = (field, defaultText) => {
    return errors[field] ? errors[field].message : defaultText;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full p-6 flex flex-col justify-center"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-start">
        Welcome Back!
      </h2>

      {/* Email */}
      <div className="flex flex-col mb-3">
        <input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
          })}
          className={`px-4 py-2 border rounded-lg outline-none transition ${
            errors.email ? 'border-red-500 text-red-500' : 'focus:border-red-500'
          }`}
          placeholder={getPlaceholder('email', 'Email')}
        />
      </div>

      {/* Password */}
      <div className="flex flex-col mb-3">
        <input
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Minimum 6 characters' },
          })}
          className={`px-4 py-2 border rounded-lg outline-none transition ${
            errors.password ? 'border-red-500 text-red-500' : 'focus:border-red-500'
          }`}
          placeholder={getPlaceholder('password', 'Password')}
        />
      </div>

      {/* Mobile Number */}
      <div className="flex flex-col mb-4">
        <input
          type="tel"
          {...register('mobileNumber', {
            required: 'Mobile number is required',
            pattern: { value: /^[0-9]{10}$/, message: 'Enter 10 digit mobile number' },
          })}
          className={`px-4 py-2 border rounded-lg outline-none transition ${
            errors.mobileNumber ? 'border-red-500 text-red-500' : 'focus:border-red-500'
          }`}
          placeholder={getPlaceholder('mobileNumber', 'Mobile Number')}
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 mt-3 rounded-lg bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold shadow-md hover:shadow-lg transition"
      >
        Log In
      </button>
    </form>
  );
};

export default LogIn;
