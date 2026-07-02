import React, { useState } from "react";
import { Link } from "react-router-dom";
import signupImage1 from "../assets/signup_image1.jpg";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Registration successful! You can now log in.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
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
        <form className="w-full max-w-md space-y-4" onSubmit={handleRegister}>
          <h1 className="text-3xl mb-10 text-left">Sign up for Kurullo.lk</h1>

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
            <label className="text-left w-full">Username</label>
            <input
              name="username"
              type="text"
              className="border rounded border-amber-900 p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col items-start space-y-1">
            <label className="text-left w-full">Email</label>
            <input
              name="email"
              type="email"
              className="border rounded border-amber-900 p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col items-start space-y-1">
            <label className="text-left w-full">Password</label>
            <input
              name="password"
              type="password"
              className="border rounded border-amber-900 p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="mb-11 w-full bg-amber-900 rounded text-white py-2 px-4 hover:bg-amber-800 transition-colors mt-6 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Create account
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <hr className="flex-1 border-black" />
            <span className="text-sm">or</span>
            <hr className="flex-1 border-black" />
          </div>

          {/* Google Register */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border rounded border-amber-900 py-2 px-4 transition-colors hover:bg-amber-100"
            style={{ backgroundColor: "#f8eec8" }}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
            Continue with Google
          </button>

          <span>
            Already have an account?
            <button className="ml-5 border rounded border-black bg-[#f8eec8] px-4 py-2 hover:border-black hover:bg-amber-100 transition-colors">
              <Link to="/login">Sign in</Link>
            </button>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;