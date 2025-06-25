import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { analytics } from "../services/analyticsService";
import Logo from "./Logo";

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      analytics.trackScrollToSection(sectionId);
      console.log(`📍 Scrolled to section: ${sectionId}`);
    }
  };

  const handleDownload = () => {
    analytics.trackDownload('master-blueprint.md');
    analytics.trackButtonClick('download-blueprint', 'hero');
    
    const blueprintContent = `
# NoCodeLos Blueprint Stack Master Template

## The System That Builds Production Apps Without Dev Teams

This is the exact system I use to build full-stack AI applications faster and cheaper than traditional development teams. No guesswork. No wasted time. Just proven workflows that work.

## The 5-Layer Stack Architecture

### Layer 1: Core Build Prompts
Pre-tested, battle-hardened prompts for every development scenario:
- Component generation with proper TypeScript interfaces
- State management implementation patterns
- API integration and error handling workflows
- Database schema and relationship patterns
- Authentication and authorization flows

### Layer 2: Master Blueprint Template
The new-generation replacement for outdated PRDs:
- AI-native project structure
- Component hierarchy guidelines
- Data flow architecture
- Performance optimization patterns
- Deployment and scaling strategies

### Layer 3: Refactor Engine
Code optimization without breaking functionality:
- Automated component splitting strategies
- Performance bottleneck identification
- Bundle size optimization techniques
- Memory leak prevention patterns
- Cross-browser compatibility fixes

### Layer 4: Error Recovery Layer
Zero-bug deployment workflows:
- Common error pattern recognition
- Automated debugging strategies
- Console error interpretation guides
- Production monitoring setup
- Rollback and recovery procedures

### Layer 5: Platform Optimization
Tool-specific best practices:
- Lovable-optimized development patterns
- Cursor IDE integration strategies
- Replit deployment workflows
- Cross-platform compatibility guides
- Performance monitoring implementations

## Implementation Methodology

### Phase 1: Project Initialization (15 minutes)
1. Define application requirements using the Blueprint Template
2. Generate core prompts using the Prompt Generator
3. Set up project structure and dependencies
4. Configure development environment

### Phase 2: Rapid Development (2-48 hours)
1. Execute generated prompts in sequence
2. Apply refactor patterns continuously
3. Implement error recovery protocols
4. Monitor performance metrics in real-time

### Phase 3: Production Deployment (30 minutes - 2 hours)
1. Performance optimization and bundle analysis
2. Security audit and vulnerability scanning
3. Accessibility compliance verification
4. Cross-browser testing and validation

## Quality Assurance Framework

### Development Standards
□ TypeScript coverage > 95%
□ Component reusability > 80%
□ Error boundary coverage = 100%
□ Loading state consistency = 100%
□ Form validation completeness = 100%

### Performance Benchmarks
□ First Contentful Paint < 1.5s
□ Largest Contentful Paint < 2.5s
□ First Input Delay < 100ms
□ Cumulative Layout Shift < 0.1
□ Time to Interactive < 3s

### User Experience Standards
□ Mobile-first responsive design
□ WCAG 2.1 AA compliance
□ Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
□ Progressive enhancement implementation
□ Offline functionality where applicable

## Advanced Implementation Patterns

### Custom Hook Architecture
\`\`\`typescript
// Data fetching with error recovery
const useApiData = (endpoint: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Implementation with retry logic and error boundaries
};

// Form management with validation
const useFormManager = (schema: ValidationSchema) => {
  // Advanced form state management
};
\`\`\`

### Context Management Patterns
\`\`\`typescript
// Global state with TypeScript safety
interface AppContextType {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

const AppContext = createContext<AppContextType | null>(null);
\`\`\`

### Component Composition Strategies
\`\`\`typescript
// Flexible, reusable component patterns
interface FlexibleComponentProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
\`\`\`

## Troubleshooting Protocols

### Build Error Resolution
1. TypeScript interface validation
2. Import/export dependency checking
3. Component prop type verification
4. Bundle analysis and optimization

### Runtime Error Management
1. Error boundary implementation
2. Console error monitoring
3. User-friendly error messaging
4. Automatic error reporting

### Performance Issue Diagnosis
1. Component render analysis
2. Network request optimization
3. Bundle size investigation
4. Memory usage monitoring

## Success Metrics

### Development Velocity
- Initial prototype: 2-4 hours
- MVP completion: 1-3 days
- Production deployment: 3-7 days
- Feature additions: <4 hours average

### Quality Metrics
- Zero critical bugs in production
- 95%+ user satisfaction scores
- <3 second average load times
- 100% accessibility compliance

### Cost Efficiency
- 90% reduction in development costs
- Zero ongoing developer salaries
- Minimal hosting and infrastructure costs
- Rapid iteration and feature deployment

## Community and Support

### Resources
- Weekly live coding sessions
- Community Discord for real-time help
- Video tutorial library with 50+ hours
- Direct access to creator for advanced questions

### Continuous Updates
- Monthly template improvements
- New prompt patterns based on community feedback
- Platform-specific optimizations
- Integration with emerging AI tools

---

## Getting Started Today

1. Download this master blueprint
2. Set up your development environment
3. Generate your first optimized prompt
4. Join the NoCodeLos community
5. Start building your first production app

For support and community access:
- Website: https://nocodelos.com
- Discord: https://discord.gg/nocodelos
- YouTube: https://youtube.com/@nocodelos
- TikTok: @nocodelos

Generated by NoCodeLos Blueprint Stack v3.0
© 2024 NoCodeLos. All rights reserved.

"This blueprint has been tested on 100+ production applications and continues to evolve based on real-world usage and community feedback."
    `;

    const blob = new Blob([blueprintContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nocodelos-complete-blueprint-stack-v3.md';
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('📥 Master Blueprint v3.0 downloaded');
  };

  const handleWatchSeries = () => {
    analytics.trackSocialClick('youtube');
    analytics.trackButtonClick('watch-series', 'hero');
    
    window.open('https://youtube.com/playlist?list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO', '_blank');
    console.log('🎥 Opening YouTube build series');
  };

  const handlePromptGenerator = () => {
    analytics.trackButtonClick('prompt-generator', 'hero');
    scrollToSection('interactive-demo');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden pt-32">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      
      {/* Lovable Watermark */}
      <div className="absolute top-8 right-8 text-purple-300/50 text-sm font-medium">
        Built with Lovable ⚡
      </div>

      {/* Logo in top left */}
      <div className="absolute top-8 left-8">
        <Logo size="lg" className="animate-pulse" />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Logo showcase in center */}
          <div className="mb-8 flex justify-center">
            <div className="h-48 md:h-64 lg:h-80 w-auto">
              <img 
                src="/lovable-uploads/cd49efdf-9fb4-4552-b98b-348b575a8c29.png" 
                alt="NoCodeLos Logo" 
                className="h-full w-auto object-contain filter drop-shadow-lg animate-fade-in"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5)) drop-shadow(0 0 40px rgba(147, 51, 234, 0.3))'
                }}
              />
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            <span className="text-white">
              Build Full-Stack AI Apps.
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent animate-pulse">
              No Dev Team. No Time Waste.
            </span>
          </h1>

          {/* Enhanced Subheadline */}
          <div className="text-xl md:text-2xl text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed space-y-4">
            <p className="text-2xl md:text-3xl text-white font-semibold">
              I build production-ready apps faster—and cheaper—than most devs.
            </p>
            <p className="text-xl md:text-2xl">
              Now you can, too.
            </p>
            <p className="text-lg md:text-xl">
              Welcome to the <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-bold">NoCodeLos Blueprint Stack</span>: 
              my custom system of prompts, templates, and workflows that turn AI into your full-time engineer.
            </p>
          </div>

          {/* Primary CTA Buttons with logo-inspired styling */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              onClick={handlePromptGenerator}
              size="lg" 
              className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 hover:from-blue-600 hover:via-purple-600 hover:to-red-600 text-white px-10 py-5 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-blue-300/30"
              style={{
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.4), 0 0 60px rgba(147, 51, 234, 0.2), inset 0 1px 3px rgba(255, 255, 255, 0.2)'
              }}
            >
              🧠 Try the Prompt Generator
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-red-400/20 rounded-full animate-pulse"></div>
            </Button>
            <Button 
              onClick={handleDownload}
              variant="outline" 
              size="lg"
              className="relative border-2 border-blue-400 text-blue-400 hover:bg-gradient-to-r hover:from-blue-400/10 hover:to-purple-400/10 hover:text-white px-10 py-5 text-xl font-bold rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm bg-black/50"
              style={{
                borderImage: 'linear-gradient(45deg, #60A5FA, #A855F7, #EF4444) 1',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
              }}
            >
              📐 Download the Master Blueprint
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-red-400/10 rounded-full animate-pulse"></div>
            </Button>
          </div>

          {/* Secondary Action */}
          <div className="mb-16">
            <Button 
              onClick={handleWatchSeries}
              variant="ghost" 
              size="lg"
              className="relative text-gray-300 hover:text-white px-8 py-4 text-lg font-semibold rounded-full border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 backdrop-blur-sm bg-black/30 hover:bg-black/50"
              style={{
                boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)'
              }}
            >
              🎥 Watch the Blueprint Stack in Action
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-red-400/5 rounded-full"></div>
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div 
            className="animate-bounce cursor-pointer"
            onClick={() => scrollToSection('problem-section')}
          >
            <ArrowDown className="w-8 h-8 text-blue-400 mx-auto filter drop-shadow-lg" 
                      style={{ filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))' }} />
          </div>
        </div>
      </div>

      {/* Enhanced Floating Elements with logo colors */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-red-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
      <div className="absolute bottom-1/3 right-10 w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-700"></div>
    </section>
  );
};

export default HeroSection;
