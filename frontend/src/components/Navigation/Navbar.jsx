import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Navigation/logo.png";
import AuthPage from "../Authentication/Auth";
import { useSelector, useDispatch } from "react-redux";

import toast from "react-hot-toast";

const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0; path=/;"; 
    localStorage.removeItem("user"); 
    toast.success("Logged out successfully!");
    window.location.reload(); 
  };
  
  const handleLoginOpen = () => {
    if (user) {
      toast.success("You are already logged in!");
    } else {
      setShowAuth(true);
    }
  };

  return (
    <>
      <nav className="fixed left-1/2 -translate-x-1/2 w-[90%] z-50 bottom-5 md:top-4 md:bottom-auto">
        <div className="backdrop-blur-xl bg-white/40 shadow-lg h-[3.5rem] rounded-full flex items-center justify-between px-6 transition-all duration-300 border border-[#E6D8C3]">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <img src={logo} alt="logo" className="w-[2.2rem]" />
            <p className="font-extrabold text-2xl bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent tracking-wide">
              RakhtDhara
            </p>
          </Link>

          <div className="hidden sm:flex items-center gap-x-4 md:gap-8 font-semibold text-gray-700">
            <Link to="/" className="hover:text-red-600 transition">Home</Link>
            <Link to="/about" className="hover:text-red-600 transition">About</Link>
            <Link to="/donate" className="hover:text-red-600 transition">Donate</Link>
            <Link to="/contact" className="hover:text-red-600 transition">Contact</Link>
          </div>

          <div>
            {!user ? (
              <button
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold shadow-md hover:shadow-lg transition"
                onClick={handleLoginOpen}
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-gray-700 to-gray-500 text-white font-semibold shadow-md hover:shadow-lg transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {showAuth && <AuthPage onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default Navbar;
