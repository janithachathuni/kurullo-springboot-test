import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight/SidebarShell';
import { 
  FiCalendar, 
  FiMapPin, 
  FiTrash2, 
  FiPlus
} from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getMyTrips, createTrip, deleteTrip, getTripLocations, getTripStats } from '../../utils/api';
import CreateTrip from './CreateTrip';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to fit Sri Lanka bounds perfectly
const FitSriLankaBounds = () => {
  const map = useMap();
  useEffect(() => {
    // Sri Lanka bounding box
    const bounds = L.latLngBounds([
      [5.9, 79.5], // South-West
      [9.9, 81.9]  // North-East
    ]);
    map.fitBounds(bounds, { padding: [10, 10] });
  }, [map]);
  return null;
};

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState(null);
  const [allLocations, setAllLocations] = useState([]);
  const navigate = useNavigate();
  
  const tripsPerPage = 10;

  // Fetch trips on mount
  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await getMyTrips();
        setTrips(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, []);

  // Fetch stats and locations on mount
  useEffect(() => {
    const loadStatsAndLocations = async () => {
      try {
        const [statsData, locationsData] = await Promise.all([
          getTripStats(),
          getTripLocations(),
        ]);
        setStats(statsData);
        setAllLocations(locationsData.filter(l => l.latitude != null && l.longitude != null));
      } catch (err) {
        console.error(err);
      }
    };
    loadStatsAndLocations();
  }, []);

  const filteredTrips = trips
    .filter((trip) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        trip.title?.toLowerCase().includes(searchLower) ||
        trip.location?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortBy === "date-asc") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "date-desc") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  // Pagination
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = filteredTrips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(filteredTrips.length / tripsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddTripClick = () => {
    setShowPopup(true);
  };

  const handleSaveTrip = async (payload) => {
    try {
      const newTrip = await createTrip(payload);
      setTrips([newTrip, ...trips]);
      setShowPopup(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteClick = (trip) => {
    setTripToDelete(trip);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    if (!tripToDelete) return;
    try {
      await deleteTrip(tripToDelete.id);
      setTrips(trips.filter(t => t.id !== tripToDelete.id));
      setShowDeletePopup(false);
      setTripToDelete(null);
    } catch (err) {
      alert(err.message);
      setShowDeletePopup(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar />
      <div className="flex-1 min-w-0 p-4 ml-0 md:ml-16 lg:ml-[20%] pb-20 md:pb-4">
        
        <div className="flex items-center justify-between mb-4 min-w-0">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Track your trips
          </h1>
          <button 
            onClick={handleAddTripClick} 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition flex-shrink-0"
            style={{ 
              backgroundColor: "var(--accent)", 
              color: "var(--accent-text)",
            }}
          >
            <FiPlus size={16} />
            <span>Add New</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Search trips by title or location..." 
              className="w-full p-2 pl-4 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
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
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
          </select>
        </div>

        {/* Stats + Map Section - Single square block with map left and stats right */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl" style={{ position: 'relative', zIndex: 1 }}>
          {/* Map - Left side */}
          <div className="aspect-square rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <MapContainer
              center={[7.8731, 80.7718]}
              zoom={7}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {allLocations.map((loc) => (
                <Marker key={loc.id} position={[loc.latitude, loc.longitude]} />
              ))}
              <FitSriLankaBounds />
            </MapContainer>
          </div>

          {/* Stats - Right side */}
          <div className="aspect-square rounded-lg p-6 flex flex-col justify-center" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="space-y-6">
              <div>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Places visited this year</p>
                <p className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {stats?.placesThisYear ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>All time</p>
                <p className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {stats?.placesAllTime ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 w-full min-w-0 rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
          <div className="space-y-2">
            {loading ? (
              <div className="p-8 text-center rounded-lg" style={{ backgroundColor: "var(--bg-card)" }}>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Loading trips...
                </p>
              </div>
            ) : currentTrips.length > 0 ? (
              currentTrips.map((trip) => (
                <div 
                  key={trip.id} 
                  className="w-full flex items-start gap-3 text-left p-3 rounded-lg transition hover:opacity-90 min-w-0 cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                  }}
                  onClick={() => (window.location.href = `/trips/${trip.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {trip.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1" style={{ color: "var(--text-secondary)" }}>
                      <FiMapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="text-xs">{trip.location}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <FiCalendar className="w-3 h-3" />
                        <span>{formatDate(trip.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(trip);
                    }}
                    className="p-2 rounded-full transition-colors hover:bg-red-50 flex-shrink-0"
                    style={{ color: "#dc2626" }}
                    title="Delete trip"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center rounded-lg" style={{ backgroundColor: "var(--bg-card)" }}>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {searchTerm ? "No trips found matching your search" : "No trips found. Click 'Add New' to get started!"}
                </p>
              </div>
            )}
          </div>

          {filteredTrips.length > tripsPerPage && (
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

      {/* Create Trip Popup - Higher z-index */}
      <CreateTrip 
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onSave={handleSaveTrip}
      />

      {/* Delete Confirmation Popup - Higher z-index */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg w-full max-w-md" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Delete Trip</h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Are you sure you want to delete "{tripToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeletePopup(false);
                  setTripToDelete(null);
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

export default Trips;