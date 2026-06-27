import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiFileText,
  FiCheckSquare,
  FiMap,
  FiBell,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiPlus
} from 'react-icons/fi';

const Sidebar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
if (!token) { window.location.href = '/login'; }
if (user?.role === 'ADMIN') { window.location.href = '/admin/dashboard'; }

const [currentUser, setCurrentUser] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
});

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const navItems = [
    { path: '/dashboard', icon: <FiHome size={20} />, label: 'Dashboard' },
    { path: currentUser ? `/${currentUser.username}` : '/blog', icon: <FiFileText size={20} />, label: 'Blog' },
    { path: '/checklists', icon: <FiCheckSquare size={20} />, label: 'Checklists' },
    { path: '/trips', icon: <FiMap size={20} />, label: 'Trips' },
    { path: '/notifications', icon: <FiBell size={20} />, label: 'Notifications' },
    { path: '/forum', icon: <FiMessageSquare size={20} />, label: 'Forum' },
    { path: '/settings', icon: <FiSettings size={20} />, label: 'Settings' },
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

      {/* Create Post */}
      <div className="px-4 pb-3">
        <button
          onClick={() => {/* open create post modal */}}
          className="flex items-center justify-center w-full px-4 py-3 rounded-lg font-medium text-sm transition hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
        >
          <FiPlus size={18} className="mr-2" />
          Create Post
        </button>
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

export default Sidebar;