import React from 'react';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight/SidebarShell';

// photo URL: https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Blue-faced_Malkoha_Shreeram_M_V.jpg/1280px-Blue-faced_Malkoha_Shreeram_M_V.jpg

const Dashboard = () => {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar />
      <div className="flex-1 p-4 ml-0 md:ml-16 lg:ml-[20%] pb-20 md:pb-4">
        <div className="p-4 w-full rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
          
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            life list 210
          </p>
        </div>

        <div className="p-4 w-full rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
         
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Bird of the day: Blue-faced Malkoha
          </p>
        </div>

        <div className="p-4 w-full rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Dashboard
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Welcome to your dashboard!
          </p>
        </div>
      </div>
      <SidebarRight />
    </div>
  );
};

export default Dashboard;