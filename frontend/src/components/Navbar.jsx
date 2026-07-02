import React from "react";
import { Link, useNavigate } from "react-router-dom";
import navbarlogo from "../assets/navbarlogo.png";
import profilepic from "../assets/default_profile_pic.png";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!user;

  const handleProfileClick = () => {
    if (user?.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <nav className="bg-white border-b border-black py-3 px-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left-aligned logo and name */}
        <div className="flex items-center">
          <div className='flex items-center gap-3 text-3xl font-extrabold text-[#506142]'>
            <Link to="/"><h1>Kurullo</h1></Link>
            <img
              src={navbarlogo}
              className="h-5 -ml-5 -mt-7"
              alt="Kurullo logo"
            />
          </div>

          <div className="flex items-center gap-3">
            <img
              src={navbarlogo}
              className="h-12 -ml-10 -mt-25"
              alt="Kurullo logo"
            />
          </div>
        </div>

        {/* Right-aligned items */}
        <div className="flex items-center space-x-10">
          <Link to="/about" className="text-gray-900 hover:text-amber-900">
            About
          </Link>
          <Link to="/events" className="text-gray-900 hover:text-amber-900">
            Events
          </Link>
          <Link to="/articles" className="text-gray-900 hover:text-amber-900">
            Articles
          </Link>
          <Link to="/birdlist" className="text-gray-900 hover:text-amber-900">
            Birds of Sri Lanka
          </Link>
          
          {/* Conditional rendering based on login status */}
          {isLoggedIn ? (
            // Show profile picture if logged in
            <button 
              onClick={handleProfileClick}
              className="flex items-center justify-center rounded-full border-2 border-black hover:border-amber-900 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              style={{ width: '40px', height: '40px' }}
            >
              <img 
                src={profilepic} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
          ) : (
            // Show sign in button if not logged in
            <Link 
              to="/login" 
              className="border border-black bg-[#f8eec8] px-4 py-2 hover:border-black hover:bg-amber-100 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;