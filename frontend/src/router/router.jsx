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

// Admin
import AdminDashboard from "../pages/Admin/Dashboard";

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
  
  //admin
  { path: "/admin/dashboard", element: <AdminDashboard/>},

  { path: "*", element: <Navigate to="/" /> },
]);

export default router;