import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";
import { getBirds, getMyTrips, getMyChecklists } from "../../utils/api";

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

const DefaultSidebar = () => {
  const [query, setQuery] = useState("");
  const [allBirds, setAllBirds] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [recentTrips, setRecentTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(true);
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

  // Fetch trips + checklists, then aggregate species counts per trip.
  // A trip can have many checklists, so a trip's total species count is the
  // sum of speciesCount across every checklist whose tripId matches it —
  // checklists don't carry a trip-level total on their own.
  useEffect(() => {
    (async () => {
      try {
        setTripsLoading(true);
        const [tripsData, checklistsData] = await Promise.all([
          getMyTrips(),
          getMyChecklists(),
        ]);

        const speciesByTrip = (checklistsData || []).reduce((acc, cl) => {
          if (!cl.tripId) return acc;
          acc[cl.tripId] = (acc[cl.tripId] || 0) + (cl.speciesCount || 0);
          return acc;
        }, {});

        const enrichedTrips = (tripsData || [])
          .map((trip) => ({
            ...trip,
            speciesCount: speciesByTrip[trip.id] || 0,
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);

        setRecentTrips(enrichedTrips);
      } catch (err) {
        console.error("Failed to load recent trips", err);
        setRecentTrips([]);
      } finally {
        setTripsLoading(false);
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
          {tripsLoading ? (
            <p className="text-xs p-2" style={{ color: "var(--text-secondary)" }}>
              Loading trips...
            </p>
          ) : recentTrips.length > 0 ? (
            recentTrips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:brightness-95"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                {/* Trips have no stored image — use a placeholder icon instead */}
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                  <FaMapMarkerAlt className="text-xs" style={{ color: "var(--text-secondary)" }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {trip.title}
                  </p>
                  <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                    {trip.speciesCount} {trip.speciesCount === 1 ? "species" : "species"} logged
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs p-2" style={{ color: "var(--text-secondary)" }}>
              No trips logged yet
            </p>
          )}
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