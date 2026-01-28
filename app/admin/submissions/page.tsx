'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Eye, Trash2, Check } from 'lucide-react'

interface Submission {
  id: string
  email: string
  message: string
  category: string
  status: string
  submittedAt: string
  ipAddress?: string
  userAgent?: string
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, new, read, replied

  useEffect(() => {
    fetchSubmissions()
  }, [filter])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`/api/admin/submissions?status=${filter}`)
      const data = await response.json()
      setSubmissions(data.submissions || [])
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const csv = [
      ['ID', 'Email', 'Category', 'Message', 'Status', 'Date'],
      ...submissions.map((s) => [
        s.id,
        s.email,
        s.category,
        s.message.replace(/"/g, '""'),
        s.status,
        new Date(s.submittedAt).toLocaleString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `submissions-${new Date().toISOString()}.csv`
    a.click()
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      fetchSubmissions()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading submissions...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Contact Submissions
              </h1>
              <p className="text-purple-200">
                {submissions.length} total submissions
              </p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2">
          {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-purple-300 hover:bg-white/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div className="container mx-auto px-4 pb-12">
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-purple-300">
              No submissions found
            </div>
          ) : (
            submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white font-semibold text-lg">
                        {submission.email}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          submission.status === 'new'
                            ? 'bg-blue-500/20 text-blue-300'
                            : submission.status === 'read'
                            ? 'bg-purple-500/20 text-purple-300'
                            : submission.status === 'replied'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-slate-500/20 text-slate-300'
                        }`}
                      >
                        {submission.status}
                      </span>
                    </div>
                    <div className="text-purple-300 text-sm">
                      Category: {submission.category} •{' '}
                      {new Date(submission.submittedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(submission.id, 'read')}
                      className="p-2 bg-purple-600/20 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-colors"
                      title="Mark as read"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => updateStatus(submission.id, 'replied')}
                      className="p-2 bg-green-600/20 text-green-300 rounded-lg hover:bg-green-600/30 transition-colors"
                      title="Mark as replied"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-purple-100 whitespace-pre-wrap">
                    {submission.message}
                  </p>
                </div>
                {submission.ipAddress && (
                  <div className="mt-4 text-purple-400 text-xs">
                    IP: {submission.ipAddress}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
