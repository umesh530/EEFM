import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Suppliers from './pages/Suppliers';
import Materials from './pages/Materials';
import Procurement from './pages/Procurement';
import SupplierComparison from './pages/SupplierComparison';
import Decision from './pages/Decision';
import Analytics from './pages/Analytics';
import ProcurementHistory from './pages/ProcurementHistory';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Chatbot from './components/Chatbot';
import { LayoutDashboard, ShoppingCart, Briefcase, Users, Package, BarChart3 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-lg font-semibold text-slate-600">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppShell = () => {
  const navItems = [
    { label: 'Dashboard', to: '/', icon: LayoutDashboard },
    { label: 'Projects', to: '/projects', icon: Briefcase },
    { label: 'Procurement', to: '/procurement', icon: ShoppingCart },
    { label: 'Suppliers', to: '/suppliers', icon: Users },
    { label: 'Materials', to: '/materials', icon: Package },
    { label: 'Supplier Comparison', to: '/supplier-comparison', icon: BarChart3 },
    { label: 'AI Decisions', to: '/decision', icon: BarChart3 },
    { label: 'Analytics', to: '/analytics', icon: BarChart3 },
    { label: 'Procurement History', to: '/history', icon: Briefcase },
  ];

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-100 text-slate-800">
      <Sidebar items={navItems} />
      <div className="flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/procurement" element={<Procurement />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/supplier-comparison" element={<SupplierComparison />} />
            <Route path="/decision" element={<Decision />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/history" element={<ProcurementHistory />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
      <Chatbot />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
