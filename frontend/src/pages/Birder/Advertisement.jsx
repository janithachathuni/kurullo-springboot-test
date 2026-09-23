// pages/Birder/Advertisement.jsx
import React from 'react';

// Dummy ad data — replace with a real fetch once the backend endpoint exists
const ad = {
  title: 'See Every Feather in Detail',
  sponsor: 'Nikon Sri Lanka',
  description: 'Introducing the Nikon Monarch M7 8x42 — built for birders who chase the smallest details in the field. Weatherproof, ED glass, and a wide field of view.',
  imageUrl: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ctaText: 'Shop Now',
  ctaUrl: 'https://example.com/monarch-m7',
};

const Advertisement = () => {
  return (
    <div
      className="rounded-lg overflow-hidden mr-4 ml-4"
      style={{ backgroundColor: "var(--accent)", border: "1px solid var(--border)" }}
    >
      {/* Sponsor label */}
      <div
        className="flex items-center justify-between p-4 border-b"
        style={{ borderColor: "var(--bg-primary)", opacity: 0.9 }}
      >
        <p className="text-sm font-medium" style={{ color: "var(--bg-primary)" }}>
          Sponsored · {ad.sponsor}
        </p>
      </div>

      {/* Ad image */}
      <div className="relative w-full" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <img
          src={ad.imageUrl}
          alt={ad.title}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Ad content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--bg-primary)" }}>
          {ad.title}
        </h3>
        <p className="text-sm mb-3" style={{ color: "var(--bg-primary)" }}>
          {ad.description}
        </p>
        
          <a href={ad.ctaUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block px-4 py-2 rounded-lg text-sm font-medium transition hover:opacity-90"
          style={{ backgroundColor: "var(--bg-primary)", color: "var(--accent)" }}
        >
          {ad.ctaText}
        </a>
      </div>
    </div>
  );
};

export default Advertisement;