import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import { useActivityTracker } from './hooks/useActivityTracker';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import ServiceDetail from './pages/public/ServiceDetail';
import Projects from './pages/public/Projects';
import ProjectDetail from './pages/public/ProjectDetail';
import HowWeWork from './pages/public/HowWeWork';
import Team from './pages/public/Team';
import PayInvoice from './pages/public/PayInvoice';
import Insights from './pages/public/Insights';
import InsightDetail from './pages/public/InsightDetail';
import Contact from './pages/public/Contact';
import RequestQuote from './pages/public/RequestQuote';
import Estimator from './pages/public/Estimator';
import Login from './pages/public/Login';
import Sustainability from './pages/public/Sustainability';
import Safety from './pages/public/Safety';
import Diversity from './pages/public/Diversity';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCustomers from './pages/admin/Customers';
import AdminProjects from './pages/admin/Projects';
import AdminQuotes from './pages/admin/Quotes';
import AdminInvoices from './pages/admin/Invoices';
import AdminSettings from './pages/admin/Settings';
import AdminEmployees from './pages/admin/Employees';
import AdminServices from './pages/admin/Services';
import AdminMessages from './pages/admin/Messages';
import AdminNotifications from './pages/admin/Notifications';
import AdminActivityLogs from './pages/admin/ActivityLogs';
import AdminAllThings from './pages/admin/AllThings';

import CustomerLayout from './layouts/CustomerLayout';
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerProjects from './pages/customer/Projects';
import CustomerQuotes from './pages/customer/Quotes';
import CustomerInvoices from './pages/customer/Invoices';
import CustomerProfile from './pages/customer/Profile';
import CustomerRequestProject from './pages/customer/RequestProject';

const queryClient = new QueryClient();

function AppRoutes() {
  useActivityTracker();
  return (
    <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/how-we-work" element={<HowWeWork />} />
              <Route path="/team" element={<Team />} />
              <Route path="/pay/:invoiceNumber" element={<PayInvoice />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/insights/:slug" element={<InsightDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/request-quote" element={<RequestQuote />} />
              <Route path="/estimator" element={<Estimator />} />
              <Route path="/login" element={<Login />} />
              <Route path="/sustainability" element={<Sustainability />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/diversity" element={<Diversity />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="quotes" element={<AdminQuotes />} />
              <Route path="invoices" element={<AdminInvoices />} />
              <Route path="employees" element={<AdminEmployees />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="activity-logs" element={<AdminActivityLogs />} />
              <Route path="all-things" element={<AdminAllThings />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="/customer" element={<CustomerLayout />}>
              <Route index element={<CustomerDashboard />} />
              <Route path="projects" element={<CustomerProjects />} />
              <Route path="request-project" element={<CustomerRequestProject />} />
              <Route path="quotes" element={<CustomerQuotes />} />
              <Route path="invoices" element={<CustomerInvoices />} />
              <Route path="profile" element={<CustomerProfile />} />
            </Route>
          </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
