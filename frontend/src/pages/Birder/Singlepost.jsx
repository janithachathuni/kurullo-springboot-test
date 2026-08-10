import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight/SidebarShell';
import { FaArrowLeft } from 'react-icons/fa';
import Post from './Post';

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-16 lg:ml-[20%] pb-20 md:pb-4">
        {/* Header with back button */}
        <div className="p-4 rounded-t-lg flex items-center" style={{ backgroundColor: "var(--bg-primary)" }}>
          <FaArrowLeft 
            className="mr-4 cursor-pointer hover:opacity-70" 
            style={{ color: "var(--text-primary)" }}
            onClick={() => navigate(-1)} 
          />
        </div>

        <div className="border-t" style={{ borderColor: "var(--border)" }}></div>

        {/* Post Content Area */}
        <div className="p-4">
          <Post postId={id} />
        </div>
      </div>
      <SidebarRight />
    </div>
  );
};

export default SinglePost;