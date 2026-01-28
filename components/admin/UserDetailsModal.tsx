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
import { Loader2, Mail, Calendar, CreditCard, FileText, Shield, Ban } from 'lucide-react'

interface UserDetailsModalProps {
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    role: string
    banned: boolean
    credits: number
    plan: string
    createdAt: string
  }
  open: boolean
  onClose: () => void
  onRefresh: () => void
}

interface UserDetails {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
  banned: boolean
  credits: number
  plan: string
  createdAt: string
  designSystems: Array<{
    id: string
    name: string
    brandDescription: string | null
    createdAt: string
  }>
  _count: {
    designSystems: number
  }
}

export default function UserDetailsModal({
  user,
  open,
  onClose,
  onRefresh,
}: UserDetailsModalProps) {
  const [details, setDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchDetails()
    }
  }, [open, user.id])

  const fetchDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/users/${user.id}`)
      const data = await response.json()
      setDetails(data)
    } catch (error) {
      console.error('Failed to fetch user details:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">User Details</DialogTitle>
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
                  <p className="text-white font-medium">
                    {details.firstName && details.lastName
                      ? `${details.firstName} ${details.lastName}`
                      : details.firstName || 'No name set'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-purple-300 mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-400" />
                    <p className="text-white font-medium">{details.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-purple-300 mb-1">Role</p>
                  <Badge
                    variant={details.role === 'ADMIN' ? 'default' : 'secondary'}
                    className={
                      details.role === 'ADMIN'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-purple-300'
                    }
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {details.role}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-purple-300 mb-1">Status</p>
                  {details.banned ? (
                    <Badge variant="destructive" className="bg-red-600">
                      <Ban className="w-3 h-3 mr-1" />
                      Banned
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      Active
                    </Badge>
                  )}
                </div>

                <div>
                  <p className="text-sm text-purple-300 mb-1">Credits</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <p className="text-white font-medium text-lg">{details.credits}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-purple-300 mb-1">Plan</p>
                  <p className="text-white font-medium capitalize">{details.plan}</p>
                </div>

                <div>
                  <p className="text-sm text-purple-300 mb-1">Member Since</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <p className="text-white">
                      {new Date(details.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-purple-300 mb-1">Design Systems Created</p>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <p className="text-white font-medium text-lg">
                      {details._count.designSystems}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Design Systems */}
            {details.designSystems.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Recent Design Systems
                </h3>
                <div className="space-y-3">
                  {details.designSystems.map((system) => (
                    <div
                      key={system.id}
                      className="bg-slate-700/50 rounded-lg p-4 hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-white mb-1">{system.name}</h4>
                          <p className="text-sm text-purple-300 mb-2 line-clamp-2">
                            {system.brandDescription || 'No description'}
                          </p>
                          <p className="text-xs text-purple-400">
                            {new Date(system.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/dashboard/designs/${system.id}`, '_blank')}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
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
            Failed to load user details
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
