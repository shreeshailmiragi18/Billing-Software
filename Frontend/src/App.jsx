import Menubar from "./Components/Menubar/Menuebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import ManageCategory from "./pages/ManageCategory/ManageCategory";
import ManageItems from "./pages/ManageItems/ManageItems";
import Explore from "./pages/Explore/Explore";
import ManageUsers from "./pages/ManageUsers/ManageUsers";
import UserDetails from "./pages/UserDetails/UserDetails";
import Login from "./pages/Login/Login";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import OrderHistory from "./pages/OrderHistory/OrderHistory";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import { Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound/NotFound";

const App = () => {
  const location = useLocation();
  const { auth, initialized } = useContext(AppContext);
  const LoginRoute = ({ element }) => {
    // Wait for auth initialization (localStorage read) before deciding
    if (!initialized) return null;
    if (auth.token) {
      return <Navigate to="/dashboard" replace />;
    }
    return element;
  };

  const ProtectedRoute = ({ element, allowedRoles }) => {
    // Wait for auth initialization before enforcing protection
    if (!initialized) return null;

    if (!auth.token) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(auth.role)) {
      return <Navigate to="/dashboard" replace />;
    }
    return element;
  };
  return (
    <>
      <div>
        {location.pathname !== "/login" && <Menubar />}
        <Toaster />
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginRoute element={<Login />} />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />

          <Route
            path="/explore"
            element={<ProtectedRoute element={<Explore />} />}
          />

          <Route
            path="/orders"
            element={<ProtectedRoute element={<OrderHistory />} />}
          />

          {/* Admin routes */}
          <Route
            path="/category"
            element={
              <ProtectedRoute
                element={<ManageCategory />}
                allowedRoles={["ROLE_ADMIN"]}
              />
            }
          />

          <Route
            path="/items"
            element={
              <ProtectedRoute
                element={<ManageItems />}
                allowedRoles={["ROLE_ADMIN"]}
              />
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute
                element={<ManageUsers />}
                allowedRoles={["ROLE_ADMIN"]}
              />
            }
          />

          <Route
            path="/users/:id"
            element={
              <ProtectedRoute
                element={<UserDetails />}
                allowedRoles={["ROLE_ADMIN"]}
              />
            }
          />

          {/* Default */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};
export default App;
