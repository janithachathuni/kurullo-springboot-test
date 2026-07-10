import React, { useState, useMemo, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BirderSidebar from '../components/Sidebar'
import BirderRightSidebar from '../components/SidebarRight'
import { getBirds } from '../utils/api'
import { useNavigate } from 'react-router-dom'

const BirdList = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "ADMIN";
  const isLoggedIn = !!user && !isAdmin;
  const navigate = useNavigate();

  const [birdsData, setBirdsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [orderFilter, setOrderFilter] = useState("");
  const [familyFilter, setFamilyFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await getBirds();
        setBirdsData(data);
      } catch (err) {
        console.error("Failed to load birds", err);
        setError("Failed to load birds. Please try again.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const uniqueOrders = useMemo(
    () => [...new Set(birdsData.map((b) => b.order))].sort(),
    [birdsData]
  );

  const uniqueFamilies = useMemo(() => {
    const source = orderFilter
      ? birdsData.filter((b) => b.order === orderFilter)
      : birdsData;
    return [...new Set(source.map((b) => b.family))].sort();
  }, [orderFilter, birdsData]);

  const handleOrderChange = (value) => {
    setOrderFilter(value);
    setFamilyFilter("");
  };

  // Builds one lowercased haystack per bird from every searchable name field
  const buildSearchHaystack = (bird) => {
    const parts = [
      bird.primaryName,
      bird.scientificName,
      bird.sinhalaName,
      bird.tamilName,
      ...(Array.isArray(bird.otherNames) ? bird.otherNames : []),
    ];
    return parts
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  };

  const filteredBirds = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return birdsData
      .filter((b) => (orderFilter ? b.order === orderFilter : true))
      .filter((b) => (familyFilter ? b.family === familyFilter : true))
      .filter((b) => (term ? buildSearchHaystack(b).includes(term) : true))
      .sort((a, b) => {
        if (a.order !== b.order) return (a.order || "").localeCompare(b.order || "");
        if (a.family !== b.family) return (a.family || "").localeCompare(b.family || "");
        return (a.primaryName || "").localeCompare(b.primaryName || "");
      });
  }, [orderFilter, familyFilter, searchTerm, birdsData]);

  const groupedBirds = useMemo(() => {
    const groups = [];
    let currentOrder = null;
    let currentFamily = null;
    let currentFamilyGroup = null;
    let currentOrderGroup = null;

    filteredBirds.forEach((bird) => {
      if (bird.order !== currentOrder) {
        currentOrder = bird.order;
        currentFamily = null;
        currentOrderGroup = { order: bird.order, families: [] };
        groups.push(currentOrderGroup);
      }
      if (bird.family !== currentFamily) {
        currentFamily = bird.family;
        currentFamilyGroup = { family: bird.family, birds: [] };
        currentOrderGroup.families.push(currentFamilyGroup);
      }
      currentFamilyGroup.birds.push(bird);
    });

    return groups;
  }, [filteredBirds]);

  const FiltersAndList = (
    <>
      <div className="p-4 w-full rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Birds of Sri Lanka
        </h1>

        {/* Filters */}
        <div className="flex flex-col gap-3 mt-4 mb-6">
          <div className="flex gap-4">
            <select
              value={orderFilter}
              onChange={(e) => handleOrderChange(e.target.value)}
              className="flex-1 px-3 py-2 rounded border text-sm"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)", color: "var(--text-primary)" }}
            >
              <option value="">All Orders</option>
              {uniqueOrders.map((order) => (
                <option key={order} value={order}>{order}</option>
              ))}
            </select>

            <select
              value={familyFilter}
              onChange={(e) => setFamilyFilter(e.target.value)}
              className="flex-1 px-3 py-2 rounded border text-sm"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)", color: "var(--text-primary)" }}
            >
              <option value="">All Families</option>
              {uniqueFamilies.map((family) => (
                <option key={family} value={family}>{family}</option>
              ))}
            </select>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, other names, Sinhala, or Tamil..."
            className="w-full px-3 py-2 rounded border text-sm"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)", color: "var(--text-primary)" }}
          />
        </div>

        {/* Loading / error states */}
        {isLoading && (
          <p className="text-sm opacity-70" style={{ color: "var(--text-secondary)" }}>
            Loading birds...
          </p>
        )}

        {!isLoading && error && (
          <p className="text-sm" style={{ color: "#dc2626" }}>
            {error}
          </p>
        )}

        {/* Grouped bird list */}
        {!isLoading && !error && groupedBirds.length === 0 && (
          <p className="text-sm opacity-70" style={{ color: "var(--text-secondary)" }}>No birds match your filters.</p>
        )}

        {!isLoading && !error && groupedBirds.map((orderGroup) => (
          <div key={orderGroup.order} className="mb-6">
            <h2
              className="text-xl font-bold mb-1 pb-1 border-b"
              style={{ color: "var(--accent)", borderColor: "var(--border)" }}
            >
              {orderGroup.order}
            </h2>

            {orderGroup.families.map((familyGroup) => (
              <div key={familyGroup.family} className="mt-4 mb-2">
                <h3
                  className="text-sm font-semibold italic mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {familyGroup.family}
                </h3>

                <ul className="space-y-3">
                  {familyGroup.birds.map((bird) => (
                    <li
                      key={bird.id}
                      onClick={() => navigate(`/bird/${bird.id}`)}
                      className="p-4 rounded border flex items-start gap-4"
                      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}
                    >
                      {/* Square Thumbnail */}
                      <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden bg-gray-200">
                        <img
                          src={bird.image}
                          alt={bird.primaryName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="10" font-family="sans-serif"%3E🦅%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>

                      {/* Bird Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                          {bird.primaryName}{" "}
                          <span className="italic font-normal text-sm" style={{ color: "var(--text-secondary)" }}>
                            {bird.scientificName}
                          </span>
                        </p>
                        {(bird.sinhalaName || bird.tamilName) && (
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                            {[bird.sinhalaName, bird.tamilName].filter(Boolean).join(" · ")}
                          </p>
                        )}
                        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                          {bird.habitat}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );

  // Logged out: Navbar + Footer, centered column layout
  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        <Navbar />
        <div className="flex-1 p-4 ml-0 md:ml-16 lg:ml-[20%] pb-20 md:pb-4">
          {FiltersAndList}
        </div>
        <Footer />
      </div>
    );
  }

  // Logged in (birder): left sidebar + right sidebar, no Navbar/Footer
  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <BirderSidebar />
      <div className="flex-1 p-4 ml-0 md:ml-16 lg:ml-[20%] pb-20 md:pb-4">
        {FiltersAndList}
      </div>
      <BirderRightSidebar />
    </div>
  );
};

export default BirdList;