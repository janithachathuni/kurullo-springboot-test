import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import createprofilebird from "../../Assets/createprofilebird.gif";
import bannerimg from "../../Assets/bannerimg.png";
import default_profile_pic from "../../Assets/default_profile_pic.png";

const CreateProfile = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePic: null,
    bannerPic: null,
  });
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [previewUrls, setPreviewUrls] = useState({
    profilePic: null,
    bannerPic: null,
  });

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
    if (formData.bannerPic)  fd.append('bannerPic',  formData.bannerPic);

    const res = await fetch('http://localhost:8080/api/profile/complete', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: fd,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save profile');

    // Update localStorage so profileCompleted is reflected
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...user, profileCompleted: true }));

    setStep(2);
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  const nextStep = () => {
    if (step < 2 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep((prev) => Math.min(prev + 1, 2));
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    }
  };

  const prevStep = () => {
    if (step > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep((prev) => Math.max(prev - 1, 0));
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    }
  };

  const renderStepContent = () => {
    switch(step) {
      case 0:
        return (
          <div className="text-center px-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--accent)" }}>
              Welcome to your new Kurullo account!
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Let's set up your birding profile to get started.
            </p>
            <button
              onClick={nextStep}
              className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
            >
              Start
            </button>
          </div>
        );
      case 1:
        return (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-full max-w-2xl mx-auto"
          >
            <div 
              className="w-full overflow-hidden"
              style={{ 
                backgroundColor: "var(--bg-card)",
                borderBottomWidth: "1px",
                borderBottomColor: "var(--border)",
              }}
            >
              {/* Banner section - matching Blog component */}
              <div className="relative h-48 w-full group">
                <img
                  src={previewUrls.bannerPic || bannerimg}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
                
                {/* Camera icon overlay on banner */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <label className="cursor-pointer p-3 rounded-full bg-[var(--accent)] text-[var(--accent-text)] hover:scale-110 transition-transform duration-300">
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

              {/* Profile content - horizontal layout matching Blog */}
              <div className="px-6 py-4">
                <div className="flex items-start gap-6">
                  {/* Avatar - matching Blog's avatar style */}
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
                    
                    {/* Camera overlay on avatar */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity duration-300">
                      <label className="cursor-pointer p-2 rounded-full bg-[var(--accent)] text-[var(--accent-text)] hover:scale-110 transition-transform duration-300">
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

                  {/* Name + bio fields - matching Blog's layout */}
                  <div className="flex-1 pt-2">
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                        Display Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your display name"
                        className="w-full border rounded-md px-3 py-1.5 text-sm outline-none transition"
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
                        className="w-full border rounded-md px-3 py-2 text-sm outline-none transition resize-none"
                        style={{ 
                          borderColor: "var(--border)",
                          backgroundColor: "var(--bg-primary)",
                          color: "var(--text-primary)"
                        }}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Save button - moved to bottom, centered */}
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{ 
                      backgroundColor: "var(--accent)", 
                      color: "var(--accent-text)" 
                    }}
                  >
                    {loading ? "Creating..." : "Save Profile"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        );
      case 2:
        return (
          <div className="text-center px-6">
            <img
              src={createprofilebird}
              className="items-center mx-auto mb-4"
              alt="Profile created"
            />
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Profile Created Successfully!
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              You're all set. Would you like to add your first birding post
              now?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => { window.location.href = '/dashboard'; }}
                className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)"
                }}
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-[var(--bg-card)] rounded-2xl p-4 w-full max-w-4xl h-[calc(100vh-1cm)] flex flex-col shadow-[var(--shadow)]">
        {/* Navigation Arrows */}
        {step > 0 && (
          <button
            onClick={prevStep}
            disabled={loading || isTransitioning}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-[var(--bg-secondary)] hover:bg-[var(--border)] disabled:opacity-50 w-12 h-12 flex items-center justify-center rounded-full shadow-md z-10 text-[var(--text-primary)] transition-all duration-300 hover:scale-105"
          >
            &lt;
          </button>
        )}
        {step < 2 && (
          <button
            onClick={nextStep}
            disabled={loading || isTransitioning}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-[var(--bg-secondary)] hover:bg-[var(--border)] disabled:opacity-50 w-12 h-12 flex items-center justify-center rounded-full shadow-md z-10 text-[var(--text-primary)] transition-all duration-300 hover:scale-105"
          >
            &gt;
          </button>
        )}

        {/* Main content container with fade transitions */}
        <div className="flex-1 flex flex-col justify-center overflow-y-auto mx-16">
          <div className="relative">
            {/* Fade Transition Container */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isTransitioning 
                  ? 'opacity-0 transform scale-95' 
                  : 'opacity-100 transform scale-100'
              }`}
            >
              {renderStepContent()}
            </div>
          </div>
        </div>

        {/* Page Indicators */}
        <div className="flex justify-center mt-1 gap-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                step === i 
                  ? "bg-[var(--accent)] scale-125" 
                  : "bg-[var(--border)] scale-100"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;