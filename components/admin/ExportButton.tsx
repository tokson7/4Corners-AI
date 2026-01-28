'use client'

import { useState } from 'react'
import { Download, FileDown, FileJson } from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface ExportButtonProps {
  type: 'users' | 'designs' | 'analytics'
  selectedIds?: string[]
  label?: string
}

export default function ExportButton({ type, selectedIds = [], label }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [format, setFormat] = useState<'csv' | 'json'>(type === 'designs' ? 'json' : 'csv')
  const [exportScope, setExportScope] = useState<'all' | 'selected'>('all')
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const params = new URLSearchParams({ format })
      
      // Add IDs if exporting selected items
      if (exportScope === 'selected' && selectedIds.length > 0) {
        const idParam = type === 'users' ? 'userIds' : 'designIds'
        params.append(idParam, selectedIds.join(','))
      }

      const response = await fetch(`/api/admin/export/${type}?${params}`)
      
      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}-export-${Date.now()}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setIsOpen(false)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'users':
        return 'Export Users'
      case 'designs':
        return 'Export Design Systems'
      case 'analytics':
        return 'Export Analytics'
      default:
        return 'Export Data'
    }
  }

  const getDescription = () => {
    switch (type) {
      case 'users':
        return 'Export user data including email, role, credits, and activity.'
      case 'designs':
        return 'Export design system data including colors, typography, and metadata.'
      case 'analytics':
        return 'Export analytics data including daily statistics and trends.'
      default:
        return 'Export data to a file.'
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="border-white/10"
        onClick={() => setIsOpen(true)}
      >
        <Download className="w-4 h-4 mr-2" />
        {label || 'Export'}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={getTitle()}>
        <div className="space-y-6">
          <p className="text-purple-300 text-sm">{getDescription()}</p>

          {/* Format Selection */}
          <div>
            <label className="text-sm font-medium text-purple-300 mb-3 block">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  format === 'csv'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  checked={format === 'csv'}
                  onChange={() => setFormat('csv')}
                  className="w-4 h-4 text-purple-600"
                />
                <div className="flex items-center gap-2 flex-1">
                  <FileDown className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">CSV</p>
                    <p className="text-xs text-purple-400">Spreadsheet format</p>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  format === 'json'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  checked={format === 'json'}
                  onChange={() => setFormat('json')}
                  className="w-4 h-4 text-purple-600"
                />
                <div className="flex items-center gap-2 flex-1">
                  <FileJson className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">JSON</p>
                    <p className="text-xs text-purple-400">Structured data</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Export Scope (only for users and designs) */}
          {type !== 'analytics' && (
            <div>
              <label className="text-sm font-medium text-purple-300 mb-3 block">
                Export Scope
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:border-white/20 cursor-pointer transition-all">
                  <input
                    type="radio"
                    checked={exportScope === 'all'}
                    onChange={() => setExportScope('all')}
                    className="w-4 h-4 text-purple-600"
                  />
                  <div>
                    <p className="text-white font-medium">All {type}</p>
                    <p className="text-xs text-purple-400">
                      Export all records from the database
                    </p>
                  </div>
                </label>

                {selectedIds.length > 0 && (
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:border-white/20 cursor-pointer transition-all">
                    <input
                      type="radio"
                      checked={exportScope === 'selected'}
                      onChange={() => setExportScope('selected')}
                      className="w-4 h-4 text-purple-600"
                    />
                    <div>
                      <p className="text-white font-medium">
                        Selected only ({selectedIds.length})
                      </p>
                      <p className="text-xs text-purple-400">
                        Export only the currently selected items
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={exporting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={exporting || (exportScope === 'selected' && selectedIds.length === 0)}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {exporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
