import React from 'react';
import Sidebar from '../../components/Sidebar';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-[220px] flex-1 p-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Dashboard
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Welcome back!
        </p>
      </main>

    </div>
  );
};

export default Dashboard;