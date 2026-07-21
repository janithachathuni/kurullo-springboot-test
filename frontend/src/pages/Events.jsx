import React, { useState } from 'react'
import { 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiUsers, 
  FiSearch,
  FiUserPlus
} from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Events = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Spring Migration Bird Count",
      date: "April 15, 2026",
      time: "6:00 AM - 12:00 PM",
      location: "Central Park Nature Reserve",
      description: "Join us for the annual spring migration count. Spot over 100 species of migratory birds.",
      image: "https://picsum.photos/seed/birdcount/800/400",
      category: "Counting",
      spots: 25,
      registered: 18
    },
    {
      id: 2,
      title: "Bird Photography Workshop",
      date: "April 22, 2026",
      time: "7:00 AM - 10:00 AM",
      location: "Riverside Wetlands",
      description: "Learn tips and techniques for capturing stunning bird photographs. All skill levels welcome.",
      image: "https://picsum.photos/seed/photography/800/400",
      category: "Workshop",
      spots: 15,
      registered: 12
    },
    {
      id: 3,
      title: "Raptor Watching Expedition",
      date: "May 5, 2026",
      time: "8:00 AM - 2:00 PM",
      location: "Mountain Ridge Trail",
      description: "Experience the thrill of watching eagles, hawks, and falcons in their natural habitat.",
      image: "https://picsum.photos/seed/raptor/800/400",
      category: "Expedition",
      spots: 20,
      registered: 8
    },
    {
      id: 4,
      title: "Family Birdwatching Day",
      date: "May 12, 2026",
      time: "9:00 AM - 1:00 PM",
      location: "Community Park Lake",
      description: "A fun-filled day for families to learn about birds through games, activities, and guided walks.",
      image: "https://picsum.photos/seed/familybirds/800/400",
      category: "Family",
      spots: 30,
      registered: 22
    },
    {
      id: 5,
      title: "Night Bird Listening Session",
      date: "May 20, 2026",
      time: "8:00 PM - 11:00 PM",
      location: "Dark Sky Forest Reserve",
      description: "Experience the magic of nocturnal birds through sound identification and guided listening.",
      image: "https://picsum.photos/seed/nightbirds/800/400",
      category: "Listening",
      spots: 15,
      registered: 6
    },
    {
      id: 6,
      title: "Coastal Seabird Survey",
      date: "June 2, 2026",
      time: "5:30 AM - 10:30 AM",
      location: "Ocean Bay Cliffs",
      description: "Help us monitor seabird populations along the coast. Includes training and equipment.",
      image: "https://picsum.photos/seed/seabirds/800/400",
      category: "Survey",
      spots: 12,
      registered: 10
    }
  ])

  const [filter, setFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['All', ...new Set(events.map(event => event.category))]

  const filteredEvents = events.filter(event => {
    const matchesCategory = filter === 'All' || event.category === filter
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const getSpotAvailability = (spots, registered) => {
    const available = spots - registered
    if (available === 0) return 'Full'
    if (available <= 5) return 'Almost Full'
    return `${available} spots left`
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "var(--accent)" }}>
            Events
          </h1>
          <p className="text-lg opacity-75" style={{ color: "var(--text-secondary)" }}>
            Discover upcoming birdwatching events and activities in your area
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <FiSearch 
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
              style={{ color: "var(--text-secondary)" }}
              size={18}
            />
            <input
              type="text"
              placeholder="Search events by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded-xl border focus:outline-none focus:ring-2 transition"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
                color: "var(--text-primary)"
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                style={{
                  backgroundColor: filter === category ? "var(--accent)" : "var(--bg-card)",
                  color: filter === category ? "var(--accent-text)" : "var(--text-secondary)",
                  border: filter === category ? "none" : "1px solid var(--border)"
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg opacity-60" style={{ color: "var(--text-secondary)" }}>
              No events found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border)"
                }}
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: "var(--accent)",
                        color: "var(--accent-text)"
                      }}
                    >
                      {event.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.6)",
                        color: "white"
                      }}
                    >
                      {getSpotAvailability(event.spots, event.registered)}
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 line-clamp-1" style={{ color: "var(--text-primary)" }}>
                    {event.title}
                  </h3>
                  <p className="text-sm opacity-70 mb-3 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <FiCalendar className="w-4 h-4 flex-shrink-0" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <FiClock className="w-4 h-4 flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <FiMapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                    <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      <FiUsers className="inline mr-1.5 w-4 h-4" />
                      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                        {event.registered}
                      </span>
                      /{event.spots} registered
                    </div>
                    <button
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 hover:shadow-lg flex items-center gap-2"
                      style={{
                        backgroundColor: "var(--accent)",
                        color: "var(--accent-text)"
                      }}
                    >
                      <FiUserPlus className="w-4 h-4" />
                      {event.registered === event.spots ? 'Waitlist' : 'Register'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Events Count */}
        <div className="mt-8 text-center">
          <p className="text-sm opacity-60" style={{ color: "var(--text-secondary)" }}>
            Showing {filteredEvents.length} upcoming events
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Events