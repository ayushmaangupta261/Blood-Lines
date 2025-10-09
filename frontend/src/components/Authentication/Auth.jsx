import React, { useState } from 'react';
import leftSideImage from "../../assets/Authentication/auth-page-image.png";
import cross from "../../assets/Authentication/cancel.png";
import LogIn from './LogIn';
import Signup from './SignUp';

const AuthPage = ({ onClose }) => {
  // State to switch between login and signup
  const [isLogin, setIsLogin] = useState(true);

  return (
    // Overlay
    <div
      className='fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm'
      onClick={onClose} // click on overlay closes modal
    >
      {/* Modal container */}
      <div
        className='w-[60%] h-[30rem] flex overflow-visible relative shadow-2xl bg-white rounded-xl'
        onClick={(e) => e.stopPropagation()} // prevent modal clicks from closing
      >
        {/* Close Button outside modal bounds */}
        <button
          onClick={onClose}
          className='absolute w-[3rem] h-[3rem] -top-7 -left-[3.5rem] rounded-full p-1 shadow-md hover:shadow-lg transition z-10 bg-white'
        >
          <img src={cross} alt="close" className='w-[1.5rem] mx-auto' />
        </button>

        {/* Left: Form section */}
        <div className='w-[50%] flex flex-col items-center justify-center p-8'>
          {isLogin ? <LogIn /> : <Signup />}
          
          {/* Toggle link */}
          <p className='mt-4 text-sm text-gray-500'>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <span
              className='text-red-600 font-semibold cursor-pointer hover:underline'
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </span>
          </p>
        </div>

        {/* Right: Image section */}
        <div className='w-[50%] relative'>
          <img
            src={leftSideImage}
            alt="auth illustration"
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
