import React from 'react';
import Sidebar from '../../components/Sidebar';
import SidebarRight from '../../components/SidebarRight';
import { 
  FaFeather, 
  FaBinoculars,
  FaDove,
  FaCrow,
  FaKiwiBird,
  FaTree,
  FaMountain,
  FaWater,
  FaCloudSun,
  FaLeaf,
  FaSpa,
  FaCamera,
  FaMapPin,
  FaCalendar,
  FaGlobe,
  FaRegCompass,
  FaRegMap,
  FaRegEye,
  FaRegFileAlt,
  FaRegLightbulb,
  FaRegSun,
  FaRegMoon,
  FaRegStar,
  FaFish,
  FaSeedling,
  FaRegSnowflake,
  FaUmbrella,
  FaRegClipboard,
  FaRegEdit,
  FaRegBookmark,
  FaRegHeart,
  FaRegFlag,
  FaRegPaperPlane,
  FaRegBell,
  FaRegClock,
  FaRegComment,
  FaRegShareSquare,
  FaUser,
  FaUsers
} from 'react-icons/fa';

const Forum = () => {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Sidebar />
      <div className="flex-1 p-4 ml-0 sm:ml-16 lg:ml-[20%] mr-0 md:mr-[20%] lg:mr-[30%] pb-20 sm:pb-4">
        <div className="p-4 w-full rounded-lg" style={{ backgroundColor: "var(--bg-secondary)" }}>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Forum
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Forum - the place for discussion and sharing ideas
          </p>
          
          {/* Birding Icons Preview */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>🦅 Birds & Wildlife</h2>
            <div className="grid grid-cols-6 gap-3">
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaFeather size={24} className="text-blue-600" />
                <span className="text-[10px] mt-1 text-gray-600">Feather</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaBinoculars size={24} className="text-green-700" />
                <span className="text-[10px] mt-1 text-gray-600">Binoculars</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaDove size={24} className="text-gray-600" />
                <span className="text-[10px] mt-1 text-gray-600">Dove</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaCrow size={24} className="text-gray-800" />
                <span className="text-[10px] mt-1 text-gray-600">Crow</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaKiwiBird size={24} className="text-amber-700" />
                <span className="text-[10px] mt-1 text-gray-600">Kiwi</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaFish size={24} className="text-blue-500" />
                <span className="text-[10px] mt-1 text-gray-600">Fish</span>
              </div>
            </div>
          </div>

          {/* Nature & Environment */}
          <div className="mt-4">
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>🌿 Nature & Environment</h2>
            <div className="grid grid-cols-6 gap-3">
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaTree size={24} className="text-green-700" />
                <span className="text-[10px] mt-1 text-gray-600">Tree</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaMountain size={24} className="text-gray-600" />
                <span className="text-[10px] mt-1 text-gray-600">Mountain</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaWater size={24} className="text-blue-500" />
                <span className="text-[10px] mt-1 text-gray-600">Water</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaCloudSun size={24} className="text-yellow-500" />
                <span className="text-[10px] mt-1 text-gray-600">Cloud Sun</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaLeaf size={24} className="text-green-600" />
                <span className="text-[10px] mt-1 text-gray-600">Leaf</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaSeedling size={24} className="text-green-500" />
                <span className="text-[10px] mt-1 text-gray-600">Seedling</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaSpa size={24} className="text-teal-500" />
                <span className="text-[10px] mt-1 text-gray-600">Spa</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegSnowflake size={24} className="text-blue-400" />
                <span className="text-[10px] mt-1 text-gray-600">Snowflake</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaUmbrella size={24} className="text-indigo-500" />
                <span className="text-[10px] mt-1 text-gray-600">Umbrella</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegSun size={24} className="text-yellow-500" />
                <span className="text-[10px] mt-1 text-gray-600">Sun</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegMoon size={24} className="text-indigo-600" />
                <span className="text-[10px] mt-1 text-gray-600">Moon</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegStar size={24} className="text-yellow-400" />
                <span className="text-[10px] mt-1 text-gray-600">Star</span>
              </div>
            </div>
          </div>

          {/* Location & Navigation */}
          <div className="mt-4">
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>📍 Location & Navigation</h2>
            <div className="grid grid-cols-6 gap-3">
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaMapPin size={24} className="text-red-600" />
                <span className="text-[10px] mt-1 text-gray-600">Map Pin</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaGlobe size={24} className="text-blue-600" />
                <span className="text-[10px] mt-1 text-gray-600">Globe</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegCompass size={24} className="text-blue-500" />
                <span className="text-[10px] mt-1 text-gray-600">Compass</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegMap size={24} className="text-green-600" />
                <span className="text-[10px] mt-1 text-gray-600">Map</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaCalendar size={24} className="text-blue-500" />
                <span className="text-[10px] mt-1 text-gray-600">Calendar</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegClock size={24} className="text-gray-600" />
                <span className="text-[10px] mt-1 text-gray-600">Clock</span>
              </div>
            </div>
          </div>

          {/* Notes & Observation */}
          <div className="mt-4">
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>📝 Notes & Observation</h2>
            <div className="grid grid-cols-6 gap-3">
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegClipboard size={24} className="text-gray-700" />
                <span className="text-[10px] mt-1 text-gray-600">Clipboard</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegEdit size={24} className="text-blue-600" />
                <span className="text-[10px] mt-1 text-gray-600">Edit</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegFileAlt size={24} className="text-blue-600" />
                <span className="text-[10px] mt-1 text-gray-600">File</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegLightbulb size={24} className="text-yellow-500" />
                <span className="text-[10px] mt-1 text-gray-600">Lightbulb</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegEye size={24} className="text-gray-600" />
                <span className="text-[10px] mt-1 text-gray-600">Eye</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaCamera size={24} className="text-gray-700" />
                <span className="text-[10px] mt-1 text-gray-600">Camera</span>
              </div>
            </div>
          </div>

          {/* Social & Community */}
          <div className="mt-4">
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>👥 Social & Community</h2>
            <div className="grid grid-cols-6 gap-3">
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaUser size={24} className="text-gray-600" />
                <span className="text-[10px] mt-1 text-gray-600">User</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaUsers size={24} className="text-blue-600" />
                <span className="text-[10px] mt-1 text-gray-600">Users</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegHeart size={24} className="text-red-500" />
                <span className="text-[10px] mt-1 text-gray-600">Heart</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegComment size={24} className="text-blue-500" />
                <span className="text-[10px] mt-1 text-gray-600">Comment</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegShareSquare size={24} className="text-purple-600" />
                <span className="text-[10px] mt-1 text-gray-600">Share</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegBookmark size={24} className="text-yellow-600" />
                <span className="text-[10px] mt-1 text-gray-600">Bookmark</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegFlag size={24} className="text-red-600" />
                <span className="text-[10px] mt-1 text-gray-600">Flag</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegPaperPlane size={24} className="text-blue-500" />
                <span className="text-[10px] mt-1 text-gray-600">Send</span>
              </div>
              <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm">
                <FaRegBell size={24} className="text-yellow-600" />
                <span className="text-[10px] mt-1 text-gray-600">Bell</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-500">Birding & nature related icons from Font Awesome (react-icons/fa)</p>
        </div>
      </div>
      <SidebarRight />
    </div>
  );
};

export default Forum;