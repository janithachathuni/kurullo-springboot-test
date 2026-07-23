import React, { useState, useEffect } from 'react';
import { createChecklist } from '../../utils/api';

const CreateChecklist = ({ isOpen, onClose, onSave, trips }) => {
  const [selectedTrip, setSelectedTrip] = useState("");
  const [checklistTitle, setChecklistTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Reset form when popup opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTrip("");
      setSelectedDate(new Date().toISOString().split('T')[0]);
      // Let the auto-generation handle the title
    }
  }, [isOpen]);

  // Auto-generate title when trip and date are selected
  useEffect(() => {
    if (!isOpen) return;
    
    console.log('Selected Trip:', selectedTrip);
    console.log('Selected Date:', selectedDate);
    console.log('Trips available:', trips);
    
    if (selectedDate) {
      const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      if (selectedTrip) {
        // Try to find the trip by matching the ID (convert both to strings for comparison)
        const selectedTripData = trips.find(trip => String(trip.id) === String(selectedTrip));
        console.log('Found trip data:', selectedTripData);
        
        if (selectedTripData) {
          setChecklistTitle(`${selectedTripData.title} ${formattedDate}`);
        } else {
          // If trip not found, show a fallback
          setChecklistTitle(`Trip ${formattedDate}`);
        }
      } else {
        setChecklistTitle(`Checklist ${formattedDate}`);
      }
    } else {
      setChecklistTitle("");
    }
  }, [selectedTrip, selectedDate, trips, isOpen]);

  const handleSave = async () => {
    if (!checklistTitle.trim()) return;

    try {
      const payload = {
        title: checklistTitle.trim(),
        tripId: selectedTrip ? Number(selectedTrip) : null,
      };

      const newChecklist = await createChecklist(payload);
      onSave(newChecklist);

      // Reset form
      setSelectedTrip("");
      setChecklistTitle("");
      setSelectedDate(new Date().toISOString().split('T')[0]);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateTripClick = () => {
    onClose();
    // Navigate to trips page or open create trip modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="p-6 rounded-lg w-full max-w-md" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Add New Checklist
          </h3>
          <button 
            onClick={onClose} 
            className="text-xl hover:opacity-70" 
            style={{ color: "var(--text-secondary)" }}
          >
            ×
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Select Trip (optional)
          </label>
          <select 
            value={selectedTrip} 
            onChange={(e) => setSelectedTrip(e.target.value)} 
            className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            style={{ 
              backgroundColor: "var(--bg-card)", 
              color: "var(--text-primary)",
              border: "1px solid var(--border)"
            }}
          >
            <option value="">None</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>{trip.title}</option>
            ))}
          </select>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            Don't see your trip? 
            <button 
              onClick={handleCreateTripClick}
              className="hover:underline ml-1"
              style={{ color: "var(--accent)" }}
            >
              Create a new trip first
            </button>
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Date
          </label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            style={{ 
              backgroundColor: "var(--bg-card)", 
              color: "var(--text-primary)",
              border: "1px solid var(--border)"
            }}
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Checklist Title
          </label>
          <input 
            type="text" 
            placeholder="Enter checklist title" 
            value={checklistTitle} 
            onChange={(e) => setChecklistTitle(e.target.value)} 
            className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            style={{ 
              backgroundColor: "var(--bg-card)", 
              color: "var(--text-primary)",
              border: "1px solid var(--border)"
            }}
          />
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            Default name generated from trip location and date.
          </p>
        </div>
        
        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg hover:opacity-70 text-sm"
            style={{ 
              border: "1px solid var(--border)",
              backgroundColor: "transparent",
              color: "var(--text-secondary)"
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={!checklistTitle.trim()} 
            className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
            style={{ 
              backgroundColor: checklistTitle.trim() ? "var(--accent)" : "#d1d5db",
              color: checklistTitle.trim() ? "var(--accent-text)" : "#9ca3af"
            }}
          >
            Save Checklist
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChecklist;