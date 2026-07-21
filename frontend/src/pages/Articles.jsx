import React, { useState } from 'react'
import { 
  FiCalendar, 
  FiEye, 
  FiHeart, 
  FiMessageCircle, 
  FiShare2,
  FiBookmark
} from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Articles = () => {
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "The Secret Life of Urban Sparrows",
      excerpt: "These tiny city dwellers have figured out how to thrive among skyscrapers and traffic. Here's what they've taught us about resilience.",
      author: "Dr. Sarah Wilson",
      authorRole: "Urban Ornithologist",
      authorImage: "https://picsum.photos/seed/sarah/200/200",
      date: "March 15, 2026",
      readTime: "5 min",
      category: "Urban Birds",
      image: "https://picsum.photos/seed/sparrow/800/500",
      views: 1247,
      likes: 89,
      comments: 34,
      isBookmarked: false
    },
    {
      id: 2,
      title: "Following the Flyways",
      excerpt: "Every spring, billions of birds trace ancient paths across continents. Scientists are still unraveling the mysteries of these epic journeys.",
      author: "Prof. Michael Chen",
      authorRole: "Migration Biologist",
      authorImage: "https://picsum.photos/seed/michael/200/200",
      date: "March 12, 2026",
      readTime: "8 min",
      category: "Migration",
      image: "https://picsum.photos/seed/flyway/800/500",
      views: 856,
      likes: 67,
      comments: 23,
      isBookmarked: false
    },
    {
      id: 3,
      title: "A Beginner's Guide to Bird Photography",
      excerpt: "You don't need fancy gear to capture stunning bird photos. Sometimes it's about patience, not pixels.",
      author: "Emma Thompson",
      authorRole: "Wildlife Photographer",
      authorImage: "https://picsum.photos/seed/emma/200/200",
      date: "March 10, 2026",
      readTime: "6 min",
      category: "Photography",
      image: "https://picsum.photos/seed/photo/800/500",
      views: 2341,
      likes: 156,
      comments: 67,
      isBookmarked: true
    },
    {
      id: 4,
      title: "What Climate Change Means for Birds",
      excerpt: "Warming temperatures are shifting habitats faster than many species can adapt. The data is sobering, but there's still hope.",
      author: "Dr. James Rodriguez",
      authorRole: "Conservation Scientist",
      authorImage: "https://picsum.photos/seed/james/200/200",
      date: "March 8, 2026",
      readTime: "10 min",
      category: "Climate",
      image: "https://picsum.photos/seed/climate/800/500",
      views: 3124,
      likes: 234,
      comments: 89,
      isBookmarked: false
    },
    {
      id: 5,
      title: "The Language of Birds",
      excerpt: "Beyond pretty songs, birds communicate warnings, courtship, and even gossip. Scientists are decoding what they're actually saying.",
      author: "Lisa Park",
      authorRole: "Bioacoustics Researcher",
      authorImage: "https://picsum.photos/seed/lisa/200/200",
      date: "March 5, 2026",
      readTime: "7 min",
      category: "Behavior",
      image: "https://picsum.photos/seed/song/800/500",
      views: 967,
      likes: 78,
      comments: 45,
      isBookmarked: false
    },
    {
      id: 6,
      title: "How to Turn Your Backyard Into a Bird Sanctuary",
      excerpt: "Simple changes to your outdoor space can attract everything from finches to owls. You'd be surprised what shows up.",
      author: "Mark Davis",
      authorRole: "Habitat Designer",
      authorImage: "https://picsum.photos/seed/mark/200/200",
      date: "March 3, 2026",
      readTime: "4 min",
      category: "Gardening",
      image: "https://picsum.photos/seed/garden/800/500",
      views: 1876,
      likes: 145,
      comments: 56,
      isBookmarked: false
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleBookmark = (id) => {
    setArticles(articles.map(article => 
      article.id === id ? { ...article, isBookmarked: !article.isBookmarkd } : article
    ))
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Navbar />
      
      <div className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Articles
          </h1>
          <p className="text-base opacity-60" style={{ color: "var(--text-secondary)" }}>
            Stories and insights from our community
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border bg-transparent focus:outline-none focus:ring-1 transition text-sm"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-primary)"
            }}
          />
        </div>

        {/* Articles List */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <p className="opacity-60" style={{ color: "var(--text-secondary)" }}>
              No articles found.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="group cursor-pointer"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="md:w-2/5 lg:w-1/3">
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 md:h-52 object-cover group-hover:scale-105 transition duration-500"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleBookmark(article.id)
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition"
                      >
                        <FiBookmark 
                          className="w-4 h-4 text-white" 
                          fill={article.isBookmarked ? "white" : "none"} 
                        />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs opacity-60 mb-2" style={{ color: "var(--text-secondary)" }}>
                        <span>{article.category}</span>
                        <span>·</span>
                        <span>{article.readTime}</span>
                      </div>

                      <h2 className="text-xl font-semibold mb-2 group-hover:opacity-80 transition" style={{ color: "var(--text-primary)" }}>
                        {article.title}
                      </h2>

                      <p className="text-sm opacity-70 mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {article.excerpt}
                      </p>
                    </div>

                    <div>
                      {/* Author */}
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={article.authorImage}
                          alt={article.author}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {article.author}
                          </div>
                          <div className="text-xs opacity-60" style={{ color: "var(--text-secondary)" }}>
                            {article.authorRole}
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t text-xs" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-3.5 h-3.5" />
                            {formatDate(article.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiEye className="w-3.5 h-3.5" />
                            {article.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiHeart className="w-3.5 h-3.5" />
                            {article.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiMessageCircle className="w-3.5 h-3.5" />
                            {article.comments}
                          </span>
                        </div>
                        <button className="p-1.5 hover:opacity-60 transition">
                          <FiShare2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Articles