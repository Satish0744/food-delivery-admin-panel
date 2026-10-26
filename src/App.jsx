import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AdminDataProvider } from "./context/AdminDataContext";
import AdminLayout from "./components/layout/AdminLayout";
import AdminLogin from "./pages/auth/AdminLogin";
import Dashboard from "./pages/dashboard/Dashboard";

import AllOrders from "./pages/orders/AllOrders";
import OrderDetails from "./pages/orders/OrderDetails";
import RefundRequests from "./pages/orders/RefundRequests";
import RestaurantList from "./pages/restaurants/RestaurantList";
import RestaurantDetails from "./pages/restaurants/RestaurantDetails";
import MenuManager from "./pages/restaurants/MenuManager";
import Registrations from "./pages/restaurants/Registrations";
import PartnerList from "./pages/delivery/PartnerList";
import PartnerDetails from "./pages/delivery/PartnerDetails";
import LiveTracking from "./pages/delivery/LiveTracking";
import CustomerList from "./pages/customers/CustomerList";
import CustomerDetails from "./pages/customers/CustomerDetails";
import Transactions from "./pages/payments/Transactions";
import Settlements from "./pages/payments/Settlements";
import FinancialReports from "./pages/payments/FinancialReports";
import OffersList from "./pages/offers/OffersList";
import CreateOffer from "./pages/offers/CreateOffer";
import Tickets from "./pages/support/Tickets";
import TicketDetails from "./pages/support/TicketDetails";
import Reports from "./pages/reports/Reports";
import PlatformSettings from "./pages/settings/PlatformSettings";
import AdminRoles from "./pages/settings/AdminRoles";
import AuditLogs from "./pages/settings/AuditLogs";

function ProtectedRoute({ children }) {
  const { admin } = useAuth();
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <AdminDataProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />

                  <Route path="orders" element={<AllOrders />} />
                  <Route path="orders/:id" element={<OrderDetails />} />
                  <Route path="orders/refunds" element={<RefundRequests />} />

                  <Route path="restaurants" element={<RestaurantList />} />
                  <Route path="restaurants/registrations" element={<Registrations />} />
                  <Route path="restaurants/:id" element={<RestaurantDetails />} />
                  <Route path="restaurants/:id/menu" element={<MenuManager />} />

                  <Route path="delivery" element={<PartnerList />} />
                  <Route path="delivery/tracking" element={<LiveTracking />} />
                  <Route path="delivery/:id" element={<PartnerDetails />} />

                  <Route path="customers" element={<CustomerList />} />
                  <Route path="customers/:id" element={<CustomerDetails />} />

                  <Route path="payments/transactions" element={<Transactions />} />
                  <Route path="payments/settlements" element={<Settlements />} />
                  <Route path="payments/reports" element={<FinancialReports />} />

                  <Route path="offers" element={<OffersList />} />
                  <Route path="offers/create" element={<CreateOffer />} />

                  <Route path="support/tickets" element={<Tickets />} />
                  <Route path="support/tickets/:id" element={<TicketDetails />} />

                  <Route path="reports" element={<Reports />} />

                  <Route path="settings/platform" element={<PlatformSettings />} />
                  <Route path="settings/roles" element={<AdminRoles />} />
                  <Route path="settings/audit" element={<AuditLogs />} />
                </Route>

                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </AdminDataProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}