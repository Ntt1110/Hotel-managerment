import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home/Home";
import RoomDetail from "./pages/RoomDetail/RoomDetail";
import MyBookings from "./pages/MyBookings/MyBookings";
import Dashboard from "./pages/Manager/Dashboard";
import RoomsManagement from "./pages/Manager/RoomsManagement";
import BookingsManagement from "./pages/Manager/BookingsManagement";
import ServicesManagement from "./pages/Manager/ServicesManagement";
import HotelSettings from "./pages/Manager/HotelSettings";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute role="customer">
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute role="manager">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/rooms"
            element={
              <ProtectedRoute role="manager">
                <RoomsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/bookings"
            element={
              <ProtectedRoute role="manager">
                <BookingsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/services"
            element={
              <ProtectedRoute role="manager">
                <ServicesManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/settings"
            element={
              <ProtectedRoute role="manager">
                <HotelSettings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}