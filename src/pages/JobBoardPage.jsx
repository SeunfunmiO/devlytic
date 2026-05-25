import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Search,
    MapPin,
    Briefcase,
    Globe,
    Code2,
    SlidersHorizontal,
    X,
    Bookmark,
    BookmarkCheck,
    Building2,
    Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllJobs, toggleSaveJob } from '../services/jobService';

const jobTypes = ['full-time', 'part-time', 'contract', 'internship'];
const workModes = ['remote', 'hybrid', 'onsite'];

const JobBoardPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, role } = useSelector((state) => state.auth);

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [savedJobs, setSavedJobs] = useState([]);

    const [filters, setFilters] = useState({
        search: '',
        jobType: '',
        workMode: '',
        location: '',
    });

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== '')
            );
            const data = await getAllJobs(activeFilters);
            setJobs(data.jobs);
        } catch {
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const intializeFetchJobs = () => {
            fetchJobs();
        }
        intializeFetchJobs()
    }, []);


    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: prev[key] === value ? '' : value,
        }));
    };

    const handleSaveJob = async (e, jobId) => {
        e.stopPropagation();
        if (!isAuthenticated || role !== 'developer') {
            return navigate('/login');
        }
        try {
            await toggleSaveJob(jobId);
            setSavedJobs((prev) =>
                prev.includes(jobId)
                    ? prev.filter((id) => id !== jobId)
                    : [...prev, jobId]
            );
        } catch {
            toast.error('Failed to save job');
        }
    };

    const clearFilters = () => {
        setFilters({ search: '', jobType: '', workMode: '', location: '' });
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

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
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <button
                            onClick={() =>
                                navigate(
                                    role === 'developer'
                                        ? '/dashboard/developer'
                                        : '/dashboard/company'
                                )
                            }
                            className="text-sm text-indigo-400 hover:text-indigo-300 transition"
                        >
                            Dashboard
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="text-sm text-gray-300 hover:text-white transition"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                            >
                                Get Started
                            </button>
                        </>
                    )}
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold mb-2">Find your next role</h2>
                    <p className="text-gray-400">
                        Browse {jobs.length} open positions from top companies
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-3 mb-6">
                    <div className="flex-1 relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, search: e.target.value }))
                            }
                            placeholder="Search jobs, skills, companies..."
                            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-3 rounded-lg transition"
                    >
                        Search
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`relative flex items-center gap-2 border text-sm font-medium px-4 py-3 rounded-lg transition ${showFilters || activeFilterCount > 0
                                ? 'border-indigo-500 text-indigo-400'
                                : 'border-gray-700 text-gray-400 hover:border-gray-500'
                            }`}
                    >
                        <SlidersHorizontal size={16} />
                        <span className="hidden sm:inline">Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </form>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-sm">Filters</h3>
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition"
                                >
                                    <X size={14} /> Clear all
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                            {/* Job Type */}
                            <div>
                                <p className="text-xs text-gray-400 mb-2 font-medium">Job Type</p>
                                <div className="flex flex-wrap gap-2">
                                    {jobTypes.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => handleFilterChange('jobType', type)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition ${filters.jobType === type
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-800 text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Work Mode */}
                            <div>
                                <p className="text-xs text-gray-400 mb-2 font-medium">Work Mode</p>
                                <div className="flex flex-wrap gap-2">
                                    {workModes.map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => handleFilterChange('workMode', mode)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition ${filters.workMode === mode
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-800 text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <p className="text-xs text-gray-400 mb-2 font-medium">Location</p>
                                <div className="relative">
                                    <MapPin
                                        size={14}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    />
                                    <input
                                        type="text"
                                        value={filters.location}
                                        onChange={(e) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                location: e.target.value,
                                            }))
                                        }
                                        placeholder="e.g. Lagos, Remote"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                                    />
                                </div>
                            </div>

                        </div>

                        <button
                            onClick={fetchJobs}
                            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
                        >
                            Apply Filters
                        </button>
                    </div>
                )}

                {/* Jobs List */}
                {loading ? (
                    <div className="flex flex-col gap-4">
                        {[...Array(4)].map((_, i) => (
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
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <Briefcase size={40} className="mb-3 text-gray-700" />
                        <p className="font-medium text-gray-400">No jobs found</p>
                        <p className="text-sm mt-1">Try adjusting your filters or search terms</p>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {jobs.map((job) => (
                            <div
                                key={job._id}
                                onClick={() => navigate(`/jobs/${job._id}`)}
                                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-indigo-500 transition cursor-pointer group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1 min-w-0">

                                        {/* Company Logo */}
                                        <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {job.company?.logo ? (
                                                <img
                                                    src={job.company.logo}
                                                    alt={job.company.companyName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Building2 size={20} className="text-gray-500" />
                                            )}
                                        </div>

                                        {/* Job Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {job.isFeatured && (
                                                    <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-semibold text-white group-hover:text-indigo-400 transition truncate">
                                                {job.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm mt-0.5">
                                                {job.company?.companyName}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                                                {job.location && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={12} /> {job.location}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Globe size={12} /> {job.company?.industry}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {new Date(job.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${workModeColors[job.workMode]}`}>
                                                    {job.workMode}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${jobTypeColors[job.jobType]}`}>
                                                    {job.jobType}
                                                </span>
                                                {job.salaryRange?.min > 0 && (
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-400">
                                                        {job.salaryRange.currency} {job.salaryRange.min.toLocaleString()} — {job.salaryRange.max.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            {job.skillsRequired?.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {job.skillsRequired.slice(0, 4).map((skill) => (
                                                        <span
                                                            key={skill}
                                                            className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {job.skillsRequired.length > 4 && (
                                                        <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded">
                                                            +{job.skillsRequired.length - 4}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    {role === 'developer' && (
                                        <button
                                            onClick={(e) => handleSaveJob(e, job._id)}
                                            className="text-gray-500 hover:text-indigo-400 transition flex-shrink-0 mt-1"
                                        >
                                            {savedJobs.includes(job._id) ? (
                                                <BookmarkCheck size={20} className="text-indigo-400" />
                                            ) : (
                                                <Bookmark size={20} />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobBoardPage;