import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight';
import Post from './Post';
import {
  FaBell, FaCheckCircle, FaRegCircle, FaMapMarkerAlt,
  FaCalendarAlt, FaChevronRight, FaTimes, FaFeatherAlt,
  FaBullhorn
} from 'react-icons/fa';

const userName = 'Janitha';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const lifeListSeed = [
  { id: 1, species: 'Sri Lanka Blue Magpie', sinhala: 'කැහිබැල්ලා', seen: true },
  { id: 2, species: 'Serendib Scops Owl', sinhala: 'සෙරන්දිබ් බකමූණා', seen: false },
  { id: 3, species: 'Ceylon Frogmouth', sinhala: 'දඹරළු කුරුල්ලා', seen: false },
  { id: 4, species: "Layard's Parakeet", sinhala: 'ලේයාඩ් ගිරාවා', seen: true },
  { id: 5, species: 'Yellow-fronted Barbet', sinhala: 'රන්කුරුල්ලා', seen: true },
  { id: 6, species: 'Sri Lanka Whistling Thrush', sinhala: 'අරුණලිය කුරුල්ලා', seen: false },
];

const weekPlan = [
  { id: 1, day: 'Mon', label: "Log yesterday's sightings", done: true },
  { id: 2, day: 'Wed', label: 'Dawn walk · Talangama Wetland', done: false },
  { id: 3, day: 'Fri', label: 'Upload photos from Sinharaja trip', done: false },
  { id: 4, day: 'Sat', label: 'Kurullo community meetup', done: false },
];

const specialPlaces = [
  { id: 1, name: 'Sinharaja Forest Reserve', note: '38 species logged', img: 'https://picsum.photos/seed/sinharaja/400/300' },
  { id: 2, name: 'Talangama Wetland', note: '12 species logged', img: 'https://picsum.photos/seed/talangama/400/300' },
  { id: 3, name: 'Bundala National Park', note: '21 species logged', img: 'https://picsum.photos/seed/bundala/400/300' },
];

const recentVisits = [
  { id: 1, place: 'Horton Plains', when: '2 days ago', img: 'https://picsum.photos/seed/horton/300/300' },
  { id: 2, place: 'Kithulgala', when: '5 days ago', img: 'https://picsum.photos/seed/kithulgala/300/300' },
  { id: 3, place: 'Udawalawe', when: '1 week ago', img: 'https://picsum.photos/seed/udawalawe/300/300' },
  { id: 4, place: 'Victoria Park', when: '2 weeks ago', img: 'https://picsum.photos/seed/victoria/300/300' },
];

const articleNotifications = [
  { id: 1, title: 'New checklist: Migratory waders of Bundala', unread: true },
  { id: 2, title: 'Your comment got a reply from alicej', unread: true },
  { id: 3, title: 'Weekly digest: 6 new sightings near you', unread: false },
];

