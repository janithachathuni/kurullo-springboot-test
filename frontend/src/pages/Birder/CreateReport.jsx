import React, { useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaFlag, FaExclamationCircle } from "react-icons/fa";

const CreateReport = ({ postId, onComplete, onClose }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const reportReasons = [
    { value: "spam", label: "Spam or Misleading" },
    { value: "harassment", label: "Harassment or Bullying" },
    { value: "inappropriate", label: "Inappropriate Content" },
    { value: "false_information", label: "False Information" },
    { value: "copyright", label: "Copyright Violation" },
    { value: "other", label: "Other" },
  ];

  const handleSubmitReport = async () => {
    if (!selectedReason) {
      alert("Please select a reason for reporting");
      return;
    }

    setLoading(true);

    try {
      // Your API call here
      // await reportPost(postId, {
      //   reason: selectedReason,
      //   customReason: customReason.trim() || null,
      // });

      console.log("Report submitted:", {
        postId,
        reason: selectedReason,
        customReason: customReason.trim() || null,
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onComplete?.();
    } catch (error) {
      console.error("Failed to submit report:", error);
      alert(error.message || "Something went wrong while submitting your report.");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    if (selectedReason || customReason.trim()) {
      setShowDiscardConfirm(true);
    } else {
      onClose?.();
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div 
        className="rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{ 
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b rounded-t-lg" style={{ 
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border)'
        }}>
          <div className="flex items-center gap-3">
            {/* <FaFlag style={{ color: '#dc2626' }} size={20} /> */}
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Report Post
            </h2>
          </div>
          <button
            onClick={handleDiscard}
            className="text-xl hover:opacity-70"
            style={{ color: 'var(--text-secondary)' }}
            disabled={loading}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Message */}
          {/* <div 
            className="mb-4 p-3 rounded-lg flex items-start gap-3"
            style={{ 
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.2)'
            }}
          >
            <FaExclamationCircle className="flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Please only report posts that violate our community guidelines. False reports may be penalized.
            </p>
          </div> */}

          {/* Report Reason Selection */}
          <div className="mb-4">
            <label 
              className="block mb-2 text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Reason for Reporting <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div className="space-y-2">
              {reportReasons.map((reason) => (
                <label
                  key={reason.value}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                  style={{ 
                    backgroundColor: selectedReason === reason.value 
                      ? 'rgba(52, 211, 153, 0.15)' 
                      : 'var(--bg-card)',
                    border: selectedReason === reason.value 
                      ? '2px solid var(--accent)' 
                      : '1px solid var(--border)'
                  }}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4"
                    disabled={loading}
                  />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {reason.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Reason Text Field */}
          <div className="mb-4">
            <label 
              className="block mb-2 text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Additional Details (Optional)
            </label>
            <textarea
              value={customReason}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setCustomReason(e.target.value);
                }
              }}
              className="w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)'
              }}
              rows={4}
              placeholder="Please provide any additional details that might help us understand the issue better..."
              disabled={loading}
            />
            <div className="text-xs mt-2 text-right" style={{ color: 'var(--text-secondary)' }}>
              {customReason.length}/500
            </div>
          </div>

          {/* Note about custom reason requirement */}
          {selectedReason === "other" && !customReason.trim() && (
            <p className="text-xs mb-4" style={{ color: 'var(--text-yellow)' }}>
              Please provide details for the "Other" reason.
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={handleDiscard}
              className="px-4 py-2 rounded-lg hover:opacity-70 text-sm"
              style={{ 
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)'
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitReport}
              disabled={!selectedReason || loading}
              className="px-6 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
              style={{ 
                backgroundColor: (selectedReason && !loading) ? '#dc2626' : '#d1d5db',
                color: (selectedReason && !loading) ? '#ffffff' : '#9ca3af'
              }}
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>

          {/* Privacy Note */}
          <p className="text-xs mt-4 text-center" style={{ color: 'var(--text-secondary)' }}>
            Your report will be reviewed by our moderation team. We take all reports seriously.
          </p>
        </div>
      </div>

      {/* Discard Confirmation */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div 
            className="rounded-lg p-6 max-w-sm w-full mx-4"
            style={{ 
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)'
            }}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Discard Report?</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to discard this report? Your feedback helps us keep the community safe.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onClose?.();
                }}
                className="border py-2 rounded-lg font-medium transition-colors text-sm"
                style={{ 
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)'
                }}
              >
                Discard Report
              </button>
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="py-2 rounded-lg font-medium transition-colors text-sm"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)'
                }}
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CreateReport;