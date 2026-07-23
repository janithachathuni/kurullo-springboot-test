import React, { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiSearch } from 'react-icons/fi';
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

// Sri Lanka bounding box for Photon API
const SRI_LANKA_BBOX = [79.5, 5.9, 81.9, 9.9];

const CreateTrip = ({ isOpen, onClose, onSave }) => {
  const [tripTitle, setTripTitle] = useState("");
  const [tripLocation, setTripLocation] = useState("");
  const [placeDetails, setPlaceDetails] = useState(null);
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]);
  const [mapZoom, setMapZoom] = useState(8);
  
  // Location search states
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [locationSearchResults, setLocationSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const locationInputRef = useRef(null);
  const locationSuggestionsRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setTripTitle("");
      setTripLocation("");
      setPlaceDetails(null);
      setLocationSearchQuery("");
      setLocationSearchResults([]);
      setMapCenter([7.8731, 80.7718]);
      setMapZoom(8);
    }
  }, [isOpen]);

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

  const handleSave = () => {
    if (!tripTitle.trim() || !tripLocation.trim()) {
      alert("Please fill in both title and location");
      return;
    }

    const payload = {
      title: tripTitle.trim(),
      location: tripLocation.trim(),
      formattedAddress: placeDetails?.formattedAddress || "",
      latitude: placeDetails?.location?.lat ?? null,
      longitude: placeDetails?.location?.lng ?? null,
      placeId: placeDetails?.placeId || "",
      city: placeDetails?.city || "",
      state: placeDetails?.state || "",
      country: placeDetails?.country || "",
    };

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Add New Trip</h3>
          <button
            onClick={onClose}
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

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
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
            onClick={handleSave}
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
  );
};

export default CreateTrip;