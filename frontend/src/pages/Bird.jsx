import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BirderSidebar from '../components/Sidebar'
import BirderRightSidebar from '../components/SidebarRight'
import { useParams, useNavigate } from 'react-router-dom'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { getBirdById, getBirdPhotos } from '../utils/api'

// Backend enums come back as raw names like "VERY_COMMON" / "RESIDENT" —
// convert to display-friendly text, e.g. "Very Common".
const formatEnumLabel = (value) => {
  if (!value) return ""
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

const Bird = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "null")
  const isAdmin = user?.role === "ADMIN"
  const isLoggedIn = !!user && !isAdmin

  const [bird, setBird] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [galleryFilter, setGalleryFilter] = useState("featured") // "featured" or "all"
  const [galleryImages, setGalleryImages] = useState([])
  const [galleryLoading, setGalleryLoading] = useState(true)

  // Fetch bird details
  useEffect(() => {
    let isCancelled = false

    const fetchBird = async () => {
      setLoading(true)
      setError("")
      try {
        const data = await getBirdById(id)
        console.log("Bird data:", data)
        if (!isCancelled) {
          setBird(data)
        }
      } catch (err) {
        console.error("Failed to fetch bird", err)
        if (!isCancelled) {
          setError("Failed to load bird details.")
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchBird()

    return () => {
      isCancelled = true
    }
  }, [id])

  // Fetch gallery photos
  useEffect(() => {
    let isCancelled = false

    const fetchGallery = async () => {
      setGalleryLoading(true)
      try {
        const photos = await getBirdPhotos(id, galleryFilter === "featured")
        if (!isCancelled) {
          setGalleryImages(photos)
        }
      } catch (err) {
        console.error("Failed to fetch bird gallery", err)
        if (!isCancelled) {
          setGalleryImages([])
        }
      } finally {
        if (!isCancelled) {
          setGalleryLoading(false)
        }
      }
    }

    fetchGallery()

    return () => {
      isCancelled = true
    }
  }, [id, galleryFilter])

  const BirdDetailContent = ({ isBirder }) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-[#506142] border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p style={{ color: "var(--text-secondary)" }}>Loading bird details...</p>
          </div>
        </div>
      )
    }

    if (error || !bird) {
      return (
        <div className="text-center py-12">
          <p style={{ color: "var(--text-secondary)" }}>{error || "Bird not found"}</p>
          <button
            onClick={() => navigate('/birdlist')}
            className="mt-4 px-6 py-2 bg-[#506142] text-white rounded-lg hover:bg-[#3f4d34] transition-all"
          >
            Back to Birds
          </button>
        </div>
      )
    }

    const allNames = [
      bird.scientificName,
      ...(bird.otherNames || []),
      bird.sinhalaName,
      bird.tamilName
    ].filter(name => name && name.trim() !== "")

    // Places comes back from the API as a comma-separated string, not an array
    const placesList = bird.places
      ? bird.places.split(",").map((p) => p.trim()).filter(Boolean)
      : []

    // Notes comes back from the API as an array already
    const notesList = Array.isArray(bird.notes)
      ? bird.notes.filter((note) => note && note.trim() !== "")
      : []

    // Get the habitat map URL - handle both possible field names
    const habitatMapUrl = bird.habitat_map_url || bird.habitatMap || bird.habitatMapUrl || null

    return (
      <div
        className="w-full"
        style={{
          ...(isBirder ? {} : { marginRight: "30%", maxWidth: "70%" })
        }}
      >
        <div
          className="overflow-hidden border-t border-b "
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          {/* Name Section */}
          <div className="p-4">
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {bird.primaryName}
            </h1>
            <div className="mt-2">
              <p className="text-sm italic" style={{ color: "var(--text-secondary)" }}>
                {bird.scientificName}
              </p>
              {allNames.length > 1 && (
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                  {allNames.slice(1).join(", ")}
                </p>
              )}
            </div>
          </div>

          <div className="border-t" style={{ borderColor: "var(--border)" }}></div>

          {/* Image */}
          <div className="w-full p-4">
            <img
              src={bird.image}
              alt={bird.primaryName}
              className="w-full h-auto block rounded-md"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%25" height="400" viewBox="0 0 100%25 400"%3E%3Crect width="100%25" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="24" font-family="sans-serif"%3E🦅%3C/text%3E%3C/svg%3E'
              }}
            />
          </div>

          <div className="border-t" style={{ borderColor: "var(--border)" }}></div>

          {/* Order / Family / Residency / Frequency / Endemic - all same plain style */}
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-semibold opacity-70" style={{ color: "var(--text-secondary)" }}>Order</p>
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>{bird.order}</p>
              </div>
              <div>
                <p className="text-sm font-semibold opacity-70" style={{ color: "var(--text-secondary)" }}>Family</p>
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>{bird.family}</p>
              </div>
              <div>
                <p className="text-sm font-semibold opacity-70" style={{ color: "var(--text-secondary)" }}>Residency</p>
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>{formatEnumLabel(bird.residency)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold opacity-70" style={{ color: "var(--text-secondary)" }}>Frequency</p>
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>{formatEnumLabel(bird.frequency)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold opacity-70" style={{ color: "var(--text-secondary)" }}>Status</p>
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                  {bird.endemic ? "Endemic to Sri Lanka" : "Not endemic"}
                </p>
              </div>
            </div>
          </div>

          {/* Known Locations */}
          {placesList.length > 0 && (
            <>
              <div className="border-t" style={{ borderColor: "var(--border)" }}></div>
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <FaMapMarkerAlt /> Known Locations
                </h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  {placesList.join(", ")}
                </p>
              </div>
            </>
          )}

          {/* Habitat Map Section - 2 columns with 1:5 ratio */}
          {bird.habitat && (
            <>
              <div className="border-t" style={{ borderColor: "var(--border)" }}></div>
              <div className="p-4">
                <div className="grid grid-cols-6 gap-4">
                  {/* Left column - Map (1 part) */}
                  <div className="col-span-1">
                    <div className="w-full aspect-square overflow-hidden rounded-md bg-gray-200">
                      {habitatMapUrl ? (
                        <img
                          src={habitatMapUrl}
                          alt={`${bird.primaryName} habitat map`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%25" height="100%25" viewBox="0 0 100%25 100%25"%3E%3Crect width="100%25" height="100%25" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="20" font-family="sans-serif"%3E🗺️%3C/text%3E%3C/svg%3E'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-4xl">🗺️</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right column - Habitat details (5 parts) */}
                  <div className="col-span-5 flex flex-col justify-center">
                    <div>
                      <p className="text-sm font-semibold " style={{ color: "var(--text-primary)" }}>Habitat</p>
                      <p className="font-medium" style={{ color: "var(--text-secondary)" }}>{bird.habitat}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="border-t" style={{ borderColor: "var(--border)" }}></div>

          {/* Description */}
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              Description
            </h3>
            <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {bird.description}
            </p>
          </div>

          {/* Notes - as a list without icon */}
          {notesList.length > 0 && (
            <>
              <div className="border-t" style={{ borderColor: "var(--border)" }}></div>
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                  Notes
                </h3>
                <ul className="list-disc pl-5 space-y-1" style={{ color: "var(--text-secondary)" }}>
                  {notesList.map((note, index) => (
                    <li key={index} className="leading-relaxed">{note.trim()}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="p-4 flex gap-4">
            <button
                onClick={() => navigate('/birdlist')}
                className="px-6 py-2 rounded-lg transition-all font-medium hover:opacity-90"
                style={{ backgroundColor: "var(--accent)", color: "var(--bg-primary)" }}
              >
                Back to Birds
              </button>
            {isAdmin && (
              <button
                onClick={() => navigate(`/admin/edit-bird/${bird.id}`)}
                className="px-6 py-2 bg-[#506142] text-white rounded-lg hover:bg-[#3f4d34] transition-all font-medium"
              >
                Edit Bird
              </button>
            )}
          </div>

          <div className="border-t" style={{ borderColor: "var(--border)" }}></div>

          {/* Gallery */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                Gallery
              </h1>
              
              {/* Featured/All Toggle */}
              <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                <button
                  onClick={() => setGalleryFilter("featured")}
                  className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                    galleryFilter === "featured" 
                      ? "bg-[#506142] text-white" 
                      : "bg-transparent hover:bg-gray-100"
                  }`}
                  style={{
                    backgroundColor: galleryFilter === "featured" ? "var(--accent)" : "transparent",
                    color: galleryFilter === "featured" ? "var(--accent-text)" : "var(--text-secondary)",
                  }}
                >
                  Featured
                </button>
                <button
                  onClick={() => setGalleryFilter("all")}
                  className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                    galleryFilter === "all" 
                      ? "bg-[#506142] text-white" 
                      : "bg-transparent hover:bg-gray-100"
                  }`}
                  style={{
                    backgroundColor: galleryFilter === "all" ? "var(--accent)" : "transparent",
                    color: galleryFilter === "all" ? "var(--accent-text)" : "var(--text-secondary)",
                    borderLeft: "1px solid var(--border)",
                  }}
                >
                  All
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-1">
              {galleryLoading ? (
                <p style={{ color: "var(--text-secondary)" }} className="col-span-3 text-center py-8">
                  Loading gallery...
                </p>
              ) : galleryImages.length === 0 ? (
                <p style={{ color: "var(--text-secondary)" }} className="col-span-3 text-center py-8">
                  No photos yet.
                </p>
              ) : (
                galleryImages.map((photo) => (
                  <div key={photo.id} className="w-full aspect-square overflow-hidden bg-gray-200">
                    <img
                      src={photo.imageUrl}
                      alt={bird.primaryName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%25" height="100%25" viewBox="0 0 100%25 100%25"%3E%3Crect width="100%25" height="100%25" fill="%23e5e7eb"/%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        <Navbar />
        <div className="flex-1 ml-0 md:ml-16 lg:ml-[20%] pb-20 md:pb-4">
          <BirdDetailContent isBirder={false} />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <BirderSidebar />
      <div className="flex-1 ml-0 md:ml-16 lg:ml-[20%] pb-20 md:pb-4">
        <BirdDetailContent isBirder={true} />
      </div>
      <BirderRightSidebar />
    </div>
  )
}

export default Bird