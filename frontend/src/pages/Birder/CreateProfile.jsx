// CreateProfile.jsx

import React, { useState, useRef, useEffect } from "react";

const CreateProfile = () => {
  const [form, setForm] = useState({ displayName: "", bio: "" });
  const [profilePic, setProfilePic] = useState(null);
  const [bannerPic, setBannerPic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [bannerPicPreview, setBannerPicPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const profilePicRef = useRef();
  const bannerPicRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (type === "profilePic") {
      setProfilePic(file);
      setProfilePicPreview(preview);
    } else {
      setBannerPic(file);
      setBannerPicPreview(preview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("displayName", form.displayName);
      formData.append("bio", form.bio);
      if (profilePic) formData.append("profilePic", profilePic);
      if (bannerPic) formData.append("bannerPic", bannerPic);

      const res = await fetch("http://localhost:8080/api/profile/complete", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Banner */}
        <div
          className="h-36 bg-gray-300 bg-cover bg-center cursor-pointer flex items-center justify-center group relative"
          style={
            bannerPicPreview
              ? { backgroundImage: `url(${bannerPicPreview})` }
              : {}
          }
          onClick={() => bannerPicRef.current.click()}
        >
          <span className="text-white text-sm bg-black/40 px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            {bannerPicPreview ? "Change banner" : "Click to upload banner"}
          </span>
          <input
            ref={bannerPicRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, "bannerPic")}
          />
        </div>

        {/* Avatar */}
        <div className="px-6">
          <div
            className="-mt-11 w-20 h-20 rounded-full border-4 border-white bg-gray-200 cursor-pointer overflow-hidden flex items-center justify-center hover:brightness-90 transition"
            onClick={() => profilePicRef.current.click()}
          >
            {profilePicPreview ? (
              <img
                src={profilePicPreview}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl text-gray-400">+</span>
            )}
            <input
              ref={profilePicRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, "profilePic")}
            />
          </div>

          <div className="mt-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Set up your profile
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              You can always change this later.
            </p>
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-8">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Display Name
              </label>
              <input
                name="displayName"
                placeholder="e.g. Hewrie Sharky"
                value={form.displayName}
                onChange={handleChange}
                required
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-300 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Bio</label>
              <textarea
                name="bio"
                placeholder="Tell the world a little about yourself..."
                value={form.bio}
                onChange={handleChange}
                rows={3}
                maxLength={500}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-300 transition resize-y"
              />
              <span className="text-xs text-gray-400 text-right">
                {form.bio.length}/500
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white rounded-lg py-3 text-sm font-semibold hover:bg-gray-700 disabled:opacity-50 transition"
            >
              {loading ? "Saving..." : "Complete Profile →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
