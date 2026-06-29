import React, { useState } from "react";
import { Link } from "react-router-dom";
import signupImage1 from "../assets/signup_image1.jpg";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
localStorage.setItem("user", JSON.stringify({ username: data.username, role: data.role }));

if (data.role === "ADMIN") {
  window.location.href = "/admin/dashboard";
} else if (data.isFirstLogin || !data.profileCompleted) {
  window.location.href = "/create-profile";
} else {
  window.location.href = "/dashboard";
}

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
      <div className="relative w-1/2 border-r border-black group">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${signupImage1})` }}
        />
        <div className="relative h-full flex flex-col justify-between p-10 text-white">
          <div className="p-4 rounded-lg max-w-max">
            <p className="text-xl font-bold">Blue-Tailed Bee Eater</p>
            <p className="italic">Merops phillipinus</p>
          </div>
          <div className="p-4 rounded-lg max-w-max self-end flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Thalangama Lake</span>
          </div>
        </div>
      </div>

      {/* Form Column */}
      <div className="w-1/2 flex items-center justify-center p-10" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="w-full max-w-md space-y-4">
          <h1 className="text-3xl mb-10 text-left" style={{ color: "var(--text-primary)" }}>
            Sign in to your account
          </h1>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col items-start space-y-1">
              <label className="text-left w-full" style={{ color: "var(--text-secondary)" }}>Email</label>
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
              <label className="text-left w-full" style={{ color: "var(--text-secondary)" }}>Password</label>
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
              className="w-full rounded text-white py-2 px-4 transition-colors mt-6 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Sign in
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <hr className="flex-1" style={{ borderColor: "var(--border)" }} />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>or</span>
            <hr className="flex-1" style={{ borderColor: "var(--border)" }} />
          </div>

          {/* Google Login */}
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

          <Link
            to="/forgot-password"
            className="block text-sm hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Forgot password?
          </Link>

          <span style={{ color: "var(--text-secondary)" }}>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="border rounded px-4 py-2 hover:opacity-80 transition-colors"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-primary)",
              }}
            >
              Sign up
            </Link>
          </span>

        </div>
      </div>
    </div>
  );
};

export default Login;