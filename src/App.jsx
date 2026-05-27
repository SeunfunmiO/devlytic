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
import MyJobsPage from './pages/MyJobsPage';
import JobBoardPage from './pages/JobBoardPage';
import JobDetailPage from './pages/JobDetailPage';
import PostJobPage from './pages/PostJobPage';
import CompanyJobsPage from './pages/CompanyJobsPage';
import DeveloperProfilePage from './pages/DeveloperProfilePage';
import CompanyProfilePage from './pages/CompanyProfilePage';
import EditJobPage from './pages/EditJobPage';

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
        <Route path="/jobs" element={<JobBoardPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />

        {/* Developer Protected Routes */}
        <Route path="/dashboard/developer" element={
          <ProtectedRoute allowedRole="developer">
            <DeveloperDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/developer/my-jobs" element={
          <ProtectedRoute allowedRole="developer">
            <MyJobsPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/developer/profile" element={
          <ProtectedRoute allowedRole="developer">
            <DeveloperProfilePage />
          </ProtectedRoute>
        } />

        {/* Company Protected Routes */}
        <Route path="/dashboard/company" element={
          <ProtectedRoute allowedRole="company">
            <CompanyDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/company/jobs" element={
          <ProtectedRoute allowedRole="company">
            <CompanyJobsPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/company/jobs/new" element={
          <ProtectedRoute allowedRole="company">
            <PostJobPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/company/profile" element={
          <ProtectedRoute allowedRole="company">
            <CompanyProfilePage />
          </ProtectedRoute>
        } />
        import EditJobPage from './pages/EditJobPage';

        <Route
          path="/dashboard/company/jobs/:id/edit"
          element={
            <ProtectedRoute allowedRole="company">
              <EditJobPage />
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