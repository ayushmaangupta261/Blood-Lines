// src/components/Navigation/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../../assets/Navigation/logo.png";
import AuthPage from '../Authentication/Auth'; // import the modal

const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] z-50">
        <div className="backdrop-blur-xl bg-white/40 shadow-lg h-[3.5rem] rounded-full flex items-center justify-between px-6 transition-all duration-300">

          {/* Left: Logo + Brand Name */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <img src={logo} alt="logo" className="w-[2.2rem]" />
            <p className="font-extrabold text-2xl bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent tracking-wide">
              RakhtDhara
            </p>
          </Link>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-8 font-semibold text-gray-700">
            <Link to="/" className="hover:text-red-600 transition">Home</Link>
            <Link to="/about" className="hover:text-red-600 transition">About</Link>
            <Link to="/donate" className="hover:text-red-600 transition">Donate</Link>
            <Link to="/contact" className="hover:text-red-600 transition">Contact</Link>
          </div>

          {/* Right: Login Button */}
          <div>
            <button
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold shadow-md hover:shadow-lg transition"
              onClick={() => setShowAuth(true)}
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Show Auth Modal */}
      {showAuth && <AuthPage onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default Navbar;
