import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight/SidebarShell';
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiTrash2 } from 'react-icons/fi';

// Dummy data
const dummyChecklists = [
  {
    _id: "1",
    title: "Yellowstone National Park Apr 15, 2024",
    tripPlace: "Yellowstone National Park",
    date: "2024-04-15",
    totalSpecies: 45,
    createdAt: "2024-04-15T10:30:00Z"
  },
  {
    _id: "2",
    title: "Grand Canyon May 20, 2024",
    tripPlace: "Grand Canyon National Park",
    date: "2024-05-20",
    totalSpecies: 32,
    createdAt: "2024-05-20T08:15:00Z"
  },
  {
    _id: "3",
    title: "Everglades Jun 10, 2024",
    tripPlace: "Everglades National Park",
    date: "2024-06-10",
    totalSpecies: 67,
    createdAt: "2024-06-10T14:45:00Z"
  },
  {
    _id: "4",
    title: "Rocky Mountain Jul 5, 2024",
    tripPlace: "Rocky Mountain National Park",
    date: "2024-07-05",
    totalSpecies: 28,
    createdAt: "2024-07-05T09:20:00Z"
  },
  {
    _id: "5",
    title: "Acadia National Park Aug 12, 2024",
    tripPlace: "Acadia National Park",
    date: "2024-08-12",
    totalSpecies: 53,
    createdAt: "2024-08-12T07:00:00Z"
  },
  {
    _id: "6",
    title: "Zion National Park Sep 3, 2024",
    tripPlace: "Zion National Park",
    date: "2024-09-03",
    totalSpecies: 39,
    createdAt: "2024-09-03T11:30:00Z"
  },
  {
    _id: "7",
    title: "Glacier National Park Oct 18, 2024",
    tripPlace: "Glacier National Park",
    date: "2024-10-18",
    totalSpecies: 41,
    createdAt: "2024-10-18T16:10:00Z"
  },
  {
    _id: "8",
    title: "Olympic National Park Nov 22, 2024",
    tripPlace: "Olympic National Park",
    date: "2024-11-22",
    totalSpecies: 36,
    createdAt: "2024-11-22T13:25:00Z"
  },
  {
    _id: "9",
    title: "Smoky Mountains Dec 8, 2024",
    tripPlace: "Great Smoky Mountains",
    date: "2024-12-08",
    totalSpecies: 58,
    createdAt: "2024-12-08T06:50:00Z"
  }
];

const dummyTrips = [
  { _id: "t1", title: "Yellowstone National Park" },
  { _id: "t2", title: "Grand Canyon National Park" },
  { _id: "t3", title: "Everglades National Park" },
  { _id: "t4", title: "Rocky Mountain National Park" },
  { _id: "t5", title: "Acadia National Park" }
];

