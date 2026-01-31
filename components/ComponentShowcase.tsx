'use client';

import { useState } from 'react';
import { Copy, Check, Code2, Eye } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { GeneratedComponent } from '@/lib/generators/enhancedComponentGenerator';

interface ComponentShowcaseProps {
  components: GeneratedComponent[];
}

type Framework = 'react' | 'vue' | 'svelte' | 'html';
type Category = 'button' | 'card' | 'input' | 'alert';

const categoryInfo: Record<Category, { name: string; icon: string; description: string }> = {
  button: {
    name: 'Buttons',
    icon: '🔘',
    description: 'Interactive buttons with multiple variants and states',
  },
  card: {
    name: 'Cards',
    icon: '🃏',
    description: 'Content containers with various styling options',
  },
  input: {
    name: 'Inputs',
    icon: '📝',
    description: 'Form input fields with labels and validation',
  },
  alert: {
    name: 'Alerts',
    icon: '🔔',
    description: 'Notification and message components',
  },
};

const frameworkInfo: Record<Framework, { name: string; color: string; lang: string }> = {
  react: { name: 'React', color: 'bg-blue-500', lang: 'tsx' },
  vue: { name: 'Vue', color: 'bg-green-500', lang: 'vue' },
  svelte: { name: 'Svelte', color: 'bg-orange-500', lang: 'svelte' },
  html: { name: 'HTML/CSS', color: 'bg-red-500', lang: 'html' },
};

export function ComponentShowcase({ components }: ComponentShowcaseProps) {
  const [selectedFramework, setSelectedFramework] = useState<Framework>('react');
  const [selectedCategory, setSelectedCategory] = useState<Category>('button');

  // Group components by category
  const componentsByCategory = components.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<Category, GeneratedComponent[]>);

  const currentComponents = componentsByCategory[selectedCategory] || [];
  const categories = Object.keys(componentsByCategory) as Category[];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass rounded-xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold mb-2">Component Library</h2>
        <p className="text-muted-foreground">
          Production-ready UI components generated from your design tokens
        </p>
      </div>

      {/* Category Navigation */}
      <div className="glass rounded-xl p-2 border border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {categories.map((category) => {
            const info = categoryInfo[category];
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-500/50' 
                    : 'hover:bg-white/5 border-2 border-transparent'
                  }
                `}
              >
                <span className="text-2xl">{info.icon}</span>
                <div className="text-center">
                  <div className="font-semibold text-sm">{info.name}</div>
                  <div className="text-xs text-muted-foreground hidden md:block">
                    {componentsByCategory[category]?.length || 0} variants
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Framework Selector */}
      <div className="glass rounded-xl p-4 border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Code2 className="w-5 h-5 text-purple-400" />
          <span className="font-semibold">Framework</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(frameworkInfo) as Framework[]).map((fw) => {
            const info = frameworkInfo[fw];
            const isActive = selectedFramework === fw;
            return (
              <button
                key={fw}
                onClick={() => setSelectedFramework(fw)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all
                  ${isActive
                    ? `${info.color} text-white shadow-lg`
                    : 'bg-white/5 hover:bg-white/10 text-foreground'
                  }
                `}
              >
                {info.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Description */}
      <div className="glass rounded-xl p-4 border border-white/10">
        <p className="text-sm text-muted-foreground">
          {categoryInfo[selectedCategory].description}
        </p>
      </div>

      {/* Component Variants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentComponents.map((component, idx) => (
          <ComponentCard
            key={`${component.variant}-${idx}`}
            component={component}
            framework={selectedFramework}
          />
        ))}
      </div>

      {/* Empty State */}
      {currentComponents.length === 0 && (
        <div className="glass rounded-xl p-12 text-center border border-white/10">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-muted-foreground">
            No components found in this category
          </p>
        </div>
      )}
    </div>
  );
}

