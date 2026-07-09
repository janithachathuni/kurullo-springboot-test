import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BirderSidebar from '../components/Sidebar'
import BirderRightSidebar from '../components/SidebarRight'
import { useParams, useNavigate } from 'react-router-dom'
import { FaMapMarkerAlt, FaInfoCircle, FaGlobe, FaStickyNote, FaImages } from 'react-icons/fa'

const sampleBird = {
  id: 1,
  primaryName: "Sri Lanka Junglefowl",
  otherNames: ["Ceylon Junglefowl", "Sri Lankan Junglefowl"],
  scientificName: "Gallus lafayettii",
  order: "Galliformes",
  family: "Phasianidae",
  description: "The Sri Lanka Junglefowl is a member of the Galliformes bird order which is endemic to Sri Lanka. It is a colourful bird with a distinctive crest, bright orange and yellow body plumage, and a greenish-blue tail. The male has a prominent comb and wattles, while the female is smaller with more subdued colors. This bird is known for its loud, crowing call, which is often heard in the early morning and evening. It is commonly found in forests, scrublands, and cultivated areas across the island.",
  sinhalaName: "වළි කුකුළා",
  tamilName: "இலங்கை காட்டுக்கோழி",
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Flickr_-_Rainbirder_-_Ceylon_Junglefowl_%28Gallus_lafayetii%29_Male.jpg/500px-Flickr_-_Rainbirder_-_Ceylon_Junglefowl_%28Gallus_lafayetii%29_Male.jpg",
  habitatMap: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Sri_Lanka_location_map.svg/1200px-Sri_Lanka_location_map.svg.png",
  frequency: "Common",
  residency: "Resident",
  endemic: true,
  places: ["Sinharaja Forest", "Kandy", "Horton Plains", "Yala National Park"],
  habitat: "Forests, scrublands, cultivated areas",
  notes: "This species is the national bird of Sri Lanka. It is closely related to the Red Junglefowl but has distinct plumage characteristics. The male's call is particularly distinctive and can be heard throughout the day."
}

const Bird = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "null")
  const isAdmin = user?.role === "ADMIN"
  const isLoggedIn = !!user && !isAdmin

  const [bird, setBird] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setBird(sampleBird)
      setLoading(false)
    }, 500)
  }, [id])

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

    if (!bird) {
      return (
        <div className="text-center py-12">
          <p style={{ color: "var(--text-secondary)" }}>Bird not found</p>
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

    // Mock gallery images
    const galleryImages = Array.from({ length: 9 }, (_, i) => `https://picsum.photos/seed/bird${bird.id}${i}/400/400`)

    return (
      <div
        className="w-full rounded-lg"
        style={{
          ...(isBirder ? {} : { marginRight: "30%", maxWidth: "70%" })
        }}
      >
        <div
          className="rounded-lg overflow-hidden border-t border-b "
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
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>{bird.residency}</p>
              </div>
              <div>
                <p className="text-sm font-semibold opacity-70" style={{ color: "var(--text-secondary)" }}>Frequency</p>
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>{bird.frequency}</p>
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
          {bird.places && bird.places.length > 0 && (
            <>
              <div className="border-t" style={{ borderColor: "var(--border)" }}></div>
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                  <FaMapMarkerAlt /> Known Locations
                </h3>
                <p style={{ color: "var(--text-primary)" }}>
                  {bird.places.join(", ")}
                </p>
              </div>
            </>
          )}

          <div className="border-t" style={{ borderColor: "var(--border)" }}></div>

          {/* Description */}
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <FaInfoCircle /> Description
            </h3>
            <p className="leading-relaxed" style={{ color: "var(--text-primary)" }}>
              {bird.description}
            </p>
          </div>

          {/* Notes */}
          {bird.notes && (
            <>
              <div className="border-t" style={{ borderColor: "var(--border)" }}></div>
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                  <FaStickyNote /> Notes
                </h3>
                <p className="leading-relaxed" style={{ color: "var(--text-primary)" }}>
                  {bird.notes}
                </p>
              </div>
            </>
          )}

          <div className="border-t" style={{ borderColor: "var(--border)" }}></div>

          {/* Gallery */}
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
              <FaImages /> Gallery
            </h3>
            <div className="grid grid-cols-3 gap-1">
              {galleryImages.map((src, index) => (
                <div key={index} className="w-full aspect-square overflow-hidden bg-gray-200">
                  <img
                    src={src}
                    alt={`${bird.primaryName} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%25" height="100%25" viewBox="0 0 100%25 100%25"%3E%3Crect width="100%25" height="100%25" fill="%23e5e7eb"/%3E%3C/svg%3E'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t" style={{ borderColor: "var(--border)" }}></div>

          {/* Actions */}
          <div className="p-4 flex gap-4">
            <button
              onClick={() => navigate('/birdlist')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
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