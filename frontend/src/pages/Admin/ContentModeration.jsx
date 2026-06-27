import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';

const ContentModeration = () => {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <AdminSidebar />
      <div className="flex flex-1 p-4 ml-[20%]">
        <div className="p-4 w-full rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Content Moderation
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Moderate birder content. block people. etc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentModeration;