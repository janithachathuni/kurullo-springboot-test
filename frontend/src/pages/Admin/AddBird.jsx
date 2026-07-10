import React, { useState, useMemo, useEffect } from "react";
import UserSidebar from "../../Components/AdminSidebar";
import { FaPlus, FaTimes, FaSave, FaArrowLeft, FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createBird, getBirdOrders, getBirdFamilies } from "../../utils/api";

const AddBird = () => {
  const [formData, setFormData] = useState({
    primaryName: "",
    otherNames: [""],
    scientificName: "",
    order: "",
    family: "",
    description: "",
    sinhalaName: "",
    tamilName: "",
    image: null,
    imagePreview: null,
    habitatMap: null,
    habitatMapPreview: null,
    frequency: "",
    residency: "",
    endemic: false,
    places: "",
    habitat: "",
    notes: [""],
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOrderSuggestions, setShowOrderSuggestions] = useState(false);
  const [showFamilySuggestions, setShowFamilySuggestions] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [birdOrders, setBirdOrders] = useState([]);
  const [birdFamilies, setBirdFamilies] = useState([]);
  const navigate = useNavigate();

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

  // Filtered lists for suggestions
  const filteredOrders = useMemo(() => {
    if (!formData.order) return [];
    return birdOrders.filter((order) =>
      order.toLowerCase().includes(formData.order.toLowerCase())
    );
  }, [formData.order, birdOrders]);

  const filteredFamilies = useMemo(() => {
    if (!formData.family) return [];
    return birdFamilies.filter((familyObj) =>
      familyObj.family.toLowerCase().includes(formData.family.toLowerCase()) ||
      familyObj.category.toLowerCase().includes(formData.family.toLowerCase())
    );
  }, [formData.family, birdFamilies]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please upload a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'bird') {
          setFormData((prev) => ({
            ...prev,
            image: file,
            imagePreview: reader.result
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            habitatMap: file,
            habitatMapPreview: reader.result
          }));
        }
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type) => {
    if (type === 'bird') {
      setFormData((prev) => ({
        ...prev,
        image: null,
        imagePreview: null
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        habitatMap: null,
        habitatMapPreview: null
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
    setIsSubmitting(true);

    const {
      primaryName,
      scientificName,
      order,
      family,
      description,
      image,
      frequency,
      residency,
      habitat,
    } = formData;

    if (
      !primaryName ||
      !scientificName ||
      !order ||
      !family ||
      !description ||
      !image ||
      !frequency ||
      !residency
    ) {
      setError("Please fill all required fields (marked with *) and upload a bird image");
      setIsSubmitting(false);
      return;
    }

    const filteredOtherNames = formData.otherNames.filter(
      (name) => name.trim() !== ""
    );
    const filteredNotes = formData.notes.filter(
      (note) => note.trim() !== ""
    );

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
      await createBird(birdPayload, formData.image, formData.habitatMap);
      setSuccessMessage("Bird data saved successfully!");

      setTimeout(() => {
        setFormData({
          primaryName: "",
          otherNames: [""],
          scientificName: "",
          order: "",
          family: "",
          description: "",
          sinhalaName: "",
          tamilName: "",
          image: null,
          imagePreview: null,
          habitatMap: null,
          habitatMapPreview: null,
          frequency: "",
          residency: "",
          endemic: false,
          places: "",
          habitat: "",
          notes: [""],
        });
        setSuccessMessage("");
        navigate("/admin/bird-data");
      }, 1500);
    } catch (err) {
  console.error("createBird failed:", err);
  console.error("Response data:", err.response?.data);
  console.error("Status:", err.response?.status);
  setError(err.response?.data?.message || "Failed to save bird. Please try again.");

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex pl-8 pb-15 pt-4 pr-20 bg-[#f5f6f5] flex-1 ml-[20%]">
        <div className="w-full rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 text-[#506142] hover:bg-[#506142] hover:text-white rounded-lg transition-all duration-200"
              >
                <FaArrowLeft />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#253518]">
                  Add New Bird Data
                </h1>
                <p className="text-gray-600">
                  Enter information about a new bird species
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Names Section */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Bird Names
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Name *
                  </label>
                  <input
                    type="text"
                    value={formData.primaryName}
                    onChange={(e) =>
                      handleInputChange("primaryName", e.target.value)
                    }
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
                        onChange={(e) =>
                          handleOtherNameChange(index, e.target.value)
                        }
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Local Names
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sinhala Name
                  </label>
                  <input
                    type="text"
                    value={formData.sinhalaName}
                    onChange={(e) =>
                      handleInputChange("sinhalaName", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("tamilName", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("scientificName", e.target.value)
                    }
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Images
              </h3>
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
                          onChange={(e) => handleImageUpload(e, 'bird')}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          required
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
                          onClick={() => removeImage('bird')}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <FaTimes className="text-sm" />
                        </button>
                        <p className="text-xs text-gray-500 mt-1">{formData.image?.name}</p>
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
                          onChange={(e) => handleImageUpload(e, 'habitat')}
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
                          onClick={() => removeImage('habitat')}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <FaTimes className="text-sm" />
                        </button>
                        <p className="text-xs text-gray-500 mt-1">{formData.habitatMap?.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Status Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency *
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) =>
                      handleInputChange("frequency", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("residency", e.target.value)
                    }
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
                      onChange={(e) =>
                        handleInputChange("endemic", e.target.checked)
                      }
                      className="rounded border-gray-300 text-[#506142] focus:ring-[#506142]"
                    />
                    Endemic to Sri Lanka
                  </label>
                </div>
              </div>
            </div>

            {/* Habitat */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Habitat Information
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Habitat
                </label>
                <input
                  type="text"
                  value={formData.habitat}
                  onChange={(e) =>
                    handleInputChange("habitat", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                  placeholder="e.g., Forests, scrublands, cultivated areas"
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-8">
                Known Locations
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Locations
                </label>
                <input
                  type="text"
                  value={formData.places}
                  onChange={(e) =>
                    handleInputChange("places", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                  placeholder="e.g., Sinharaja Forest, Yala National Park, Horton Plains (separate with commas)"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple locations with commas</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Description *
              </h3>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                placeholder="Enter detailed description of the bird..."
                required
              />
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Notes
              </h3>
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
                        onChange={(e) =>
                          handleNoteChange(index, e.target.value)
                        }
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
                onClick={() => window.history.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 bg-[#506142] text-white rounded-lg hover:bg-[#3f4d34] transition-all font-medium ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <FaSave className="text-sm" />
                {isSubmitting ? "Saving..." : "Save Bird Data"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBird;