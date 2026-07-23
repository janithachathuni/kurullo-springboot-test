import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight/SidebarShell';
import { 
  FaArrowLeft, 
  FaSearch, 
  FaPlus, 
  FaMinus, 
  FaTrash, 
  FaTimes 
} from 'react-icons/fa';

// Dummy data
const dummyChecklist = {
  _id: "1",
  title: "Thalangama Lake Apr 15, 2024",
  tripPlace: "Thalangama Lake",
  observations: [
     {
    _id: "1",
    birdId: { _id: "bird1" },
    birdName: "Purple Heron",
    scientificName: "Ardea purpurea",
    count: 2,
    timeSeen: "06:45",
    fieldNotes: "Wading in shallow water near the reed beds, stalking fish"
  },
  {
    _id: "2",
    birdId: { _id: "bird2" },
    birdName: "Grey-headed Swamphen",
    scientificName: "Porphyrio poliocephalus",
    count: 4,
    timeSeen: "07:10",
    fieldNotes: "Foraging in reed beds, red bill and legs clearly visible"
  },
  {
    _id: "3",
    birdId: { _id: "bird3" },
    birdName: "White-breasted Waterhen",
    scientificName: "Amaurornis phoenicurus",
    count: 3,
    timeSeen: "07:25",
    fieldNotes: "Scurrying along the pond edge, calling loudly"
  },
  {
    _id: "4",
    birdId: { _id: "bird4" },
    birdName: "Pheasant-tailed Jacana",
    scientificName: "Hydrophasianus chirurgus",
    count: 1,
    timeSeen: "07:40",
    fieldNotes: "Walking across lily pads, non-breeding plumage"
  },
  {
    _id: "5",
    birdId: { _id: "bird5" },
    birdName: "Asian Openbill",
    scientificName: "Anastomus oscitans",
    count: 6,
    timeSeen: "08:00",
    fieldNotes: "Standing motionless in shallow water, hunting snails"
  },
  {
    _id: "6",
    birdId: { _id: "bird6" },
    birdName: "Indian Pond Heron",
    scientificName: "Ardeola grayii",
    count: 5,
    timeSeen: "08:15",
    fieldNotes: "Solitary, flushed and showed brilliant white wings in flight"
  },
  {
    _id: "7",
    birdId: { _id: "bird7" },
    birdName: "Little Egret",
    scientificName: "Egretta garzetta",
    count: 8,
    timeSeen: "08:30",
    fieldNotes: "Several birds fishing together near the main tank"
  },
  {
    _id: "8",
    birdId: { _id: "bird8" },
    birdName: "Black-winged Stilt",
    scientificName: "Himantopus himantopus",
    count: 3,
    timeSeen: "08:50",
    fieldNotes: "Feeding on insects at the water's edge, long red legs"
  },
  {
    _id: "9",
    birdId: { _id: "bird9" },
    birdName: "Pied Kingfisher",
    scientificName: "Ceryle rudis",
    count: 2,
    timeSeen: "09:05",
    fieldNotes: "Hovering above water before diving for fish"
  },
  {
    _id: "10",
    birdId: { _id: "bird10" },
    birdName: "Common Kingfisher",
    scientificName: "Alcedo atthis",
    count: 1,
    timeSeen: "09:20",
    fieldNotes: "Perched low on a reed stem near the canal"
  },
  {
    _id: "11",
    birdId: { _id: "bird11" },
    birdName: "White-throated Kingfisher",
    scientificName: "Halcyon smyrnensis",
    count: 2,
    timeSeen: "09:35",
    fieldNotes: "Calling from a wire overlooking the paddy field"
  },
  {
    _id: "12",
    birdId: { _id: "bird12" },
    birdName: "Lesser Whistling Duck",
    scientificName: "Dendrocygna javanica",
    count: 15,
    timeSeen: "09:50",
    fieldNotes: "Large flock gliding across the main lake"
  },
  ]
};

