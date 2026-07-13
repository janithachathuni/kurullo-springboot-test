import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LocationPicker = ({ onLocationSelect, initialPosition, onClose }) => {
  const [position, setPosition] = useState(initialPosition || [7.8731, 79.8612]); // Default: Sri Lanka
  const [address, setAddress] = useState('');
  const [searchingAddress, setSearchingAddress] = useState(false);
  const mapRef = useRef(null);

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (lat, lng) => {
    setSearchingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        const address = data.address || {};
        const parts = [];
        
        if (address.city) parts.push(address.city);
        else if (address.town) parts.push(address.town);
        else if (address.village) parts.push(address.village);
        else if (address.suburb) parts.push(address.suburb);
        
        if (address.state) parts.push(address.state);
        else if (address.region) parts.push(address.region);
        else if (address.county) parts.push(address.county);
        
        if (address.country) parts.push(address.country);
        
        const displayName = parts.length > 0 ? parts.join(', ') : data.display_name;
        setAddress(displayName);
        
        // Send the location data back to parent
        onLocationSelect({
          lat,
          lng,
          address: displayName,
          full_address: data.display_name,
          raw: data,
        });
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      setAddress('Unknown location');
    } finally {
      setSearchingAddress(false);
    }
  };

  // Component to handle map clicks
  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
        
        // Update marker position
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], map.getZoom());
        }
      },
    });

    return position ? (
      <Marker 
        position={position} 
        icon={customIcon}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const position = marker.getLatLng();
            setPosition([position.lat, position.lng]);
            reverseGeocode(position.lat, position.lng);
          },
        }}
      >
        <Popup>
          {address || 'Loading address...'}
        </Popup>
      </Marker>
    ) : null;
  };

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation && !initialPosition) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          reverseGeocode(latitude, longitude);
        },
        () => {
          // Fallback to default
          reverseGeocode(position[0], position[1]);
        }
      );
    } else if (initialPosition) {
      reverseGeocode(initialPosition[0], initialPosition[1]);
    } else {
      reverseGeocode(position[0], position[1]);
    }
  }, []);

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
      <div className="relative">
        <MapContainer
          center={position}
          zoom={12}
          style={{ height: '400px', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
        
        {/* Address info overlay */}
        <div 
          className="absolute bottom-4 left-4 right-4 p-3 rounded-lg shadow-lg"
          style={{ 
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium">
                {searchingAddress ? 'Getting address...' : address || 'Click on map to select location'}
              </p>
              {position && (
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {position[0].toFixed(6)}, {position[1].toFixed(6)}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        const { latitude, longitude } = pos.coords;
                        setPosition([latitude, longitude]);
                        reverseGeocode(latitude, longitude);
                        if (mapRef.current) {
                          mapRef.current.setView([latitude, longitude], 12);
                        }
                      },
                      (error) => {
                        alert('Unable to get your location. Please click on the map.');
                      }
                    );
                  }
                }}
                className="px-3 py-1 text-xs rounded transition-colors"
                style={{ 
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-text)'
                }}
              >
                My Location
              </button>
              <button
                onClick={onClose}
                className="px-3 py-1 text-xs rounded transition-colors"
                style={{ 
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)'
                }}
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;