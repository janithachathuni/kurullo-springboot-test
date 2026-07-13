import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight/SidebarShell';
import { 
  FiCalendar, 
  FiMapPin, 
  FiTrash2, 
  FiPlus,
  FiSearch
} from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to update map center when location changes
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

// Dummy data
const dummyTrips = [
  {
    _id: "1",
    title: "Yellowstone National Park",
    location: "Yellowstone National Park, Wyoming, USA",
    createdAt: "2024-04-15T10:30:00Z",
    checklists: [{ _id: "c1" }, { _id: "c2" }],
    notes: "Great bird watching experience"
  },
  {
    _id: "2",
    title: "Grand Canyon",
    location: "Grand Canyon National Park, Arizona, USA",
    createdAt: "2024-05-20T08:15:00Z",
    checklists: [{ _id: "c3" }],
    notes: "Amazing views"
  },
  {
    _id: "3",
    title: "Everglades National Park",
    location: "Everglades National Park, Florida, USA",
    createdAt: "2024-06-10T14:45:00Z",
    checklists: [{ _id: "c4" }, { _id: "c5" }, { _id: "c6" }],
    notes: "Lots of bird species"
  }
];

// Sri Lanka bounding box for Photon API
const SRI_LANKA_BBOX = [79.5, 5.9, 81.9, 9.9];

