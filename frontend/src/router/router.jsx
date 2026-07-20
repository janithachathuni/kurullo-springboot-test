import { createBrowserRouter, Navigate } from "react-router-dom";

// General
import Home from "../components/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import OAuth2Success from "../pages/OAuth2Success";
import ForgotPassword from "../pages/ForgotPassword";
import ChangePassword from "../pages/ChangePassword";
import Error from "../pages/Error";
import Events from "../pages/Events";
import Articles from "../pages/Articles";
import About from "../pages/About";
import Birdlist from "../pages/BirdList";

// Birds
import Bird from "../pages/Bird";

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
import SingleChecklist from "../pages/Birder/SingleChecklist";
import SingleTrip from "../pages/Birder/SingleTrip";
import EditProfile from "../pages/Birder/EditProfile";
import Discussion from "../pages/Birder/Discussion";

// Admin
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminBirdList from "../pages/Admin/BirdList";
import AdminContentModeration from "../pages/Admin/ContentModeration";
import AdminManageModerators from "../pages/Admin/ManageModerators";
import AdminNotifications from "../pages/Admin/Notifications";
import AdminSettings from "../pages/Admin/Settings";
import AdminStatistics from "../pages/Admin/Statistics";
import AdminAdvertisements from "../pages/Admin/Advertisements";
import AdminAddBird from "../pages/Admin/AddBird";
import AdminEditBird from "../pages/Admin/EditBird";
import AdminReports from "../pages/Admin/Reports";
import AdminEventsArticlesManage from "../pages/Admin/EventsArticlesManage";
import AdminFeaturedBirds from "../pages/Admin/FeaturedBirds";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/oauth2/success", element: <OAuth2Success /> },
  { path: "/complete-registration", element: <CompleteRegistration /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/change-password", element: <ChangePassword /> },
  { path: "/bird/:id", element: <Bird /> },
  { path: "/events", element: <Events /> },
  { path: "/articles", element: <Articles /> },
  { path: "/about", element: <About /> },
  { path: "/birdlist", element: <Birdlist /> },
  // { path: "/bird", element: <Bird /> },

  // birder
  { path: "/create-profile", element: <CreateProfile /> },
  { path: "/:username", element: <BirderBlog/>},
  { path: "/dashboard", element: <BirderDashboard/> },
  { path: "/settings", element: <BirderSettings/>},
  { path: "/checklists", element: <BirderChecklists/>},
  { path: "/trips", element: <BirderTrips/>},
  { path: "/notifications", element: <BirderNotifications/>},
  { path: "/forum", element: <BirderForum/>},
  { path: "/checklists/:checklistId", element: <SingleChecklist/>},
  { path: "/trips/:tripId", element: <SingleTrip/>},
  { path: "/forum/:forumId", element: <Discussion/>},
  // { path: "/edit-profile", element: <EditProfile/>},
  
  //admin
  { path: "/admin/dashboard", element: <AdminDashboard/>},
  { path: "/admin/bird-data", element: <AdminBirdList/>},
  { path: "/admin/content-moderation", element: <AdminContentModeration/>},
  { path: "/admin/manage-moderators", element: <AdminManageModerators/>},
  { path: "/admin/notifications", element: <AdminNotifications/>},
  { path: "/admin/settings", element: <AdminSettings/>},
  { path: "/admin/statistics", element: <AdminStatistics/>},
  { path: "/admin/advertisements", element: <AdminAdvertisements/>},
  { path: "/admin/add-bird", element: <AdminAddBird/>},
  { path: "/admin/edit-bird/:id", element: <AdminEditBird/>},
  { path: "/admin/reports", element: <AdminReports/>},
  { path: "/admin/events-articles", element: <AdminEventsArticlesManage/>},
  { path: "/admin/featured/:id", element: <AdminFeaturedBirds/>},


  { path: "*", element: <Error /> },
  { path: "/404", element: <Error /> },
{ path: "*", element: <Navigate to="/404" replace /> },
]);

export default router;