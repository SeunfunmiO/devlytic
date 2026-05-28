import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, X, CheckCheck } from 'lucide-react';
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

const NotificationBell = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notifications, unreadCount } = useSelector((state) => state.notifications);
    const { role } = useSelector((state) => state.auth);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getNotifications();
                dispatch(setNotifications(data.notifications));
            } catch {
                // fail silently
            }
        };
        fetchNotifications();
    }, [dispatch]);

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
            dispatch(markAllAsReadAction());
        } catch {
            // fail silently
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            await markAsRead(notification._id);
            dispatch(markAsReadAction(notification._id));
            setOpen(false);
            if (notification.relatedJob) {
                navigate(`/jobs/${notification.relatedJob}`);
            }
        } catch {
            // fail silently
        }
    };

    const typeColors = {
        new_application: 'bg-indigo-500/10 text-indigo-400',
        application_update: 'bg-green-500/10 text-green-400',
        new_match: 'bg-yellow-500/10 text-yellow-400',
    };

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 text-gray-400 hover:text-white transition"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />

                    {/* Panel */}
                    <div className="absolute right-0 top-10 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                            <h3 className="font-semibold text-sm text-white">Notifications</h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition"
                                    >
                                        <CheckCheck size={14} /> Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={() => setOpen(false)}
                                    className="text-gray-500 hover:text-white transition"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                                    <Bell size={28} className="mb-2 text-gray-700" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.slice(0, 10).map((n) => (
                                    <button
                                        key={n._id}
                                        onClick={() => handleNotificationClick(n)}
                                        className={`w-full text-left px-4 py-3 border-b border-gray-800 hover:bg-gray-800 transition ${!n.isRead ? 'bg-gray-800/50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 flex-shrink-0 ${typeColors[n.type]}`}>
                                                {n.type === 'new_application' ? 'New' : n.type === 'application_update' ? 'Update' : 'Match'}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-300 leading-snug">{n.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(n.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {!n.isRead && (
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5" />
                                            )}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="px-4 py-3 border-t border-gray-800">
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        navigate(
                                            role === 'developer'
                                                ? '/dashboard/developer/notifications'
                                                : '/dashboard/company/notifications'
                                        );
                                    }}
                                    className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                                >
                                    View all notifications
                                </button>
                            </div>
                        )}

                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;