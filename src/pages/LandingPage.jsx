import { useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, Users, Zap, Globe } from 'lucide-react';

const features = [
    {
        icon: <Zap size={24} className="text-indigo-500" />,
        title: 'AI-Powered Matching',
        description:
            'Our AI scores how well a developer fits a role and explains why — no more guesswork.',
    },
    {
        icon: <Briefcase size={24} className="text-indigo-500" />,
        title: 'Quality Job Listings',
        description:
            'Companies post verified roles with clear requirements, salary ranges and work modes.',
    },
    {
        icon: <Users size={24} className="text-indigo-500" />,
        title: 'Developer Profiles',
        description:
            'Developers build rich profiles showcasing their skills, projects and availability.',
    },
    {
        icon: <Globe size={24} className="text-indigo-500" />,
        title: 'Remote First',
        description:
            'Find remote, hybrid or onsite roles from companies across the globe.',
    },
];

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            {/* Navbar */}
            <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
                <h1 className="text-2xl font-bold text-indigo-500">Devlytic</h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm text-gray-300 hover:text-white transition"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                    >
                        Get Started <ArrowRight size={16} />
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className="flex flex-col items-center text-center px-6 pt-24 pb-16">
                <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-4">
                    AI-Powered Developer Hiring
                </span>
                <h2 className="text-5xl font-extrabold leading-tight max-w-3xl mb-6">
                    Connect the right developers with the right companies
                </h2>
                <p className="text-gray-400 text-lg max-w-xl mb-10">
                    Devlytic uses AI to match developers to jobs based on their actual skills —
                    not just keywords. Built for modern hiring.
                </p>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/register/developer')}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition"
                    >
                        I am a Developer <ArrowRight size={18} />
                    </button>
                    <button
                        onClick={() => navigate('/register/company')}
                        className="flex items-center gap-2 border border-gray-600 hover:border-indigo-500 text-gray-300 hover:text-white font-semibold px-6 py-3 rounded-lg transition"
                    >
                        I am Hiring <Briefcase size={18} />
                    </button>
                </div>
            </section>

            {/* Features */}
            <section className="px-8 py-16 max-w-6xl mx-auto">
                <h3 className="text-2xl font-bold text-center mb-12">
                    Why teams choose Devlytic
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-500 transition"
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                            <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="px-8 py-20 text-center">
                <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
                <p className="text-gray-400 mb-8">
                    Join hundreds of developers and companies already using Devlytic.
                </p>
                <button
                    onClick={() => navigate('/register')}
                    className="flex items-center gap-2 mx-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-lg transition"
                >
                    Create your account <ArrowRight size={18} />
                </button>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-800 px-8 py-6 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} Devlytic. All rights reserved.
            </footer>

        </div>
    );
};

export default LandingPage;