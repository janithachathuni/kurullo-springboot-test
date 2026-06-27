import { createBrowserRouter, Navigate } from "react-router-dom";

// General
import Home from "../components/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import OAuth2Success from "../pages/OAuth2Success";

// Birder
import CompleteRegistration from "../pages/CompleteRegistration";
import CreateProfile from "../pages/Birder/CreateProfile";
import BirderBlog from "../pages/Birder/Blog";
import BirderDashboard from "../pages/Birder/Dashboard";
import BirderSettings from "../pages/Birder/Settings";
import BirderChecklists from "../pages/Birder/Checklists";
import BirderForum from "../pages/Birder/Forum";
import BirderNotifications from "../pages/Birder/Notifications";
import BirderTrips from "../pages/Birder/Trips";

// Admin
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminBirdList from "../pages/Admin/BirdList";
import AdminContentModeration from "../pages/Admin/ContentModeration";
import AdminManageModerators from "../pages/Admin/ManageModerators";
import AdminNotifications from "../pages/Admin/Notifications";
import AdminSettings from "../pages/Admin/Settings";
import AdminStatistics from "../pages/Admin/Statistics";
import AdminAdvertisements from "../pages/Admin/Advertisements";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/oauth2/success", element: <OAuth2Success /> },
  { path: "/complete-registration", element: <CompleteRegistration /> },

  // birder
  { path: "/create-profile", element: <CreateProfile /> },
  { path: "/:username", element: <BirderBlog/>},
  { path: "/dashboard", element: <BirderDashboard/> },
  { path: "/settings", element: <BirderSettings/>},
  { path: "/checklists", element: <BirderChecklists/>},
  { path: "/trips", element: <BirderTrips/>},
  { path: "/notifications", element: <BirderNotifications/>},
  { path: "/forum", element: <BirderForum/>},
  
  //admin
  { path: "/admin/dashboard", element: <AdminDashboard/>},
  { path: "/admin/bird-data", element: <AdminBirdList/>},
  { path: "/admin/content-moderation", element: <AdminContentModeration/>},
  { path: "/admin/manage-moderators", element: <AdminManageModerators/>},
  { path: "/admin/notifications", element: <AdminNotifications/>},
  { path: "/admin/settings", element: <AdminSettings/>},
  { path: "/admin/statistics", element: <AdminStatistics/>},
  { path: "/admin/advertisements", element: <AdminAdvertisements/>},


  { path: "*", element: <Navigate to="/" /> },
]);

export default router;