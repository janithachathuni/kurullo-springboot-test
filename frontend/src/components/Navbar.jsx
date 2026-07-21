import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import navbarlogo from "../assets/navbarlogo.png";
import birdlogo from "../assets/birdlogo.png";
import birdlogo3 from "../assets/birdlogo3.png";
import birdlogo4 from "../assets/birdlogo4.png";
import profilepic from "../assets/default_profile_pic.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!user;

  const [isDark, setIsDark] = useState(document.documentElement.getAttribute('data-theme') === 'dark');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const handleProfileClick = () => {
    if (user?.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className="py-3 px-4 sm:px-6 relative"
      style={{
        backgroundColor: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        color: "var(--text-primary)",
      }}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Left-aligned logo and name */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 text-2xl sm:text-3xl font-extrabold" style={{ color: "var(--accent)" }}>
            <Link to="/"><h1>Kurullo</h1></Link>
            <img
              src={isDark ? birdlogo4 : birdlogo}
              className="h-4 sm:h-5 -ml-4 sm:-ml-5 -mt-5 sm:-mt-7"
              alt="Kurullo logo"
            />
          </div>
        </div>

        {/* Hamburger Menu Button - Mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2 rounded hover:bg-opacity-10 hover:bg-gray-500 transition"
          style={{ color: "var(--text-primary)" }}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ backgroundColor: "var(--text-primary)" }}></span>
          <span className={`w-6 h-0.5 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} style={{ backgroundColor: "var(--text-primary)" }}></span>
          <span className={`w-6 h-0.5 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ backgroundColor: "var(--text-primary)" }}></span>
        </button>

        {/* Right-aligned items - Desktop */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-10">
          <Link to="/about" className="hover:opacity-70 transition text-sm xl:text-base" style={{ color: "var(--text-primary)" }}>
            About
          </Link>
          <Link to="/events" className="hover:opacity-70 transition text-sm xl:text-base" style={{ color: "var(--text-primary)" }}>
            Events
          </Link>
          <Link to="/articles" className="hover:opacity-70 transition text-sm xl:text-base" style={{ color: "var(--text-primary)" }}>
            Articles
          </Link>
          <Link to="/birdlist" className="hover:opacity-70 transition text-sm xl:text-base" style={{ color: "var(--text-primary)" }}>
            Birds of Sri Lanka
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleProfileClick}
              className="flex items-center justify-center rounded-full border-2 hover:opacity-80 transition focus:outline-none"
              style={{ width: "40px", height: "40px", borderColor: "var(--border)" }}
            >
              <img
                src={profilepic}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
          ) : (
            <Link
              to="/login"
              className="border px-4 py-2 hover:opacity-80 transition text-sm xl:text-base"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="flex flex-col items-center gap-4 py-4 mt-2 border-t" style={{ borderColor: "var(--border)" }}>
          <Link 
            to="/about" 
            onClick={handleLinkClick}
            className="hover:opacity-70 transition text-base" 
            style={{ color: "var(--text-primary)" }}
          >
            About
          </Link>
          <Link 
            to="/events" 
            onClick={handleLinkClick}
            className="hover:opacity-70 transition text-base" 
            style={{ color: "var(--text-primary)" }}
          >
            Events
          </Link>
          <Link 
            to="/articles" 
            onClick={handleLinkClick}
            className="hover:opacity-70 transition text-base" 
            style={{ color: "var(--text-primary)" }}
          >
            Articles
          </Link>
          <Link 
            to="/birdlist" 
            onClick={handleLinkClick}
            className="hover:opacity-70 transition text-base" 
            style={{ color: "var(--text-primary)" }}
          >
            Birds of Sri Lanka
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleProfileClick}
              className="flex items-center justify-center rounded-full border-2 hover:opacity-80 transition focus:outline-none"
              style={{ width: "44px", height: "44px", borderColor: "var(--border)" }}
            >
              <img
                src={profilepic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </button>
          ) : (
            <Link
              to="/login"
              onClick={handleLinkClick}
              className="border px-6 py-2 hover:opacity-80 transition text-base w-32 text-center"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
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