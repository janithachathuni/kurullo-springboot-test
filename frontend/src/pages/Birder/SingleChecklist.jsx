import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight/SidebarShell';
import { 
  FaArrowLeft, 
  FaSearch, 
  FaPlus, 
  FaMinus, 
  FaTrash, 
  FaTimes,
  FaStickyNote
} from 'react-icons/fa';
import {
  getChecklistById,
  getChecklistEntries,
  addChecklistEntry,
  updateChecklistEntry,
  deleteChecklistEntry,
  getBirds
} from '../../utils/api';

const SingleChecklist = () => {
  const navigate = useNavigate();
  const { id: checklistId } = useParams();
  const [checklist, setChecklist] = useState(null);
  const [observations, setObservations] = useState([]);
  const [allBirds, setAllBirds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState("");
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [notesDraft, setNotesDraft] = useState("");

  // Load checklist, entries, and the full bird list once
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const [checklistData, entriesData, birdsData] = await Promise.all([
          getChecklistById(checklistId),
          getChecklistEntries(checklistId),
          getBirds()
        ]);
        setChecklist(checklistData);
        setObservations(entriesData);
        setAllBirds(birdsData);
      } catch (err) {
        console.error("Failed to load checklist:", err);
        setError("Failed to load checklist. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (checklistId) loadData();
  }, [checklistId]);

  // Search birds against the fetched bird list
  const searchBirds = (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearching(true);
    const searchLower = term.toLowerCase().trim();

    const addedBirdIds = new Set(observations.map(obs => obs.birdId));

    const filtered = allBirds.filter(bird => {
      if (addedBirdIds.has(bird.id)) return false;
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
  }, [searchTerm, allBirds, observations]);

  // Select bird from search — adds it straight to the checklist, no popup
  const handleSelectBird = async (bird) => {
    if (observations.some(obs => obs.birdId === bird.id)) {
      setError(`${bird.primaryName} is already on this checklist`);
      setSearchTerm("");
      setShowSearchResults(false);
      return;
    }

    setSearchTerm("");
    setShowSearchResults(false);

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    try {
      const newEntry = await addChecklistEntry(checklistId, bird.id, 1, nowTime, "");
      setObservations(prev => [...prev, newEntry]);
      setError("");
    } catch (err) {
      console.error("Failed to add observation:", err);
      setError("Failed to add bird observation");
    }
  };

  // Update observation count
  const handleUpdateCount = async (observationId, newCount) => {
    if (newCount < 0) return;

    const target = observations.find(obs => obs.id === observationId);
    if (!target) return;

    setObservations(prev => prev.map(obs =>
      obs.id === observationId ? { ...obs, count: newCount } : obs
    ));

    try {
      await updateChecklistEntry(checklistId, observationId, target.birdId, newCount, target.timeSeen, target.fieldNotes);
    } catch (err) {
      console.error("Failed to update count:", err);
      setObservations(prev => prev.map(obs =>
        obs.id === observationId ? { ...obs, count: target.count } : obs
      ));
      setError("Failed to update count");
    }
  };

  // Delete observation
  const handleDeleteObservation = async (observationId) => {
    const prevObservations = observations;
    setObservations(prev => prev.filter(obs => obs.id !== observationId));
    setDeleteConfirm(null);

    try {
      await deleteChecklistEntry(checklistId, observationId);
    } catch (err) {
      console.error("Failed to delete observation:", err);
      setObservations(prevObservations);
      setError("Failed to delete observation");
    }
  };

  // Toggle the inline field notes row for an entry
  const handleOpenNotes = (obs) => {
    if (expandedNoteId === obs.id) {
      setExpandedNoteId(null);
      return;
    }
    setExpandedNoteId(obs.id);
    setNotesDraft(obs.fieldNotes || "");
  };

  // Save field notes for an entry
  const handleSaveNotes = async (obs) => {
    try {
      const updated = await updateChecklistEntry(
        checklistId,
        obs.id,
        obs.birdId,
        obs.count,
        obs.timeSeen,
        notesDraft
      );
      setObservations(prev => prev.map(o =>
        o.id === obs.id ? updated : o
      ));
      setExpandedNoteId(null);
    } catch (err) {
      console.error("Failed to save field notes:", err);
      setError("Failed to save field notes");
    }
  };

  // Format date and time for header
  const formatHeaderDateTime = () => {
    if (!observations || observations.length === 0) return "";
    
    // Get the earliest observation time
    const times = observations.map(obs => obs.timeSeen).filter(Boolean);
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
            </>
          )}
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
                onFocus={(e) => {
                  if (searchTerm) setShowSearchResults(true);
                  e.target.style.boxShadow = "0 0 0 2px var(--accent)";
                }}
                className="w-full px-4 py-2 pl-10 rounded-full focus:outline-none focus:ring-2 text-sm transition-shadow"
                style={{ 
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                }}
                onBlur={(e) => e.target.style.boxShadow = "none"}
              />
              <FaSearch className="absolute left-3 top-3" style={{ color: "var(--text-secondary)" }} />
              {searching && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full" style={{ borderColor: "var(--accent)" }}></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute left-4 right-4 mt-2 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
              {searchResults.map(bird => (
                <div
                  key={bird.id}
                  onClick={() => handleSelectBird(bird)}
                  className="p-3 hover:bg-opacity-5 cursor-pointer border-b last:border-b-0 transition-colors"
                  style={{ 
                    borderColor: "var(--border)",
                    color: "var(--text-primary)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-secondary)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
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
            <button onClick={() => setError("")} className="hover:opacity-70 transition-opacity">
              <FaTimes />
            </button>
          </div>
        )}

        {/* Observations List */}
        <div className="px-4 pb-2">
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "var(--bg-secondary)" }}>
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg animate-pulse" style={{ backgroundColor: "var(--bg-card)" }}>
                    <div className="space-y-2">
                      <div className="h-4 w-32 rounded" style={{ backgroundColor: "var(--bg-secondary)" }} />
                      <div className="h-3 w-24 rounded" style={{ backgroundColor: "var(--bg-secondary)" }} />
                    </div>
                    <div className="h-4 w-16 rounded" style={{ backgroundColor: "var(--bg-secondary)" }} />
                  </div>
                ))}
              </div>
            ) : observations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    {observations.map((obs) => (
                      <React.Fragment key={obs.id}>
                        <tr className="border-b last:border-b-0 transition-colors hover:bg-opacity-5" style={{ borderColor: expandedNoteId === obs.id ? "transparent" : "var(--border)" }}>
                          <td className="py-3 px-4">
                            <p 
                              className="font-semibold cursor-pointer hover:underline transition-all"
                              style={{ color: "var(--text-primary)" }}
                              onClick={() => {
                                navigate(`/bird/${obs.birdId}`);
                              }}
                            >
                              {obs.birdName}
                            </p>
                            <p className="text-xs italic" style={{ color: "var(--text-secondary)" }}>{obs.scientificName}</p>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleUpdateCount(obs.id, obs.count - 1)}
                                disabled={obs.count <= 0}
                                className="w-7 h-7 flex items-center justify-center rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70 transition-opacity"
                                style={{ backgroundColor: "var(--bg-card)" }}
                              >
                                <FaMinus className="text-xs" style={{ color: "var(--text-secondary)" }} />
                              </button>
                              <span className="w-8 text-center font-medium" style={{ color: "var(--text-primary)" }}>{obs.count}</span>
                              <button
                                onClick={() => handleUpdateCount(obs.id, obs.count + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-full hover:opacity-70 transition-opacity"
                                style={{ backgroundColor: "var(--bg-card)" }}
                              >
                                <FaPlus className="text-xs" style={{ color: "var(--text-secondary)" }} />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right text-sm" style={{ color: "var(--text-secondary)" }}>{obs.timeSeen}</td>
                          <td className="py-3 px-2">
                            <button
                              onClick={() => handleOpenNotes(obs)}
                              className="p-2 hover:opacity-70 transition-opacity"
                              style={{ color: (obs.fieldNotes || expandedNoteId === obs.id) ? "var(--accent)" : "var(--text-secondary)" }}
                              title={obs.fieldNotes ? "Edit field notes" : "Add field notes"}
                            >
                              <FaStickyNote className="text-sm" />
                            </button>
                          </td>
                          <td className="py-3 px-2">
                            <button
                              onClick={() => setDeleteConfirm(obs.id)}
                              className="p-2 hover:opacity-70 transition-opacity"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </td>
                        </tr>
                        {expandedNoteId === obs.id && (
                          <tr className="border-b last:border-b-0" style={{ borderColor: "var(--border)" }}>
                            <td colSpan={5} className="px-4 pb-3">
                              <textarea
                                value={notesDraft}
                                onChange={(e) => setNotesDraft(e.target.value)}
                                placeholder="What did you notice about this bird?"
                                rows={3}
                                autoFocus
                                className="w-full p-3 rounded-lg resize-none focus:outline-none focus:ring-2 transition-shadow text-sm"
                                style={{ 
                                  backgroundColor: "var(--bg-card)", 
                                  color: "var(--text-primary)",
                                  border: "1px solid var(--border)"
                                }}
                                onFocus={(e) => e.target.style.boxShadow = "0 0 0 2px var(--accent)"}
                                onBlur={(e) => e.target.style.boxShadow = "none"}
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                <button 
                                  onClick={() => setExpandedNoteId(null)} 
                                  className="px-3 py-1.5 rounded-lg hover:opacity-70 transition-opacity text-xs"
                                  style={{ 
                                    border: "1px solid var(--border)",
                                    backgroundColor: "transparent",
                                    color: "var(--text-secondary)"
                                  }}
                                >
                                  Cancel
                                </button>
                                <button 
                                  onClick={() => handleSaveNotes(obs)} 
                                  className="px-3 py-1.5 rounded-lg transition-all text-xs font-medium"
                                  style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
                                >
                                  Save Notes
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
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

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="p-6 rounded-lg max-w-sm shadow-xl" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <p className="font-medium mb-2" style={{ color: "var(--text-primary)" }}>Delete Observation</p>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Are you sure you want to remove this bird from the checklist?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirm(null)} 
                className="px-4 py-2 rounded-lg hover:opacity-70 transition-opacity text-sm"
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
                className="px-4 py-2 rounded-lg transition-opacity text-sm font-medium"
                style={{ backgroundColor: "#dc2626", color: "white" }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
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