function ComponentCard({ component, framework }: { component: GeneratedComponent; framework: Framework }) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const code = framework === 'html' 
    ? `${component.code.html}\n\n/* CSS */\n${component.code.css}`
    : component.code[framework];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lang = frameworkInfo[framework].lang;

  return (
    <div className="glass rounded-xl overflow-hidden border border-white/10">
      {/* Card Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-lg">{component.name}</h3>
            <p className="text-sm text-muted-foreground">{component.description}</p>
          </div>
          <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs font-medium">
            {component.variant}
          </span>
        </div>
      </div>

      {/* Preview/Code Toggle */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setShowCode(false)}
          className={`
            flex-1 px-4 py-2 flex items-center justify-center gap-2 transition-colors
            ${!showCode 
              ? 'bg-purple-500/20 text-purple-400 border-b-2 border-purple-500' 
              : 'hover:bg-white/5 text-muted-foreground'
            }
          `}
        >
          <Eye className="w-4 h-4" />
          <span className="font-medium">Preview</span>
        </button>
        <button
          onClick={() => setShowCode(true)}
          className={`
            flex-1 px-4 py-2 flex items-center justify-center gap-2 transition-colors
            ${showCode 
              ? 'bg-purple-500/20 text-purple-400 border-b-2 border-purple-500' 
              : 'hover:bg-white/5 text-muted-foreground'
            }
          `}
        >
          <Code2 className="w-4 h-4" />
          <span className="font-medium">Code</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {!showCode ? (
          /* Preview */
          <ComponentPreview component={component} framework={framework} />
        ) : (
          /* Code Display */
          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 z-10 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title="Copy code"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <div className="rounded-lg overflow-hidden">
              <SyntaxHighlighter
                language={lang}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  maxHeight: '400px',
                }}
                showLineNumbers={false}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </div>

      {/* Footer with metadata */}
      <div className="px-4 py-3 bg-white/5 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Framework: {frameworkInfo[framework].name}</span>
          <span>{code.split('\n').length} lines</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Component Preview Renderer
 * Safely renders React components and provides HTML/CSS previews
 */
function ComponentPreview({ component, framework }: { component: GeneratedComponent; framework: Framework }) {
  if (framework === 'react') {
    return <ReactComponentPreview code={component.code.react} />;
  }
  
  if (framework === 'html') {
    return <HTMLComponentPreview html={component.code.html} css={component.code.css} />;
  }
  
  // For Vue and Svelte, show code structure preview
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-8 min-h-[200px]">
      <div className="text-center text-muted-foreground mb-4">
        <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm font-medium">
          {framework === 'vue' ? 'Vue' : 'Svelte'} Component Structure
        </p>
        <p className="text-xs mt-1">
          Switch to Code tab to copy the full component
        </p>
      </div>
      <div className="max-w-2xl mx-auto bg-black/20 rounded-lg p-4">
        <pre className="text-xs text-muted-foreground overflow-x-auto">
          {framework === 'vue' ? component.code.vue.split('\n').slice(0, 15).join('\n') : 
           component.code.svelte.split('\n').slice(0, 15).join('\n')}
          {'\n...\n'}
        </pre>
      </div>
    </div>
  );
}

/**
 * React Component Preview
 * Renders React components in an iframe for isolation
 */
function ReactComponentPreview({ code }: { code: string }) {
  const [previewHtml, setPreviewHtml] = useState('');
  
  useState(() => {
    // Extract the component content for preview
    // This creates a safe isolated preview
    const componentMatch = code.match(/export default function \w+\(\) \{([\s\S]*)\}/);
    
    if (componentMatch) {
      const jsxContent = componentMatch[1].trim();
      // Remove return statement if present
      const cleanJsx = jsxContent.replace(/^return\s*\(?\s*/, '').replace(/\)?\s*;?\s*$/, '');
      
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: transparent;
                font-family: system-ui, -apple-system, sans-serif;
              }
            </style>
          </head>
          <body>
            ${cleanJsx}
          </body>
        </html>
      `;
      setPreviewHtml(html);
    }
  });

  if (!previewHtml) {
    return (
      <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-8 min-h-[200px] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Rendering preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-8 min-h-[200px] flex items-center justify-center">
      <iframe
        srcDoc={previewHtml}
        className="w-full min-h-[200px] border-0 rounded-lg bg-white/5"
        title="Component Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
}

/**
 * HTML/CSS Component Preview
 * Renders HTML with CSS in an iframe
 */
function HTMLComponentPreview({ html, css }: { html: string; css: string }) {
  const previewHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: transparent;
            font-family: system-ui, -apple-system, sans-serif;
          }
          ${css}
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-8 min-h-[200px] flex items-center justify-center">
      <iframe
        srcDoc={previewHtml}
        className="w-full min-h-[200px] border-0 rounded-lg bg-white/5"
        title="Component Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
}
