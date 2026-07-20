import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { FaArrowLeft, FaTimes, FaStar, FaClock, FaFire, FaEye, FaRegStar } from 'react-icons/fa';
import { getBirdById, getBirdPhotos } from '../../utils/api';

const FeaturedBirds = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bird, setBird] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [viewMode, setViewMode] = useState('recent');
  const [featuredPhotos, setFeaturedPhotos] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);

  // Mock moderator boosted images
  const moderatorBoostedImages = [
    'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400',
    'https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=400',
    'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=400',
    'https://images.unsplash.com/photo-1585145283010-e1f7b403b2a3?w=400',
  ];

  useEffect(() => {
    if (id) {
      fetchBirdDetails(id);
      fetchGallery(id);
    }
  }, [id]);

  useEffect(() => {
    // Only set featured photos if they haven't been set yet
    if (galleryImages.length > 0 && featuredPhotos.length === 0) {
      // For demo, we'll mark some photos as featured (e.g., first 5)
      const demoFeatured = galleryImages.slice(0, 5).map(photo => ({
        ...photo,
        isFeatured: true
      }));
      setFeaturedPhotos(demoFeatured);
    }
  }, [galleryImages]);

  const fetchBirdDetails = async (birdId) => {
    setLoading(true);
    try {
      const data = await getBirdById(birdId);
      setBird(data);
      setIsFeatured(data.isFeatured || false);
    } catch (err) {
      setNotification('Error: Failed to load bird details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchGallery = async (birdId) => {
    setGalleryLoading(true);
    try {
      const photos = await getBirdPhotos(birdId, false);
      setGalleryImages(photos);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
      setGalleryImages([]);
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleToggleFeatured = async () => {
    try {
      setIsFeatured(!isFeatured);
      setNotification(
        isFeatured 
          ? `${bird?.primaryName} removed from featured birds.` 
          : `${bird?.primaryName} set as featured bird successfully!`
      );
    } catch (err) {
      setNotification('Error: Failed to update featured status.');
    }
  };

  const handleGoBack = () => {
    navigate('/admin/bird-data');
  };

  const handleTogglePhotoFeatured = (photoId) => {
    // This is a view-only feature for now
    setNotification('Featured photo management coming soon!');
  };

  const handleEnlargeImage = (imageUrl) => {
    setEnlargedImage(imageUrl);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseEnlarged = () => {
    setEnlargedImage(null);
    document.body.style.overflow = 'auto';
  };

  const getSortedGallery = () => {
    if (viewMode === 'recent') {
      return [...galleryImages].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date || 0);
        const dateB = new Date(b.createdAt || b.date || 0);
        return dateB - dateA;
      });
    } else {
      return [...galleryImages].sort((a, b) => {
        const popA = a.likes || a.popularity || a.views || 0;
        const popB = b.likes || b.popularity || b.views || 0;
        return popB - popA;
      });
    }
  };

  const sortedGallery = getSortedGallery();

  // Check if a photo is featured
  const isPhotoFeatured = (photoId) => {
    return featuredPhotos.some(p => p.id === photoId);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
        <AdminSidebar />
        <div className="flex flex-1 p-4 ml-[20%]">
          <div className="p-4 w-full" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading bird details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bird) {
    return (
      <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
        <AdminSidebar />
        <div className="flex flex-1 p-4 ml-[20%]">
          <div className="p-4 w-full" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Bird not found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <AdminSidebar />
      <div className="flex flex-1 p-4 ml-[20%]">
        <div className="p-4 w-full" style={{ backgroundColor: "var(--bg-secondary)" }}>
          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-4 py-2 mb-6 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all"
          >
            <FaArrowLeft /> Back to Bird List
          </button>

          {/* Notification */}
          {notification && (
            <div
              className={`mb-4 p-4 flex justify-between items-center ${
                notification.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}
            >
              <p className="font-medium">{notification}</p>
              <button
                onClick={() => setNotification(null)}
                className={`transition-colors ${
                  notification.includes('Error') ? 'text-red-700 hover:text-red-900' : 'text-green-700 hover:text-green-900'
                }`}
              >
                <FaTimes />
              </button>
            </div>
          )}

          {/* Bird Info - Small image left, name right */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={bird.image}
              alt={bird.primaryName}
              className="w-16 h-16 object-cover border-2 border-[#506142]"
            />
            <div>
              <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                {bird.primaryName}
              </h2>
              <p className="text-sm text-gray-500 italic">{bird.scientificName}</p>
            </div>
          </div>

          {/* Featured Photos Grid - 3x3 */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <FaStar className="text-yellow-500" />
              Featured Photos
              <span className="text-sm font-normal text-gray-500">({featuredPhotos.length}/9)</span>
            </h3>
            {featuredPhotos.length === 0 ? (
              <div className="bg-gray-100 p-8 text-center text-gray-500">
                No featured photos yet.
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-1">
                {featuredPhotos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square bg-gray-100 group">
                    <img
                      src={photo.imageUrl}
                      alt={bird.primaryName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%25" height="100%25" viewBox="0 0 100%25 100%25"%3E%3Crect width="100%25" height="100%25" fill="%23e5e7eb"/%3E%3C/svg%3E';
                      }}
                    />
                    <button
                      onClick={() => handleTogglePhotoFeatured(photo.id)}
                      className="absolute top-1 right-1 p-1 bg-yellow-500 hover:bg-yellow-600 transition-all"
                    >
                      <FaStar className="text-white text-xs" />
                    </button>
                    <button
                      onClick={() => handleEnlargeImage(photo.imageUrl)}
                      className="absolute bottom-1 right-1 p-1 bg-black/50 hover:bg-black/70 transition-all"
                    >
                      <FaEye className="text-white text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Boosted by Moderator */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FaStar className="text-yellow-500" />
                <h3 className="text-md font-bold text-gray-800">Boosted by Moderator</h3>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {moderatorBoostedImages.map((img, index) => (
                  <div key={index} className="aspect-square bg-gray-100">
                    <img
                      src={img}
                      alt={`Moderator boosted ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%25" height="100%25" viewBox="0 0 100%25 100%25"%3E%3Crect width="100%25" height="100%25" fill="%23e5e7eb"/%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Gallery with Toggle - 4 columns */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-md font-bold text-gray-800">Bird Photos</h3>
                <div className="flex border border-gray-300 text-sm">
                  <button
                    onClick={() => setViewMode('recent')}
                    className={`flex items-center gap-1 px-3 py-1.5 font-medium transition-colors ${
                      viewMode === 'recent'
                        ? 'bg-[#506142] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FaClock className="text-xs" />
                    Recent
                  </button>
                  <button
                    onClick={() => setViewMode('popular')}
                    className={`flex items-center gap-1 px-3 py-1.5 font-medium transition-colors ${
                      viewMode === 'popular'
                        ? 'bg-[#506142] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    style={{ borderLeft: '1px solid #e5e7eb' }}
                  >
                    <FaFire className="text-xs" />
                    Popular
                  </button>
                </div>
              </div>

              {galleryLoading ? (
                <div className="text-center py-8">
                  <div className="w-10 h-10 border-4 border-t-[#506142] border-gray-200 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">Loading gallery...</p>
                </div>
              ) : sortedGallery.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No photos available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-1">
                  {sortedGallery.map((photo) => {
                    const featured = isPhotoFeatured(photo.id);
                    return (
                      <div key={photo.id} className="relative aspect-square bg-gray-100 group">
                        <img
                          src={photo.imageUrl}
                          alt={bird.primaryName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%25" height="100%25" viewBox="0 0 100%25 100%25"%3E%3Crect width="100%25" height="100%25" fill="%23e5e7eb"/%3E%3C/svg%3E';
                          }}
                        />
                        <button
                          onClick={() => handleTogglePhotoFeatured(photo.id)}
                          className={`absolute top-1 right-1 p-1 transition-all ${
                            featured
                              ? 'bg-yellow-500 hover:bg-yellow-600'
                              : 'bg-black/50 hover:bg-black/70'
                          }`}
                        >
                          {featured ? (
                            <FaStar className="text-white text-xs" />
                          ) : (
                            <FaRegStar className="text-white text-xs" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEnlargeImage(photo.imageUrl)}
                          className="absolute bottom-1 right-1 p-1 bg-black/50 hover:bg-black/70 transition-all"
                        >
                          <FaEye className="text-white text-xs" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={handleCloseEnlarged}
        >
          <div className="relative max-h-screen max-w-7xl w-full">
            <button
              onClick={handleCloseEnlarged}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white transition-all z-10"
            >
              <FaTimes className="text-2xl" />
            </button>
            <img
              src={enlargedImage}
              alt="Enlarged view"
              className="w-full h-auto max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedBirds;