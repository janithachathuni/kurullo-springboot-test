const API_BASE_URL = "http://localhost:8080/api";

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