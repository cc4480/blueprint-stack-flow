
const FinalCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.1%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Headline */}
          <h2 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Ready to Build
            </span>
            <br />
            <span className="text-white">Smarter?</span>
          </h2>

          {/* Subtext */}
          <div className="mb-12">
            <p className="text-2xl md:text-3xl text-gray-300 mb-6 leading-relaxed">
              Don't get stuck with outdated methods.
            </p>
            <p className="text-xl md:text-2xl text-purple-300 mb-6">
              Upgrade to the <span className="font-bold">NoCodeLos Blueprint Stack</span> and transform your no-code journey.
            </p>
            <p className="text-lg text-gray-400">
              Your next app, your next breakthrough—starts with the right system.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center mb-16">
            <button className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2">
              <span className="flex items-center space-x-3">
                <span>🧠</span>
                <span>Try the Prompt Generator Now</span>
              </span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm mt-2">
                Generate your first Blueprint Stack prompt in 30 seconds
              </div>
            </button>

            <button className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2">
              <span className="flex items-center space-x-3">
                <span>📐</span>
                <span>Download the Master Blueprint</span>
              </span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm mt-2">
                Get the complete system template and methodology
              </div>
            </button>

            <button className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2">
              <span className="flex items-center space-x-3">
                <span>🎥</span>
                <span>Watch the Full Build Series</span>
              </span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm mt-2">
                Step-by-step video tutorials and masterclasses
              </div>
            </button>
          </div>

          {/* Success Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-black text-purple-400 mb-2">48hrs</div>
              <div className="text-lg text-gray-300">Average build time for production apps</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-black text-pink-400 mb-2">90%</div>
              <div className="text-lg text-gray-300">Reduction in debugging time</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl font-black text-blue-400 mb-2">Zero</div>
              <div className="text-lg text-gray-300">Dev team required</div>
            </div>
          </div>

          {/* Final Message */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-xl text-gray-300 leading-relaxed">
              <span className="text-purple-400 font-semibold">This page you're reading?</span> Built with the exact system I'm teaching you. 
              Every component, every animation, every interaction—all generated using the NoCodeLos Blueprint Stack. 
              <span className="text-pink-400 font-semibold">This is your proof of concept.</span>
            </p>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
