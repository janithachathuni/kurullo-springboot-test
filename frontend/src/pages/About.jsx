import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const About = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Navbar />
      <div className="flex-1 p-10">
        About page with information about the application and its purpose.
      </div>
      <Footer />
    </div>
  )
}

export default About