const ProblemSection = () => {
  return <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-8 text-gray-900">
            Most people are wasting time <br />
            <span className="text-red-500">prompting AI the wrong way.</span>
            <br />
            <span className="text-3xl md:text-4xl font-normal text-gray-700 mt-4 block">
              You don't have to.
            </span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-16 items-center mt-16">
            {/* Problem Description */}
            <div className="space-y-8">
              <div className="text-xl md:text-2xl text-gray-700 leading-relaxed space-y-6">
                <p className="text-zinc-50">
                  You've probably asked ChatGPT to help you build an app. Maybe you spent hours in conversation… 
                  and ended up with a generic spec doc or broken template.
                </p>
                <p className="font-semibold text-gray-50">
                  That's not your fault. It's the method.
                </p>
              </div>
              
              {/* Truth Bombs */}
              <div className="bg-red-50 border-l-4 border-red-500 p-6 space-y-4">
                <h3 className="text-xl font-bold text-red-800 mb-4">Truth is:</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-lg">PRDs weren't built for AI workflows</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-lg">Most prompts are trial-and-error guesswork</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-gray-700 text-lg">Without a system, AI slows you down instead of speeding you up</span>
                  </div>
                </div>
              </div>

              {/* Punchline */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-xl p-8">
                <p className="text-2xl font-bold text-gray-900 text-center">
                  I spent a year solving this—and now I'm giving you the exact stack that works.
                </p>
              </div>
            </div>

            {/* Visual Comparison */}
            <div className="relative space-y-8">
              {/* Wrong Way */}
              <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-red-500 relative">
                <div className="absolute -top-3 -right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  ❌ THE OLD WAY
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Random ChatGPT Prompting</h3>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse delay-100"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse delay-200"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse delay-300"></div>
                </div>
                <div className="mt-6 text-red-600 text-sm font-medium space-y-1">
                  <p>⏰ Hours of back-and-forth</p>
                  <p>🐛 Broken, untested code</p>
                  <p>📄 Generic templates</p>
                  <p>😤 Endless frustration</p>
                </div>
              </div>
              
              {/* Right Way */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-xl p-8 border-l-4 border-purple-500 relative">
                <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  ✅ THE BLUEPRINT WAY
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">NoCodeLos Blueprint Stack</h3>
                <div className="space-y-3">
                  <div className="h-3 bg-gradient-to-r from-purple-300 to-pink-300 rounded w-full animate-pulse"></div>
                  <div className="h-3 bg-gradient-to-r from-purple-300 to-pink-300 rounded w-4/5 animate-pulse delay-100"></div>
                  <div className="h-3 bg-gradient-to-r from-purple-300 to-pink-300 rounded w-3/4 animate-pulse delay-200"></div>
                  <div className="h-3 bg-gradient-to-r from-purple-300 to-pink-300 rounded w-5/6 animate-pulse delay-300"></div>
                </div>
                <div className="mt-6 text-green-600 text-sm font-medium space-y-1">
                  <p>⚡ 30-second prompt generation</p>
                  <p>🎯 Production-ready code</p>
                  <p>🧠 AI-optimized workflows</p>
                  <p>🚀 Apps that actually ship</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ProblemSection;