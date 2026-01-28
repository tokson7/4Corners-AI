'use client'

import { useState } from 'react'
import { Send, Users, Loader2, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function AdminEmailsPage() {
  const [recipient, setRecipient] = useState<'all' | 'user'>('all')
  const [selectedUser, setSelectedUser] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    if (!subject || !message) {
      setError('Please fill in subject and message')
      return
    }

    if (recipient === 'user' && !selectedUser) {
      setError('Please select a user')
      return
    }

    setSending(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/admin/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient,
          userId: recipient === 'user' ? selectedUser : undefined,
          subject,
          message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email')
      }

      setSuccess(true)
      setSubject('')
      setMessage('')
      setSelectedUser('')
      
      setTimeout(() => setSuccess(false), 5000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Send Emails</h1>
        <p className="text-purple-300">
          Send custom emails to users
        </p>
      </div>

      <div className="bg-slate-900 border border-white/10 rounded-xl p-8">
        <div className="space-y-6">
          {/* Recipient Selection */}
          <div>
            <label className="text-sm font-medium text-purple-300 mb-3 block">
              Send To
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setRecipient('all')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  recipient === 'all'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <Users className="w-6 h-6 text-purple-400 mb-2 mx-auto" />
                <p className="text-white font-medium">All Users</p>
                <p className="text-purple-300 text-sm mt-1">
                  Send to everyone
                </p>
              </button>

              <button
                onClick={() => setRecipient('user')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  recipient === 'user'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <Send className="w-6 h-6 text-purple-400 mb-2 mx-auto" />
                <p className="text-white font-medium">Specific User</p>
                <p className="text-purple-300 text-sm mt-1">
                  Choose one user
                </p>
              </button>
            </div>
          </div>

          {/* User Selection (if specific user) */}
          {recipient === 'user' && (
            <div>
              <label className="text-sm font-medium text-purple-300 mb-2 block">
                User Email
              </label>
              <input
                type="email"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500"
              />
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="text-sm font-medium text-purple-300 mb-2 block">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject line..."
              className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-purple-300 mb-2 block">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your email message here... (HTML supported)"
              rows={12}
              className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500 font-mono text-sm"
            />
            <p className="text-purple-400 text-sm mt-2">
              💡 You can use HTML tags for formatting
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-400">
                Email sent successfully!
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Send Button */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setSubject('')
                setMessage('')
                setSelectedUser('')
                setError('')
                setSuccess(false)
              }}
            >
              Clear
            </Button>
            <Button
              onClick={handleSend}
              disabled={sending}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Email Templates */}
      <div className="mt-8 bg-slate-900 border border-white/10 rounded-xl p-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setSubject('New Feature Update!')
              setMessage('<h1>Exciting News!</h1><p>We\'ve just released a new feature that you\'ll love...</p>')
            }}
            className="p-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-left transition-colors"
          >
            <p className="text-white font-medium mb-1">Feature Announcement</p>
            <p className="text-purple-300 text-sm">
              Announce new features to users
            </p>
          </button>

          <button
            onClick={() => {
              setSubject('Special Offer - Limited Time!')
              setMessage('<h1>Special Offer Just for You! 🎁</h1><p>Get 50% off all plans for the next 48 hours...</p>')
            }}
            className="p-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-left transition-colors"
          >
            <p className="text-white font-medium mb-1">Special Offer</p>
            <p className="text-purple-300 text-sm">
              Promotional email template
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}
