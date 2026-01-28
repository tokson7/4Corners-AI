'use client'

import { useState } from 'react'
import { Filter } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Separator from '@/components/ui/Separator'
import Label from '@/components/ui/Label'

export interface DesignFilters {
  featured: boolean | null
  status: string[]
}

interface DesignFiltersProps {
  filters: DesignFilters
  onFiltersChange: (filters: DesignFilters) => void
  activeCount: number
}

export default function DesignFiltersComponent({ filters, onFiltersChange, activeCount }: DesignFiltersProps) {
  const [open, setOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<DesignFilters>(filters)

  const handleStatusChange = (status: string) => {
    setLocalFilters((prev) => {
      const current = prev.status
      const updated = current.includes(status)
        ? current.filter((s) => s !== status)
        : [...current, status]
      return { ...prev, status: updated }
    })
  }

  const handleApply = () => {
    onFiltersChange(localFilters)
    setOpen(false)
  }

  const handleClear = () => {
    const clearedFilters: DesignFilters = {
      featured: null,
      status: [],
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 border-white/10">
          <Filter className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs bg-purple-600 text-white rounded-full">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        side="bottom"
        sideOffset={8}
        className="w-80 max-h-[600px] p-0 bg-slate-900 border-white/10 overflow-hidden"
      >
        {/* Scrollable content area */}
        <div className="max-h-[500px] overflow-y-auto p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">Filters</h4>
              {activeCount > 0 && (
                <button
                  onClick={handleClear}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <Separator />

            {/* Featured Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-purple-300">Featured</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="featured"
                    checked={localFilters.featured === null}
                    onChange={() => setLocalFilters({ ...localFilters, featured: null })}
                    className="w-4 h-4 text-purple-600 bg-slate-800 border-white/10 focus:ring-purple-500"
                  />
                  <span className="text-sm text-white">All</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="featured"
                    checked={localFilters.featured === true}
                    onChange={() => setLocalFilters({ ...localFilters, featured: true })}
                    className="w-4 h-4 text-purple-600 bg-slate-800 border-white/10 focus:ring-purple-500"
                  />
                  <span className="text-sm text-white">Featured Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="featured"
                    checked={localFilters.featured === false}
                    onChange={() => setLocalFilters({ ...localFilters, featured: false })}
                    className="w-4 h-4 text-purple-600 bg-slate-800 border-white/10 focus:ring-purple-500"
                  />
                  <span className="text-sm text-white">Not Featured</span>
                </label>
              </div>
            </div>

            <Separator />

            {/* Status Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-purple-300">Status</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={localFilters.status.includes('ACTIVE')}
                    onCheckedChange={() => handleStatusChange('ACTIVE')}
                  />
                  <span className="text-sm text-white">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={localFilters.status.includes('DELETED')}
                    onCheckedChange={() => handleStatusChange('DELETED')}
                  />
                  <span className="text-sm text-white">Deleted</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={localFilters.status.includes('FLAGGED')}
                    onCheckedChange={() => handleStatusChange('FLAGGED')}
                  />
                  <span className="text-sm text-white">Flagged</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer with buttons */}
        <div className="border-t border-white/10 p-4 bg-slate-900 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-white/10"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
