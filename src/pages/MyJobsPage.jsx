import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    LayoutDashboard,
    Briefcase,
    User,
    Bell,
    LogOut,
    Code2,
    Bookmark,
    CheckCircle,
    Calendar,
    Archive,
    MapPin,
    Building2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logout } from '../store/authSlice';
import { logoutUser } from '../services/authService';

const tabs = [
    { label: 'Saved', key: 'saved', icon: <Bookmark size={16} /> },
    { label: 'Applied', key: 'applied', icon: <CheckCircle size={16} /> },
    { label: 'Interviews', key: 'interviews', icon: <Calendar size={16} /> },
    { label: 'Archived', key: 'archived', icon: <Archive size={16} /> },
];

const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard/developer' },
    { label: 'Browse Jobs', icon: <Briefcase size={18} />, path: '/jobs' },
    { label: 'My Jobs', icon: <Bookmark size={18} />, path: '/dashboard/developer/my-jobs' },
    { label: 'Profile', icon: <User size={18} />, path: '/dashboard/developer/profile' },
    { label: 'Notifications', icon: <Bell size={18} />, path: '/dashboard/developer/notifications' },
];

const EmptyState = ({ icon, message, subMessage, action, actionLabel }) => (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <div className="mb-3 text-gray-700">{icon}</div>
        <p className="text-sm font-medium text-gray-400">{message}</p>
        {subMessage && <p className="text-xs mt-1 text-gray-600">{subMessage}</p>}
        {action && (
            <button
                onClick={action}
                className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition"
            >
                {actionLabel}
            </button>
        )}
    </div>
);

// Sample job card for when data is available
const JobCard = ({ job, tabKey }) => {
    const statusColors = {
        saved: 'bg-blue-500/10 text-blue-400',
        applied: 'bg-indigo-500/10 text-indigo-400',
        interviews: 'bg-green-500/10 text-green-400',
        archived: 'bg-gray-500/10 text-gray-400',
    };

    const statusLabels = {
        saved: 'Saved',
        applied: 'Applied',
        interviews: 'Interview Scheduled',
        archived: 'Archived',
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-indigo-500 transition">
            <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[tabKey]}`}>
                    {statusLabels[tabKey]}
                </span>
            </div>
            <h3 className="font-semibold text-white mb-1">{job.title}</h3>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <Building2 size={14} />
                <span>{job.company}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin size={14} />
                <span>{job.location}</span>
            </div>
        </div>
    );
};

const MyJobsPage = () => {
    const [activeTab, setActiveTab] = useState('applied');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // These will be replaced with real data from backend in Phase 3
    const jobsByTab = {
        saved: [],
        applied: [],
        interviews: [],
        archived: [],
    };

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

    const emptyStates = {
        saved: {
            icon: <Bookmark size={36} />,
            message: 'No saved jobs yet',
            subMessage: 'Save jobs you are interested in to apply later',
            actionLabel: 'Browse jobs',
            action: () => navigate('/jobs'),
        },
        applied: {
            icon: <CheckCircle size={36} />,
            message: 'No applications yet',
            subMessage: 'Jobs you apply to will appear here',
            actionLabel: 'Browse available jobs',
            action: () => navigate('/jobs'),
        },
        interviews: {
            icon: <Calendar size={36} />,
            message: 'No interviews scheduled',
            subMessage: 'When a company moves you to interview stage it will appear here',
            actionLabel: null,
            action: null,
        },
        archived: {
            icon: <Archive size={36} />,
            message: 'No archived jobs',
            subMessage: 'Jobs you dismiss or are no longer interested in will appear here',
            actionLabel: null,
            action: null,
        },
    };

    const currentEmpty = emptyStates[activeTab];
    const currentJobs = jobsByTab[activeTab];

    return (
        <div className="min-h-screen bg-gray-950 text-white flex">

            {/* Sidebar — hidden on mobile */}
            <aside className="hidden lg:flex w-64 bg-gray-900 border-r border-gray-800 flex-col fixed h-full">

                {/* Logo */}
                <div className="px-6 py-5 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                        <Code2 size={22} className="text-indigo-500" />
                        <h1 className="text-xl font-bold text-white">Devlytic</h1>
                    </div>
                </div>

                {/* Nav */}
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

                {/* Logout */}
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
            <main className="lg:ml-64 flex-1 p-4 lg:p-8 pb-24 lg:pb-8">

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
                <div className="mb-6">
                    <h2 className="text-xl lg:text-2xl font-bold">My Jobs</h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Track your saved, applied, and interview progress
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${activeTab === tab.key
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-indigo-500'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-gray-800 text-gray-400'
                                }`}>
                                {jobsByTab[tab.key].length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {currentJobs.length === 0 ? (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl">
                        <EmptyState
                            icon={currentEmpty.icon}
                            message={currentEmpty.message}
                            subMessage={currentEmpty.subMessage}
                            action={currentEmpty.action}
                            actionLabel={currentEmpty.actionLabel}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentJobs.map((job, index) => (
                            <JobCard key={index} job={job} tabKey={activeTab} />
                        ))}
                    </div>
                )}

            </main>

            {/* Bottom Nav — mobile only */}
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

export default MyJobsPage;