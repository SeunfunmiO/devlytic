import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthInit from './hooks/useAuthInit';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterDeveloper from './pages/RegisterDeveloper';
import RegisterCompany from './pages/RegisterCompany';
import DeveloperDashboard from './pages/DeveloperDashboard';
import CompanyDashboard from './pages/CompanyDashboard';

const AppContent = () => {
  useAuthInit();

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/developer" element={<RegisterDeveloper />} />
        <Route path="/register/company" element={<RegisterCompany />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard/developer"
          element={
            <ProtectedRoute allowedRole="developer">
              <DeveloperDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/company"
          element={
            <ProtectedRoute allowedRole="company">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;