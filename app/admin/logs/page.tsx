'use client'

import { useState, useEffect } from 'react'
import { Search, Calendar, Filter, Download, Clock, User, Shield, Trash2, Edit, Settings } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Select from '@/components/ui/Select'

interface AdminLog {
  id: string
  adminId: string
  action: string
  targetId: string | null
  details: any
  createdAt: string
  adminName: string
  adminEmail: string
  targetInfo?: {
    type: 'user' | 'design'
    email?: string
    name?: string
  } | null
}

interface Admin {
  id: string
  name: string
  email: string
}

const ACTION_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  // User Actions
  banned_user: { icon: Shield, color: 'red', label: 'Banned User' },
  unbanned_user: { icon: Shield, color: 'green', label: 'Unbanned User' },
  deleted_user: { icon: Trash2, color: 'red', label: 'Deleted User' },
  changed_role: { icon: User, color: 'blue', label: 'Changed Role' },
  added_credits: { icon: Clock, color: 'green', label: 'Added Credits' },
  removed_credits: { icon: Clock, color: 'yellow', label: 'Removed Credits' },
  
  // Design Actions
  deleted_design: { icon: Trash2, color: 'red', label: 'Deleted Design' },
  featured_design: { icon: Clock, color: 'green', label: 'Featured Design' },
  unfeatured_design: { icon: Clock, color: 'yellow', label: 'Unfeatured Design' },
  changed_status: { icon: Edit, color: 'blue', label: 'Changed Status' },
  
  // Settings Actions
  updated_settings: { icon: Settings, color: 'yellow', label: 'Updated Settings' },
  changed_config: { icon: Settings, color: 'blue', label: 'Changed Config' },
  
  // Bulk Actions
  bulk_delete: { icon: Trash2, color: 'red', label: 'Bulk Delete' },
  bulk_ban: { icon: Shield, color: 'red', label: 'Bulk Ban' },
  bulk_credits: { icon: Clock, color: 'blue', label: 'Bulk Credits' },
}

const COLOR_CLASSES = {
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
}

function getRelativeTime(date: string) {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return past.toLocaleDateString()
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedAction, setSelectedAction] = useState<string>('all')
  const [selectedAdmin, setSelectedAdmin] = useState<string>('all')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  })

  useEffect(() => {
    fetchLogs()
  }, [search, selectedAction, selectedAdmin, pagination.page])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search,
      })

      if (selectedAction !== 'all') params.append('action', selectedAction)
      if (selectedAdmin !== 'all') params.append('adminId', selectedAdmin)

      const response = await fetch(`/api/admin/logs?${params}`)
      const data = await response.json()

      setLogs(data.logs)
      setAdmins(data.admins || [])
      setPagination(data.pagination)
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatLogDescription = (log: AdminLog) => {
    const config = ACTION_CONFIG[log.action] || {
      icon: Clock,
      color: 'blue',
      label: log.action,
    }

    let description = `${log.adminName} `

    switch (log.action) {
      case 'banned_user':
        description += `banned user ${log.targetInfo?.email || 'unknown'}`
        break
      case 'unbanned_user':
        description += `unbanned user ${log.targetInfo?.email || 'unknown'}`
        break
      case 'deleted_user':
        description += `deleted user ${log.targetInfo?.email || 'unknown'}`
        break
      case 'changed_role':
        description += `changed role for ${log.targetInfo?.email || 'a user'}`
        if (log.details?.newRole) description += ` to ${log.details.newRole}`
        break
      case 'added_credits':
        description += `added ${log.details?.amount || '?'} credits to ${log.targetInfo?.email || 'a user'}`
        break
      case 'removed_credits':
        description += `removed ${log.details?.amount || '?'} credits from ${log.targetInfo?.email || 'a user'}`
        break
      case 'deleted_design':
        description += `deleted design "${log.targetInfo?.name || 'unknown'}"`
        break
      case 'featured_design':
        description += `featured design "${log.targetInfo?.name || 'unknown'}"`
        break
      case 'unfeatured_design':
        description += `unfeatured design "${log.targetInfo?.name || 'unknown'}"`
        break
      case 'changed_status':
        description += `changed status for design "${log.targetInfo?.name || 'unknown'}"`
        if (log.details?.newStatus) description += ` to ${log.details.newStatus}`
        break
      case 'updated_settings':
        description += 'updated platform settings'
        break
      case 'changed_config':
        description += 'changed configuration'
        break
      default:
        description += log.action.replace(/_/g, ' ')
    }

    return { description, config }
  }

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Activity Logs</h1>
        <p className="text-purple-300">Track all admin actions and platform changes</p>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <Input
              placeholder="Search logs..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="pl-10 bg-slate-800 border-white/10 text-white"
            />
          </div>

          <Select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            options={[
              { value: 'all', label: 'All Actions' },
              ...Object.entries(ACTION_CONFIG).map(([key, config]) => ({
                value: key,
                label: config.label,
              })),
            ]}
            className="w-full md:w-[200px]"
          />

          <Select
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(e.target.value)}
            options={[
              { value: 'all', label: 'All Admins' },
              ...admins.map((admin) => ({
                value: admin.id,
                label: admin.name,
              })),
            ]}
            className="w-full md:w-[200px]"
          />
        </div>
      </div>

      {/* Logs Timeline */}
      <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-purple-300 mt-4">Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">No activity logs found</p>
            <p className="text-purple-300 text-sm">Admin actions will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => {
              const { description, config } = formatLogDescription(log)
              const Icon = config.icon

              return (
                <div
                  key={log.id}
                  className="flex gap-4 p-4 rounded-lg bg-slate-800/50 border border-white/5 hover:border-purple-500/30 transition-colors"
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                      COLOR_CLASSES[config.color as keyof typeof COLOR_CLASSES]
                    } border`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <p className="text-white font-medium">{description}</p>
                        <p className="text-purple-300 text-sm mt-1">
                          {getRelativeTime(log.createdAt)}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={COLOR_CLASSES[config.color as keyof typeof COLOR_CLASSES]}
                      >
                        {config.label}
                      </Badge>
                    </div>

                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="mt-2 p-3 bg-slate-900 rounded-lg border border-white/5">
                        <p className="text-xs text-purple-400 mb-1">Details:</p>
                        <pre className="text-xs text-purple-300 overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && logs.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-purple-300">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} logs
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.pages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
