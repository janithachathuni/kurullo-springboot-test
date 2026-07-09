import React from 'react';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight/SidebarShell';
import { useTheme } from '../../context/ThemeContext';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar />
      <div className="flex-1 p-4 ml-0 md:ml-16 lg:ml-[20%] pb-20 md:pb-4">
        <div className="p-4 w-full rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Settings
          </h1>

          {/* Appearance */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Appearance</h2>
            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text-secondary)" }}>Theme</span>
              <button
                onClick={toggleTheme}
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                }}
                className="px-3 py-2 rounded-lg text-sm transition hover:opacity-80"
              >
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
              </button>
            </div>
          </div>

          {/* Account */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Account</h2>
            <div className="rounded-lg" style={{ border: "1px solid var(--border)" }}>
              <div className="p-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <p style={{ color: "var(--text-secondary)" }}>Username change</p>
              </div>
              <div className="p-4">
                <p style={{ color: "var(--text-secondary)" }}>Account deletion</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      <SidebarRight />
    </div>
  );
};

export default Settings;