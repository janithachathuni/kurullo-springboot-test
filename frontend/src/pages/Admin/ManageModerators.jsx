import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import default_profile_pic from '../../assets/default_profile_pic.png';

const ManageModerators = () => {
  const [moderators, setModerators] = useState([]);
  const [loadingMods, setLoadingMods] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteSentFor, setInviteSentFor] = useState(null);

  const [banner, setBanner] = useState(null);

  const token = localStorage.getItem('token');
  const authHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fetchModerators = useCallback(async () => {
    setLoadingMods(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/moderators`, {
        headers: authHeaders,
      });
      if (res.ok) setModerators(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMods(false);
    }
  }, []);

  useEffect(() => {
    fetchModerators();
  }, [fetchModerators]);

  // Poll for newly-confirmed invites so we can show the banner
  useEffect(() => {
    const checkConfirmations = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/moderators/pending-confirmations`, {
          headers: authHeaders,
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.length > 0) {
          const notice = data[0];
          setBanner(`${notice.username} confirmed and is now a moderator.`);
          await fetch(
            `${import.meta.env.VITE_API_URL}/api/admin/moderators/pending-confirmations/${notice.inviteId}/acknowledge`,
            { method: 'POST', headers: authHeaders }
          );
          fetchModerators();
          setTimeout(() => setBanner(null), 5000);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const interval = setInterval(checkConfirmations, 5000);
    return () => clearInterval(interval);
  }, [fetchModerators]);

  const handleRemoveModerator = async (userId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/moderators/${userId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (res.ok) {
        setModerators((prev) => prev.filter((m) => m.userId !== userId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOpenMenuId(null);
    }
  };

  const handleSearch = async (value) => {
    setQuery(value);
    setSelectedUser(null);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/moderators/search?q=${encodeURIComponent(value)}`,
        { headers: authHeaders }
      );
      if (res.ok) setResults(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleSendInvite = async (user) => {
    setSendingInvite(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/moderators/invite`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ userId: user.userId }),
      });
      if (res.ok) {
        setInviteSentFor(user.userId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingInvite(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <AdminSidebar />
      <div className="flex-1 p-4 ml-[20%]">
        <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: "var(--bg-secondary)" }}>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Manage moderators
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            View, appoint, and remove moderators
          </p>
        </div>

        {banner && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm font-medium"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
          >
            {banner}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Moderators column */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Moderators
            </h2>

            {loadingMods ? (
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Loading...</p>
            ) : moderators.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No moderators yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {moderators.map((mod) => (
                  <div
                    key={mod.userId}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: "var(--bg-card)" }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={mod.profilePic || default_profile_pic}
                        alt={mod.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {mod.username}
                        </p>
                        <p className="text-xs opacity-60" style={{ color: "var(--text-secondary)" }}>
                          @{mod.username}
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === mod.userId ? null : mod.userId)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:opacity-80"
                        style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}
                      >
                        ···
                      </button>
                      {openMenuId === mod.userId && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          <div
                            className="absolute right-0 mt-1 w-40 rounded-xl shadow-lg z-20 overflow-hidden"
                            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
                          >
                            <button
                              onClick={() => handleRemoveModerator(mod.userId)}
                              className="w-full text-left px-4 py-2.5 text-sm hover:opacity-80"
                              style={{ color: "#e11d48" }}
                            >
                              Remove moderator
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appoint new moderators column */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Appoint New Moderators
            </h2>

            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by username..."
              className="w-full px-4 py-2 rounded-lg mb-3 text-sm outline-none"
              style={{
                backgroundColor: "var(--bg-card)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            />

            {searching && (
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Searching...</p>
            )}

            <div className="flex flex-col gap-2">
              {results.map((user) => (
                <div key={user.userId}>
                  <button
                    onClick={() => setSelectedUser(selectedUser?.userId === user.userId ? null : user)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:opacity-90"
                    style={{ backgroundColor: "var(--bg-card)" }}
                  >
                    <img
                      src={user.profilePic || default_profile_pic}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {user.username}
                      </p>
                      <p className="text-xs opacity-60" style={{ color: "var(--text-secondary)" }}>
                        @{user.username}
                      </p>
                    </div>
                  </button>

                  {selectedUser?.userId === user.userId && (
                    <div
                      className="mt-1 p-3 rounded-lg flex items-center justify-between"
                      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
                    >
                      {inviteSentFor === user.userId ? (
                        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                          Invite sent — awaiting confirmation.
                        </p>
                      ) : (
                        <>
                          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                            Send moderator invite email?
                          </p>
                          <button
                            onClick={() => handleSendInvite(user)}
                            disabled={sendingInvite}
                            className="px-3 py-1.5 rounded-full text-sm font-medium disabled:opacity-60"
                            style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
                          >
                            {sendingInvite ? "Sending..." : "Send Email"}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageModerators;