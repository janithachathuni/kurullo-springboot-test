import React from "react";

const RightSidebar = () => {
  return (
    <div className="fixed top-0 right-0 h-screen w-[30%] flex flex-col" style={{ backgroundColor: "var(--bg-card)", borderLeft: "1px solid var(--border)" }}>
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Content goes here */}
      </div>

      {/* Sticky footer */}
      <div className="p-4" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>© 2025 Kurullo</p>
      </div>
    </div>
  );
};

export default RightSidebar;