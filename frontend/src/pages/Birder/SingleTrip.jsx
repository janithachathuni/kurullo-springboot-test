import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight/SidebarShell';
import { FaArrowLeft, FaListUl } from 'react-icons/fa';
import { getTripById, getChecklistsByTrip } from '../../utils/api';

const SingleTrip = () => {
  const navigate = useNavigate();
  const { id: tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTrip = async () => {
      setLoading(true);
      setError("");
      try {
        const [tripData, checklistData] = await Promise.all([
          getTripById(tripId),
          getChecklistsByTrip(tripId)
        ]);
        setTrip(tripData);
        setChecklists(checklistData);
      } catch (err) {
        console.error("Failed to load trip:", err);
        setError("Failed to load trip. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (tripId) loadTrip();
  }, [tripId]);

  const visibleChecklists = checklists.slice(0, 5);
  const hasMore = checklists.length > 5;

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar />
      <div className="flex-1 min-w-0 ml-0 md:ml-16 lg:ml-[20%] pb-20 md:pb-4">
        {/* Header */}
        <div className="p-4 rounded-t-lg flex items-center" style={{ backgroundColor: "var(--bg-primary)" }}>
          <FaArrowLeft 
            className="mr-4 cursor-pointer hover:opacity-70 transition-opacity" 
            style={{ color: "var(--text-primary)" }}
            onClick={() => navigate(-1)} 
          />
          {loading ? (
            <>
              <div className="w-8 h-8 rounded-full mr-3 flex-shrink-0 animate-pulse" style={{ backgroundColor: "var(--bg-secondary)" }} />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-40 rounded animate-pulse" style={{ backgroundColor: "var(--bg-secondary)" }} />
                <div className="h-3 w-24 rounded animate-pulse" style={{ backgroundColor: "var(--bg-secondary)" }} />
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white text-sm flex-shrink-0" style={{ backgroundColor: "var(--accent)" }}>
                {trip?.title?.charAt(0) || "T"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                  {trip?.title}
                </p>
                <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                  {trip?.location}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="border-t" style={{ borderColor: "var(--border)" }}></div>

        {error && (
          <div className="mx-4 mt-4 p-3 rounded-lg" style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}>
            {error}
          </div>
        )}

        {/* Checklists for this trip */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Checklists
            </p>
            {hasMore && (
              <Link
                to="/checklists"
                className="text-xs font-medium hover:underline"
                style={{ color: "var(--accent)" }}
              >
                See more →
              </Link>
            )}
          </div>

          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "var(--bg-secondary)" }}>
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg animate-pulse" style={{ backgroundColor: "var(--bg-card)" }}>
                    <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{ backgroundColor: "var(--bg-secondary)" }} />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 rounded" style={{ backgroundColor: "var(--bg-secondary)" }} />
                      <div className="h-3 w-20 rounded" style={{ backgroundColor: "var(--bg-secondary)" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : visibleChecklists.length > 0 ? (
              <div className="p-2 space-y-2">
                {visibleChecklists.map((cl) => (
                  <Link to={`/checklists/${cl.id}`} key={cl.id} className="block">
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg transition hover:opacity-90"
                      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
                      >
                        <FaListUl size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                          {cl.title}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {cl.speciesCount || 0} species
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                No checklists for this trip yet.
              </div>
            )}
          </div>
        </div>
      </div>
      <SidebarRight />
    </div>
  );
};

export default SingleTrip;