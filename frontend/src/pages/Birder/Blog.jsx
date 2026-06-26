import React from 'react';
import Sidebar from '../../components/Sidebar';

const Blog = () => {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar />
      <main className="ml-[220px] flex-1 p-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Blog
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Your posts and activity.
        </p>
      </main>
    </div>
  );
};

export default Blog;