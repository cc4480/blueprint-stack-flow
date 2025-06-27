const CommunitySection = () => {
  const socialPlatforms = [{
    name: "TikTok",
    handle: "@NoCodeLos",
    followers: "50K+",
    description: "Quick build tips and behind-the-scenes content",
    icon: "🎵",
    color: "from-pink-500 to-red-500",
    url: "https://tiktok.com/@nocodelos"
  }, {
    name: "YouTube",
    handle: "NoCodeLos Channel",
    followers: "25K+",
    description: "Deep-dive tutorials and masterclass content",
    icon: "📺",
    color: "from-red-500 to-orange-500",
    url: "https://youtube.com/@nocodelos"
  }, {
    name: "Community",
    handle: "Blueprint Builders",
    followers: "2K+",
    description: "Exclusive access to updates and live sessions",
    icon: "👥",
    color: "from-purple-500 to-blue-500",
    url: "https://discord.gg/nocodelos"
  }];
  const learningPoints = ["Convert conversations into scalable systems", "Master each module of the Blueprint Stack", "Get exclusive updates and new methodologies", "Access live masterclasses and Q&A sessions"];
  const handleSocialClick = (platform: typeof socialPlatforms[0]) => {
    window.open(platform.url, '_blank', 'noopener,noreferrer');
    console.log(`🔗 Opening ${platform.name}: ${platform.url}`);
  };
  const handleYouTubeSubscribe = () => {
    window.open('https://youtube.com/@nocodelos?sub_confirmation=1', '_blank', 'noopener,noreferrer');
    console.log('📺 Opening YouTube subscription page');
  };
  const handleCommunityJoin = () => {
    window.open('https://discord.gg/nocodelos', '_blank', 'noopener,noreferrer');
    console.log('👥 Opening Discord community');
  };
  return <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-gray-900">
              Join a Movement of <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI-First Builders</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              When you embrace the Blueprint Stack, you're not just getting a set of prompts—you're 
              learning a way to think in systems.
            </p>
          </div>

          {/* Learning Benefits */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-8">
                What You'll Learn:
              </h3>
              <div className="space-y-6">
                {learningPoints.map((point, index) => <div key={index} className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-lg text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                      {point}
                    </p>
                  </div>)}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Coming Next: Deep-Dive Series
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">🎯 Advanced Prompt Engineering</h4>
                  <p className="text-gray-600 text-sm">Master the art of AI conversation</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">🔧 System Architecture Masterclass</h4>
                  <p className="text-gray-600 text-sm">Build scalable, maintainable applications</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">🚀 Platform Mastery Workshops</h4>
                  <p className="text-gray-600 text-sm">Beyond Lovable: Multi-platform strategies</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Platforms */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {socialPlatforms.map((platform, index) => <div key={index} className="group hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => handleSocialClick(platform)}>
                <div className={`bg-gradient-to-br ${platform.color} p-1 rounded-2xl shadow-lg hover:shadow-xl`}>
                  <div className="rounded-xl p-8 text-center h-full bg-slate-950">
                    <div className="text-4xl mb-4">{platform.icon}</div>
                    <h3 className="text-2xl font-bold mb-2 text-zinc-50">
                      {platform.name}
                    </h3>
                    <div className={`inline-block bg-gradient-to-r ${platform.color} text-white px-3 py-1 rounded-full text-sm font-semibold mb-4`}>
                      {platform.followers} followers
                    </div>
                    <p className="text-gray-600 mb-6">
                      {platform.description}
                    </p>
                    <button className={`bg-gradient-to-r ${platform.color} text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 w-full`}>
                      Follow {platform.handle}
                    </button>
                  </div>
                </div>
              </div>)}
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-12 shadow-2xl">
              <h3 className="text-4xl font-bold mb-6">
                Ready to Transform Your Building Process?
              </h3>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of builders who've already upgraded their no-code workflow
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button onClick={handleYouTubeSubscribe} className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                  🎬 Subscribe to YouTube
                </button>
                <button onClick={handleCommunityJoin} className="bg-purple-800 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-900 transition-all duration-300 transform hover:scale-105">
                  👥 Join the Masterclass Community
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CommunitySection;