'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Loader2, User, Calendar, Star, Palette, Type, ExternalLink } from 'lucide-react'

interface DesignDetailsModalProps {
  design: {
    id: string
    name: string
    brandDescription: string | null
    featured: boolean
    status: string
    createdAt: string
    user: {
      email: string
      firstName: string | null
      lastName: string | null
    }
  }
  open: boolean
  onClose: () => void
  onRefresh: () => void
}

interface DesignDetails {
  id: string
  name: string
  brandDescription: string | null
  colors: any
  typography: any
  metadata: any
  featured: boolean
  status: string
  createdAt: string
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    role: string
  }
}

export default function DesignDetailsModal({
  design,
  open,
  onClose,
  onRefresh,
}: DesignDetailsModalProps) {
  const [details, setDetails] = useState<DesignDetails | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchDetails()
    }
  }, [open, design.id])

  const fetchDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/designs/${design.id}`)
      const data = await response.json()
      setDetails(data)
    } catch (error) {
      console.error('Failed to fetch design details:', error)
    } finally {
      setLoading(false)
    }
  }

  const parseColors = (colors: any) => {
    try {
      const colorObj = typeof colors === 'string' ? JSON.parse(colors) : colors
      return colorObj
    } catch {
      return {}
    }
  }

  const parseTypography = (typography: any) => {
    try {
      const typoObj = typeof typography === 'string' ? JSON.parse(typography) : typography
      return typoObj
    } catch {
      return {}
    }
  }

  const renderColorPalette = (colors: any, name: string) => {
    if (!colors || typeof colors !== 'object') return null

    return (
      <div className="mb-6">
        <h4 className="text-sm font-medium text-purple-300 mb-3 capitalize">{name}</h4>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(colors).map(([shade, color]: [string, any]) => {
            if (typeof color !== 'string') return null
            return (
              <div key={shade} className="space-y-1">
                <div
                  className="w-full h-16 rounded-lg border border-white/20"
                  style={{ backgroundColor: color }}
                />
                <p className="text-xs text-purple-400 text-center">{shade}</p>
                <p className="text-xs text-white text-center font-mono">{color}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderTypography = (typography: any) => {
    if (!typography) return null

    const fonts = []
    if (typography.headingFont) {
      fonts.push({ name: typography.headingFont, type: 'Heading' })
    }
    if (typography.bodyFont) {
      fonts.push({ name: typography.bodyFont, type: 'Body' })
    }

    return (
      <div className="space-y-4">
        {fonts.map((font, idx) => (
          <div key={idx} className="bg-slate-700/30 rounded-lg p-4">
            <p className="text-sm text-purple-300 mb-2">{font.type} Font</p>
            <p className="text-2xl text-white font-semibold" style={{ fontFamily: font.name }}>
              {font.name}
            </p>
            <p className="text-sm text-purple-400 mt-2">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {details?.featured && (
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            )}
            Design System Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : details ? (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-slate-800 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-purple-300 mb-1">Name</p>
                  <p className="text-white font-medium">{details.name}</p>
                </div>

                <div>
                  <p className="text-sm text-purple-300 mb-1">Status</p>
                  <Badge
                    variant={details.status === 'ACTIVE' ? 'outline' : 'destructive'}
                    className={
                      details.status === 'ACTIVE'
                        ? 'border-green-500 text-green-400'
                        : ''
                    }
                  >
                    {details.status}
                  </Badge>
                </div>

                <div className="col-span-2">
                  <p className="text-sm text-purple-300 mb-1">Description</p>
                  <p className="text-white">
                    {details.brandDescription || 'No description provided'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-purple-300 mb-1">Creator</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-white text-sm">
                        {details.user.firstName && details.user.lastName
                          ? `${details.user.firstName} ${details.user.lastName}`
                          : details.user.firstName || 'No name'}
                      </p>
                      <p className="text-xs text-purple-400">{details.user.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-purple-300 mb-1">Created</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <p className="text-white text-sm">
                      {new Date(details.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-purple-300 mb-1">Featured</p>
                  <Badge variant={details.featured ? 'default' : 'secondary'}>
                    {details.featured ? 'Yes' : 'No'}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-purple-300 mb-1">User Role</p>
                  <Badge
                    variant={details.user.role === 'ADMIN' ? 'default' : 'secondary'}
                    className={
                      details.user.role === 'ADMIN'
                        ? 'bg-purple-600'
                        : 'bg-slate-700'
                    }
                  >
                    {details.user.role}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Color Palette */}
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Palette className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Color Palette</h3>
              </div>

              {(() => {
                const colors = parseColors(details.colors)
                return (
                  <div className="space-y-6">
                    {colors.primary && renderColorPalette(colors.primary, 'Primary')}
                    {colors.secondary && renderColorPalette(colors.secondary, 'Secondary')}
                    {colors.accent && renderColorPalette(colors.accent, 'Accent')}
                    {colors.neutral && renderColorPalette(colors.neutral, 'Neutral')}
                    {colors.semantic && (
                      <div>
                        <h4 className="text-sm font-medium text-purple-300 mb-3">Semantic Colors</h4>
                        <div className="grid grid-cols-4 gap-3">
                          {Object.entries(colors.semantic).map(([name, color]: [string, any]) => {
                            if (typeof color !== 'string') return null
                            return (
                              <div key={name} className="space-y-1">
                                <div
                                  className="w-full h-12 rounded-lg border border-white/20"
                                  style={{ backgroundColor: color }}
                                />
                                <p className="text-xs text-purple-400 capitalize">{name}</p>
                                <p className="text-xs text-white font-mono">{color}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>

            {/* Typography */}
            {details.typography && (
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Type className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Typography</h3>
                </div>
                {renderTypography(parseTypography(details.typography))}
              </div>
            )}

            {/* Metadata */}
            {details.metadata && (
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Additional Information</h3>
                <pre className="bg-slate-700/50 rounded p-4 text-xs text-purple-300 overflow-x-auto">
                  {JSON.stringify(
                    typeof details.metadata === 'string'
                      ? JSON.parse(details.metadata)
                      : details.metadata,
                    null,
                    2
                  )}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => window.open(`/dashboard/designs/${details.id}`, '_blank')}
                className="border-white/10 text-white hover:bg-white/5"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Full View
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-white/10 text-white hover:bg-white/5"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-purple-300">
            Failed to load design details
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
