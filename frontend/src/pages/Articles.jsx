import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Articles = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Navbar />
      <div className="flex-1 p-10">
        Articles page where articles of select users/moderators/admin are displayed for a month or so maybe
      </div>
      <Footer />
    </div>
  )
}

export default Articles