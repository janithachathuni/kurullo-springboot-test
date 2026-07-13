import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaCamera, FaTimes, FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { getBirds, createPost } from '../../utils/api';

const CreatePost = ({ onComplete }) => {
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [locationSearchResults, setLocationSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [locationCoords, setLocationCoords] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [tagInputs, setTagInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [birdSuggestions, setBirdSuggestions] = useState({});
  const [searchingBirds, setSearchingBirds] = useState({});
  const [showBirdSearchResults, setShowBirdSearchResults] = useState({});
  const [allBirds, setAllBirds] = useState([]);
  const [birdsLoading, setBirdsLoading] = useState(true);
  
  const locationInputRef = useRef(null);
  const locationSuggestionsRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Sri Lanka bounding box for Photon API
  const SRI_LANKA_BBOX = [79.5, 5.9, 81.9, 9.9];

  // Fetch birds from database on mount
  useEffect(() => {
    const fetchBirds = async () => {
      try {
        const data = await getBirds();
        setAllBirds(data);
        setBirdsLoading(false);
      } catch (error) {
        console.error("Failed to fetch birds:", error);
        setBirdsLoading(false);
      }
    };
    fetchBirds();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
      photos.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [photos]);

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
    setLocation(location.displayName || location.name);
    setLocationSearchQuery("");
    setShowSearchResults(false);
    setLocationCoords({ lat: location.lat, lng: location.lng });
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

  // Search function using database birds
  const searchBirds = (term, photoId) => {
    if (!term.trim() || birdsLoading) {
      setBirdSuggestions((prev) => ({ ...prev, [photoId]: [] }));
      setShowBirdSearchResults((prev) => ({ ...prev, [photoId]: false }));
      return;
    }

    setSearchingBirds((prev) => ({ ...prev, [photoId]: true }));
    
    setTimeout(() => {
      const searchLower = term.toLowerCase().trim();
      
      const photo = photos.find(p => p.id === photoId);
      const taggedBirdIds = photo?.birds?.map(b => b.birdId).filter(id => id) || [];
      
      const filtered = allBirds.filter((bird) => {
        if (!bird.primaryName) return false;
        if (taggedBirdIds.includes(bird.id)) return false;
        
        if (bird.primaryName.toLowerCase().includes(searchLower)) return true;
        
        if (bird.otherNames && Array.isArray(bird.otherNames)) {
          if (bird.otherNames.some((name) => 
            name && typeof name === "string" && 
            name.toLowerCase().includes(searchLower)
          )) return true;
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
        return (a.primaryName || "").localeCompare(b.primaryName || "");
      });
      
      const results = sorted.slice(0, 10);
      setBirdSuggestions((prev) => ({ ...prev, [photoId]: results }));
      setShowBirdSearchResults((prev) => ({ 
        ...prev, 
        [photoId]: results.length > 0 
      }));
      setSearchingBirds((prev) => ({ ...prev, [photoId]: false }));
    }, 300);
  };

  const handleTagInputChange = (photoId, value) => {
    setTagInputs((prev) => ({ ...prev, [photoId]: value }));
    
    if (value.trim() && !showBirdSearchResults[photoId]) {
      setShowBirdSearchResults((prev) => ({ ...prev, [photoId]: true }));
    }
    
    const debounce = setTimeout(() => {
      if (value.trim()) {
        searchBirds(value, photoId);
      } else {
        setBirdSuggestions((prev) => ({ ...prev, [photoId]: [] }));
        setShowBirdSearchResults((prev) => ({ ...prev, [photoId]: false }));
      }
    }, 300);
    
    return () => clearTimeout(debounce);
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.slice(0, 7 - photos.length).map((file, index) => {
      const url = URL.createObjectURL(file);
      return {
        id: Date.now() + index,
        file,
        url,
        birds: [],
      };
    });
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    
    const newPhotos = [...photos];
    const draggedPhoto = newPhotos[draggedIndex];
    newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(dropIndex, 0, draggedPhoto);
    
    setPhotos(newPhotos);
    setDraggedIndex(null);
  };

  const removePhoto = (photoId) => {
    const photoToRemove = photos.find((p) => p.id === photoId);
    if (photoToRemove) {
      URL.revokeObjectURL(photoToRemove.url);
    }
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    setBirdSuggestions((prev) => {
      const newSuggestions = { ...prev };
      delete newSuggestions[photoId];
      return newSuggestions;
    });
    setShowBirdSearchResults((prev) => {
      const newResults = { ...prev };
      delete newResults[photoId];
      return newResults;
    });
  };

  const addTagToPhoto = (photoId, bird = null) => {
    const tag = tagInputs[photoId] || "";
    const trimmedTag = tag.trim();
    
    if (!bird && !trimmedTag) return;
    
    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return;
    
    if (bird) {
      const isDuplicate = photo.birds.some((b) => {
        if (b.birdId && bird.id) {
          return b.birdId === bird.id;
        }
        return b.name === bird.primaryName;
      });
      
      if (isDuplicate) {
        alert(`"${bird.primaryName}" is already tagged in this photo`);
        return;
      }
      
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId
            ? {
                ...p,
                birds: [
                  ...p.birds,
                  {
                    birdId: bird.id,
                    name: bird.primaryName,
                    scientificName: bird.scientificName || "",
                    taggedName: bird.primaryName,
                    nameType: "primaryName",
                  },
                ],
              }
            : p
        )
      );
    } else {
      const isDuplicate = photo.birds.some((b) => b.name === trimmedTag);
      if (isDuplicate) {
        alert(`"${trimmedTag}" is already tagged in this photo`);
        return;
      }
      
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId
            ? {
                ...p,
                birds: [
                  ...p.birds,
                  {
                    name: trimmedTag,
                    scientificName: "",
                    isCustom: true,
                  },
                ],
              }
            : p
        )
      );
    }
    
    setTagInputs((prev) => ({ ...prev, [photoId]: "" }));
    setBirdSuggestions((prev) => ({ ...prev, [photoId]: [] }));
    setShowBirdSearchResults((prev) => ({ ...prev, [photoId]: false }));
  };

  const removeTagFromPhoto = (photoId, birdToRemove) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId
          ? {
              ...p,
              birds: p.birds.filter((bird) =>
                bird.birdId
                  ? bird.birdId !== birdToRemove.birdId
                  : bird.name !== birdToRemove.name
              ),
            }
          : p
      )
    );
  };

  const handleCreatePost = async () => {
  if (photos.length === 0) {
    alert("Please add at least one photo");
    return;
  }

  setLoading(true);

  try {
    const postPayload = {
      description,
      locationName: placeDetails?.displayName || null,
      formattedAddress: placeDetails?.formattedAddress || null,
      latitude: locationCoords?.lat ?? null,
      longitude: locationCoords?.lng ?? null,
      placeId: placeDetails?.placeId || null,
      city: placeDetails?.city || null,
      state: placeDetails?.state || null,
      country: placeDetails?.country || null,
      photos: photos.map((photo) => ({
        birds: photo.birds.map((bird) => ({
          birdId: bird.birdId || null,
          taggedName: bird.name,
          scientificName: bird.scientificName || null,
          isCustom: !!bird.isCustom,
        })),
      })),
    };

    const imageFiles = photos.map((photo) => photo.file);

    await createPost(postPayload, imageFiles);

    alert("Post created successfully!");
    onComplete?.();
  } catch (error) {
    console.error("Failed to create post:", error);
    alert(error.message || "Something went wrong while creating your post.");
  } finally {
    setLoading(false);
  }
};

  const handleDiscard = () => {
    if (photos.length === 0 && description.trim() === "" && location.trim() === "") {
      onComplete?.();
    } else {
      setShowDiscardConfirm(true);
    }
  };

  // Click outside for bird search results
  useEffect(() => {
    const handleClickOutside = (e) => {
      const searchContainers = document.querySelectorAll(".search-container");
      let clickedOutside = true;
      
      searchContainers.forEach((container) => {
        if (container.contains(e.target)) {
          clickedOutside = false;
        }
      });
      
      if (clickedOutside) {
        const newState = {};
        Object.keys(showBirdSearchResults).forEach((key) => {
          newState[key] = false;
        });
        setShowBirdSearchResults(newState);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showBirdSearchResults]);

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div 
        className="rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ 
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b rounded-t-lg" style={{ 
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border)'
        }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Create Post
          </h2>
          <button
            onClick={handleDiscard}
            className="text-xl hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
            disabled={loading}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Photo Upload Section */}
          <div className="mb-4">
            {photos.length > 0 && (
              <div className="space-y-4">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`cursor-grab active:cursor-grabbing ${
                      draggedIndex === index ? "opacity-50" : ""
                    }`}
                  >
                    {/* Image with close button */}
                    <div className="relative rounded-lg overflow-hidden mb-3">
                      <img
                        src={photo.url}
                        alt={`Bird photo ${index + 1}`}
                        className="w-full h-auto object-contain"
                      />
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-3 right-3 p-2 rounded-full transition-colors hover:bg-red-50"
                        style={{ color: '#dc2626' }}
                        disabled={loading}
                      >
                        <FaTimes size={14} />
                      </button>
                      <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        Photo {index + 1}
                      </div>
                    </div>

                    {/* Bird Tags Section */}
                    <div className="space-y-3 search-container">
                      <label 
                        className="block text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Bird Species in this photo (optional):
                      </label>

                      {photo.birds?.length > 0 ? (
                        <div className="flex gap-2 flex-wrap mb-3">
                          {photo.birds.map((bird, idx) => (
                            <span
                              key={bird.birdId || bird.name + idx}
                              className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm"
                              style={{
                                backgroundColor: bird.isCustom ? 'var(--bg-yellow)' : 'var(--bg-green)',
                                color: bird.isCustom ? 'var(--text-yellow)' : 'var(--text-green)'
                              }}
                            >
                              <span className="font-medium">{bird.name}</span>
                              {bird.scientificName && (
                                <span className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>
                                  ({bird.scientificName})
                                </span>
                              )}
                              {bird.isCustom && (
                                <span className="text-xs ml-1" style={{ color: 'var(--text-secondary)' }}>
                                  (custom)
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  removeTagFromPhoto(photo.id, bird)
                                }
                                className="hover:text-red-600 font-bold text-lg ml-1"
                                disabled={loading}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                          No bird species tagged yet. You can leave it untagged or add species.
                        </p>
                      )}

                      <div className="relative">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={tagInputs[photo.id] || ""}
                              onChange={(e) =>
                                handleTagInputChange(photo.id, e.target.value)
                              }
                              onFocus={() =>
                                tagInputs[photo.id] &&
                                setShowBirdSearchResults((prev) => ({
                                  ...prev,
                                  [photo.id]: true,
                                }))
                              }
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addTagToPhoto(photo.id);
                                }
                              }}
                              className="w-full p-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                              style={{ 
                                backgroundColor: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border)'
                              }}
                              placeholder={birdsLoading ? "Loading birds..." : "Search birds by name, scientific name, Sinhala or Tamil..."}
                              disabled={loading || birdsLoading}
                            />
                            <FaSearch className="absolute left-3 top-3" style={{ color: 'var(--text-secondary)' }} />
                            {searchingBirds[photo.id] && (
                              <div className="absolute right-3 top-3">
                                <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => addTagToPhoto(photo.id)}
                            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                            style={{ 
                              backgroundColor: 'var(--accent)',
                              color: 'var(--accent-text)'
                            }}
                            disabled={loading || birdsLoading}
                          >
                            Add
                          </button>
                        </div>

                        {/* Bird Suggestions Dropdown */}
                        {showBirdSearchResults[photo.id] && (
                          <div 
                            className="absolute left-0 right-0 mt-2 border rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto"
                            style={{ 
                              backgroundColor: 'var(--bg-card)',
                              borderColor: 'var(--border)',
                              color: 'var(--text-primary)'
                            }}
                          >
                            {birdSuggestions[photo.id]?.length > 0 ? (
                              birdSuggestions[photo.id].map((bird) => (
                                <div
                                  key={bird.id}
                                  onClick={() => addTagToPhoto(photo.id, bird)}
                                  className="p-3 cursor-pointer border-b last:border-b-0 transition-colors"
                                  style={{ 
                                    borderColor: 'var(--border)',
                                    backgroundColor: 'var(--bg-card)',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                                  }}
                                >
                                  <p className="font-medium">{bird.primaryName}</p>
                                  {bird.otherNames &&
                                    bird.otherNames.length > 0 && (
                                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                        {bird.otherNames.join(", ")}
                                      </p>
                                    )}
                                  <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
                                    {bird.scientificName}
                                  </p>
                                  {bird.sinhalaName && (
                                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                      සිංහල: {bird.sinhalaName}
                                    </p>
                                  )}
                                  {bird.tamilName && (
                                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                      தமிழ்: {bird.tamilName}
                                    </p>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                                {searchingBirds[photo.id]
                                  ? "Searching..."
                                  : birdsLoading
                                  ? "Loading bird data..."
                                  : tagInputs[photo.id]
                                  ? `No birds found matching "${tagInputs[photo.id]}"`
                                  : "Start typing to search for birds"}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Tip: Start typing to search for bird species. You can add multiple tags or leave the photo untagged.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Photos Button */}
            <div className={photos.length > 0 ? "mt-4 pt-4 border-t" : ""} style={{ borderColor: 'var(--border)' }}>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-colors hover:bg-opacity-80">
                <FaCamera size={22} style={{ color: 'var(--text-secondary)' }} />
                <span className="text-md font-normal" style={{ color: 'var(--text-primary)' }}>
                  {photos.length === 0 ? "Add Photos" : "Add More Photos"}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  ({photos.length}/7)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  className="hidden"
                  disabled={photos.length >= 7 || loading}
                />
              </label>
              {photos.length === 0 && (
                <p className="text-sm mt-1 ml-2" style={{ color: 'var(--text-secondary)' }}>
                  Click to add up to 7 photos
                </p>
              )}
            </div>
          </div>

          {/* Location Field with Photon Autocomplete */}
          <div className="mb-4">
            <label 
              className="block mb-2 text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Location
            </label>
            
            <div className="relative location-search-container">
              <div className="relative">
                <input
                  ref={locationInputRef}
                  type="text"
                  placeholder="Search for a location in Sri Lanka..."
                  value={locationSearchQuery || location}
                  onChange={(e) => {
                    setLocationSearchQuery(e.target.value);
                    if (location && e.target.value !== location) {
                      setLocation("");
                      setPlaceDetails(null);
                      setLocationCoords(null);
                    }
                  }}
                  onFocus={() => {
                    if (locationSearchQuery.trim() && locationSearchResults.length > 0) {
                      setShowSearchResults(true);
                    }
                  }}
                  className="w-full p-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)'
                  }}
                  disabled={loading}
                />
                <FaSearch className="absolute left-3 top-3" style={{ color: 'var(--text-secondary)' }} />
                {searching && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Location Search Results Dropdown */}
              {showSearchResults && (
                <div 
                  ref={locationSuggestionsRef}
                  className="absolute left-0 right-0 mt-2 border rounded-lg shadow-lg z-30 max-h-64 overflow-y-auto"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {locationSearchResults.length > 0 ? (
                    locationSearchResults.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectLocation(result)}
                        className="p-3 cursor-pointer border-b last:border-b-0 transition-colors"
                        style={{ 
                          borderColor: 'var(--border)',
                          backgroundColor: 'var(--bg-card)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <FaMapMarkerAlt className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                          <div>
                            <p className="font-medium">{result.displayName || result.name}</p>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              {result.formattedAddress}
                            </p>
                            {result.city && (
                              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                {[result.city, result.state, result.country].filter(Boolean).join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                      {searching ? "Searching..." : `No locations found matching "${locationSearchQuery}"`}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {placeDetails && (
              <div className="mt-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {placeDetails.displayName}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {placeDetails.formattedAddress}
                    </p>
                    {locationCoords && (
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Coordinates: {locationCoords.lat.toFixed(6)}, {locationCoords.lng.toFixed(6)}
                      </p>
                    )}
                    {placeDetails.city && (
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {[placeDetails.city, placeDetails.state, placeDetails.country].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label 
              className="block mb-2 text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) =>
                e.target.value.length <= 800 && setDescription(e.target.value)
              }
              className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)'
              }}
              rows={4}
              placeholder="Share details about your birding experience, location, weather, behavior observed..."
              disabled={loading}
            />
            <div className="text-xs mt-2 text-right" style={{ color: 'var(--text-secondary)' }}>
              {description.length}/800
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={handleDiscard}
              className="px-4 py-2 rounded-lg hover:opacity-70 text-sm"
              style={{ 
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)'
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePost}
              disabled={photos.length === 0 || loading}
              className="px-6 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
              style={{ 
                backgroundColor: (photos.length > 0 && !loading) ? 'var(--accent)' : '#d1d5db',
                color: (photos.length > 0 && !loading) ? 'var(--accent-text)' : '#9ca3af'
              }}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>

      {/* Discard Confirmation */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div 
            className="rounded-lg p-6 max-w-sm w-full mx-4"
            style={{ 
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)'
            }}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Discard Post?</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to discard this post? This action cannot be undone.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onComplete?.();
                }}
                className="border py-2 rounded-lg font-medium transition-colors text-sm"
                style={{ 
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)'
                }}
              >
                Discard Post
              </button>
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="py-2 rounded-lg font-medium transition-colors text-sm"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)'
                }}
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CreatePost;