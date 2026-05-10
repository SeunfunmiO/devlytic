import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    User,
    Bell,
    LogOut,
    Code2,
    CheckCircle,
    Clock,
    XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logout, setCredentials } from '../store/authSlice';
import { logoutUser } from '../services/authService';
import { fetchDeveloper } from '../services/fetchService';

const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard/developer' },
    { label: 'Browse Jobs', icon: <Briefcase size={18} />, path: '/jobs' },
    { label: 'My Jobs', icon: <CheckCircle size={18} />, path: '/dashboard/developer/my-jobs' },
    { label: 'Profile', icon: <User size={18} />, path: '/dashboard/developer/profile' },
    { label: 'Notifications', icon: <Bell size={18} />, path: '/dashboard/developer/notifications' },
];

const calculateProfileCompletion = (user) => {
    if (!user) return 0;
    const fields = [
        user.fullName,
        user.email,
        user.bio,
        user.avatar,
        user.githubUrl,
        user.portfolioUrl,
        user.resumeUrl,
        user.skills?.length > 0,
        user.availabilityStatus,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
};

const DeveloperDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch developer details on mount
    useEffect(() => {
        const loadDeveloper = async () => {
            try {
                const data = await fetchDeveloper();
                dispatch(setCredentials({
                    user: data.user,
                    role: data.user.role,
                    accessToken: null,
                }));
            } catch {
                // token refresh handled by axios interceptor
            }
        };
        if (!user?.fullName) loadDeveloper();
    }, [dispatch,user?.fullName]);

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

    const profileCompletion = calculateProfileCompletion(user);

    const stats = [
        {
            label: 'Applications Sent',
            value: user?.appliedJobs?.length || 0,
            icon: <Briefcase size={20} className="text-indigo-400" />,
            bg: 'bg-indigo-500/10',
        },
        {
            label: 'Shortlisted',
            value: 0,
            icon: <CheckCircle size={20} className="text-green-400" />,
            bg: 'bg-green-500/10',
        },
        {
            label: 'Pending Review',
            value: 0,
            icon: <Clock size={20} className="text-yellow-400" />,
            bg: 'bg-yellow-500/10',
        },
        {
            label: 'Rejected',
            value: 0,
            icon: <XCircle size={20} className="text-red-400" />,
            bg: 'bg-red-500/10',
        },
    ];

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
                <div className="mb-8">
                    <h2 className="text-xl lg:text-2xl font-bold">
                        Welcome back, {user?.fullName?.split(' ')[0] || 'Developer'}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Here is an overview of your job search activity
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-gray-900 border border-gray-800 rounded-xl p-4 lg:p-5 flex items-center gap-3 lg:gap-4"
                        >
                            <div className={`${stat.bg} p-2 lg:p-3 rounded-lg`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-xl lg:text-2xl font-bold">{stat.value}</p>
                                <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Applications */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 lg:p-6 mb-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-white">Recent Applications</h3>
                        <button
                            onClick={() => navigate('/dashboard/developer/applications')}
                            className="text-indigo-400 hover:text-indigo-300 text-sm transition"
                        >
                            View all
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <Briefcase size={36} className="mb-3 text-gray-700" />
                        <p className="text-sm">No applications yet</p>
                        <button
                            onClick={() => navigate('/jobs')}
                            className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition"
                        >
                            Browse available jobs
                        </button>
                    </div>
                </div>

                {/* Profile Completion */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 lg:p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">Profile Completion</h3>
                        <span className="text-indigo-400 text-sm font-semibold">{profileCompletion}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                        <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${profileCompletion}%` }}
                        />
                    </div>
                    <p className="text-gray-400 text-sm">
                        Your profile is {profileCompletion}% complete.{' '}
                        <button
                            onClick={() => navigate('/dashboard/developer/profile')}
                            className="text-indigo-400 hover:text-indigo-300 transition"
                        >
                            Complete your profile
                        </button>{' '}
                        to get better matches.
                    </p>
                </div>

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

export default DeveloperDashboard;