const dummySearchResults = [
  {
    _id: "bird1",
    primaryName: "Bald Eagle",
    otherNames: ["American Eagle"],
    scientificName: "Haliaeetus leucocephalus",
    sinhalaName: "මුහුදු රාජාලියා",
    tamilName: "கடல் கழுகு"
  },
  {
    _id: "bird2",
    primaryName: "American Robin",
    otherNames: ["Robin"],
    scientificName: "Turdus migratorius",
    sinhalaName: "ඇමෙරිකානු රොබින්",
    tamilName: "அமெரிக்க ராபின்"
  },
  {
    _id: "bird3",
    primaryName: "Northern Cardinal",
    otherNames: ["Redbird", "Cardinal"],
    scientificName: "Cardinalis cardinalis",
    sinhalaName: "උතුරු කාදිනල්",
    tamilName: "வடக்கு கார்டினல்"
  },
  {
    _id: "bird4",
    primaryName: "Blue Jay",
    otherNames: ["Jay"],
    scientificName: "Cyanocitta cristata",
    sinhalaName: "නිල් ජේ",
    tamilName: "நீல ஜே"
  }
];

const SingleChecklist = () => {
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState(dummyChecklist);
  const [observations, setObservations] = useState(dummyChecklist.observations);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedBird, setSelectedBird] = useState(null);
  const [birdCount, setBirdCount] = useState(1);
  const [timeSeen, setTimeSeen] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState("");

  // Search birds with dummy data
  const searchBirds = (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    setSearching(true);
    const searchLower = term.toLowerCase().trim();
    
    const filtered = dummySearchResults.filter(bird => {
      if (bird.primaryName?.toLowerCase().includes(searchLower)) return true;
      if (bird.otherNames && Array.isArray(bird.otherNames)) {
        if (bird.otherNames.some(name => name?.toLowerCase().includes(searchLower))) return true;
      }
      if (bird.scientificName?.toLowerCase().includes(searchLower)) return true;
      if (bird.sinhalaName?.toLowerCase().includes(searchLower)) return true;
      if (bird.tamilName?.toLowerCase().includes(searchLower)) return true;
      return false;
    });
    
    const sorted = filtered.sort((a, b) => {
      const aNameMatch = a.primaryName?.toLowerCase() === searchLower;
      const bNameMatch = b.primaryName?.toLowerCase() === searchLower;
      
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      
      return a.primaryName.localeCompare(b.primaryName);
    });
    
    setSearchResults(sorted.slice(0, 10));
    setShowSearchResults(true);
    setSearching(false);
  };

  // Debounced search
  useEffect(() => {
    const debounce = setTimeout(() => searchBirds(searchTerm), 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  // Select bird from search
  const handleSelectBird = (bird) => {
    setSelectedBird(bird);
    setSearchTerm("");
    setShowSearchResults(false);
    setBirdCount(1);
    setTimeSeen(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    setShowAddPopup(true);
  };

  // Add observation
  const handleAddObservation = () => {
    if (!selectedBird || !birdCount || !timeSeen) {
      setError("Please fill in all required fields");
      return;
    }
    
    const newObservation = {
      _id: `obs${Date.now()}`,
      birdId: { _id: selectedBird._id },
      birdName: selectedBird.primaryName,
      scientificName: selectedBird.scientificName,
      count: birdCount,
      timeSeen: timeSeen,
      fieldNotes: ""
    };
    
    setObservations([...observations, newObservation]);
    setShowAddPopup(false);
    setSelectedBird(null);
    setError("");
  };

  // Update observation count
  const handleUpdateCount = (observationId, newCount) => {
    if (newCount < 0) return;
    
    setObservations(prev => prev.map(obs => 
      obs._id === observationId ? { ...obs, count: newCount } : obs
    ));
  };

  // Delete observation
  const handleDeleteObservation = (observationId) => {
    setObservations(prev => prev.filter(obs => obs._id !== observationId));
    setDeleteConfirm(null);
  };

  // Format date and time for header
  const formatHeaderDateTime = () => {
    if (!checklist?.observations || checklist.observations.length === 0) return "";
    
    // Get the earliest observation time
    const times = checklist.observations.map(obs => obs.timeSeen).filter(Boolean);
    if (times.length === 0) return "";
    
    // Sort times and get first and last
    const sortedTimes = [...times].sort();
    const firstTime = sortedTimes[0];
    const lastTime = sortedTimes[sortedTimes.length - 1];
    
    if (firstTime === lastTime) {
      return firstTime;
    }
    return `${firstTime} - ${lastTime}`;
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSearchResults && !e.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearchResults]);

  const timeRange = formatHeaderDateTime();

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar />
      <div className="flex-1 min-w-0 ml-0 md:ml-16 lg:ml-[20%] pb-20 md:pb-4">
        {/* Header */}
        <div className="p-4 rounded-t-lg flex items-center" style={{ backgroundColor: "var(--bg-primary)" }}>
          <FaArrowLeft 
            className="mr-4 cursor-pointer hover:opacity-70" 
            style={{ color: "var(--text-primary)" }}
            onClick={() => navigate(-1)} 
          />
          <div className="w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white text-sm flex-shrink-0" style={{ backgroundColor: "#506142" }}>
            {checklist?.title?.charAt(0) || "C"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold truncate" style={{ color: "var(--text-primary)" }}>
              {checklist?.title}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                {checklist?.tripPlace}
              </p>
              {timeRange && (
                <>
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>•</span>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Time: {timeRange}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border-t" style={{ borderColor: "var(--border)" }}></div>

        {/* Search Area */}
        <div className="p-4 relative search-container">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search birds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm && setShowSearchResults(true)}
                className="w-full px-4 py-2 pl-10 rounded-full focus:outline-none focus:ring-2 text-sm"
                style={{ 
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                  focusRing: "var(--accent)"
                }}
              />
              <FaSearch className="absolute left-3 top-3" style={{ color: "var(--text-secondary)" }} />
              {searching && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" style={{ borderColor: "var(--text-secondary)" }}></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute left-4 right-4 mt-2 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
              {searchResults.map(bird => (
                <div
                  key={bird._id}
                  onClick={() => handleSelectBird(bird)}
                  className="p-3 hover:opacity-80 cursor-pointer border-b last:border-b-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>{bird.primaryName}</p>
                  {bird.otherNames && bird.otherNames.length > 0 && (
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{bird.otherNames.join(', ')}</p>
                  )}
                  <p className="text-sm italic" style={{ color: "var(--text-secondary)" }}>{bird.scientificName}</p>
                  {bird.sinhalaName && <p className="text-xs" style={{ color: "var(--text-secondary)" }}>සිංහල: {bird.sinhalaName}</p>}
                  {bird.tamilName && <p className="text-xs" style={{ color: "var(--text-secondary)" }}>தமிழ்: {bird.tamilName}</p>}
                </div>
              ))}
            </div>
          )}
          {showSearchResults && searchResults.length === 0 && searchTerm && !searching && (
            <div className="absolute left-4 right-4 mt-2 rounded-lg shadow-lg z-20 p-4 text-center" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
              No birds found matching "{searchTerm}"
            </div>
          )}
        </div>

        {error && (
          <div className="mx-4 mb-4 p-3 rounded-lg flex justify-between items-center" style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}>
            <span>{error}</span>
            <button onClick={() => setError("")} className="hover:opacity-70">
              <FaTimes />
            </button>
          </div>
        )}

        {/* Observations List */}
        <div className="px-4 pb-2">
          <div className="rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
            {observations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    {observations.map((obs) => (
                      <tr key={obs._id} className="border-b last:border-b-0" style={{ borderColor: "var(--border)" }}>
                        <td className="py-1 px-4">
                          <p 
                            className="font-semibold cursor-pointer hover:underline"
                            style={{ color: "var(--text-primary)" }}
                            onClick={() => {
                              navigate(`/bird/${obs._id}`);
                            }}
                          >
                            {obs.birdName}
                          </p>
                          <p className="text-xs italic" style={{ color: "var(--text-secondary)" }}>{obs.scientificName}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleUpdateCount(obs._id, obs.count - 1)}
                              disabled={obs.count <= 0}
                              className="w-6 h-6 flex items-center justify-center rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-70"
                              style={{ backgroundColor: "var(--bg-primary)" }}
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="w-8 text-center font-medium" style={{ color: "var(--text-primary)" }}>{obs.count}</span>
                            <button
                              onClick={() => handleUpdateCount(obs._id, obs.count + 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:opacity-70"
                              style={{ backgroundColor: "var(--bg-primary)" }}
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-sm" style={{ color: "var(--text-secondary)" }}>{obs.timeSeen}</td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => setDeleteConfirm(obs._id)}
                            className="p-2 hover:opacity-70"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center rounded-lg" style={{ backgroundColor: "var(--bg-card)", color: "var(--text-secondary)" }}>
                No birds added yet. Search and add birds above!
              </div>
            )}
          </div>
        </div>
      </div>
      <SidebarRight />

      {/* Add Observation Popup */}
      {showAddPopup && selectedBird && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg w-full max-w-md" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Add Bird Observation</h3>
              <button 
                onClick={() => setShowAddPopup(false)} 
                className="hover:opacity-70"
                style={{ color: "var(--text-secondary)" }}
              >
                <FaTimes />
              </button>
            </div>
            <div className="mb-6">
              <p className="font-medium" style={{ color: "var(--text-primary)" }}>{selectedBird.primaryName}</p>
              {selectedBird.otherNames && selectedBird.otherNames.length > 0 && (
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{selectedBird.otherNames.join(', ')}</p>
              )}
              <p className="text-sm italic" style={{ color: "var(--text-secondary)" }}>{selectedBird.scientificName}</p>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Count</label>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setBirdCount(Math.max(1, birdCount - 1))} 
                  className="w-8 h-8 rounded-full hover:opacity-70 flex items-center justify-center"
                  style={{ backgroundColor: "var(--bg-card)" }}
                >
                  <FaMinus className="text-xs" />
                </button>
                <input 
                  type="number" 
                  value={birdCount} 
                  onChange={(e) => setBirdCount(Math.max(1, parseInt(e.target.value) || 1))} 
                  className="w-20 text-center p-2 rounded-lg focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: "var(--bg-card)", 
                    color: "var(--text-primary)",
                    border: "1px solid var(--border)"
                  }}
                  min="1"
                />
                <button 
                  onClick={() => setBirdCount(birdCount + 1)} 
                  className="w-8 h-8 rounded-full hover:opacity-70 flex items-center justify-center"
                  style={{ backgroundColor: "var(--bg-card)" }}
                >
                  <FaPlus className="text-xs" />
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Time Seen</label>
              <input 
                type="time" 
                value={timeSeen} 
                onChange={(e) => setTimeSeen(e.target.value)} 
                className="w-full p-2 rounded-lg focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: "var(--bg-card)", 
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)"
                }}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowAddPopup(false)} 
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
                onClick={handleAddObservation} 
                disabled={!birdCount || !timeSeen} 
                className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
                style={{ 
                  backgroundColor: birdCount && timeSeen ? "var(--accent)" : "#d1d5db",
                  color: birdCount && timeSeen ? "var(--accent-text)" : "#9ca3af"
                }}
              >
                Add Bird
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg max-w-sm" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <p className="font-medium mb-2" style={{ color: "var(--text-primary)" }}>Delete Observation</p>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Are you sure you want to remove this bird from the checklist?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirm(null)} 
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
                onClick={() => handleDeleteObservation(deleteConfirm)} 
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

export default SingleChecklist;