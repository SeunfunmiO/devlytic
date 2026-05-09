import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import { logout } from '../store/authSlice';
import { logoutUser } from '../services/authService';

const stats = [
    {
        label: 'Applications Sent',
        value: 0,
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

const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard/developer' },
    { label: 'Browse Jobs', icon: <Briefcase size={18} />, path: '/jobs' },
    { label: 'My Applications', icon: <CheckCircle size={18} />, path: '/dashboard/developer/applications' },
    { label: 'Profile', icon: <User size={18} />, path: '/dashboard/developer/profile' },
    { label: 'Notifications', icon: <Bell size={18} />, path: '/dashboard/developer/notifications' },
];

const DeveloperDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    return (
        <div className="min-h-screen bg-gray-950 text-white flex">

            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full">

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
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition w-full text-left"
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
            <main className="ml-64 flex-1 p-8">

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold">
                        Welcome back, {user?.fullName?.split(' ')[0]}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Here is an overview of your job search activity
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4"
                        >
                            <div className={`${stat.bg} p-3 rounded-lg`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Applications */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
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
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="font-semibold text-white mb-4">Profile Completion</h3>
                    <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                        <div className="bg-indigo-600 h-2 rounded-full w-1/4" />
                    </div>
                    <p className="text-gray-400 text-sm">
                        Your profile is 25% complete.{' '}
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
        </div>
    );
};

export default DeveloperDashboard;