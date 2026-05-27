import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    ArrowLeft,
    Code2,
    Briefcase,
    MapPin,
    DollarSign,
    Plus,
    X,
    Loader,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { createJob } from '../services/jobService';

const validationSchema = Yup.object({
    title: Yup.string().required('Job title is required'),
    description: Yup.string()
        .min(100, 'Description must be at least 100 characters')
        .required('Job description is required'),
    jobType: Yup.string().required('Job type is required'),
    workMode: Yup.string().required('Work mode is required'),
    location: Yup.string().required('Location is required'),
});

const PostJobPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [skillInput, setSkillInput] = useState('');
    const [requirementInput, setRequirementInput] = useState('');
    const [skills, setSkills] = useState([]);
    const [requirements, setRequirements] = useState([]);

    const addSkill = () => {
        const trimmed = skillInput.trim();
        if (trimmed && !skills.includes(trimmed)) {
            setSkills([...skills, trimmed]);
            setSkillInput('');
        }
    };

    const removeSkill = (skill) => {
        setSkills(skills.filter((s) => s !== skill));
    };

    const addRequirement = () => {
        const trimmed = requirementInput.trim();
        if (trimmed) {
            setRequirements([...requirements, trimmed]);
            setRequirementInput('');
        }
    };

    const removeRequirement = (index) => {
        setRequirements(requirements.filter((_, i) => i !== index));
    };

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            jobType: 'full-time',
            workMode: 'remote',
            location: '',
            salaryMin: '',
            salaryMax: '',
            salaryCurrency: 'USD',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await createJob({
                    title: values.title,
                    description: values.description,
                    jobType: values.jobType,
                    workMode: values.workMode,
                    location: values.location,
                    skillsRequired: skills,
                    requirements,
                    salaryRange: {
                        min: values.salaryMin || 0,
                        max: values.salaryMax || 0,
                        currency: values.salaryCurrency,
                    },
                });
                toast.success('Job posted successfully');
                navigate('/dashboard/company/jobs');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to post job');
            } finally {
                setSubmitting(false);
            }
        },
    });

    const inputClass = (field) =>
        `w-full bg-gray-800 border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition ${formik.touched[field] && formik.errors[field]
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-700 focus:border-indigo-500'
        }`;

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-950 z-40">
                <div className="flex items-center gap-2">
                    <Code2 size={22} className="text-indigo-500" />
                    <h1 className="text-xl font-bold">Devlytic</h1>
                </div>
                <button
                    onClick={() => navigate('/dashboard/company')}
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition"
                >
                    Dashboard
                </button>
            </nav>

            <div className="max-w-3xl mx-auto px-4 py-8">

                {/* Back */}
                <button
                    onClick={() => navigate('/dashboard/company/jobs')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition"
                >
                    <ArrowLeft size={16} /> Back to My Jobs
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold">Post a New Job</h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Fill in the details below to attract the best developers
                    </p>
                </div>

                <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">

                    {/* Basic Info */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-5">
                        <div className="flex items-center gap-2 mb-1">
                            <Briefcase size={18} className="text-indigo-400" />
                            <h3 className="font-semibold">Basic Information</h3>
                        </div>

                        {/* Title */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-300 font-medium">Job Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="e.g. Senior Frontend Developer"
                                className={inputClass('title')}
                            />
                            {formik.touched.title && formik.errors.title && (
                                <p className="text-red-400 text-xs mt-1">{formik.errors.title}</p>
                            )}
                        </div>

                        {/* Job Type + Work Mode */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-300 font-medium">Job Type</label>
                                <select
                                    name="jobType"
                                    value={formik.values.jobType}
                                    onChange={formik.handleChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                                >
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="contract">Contract</option>
                                    <option value="internship">Internship</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-300 font-medium">Work Mode</label>
                                <select
                                    name="workMode"
                                    value={formik.values.workMode}
                                    onChange={formik.handleChange}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                                >
                                    <option value="remote">Remote</option>
                                    <option value="hybrid">Hybrid</option>
                                    <option value="onsite">Onsite</option>
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-300 font-medium">Location</label>
                            <div className="relative">
                                <MapPin
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                                <input
                                    type="text"
                                    name="location"
                                    value={formik.values.location}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="e.g. Lagos, Nigeria or Worldwide"
                                    className={`w-full bg-gray-800 border rounded-lg pl-9 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition ${formik.touched.location && formik.errors.location
                                            ? 'border-red-500'
                                            : 'border-gray-700 focus:border-indigo-500'
                                        }`}
                                />
                            </div>
                            {formik.touched.location && formik.errors.location && (
                                <p className="text-red-400 text-xs mt-1">{formik.errors.location}</p>
                            )}
                        </div>

                    </div>

                    {/* Description */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-4">
                        <h3 className="font-semibold">Job Description</h3>
                        <div className="flex flex-col gap-1">
                            <textarea
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Describe the role, responsibilities, team culture, and what success looks like..."
                                rows={8}
                                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition resize-none ${formik.touched.description && formik.errors.description
                                        ? 'border-red-500'
                                        : 'border-gray-700 focus:border-indigo-500'
                                    }`}
                            />
                            <div className="flex items-center justify-between mt-1">
                                {formik.touched.description && formik.errors.description ? (
                                    <p className="text-red-400 text-xs">{formik.errors.description}</p>
                                ) : (
                                    <span />
                                )}
                                <p className="text-gray-500 text-xs">
                                    {formik.values.description.length} chars
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Requirements */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-4">
                        <h3 className="font-semibold">Requirements</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={requirementInput}
                                onChange={(e) => setRequirementInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                                placeholder="e.g. 3+ years of React experience"
                                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                            />
                            <button
                                type="button"
                                onClick={addRequirement}
                                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition text-sm"
                            >
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        {requirements.length > 0 && (
                            <ul className="flex flex-col gap-2">
                                {requirements.map((req, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start justify-between gap-3 bg-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300"
                                    >
                                        <span>{req}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeRequirement(index)}
                                            className="text-gray-500 hover:text-red-400 transition flex-shrink-0"
                                        >
                                            <X size={14} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Skills */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-4">
                        <h3 className="font-semibold">Required Skills</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                placeholder="e.g. React, TypeScript, Node.js"
                                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                            />
                            <button
                                type="button"
                                onClick={addSkill}
                                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition text-sm"
                            >
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        {skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm rounded-lg"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="text-indigo-400 hover:text-red-400 transition"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Salary */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <DollarSign size={18} className="text-indigo-400" />
                            <h3 className="font-semibold">Salary Range <span className="text-gray-500 font-normal text-sm">(optional)</span></h3>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-400">Currency</label>
                                <select
                                    name="salaryCurrency"
                                    value={formik.values.salaryCurrency}
                                    onChange={formik.handleChange}
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                                >
                                    <option value="USD">USD</option>
                                    <option value="GBP">GBP</option>
                                    <option value="EUR">EUR</option>
                                    <option value="NGN">NGN</option>
                                    <option value="CAD">CAD</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-400">Min</label>
                                <input
                                    type="number"
                                    name="salaryMin"
                                    value={formik.values.salaryMin}
                                    onChange={formik.handleChange}
                                    placeholder="50000"
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-400">Max</label>
                                <input
                                    type="number"
                                    name="salaryMax"
                                    value={formik.values.salaryMax}
                                    onChange={formik.handleChange}
                                    placeholder="80000"
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition"
                    >
                        {formik.isSubmitting ? (
                            <>
                                <Loader size={18} className="animate-spin" /> Posting job...
                            </>
                        ) : (
                            <>
                                <Briefcase size={18} /> Post Job
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default PostJobPage;