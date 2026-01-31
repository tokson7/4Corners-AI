'use client';

import { useState } from 'react';
import { 
  Rocket, 
  Download, 
  Code, 
  HelpCircle,
  Search,
  Copy,
  Check,
  Mail,
  MessageCircle,
  FileText,
  Palette,
  Settings,
  BookOpen,
  Zap,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: Rocket, color: 'text-purple-400' },
    { id: 'how-to-use', title: 'How to Use', icon: BookOpen, color: 'text-blue-400' },
    { id: 'export-formats', title: 'Export Formats', icon: Download, color: 'text-green-400' },
    { id: 'design-tokens', title: 'Design Tokens', icon: Palette, color: 'text-yellow-400' },
    { id: 'integration', title: 'Integration Examples', icon: Code, color: 'text-cyan-400' },
    { id: 'faqs', title: 'FAQs', icon: HelpCircle, color: 'text-pink-400' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: Settings, color: 'text-red-400' },
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="relative mt-4 mb-6">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => copyCode(code, id)}
          className="p-2 rounded-lg bg-slate-900/50 border border-white/10 hover:border-purple-500/50 transition-colors"
          aria-label="Copy code"
        >
          {copiedCode === id ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-purple-400" />
          )}
        </button>
      </div>
      <div className="bg-slate-950/50 border border-white/10 rounded-xl p-6 overflow-x-auto">
        <pre className="font-mono text-sm text-purple-100">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Static Background - 0 Performance Cost */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)'
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)'
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px'
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto mb-8 leading-relaxed">
            Everything you need to master 4Corners AI. From quick start 
            guides to advanced integrations—we&apos;ve got you covered.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full backdrop-blur-xl bg-white/5 border border-white/10 px-14 py-4 rounded-full text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            {searchQuery && (
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-sm text-purple-300">
                {filteredSections.length} result{filteredSections.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.slice(0, 4).map((section) => {
              const Icon = section.icon;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-xl hover:scale-105 transform transition-all duration-300 cursor-pointer group"
                >
                  <Icon className={`w-12 h-12 ${section.color} mb-4 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-xl font-semibold text-white mb-2">{section.title}</h3>
                  <p className="text-sm text-purple-300">
                    {section.id === 'getting-started' && '5-minute quick start'}
                    {section.id === 'export-formats' && 'CSS, Tailwind, Figma, React'}
                    {section.id === 'design-tokens' && 'Understanding tokens'}
                    {section.id === 'faqs' && 'Common questions'}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">

        {/* Section 1: Getting Started */}
        <section id="getting-started" className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl scroll-mt-24">
          <h2 className="text-4xl font-bold text-white mb-8">Getting Started</h2>
          
          <p className="text-lg text-purple-200 leading-relaxed mb-8">
            Welcome to 4Corners AI! This guide will get you up and running in less than 5 minutes.
          </p>

          <div className="space-y-8">
            {/* Step 1 */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 border-2 border-purple-500 text-purple-400 text-sm font-bold">1</span>
                Sign Up (or Use Free Trial)
              </h3>
              <p className="text-lg text-purple-200 leading-relaxed mb-4">
                Create your account to access all features. You get <strong>3 free generations</strong> to explore the platform—no credit card required.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/sign-up" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg text-white font-semibold transition-all">
                  Sign Up Free
                </Link>
                <span className="text-sm text-purple-300">Already have an account? <Link href="/sign-in" className="text-purple-400 hover:text-purple-300 underline">Sign in</Link></span>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 border-2 border-purple-500 text-purple-400 text-sm font-bold">2</span>
                Describe Your Brand
              </h3>
              <p className="text-lg text-purple-200 leading-relaxed mb-4">
                Navigate to the Generator page and describe your brand or project in a few sentences. Be specific about:
              </p>
              <ul className="space-y-2 list-disc list-inside text-purple-200 mb-4">
                <li>Industry (e.g., &quot;Modern SaaS&quot;, &quot;Healthcare app&quot;)</li>
                <li>Mood (e.g., &quot;Professional&quot;, &quot;Playful&quot;, &quot;Minimalist&quot;)</li>
                <li>Target audience (e.g., &quot;Developers&quot;, &quot;Consumers&quot;)</li>
              </ul>
              <div className="bg-slate-950/50 border border-white/10 rounded-xl p-6">
                <p className="text-sm text-purple-300 mb-2">Example:</p>
                <p className="text-purple-100 italic">
                  &quot;A modern productivity app for remote teams. Professional yet friendly, with a focus on clarity and efficiency.&quot;
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 border-2 border-purple-500 text-purple-400 text-sm font-bold">3</span>
                Generate Your Design System
              </h3>
              <p className="text-lg text-purple-200 leading-relaxed mb-4">
                Click &quot;Generate&quot; and wait 10-30 seconds. Our AI will create:
              </p>
              <ul className="space-y-2 text-purple-200">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Complete color palette (88+ shades)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Typography system (10+ font pairings)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Spacing scale (8 sizes)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Component styles</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Semantic colors</span>
                </li>
              </ul>
            </div>

            {/* Step 4 */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 border-2 border-purple-500 text-purple-400 text-sm font-bold">4</span>
                Review & Customize
              </h3>
              <p className="text-lg text-purple-200 leading-relaxed mb-4">
                Explore the tabs:
              </p>
              <ul className="space-y-2 list-disc list-inside text-purple-200 mb-4">
                <li><strong>Colors:</strong> View primary, secondary, neutral palettes</li>
                <li><strong>Typography:</strong> Test font combinations</li>
                <li><strong>Components:</strong> Preview button, card, input styles</li>
              </ul>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-200 flex items-start gap-2">
                  <Zap className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span><strong>Pro tip:</strong> Click any color to copy hex code instantly</span>
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 border-2 border-purple-500 text-purple-400 text-sm font-bold">5</span>
                Export Your System
              </h3>
              <p className="text-lg text-purple-200 leading-relaxed mb-4">
                Choose your preferred format and download:
              </p>
              <ul className="space-y-2 list-disc list-inside text-purple-200 mb-6">
                <li>CSS Variables (.css)</li>
                <li>Tailwind Config (.js)</li>
                <li>Figma Plugin (coming soon)</li>
                <li>React Theme (.tsx)</li>
              </ul>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-200 text-lg font-semibold">
                  That&apos;s it! You now have a production-ready design system. 🎉
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: How to Use */}
        <section id="how-to-use" className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl scroll-mt-24">
          <h2 className="text-4xl font-bold text-white mb-8">How to Use 4Corners AI</h2>

          <div className="space-y-10">
            {/* Subsection 2.1 */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">The Generator</h3>
              <p className="text-lg text-purple-200 leading-relaxed mb-4">
                The Generator is where the magic happens.
              </p>
              
              <h4 className="text-xl font-semibold text-white mb-3">Writing Effective Prompts</h4>
              <p className="text-lg text-purple-200 leading-relaxed mb-4">
                The better your description, the better your results.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                  <p className="text-green-400 font-semibold mb-3">✓ Good prompts include:</p>
                  <ul className="space-y-2 text-purple-200 text-sm">
                    <li>• Industry/category</li>
                    <li>• Brand personality</li>
                    <li>• Target audience</li>
                    <li>• Specific requirements</li>
                  </ul>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                  <p className="text-red-400 font-semibold mb-3">✗ Avoid vague prompts:</p>
                  <ul className="space-y-2 text-purple-200 text-sm">
                    <li>• &quot;Make something nice&quot;</li>
                    <li>• &quot;Cool colors&quot;</li>
                    <li>• &quot;Professional&quot; (too generic)</li>
                    <li>• Single-word descriptions</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950/50 border border-white/10 rounded-xl p-6">
                  <p className="text-sm text-green-400 mb-2 font-semibold">Example Good Prompt:</p>
                  <p className="text-purple-100">
                    &quot;Modern fintech app for millennials. Clean, trustworthy, and innovative. Focus on blues and purples with excellent contrast for accessibility.&quot;
                  </p>
                </div>

                <div className="bg-slate-950/50 border border-white/10 rounded-xl p-6">
                  <p className="text-sm text-red-400 mb-2 font-semibold">Example Bad Prompt:</p>
                  <p className="text-purple-100">
                    &quot;Make something nice&quot;
                  </p>
                  <p className="text-sm text-purple-300 mt-2 italic">
                    (Too vague - AI can&apos;t understand your vision)
                  </p>
                </div>
              </div>

              <h4 className="text-xl font-semibold text-white mb-3 mt-8">Generation Time</h4>
              <ul className="space-y-2 text-purple-200">
                <li>• <strong>Basic tier:</strong> 10-15 seconds</li>
                <li>• <strong>Professional:</strong> 15-25 seconds</li>
                <li>• <strong>Enterprise:</strong> 20-30 seconds</li>
              </ul>
              <p className="text-sm text-purple-300 mt-3 italic">
                Longer generation = more colors and fonts = better quality
              </p>
            </div>

            {/* Subsection 2.2 */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">Exploring Results</h3>
              <p className="text-lg text-purple-200 leading-relaxed mb-6">
                Once generated, you&apos;ll see 3 tabs:
              </p>

              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-6">
                  <h4 className="text-xl font-semibold text-white mb-3">Tab 1: Colors</h4>
                  <p className="text-purple-200 mb-3">View your complete color system:</p>
                  <ul className="space-y-2 text-purple-200 text-sm">
                    <li>• Primary palette (11 shades from 50-950)</li>
                    <li>• Secondary palette (11 shades)</li>
                    <li>• Neutral palette (11 shades from gray-50 to gray-950)</li>
                    <li>• Semantic colors (success, warning, error, info)</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-6">
                  <h4 className="text-xl font-semibold text-white mb-3">Tab 2: Typography</h4>
                  <p className="text-purple-200 mb-3">Your curated font pairings:</p>
                  <ul className="space-y-2 text-purple-200 text-sm">
                    <li>• Heading font + Body font combinations</li>
                    <li>• Weight recommendations</li>
                    <li>• Size scale (from xs to 4xl)</li>
                    <li>• Line height guidelines</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h4 className="text-xl font-semibold text-white mb-3">Tab 3: Components</h4>
                  <p className="text-purple-200 mb-3">Pre-styled components using your design system:</p>
                  <ul className="space-y-2 text-purple-200 text-sm">
                    <li>• Buttons (primary, secondary, ghost)</li>
                    <li>• Inputs (text, email, search)</li>
                    <li>• Cards (default, hover states)</li>
                    <li>• Badges (default, success, warning, error)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Export Formats */}
        <section id="export-formats" className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl scroll-mt-24">
          <h2 className="text-4xl font-bold text-white mb-8">Export Formats</h2>
          <p className="text-lg text-purple-200 leading-relaxed mb-8">
            We support multiple export formats for maximum compatibility.
          </p>

          <div className="space-y-10">
            {/* Format 1: CSS */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">Format 1: CSS Variables</h3>
              <p className="text-purple-200 mb-4">
                <strong className="text-purple-300">Perfect for:</strong> Vanilla HTML/CSS projects
              </p>
              
              <div className="mb-4">
                <p className="text-sm text-purple-300 mb-2">What you get:</p>
                <ul className="space-y-1 text-purple-200 text-sm list-disc list-inside">
                  <li>:root &#123; &#125; with all color variables</li>
                  <li>Typography CSS classes</li>
                  <li>Component styles</li>
                </ul>
              </div>

              <CodeBlock
                id="css-example"
                language="css"
                code={`:root {
  --primary-50: #f5f3ff;
  --primary-500: #8b5cf6;
  --primary-900: #4c1d95;
  
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Open Sans', sans-serif;
}

.btn-primary {
  background: var(--primary-500);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
}`}
              />

              <div className="text-sm text-purple-300">
                <p className="mb-2"><strong>How to use:</strong></p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Download the .css file</li>
                  <li>Link in your HTML: &lt;link href=&quot;design-system.css&quot;&gt;</li>
                  <li>Use variables: color: var(--primary-500)</li>
                </ol>
              </div>
            </div>

            {/* Format 2: Tailwind */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">Format 2: Tailwind Config</h3>
              <p className="text-purple-200 mb-4">
                <strong className="text-purple-300">Perfect for:</strong> Tailwind CSS projects
              </p>

              <CodeBlock
                id="tailwind-example"
                language="javascript"
                code={`module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          500: '#8b5cf6',
          900: '#4c1d95',
        },
        secondary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      }
    }
  }
}`}
              />

              <div className="text-sm text-purple-300">
                <p className="mb-2"><strong>How to use:</strong></p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Download tailwind.config.js</li>
                  <li>Replace your config file</li>
                  <li>Use classes: bg-primary-500 text-secondary-700</li>
                </ol>
              </div>
            </div>

            {/* Format 3: React Theme */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">Format 3: React Theme (TypeScript)</h3>
              <p className="text-purple-200 mb-4">
                <strong className="text-purple-300">Perfect for:</strong> React/Next.js projects
              </p>

              <CodeBlock
                id="react-example"
                language="typescript"
                code={`export const theme = {
  colors: {
    primary: {
      50: '#f5f3ff',
      500: '#8b5cf6',
      900: '#4c1d95',
    }
  },
  typography: {
    heading: 'Inter',
    body: 'Open Sans',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
  }
} as const;

export type Theme = typeof theme;`}
              />

              <div className="text-sm text-purple-300">
                <p className="mb-2"><strong>How to use:</strong></p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Download theme.ts</li>
                  <li>Import: import &#123; theme &#125; from &apos;./theme&apos;</li>
                  <li>Use: backgroundColor: theme.colors.primary[500]</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Design Tokens */}
        <section id="design-tokens" className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl scroll-mt-24">
          <h2 className="text-4xl font-bold text-white mb-8">Understanding Design Tokens</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">What are Design Tokens?</h3>
              <p className="text-lg text-purple-200 leading-relaxed">
                Design tokens are the visual design atoms of your design system. They store values for colors, typography, spacing, and more in a platform-agnostic way.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">Why Use Tokens?</h3>
              <ul className="space-y-3 text-purple-200">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Consistency:</strong> Same values across all platforms</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Maintainability:</strong> Change once, update everywhere</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Scalability:</strong> Easy to extend and modify</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Collaboration:</strong> Designers and developers speak same language</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">Token Categories</h3>
              
              <div className="space-y-6">
                <div className="bg-slate-950/30 border border-white/10 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-purple-300 mb-3">1. Color Tokens</h4>
                  <ul className="space-y-2 text-purple-200 text-sm">
                    <li>• Primary, secondary, neutral palettes</li>
                    <li>• Semantic colors (success, error, warning)</li>
                    <li>• Each with 11 shades (50, 100, 200...950)</li>
                  </ul>
                </div>

                <div className="bg-slate-950/30 border border-white/10 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-300 mb-3">2. Typography Tokens</h4>
                  <ul className="space-y-2 text-purple-200 text-sm">
                    <li>• Font families (heading, body, mono)</li>
                    <li>• Font sizes (xs, sm, base, lg, xl, 2xl, 3xl, 4xl)</li>
                    <li>• Font weights (light, regular, medium, semibold, bold)</li>
                    <li>• Line heights (tight, normal, relaxed)</li>
                  </ul>
                </div>

                <div className="bg-slate-950/30 border border-white/10 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-300 mb-3">3. Spacing Tokens</h4>
                  <ul className="space-y-2 text-purple-200 text-sm">
                    <li>• Scale: 0, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24</li>
                    <li>• Use for margins, padding, gaps</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-purple-300 mb-3">How 4Corners AI Generates Tokens</h4>
              <p className="text-purple-200 mb-4">Our AI analyzes your brand description and generates:</p>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li>1. Harmonious color palettes using color theory</li>
                <li>2. Accessible contrast ratios (WCAG AAA)</li>
                <li>3. Semantic naming conventions</li>
                <li>4. Balanced spacing scales</li>
                <li>5. Typography pairings from 1000+ font combinations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5: Integration Examples */}
        <section id="integration" className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl scroll-mt-24">
          <h2 className="text-4xl font-bold text-white mb-8">Integration Examples</h2>

          <div className="space-y-10">
            {/* Next.js + Tailwind */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">Next.js + Tailwind</h3>
              <CodeBlock
                id="nextjs-example"
                language="typescript"
                code={`// app/layout.tsx
import './globals.css'

// components/Button.tsx
export default function Button() {
  return (
    <button className="bg-primary-500 hover:bg-primary-600 
                       text-white px-4 py-2 rounded-lg
                       transition-colors">
      Click me
    </button>
  )
}`}
              />
            </div>

            {/* React + CSS Variables */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">React + CSS Variables</h3>
              <CodeBlock
                id="react-css-example"
                language="typescript"
                code={`// app/layout.tsx
import './design-system.css'

// Button.tsx
const Button = () => (
  <button style={{
    backgroundColor: 'var(--primary-500)',
    color: 'var(--white)',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
  }}>
    Click me
  </button>
)`}
              />
            </div>

            {/* Vanilla HTML */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">Vanilla HTML/CSS</h3>
              <CodeBlock
                id="html-example"
                language="html"
                code={`<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="design-system.css">
</head>
<body>
  <button class="btn-primary">
    Click me
  </button>
</body>
</html>`}
              />
            </div>
          </div>
        </section>

        {/* Section 6: FAQs */}
        <section id="faqs" className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl scroll-mt-24">
          <h2 className="text-4xl font-bold text-white mb-8">Frequently Asked Questions</h2>

          <div className="space-y-8">
            {[
              {
                q: "How many design systems can I generate?",
                a: "Your plan determines generation limits:\n• Free: 3 generations (no credit card)\n• Basic ($3.99/mo): 50 generations/month\n• Professional ($9.99/mo): 250 generations/month\n• Enterprise ($29.99/mo): 1200 generations/month"
              },
              {
                q: "Can I edit the generated design system?",
                a: "Currently, systems are generated as-is. We recommend:\n1. Generate with detailed prompts for best results\n2. Export and manually adjust if needed\n3. Custom editing features coming soon!"
              },
              {
                q: "What AI model do you use?",
                a: "We use GPT-4o and Gemini Pro, trained on thousands of professional design systems to ensure quality."
              },
              {
                q: "Are the colors accessible?",
                a: "Yes! All color combinations meet WCAG AA standards. Many meet WCAG AAA for enhanced accessibility."
              },
              {
                q: "Can I use this commercially?",
                a: "Absolutely! All generated design systems are 100% yours to use in personal and commercial projects."
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer a 30-day money-back guarantee on all paid plans. Contact support@4cornersai.com"
              },
            ].map((faq, index) => (
              <div key={index} className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-xl font-semibold text-white mb-3">{faq.q}</h3>
                <p className="text-purple-200 whitespace-pre-line leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Troubleshooting */}
        <section id="troubleshooting" className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl scroll-mt-24">
          <h2 className="text-4xl font-bold text-white mb-8">Troubleshooting</h2>

          <div className="space-y-8">
            {[
              {
                issue: "Generation takes too long",
                symptoms: "Loading for 60+ seconds",
                solutions: [
                  "Refresh the page and try again",
                  "Check your internet connection",
                  "Try a simpler prompt",
                  "Contact support if issue persists"
                ],
                expected: "10-30 seconds"
              },
              {
                issue: "Results don't match my description",
                symptoms: "Colors or fonts feel wrong",
                solutions: [
                  "Write more detailed prompts",
                  "Specify exact mood/industry",
                  'Include examples: "Like Stripe" or "Like Apple"',
                  "Try regenerating with adjusted description"
                ]
              },
              {
                issue: "Can't download export",
                symptoms: "Download button doesn't work",
                solutions: [
                  "Check browser popup blocker",
                  "Try different browser",
                  "Clear cache and cookies",
                  'Use "Copy to Clipboard" instead'
                ]
              },
              {
                issue: "Colors not showing in my project",
                symptoms: "CSS variables not working",
                solutions: [
                  "Ensure CSS file is linked correctly",
                  "Check variable names match (--primary-500)",
                  "Verify :root scope in CSS",
                  "Inspect element to debug"
                ]
              },
            ].map((item, index) => (
              <div key={index} className="bg-slate-950/30 border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-red-400 mb-2">{item.issue}</h3>
                <p className="text-purple-300 text-sm mb-4"><strong>Symptoms:</strong> {item.symptoms}</p>
                <p className="text-purple-300 text-sm mb-3"><strong>Solutions:</strong></p>
                <ul className="space-y-2 text-purple-200 text-sm">
                  {item.solutions.map((solution, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{solution}</span>
                    </li>
                  ))}
                </ul>
                {item.expected && (
                  <p className="text-purple-300 text-sm mt-3"><strong>Expected time:</strong> {item.expected}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-transparent to-purple-950/30 rounded-2xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Need More Help?</h2>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help you succeed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:support@4cornersai.com"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-full text-white font-semibold transition-all inline-flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </a>
            <a
              href="#"
              className="px-8 py-4 border-2 border-white/20 hover:border-white/40 rounded-full text-white font-semibold transition-all inline-flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Join Community
            </a>
          </div>

          <p className="text-sm text-purple-300 mt-6">
            Average response time: 24 hours
          </p>
        </section>

      </div>
    </div>
  );
}
