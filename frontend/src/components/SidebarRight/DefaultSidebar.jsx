import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaArrowRight } from "react-icons/fa";
import { getBirds } from "../../utils/api";

// Sample data — replace with real API data (trip logs)
const recentSightings = [
  {
    id: 1,
    name: "Sri Lanka Blue Magpie",
    location: "Sinharaja Forest",
    time: "2h ago",
    image: "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Indian Pitta",
    location: "Bundala National Park",
    time: "5h ago",
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Ceylon Grey Hornbill",
    location: "Kitulgala",
    time: "1d ago",
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=100&h=100&fit=crop",
  },
];

const recentTrips = [
  {
    id: 1,
    name: "Sinharaja Rainforest Trail",
    meta: "12 species logged",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Bundala Wetlands",
    meta: "8 species logged",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=100&h=100&fit=crop",
  },
];

const DefaultSidebar = () => {
  const [query, setQuery] = useState("");
  const [allBirds, setAllBirds] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Fetch all birds once so search can filter client-side
  useEffect(() => {
    (async () => {
      try {
        const birds = await getBirds();
        setAllBirds(birds || []);
      } catch (err) {
        console.error("Failed to load birds for search", err);
      }
    })();
  }, []);

  // Builds one lowercased haystack per bird from every searchable name field,
  // matching the same approach used in BirdList
  const buildSearchHaystack = (bird) => {
    const parts = [
      bird.primaryName,
      bird.scientificName,
      bird.sinhalaName,
      bird.tamilName,
      ...(Array.isArray(bird.otherNames) ? bird.otherNames : []),
    ];
    return parts.filter(Boolean).join(" ").toLowerCase();
  };

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allBirds
      .filter((bird) => buildSearchHaystack(bird).includes(q))
      .slice(0, 6);
  }, [query, allBirds]);

  const handleSelectBird = (birdId) => {
    setQuery("");
    setShowResults(false);
    navigate(`/bird/${birdId}`);
  };

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div>
        <div className="relative">
          <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: "var(--text-secondary)" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            placeholder="Search birds"
            className="w-full py-2.5 pl-10 pr-4 rounded-full text-sm outline-none transition-shadow focus:ring-2"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          />
        </div>

        {showResults && query.trim() !== "" && (
          <div
            className="mt-2 rounded-lg overflow-hidden"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            {searchResults.length > 0 ? (
              searchResults.map((bird) => (
                <div
                  key={bird.id}
                  onMouseDown={() => handleSelectBird(bird.id)}
                  className="flex items-center gap-3 p-2 cursor-pointer transition-colors hover:brightness-95"
                >
                  <img
                    src={bird.image}
                    alt={bird.primaryName}
                    className="w-7 h-7 rounded-md object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {bird.primaryName}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p
                className="text-xs p-3"
                style={{ color: "var(--text-secondary)" }}
              >
                No birds found
              </p>
            )}
          </div>
        )}
      </div>

      {/* Recent Sightings */}
      <section>
        <h3
          className="text-xs font-semibold uppercase tracking-wide mb-3"
          style={{ color: "var(--text-secondary)" }}
        >
          Recent Sightings
        </h3>

        <div className="space-y-2">
          {recentSightings.map((bird) => (
            <div
              key={bird.id}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:brightness-95"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <img src={bird.image} alt={bird.name} className="w-7 h-7 rounded-md object-cover shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                  {bird.name}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                  {bird.location} · {bird.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-2">
          <a
            href="/sightings"
            className="flex items-center gap-1 text-xs font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            See more <FaArrowRight size={10} />
          </a>
        </div>
      </section>

      {/* Recent Trips */}
      <section>
        <h3
          className="text-xs font-semibold uppercase tracking-wide mb-3"
          style={{ color: "var(--text-secondary)" }}
        >
          Recent Trips
        </h3>

        <div className="space-y-2">
          {recentTrips.map((trip) => (
            <div
              key={trip.id}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:brightness-95"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <img src={trip.image} alt={trip.name} className="w-7 h-7 rounded-md object-cover shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                  {trip.name}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                  {trip.meta}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-2">
          <a
            href="/trips"
            className="flex items-center gap-1 text-xs font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            See more <FaArrowRight size={10} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default DefaultSidebar;