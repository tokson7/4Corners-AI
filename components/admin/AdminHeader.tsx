import { UserButton } from '@clerk/nextjs'
import { getAdminUser } from '@/lib/admin'

export default async function AdminHeader() {
  const user = await getAdminUser()

  return (
    <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-sm font-medium text-purple-300">
            Welcome back
          </h2>
          <p className="text-lg font-semibold text-white">
            {user?.name || user?.email}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* User Button from Clerk */}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}
