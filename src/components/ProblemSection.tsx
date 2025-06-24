
const ProblemSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-12 text-gray-900">
            Stop Wasting Time with <span className="text-red-500">Outdated PRDs</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Problem Description */}
            <div className="space-y-6">
              <p className="text-xl text-gray-700 leading-relaxed">
                Most builders spend hours with ChatGPT and other tools, chasing after half-baked PRDs and generic specs. 
                Traditional product documents focus on <em>what</em> to build, but they miss the <strong>how</strong>.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed">
                Without a system designed for AI-native workflows, you're prone to bloated templates, endless revisions, 
                and stalled projects.
              </p>
              
              {/* Pain Points */}
              <div className="space-y-4 mt-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Hours wasted on generic ChatGPT conversations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Endless revisions with no clear direction</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Bloated templates that don't fit your needs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Projects that stall before they start</span>
                </div>
              </div>
            </div>

            {/* Visual Comparison */}
            <div className="relative">
              <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-red-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Traditional PRD</h3>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="mt-4 text-red-600 text-sm font-medium">
                  ❌ Static, confusing, incomplete
                </div>
              </div>
              
              <div className="absolute top-4 -right-4 transform rotate-12">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  VS
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-lg p-8 border-l-4 border-purple-500 mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Blueprint Stack</h3>
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-purple-300 to-pink-300 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-purple-300 to-pink-300 rounded w-4/5 animate-pulse delay-100"></div>
                  <div className="h-4 bg-gradient-to-r from-purple-300 to-pink-300 rounded w-3/4 animate-pulse delay-200"></div>
                  <div className="h-4 bg-gradient-to-r from-purple-300 to-pink-300 rounded w-5/6 animate-pulse delay-300"></div>
                </div>
                <div className="mt-4 text-green-600 text-sm font-medium">
                  ✅ Dynamic, interactive, complete system
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
