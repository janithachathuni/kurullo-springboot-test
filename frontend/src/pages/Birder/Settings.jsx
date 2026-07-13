import React from 'react';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight/SidebarShell';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

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
              <div className="flex items-center gap-2">
                <span style={{ color: "var(--text-secondary)" }}>
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none flex-shrink-0"
                style={{
                  backgroundColor: theme === "dark" ? "var(--accent)" : "#d1d5db",
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`}
                  style={{
                    transform: theme === "dark" ? "translateX(22px)" : "translateX(2px)",
                  }}
                />
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