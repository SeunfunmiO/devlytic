import { useNavigate } from 'react-router-dom';
import { Code2, Building2, ArrowLeft } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">

      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-10 self-start ml-4 transition"
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Join Devlytic</h1>
        <p className="text-gray-400">Choose how you want to get started</p>
      </div>

      {/* Cards */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">

        {/* Developer Card */}
        <button
          onClick={() => navigate('/register/developer')}
          className="flex-1 bg-gray-900 border border-gray-800 hover:border-indigo-500 rounded-xl p-8 text-left transition group"
        >
          <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-500 transition">
            <Code2 size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">I am a Developer</h2>
          <p className="text-gray-400 text-sm">
            Build your profile, showcase your skills and get matched with top companies looking for talent like you.
          </p>
        </button>

        {/* Company Card */}
        <button
          onClick={() => navigate('/register/company')}
          className="flex-1 bg-gray-900 border border-gray-800 hover:border-indigo-500 rounded-xl p-8 text-left transition group"
        >
          <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-500 transition">
            <Building2 size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">I am Hiring</h2>
          <p className="text-gray-400 text-sm">
            Post jobs, discover talented developers and let our AI match you with the best candidates for your roles.
          </p>
        </button>

      </div>

      {/* Login Link */}
      <p className="text-gray-400 text-sm mt-10">
        Already have an account?{' '}
        <button
          onClick={() => navigate('/login')}
          className="text-indigo-400 hover:text-indigo-300 font-medium transition"
        >
          Login here
        </button>
      </p>

    </div>
  );
};

export default RegisterPage;