const Dashboard = () => {
  const [lifeList, setLifeList] = useState(lifeListSeed);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState('all');
  const [eventDismissed, setEventDismissed] = useState(false);

  const toggleLifeItem = (id) => {
    setLifeList(prev => prev.map(item =>
      item.id === id ? { ...item, seen: !item.seen } : item
    ));
  };

  const seenCount = lifeList.filter(i => i.seen).length;
  const unreadCount = articleNotifications.filter(n => n.unread).length;
  const visibleNotifs = notifFilter === 'unread'
    ? articleNotifications.filter(n => n.unread)
    : articleNotifications;

  const sectionHeaderStyle = {
    color: 'var(--text-primary)',
    fontFamily: "'Besley', serif",
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />

      <div className="flex-1 min-w-0 p-4 ml-0 md:ml-16 lg:ml-[20%] pb-20 md:pb-4">
        <div className="p-4 w-full min-w-0 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>

          {/* ===== Welcome + Notif ===== */}
          <div className="flex items-start justify-between gap-3 mb-6 min-w-0">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold" style={sectionHeaderStyle}>
                {getGreeting()}, {userName}!
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Here's what's happening in your world today.
              </p>
            </div>

            <div className="relative flex-shrink-0">
              <button
                onClick={() => setNotifOpen(prev => !prev)}
                className="relative p-2.5 rounded-full transition hover:opacity-70"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                aria-label="Notifications"
              >
                <FaBell style={{ color: 'var(--text-primary)' }} />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-medium"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                  <div
                    className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl shadow-lg z-20 overflow-hidden"
                    style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                        Article updates
                      </span>
                      <div className="flex gap-1 text-xs">
                        {['all', 'unread'].map(f => (
                          <button
                            key={f}
                            onClick={() => setNotifFilter(f)}
                            className="px-2 py-1 rounded-full transition"
                            style={{
                              backgroundColor: notifFilter === f ? 'var(--accent)' : 'transparent',
                              color: notifFilter === f ? 'var(--accent-text)' : 'var(--text-secondary)',
                              border: notifFilter === f ? 'none' : '1px solid var(--border)',
                            }}
                          >
                            {f === 'all' ? 'All' : 'Unread'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                      {visibleNotifs.length === 0 ? (
                        <p className="text-sm text-center py-6" style={{ color: 'var(--text-secondary)' }}>
                          You're all caught up.
                        </p>
                      ) : (
                        visibleNotifs.map(n => (
                          <div
                            key={n.id}
                            className="flex items-start gap-2 px-4 py-3 border-b last:border-b-0"
                            style={{ borderColor: 'var(--border)' }}
                          >
                            <span
                              className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                              style={{ backgroundColor: n.unread ? 'var(--accent)' : 'var(--border)' }}
                            />
                            <p className="text-sm min-w-0" style={{ color: 'var(--text-primary)' }}>
                              {n.title}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ===== Event Alert ===== */}
          {!eventDismissed && (
            <div
              className="flex items-center justify-between gap-3 mb-6 px-4 py-3 rounded-lg min-w-0"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--accent)' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FaCalendarAlt className="flex-shrink-0" style={{ color: 'var(--accent)' }} />
                <p className="text-sm min-w-0" style={{ color: 'var(--text-primary)' }}>
                  <span className="font-medium">Kurullo community walk</span> — this Saturday, 6:00 AM at Talangama Wetland.
                </p>
              </div>
              <button
                onClick={() => setEventDismissed(true)}
                className="p-1 rounded-full transition hover:opacity-70 flex-shrink-0"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Dismiss"
              >
                <FaTimes size={14} />
              </button>
            </div>
          )}

          {/* ===== Life List + This Week ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

            {/* Life List */}
            <div className="rounded-lg p-4 min-w-0" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold flex items-center gap-2" style={sectionHeaderStyle}>
                  <FaFeatherAlt style={{ color: 'var(--accent)' }} />
                  Life List
                </h2>
                <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
                  {seenCount}/{lifeList.length} spotted
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${(seenCount / lifeList.length) * 100}%`,
                    backgroundColor: 'var(--accent)',
                  }}
                />
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {lifeList.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleLifeItem(item.id)}
                    className="w-full flex items-center gap-3 text-left px-2 py-2 rounded-lg transition hover:opacity-80"
                  >
                    {item.seen ? (
                      <FaCheckCircle className="flex-shrink-0" style={{ color: 'var(--accent)' }} />
                    ) : (
                      <FaRegCircle className="flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm truncate"
                        style={{
                          color: item.seen ? 'var(--text-secondary)' : 'var(--text-primary)',
                          textDecoration: item.seen ? 'line-through' : 'none',
                        }}
                      >
                        {item.species}
                      </p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                        {item.sinhala}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* This Week */}
            <div className="rounded-lg p-4 min-w-0" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h2 className="text-lg font-semibold mb-3" style={sectionHeaderStyle}>
                This Week
              </h2>
              <div className="space-y-2">
                {weekPlan.map(item => (
                  <div key={item.id} className="flex items-center gap-3 px-2 py-2 rounded-lg min-w-0">
                    <span
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium flex-shrink-0"
                      style={{
                        backgroundColor: item.done ? 'var(--accent)' : 'var(--bg-secondary)',
                        color: item.done ? 'var(--accent-text)' : 'var(--text-secondary)',
                      }}
                    >
                      {item.day}
                    </span>
                    <p
                      className="text-sm flex-1 min-w-0 truncate"
                      style={{
                        color: item.done ? 'var(--text-secondary)' : 'var(--text-primary)',
                        textDecoration: item.done ? 'line-through' : 'none',
                      }}
                    >
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Special Places ===== */}
          <div className="mb-6 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold" style={sectionHeaderStyle}>
                Special Places
              </h2>
              <button
                className="text-xs flex items-center gap-1 transition hover:opacity-70 flex-shrink-0"
                style={{ color: 'var(--accent)' }}
              >
                See all <FaChevronRight size={10} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {specialPlaces.map(place => (
                <div
                  key={place.id}
                  className="rounded-lg overflow-hidden min-w-0"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <img src={place.img} alt={place.name} className="w-full h-28 object-cover" />
                  <div className="p-3 min-w-0">
                    <p className="text-sm font-medium flex items-center gap-1 truncate" style={{ color: 'var(--text-primary)' }}>
                      <FaMapMarkerAlt size={12} className="flex-shrink-0" style={{ color: 'var(--accent)' }} />
                      {place.name}
                    </p>
                    <p className="text-xs mt-1 truncate" style={{ color: 'var(--text-secondary)' }}>
                      {place.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="min-w-0">
              {/* <Post /> */}
            </div>
          </div>

          {/* ===== Advertisement ===== */}
          <div
            className="flex items-center gap-3 mb-6 px-4 py-3 rounded-lg min-w-0"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px dashed var(--border)' }}
          >
            <FaBullhorn className="flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
            <p className="text-xs flex-1 min-w-0 truncate" style={{ color: 'var(--text-secondary)' }}>
              Sponsored — Zeiss birding binoculars, 15% off for Kurullo members.
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
              Ad
            </span>
          </div>

          {/* ===== Recent Visits ===== */}
          <div className="mb-6 min-w-0">
            <h2 className="text-lg font-semibold mb-3" style={sectionHeaderStyle}>
              Recent Visits
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 min-w-0">
              {recentVisits.map(visit => (
                <div
                  key={visit.id}
                  className="flex-shrink-0 w-40 rounded-lg overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
                >
                  <img src={visit.img} alt={visit.place} className="w-full h-24 object-cover" />
                  <div className="p-2">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {visit.place}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      {visit.when}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          

        </div>

        {/* new div here */}
        {/* ===== Journal feed (Post component) ===== */}
          <div className="min-w-0 mt-4">
            <h2 className="text-lg font-semibold mb-3" style={sectionHeaderStyle}>
              Journal feed
            </h2>
            <Post />
          </div>

      </div>

      <SidebarRight />
    </div>
  );
};

export default Dashboard;