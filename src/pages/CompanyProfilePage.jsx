import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Bell,
  LogOut,
  Code2,
  Building2,
  Globe,
  Loader,
  Save,
  UploadCloud,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logout, setCredentials } from '../store/authSlice';
import { logoutUser } from '../services/authService';
import { updateCompanyProfile } from '../services/profileService';
import { useState } from 'react';
import { uploadLogo } from '../services/uploadService';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard/company' },
  { label: 'My Jobs', icon: <Briefcase size={18} />, path: '/dashboard/company/jobs' },
  { label: 'Applicants', icon: <Users size={18} />, path: '/dashboard/company/applicants' },
  { label: 'Profile', icon: <Building2 size={18} />, path: '/dashboard/company/profile' },
  { label: 'Notifications', icon: <Bell size={18} />, path: '/dashboard/company/notifications' },
];

const validationSchema = Yup.object({
  companyName: Yup.string().required('Company name is required'),
  website: Yup.string().url('Enter a valid URL'),
  description: Yup.string().max(500, 'Description must be at most 500 characters'),
});

const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'E-commerce',
  'Media',
  'Consulting',
  'Gaming',
  'Cybersecurity',
  'AI / Machine Learning',
  'Other',
];

const CompanyProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingLogo(true);
      const data = await uploadLogo(file);
      dispatch(setCredentials({
        user: data.user,
        role: data.user.role,
        accessToken: null,
      }));
      toast.success('Logo updated successfully');
    } catch {
      toast.error('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      companyName: user?.companyName || '',
      website: user?.website || '',
      industry: user?.industry || '',
      description: user?.description || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const data = await updateCompanyProfile(values);
        dispatch(setCredentials({
          user: data.user,
          role: data.user.role,
          accessToken: null,
        }));
        toast.success('Profile updated successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await logoutUser(refreshToken);
    } catch {
      // fail silently
    } finally {
      dispatch(logout());
      localStorage.removeItem('refreshToken');
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const inputClass = (field) =>
    `w-full bg-gray-800 border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition ${formik.touched[field] && formik.errors[field]
      ? 'border-red-500 focus:border-red-500'
      : 'border-gray-700 focus:border-indigo-500'
    }`;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex overflow-x-hidden">

      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-gray-900 border-r border-gray-800 flex-col fixed h-full">
        <div className="px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Code2 size={22} className="text-indigo-500" />
            <h1 className="text-xl font-bold text-white">Devlytic</h1>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition w-full text-left ${location.pathname === item.path
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-5 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:text-white hover:bg-red-500/10 transition w-full text-left"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 flex-1 p-4 lg:p-8 pb-24 lg:pb-8 min-w-0">

        {/* Mobile Top Bar */}
        <div className="flex lg:hidden items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Code2 size={20} className="text-indigo-500" />
            <h1 className="text-lg font-bold">Devlytic</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 transition"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-xl lg:text-2xl font-bold">Company Profile</h2>
          <p className="text-gray-400 text-sm mt-1">
            Keep your profile updated to attract the best developers
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">

          {/* Basic Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-5">
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={18} className="text-indigo-400" />
              <h3 className="font-semibold">Basic Information</h3>
            </div>


            {/* Logo Upload */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4">Company Logo</h3>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-xl bg-indigo-600/20 border-2 border-indigo-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {user?.logo ? (
                    <img
                      src={user.logo}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 size={32} className="text-indigo-400" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-medium px-4 py-2 rounded-lg cursor-pointer transition">
                    <UploadCloud size={16} />
                    {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                    />
                  </label>
                  <p className="text-xs text-gray-500">JPG, PNG or WEBP. Max 5MB.</p>
                </div>
              </div>
            </div>

            {/* Company Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300 font-medium">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Your company name"
                className={inputClass('companyName')}
              />
              {formik.touched.companyName && formik.errors.companyName && (
                <p className="text-red-400 text-xs mt-1">{formik.errors.companyName}</p>
              )}
            </div>

            {/* Industry */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300 font-medium">Industry</label>
              <select
                name="industry"
                value={formik.values.industry}
                onChange={formik.handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="">Select an industry</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Website */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-300 font-medium">Website</label>
              <div className="relative">
                <Globe
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  name="website"
                  value={formik.values.website}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="https://yourcompany.com"
                  className={`w-full bg-gray-800 border rounded-lg pl-9 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition ${formik.touched.website && formik.errors.website
                      ? 'border-red-500'
                      : 'border-gray-700 focus:border-indigo-500'
                    }`}
                />
              </div>
              {formik.touched.website && formik.errors.website && (
                <p className="text-red-400 text-xs mt-1">{formik.errors.website}</p>
              )}
            </div>

          </div>

          {/* Description */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-4">
            <h3 className="font-semibold">About the Company</h3>
            <div className="flex flex-col gap-1">
              <textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Tell developers about your company, culture, mission and what makes you a great place to work..."
                rows={6}
                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition resize-none ${formik.touched.description && formik.errors.description
                    ? 'border-red-500'
                    : 'border-gray-700 focus:border-indigo-500'
                  }`}
              />
              <div className="flex items-center justify-between mt-1">
                {formik.touched.description && formik.errors.description ? (
                  <p className="text-red-400 text-xs">{formik.errors.description}</p>
                ) : <span />}
                <p className="text-gray-500 text-xs">
                  {formik.values.description.length}/500
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition"
          >
            {formik.isSubmitting ? (
              <>
                <Loader size={18} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={18} /> Save Profile
              </>
            )}
          </button>

        </form>
      </main>

      {/* Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex items-center justify-around px-2 py-3 z-50">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 text-xs transition px-2 ${location.pathname === item.path
                ? 'text-indigo-400'
                : 'text-gray-500 hover:text-white'
              }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
};

export default CompanyProfilePage;