const Checklists = () => {
  const [checklists, setChecklists] = useState(dummyChecklists);
  const [trips] = useState(dummyTrips);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlace, setFilterPlace] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [checklistToDelete, setChecklistToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrip, setSelectedTrip] = useState("");
  const [checklistTitle, setChecklistTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const checklistsPerPage = 8;

  const uniquePlaces = ["all", ...new Set(checklists.map((c) => c.tripPlace).filter(Boolean))];

  const filteredChecklists = checklists.filter((cl) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = cl.title?.toLowerCase().includes(searchLower) || cl.tripPlace?.toLowerCase().includes(searchLower);
    const matchesPlace = filterPlace === "all" || cl.tripPlace === filterPlace;
    const matchesDate = !filterDate || new Date(cl.date).toISOString().split('T')[0] === filterDate;
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

  const handleConfirmDelete = () => {
    if (checklistToDelete) {
      setChecklists(checklists.filter(c => c._id !== checklistToDelete._id));
      setShowDeletePopup(false);
      setChecklistToDelete(null);
    }
  };

  const handleSaveChecklist = () => {
    if (!selectedTrip || !checklistTitle || !selectedDate) return;
    
    const selectedTripData = trips.find(trip => trip._id === selectedTrip);
    const newChecklist = {
      _id: Date.now().toString(),
      title: checklistTitle,
      tripPlace: selectedTripData?.title || "Unknown",
      date: selectedDate,
      totalSpecies: 0,
      createdAt: new Date().toISOString()
    };
    
    setChecklists([newChecklist, ...checklists]);
    setShowPopup(false);
    setSelectedTrip("");
    setChecklistTitle("");
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleCreateTripClick = () => {
    setShowPopup(false);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  React.useEffect(() => { setCurrentPage(1); }, [searchTerm, filterPlace, filterDate]);

  React.useEffect(() => {
    if (selectedTrip && selectedDate) {
      const selectedTripData = trips.find(trip => trip._id === selectedTrip);
      if (selectedTripData) {
        const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        setChecklistTitle(`${selectedTripData.title} ${formattedDate}`);
      }
    } else {
      setChecklistTitle("");
    }
  }, [selectedTrip, selectedDate, trips]);

  React.useEffect(() => {
    if (showPopup) {
      setSelectedTrip("");
      setSelectedDate(new Date().toISOString().split('T')[0]);
      setChecklistTitle("");
    }
  }, [showPopup]);

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
            {currentChecklists.length > 0 ? (
              currentChecklists.map((cl) => (
                <Link to={`/birder/checklist/${cl._id}`} key={cl._id} className="block">
                  <div 
                    className="w-full flex items-start gap-3 text-left p-3 rounded-lg transition hover:opacity-90 min-w-0"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold opacity-90" style={{ color: "var(--text-primary)" }}>
                        {cl.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-1" style={{ color: "var(--text-secondary)" }}>
                        <FiMapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="text-xs">{cl.tripPlace}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          Species: {cl.totalSpecies || 0}
                        </p>
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
                  {searchTerm || filterPlace !== "all" || filterDate ? "No checklists found matching your criteria" : "No checklists found. Click 'Add New' to get started!"}
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
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Page {currentPage} of {totalPages}</span>
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

      {/* Add New Checklist Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg w-full max-w-md" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Add New Checklist</h3>
              <button onClick={() => setShowPopup(false)} className="text-xl hover:opacity-70" style={{ color: "var(--text-secondary)" }}>×</button>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm" style={{ color: "var(--text-secondary)" }}>Select Trip</label>
              <select 
                value={selectedTrip} 
                onChange={(e) => setSelectedTrip(e.target.value)} 
                className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                style={{ 
                  backgroundColor: "var(--bg-card)", 
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)"
                }}
              >
                <option value="">Select a trip</option>
                {trips.map((trip) => (
                  <option key={trip._id} value={trip._id}>{trip.title}</option>
                ))}
              </select>
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                Don't see your trip? 
                <button 
                  onClick={handleCreateTripClick}
                  className="hover:underline ml-1"
                  style={{ color: "var(--accent)" }}
                >
                  Create a new trip first
                </button>
              </p>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm" style={{ color: "var(--text-secondary)" }}>Date</label>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
                className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                style={{ 
                  backgroundColor: "var(--bg-card)", 
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)"
                }}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm" style={{ color: "var(--text-secondary)" }}>Checklist Title</label>
              <input 
                type="text" 
                placeholder="Enter checklist title" 
                value={checklistTitle} 
                onChange={(e) => setChecklistTitle(e.target.value)} 
                className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                style={{ 
                  backgroundColor: "var(--bg-card)", 
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)"
                }}
              />
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Default name generated from trip location and date.</p>
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowPopup(false)} 
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
                onClick={handleSaveChecklist} 
                disabled={!selectedTrip || !checklistTitle} 
                className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
                style={{ 
                  backgroundColor: selectedTrip && checklistTitle ? "var(--accent)" : "#d1d5db",
                  color: selectedTrip && checklistTitle ? "var(--accent-text)" : "#9ca3af"
                }}
              >
                Save Checklist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg w-full max-w-md" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Delete Checklist</h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Are you sure you want to delete "{checklistToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => { setShowDeletePopup(false); setChecklistToDelete(null); }} 
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