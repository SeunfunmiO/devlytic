import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    ArrowLeft,
    MapPin,
    Globe,
    Code2,
    Building2,
    Clock,
    Bookmark,
    BookmarkCheck,
    CheckCircle,
    DollarSign,
    Send,
    X,
    Loader,
    FileText,
    AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getJobById, toggleSaveJob } from '../services/jobService';
import { applyToJob } from '../services/applicationService';

const JobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, role,user } = useSelector((state) => state.auth);
    
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [applying, setApplying] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                const data = await getJobById(id);
                setJob(data.job);
            } catch {
                toast.error('Failed to load job');
                navigate('/jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleSave = async () => {
        if (!isAuthenticated || role !== 'developer') return navigate('/login');
        try {
            await toggleSaveJob(id);
            setSaved(!saved);
            toast.success(saved ? 'Job unsaved' : 'Job saved');
        } catch {
            toast.error('Failed to save job');
        }
    };

    const handleApply = async () => {
        if (!isAuthenticated) return navigate('/login');
        if (role !== 'developer') return toast.error('Only developers can apply');
        setShowApplyModal(true);
    };

    const handleSubmitApplication = async () => {
        try {
            setSubmitting(true);
            await applyToJob(id, { coverLetter });
            setApplied(true);
            setShowApplyModal(false);
            toast.success('Application submitted successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    const workModeColors = {
        remote: 'bg-green-500/10 text-green-400',
        hybrid: 'bg-blue-500/10 text-blue-400',
        onsite: 'bg-yellow-500/10 text-yellow-400',
    };

    const jobTypeColors = {
        'full-time': 'bg-indigo-500/10 text-indigo-400',
        'part-time': 'bg-purple-500/10 text-purple-400',
        contract: 'bg-orange-500/10 text-orange-400',
        internship: 'bg-pink-500/10 text-pink-400',
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Code2 size={32} className="text-indigo-500 animate-pulse" />
                    <p className="text-gray-400 text-sm">Loading job...</p>
                </div>
            </div>
        );
    }

    if (!job) return null;

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-950 z-40">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <Code2 size={22} className="text-indigo-500" />
                    <h1 className="text-xl font-bold">Devlytic</h1>
                </div>
                {isAuthenticated ? (
                    <button
                        onClick={() => navigate(role === 'developer' ? '/dashboard/developer' : '/dashboard/company')}
                        className="text-sm text-indigo-400 hover:text-indigo-300 transition"
                    >
                        Dashboard
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm text-gray-300 hover:text-white transition"
                    >
                        Login
                    </button>
                )}
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* Back */}
                <button
                    onClick={() => navigate('/jobs')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition"
                >
                    <ArrowLeft size={16} /> Back to jobs
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Content */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Job Header */}
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {job.company?.logo ? (
                                        <img
                                            src={job.company.logo}
                                            alt={job.company.companyName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Building2 size={28} className="text-gray-500" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    {job.isFeatured && (
                                        <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full font-medium mb-2 inline-block">
                                            Featured
                                        </span>
                                    )}
                                    <h1 className="text-xl font-bold text-white">{job.title}</h1>
                                    <p className="text-gray-400 mt-1">{job.company?.companyName}</p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${workModeColors[job.workMode]}`}>
                                            {job.workMode}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${jobTypeColors[job.jobType]}`}>
                                            {job.jobType}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-gray-800 text-sm text-gray-400">
                                {job.location && (
                                    <span className="flex items-center gap-1.5">
                                        <MapPin size={14} /> {job.location}
                                    </span>
                                )}
                                {job.company?.industry && (
                                    <span className="flex items-center gap-1.5">
                                        <Globe size={14} /> {job.company.industry}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5">
                                    <Clock size={14} />
                                    Posted {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                                {job.salaryRange?.min > 0 && (
                                    <span className="flex items-center gap-1.5">
                                        <DollarSign size={14} />
                                        {job.salaryRange.currency} {job.salaryRange.min.toLocaleString()} — {job.salaryRange.max.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <h2 className="font-semibold text-white mb-4">Job Description</h2>
                            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                                {job.description}
                            </p>
                        </div>

                        {/* Requirements */}
                        {job.requirements?.length > 0 && (
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                                <h2 className="font-semibold text-white mb-4">Requirements</h2>
                                <ul className="flex flex-col gap-2">
                                    {job.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                                            <CheckCircle size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Skills */}
                        {job.skillsRequired?.length > 0 && (
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                                <h2 className="font-semibold text-white mb-4">Required Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {job.skillsRequired.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Sidebar */}
                    <div className="flex flex-col gap-4">

                        {/* Apply Card */}
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 sticky top-24">
                            {applied ? (
                                <div className="flex flex-col items-center text-center py-4">
                                    <CheckCircle size={36} className="text-green-400 mb-3" />
                                    <p className="font-semibold text-white">Application Sent</p>
                                    <p className="text-gray-400 text-sm mt-1">
                                        The company will review your profile and get back to you
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={handleApply}
                                        disabled={applying}
                                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition mb-3"
                                    >
                                        <Send size={16} />
                                        Apply Now
                                    </button>
                                    {role === 'developer' && (
                                        <button
                                            onClick={handleSave}
                                            className="w-full flex items-center justify-center gap-2 border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-white text-sm font-medium py-3 rounded-lg transition"
                                        >
                                            {saved ? (
                                                <>
                                                    <BookmarkCheck size={16} className="text-indigo-400" />
                                                    Saved
                                                </>
                                            ) : (
                                                <>
                                                    <Bookmark size={16} />
                                                    Save Job
                                                </>
                                            )}
                                        </button>
                                    )}
                                </>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500 text-center">
                                {job.applicants?.length || 0} applicant{job.applicants?.length !== 1 ? 's' : ''}
                            </div>
                        </div>

                        {/* Company Card */}
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                            <h3 className="font-semibold text-white mb-4">About the Company</h3>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
                                    {job.company?.logo ? (
                                        <img src={job.company.logo} alt={job.company.companyName} className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 size={18} className="text-gray-500" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-white text-sm">{job.company?.companyName}</p>
                                    <p className="text-gray-400 text-xs">{job.company?.industry}</p>
                                </div>
                            </div>
                            {job.company?.description && (
                                <p className="text-gray-400 text-xs leading-relaxed">
                                    {job.company.description}
                                </p>
                            )}
                            {job.company?.website && (
                                <a
                                    href={job.company.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-xs mt-3 transition"
                                >
                                    <Globe size={12} /> Visit website
                                </a>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-lg">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-bold text-lg">Apply for {job.title}</h3>
                            <button
                                onClick={() => setShowApplyModal(false)}
                                className="text-gray-400 hover:text-white transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Resume Section */}
                        <div className="mb-5">
                            <label className="text-sm text-gray-300 font-medium mb-2 block">
                                Resume
                            </label>
                            {user?.resumeUrl ? (
                                <div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <FileText size={16} className="text-indigo-400" />
                                        <span>Your uploaded resume will be attached</span>
                                    </div>
                                    <a
                                        href={user.resumeUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                                    >
                                        Preview
                                    </a>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-gray-800 border border-yellow-500/30 rounded-lg px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm text-yellow-400">
                                        <AlertCircle size={16} />
                                        <span>No resume uploaded yet</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowApplyModal(false);
                                            navigate('/dashboard/developer/profile');
                                        }}
                                        className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                                    >
                                        Upload now
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Cover Letter */}
                        <div className="mb-5">
                            <label className="text-sm text-gray-300 font-medium mb-2 block">
                                Cover Letter <span className="text-gray-500">(optional)</span>
                            </label>
                            <textarea
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                placeholder="Tell the company why you are a great fit for this role..."
                                rows={5}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition resize-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowApplyModal(false)}
                                className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-300 font-medium py-3 rounded-lg transition text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitApplication}
                                disabled={submitting}
                                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition text-sm"
                            >
                                {submitting ? (
                                    <>
                                        <Loader size={16} className="animate-spin" /> Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} /> Submit Application
                                    </>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            )
            }

        </div >
    );
};

export default JobDetailPage;