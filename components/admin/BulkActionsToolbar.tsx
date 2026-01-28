'use client'

import { useState } from 'react'
import { Plus, Minus, Shield, ShieldOff, Trash2, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
}

interface BulkActionsToolbarProps {
  selectedUsers: User[]
  onAction: (action: string, value?: number) => Promise<void>
  onCancel: () => void
}

export default function BulkActionsToolbar({
  selectedUsers,
  onAction,
  onCancel,
}: BulkActionsToolbarProps) {
  const [showCreditsModal, setShowCreditsModal] = useState(false)
  const [creditsAction, setCreditsAction] = useState<'add' | 'remove'>('add')
  const [creditsAmount, setCreditsAmount] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleCreditsSubmit = async () => {
    const amount = parseInt(creditsAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive number')
      return
    }

    setLoading(true)
    try {
      await onAction(creditsAction === 'add' ? 'add_credits' : 'remove_credits', amount)
      setShowCreditsModal(false)
      setCreditsAmount('')
    } catch (error) {
      console.error('Credits action failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmAction = async () => {
    setLoading(true)
    try {
      await onAction(confirmAction)
      setShowConfirmModal(false)
    } catch (error) {
      console.error('Bulk action failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const openCreditsModal = (action: 'add' | 'remove') => {
    setCreditsAction(action)
    setShowCreditsModal(true)
  }

  const openConfirmModal = (action: string) => {
    setConfirmAction(action)
    setShowConfirmModal(true)
  }

  const getUserDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    return user.email
  }

  const getActionDetails = () => {
    switch (confirmAction) {
      case 'ban':
        return {
          title: 'Ban Users',
          description: `Are you sure you want to ban ${selectedUsers.length} user(s)?`,
          buttonText: 'Ban Users',
          buttonClass: 'bg-red-600 hover:bg-red-700',
          icon: Shield,
        }
      case 'unban':
        return {
          title: 'Unban Users',
          description: `Are you sure you want to unban ${selectedUsers.length} user(s)?`,
          buttonText: 'Unban Users',
          buttonClass: 'bg-green-600 hover:bg-green-700',
          icon: ShieldOff,
        }
      case 'delete':
        return {
          title: 'Delete Users',
          description: `Are you sure you want to permanently delete ${selectedUsers.length} user(s)? This action cannot be undone.`,
          buttonText: 'Delete Users',
          buttonClass: 'bg-red-600 hover:bg-red-700',
          icon: Trash2,
          warning: true,
        }
      default:
        return {
          title: 'Confirm Action',
          description: 'Are you sure?',
          buttonText: 'Confirm',
          buttonClass: 'bg-purple-600 hover:bg-purple-700',
          icon: Shield,
        }
    }
  }

  const actionDetails = getActionDetails()
  const ActionIcon = actionDetails.icon

  return (
    <>
      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="text-white font-medium">
            {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openCreditsModal('add')}
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Credits
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openCreditsModal('remove')}
              className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
            >
              <Minus className="w-4 h-4 mr-1" />
              Remove Credits
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openConfirmModal('ban')}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <Shield className="w-4 h-4 mr-1" />
              Ban
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openConfirmModal('unban')}
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              <ShieldOff className="w-4 h-4 mr-1" />
              Unban
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openConfirmModal('delete')}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Credits Modal */}
      <Modal
        isOpen={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
        title={creditsAction === 'add' ? 'Add Credits' : 'Remove Credits'}
      >
        <div className="space-y-4">
          <p className="text-purple-300">
            {creditsAction === 'add' ? 'Add' : 'Remove'} credits {creditsAction === 'add' ? 'to' : 'from'}{' '}
            {selectedUsers.length} selected user(s)
          </p>

          <div className="bg-slate-800 rounded-lg p-4 max-h-32 overflow-y-auto">
            <p className="text-xs text-purple-400 mb-2">Selected users:</p>
            {selectedUsers.slice(0, 5).map((user) => (
              <p key={user.id} className="text-sm text-white">
                • {getUserDisplayName(user)}
              </p>
            ))}
            {selectedUsers.length > 5 && (
              <p className="text-sm text-purple-400 mt-1">
                ...and {selectedUsers.length - 5} more
              </p>
            )}
          </div>

          <Input
            type="number"
            label="Credit Amount"
            placeholder="Enter amount"
            value={creditsAmount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreditsAmount(e.target.value)}
            min="1"
          />

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowCreditsModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleCreditsSubmit}
              disabled={loading || !creditsAmount}
              className={
                creditsAction === 'add'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-yellow-600 hover:bg-yellow-700'
              }
            >
              {loading ? 'Processing...' : creditsAction === 'add' ? 'Add Credits' : 'Remove Credits'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={actionDetails.title}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                actionDetails.warning ? 'bg-red-500/10 text-red-400' : 'bg-purple-500/10 text-purple-400'
              }`}
            >
              <ActionIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-white mb-2">{actionDetails.description}</p>
              {actionDetails.warning && (
                <p className="text-red-400 text-sm font-medium">⚠️ This action cannot be undone!</p>
              )}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 max-h-32 overflow-y-auto">
            <p className="text-xs text-purple-400 mb-2">Affected users:</p>
            {selectedUsers.slice(0, 5).map((user) => (
              <p key={user.id} className="text-sm text-white">
                • {getUserDisplayName(user)}
              </p>
            ))}
            {selectedUsers.length > 5 && (
              <p className="text-sm text-purple-400 mt-1">
                ...and {selectedUsers.length - 5} more
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAction} disabled={loading} className={actionDetails.buttonClass}>
              {loading ? 'Processing...' : actionDetails.buttonText}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
