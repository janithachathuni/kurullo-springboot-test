import React from 'react';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight';
import bannerimg from '../../Assets/bannerimg.png';
import default_profile_pic from '../../Assets/default_profile_pic.png';
import { FaFeather, FaUsers, FaUserPlus, FaBinoculars } from 'react-icons/fa';

const Blog = () => {
  // Sample data - replace with actual user data
  const userData = {
    name: "Hewrie Sharky",
    username: "hewriesharky",
    lifeListCount: 342,
    followers: 1284,
    following: 567,
    bio: "Rookie ornithologist. Sometimes a writer. I like to wander around in nature and mark birds on my checklists."
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar />
      <div className="flex-1 ml-0 sm:ml-16 lg:ml-[20%] mr-0 md:mr-[30%] pb-20 sm:pb-4">
        {/* Modern Profile Header with Glassmorphism */}
        <div 
          className="relative overflow-hidden"
          style={{ 
            backgroundColor: "var(--bg-card)",
            // boxShadow: "var(--shadow)"
            borderBottomWidth: "1px",
            borderBottomColor: "var(--border)",
          }}
        >
          {/* Banner with gradient overlay */}
          <div className="relative h-48 w-full">
            <img 
              src={bannerimg} 
              alt="Profile Banner" 
              className="w-full h-full object-cover"
            />
            
            {/* Edit Profile Button - floating */}
            <button 
              className="absolute top-4 right-4 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
              style={{ 
                backgroundColor: "var(--accent)", 
                color: "var(--accent-text)" 
              }}
            >
              Edit Profile
            </button>

          </div>

          {/* Profile content - horizontal layout */}
          <div className="px-6 py-4 flex items-start gap-6">
            {/* Avatar - now with a unique frame */}
            <div className="relative -mt-10">
              <div className="w-28 h-28 rounded-2xl border-4 overflow-hidden transform rotate-3 transition-transform hover:rotate-0 duration-500" 
                   style={{ borderColor: "var(--bg-card)" }}>
                <img 
                  src={default_profile_pic} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative ring */}
              <div className="absolute -inset-1 rounded-2xl border-2 border-dashed opacity-30" 
                   style={{ borderColor: "var(--accent)" }}></div>
            </div>

            {/* Info in horizontal layout */}
            <div className="flex-1 pt-2">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    {userData.name}
                    <span className="text-sm font-normal opacity-70" style={{ color: "var(--text-secondary)", fontFamily: "Schibsted Grotesk", marginTop: "7px"}}>                      @{userData.username}
                    </span>
                  </h1>
                  
                  {/* Bio with icon */}
                  {userData.bio && (
                    <div className="flex items-start gap-2 mt-1">
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {userData.bio}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats in a horizontal row with icons */}
              <div className="flex items-center gap-6 mt-3">
                {/* <div className="flex items-center gap-2 px-3 py-1 rounded-full" 
                     style={{ backgroundColor: "var(--bg-secondary)" }}>
                  <FaBinoculars size={14} style={{ color: "var(--accent)" }} />
                  <div>
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {userData.lifeListCount}
                    </span>
                    <span className="text-xs ml-1 opacity-60" style={{ color: "var(--text-secondary)" }}>
                      Life List
                    </span>
                  </div>
                </div> */}
                
                <div className="flex items-center gap-2 px-3 py-1 rounded-full" 
                     style={{ backgroundColor: "var(--bg-secondary)" }}>
                  <FaUsers size={14} style={{ color: "var(--accent)" }} />
                  <div>
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {userData.followers.toLocaleString()}
                    </span>
                    <span className="text-xs ml-1 opacity-60" style={{ color: "var(--text-secondary)" }}>
                      Followers
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 px-3 py-1 rounded-full" 
                     style={{ backgroundColor: "var(--bg-secondary)" }}>
                  <FaUserPlus size={14} style={{ color: "var(--accent)" }} />
                  <div>
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {userData.following.toLocaleString()}
                    </span>
                    <span className="text-xs ml-1 opacity-60" style={{ color: "var(--text-secondary)" }}>
                      Following
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--bg-primary)" }}>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Blog
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Your posts and activity.
          </p>
        </div>
      </div>
      <SidebarRight />
    </div>
  );
};

export default Blog;