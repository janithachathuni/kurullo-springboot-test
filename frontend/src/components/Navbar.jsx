import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import navbarlogo from "../assets/navbarlogo.png";
import profilepic from "../assets/default_profile_pic.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user;

  const handleProfileClick = () => {
    if (user?.moderator) {
      navigate("/admin/dashboard");
    } else {
      navigate("/birder/dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/"; // replaces navigate('/') + reload()
  };

  return (
    <nav
      style={{
        backgroundColor: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
      }}
      className="py-3 px-6"
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 text-3xl font-extrabold"
          style={{ color: "var(--accent)" }}
        >
          <Link to="/">
            <h1>Kurullo</h1>
          </Link>
          <img
            src={navbarlogo}
            className="h-5 -ml-5 -mt-7"
            alt="Kurullo logo"
          />
        </div>

        {/* Nav Links */}
        <div className="flex items-center space-x-10">
          <Link
            to="/about"
            style={{ color: "var(--text-secondary)" }}
            className="hover:opacity-80 transition"
          >
            About
          </Link>
          <Link
            to="/events"
            style={{ color: "var(--text-secondary)" }}
            className="hover:opacity-80 transition"
          >
            Events
          </Link>
          <Link
            to="/articles"
            style={{ color: "var(--text-secondary)" }}
            className="hover:opacity-80 transition"
          >
            Articles
          </Link>
          <Link
            to="/birdlist"
            style={{ color: "var(--text-secondary)" }}
            className="hover:opacity-80 transition"
          >
            Birds of Sri Lanka
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
            className="px-3 py-2 rounded-lg text-sm transition hover:opacity-80"
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleProfileClick}
                style={{ border: "2px solid var(--border)" }}
                className="flex items-center justify-center rounded-full hover:opacity-80 transition focus:outline-none"
                style={{ width: "40px", height: "40px" }}
              >
                <img
                  src={profilepic}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>
              <button
                onClick={handleLogout}
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
                className="px-4 py-2 text-sm hover:opacity-80 transition rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-text)",
              }}
              className="px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
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
