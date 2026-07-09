import React, { useState } from "react";
import { FaSearch, FaArrowRight } from "react-icons/fa";

const RightSidebar = () => {
  const [query, setQuery] = useState("");

  // Sample data — replace with real API data (species sightings, trip logs)
  const recentSightings = [
    {
      id: 1,
      name: "Sri Lanka Blue Magpie",
      location: "Sinharaja Forest",
      time: "2h ago",
      image:
        "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Indian Pitta",
      location: "Bundala National Park",
      time: "5h ago",
      image:
        "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "Ceylon Grey Hornbill",
      location: "Kitulgala",
      time: "1d ago",
      image:
        "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=100&h=100&fit=crop",
    },
    // {
    //   id: 4,
    //   name: "Malabar Trogon",
    //   location: "Sinharaja Forest",
    //   time: "2d ago",
    //   image:
    //     "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=100&h=100&fit=crop",
    // },
  ];

  const recentTrips = [
    {
      id: 1,
      name: "Sinharaja Rainforest Trail",
      meta: "12 species logged",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Bundala Wetlands",
      meta: "8 species logged",
      image:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=100&h=100&fit=crop",
    },
    // {
    //   id: 3,
    //   name: "Horton Plains",
    //   meta: "6 species logged",
    //   image:
    //     "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=100&h=100&fit=crop",
    // },
  ];

  return (
    <div
      className="hidden lg:flex flex-col sticky top-0 h-screen shrink-0 w-[30%]"
      style={{ backgroundColor: "var(--bg-card)", borderLeft: "1px solid var(--border)" }}
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Search bar */}
        <div className="relative">
          <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: "var(--text-secondary)" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search birds"
            className="w-full py-2.5 pl-10 pr-4 rounded-full text-sm outline-none transition-shadow focus:ring-2"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          />
        </div>

        {/* Recent Sightings */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--text-secondary)" }}
            >
              Recent Sightings
            </h3>
          </div>

          <div className="space-y-2">
            {recentSightings.map((bird) => (
              <div
                key={bird.id}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:brightness-95"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <img
                  src={bird.image}
                  alt={bird.name}
                  className="w-7 h-7 rounded-md object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
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
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--text-secondary)" }}
            >
              Recent Trips
            </h3>
          </div>

          <div className="space-y-2">
            {recentTrips.map((trip) => (
              <div
                key={trip.id}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:brightness-95"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <img
                  src={trip.image}
                  alt={trip.name}
                  className="w-7 h-7 rounded-md object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
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

      <div className="p-4" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          © 2025 Kurullo
        </p>
      </div>
    </div>
  );
};

export default RightSidebar;