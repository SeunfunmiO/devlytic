import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";


const NavBar = () => {
    const navigate = useNavigate();

  return (
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
  )
}

export default NavBar