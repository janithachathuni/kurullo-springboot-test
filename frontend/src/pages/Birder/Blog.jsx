import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight/SidebarShell';
import bannerimg from '../../Assets/bannerimg.png';
import default_profile_pic from '../../Assets/default_profile_pic.png';
import Post from "./Post";
import EditProfile from './EditProfile';

const Blog = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/api/profile/${username}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          navigate('/404', { replace: true });
          return;
        }
        const data = await res.json();
        setUserData(data);
        setIsFollowing(!!data.isFollowing);
        setIsBlocked(!!data.isBlocked);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchProfile();
  }, [username]);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwnProfile = currentUser.username === username;

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleFollowToggle = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    const endpoint = isFollowing ? 'unfollow' : 'follow';
    try {
      const res = await fetch(`http://localhost:8080/api/profile/${username}/${endpoint}`, {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setIsFollowing(!isFollowing);
      setUserData((prev) => ({
        ...prev,
        followers: prev.followers + (isFollowing ? -1 : 1),
      }));
    } catch (err) {
      console.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlockToggle = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    const endpoint = isBlocked ? 'unblock' : 'block';
    try {
      const res = await fetch(`http://localhost:8080/api/profile/${username}/${endpoint}`, {
        method: 'POST',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setIsBlocked(!isBlocked);
      // blocking also removes any follow relationship server-side
      if (!isBlocked && isFollowing) {
        setIsFollowing(false);
        setUserData((prev) => ({ ...prev, followers: prev.followers - 1 }));
      }
      setMenuOpen(false);
    } catch (err) {
      console.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Skeleton loading component
  const SkeletonLoading = () => (
    <>
      <div
        className="relative"
        style={{
          backgroundColor: "var(--bg-card)",
          borderBottomWidth: "1px",
          borderBottomColor: "var(--border)",
        }}
      >
        {/* Banner skeleton */}
        <div className="relative w-full overflow-hidden" style={{ paddingTop: "33.333%" }}>
          <div className="absolute inset-0 w-full h-full animate-pulse" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <img
              src={bannerimg}
              alt="Loading banner"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          {/* Edit Profile button skeleton */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <div className="px-4 py-1.5 rounded-full bg-[var(--bg-secondary)] animate-pulse" style={{ width: "100px", height: "36px" }}></div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-start gap-6">
            {/* Avatar skeleton */}
            <div className="relative -mt-10 shrink-0">
              <div
                className="w-28 h-28 rounded-2xl border-4 overflow-hidden"
                style={{ borderColor: "var(--bg-card)" }}
              >
                <div className="w-full h-full animate-pulse" style={{ backgroundColor: "var(--bg-secondary)" }}>
                  <img src={default_profile_pic} alt="Loading profile" className="w-full h-full object-cover opacity-50" />
                </div>
              </div>
              <div
                className="absolute -inset-1 rounded-2xl border-2 border-dashed opacity-30"
                style={{ borderColor: "var(--accent)" }}
              />
            </div>

            {/* Name + bio skeleton */}
            <div className="flex-1 pt-2">
              <div className="h-8 w-48 rounded animate-pulse mb-2" style={{ backgroundColor: "var(--bg-secondary)" }}></div>
              <div className="h-4 w-64 rounded animate-pulse" style={{ backgroundColor: "var(--bg-secondary)" }}></div>
            </div>
          </div>

          {/* Stats skeleton */}
          <div className="flex items-center gap-6 mt-4 sm:ml-[calc(7rem+1.5rem)]">
            <div className="h-5 w-24 rounded animate-pulse" style={{ backgroundColor: "var(--bg-secondary)" }}></div>
            <div className="h-5 w-24 rounded animate-pulse" style={{ backgroundColor: "var(--bg-secondary)" }}></div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-16 lg:ml-[20%] pb-20 md:pb-4">
        {loading ? (
          <SkeletonLoading />
        ) : error ? (
          <div className="flex items-center justify-center h-64" style={{ backgroundColor: "var(--bg-primary)" }}>
            <p style={{ color: "var(--text-secondary)" }}>{error}</p>
          </div>
        ) : (
          // Normal content
          <>
            <div
              className="relative"
              style={{
                backgroundColor: "var(--bg-card)",
                borderBottomWidth: "1px",
                borderBottomColor: "var(--border)",
              }}
            >
              {/* Banner — 3:1 aspect ratio via padding trick */}
              <div className="relative w-full overflow-hidden" style={{ paddingTop: "33.333%" }}>
                <img
                  src={userData.bannerPic || bannerimg}
                  alt="Profile Banner"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Action button — top right of banner */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                  {isOwnProfile ? (
                    <button
                      onClick={() => setShowEditProfile(true)}
                      className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleFollowToggle}
                        disabled={actionLoading}
                        className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-60 disabled:hover:scale-100"
                        style={
                          isFollowing
                            ? { backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }
                            : { backgroundColor: "var(--accent)", color: "var(--accent-text)" }
                        }
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setMenuOpen((v) => !v)}
                          className="w-8 h-8 flex items-center justify-center rounded-full transition hover:opacity-80"
                          style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}
                        >
                          ···
                        </button>
                        {menuOpen && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                            <div
                              className="absolute right-0 mt-1 w-36 rounded-xl shadow-lg z-20 overflow-hidden"
                              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
                            >
                              <button
                                onClick={handleBlockToggle}
                                disabled={actionLoading}
                                className="w-full text-left px-4 py-2.5 text-sm transition hover:opacity-80 disabled:opacity-60"
                                style={{ color: "var(--text-primary)", backgroundColor: "transparent" }}
                              >
                                {isBlocked ? "Blocked" : "Block"}
                              </button>
                              <button
                                onClick={() => setMenuOpen(false)}
                                className="w-full text-left px-4 py-2.5 text-sm transition hover:opacity-80"
                                style={{ color: "var(--text-primary)", backgroundColor: "transparent", borderTop: "1px solid var(--border)" }}
                              >
                                Share
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="relative -mt-10 shrink-0">
                    <div
                      className="w-28 h-28 rounded-2xl border-4 overflow-hidden transform rotate-3 transition-transform hover:rotate-0 duration-500"
                      style={{ borderColor: "var(--bg-card)" }}
                    >
                      <img src={userData.profilePic || default_profile_pic} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div
                      className="absolute -inset-1 rounded-2xl border-2 border-dashed opacity-30"
                      style={{ borderColor: "var(--accent)" }}
                    />
                  </div>

                  {/* Name + bio */}
                  <div className="flex-1 pt-2">
                    <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--accent)" }}>
                      {userData.displayName || userData.username}
                      <span
                        className="text-sm font-normal opacity-70"
                        style={{ color: "var(--text-secondary)", marginTop: "7px", fontFamily: "Schibsted Grotesk" }}
                      >
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
                <div className="flex items-center gap-6 mt-4 sm:ml-[calc(7rem+1.5rem)]">
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
              <Post />
            </div>
          </>
        )}
      </div>
      <SidebarRight />

      {/* Edit Profile Popup */}
      <EditProfile
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        userData={userData}
        onProfileUpdated={(updatedFields) => {
          setUserData((prev) => ({ ...prev, ...updatedFields }));
        }}
      />
    </div>
  );
};

export default Blog;