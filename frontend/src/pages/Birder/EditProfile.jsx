import React, { useState, useEffect } from "react";
import { FaCamera, FaTimes } from "react-icons/fa";
import bannerimg from "../../assets/bannerimg.png";
import default_profile_pic from "../../assets/default_profile_pic.png";

const EditProfile = ({ isOpen, onClose, userData, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePic: null,
    bannerPic: null,
  });
  const [previewUrls, setPreviewUrls] = useState({
    profilePic: null,
    bannerPic: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData && isOpen) {
      setFormData({
        name: userData.displayName || "",
        bio: userData.bio || "",
        profilePic: null,
        bannerPic: null,
      });
      setPreviewUrls({
        profilePic: userData.profilePic || null,
        bannerPic: userData.bannerPic || null,
      });
    }
  }, [userData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [type]: file,
      }));

      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewUrls((prev) => ({
          ...prev,
          [type]: ev.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('displayName', formData.name);
      fd.append('bio', formData.bio);
      if (formData.profilePic) fd.append('profilePic', formData.profilePic);
      if (formData.bannerPic) fd.append('bannerPic', formData.bannerPic);

      const res = await fetch('http://localhost:8080/api/profile/update', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { 
        ...user, 
        displayName: formData.name,
        bio: formData.bio,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      if (onProfileUpdated) {
        onProfileUpdated({
          displayName: data.displayName,
          bio: data.bio,
          profilePic: data.profilePic,
          bannerPic: data.bannerPic,
        });
      }
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="relative bg-[var(--bg-card)] rounded-2xl w-full max-w-4xl flex flex-col shadow-[var(--shadow)]"
        style={{ maxHeight: "90vh", margin: "1rem" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors duration-200"
          style={{ color: "var(--text-primary)" }}
        >
          <FaTimes size={24} />
        </button>

        <div className="px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Edit Profile
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-2xl mx-auto">
            <div 
              className="w-full overflow-hidden rounded-xl"
              style={{ 
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Banner section with always visible camera */}
              <div className="relative h-48 w-full group">
                <img
                  src={previewUrls.bannerPic || bannerimg}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300">
                  <label className="cursor-pointer p-3 rounded-full bg-[var(--accent)] text-[var(--accent-text)] transition-all duration-300 hover:scale-125 hover:bg-opacity-90 opacity-80 hover:opacity-100">
                    <FaCamera size={24} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "bannerPic")}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="flex items-start gap-6">
                  {/* Avatar section with always visible camera */}
                  <div className="relative -mt-10 shrink-0 group">
                    <div 
                      className="w-28 h-28 rounded-2xl border-4 overflow-hidden transform rotate-3 transition-transform hover:rotate-0 duration-500"
                      style={{ borderColor: "var(--bg-card)" }}
                    >
                      <img
                        src={previewUrls.profilePic || default_profile_pic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -inset-1 rounded-2xl border-2 border-dashed opacity-30"
                        style={{ borderColor: "var(--accent)" }}></div>
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-2xl transition-all duration-300">
                      <label className="cursor-pointer p-2 rounded-full bg-[var(--accent)] text-[var(--accent-text)] transition-all duration-300 hover:scale-125 hover:bg-opacity-90 opacity-80 hover:opacity-100">
                        <FaCamera size={18} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "profilePic")}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex-1 pt-2">
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                        Display Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your display name"
                        className="w-full border rounded-md px-3 py-2 text-sm outline-none transition focus:ring-2"
                        style={{ 
                          borderColor: "var(--border)",
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--text-primary)"
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about your birding interests..."
                        className="w-full border rounded-md px-3 py-2 text-sm outline-none transition resize-none focus:ring-2"
                        style={{ 
                          borderColor: "var(--border)",
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--text-primary)"
                        }}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                    style={{ 
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--text-primary)"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: "var(--accent)", 
                      color: "var(--accent-text)" 
                    }}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;