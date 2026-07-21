import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signupImage1 from "../assets/signup_image1.jpg";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
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
  window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`;
};

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Back Arrow Button */}
      <button
        onClick={handleGoBack}
        className="absolute top-6 right-6 z-10 p-2 bg-white/80 hover:bg-white rounded-full border-1 border-amber-700/35 transition-all duration-200 hover:scale-110"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-amber-900"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

      {/* Image Column - Hidden on mobile/tablet */}
      <div className="hidden lg:block relative w-1/2 border-r border-black group">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${signupImage1})` }}
        />
        <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-0" />
        <div className="relative h-full flex flex-col justify-between p-10 text-white">
          <div className="p-4 rounded-lg max-w-max">
            <p className="text-xl font-bold">Blue-Tailed Bee Eater</p>
            <p className="italic">Merops phillipinus</p>
          </div>
          <div className="p-4 rounded-lg max-w-max self-end flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Thalangama Lake</span>
          </div>
        </div>
      </div>

      {/* Form Column - Full width on mobile/tablet, half on desktop */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-10 bg-[#fffdef]">
        <form
          className="w-full max-w-md space-y-4"
          onSubmit={handleLogin}
        >
          <h1 className="text-3xl mb-10 text-left">Sign in to your account</h1>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

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
            className="w-full bg-amber-900 rounded text-white py-2 px-4 hover:bg-amber-800 transition-colors mt-6 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Submit
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <hr className="flex-1 border-black" />
            <span className="text-sm">or</span>
            <hr className="flex-1 border-black" />
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border rounded border-amber-900 py-2 px-4 transition-colors hover:bg-amber-100"
            style={{ backgroundColor: "#f8eec8" }}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
            Continue with Google
          </button>

          <Link
            to="/forgot-password"
            className="-mt-[10px] text-amber-800 hover:text-amber-600 block"
          >
            Forgot password?
          </Link>

          <br />

          <span>
            Don't have an account?
            <button className="ml-5 border rounded border-amber-900 bg-[#f8eec8] px-4 py-2 hover:border-black hover:bg-amber-100 transition-colors">
              <Link to="/register">Sign up</Link>
            </button>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;