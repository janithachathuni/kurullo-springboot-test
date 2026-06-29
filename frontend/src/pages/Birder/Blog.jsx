import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight';
import bannerimg from '../../Assets/bannerimg.png';
import default_profile_pic from '../../Assets/default_profile_pic.png';

const Blog = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8080/api/profile/${username}`);
        if (!res.ok) throw new Error('Profile not found');
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchProfile();
  }, [username]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
      <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
    </div>
  );

  if (error) return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
      <p style={{ color: "var(--text-secondary)" }}>{error}</p>
    </div>
  );

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwnProfile = currentUser.username === username;

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar />
      <div className="flex-1 ml-0 xs:ml-16 lg:ml-[20%] mr-0 md:mr-[20%] pb-20 xs:pb-4">
        <div
          className="relative overflow-hidden"
          style={{
            backgroundColor: "var(--bg-card)",
            borderBottomWidth: "1px",
            borderBottomColor: "var(--border)",
          }}
        >
          {/* Banner */}
          <div className="relative h-48 w-full">
            <img
              src={userData.bannerPic || bannerimg}
              alt="Profile Banner"
              className="w-full h-full object-cover"
            />
            {isOwnProfile && (
              <button
                className="absolute top-4 right-4 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="px-6 py-4">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative -mt-10 shrink-0">
                <div className="w-28 h-28 rounded-2xl border-4 overflow-hidden transform rotate-3 transition-transform hover:rotate-0 duration-500"
                     style={{ borderColor: "var(--bg-card)" }}>
                  <img src={userData.profilePic || default_profile_pic} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -inset-1 rounded-2xl border-2 border-dashed opacity-30"
                     style={{ borderColor: "var(--accent)" }}></div>
              </div>

              {/* Name + bio */}
              <div className="flex-1 pt-2">
                <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  {userData.displayName || userData.username}
                  <span className="text-sm font-normal opacity-70" style={{ color: "var(--text-secondary)", marginTop: "7px", fontFamily: "Schibsted Grotesk" }}>
                    @{userData.username}
                  </span>
                </h1>
                {userData.bio && (
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    {userData.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-4 ml-[calc(7rem+1.5rem)]">
              <div>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {userData.followers.toLocaleString()}
                </span>
                <span className="text-xs ml-1 opacity-60" style={{ color: "var(--text-secondary)" }}>Followers</span>
              </div>
              <div>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {userData.following.toLocaleString()}
                </span>
                <span className="text-xs ml-1 opacity-60" style={{ color: "var(--text-secondary)" }}>Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="p-4" style={{ backgroundColor: "var(--bg-primary)" }}>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Blog</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            {isOwnProfile ? 'Your posts and activity.' : `${userData.displayName || userData.username}'s posts.`}
          </p>
        </div>
      </div>
      <SidebarRight />
    </div>
  );
};

export default Blog;