import { Briefcase, Globe, Users, Zap } from "lucide-react"


const features = [
    {
        icon: <Zap size={24} className="text-indigo-500" />,
        title: 'AI-Powered Matching',
        description:
            'Our AI scores how well a developer fits a role and explains why no more guesswork.',
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
]

const Features = () => {
  return (
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
  )
}

export default Features