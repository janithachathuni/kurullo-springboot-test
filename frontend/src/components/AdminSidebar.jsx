import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiBarChart2,
  FiShield,
  FiUsers,
  FiBell,
  FiMonitor,
  FiSettings,
  FiLogOut,
  FiDatabase
} from 'react-icons/fi';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
if (!token) { window.location.href = '/login'; }
if (user?.role !== 'ADMIN') { window.location.href = '/dashboard'; }

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const navItems = [
    { path: '/admin/dashboard', icon: <FiHome size={20} />, label: 'Dashboard' },
    { path: '/admin/bird-data', icon: <FiDatabase size={20} />, label: 'Bird Database' },
    { path: '/admin/statistics', icon: <FiBarChart2 size={20} />, label: 'Statistics' },
    { path: '/admin/content-moderation', icon: <FiShield size={20} />, label: 'Content Moderation' },
    { path: '/admin/manage-moderators', icon: <FiUsers size={20} />, label: 'Manage Moderators' },
    { path: '/admin/notifications', icon: <FiBell size={20} />, label: 'Notifications' },
    { path: '/admin/advertisements', icon: <FiMonitor size={20} />, label: 'Advertisements' },
    { path: '/admin/settings', icon: <FiSettings size={20} />, label: 'Settings' },
  ];

  return (
    <div
      className="fixed top-0 left-0 h-screen w-[20%] flex flex-col"
      style={{
        backgroundColor: "var(--bg-card)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <div className="p-1 pt-4">
        <NavLink to="/">
          <h2 className="text-2xl font-extrabold" style={{ color: "var(--accent)", textAlign: "center", }}>Kurullo</h2>
        </NavLink>
      </div>


      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg transition-colors ${isActive ? 'font-semibold' : ''}`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? "var(--bg-secondary)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
              })}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
            <div className="px-4 py-4" style={{ borderTop: "1px solid var(--border)" }}>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-1 py-1 rounded-lg text-sm transition hover:opacity-80"
                style={{ color: "var(--text-secondary)" }}
              >
                <FiLogOut size={18} className="mr-3" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
    </div>
  );
};

export default AdminSidebar;