import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Bell,
    LogOut,
    Code2,
    Plus,
    Building2,
    Pencil,
    Trash2,
    Eye,
    MapPin,
    Globe,
    Clock,
    CheckCircle,
    XCircle,
    Loader,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logout } from '../store/authSlice';
import { logoutUser } from '../services/authService';
import { getCompanyJobs, deleteJob, updateJob } from '../services/jobService';

const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard/company' },
    { label: 'My Jobs', icon: <Briefcase size={18} />, path: '/dashboard/company/jobs' },
    { label: 'Applicants', icon: <Users size={18} />, path: '/dashboard/company/applicants' },
    { label: 'Profile', icon: <Building2 size={18} />, path: '/dashboard/company/profile' },
    { label: 'Notifications', icon: <Bell size={18} />, path: '/dashboard/company/notifications' },
];

const statusColors = {
    open: 'bg-green-500/10 text-green-400',
    closed: 'bg-red-500/10 text-red-400',
};

const workModeColors = {
    remote: 'bg-green-500/10 text-green-400',
    hybrid: 'bg-blue-500/10 text-blue-400',
    onsite: 'bg-yellow-500/10 text-yellow-400',
};

const CompanyJobsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [togglingId, setTogglingId] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const data = await getCompanyJobs();
                setJobs(data.jobs);
            } catch {
                toast.error('Failed to load jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            setDeletingId(jobId);
            await deleteJob(jobId);
            setJobs(jobs.filter((j) => j._id !== jobId));
            toast.success('Job deleted successfully');
        } catch {
            toast.error('Failed to delete job');
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggleStatus = async (job) => {
        try {
            setTogglingId(job._id);
            const newStatus = job.status === 'open' ? 'closed' : 'open';
            await updateJob(job._id, { status: newStatus });
            setJobs(jobs.map((j) =>
                j._id === job._id ? { ...j, status: newStatus } : j
            ));
            toast.success(`Job ${newStatus === 'open' ? 'reopened' : 'closed'}`);
        } catch {
            toast.error('Failed to update job status');
        } finally {
            setTogglingId(null);
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
        <div className="min-h-screen bg-gray-950 text-white flex">

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
            <main className="lg:ml-64 flex-1 p-4 lg:p-8 pb-24 lg:pb-8 overflow-x-hidden">

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
                        <h2 className="text-xl lg:text-2xl font-bold">My Jobs</h2>
                        <p className="text-gray-400 text-sm mt-1">
                            {jobs.length} job{jobs.length !== 1 ? 's' : ''} posted
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/company/jobs/new')}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">Post a Job</span>
                    </button>
                </div>

                {/* Jobs List */}
                {loading ? (
                    <div className="flex flex-col gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse"
                            >
                                <div className="h-4 bg-gray-800 rounded w-1/3 mb-3" />
                                <div className="h-3 bg-gray-800 rounded w-1/4 mb-4" />
                                <div className="flex gap-2">
                                    <div className="h-6 bg-gray-800 rounded-full w-16" />
                                    <div className="h-6 bg-gray-800 rounded-full w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col items-center justify-center py-20 text-gray-500">
                        <Briefcase size={40} className="mb-3 text-gray-700" />
                        <p className="font-medium text-gray-400">No jobs posted yet</p>
                        <p className="text-sm mt-1">Post your first job to start receiving applications</p>
                        <button
                            onClick={() => navigate('/dashboard/company/jobs/new')}
                            className="mt-5 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                        >
                            <Plus size={16} /> Post a Job
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {jobs.map((job) => (
                            <div
                                key={job._id}
                                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">

                                        {/* Title + Status */}
                                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                                            <h3 className="font-semibold text-white">{job.title}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[job.status]}`}>
                                                {job.status}
                                            </span>
                                            {job.isFeatured && (
                                                <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                                                    Featured
                                                </span>
                                            )}
                                        </div>

                                        {/* Meta */}
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                                            {job.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={12} /> {job.location}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Globe size={12} />
                                                <span className="capitalize">{job.workMode}</span>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users size={12} />
                                                {job.applicants?.length || 0} applicant{job.applicants?.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${workModeColors[job.workMode]}`}>
                                                {job.workMode}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-indigo-500/10 text-indigo-400">
                                                {job.jobType}
                                            </span>
                                        </div>

                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => navigate(`/jobs/${job._id}`)}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                                            title="View"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleToggleStatus(job)}
                                            disabled={togglingId === job._id}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                                            title={job.status === 'open' ? 'Close job' : 'Reopen job'}
                                        >
                                            {togglingId === job._id ? (
                                                <Loader size={16} className="animate-spin" />
                                            ) : job.status === 'open' ? (
                                                <XCircle size={16} className="text-red-400" />
                                            ) : (
                                                <CheckCircle size={16} className="text-green-400" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(job._id)}
                                            disabled={deletingId === job._id}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                            title="Delete"
                                        >
                                            {deletingId === job._id ? (
                                                <Loader size={16} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={16} />
                                            )}
                                        </button>
                                    </div>

                                </div>
                            </div>
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

export default CompanyJobsPage;