import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Sidebar } from "./components/Sidebar";
import { Login } from "./screens/Login";
import { Register } from "./screens/Register";
import { Dashboard } from "./screens/Dashboard";
import { CompanyProfile } from "./screens/CompanyProfile";
import { PackageManagement } from "./screens/PackageManagement";
import { AddEditPackage } from "./screens/AddEditPackage";
import { BookingManagement } from "./screens/BookingManagement";
import { BookingDetails } from "./screens/BookingDetails";
import { Messages } from "./screens/Messages";
import { ChatWindow } from "./screens/ChatWindow";
import { Orders } from "./screens/Orders";
import { Payments } from "./screens/Payments";
import { Reviews } from "./screens/Reviews";
import { Reports } from "./screens/Reports";

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<CompanyProfile />} />
          <Route path="/packages" element={<PackageManagement />} />
          <Route path="/packages/new" element={<AddEditPackage />} />
          <Route path="/packages/edit/:id" element={<AddEditPackage />} />
          <Route path="/bookings" element={<BookingManagement />} />
          <Route path="/bookings/:id" element={<BookingDetails />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:id" element={<ChatWindow />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
