import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight/SidebarShell';
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiTrash2 } from 'react-icons/fi';
import CreateChecklist from './CreateChecklist';
import { getMyChecklists, getMyTrips, deleteChecklist } from '../../utils/api';

const Checklists = () => {
  const [checklists, setChecklists] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlace, setFilterPlace] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [checklistToDelete, setChecklistToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const checklistsPerPage = 8;

  // Helper to get trip title from tripId
  const getTripTitle = (tripId) => {
    if (!tripId) return "No trip";
    const trip = trips.find(t => t.id === tripId);
    return trip ? trip.title : "Unknown trip";
  };

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [checklistData, tripData] = await Promise.all([
          getMyChecklists(),
          getMyTrips(),
        ]);
        setChecklists(checklistData);
        setTrips(tripData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const uniquePlaces = ["all", ...new Set(checklists.map((c) => getTripTitle(c.tripId)).filter(Boolean))];

  const filteredChecklists = checklists.filter((cl) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = cl.title?.toLowerCase().includes(searchLower) || 
                          getTripTitle(cl.tripId).toLowerCase().includes(searchLower);
    const matchesPlace = filterPlace === "all" || getTripTitle(cl.tripId) === filterPlace;
    const matchesDate = !filterDate || new Date(cl.createdAt).toISOString().split('T')[0] === filterDate;
    return matchesSearch && matchesPlace && matchesDate;
  });

  const indexOfLast = currentPage * checklistsPerPage;
  const indexOfFirst = indexOfLast - checklistsPerPage;
  const currentChecklists = filteredChecklists.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredChecklists.length / checklistsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteClick = (e, checklist) => {
    e.preventDefault();
    e.stopPropagation();
    setChecklistToDelete(checklist);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    if (!checklistToDelete) return;
    try {
      await deleteChecklist(checklistToDelete.id);
      setChecklists(checklists.filter(c => c.id !== checklistToDelete.id));
      setShowDeletePopup(false);
      setChecklistToDelete(null);
    } catch (err) {
      alert(err.message);
      setShowDeletePopup(false);
    }
  };

  const handleSaveChecklist = (newChecklist) => {
    setChecklists([newChecklist, ...checklists]);
    setShowPopup(false);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  useEffect(() => { 
    setCurrentPage(1); 
  }, [searchTerm, filterPlace, filterDate]);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar />
      <div className="flex-1 min-w-0 p-4 ml-0 md:ml-16 lg:ml-[20%] pb-20 md:pb-4">
        
        <div className="flex items-center justify-between mb-4 min-w-0">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Checklists
          </h1>
          <button 
            onClick={() => setShowPopup(true)} 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition flex-shrink-0"
            style={{ 
              backgroundColor: "var(--accent)", 
              color: "var(--accent-text)",
            }}
          >
            <span>+</span>
            <span>Add New</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Search by checklist or trip name..." 
              className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              style={{ 
                backgroundColor: "var(--bg-primary)", 
                color: "var(--text-primary)",
                border: "1px solid var(--border)"
              }}
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <select 
            className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            style={{ 
              backgroundColor: "var(--bg-primary)", 
              color: "var(--text-primary)",
              border: "1px solid var(--border)"
            }}
            value={filterPlace} 
            onChange={(e) => setFilterPlace(e.target.value)}
          >
            <option value="all">All Places</option>
            {uniquePlaces.filter(place => place !== "all").map((place) => (
              <option key={place} value={place}>{place}</option>
            ))}
          </select>
          <input 
            type="date" 
            className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            style={{ 
              backgroundColor: "var(--bg-primary)", 
              color: "var(--text-primary)",
              border: "1px solid var(--border)"
            }}
            value={filterDate} 
            onChange={(e) => setFilterDate(e.target.value)} 
          />
        </div>

        <div className="p-4 w-full min-w-0 rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
          <div className="space-y-2">
            {loading ? (
              <div className="p-8 text-center rounded-lg" style={{ backgroundColor: "var(--bg-card)" }}>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Loading checklists...
                </p>
              </div>
            ) : currentChecklists.length > 0 ? (
              currentChecklists.map((cl) => (
                <Link to={`/checklists/${cl.id}`} key={cl.id} className="block">
                  <div 
                    className="w-full flex items-center gap-3 text-left p-3 rounded-lg transition hover:opacity-90 min-w-0"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {/* Species-count thumbnail badge — checklists have no stored
                        image, so the species tally itself stands in as the
                        visual anchor for the row. */}
                    <div
                      className="flex flex-col items-center justify-center rounded-lg shrink-0"
                      style={{
                        width: "56px",
                        height: "56px",
                        backgroundColor: "var(--accent)",
                        color: "var(--accent-text)",
                      }}
                    >
                      <span className="text-lg font-bold leading-none">
                        {cl.speciesCount || 0}
                      </span>
                      <span className="text-[10px] font-medium  tracking-wide mt-1">
                        Species
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold opacity-90" style={{ color: "var(--text-primary)" }}>
                        {cl.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-1" style={{ color: "var(--text-secondary)" }}>
                        <FiMapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="text-xs">{getTripTitle(cl.tripId)}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                          <FiCalendar className="w-3 h-3" />
                          <span>{formatDateTime(cl.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteClick(e, cl)}
                      className="p-2 rounded-full transition-colors hover:bg-red-50 flex-shrink-0"
                      style={{ color: "#dc2626" }}
                      title="Delete checklist"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center rounded-lg" style={{ backgroundColor: "var(--bg-card)" }}>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {searchTerm || filterPlace !== "all" || filterDate ? 
                    "No checklists found matching your criteria" : 
                    "No checklists found. Click 'Add New' to get started!"}
                </p>
              </div>
            )}
          </div>

          {filteredChecklists.length > checklistsPerPage && (
            <div className="flex justify-center items-center mt-6 gap-4">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1} 
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                  currentPage === 1 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:opacity-80"
                }`}
                style={{ 
                  backgroundColor: currentPage === 1 ? "#d1d5db" : "var(--accent)",
                  color: currentPage === 1 ? "#9ca3af" : "var(--accent-text)"
                }}
              >
                ←
              </button>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages} 
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                  currentPage === totalPages 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:opacity-80"
                }`}
                style={{ 
                  backgroundColor: currentPage === totalPages ? "#d1d5db" : "var(--accent)",
                  color: currentPage === totalPages ? "#9ca3af" : "var(--accent-text)"
                }}
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
      <SidebarRight />

      {/* Create Checklist Popup */}
      <CreateChecklist 
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onSave={handleSaveChecklist}
        trips={trips}
      />

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg w-full max-w-md" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Delete Checklist
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Are you sure you want to delete "{checklistToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => { 
                  setShowDeletePopup(false); 
                  setChecklistToDelete(null); 
                }} 
                className="px-4 py-2 rounded-lg hover:opacity-70 text-sm"
                style={{ 
                  border: "1px solid var(--border)",
                  backgroundColor: "transparent",
                  color: "var(--text-secondary)"
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete} 
                className="px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                style={{ backgroundColor: "#dc2626", color: "white" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checklists;