const Trips = () => {
  const [trips, setTrips] = useState(dummyTrips);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tripTitle, setTripTitle] = useState("");
  const [tripLocation, setTripLocation] = useState("");
  const [tripNotes, setTripNotes] = useState("");
  
  // Location search states
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [locationSearchResults, setLocationSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]); // Sri Lanka center
  const [mapZoom, setMapZoom] = useState(8);
  
  const locationInputRef = useRef(null);
  const locationSuggestionsRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  
  const tripsPerPage = 10;

  // Search location using Photon API
  const searchLocation = async (query) => {
    if (!query.trim() || query.length < 2) {
      setLocationSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setSearching(true);

      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&` +
        `limit=10&lang=en&` +
        `bbox=${SRI_LANKA_BBOX.join(',')}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.features && data.features.length > 0) {
        const results = data.features.map((feature) => {
          const properties = feature.properties;
          const geometry = feature.geometry;
          
          const name = properties.name || properties.street || '';
          const city = properties.city || properties.town || properties.village || properties.suburb || '';
          const state = properties.state || properties.region || properties.county || '';
          const country = properties.country || '';
          
          const displayParts = [name, city, state, country].filter(Boolean);
          const displayName = displayParts.length > 0 ? displayParts.join(', ') : name;
          
          const fullAddressParts = [];
          if (properties.street) fullAddressParts.push(properties.street);
          if (properties.housenumber) fullAddressParts.push(properties.housenumber);
          if (city) fullAddressParts.push(city);
          if (state) fullAddressParts.push(state);
          if (country) fullAddressParts.push(country);
          const fullAddress = fullAddressParts.length > 0 ? fullAddressParts.join(', ') : displayName;
          
          return {
            name: name || displayName,
            displayName: displayName,
            formattedAddress: fullAddress,
            lat: geometry.coordinates[1],
            lng: geometry.coordinates[0],
            placeId: properties.osm_id?.toString() || `place_${Math.random()}`,
            type: properties.osm_value || properties.osm_key || 'place',
            class: properties.osm_key || '',
            city: city,
            state: state,
            country: country,
            fullDetails: properties,
          };
        });

        setLocationSearchResults(results);
        setShowSearchResults(true);
      } else {
        setLocationSearchResults([]);
        setShowSearchResults(true);
      }

      setSearching(false);
    } catch (err) {
      console.error("Error searching location with Photon:", err);
      setSearching(false);
      setLocationSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (locationSearchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        searchLocation(locationSearchQuery);
      }, 300);
    } else {
      setLocationSearchResults([]);
      setShowSearchResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [locationSearchQuery]);

  const handleSelectLocation = (location) => {
    setPlaceDetails({
      displayName: location.displayName || location.name,
      formattedAddress: location.formattedAddress,
      location: {
        lat: location.lat,
        lng: location.lng,
      },
      placeId: location.placeId,
      city: location.city,
      state: location.state,
      country: location.country,
    });
    setTripLocation(location.displayName || location.name);
    setLocationSearchQuery("");
    setShowSearchResults(false);
    setMapCenter([location.lat, location.lng]);
    setMapZoom(15);
  };

  // Click outside to close location suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        locationSuggestionsRef.current && 
        !locationSuggestionsRef.current.contains(e.target) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(e.target)
      ) {
        setShowSearchResults(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      } else if (sortBy === "popular") {
        return (b.checklists?.length || 0) - (a.checklists?.length || 0);
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
    setTripTitle("");
    setTripLocation("");
    setTripNotes("");
    setPlaceDetails(null);
    setLocationSearchQuery("");
    setLocationSearchResults([]);
    setMapCenter([7.8731, 80.7718]);
    setMapZoom(8);
  };

  const handleSaveTrip = () => {
    if (!tripTitle.trim() || !tripLocation.trim()) {
      alert("Please fill in both title and location");
      return;
    }

    const newTrip = {
      _id: Date.now().toString(),
      title: tripTitle.trim(),
      location: tripLocation.trim(),
      createdAt: new Date().toISOString(),
      checklists: [],
      notes: tripNotes.trim()
    };
    
    setTrips([newTrip, ...trips]);
    setShowPopup(false);
    setTripTitle("");
    setTripLocation("");
    setTripNotes("");
  };

  const handleDeleteClick = (trip) => {
    setTripToDelete(trip);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = () => {
    if (tripToDelete) {
      setTrips(trips.filter(t => t._id !== tripToDelete._id));
      setShowDeletePopup(false);
      setTripToDelete(null);
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
              <option value="popular">Most Popular</option>
            </select>
          </div>

        <div className="p-4 w-full min-w-0 rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
          
          

          <div className="space-y-2">
            {currentTrips.length > 0 ? (
              currentTrips.map((trip) => (
                <div 
                  key={trip._id} 
                  className="w-full flex items-start gap-3 text-left p-3 rounded-lg transition hover:opacity-90 min-w-0 cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                  }}
                  onClick={() => (window.location.href = `/birder/trip/${trip._id}`)}
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
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        Checklists: {trip.checklists?.length || 0}
                      </p>
                    </div>
                    {trip.notes && (
                      <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                        {trip.notes.substring(0, 50)}
                        {trip.notes.length > 50 ? "..." : ""}
                      </p>
                    )}
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

      {/* Add Trip Popup with Location Search and Map */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Add New Trip</h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-xl hover:opacity-70"
                style={{ color: "var(--text-secondary)" }}
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                Trip Title *
              </label>
              <input
                type="text"
                placeholder="Enter trip title..."
                value={tripTitle}
                onChange={(e) => setTripTitle(e.target.value)}
                className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                style={{ 
                  backgroundColor: "var(--bg-card)", 
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)"
                }}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                Location *
              </label>
              <div className="relative location-search-container" style={{ zIndex: 999 }}>
                <div className="relative">
                  <input
                    ref={locationInputRef}
                    type="text"
                    placeholder="Search for a location in Sri Lanka..."
                    value={locationSearchQuery || tripLocation}
                    onChange={(e) => {
                      setLocationSearchQuery(e.target.value);
                      if (tripLocation && e.target.value !== tripLocation) {
                        setTripLocation("");
                        setPlaceDetails(null);
                      }
                    }}
                    onFocus={() => {
                      if (locationSearchQuery.trim() && locationSearchResults.length > 0) {
                        setShowSearchResults(true);
                      }
                    }}
                    className="w-full p-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    style={{ 
                      backgroundColor: "var(--bg-card)", 
                      color: "var(--text-primary)",
                      border: "1px solid var(--border)"
                    }}
                  />
                  <FiSearch className="absolute left-3 top-3" style={{ color: "var(--text-secondary)" }} />
                  {searching && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Location Search Results Dropdown - Higher z-index */}
                {showSearchResults && (
                  <div 
                    ref={locationSuggestionsRef}
                    className="absolute left-0 right-0 mt-2 border rounded-lg shadow-lg max-h-64 overflow-y-auto"
                    style={{ 
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                      zIndex: 9999,
                      position: 'absolute',
                    }}
                  >
                    {locationSearchResults.length > 0 ? (
                      locationSearchResults.map((result, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelectLocation(result)}
                          className="p-3 cursor-pointer border-b last:border-b-0 transition-colors"
                          style={{ 
                            borderColor: "var(--border)",
                            backgroundColor: "var(--bg-card)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--bg-card)";
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--text-secondary)" }} />
                            <div>
                              <p className="font-medium">{result.displayName || result.name}</p>
                              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                                {result.formattedAddress}
                              </p>
                              {result.city && (
                                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                                  {[result.city, result.state, result.country].filter(Boolean).join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center" style={{ color: "var(--text-secondary)" }}>
                        {searching ? "Searching..." : `No locations found matching "${locationSearchQuery}"`}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Location Details */}
            {placeDetails && (
              <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  <FiMapPin/> {placeDetails.displayName}
                </p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {placeDetails.formattedAddress}
                </p>
                {placeDetails.location && (
                  <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                    Coordinates: {placeDetails.location.lat.toFixed(6)}, {placeDetails.location.lng.toFixed(6)}
                  </p>
                )}
              </div>
            )}

            {/* Map Container - Lower z-index */}
            <div className="mb-4" style={{ position: 'relative', zIndex: 1 }}>
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: "250px", width: "100%", borderRadius: "8px" }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {placeDetails && (
                  <Marker
                    position={[
                      placeDetails.location.lat,
                      placeDetails.location.lng,
                    ]}
                  />
                )}
                <MapUpdater center={mapCenter} zoom={mapZoom} />
              </MapContainer>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                Notes (optional)
              </label>
              <textarea
                placeholder="Add notes about your trip..."
                value={tripNotes}
                onChange={(e) => setTripNotes(e.target.value)}
                rows="3"
                className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                style={{ 
                  backgroundColor: "var(--bg-card)", 
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)"
                }}
              />
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
                onClick={handleSaveTrip}
                disabled={!tripTitle.trim() || !tripLocation.trim()}
                className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
                style={{ 
                  backgroundColor: (tripTitle.trim() && tripLocation.trim()) ? "var(--accent)" : "#d1d5db",
                  color: (tripTitle.trim() && tripLocation.trim()) ? "var(--accent-text)" : "#9ca3af"
                }}
              >
                Save Trip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
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