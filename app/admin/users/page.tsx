'use client'

import { useState, useEffect } from 'react'
import { Search, UserPlus, Filter, MoreVertical, Ban, Shield, Coins, Trash2 } from 'lucide-react'
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
import UserDetailsModal from '@/components/admin/UserDetailsModal'
import EditCreditsModal from '@/components/admin/EditCreditsModal'
import UserFiltersComponent, { UserFilters } from '@/components/admin/UserFiltersComponent'
import BulkActionsToolbar from '@/components/admin/BulkActionsToolbar'
import ExportButton from '@/components/admin/ExportButton'

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
  banned: boolean
  credits: number
  plan: string
  createdAt: string
  _count: {
    designSystems: number
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showCreditsModal, setShowCreditsModal] = useState(false)
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [filters, setFilters] = useState<UserFilters>({
    roles: [],
    statuses: [],
    plans: [],
    minCredits: '',
    maxCredits: '',
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  // Calculate active filter count
  const activeFilterCount =
    filters.roles.length +
    filters.statuses.length +
    filters.plans.length +
    (filters.minCredits ? 1 : 0) +
    (filters.maxCredits ? 1 : 0)

  useEffect(() => {
    fetchUsers()
  }, [search, pagination.page, filters])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search,
      })

      // Add filter params
      if (filters.roles.length > 0) {
        params.append('roles', filters.roles.join(','))
      }
      if (filters.statuses.length > 0) {
        params.append('statuses', filters.statuses.join(','))
      }
      if (filters.plans.length > 0) {
        params.append('plans', filters.plans.join(','))
      }
      if (filters.minCredits) {
        params.append('minCredits', filters.minCredits)
      }
      if (filters.maxCredits) {
        params.append('maxCredits', filters.maxCredits)
      }

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()

      setUsers(data.users)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBanUser = async (userId: string, currentBanned: boolean) => {
    if (!confirm(`Are you sure you want to ${currentBanned ? 'unban' : 'ban'} this user?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banned: !currentBanned }),
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  const handleChangeRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
    
    if (!confirm(`Change user role to ${newRole}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  const handleEditCredits = (user: User) => {
    setSelectedUser(user)
    setShowCreditsModal(true)
  }

  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setShowDetailsModal(true)
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure? This will delete all user data including design systems.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const handleBulkAction = async (action: string, value?: number) => {
    try {
      const response = await fetch('/api/admin/users/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: selectedUserIds,
          action,
          value,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(data.message || 'Action completed successfully')
        setSelectedUserIds([])
        fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error || 'Action failed')
      }
    } catch (error) {
      console.error('Bulk action failed:', error)
      alert('Failed to perform bulk action')
    }
  }

  const toggleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([])
    } else {
      setSelectedUserIds(users.map((u) => u.id))
    }
  }

  const toggleSelectUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId))
    } else {
      setSelectedUserIds([...selectedUserIds, userId])
    }
  }

  const selectedUsers = users.filter((u) => selectedUserIds.includes(u.id))

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Users</h1>
          <p className="text-purple-300">Manage all platform users</p>
        </div>
        <ExportButton type="users" selectedIds={selectedUserIds} />
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900 border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <Input
              placeholder="Search by email or name..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="pl-10 bg-slate-800 border-white/10 text-white"
            />
          </div>
          <UserFiltersComponent
            filters={filters}
            onFiltersChange={(newFilters) => {
              setFilters(newFilters)
              setPagination((prev) => ({ ...prev, page: 1 })) // Reset to page 1 when filters change
            }}
            activeCount={activeFilterCount}
          />
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedUserIds.length > 0 && (
        <BulkActionsToolbar
          selectedUsers={selectedUsers}
          onAction={handleBulkAction}
          onCancel={() => setSelectedUserIds([])}
        />
      )}

      {/* Users Table */}
      <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={users.length > 0 && selectedUserIds.length === users.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded bg-slate-800 border-white/10 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
              </TableHead>
              <TableHead className="text-purple-300">User</TableHead>
              <TableHead className="text-purple-300">Role</TableHead>
              <TableHead className="text-purple-300">Credits</TableHead>
              <TableHead className="text-purple-300">Design Systems</TableHead>
              <TableHead className="text-purple-300">Status</TableHead>
              <TableHead className="text-purple-300">Joined</TableHead>
              <TableHead className="text-purple-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-purple-300 py-12">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-purple-300 py-12">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                      className="w-4 h-4 rounded bg-slate-800 border-white/10 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-white">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.firstName || 'No name'}
                      </p>
                      <p className="text-sm text-purple-400">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                      className={
                        user.role === 'ADMIN'
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700 text-purple-300'
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-white font-medium">{user.credits}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-white">{user._count.designSystems}</span>
                  </TableCell>
                  <TableCell>
                    {user.banned ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : (
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-purple-300 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
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
                          onClick={() => handleViewDetails(user)}
                          className="text-white hover:bg-white/5"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditCredits(user)}
                          className="text-white hover:bg-white/5"
                        >
                          <Coins className="w-4 h-4 mr-2" />
                          Edit Credits
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleChangeRole(user.id, user.role)}
                          className="text-white hover:bg-white/5"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          {user.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleBanUser(user.id, user.banned)}
                          className="text-white hover:bg-white/5"
                        >
                          <Ban className="w-4 h-4 mr-2" />
                          {user.banned ? 'Unban User' : 'Ban User'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete User
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
              {pagination.total} users
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

      {/* Modals */}
      {selectedUser && (
        <>
          <UserDetailsModal
            user={selectedUser}
            open={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            onRefresh={fetchUsers}
          />
          <EditCreditsModal
            user={selectedUser}
            open={showCreditsModal}
            onClose={() => setShowCreditsModal(false)}
            onSuccess={fetchUsers}
          />
        </>
      )}
    </div>
  )
}
