'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Separator from '@/components/ui/Separator'
import Label from '@/components/ui/Label'
import Input from '@/components/ui/Input'

export interface UserFilters {
  roles: string[]
  statuses: string[]
  plans: string[]
  minCredits: string
  maxCredits: string
}

interface UserFiltersProps {
  filters: UserFilters
  onFiltersChange: (filters: UserFilters) => void
  activeCount: number
}

export default function UserFiltersComponent({ filters, onFiltersChange, activeCount }: UserFiltersProps) {
  const [open, setOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<UserFilters>(filters)

  const handleCheckboxChange = (category: 'roles' | 'statuses' | 'plans', value: string) => {
    setLocalFilters((prev) => {
      const current = prev[category]
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
      return { ...prev, [category]: updated }
    })
  }

  const handleApply = () => {
    onFiltersChange(localFilters)
    setOpen(false)
  }

  const handleClear = () => {
    const clearedFilters: UserFilters = {
      roles: [],
      statuses: [],
      plans: [],
      minCredits: '',
      maxCredits: '',
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
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
        className="w-80 h-[500px] bg-slate-900 border-white/10 p-0 flex flex-col shadow-xl"
      >
        {/* SCROLLABLE FILTERS - Takes available space */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
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

            {/* Role Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-purple-300">Role</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={localFilters.roles.includes('USER')}
                    onCheckedChange={() => handleCheckboxChange('roles', 'USER')}
                  />
                  <span className="text-sm text-white">User</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={localFilters.roles.includes('ADMIN')}
                    onCheckedChange={() => handleCheckboxChange('roles', 'ADMIN')}
                  />
                  <span className="text-sm text-white">Admin</span>
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
                    checked={localFilters.statuses.includes('active')}
                    onCheckedChange={() => handleCheckboxChange('statuses', 'active')}
                  />
                  <span className="text-sm text-white">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={localFilters.statuses.includes('banned')}
                    onCheckedChange={() => handleCheckboxChange('statuses', 'banned')}
                  />
                  <span className="text-sm text-white">Banned</span>
                </label>
              </div>
            </div>

            <Separator />

            {/* Plan Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-purple-300">Plan</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={localFilters.plans.includes('free')}
                    onCheckedChange={() => handleCheckboxChange('plans', 'free')}
                  />
                  <span className="text-sm text-white">Free</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={localFilters.plans.includes('premium')}
                    onCheckedChange={() => handleCheckboxChange('plans', 'premium')}
                  />
                  <span className="text-sm text-white">Premium</span>
                </label>
              </div>
            </div>

            <Separator />

            {/* Credits Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-purple-300">Credits Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="minCredits" className="text-xs text-purple-400">
                    Min
                  </Label>
                  <Input
                    id="minCredits"
                    type="number"
                    placeholder="0"
                    value={localFilters.minCredits}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({ ...prev, minCredits: e.target.value }))
                    }
                    className="mt-1 bg-slate-800 border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="maxCredits" className="text-xs text-purple-400">
                    Max
                  </Label>
                  <Input
                    id="maxCredits"
                    type="number"
                    placeholder="100"
                    value={localFilters.maxCredits}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({ ...prev, maxCredits: e.target.value }))
                    }
                    className="mt-1 bg-slate-800 border-white/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FIXED BUTTONS AT BOTTOM - ALWAYS VISIBLE */}
        <div className="flex-shrink-0 border-t border-white/10 p-4 bg-slate-900 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-white/10 bg-slate-800 hover:bg-slate-700"
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
