import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BranchProvider } from './context/BranchContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout & Guards
import { DashboardLayout } from './components/layout/DashboardLayout';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { SalonsDirectoryPage } from './pages/public/SalonsDirectoryPage';
import { SalonDetailsPage } from './pages/public/SalonDetailsPage';
import { PublicServicesPage } from './pages/public/PublicServicesPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Customer Pages
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';
import { CustomerExplorePage } from './pages/customer/CustomerExplorePage';
import { CustomerSalonsPage } from './pages/customer/CustomerSalonsPage';
import { CustomerSalonDetailPage } from './pages/customer/CustomerSalonDetailPage';
import { CustomerServicesPage } from './pages/customer/CustomerServicesPage';
import { CustomerBookingWizardPage } from './pages/customer/CustomerBookingWizardPage';
import { CustomerBookingsPage } from './pages/customer/CustomerBookingsPage';
import { BookingDetailPage } from './pages/customer/BookingDetailPage';
import { CustomerFavoritesPage } from './pages/customer/CustomerFavoritesPage';
import { CustomerReviewsPage } from './pages/customer/CustomerReviewsPage';
import { CustomerNotificationsPage } from './pages/customer/CustomerNotificationsPage';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';
import { CustomerSettingsPage } from './pages/customer/CustomerSettingsPage';

// Owner Pages
import { OwnerDashboardPage } from './pages/owner/OwnerDashboardPage';
import { OwnerAppointmentsPage } from './pages/owner/OwnerAppointmentsPage';
import { OwnerCalendarPage } from './pages/owner/OwnerCalendarPage';
import { OwnerPeoplePage } from './pages/owner/OwnerPeoplePage';
import { OwnerServicesPage } from './pages/owner/OwnerServicesPage';
import { OwnerBranchesPage } from './pages/owner/OwnerBranchesPage';
import { OwnerQueuePage } from './pages/owner/OwnerQueuePage';
import { OwnerPaymentsPage } from './pages/owner/OwnerPaymentsPage';
import { OwnerInventoryPage } from './pages/owner/OwnerInventoryPage';
import { OwnerLiveMonitorPage } from './pages/owner/OwnerLiveMonitorPage';
import { OwnerOffersPage } from './pages/owner/OwnerOffersPage';
import { OwnerReviewsPage } from './pages/owner/OwnerReviewsPage';
import { OwnerReportsPage } from './pages/owner/OwnerReportsPage';
import { OwnerAiSchedulingPage } from './pages/owner/OwnerAiSchedulingPage';
import { OwnerIntelligencePage } from './pages/owner/OwnerIntelligencePage';
import { OwnerSettingsPage } from './pages/owner/OwnerSettingsPage';

// Member Pages
import { MemberDashboardPage } from './pages/member/MemberDashboardPage';
import { MemberAppointmentsPage } from './pages/member/MemberAppointmentsPage';
import { MemberCalendarPage } from './pages/member/MemberCalendarPage';
import { MemberAvailabilityPage } from './pages/member/MemberAvailabilityPage';
import { MemberCustomersPage } from './pages/member/MemberCustomersPage';
import { MemberPerformancePage } from './pages/member/MemberPerformancePage';
import { MemberNotificationsPage } from './pages/member/MemberNotificationsPage';
import { MemberProfilePage } from './pages/member/MemberProfilePage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BranchProvider>
          <NotificationProvider>
            <Routes>
              {/* ═══════════════════════════════════════════════════════════
                  PUBLIC ROUTES
              ═══════════════════════════════════════════════════════════ */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/services" element={<PublicServicesPage />} />
              <Route path="/salons" element={<SalonsDirectoryPage />} />
              <Route path="/salons/:slug" element={<SalonDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* ═══════════════════════════════════════════════════════════
                  CUSTOMER PORTAL ROUTES
              ═══════════════════════════════════════════════════════════ */}
              <Route
                path="/customer"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/customer/dashboard" replace />} />
                <Route path="dashboard" element={<CustomerDashboardPage />} />
                <Route path="explore" element={<CustomerExplorePage />} />
                <Route path="salons" element={<CustomerSalonsPage />} />
                <Route path="salons/:slug" element={<CustomerSalonDetailPage />} />
                <Route path="services" element={<CustomerServicesPage />} />
                <Route path="book" element={<CustomerBookingWizardPage />} />
                <Route path="bookings" element={<CustomerBookingsPage />} />
                <Route path="bookings/:id" element={<BookingDetailPage />} />
                <Route path="favorites" element={<CustomerFavoritesPage />} />
                <Route path="reviews" element={<CustomerReviewsPage />} />
                <Route path="notifications" element={<CustomerNotificationsPage />} />
                <Route path="profile" element={<CustomerProfilePage />} />
                <Route path="settings" element={<CustomerSettingsPage />} />
              </Route>

              {/* ═══════════════════════════════════════════════════════════
                  SALON OWNER PORTAL ROUTES (UNIFIED DASHBOARD SHELL)
              ═══════════════════════════════════════════════════════════ */}
              <Route
                path="/owner"
                element={
                  <ProtectedRoute allowedRoles={['salon_owner']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/owner/dashboard" replace />} />
                <Route path="dashboard" element={<OwnerDashboardPage />} />
                <Route path="appointments" element={<OwnerAppointmentsPage />} />
                <Route path="calendar" element={<OwnerCalendarPage />} />
                <Route path="people" element={<OwnerPeoplePage />} />
                <Route path="customers" element={<OwnerPeoplePage />} />
                <Route path="team" element={<OwnerPeoplePage />} />
                <Route path="services" element={<OwnerServicesPage />} />
                <Route path="branches" element={<OwnerBranchesPage />} />
                <Route path="queue" element={<OwnerQueuePage />} />
                <Route path="payments" element={<OwnerPaymentsPage />} />
                <Route path="inventory" element={<OwnerInventoryPage />} />
                <Route path="live-monitor" element={<OwnerLiveMonitorPage />} />
                <Route path="offers" element={<OwnerOffersPage />} />
                <Route path="reviews" element={<OwnerReviewsPage />} />
                <Route path="analytics" element={<OwnerReportsPage />} />
                <Route path="reports" element={<OwnerReportsPage />} />
                <Route path="ai-scheduling" element={<OwnerAiSchedulingPage />} />
                <Route path="intelligence" element={<OwnerIntelligencePage />} />
                <Route path="settings" element={<OwnerSettingsPage />} />
              </Route>

              {/* ═══════════════════════════════════════════════════════════
                  SALON MEMBER (STAFF) PORTAL ROUTES (SHARED UNIFIED SHELL)
              ═══════════════════════════════════════════════════════════ */}
              <Route
                path="/member"
                element={
                  <ProtectedRoute allowedRoles={['salon_member']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/member/dashboard" replace />} />
                <Route path="dashboard" element={<MemberDashboardPage />} />
                <Route path="appointments" element={<MemberAppointmentsPage />} />
                <Route path="calendar" element={<MemberCalendarPage />} />
                <Route path="availability" element={<MemberAvailabilityPage />} />
                <Route path="customers" element={<MemberCustomersPage />} />
                <Route path="performance" element={<MemberPerformancePage />} />
                <Route path="notifications" element={<MemberNotificationsPage />} />
                <Route path="profile" element={<MemberProfilePage />} />
              </Route>

              {/* ═══════════════════════════════════════════════════════════
                  404 NOT FOUND FALLBACK
              ═══════════════════════════════════════════════════════════ */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </NotificationProvider>
        </BranchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
