'use client';

import { useState } from 'react';
import { Check, Copy, Code2, Eye } from 'lucide-react';
import type { ComponentVariant, Framework } from '@/lib/types/components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ComponentViewerProps {
  variant: ComponentVariant;
}

export function ComponentViewer({ variant }: ComponentViewerProps) {
  const [selectedFramework, setSelectedFramework] = useState<Framework>('react');
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const frameworks: { value: Framework; label: string }[] = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'html', label: 'HTML/CSS' },
  ];

  const languageMap: Record<Framework, string> = {
    react: 'tsx',
    vue: 'html',
    svelte: 'html',
    html: 'html',
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(variant.code[selectedFramework]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">{variant.name}</h3>
          {variant.description && (
            <p className="text-sm text-muted-foreground mt-1">{variant.description}</p>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setView('preview')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
              view === 'preview'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setView('code')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
              view === 'code'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Code
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {view === 'preview' && variant.preview ? (
          <div className="bg-white rounded-lg p-8 min-h-[200px] flex items-center justify-center">
            <div
              dangerouslySetInnerHTML={{ __html: variant.preview.html }}
              className="component-preview"
            />
            <style dangerouslySetInnerHTML={{ __html: variant.preview.css || '' }} />
          </div>
        ) : view === 'code' ? (
          <div className="space-y-4">
            {/* Framework Selector */}
            <div className="flex gap-2 flex-wrap">
              {frameworks.map((fw) => (
                <button
                  key={fw.value}
                  onClick={() => setSelectedFramework(fw.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedFramework === fw.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {fw.label}
                </button>
              ))}
            </div>

            {/* Code Display */}
            <div className="relative">
              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 z-10 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>

              <SyntaxHighlighter
                language={languageMap[selectedFramework]}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: '8px',
                  maxHeight: '500px',
                  fontSize: '14px',
                }}
                showLineNumbers
              >
                {variant.code[selectedFramework]}
              </SyntaxHighlighter>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 rounded-lg p-8 text-center text-gray-400">
            <p>Preview not available</p>
          </div>
        )}
      </div>
    </div>
  );
}
