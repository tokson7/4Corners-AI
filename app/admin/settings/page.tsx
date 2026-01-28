'use client'

import { useState } from 'react'
import { Settings as SettingsIcon, Globe, Mail, Shield, Zap, Save } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Label from '@/components/ui/Label'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    siteName: '4Corners AI',
    defaultCredits: 3,
    maxDesignsPerUser: 100,
    emailNotifications: true,
    newUserNotifications: true,
    designApprovalRequired: false,
    maintenanceMode: false,
    allowSignups: true,
    requireEmailVerification: true,
  })

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    alert('Settings saved successfully!')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-purple-300">Configure platform settings</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">General Settings</h2>
              <p className="text-sm text-purple-300">Basic platform configuration</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="siteName" className="text-purple-300 mb-2">
                Site Name
              </Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
                className="bg-slate-800 border-white/10 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="defaultCredits" className="text-purple-300 mb-2">
                  Default Credits (New Users)
                </Label>
                <Input
                  id="defaultCredits"
                  type="number"
                  value={settings.defaultCredits}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSettings({ ...settings, defaultCredits: parseInt(e.target.value) || 0 })
                  }
                  className="bg-slate-800 border-white/10 text-white"
                />
              </div>

              <div>
                <Label htmlFor="maxDesigns" className="text-purple-300 mb-2">
                  Max Designs per User
                </Label>
                <Input
                  id="maxDesigns"
                  type="number"
                  value={settings.maxDesignsPerUser}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSettings({ ...settings, maxDesignsPerUser: parseInt(e.target.value) || 0 })
                  }
                  className="bg-slate-800 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Email Settings</h2>
              <p className="text-sm text-purple-300">Email notifications and templates</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-sm text-purple-400">Send email notifications to admins</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, emailNotifications: e.target.checked })
                }
                className="w-5 h-5 rounded bg-slate-700 border-white/10 text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
              <div>
                <p className="text-white font-medium">New User Notifications</p>
                <p className="text-sm text-purple-400">Notify when new users sign up</p>
              </div>
              <input
                type="checkbox"
                checked={settings.newUserNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, newUserNotifications: e.target.checked })
                }
                className="w-5 h-5 rounded bg-slate-700 border-white/10 text-purple-600 focus:ring-purple-500"
              />
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Security Settings</h2>
              <p className="text-sm text-purple-300">Access control and moderation</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
              <div>
                <p className="text-white font-medium">Design Approval Required</p>
                <p className="text-sm text-purple-400">Manually approve all new designs</p>
              </div>
              <input
                type="checkbox"
                checked={settings.designApprovalRequired}
                onChange={(e) =>
                  setSettings({ ...settings, designApprovalRequired: e.target.checked })
                }
                className="w-5 h-5 rounded bg-slate-700 border-white/10 text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
              <div>
                <p className="text-white font-medium">Allow New Signups</p>
                <p className="text-sm text-purple-400">Enable user registration</p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowSignups}
                onChange={(e) =>
                  setSettings({ ...settings, allowSignups: e.target.checked })
                }
                className="w-5 h-5 rounded bg-slate-700 border-white/10 text-purple-600 focus:ring-purple-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
              <div>
                <p className="text-white font-medium">Require Email Verification</p>
                <p className="text-sm text-purple-400">Users must verify email to access</p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) =>
                  setSettings({ ...settings, requireEmailVerification: e.target.checked })
                }
                className="w-5 h-5 rounded bg-slate-700 border-white/10 text-purple-600 focus:ring-purple-500"
              />
            </label>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Feature Flags</h2>
              <p className="text-sm text-purple-300">Enable or disable platform features</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
              <div>
                <p className="text-white font-medium">Maintenance Mode</p>
                <p className="text-sm text-purple-400">Disable site for maintenance</p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) =>
                  setSettings({ ...settings, maintenanceMode: e.target.checked })
                }
                className="w-5 h-5 rounded bg-slate-700 border-white/10 text-purple-600 focus:ring-purple-500"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {saving ? (
              <>
                <SettingsIcon className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
