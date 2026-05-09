import { ArrowRight, Briefcase } from "lucide-react"
import { useNavigate } from "react-router-dom"


const Hero = () => {
const navigate = useNavigate()

  return (
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-16">
          <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-4">
              AI-Powered Developer Hiring
          </span>
          <h2 className="text-5xl font-extrabold leading-tight max-w-3xl mb-6">
              Connect the right developers with the right companies
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mb-10">
              Devlytic uses AI to match developers to jobs based on their actual skills
              not just keywords. Built for modern hiring.
          </p>
          <div className="flex items-center gap-4">
              <button
                  onClick={() => navigate('/register/developer')}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition md:text-sm"
              >
                  I am a Developer <ArrowRight size={18} />
              </button>
              <button
                  onClick={() => navigate('/register/company')}
                  className="flex items-center gap-2 border border-gray-600 hover:border-indigo-500 text-gray-300 hover:text-white font-semibold px-6 py-3 rounded-lg transition md:text-sm"
              >
                  I am Hiring <Briefcase size={18} />
              </button>
          </div>
      </section>
  )
}

export default Hero