import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight';
import {
  FaHeart, FaComment, FaUserPlus, FaBell, FaCalendarAlt,
  FaFeatherAlt, FaCircle
} from 'react-icons/fa';
import profileimg from "../../assets/default_profile_pic.png";

const notificationsSeed = [
  {
    id: 1,
    type: 'like',
    actor: 'Alice Johnson',
    username: 'alicej',
    profilePic: null,
    content: 'liked your post about the Blue Jay in your backyard.',
    timestamp: '5 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'comment',
    actor: 'Bob Wilson',
    username: 'bobw',
    profilePic: null,
    content: 'commented on your Sinharaja trip post: "Great shot, was that near the research station?"',
    timestamp: '32 minutes ago',
    read: false,
  },
  {
    id: 3,
    type: 'follow',
    actor: 'Jane Smith',
    username: 'janesmith',
    profilePic: null,
    content: 'started following you.',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: 4,
    type: 'article',
    actor: null,
    username: null,
    profilePic: null,
    content: 'New checklist published: Migratory waders of Bundala.',
    timestamp: '3 hours ago',
    read: true,
  },
  {
    id: 5,
    type: 'event',
    actor: null,
    username: null,
    profilePic: null,
    content: 'Reminder: Kurullo community walk is tomorrow at 6:00 AM, Talangama Wetland.',
    timestamp: '5 hours ago',
    read: true,
  },
  {
    id: 6,
    type: 'like',
    actor: 'John Doe',
    username: 'johndoe',
    profilePic: null,
    content: 'liked your comment on "Serendib Scops Owl sighting".',
    timestamp: 'Yesterday',
    read: true,
  },
  {
    id: 7,
    type: 'comment',
    actor: 'Alice Johnson',
    username: 'alicej',
    profilePic: null,
    content: 'replied to your comment: "We only get sparrows here, lucky you!"',
    timestamp: 'Yesterday',
    read: true,
  },
  {
    id: 8,
    type: 'article',
    actor: null,
    username: null,
    profilePic: null,
    content: 'Weekly digest: 6 new sightings logged near you.',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: 9,
    type: 'follow',
    actor: 'Bob Wilson',
    username: 'bobw',
    profilePic: null,
    content: 'started following you.',
    timestamp: '3 days ago',
    read: true,
  },
];

const typeIcon = (type) => {
  switch (type) {
    case 'like': return <FaHeart style={{ color: 'var(--accent)' }} />;
    case 'comment': return <FaComment style={{ color: 'var(--accent)' }} />;
    case 'follow': return <FaUserPlus style={{ color: 'var(--accent)' }} />;
    case 'article': return <FaFeatherAlt style={{ color: 'var(--accent)' }} />;
    case 'event': return <FaCalendarAlt style={{ color: 'var(--accent)' }} />;
    default: return <FaBell style={{ color: 'var(--accent)' }} />;
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(notificationsSeed);
  const [filter, setFilter] = useState('all');

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markOneRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
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

          {visible.length === 0 ? (
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
                  {n.actor ? (
                    <img
                      src={n.profilePic || profileimg}
                      alt={n.actor}
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
                      {n.actor && <span className="font-medium">{n.actor} </span>}
                      {n.content}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                      {n.timestamp}
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