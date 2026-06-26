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

      {/* Image Column */}
      <div
        className="w-1/2 bg-cover bg-center border-r"
        style={{
          backgroundImage: `url(${signupImage1})`,
          borderColor: "var(--border)",
        }}
      />

      {/* Form Column */}
      <div
        className="w-1/2 flex items-center justify-center p-10"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="w-full max-w-md space-y-4">
          <h1 className="text-3xl mb-10 text-left" style={{ color: "var(--text-primary)" }}>
            Sign up for Kurullo.lk
          </h1>

          {error && (
            <div className="border px-4 py-3 rounded text-sm text-red-700 bg-red-100 border-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="border px-4 py-3 rounded text-sm text-green-700 bg-green-100 border-green-300">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex flex-col items-start space-y-1">
              <label className="text-left w-full text-sm" style={{ color: "var(--text-secondary)" }}>Username</label>
              <input
                name="username"
                type="text"
                className="border rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-primary)",
                }}
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col items-start space-y-1">
              <label className="text-left w-full text-sm" style={{ color: "var(--text-secondary)" }}>Email</label>
              <input
                name="email"
                type="email"
                className="border rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-primary)",
                }}
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col items-start space-y-1">
              <label className="text-left w-full text-sm" style={{ color: "var(--text-secondary)" }}>Password</label>
              <input
                name="password"
                type="password"
                className="border rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-primary)",
                }}
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded text-white py-2 px-4 transition-colors mt-6 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:opacity-90"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Create account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <hr className="flex-1" style={{ borderColor: "var(--border)" }} />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>or</span>
            <hr className="flex-1" style={{ borderColor: "var(--border)" }} />
          </div>

          {/* Google Register */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border rounded py-2 px-4 transition-colors hover:opacity-80"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
            }}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
            Continue with Google
          </button>

          <span style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="border rounded px-4 py-2 hover:opacity-80 transition-colors"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-primary)",
              }}
            >
              Sign in
            </Link>
          </span>

        </div>
      </div>
    </div>
  );
};

export default Register;