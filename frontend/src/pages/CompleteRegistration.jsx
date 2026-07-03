// CompleteRegistration.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import signupImage1 from "../assets/signup_image1.jpg";

const CompleteRegistration = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [googleId, setGoogleId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmail(params.get("email") || "");
    setGoogleId(params.get("googleId") || "");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(
        "http://localhost:8080/api/auth/complete-google-registration",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, googleId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Registration complete! You can now log in.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Image Column - Background */}
      <div
        className="w-1/2 bg-cover bg-center border-r border-black"
        style={{ backgroundImage: `url(${signupImage1})` }}
      ></div>

      {/* Form Column */}
      <div className="w-1/2 flex items-center justify-center p-10 bg-[#fffdef]">
        <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
          <h1 className="text-3xl mb-10 text-left">
            Complete Your Registration
          </h1>
          <p className="text-gray-600 -mt-6 mb-4 text-left">
            Welcome! Just pick a username to finish setting up your account.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="flex flex-col items-start space-y-1">
            <label className="text-left w-full">Email</label>
            <input
              type="email"
              className="border rounded border-amber-900 p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500 bg-gray-100 cursor-not-allowed"
              value={email}
              disabled
            />
          </div>

          <div className="flex flex-col items-start space-y-1">
            <label className="text-left w-full">Username</label>
            <input
              type="text"
              className="border rounded border-amber-900 p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Choose a username"
            />
          </div>

          <button
            type="submit"
            className="mb-11 w-full bg-amber-900 rounded text-white py-2 px-4 hover:bg-amber-800 transition-colors mt-6 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Complete Registration
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <hr className="flex-1 border-black" />
            <span className="text-sm">or</span>
            <hr className="flex-1 border-black" />
          </div>

          {/* Back to Login */}
          <div className="flex justify-center">
            <span>
              Already have an account?
              <button className="ml-5 border rounded border-black bg-[#f8eec8] px-4 py-2 hover:border-black hover:bg-amber-100 transition-colors">
                <Link to="/login">Sign in</Link>
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteRegistration;