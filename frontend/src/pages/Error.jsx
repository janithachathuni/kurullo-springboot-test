import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import birdlogo from '../assets/birdlogo.png'
import birdlogo4 from '../assets/birdlogo4.png'

const Error = () => {
  const [isDark, setIsDark] = useState(document.documentElement.getAttribute('data-theme') === 'dark');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!user;

  const homeLink = isLoggedIn
    ? (user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard")
    : "/";

  const homeLabel = isLoggedIn ? "Back to Dashboard" : "Back to Home";

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <img
          src={isDark ? birdlogo4 : birdlogo}
          alt="Kurullo logo"
          className="w-20 h-20 md:w-32 md:h-32 object-contain mb-6 opacity-90"
        />

        <h1
          className="text-7xl md:text-8xl font-extrabold tracking-tight"
          style={{ color: "var(--accent)" }}
        >
          404
        </h1>

        <p className="mt-4 text-xl md:text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          This bird has flown the nest.
        </p>

        <p className="mt-2 max-w-md" style={{ color: "var(--text-secondary, var(--text-primary))" }}>
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link
          to={homeLink}
          className="mt-8 px-6 py-3 border font-medium hover:opacity-80 transition rounded-lg"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--accent)",
            color: "var(--bg-primary)",
          }}
        >
          {homeLabel}
        </Link>
      </div>

      <Footer />
    </div>
  )
}

export default Error