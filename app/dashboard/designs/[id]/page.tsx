'use client';

/**
 * Single Design System View Page
 * 
 * Displays a full design system with:
 * - Colors with all shades
 * - Typography scale
 * - Components (if any)
 * - Export options
 * - Edit/Delete actions
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Trash2, Share2, Loader2, Edit } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import ExportModal from '@/components/ExportModal';

interface DesignSystem {
  id: string;
  name: string;
  description?: string | null;
  colors: any;
  typography: any;
  components: any;
  isPublic: boolean;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export default function DesignSystemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [system, setSystem] = useState<DesignSystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchSystem();
    }
  }, [params.id]);

  const fetchSystem = async () => {
    try {
      const res = await fetch(`/api/design-systems/${params.id}`);
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch design system');
      }
      
      const data = await res.json();
      setSystem(data.system);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load design system');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${system?.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/design-systems/${params.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }

      // Redirect to designs page
      router.push('/dashboard/designs');
    } catch (error) {
      console.error('Delete error:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete design system');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading design system...</p>
        </div>
      </div>
    );
  }

  if (error || !system) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Design System Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error || 'This design system does not exist or you do not have access to it.'}
          </p>
          <Link href="/dashboard/designs">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Back to Design Systems
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const primaryColor = system.colors?.primary?.main || system.colors?.primary || '#8B5CF6';

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Background gradient */}
        <div className="fixed inset-0 gradient-subtle -z-10" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] -z-10" />

        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Back Button */}
            <Link href="/dashboard/designs">
              <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to all design systems
              </button>
            </Link>

            {/* Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-2xl shadow-lg flex-shrink-0"
                  style={{ backgroundColor: primaryColor }}
                />
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                    {system.name}
                  </h1>
                  {system.description && (
                    <p className="text-muted-foreground">{system.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span>Version {system.version}</span>
                    <span>•</span>
                    <span>
                      Created {new Date(system.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="px-4 py-2 glass rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all flex items-center gap-2"
                  title="Export design system"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Colors Section */}
          {system.colors && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 sm:p-8 border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-6">Colors</h2>
              <div className="space-y-6">
                {Object.entries(system.colors).map(([key, value]: [string, any]) => {
                  if (typeof value !== 'object') return null;
                  
                  // Special handling for semantic colors (contains nested objects: info, error, success, warning)
                  if (key === 'semantic') {
                    return (
                      <div key={key} className="space-y-4">
                        <h3 className="text-xl font-bold capitalize mb-4">{key} Colors</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4">
                          {Object.entries(value).map(([type, colorData]: [string, any]) => (
                            <div key={type} className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-12 h-12 rounded-lg shadow-md"
                                  style={{ backgroundColor: colorData.main || colorData['500'] || '#888' }}
                                />
                                <div>
                                  <h4 className="font-semibold capitalize">{type}</h4>
                                  <p className="text-sm text-muted-foreground font-mono">
                                    {colorData.main || colorData['500'] || 'N/A'}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Shades for semantic colors */}
                              {colorData.shades && typeof colorData.shades === 'object' && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                  {Object.entries(colorData.shades)
                                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                                    .map(([shade, colorValue]: [string, any]) => {
                                      // Handle both string hex values and objects with hex property
                                      const hexColor = typeof colorValue === 'string' ? colorValue : colorValue?.hex || colorValue;
                                      return (
                                        <div key={shade} className="flex-shrink-0 text-center">
                                          <div
                                            className="w-16 h-16 rounded-md shadow-sm mb-1"
                                            style={{ backgroundColor: hexColor }}
                                            title={`${shade}: ${hexColor}`}
                                          />
                                          <span className="text-xs text-muted-foreground block">{shade}</span>
                                        </div>
                                      );
                                    })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  
                  // Regular color handling (primary, secondary, accent, neutral, etc.)
                  const mainColor = value.main || value['500'] || '#888';
                  
                  return (
                    <div key={key} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg shadow-md"
                          style={{ backgroundColor: mainColor }}
                        />
                        <div>
                          <h3 className="font-semibold capitalize">{key}</h3>
                          <p className="text-sm text-muted-foreground font-mono">{mainColor}</p>
                        </div>
                      </div>
                      
                      {/* Shades */}
                      {value.shades && typeof value.shades === 'object' && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {Object.entries(value.shades)
                            .sort(([a], [b]) => parseInt(a) - parseInt(b))
                            .map(([shade, colorValue]: [string, any]) => {
                              // Handle both string hex values and objects with hex property
                              const hexColor = typeof colorValue === 'string' ? colorValue : colorValue?.hex || colorValue;
                              return (
                                <div key={shade} className="flex-shrink-0 text-center">
                                  <div
                                    className="w-16 h-16 rounded-md shadow-sm mb-1"
                                    style={{ backgroundColor: hexColor }}
                                    title={`${shade}: ${hexColor}`}
                                  />
                                  <span className="text-xs text-muted-foreground block">{shade}</span>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Typography Section */}
          {system.typography && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 sm:p-8 border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-6">Typography</h2>
              
              {/* Font Pairings (AI-generated structure) */}
              {system.typography.fontPairs && system.typography.fontPairs.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-4 text-lg">Font Pairings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {system.typography.fontPairs.map((pair: any, i: number) => (
                      <div key={pair.id || i} className="glass-strong rounded-lg p-4">
                        <h4 className="font-bold text-white mb-2">{pair.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{pair.description}</p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Heading</p>
                            <p className="text-base font-semibold">{pair.heading?.family || 'Sans Serif'}</p>
                            {pair.heading?.fallback && (
                              <p className="text-xs text-muted-foreground">Fallback: {pair.heading.fallback}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Body</p>
                            <p className="text-base">{pair.body?.family || 'Sans Serif'}</p>
                            {pair.body?.fallback && (
                              <p className="text-xs text-muted-foreground">Fallback: {pair.body.fallback}</p>
                            )}
                          </div>
                        </div>
                        {pair.useCase && (
                          <p className="text-xs text-purple-300 mt-3 italic">{pair.useCase}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Type Scale (AI-generated structure) */}
              {system.typography.typeScale && (
                <div className="space-y-3">
                  <h3 className="font-semibold mb-3 text-lg">Type Scale</h3>
                  {Object.entries(system.typography.typeScale).map(([size, value]: [string, any]) => (
                    <div key={size} className="flex items-baseline gap-4 p-2 rounded-lg hover:bg-white/5">
                      <span className="text-xs text-muted-foreground w-24 capitalize">{size}</span>
                      <span className="text-xs text-muted-foreground/60 w-20 font-mono">{value}</span>
                      <span className="text-foreground flex-1" style={{ fontSize: value }}>
                        The quick brown fox jumps over the lazy dog
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Legacy structure support (fonts.heading, fonts.body, etc.) */}
              {system.typography.fonts && !system.typography.fontPairs && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="glass-strong rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Heading</p>
                    <p className="text-lg font-semibold">{system.typography.fonts.heading}</p>
                  </div>
                  <div className="glass-strong rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Body</p>
                    <p className="text-lg font-semibold">{system.typography.fonts.body}</p>
                  </div>
                  <div className="glass-strong rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Mono</p>
                    <p className="text-lg font-semibold font-mono">{system.typography.fonts.mono}</p>
                  </div>
                </div>
              )}

              {/* Legacy scale support */}
              {system.typography.scale && !system.typography.typeScale && (
                <div className="space-y-3">
                  <h3 className="font-semibold mb-3">Type Scale</h3>
                  {Object.entries(system.typography.scale).map(([size, value]: [string, any]) => (
                    <div key={size} className="flex items-baseline gap-4 p-2 rounded-lg hover:bg-white/5">
                      <span className="text-xs text-muted-foreground w-20">{size}</span>
                      <span className="text-xs text-muted-foreground/60 w-16 font-mono">{value}</span>
                      <span className="text-foreground" style={{ fontSize: value }}>
                        The quick brown fox jumps over the lazy dog
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations */}
              {system.typography.recommendations && (
                <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <h3 className="font-semibold mb-2 text-purple-300">💡 Recommendations</h3>
                  <p className="text-sm text-muted-foreground">{system.typography.recommendations}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Components Section (if any) */}
          {system.components && Array.isArray(system.components) && system.components.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6 sm:p-8 border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-6">Components</h2>
              <p className="text-muted-foreground">
                {system.components.length} component{system.components.length !== 1 ? 's' : ''} generated
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal 
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        designSystem={system}
      />
    </PageTransition>
  );
}
