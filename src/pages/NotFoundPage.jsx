import { useNavigate } from 'react-router-dom';
import { Code2, ArrowLeft, Home } from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">

            {/* Logo */}
            <div className="flex items-center gap-2 mb-12">
                <Code2 size={24} className="text-indigo-500" />
                <h1 className="text-2xl font-bold">Devlytic</h1>
            </div>

            {/* 404 */}
            <div className="text-center max-w-md">
                <h2 className="text-8xl font-extrabold text-indigo-500 mb-4">404</h2>
                <h3 className="text-2xl font-bold text-white mb-3">Page not found</h3>
                <p className="text-gray-400 text-sm mb-10">
                    The page you are looking for does not exist or has been moved.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-white text-sm font-medium px-5 py-3 rounded-lg transition"
                    >
                        <ArrowLeft size={16} /> Go back
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-3 rounded-lg transition"
                    >
                        <Home size={16} /> Home
                    </button>
                </div>
            </div>

        </div>
    );
};

export default NotFoundPage;