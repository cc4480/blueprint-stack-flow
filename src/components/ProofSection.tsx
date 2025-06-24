
const ProofSection = () => {
  const successStories = [
    {
      title: "Mobile-First Journaling App",
      timeframe: "Under 48 hours",
      description: "A fully functional journaling app with user authentication, cloud sync, and beautiful UI",
      features: ["User Auth", "Cloud Sync", "Responsive Design", "Dark Mode"],
      image: "📱",
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "Scalable B2B Dashboard",
      timeframe: "1 week",
      description: "Enterprise-grade dashboard with authentication, real-time data, and advanced analytics",
      features: ["Enterprise Auth", "Real-time Data", "Analytics", "Multi-tenant"],
      image: "📊",
      color: "from-green-500 to-blue-500"
    },
    {
      title: "AI Prompt Trainer",
      timeframe: "20 minutes",
      description: "The very tool you're using now - built with the Blueprint Stack methodology",
      features: ["Interactive UI", "AI Integration", "Real-time Preview", "Responsive"],
      image: "🤖",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              Proof That <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">It Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              I've built fully functional, production-ready apps with this system so many times 
              it's practically my default workflow.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div 
                key={index}
                className="group hover:scale-105 transition-all duration-500"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`bg-gradient-to-br ${story.color} p-1 rounded-2xl shadow-xl hover:shadow-2xl`}>
                  <div className="bg-gray-800 rounded-xl p-8 h-full">
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">{story.image}</div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {story.title}
                      </h3>
                      <div className={`inline-block bg-gradient-to-r ${story.color} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
                        ⚡ Built in {story.timeframe}
                      </div>
                    </div>

                    <p className="text-gray-300 text-center mb-6 leading-relaxed">
                      {story.description}
                    </p>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide">
                        Key Features:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {story.features.map((feature, idx) => (
                          <span 
                            key={idx}
                            className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <div className="text-center">
                        <span className="text-green-400 font-semibold">✅ Production Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-8">
              <h3 className="text-3xl font-bold mb-4">
                Ready to Build Your Success Story?
              </h3>
              <p className="text-xl text-gray-300 mb-8">
                Join the builders who've transformed their workflow with the Blueprint Stack
              </p>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                🎥 Watch the Full Build Series
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProofSection;
