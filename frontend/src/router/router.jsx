import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Birder/Dashboard";
import OAuth2Success from "../pages/OAuth2Success";
import CompleteRegistration from "../pages/CompleteRegistration";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/oauth2/success", element: <OAuth2Success /> },
  { path: "/complete-registration", element: <CompleteRegistration /> },

  { path: "*", element: <Navigate to="/" /> },
]);

export default router;