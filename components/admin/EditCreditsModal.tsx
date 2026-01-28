'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Label from '@/components/ui/Label'
import { Loader2, Plus, Minus, RotateCcw } from 'lucide-react'

interface EditCreditsModalProps {
  user: {
    id: string
    email: string
    credits: number
  }
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function EditCreditsModal({
  user,
  open,
  onClose,
  onSuccess,
}: EditCreditsModalProps) {
  const [credits, setCredits] = useState(user.credits)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits }),
      })

      if (response.ok) {
        onSuccess()
        onClose()
      }
    } catch (error) {
      console.error('Failed to update credits:', error)
    } finally {
      setLoading(false)
    }
  }

  const adjustCredits = (amount: number) => {
    setCredits(Math.max(0, credits + amount))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Credits</DialogTitle>
          <p className="text-sm text-purple-300 mt-2">{user.email}</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Credits */}
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-sm text-purple-300 mb-1">Current Credits</p>
            <p className="text-3xl font-bold text-white">{user.credits}</p>
          </div>

          {/* New Credits Input */}
          <div className="space-y-2">
            <Label htmlFor="credits" className="text-purple-300">
              New Credit Amount
            </Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => adjustCredits(-10)}
                className="border-white/10 text-white hover:bg-white/5"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                id="credits"
                type="number"
                value={credits}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCredits(parseInt(e.target.value) || 0)}
                className="bg-slate-800 border-white/10 text-white text-center text-xl font-bold"
                min="0"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => adjustCredits(10)}
                className="border-white/10 text-white hover:bg-white/5"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => adjustCredits(5)}
              className="flex-1 border-white/10 text-white hover:bg-white/5"
            >
              +5
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => adjustCredits(10)}
              className="flex-1 border-white/10 text-white hover:bg-white/5"
            >
              +10
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => adjustCredits(50)}
              className="flex-1 border-white/10 text-white hover:bg-white/5"
            >
              +50
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCredits(user.credits)}
              className="border-white/10 text-white hover:bg-white/5"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Change Summary */}
          {credits !== user.credits && (
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <p className="text-sm text-purple-300 mb-1">Change</p>
              <p className={`text-xl font-bold ${credits > user.credits ? 'text-green-400' : 'text-red-400'}`}>
                {credits > user.credits ? '+' : ''}
                {credits - user.credits} credits
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-white/10 text-white hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || credits === user.credits}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
