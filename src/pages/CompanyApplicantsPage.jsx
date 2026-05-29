import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Bell,
    LogOut,
    Code2,
    Building2,
    ArrowLeft,
    Globe,
    CheckCircle,
    XCircle,
    Clock,
    Star,
    Loader,
    ChevronDown,
    ChevronUp,
    Link2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logout } from '../store/authSlice';
import { logoutUser } from '../services/authService';
import { getJobApplicants, updateApplicationStatus } from '../services/applicationService';
import { getJobById } from '../services/jobService';

const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard/company' },
    { label: 'My Jobs', icon: <Briefcase size={18} />, path: '/dashboard/company/jobs' },
    { label: 'Applicants', icon: <Users size={18} />, path: '/dashboard/company/applicants' },
    { label: 'Profile', icon: <Building2 size={18} />, path: '/dashboard/company/profile' },
    { label: 'Notifications', icon: <Bell size={18} />, path: '/dashboard/company/notifications' },
];

const statusColors = {
    pending: 'bg-gray-500/10 text-gray-400',
    reviewed: 'bg-blue-500/10 text-blue-400',
    shortlisted: 'bg-green-500/10 text-green-400',
    interview: 'bg-yellow-500/10 text-yellow-400',
    rejected: 'bg-red-500/10 text-red-400',
};

const scoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
};

const scoreBg = (score) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
};

const CompanyApplicantsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { jobId } = useParams();

    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [jobData, appData] = await Promise.all([
                    getJobById(jobId),
                    getJobApplicants(jobId),
                ]);
                setJob(jobData.job);
                setApplications(appData.applications);
            } catch {
                toast.error('Failed to load applicants');
                navigate('/dashboard/company/jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [jobId]);

    const handleStatusUpdate = async (applicationId, status) => {
        try {
            setUpdatingId(applicationId);
            await updateApplicationStatus(applicationId, status);
            setApplications(applications.map((app) =>
                app._id === applicationId ? { ...app, status } : app
            ));
            toast.success(`Applicant ${status}`);
        } catch {
            toast.error('Failed to update status');
        } finally {
            setUpdatingId(null);
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

                {/* Back */}
                <button
                    onClick={() => navigate('/dashboard/company/jobs')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition"
                >
                    <ArrowLeft size={16} /> Back to My Jobs
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-xl lg:text-2xl font-bold">
                        {job ? `Applicants for "${job.title}"` : 'Applicants'}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        {applications.length} applicant{applications.length !== 1 ? 's' : ''} — sorted by AI match score
                    </p>
                </div>

                {/* Applicants List */}
                {loading ? (
                    <div className="flex flex-col gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse">
                                <div className="h-4 bg-gray-800 rounded w-1/3 mb-3" />
                                <div className="h-3 bg-gray-800 rounded w-1/4" />
                            </div>
                        ))}
                    </div>
                ) : applications.length === 0 ? (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col items-center justify-center py-20">
                        <Users size={40} className="mb-3 text-gray-700" />
                        <p className="font-medium text-gray-400">No applicants yet</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Share your job listing to attract developers
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {applications.map((app) => (
                            <div
                                key={app._id}
                                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
                            >
                                {/* Applicant Header */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1 min-w-0">

                                            {/* Avatar */}
                                            <div className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {app.developer?.avatar ? (
                                                    <img
                                                        src={app.developer.avatar}
                                                        alt={app.developer.fullName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-indigo-400 font-bold text-lg">
                                                        {app.developer?.fullName?.[0]}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 flex-wrap mb-1">
                                                    <h3 className="font-semibold text-white">
                                                        {app.developer?.fullName}
                                                    </h3>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[app.status]}`}>
                                                        {app.status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm">{app.developer?.email}</p>
                                                {app.developer?.availabilityStatus && (
                                                    <p className="text-xs text-gray-500 mt-1 capitalize">
                                                        {app.developer.availabilityStatus}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {app.developer?.githubUrl && (
                                                        <a
                                                            href={app.developer.githubUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition"
                                                        >
                                                            <Link2 size={12} /> GitHub
                                                        </a>
                                                    )}
                                                    {app.developer?.portfolioUrl && (
                                                        <a
                                                            href={app.developer.portfolioUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition"
                                                        >
                                                            <Globe size={12} /> Portfolio
                                                        </a>
                                                    )}
                                                </div>
                                                {app.developer?.skills?.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {app.developer.skills.slice(0, 5).map((skill) => (
                                                            <span
                                                                key={skill}
                                                                className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                        {app.developer.skills.length > 5 && (
                                                            <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded">
                                                                +{app.developer.skills.length - 5}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* AI Score */}
                                        <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border flex-shrink-0 ${scoreBg(app.matchScore)}`}>
                                            <Star size={14} className={scoreColor(app.matchScore)} />
                                            <span className={`text-xl font-bold ${scoreColor(app.matchScore)}`}>
                                                {app.matchScore}
                                            </span>
                                            <span className="text-xs text-gray-500">match</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    < div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800" >
                                        <div className="flex gap-2 flex-wrap">
                                            {['reviewed', 'shortlisted', 'interview', 'rejected'].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusUpdate(app._id, status)}
                                                    disabled={app.status === status || updatingId === app._id}
                                                    className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition disabled:opacity-40 disabled:cursor-not-allowed ${app.status === status
                                                            ? statusColors[status]
                                                            : 'bg-gray-800 text-gray-400 hover:text-white'
                                                        }`}
                                                >
                                                    {updatingId === app._id ? (
                                                        <Loader size={12} className="animate-spin" />
                                                    ) : status}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition"
                                        >
                                            {expandedId === app._id ? (
                                                <><ChevronUp size={14} /> Less</>
                                            ) : (
                                                <><ChevronDown size={14} /> More</>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {
                                    expandedId === app._id && (
                                        <div className="border-t border-gray-800 p-5 flex flex-col gap-4 bg-gray-950">

                                            {/* AI Match Reason */}
                                            {app.matchReason && (
                                                <div>
                                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                        AI Match Analysis
                                                    </h4>
                                                    <p className="text-sm text-gray-300 leading-relaxed">
                                                        {app.matchReason}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Strengths */}
                                            {app.matchStrengths?.length > 0 && (
                                                <div>
                                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                        Strengths
                                                    </h4>
                                                    <ul className="flex flex-col gap-1">
                                                        {app.matchStrengths.map((s, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                                <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                                                                {s}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Gaps */}
                                            {app.matchGaps?.length > 0 && (
                                                <div>
                                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                        Gaps
                                                    </h4>
                                                    <ul className="flex flex-col gap-1">
                                                        {app.matchGaps.map((g, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                                <XCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                                                                {g}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Cover Letter */}
                                            {app.coverLetter && (
                                                <div>
                                                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                        Cover Letter
                                                    </h4>
                                                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line bg-gray-900 rounded-lg p-4">
                                                        {app.coverLetter}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Applied At */}
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock size={12} />
                                                Applied {new Date(app.createdAt).toLocaleDateString()}
                                            </p>

                                        </div>
                                    )
                                }

                            </div >
                        ))}
                    </div >
                )}

            </main >

            {/* Bottom Nav */}
            < nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex items-center justify-around px-2 py-3 z-50" >
                {
                    navItems.map((item) => (
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
                    ))
                }
            </nav >

        </div >
    );
};

export default CompanyApplicantsPage;