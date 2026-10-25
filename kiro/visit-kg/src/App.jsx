import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Places from './pages/Places'
import Mountains from './pages/Mountains'
import RoutesPage from './pages/RoutesPage'
import MapPage from './pages/MapPage'
import ReviewsPage from './pages/ReviewsPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminPlaces from './pages/admin/AdminPlaces'
import AdminRoutes from './pages/admin/AdminRoutes'
import AdminReviews from './pages/admin/AdminReviews'
import AdminSettings from './pages/admin/AdminSettings'
import RequireAuth from './components/admin/RequireAuth'

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<Layout />}>
        <Route path="/"          element={<Home />} />
        <Route path="/places"    element={<Places />} />
        <Route path="/mountains" element={<Mountains />} />
        <Route path="/routes"    element={<RoutesPage />} />
        <Route path="/map"       element={<MapPage />} />
        <Route path="/reviews"   element={<ReviewsPage />} />
      </Route>

      {/* ADMIN */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
        <Route index                element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard"     element={<Dashboard />} />
        <Route path="places"        element={<AdminPlaces />} />
        <Route path="routes"        element={<AdminRoutes />} />
        <Route path="reviews"       element={<AdminReviews />} />
        <Route path="settings"      element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
