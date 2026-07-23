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


// trips
// ---- Trips ----

export async function createTrip(tripPayload) {
  const res = await fetch(`${API_BASE_URL}/trips`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(tripPayload),
  });
  if (!res.ok) throw new Error("Failed to create trip");
  return res.json();
}

export async function getMyTrips() {
  const res = await fetch(`${API_BASE_URL}/trips`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch trips");
  return res.json();
}

export async function getTripById(tripId) {
  const res = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch trip");
  return res.json();
}

export async function deleteTrip(tripId) {
  const res = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to delete trip");
}

// ---- Trip Notes ----

export async function getTripNotes(tripId) {
  const res = await fetch(`${API_BASE_URL}/trips/${tripId}/notes`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch trip notes");
  return res.json();
}

export async function addTripNote(tripId, content) {
  const res = await fetch(`${API_BASE_URL}/trips/${tripId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to add note");
  return res.json();
}

export async function updateTripNote(tripId, noteId, content) {
  const res = await fetch(`${API_BASE_URL}/trips/${tripId}/notes/${noteId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
}

export async function deleteTripNote(tripId, noteId) {
  const res = await fetch(`${API_BASE_URL}/trips/${tripId}/notes/${noteId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to delete note");
}

export async function getTripLocations(year = null) {
  const query = year ? `?year=${year}` : "";
  const res = await fetch(`${API_BASE_URL}/trips/locations${query}`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch trip locations");
  return res.json();
}

export async function getTripStats() {
  const res = await fetch(`${API_BASE_URL}/trips/stats`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch trip stats");
  return res.json();
}


// ---- Checklists ----

export async function createChecklist(checklistPayload) {
  const res = await fetch(`${API_BASE_URL}/checklists`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(checklistPayload),
  });
  if (!res.ok) throw new Error("Failed to create checklist");
  return res.json();
}

export async function getMyChecklists() {
  const res = await fetch(`${API_BASE_URL}/checklists`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch checklists");
  return res.json();
}

export async function getChecklistsByTrip(tripId) {
  const res = await fetch(`${API_BASE_URL}/checklists/trip/${tripId}`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch trip's checklists");
  return res.json();
}

export async function getChecklistById(checklistId) {
  const res = await fetch(`${API_BASE_URL}/checklists/${checklistId}`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch checklist");
  return res.json();
}

export async function deleteChecklist(checklistId) {
  const res = await fetch(`${API_BASE_URL}/checklists/${checklistId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to delete checklist");
}

// ---- Checklist Entries (bird + count) ----

export async function getChecklistEntries(checklistId) {
  const res = await fetch(`${API_BASE_URL}/checklists/${checklistId}/entries`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch checklist entries");
  return res.json();
}

export async function addChecklistEntry(checklistId, birdId, count) {
  const res = await fetch(`${API_BASE_URL}/checklists/${checklistId}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ birdId, count }),
  });
  if (!res.ok) throw new Error("Failed to add checklist entry");
  return res.json();
}

export async function updateChecklistEntry(checklistId, entryId, birdId, count) {
  const res = await fetch(`${API_BASE_URL}/checklists/${checklistId}/entries/${entryId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ birdId, count }),
  });
  if (!res.ok) throw new Error("Failed to update checklist entry");
  return res.json();
}

export async function deleteChecklistEntry(checklistId, entryId) {
  const res = await fetch(`${API_BASE_URL}/checklists/${checklistId}/entries/${entryId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to delete checklist entry");
}

// ---- Checklist Notes ----

export async function getChecklistNotes(checklistId) {
  const res = await fetch(`${API_BASE_URL}/checklists/${checklistId}/notes`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to fetch checklist notes");
  return res.json();
}

export async function addChecklistNote(checklistId, content) {
  const res = await fetch(`${API_BASE_URL}/checklists/${checklistId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to add checklist note");
  return res.json();
}

export async function updateChecklistNote(checklistId, noteId, content) {
  const res = await fetch(`${API_BASE_URL}/checklists/${checklistId}/notes/${noteId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to update checklist note");
  return res.json();
}

export async function deleteChecklistNote(checklistId, noteId) {
  const res = await fetch(`${API_BASE_URL}/checklists/${checklistId}/notes/${noteId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Failed to delete checklist note");
}

// get bird sounds from xeno canto
export async function getBirdSounds(birdId) {
  const res = await fetch(`${API_BASE_URL}/birds/${birdId}/sounds`);
  if (!res.ok) throw new Error("Failed to fetch bird sounds");
  return res.json();
}