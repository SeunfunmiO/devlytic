import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Bell,
    LogOut,
    Code2,
    Building2,
    CheckCheck,
    Inbox,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logout } from '../store/authSlice';
import { logoutUser } from '../services/authService';
import {
    setNotifications,
    markAllAsRead as markAllAsReadAction,
    markAsRead as markAsReadAction,
} from '../store/notificationSlice';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
} from '../services/notificationService';

const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard/company' },
    { label: 'My Jobs', icon: <Briefcase size={18} />, path: '/dashboard/company/jobs' },
    { label: 'Applicants', icon: <Users size={18} />, path: '/dashboard/company/applicants' },
    { label: 'Profile', icon: <Building2 size={18} />, path: '/dashboard/company/profile' },
    { label: 'Notifications', icon: <Bell size={18} />, path: '/dashboard/company/notifications' },
];

const typeColors = {
    new_application: 'bg-indigo-500/10 text-indigo-400',
    application_update: 'bg-green-500/10 text-green-400',
    new_match: 'bg-yellow-500/10 text-yellow-400',
};

const typeLabels = {
    new_application: 'New Application',
    application_update: 'Status Update',
    new_match: 'New Match',
};

const CompanyNotificationsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { notifications, unreadCount } = useSelector((state) => state.notifications);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getNotifications();
                dispatch(setNotifications(data.notifications));
            } catch {
                toast.error('Failed to load notifications');
            }
        };
        fetchNotifications();
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
            dispatch(markAllAsReadAction());
            toast.success('All notifications marked as read');
        } catch {
            toast.error('Failed to mark notifications as read');
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            await markAsRead(notification._id);
            dispatch(markAsReadAction(notification._id));
            if (notification.relatedJob) {
                navigate(`/dashboard/company/jobs/${notification.relatedJob}/applicants`);
            }
        } catch {
            // fail silently
        }
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
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl lg:text-2xl font-bold">Notifications</h2>
                        <p className="text-gray-400 text-sm mt-1">
                            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition"
                        >
                            <CheckCheck size={16} /> Mark all read
                        </button>
                    )}
                </div>

                {/* Notifications */}
                {notifications.length === 0 ? (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col items-center justify-center py-20">
                        <Inbox size={40} className="mb-3 text-gray-700" />
                        <p className="font-medium text-gray-400">No notifications yet</p>
                        <p className="text-sm text-gray-500 mt-1">
                            You will be notified when developers apply to your jobs
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {notifications.map((n) => (
                            <button
                                key={n._id}
                                onClick={() => handleNotificationClick(n)}
                                className={`w-full text-left bg-gray-900 border rounded-xl p-4 hover:border-indigo-500 transition ${!n.isRead ? 'border-indigo-500/30' : 'border-gray-800'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${typeColors[n.type]}`}>
                                        {typeLabels[n.type]}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-300">{n.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(n.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {!n.isRead && (
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

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

export default CompanyNotificationsPage;