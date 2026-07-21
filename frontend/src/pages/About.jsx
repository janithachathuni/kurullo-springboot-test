import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const About = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-3xl font-bold mb-4 leading-tight" 
              style={{ color: "var(--accent)" }}>
            The story behind Kurullo
          </h1>
        </div>

        {/* Featured Image */}
        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-12 shadow-xl">
          <img 
            src="https://picsum.photos/seed/about/1200/600" 
            alt="About us featured image" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12" 
             style={{ 
               color: "var(--text-primary)",
               '--tw-prose-body': 'var(--text-primary)',
               '--tw-prose-headings': 'var(--accent)',
             }}>

          <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {/* When I was a young girl, a small fry of just 8 years old, my parents took my entire family to a trip to the
             national parks of Bundala and Yala. My memory of that trip is nothing but tiny fractals - a Crested Serpent Eagle
             perched on the Electricity meter at the ticketing office, a journey to a leopard sighting which turned out to 
             be false (we saw no leopards on that trip), a stay at a hotel near tissa wewa. 
             Since then, we've travelled around the country every single year, and I began 
             the now long-practiced habit of marking down each bird I saw on these trips.  */}
          </p>
          <p className="leading-relaxed mt-4" style={{ color: "var(--text-secondary)" }}>
            {/* I took to marking the birds I saw on pieces of A4 paper, folded up zigzag to look like a brochure.
            Time passed, and I grew with it, and so did my collection of checklists. In May 2023, I got selected 
            to study Computer Science at the University of Colombo School of Computing, and this idea grew: what 
            if I make an app which took all my checklists online? */}
          </p>

          <p className="leading-relaxed mt-4" style={{ color: "var(--text-secondary)" }}>
            {/* In my head, I call it the Sri Lankan eBird. It's a part educational, part social app where you can
            track the birds you see, the places you go, discuss your sightings with people, and share your photos.
            Our aim is to get more people aware of the wildlife that surrounds us, and to celebrate and protect it.  */}
          </p>

          <p className="leading-relaxed mt-4" style={{ color: "var(--text-secondary)" }}>
            
          </p>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="rounded-2xl overflow-hidden mb-4 shadow-lg">
              <img 
                src="https://picsum.photos/seed/vision/600/400" 
                alt="Our vision" 
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--accent)" }}>
              Our Vision
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco.
            </p>
          </div>
          <div>
            <div className="rounded-2xl overflow-hidden mb-4 shadow-lg">
              <img 
                src="https://picsum.photos/seed/values/600/400" 
                alt="Our values" 
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--accent)" }}>
              Our Values
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
              Excepteur sint occaecat cupidatat non proident, sunt in culpa.
            </p>
          </div>
        </div>



 

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 p-8 rounded-2xl"
             style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {[
            { number: "10K+", label: "Users" },
            { number: "500+", label: "Projects" },
            { number: "24/7", label: "Support" },
            { number: "4.9★", label: "Rating" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold" style={{ color: "var(--accent)" }}>
                {stat.number}
              </div>
              <div className="text-sm opacity-60" style={{ color: "var(--text-secondary)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Closing Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--accent)" }}>
            Join Our Journey
          </h2>
          <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default About