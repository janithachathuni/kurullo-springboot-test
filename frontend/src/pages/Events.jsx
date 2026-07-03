import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Events = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Navbar />
      <div className="flex-1 p-10">
        Events page with information about upcoming birdwatching events and activities.
      </div>
      <Footer />
    </div>
  )
}

export default Events