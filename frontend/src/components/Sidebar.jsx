import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome, FiFileText, FiCheckSquare, FiMap,
  FiBell, FiMessageSquare, FiSettings, FiLogOut,
  FiPlus, FiMenu, FiX
} from 'react-icons/fi';

const Sidebar = () => {
  const token = localStorage.getItem('token');
  const [currentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); }
    catch { return null; }
  });

  // Notification state
  // Notification state
const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
  if (!token) return;
  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/notifications/unread-count', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setUnreadCount(data.count);
    } catch (err) {
      console.error(err.message);
    }
  };
  fetchUnreadCount();
}, [token]); // Example: 3 unread notifications

  // Responsive state
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      setIsMobile(window.innerWidth < 768);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!token) { window.location.href = '/login'; return null; }

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  // Handle notification click - clear the badge
  const handleNotificationClick = () => {
    setUnreadCount(0);
  };

  const primaryNav = [
    { path: '/dashboard', icon: <FiHome size={20} />, label: 'Dashboard' },
    { path: currentUser ? `/${currentUser.username}` : '/blog', icon: <FiFileText size={20} />, label: 'Blog' },
    { path: '/notifications', icon: <FiBell size={20} />, label: 'Notifications', hasBadge: true },
  ];

  const secondaryNav = [
    { path: '/checklists', icon: <FiCheckSquare size={20} />, label: 'Checklists' },
    { path: '/trips', icon: <FiMap size={20} />, label: 'Trips' },
    { path: '/forum', icon: <FiMessageSquare size={20} />, label: 'Forum' },
    { path: '/settings', icon: <FiSettings size={20} />, label: 'Settings' },
  ];

  const allNav = [...primaryNav, ...secondaryNav];

  const iconStyle = (isActive) => ({
    backgroundColor: isActive ? "var(--bg-secondary)" : "transparent",
    color: isActive ? "var(--accent)" : "var(--text-secondary)",
  });

  // ── MOBILE: bottom nav bar ──────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {/* Overflow drawer (slides up from bottom nav) */}
        {mobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-30"
              onClick={() => setMobileDrawerOpen(false)}
            />
            {/* Drawer */}
            <div
              className="fixed bottom-[57px] left-0 right-0 z-40 rounded-t-2xl p-3"
              style={{ backgroundColor: "var(--bg-card)", borderTop: "1px solid var(--border)" }}
            >
              <nav className="grid grid-cols-4 gap-1">
                {secondaryNav.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex flex-col items-center gap-1 py-3 rounded-xl transition-colors"
                    style={({ isActive }) => iconStyle(isActive)}
                  >
                    {item.icon}
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </NavLink>
                ))}
                {/* Logout inside drawer */}
                <button
                  onClick={handleLogout}
                  className="flex flex-col items-center gap-1 py-3 rounded-xl transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <FiLogOut size={20} />
                  <span className="text-[10px] font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </>
        )}

        {/* Bottom nav bar */}
        <div
          className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2"
          style={{
            height: 57,
            backgroundColor: "var(--bg-card)",
            borderTop: "1px solid var(--border)",
          }}
        >
          {primaryNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative"
              style={({ isActive }) => iconStyle(isActive)}
            >
              {item.icon}
              {item.hasBadge && unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold"
                  style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
                >
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}

          {/* Create Post */}
          <button
            onClick={() => {/* open create post modal */}}
            className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors"
            style={{ color: "var(--accent)" }}
          >
            <FiPlus size={22} />
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMobileDrawerOpen((v) => !v)}
            className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors"
            style={{ color: mobileDrawerOpen ? "var(--accent)" : "var(--text-secondary)" }}
          >
            {mobileDrawerOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </>
    );
  }

  // ── TABLET: icon-only left sidebar ──────────────────────────────────────
  if (isTablet) {
    return (
      <div
        className="fixed top-0 left-0 h-screen flex flex-col items-center py-4"
        style={{
          width: 64,
          backgroundColor: "var(--bg-card)",
          borderRight: "1px solid var(--border)",
        }}
      >
        {/* Logo */}
        <NavLink to="/" className="mb-4">
          <span className="text-lg font-extrabold" style={{ color: "var(--accent)" }}>K</span>
        </NavLink>

        {/* Nav icons */}
        <nav className="flex-1 flex flex-col gap-1 w-full px-2">
          {allNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.label}
              className="flex items-center justify-center rounded-lg p-3 transition-colors relative"
              style={({ isActive }) => iconStyle(isActive)}
            >
              {item.icon}
              {item.hasBadge && unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold"
                  style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
                >
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Create Post — just + */}
        <div className="w-full px-2 pb-2">
          <button
            onClick={() => {/* open create post modal */}}
            title="Create Post"
            className="flex items-center justify-center w-full py-3 rounded-lg transition hover:opacity-90"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
          >
            <FiPlus size={18} />
          </button>
        </div>

        {/* Logout */}
        <div className="w-full px-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center justify-center w-full py-3 rounded-lg transition hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── DESKTOP: full sidebar ───────────────────────────────────────────────
  return (
    <div
      className="fixed top-0 left-0 h-screen w-[20%] flex flex-col"
      style={{ backgroundColor: "var(--bg-card)", borderRight: "1px solid var(--border)" }}
    >
      <div className="p-1 pt-4">
        <NavLink to="/">
          <h2 className="text-2xl font-extrabold" style={{ color: "var(--accent)", textAlign: "center" }}>Kurullo</h2>
        </NavLink>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <nav className="space-y-1 px-3">
          {allNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg transition-colors relative ${isActive ? 'font-semibold' : ''}`
              }
              style={({ isActive }) => iconStyle(isActive)}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
              {item.hasBadge && unreadCount > 0 && (
                <span
                  className="ml-auto w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold flex-shrink-0"
                  style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
                >
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

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