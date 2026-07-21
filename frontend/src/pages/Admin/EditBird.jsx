import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { FaTimes, FaSave, FaArrowLeft, FaPlus, FaImage } from "react-icons/fa";
import { getBirdById, updateBird, getBirdOrders, getBirdFamilies } from "../../utils/api";

// Backend returns frequency/residency as raw enum names (e.g. "VERY_COMMON",
// "RESIDENT"). The <select> options use display labels (e.g. "Very Common",
// "Resident"), which is also what the backend accepts on submit
// (Frequency.valueOf(x.trim().toUpperCase().replace(" ", "_"))). So we only
// need to convert enum -> label when populating the form.
const enumToLabel = (value) => {
  if (!value) return "";
  return value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

const EditBird = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showOrderSuggestions, setShowOrderSuggestions] = useState(false);
  const [showFamilySuggestions, setShowFamilySuggestions] = useState(false);
  const [birdOrders, setBirdOrders] = useState([]);
  const [birdFamilies, setBirdFamilies] = useState([]);

  const [formData, setFormData] = useState({
    primaryName: "",
    otherNames: [""],
    sinhalaName: "",
    tamilName: "",
    scientificName: "",
    order: "",
    family: "",
    image: null,
    imagePreview: null,
    frequency: "",
    residency: "",
    habitatMap: null,
    habitatMapPreview: null,
    endemic: false,
    description: "",
    places: "",
    habitat: "",
    notes: [""],
  });

  // Filtered lists for suggestions
  const filteredOrders = useMemo(() => {
    if (!formData.order) return [];
    return birdOrders.filter((order) =>
      order.toLowerCase().includes(formData.order.toLowerCase())
    );
  }, [formData.order, birdOrders]);

  const filteredFamilies = useMemo(() => {
    if (!formData.family) return [];
    return birdFamilies.filter(
      (familyObj) =>
        familyObj.family.toLowerCase().includes(formData.family.toLowerCase()) ||
        familyObj.category.toLowerCase().includes(formData.family.toLowerCase())
    );
  }, [formData.family, birdFamilies]);

  // Load taxonomy (orders/families) for the autocomplete fields
  useEffect(() => {
    (async () => {
      try {
        const [orders, families] = await Promise.all([getBirdOrders(), getBirdFamilies()]);
        setBirdOrders(orders);
        setBirdFamilies(families);
      } catch (err) {
        console.error("Failed to load taxonomy", err);
      }
    })();
  }, []);

  // Fetch the actual bird data to edit
  useEffect(() => {
    if (!id) return;

    const fetchBirdData = async () => {
      try {
        setLoading(true);
        setError(null);
        const birdData = await getBirdById(id);

        setFormData({
          primaryName: birdData.primaryName || "",
          otherNames: birdData.otherNames && birdData.otherNames.length > 0 ? birdData.otherNames : [""],
          sinhalaName: birdData.sinhalaName || "",
          tamilName: birdData.tamilName || "",
          scientificName: birdData.scientificName || "",
          order: birdData.order || "",
          family: birdData.family || "",
          image: null,
          imagePreview: birdData.image || null,
          frequency: enumToLabel(birdData.frequency),
          residency: enumToLabel(birdData.residency),
          habitatMap: null,
          habitatMapPreview: birdData.habitatMap || null,
          endemic: !!birdData.endemic,
          description: birdData.description || "",
          places: birdData.places || "",
          habitat: birdData.habitat || "",
          notes: birdData.notes && birdData.notes.length > 0 ? birdData.notes : [""],
        });
      } catch (err) {
        console.error("Failed to fetch bird data:", err);
        setError("Failed to fetch bird data");
      } finally {
        setLoading(false);
      }
    };

    fetchBirdData();
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "bird") {
          setFormData((prev) => ({
            ...prev,
            image: file,
            imagePreview: reader.result,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            habitatMap: file,
            habitatMapPreview: reader.result,
          }));
        }
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type) => {
    if (type === "bird") {
      setFormData((prev) => ({
        ...prev,
        image: null,
        imagePreview: null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        habitatMap: null,
        habitatMapPreview: null,
      }));
    }
  };

  const handleOtherNameChange = (index, value) => {
    const newNames = [...formData.otherNames];
    newNames[index] = value;
    setFormData((prev) => ({
      ...prev,
      otherNames: newNames,
    }));
  };

  const addOtherNameField = () => {
    setFormData((prev) => ({
      ...prev,
      otherNames: [...prev.otherNames, ""],
    }));
  };

  const removeOtherNameField = (index) => {
    if (formData.otherNames.length > 1) {
      const newNames = formData.otherNames.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        otherNames: newNames,
      }));
    }
  };

  const handleNoteChange = (index, value) => {
    const newNotes = [...formData.notes];
    newNotes[index] = value;
    setFormData((prev) => ({
      ...prev,
      notes: newNotes,
    }));
  };

  const addNoteField = () => {
    setFormData((prev) => ({
      ...prev,
      notes: [...prev.notes, ""],
    }));
  };

  const removeNoteField = (index) => {
    if (formData.notes.length > 1) {
      const newNotes = formData.notes.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        notes: newNotes,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setSaving(true);

    const {
      primaryName,
      scientificName,
      order,
      family,
      description,
      imagePreview,
      frequency,
      residency,
    } = formData;

    if (
      !primaryName ||
      !scientificName ||
      !order ||
      !family ||
      !description ||
      !imagePreview ||
      !frequency ||
      !residency
    ) {
      setError("Please fill all required fields (marked with *) and upload a bird image");
      setSaving(false);
      return;
    }

    const filteredOtherNames = formData.otherNames.filter((name) => name.trim() !== "");
    const filteredNotes = formData.notes.filter((note) => note.trim() !== "");

    const birdPayload = {
      primaryName: formData.primaryName,
      otherNames: filteredOtherNames,
      scientificName: formData.scientificName,
      order: formData.order,
      family: formData.family,
      description: formData.description,
      sinhalaName: formData.sinhalaName,
      tamilName: formData.tamilName,
      frequency: formData.frequency,
      residency: formData.residency,
      endemic: formData.endemic,
      places: formData.places,
      habitat: formData.habitat,
      notes: filteredNotes,
    };

    try {
      // Only send a new file if the user actually picked one; the backend
      // keeps the existing Cloudinary image/habitatMap when these are omitted.
      await updateBird(id, birdPayload, formData.image, formData.habitatMap);
      setSuccessMessage("Bird updated successfully!");

      setTimeout(() => {
        navigate("/admin/bird-data", { state: { message: "Bird updated successfully!" } });
      }, 1500);
    } catch (err) {
      console.error("updateBird failed:", err);
      setError(err.message || "Failed to update bird. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <AdminSidebar />
        <div className="flex pl-8 pb-15 pt-4 pr-20 bg-[#f5f6f5] flex-1 ml-[20%]">
          <div className="w-full rounded-lg flex items-center justify-center">
            <div className="text-gray-600">Loading bird data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !formData.primaryName) {
    return (
      <div className="flex min-h-screen bg-white">
        <AdminSidebar />
        <div className="flex pl-8 pb-15 pt-4 pr-20 bg-[#f5f6f5] flex-1 ml-[20%]">
          <div className="w-full rounded-lg">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Error: {error}
            </div>
            <button
              onClick={() => navigate("/admin/bird-data")}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />
      <div className="flex pl-8 pb-15 pt-4 pr-20 bg-[#f5f6f5] flex-1 ml-[20%]">
        <div className="w-full rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/bird-data")}
                className="p-2 text-[#506142] hover:bg-[#506142] hover:text-white rounded-lg transition-all duration-200"
              >
                <FaArrowLeft />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#253518]">Edit Bird</h1>
                <p className="text-gray-600">
                  Update information for {formData.primaryName || "bird"}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Names Section */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Bird Names</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Name *
                  </label>
                  <input
                    type="text"
                    value={formData.primaryName}
                    onChange={(e) => handleInputChange("primaryName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                    placeholder="Enter primary bird name"
                  />
                </div>

                {formData.otherNames.map((name, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {`Alternative Name ${index + 1}`}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => handleOtherNameChange(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                        placeholder="Enter alternative name"
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeOtherNameField(index)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-200 mt-5"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOtherNameField}
                  className="flex items-center gap-2 px-4 py-2 text-[#506142] border border-[#506142] rounded-lg hover:bg-[#506142] hover:text-white transition-all duration-200"
                >
                  <FaPlus className="text-sm" /> Add Alternative Name
                </button>
              </div>
            </div>

            {/* Local Names */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Local Names</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sinhala Name
                  </label>
                  <input
                    type="text"
                    value={formData.sinhalaName}
                    onChange={(e) => handleInputChange("sinhalaName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    placeholder="Enter Sinhala name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tamil Name
                  </label>
                  <input
                    type="text"
                    value={formData.tamilName}
                    onChange={(e) => handleInputChange("tamilName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    placeholder="Enter Tamil name"
                  />
                </div>
              </div>
            </div>

            {/* Scientific Classification */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Scientific Classification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scientific Name *
                  </label>
                  <input
                    type="text"
                    value={formData.scientificName}
                    onChange={(e) => handleInputChange("scientificName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                    placeholder="Enter scientific name"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order *
                  </label>
                  <input
                    type="text"
                    value={formData.order}
                    onChange={(e) => {
                      handleInputChange("order", e.target.value);
                      setShowOrderSuggestions(true);
                    }}
                    onFocus={() => setShowOrderSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowOrderSuggestions(false), 200)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                    placeholder="Enter order"
                  />
                  {showOrderSuggestions && filteredOrders.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                      {filteredOrders.map((order) => (
                        <li
                          key={order}
                          onMouseDown={() => {
                            handleInputChange("order", order);
                            setShowOrderSuggestions(false);
                          }}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          {order}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Family *
                  </label>
                  <input
                    type="text"
                    value={formData.family}
                    onChange={(e) => {
                      handleInputChange("family", e.target.value);
                      setShowFamilySuggestions(true);
                    }}
                    onFocus={() => setShowFamilySuggestions(true)}
                    onBlur={() => setTimeout(() => setShowFamilySuggestions(false), 200)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                    placeholder="Enter family name"
                  />
                  {showFamilySuggestions && filteredFamilies.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                      {filteredFamilies.map((familyObj) => (
                        <li
                          key={familyObj.family}
                          onMouseDown={() => {
                            handleInputChange("family", familyObj.family);
                            setShowFamilySuggestions(false);
                          }}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          {familyObj.family}: {familyObj.category}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Images - Upload Section */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bird Image *
                  </label>
                  <div className="relative">
                    {!formData.imagePreview ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#506142] transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "bird")}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <FaImage className="mx-auto text-4xl text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload bird image</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={formData.imagePreview}
                          alt="Bird preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage("bird")}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <FaTimes className="text-sm" />
                        </button>
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.image?.name || "Current image"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Habitat Map
                  </label>
                  <div className="relative">
                    {!formData.habitatMapPreview ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#506142] transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "habitat")}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <FaImage className="mx-auto text-4xl text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload habitat map</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={formData.habitatMapPreview}
                          alt="Habitat map preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage("habitat")}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <FaTimes className="text-sm" />
                        </button>
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.habitatMap?.name || "Current image"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency *
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => handleInputChange("frequency", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                  >
                    <option value="">Select Frequency</option>
                    <option value="Very Common">Very Common</option>
                    <option value="Common">Common</option>
                    <option value="Uncommon">Uncommon</option>
                    <option value="Rare">Rare</option>
                    <option value="Very Rare">Very Rare</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Residency *
                  </label>
                  <select
                    value={formData.residency}
                    onChange={(e) => handleInputChange("residency", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                  >
                    <option value="">Select Residency</option>
                    <option value="Resident">Resident</option>
                    <option value="Migrant">Migrant</option>
                    <option value="Vagrant">Vagrant</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.endemic}
                      onChange={(e) => handleInputChange("endemic", e.target.checked)}
                      className="rounded border-gray-300 text-[#506142] focus:ring-[#506142]"
                    />
                    Endemic to Sri Lanka
                  </label>
                </div>
              </div>
            </div>

            {/* Habitat Information */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Habitat Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Habitat
                </label>
                <input
                  type="text"
                  value={formData.habitat}
                  onChange={(e) => handleInputChange("habitat", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                  placeholder="e.g., Forests, scrublands, cultivated areas"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Known Locations
                </label>
                <input
                  type="text"
                  value={formData.places}
                  onChange={(e) => handleInputChange("places", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                  placeholder="e.g., Sinharaja Forest, Yala National Park, Horton Plains (separate with commas)"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple locations with commas</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Description *</h3>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                placeholder="Enter detailed description of the bird..."
                required
              />
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add important notes about this bird species
              </p>
              <div className="space-y-3">
                {formData.notes.map((note, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {`Note ${index + 1}`}
                      </label>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => handleNoteChange(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                        placeholder="Enter a note"
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeNoteField(index)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-200 mt-5"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addNoteField}
                  className="flex items-center gap-2 px-4 py-2 text-[#506142] border border-[#506142] rounded-lg hover:bg-[#506142] hover:text-white transition-all duration-200"
                >
                  <FaPlus className="text-sm" /> Add Note
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/bird-data")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-3 bg-[#506142] text-white rounded-lg hover:bg-[#3f4d34] transition-all font-medium ${
                  saving ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <FaSave className="text-sm" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBird;