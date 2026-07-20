import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import backgroundimg from "../assets/backgroundimg.jpg";
import backgroundimg2 from "../assets/backgroundimg2.jpg";
import backgroundimg3 from "../assets/backgroundimg3.jpg";
import backgroundimg4 from "../assets/backgroundimg4.jpg";
import birdlogo from "../assets/birdlogo.png";
import birdlogo2 from "../assets/birdlogo2.png";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getAllBirdPhotos } from "../utils/api";

const infoCards = [
  { id: 1, title: "Discover Birds", description: "Explore a comprehensive database of bird species in Sri Lanka." },
  { id: 2, title: "Join the Community", description: "Connect with fellow bird enthusiasts and share your sightings." },
  { id: 3, title: "Track your sightings", description: "Log and manage your birdwatching activities with ease." },
];

const articles = [
  { id: 1, title: "The Rise of Birdwatching in Sri Lanka", author: "Jane Doe", excerpt: "Birdwatching has become one of the fastest-growing hobbies, bringing people closer to nature..." },
  { id: 2, title: "Top 10 Migratory Birds You Can See This Season", author: "John Smith", excerpt: "Every year, thousands of migratory birds pass through Sri Lanka. Here are the top 10 to spot..." },
  { id: 3, title: "Why Protecting Wetlands Matters", author: "Amal Perera", excerpt: "Wetlands are home to countless bird species and play a vital role in biodiversity..." },
];

const heroImages = [
  { src: backgroundimg, rotation: "-12deg", zIndex: 4, top: "15%", left: "10%" },
  { src: backgroundimg2, rotation: "8deg", zIndex: 3, top: "35%", left: "25%" },
  { src: backgroundimg3, rotation: "-5deg", zIndex: 2, top: "20%", left: "45%" },
  { src: backgroundimg4, rotation: "15deg", zIndex: 1, top: "50%", left: "15%" },
];

const Home = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  const [isDark, setIsDark] = useState(document.documentElement.getAttribute('data-theme') === 'dark');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowNavbar(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll(".opacity-0.translate-y-10");
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-10");
            entry.target.classList.add("opacity-100", "translate-y-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  // Fetch recent photos
  useEffect(() => {
    const fetchRecentPhotos = async () => {
      setGalleryLoading(true);
      try {
        const photos = await getAllBirdPhotos();
        // Sort by date (newest first) and take the first 10
        const sortedPhotos = photos
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || a.date || 0);
            const dateB = new Date(b.createdAt || b.date || 0);
            return dateB - dateA;
          })
          .slice(0, 10);
        setRecentPhotos(sortedPhotos);
      } catch (err) {
        console.error("Failed to fetch recent photos:", err);
        setRecentPhotos([]);
      } finally {
        setGalleryLoading(false);
      }
    };

    fetchRecentPhotos();
  }, []);

  const handleImageClick = (index) => {
    setActiveImageIndex(activeImageIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>

      {/* Navbar */}
      {showNavbar && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-screen flex">
        <div className="w-2/5 h-full flex items-center justify-center px-10 -mt-2">
          <div className="max-w-lg">
            <div className="flex items-center gap-3">
              <h1 className="text-xl mb-7 md:text-[5rem] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                Kurullo
              </h1>
              <img src={isDark ? birdlogo2 : birdlogo} className="h-12 -ml-10 -mt-25" alt="Kurullo logo" />
            </div>
            <p className="mb-15 md:text-[16px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Join a vibrant community of bird enthusiasts. Share your sightings, learn from others, and contribute to bird conservation.
            </p>

            <div className="flex flex-col md:flex-row justify-start gap-4 mb-8">
              <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="transform hover:scale-105 transition-transform">
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-12" />
              </a>
              <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="transform hover:scale-105 transition-transform">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-12" />
              </a>
            </div>

            <Link
              to="/login"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
              className="inline-block px-8 py-4 w-80 text-center rounded-full font-semibold tracking-wide transition-all duration-300 transform hover:-translate-y-1 hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Right half - hero images */}
        <div className="w-3/5 h-full relative overflow-visible -mt-6" style={{ backgroundColor: "var(--bg-primary)" }}>
          {heroImages.map((image, index) => {
            let zIndexValue = image.zIndex;
            if (activeImageIndex === index) zIndexValue = 999;
            else if (activeImageIndex !== null) zIndexValue = 1;

            return (
              <div
                key={index}
                className="absolute cursor-pointer transition-all duration-500 group"
                style={{ top: image.top, left: image.left, transform: `rotate(${image.rotation})`, zIndex: zIndexValue }}
                onClick={() => handleImageClick(index)}
              >
                <div
                  className="overflow-hidden transition-all duration-500 group-hover:rotate-0 group-hover:scale-120 group-hover:z-[999]"
                  style={{ width: "350px", height: "250px", border: "1px solid var(--border)" }}
                >
                  <img src={image.src} alt="Bird" className="w-full h-full object-cover transition-transform duration-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Cards */}
      <section className="py-20 px-6 mt-10 md:px-12" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="grid gap-8 md:grid-cols-3">
          {infoCards.map((card) => (
            <div
              key={card.id}
              className="p-6 rounded hover:shadow-md hover:-translate-y-1 transition text-center opacity-0 translate-y-10 duration-700 ease-out will-change-transform"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--accent)" }}>{card.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="py-20 px-6 md:px-12" style={{ backgroundColor: "var(--bg-primary)" }}>
        <h2 className="text-3xl font-bold mb-10 text-center tracking-wide" style={{ color: "var(--accent)" }}>
          Latest Articles
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{article.title}</h3>
              <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>By {article.author}</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{article.excerpt}</p>
              <button className="mt-4 text-sm font-medium hover:underline" style={{ color: "var(--accent)" }}>
                Read more →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery - Recent Bird Photos */}
      <section className="py-20 px-6 md:px-12" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold tracking-wide" style={{ color: "var(--text-primary)" }}>
            Explore Bird Gallery
          </h2>
          <Link
            to="/birdlist"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            View all birds →
          </Link>
        </div>
        
        {galleryLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-t-[#506142] border-gray-200 rounded-full animate-spin"></div>
          </div>
        ) : recentPhotos.length === 0 ? (
          <div className="text-center py-12" style={{ color: "var(--text-secondary)" }}>
            <p>No photos available yet. Be the first to upload!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recentPhotos.map((photo, idx) => (
              <div 
                key={photo.id || idx} 
                className="overflow-hidden transition transform hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: "var(--bg-card)" }}
              >
                <img 
                  src={photo.imageUrl} 
                  alt={`Bird photo ${idx + 1}`} 
                  className="object-cover w-full aspect-square"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%25" height="100%25" viewBox="0 0 100%25 100%25"%3E%3Crect width="100%25" height="100%25" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="20" font-family="sans-serif"%3E📸%3C/text%3E%3C/svg%3E';
                  }}
                />
                {photo.birdName && (
                  <p className="text-xs text-center py-1 truncate px-1" style={{ color: "var(--text-secondary)" }}>
                    {photo.birdName}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Home;