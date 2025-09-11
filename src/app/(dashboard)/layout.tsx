import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/server/actions/auth-actions'
import { LogOut } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/auth')
  }

  return (
    <div className="bg-background min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">News Article Summarizer</h1>
              <p className="text-gray-600">
                Welcome back, {data.user.user_metadata.full_name}!
              </p>
            </div>
            <form action={logout}>
              <Button className="bg-white" type="submit" variant="outline">
                Sign Out <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}
