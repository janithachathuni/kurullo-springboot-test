import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-12 px-6 md:px-12 bg-[#143829] text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-extrabold mb-3 text-[#8fc6a3]">Kurullo</h2>
            <p className="text-sm leading-relaxed text-emerald-100/70">
              A community platform for bird enthusiasts in Sri Lanka. Share sightings, log trips, and connect with fellow birders.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h5 className="font-semibold mb-3 text-sm text-white">Explore</h5>
            <ul className="space-y-2 text-sm text-emerald-100/70">
              <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              <li><Link to="/checklists" className="hover:text-white transition">Checklists</Link></li>
              <li><Link to="/trips" className="hover:text-white transition">Trips</Link></li>
              <li><Link to="/forum" className="hover:text-white transition">Forum</Link></li>
            </ul>
          </div>

          {/* Birds */}
          <div>
            <h5 className="font-semibold mb-3 text-sm text-white">Birds of Sri Lanka</h5>
            <ul className="space-y-2 text-sm text-emerald-100/70">
              <li><a href="#" className="hover:text-white transition">Species Database</a></li>
              <li><a href="#" className="hover:text-white transition">Endemic Birds</a></li>
              <li><a href="#" className="hover:text-white transition">Migratory Birds</a></li>
              <li><a href="#" className="hover:text-white transition">Conservation Status</a></li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h5 className="font-semibold mb-3 text-sm text-white">Legal</h5>
            <ul className="space-y-2 text-sm text-emerald-100/70">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Community Guidelines</a></li>
              <li>
                <a href="mailto:hello@kurullo.lk" className="hover:text-white transition">
                  hello@kurullo.lk
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-emerald-100/60">
          <p>© 2025 Kurullo. All rights reserved.</p>
          <p>Made for birders of Sri Lanka, young and old.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;