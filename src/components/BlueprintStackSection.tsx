
const BlueprintStackSection = () => {
  const stackLayers = [
    {
      title: "Core Build Prompts",
      description: "Proven prompts to auto-generate app components in Lovable",
      icon: "🧠",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Master Blueprint Template",
      description: "A living system map detailing every module, dependency, and UI component",
      icon: "📐",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Refactor Engine",
      description: "Automatic code cleaning that turns bloated files into efficient modules",
      icon: "⚡",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Error Recovery Layer",
      description: "AI-driven prompts that detect and fix console errors automatically",
      icon: "🛠️",
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Platform Patterns",
      description: "Pre-trained flows and integrations for Lovable 2.0 and beyond",
      icon: "🚀",
      color: "from-pink-500 to-pink-600"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">
              Meet the <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">NoCodeLos Blueprint Stack</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Your AI-Powered Building System
            </p>
          </div>

          <div className="mb-12">
            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto text-center mb-8">
              This is the game changer. Instead of a one-off spec, the Blueprint Stack is an entire system 
              that shows you exactly how to structure, prompt, and refine your app. With tested prompts and 
              workflows, you'll never guess your way through a build again.
            </p>
          </div>

          {/* Stack Visualization */}
          <div className="relative">
            <div className="flex flex-col space-y-6">
              {stackLayers.map((layer, index) => (
                <div 
                  key={index}
                  className="group hover:scale-105 transition-all duration-300 cursor-pointer"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className={`bg-gradient-to-r ${layer.color} p-1 rounded-2xl shadow-lg hover:shadow-xl`}>
                    <div className="bg-white rounded-xl p-8">
                      <div className="flex items-start space-x-6">
                        <div className="text-4xl">{layer.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {layer.title}
                          </h3>
                          <p className="text-gray-700 text-lg leading-relaxed">
                            {layer.description}
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Connecting Lines */}
            <div className="absolute left-12 top-20 bottom-20 w-0.5 bg-gradient-to-b from-purple-300 to-pink-300 opacity-30 hidden lg:block"></div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Experience the Stack?
              </h3>
              <p className="text-xl text-gray-700 mb-8">
                See how each layer works together to create your perfect build prompt.
              </p>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Try the Interactive Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlueprintStackSection;
