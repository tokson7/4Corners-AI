import { 
  AlertCircle, 
  Sparkles, 
  Target, 
  FileText, 
  Download,
  Cpu,
  Shield,
  Zap,
  Lock
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About - 4Corners AI',
  description: 'Building the future of design systems with AI. Professional design accessible to everyone.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Static Background - 0 Performance Cost */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
          }}
        />
        
        {/* Purple radial overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)'
          }}
        />
        
        {/* Blue radial overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)'
          }}
        />
        
        {/* Grain texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px'
          }}
        />
      </div>

      {/* Section 1: Hero */}
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
            Building the Future of Design Systems
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto mb-8 leading-relaxed">
            We believe professional design should be accessible to everyone. 
            4Corners AI combines cutting-edge artificial intelligence with 
            decades of design expertise to generate complete, production-ready 
            design systems in seconds.
          </p>
        </div>
      </section>

      {/* Section 2: The Story */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1: The Problem */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl transition-transform duration-300 hover:scale-105">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">The Problem</h2>
              <p className="text-purple-200 leading-relaxed">
                Traditional design systems take weeks to create and require 
                expensive design teams. Small businesses and startups struggle 
                to compete with enterprise-level design quality, limiting their 
                growth potential.
              </p>
            </div>

            {/* Card 2: Our Solution */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl transition-transform duration-300 hover:scale-105">
              <Sparkles className="w-12 h-12 text-purple-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Our Solution</h2>
              <p className="text-purple-200 leading-relaxed">
                4Corners AI generates complete design systems—colors, typography, 
                components—in under 30 seconds. Using advanced AI trained on 
                thousands of professional designs, we deliver enterprise-quality 
                results at a fraction of the cost.
              </p>
            </div>

            {/* Card 3: Why It Matters */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl transition-transform duration-300 hover:scale-105">
              <Target className="w-12 h-12 text-blue-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Why It Matters</h2>
              <p className="text-purple-200 leading-relaxed">
                Every business deserves professional design. By democratizing 
                access to design systems, we&apos;re leveling the playing field and 
                helping creators focus on what they do best—building amazing 
                products.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-purple-950/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl font-bold text-purple-400">1</span>
                <FileText className="w-10 h-10 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Describe Your Brand</h3>
              <p className="text-purple-200">
                Tell us about your project in a few sentences. Our AI understands 
                your vision, industry, and target audience.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl font-bold text-blue-400">2</span>
                <Sparkles className="w-10 h-10 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Generates Your System</h3>
              <p className="text-purple-200">
                Advanced algorithms create a complete design system with colors, 
                typography, spacing, and components—all perfectly balanced.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl font-bold text-green-400">3</span>
                <Download className="w-10 h-10 text-green-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Export & Implement</h3>
              <p className="text-purple-200">
                Download your design system in multiple formats: CSS, Tailwind, 
                Figma, or React. Ready for production in seconds.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Section 4: Stats */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Trusted by Creators Worldwide
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Stat 1 */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-xl text-center transition-colors duration-300 hover:border-purple-500/50">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                10,000+
              </div>
              <div className="text-purple-200 text-sm">Design Systems Created</div>
            </div>

            {/* Stat 2 */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-xl text-center transition-colors duration-300 hover:border-purple-500/50">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                50+
              </div>
              <div className="text-purple-200 text-sm">Countries Worldwide</div>
            </div>

            {/* Stat 3 */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-xl text-center transition-colors duration-300 hover:border-purple-500/50">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                30sec
              </div>
              <div className="text-purple-200 text-sm">Average Generation Time</div>
            </div>

            {/* Stat 4 */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-xl text-center transition-colors duration-300 hover:border-purple-500/50">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                4.9/5
              </div>
              <div className="text-purple-200 text-sm">User Satisfaction</div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 5: Technology */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Powered by Advanced AI
          </h2>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto mb-12">
            We use cutting-edge machine learning models trained on 
            thousands of professional design systems to ensure every 
            generation meets industry standards.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Feature 1 */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
              <Cpu className="w-8 h-8 text-purple-400 flex-shrink-0" />
              <span className="text-purple-200 text-left">GPT-4 & Gemini Pro AI Models</span>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
              <Shield className="w-8 h-8 text-blue-400 flex-shrink-0" />
              <span className="text-purple-200 text-left">Enterprise-Grade Security</span>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
              <Zap className="w-8 h-8 text-yellow-400 flex-shrink-0" />
              <span className="text-purple-200 text-left">Lightning-Fast Generation</span>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
              <Lock className="w-8 h-8 text-green-400 flex-shrink-0" />
              <span className="text-purple-200 text-left">Privacy-First Architecture</span>
            </div>

          </div>
        </div>
      </section>

      {/* Section 6: CTA */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-purple-950/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Creating Today
          </h2>
          <p className="text-xl text-purple-200 mb-8">
            Try 4Corners AI free—3 generations to explore the power 
            of AI-driven design. No credit card required.
          </p>

          <Link 
            href="/generate"
            className="inline-block px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-full text-white shadow-2xl shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
          >
            Get 3 Free Generations
          </Link>

          <p className="text-sm text-purple-300 mt-4">
            No credit card • 3 free generations • Full features
          </p>
        </div>
      </section>

    </div>
  );
}
