import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight/SidebarShell';
import {
  FaHeart, FaComment, FaUserPlus, FaBell, FaCalendarAlt,
  FaFeatherAlt, FaCircle, FaExclamationTriangle, FaFlag,
  FaTrashAlt, FaDove, FaReply
} from 'react-icons/fa';
import profileimg from "../../assets/default_profile_pic.png";

const typeIcon = (type) => {
  switch (type) {
    case 'LIKE': return <FaHeart style={{ color: 'var(--accent)' }} />;
    case 'COMMENT': return <FaComment style={{ color: 'var(--accent)' }} />;
    case 'REPLY': return <FaReply style={{ color: 'var(--accent)' }} />;
    case 'FOLLOW': return <FaUserPlus style={{ color: 'var(--accent)' }} />;
    case 'ARTICLE_PUBLISHED': return <FaFeatherAlt style={{ color: 'var(--accent)' }} />;
    case 'TRIP_REMINDER': return <FaCalendarAlt style={{ color: 'var(--accent)' }} />;
    case 'SPECIES_ALERT': return <FaDove style={{ color: 'var(--accent)' }} />;
    case 'REPORT_RESPONSE': return <FaFlag style={{ color: 'var(--accent)' }} />;
    case 'REPORT_RECEIVED': return <FaFlag style={{ color: 'var(--accent)' }} />;
    case 'CONTENT_REMOVED': return <FaTrashAlt style={{ color: 'var(--accent)' }} />;
    case 'ACCOUNT_WARNING': return <FaExclamationTriangle style={{ color: 'var(--accent)' }} />;
    case 'ONBOARDING': return <FaBell style={{ color: 'var(--accent)' }} />;
    default: return <FaBell style={{ color: 'var(--accent)' }} />;
  }
};

const timeAgo = (isoString) => {
  const date = new Date(isoString);
  const seconds = Math.floor((new Date() - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
          headers: authHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load notifications');
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    const prevState = notifications;
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/read-all`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Failed to mark all as read');
    } catch (err) {
      console.error(err.message);
      setNotifications(prevState); // revert on failure
    }
  };

  const markOneRead = async (id) => {
    const target = notifications.find(n => n.id === id);
    if (!target || target.read) return; // already read, no-op

    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Failed to mark as read');
    } catch (err) {
      console.error(err.message);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n)); // revert
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const visible = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar />
      <div className="flex-1 min-w-0 p-4 ml-0 md:ml-16 lg:ml-[20%] pb-20 md:pb-4">

        <div className="flex items-center justify-between mb-4 min-w-0">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Notifications
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs flex-shrink-0 transition hover:opacity-70"
              style={{ color: "var(--accent)" }}
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="p-4 w-full min-w-0 rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>

          <div className="flex gap-2 mb-4">
            {['all', 'unread'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-full text-sm transition"
                style={{
                  backgroundColor: filter === f ? 'var(--accent)' : 'var(--bg-card)',
                  color: filter === f ? 'var(--accent-text)' : 'var(--text-secondary)',
                  border: filter === f ? 'none' : '1px solid var(--border)',
                }}
              >
                {f === 'all' ? 'All' : `Unread (${unreadCount})`}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-sm text-center py-10" style={{ color: "var(--text-secondary)" }}>
              Loading...
            </p>
          ) : error ? (
            <p className="text-sm text-center py-10" style={{ color: "var(--text-secondary)" }}>
              {error}
            </p>
          ) : visible.length === 0 ? (
            <p className="text-sm text-center py-10" style={{ color: "var(--text-secondary)" }}>
              You're all caught up.
            </p>
          ) : (
            <div className="space-y-2">
              {visible.map(n => (
                <button
                  key={n.id}
                  onClick={() => markOneRead(n.id)}
                  className="w-full flex items-start gap-3 text-left p-3 rounded-lg transition hover:opacity-90 min-w-0"
                  style={{
                    backgroundColor: n.read ? 'var(--bg-card)' : 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {n.actorUsername ? (
                    <img
                      src={n.actorProfilePic || profileimg}
                      alt={n.actorDisplayName || n.actorUsername}
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--bg-secondary)' }}
                    >
                      {typeIcon(n.type)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                      {n.message}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>

                  {!n.read && (
                    <FaCircle size={8} className="flex-shrink-0 mt-1.5" style={{ color: 'var(--accent)' }} />
                  )}
                </button>
              ))}
            </div>
          )}

        </div>
      </div>
      <SidebarRight />
    </div>
  );
};

export default Notifications;