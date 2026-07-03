import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  FiUsers, FiFileText, FiHeart, FiAlertTriangle,
  FiTrendingUp, FiMapPin, FiEye, FiMessageSquare
} from 'react-icons/fi';

const userGrowthData = [
  { month: 'Jan', users: 120 },
  { month: 'Feb', users: 195 },
  { month: 'Mar', users: 280 },
  { month: 'Apr', users: 340 },
  { month: 'May', users: 410 },
  { month: 'Jun', users: 520 },
  { month: 'Jul', users: 680 },
];

const topSpeciesData = [
  { species: 'Blue Jay', sightings: 142 },
  { species: 'Robin', sightings: 118 },
  { species: 'Cardinal', sightings: 97 },
  { species: 'Sparrow', sightings: 85 },
  { species: 'Finch', sightings: 73 },
  { species: 'Warbler', sightings: 61 },
];

const engagementData = [
  { day: 'Mon', posts: 24, likes: 180, comments: 52 },
  { day: 'Tue', posts: 18, likes: 140, comments: 38 },
  { day: 'Wed', posts: 32, likes: 210, comments: 71 },
  { day: 'Thu', posts: 27, likes: 190, comments: 63 },
  { day: 'Fri', posts: 41, likes: 290, comments: 94 },
  { day: 'Sat', posts: 55, likes: 380, comments: 112 },
  { day: 'Sun', posts: 48, likes: 320, comments: 98 },
];

const contentBreakdown = [
  { name: 'Posts', value: 58 },
  { name: 'Checklists', value: 24 },
  { name: 'Trips', value: 12 },
  { name: 'Forum', value: 6 },
];

const PIE_COLORS = ['#2d6a4f', '#52b788', '#95d5b2', '#b7e4c7'];

const topUsers = [
  { name: 'Hewrie Sharky', username: 'hewrie', posts: 48, followers: 312, joined: 'Jan 2025' },
  { name: 'Ashan Silva', username: 'ashan_b', posts: 41, followers: 289, joined: 'Feb 2025' },
  { name: 'Nimali K', username: 'nimali', posts: 37, followers: 241, joined: 'Jan 2025' },
  { name: 'Ravi Perera', username: 'ravibirds', posts: 33, followers: 198, joined: 'Mar 2025' },
  { name: 'Dilini W', username: 'dilini_w', posts: 29, followers: 175, joined: 'Feb 2025' },
];

const recentReports = [
  { post: 'Post #1042', reporter: 'user_a', reason: 'Spam', status: 'Pending', time: '2h ago' },
  { post: 'Post #998', reporter: 'user_b', reason: 'Inappropriate', status: 'Resolved', time: '5h ago' },
  { post: 'Post #1031', reporter: 'user_c', reason: 'Misinformation', status: 'Pending', time: '8h ago' },
  { post: 'Post #987', reporter: 'user_d', reason: 'Spam', status: 'Dismissed', time: '1d ago' },
];

const statCards = [
  { label: 'Total Users', value: '1,248', change: '+12% this month', icon: FiUsers, color: '#2d6a4f' },
  { label: 'Total Posts', value: '4,831', change: '+8% this month', icon: FiFileText, color: '#3b82f6' },
  { label: 'Total Likes', value: '28,490', change: '+21% this month', icon: FiHeart, color: '#ef4444' },
  { label: 'Pending Reports', value: '7', change: '2 new today', icon: FiAlertTriangle, color: '#f59e0b' },
];

const Statistics = () => {
  const [activeTab, setActiveTab] = useState('week');

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <AdminSidebar />
      <div className="flex-1 ml-[20%] p-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Platform Statistics</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Overview of Kurullo's activity and growth.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="rounded-xl p-4 flex items-start gap-4"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="p-2 rounded-lg" style={{ backgroundColor: card.color + '22' }}>
                <card.icon size={20} style={{ color: card.color }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{card.label}</p>
                <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{card.value}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{card.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* User Growth + Content Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl p-4"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>User Growth</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Line type="monotone" dataKey="users" stroke="#2d6a4f" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl p-4"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Content Breakdown</h2>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={contentBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {contentBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {contentBreakdown.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Engagement + Top Species */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl p-4"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Weekly Engagement</h2>
              <div className="flex gap-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#2d6a4f] inline-block" />Posts</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3b82f6] inline-block" />Likes</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f59e0b] inline-block" />Comments</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="posts" fill="#2d6a4f" radius={[4, 4, 0, 0]} />
                <Bar dataKey="likes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="comments" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl p-4"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Top Sighted Species</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topSpeciesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <YAxis dataKey="species" type="category" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} width={60} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="sightings" fill="#52b788" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Users + Recent Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl p-4"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Most Active Users</h2>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "var(--text-secondary)" }}>
                  <th className="text-left pb-2 font-medium">User</th>
                  <th className="text-right pb-2 font-medium">Posts</th>
                  <th className="text-right pb-2 font-medium">Followers</th>
                  <th className="text-right pb-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {topUsers.map((user, i) => (
                  <tr key={user.username} style={{ borderTop: "1px solid var(--border)" }}>
                    <td className="py-2.5">
                      <div style={{ color: "var(--text-primary)" }} className="font-medium">{user.name}</div>
                      <div style={{ color: "var(--text-secondary)" }} className="text-xs">@{user.username}</div>
                    </td>
                    <td className="text-right py-2.5" style={{ color: "var(--text-primary)" }}>{user.posts}</td>
                    <td className="text-right py-2.5" style={{ color: "var(--text-primary)" }}>{user.followers}</td>
                    <td className="text-right py-2.5" style={{ color: "var(--text-secondary)" }}>{user.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl p-4"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Recent Reports</h2>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "var(--text-secondary)" }}>
                  <th className="text-left pb-2 font-medium">Post</th>
                  <th className="text-left pb-2 font-medium">Reason</th>
                  <th className="text-right pb-2 font-medium">Status</th>
                  <th className="text-right pb-2 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                    <td className="py-2.5">
                      <div style={{ color: "var(--text-primary)" }}>{report.post}</div>
                      <div style={{ color: "var(--text-secondary)" }} className="text-xs">by {report.reporter}</div>
                    </td>
                    <td className="py-2.5" style={{ color: "var(--text-secondary)" }}>{report.reason}</td>
                    <td className="text-right py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: report.status === 'Pending' ? '#f59e0b22' : report.status === 'Resolved' ? '#10b98122' : '#6b728022',
                          color: report.status === 'Pending' ? '#f59e0b' : report.status === 'Resolved' ? '#10b981' : '#6b7280'
                        }}>
                        {report.status}
                      </span>
                    </td>
                    <td className="text-right py-2.5" style={{ color: "var(--text-secondary)" }}>{report.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Statistics;