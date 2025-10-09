import React, { useState } from 'react';
import leftSideImage from "../../assets/Authentication/auth-page-image.png";
import cross from "../../assets/Authentication/cancel.png";
import LogIn from './LogIn';
import Signup from './SignUp';

const AuthPage = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    // Overlay
      <div
      className='fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm p-4'
      onClick={onClose}
    >
      {/* Modal container */}
      <div
        className='w-full max-w-3xl md:flex md:h-[30rem] flex-col md:flex-row relative shadow-2xl bg-white rounded-xl overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button outside modal bounds */}
        <button
          onClick={onClose}
          className='absolute w-[3rem] h-[3rem]   '
        >
          <img src={cross} alt="close" className='w-[1.5rem] mx-auto hover:scale-110 duration-300' />
        </button>

        {/* Left: Form section */}
        <div className='w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-8'>
          {isLogin ? <LogIn /> : <Signup />}

          {/* Toggle link */}
          <p className='mt-4 text-sm text-gray-500 text-center'>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <span
              className='text-red-600 font-semibold cursor-pointer hover:underline'
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </span>
          </p>
        </div>

        {/* Right: Image section (hidden on smaller screens) */}
        <div className='hidden md:block w-[50%] relative'>
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
