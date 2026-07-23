import React from 'react';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight/SidebarShell';

// Bird species — Game Icons
import { GiFlamingo, GiOwl, GiHummingbird, GiEagleHead } from 'react-icons/gi';

// Birdwatching / trip gear
import {
  GiBinoculars,
  GiCompass,
  GiCampingTent,
  GiBackpack,
  GiTrail,
  GiJourney,
  GiTreasureMap,
  GiNestBirds,
  GiNestEggs,
} from 'react-icons/gi';

import { FaBinoculars, FaCompass, FaCampground, FaRoute, FaPersonHiking } from 'react-icons/fa6';import { LuBinoculars, LuCompass, LuTent, LuBackpack, LuMapPinned, LuRoute } from 'react-icons/lu';
import { BsBinoculars, BsCompass, BsCardChecklist } from 'react-icons/bs';
import { PiBinoculars, PiCompass, PiPersonSimpleHike, PiTent, PiMapTrifold } from 'react-icons/pi';

const birdIcons = [
  { name: 'GiFlamingo', Icon: GiFlamingo },
  { name: 'GiOwl', Icon: GiOwl },
  { name: 'GiHummingbird', Icon: GiHummingbird },
  { name: 'GiEagleHead', Icon: GiEagleHead },
];

const tripIcons = [
  { name: 'GiBinoculars', Icon: GiBinoculars },
  { name: 'FaBinoculars', Icon: FaBinoculars },
  { name: 'LuBinoculars', Icon: LuBinoculars },
  { name: 'BsBinoculars', Icon: BsBinoculars },
  { name: 'PiBinoculars', Icon: PiBinoculars },
  { name: 'GiCompass', Icon: GiCompass },
  { name: 'FaCompass', Icon: FaCompass },
  { name: 'LuCompass', Icon: LuCompass },
  { name: 'BsCompass', Icon: BsCompass },
  { name: 'PiCompass', Icon: PiCompass },
  { name: 'GiCampingTent', Icon: GiCampingTent },
  { name: 'FaCampground', Icon: FaCampground },
  { name: 'LuTent', Icon: LuTent },
  { name: 'PiTent', Icon: PiTent },
  { name: 'GiBackpack', Icon: GiBackpack },
  { name: 'LuBackpack', Icon: LuBackpack },
  { name: 'GiTrail', Icon: GiTrail },
  { name: 'GiJourney', Icon: GiJourney },
  { name: 'GiTreasureMap', Icon: GiTreasureMap },
  { name: 'PiMapTrifold', Icon: PiMapTrifold },
  { name: 'LuMapPinned', Icon: LuMapPinned },
  { name: 'FaRoute', Icon: FaRoute },
  { name: 'LuRoute', Icon: LuRoute },
  { name: 'FaHiking', Icon: FaPersonHiking },
  { name: 'PiPersonSimpleHike', Icon: PiPersonSimpleHike },
  { name: 'BsCardChecklist', Icon: BsCardChecklist },
  { name: 'GiNestBirds', Icon: GiNestBirds },
  { name: 'GiNestEggs', Icon: GiNestEggs },
];

const SingleTrip = () => {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar />
      <div className="flex-1 p-4 ml-0 md:ml-16 lg:ml-[20%] pb-20 md:pb-4">
        <div className="p-4 w-full rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Icon Picks
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Bird species + birdwatching/trip gear icons, all from react-icons.
          </p>

          <div className="mt-6 space-y-8">
            <div>
              <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                Bird Species
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {birdIcons.map(({ name, Icon }) => (
                  <div
                    key={name}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg"
                    style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
                  >
                    <Icon size={28} style={{ color: "var(--accent)" }} />
                    <span
                      className="text-[11px] text-center leading-tight"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                Birdwatching / Trip
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {tripIcons.map(({ name, Icon }) => (
                  <div
                    key={name}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg"
                    style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
                  >
                    <Icon size={28} style={{ color: "var(--accent)" }} />
                    <span
                      className="text-[11px] text-center leading-tight"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SidebarRight />
    </div>
  );
};

export default SingleTrip;