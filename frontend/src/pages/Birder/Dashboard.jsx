import React from 'react';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar />

      {/* ml: 64px tablet, 20% desktop, 0 mobile | mr: 0 below lg, 30% at lg+ | pb for mobile bottom nav */}
      <div className="flex-1 p-4 ml-0 sm:ml-16 lg:ml-[20%] mr-0 md:mr-[20%] lg:mr-[30%] pb-20 sm:pb-4">
        <div className="p-4 w-full rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Dashboard
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Welcome back!
          </p>
        </div>
      </div>

      <SidebarRight />
    </div>
  );
};

export default Dashboard;