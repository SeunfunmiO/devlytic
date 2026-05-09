import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Cta = () => {
    const navigate = useNavigate()

  return (
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
  )
}

export default Cta