import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    LayoutDashboard,
    Briefcase,
    User,
    Bell,
    LogOut,
    Code2,
    Bookmark,
    Github,
    Globe,
    Plus,
    X,
    Loader,
    Save,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logout, setCredentials } from '../store/authSlice';
import { logoutUser } from '../services/authService';
import { updateDeveloperProfile } from '../services/profileService';

const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard/developer' },
    { label: 'Browse Jobs', icon: <Briefcase size={18} />, path: '/jobs' },
    { label: 'My Jobs', icon: <Bookmark size={18} />, path: '/dashboard/developer/my-jobs' },
    { label: 'Profile', icon: <User size={18} />, path: '/dashboard/developer/profile' },
    { label: 'Notifications', icon: <Bell size={18} />, path: '/dashboard/developer/notifications' },
];

const validationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    bio: Yup.string().max(300, 'Bio must be at most 300 characters'),
    githubUrl: Yup.string().url('Enter a valid URL'),
    portfolioUrl: Yup.string().url('Enter a valid URL'),
});

const DeveloperProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [skillInput, setSkillInput] = useState('');
    const [skills, setSkills] = useState(user?.skills || []);

    const addSkill = () => {
        const trimmed = skillInput.trim();
        if (trimmed && !skills.includes(trimmed)) {
            setSkills([...skills, trimmed]);
            setSkillInput('');
        }
    };

    const removeSkill = (skill) => {
        setSkills(skills.filter((s) => s !== skill));
    };

    const formik = useFormik({
        initialValues: {
            fullName: user?.fullName || '',
            bio: user?.bio || '',
            githubUrl: user?.githubUrl || '',
            portfolioUrl: user?.portfolioUrl || '',
            availabilityStatus: user?.availabilityStatus || 'open',
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const data = await updateDeveloperProfile({
                    ...values,
                    skills,
                });
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

    const availabilityColors = {
        open: 'bg-green-500/10 text-green-400 border-green-500/30',
        'casually looking': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        'not looking': 'bg-red-500/10 text-red-400 border-red-500/30',
    };

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
                    <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition">
                        <LogOut size={20} />
                    </button>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-xl lg:text-2xl font-bold">My Profile</h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Keep your profile updated to get better job matches
                    </p>
                </div>

                <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">

                    {/* Availability Status */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <h3 className="font-semibold mb-4">Availability Status</h3>
                        <div className="flex flex-wrap gap-3">
                            {['open', 'casually looking', 'not looking'].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => formik.setFieldValue('availabilityStatus', status)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium border capitalize transition ${formik.values.availabilityStatus === status
                                            ? availabilityColors[status]
                                            : 'border-gray-700 text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-5">
                        <h3 className="font-semibold">Basic Information</h3>

                        {/* Full Name */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-300 font-medium">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formik.values.fullName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Your full name"
                                className={inputClass('fullName')}
                            />
                            {formik.touched.fullName && formik.errors.fullName && (
                                <p className="text-red-400 text-xs mt-1">{formik.errors.fullName}</p>
                            )}
                        </div>

                        {/* Bio */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-300 font-medium">Bio</label>
                            <textarea
                                name="bio"
                                value={formik.values.bio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Tell companies a bit about yourself, your experience and what you are looking for..."
                                rows={4}
                                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition resize-none ${formik.touched.bio && formik.errors.bio
                                        ? 'border-red-500'
                                        : 'border-gray-700 focus:border-indigo-500'
                                    }`}
                            />
                            <div className="flex items-center justify-between mt-1">
                                {formik.touched.bio && formik.errors.bio ? (
                                    <p className="text-red-400 text-xs">{formik.errors.bio}</p>
                                ) : <span />}
                                <p className="text-gray-500 text-xs">
                                    {formik.values.bio.length}/300
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Links */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-5">
                        <h3 className="font-semibold">Links</h3>

                        {/* GitHub */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-300 font-medium">GitHub URL</label>
                            <div className="relative">
                                <Github
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                                <input
                                    type="text"
                                    name="githubUrl"
                                    value={formik.values.githubUrl}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="https://github.com/username"
                                    className={`w-full bg-gray-800 border rounded-lg pl-9 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition ${formik.touched.githubUrl && formik.errors.githubUrl
                                            ? 'border-red-500'
                                            : 'border-gray-700 focus:border-indigo-500'
                                        }`}
                                />
                            </div>
                            {formik.touched.githubUrl && formik.errors.githubUrl && (
                                <p className="text-red-400 text-xs mt-1">{formik.errors.githubUrl}</p>
                            )}
                        </div>

                        {/* Portfolio */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-300 font-medium">Portfolio URL</label>
                            <div className="relative">
                                <Globe
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                                <input
                                    type="text"
                                    name="portfolioUrl"
                                    value={formik.values.portfolioUrl}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="https://yourportfolio.com"
                                    className={`w-full bg-gray-800 border rounded-lg pl-9 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition ${formik.touched.portfolioUrl && formik.errors.portfolioUrl
                                            ? 'border-red-500'
                                            : 'border-gray-700 focus:border-indigo-500'
                                        }`}
                                />
                            </div>
                            {formik.touched.portfolioUrl && formik.errors.portfolioUrl && (
                                <p className="text-red-400 text-xs mt-1">{formik.errors.portfolioUrl}</p>
                            )}
                        </div>

                    </div>

                    {/* Skills */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-4">
                        <h3 className="font-semibold">Skills</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && (e.preventDefault(), addSkill())
                                }
                                placeholder="e.g. React, Node.js, TypeScript"
                                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                            />
                            <button
                                type="button"
                                onClick={addSkill}
                                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition text-sm"
                            >
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        {skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm rounded-lg"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="text-indigo-400 hover:text-red-400 transition"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
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

export default DeveloperProfilePage;