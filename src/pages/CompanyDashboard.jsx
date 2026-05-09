import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Bell,
    LogOut,
    Code2,
    Plus,
    Building2,
    CheckCircle,
    Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logout } from '../store/authSlice';
import { logoutUser } from '../services/authService';

const stats = [
    {
        label: 'Jobs Posted',
        value: 0,
        icon: <Briefcase size={20} className="text-indigo-400" />,
        bg: 'bg-indigo-500/10',
    },
    {
        label: 'Total Applicants',
        value: 0,
        icon: <Users size={20} className="text-green-400" />,
        bg: 'bg-green-500/10',
    },
    {
        label: 'Shortlisted',
        value: 0,
        icon: <CheckCircle size={20} className="text-yellow-400" />,
        bg: 'bg-yellow-500/10',
    },
    {
        label: 'Open Roles',
        value: 0,
        icon: <Clock size={20} className="text-blue-400" />,
        bg: 'bg-blue-500/10',
    },
];

const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard/company' },
    { label: 'My Jobs', icon: <Briefcase size={18} />, path: '/dashboard/company/jobs' },
    { label: 'Applicants', icon: <Users size={18} />, path: '/dashboard/company/applicants' },
    { label: 'Profile', icon: <Building2 size={18} />, path: '/dashboard/company/profile' },
    { label: 'Notifications', icon: <Bell size={18} />, path: '/dashboard/company/notifications' },
];

const CompanyDashboard = () => {
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
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold">
                            Welcome, {user?.name || user?.companyName}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Manage your job listings and applicants
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/company/jobs/new')}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                    >
                        <Plus size={16} />
                        Post a Job
                    </button>
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

                {/* Recent Jobs */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-white">Recent Job Listings</h3>
                        <button
                            onClick={() => navigate('/dashboard/company/jobs')}
                            className="text-indigo-400 hover:text-indigo-300 text-sm transition"
                        >
                            View all
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <Briefcase size={36} className="mb-3 text-gray-700" />
                        <p className="text-sm">No jobs posted yet</p>
                        <button
                            onClick={() => navigate('/dashboard/company/jobs/new')}
                            className="mt-4 flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition"
                        >
                            <Plus size={16} />
                            Post your first job
                        </button>
                    </div>
                </div>

                {/* Recent Applicants */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-white">Recent Applicants</h3>
                        <button
                            onClick={() => navigate('/dashboard/company/applicants')}
                            className="text-indigo-400 hover:text-indigo-300 text-sm transition"
                        >
                            View all
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <Users size={36} className="mb-3 text-gray-700" />
                        <p className="text-sm">No applicants yet</p>
                        <p className="text-xs mt-1">
                            Applicants will appear here once developers apply to your jobs
                        </p>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default CompanyDashboard;