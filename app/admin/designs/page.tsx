'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, MoreVertical, Eye, Star, Trash2, ExternalLink } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import DesignDetailsModal from '@/components/admin/DesignDetailsModal'
import DesignFiltersComponent, { DesignFilters } from '@/components/admin/DesignFiltersComponent'
import ExportButton from '@/components/admin/ExportButton'

interface Design {
  id: string
  name: string
  brandDescription: string | null
  colors: any
  typography: any
  featured: boolean
  status: string
  createdAt: string
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
  }
}

export default function DesignSystemsPage() {
  const [designs, setDesigns] = useState<Design[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [filters, setFilters] = useState<DesignFilters>({
    featured: null,
    status: [],
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  // Calculate active filter count
  const activeFilterCount =
    (filters.featured !== null ? 1 : 0) +
    filters.status.length

  useEffect(() => {
    fetchDesigns()
  }, [search, pagination.page, filters])

  const fetchDesigns = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search,
      })

      // Add filter params
      if (filters.featured !== null) {
        params.append('featured', filters.featured.toString())
      }
      if (filters.status.length > 0) {
        params.append('status', filters.status.join(','))
      }

      const response = await fetch(`/api/admin/designs?${params}`)
      const data = await response.json()

      setDesigns(data.designs)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Failed to fetch designs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFeatured = async (designId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/designs/${designId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      })

      if (response.ok) {
        fetchDesigns()
      }
    } catch (error) {
      console.error('Failed to update design:', error)
    }
  }

  const handleDeleteDesign = async (designId: string) => {
    if (!confirm('Are you sure? This will permanently delete this design system.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/designs/${designId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchDesigns()
      }
    } catch (error) {
      console.error('Failed to delete design:', error)
    }
  }

  const getColorPreview = (colors: any) => {
    try {
      const colorObj = typeof colors === 'string' ? JSON.parse(colors) : colors
      const primaryColors = colorObj.primary || colorObj.colors?.primary || {}
      const colorValues = Object.values(primaryColors).filter((c: any) => typeof c === 'string')
      return colorValues.slice(0, 5) as string[]
    } catch {
      return []
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Design Systems</h1>
          <p className="text-purple-300">Manage and moderate all design systems</p>
        </div>
        <ExportButton type="designs" />
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900 border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <Input
              placeholder="Search by name, description, or user..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="pl-10 bg-slate-800 border-white/10 text-white"
            />
          </div>
          <DesignFiltersComponent
            filters={filters}
            onFiltersChange={(newFilters) => {
              setFilters(newFilters)
              setPagination((prev) => ({ ...prev, page: 1 }))
            }}
            activeCount={activeFilterCount}
          />
        </div>
      </div>

      {/* Designs Table */}
      <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-purple-300">Design System</TableHead>
              <TableHead className="text-purple-300">Colors</TableHead>
              <TableHead className="text-purple-300">Creator</TableHead>
              <TableHead className="text-purple-300">Status</TableHead>
              <TableHead className="text-purple-300">Created</TableHead>
              <TableHead className="text-purple-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-purple-300 py-12">
                  Loading design systems...
                </TableCell>
              </TableRow>
            ) : designs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-purple-300 py-12">
                  No design systems found
                </TableCell>
              </TableRow>
            ) : (
              designs.map((design) => (
                <TableRow key={design.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {design.featured && (
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      )}
                      <div>
                        <p className="font-medium text-white">{design.name}</p>
                        <p className="text-sm text-purple-400 line-clamp-1">
                          {design.brandDescription || 'No description'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {getColorPreview(design.colors).map((color, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded border border-white/20"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-white text-sm">
                      {design.user.firstName && design.user.lastName
                        ? `${design.user.firstName} ${design.user.lastName}`
                        : design.user.firstName || 'No name'}
                    </p>
                    <p className="text-xs text-purple-400">{design.user.email}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={design.status === 'ACTIVE' ? 'outline' : 'destructive'}
                      className={
                        design.status === 'ACTIVE'
                          ? 'border-green-500 text-green-400'
                          : ''
                      }
                    >
                      {design.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-purple-300 text-sm">
                      {new Date(design.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-purple-400">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-white/10">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedDesign(design)
                            setShowDetailsModal(true)
                          }}
                          className="text-white hover:bg-white/5"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => window.open(`/dashboard/designs/${design.id}`, '_blank')}
                          className="text-white hover:bg-white/5"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open in New Tab
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleFeatured(design.id, design.featured)}
                          className="text-white hover:bg-white/5"
                        >
                          <Star className="w-4 h-4 mr-2" />
                          {design.featured ? 'Unfeature' : 'Feature'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteDesign(design.id)}
                          className="text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Design
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-white/10">
            <p className="text-sm text-purple-300">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} designs
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="border-white/10"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="border-white/10"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Design Details Modal */}
      {selectedDesign && (
        <DesignDetailsModal
          design={selectedDesign}
          open={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedDesign(null)
          }}
          onRefresh={fetchDesigns}
        />
      )}
    </div>
  )
}
