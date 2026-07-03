import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import navbarlogo from "../assets/navbarlogo.png";
import birdlogo from "../assets/birdlogo.png";
import birdlogo3 from "../assets/birdlogo3.png";
import birdlogo4 from "../assets/birdlogo4.png";
import profilepic from "../assets/default_profile_pic.png";

const Navbar = () => {
  const navigate = useNavigate();

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
  };

  return (
    <nav
      className="py-3 px-6"
      style={{
        backgroundColor: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        color: "var(--text-primary)",
      }}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Left-aligned logo and name */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-3xl font-extrabold" style={{ color: "var(--accent)" }}>
            <Link to="/"><h1>Kurullo</h1></Link>
            <img
              src={isDark ? birdlogo4 : birdlogo}
              className="h-5 -ml-5 -mt-7"
              alt="Kurullo logo"
            />
          </div>
        </div>

        {/* Right-aligned items */}
        <div className="flex items-center space-x-10">
          <Link to="/about" className="hover:opacity-70 transition" style={{ color: "var(--text-primary)" }}>
            About
          </Link>
          <Link to="/events" className="hover:opacity-70 transition" style={{ color: "var(--text-primary)" }}>
            Events
          </Link>
          <Link to="/articles" className="hover:opacity-70 transition" style={{ color: "var(--text-primary)" }}>
            Articles
          </Link>
          <Link to="/birdlist" className="hover:opacity-70 transition" style={{ color: "var(--text-primary)" }}>
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
              className="border px-4 py-2 hover:opacity-80 transition"
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