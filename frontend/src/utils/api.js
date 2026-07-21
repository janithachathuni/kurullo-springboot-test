const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getBirds() {
  const res = await fetch(`${API_BASE_URL}/birds`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch birds");
  return res.json();
}

export async function getBirdById(id) {
  const res = await fetch(`${API_BASE_URL}/birds/${id}`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch bird");
  return res.json();
}

export async function deleteBird(id) {
  const res = await fetch(`${API_BASE_URL}/birds/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to delete bird");
  return res.json();
}

function buildBirdFormData(bird, image, habitatMap) {
  const formData = new FormData();
  formData.append("primaryName", bird.primaryName);
  formData.append("scientificName", bird.scientificName);
  formData.append("order", bird.order);
  formData.append("family", bird.family);
  formData.append("description", bird.description);
  formData.append("frequency", bird.frequency);
  formData.append("residency", bird.residency);
  formData.append("endemic", bird.endemic);
  formData.append("habitat", bird.habitat);

  if (bird.sinhalaName) formData.append("sinhalaName", bird.sinhalaName);
  if (bird.tamilName) formData.append("tamilName", bird.tamilName);
  if (bird.places) formData.append("places", bird.places);

  (bird.otherNames || []).forEach((name) => formData.append("otherNames", name));
  (bird.notes || []).forEach((note) => formData.append("notes", note));

  if (image) formData.append("image", image);
  if (habitatMap) formData.append("habitatMap", habitatMap);

  return formData;
}

export async function createBird(bird, image, habitatMap) {
  const formData = buildBirdFormData(bird, image, habitatMap);
  const res = await fetch(`${API_BASE_URL}/birds`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to create bird");
  return res.json();
}

export async function updateBird(id, bird, image, habitatMap) {
  const formData = buildBirdFormData(bird, image, habitatMap);
  const res = await fetch(`${API_BASE_URL}/birds/${id}`, {
    method: "PUT",
    headers: { ...authHeaders() },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to update bird");
  return res.json();
}

export async function getBirdOrders() {
  const res = await fetch(`${API_BASE_URL}/bird-orders`);
  if (!res.ok) throw new Error("Failed to fetch bird orders");
  return res.json(); // array of display-name strings, e.g. "Anseriformes"
}

export async function getBirdFamilies() {
  const res = await fetch(`${API_BASE_URL}/bird-families`);
  if (!res.ok) throw new Error("Failed to fetch bird families");
  return res.json(); // array of { family, category }
}

// utils/api.js
export const createPost = async (postPayload, imageFiles) => {
  const formData = new FormData();

  // The structured JSON part — must be sent as a Blob with type application/json
  // so Spring's @RequestPart binds it to CreatePostRequest instead of treating it as a plain string
  formData.append(
    'post',
    new Blob([JSON.stringify(postPayload)], { type: 'application/json' })
  );

  // The files — one entry per photo, same order as postPayload.photos
  imageFiles.forEach((file) => {
    formData.append('images', file);
  });

  const res = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
      // Do NOT set Content-Type — the browser sets the multipart boundary for you
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to create post');
  }

  return res.json();
};

//get bird photos for gallery
export async function getBirdPhotos(birdId, featuredOnly = false) {
  const res = await fetch(`${API_BASE_URL}/birds/${birdId}/photos?featuredOnly=${featuredOnly}`);
  if (!res.ok) throw new Error("Failed to fetch bird photos");
  return res.json();
}

// admin: mark/unmark a photo as featured
export async function setPhotoFeatured(photoId, featured) {
  const res = await fetch(`${API_BASE_URL}/posts/photos/${photoId}/featured?featured=${featured}`, {
    method: 'PUT',
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to update featured status");
}

// feed: fetch a page of posts
export async function getFeed(page = 0, size = 10) {
  const res = await fetch(`${API_BASE_URL}/posts?page=${page}&size=${size}`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch feed");
  return res.json();
}

// posts by a specific user
export async function getPostsByUser(userId, page = 0, size = 10) {
  const res = await fetch(`${API_BASE_URL}/posts/user/${userId}?page=${page}&size=${size}`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch user's posts");
  return res.json();
}

export async function deletePost(postId) {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to delete post");
}

export async function togglePostLike(postId) {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
    method: "POST",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to toggle like");
  return res.json(); // boolean: true = now liked
}

export async function getComments(postId) {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function addComment(postId, content, parentCommentId = null) {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ content, parentCommentId }),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json(); // new comment id
}

export async function toggleCommentLike(postId, commentId) {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}/like`, {
    method: "POST",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to toggle comment like");
  return res.json(); // boolean: true = now liked
}

export async function deleteComment(postId, commentId) {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to delete comment");
}

// In api.js - add this function
export async function getAllBirdPhotos() {
  // Fetch posts that have photos
  const res = await fetch(`${API_BASE_URL}/posts?page=0&size=50`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch photos");
  
  const data = await res.json();
  
  // Extract photos from posts
  const posts = data.content || data || [];
  const allPhotos = [];
  
  posts.forEach(post => {
    if (post.photos && post.photos.length > 0) {
      post.photos.forEach(photo => {
        allPhotos.push({
          id: photo.id || `${post.id}-${Date.now()}`,
          imageUrl: photo.imageUrl || photo.url,
          birdName: post.birdName || post.primaryName || 'Bird',
          postId: post.id,
          createdAt: photo.createdAt || post.createdAt || new Date().toISOString()
        });
      });
    }
  });
  
  // Sort by newest first
  return allPhotos.sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
}